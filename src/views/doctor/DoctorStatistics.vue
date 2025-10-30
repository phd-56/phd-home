<template>
  <div class="doctor-statistics">
    <div class="page-header">
      <div>
        <h1 class="page-title">数据统计</h1>
        <p class="page-description">查看您的工作数据与绩效表现</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">总接诊量</span>
          <span class="stat-change positive">↑ +12.5%</span>
        </div>
        <div class="stat-value">128</div>
        <div class="stat-detail">较上个月增加14例</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">本月完成</span>
          <span class="stat-change positive">↑ +8.7%</span>
        </div>
        <div class="stat-value">86</div>
        <div class="stat-detail">已完成86份诊断报告</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">平均处理时间</span>
          <span class="stat-change negative">↓ -12.3%</span>
        </div>
        <div class="stat-value">35m</div>
        <div class="stat-detail">每份报告平均用时</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">准确率</span>
          <span class="stat-change positive">↑ +2.1%</span>
        </div>
        <div class="stat-value">94.5%</div>
        <div class="stat-detail">AI诊断准确率提升</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <!-- 工作量趋势 -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">月度工作量趋势</h3>
            <p class="chart-subtitle">近6个月完成量变化</p>
          </div>
          <div class="chart-actions">
            <button class="chart-btn active">月</button>
            <button class="chart-btn">季</button>
            <button class="chart-btn">年</button>
          </div>
        </div>
        <div class="chart-content">
          <div class="bar-chart">
            <div class="bar-item">
              <div class="bar" style="height: 60%;"></div>
              <div class="bar-label">3月</div>
              <div class="bar-value">64</div>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 80%;"></div>
              <div class="bar-label">4月</div>
              <div class="bar-value">82</div>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 100%;"></div>
              <div class="bar-label">5月</div>
              <div class="bar-value">96</div>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 70%;"></div>
              <div class="bar-label">6月</div>
              <div class="bar-value">74</div>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 55%;"></div>
              <div class="bar-label">7月</div>
              <div class="bar-value">68</div>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 90%;"></div>
              <div class="bar-label">8月</div>
              <div class="bar-value">86</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 疾病分类分布 -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">疾病分类分布</h3>
            <p class="chart-subtitle">各类疾病的诊断占比</p>
          </div>
        </div>
        <div class="chart-content">
          <div class="pie-chart-container">
            <div class="pie-circle">
              <div class="pie-center">
                <div class="pie-value">100%</div>
                <div class="pie-label">总病例</div>
              </div>
            </div>
            <div class="pie-legend">
              <div class="legend-item">
                <div class="legend-color" style="background: #3b82f6;"></div>
                <span>半月板损伤 (35%)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #f59e0b;"></div>
                <span>骨折 (28%)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #ef4444;"></div>
                <span>韧带损伤 (18%)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #16a34a;"></div>
                <span>关节炎 (12%)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #a855f7;"></div>
                <span>其他 (7%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细数据表格 -->
    <div class="table-card">
      <div class="table-header">
        <h3 class="table-title">最近诊断记录</h3>
        <div class="table-actions">
          <button class="action-btn" @click="exportToExcel">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出数据
          </button>
        </div>
      </div>
      <div class="table-content">
        <table class="data-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>患者姓名</th>
              <th>诊断类型</th>
              <th>诊断时间</th>
              <th>处理时长</th>
              <th>准确率</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in displayedRecords" :key="index">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ item.patientName }}</td>
              <td>{{ item.diagnosisType }}</td>
              <td>{{ item.diagnosisTime }}</td>
              <td>{{ item.duration }}</td>
              <td>
                <span class="accuracy-badge" :class="getAccuracyClass(item.accuracy)">
                  {{ item.accuracy }}
                </span>
              </td>
              <td>
                <span class="status-badge" :class="item.status">
                  {{ item.statusText }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-pagination">
        <div class="pagination-info">显示 {{ (currentPage - 1) * pageSize + 1 }} 至 {{ Math.min(currentPage * pageSize, recentRecords.length) }} 条，共 {{ recentRecords.length }} 条</div>
        <div class="pagination-controls" v-if="shouldShowPagination">
          <button class="page-btn" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
          <button class="page-btn" :class="{ active: currentPage === 1 }" @click="goToPage(1)">1</button>
          <button class="page-btn" v-if="totalPages >= 2" :class="{ active: currentPage === 2 }" @click="goToPage(2)">2</button>
          <button class="page-btn" v-if="totalPages >= 3" :class="{ active: currentPage === 3 }" @click="goToPage(3)">3</button>
          <button class="page-btn" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import { ElMessage } from 'element-plus'

const recentRecords = ref([
  { patientName: '张三', diagnosisType: '半月板损伤', diagnosisTime: '2023-08-15 14:30', duration: '28分钟', accuracy: '95%', status: 'completed', statusText: '已完成' },
  { patientName: '李四', diagnosisType: '膝关节骨折', diagnosisTime: '2023-08-15 10:15', duration: '42分钟', accuracy: '92%', status: 'completed', statusText: '已完成' },
  { patientName: '王五', diagnosisType: '韧带损伤', diagnosisTime: '2023-08-14 16:45', duration: '35分钟', accuracy: '96%', status: 'completed', statusText: '已完成' },
  { patientName: '赵六', diagnosisType: '关节炎', diagnosisTime: '2023-08-14 11:20', duration: '22分钟', accuracy: '89%', status: 'completed', statusText: '已完成' },
  { patientName: '孙七', diagnosisType: '半月板损伤', diagnosisTime: '2023-08-13 15:10', duration: '31分钟', accuracy: '94%', status: 'completed', statusText: '已完成' },
  { patientName: '周八', diagnosisType: '骨折', diagnosisTime: '2023-08-13 09:30', duration: '48分钟', accuracy: '91%', status: 'completed', statusText: '已完成' },
  { patientName: '吴九', diagnosisType: '韧带损伤', diagnosisTime: '2023-08-12 14:00', duration: '26分钟', accuracy: '97%', status: 'completed', statusText: '已完成' },
  { patientName: '郑十', diagnosisType: '关节炎', diagnosisTime: '2023-08-12 10:45', duration: '19分钟', accuracy: '93%', status: 'completed', statusText: '已完成' },
  { patientName: '钱十一', diagnosisType: '半月板损伤', diagnosisTime: '2023-08-11 16:20', duration: '33分钟', accuracy: '90%', status: 'completed', statusText: '已完成' },
  { patientName: '孙十二', diagnosisType: '骨折', diagnosisTime: '2023-08-11 13:15', duration: '45分钟', accuracy: '93%', status: 'completed', statusText: '已完成' },
  { patientName: '李十三', diagnosisType: '脊柱骨折', diagnosisTime: '2023-08-10 16:30', duration: '52分钟', accuracy: '88%', status: 'completed', statusText: '已完成' },
  { patientName: '王十四', diagnosisType: '颈椎病', diagnosisTime: '2023-08-10 14:20', duration: '38分钟', accuracy: '94%', status: 'completed', statusText: '已完成' },
  { patientName: '张十五', diagnosisType: '半月板损伤', diagnosisTime: '2023-08-09 11:15', duration: '29分钟', accuracy: '92%', status: 'completed', statusText: '已完成' },
  { patientName: '刘十六', diagnosisType: '骨关节炎', diagnosisTime: '2023-08-09 09:45', duration: '41分钟', accuracy: '96%', status: 'completed', statusText: '已完成' }
])

const currentPage = ref(1)
const pageSize = 10

// 计算总页数
const totalPages = computed(() => Math.ceil(recentRecords.value.length / pageSize))

// 计算是否需要显示分页按钮
const shouldShowPagination = computed(() => recentRecords.value.length > pageSize)

// 计算当前页显示的数据
const displayedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return recentRecords.value.slice(start, end)
})

