<template>
  <div class="image-upload-page">
    <div class="diagnosis-header">
      <h1>YOLO肌肉骨骼智能诊断系统</h1>
      <div class="system-status">
        <span>YOLO引擎: 就绪</span>
        <span class="version">版本: Ultimate v3.0</span>
      </div>
    </div>

    <div class="upload-section">
      <h2>上传医学影像</h2>
      <div class="upload-zone">
        <el-upload
          class="upload-demo"
          drag
          action="/api/upload"
          multiple
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将肌肉骨骼影像拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持格式: JPEG, PNG, DICOM • YOLOv8医学专用模型
            </div>
          </template>
        </el-upload>
      </div>

      <div class="ai-process">
        <h3>YOLO深度学习</h3>
        <p>基于YOLOv8医学专用模型的智能诊断分析</p>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-section">
      <el-progress type="circle" :percentage="progress" />
      <p>AI正在分析影像数据...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
//import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const progress = ref(0)

const beforeUpload = (file: File) => {
  const isValidType = ['image/jpeg', 'image/png', 'application/dicom'].includes(file.type)
  const isValidSize = file.size / 1024 / 1024 < 50
  
  if (!isValidType) {
    ElMessage.error('只支持 JPEG, PNG, DICOM 格式的文件!')
    return false
  }
  if (!isValidSize) {
    ElMessage.error('文件大小不能超过 50MB!')
    return false
  }
  
  loading.value = true
  simulateProgress()
  return true
}

const handleSuccess = (response: any) => {
  setTimeout(() => {
    loading.value = false
    // 跳转到诊断结果页面，传递上传的文件信息
    router.push({
      name: 'DiagnosisResult',
      query: {
        fileId: response.fileId,
        fileName: response.fileName
      }
    })
  }, 2000)
}

const handleError = (error: Error) => {
  loading.value = false
  ElMessage.error('上传失败: ' + error.message)
}

const simulateProgress = () => {
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += Math.random() * 10
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(timer)
    }
  }, 200)
}
</script>

<style scoped>
.image-upload-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.diagnosis-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
}

.diagnosis-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
}

.system-status {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 14px;
}

.version {
  font-weight: bold;
}

.upload-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.upload-section h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.upload-zone {
  margin-bottom: 30px;
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 200px;
  border: 2px dashed #409eff;
}

:deep(.el-upload-dragger:hover) {
  border-color: #67c23a;
}

.ai-process {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.ai-process h3 {
  color: #409eff;
  margin-bottom: 10px;
}

.loading-section {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

:deep(.el-progress-circle) {
  margin-bottom: 20px;
}
</style>