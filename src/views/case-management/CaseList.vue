<template>
  <div class="case-management-page">
    <!-- 页面头部 -->
      <div class="page-header">
      <div class="page-title-row">
        <h1 class="page-title">病例管理</h1>
        <button class="new-case-btn" @click="navigateToCreate">
          <span>+</span>
          <span>新建病例</span>
        </button>
      </div>
      <p class="page-subtitle">管理和维护所有患者影像诊断病例信息</p>
    </div>

    <!-- 主要内容卡片 -->
    <div class="content-card">
      <!-- 搜索和筛选 -->
      <div class="search-filter-row">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            class="search-input" 
            placeholder="搜索病例编号、患者姓名或诊断信息..."
            v-model="searchText"
            @input="handleSearch"
          >
        </div>
        <div class="filter-controls">
          <select class="filter-dropdown" v-model="priorityFilter" @change="handleFilterChange">
            <option value="">轻重</option>
            <option value="urgent">紧急</option>
            <option value="normal">普通</option>
            <option value="low">一般</option>
          </select>
          <select class="filter-dropdown" v-model="dateFilter" @change="handleFilterChange">
            <option value="30">最近30天</option>
            <option value="7">最近7天</option>
            <option value="3">最近3天</option>
            <option value="1">今天</option>
          </select>
          <div class="view-toggle">
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'table' }"
              @click="setViewMode('table')"
            >
              ☰
            </button>
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'grid' }"
              @click="setViewMode('grid')"
            >
              ⊞
            </button>
          </div>
        </div>
      </div>

      <!-- 标签页 -->
      <div class="tabs">
        <button 
          class="tab" 
          :class="{ active: activeTab === 'all' }"
          @click="setActiveTab('all')"
        >
          全部
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'pending' }"
          @click="setActiveTab('pending')"
        >
          待处理
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'processing' }"
          @click="setActiveTab('processing')"
        >
          诊断中
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'completed' }"
          @click="setActiveTab('completed')"
        >
          已完成
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'rejected' }"
          @click="setActiveTab('rejected')"
        >
          已拒绝
        </button>
      </div>

      <!-- 表格视图 -->
      <div v-if="viewMode === 'table'" class="table-container">
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
            <tr v-for="caseItem in paginatedCases" :key="caseItem.id">
              <td>{{ caseItem.caseNumber }}</td>
              <td>{{ caseItem.patientName }}</td>
              <td>{{ caseItem.age }}岁 / {{ caseItem.gender }}</td>
              <td>{{ caseItem.examPart }}</td>
              <td>{{ caseItem.examType }}</td>
              <td>{{ caseItem.department }}</td>
              <td>
                <span 
                  class="status-badge" 
                  :class="`status-${caseItem.status}`"
                >
                  {{ getStatusText(caseItem.status) }}
                </span>
              </td>
              <td>{{ formatDate(caseItem.createTime) }}</td>
              <td>
                <div class="action-links">
                  <a href="#" class="action-link" @click.prevent="viewCase(Number(caseItem.id))">查看</a>
                  <a 
                    v-if="caseItem.status === 'completed'" 
                    href="#" 
                    class="action-link" 
                    @click.prevent="viewReport(Number(caseItem.id))"
                  >
                    报告
                  </a>
                  <a href="#" class="action-link" @click.prevent="changeStatus(Number(caseItem.id))">变更状态</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 网格视图 -->
      <div v-else class="grid-container">
        <div class="case-grid">
          <div 
            v-for="caseItem in paginatedCases" 
            :key="caseItem.id"
            class="case-card"
            @click="viewCase(Number(caseItem.id))"
          >
            <div class="case-header">
              <div class="case-number">{{ caseItem.caseNumber }}</div>
              <span 
                class="status-badge" 
                :class="`status-${caseItem.status}`"
              >
                {{ getStatusText(caseItem.status) }}
              </span>
            </div>
            <div class="case-info">
              <div class="patient-name">{{ caseItem.patientName }}</div>
              <div class="patient-details">{{ caseItem.age }}岁 / {{ caseItem.gender }}</div>
              <div class="exam-info">{{ caseItem.examPart }} - {{ caseItem.examType }}</div>
              <div class="department">{{ caseItem.department }}</div>
            </div>
            <div class="case-footer">
              <div class="create-time">{{ formatDate(caseItem.createTime) }}</div>
              <div class="case-actions">
                <button class="action-btn" @click.stop="viewCase(Number(caseItem.id))">查看</button>
                <button 
                  v-if="caseItem.status === 'completed'" 
                  class="action-btn" 
                  @click.stop="viewReport(Number(caseItem.id))"
                >
                  报告
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <div class="pagination-info">
          显示 {{ (pagination.currentPage - 1) * pagination.pageSize + 1 }}-{{ Math.min(pagination.currentPage * pagination.pageSize, pagination.total) }} 条，共 {{ pagination.total }} 条记录
        </div>
        <div class="pagination-controls">
          <button 
            class="page-btn" 
            :disabled="pagination.currentPage === 1"
            @click="goToPage(pagination.currentPage - 1)"
          >
            ‹
          </button>
          <button 
            v-for="page in visiblePages" 
            :key="page"
            class="page-btn" 
            :class="{ active: page === pagination.currentPage }"
            @click="goToPage(typeof page === 'number' ? page : pagination.currentPage)"
          >
            {{ page }}
          </button>
          <button 
            class="page-btn" 
            :disabled="pagination.currentPage === totalPages"
            @click="goToPage(pagination.currentPage + 1)"
          >
            ›
          </button>
        </div>
      </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCaseStore } from '@/stores/caseStore';
