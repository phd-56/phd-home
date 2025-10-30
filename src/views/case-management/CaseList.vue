<template>
  <div class="case-management-page">
    <div class="page-header">
      <div class="page-title-row">
        <h1 class="page-title">病例管理</h1>
        <el-button type="primary" @click="navigateToCreate">
          <span>+</span>
          <span>新建病例</span>
        </el-button>
      </div>
      <p class="page-subtitle">管理和维护所有患者影像诊断病例信息</p>
    </div>

    <div class="content-card">
      <!-- Search and Filter -->
      <div class="search-filter-row">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            class="search-input" 
            v-model="searchText"
            placeholder="搜索病例编号、患者姓名或诊断信息..."
            @input="handleSearch"
          >
        </div>
        <div class="filter-controls">
          <select class="filter-dropdown" v-model="filterUrgency" @change="handleFilterChange">
            <option value="">轻重</option>
            <option value="紧急">紧急</option>
            <option value="普通">普通</option>
            <option value="不急">不急</option>
          </select>
          <select class="filter-dropdown" v-model="filterDateRange" @change="handleFilterChange">
            <option value="30">最近30天</option>
            <option value="7">最近7天</option>
            <option value="3">最近3天</option>
            <option value="1">今天</option>
          </select>
          <div class="view-toggle">
            <button class="view-btn active">☰</button>
            <button class="view-btn">⊞</button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button 
          class="tab" 
          :class="{ active: activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          全部 ({{ totalCases }})
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'pending' }"
          @click="activeTab = 'pending'"
        >
          待处理 ({{ pendingCount }})
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'processing' }"
          @click="activeTab = 'processing'"
        >
          诊断中 ({{ processingCount }})
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'completed' }"
          @click="activeTab = 'completed'"
        >
          已完成 ({{ completedCount }})
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'rejected' }"
          @click="activeTab = 'rejected'"
        >
          已拒绝 ({{ rejectedCount }})
        </button>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>病例编号</th>
              <th>患者姓名</th>
              <th>年龄/性别</th>
              <th>检查部位</th>
              <th>检查类型</th>
              <th>申请科室</th>
              <th>当前状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="caseItem in filteredCases" :key="caseItem.caseNumber">
              <td>{{ caseItem.caseNumber }}</td>
              <td>{{ caseItem.patientName }}</td>
              <td>{{ caseItem.age }}岁 / {{ caseItem.gender === 'male' ? '男' : '女' }}</td>
              <td>{{ caseItem.examPart }}</td>
              <td>{{ caseItem.examType }}</td>
              <td>{{ caseItem.department }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(caseItem.status)">
                  {{ getStatusText(caseItem.status) }}
                </span>
              </td>
              <td>{{ caseItem.createTime }}</td>
              <td>
                <div class="action-links">
                  <el-button type="text" size="small" @click="handleView(caseItem.caseNumber)">查看</el-button>
                  <el-button type="text" size="small" @click="handleChangeStatus(caseItem.caseNumber, caseItem.status)">变更状态</el-button>
                  <el-button type="text" size="small" @click="handleExport(caseItem.caseNumber)">打印</el-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <div class="pagination-info">显示 {{ displayStart }}-{{ displayEnd }} 条，共 {{ totalCases }} 条记录</div>
        <div class="pagination-controls">
          <button 
            class="page-btn" 
            :disabled="currentPage === 1"
            @click="handlePrevPage"
          >‹</button>
          <button 
            v-for="page in visiblePages" 
            :key="page"
            class="page-btn" 
            :class="{ active: currentPage === page }"
            @click="handlePageChange(page)"
          >{{ page }}</button>
          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages"
            @click="handleNextPage"
          >›</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const searchText = ref('')
const filterUrgency = ref('')
const filterDateRange = ref('30')
const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = ref(5)

// 从 URL 查询参数中获取 tab 参数
onMounted(() => {
  const tabFromQuery = route.query.tab as string
  if (tabFromQuery && ['all', 'pending', 'processing', 'completed', 'rejected'].includes(tabFromQuery)) {
    activeTab.value = tabFromQuery
  }
})

// Mock data
const allCases = ref([
  {
    caseNumber: 'CASE-20230815-003',
    patientName: '张美丽',
    age: 45,
    gender: 'female',
    examPart: '腰椎 (L1-L5)',
    examType: 'MRI平扫',
    department: '骨科',
    status: 'pending',
    createTime: '2023-08-15 09:30'
  },
  {
    caseNumber: 'CASE-20230814-002',
    patientName: '李建国',
    age: 62,
    gender: 'male',
    examPart: '胸部',
    examType: 'CT平扫',
    department: '神经外科',
    status: 'processing',
    createTime: '2023-08-14 14:20'
  },
  {
    caseNumber: 'CASE-20230813-001',
    patientName: '王小红',
    age: 38,
    gender: 'female',
    examPart: '腰关节 (双膝)',
    examType: 'MRI平扫',
    department: '骨科',
    status: 'completed',
    createTime: '2023-08-13 10:15'
  },
  {
    caseNumber: 'CASE-20230810-006',
    patientName: '刘卫国',
    age: 49,
    gender: 'male',
    examPart: '颈椎 (C1-C7)',
    examType: 'CT平扫',
    department: '骨科',
    status: 'rejected',
    createTime: '2023-08-10 16:45'
  },
  {
    caseNumber: 'CASE-20230815-004',
    patientName: '赵志强',
    age: 55,
    gender: 'male',
    examPart: '胸部',
    examType: 'CT增强',
    department: '胸外科',
    status: 'processing',
    createTime: '2023-08-15 11:20'
  },
  {
    caseNumber: 'CASE-20230816-005',
    patientName: '孙丽娟',
    age: 32,
    gender: 'female',
    examPart: '腹部',
    examType: '超声',
    department: '消化内科',
    status: 'pending',
    createTime: '2023-08-16 08:15'
  },
  {
    caseNumber: 'CASE-20230816-006',
    patientName: '周伟明',
    age: 58,
    gender: 'male',
    examPart: '头颅',
    examType: 'CT平扫',
    department: '神经内科',
    status: 'completed',
    createTime: '2023-08-16 10:30'
  },
  {
    caseNumber: 'CASE-20230817-007',
    patientName: '吴秀英',
    age: 42,
    gender: 'female',
    examPart: '腰椎',
    examType: 'X光',
    department: '骨科',
    status: 'processing',
    createTime: '2023-08-17 14:45'
  }
])

const filteredCases = computed(() => {
  let cases = allCases.value

  // Tab filter
  if (activeTab.value !== 'all') {
    cases = cases.filter(c => c.status === activeTab.value)
  }

  // Search filter
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    cases = cases.filter(c => 
      c.caseNumber.toLowerCase().includes(search) ||
      c.patientName.toLowerCase().includes(search)
    )
  }

  // Pagination
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return cases.slice(start, end)
})

