<template>
  <div class="patient-image-upload">
    <div class="page-header">
      <h1>影像上传</h1>
      <p>上传您的医学影像，获取专业诊断</p>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>上传影像</span>
          <div class="header-info">
            <el-tag type="info">支持JPG、PNG、DCM等格式</el-tag>
          </div>
        </div>
      </template>

      <div class="upload-container">
        <div class="patient-info">
          <h4>患者信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <label>姓名：</label>
              <span>{{ authStore.user?.fullName || '-' }}</span>
            </div>
            <div class="info-item">
              <label>病历号：</label>
              <span class="medical-record">{{ authStore.user?.medicalRecord || '暂无' }}</span>
            </div>
          </div>
        </div>

        <!-- 影像类型选择 -->
        <div class="form-section">
          <el-form label-width="100px">
            <el-form-item label="影像类型">
              <el-select v-model="uploadForm.imageType" placeholder="请选择影像类型" class="full-width">
                <el-option label="X光片" value="xray" />
                <el-option label="CT扫描" value="ct" />
                <el-option label="MRI影像" value="mri" />
                <el-option label="超声影像" value="ultrasound" />
                <el-option label="其他影像" value="other" />
              </el-select>
            </el-form-item>

            <el-form-item label="检查部位">
              <el-input v-model="uploadForm.bodyPart" placeholder="请输入检查部位" class="full-width" />
            </el-form-item>

            <el-form-item label="简要描述">
              <el-input
                v-model="uploadForm.description"
                type="textarea"
                placeholder="请简要描述您的症状或检查目的"
                :rows="3"
                class="full-width"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 影像上传区域 -->
        <div class="upload-section">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            :headers="{ Authorization: `Bearer ${authStore.token}` }"
            :before-upload="beforeUpload"
            :on-change="handleChange"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="fileList"
            :auto-upload="false"
            multiple
            :on-preview="handlePreview"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">
                请上传JPG、PNG、DCM等格式文件，单文件不超过10MB，最多上传10个文件
              </div>
            </template>
          </el-upload>
        </div>

        <!-- 图片预览区域 -->
        <div v-if="previewImages.length > 0" class="preview-section">
          <h4>图片预览</h4>
          <div class="image-grid">
            <div v-for="(image, index) in previewImages" :key="index" class="image-preview-item">
              <img :src="image.url" :alt="image.name" class="preview-image">
              <p class="image-name">{{ image.name }}</p>
            </div>
          </div>
        </div>

        <!-- AI诊断结果区域 -->
        <div v-if="aiDiagnosisResult" class="ai-result-section">
          <div class="section-header">
            <h4>AI初步诊断</h4>
            <el-button type="primary" size="small" @click="saveReportToHistory">
                <el-icon><Plus /></el-icon>
                保存到历史记录
              </el-button>
          </div>
          <el-card>
            <div class="ai-result-content">
              <el-tag type="info" class="result-tag">{{ aiDiagnosisResult.status }}</el-tag>
              <p class="result-title">{{ aiDiagnosisResult.title }}</p>
              <p class="result-description">{{ aiDiagnosisResult.description }}</p>
              <div class="result-details" v-if="aiDiagnosisResult.details">
                <h5>详细分析：</h5>
                <ul>
                  <li v-for="(detail, index) in aiDiagnosisResult.details" :key="index">{{ detail }}</li>
                </ul>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 已选文件列表 -->
        <div v-if="fileList.length > 0" class="selected-files">
          <h4>已选文件（{{ fileList.length }}）</h4>
          <el-scrollbar height="200px">
            <el-table :data="fileList" style="width: 100%">
              <el-table-column label="文件名" min-width="300">
                <template #default="{ row }">
                  <div class="file-info">
                    <el-icon :size="24">
                      <component :is="getFileIcon(row.raw.type)" />
                    </el-icon>
                    <span class="file-name">{{ row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="大小" width="100">
                <template #default="{ row }">
                  {{ formatFileSize(row.size) }}
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag v-if="row.status === 'success'" type="success">成功</el-tag>
                  <el-tag v-else-if="row.status === 'error'" type="danger">失败</el-tag>
                  <el-tag v-else-if="row.status === 'uploading'" type="info">上传中</el-tag>
                  <el-tag v-else type="warning">待上传</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="{ row, $index }">
                  <el-button
                    type="danger"
                    size="small"
                    circle
                    @click="handleRemove($index)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="submitUpload" :disabled="false">
            <el-icon><Upload /></el-icon>
            提交上传
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 上传进度对话框 -->
    <el-dialog v-model="uploadProgressVisible" title="上传进度" width="400px" :show-close="false">
      <div class="progress-content">
        <el-progress :percentage="uploadProgress" status="success" :format="formatProgress" />
        <div class="progress-info">
          <p>当前文件：{{ currentUploadingFile }}</p>
          <p>总进度：{{ uploadedCount }}/{{ totalFileCount }} 个文件</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="cancelUpload" :disabled="uploadProgress === 100">取消上传</el-button>
      </template>
    </el-dialog>

    <!-- 上传成功提示 -->
        <el-dialog v-model="successVisible" title="上传成功" width="400px">
          <div class="success-content">
            <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
            <p>您的影像已成功上传！</p>
            <p class="success-message">系统已收到您的影像，医生将尽快进行诊断。AI初步诊断结果已保存到历史记录中。</p>
          </div>
          <template #footer>
            <el-button @click="successVisible = false">查看我的报告</el-button>
            <el-button type="primary" @click="resetAndBack">继续上传</el-button>
            <el-button @click="goToHistory">查看历史记录</el-button>
            <el-button @click="goBack">返回工作台</el-button>
          </template>
        </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Plus, Upload, Delete, CircleCheckFilled, UploadFilled } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 上传表单
const uploadForm = reactive({
  imageType: '',
  bodyPart: '',
  description: ''
})

// 文件相关
const fileList = ref<Array<any>>([])
const previewImages = ref<Array<{url: string, name: string}>>([])
const aiDiagnosisResult = ref<any>(null)
const uploadUrl = ref('/api/upload/images') // 实际项目中替换为真实的上传接口
const uploadProgressVisible = ref(false)
const uploadProgress = ref(0)
const currentUploadingFile = ref('')
const uploadedCount = ref(0)
const totalFileCount = ref(0)
const successVisible = ref(false)
const uploadAbortController = ref<AbortController | null>(null)

// 计算属性：是否可以上传
const canUpload = computed(() => {
  return (
    fileList.value.length > 0 &&
    fileList.value.every(file => file.status !== 'uploading')
  )
})

// 上传前检查
const beforeUpload = (file: File) => {
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'application/dicom']
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.dcm']
  const isValidType = allowedTypes.includes(file.type)
  const isValidExt = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  
  if (!isValidType && !isValidExt) {
    ElMessage.error('不支持的文件类型，请上传JPG、PNG、DCM格式文件')
    return false
  }
  
  // 检查文件大小
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过10MB')
    return false
  }
  
  // 检查文件数量
  if (fileList.value.length >= 10) {
    ElMessage.error('最多只能上传10个文件')
    return false
  }
  
  return true
}

