<template>
  <div class="upload-page">
    <!-- 简单的导航栏 -->
    <div class="simple-navbar">
      <div class="nav-content">
        <div class="nav-left">
          <div class="logo">
            <span class="logo-icon">🩻</span>
            <span class="logo-text">医学影像处理系统</span>
          </div>
        </div>
        <div class="nav-right">
          <el-button @click="goToDashboard">
            <el-icon><HomeFilled /></el-icon>
            返回工作台
          </el-button>
          <el-button type="primary" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="upload-main-content">
      <div class="upload-hero">
        <h1 class="hero-title">医学影像上传与分析</h1>
        <p class="hero-description">上传您的医学影像文件，体验AI智能诊断的强大功能</p>
      </div>

      <el-card class="upload-main-card" shadow="hover">
        <!-- 保持你原有的上传界面内容不变 -->
        <div class="upload-content">
          <el-row :gutter="40">
            <!-- 左侧上传区域 -->
            <el-col :xs="24" :lg="16">
              <div class="upload-section">
                <el-upload
                  class="upload-area"
                  drag
                  action="#"
                  multiple
                  :auto-upload="false"
                  :on-change="handleFileChange"
                  :before-upload="beforeUpload"
                  :file-list="fileList"
                  accept=".dcm,.nii,.nii.gz,.jpg,.jpeg,.png,.dicom"
                >
                  <div class="upload-dropzone">
                    <el-icon class="upload-icon"><UploadFilled /></el-icon>
                    <div class="upload-text">
                      <div class="main-text">拖拽文件到此处或点击上传</div>
                      <div class="sub-text">支持 DICOM、NIfTI、JPEG、PNG 格式</div>
                    </div>
                  </div>
                  
                  <template #tip>
                    <div class="upload-tips">
                      <div class="tips-title">📋 支持的文件格式：</div>
                      <div class="tips-grid">
                        <div class="tip-item" v-for="format in supportedFormats" :key="format.type">
                          <span class="format-icon">{{ format.icon }}</span>
                          <span class="format-name">{{ format.name }}</span>
                          <span class="format-ext">({{ format.extensions }})</span>
                        </div>
                      </div>
                      <div class="size-limit">单个文件大小不超过 50MB</div>
                    </div>
                  </template>
                </el-upload>

                <!-- 文件列表 -->
                <div class="file-list-section" v-if="fileList.length > 0">
                  <div class="section-header">
                    <h3>已选择文件 ({{ fileList.length }})</h3>
                    <el-button type="text" @click="clearAllFiles" :disabled="isAnalyzing">
                      <el-icon><Delete /></el-icon>
                      清空全部
                    </el-button>
                  </div>
                  <el-table 
                    :data="fileList" 
                    style="width: 100%"
                    :loading="isAnalyzing"
                  >
                    <el-table-column label="文件名" min-width="200">
                      <template #default="{ row }">
                        <div class="file-name">
                          <el-icon class="file-icon">
                            <Picture v-if="isImageFile(row.name)" />
                            <Document v-else />
                          </el-icon>
                          {{ row.name }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="size" label="大小" width="100" />
                    <el-table-column prop="type" label="类型" width="120">
                      <template #default="{ row }">
                        <el-tag :type="getFileTypeTag(row.name)">
                          {{ getFileType(row.name) }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                      <template #default="{ row }">
                        <el-tag v-if="row.status === 'success'" type="success">就绪</el-tag>
                        <el-tag v-else type="danger">无效</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                      <template #default="{ $index }">
                        <el-button
                          size="small"
                          type="danger"
                          text
                          :disabled="isAnalyzing"
                          @click="removeFile($index)"
                        >
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-col>

            <!-- 右侧分析设置 -->
            <el-col :xs="24" :lg="8">
              <div class="analysis-section">
                <div class="analysis-panel">
                  <div class="panel-header">
                    <h3>🛠️ 分析设置</h3>
                    <el-tag type="primary" v-if="fileList.length > 0">
                      {{ fileList.length }} 个文件待分析
                    </el-tag>
                  </div>
                  
                  <el-divider></el-divider>
                  
                  <div class="setting-group">
                    <div class="setting-item">
                      <label class="setting-label">
                        <el-icon><Monitor /></el-icon>
                        诊断类型
                      </label>
                      <el-select 
                        v-model="diagnosisType" 
                        placeholder="选择诊断类型"
                        class="setting-control"
                      >
                        <el-option label="骨折检测" value="fracture" />
                        <el-option label="关节炎分析" value="arthritis" />
                        <el-option label="骨质疏松评估" value="osteoporosis" />
                        <el-option label="肿瘤筛查" value="tumor" />
                        <el-option label="全面诊断" value="comprehensive" />
                      </el-select>
                    </div>

                    <div class="setting-item">
                      <label class="setting-label">
                        <el-icon><Setting /></el-icon>
                        分析精度
                      </label>
                      <el-radio-group v-model="analysisPrecision" class="setting-control">
                        <el-radio label="standard">标准模式</el-radio>
                        <el-radio label="high">高精度模式</el-radio>
                      </el-radio-group>
                    </div>

                    <div class="setting-item">
                      <label class="setting-label">
                        <el-icon><Document /></el-icon>
                        报告生成
                      </label>
                      <div class="setting-control">
                        <el-switch v-model="generateReport" />
                        <span class="switch-label">{{ generateReport ? '开启' : '关闭' }}</span>
                      </div>
                    </div>

                    <div class="setting-item">
                      <label class="setting-label">
                        <el-icon><View /></el-icon>
                        三维重建
                      </label>
                      <div class="setting-control">
                        <el-switch v-model="enable3DReconstruction" />
                        <span class="switch-label">{{ enable3DReconstruction ? '开启' : '关闭' }}</span>
                      </div>
                    </div>
                  </div>

                  <el-divider></el-divider>

                  <div class="analysis-summary">
                    <div class="summary-item">
                      <span class="label">预计分析时间：</span>
                      <span class="value">{{ estimatedTime }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="label">文件总数：</span>
                      <span class="value">{{ fileList.length }} 个</span>
                    </div>
                  </div>

                  <el-button 
                    type="primary" 
                    size="large" 
                    :disabled="fileList.length === 0 || isAnalyzing"
                    :loading="isAnalyzing"
                    class="analyze-button"
                    @click="startAnalysis"
                  >
                    <template #loading>
                      <el-icon class="is-loading"><Loading /></el-icon>
                      分析中...
                    </template>
                    <template v-if="!isAnalyzing">
                      <el-icon><Magic /></el-icon>
                      🎯 开始智能分析
                    </template>
                  </el-button>
                </div>

                <!-- 快速提示 -->
                <div class="quick-tips">
                  <h4>💡 使用提示</h4>
                  <ul>
                    <li>确保影像文件清晰无模糊</li>
                    <li>DICOM 文件包含完整的元数据</li>
                    <li>建议上传同一患者的系列影像</li>
                    <li>高精度模式需要更长的处理时间</li>
                  </ul>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
// import {
//   UploadFilled,
//   HomeFilled,
//   Delete,
//   Picture,
//   Document,
//   Monitor,
//   Setting,
//   View,
//   Loading,
//   SwitchButton
// } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

interface UploadFile {
  name: string
  size: string
  raw: File
  type: string
  status: 'success' | 'error'
}

// 响应式数据
const fileList = ref<UploadFile[]>([])
const diagnosisType = ref('fracture')
const analysisPrecision = ref('standard')
const generateReport = ref(true)
const enable3DReconstruction = ref(false)
const isAnalyzing = ref(false)

// 支持的文件格式
const supportedFormats = ref([
  { 
    type: 'dicom',
    icon: '🩻', 
    name: 'DICOM', 
    extensions: '.dcm, .dicom' 
  },
  { 
    type: 'nifti',
    icon: '📊', 
    name: 'NIfTI', 
    extensions: '.nii, .nii.gz' 
  },
  { 
    type: 'jpeg',
    icon: '🖼️', 
    name: 'JPEG', 
    extensions: '.jpg, .jpeg' 
  },
  { 
    type: 'png',
    icon: '📸', 
    name: 'PNG', 
    extensions: '.png' 
  }
])

// 计算属性
const estimatedTime = computed(() => {
  const baseTime = analysisPrecision.value === 'high' ? 3 : 1.5
  const fileCount = fileList.value.length
  const totalTime = baseTime + (fileCount - 1) * 0.5
  return `${totalTime.toFixed(1)} 分钟`
})

// 导航方法
const goToDashboard = () => {
  const role = authStore.user?.role
  switch (role) {
    case 'doctor':
      router.push('/dashboard/doctor')
      break
    case 'patient':
      router.push('/dashboard/patient')
      break
    case 'admin':
      router.push('/dashboard/admin/upload')
      break
    default:
      router.push('/')
  }
}

const handleLogout = () => {
  authStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}

// 保持你原有的文件处理方法不变
const allowedExtensions = ['.dcm', '.dicom', '.nii', '.nii.gz', '.jpg', '.jpeg', '.png']
const allowedMimeTypes = ['image/dicom', 'image/jpeg', 'image/png', 'application/octet-stream']

const isValidFileType = (fileName: string, fileType: string): boolean => {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'))
  return allowedExtensions.includes(extension) || allowedMimeTypes.includes(fileType)
}

const getFileType = (fileName: string): string => {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'))
  const typeMap: { [key: string]: string } = {
    '.dcm': 'DICOM',
    '.dicom': 'DICOM',
    '.nii': 'NIfTI',
    '.nii.gz': 'NIfTI',
    '.jpg': 'JPEG',
    '.jpeg': 'JPEG',
    '.png': 'PNG'
  }
  return typeMap[extension] || '未知'
}

const getFileTypeTag = (fileName: string): string => {
  const type = getFileType(fileName)
  const tagMap: { [key: string]: string } = {
    'DICOM': 'primary',
    'NIfTI': 'success',
    'JPEG': 'warning',
    'PNG': 'info'
  }
  return tagMap[type] || 'info'
}

const isImageFile = (fileName: string): boolean => {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'))
  return ['.jpg', '.jpeg', '.png'].includes(extension)
}

const beforeUpload = (file: File) => {
  const isValid = isValidFileType(file.name, file.type)
  
  if (!isValid) {
    ElMessage.error({
      message: `文件 "${file.name}" 格式不支持！`,
      duration: 5000,
      showClose: true
    })
    
    setTimeout(() => {
      ElMessageBox.alert(
        `请上传以下格式的医学影像文件：<br><br>
        🩻 <b>DICOM</b> (.dcm, .dicom)<br>
        📊 <b>NIfTI</b> (.nii, .nii.gz)<br>
        🖼️ <b>JPEG</b> (.jpg, .jpeg)<br>
        📸 <b>PNG</b> (.png)`,
        '支持的文件格式',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '知道了'
        }
      )
    }, 1000)
    
    return false
  }
  
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error(`文件 "${file.name}" 大小超过 50MB 限制！`)
    return false
  }
  
  return true
}

const handleFileChange = (file: any) => {
  if (!beforeUpload(file.raw)) {
    return false
  }
  
  const newFile: UploadFile = {
    name: file.name,
    size: formatFileSize(file.size),
    raw: file.raw,
    type: getFileType(file.name),
    status: 'success'
  }
  
  fileList.value.push(newFile)
  ElMessage.success(`文件 "${file.name}" 上传成功`)
}

const removeFile = (index: number) => {
  const fileName = fileList.value[index].name
  fileList.value.splice(index, 1)
  ElMessage.info(`已移除文件: ${fileName}`)
}

const clearAllFiles = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有已选择的文件吗？',
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    fileList.value = []
    ElMessage.success('已清空所有文件')
  } catch {
    // 用户取消操作
  }
}

