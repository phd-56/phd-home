<template>
  <div class="system-monitor">
    <div class="page-header">
      <h2>系统监控</h2>
      <div class="header-actions">
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
        <el-button type="primary" @click="exportReport">
          <el-icon><Document /></el-icon>
          导出报告
        </el-button>
      </div>
    </div>

    <!-- 系统概览 -->
    <div class="overview-section">
      <h3>系统概览</h3>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="overview-card">
            <div class="card-icon cpu">
              <el-icon><Cpu /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-value">{{ systemStatus.cpuUsage }}%</div>
              <div class="card-label">CPU使用率</div>
              <el-progress 
                :percentage="systemStatus.cpuUsage" 
                :color="getUsageColor(systemStatus.cpuUsage)"
                :show-text="false"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="overview-card">
            <div class="card-icon memory">
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-value">{{ systemStatus.memoryUsage }}%</div>
              <div class="card-label">内存使用率</div>
              <el-progress 
                :percentage="systemStatus.memoryUsage" 
                :color="getUsageColor(systemStatus.memoryUsage)"
                :show-text="false"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="overview-card">
            <div class="card-icon storage">
              <el-icon><HardDisk /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-value">{{ systemStatus.storageUsage }}%</div>
              <div class="card-label">存储使用率</div>
              <el-progress 
                :percentage="systemStatus.storageUsage" 
                :color="getUsageColor(systemStatus.storageUsage)"
                :show-text="false"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="overview-card">
            <div class="card-icon network">
              <el-icon><Connection /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-value">{{ systemStatus.activeUsers }}</div>
              <div class="card-label">活跃用户</div>
              <div class="card-trend">
                <el-icon :color="systemStatus.userTrend > 0 ? '#67c23a' : '#f56c6c'">
                  <TrendCharts />
                </el-icon>
                <span :class="systemStatus.userTrend > 0 ? 'up' : 'down'">
                  {{ systemStatus.userTrend > 0 ? '+' : '' }}{{ systemStatus.userTrend }}
                </span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 性能图表 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="chart-card">
            <h4>CPU使用率趋势</h4>
            <div ref="cpuChart" class="chart-container"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-card">
            <h4>内存使用趋势</h4>
            <div ref="memoryChart" class="chart-container"></div>
          </div>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <div class="chart-card">
            <h4>存储使用趋势</h4>
            <div ref="storageChart" class="chart-container"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-card">
            <h4>用户访问趋势</h4>
            <div ref="userChart" class="chart-container"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 服务状态 -->
    <div class="services-section">
      <h3>服务状态</h3>
      <el-table :data="serviceStatus" style="width: 100%">
        <el-table-column prop="name" label="服务名称" width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'running' ? 'success' : 'danger'">
              {{ row.status === 'running' ? '运行中' : '停止' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="uptime" label="运行时间" width="150" />
        <el-table-column prop="cpu" label="CPU占用" width="120">
          <template #default="{ row }">
            {{ row.cpu }}%
          </template>
        </el-table-column>
        <el-table-column prop="memory" label="内存占用" width="120">
          <template #default="{ row }">
            {{ row.memory }}MB
          </template>
        </el-table-column>
        <el-table-column prop="responseTime" label="响应时间" width="120">
          <template #default="{ row }">
            {{ row.responseTime }}ms
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 'running'" 
              link 
              type="warning" 
              @click="restartService(row.name)"
            >
              重启
            </el-button>
            <el-button 
              v-else 
              link 
              type="success" 
              @click="startService(row.name)"
            >
              启动
            </el-button>
            <el-button link type="danger" @click="stopService(row.name)">
              停止
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 告警信息 -->
    <div class="alerts-section">
      <h3>系统告警</h3>
      <div class="alerts-list">
        <div
          v-for="alert in systemAlerts"
          :key="alert.id"
          :class="['alert-item', alert.level]"
        >
          <div class="alert-icon">
            <el-icon v-if="alert.level === 'critical'"><WarningFilled /></el-icon>
            <el-icon v-else-if="alert.level === 'warning'"><Warning /></el-icon>
            <el-icon v-else><InfoFilled /></el-icon>
          </div>
          <div class="alert-content">
            <div class="alert-title">{{ alert.title }}</div>
            <div class="alert-message">{{ alert.message }}</div>
            <div class="alert-time">{{ formatTime(alert.timestamp) }}</div>
          </div>
          <div class="alert-actions">
            <el-button link @click="handleAlert(alert.id)">处理</el-button>
            <el-button link @click="ignoreAlert(alert.id)">忽略</el-button>
          </div>
        </div>
      </div>
      
      <div v-if="systemAlerts.length === 0" class="no-alerts">
        <el-empty description="暂无系统告警" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Document, Cpu, Monitor, HardDisk, Connection, TrendCharts, WarningFilled, Warning, InfoFilled } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

interface SystemStatus {
  cpuUsage: number
  memoryUsage: number
  storageUsage: number
  activeUsers: number
  userTrend: number
}

interface ServiceStatus {
  name: string
  status: 'running' | 'stopped'
  uptime: string
  cpu: number
  memory: number
  responseTime: number
}

interface SystemAlert {
  id: string
  title: string
  message: string
  level: 'info' | 'warning' | 'critical'
  timestamp: string
}

const cpuChart = ref<HTMLElement>()
const memoryChart = ref<HTMLElement>()
const storageChart = ref<HTMLElement>()
const userChart = ref<HTMLElement>()

let cpuChartInstance: echarts.ECharts | null = null
let memoryChartInstance: echarts.ECharts | null = null
let storageChartInstance: echarts.ECharts | null = null
let userChartInstance: echarts.ECharts | null = null

const systemStatus = reactive<SystemStatus>({
  cpuUsage: 45,
  memoryUsage: 68,
  storageUsage: 72,
  activeUsers: 42,
  userTrend: 3
})

const serviceStatus = ref<ServiceStatus[]>([
  {
    name: 'Web服务器',
    status: 'running',
    uptime: '15天8小时',
    cpu: 12,
    memory: 256,
    responseTime: 45
  },
  {
    name: '数据库服务',
    status: 'running',
    uptime: '15天8小时',
    cpu: 28,
    memory: 512,
    responseTime: 12
  },
  {
    name: 'AI推理服务',
    status: 'running',
    uptime: '3天2小时',
    cpu: 35,
    memory: 1024,
    responseTime: 85
  },
  {
    name: '文件存储服务',
    status: 'running',
    uptime: '15天8小时',
    cpu: 8,
    memory: 128,
    responseTime: 23
  },
  {
    name: '日志服务',
    status: 'stopped',
    uptime: '-',
    cpu: 0,
    memory: 0,
    responseTime: 0
  }
])

const systemAlerts = ref<SystemAlert[]>([
  {
    id: 'alert1',
    title: '存储空间不足',
    message: '系统存储使用率已超过70%，建议清理或扩容',
    level: 'warning',
    timestamp: '2024-01-18T14:30:00'
  },
  {
    id: 'alert2',
    title: 'AI服务响应延迟',
    message: 'AI推理服务平均响应时间超过80ms',
    level: 'warning',
    timestamp: '2024-01-18T13:45:00'
  },
  {
    id: 'alert3',
    title: '数据库连接数接近上限',
    message: '当前数据库连接数已达到最大连接数的85%',
    level: 'info',
    timestamp: '2024-01-18T12:15:00'
  }
])

const getUsageColor = (usage: number) => {
  if (usage >= 80) return '#f56c6c'
  if (usage >= 60) return '#e6a23c'
  return '#67c23a'
}

const initCharts = () => {
  if (cpuChart.value) {
    cpuChartInstance = echarts.init(cpuChart.value)
    cpuChartInstance.setOption({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59']
      },
      yAxis: {
        type: 'value',
        max: 100
      },
      series: [{
        data: [32, 28, 45, 52, 48, 38, 35],
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          color: '#409eff'
        },
        itemStyle: {
          color: '#409eff'
        }
      }]
    })
  }

  if (memoryChart.value) {
    memoryChartInstance = echarts.init(memoryChart.value)
    memoryChartInstance.setOption({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59']
      },
      yAxis: {
        type: 'value',
        max: 100
      },
      series: [{
        data: [45, 52, 58, 65, 68, 62, 58],
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          color: '#67c23a'
        },
        itemStyle: {
          color: '#67c23a'
        }
      }]
    })
  }

  if (storageChart.value) {
    storageChartInstance = echarts.init(storageChart.value)
    storageChartInstance.setOption({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['1月12', '1月13', '1月14', '1月15', '1月16', '1月17', '1月18']
      },
      yAxis: {
        type: 'value',
        max: 100
      },
      series: [{
        data: [58, 62, 65, 68, 70, 71, 72],
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          color: '#e6a23c'
        },
        itemStyle: {
          color: '#e6a23c'
        }
      }]
    })
  }

  if (userChart.value) {
    userChartInstance = echarts.init(userChart.value)
    userChartInstance.setOption({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['1月12', '1月13', '1月14', '1月15', '1月16', '1月17', '1月18']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [28, 32, 35, 38, 40, 39, 42],
        type: 'bar',
        itemStyle: {
          color: '#f56c6c'
        }
      }]
    })
  }
}