import { ElMessage, ElMessageBox } from 'element-plus';

// Router and store
const router = useRouter();
const caseStore = useCaseStore();

// State
const isLoading = ref(true);
const searchText = ref('');
const priorityFilter = ref('');
const dateFilter = ref('30');
const activeTab = ref('all');
const viewMode = ref('table');

// Pagination
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 模拟病例数据
const mockCases = ref([
  {
    id: 1,
    caseNumber: 'CASE-20230815-003',
    patientName: '张美丽',
    age: 45,
    gender: '女',
    examPart: '腰椎 (L1-L5)',
    examType: 'MRI平扫',
    department: '骨科',
    status: 'pending',
    createTime: '2023-08-15 09:30',
    priority: 'normal'
  },
  {
    id: 2,
    caseNumber: 'CASE-20230814-002',
    patientName: '李建国',
    age: 62,
    gender: '男',
    examPart: '胸部',
    examType: 'CT平扫',
    department: '神经外科',
    status: 'processing',
    createTime: '2023-08-14 14:20',
    priority: 'urgent'
  },
  {
    id: 3,
    caseNumber: 'CASE-20230813-001',
    patientName: '王小红',
    age: 38,
    gender: '女',
    examPart: '腰关节 (双膝)',
    examType: 'MRI平扫',
    department: '骨科',
    status: 'completed',
    createTime: '2023-08-13 10:15',
    priority: 'normal'
  },
  {
    id: 4,
    caseNumber: 'CASE-20230810-006',
    patientName: '刘卫国',
    age: 49,
    gender: '男',
    examPart: '颈椎 (C1-C7)',
    examType: 'CT平扫',
    department: '骨科',
    status: 'rejected',
    createTime: '2023-08-10 16:45',
    priority: 'low'
  },
  {
    id: 5,
    caseNumber: 'CASE-20230815-004',
    patientName: '赵志强',
    age: 55,
    gender: '男',
    examPart: '胸部',
    examType: 'CT增强',
    department: '胸外科',
    status: 'processing',
    createTime: '2023-08-15 11:20',
    priority: 'urgent'
  }
]);

// Get cases from local storage or use mock data
const cases = computed(() => {
  // 从本地存储获取病例数据
  const storedCases = JSON.parse(localStorage.getItem('cases') || '[]')
  
  // 如果本地存储有数据，使用本地存储数据，否则使用模拟数据
  if (storedCases.length > 0) {
    return storedCases
  }
  
  // 如果没有本地数据，初始化一些模拟数据
  if (mockCases.value.length > 0) {
    // 为模拟数据添加ID和时间戳
    const mockCasesWithId = mockCases.value.map((caseItem, index) => ({
      ...caseItem,
      id: caseItem.id || (Date.now() + index),
      createTime: caseItem.createTime || new Date().toISOString(),
      lastUpdateTime: new Date().toISOString()
    }))
    
    // 保存模拟数据到本地存储
    localStorage.setItem('cases', JSON.stringify(mockCasesWithId))
    return mockCasesWithId
  }
  
  return []
});

