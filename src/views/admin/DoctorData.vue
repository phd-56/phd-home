<template>
  <div class="doctor-data">
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
          <h1 class="page-title">医生数据统计</h1>
          <p class="page-description">全面掌握医生生产力，工作负载与绩效表现</p>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索医生姓名、工号或科室..."
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div class="filter-grid">
        <el-select v-model="filters.department" placeholder="全部科室">
          <el-option label="全部科室" value="" />
          <el-option label="放射科" value="radiology" />
          <el-option label="骨科" value="orthopedics" />
          <el-option label="神经科" value="neurology" />
          <el-option label="心脏科" value="cardiology" />
        </el-select>
        <el-select v-model="filters.title" placeholder="全部职称">
          <el-option label="全部职称" value="" />
          <el-option label="主任医师" value="director" />
          <el-option label="副主任医师" value="deputy" />
          <el-option label="主治医师" value="attending" />
          <el-option label="住院医师" value="resident" />
        </el-select>
        <el-select v-model="filters.activity" placeholder="全部状态">
          <el-option label="全部状态" value="" />
          <el-option label="高活跃" value="high" />
          <el-option label="中活跃" value="medium" />
          <el-option label="低活跃" value="low" />
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
          <span class="stat-label">医生总数</span>
          <span class="stat-change positive">↑ +5.2%</span>
        </div>
        <div class="stat-value">128</div>
        <div class="stat-detail">较上月新增6人</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">活跃医生</span>
          <span class="stat-change positive">↑ +8.7%</span>
        </div>
        <div class="stat-value">86</div>
        <div class="stat-detail">占比67.2%，较上周增长5.3%</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">人均接诊量</span>
          <span class="stat-change negative">↓ -1.3%</span>
        </div>
        <div class="stat-value">42.8</div>
        <div class="stat-detail">人均每月完成接诊数</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">工作效率</span>
          <span class="stat-change positive">↑ +2.1%</span>
        </div>
        <div class="stat-value">87.5%</div>
        <div class="stat-detail">平均报告处理率</div>
      </el-card>
    </div>

    <!-- 医生列表 -->
    <el-card class="table-card">
      <el-table :data="doctorList" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="department" label="科室" width="120" />
        <el-table-column prop="title" label="职称" width="120" />
        <el-table-column prop="patientsCount" label="接诊患者数" width="120" />
        <el-table-column prop="efficiency" label="工作效率" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.efficiency" :status="getEfficiencyStatus(row.efficiency)" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="活跃度" width="100">
          <template #default="{ row }">
            <el-tag :type="getActivityTagType(row.status)">{{ row.status }}</el-tag>
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
  department: '',
  title: '',
  activity: '',
  dateRange: '30'
})

const doctorList = ref([
  { name: '李医生', department: '放射科', title: '主任医师', patientsCount: 156, efficiency: 92, status: '高活跃' },
  { name: '王医生', department: '神经科', title: '副主任医师', patientsCount: 142, efficiency: 88, status: '高活跃' },
  { name: '张医生', department: '骨科', title: '主治医师', patientsCount: 98, efficiency: 85, status: '中活跃' },
  { name: '陈医生', department: '放射科', title: '主治医师', patientsCount: 76, efficiency: 82, status: '中活跃' }
])

const getEfficiencyStatus = (efficiency: number) => {
  if (efficiency >= 90) return 'success'
  if (efficiency >= 80) return 'success'
  return 'exception'
}

const getActivityTagType = (status: string) => {
  if (status === '高活跃') return 'success'
  if (status === '中活跃') return 'warning'
  return 'info'
}
</script>

<style scoped>
.doctor-data {
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