const getAccuracyClass = (accuracy: string) => {
  const num = parseInt(accuracy)
  if (num >= 95) return 'high'
  if (num >= 90) return 'medium'
  return 'low'
}

// 分页跳转
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 导出为Excel
const exportToExcel = () => {
  try {
    // 准备Excel数据
    const excelData = recentRecords.value.map((record, index) => ({
      '序号': index + 1,
      '患者姓名': record.patientName,
      '诊断类型': record.diagnosisType,
      '诊断时间': record.diagnosisTime,
      '处理时长': record.duration,
      '准确率': record.accuracy,
      '状态': record.statusText
    }))

    // 创建工作簿
    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '诊断记录')

    // 生成文件名（包含当前日期）
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    const fileName = `诊断记录统计_${dateStr}.xlsx`

    // 导出文件
    XLSX.writeFile(wb, fileName)
    
    ElMessage.success('导出成功！')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请重试')
  }
}
</script>

<style scoped>
.doctor-statistics {
  background: #f5f7fa;
  min-height: 100%;
  padding: 32px;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-description {
  font-size: 14px;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: #16a34a;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.stat-detail {
  font-size: 12px;
  color: #9ca3af;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.chart-subtitle {
  font-size: 12px;
  color: #6b7280;
}

.chart-actions {
  display: flex;
  gap: 8px;
}

.chart-btn {
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.chart-btn:hover {
  background: #f9fafb;
}

.chart-btn.active {
  background: #1e40af;
  color: white;
  border-color: #1e40af;
}

.chart-content {
  height: 300px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 100%;
  gap: 12px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.bar-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.bar-value {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.pie-chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 32px;
}

.pie-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    #3b82f6 0deg 126deg,
    #f59e0b 126deg 226.8deg,
    #ef4444 226.8deg 295.2deg,
    #16a34a 295.2deg 331.2deg,
    #a855f7 331.2deg 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pie-center {
  width: 140px;
  height: 140px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pie-value {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
}

.pie-label {
  font-size: 12px;
  color: #9ca3af;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #374151;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.table-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.table-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f9fafb;
  color: #374151;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f9fafb;
}

.data-table th {
  padding: 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 12px;
  font-size: 14px;
  color: #6b7280;
  border-bottom: 1px solid #f3f4f6;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.accuracy-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.accuracy-badge.high {
  background: #d1fae5;
  color: #065f46;
}

.accuracy-badge.medium {
  background: #fef3c7;
  color: #92400e;
}

.accuracy-badge.low {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: #dbeafe;
  color: #1e40af;
}

.table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.page-btn {
  padding: 8px 16px;
  font-size: 14px;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover {
  background: #f9fafb;
}

.page-btn.active {
  background: #1e40af;
  color: white;
  border-color: #1e40af;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f9fafb;
}

@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .doctor-statistics {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .table-pagination {
    flex-direction: column;
    gap: 12px;
  }
}
</style>