// Filter cases based on search and filter options
const filteredCases = computed(() => {
  return cases.value.filter((caseItem: any) => {
    // Search text filter
    const matchesSearch = !searchText.value || 
                         (caseItem.patientName || '').toLowerCase().includes(searchText.value.toLowerCase()) ||
                         (caseItem.caseNumber || '').toLowerCase().includes(searchText.value.toLowerCase()) ||
                         (caseItem.examPart || '').toLowerCase().includes(searchText.value.toLowerCase());
    
    // Status filter
    const matchesStatus = activeTab.value === 'all' || caseItem.status === activeTab.value;
    
    // Priority filter
    const matchesPriority = !priorityFilter.value || caseItem.priority === priorityFilter.value;
    
    // Date filter
    const matchesDate = checkDateFilter(caseItem.createTime, dateFilter.value);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });
});

// Paginated cases
const paginatedCases = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredCases.value.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredCases.value.length / pagination.pageSize);
});

// Visible pages for pagination
const visiblePages = computed(() => {
  const pages = [];
  const current = pagination.currentPage;
  const total = totalPages.value;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }
  
  return pages;
});

// 工具方法
const checkDateFilter = (createTime: string, filter: string) => {
  const now = new Date();
  const caseDate = new Date(createTime);
  const daysDiff = Math.floor((now.getTime() - caseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  switch (filter) {
    case '1': return daysDiff <= 1;
    case '3': return daysDiff <= 3;
    case '7': return daysDiff <= 7;
    case '30': return daysDiff <= 30;
    default: return true;
  }
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    processing: '诊断中',
    completed: '已完成',
    rejected: '已拒绝'
  };
  return statusMap[status] || status;
};


const formatDate = (dateString: string) => {
  return dateString.split(' ')[0]; // 只显示日期部分
};

// 事件处理方法
const setActiveTab = (tab: string) => {
  activeTab.value = tab;
  pagination.currentPage = 1;
};

const setViewMode = (mode: string) => {
  viewMode.value = mode;
};

const handleSearch = () => {
  pagination.currentPage = 1;
};

const handleFilterChange = () => {
  pagination.currentPage = 1;
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    pagination.currentPage = page;
  }
};

// 病例操作
const navigateToCreate = () => {
  router.push('/dashboard/doctor/case-management/new');
};

const viewCase = (caseId: number) => {
  router.push(`/cases/${caseId}`);
};

const viewReport = (caseId: number) => {
  router.push(`/cases/${caseId}/report`);
};

const changeStatus = (caseId: number) => {
  router.push(`/dashboard/doctor/case-management/status/${caseId}`);
};

// 初始化
onMounted(() => {
  isLoading.value = false;
  pagination.total = cases.value.length;
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.case-management-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  padding: 24px;
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
  display: flex;
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

/* 主要内容卡片 */
.content-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  margin: 0 24px;
}

/* 搜索和筛选 */
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

/* 标签页 */
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

/* 表格容器 */
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

/* 状态标签 */
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

/* 操作链接 */
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

/* 网格视图 */
.grid-container {
  margin-top: 16px;
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.case-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.case-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #1890ff;
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.case-number {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.case-info {
  margin-bottom: 12px;
}

.patient-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.patient-details {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.exam-info {
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
}

.department {
  color: #999;
  font-size: 12px;
}

.case-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.create-time {
  color: #999;
  font-size: 12px;
}

.case-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  font-size: 12px;
  color: #1890ff;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #e6f7ff;
  border-color: #1890ff;
}

/* 分页 */
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

/* 响应式设计 */
@media (max-width: 768px) {
  .content-card {
    margin: 0 12px;
    padding: 16px;
  }
  
  .search-filter-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .search-box {
    max-width: none;
  }
  
  .filter-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .case-grid {
    grid-template-columns: 1fr;
}

.pagination {
    flex-direction: column;
    gap: 12px;
  }
}
</style>