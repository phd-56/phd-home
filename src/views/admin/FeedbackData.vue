<template>
  <div class="feedback-data">
    <div class="page-header">
      <div class="header-left">
        <el-button 
          type="primary" 
          size="small"
          @click="goBack"
          style="margin-right: 10px;"
        >
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <div>
          <h1 class="page-title">反馈数据统计</h1>
          <p class="page-description">全面掌握用户反馈情况，掌握平台与用户满意度对外展示</p>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索反馈内容、用户姓名搜索..."
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div class="filter-grid">
        <el-select v-model="filters.type" placeholder="全部类型">
          <el-option label="全部类型" value="" />
          <el-option label="功能建议" value="suggestion" />
          <el-option label="问题反馈" value="issue" />
          <el-option label="服务投诉" value="complaint" />
        </el-select>
        <el-select v-model="filters.status" placeholder="全部状态">
          <el-option label="全部状态" value="" />
          <el-option label="待处理" value="pending" />
          <el-option label="处理中" value="processing" />
          <el-option label="已完成" value="completed" />
        </el-select>
        <el-select v-model="filters.source" placeholder="全部来源">
          <el-option label="全部来源" value="" />
          <el-option label="Web端" value="web" />
          <el-option label="移动端" value="mobile" />
          <el-option label="电话" value="phone" />
        </el-select>
        <el-select v-model="filters.dateRange" placeholder="最近30天">
          <el-option label="最近30天" value="30" />
          <el-option label="最近7天" value="7" />
          <el-option label="最近90天" value="90" />
        </el-select>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">总反馈量</span>
          <span class="stat-change positive">↑ +7.8%</span>
        </div>
        <div class="stat-value">326</div>
        <div class="stat-detail">较上月新增23条</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">平均满意度</span>
          <span class="stat-change positive">↑ +0.2</span>
        </div>
        <div class="stat-value">4.7/5.0</div>
        <div class="stat-detail">基于2805条有效评价</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">待处理反馈</span>
          <span class="stat-change negative">↑ +8.0%</span>
        </div>
        <div class="stat-value">287</div>
        <div class="stat-detail">平均处理耗时16小时</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">逾期处理项</span>
          <span class="stat-change negative">↑ +3</span>
        </div>
        <div class="stat-value">12</div>
        <div class="stat-detail">需要立即关注</div>
      </el-card>
    </div>

    <!-- 反馈列表 -->
    <el-card class="table-card">
      <el-table :data="feedbackList" style="width: 100%">
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="反馈内容" min-width="200" />
        <el-table-column prop="date" label="反馈时间" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default>
            <el-button size="small" type="primary">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

const goBack = () => {
  router.push('/dashboard/admin/data-analysis')
}

const searchKeyword = ref('')
const filters = ref({
  type: '',
  status: '',
  source: '',
  dateRange: '30'
})

const feedbackList = ref([
  { user: '张先生', type: '功能建议', content: '希望增加导出报告功能', date: '2024-01-15', status: '待处理' },
  { user: '李女士', type: '问题反馈', content: '页面加载速度慢', date: '2024-01-14', status: '处理中' },
  { user: '王医生', type: '服务投诉', content: '影像上传失败', date: '2024-01-13', status: '已完成' },
  { user: '赵先生', type: '功能建议', content: '建议优化操作流程', date: '2024-01-12', status: '待处理' }
])

const getTypeTagType = (type: string) => {
  if (type === '功能建议') return 'success'
  if (type === '问题反馈') return 'warning'
  return 'danger'
}

const getStatusTagType = (status: string) => {
  if (status === '已完成') return 'success'
  if (status === '处理中') return 'warning'
  return 'info'
}
</script>

<style scoped>
.feedback-data {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-description {
  color: #6b7280;
  font-size: 1rem;
}

.filter-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.search-input {
  margin-bottom: 16px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-detail {
  font-size: 0.75rem;
  color: #9ca3af;
}

.table-card {
  border-radius: 12px;
}
</style>

