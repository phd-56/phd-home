<template>
  <div class="doctor-dashboard">
    <!-- 侧边栏区域 -->
    <DoctorSidebar 
      :active-tab="'dashboard'" 
      @tab-change="handleTabChange"
    />
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <div class="top-navbar">
        <div class="logo">
          <span class="logo-text">BoneAI Diagnostics</span>
        </div>
        <div class="navbar-right">
          <div class="notification-center">
            <el-badge :value="12" class="notification-badge">
              <el-button circle icon="el-icon-bell" />
            </el-badge>
          </div>
          <div class="user-profile">
            <el-dropdown>
              <span class="user-info">
                <span class="user-name">李医生</span>
                <span class="user-avatar">👤</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>系统设置</el-dropdown-item>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-wrapper">
        <div class="content-header">
          <h1 class="page-title">欢迎使用 BoneAI 系统</h1>
          <span class="date-info">今日工作概览 - {{ currentDate }}</span>
        </div>
        
        <!-- 统计卡片区域 -->
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon pending">📋</div>
            <div class="stat-content">
              <h3 class="stat-title">待处理病例</h3>
              <p class="stat-value">12</p>
              <span class="stat-change positive">+2 个新增</span>
            </div>
            <div class="stat-action">
              <el-button type="text" class="view-details">查看详情 →</el-button>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon completed">✅</div>
            <div class="stat-content">
              <h3 class="stat-title">今日诊断</h3>
              <p class="stat-value">8</p>
              <span class="stat-change positive">+3 个完成</span>
            </div>
            <div class="stat-action">
              <el-button type="text" class="view-details">查看详情 →</el-button>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon accuracy">🎯</div>
            <div class="stat-content">
              <h3 class="stat-title">准确率</h3>
              <p class="stat-value">94.2%</p>
              <span class="stat-change negative">-1.2% 下降</span>
            </div>
            <div class="stat-action">
              <el-button type="text" class="view-details">查看详情 →</el-button>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon system">⚡</div>
            <div class="stat-content">
              <h3 class="stat-title">系统状态</h3>
              <p class="stat-value">正常</p>
              <span class="stat-change status-active">运行中</span>
            </div>
            <div class="stat-action">
              <el-button type="text" class="view-details">查看详情 →</el-button>
            </div>
          </div>
        </div>

        <!-- 图表区域 -->
        <div class="charts-container">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">月度诊断统计</h3>
              <el-button type="text" size="small" class="export-btn">导出数据</el-button>
            </div>
            <div class="chart-container" style="height: 300px;">
              <BarChart :data="barChartData" />
            </div>
          </div>
          
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">疾病分类分布</h3>
              <el-button type="text" size="small" class="refresh-btn">刷新</el-button>
            </div>
            <div class="chart-container" style="height: 300px;">
              <PieChart :data="pieChartData" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import DoctorSidebar from '../components/doctor/DoctorSidebar.vue'
import BarChart from '../components/charts/BarChart.vue'
import PieChart from '../components/charts/PieChart.vue'

const router = useRouter()
const route = useRoute()

// 获取当前日期
const currentDate = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
})

// 柱状图数据 - 匹配参考图片中的数据
const barChartData = reactive({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  datasets: [
    {
      label: '诊断数量',
      data: [120, 200, 140, 80, 70, 150, 160],
      backgroundColor: '#409EFF'
    }
  ]
})

// 饼图数据 - 匹配参考图片中的数据和标签
const pieChartData = reactive({
  labels: ['半月损伤', '骨折', '关节炎', '其他'],
  datasets: [
    {
      label: '疾病分类',
      data: [50, 25, 8, 17], // 半月损伤(50%), 骨折(25%), 关节炎(8%), 其他(17%)
      backgroundColor: ['#409EFF', '#E6A23C', '#67C23A', '#F56C6C']
    }
  ]
})

// 处理标签切换
const handleTabChange = (tab: string) => {
  // 标签切换处理逻辑已在侧边栏组件中实现
}

// 图表操作
const exportData = () => {
  ElMessage.success('数据已导出')
}

const refreshChart = () => {
  ElMessage.success('图表已刷新')
}

// 组件挂载时的初始化
onMounted(() => {
  console.log('Doctor dashboard mounted')
})
</script>

<style scoped>
.doctor-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  flex: 1;
  margin-left: 240px; /* 侧边栏宽度 */
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.top-navbar {
  background-color: #1890ff;
  color: white;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo .logo-text {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-center {
  position: relative;
}

.notification-badge {
  color: white;
}

.notification-badge .el-icon-bell {
  font-size: 18px;
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-name {
  margin-right: 8px;
  font-size: 14px;
}

.user-avatar {
  font-size: 20px;
}

/* 内容区域 */
.content-wrapper {
  flex: 1;
  padding: 24px;
}

.content-header {
  margin-bottom: 24px;
}

.content-header .page-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.content-header .date-info {
  color: #909399;
  font-size: 14px;
}

/* 统计卡片样式 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 32px;
  margin-right: 16px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #f5f7fa;
}

.stat-icon.pending {
  background-color: #ecf5ff;
}

.stat-icon.completed {
  background-color: #f0f9eb;
}

.stat-icon.accuracy {
  background-color: #fff3cd;
}

.stat-icon.system {
  background-color: #e7f3ff;
}

.stat-content h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.stat-value {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-change {
  font-size: 12px;
}

.stat-change.positive {
  color: #67c23a;
}

.stat-change.negative {
  color: #f56c6c;
}

.stat-change.status-active {
  color: #67c23a;
}

.stat-action {
  margin-left: auto;
}

.view-details {
  color: #409eff !important;
  font-size: 14px;
}

/* 图表区域样式 */
.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.export-btn, .refresh-btn {
  color: #409eff;
  font-size: 12px;
}

.chart-container {
  width: 100%;
  height: 300px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
}  
</style>