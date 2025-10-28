<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <div class="logo">医</div>
        <div class="header-title">医疗影像管理系统</div>
      </div>
      <div class="header-right">
        <div class="notification">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="notification-badge">3</span>
        </div>
        <div class="user-avatar"></div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar">
      <div class="menu-item active" @click="navigateTo('admin.dashboard')">
        <div class="menu-item-icon">📊</div>
        <span>管理仪表盘</span>
      </div>
      <div class="menu-item" @click="navigateTo('admin.dataAnalysis')">
        <div class="menu-item-icon">📈</div>
        <span>数据统计分析</span>
      </div>
      <div class="menu-item submenu" @click="navigateTo('admin.doctorData')">医生数据</div>
      <div class="menu-item submenu" @click="navigateTo('admin.patientData')">患者数据</div>
      <div class="menu-item submenu" @click="navigateTo('admin.feedbackData')">反馈数据统计</div>
      <div class="menu-item" @click="navigateTo('admin.systemMonitoring')">
        <div class="menu-item-icon">📅</div>
        <span>系统监控</span>
      </div>
      <div class="menu-item" @click="navigateTo('admin.userManagement')">
        <div class="menu-item-icon">👤</div>
        <span>用户账号管理</span>
      </div>
      <div class="menu-item" @click="navigateTo('admin.rolesPermissions')">
        <div class="menu-item-icon">🔑</div>
        <span>角色与权限</span>
      </div>
      <div class="menu-item" @click="navigateTo('admin.systemConfig')">
        <div class="menu-item-icon">⚙️</div>
        <span>系统参数配置</span>
      </div>
      
      <div class="sidebar-footer">
        <div>系统版本：v2.3.1</div>
        <div>更新日期：2023-08-15</div>
        <a href="#" class="update-link" @click="showUpdateLog">查看更新日志</a>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="page-header">
        <div class="page-title">管理仪表盘</div>
        <div class="page-subtitle">欢迎回来，系统管理员！这里是系统运行状态概览</div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-label">总用户数</div>
            <div class="kpi-icon blue">👤</div>
          </div>
          <div class="kpi-value">1,286</div>
          <div class="kpi-change positive">
            <span>↑ +12.3%</span>
          </div>
          <div class="kpi-footer">较上月增长</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-label">活跃设备</div>
            <div class="kpi-icon green">💻</div>
          </div>
          <div class="kpi-value">86</div>
          <div class="kpi-change positive">
            <span>↑ +3.6%</span>
          </div>
          <div class="kpi-footer">较上月增长</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-label">诊断检查量</div>
            <div class="kpi-icon yellow">📄</div>
          </div>
          <div class="kpi-value">5,342</div>
          <div class="kpi-change positive">
            <span>↑ +8.2%</span>
          </div>
          <div class="kpi-footer">本月累计</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-label">系统可用性</div>
            <div class="kpi-icon purple">📊</div>
          </div>
          <div class="kpi-value">99.98%</div>
          <div class="kpi-change negative">
            <span>↓ -0.02%</span>
          </div>
          <div class="kpi-footer">近30天平均</div>
        </div>
      </div>

      <!-- Charts -->
      <div class="chart-grid">
        <div class="chart-card">
          <div class="chart-header">
            <div>
              <div class="chart-title">影像检查量趋势</div>
              <div class="chart-subtitle">近6个月系统检查量趋势统计</div>
            </div>
            <div class="chart-tabs">
              <div class="chart-tab active" @click="changeTimeRange('month', $event)">月</div>
              <div class="chart-tab" @click="changeTimeRange('quarter', $event)">季</div>
              <div class="chart-tab" @click="changeTimeRange('year', $event)">年</div>
            </div>
          </div>
          <div class="chart-content">
            图表区域 - 影像检查量趋势图
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <div>
              <div class="chart-title">检查类型分布</div>
              <div class="chart-subtitle">本月各类型检查占比</div>
            </div>
          </div>
          <div class="pie-chart-content">
            <div class="pie-chart"></div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color" style="background: #1677ff;"></div>
              <span class="legend-label">MRI</span>
              <span class="legend-value">32%</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #52c41a;"></div>
              <span class="legend-label">CT</span>
              <span class="legend-value">28%</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #faad14;"></div>
              <span class="legend-label">X光</span>
              <span class="legend-value">22%</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #722ed1;"></div>
              <span class="legend-label">超声</span>
              <span class="legend-value">18%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="bottom-grid">
        <div class="status-card">
          <div class="chart-header">
            <div>
              <div class="chart-title">系统运行状态</div>
              <div class="chart-subtitle">核心服务监控</div>
            </div>
          </div>
          <div class="status-list">
            <div class="status-item">
              <div class="status-left">
                <div class="status-indicator green"></div>
                <div class="status-name">数据库服务</div>
              </div>
              <div class="status-text">正常运行中</div>
            </div>
            <div class="status-item">
              <div class="status-left">
                <div class="status-indicator green"></div>
                <div class="status-name">存储服务</div>
              </div>
              <div class="status-text">正常运行中</div>
            </div>
            <div class="status-item">
              <div class="status-left">
                <div class="status-indicator green"></div>
                <div class="status-name">认证服务</div>
              </div>
              <div class="status-text">正常运行中</div>
            </div>
            <div class="status-item">
              <div class="status-left">
                <div class="status-indicator yellow"></div>
                <div class="status-name">影像处理服务</div>
              </div>
              <div class="status-text">负载较高</div>
            </div>
            <div class="status-item">
              <div class="status-left">
                <div class="status-indicator green"></div>
                <div class="status-name">消息队列</div>
              </div>
              <div class="status-text">正常运行中</div>
            </div>
          </div>
          <a href="#" class="view-more-link" @click="navigateTo('admin.systemMonitoring')">查看详细系统监控</a>
        </div>

        <div class="status-card">
          <div class="activity-header">
            <div>
              <div class="chart-title">最近系统活动</div>
              <div class="chart-subtitle">系统关键操作日志</div>
            </div>
            <button class="refresh-btn" @click="refreshActivity">
              <span>🔄</span>
              <span>刷新</span>
            </button>
          </div>
          <table class="activity-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>用户</th>
                <th>操作</th>
                <th>IP地址</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2023-08-20 14:32:15</td>
                <td>
                  <div class="user-cell">
                    <div class="user-avatar-small"></div>
                    <span>李医生 (放射科)</span>
                  </div>
                </td>
                <td>编辑诊室资产/影像设备</td>
                <td>192.168.1.105</td>
                <td><span class="status-badge success">成功</span></td>
              </tr>
              <tr>
                <td>2023-08-20 13:45:08</td>
                <td>
                  <div class="user-cell">
                    <div class="user-avatar-small"></div>
                    <span>系统管理员</span>
                  </div>
                </td>
                <td>添加新备份任务配置/管理</td>
                <td>10.0.0.24</td>
                <td><span class="status-badge success">成功</span></td>
              </tr>
              <tr>
                <td>2023-08-20 10:12:33</td>
                <td>
                  <div class="user-cell">
                    <div class="user-avatar-small"></div>
                    <span>张医生 (影像)</span>
                  </div>
                </td>
                <td>预约了影像检查的诊断</td>
                <td>218.12.45.78</td>
                <td><span class="status-badge success">成功</span></td>
              </tr>
              <tr>
                <td>2023-08-20 09:05:47</td>
                <td>
                  <div class="user-cell">
                    <div class="user-avatar-small"></div>
                    <div>系统服务</div>
                  </div>
                </td>
                <td>自动完成影像备份任务</td>
                <td>10.0.0.10</td>
                <td><span class="status-badge success">成功</span></td>
              </tr>
              <tr>
                <td>2023-08-19 16:28:11</td>
                <td>
                  <div class="user-cell">
                    <div class="user-avatar-small"></div>
                    <span>王医生 (骨科)</span>
                  </div>
                </td>
                <td>上传了患者影像至PAMI影像库</td>
                <td>192.168.1.112</td>
                <td><span class="status-badge warning">异常完成</span></td>
              </tr>
            </tbody>
          </table>
          <a href="#" class="view-more-link" @click="navigateTo('admin.auditLogs')">查看完整系统日志</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const timeRange = ref('month')

