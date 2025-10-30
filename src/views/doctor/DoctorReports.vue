<template>
  <div class="doctor-reports-page">
    <div class="page-header">
      <div class="header-left">
        <h1>报告中心</h1>
        <p>管理您的医学影像诊断报告</p>
      </div>
      <button class="btn-primary" @click="goToNewReport">
        新建报告
      </button>
    </div>
    
    <div class="toolbar">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="搜索报告编号、患者姓名..." 
          v-model="searchText"
        >
      </div>
      <div class="filter-controls">
        <select v-model="filterStatus">
          <option value="">全部状态</option>
          <option value="draft">草稿</option>
          <option value="completed">已完成</option>
          <option value="archived">已归档</option>
        </select>
        <select v-model="filterDateRange">
          <option value="7">近7天</option>
          <option value="30">近30天</option>
          <option value="90">近90天</option>
          <option value="365">近一年</option>
        </select>
      </div>
    </div>

    <div class="reports-table-container">
      <table class="reports-table">
        <thead>
          <tr>
            <th>报告编号</th>
            <th>患者姓名</th>
            <th>报告类型</th>
            <th>检查部位</th>
            <th>报告日期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in filteredReports" :key="report.id">
            <td>{{ report.reportNo }}</td>
            <td>{{ report.patientName }}</td>
            <td>{{ report.reportType }}</td>
            <td>{{ report.examPart }}</td>
            <td>{{ report.reportDate }}</td>
            <td>
              <span :class="['status-badge', report.status]">
                {{ getStatusText(report.status) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-view" @click="viewReport(report.id)">查看</button>
                <button class="btn-edit" @click="editReport(report.id)">编辑</button>
                <button class="btn-download" @click="downloadReport(report.id)">下载</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredReports.length === 0">
            <td colspan="7" class="empty-state">
              <div class="empty-icon">📄</div>
              <p>暂无报告记录</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        上一页
      </button>
      <span class="page-info">
        第 {{ currentPage }} / {{ totalPages }} 页
      </span>
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchText = ref('')
const filterStatus = ref('')
const filterDateRange = ref('30')
const currentPage = ref(1)
const pageSize = ref(10)

// 报告数据 - 默认数据和localStorage数据合并
const reports = ref([
  {
    id: 1,
    reportNo: 'RPT-2024-001',
    patientName: '张美丽',
    reportType: 'DR检查',
    examPart: '腰椎(L1-L5)',
    reportDate: '2024-01-15',
    status: 'completed'
  },
  {
    id: 2,
    reportNo: 'RPT-2024-002',
    patientName: '李明',
    reportType: 'CT检查',
    examPart: '胸部',
    reportDate: '2024-01-14',
    status: 'completed'
  },
  {
    id: 3,
    reportNo: 'RPT-2024-003',
    patientName: '王芳',
    reportType: 'MRI检查',
    examPart: '头颅',
    reportDate: '2024-01-13',
    status: 'draft'
  },
  {
    id: 4,
    reportNo: 'RPT-2024-004',
    patientName: '刘强',
    reportType: 'DR检查',
    examPart: '膝关节',
    reportDate: '2024-01-12',
    status: 'completed'
  },
  {
    id: 5,
    reportNo: 'RPT-2024-005',
    patientName: '陈静',
    reportType: '超声检查',
    examPart: '腹部',
    reportDate: '2024-01-11',
    status: 'archived'
  }
])

// 页面加载时从localStorage读取保存的报告
onMounted(() => {
  const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]')
  if (savedReports.length > 0) {
    // 将localStorage的报告添加到数组开头
    reports.value = [...savedReports, ...reports.value]
  }
})

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    completed: '已完成',
    archived: '已归档'
  }
  return statusMap[status] || status
}

const filteredReports = computed(() => {
  let result = reports.value

  // 搜索过滤
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    result = result.filter(r => 
      r.reportNo.toLowerCase().includes(search) ||
      r.patientName.toLowerCase().includes(search)
    )
  }

  // 状态过滤
  if (filterStatus.value) {
    result = result.filter(r => r.status === filterStatus.value)
  }

  // 日期过滤（简化实现）
  if (filterDateRange.value) {
    const days = parseInt(filterDateRange.value)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    result = result.filter(r => {
      const reportDate = new Date(r.reportDate)
      return reportDate >= cutoffDate
    })
  }

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(reports.value.length / pageSize.value)
})

const goToNewReport = () => {
  router.push({ name: 'doctor.reportEditor' })
}

const viewReport = (id: number | string) => {
  router.push({ name: 'doctor.reportDetail', params: { id: String(id) } })
}

const editReport = (id: number | string) => {
  router.push({ name: 'doctor.reportEditor', params: { id: String(id) } })
}

const downloadReport = (id: number | string) => {
  // 询问是否打印PDF
  if (confirm('是否需要打印PDF版本报告？')) {
    // 跳转到报告详情页，在详情页点击打印时会调用exportToPDF
    router.push({ name: 'doctor.reportDetail', params: { id: String(id) } })
    // 延迟执行导出PDF，等待页面加载完成
    setTimeout(() => {
      const detailPage = document.querySelector('.report-detail-page')
      if (detailPage) {
        // 触发导出PDF按钮点击
        const exportBtn = document.querySelector('.btn-primary') as HTMLButtonElement
        if (exportBtn) {
          exportBtn.click()
        }
      }
    }, 500)
  }
}
</script>

<style scoped>
.doctor-reports-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.header-left h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.header-left p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.btn-primary {
  background-color: #409EFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #66b1ff;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.search-bar {
  flex: 1;
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
}

.search-bar input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-controls select {
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.reports-table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
}

.reports-table thead {
  background: #fafafa;
}

.reports-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
}

.reports-table td {
  padding: 16px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.reports-table tbody tr:hover {
  background: #f9fafb;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.draft {
  background: #fff7e6;
  color: #d48806;
}

.status-badge.completed {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.archived {
  background: #f0f0f0;
  color: #8c8c8c;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons button {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view {
  background: white;
  color: #409EFF;
}

.btn-view:hover {
  background: #ecf5ff;
  border-color: #409EFF;
}

.btn-edit {
  background: white;
  color: #67c23a;
}

.btn-edit:hover {
  background: #f0f9ff;
  border-color: #67c23a;
}

.btn-download {
  background: white;
  color: #909399;
}

.btn-download:hover {
  background: #f9fafb;
  border-color: #909399;
}

.empty-state {
  text-align: center;
  padding: 60px 20px !important;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #9ca3af;
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background: #409EFF;
  color: white;
  border-color: #409EFF;
}

.page-info {
  font-size: 14px;
  color: #606266;
}

@media (max-width: 768px) {
  .doctor-reports-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .btn-primary {
    width: 100%;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar {
    max-width: none;
  }

  .filter-controls {
    flex-direction: column;
  }

  .reports-table-container {
    overflow-x: auto;
  }

  .reports-table {
    min-width: 800px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
