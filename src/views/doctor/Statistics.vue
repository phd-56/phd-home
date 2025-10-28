<template>
  <div class="statistics-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>数据统计</h1>
      <p>系统运行数据统计与分析</p>
    </div>

    <!-- 统计概览卡片 -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">
          <div class="icon-bg blue">📊</div>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalDiagnoses }}</div>
          <div class="stat-label">总诊断次数</div>
          <div class="stat-change up">↑ 12.5%</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <div class="icon-bg green">🎯</div>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ accuracyRate }}%</div>
          <div class="stat-label">诊断准确率</div>
          <div class="stat-change up">↑ 2.3%</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <div class="icon-bg purple">⏱️</div>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ avgTime }}s</div>
          <div class="stat-label">平均诊断时间</div>
          <div class="stat-change down">↓ 15.2%</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <div class="icon-bg orange">👥</div>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ activeUsers }}</div>
          <div class="stat-label">活跃用户</div>
          <div class="stat-change up">↑ 8.7%</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 诊断趋势图 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>诊断趋势分析</h3>
          <div class="chart-controls">
            <el-select v-model="trendPeriod" size="small" @change="updateTrendChart">
              <el-option label="最近7天" value="7d" />
              <el-option label="最近30天" value="30d" />
              <el-option label="最近3个月" value="3m" />
            </el-select>
          </div>
        </div>
        <div class="chart-content">
          <div class="line-chart">
            <div class="chart-bars">
              <div 
                v-for="(item, index) in trendData" 
                :key="index"
                class="chart-bar"
                :style="{ height: `${(item.value / Math.max(...trendData.map(d => d.value))) * 100}%` }"
              >
                <div class="bar-value">{{ item.value }}</div>
              </div>
            </div>
            <div class="chart-labels">
              <span v-for="(item, index) in trendData" :key="index">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 疾病分布图 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>疾病类型分布</h3>
          <div class="chart-controls">
            <el-button size="small" @click="refreshDiseaseData">刷新</el-button>
          </div>
        </div>
        <div class="chart-content">
          <div class="pie-chart-container">
            <div class="pie-chart">
              <div class="pie-circle">
                <div class="pie-center">
                  <div class="pie-percentage">{{ totalCases }}</div>
                  <div class="pie-label">总病例</div>
                </div>
              </div>
            </div>
            <div class="pie-legend">
              <div 
                v-for="(item, index) in diseaseData" 
                :key="index"
                class="legend-item"
              >
                <div 
                  class="legend-color" 
                  :style="{ backgroundColor: item.color }"
                ></div>
                <span>{{ item.name }} ({{ item.percentage }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细统计表格 -->
    <div class="table-section">
      <div class="table-header">
        <h3>详细统计数据</h3>
        <div class="table-controls">
          <el-button type="primary" @click="exportStatistics">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </div>
      </div>
      <el-table :data="tableData" stripe>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="diagnoses" label="诊断次数" width="100" />
        <el-table-column prop="accuracy" label="准确率" width="100">
          <template #default="{ row }">
            <span :class="row.accuracy >= 95 ? 'text-green-600' : 'text-orange-600'">
              {{ row.accuracy }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="avgTime" label="平均时间(s)" width="120" />
        <el-table-column prop="users" label="活跃用户" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : 'warning'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 统计数据
const totalDiagnoses = ref(1248)
const accuracyRate = ref(96.8)
const avgTime = ref(3.2)
const activeUsers = ref(156)
const totalCases = ref(100)

// 图表数据
const trendPeriod = ref('7d')
const trendData = reactive([
  { label: '周一', value: 45 },
  { label: '周二', value: 52 },
  { label: '周三', value: 48 },
  { label: '周四', value: 61 },
  { label: '周五', value: 58 },
  { label: '周六', value: 35 },
  { label: '周日', value: 28 }
])

const diseaseData = reactive([
  { name: '半月板损伤', percentage: 35, color: '#3b82f6' },
  { name: '骨折', percentage: 25, color: '#f59e0b' },
  { name: '韧带损伤', percentage: 20, color: '#ef4444' },
  { name: '关节炎', percentage: 15, color: '#22c55e' },
  { name: '其他', percentage: 5, color: '#8b5cf6' }
])

// 表格数据
const tableData = reactive([
  { date: '2024-01-15', diagnoses: 45, accuracy: 96.8, avgTime: 3.2, users: 156, status: '正常' },
  { date: '2024-01-14', diagnoses: 52, accuracy: 97.1, avgTime: 3.1, users: 148, status: '正常' },
  { date: '2024-01-13', diagnoses: 48, accuracy: 96.5, avgTime: 3.3, users: 142, status: '正常' },
  { date: '2024-01-12', diagnoses: 61, accuracy: 97.3, avgTime: 2.9, users: 163, status: '正常' },
  { date: '2024-01-11', diagnoses: 58, accuracy: 96.9, avgTime: 3.0, users: 159, status: '正常' }
])

// 方法
const updateTrendChart = () => {
  ElMessage.success(`已切换到${trendPeriod.value === '7d' ? '最近7天' : trendPeriod.value === '30d' ? '最近30天' : '最近3个月'}数据`)
}

const refreshDiseaseData = () => {
  ElMessage.success('疾病分布数据已刷新')
}

const exportStatistics = () => {
  ElMessage.success('统计数据导出成功')
}

onMounted(() => {
  // 初始化数据
  console.log('数据统计页面已加载')
})
</script>

<style scoped>
.statistics-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-header p {
  color: #6b7280;
  font-size: 14px;
}

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.icon-bg {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.icon-bg.blue {
  background: #dbeafe;
  color: #1e40af;
}

.icon-bg.green {
  background: #dcfce7;
  color: #16a34a;
}

.icon-bg.purple {
  background: #f3e8ff;
  color: #9333ea;
}

.icon-bg.orange {
  background: #fed7aa;
  color: #ea580c;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.up {
  color: #16a34a;
}

.stat-change.down {
  color: #dc2626;
}

/* 图表区域 */
.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.chart-content {
  height: 300px;
}

/* 折线图样式 */
.line-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  height: 240px;
  gap: 8px;
  padding: 0 20px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.3s ease;
}

.chart-bar:hover {
  opacity: 0.8;
}

.bar-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px 0;
  font-size: 12px;
  color: #6b7280;
}

/* 饼图样式 */
.pie-chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.pie-chart {
  display: flex;
  align-items: center;
  gap: 32px;
}

.pie-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    #3b82f6 0deg 126deg,
    #f59e0b 126deg 216deg,
    #ef4444 216deg 288deg,
    #22c55e 288deg 342deg,
    #8b5cf6 342deg 360deg
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

.pie-percentage {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
}

.pie-label {
  font-size: 12px;
  color: #999;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* 表格区域 */
.table-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .statistics-page {
    padding: 16px;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .pie-chart {
    flex-direction: column;
    gap: 16px;
  }
  
  .pie-circle {
    width: 150px;
    height: 150px;
  }
  
  .pie-center {
    width: 100px;
    height: 100px;
  }
  
  .pie-percentage {
    font-size: 24px;
  }
}
</style>
