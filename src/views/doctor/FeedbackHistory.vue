<template>
  <div class="feedback-history-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="text-2xl font-bold text-gray-800">反馈历史记录</h1>
      <p class="text-gray-500 mt-1">查看和管理您提交的AI诊断反馈记录</p>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="filter-bar bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-grow min-w-[200px]">
          <el-input 
            v-model="searchKeyword" 
            placeholder="搜索病例ID、反馈内容..." 
            prefix-icon="Search"
            size="default"
            class="w-full"
          />
        </div>
        <div class="w-[200px]">
          <el-select 
            v-model="feedbackType" 
            placeholder="反馈类型" 
            size="default"
            class="w-full"
          >
            <el-option label="全部类型" value="" />
            <el-option label="诊断准确性" value="accuracy" />
            <el-option label="病灶识别" value="detection" />
            <el-option label="报告内容" value="report" />
            <el-option label="系统功能" value="system" />
          </el-select>
        </div>
        <div class="w-[200px]">
          <el-select 
            v-model="feedbackStatus" 
            placeholder="处理状态" 
            size="default"
            class="w-full"
          >
            <el-option label="全部状态" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已解决" value="resolved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </div>
        <div class="w-[220px]">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="default"
            class="w-full"
          />
        </div>
        <div>
          <el-button 
            type="primary" 
            size="default"
            @click="fetchFeedbackList"
          >
            <el-icon><Search /></el-icon> 搜索
          </el-button>
        </div>
      </div>
    </div>

    <!-- 反馈列表 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <el-table 
        v-loading="loading"
        :data="feedbackList" 
        border
        stripe
        class="w-full"
        :header-cell-style="{ 'background-color': '#f5f7fa', 'font-weight': 'bold' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="caseId" label="病例ID" width="140" align="center">
          <template #default="scope">
            <el-link type="primary" @click="viewCaseDetail(scope.row.caseId)">{{ scope.row.caseId }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="feedbackType" label="反馈类型" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getFeedbackTypeTagType(scope.row.feedbackType)">
              {{ getFeedbackTypeName(scope.row.feedbackType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="反馈内容" min-width="250">
          <template #default="scope">
            <div class="line-clamp-2" :title="scope.row.content">{{ scope.row.content }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getFeedbackStatusTagType(scope.row.status)">
              {{ getFeedbackStatusName(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submittedAt" label="提交时间" width="180" align="center" />
        <el-table-column prop="processedAt" label="处理时间" width="180" align="center" />
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button 
              type="text" 
              size="small" 
              @click="viewFeedbackDetail(scope.row.id)"
              v-if="scope.row.status !== 'pending'"
            >
              查看详情
            </el-button>
            <el-button 
              type="text" 
              size="small" 
              @click="editFeedback(scope.row.id)"
              v-if="scope.row.status === 'pending'"
            >
              编辑
            </el-button>
            <el-divider direction="vertical" v-if="scope.row.status === 'pending'" />
            <el-button 
              type="text" 
              size="small" 
              text-color="#ff4d4f"
              @click="deleteFeedback(scope.row.id)"
              v-if="scope.row.status === 'pending'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container p-4 flex justify-between items-center border-t">
        <div class="text-gray-500 text-sm">
          共 {{ total }} 条记录，当前显示第 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, total) }} 条
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 反馈详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="反馈详情" 
      width="60%"
      :close-on-click-modal="false"
    >
      <div v-if="currentFeedback" class="feedback-detail">
        <div class="detail-item">
          <span class="label">病例ID：</span>
          <span class="value">{{ currentFeedback.caseId }}</span>
        </div>
        <div class="detail-item">
          <span class="label">反馈类型：</span>
          <span class="value">
            <el-tag :type="getFeedbackTypeTagType(currentFeedback.feedbackType)">
              {{ getFeedbackTypeName(currentFeedback.feedbackType) }}
            </el-tag>
          </span>
        </div>
        <div class="detail-item">
          <span class="label">提交时间：</span>
          <span class="value">{{ currentFeedback.submittedAt }}</span>
        </div>
        <div class="detail-item">
          <span class="label">提交人：</span>
          <span class="value">{{ currentFeedback.doctorName }} ({{ currentFeedback.doctorId }})</span>
        </div>
        <div class="detail-item">
          <span class="label">反馈内容：</span>
          <div class="value feedback-content">{{ currentFeedback.content }}</div>
        </div>
        
        <div class="detail-item" v-if="currentFeedback.images && currentFeedback.images.length > 0">
          <span class="label">相关图片：</span>
          <div class="value image-list">
            <el-image 
              v-for="(img, index) in currentFeedback.images" 
              :key="index"
              :src="img.url" 
              :preview-src-list="currentFeedback.images.map(i => i.url)"
              class="image-item"
              fit="cover"
            />
          </div>
        </div>
        
        <div class="detail-item" v-if="currentFeedback.status !== 'pending'">
          <span class="label">处理状态：</span>
          <span class="value">
            <el-tag :type="getFeedbackStatusTagType(currentFeedback.status)">
              {{ getFeedbackStatusName(currentFeedback.status) }}
            </el-tag>
          </span>
        </div>
        
        <div class="detail-item" v-if="currentFeedback.processedAt">
          <span class="label">处理时间：</span>
          <span class="value">{{ currentFeedback.processedAt }}</span>
        </div>
        
        <div class="detail-item" v-if="currentFeedback.processedBy">
          <span class="label">处理人：</span>
          <span class="value">{{ currentFeedback.processedBy.name }} ({{ currentFeedback.processedBy.role }})</span>
        </div>
        
        <div class="detail-item" v-if="currentFeedback.processNote">
          <span class="label">处理意见：</span>
          <div class="value process-note">{{ currentFeedback.processNote }}</div>
        </div>
        
        <div class="detail-item" v-if="currentFeedback.optimizationPlan">
          <span class="label">优化计划：</span>
          <div class="value optimization-plan">
            <el-card class="bg-blue-50 border-blue-100">
              <h4 class="font-medium text-blue-800 mb-2">模型优化计划</h4>
              <p>{{ currentFeedback.optimizationPlan.content }}</p>
              <div class="mt-2 text-sm text-blue-600">
                计划实施版本：{{ currentFeedback.optimizationPlan.targetVersion || '未确定' }}
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 编辑反馈对话框 -->
    <el-dialog 
      v-model="editDialogVisible" 
      title="编辑反馈" 
      width="50%"
      :close-on-click-modal="false"
    >
      <feedback-form 
        ref="feedbackFormRef"
        :case-id="currentFeedback?.caseId"
        :initial-data="currentFeedback"
        @submit="handleFeedbackSubmit"
      />
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import FeedbackForm from '@/components/doctor/FeedbackForm.vue'
import { useFeedbackStore } from '@/stores/feedbackStore'

// 引入类型定义
import type { 
  FeedbackItem, 
  FeedbackType, 
  FeedbackStatus,
  FeedbackDetail 
} from '@/types/feedback'

// 状态管理
const state = reactive({
  feedbackList: [] as FeedbackItem[],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  searchKeyword: '',
  feedbackType: '',
  feedbackStatus: '',
  dateRange: [] as [string, string] | [],
  detailDialogVisible: false,
  editDialogVisible: false,
  currentFeedback: null as FeedbackDetail | null
})

// 解构响应式状态
const { 
  feedbackList, total, currentPage, pageSize, loading, 
  searchKeyword, feedbackType, feedbackStatus, dateRange,
  detailDialogVisible, editDialogVisible, currentFeedback
} = toRefs(state)

// 使用状态管理
const feedbackStore = useFeedbackStore()
const router = useRouter()

// 表单引用
const feedbackFormRef = ref<InstanceType<typeof FeedbackForm> | null>(null)

// 页面加载时获取反馈列表
onMounted(() => {
  fetchFeedbackList()
})

// 获取反馈列表数据
const fetchFeedbackList = async () => {
  state.loading = true
  try {
    // 使用store获取反馈列表
    await feedbackStore.fetchFeedbackHistory()
    
    // 将store中的数据转换为当前组件需要的格式
    state.feedbackList = feedbackStore.feedbackHistory.map(feedback => ({
      id: feedback.id,
      caseId: feedback.caseId,
      feedbackType: feedback.tags[0] as FeedbackType || 'other',
      content: feedback.comment,
      status: feedback.status as FeedbackStatus,
      submittedAt: feedback.submittedAt,
      processedAt: feedback.processedAt,
      doctorId: feedback.doctorId,
      doctorName: feedback.doctorName,
      imageCount: feedback.imageCount
    }))
    
    state.total = state.feedbackList.length
  } catch (error) {
    console.error('获取反馈列表失败:', error)
    ElMessage.error('获取反馈列表失败，请重试')
  } finally {
    state.loading = false
  }
}

// 查看病例详情
const viewCaseDetail = (caseId: string) => {
  const router = useRouter()
  router.push(`/doctor/cases/${caseId}`)
}

// 查看反馈详情
const viewFeedbackDetail = async (id: string) => {
  state.loading = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟详情数据
    state.currentFeedback = {
      id,
      caseId: `CASE-${Math.floor(Math.random() * 10000)}`,
      feedbackType: ['accuracy', 'detection', 'report', 'system'][Math.floor(Math.random() * 4)] as FeedbackType,
      content: 'AI系统对该病例的肺结节检测存在遗漏，3mm左右的小结节未能识别，建议优化小尺寸结节的检测算法。同时，报告生成的结构化程度可以进一步提高，增加更多量化指标。',
      status: ['processing', 'resolved', 'rejected'][Math.floor(Math.random() * 3)] as FeedbackStatus,
      submittedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      processedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      doctorName: '张医生',
      doctorId: 'DOC-001',
      images: [
        { url: 'https://picsum.photos/seed/med1/400/300', description: '胸部X光片' },
        { url: 'https://picsum.photos/seed/med2/400/300', description: 'CT影像' }
      ],
      processedBy: {
        name: '李工程师',
        role: '算法专家'
      },
      processNote: '感谢您的反馈，我们已确认该问题存在。经分析，主要原因是小尺寸结节特征提取不足。我们计划在下个版本中优化特征提取网络，增加对<5mm结节的关注权重。',
      optimizationPlan: Math.random() > 0.3 ? {
        content: '1. 优化结节检测算法，增加小尺寸结节特征提取层\n2. 扩充小尺寸结节样本数据集\n3. 改进报告生成模板，增加量化指标展示',
        targetVersion: 'v2.2.0'
      } : undefined
    }
    
    state.detailDialogVisible = true
  } catch (error) {
    console.error('获取反馈详情失败:', error)
    message?.error('获取反馈详情失败，请重试')
  } finally {
    state.loading = false
  }
}

// 编辑反馈
const editFeedback = async (id: string) => {
  // 获取当前反馈数据
  const feedbackItem = state.feedbackList.find(item => item.id === id)
  if (feedbackItem) {
    // 从store中获取完整的反馈数据
    const storeFeedback = feedbackStore.feedbackHistory.find(f => f.id === id)
    state.currentFeedback = {
      ...feedbackItem,
      rating: storeFeedback?.rating || 0,
      tags: storeFeedback?.tags || [],
      comment: storeFeedback?.comment || '',
      isPublic: storeFeedback?.isPublic || false
    } as FeedbackDetail
    state.editDialogVisible = true
  }
}

// 删除反馈
const deleteFeedback = async (id: string) => {
  const confirmResult = await ElMessageBox.confirm(
    '确定要删除这条反馈吗？删除后将无法恢复。',
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).catch(() => false)

  if (confirmResult) {
    state.loading = true
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 更新列表
      state.feedbackList = state.feedbackList.filter(item => item.id !== id)
      state.total--
      
      // 同时更新store中的数据
      const storeIndex = feedbackStore.feedbackHistory.findIndex(f => f.id === id)
      if (storeIndex !== -1) {
        feedbackStore.feedbackHistory.splice(storeIndex, 1)
      }
      
      ElMessage.success('反馈已成功删除')
    } catch (error) {
      console.error('删除反馈失败:', error)
      ElMessage.error('删除反馈失败，请重试')
    } finally {
      state.loading = false
    }
  }
}

// 提交编辑表单
const submitEditForm = async () => {
  if (feedbackFormRef.value) {
    const valid = await feedbackFormRef.value.validate()
    if (valid && state.currentFeedback) {
      // 提交表单
      state.loading = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 更新store中的数据
        const storeIndex = feedbackStore.feedbackHistory.findIndex(f => f.id === state.currentFeedback!.id)
        if (storeIndex !== -1) {
          feedbackStore.feedbackHistory[storeIndex] = {
            ...feedbackStore.feedbackHistory[storeIndex],
            ...state.currentFeedback
          }
        }
        
        state.editDialogVisible = false
        ElMessage.success('反馈已成功更新')
        fetchFeedbackList() // 重新加载列表
      } catch (error) {
        console.error('更新反馈失败:', error)
        ElMessage.error('更新失败，请稍后重试')
      } finally {
        state.loading = false
      }
    }
  }
}

// 处理表单提交
const handleFeedbackSubmit = (formData: any) => {
  // 表单提交逻辑由子组件处理
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  state.pageSize = size
  state.currentPage = 1
  fetchFeedbackList()
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  state.currentPage = page
  fetchFeedbackList()
}

// 辅助函数：获取反馈类型名称
const getFeedbackTypeName = (type: FeedbackType | string): string => {
  const typeMap: Record<string, string> = {
    'accuracy': '诊断准确性',
    'detection': '病灶识别',
    'report': '报告内容',
    'system': '系统功能'
  }
  return typeMap[type as string] || '未知类型'
}

// 辅助函数：获取反馈类型标签样式
const getFeedbackTypeTagType = (type: FeedbackType | string): string => {
  const typeMap: Record<string, string> = {
    'accuracy': 'primary',
    'detection': 'success',
    'report': 'info',
    'system': 'warning'
  }
  // 默认值由'default'改为'info'
  return typeMap[type as string] || 'info'
}

// 辅助函数：获取反馈状态名称
const getFeedbackStatusName = (status: FeedbackStatus | string): string => {
  const statusMap: Record<string, string> = {
    'pending': '待处理',
    'processing': '处理中',
    'resolved': '已解决',
    'rejected': '已拒绝'
  }
  return statusMap[status as string] || '未知状态'
}

// 辅助函数：获取反馈状态标签样式
const getFeedbackStatusTagType = (status: FeedbackStatus | string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'info',
    'processing': 'primary',
    'resolved': 'success',
    'rejected': 'danger'
  }
  return statusMap[status as string] || 'info'
}

// 页面方法
const pageMethods = {
  fetchFeedbackList,
  viewFeedbackDetail,
  editFeedback,
  deleteFeedback,
  handleSizeChange: (size: number) => {
    state.pageSize = size
    fetchFeedbackList()
  },
  handleCurrentChange: (page: number) => {
    state.currentPage = page
    fetchFeedbackList()
  },
  submitEditForm
}

// 暴露方法和状态
defineExpose(pageMethods)
</script>

<style scoped>
.feedback-history-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 详情样式 */
.feedback-detail {
  .detail-item {
    margin-bottom: 16px;
    
    .label {
      display: inline-block;
      width: 100px;
      font-weight: 500;
      color: #606266;
      vertical-align: top;
    }
    
    .value {
      display: inline-block;
      vertical-align: top;
      max-width: calc(100% - 100px);
    }
    
    .image-list {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      
      .image-item {
        width: 120px;
        height: 120px;
        border-radius: 4px;
        cursor: pointer;
      }
    }
    
    .process-note, .optimization-plan, .feedback-content {
      padding: 8px 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      line-height: 1.5;
    }
    
    .optimization-plan {
      .el-card {
        margin-top: 8px;
      }
    }
  }
}
</style>