<template>
  <div class="admin-dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">管理仪表盘</h1>
      <p class="page-description">欢迎回来，系统管理员！这里是系统运行的关键指标</p>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">总用户数</span>
          <div class="stat-icon-blue">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
        </div>
        <div class="stat-value-row">
          <div class="stat-number">1,286</div>
          <span class="stat-change positive">↑ +12.9%</span>
        </div>
        <div class="stat-detail">较上月增长</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">活跃医生</span>
          <div class="stat-icon-green">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="stat-value-row">
          <div class="stat-number">86</div>
          <span class="stat-change positive">↑ +13.6%</span>
        </div>
        <div class="stat-detail">较上月增长</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">影像检查量</span>
          <div class="stat-icon-yellow">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
        <div class="stat-value-row">
          <div class="stat-number">5,342</div>
          <span class="stat-change positive">↑ +8.2%</span>
        </div>
        <div class="stat-detail">本月累计</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-label">系统可用性</span>
          <div class="stat-icon-purple">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
        </div>
        <div class="stat-value-row">
          <div class="stat-number">99.98%</div>
          <span class="stat-change negative">↓ -0.02%</span>
        </div>
        <div class="stat-detail">近30天平均</div>
      </el-card>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <el-card class="chart-card-main">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">影像检查量趋势</h3>
            <p class="chart-subtitle">近6个月检查量统计</p>
          </div>
          <div class="chart-buttons">
            <el-button size="small" :type="timeRange === 'month' ? 'primary' : ''" @click="timeRange = 'month'">月</el-button>
            <el-button size="small" :type="timeRange === 'quarter' ? 'primary' : ''" @click="timeRange = 'quarter'">季</el-button>
            <el-button size="small" :type="timeRange === 'year' ? 'primary' : ''" @click="timeRange = 'year'">年</el-button>
          </div>
        </div>
        <div ref="chartContainer1" class="chart-container"></div>
      </el-card>

      <el-card class="chart-card-side">
        <div class="chart-header">
          <h3 class="chart-title">检查类型分布</h3>
          <p class="chart-subtitle">本月各类型检查占比</p>
        </div>
        <div ref="chartContainer2" class="chart-container-small"></div>
        <div class="chart-legend">
          <div class="legend-item">
            <div class="legend-color" style="background: rgb(59, 130, 246)"></div>
            <span>MRI</span>
            <span class="legend-value">32%</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: rgb(34, 197, 94)"></div>
            <span>CT</span>
            <span class="legend-value">28%</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: rgb(234, 179, 8)"></div>
            <span>X光</span>
            <span class="legend-value">22%</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: rgb(168, 85, 247)"></div>
            <span>超声</span>
            <span class="legend-value">18%</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Bottom Section -->
    <div class="bottom-grid">
      <el-card class="status-card">
        <div class="card-header">
          <h3 class="card-title">系统运行状态</h3>
          <p class="card-subtitle">核心服务监控</p>
        </div>
        <div class="service-list">
          <div class="service-item">
            <div class="service-info">
              <div class="status-dot green"></div>
              <span>数据库服务</span>
            </div>
            <span class="status-text">正常运行中</span>
          </div>
          <div class="service-item">
            <div class="service-info">
              <div class="status-dot green"></div>
              <span>存储服务</span>
            </div>
            <span class="status-text">正常运行中</span>
          </div>
          <div class="service-item">
            <div class="service-info">
              <div class="status-dot yellow"></div>
              <span>认证服务</span>
            </div>
            <span class="status-text">正常运行中</span>
          </div>
          <div class="service-item">
            <div class="service-info">
              <div class="status-dot orange"></div>
              <span>影像处理服务</span>
            </div>
            <span class="status-text warning">负载较高</span>
          </div>
          <div class="service-item">
            <div class="service-info">
              <div class="status-dot green"></div>
              <span>消息队列</span>
            </div>
            <span class="status-text">正常运行中</span>
          </div>
        </div>
        <el-button class="full-width-btn" @click="router.push('/admin/monitoring')">
          查看详细系统监控
        </el-button>
      </el-card>

      <el-card class="activity-card">
        <div class="card-header-between">
          <div>
            <h3 class="card-title">最近系统活动</h3>
            <p class="card-subtitle">各类关键操作日志</p>
          </div>
          <el-button text type="primary" @click="refreshActivities">刷新</el-button>
        </div>
        <div class="activity-list">
          <div class="activity-item">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" alt="User" class="activity-avatar">
            <div class="activity-content">
              <div class="activity-header">
                <span class="activity-user">李医生 (放射科)</span>
                <span class="activity-time">2023-08-20 14:32:15</span>
              </div>
              <p class="activity-desc">申请了审核影像检查报告</p>
              <div class="activity-meta">
                <span>192.168.1.105</span>
                <el-tag size="small" type="success">成功</el-tag>
              </div>
            </div>
          </div>
          <div class="activity-item">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="User" class="activity-avatar">
            <div class="activity-content">
              <div class="activity-header">
                <span class="activity-user">系统管理员</span>
                <span class="activity-time">2023-08-20 13:45:08</span>
              </div>
              <p class="activity-desc">添加新用户并配置权限</p>
              <div class="activity-meta">
                <span>10.0.0.24</span>
                <el-tag size="small" type="success">成功</el-tag>
              </div>
            </div>
          </div>
          <div class="activity-item">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user2" alt="User" class="activity-avatar">
            <div class="activity-content">
              <div class="activity-header">
                <span class="activity-user">张医生 (影像)</span>
                <span class="activity-time">2023-08-20 10:12:33</span>
              </div>
              <p class="activity-desc">预约了创建MRI检查</p>
              <div class="activity-meta">
                <span>218.12.45.78</span>
                <el-tag size="small" type="success">成功</el-tag>
              </div>
            </div>
          </div>
          <div class="activity-item">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user3" alt="User" class="activity-avatar">
            <div class="activity-content">
              <div class="activity-header">
                <span class="activity-user">王医生 (神经科)</span>
                <span class="activity-time">2023-08-19 16:28:11</span>
              </div>
              <p class="activity-desc">上传了患者影像MRI影像</p>
              <div class="activity-meta">
                <span>192.168.1.112</span>
                <el-tag size="small" type="warning">等待中</el-tag>
              </div>
            </div>
          </div>
        </div>
        <el-button class="full-width-btn" @click="router.push('/dashboard/admin/audit-logs')">
          查看完整系统日志
        </el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const timeRange = ref<'month' | 'quarter' | 'year'>('quarter')
