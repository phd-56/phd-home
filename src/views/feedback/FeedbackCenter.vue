<template>
  <div class="feedback-center-page">
    <div class="page-header">
      <h1 class="page-title">反馈中心</h1>
      <p class="page-subtitle">提交问题反馈、功能建议或故障报告系统故障，帮助我们持续改进</p>
    </div>

    <div class="query-section">
      <h2 class="query-title">反馈进度查询</h2>
      <p class="query-subtitle">输入关键词或反馈编号查询处理进度</p>
      <div class="query-form">
        <input 
          type="text" 
          class="query-input" 
          placeholder="请输入关键词或反馈编号"
          v-model="queryId"
          @keyup.enter="queryFeedback"
        >
        <button type="button" class="query-btn" @click="queryFeedback">查询</button>
      </div>
      <div v-if="queryResults.length > 0" class="query-results">
        <div class="result-count">找到 {{ queryResults.length }} 条结果</div>
        <div v-for="result in queryResults" :key="result.id" class="query-result">
          <div class="result-header">
            <span class="result-id">反馈编号：{{ result.id }}</span>
            <span class="result-status" :class="result.status">{{ result.statusText }}</span>
          </div>
          <div class="result-title">{{ result.title }}</div>
          <div class="result-meta">
            <span>{{ result.category }}</span>
            <span>{{ result.date }}</span>
          </div>
        </div>
      </div>
      <div v-else-if="queryId && querySearched" class="no-results">
        未找到相关反馈
      </div>
    </div>

    <div class="form-section">
      <div class="tabs">
        <div 
          class="tab" 
          :class="{ active: activeTab === 'feedback' }"
          @click="activeTab = 'feedback'"
        >
          问题反馈
        </div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          反馈历史
        </div>
      </div>

      <form v-show="activeTab === 'feedback'">
        <div class="form-grid">
          <div class="form-row">
            <label class="form-label">
              <span class="required">*</span>问题分类
            </label>
            <select class="form-select" v-model="formData.category">
              <option value="">请选择问题分类</option>
              <option value="accuracy">诊断准确性问题</option>
              <option value="performance">系统性能问题</option>
              <option value="ui">界面交互问题</option>
              <option value="data">数据处理问题</option>
            </select>
            <p class="form-hint">选择最贴近的问题类别以帮助我们更快定位和解决问题</p>
          </div>

          <div class="form-row">
            <label class="form-label">
              <span class="required">*</span>问题严重程度
            </label>
            <select class="form-select" v-model="formData.severity">
              <option value="">请选择严重程度</option>
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
            class="form-input" 
            placeholder="请简要描述问题的标题（不超过100字）"
            v-model="formData.title"
          >
        </div>

        <div class="form-row">
          <label class="form-label">
            <span class="required">*</span>问题详细描述
          </label>
          <textarea 
            class="form-textarea" 
            placeholder="为便于更生动的描述、分析、现象及相关提醒：
