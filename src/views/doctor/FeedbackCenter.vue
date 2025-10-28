<template>
  <div class="feedback-center">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <div class="logo">H</div>
        <span class="header-title">医学影像诊断系统</span>
      </div>
      <div class="header-right">
        <div class="notification">🔔</div>
        <a href="#" class="edit-link">编辑车</a>
      </div>
    </header>

    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">反馈中心</h1>
        <p class="page-subtitle">提交问题反馈、功能建议或故障报告系统故障，帮助我们持续改进</p>
      </div>

      <!-- 反馈表单 -->
      <div class="form-section">
        <div class="tabs">
          <div 
            class="tab" 
            :class="{ active: activeTab === 'problem' }"
            @click="setActiveTab('problem')"
          >
            问题反馈
          </div>
          <div 
            class="tab" 
            :class="{ active: activeTab === 'history' }"
            @click="goToHistory"
          >
            反馈历史
          </div>
        </div>

        <form @submit.prevent="submitFeedback">
          <div class="form-grid">
            <div class="form-row">
              <label class="form-label">
                <span class="required">*</span>问题分类
              </label>
              <select 
                v-model="formData.category"
                class="form-select"
              >
                <option value="" disabled>请选择问题分类</option>
                <option value="diagnosis">诊断准确性问题</option>
                <option value="performance">系统性能问题</option>
                <option value="interface">界面交互问题</option>
                <option value="data">数据处理问题</option>
              </select>
              <p class="form-hint">选择最贴近的问题类别以帮助我们更快定位和解决问题</p>
            </div>

            <div class="form-row">
              <label class="form-label">
                <span class="required">*</span>问题严重程度
              </label>
              <select 
                v-model="formData.severity"
                class="form-select"
              >
                <option value="" disabled>请选择严重程度</option>
                <option value="urgent">紧急 - 系统无法使用</option>
                <option value="high">高 - 严重影响使用</option>
                <option value="medium">中 - 部分功能受影响</option>
                <option value="low">低 - 轻微问题</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">
              <span class="required">*</span>问题标题
            </label>
            <input 
              type="text" 
              v-model="formData.title"
              class="form-input" 
              placeholder="请简要描述问题的标题（不超过100字）"
              maxlength="100"
            >
          </div>

          <div class="form-row">
            <label class="form-label">
              <span class="required">*</span>问题详细描述
            </label>
            <textarea 
              v-model="formData.description"
              class="form-textarea" 
              placeholder="为便于更生动的描述、分析、现象及相关提醒：