// Navigation function
const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
}

// Refresh activity function
const refreshActivity = () => {
  // 模拟刷新活动日志
  console.log('刷新系统活动日志')
  // 这里可以添加实际的刷新逻辑
}

// Show update log function
const showUpdateLog = () => {
  // 模拟显示更新日志
  console.log('显示更新日志')
  // 这里可以添加实际的更新日志显示逻辑
  alert('更新日志功能待实现')
}

// Change time range function
const changeTimeRange = (range: string, event: Event) => {
  timeRange.value = range
  // 更新图表标签的激活状态
  document.querySelectorAll('.chart-tab').forEach(tab => {
    tab.classList.remove('active')
  })
  const target = event.target as HTMLElement
  target.classList.add('active')
  console.log('切换时间范围:', range)
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.admin-dashboard {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: #f5f7fa;
  color: #333;
}

/* Header */
.header {
  background: white;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification {
  position: relative;
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff4d4f;
  color: white;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
}

/* Sidebar */
.sidebar {
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  width: 240px;
  background: white;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  overflow-y: auto;
  padding: 16px 0;
}

.menu-item {
  padding: 12px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
  transition: all 0.3s;
  font-size: 14px;
}

.menu-item:hover {
  background: #f5f7fa;
  color: #1677ff;
}

.menu-item.active {
  background: #e6f4ff;
  color: #1677ff;
  border-right: 3px solid #1677ff;
}

.menu-item-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submenu {
  padding-left: 56px;
}

.sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  margin-top: 20px;
  font-size: 12px;
  color: #999;
}

.sidebar-footer div {
  margin-bottom: 4px;
}

.update-link {
  color: #1677ff;
  text-decoration: none;
  font-size: 13px;
  margin-top: 8px;
  display: inline-block;
}

/* Main Content */
.main-content {
  margin-left: 240px;
  margin-top: 60px;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 14px;
  color: #999;
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.kpi-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.kpi-label {
  font-size: 14px;
  color: #666;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.kpi-icon.blue { background: #e6f4ff; color: #1677ff; }
.kpi-icon.green { background: #d9f7be; color: #52c41a; }
.kpi-icon.yellow { background: #fff7e6; color: #faad14; }
.kpi-icon.purple { background: #f9f0ff; color: #722ed1; }

.kpi-value {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.kpi-change {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kpi-change.positive { color: #52c41a; }
.kpi-change.negative { color: #ff4d4f; }

.kpi-footer {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

/* Chart Section */
.chart-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.chart-subtitle {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.chart-tabs {
  display: flex;
  gap: 16px;
}

.chart-tab {
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.3s;
}

.chart-tab:hover {
  background: #f5f7fa;
}

.chart-tab.active {
  background: #e6f4ff;
  color: #1677ff;
}

.chart-content {
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.pie-chart-content {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.pie-chart {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    #1677ff 0deg 115deg,
    #52c41a 115deg 216deg,
    #faad14 216deg 295deg,
    #722ed1 295deg 360deg
  );
}

.chart-legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  color: #666;
  flex: 1;
}

.legend-value {
  color: #1a1a1a;
  font-weight: 500;
}

/* Bottom Section */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.status-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.status-list {
  margin-top: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.status-item:last-child {
  border-bottom: none;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.green { background: #52c41a; }
.status-indicator.yellow { background: #faad14; }

.status-name {
  font-size: 14px;
  color: #1a1a1a;
}

.status-text {
  font-size: 13px;
  color: #999;
}

.view-more-link {
  color: #1677ff;
  text-decoration: none;
  font-size: 13px;
  display: inline-block;
  margin-top: 16px;
}

/* Activity Table */
.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.3s;
}

.refresh-btn:hover {
  color: #1677ff;
  border-color: #1677ff;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.activity-table th {
  text-align: left;
  padding: 12px;
  font-size: 13px;
  color: #999;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
}

.activity-table td {
  padding: 12px;
  font-size: 13px;
  border-bottom: 1px solid #f0f0f0;
}

.activity-table tr:last-child td {
  border-bottom: none;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar-small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
}

.status-badge.success {
  background: #d9f7be;
  color: #52c41a;
}

.status-badge.warning {
  background: #fff7e6;
  color: #faad14;
}

@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-grid {
    grid-template-columns: 1fr;
  }
  
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
