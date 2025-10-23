<template>
  <div class="feedback-page">
    <div class="page-header">
      <h1>反馈管理</h1>
      <p>查看和管理用户反馈信息</p>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>反馈列表</span>
          <el-button type="primary" @click="refreshFeedback">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <el-table :data="feedbackList" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userName" label="用户" width="120" />
        <el-table-column prop="type" label="反馈类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getFeedbackTypeTag(row.type)">
              {{ getFeedbackTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="viewFeedback(row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 反馈详情对话框 -->
    <el-dialog v-model="detailVisible" title="反馈详情" width="600px">
      <div v-if="currentFeedback" class="feedback-detail">
        <div class="detail-item">
          <label>用户：</label>
          <span>{{ currentFeedback.userName }}</span>
        </div>
        <div class="detail-item">
          <label>类型：</label>
          <el-tag :type="getFeedbackTypeTag(currentFeedback.type)">
            {{ getFeedbackTypeText(currentFeedback.type) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <label>标题：</label>
          <span>{{ currentFeedback.title }}</span>
        </div>
        <div class="detail-item">
          <label>内容：</label>
          <div class="content-box">{{ currentFeedback.content }}</div>
        </div>
        <div class="detail-item">
          <label>状态：</label>
          <el-tag :type="getStatusTag(currentFeedback.status)">
            {{ getStatusText(currentFeedback.status) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <label>提交时间：</label>
          <span>{{ formatDate(currentFeedback.createTime) }}</span>
        </div>
        <div v-if="currentFeedback.reply" class="detail-item">
          <label>回复：</label>
          <div class="reply-box">{{ currentFeedback.reply }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
//import { Refresh } from '@element-plus/icons-vue'

interface FeedbackItem {
  id: string
  userName: string
  type: string
  title: string
  content: string
  status: string
  createTime: string
  reply?: string
}

const loading = ref(false)
const detailVisible = ref(false)
const feedbackList = ref<FeedbackItem[]>([])
const currentFeedback = ref<FeedbackItem | null>(null)

// 模拟数据
const mockFeedback: FeedbackItem[] = [
  {
    id: '1',
    userName: '张医生',
    type: 'suggestion',
    title: '建议增加更多疾病分类',
    content: '当前的疾病分类不够全面，建议增加更多细分疾病类型，便于更精确的诊断。',
    status: 'processed',
    createTime: '2024-01-15T10:30:00',
    reply: '感谢您的建议，我们将在下个版本中增加更多疾病分类。'
  },
  {
    id: '2',
    userName: '李医生',
    type: 'bug',
    title: '图片上传有时会失败',
    content: '在使用图片上传功能时，偶尔会出现上传失败的情况，建议检查网络连接和文件大小限制。',
    status: 'processing',
    createTime: '2024-01-16T14:20:00'
  },
  {
    id: '3',
    userName: '王医生',
    type: 'feature',
    title: '希望增加批量诊断功能',
    content: '目前只能单张图片诊断，希望增加批量上传和诊断功能，提高工作效率。',
    status: 'pending',
    createTime: '2024-01-17T09:15:00'
  }
]

const loadFeedback = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    feedbackList.value = mockFeedback
  } catch (error) {
    ElMessage.error('加载反馈数据失败')
  } finally {
    loading.value = false
  }
}

const refreshFeedback = () => {
  loadFeedback()
}

const viewFeedback = (feedback: FeedbackItem) => {
  currentFeedback.value = feedback
  detailVisible.value = true
}

const getFeedbackTypeTag = (type: string) => {
  const typeMap: { [key: string]: string } = {
    suggestion: 'success',
    bug: 'danger',
    feature: 'warning',
    other: 'info'
  }
  return typeMap[type] || 'info'
}

const getFeedbackTypeText = (type: string) => {
  const typeMap: { [key: string]: string } = {
    suggestion: '建议',
    bug: 'Bug反馈',
    feature: '功能请求',
    other: '其他'
  }
  return typeMap[type] || '其他'
}

const getStatusTag = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: 'warning',
    processing: 'primary',
    processed: 'success'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: '待处理',
    processing: '处理中',
    processed: '已处理'
  }
  return statusMap[status] || '未知'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

onMounted(() => {
  loadFeedback()
})
</script>

<style scoped>
.feedback-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
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

.feedback-detail {
  padding: 10px 0;
}

.detail-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.detail-item label {
  width: 80px;
  font-weight: bold;
  color: #333;
  flex-shrink: 0;
}

.detail-item span {
  flex: 1;
  color: #666;
}

.content-box, .reply-box {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  line-height: 1.6;
  white-space: pre-wrap;
}

.reply-box {
  background: #f0f7ff;
  border-color: #1890ff;
}
</style>