1. 问题发生时您正在进行什么操作？
2. 问题的具体表现是什么？
3. 问题是否可以复现？如何复现？
4. 问题是否影响其他功能？
（请提供足够详细的问题信息，以便我们快速定位和解决问题）"
            ></textarea>
          </div>

          <div class="form-row">
            <label class="form-label">上传附件（可选）</label>
            <div 
              class="upload-area"
              @click="triggerFileInput"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
              :class="{ 'drag-over': isDragOver }"
            >
              <div class="upload-icon">☁</div>
              <div class="upload-text">拖放文件到此处或点击上传</div>
              <div class="upload-hint">支持 JPG、PNG、PDF 格式，单个文件不超过 10MB，最多上传 3 个文件</div>
            </div>
            <!-- 隐藏的文件输入框 -->
            <input 
              ref="fileInput"
              type="file" 
              multiple 
              accept=".jpg,.jpeg,.png,.pdf"
              style="display: none"
              @change="handleFileSelect"
            >
            <!-- 已上传文件列表 -->
            <div v-if="uploadedFiles.length > 0" class="file-list">
              <div 
                v-for="(file, index) in uploadedFiles" 
                :key="index"
                class="file-item"
              >
                <span class="file-name">{{ file.name }}</span>
                <button 
                  type="button" 
                  @click="removeFile(index)"
                  class="remove-file"
                >
                  移除
                </button>
              </div>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">联系方式（可选）</label>
            <input 
              type="text" 
              v-model="formData.contact"
              class="form-input" 
              placeholder="请留下您的联系方式，方便我们进一步沟通（选填）"
            >
          </div>

          <div class="checkbox-wrapper">
            <input 
              type="checkbox" 
              id="agreement" 
              v-model="formData.agreement"
              class="checkbox"
            >
            <label for="agreement" class="checkbox-label">
              我已阅读并同意 <a href="#" class="link">《用户反馈协议》</a>，允许系统收集以下信息以帮助问题排查
            </label>
          </div>

          <div class="form-actions">
            <button type="button" class="btn" @click="saveDraft">保存草稿</button>
            <button type="submit" class="btn btn-primary">提交反馈</button>
          </div>
        </form>
      </div>

      <!-- 常见问题 -->
      <div class="faq-section">
        <h2 class="faq-title">常见问题</h2>
        <p class="faq-subtitle">查看其他用户经常遇到的问题及解决方案</p>

        <div 
          v-for="(faq, index) in faqItems" 
          :key="index"
          class="faq-item"
          :class="{ open: faq.open }"
          @click="toggleFAQ(index)"
        >
          <div class="faq-question">
            <span>{{ faq.question }}</span>
            <span class="faq-arrow">▼</span>
          </div>
          <div v-if="faq.answer" class="faq-answer">
            {{ faq.answer }}
          </div>
        </div>

        <div class="view-more" @click="showMoreFAQ">查看更多常见问题</div>
      </div>

      <!-- 反馈进度查询 -->
      <div class="query-section">
        <h2 class="query-title">反馈进度查询</h2>
        <p class="query-subtitle">输入反馈编号查询处理进度</p>
        <div class="query-form">
          <input 
            type="text" 
            v-model="progressId"
            class="query-input" 
            placeholder="请输入反馈编号"
          >
          <button type="button" class="query-btn" @click="queryProgress">查询</button>
        </div>
      </div>
    </div>

    <!-- 成功提示框 -->
    <div v-if="showToast" class="toast" :class="toastType">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 响应式数据
const router = useRouter()
const activeTab = ref('problem')
const isDragOver = ref(false)
const uploadedFiles = ref<File[]>([])
const progressId = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// 表单数据
const formData = reactive({
  category: '',
  severity: '',
  title: '',
  description: '',
  contact: '',
  agreement: false
})

// FAQ数据
const faqItems = ref([
  {
    question: '如何导出影像诊断报告？',
    answer: '在系统诊断页面完成诊断后，点击页面右上角的"导出诊断报告"按钮，选择导出格式（PDF或Word），系统将生成并下载诊断报告文件。目前支持单个个案报告导出和批量导出功能。',
    open: false
  },
  {
    question: '如果遇到自己定义文件格式不支持？',
    answer: '',
    open: false
  },
  {
    question: '系统支持哪些影像格式导入？',
    answer: '',
    open: false
  },
  {
    question: '如何申请增加用户数或或提高权限？',
    answer: '',
    open: false
  }
])

// 引用
const fileInput = ref<HTMLInputElement>()

// 方法
const setActiveTab = (tab: string) => {
  activeTab.value = tab
}

const goToHistory = () => {
  router.push({ name: 'doctor.feedbackHistory' })
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDragOver = () => {
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  const files = e.dataTransfer?.files
  if (files) {
    handleFiles(files)
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    handleFiles(target.files)
  }
}

const handleFiles = (files: FileList) => {
  const MAX_FILES = 3
  const MAX_SIZE = 10 * 1024 * 1024 // 10MB
  
  if (uploadedFiles.value.length + files.length > MAX_FILES) {
    showToastMessage(`最多只能上传 ${MAX_FILES} 个文件`, 'error')
    return
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    if (file.size > MAX_SIZE) {
      showToastMessage(`文件 "${file.name}" 超过10MB限制`, 'error')
      continue
    }
    
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      showToastMessage(`文件 "${file.name}" 格式不支持`, 'error')
      continue
    }
    
    uploadedFiles.value.push(file)
  }
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const saveDraft = () => {
  const draftData = {
    ...formData,
    files: uploadedFiles.value.map(f => f.name),
    timestamp: new Date().toISOString()
  }
  
  localStorage.setItem('feedbackDraft', JSON.stringify(draftData))
  showToastMessage('草稿已保存', 'success')
}

const submitFeedback = () => {
  // 表单验证
  if (!formData.category || !formData.severity || !formData.title || !formData.description) {
    showToastMessage('请填写所有必填项 (*)', 'error')
    return
  }

  if (!formData.agreement) {
    showToastMessage('请阅读并同意用户反馈协议', 'error')
    return
  }

  // 模拟提交
  const feedbackData = {
    ...formData,
    files: uploadedFiles.value.map(f => f.name),
    timestamp: new Date().toISOString(),
    id: `FB-${Date.now()}`
  }

  console.log('反馈提交数据:', feedbackData)
  
  // 保存到本地存储
  const existingFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]')
  existingFeedbacks.unshift(feedbackData)
  localStorage.setItem('feedbacks', JSON.stringify(existingFeedbacks))
  
  showToastMessage('反馈提交成功！感谢您的支持。', 'success')
  
  // 重置表单
  resetForm()
}

