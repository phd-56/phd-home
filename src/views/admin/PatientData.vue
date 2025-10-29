<template>
  <div class="patient-data">
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
          <h1 class="page-title">患者数据统计</h1>
          <p class="page-description">全面掌握患者基本数据，帮助医患更好地进行分析</p>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索患者姓名、ID或手机号..."
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div class="filter-grid">
        <el-select v-model="filters.timeRange" placeholder="全部总览">
          <el-option label="全部总览" value="" />
          <el-option label="本月" value="month" />
          <el-option label="本季度" value="quarter" />
          <el-option label="本年" value="year" />
        </el-select>
        <el-select v-model="filters.ageRange" placeholder="全部年龄">
          <el-option label="全部年龄" value="" />
          <el-option label="0-18岁" value="0-18" />
          <el-option label="19-35岁" value="19-35" />
          <el-option label="36-60岁" value="36-60" />
          <el-option label="60岁以上" value="60+" />
        </el-select>
        <el-select v-model="filters.gender" placeholder="全部性别">
          <el-option label="全部性别" value="" />
          <el-option label="男" value="male" />
          <el-option label="女" value="female" />
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
          <span class="stat-label">患者总数</span>
          <span class="stat-change positive">↑ +12.5%</span>
        </div>
        <div class="stat-value">1,158</div>
        <div class="stat-detail">较上季度新增128人</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">本月新增患者</span>
          <span class="stat-change positive">↑ +18.3%</span>
        </div>
        <div class="stat-value">146</div>
        <div class="stat-detail">日均新增4人</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">累计诊疗总量</span>
          <span class="stat-change positive">↑ +8.7%</span>
        </div>
        <div class="stat-value">4,327</div>
        <div class="stat-detail">人均检查3.7次</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">30天活跃患者</span>
          <span class="stat-change positive">↑ +5.2%</span>
        </div>
        <div class="stat-value">892</div>
        <div class="stat-detail">活跃率77.1%</div>
      </el-card>
    </div>

    <!-- 患者列表 -->
    <el-card class="table-card">
      <el-table :data="patientList" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="visitCount" label="就诊次数" width="100" />
        <el-table-column prop="lastVisit" label="最近就诊" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '活跃' ? 'success' : 'info'">{{ row.status }}</el-tag>
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
  timeRange: '',
  ageRange: '',
  gender: '',
  dateRange: '30'
})

const patientList = ref([
  { name: '张先生', age: 45, gender: '男', visitCount: 8, lastVisit: '2024-01-15', status: '活跃' },
  { name: '李女士', age: 32, gender: '女', visitCount: 5, lastVisit: '2024-01-12', status: '活跃' },
  { name: '王先生', age: 58, gender: '男', visitCount: 12, lastVisit: '2024-01-10', status: '活跃' },
  { name: '赵女士', age: 29, gender: '女', visitCount: 3, lastVisit: '2023-12-28', status: '一般' }
])
</script>

<style scoped>
.patient-data {
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