1. 问题发生时您正在进行什么操作？
2. 问题的具体表现是什么？
3. 问题是否可以复现？如何复现？
4. 问题是否影响其他功能？
（请提供足够详细的问题信息，以便我们快速定位和解决问题）"
            v-model="formData.description"
          ></textarea>
        </div>

        <div class="form-row">
          <label class="form-label">上传附件（可选）</label>
          <div class="upload-area" @click="triggerFileUpload">
            <div class="upload-icon">☁</div>
            <div class="upload-text">拖放文件到此处或点击上传</div>
            <div class="upload-hint">支持 JPG、PNG、PDF 格式，单个文件不超过 10MB，最多上传 3 个文件</div>
          </div>
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileChange" 
            multiple 
            accept=".jpg,.jpeg,.png,.pdf"
            style="display: none"
          >
        </div>

        <div class="form-row">
          <label class="form-label">联系方式（可选）</label>
          <input 
            type="text" 
            class="form-input" 
            placeholder="请留下您的联系方式，方便我们进一步沟通（选填）"
            v-model="formData.contact"
          >
        </div>

        <div class="checkbox-wrapper">
          <input type="checkbox" id="agreement" class="checkbox" v-model="formData.agreed">
          <label for="agreement" class="checkbox-label">
            我已阅读并同意 <a href="#" class="link">《用户反馈协议》</a>，允许系统收集以下信息以帮助问题排查
          </label>
        </div>

        <div class="form-actions">
          <button type="button" class="btn" @click="saveDraft">保存草稿</button>
          <button type="submit" class="btn btn-primary" @click.prevent="submitFeedback">提交反馈</button>
        </div>
      </form>

      <div v-show="activeTab === 'history'" class="history-section">
        <div class="history-list">
          <div class="history-item" v-for="item in feedbackHistory" :key="item.id">
            <div class="history-header">
              <span class="history-id">{{ item.id }}</span>
              <span class="history-status" :class="item.status">{{ item.statusText }}</span>
            </div>
            <div class="history-title">{{ item.title }}</div>
            <div class="history-meta">
              <span>{{ item.category }}</span>
              <span>{{ item.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="faq-section">
      <h2 class="faq-title">常见问题</h2>
      <p class="faq-subtitle">查看其他用户经常遇到的问题及解决方案</p>

      <div 
        class="faq-item" 
        v-for="(item, index) in faqs" 
        :key="index"
        :class="{ open: item.open }"
        @click="toggleFaq(index)"
      >
        <div class="faq-question">
          <span>{{ item.question }}</span>
          <span class="faq-arrow" :class="{ open: item.open }">▼</span>
        </div>
        <div class="faq-answer" v-show="item.open">
          {{ item.answer }}
        </div>
      </div>

      <div class="view-more" @click="loadMoreFaqs">查看更多常见问题</div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('feedback')

const formData = reactive({
  category: '',
  severity: '',
  title: '',
  description: '',
  contact: '',
  agreed: false,
  files: [] as File[]
})

const fileInput = ref<HTMLInputElement>()
const queryId = ref('')
const queryResults = ref<any[]>([])
const querySearched = ref(false)

const feedbackHistory = ref([
  {
    id: 'FB-20240320-001',
    title: 'AI诊断准确率问题反馈',
    category: '诊断准确性问题',
    status: 'processing',
    statusText: '处理中',
    date: '2024-03-20'
  },
  {
    id: 'FB-20240319-002',
    title: '系统性能优化建议',
    category: '系统性能问题',
    status: 'resolved',
    statusText: '已解决',
    date: '2024-03-19'
  }
])

const faqs = ref([
  {
    question: '如何导出影像诊断报告？',
    answer: '在系统诊断页面完成诊断后，点击页面右上角的"导出诊断报告"按钮，选择导出格式（PDF或Word），系统将生成并下载诊断报告文件。目前支持单个个案报告导出和批量导出功能。',
    open: false
  },
  {
    question: '如果遇到自己定义文件格式不支持？',
    answer: '系统目前支持DICOM、JPEG、PNG、TIFF、BMP等常见医学影像格式。如果您的文件格式不在支持列表中，请联系技术支持团队，我们将评估是否添加该格式的支持。',
    open: false
  },
  {
    question: '系统支持哪些影像格式导入？',
    answer: '系统支持DICOM (.dcm)、JPEG (.jpg, .jpeg)、PNG (.png)、TIFF (.tif, .tiff)、BMP (.bmp)等常见医学影像格式。其中DICOM格式是推荐使用的格式，因为它包含完整的患者信息和影像参数。',
    open: false
  },
  {
    question: '如何申请增加用户数或提高权限？',
    answer: '用户账号和权限的管理需要联系系统管理员。管理员会根据您的工作需要和职责，为您创建账号并分配相应的权限。如果您是管理员，可以在"系统设置-权限管理"模块中进行用户和权限的管理。',
    open: false
  }
])

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    Array.from(files).forEach(file => {
      if (formData.files.length < 3 && file.size <= 10 * 1024 * 1024) {
        formData.files.push(file)
      }
    })
  }
}

const toggleFaq = (index: number) => {
  faqs.value[index].open = !faqs.value[index].open
}

