<template>
  <div class="feedback-history">
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
        <h1 class="page-title">反馈历史</h1>
        <p class="page-subtitle">查看您提交的所有反馈记录和处理状态</p>
    </div>

      <!-- 筛选和搜索 -->
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-item">
            <label class="filter-label">状态筛选</label>
            <select v-model="statusFilter" class="filter-select" @change="filterFeedbacks">
              <option value="">全部状态</option>
              <option value="pending">待处理</option>
              <option value="processing">处理中</option>
              <option value="resolved">已解决</option>
              <option value="closed">已关闭</option>
            </select>
        </div>
          <div class="filter-item">
            <label class="filter-label">分类筛选</label>
            <select v-model="categoryFilter" class="filter-select" @change="filterFeedbacks">
              <option value="">全部分类</option>
              <option value="diagnosis">诊断准确性问题</option>
              <option value="performance">系统性能问题</option>
              <option value="interface">界面交互问题</option>
              <option value="data">数据处理问题</option>
            </select>
        </div>
          <div class="filter-item">
            <label class="filter-label">搜索</label>
            <input 
              type="text" 
              v-model="searchKeyword"
              class="filter-input" 
              placeholder="搜索反馈标题或内容"
              @input="filterFeedbacks"
            >
        </div>
      </div>
    </div>

    <!-- 反馈列表 -->
      <div class="feedback-list">
        <div v-if="filteredFeedbacks.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>暂无反馈记录</h3>
          <p>您还没有提交过任何反馈</p>
          <button class="btn btn-primary" @click="goToFeedback">去提交反馈</button>
        </div>

        <div v-else>
          <div 
            v-for="feedback in paginatedFeedbacks" 
            :key="feedback.id"
            class="feedback-item"
            @click="viewFeedbackDetail(feedback)"
          >
            <div class="feedback-header">
              <div class="feedback-title">{{ feedback.title }}</div>
              <div class="feedback-status" :class="feedback.status">
                {{ getStatusText(feedback.status) }}
              </div>
            </div>
            
            <div class="feedback-meta">
              <div class="meta-item">
                <span class="meta-label">分类:</span>
                <span class="meta-value">{{ getCategoryText(feedback.category) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">严重程度:</span>
                <span class="meta-value">{{ getSeverityText(feedback.severity) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">提交时间:</span>
                <span class="meta-value">{{ formatDate(feedback.timestamp) }}</span>
              </div>
            </div>

            <div class="feedback-content">
              <p>{{ feedback.description.substring(0, 100) }}{{ feedback.description.length > 100 ? '...' : '' }}</p>
            </div>

            <div class="feedback-actions">
              <button 
                class="action-btn view-btn"
                @click.stop="viewFeedbackDetail(feedback)"
            >
              查看详情
              </button>
              <button 
                v-if="feedback.status === 'pending'"
                class="action-btn edit-btn"
                @click.stop="editFeedback(feedback)"
              >
                编辑
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          class="page-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          上一页
        </button>
        
        <button 
          v-for="page in visiblePages" 
          :key="page"
          class="page-btn"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        
        <button 
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 反馈详情模态框 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>反馈详情</h3>
          <button class="close-btn" @click="closeDetailModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedFeedback" class="feedback-detail">
            <div class="detail-section">
              <h4>基本信息</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">标题:</span>
                  <span class="detail-value">{{ selectedFeedback.title }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">分类:</span>
                  <span class="detail-value">{{ getCategoryText(selectedFeedback.category) }}</span>
                </div>
        <div class="detail-item">
                  <span class="detail-label">严重程度:</span>
                  <span class="detail-value">{{ getSeverityText(selectedFeedback.severity) }}</span>
        </div>
        <div class="detail-item">
                  <span class="detail-label">状态:</span>
                  <span class="detail-value status" :class="selectedFeedback.status">
                    {{ getStatusText(selectedFeedback.status) }}
          </span>
        </div>
        <div class="detail-item">
                  <span class="detail-label">提交时间:</span>
                  <span class="detail-value">{{ formatDate(selectedFeedback.timestamp) }}</span>
        </div>
        <div class="detail-item">
                  <span class="detail-label">联系方式:</span>
                  <span class="detail-value">{{ selectedFeedback.contact || '未提供' }}</span>
                </div>
        </div>
        </div>
        
            <div class="detail-section">
              <h4>问题描述</h4>
              <div class="detail-content">
                {{ selectedFeedback.description }}
          </div>
        </div>
        
            <div v-if="selectedFeedback.files && selectedFeedback.files.length > 0" class="detail-section">
              <h4>附件</h4>
              <div class="file-list">
                <div 
                  v-for="(file, index) in selectedFeedback.files" 
                  :key="index"
                  class="file-item"
                >
                  📎 {{ file }}
        </div>
        </div>
        </div>
        </div>
              </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeDetailModal">关闭</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 响应式数据
const router = useRouter()
const feedbacks = ref<any[]>([])
const filteredFeedbacks = ref<any[]>([])
const statusFilter = ref('')
const categoryFilter = ref('')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showDetailModal = ref(false)
const selectedFeedback = ref<any>(null)

// 计算属性
const totalPages = computed(() => {
  return Math.ceil(filteredFeedbacks.value.length / pageSize.value)
})

const paginatedFeedbacks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredFeedbacks.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 方法
const loadFeedbacks = () => {
  const storedFeedbacks = localStorage.getItem('feedbacks')
  if (storedFeedbacks) {
    feedbacks.value = JSON.parse(storedFeedbacks)
    filteredFeedbacks.value = [...feedbacks.value]
  } else {
    // 如果没有数据，创建一些示例数据
    feedbacks.value = [
      {
        id: 'FB-001',
        title: '系统登录缓慢',
        category: 'performance',
        severity: 'medium',
        description: '系统登录时响应时间过长，影响工作效率。',
        status: 'resolved',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        contact: 'doctor@example.com',
        files: ['screenshot1.png']
      },
      {
        id: 'FB-002',
        title: '影像显示异常',
        category: 'interface',
        severity: 'high',
        description: '上传的DICOM影像在查看器中显示不完整，部分区域缺失。',
        status: 'processing',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        contact: 'doctor2@example.com',
        files: []
      }
    ]
    filteredFeedbacks.value = [...feedbacks.value]
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks.value))
  }
}

const filterFeedbacks = () => {
  let filtered = [...feedbacks.value]
  
  // 状态筛选
  if (statusFilter.value) {
    filtered = filtered.filter(f => f.status === statusFilter.value)
  }
  
  // 分类筛选
  if (categoryFilter.value) {
    filtered = filtered.filter(f => f.category === categoryFilter.value)
  }
  
  // 关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(f => 
      f.title.toLowerCase().includes(keyword) ||
      f.description.toLowerCase().includes(keyword)
    )
  }
  
  filteredFeedbacks.value = filtered
  currentPage.value = 1 // 重置到第一页
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭'
  }
  return statusMap[status] || status
}

