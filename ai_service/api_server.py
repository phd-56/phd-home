# ai_service/api_server.py
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
import tempfile
import os
from PIL import Image
import numpy as np
import shutil
from typing import List, Dict, Any
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor
import pandas as pd

# 导入新的3D分析功能
from musculoskeletal_3d_analyzer import Musculoskeletal3DAnalyzer

app = FastAPI(title="肌肉骨骼AI诊断服务")

# 配置CORS - 允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化3D分析器
analyzer_3d = Musculoskeletal3DAnalyzer()

# 存储批量处理状态
batch_processing_status = {}

def analyze_medical_image(image_path):
    """基于图像特征进行医学影像分析 - 原有功能保持不变"""
    try:
        image = Image.open(image_path)
        width, height = image.size
        
        print(f"分析图像: {width}x{height}")
        
        # 转换为灰度图分析
        if image.mode != 'L':
            image = image.convert('L')
        
        # 图像特征分析
        pixels = np.array(image)
        avg_brightness = np.mean(pixels)
        brightness_std = np.std(pixels)
        
        # 基于医学影像特征的分析逻辑
        if avg_brightness > 200 and brightness_std > 50:
            diagnosis = "骨折可能"
            confidence = 0.78
            severity = "high"
        elif avg_brightness < 100 and brightness_std < 30:
            diagnosis = "骨质疏松可能"
            confidence = 0.72
            severity = "medium"
        elif brightness_std > 60:
            diagnosis = "关节炎可能"
            confidence = 0.65
            severity = "medium"
        else:
            diagnosis = "大致正常"
            confidence = 0.85
            severity = "low"
            
        return diagnosis, confidence, severity
        
    except Exception as e:
        print(f"图像分析错误: {e}")
        return "需要进一步评估", 0.5, "low"

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """接收上传的文件并保存"""
    try:
        # 创建一个临时文件来保存上传的内容
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        # 返回成功信息和文件路径
        return JSONResponse(content={
            "success": True,
            "message": "文件上传成功",
            "file_path": temp_path,
            "file_name": file.filename
        })
    except Exception as e:
        # 如果发生错误，则返回500错误
        raise HTTPException(status_code=500, detail=f"文件上传失败: {str(e)}")