const resetForm = () => {
  Object.assign(formData, {
    category: '',
    severity: '',
    title: '',
    description: '',
    contact: '',
    agreement: false
  })
  uploadedFiles.value = []
}

const toggleFAQ = (index: number) => {
  faqItems.value[index].open = !faqItems.value[index].open
}

const showMoreFAQ = () => {
  ElMessage.info('更多常见问题功能开发中...')
}

const queryProgress = () => {
  if (!progressId.value.trim()) {
    showToastMessage('请输入反馈编号', 'error')
    return
  }
  ElMessage.info('查询功能开发中...')
}

const showToastMessage = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// 生命周期
onMounted(() => {
  // 加载草稿
  const draft = localStorage.getItem('feedbackDraft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      Object.assign(formData, draftData)
    } catch (e) {
      console.error('加载草稿失败:', e)
    }
  }
})
</script>

<style scoped>
.feedback-center {
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  color: #333;
  line-height: 1.6;
}

.header {
  background: white;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 24px;
  height: 24px;
  background: #1677ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification {
  position: relative;
  cursor: pointer;
}

.notification::after {
  content: '';
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #ff4d4f;
  border-radius: 50%;
}

.edit-link {
  color: #1677ff;
  text-decoration: none;
  font-size: 14px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #666;
  font-size: 14px;
}

.tabs {
  display: flex;
  gap: 32px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 24px;
}

.tab {
  padding: 12px 0;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tab.active {
  color: #1677ff;
  border-bottom-color: #1677ff;
}

.form-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.form-row {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.required {
  color: #ff4d4f;
  margin-right: 4px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

.form-textarea {
  min-height: 180px;
  resize: vertical;
  font-family: inherit;
}

.form-hint {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.upload-area {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 40px;
  text-align: center;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #1677ff;
  background: #f0f7ff;
}

.upload-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  background: #e6e6e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #999;
}

.upload-text {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.upload-hint {
  color: #999;
  font-size: 12px;
}

.file-list {
  margin-top: 12px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
}

.file-name {
  font-size: 14px;
  color: #333;
}

.remove-file {
  color: #ff4d4f;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  color: #666;
}

.link {
  color: #1677ff;
  text-decoration: none;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 24px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  background: white;
  transition: all 0.3s;
}

.btn:hover {
  opacity: 0.8;
}

.btn-primary {
  background: #1677ff;
  color: white;
  border-color: #1677ff;
}

.faq-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.faq-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.faq-subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.faq-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 0;
  cursor: pointer;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #333;
}

.faq-answer {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
  line-height: 1.8;
}

.faq-arrow {
  transition: transform 0.3s;
}

.faq-item.open .faq-arrow {
  transform: rotate(180deg);
}

.view-more {
  text-align: center;
  padding: 16px;
  color: #1677ff;
  cursor: pointer;
  font-size: 14px;
}

.query-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
}

.query-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.query-subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.query-form {
  display: flex;
  gap: 12px;
}

.query-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
}

.query-btn {
  padding: 8px 32px;
  background: #1677ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  z-index: 9999;
}

.toast.success {
  background: #52c41a;
}

.toast.error {
  background: #ff4d4f;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    gap: 16px;
  }
  
  .query-form {
    flex-direction: column;
  }
}
</style>