const getCategoryText = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    diagnosis: '诊断准确性问题',
    performance: '系统性能问题',
    interface: '界面交互问题',
    data: '数据处理问题'
  }
  return categoryMap[category] || category
}

const getSeverityText = (severity: string) => {
  const severityMap: { [key: string]: string } = {
    urgent: '紧急',
    high: '高',
    medium: '中',
    low: '低'
  }
  return severityMap[severity] || severity
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewFeedbackDetail = (feedback: any) => {
  selectedFeedback.value = feedback
  showDetailModal.value = true
}

const editFeedback = (feedback: any) => {
  ElMessage.info('编辑功能开发中...')
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedFeedback.value = null
}

const goToFeedback = () => {
  router.push({ name: 'doctor.feedbackCenter' })
}

// 生命周期
onMounted(() => {
  loadFeedbacks()
})
</script>

<style scoped>
.feedback-history {
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

.filter-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: end;
}

.filter-item {
  flex: 1;
}

.filter-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.filter-select,
.filter-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
}

.feedback-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.feedback-item {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.feedback-item:hover {
  background-color: #fafafa;
}

.feedback-item:last-child {
  border-bottom: none;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.feedback-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.feedback-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.feedback-status.pending {
  background: #fff7e6;
  color: #d46b08;
}

.feedback-status.processing {
  background: #e6f7ff;
  color: #1677ff;
}

.feedback-status.resolved {
  background: #f6ffed;
  color: #52c41a;
}

.feedback-status.closed {
  background: #f5f5f5;
  color: #8c8c8c;
}

.feedback-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-label {
  font-size: 12px;
  color: #999;
}

.meta-value {
  font-size: 12px;
  color: #666;
}

.feedback-content {
  margin-bottom: 16px;
}

.feedback-content p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.feedback-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  background: white;
  transition: all 0.3s;
}

.view-btn {
  color: #1677ff;
  border-color: #1677ff;
}

.view-btn:hover {
  background: #e6f7ff;
}

.edit-btn {
  color: #52c41a;
  border-color: #52c41a;
}

.edit-btn:hover {
  background: #f6ffed;
}

.empty-state {
  text-align: center;
  padding: 60px 24px;
}

.empty-icon {
  font-size: 48px;
    margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}

.empty-state p {
  color: #666;
  margin-bottom: 24px;
}

.pagination {
      display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  background: white;
        border-radius: 4px;
        cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #1677ff;
  color: #1677ff;
}

.page-btn.active {
  background: #1677ff;
  color: white;
  border-color: #1677ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 24px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-label {
  font-size: 14px;
  color: #999;
  min-width: 80px;
}

.detail-value {
  font-size: 14px;
  color: #333;
}

.detail-value.status {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
}

.detail-content {
  background: #fafafa;
  padding: 16px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
      padding: 8px 12px;
  background: #f5f5f5;
      border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
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

.btn-primary {
  background: #1677ff;
  color: white;
  border-color: #1677ff;
}

.btn-secondary {
  color: #666;
}

.btn:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .feedback-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>