@app.get("/")
async def root():
    return {"message": "肌肉骨骼AI诊断服务运行中", "status": "healthy"}

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """分析上传的医学影像 - 原有功能保持不变"""
    try:
        # 验证文件类型
        allowed_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp']
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="请上传PNG、JPEG或BMP格式的图像文件")
        
        # 创建临时文件
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        try:
            print(f"开始分析文件: {file.filename}")
            
            # 调用AI分析
            diagnosis, confidence, severity = analyze_medical_image(temp_path)
            
            # 生成详细诊断报告
            result = generate_diagnosis_report(diagnosis, confidence, severity)
            
            return JSONResponse(content={
                "success": True,
                "data": result,
                "message": "AI分析完成"
            })
            
        finally:
            # 清理临时文件
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                
    except Exception as e:
        print(f"分析失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"分析失败: {str(e)}")

def generate_diagnosis_report(diagnosis, confidence, severity):
    """生成完整的诊断报告 - 原有功能保持不变"""
    
    # 诊断结果映射
    findings_map = {
        "大致正常": [
            {"region": "全视野", "description": "骨结构完整，骨小梁分布均匀", "characteristic": "normal anatomy"},
            {"region": "关节", "description": "关节间隙正常，关节面光滑", "characteristic": "normal joint space"}
        ],
        "骨折可能": [
            {"region": "骨折区域", "description": "可见线性低密度骨折线", "characteristic": "fracture line"},
            {"region": "骨皮质", "description": "骨皮质连续性中断", "characteristic": "cortical disruption"},
            {"region": "软组织", "description": "周围软组织肿胀", "characteristic": "soft tissue swelling"}
        ],
        "骨质疏松可能": [
            {"region": "骨密度", "description": "骨密度普遍减低", "characteristic": "reduced bone density"},
            {"region": "骨小梁", "description": "骨小梁稀疏变细", "characteristic": "trabecular thinning"},
            {"region": "骨皮质", "description": "骨皮质变薄", "characteristic": "cortical thinning"}
        ],
        "关节炎可能": [
            {"region": "关节间隙", "description": "关节间隙狭窄", "characteristic": "joint space narrowing"},
            {"region": "关节边缘", "description": "骨质增生形成骨赘", "characteristic": "osteophyte formation"},
            {"region": "软骨下骨", "description": "软骨下骨硬化", "characteristic": "subchondral sclerosis"}
        ]
    }
    
    recommendations_map = {
        "大致正常": ["建议定期复查", "保持健康生活方式"],
        "骨折可能": ["立即骨科就诊", "X线复查评估对位情况", "根据骨折类型制定治疗方案"],
        "骨质疏松可能": ["骨密度检查确认", "钙剂和维生素D补充", "预防跌倒"],
        "关节炎可能": ["风湿免疫科就诊", "完善炎症指标检查", "康复理疗"]
    }
    
    clinical_correlation_map = {
        "大致正常": "影像学表现与正常解剖结构一致",
        "骨折可能": "结合外伤史，符合急性骨折表现",
        "骨质疏松可能": "与年龄、激素水平、营养状况等风险因素相关",
        "关节炎可能": "与关节疼痛、肿胀、活动受限等症状相关"
    }
    
    return {
        "diagnosis": diagnosis,
        "confidence": confidence,
        "findings": findings_map.get(diagnosis, [
            {"region": "全视野", "description": "影像学表现需进一步评估", "characteristic": "needs further evaluation"}
        ]),
        "recommendations": recommendations_map.get(diagnosis, ["建议专科就诊进一步评估"]),
        "severity": severity,
        "probabilities": {diagnosis: confidence},
        "regions": [],
        "differential_diagnosis": get_differential_diagnosis(diagnosis),
        "clinical_correlation": clinical_correlation_map.get(diagnosis, "请结合临床症状和实验室检查综合判断")
    }

def get_differential_diagnosis(diagnosis):
    """生成鉴别诊断 - 原有功能保持不变"""
    differential_map = {
        "大致正常": ["正常变异", "技术因素"],
        "骨折可能": ["骨裂", "应力性骨折", "病理性骨折"],
        "骨质疏松可能": ["骨软化症", "甲状旁腺功能亢进", "多发性骨髓瘤"],
        "关节炎可能": ["类风湿关节炎", "骨关节炎", "痛风性关节炎"]
    }
    return differential_map.get(diagnosis, ["需要进一步鉴别"])

@app.get("/api/health")
async def health_check():
    """健康检查端点 - 原有功能保持不变"""
    return {"status": "healthy", "service": "musculoskeletal_ai"}

# ============ 新增的3D和批处理功能 ============

@app.post("/api/analyze-3d")
async def analyze_3d_volume(files: List[UploadFile] = File(...)):
    """3D骨骼分析端点 - 新增功能"""
    try:
        # 创建临时目录存储DICOM文件
        with tempfile.TemporaryDirectory() as temp_dir:
            for file in files:
                if file.filename:
                    # 保存上传的文件
                    file_path = os.path.join(temp_dir, file.filename)
                    with open(file_path, "wb") as buffer:
                        content = await file.read()
                        buffer.write(content)
            
            # 调用3D分析器
            volume = analyzer_3d.load_dicom_series(temp_dir)
            if volume is None:
                raise HTTPException(status_code=400, detail="无法加载DICOM序列")
            
            segmentation = analyzer_3d.segment_bone_tissues(volume)
            abnormalities = analyzer_3d.detect_abnormalities(volume, segmentation)
            
            # 生成3D可视化
            fig = analyzer_3d.create_3d_visualization(volume, segmentation, abnormalities)
            
            # 保存可视化结果
            os.makedirs("results", exist_ok=True)
            viz_filename = f"3d_visualization_{len(batch_processing_status)}.html"
            viz_path = os.path.join("results", viz_filename)
            fig.write_html(viz_path)
            
            response = {
                "status": "success",
                "abnormalities": abnormalities,
                "volume_dimensions": volume.shape,
                "visualization_url": f"/api/download/{viz_filename}",
                "analysis_summary": {
                    "fracture_count": len(abnormalities['fractures']),
                    "bone_volume_fraction": abnormalities['osteoporosis']['bone_volume_fraction'],
                    "trabecular_thickness": abnormalities['osteoporosis']['trabecular_thickness']
                }
            }
            
            return JSONResponse(content=response)
            
    except Exception as e:
        print(f"3D分析失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"3D分析失败: {str(e)}")

@app.post("/api/batch-process")
async def start_batch_processing(background_tasks: BackgroundTasks, studies_directory: str = None):
    """批量处理端点 - 新增功能"""
    try:
        if not studies_directory or not os.path.exists(studies_directory):
            raise HTTPException(status_code=400, detail="无效的研究目录")
        
        # 生成批处理ID
        batch_id = f"batch_{len(batch_processing_status)}_{int(asyncio.get_event_loop().time())}"
        
        # 初始化批处理状态
        batch_processing_status[batch_id] = {
            "status": "processing",
            "progress": 0,
            "total_studies": 0,
            "completed_studies": 0,
            "results_path": None,
            "start_time": asyncio.get_event_loop().time()
        }
        
        # 在后台执行批处理
        background_tasks.add_task(process_batch_studies, batch_id, studies_directory)
        
        return {
            "batch_id": batch_id,
            "status": "processing_started",
            "message": "批量处理已开始",
            "check_status_url": f"/api/batch-status/{batch_id}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"批量处理启动失败: {str(e)}")

async def process_batch_studies(batch_id: str, studies_directory: str):
    """后台处理批量研究"""
    try:
        # 获取所有研究目录
        study_paths = [
            os.path.join(studies_directory, d) 
            for d in os.listdir(studies_directory) 
            if os.path.isdir(os.path.join(studies_directory, d))
        ]
        
        batch_processing_status[batch_id]["total_studies"] = len(study_paths)
        results = []
        
        # 使用线程池并行处理
        with ThreadPoolExecutor(max_workers=4) as executor:
            futures = []
            for study_path in study_paths:
                future = executor.submit(process_single_study, study_path)
                futures.append(future)
            
            # 收集结果并更新进度
            for i, future in enumerate(futures):
                try:
                    result = future.result()
                    if result:
                        results.append(result)
                except Exception as e:
                    print(f"处理研究失败: {e}")
                
                # 更新进度
                batch_processing_status[batch_id]["completed_studies"] = i + 1
                batch_processing_status[batch_id]["progress"] = (i + 1) / len(study_paths) * 100
        
        # 保存结果到CSV
        if results:
            df = pd.DataFrame(results)
            results_filename = f"batch_results_{batch_id}.csv"
            results_path = os.path.join("results", results_filename)
            os.makedirs("results", exist_ok=True)
            df.to_csv(results_path, index=False)
            
            batch_processing_status[batch_id]["results_path"] = results_path
            batch_processing_status[batch_id]["status"] = "completed"
        else:
            batch_processing_status[batch_id]["status"] = "failed"
            
    except Exception as e:
        print(f"批处理失败: {e}")
        batch_processing_status[batch_id]["status"] = "failed"

def process_single_study(study_path: str):
    """处理单个研究"""
    try:
        volume = analyzer_3d.load_dicom_series(study_path)
        if volume is None:
            return None
        
        segmentation = analyzer_3d.segment_bone_tissues(volume)
        abnormalities = analyzer_3d.detect_abnormalities(volume, segmentation)
        
        study_id = os.path.basename(study_path)
        result = {
            'study_id': study_id,
            'volume_shape': volume.shape,
            'fracture_count': len(abnormalities['fractures']),
            'bone_volume_fraction': abnormalities['osteoporosis']['bone_volume_fraction'],
            'trabecular_thickness': abnormalities['osteoporosis']['trabecular_thickness'],
            'trabecular_spacing': abnormalities['osteoporosis']['trabecular_spacing'],
            'trabecular_number': abnormalities['osteoporosis']['trabecular_number']
        }
        
        return result
    except Exception as e:
        print(f"处理研究 {study_path} 失败: {e}")
        return None

@app.get("/api/batch-status/{batch_id}")
async def get_batch_status(batch_id: str):
    """获取批处理状态 - 新增功能"""
    if batch_id not in batch_processing_status:
        raise HTTPException(status_code=404, detail="批处理ID不存在")
    
    status_info = batch_processing_status[batch_id].copy()
    
    # 如果处理完成，添加结果下载链接
    if status_info["status"] == "completed" and status_info["results_path"]:
        status_info["download_url"] = f"/api/download/{os.path.basename(status_info['results_path'])}"
    
    return status_info

@app.get("/api/download/{filename}")
async def download_file(filename: str):
    """文件下载端点 - 新增功能"""
    file_path = os.path.join("results", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="文件不存在")
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/octet-stream'
    )

@app.get("/api/3d-capabilities")
async def get_3d_capabilities():
    """获取3D分析能力信息 - 新增功能"""
    return {
        "supported_formats": ["DICOM系列", "NIfTI", "NRRD"],
        "analysis_features": [
            "骨骼组织分割",
            "骨折检测", 
            "骨质疏松分析",
            "3D可视化生成",
            "批量处理"
        ],
        "output_formats": ["HTML交互式可视化", "CSV报告", "JSON数据"]
    }

if __name__ == "__main__":
    print("🚀 启动肌肉骨骼AI诊断服务...")
    print("📍 服务地址: http://localhost:8000")
    print("📊 健康检查: http://localhost:8000/api/health")
    print("🦴 3D分析: http://localhost:8000/api/analyze-3d")
    print("📦 批量处理: http://localhost:8000/api/batch-process")
    print("⏹️  按 Ctrl+C 停止服务")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")