// 处理文件变化
const handleChange = (file: any, fileList: any[]) => {
  console.log('文件变化:', file.name)
  
  // 更新文件列表
  fileList.value = fileList.map(f => ({
    ...f,
    status: f.status || 'ready'
  }))
  
  // 如果是图片文件，生成预览
  if (file.raw && file.raw.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      // 检查是否已存在相同名称的图片
      const existingIndex = previewImages.value.findIndex(img => img.name === file.name)
      const previewData = {
        url: e.target?.result as string,
        name: file.name
      }
      
      if (existingIndex >= 0) {
        previewImages.value[existingIndex] = previewData
      } else {
        previewImages.value.push(previewData)
      }
      
      // 对图片进行AI诊断分析
      performAIDiagnosis(previewData)
    }
    reader.readAsDataURL(file.raw)
  }
}

// 处理文件上传成功
const handleSuccess = (response: any, file: any) => {
  file.status = 'success'
  uploadedCount.value++
  
  if (uploadedCount.value >= totalFileCount.value) {
    // 全部上传完成
    uploadProgressVisible.value = false
    
    // 保存到历史记录
    saveToHistory()
    
    successVisible.value = true
    ElMessage.success('全部文件上传成功')
  } else {
    // 继续上传下一个文件
    uploadProgress.value = Math.round((uploadedCount.value / totalFileCount.value) * 100)
    uploadNextFile()
  }
}

// 处理文件上传失败
const handleError = (error: any, file: any) => {
  file.status = 'error'
  uploadedCount.value++
  ElMessage.error(`${file.name} 上传失败`)  
  
  if (uploadedCount.value >= totalFileCount.value) {
    uploadProgressVisible.value = false
    ElMessageBox.alert('部分文件上传失败，请重新上传失败的文件', '上传完成', {
      confirmButtonText: '确定',
    })
  } else {
    uploadProgress.value = Math.round((uploadedCount.value / totalFileCount.value) * 100)
    uploadNextFile()
  }
}

