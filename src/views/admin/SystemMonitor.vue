<template>
  <div class="system-monitor-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">系统监控</h1>
        <p class="page-subtitle">实时监控系统运行状态、资源使用情况与服务健康度</p>
      </div>
    </div>
    
    <!-- 系统状态概览 -->
    <el-card class="status-overview-card" shadow="never">
      <template #header>
        <div class="card-header">
      <div class="header-left">
            <h3 class="card-title">系统状态概览</h3>
            <p class="update-time">最后更新: {{ lastUpdateTime }}</p>
      </div>
          <el-button type="primary" size="small" @click="refreshData">
            刷新
        </el-button>
      </div>
      </template>

      <div class="system-status-bar">
        <div class="status-indicator">
          <span class="status-dot"></span>
          <span class="status-text">系统正常运行中</span>
        </div>
        <div class="uptime-info">
          系统正常运行时间: {{ systemUptime }}
        </div>
    </div>
    
      <div class="resource-metrics">
          <!-- CPU使用率 -->
        <div class="metric-item">
          <div class="metric-header">
            <span class="metric-label">CPU使用率</span>
            <span class="metric-value">{{ currentResource.cpu }}%</span>
          </div>
          <el-progress 
            :percentage="currentResource.cpu" 
            :color="getProgressColor(currentResource.cpu)"
            :show-text="false"
            :stroke-width="8"
          />
          <p class="metric-desc">8核 Intel Xeon E5-2670 @ 2.60GHz</p>
        </div>
          
          <!-- 内存使用率 -->
        <div class="metric-item">
          <div class="metric-header">
            <span class="metric-label">内存使用率</span>
            <span class="metric-value">{{ currentResource.memory }}%</span>
          </div>
          <el-progress 
            :percentage="currentResource.memory" 
            :color="getProgressColor(currentResource.memory)"
            :show-text="false"
            :stroke-width="8"
          />
          <p class="metric-desc">总计: 32GB, 已用: {{ (32 * currentResource.memory / 100).toFixed(1) }}GB, 可用: {{ (32 * (100 - currentResource.memory) / 100).toFixed(1) }}GB</p>
        </div>
          
          <!-- 磁盘使用率 -->
        <div class="metric-item">
          <div class="metric-header">
            <span class="metric-label">磁盘使用率</span>
            <span class="metric-value">{{ currentResource.disk }}%</span>
          </div>
          <el-progress 
            :percentage="currentResource.disk" 
            :color="getProgressColor(currentResource.disk)"
            :show-text="false"
            :stroke-width="8"
          />
          <p class="metric-desc">总计: 2TB, 已用: {{ (2 * currentResource.disk / 100).toFixed(1) }}TB, 可用: {{ (2 * (100 - currentResource.disk) / 100).toFixed(1) }}TB</p>
        </div>
          
          <!-- 网络流量 -->
        <div class="metric-item network-item">
          <div class="metric-header">
            <span class="metric-label">网络流量</span>
            <span class="metric-value">
              入: {{ networkIn }}Mbps / 出: {{ networkOut }}Mbps
            </span>
          </div>
        </div>
      </div>
      
      <!-- 资源趋势图表 -->
      <div class="metrics-chart">
        <div ref="metricsChartRef" style="height: 128px;"></div>
      </div>
    </el-card>

    <!-- 核心服务监控 -->
    <el-card class="services-card" shadow="never">
      <template #header>
        <h3 class="card-title">核心服务监控</h3>
      </template>

      <div class="services-grid">
        <div 
          v-for="service in coreServices" 
          :key="service.name"
          class="service-item"
          :class="{ 'warning': service.status === 'warning' }"
        >
          <div class="service-icon" :class="service.status">
            <div class="status-dot-small"></div>
          </div>
          <div class="service-info">
            <div class="service-name">{{ service.name }}</div>
            <div class="service-version">{{ service.version }}</div>
          </div>
          <div class="service-status">
              <el-tag 
              :type="service.status === 'running' ? 'success' : service.status === 'warning' ? 'warning' : 'danger'"
              size="small"
              >
              {{ service.statusText }}
              </el-tag>
            <div class="response-time">响应时间: {{ service.responseTime }}ms</div>
          </div>
        </div>
      </div>

      <div class="view-all-services">
        <el-button type="text" @click="viewAllServices">
          查看全部服务 ({{ totalServicesCount }})
        </el-button>
      </div>
    </el-card>

    <!-- 数据库性能监控和API请求 -->
    <div class="performance-section">
      <el-card class="db-performance-card" shadow="never">
        <template #header>
          <div class="card-header">
            <h3 class="card-title">数据库性能监控</h3>
            <div class="time-range-tabs">
              <el-button 
                v-for="tab in timeRangeTabs" 
                :key="tab.value"
                :type="activeTimeRange === tab.value ? 'primary' : 'default'"
                size="small"
                @click="activeTimeRange = tab.value"
              >
                {{ tab.label }}
              </el-button>
            </div>
          </div>
        </template>

        <div class="db-metrics">
          <div class="db-metric-item">
            <div class="db-metric-header">
              <span class="db-metric-label">数据库连接数</span>
              <span class="db-metric-value">当前: {{ dbConnections.current }} / 最大: {{ dbConnections.max }}</span>
            </div>
            <el-progress 
              :percentage="(dbConnections.current / dbConnections.max) * 100" 
              :show-text="false"
              :stroke-width="8"
            />
          </div>

          <div class="db-metric-item">
            <div class="db-metric-header">
              <span class="db-metric-label">查询吞吐量</span>
              <span class="db-metric-value">{{ queryThroughput }} QPS</span>
            </div>
          </div>

          <div class="db-metric-item">
            <div class="db-metric-header">
              <span class="db-metric-label">缓存命中率</span>
              <span class="db-metric-value">{{ cacheHitRate }}%</span>
            </div>
            <el-progress 
              :percentage="cacheHitRate" 
              :show-text="false"
              color="#67c23a"
              :stroke-width="8"
            />
          </div>
        </div>

        <div class="db-chart">
          <div ref="dbChartRef" style="height: 192px;"></div>
        </div>
      </el-card>

      <el-card class="api-requests-card" shadow="never">
        <template #header>
          <h3 class="card-title">最近API请求记录</h3>
        </template>

        <div class="api-chart">
          <div ref="apiChartRef" style="height: 192px;"></div>
        </div>

        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-label">当前在线用户数</span>
            <span class="stat-value">{{ onlineUsers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">今日新增用户</span>
            <span class="stat-value">{{ todayNewUsers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">今日活跃用户</span>
            <span class="stat-value">{{ todayActiveUsers }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 用户活动监控 -->
    <el-card class="user-activity-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3 class="card-title">用户活动监控</h3>
          <el-button type="text" @click="viewAllActivities">
            查看全部
          </el-button>
        </div>
      </template>

      <div class="user-stats-grid">
        <div class="user-stat-card">
          <div class="user-stat-value">{{ onlineUsers }}</div>
          <div class="user-stat-label">当前在线用户总数</div>
        </div>
        <div class="user-stat-card">
          <div class="user-stat-value">{{ onlineDoctors }}</div>
          <div class="user-stat-label">在线医生数</div>
        </div>
        <div class="user-stat-card">
          <div class="user-stat-value">{{ onlinePatients }}</div>
          <div class="user-stat-label">在线患者数</div>
        </div>
      </div>
      
      <div class="recent-activities">
        <h4 class="activities-title">最近用户活动记录</h4>
        <div class="activities-list">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id"
            class="activity-item"
          >
            <span class="activity-time">{{ activity.time }}</span>
            <span class="activity-desc">{{ activity.description }}</span>
            <span class="activity-ip">{{ activity.ip }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 系统告警日志 -->
    <el-card class="alerts-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3 class="card-title">系统告警日志</h3>
          <div class="alert-tabs">
              <el-button 
              v-for="tab in alertTabs" 
              :key="tab.value"
              :type="activeAlertTab === tab.value ? 'primary' : 'default'"
                size="small"
              @click="activeAlertTab = tab.value"
              >
              {{ tab.label }}
              </el-button>
          </div>
        </div>
            </template>

      <div class="alerts-list">
        <div 
          v-for="alert in filteredAlerts" 
          :key="alert.id"
          class="alert-item"
          :class="alert.level"
        >
          <div class="alert-icon-wrapper">
            <el-icon v-if="alert.level === 'error'" class="alert-icon error">
              <WarnTriangleFilled />
            </el-icon>
            <el-icon v-else-if="alert.level === 'warning'" class="alert-icon warning">
              <Warning />
            </el-icon>
            <el-icon v-else class="alert-icon info">
              <Info />
            </el-icon>
          </div>
          <div class="alert-content">
            <div class="alert-title">{{ alert.title }}</div>
            <div class="alert-desc">{{ alert.description }}</div>
            <div class="alert-meta">
              <span class="alert-status" :class="alert.status">{{ alert.statusText }}</span>
              <span class="alert-time">{{ alert.timestamp }}</span>
            </div>
          </div>
        </div>
        <div v-if="filteredAlerts.length === 0" class="no-alerts">
          暂无告警信息
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMonitorStore } from '@/stores/monitorStore';
import { ElMessage } from 'element-plus';
// 图标已全局注册，直接使用组件名称
import * as echarts from 'echarts';

const monitorStore = useMonitorStore();

// 页面数据
const lastUpdateTime = ref('2023-08-21 15:30:22');
const systemUptime = ref('32天 18小时 45分钟');
const currentResource = computed(() => monitorStore.currentResource);
const networkIn = ref(128);
const networkOut = ref(86);
const activeTimeRange = ref('24小时');
const activeAlertTab = ref('all');
const totalServicesCount = ref(12);

// 在线用户数据
const onlineUsers = ref(28);
const onlineDoctors = ref(12);
const onlinePatients = ref(16);
const todayNewUsers = ref(12);
const todayActiveUsers = ref(16);

// 数据库性能数据
const dbConnections = ref({ current: 42, max: 100 });
const queryThroughput = ref(128);
const cacheHitRate = ref(92.5);

// 时间范围标签
const timeRangeTabs = [
  { label: '1小时', value: '1小时' },
  { label: '24小时', value: '24小时' },
  { label: '7天', value: '7天' },
  { label: '30天', value: '30天' }
];

// 告警标签
const alertTabs = [
  { label: '全部', value: 'all' },
  { label: '错误', value: 'error' },
  { label: '警告', value: 'warning' },
  { label: '信息', value: 'info' }
];

// 核心服务列表
const coreServices = ref([
  { name: '数据库服务 PostgreSQL 14.5', version: 'PostgreSQL 14.5', status: 'running', statusText: '正常运行中', responseTime: 28 },
  { name: '应用服务器', version: 'Node.js 14.17.3', status: 'running', statusText: '正常运行中', responseTime: 45 },
  { name: '存储服务', version: 'Minio Object Storage', status: 'running', statusText: '正常运行中', responseTime: 42 },
  { name: '缓存服务', version: 'Redis 6.2.7', status: 'running', statusText: '正常运行中', responseTime: 6 },
  { name: '消息队列', version: 'RabbitMQ 3.11.3', status: 'running', statusText: '正常运行中', responseTime: 15 },
  { name: '认证服务', version: 'OAuth 2.0 / JWT', status: 'running', statusText: '正常运行中', responseTime: 12 },
  { name: '影像处理服务', version: 'ImageMagick 7.1.0', status: 'warning', statusText: '负载较高', responseTime: 320 }
]);

// 最近用户活动
const recentActivities = ref([
  { id: 1, time: '15:28:45', description: '李医生完成了患者张先生的胸部CT影像诊断报告', ip: '192.168.1.10' },
  { id: 2, time: '15:15:22', description: '王医生上传了患者影像文件至系统，所属部门影像科，等待审核', ip: '192.168.1.15' },
  { id: 3, time: '14:51:23', description: '系统管理员修改了中医科的权限配置，更新了用户访问控制', ip: '192.168.1.1' },
  { id: 4, time: '14:15:28', description: '张医生完成了患者CT影像诊断报告，所属部门放射科', ip: '192.168.1.12' },
  { id: 5, time: '10:48:17', description: '刘医生登录系统并查看了待处理的影像检查列表', ip: '192.168.1.20' }
]);

// 系统告警
const systemAlerts = ref([
  { 
    id: 1, 
    level: 'warning', 
    title: '影像处理服务负载过高', 
    description: '影像处理服务当前负载达到85%, 响应时间320ms, 高于阀值200ms, 请关注系统性能', 
    status: 'processing',
    statusText: '处理中',
    timestamp: '2023-08-21 14:30:15'
  },
  { 
    id: 2, 
    level: 'info', 
    title: '系统备份完成', 
    description: '系统每日启动备份已完成, 备份文件大小128GB, 存储路径: /backup/20230821', 
    status: 'completed',
    statusText: '已完成',
    timestamp: '2023-08-21 02:15:30'
  }
]);

// 图表引用
const metricsChartRef = ref<HTMLDivElement>();
const dbChartRef = ref<HTMLDivElement>();
const apiChartRef = ref<HTMLDivElement>();

let metricsChartInstance: echarts.ECharts | null = null;
let dbChartInstance: echarts.ECharts | null = null;
let apiChartInstance: echarts.ECharts | null = null;

// 计算属性
const filteredAlerts = computed(() => {
  if (activeAlertTab.value === 'all') {
    return systemAlerts.value;
  }
  return systemAlerts.value.filter(alert => alert.level === activeAlertTab.value);
});

// 方法
const getProgressColor = (value: number) => {
  if (value >= 80) return '#f56c6c';
  if (value >= 60) return '#e6a23c';
  return '#409eff';
};

const refreshData = () => {
  // 更新时间
  const now = new Date();
  lastUpdateTime.value = now.toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  // 刷新数据（如果需要，可以从 store 获取）
  ElMessage.success('数据已刷新');
};

const viewAllServices = () => {
  ElMessage.info('查看全部服务');
};

const viewAllActivities = () => {
  ElMessage.info('查看全部活动');
};

// 初始化图表
const initMetricsChart = () => {
  if (!metricsChartRef.value) return;
  
  metricsChartInstance = echarts.init(metricsChartRef.value);
  metricsChartInstance.setOption({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['CPU使用率', '内存使用率'],
      top: 0,
      textStyle: {
        fontSize: 11
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      axisLabel: {
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        fontSize: 10
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    series: [
      {
        name: 'CPU使用率',
        type: 'line',
        data: [25, 30, 45, 38, 42, 38],
        smooth: true,
        lineStyle: {
          color: '#409eff'
        },
        itemStyle: {
          color: '#409eff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.1)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0)' }
            ]
          }
        }
      },
      {
        name: '内存使用率',
        type: 'line',
        data: [55, 58, 62, 60, 65, 62],
        smooth: true,
        lineStyle: {
          color: '#e6a23c'
        },
        itemStyle: {
          color: '#e6a23c'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(249, 115, 22, 0.1)' },
              { offset: 1, color: 'rgba(249, 115, 22, 0)' }
            ]
          }
        }
      }
    ]
  });
};

const initDbChart = () => {
  if (!dbChartRef.value) return;
  
  dbChartInstance = echarts.init(dbChartRef.value);
  dbChartInstance.setOption({
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLabel: {
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    series: [
      {
        name: '查询次数 (千次)',
        type: 'bar',
        data: [85, 92, 88, 95, 102, 78, 65],
        itemStyle: {
          color: '#409eff',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  });
};

const initApiChart = () => {
  if (!apiChartRef.value) return;
  
  apiChartInstance = echarts.init(apiChartRef.value);
  apiChartInstance.setOption({
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      axisLabel: {
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    series: [
      {
        name: 'API请求数',
        type: 'line',
        data: [1200, 800, 2400, 3200, 2800, 1600],
        smooth: true,
        lineStyle: {
          color: '#67c23a'
        },
        itemStyle: {
          color: '#67c23a'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(103, 194, 58, 0.1)' },
              { offset: 1, color: 'rgba(103, 194, 58, 0)' }
            ]
          }
        }
      }
    ]
  });
};

const resizeCharts = () => {
  metricsChartInstance?.resize();
  dbChartInstance?.resize();
  apiChartInstance?.resize();
};

onMounted(() => {
  initMetricsChart();
  initDbChart();
  initApiChart();
  window.addEventListener('resize', resizeCharts);
  
  // 初始化数据
  monitorStore.fetchResources();
});

onUnmounted(() => {
  metricsChartInstance?.dispose();
  dbChartInstance?.dispose();
  apiChartInstance?.dispose();
  window.removeEventListener('resize', resizeCharts);
});
</script>

<style scoped>
.system-monitor-page {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

/* 页面头部 */
.page-header {
  margin-bottom: 24px;
}

.header-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* 卡片通用样式 */
:deep(.el-card) {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.el-card__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
  background: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.update-time {
  font-size: 12px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

/* 系统状态概览 */
.status-overview-card {
  background: white;
}

.system-status-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  display: inline-block;
}

.status-text {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.uptime-info {
  font-size: 14px;
  color: #6b7280;
}

.resource-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.metric-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.metric-item.network-item {
  grid-column: span 1;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
}

.metric-desc {
  font-size: 12px;
  color: #9ca3af;
  margin: 8px 0 0 0;
}

.metrics-chart {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

/* 核心服务监控 */
.services-card {
  background: white;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
}

.service-item.warning {
  border-color: #fbbf24;
  background: #fffbeb;
}

.service-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d1fae5;
}

.service-icon.running {
  background: #d1fae5;
}

.service-icon.warning {
  background: #fef3c7;
}

.service-icon.stopped {
  background: #fee2e2;
}

.status-dot-small {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.service-icon.warning .status-dot-small {
  background: #f59e0b;
}

.service-icon.stopped .status-dot-small {
  background: #ef4444;
}

.service-info {
  flex: 1;
}

.service-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.service-version {
  font-size: 12px;
  color: #6b7280;
}

.service-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.response-time {
  font-size: 12px;
  color: #6b7280;
}

.view-all-services {
  margin-top: 16px;
  text-align: center;
}

/* 性能监控区域 */
.performance-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.db-performance-card,
.api-requests-card {
  background: white;
}

.time-range-tabs {
  display: flex;
  gap: 8px;
}

.db-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.db-metric-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.db-metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.db-metric-label {
  font-size: 14px;
  color: #6b7280;
}

.db-metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.db-chart,
.api-chart {
  margin-top: 16px;
}

.user-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.stat-label {
  color: #6b7280;
}

.stat-value {
  font-weight: 600;
  color: #1f2937;
}

/* 用户活动监控 */
.user-activity-card {
  background: white;
}

.user-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.user-stat-card {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
}

.user-stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.user-stat-label {
  font-size: 14px;
  color: #6b7280;
}

.recent-activities {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.activities-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 14px;
}

.activity-time {
  width: 70px;
  color: #6b7280;
  font-size: 12px;
}

.activity-desc {
  flex: 1;
  color: #1f2937;
}

.activity-ip {
  color: #9ca3af;
  font-size: 12px;
}

/* 系统告警日志 */
.alerts-card {
  background: white;
}

.alert-tabs {
  display: flex;
  gap: 8px;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alert-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #f9fafb;
  border-left: 4px solid;
}

.alert-item.error {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.alert-item.warning {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.alert-item.info {
  border-left-color: #3b82f6;
  background: #eff6ff;
}

.alert-icon-wrapper {
  display: flex;
  align-items: flex-start;
}

.alert-icon {
  font-size: 20px;
}

.alert-icon.error {
  color: #ef4444;
}

.alert-icon.warning {
  color: #f59e0b;
}

.alert-icon.info {
  color: #3b82f6;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.alert-desc {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  line-height: 1.5;
}

.alert-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
}

.alert-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.alert-status.processing {
  background: #dbeafe;
  color: #1e40af;
}

.alert-status.completed {
  background: #d1fae5;
  color: #065f46;
}

.alert-time {
  color: #9ca3af;
}

.no-alerts {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
}
</style>