const refreshData = () => {
  // 模拟数据刷新
  systemStatus.cpuUsage = Math.floor(Math.random() * 30) + 30
  systemStatus.memoryUsage = Math.floor(Math.random() * 20) + 60
  systemStatus.storageUsage = Math.min(100, systemStatus.storageUsage + 1)
  systemStatus.activeUsers = Math.floor(Math.random() * 10) + 35
  systemStatus.userTrend = Math.floor(Math.random() * 6) - 2

  ElMessage.success('系统数据已刷新')
}

const exportReport = () => {
  ElMessage.success('系统监控报告导出成功')
}

const restartService = async (serviceName: string) => {
  try {
    await ElMessageBox.confirm(
      `确定要重启 ${serviceName} 服务吗？`,
      '重启确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const service = serviceStatus.value.find(s => s.name === serviceName)
    if (service) {
      service.status = 'running'
      service.uptime = '刚刚重启'
      ElMessage.success(`${serviceName} 服务重启成功`)
    }
  } catch (error) {
    // 用户取消操作
  }
}

const startService = async (serviceName: string) => {
  const service = serviceStatus.value.find(s => s.name === serviceName)
  if (service) {
    service.status = 'running'
    service.uptime = '刚刚启动'
    ElMessage.success(`${serviceName} 服务启动成功`)
  }
}

const stopService = async (serviceName: string) => {
  try {
    await ElMessageBox.confirm(
      `确定要停止 ${serviceName} 服务吗？`,
      '停止确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const service = serviceStatus.value.find(s => s.name === serviceName)
    if (service) {
      service.status = 'stopped'
      service.uptime = '-'
      service.cpu = 0
      service.memory = 0
      service.responseTime = 0
      ElMessage.success(`${serviceName} 服务已停止`)
    }
  } catch (error) {
    // 用户取消操作
  }
}

const handleAlert = (alertId: string) => {
  const alert = systemAlerts.value.find(a => a.id === alertId)
  if (alert) {
    ElMessage.info(`处理告警: ${alert.title}`)
    // 这里可以打开处理对话框或跳转到处理页面
  }
}

const ignoreAlert = (alertId: string) => {
  const index = systemAlerts.value.findIndex(a => a.id === alertId)
  if (index > -1) {
    systemAlerts.value.splice(index, 1)
    ElMessage.success('告警已忽略')
  }
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const resizeCharts = () => {
  cpuChartInstance?.resize()
  memoryChartInstance?.resize()
  storageChartInstance?.resize()
  userChartInstance?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', resizeCharts)
})

onUnmounted(() => {
  cpuChartInstance?.dispose()
  memoryChartInstance?.dispose()
  storageChartInstance?.dispose()
  userChartInstance?.dispose()
  window.removeEventListener('resize', resizeCharts)
})
</script>

<style scoped>
.system-monitor {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.overview-section {
  margin-bottom: 24px;
}

.overview-section h3 {
  margin-bottom: 16px;
  color: #333;
}

.overview-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.card-icon.cpu {
  background: #409eff;
}

.card-icon.memory {
  background: #67c23a;
}

.card-icon.storage {
  background: #e6a23c;
}

.card-icon.network {
  background: #f56c6c;
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.card-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.card-trend .up {
  color: #67c23a;
}

.card-trend .down {
  color: #f56c6c;
}

.charts-section {
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-card h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.chart-container {
  height: 300px;
}

.services-section {
  margin-bottom: 24px;
}

.services-section h3 {
  margin-bottom: 16px;
  color: #333;
}

.alerts-section h3 {
  margin-bottom: 16px;
  color: #333;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.alert-item.critical {
  border-left: 4px solid #f56c6c;
}

.alert-item.warning {
  border-left: 4px solid #e6a23c;
}

.alert-item.info {
  border-left: 4px solid #409eff;
}

.alert-icon {
  margin-right: 16px;
  font-size: 20px;
}

.alert-item.critical .alert-icon {
  color: #f56c6c;
}

.alert-item.warning .alert-icon {
  color: #e6a23c;
}

.alert-item.info .alert-icon {
  color: #409eff;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.alert-message {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.alert-time {
  color: #999;
  font-size: 12px;
}

.alert-actions {
  display: flex;
  gap: 8px;
}

.no-alerts {
  margin-top: 40px;
}
</style>