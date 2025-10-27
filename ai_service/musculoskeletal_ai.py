import numpy as np
import pydicom
import nibabel as nib
import itk
import vtk
from vtk.util import numpy_support
import plotly.graph_objects as go
from skimage import measure, segmentation
import cv2
import os
import json
from typing import List, Dict, Any
import pandas as pd
from batch_processing import BatchProcessor
import threading
from concurrent.futures import ThreadPoolExecutor

class Musculoskeletal3DAnalyzer:
    """骨骼系统3D分析与批处理引擎"""
    
    def __init__(self):
        self.batch_processor = BatchProcessor(max_workers=4)
        self.analysis_results = {}
        
    def load_dicom_series(self, directory_path: str) -> np.ndarray:
        """加载DICOM序列为3D体积数据"""
        try:
            # 使用ITK加载DICOM序列
            reader = itk.ImageSeriesReader.New()
            dicom_names = itk.GDCMSeriesFileNames.New()
            dicom_names.SetDirectory(directory_path)
            reader.SetFileNames(dicom_names.GetFileNames())
            reader.Update()
            image = reader.GetOutput()
            
            # 转换为numpy数组
            array = itk.GetArrayViewFromImage(image)
            return array
        except Exception as e:
            print(f"加载DICOM序列失败: {e}")
            return None
    
    def segment_bone_tissues(self, volume_data: np.ndarray) -> Dict[str, np.ndarray]:
        """骨骼组织分割"""
        # 预处理 - 骨骼增强
        enhanced_volume = self._enhance_bone_contrast(volume_data)
        
        # 多组织分割
        segmentation_results = {}
        
        # 皮质骨分割 (高密度)
        cortical_bone = enhanced_volume > 800
        segmentation_results['cortical_bone'] = cortical_bone.astype(np.uint8)
        
        # 松质骨分割 (中等密度)
        trabecular_bone = (enhanced_volume > 300) & (enhanced_volume <= 800)
        segmentation_results['trabecular_bone'] = trabecular_bone.astype(np.uint8)
        
        # 骨髓分割 (低密度)
        bone_marrow = (enhanced_volume > 50) & (enhanced_volume <= 300)
        segmentation_results['bone_marrow'] = bone_marrow.astype(np.uint8)
        
        return segmentation_results
    
    def _enhance_bone_contrast(self, volume: np.ndarray) -> np.ndarray:
        """增强骨骼对比度"""
        # 直方图均衡化
        enhanced = np.zeros_like(volume)
        for i in range(volume.shape[0]):
            slice_2d = volume[i]
            enhanced[i] = cv2.equalizeHist(slice_2d.astype(np.uint8))
        
        # 高斯滤波去噪
        enhanced = cv2.GaussianBlur(enhanced, (3, 3), 0)
        
        return enhanced
    
    def detect_abnormalities(self, volume_data: np.ndarray, 
                           segmentation_results: Dict) -> Dict[str, Any]:
        """检测骨骼异常"""
        abnormalities = {
            'fractures': [],
            'osteoporosis': {},
            'bone_lesions': [],
            'joint_degeneration': {}
        }
        
        # 骨折检测
        fractures = self._detect_fractures(volume_data, segmentation_results['cortical_bone'])
        abnormalities['fractures'] = fractures
        
        # 骨质疏松分析
        osteoporosis_metrics = self._analyze_osteoporosis(segmentation_results['trabecular_bone'])
        abnormalities['osteoporosis'] = osteoporosis_metrics
        
        # 骨病变检测
        lesions = self._detect_bone_lesions(volume_data)
        abnormalities['bone_lesions'] = lesions
        
        return abnormalities
    
    def _detect_fractures(self, volume: np.ndarray, cortical_bone: np.ndarray) -> List[Dict]:
        """骨折检测"""
        fractures = []
        
        # 使用边缘检测和形态学分析
        edges = np.zeros_like(cortical_bone)
        for i in range(cortical_bone.shape[0]):
            slice_edges = cv2.Canny(cortical_bone[i].astype(np.uint8), 50, 150)
            edges[i] = slice_edges
        
        # 查找不连续区域作为潜在骨折
        labeled_volume = measure.label(edges > 0)
        regions = measure.regionprops(labeled_volume)
        
        for region in regions:
            if region.area > 10:  # 过滤小区域
                fracture = {
                    'location': region.centroid,
                    'size': region.area,
                    'bbox': region.bbox
                }
                fractures.append(fracture)
        
        return fractures
    
    def _analyze_osteoporosis(self, trabecular_bone: np.ndarray) -> Dict[str, float]:
        """骨质疏松分析"""
        # 计算骨小梁参数
        bone_volume = np.sum(trabecular_bone)
        total_volume = trabecular_bone.size
        bone_volume_fraction = bone_volume / total_volume
        
        # 计算骨小梁厚度和间距
        thickness_metrics = self._calculate_trabecular_thickness(trabecular_bone)
        
        return {
            'bone_volume_fraction': bone_volume_fraction,
            'trabecular_thickness': thickness_metrics['mean_thickness'],
            'trabecular_spacing': thickness_metrics['mean_spacing'],
            'trabecular_number': thickness_metrics['trabecular_number']
        }
    
    def create_3d_visualization(self, volume_data: np.ndarray, 
                              segmentation_results: Dict,
                              abnormalities: Dict) -> go.Figure:
        """创建交互式3D可视化"""
        fig = go.Figure()
        
        # 添加骨骼表面
        vertices, faces, _, _ = measure.marching_cubes(
            segmentation_results['cortical_bone'], level=0.5
        )
        
        fig.add_trace(go.Mesh3d(
            x=vertices[:, 0], y=vertices[:, 1], z=vertices[:, 2],
            i=faces[:, 0], j=faces[:, 1], k=faces[:, 2],
            color='lightgray', opacity=0.6, name='Cortical Bone'
        ))
        
        # 添加骨折位置标记
        for fracture in abnormalities['fractures']:
            fig.add_trace(go.Scatter3d(
                x=[fracture['location'][0]],
                y=[fracture['location'][1]],
                z=[fracture['location'][2]],
                mode='markers',
                marker=dict(size=5, color='red'),
                name='Fracture'
            ))
        
        fig.update_layout(
            title='3D骨骼结构可视化',
            scene=dict(
                xaxis_title='X',
                yaxis_title='Y',
                zaxis_title='Z',
                aspectmode='data'
            )
        )
        
        return fig
    
    def batch_process_studies(self, studies_directory: str) -> pd.DataFrame:
        """批量处理多个研究"""
        results = []
        
        def process_single_study(study_path: str):
            """处理单个研究"""
            try:
                volume = self.load_dicom_series(study_path)
                if volume is None:
                    return None
                
                segmentation = self.segment_bone_tissues(volume)
                abnormalities = self.detect_abnormalities(volume, segmentation)
                
                study_id = os.path.basename(study_path)
                result = {
                    'study_id': study_id,
                    'volume_shape': volume.shape,
                    'fracture_count': len(abnormalities['fractures']),
                    'bone_volume_fraction': abnormalities['osteoporosis']['bone_volume_fraction'],
                    'trabecular_thickness': abnormalities['osteoporosis']['trabecular_thickness'],
                    'abnormalities': abnormalities
                }
                
                # 生成3D可视化
                fig = self.create_3d_visualization(volume, segmentation, abnormalities)
                viz_path = f"results/{study_id}_3d.html"
                fig.write_html(viz_path)
                
                return result
            except Exception as e:
                print(f"处理研究 {study_path} 失败: {e}")
                return None
        
        # 获取所有研究目录
        study_paths = [
            os.path.join(studies_directory, d) 
            for d in os.listdir(studies_directory) 
            if os.path.isdir(os.path.join(studies_directory, d))
        ]
        
        # 并行处理
        with ThreadPoolExecutor(max_workers=4) as executor:
            results = list(executor.map(process_single_study, study_paths))
        
        # 过滤失败的结果
        valid_results = [r for r in results if r is not None]
        
        # 转换为DataFrame
        df = pd.DataFrame(valid_results)
        return df

# 全局分析器实例
analyzer = Musculoskeletal3DAnalyzer()