// 提交上传
const submitUpload = () => {
  // 如果没有填写影像类型，设置默认值
  if (!uploadForm.imageType) {
    uploadForm.imageType = 'other'
  }
  
  // 如果没有填写检查部位，设置默认值
  if (!uploadForm.bodyPart) {
    uploadForm.bodyPart = '未指定'
  }
  
  // 如果没有选择文件，提示用户
  if (fileList.value.length === 0) {
    ElMessage.warning('请选择要上传的文件')
    return
  }
  
  // 准备上传
  uploadedCount.value = 0
  totalFileCount.value = fileList.value.filter(file => file.status !== 'success').length
  uploadProgress.value = 0
  uploadProgressVisible.value = true
  
  // 开始上传第一个文件
  uploadNextFile()
}

// 上传下一个文件
const uploadNextFile = () => {
  const pendingFile = fileList.value.find(file => file.status !== 'success' && file.status !== 'uploading')
  if (pendingFile) {
    pendingFile.status = 'uploading'
    currentUploadingFile.value = pendingFile.name
    
    // 模拟上传进度
    simulateUpload(pendingFile)
  }
}

// 模拟上传过程（实际项目中应使用真实的上传）
const simulateUpload = (file: any) => {
  let progress = 0
  uploadAbortController.value = new AbortController()
  
  const interval = setInterval(() => {
    // 检查是否被中止
    if (uploadAbortController.value?.signal.aborted) {
      clearInterval(interval)
      return
    }
    
    progress += Math.random() * 20
    if (progress >= 100) {
      progress = 100
      clearInterval(interval)
      handleSuccess({}, file)
    }
    
    uploadProgress.value = Math.round((uploadedCount.value + progress / 100) / totalFileCount.value * 100)
  }, 300)
}

// 取消上传
const cancelUpload = () => {
  if (uploadAbortController.value) {
    uploadAbortController.value.abort()
  }
  uploadProgressVisible.value = false
  ElMessage.info('上传已取消')
}

// 处理图片预览
const handlePreview = (file: any) => {
  console.log('预览文件:', file.name)
}

// 删除文件
const handleRemove = (index: number) => {
  const file = fileList.value[index]
  fileList.value.splice(index, 1)
  
  // 同时从预览列表中移除
  const previewIndex = previewImages.value.findIndex(img => img.name === file.name)
  if (previewIndex >= 0) {
    previewImages.value.splice(previewIndex, 1)
  }
  
  // 如果没有图片了，清除AI诊断结果
  if (previewImages.value.length === 0) {
    aiDiagnosisResult.value = null
  }
}

// 执行AI诊断分析
const performAIDiagnosis = (image: {url: string, name: string}) => {
  console.log('正在进行AI诊断分析:', image.name)
  
  // 模拟AI诊断过程
  setTimeout(() => {
    // 根据文件名进行简单的模拟诊断
    let diagnosis = {
      status: '完成',
      title: '初步诊断结果',
      description: '基于AI算法的初步分析',
      details: [] as string[]
    }
    
    // 根据文件名中的关键词生成模拟诊断结果
    const fileName = image.name.toLowerCase()
    if (fileName.includes('半月板') || fileName.includes('撕裂')) {
      diagnosis.title = '疑似半月板损伤'
      diagnosis.description = 'AI检测到可能存在半月板损伤迹象，建议进一步检查。'
      diagnosis.details = [
        '半月板后角可见不规则高信号影',
        '关节腔少量积液',
        '考虑为半月板撕裂可能',
        '建议结合临床症状进行评估'
      ]
    } else if (fileName.includes('骨折') || fileName.includes('fracture')) {
      diagnosis.title = '疑似骨折'
      diagnosis.description = 'AI检测到可能存在骨折迹象，需要专业医生确认。'
      diagnosis.details = [
        '骨皮质连续性中断',
        '可见骨折线影',
        '周围软组织肿胀',
        '建议固定制动，避免负重'
      ]
    } else {
      diagnosis.title = '正常影像表现'
      diagnosis.description = 'AI未检测到明显异常，建议定期复查。'
      diagnosis.details = [
        '骨骼结构完整',
        '关节间隙正常',
        '软组织未见明显异常',
        '建议结合临床症状综合评估'
      ]
    }
    
    aiDiagnosisResult.value = diagnosis
  }, 1500)
}

// 重置表单
const resetForm = () => {
  uploadForm.imageType = ''
  uploadForm.bodyPart = ''
  uploadForm.description = ''
  fileList.value = []
  previewImages.value = []
  aiDiagnosisResult.value = null
}