const loadMoreFaqs = () => {
  // 跳转到帮助文档的常见问题模块
  router.push({ 
    name: 'doctor.help',
    query: { section: 'faq' }
  })
}

const saveDraft = () => {
  // Save draft logic
  alert('草稿已保存')
}

const submitFeedback = () => {
  if (!formData.category || !formData.severity || !formData.title || !formData.description) {
    alert('请填写必填项')
    return
  }
  if (!formData.agreed) {
    alert('请同意用户反馈协议')
    return
  }
  
  // 生成反馈ID
  const feedbackId = `FB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 900) + 100)}`
  
  // 生成状态信息
  const statusMap: Record<string, string> = {
    'accuracy': '诊断准确性问题',
    'performance': '系统性能问题',
    'ui': '界面交互问题',
    'data': '数据处理问题'
  }
  
  const severityMap: Record<string, string> = {
    'urgent': '紧急',
    'high': '高',
    'medium': '中',
    'low': '低'
  }
  
  // 创建反馈历史记录
  const newFeedback = {
    id: feedbackId,
    title: formData.title,
    category: statusMap[formData.category] || formData.category,
    severity: severityMap[formData.severity] || formData.severity,
    status: 'pending',
    statusText: '待处理',
    date: new Date().toISOString().slice(0, 10)
  }
  
  // 添加到反馈历史列表的顶部
  feedbackHistory.value.unshift(newFeedback)
  
  // 保存到localStorage
  localStorage.setItem('feedbackHistory', JSON.stringify(feedbackHistory.value))
  
  alert('反馈提交成功')
  
  // Reset form
  formData.category = ''
  formData.severity = ''
  formData.title = ''
  formData.description = ''
  formData.contact = ''
  formData.agreed = false
  formData.files = []
  
  // 切换到反馈历史标签
  activeTab.value = 'history'
}

const queryFeedback = () => {
  if (!queryId.value) {
    alert('请输入关键词或反馈编号')
    return
  }
  
  const keyword = queryId.value.trim().toLowerCase()
  querySearched.value = true
  
  // 在反馈历史中查询，支持关键词匹配
  queryResults.value = feedbackHistory.value.filter(item => 
    item.id.toLowerCase().includes(keyword) ||
    item.title.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword)
  )
  
  if (queryResults.value.length === 0) {
    // 不显示alert，而是在界面上显示"未找到相关反馈"
  }
}

// 页面加载时从localStorage读取反馈历史
onMounted(() => {
  const savedHistory = localStorage.getItem('feedbackHistory')
  if (savedHistory) {
    try {
      const parsed = JSON.parse(savedHistory)
      // 合并默认数据和localStorage数据
      feedbackHistory.value = [...parsed, ...feedbackHistory.value.filter(item => 
        !parsed.some((p: any) => p.id === item.id)
      )]
    } catch (e) {
      console.error('Failed to parse feedback history from localStorage', e)
    }
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.feedback-center-page {
  min-height: 100vh;
  padding: 24px;
  background-color: #f5f5f5;
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

.upload-area:hover {
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

.history-section {
  margin-top: 24px;
}

.history-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.history-id {
  font-weight: 600;
  color: #1677ff;
}

.history-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.history-status.processing {
  background: #e6f4ff;
  color: #1677ff;
}

.history-status.resolved {
  background: #dcfce7;
  color: #16a34a;
}

.history-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.history-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
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

.faq-arrow.open {
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

.query-btn:hover {
  background: #0958d9;
}

.query-results {
  margin-top: 24px;
}

.result-count {
  font-size: 14px;
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 16px;
}

.query-result {
  margin-bottom: 16px;
  padding: 20px;
  background: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.no-results {
  margin-top: 24px;
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-id {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.result-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.result-status.pending {
  background: #fff7e6;
  color: #d48806;
}

.result-status.processing {
  background: #e6f7ff;
  color: #1677ff;
}

.result-status.resolved {
  background: #f6ffed;
  color: #52c41a;
}

.result-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.result-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>

