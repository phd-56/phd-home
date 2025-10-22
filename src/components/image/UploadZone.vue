<template>
  <div class="medical-upload">
    <div class="upload-header">
      <h3>医学影像上传</h3>
      <p class="upload-subtitle">上传医学影像进行AI智能诊断</p>
    </div>

    <div 
      class="upload-area"
      :class="{ 'drag-over': isDragOver, 'has-file': currentFile }"
      @click="handleUploadClick"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <div class="upload-content">
        <div class="upload-icon">
          <el-icon size="48" :color="currentFile ? '#67c23a' : '#409eff'">
            <UploadFilled />
          </el-icon>
        </div>
        
        <div class="upload-text">
          <template v-if="!currentFile">
            <p class="main-text">拖拽医学影像文件到此处</p>
            <p class="sub-text">或点击选择文件</p>
          </template>
          <template v-else>
            <p class="main-text">{{ currentFile.name }}</p>
            <p class="sub-text">文件大小: {{ formatFileSize(currentFile.size) }}</p>
          </template>
        </div>

        <el-button 
          type="primary" 
          size="large"
          @click.stop="handleUploadClick"
        >
          {{ currentFile ? '重新选择' : '选择文件' }}
        </el-button>
      </div>

      <input 
        type="file" 
        ref="fileInput" 
        style="display: none" 
        @change="handleFileChange"
        accept=".dcm,.dicom,.jpg,.jpeg,.png,.nii,.gz"
        multiple
      >
    </div>

    <!-- 文件信息 -->
    <div v-if="currentFile" class="file-info">
      <el-card>
        <template #header>
          <div class="file-header">
            <span>文件信息</span>
            <el-tag :type="getFileTypeColor(currentFile.name)">
              {{ getFileTypeText(currentFile.name) }}
            </el-tag>
          </div>
        </template>
        
        <div class="file-details">
          <div class="detail-item">
            <span class="label">文件名:</span>
            <span class="value">{{ currentFile.name }}</span>
          </div>
          <div class="detail-item">
            <span class="label">文件类型:</span>
            <span class="value">{{ getFileTypeText(currentFile.name) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">文件大小:</span>
            <span class="value">{{ formatFileSize(currentFile.size) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">最后修改:</span>
            <span class="value">{{ formatFileDate(currentFile.lastModified) }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 上传提示 -->
    <div class="upload-tips">
      <h4>支持的文件格式：</h4>
      <div class="format-tags">
        <el-tag type="success">DICOM (.dcm, .dicom)</el-tag>
        <el-tag type="warning">CT扫描数据</el-tag>
        <el-tag type="primary">MRI数据</el-tag>
        <el-tag type="info">JPEG/PNG图像</el-tag>
        <el-tag>NIFTI格式</el-tag>
      </div>
      
      <div class="requirements">
        <el-alert
          title="上传要求"
          type="info"
          :closable="false"
          description="单个文件不超过50MB，建议使用DICOM格式以获得最佳分析效果"
        />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="upload-actions">
      <el-button 
        type="primary" 
        size="large" 
        :disabled="!currentFile"
        @click="handleAnalyze"
        :loading="isAnalyzing"
      >
        <template #icon>
          <el-icon><VideoPlay /></el-icon>
        </template>
        {{ isAnalyzing ? '分析中...' : '开始AI分析' }}
      </el-button>
      
      <el-button 
        v-if="currentFile"
        @click="handleClear"
        size="large"
      >
        <template #icon>
          <el-icon><Delete /></el-icon>
        </template>
        清除文件
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
//import { UploadFilled, VideoPlay, Delete } from '@element-plus/icons-vue'

interface Props {
  onFileSelect?: (file: File) => void
  onAnalyze?: (file: File) => void
}

const props = defineProps<Props>()

const fileInput = ref<HTMLInputElement>()
const currentFile = ref<File | null>(null)
const isDragOver = ref(false)
const isAnalyzing = ref(false)

const handleUploadClick = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    validateAndSetFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    validateAndSetFile(file)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
}

const validateAndSetFile = (file: File) => {
  // 文件大小验证 (50MB)
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过50MB')
    return
  }

  // 文件类型验证
  const allowedExtensions = ['.dcm', '.dicom', '.jpg', '.jpeg', '.png', '.nii', '.gz']
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  
  if (!allowedExtensions.includes(fileExtension || '')) {
    ElMessage.error('不支持的文件格式，请上传医学影像文件')
    return
  }

  currentFile.value = file
  ElMessage.success(`已选择文件: ${file.name}`)
  
  // 触发父组件回调
  if (props.onFileSelect) {
    props.onFileSelect(file)
  }
}

const handleAnalyze = async () => {
  if (!currentFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }

  isAnalyzing.value = true
  
  try {
    if (props.onAnalyze) {
      await props.onAnalyze(currentFile.value)
    } else {
      // 默认分析逻辑
      await new Promise(resolve => setTimeout(resolve, 2000))
      ElMessage.success('AI分析完成')
    }
  } catch (error) {
    ElMessage.error('分析失败，请重试')
  } finally {
    isAnalyzing.value = false
  }
}

const handleClear = () => {
  currentFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  ElMessage.info('已清除文件')
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatFileDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const getFileTypeText = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase()
  const typeMap: { [key: string]: string } = {
    'dcm': 'DICOM影像',
    'dicom': 'DICOM影像',
    'jpg': 'JPEG图像',
    'jpeg': 'JPEG图像',
    'png': 'PNG图像',
    'nii': 'NIFTI数据',
    'gz': '压缩文件'
  }
  return typeMap[extension || ''] || '未知格式'
}

const getFileTypeColor = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase()
  const colorMap: { [key: string]: string } = {
    'dcm': 'success',
    'dicom': 'success',
    'jpg': 'warning',
    'jpeg': 'warning',
    'png': 'primary',
    'nii': 'info',
    'gz': ''
  }
  return colorMap[extension || ''] || 'info'
}
</script>

<style scoped>
.medical-upload {
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.upload-header {
  text-align: center;
  margin-bottom: 24px;
}

.upload-header h3 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.upload-subtitle {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 14px;
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  background: #fafafa;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 24px;
}

.upload-area:hover {
  border-color: #409eff;
  background: #f0f7ff;
}

.upload-area.drag-over {
  border-color: #67c23a;
  background: #f0f9ff;
}

.upload-area.has-file {
  border-color: #67c23a;
  background: #f6ffed;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.upload-text .main-text {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.upload-text .sub-text {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #666;
}

.file-info {
  margin-bottom: 24px;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #333;
}

.upload-tips {
  margin-bottom: 24px;
}

.upload-tips h4 {
  margin: 0 0 12px 0;
  color: #333;
}

.format-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.requirements {
  margin-top: 16px;
}

.upload-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}
</style>