const chartContainer1 = ref<HTMLElement>()
const chartContainer2 = ref<HTMLElement>()

let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null

// 影像检查量趋势数据
const getTrendData = () => {
  if (timeRange.value === 'month') {
    return {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      data: [420, 480, 520, 580, 620, 580]
    }
  } else if (timeRange.value === 'quarter') {
    return {
      labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
      data: [1420, 1580, 1720, 1680, 1820, 1780]
    }
  } else {
    return {
      labels: ['2022', '2023', '2024'],
      data: [15200, 18600, 21000]
    }
  }
}

// 检查类型分布数据
const examTypeData = [
  { name: 'MRI', value: 32, color: '#3b82f6' },
  { name: 'CT', value: 28, color: '#22c55e' },
  { name: 'X光', value: 22, color: '#eab308' },
  { name: '超声', value: 18, color: '#a855f7' }
]

// 初始化影像检查量趋势折线图
const initTrendChart = () => {
  if (!chartContainer1.value) return
  
  if (chartInstance1) {
    chartInstance1.dispose()
  }
  
  chartInstance1 = echarts.init(chartContainer1.value)
  const trendData = getTrendData()
  
  chartInstance1.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.labels,
      axisLabel: {
        color: '#6b7280',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        formatter: '{value}'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [
      {
        name: '检查量',
        type: 'line',
        smooth: true,
        data: trendData.data,
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        }
      }
    ]
  })
}

// 初始化检查类型分布柱状图
const initDistributionChart = () => {
  if (!chartContainer2.value) return
  
  if (chartInstance2) {
    chartInstance2.dispose()
  }
  
  chartInstance2 = echarts.init(chartContainer2.value)
  
  chartInstance2.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const param = params[0]
        return `${param.name}: ${param.value}%`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: examTypeData.map(item => item.name),
      axisLabel: {
        color: '#6b7280',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        formatter: '{value}%'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [
      {
        name: '占比',
        type: 'bar',
        data: examTypeData.map(item => ({
          value: item.value,
          itemStyle: {
            color: item.color,
            borderRadius: [4, 4, 0, 0]
          }
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'top',
          color: '#1f2937',
          fontSize: 12,
          formatter: '{c}%'
        }
      }
    ]
  })
}

// 监听时间范围变化
watch(timeRange, () => {
  initTrendChart()
})

const refreshActivities = () => {
  // TODO: 刷新活动数据
}

const resizeCharts = () => {
  chartInstance1?.resize()
  chartInstance2?.resize()
}

onMounted(() => {
  initTrendChart()
  initDistributionChart()
  window.addEventListener('resize', resizeCharts)
})

onBeforeUnmount(() => {
  chartInstance1?.dispose()
  chartInstance2?.dispose()
  window.removeEventListener('resize', resizeCharts)
})
</script>

<style scoped>
.admin-dashboard {
  padding: 24px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 32px;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.stat-icon-blue,
.stat-icon-green,
.stat-icon-yellow,
.stat-icon-purple {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-blue {
  background: #dbeafe;
}

.stat-icon-green {
  background: #dcfce7;
}

.stat-icon-yellow {
  background: #fef3c7;
}

.stat-icon-purple {
  background: #f3e8ff;
}

.stat-value-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-detail {
  font-size: 0.75rem;
  color: #9ca3af;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card-main,
.chart-card-side {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.chart-header-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.chart-buttons {
  display: flex;
  gap: 8px;
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart-container-small {
  height: 200px;
  position: relative;
  margin-bottom: 24px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-value {
  margin-left: auto;
  font-weight: 500;
  color: #1f2937;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.status-card,
.activity-card {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.card-header {
  margin-bottom: 24px;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.service-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.service-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #374151;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.green {
  background: #10b981;
}

.status-dot.yellow {
  background: #eab308;
}

.status-dot.orange {
  background: #f97316;
}

.status-text {
  font-size: 0.875rem;
  color: #9ca3af;
}

.status-text.warning {
  color: #eab308;
}

.full-width-btn {
  width: 100%;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.activity-user {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.activity-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.activity-desc {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 4px;
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #9ca3af;
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>