// 保存到历史记录
const saveToHistory = () => {
  try {
    // 获取已有的历史记录
    let historyRecords = JSON.parse(localStorage.getItem('patientImageHistory') || '[]')
    
    // 创建新的历史记录
    const newRecord = {
      uploadTime: new Date().toISOString(),
      imageType: uploadForm.imageType,
      bodyPart: uploadForm.bodyPart,
      description: uploadForm.description,
      images: previewImages.value,
      aiResult: aiDiagnosisResult.value
    }
    
    // 添加到历史记录
    historyRecords.push(newRecord)
    
    // 保存到本地存储
    localStorage.setItem('patientImageHistory', JSON.stringify(historyRecords))
    
    console.log('保存到历史记录成功')
  } catch (error) {
    console.error('保存到历史记录失败:', error)
  }
}

// 重置并返回
const resetAndBack = () => {
  resetForm()
  successVisible.value = false
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB'
  else return (bytes / 1048576).toFixed(2) + ' MB'
}

// 格式化进度显示
const formatProgress = (percentage: number) => {
  return `${percentage}%`
}

// 获取文件图标
const getFileIcon = (type: string) => {
  if (type.includes('image')) return Picture
  if (type.includes('pdf')) return Document
  // 移除Video图标，所有类型都使用Document
  return Document // 默认使用Document图标
}

// 返回患者工作台
const goBack = () => {
  router.push('/dashboard/patient')
}

// 跳转到历史影像页面
const goToHistory = () => {
  router.push('/dashboard/patient/image-history')
}

// 直接保存AI报告到历史记录
const saveReportToHistory = () => {
  // 如果没有填写影像类型，设置默认值
  if (!uploadForm.imageType) {
    uploadForm.imageType = 'other'
  }
  
  // 如果没有填写检查部位，设置默认值
  if (!uploadForm.bodyPart) {
    uploadForm.bodyPart = '未指定'
  }
  
  // 保存到历史记录
  saveToHistory()
  
  // 显示保存成功提示
  ElMessage.success('诊断报告已保存到历史记录')
  
  // 询问是否跳转到历史记录页面
  ElMessageBox.confirm(
    '是否查看历史记录？',
    '保存成功',
    {
      confirmButtonText: '查看历史',
      cancelButtonText: '留在当前页面',
      type: 'success'
    }
  ).then(() => {
    goToHistory()
  }).catch(() => {
    // 留在当前页面
  })
}
</script>

<style scoped>
.patient-image-upload {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  color: #1890ff;
  margin-bottom: 8px;
}

.page-header p {
  color: #666;
  margin: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-container {
  padding: 20px 0;
}

.patient-info {
    padding: 15px;
    background: #f5f7fa;
    border-radius: 8px;
    margin-bottom: 25px;
  }
  
  .preview-section {
    margin-top: 30px;
  }
  
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 10px;
  }
  
  .image-preview-item {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
  }
  
  .preview-image {
    max-width: 100%;
    max-height: 150px;
    object-fit: contain;
    border-radius: 4px;
  }
  
  .image-name {
    margin-top: 8px;
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .ai-result-section {
  margin-top: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
  
  .ai-result-content {
    line-height: 1.6;
  }
  
  .result-tag {
    margin-bottom: 10px;
  }
  
  .result-title {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 10px;
  }
  
  .result-description {
    color: #606266;
    margin-bottom: 15px;
  }
  
  .result-details {
    color: #606266;
  }
  
  .result-details h5 {
    margin-bottom: 8px;
    color: #303133;
  }
  
  .result-details ul {
    margin: 0;
    padding-left: 20px;
  }
  
  .result-details li {
    margin-bottom: 5px;
  }

.patient-info h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item label {
  font-weight: 500;
  margin-right: 10px;
  color: #666;
}

.medical-record {
  font-weight: 600;
  color: #1890ff;
}

.form-section {
  margin-bottom: 30px;
}

.full-width {
  width: 100%;
}

.upload-section {
  margin-bottom: 30px;
}

.upload-section .el-upload-dragger {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-files {
  margin-bottom: 30px;
}

.selected-files h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

/* 上传进度对话框 */
.progress-content {
  padding: 10px 0;
}

.progress-info {
  margin-top: 20px;
  color: #666;
  text-align: center;
}

.progress-info p {
  margin: 5px 0;
}

/* 成功提示对话框 */
.success-content {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 60px;
  color: #67c23a;
  margin-bottom: 20px;
}

.success-message {
  color: #666;
  font-size: 14px;
  margin-top: 10px;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .patient-image-upload {
    padding: 10px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .file-name {
    max-width: 150px;
  }
}
</style>