const startAnalysis = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择要分析的影像文件')
    return
  }
  
  isAnalyzing.value = true
  
  try {
    ElMessage.success('开始分析影像数据，请稍候...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    ElMessage.success({
      message: '分析完成！正在生成诊断报告...',
      duration: 3000
    })
  } catch (error) {
    ElMessage.error('分析过程中出现错误，请重试')
  } finally {
    isAnalyzing.value = false
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.upload-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
}

/* 导航栏样式 */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(135deg, #1890ff, #722ed1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* 主要内容样式 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.upload-hero {
  text-align: center;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 15px;
}

.hero-description {
  font-size: 1.2rem;
  color: #4a5568;
}

.upload-main-card {
  border: none;
  border-radius: 20px;
  background: white;
}

.upload-content {
  padding: 40px;
}

/* 上传区域样式 */
.upload-dropzone {
  padding: 60px 20px;
  text-align: center;
}

.upload-icon {
  font-size: 4rem;
  color: #1890ff;
  margin-bottom: 20px;
}

.main-text {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.sub-text {
  color: #718096;
  font-size: 1rem;
}

.upload-tips {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.tips-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 15px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.format-icon {
  font-size: 1.2rem;
}

.format-name {
  font-weight: 500;
  color: #2d3748;
}

.format-ext {
  color: #718096;
  font-size: 0.9rem;
}

.size-limit {
  color: #e53e3e;
  font-weight: 500;
  text-align: center;
}

/* 文件列表样式 */
.file-list-section {
  margin-top: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  color: #2d3748;
  margin: 0;
}

.file-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  color: #1890ff;
}

/* 分析面板样式 */
.analysis-panel {
  background: linear-gradient(135deg, #1890ff, #722ed1);
  color: white;
  padding: 30px;
  border-radius: 15px;
  height: fit-content;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.panel-header h3 {
  color: white;
  margin: 0;
}

/* 修复 setting-group 样式 */
.setting-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  margin-bottom: 25px;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);
}

.setting-control {
  width: 100%;
}

.switch-label {
  margin-left: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

:deep(.analysis-panel .el-radio) {
  color: rgba(255, 255, 255, 0.9);
}

:deep(.analysis-panel .el-select .el-input__inner) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

:deep(.analysis-panel .el-select .el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

/* 分析摘要 */
.analysis-summary {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-item .label {
  color: rgba(255, 255, 255, 0.8);
}

.summary-item .value {
  color: white;
  font-weight: 600;
}

.analyze-button {
  width: 100%;
  height: 55px;
  font-size: 1.1rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
}

.analyze-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.analyze-button:disabled {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.5);
}

/* 快速提示 */
.quick-tips {
  margin-top: 30px;
  padding: 25px;
  background: white;
  border-radius: 12px;
  border-left: 4px solid #1890ff;
}

.quick-tips h4 {
  color: #2d3748;
  margin-bottom: 15px;
}

.quick-tips ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.quick-tips li {
  padding: 8px 0;
  color: #4a5568;
  border-bottom: 1px solid #f0f0f0;
}

.quick-tips li:last-child {
  border-bottom: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .upload-content {
    padding: 20px;
  }
  
  .upload-dropzone {
    padding: 40px 20px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>