const totalCases = computed(() => allCases.value.length)
const pendingCount = computed(() => allCases.value.filter(c => c.status === 'pending').length)
const processingCount = computed(() => allCases.value.filter(c => c.status === 'processing').length)
const completedCount = computed(() => allCases.value.filter(c => c.status === 'completed').length)
const rejectedCount = computed(() => allCases.value.filter(c => c.status === 'rejected').length)

const totalPages = computed(() => Math.ceil(totalCases.value / pageSize.value))
const displayStart = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const displayEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalCases.value))

const visiblePages = computed(() => {
  const pages = []
  const maxPages = Math.min(5, totalPages.value)
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(start + maxPages - 1, totalPages.value)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'status-pending',
    processing: 'status-processing',
    completed: 'status-completed',
    rejected: 'status-rejected'
  }
  return classes[status] || ''
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '待处理',
    processing: '诊断中',
    completed: '已完成',
    rejected: '已拒绝'
  }
  return texts[status] || status
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleFilterChange = () => {
  currentPage.value = 1
}

const handleView = (caseNumber: string) => {
  router.push(`/dashboard/doctor/case-management/${caseNumber}`)
}

const handleChangeStatus = (caseNumber: string, currentStatus: string) => {
  router.push(`/dashboard/doctor/case-management/change-status/${caseNumber}`)
}

const handleExport = (caseNumber: string) => {
  router.push(`/dashboard/doctor/reports/editor?case=${caseNumber}`)
}

const navigateToCreate = () => {
  router.push('/dashboard/doctor/case-management/create')
}

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}
</script>

<style scoped>
.case-management-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.page-title {
  font-size: 24px;
  font-weight: 500;
  color: #333;
}

.new-case-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: background 0.3s;
}

.new-case-btn:hover {
  background: #40a9ff;
}

.page-subtitle {
  color: #999;
  font-size: 14px;
}

.content-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  max-width: 1400px;
  margin: 0 auto;
}

.search-filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.search-box {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #1890ff;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-dropdown {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  min-width: 120px;
}

.view-toggle {
  display: flex;
  gap: 4px;
}

.view-btn {
  padding: 8px;
  border: 1px solid #d9d9d9;
  background: white;
  cursor: pointer;
  font-size: 16px;
  color: #666;
}

.view-btn:first-child {
  border-radius: 4px 0 0 4px;
}

.view-btn:last-child {
  border-radius: 0 4px 4px 0;
}

.view-btn.active {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e8e8e8;
}

.tab {
  padding: 8px 16px;
  background: none;
  border: none;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
}

.tab:hover {
  color: #1890ff;
}

.tab.active {
  color: #1890ff;
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1890ff;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #fafafa;
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  font-size: 14px;
  color: #666;
  border-bottom: 1px solid #e8e8e8;
}

td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #333;
}

tr:hover {
  background: #fafafa;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-processing {
  background: #e6f7ff;
  color: #1890ff;
}

.status-completed {
  background: #f6ffed;
  color: #52c41a;
}

.status-rejected {
  background: #f5f5f5;
  color: #999;
}

.action-links {
  display: flex;
  gap: 12px;
}

.action-link {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.action-link:hover {
  color: #40a9ff;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.pagination-info {
  font-size: 14px;
  color: #666;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.page-btn {
  padding: 4px 8px;
  min-width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.3s;
}

.page-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.page-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .search-filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .page-title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
