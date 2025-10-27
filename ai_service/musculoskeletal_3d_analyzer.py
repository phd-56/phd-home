import numpy as np
import pydicom
import itk
import plotly.graph_objects as go
from skimage import measure, segmentation
import cv2
import os
from typing import List, Dict, Any

class Musculoskeletal3DAnalyzer:
    """骨骼系统3D分析器"""
    
    def __init__(self):
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
            # 回退到简单的DICOM加载
            return self._load_dicom_fallback(directory_path)
    
    def _load_dicom_fallback(self, directory_path: str) -> np.ndarray:
        """简单的DICOM加载回退方案"""
        try:
            dicom_files = [f for f in os.listdir(directory_path) if f.endswith('.dcm')]
            dicom_files.sort()
            
            slices = []
            for filename in dicom_files:
                filepath = os.path.join(directory_path, filename)
                dicom_data = pydicom.dcmread(filepath)
                slices.append(dicom_data.pixel_array)
            
            return np.stack(slices)
        except Exception as e:
            print(f"回退DICOM加载也失败: {e}")
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
        
        return segmentation_results
    
    def _enhance_bone_contrast(self, volume: np.ndarray) -> np.ndarray:
        """增强骨骼对比度"""
        # 确保数据在0-255范围内
        volume_normalized = ((volume - volume.min()) / (volume.max() - volume.min()) * 255).astype(np.uint8)
        
        enhanced = np.zeros_like(volume_normalized)
        for i in range(volume_normalized.shape[0]):
            slice_2d = volume_normalized[i]
            # 直方图均衡化
            enhanced[i] = cv2.equalizeHist(slice_2d)
        
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
        
        return abnormalities
    
    def _detect_fractures(self, volume: np.ndarray, cortical_bone: np.ndarray) -> List[Dict]:
        """骨折检测"""
        fractures = []
        
        try:
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
        except Exception as e:
            print(f"骨折检测失败: {e}")
        
        return fractures
    
    def _analyze_osteoporosis(self, trabecular_bone: np.ndarray) -> Dict[str, float]:
        """骨质疏松分析"""
        try:
            # 计算骨小梁参数
            bone_volume = np.sum(trabecular_bone)
            total_volume = trabecular_bone.size
            bone_volume_fraction = bone_volume / total_volume
            
            # 简化的骨小梁分析
            thickness_metrics = self._calculate_trabecular_metrics(trabecular_bone)
            
            return {
                'bone_volume_fraction': float(bone_volume_fraction),
                'trabecular_thickness': float(thickness_metrics['mean_thickness']),
                'trabecular_spacing': float(thickness_metrics['mean_spacing']),
                'trabecular_number': float(thickness_metrics['trabecular_number'])
            }
        except Exception as e:
            print(f"骨质疏松分析失败: {e}")
            return {
                'bone_volume_fraction': 0.0,
                'trabecular_thickness': 0.0,
                'trabecular_spacing': 0.0,
                'trabecular_number': 0.0
            }
    
    def _calculate_trabecular_metrics(self, trabecular_bone: np.ndarray) -> Dict[str, float]:
        """计算骨小梁指标"""
        # 简化的骨小梁分析
        try:
            # 使用距离变换估计厚度
            from scipy import ndimage
            distance_map = ndimage.distance_transform_edt(trabecular_bone)
            mean_thickness = np.mean(distance_map[trabecular_bone > 0]) if np.any(trabecular_bone) else 0
            
            # 估算间距和数量
            spacing = 1.0 / (mean_thickness + 1e-6)  # 防止除零
            number = np.sum(trabecular_bone) / (trabecular_bone.size + 1e-6)
            
            return {
                'mean_thickness': mean_thickness,
                'mean_spacing': spacing,
                'trabecular_number': number
            }
        except:
            return {
                'mean_thickness': 0.0,
                'mean_spacing': 0.0,
                'trabecular_number': 0.0
            }
    
    def create_3d_visualization(self, volume_data: np.ndarray, 
                              segmentation_results: Dict,
                              abnormalities: Dict) -> go.Figure:
        """创建交互式3D可视化"""
        try:
            fig = go.Figure()
            
            # 添加骨骼表面 - 使用简化的方法
            if np.any(segmentation_results['cortical_bone']):
                # 下采样以提高性能
                downsampled_bone = segmentation_results['cortical_bone'][::2, ::2, ::2]
                
                # 使用 marching cubes 提取表面
                try:
                    vertices, faces, _, _ = measure.marching_cubes(
                        downsampled_bone, level=0.5
                    )
                    
                    # 调整坐标以匹配下采样
                    vertices = vertices * 2
                    
                    fig.add_trace(go.Mesh3d(
                        x=vertices[:, 0], y=vertices[:, 1], z=vertices[:, 2],
                        i=faces[:, 0], j=faces[:, 1], k=faces[:, 2],
                        color='lightgray', opacity=0.6, name='骨骼结构'
                    ))
                except Exception as e:
                    print(f"3D网格生成失败: {e}")
                    # 使用点云作为回退
                    self._add_point_cloud_fallback(fig, segmentation_results['cortical_bone'])
            
            # 添加骨折位置标记
            for fracture in abnormalities['fractures']:
                fig.add_trace(go.Scatter3d(
                    x=[fracture['location'][0]],
                    y=[fracture['location'][1]], 
                    z=[fracture['location'][2]],
                    mode='markers',
                    marker=dict(size=8, color='red'),
                    name='骨折点'
                ))
            
            fig.update_layout(
                title='3D骨骼结构可视化',
                scene=dict(
                    xaxis_title='X',
                    yaxis_title='Y', 
                    zaxis_title='Z',
                    aspectmode='data'
                ),
                height=600
            )
            
            return fig
            
        except Exception as e:
            print(f"3D可视化创建失败: {e}")
            # 返回一个简单的空图表作为回退
            return self._create_fallback_visualization()
    
    def _add_point_cloud_fallback(self, fig: go.Figure, bone_mask: np.ndarray):
        """点云回退方案"""
        try:
            # 随机采样点云
            points = np.argwhere(bone_mask)
            if len(points) > 1000:  # 限制点数
                indices = np.random.choice(len(points), 1000, replace=False)
                points = points[indices]
            
            fig.add_trace(go.Scatter3d(
                x=points[:, 0], y=points[:, 1], z=points[:, 2],
                mode='markers',
                marker=dict(size=2, color='lightgray', opacity=0.6),
                name='骨骼点云'
            ))
        except:
            pass
    
    def _create_fallback_visualization(self) -> go.Figure:
        """创建回退可视化"""
        fig = go.Figure()
        fig.add_trace(go.Scatter3d(
            x=[0], y=[0], z=[0],
            mode='markers',
            marker=dict(size=1, color='white')
        ))
        fig.update_layout(
            title='3D可视化生成失败',
            scene=dict(
                xaxis_title='X',
                yaxis_title='Y',
                zaxis_title='Z',
                bgcolor='black'
            ),
            height=400
        )
        return fig