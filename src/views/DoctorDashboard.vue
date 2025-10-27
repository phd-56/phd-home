<template>
  <div class="doctor-dashboard">
    <!-- 路由出口 - 对于非主页的路由显示 -->
    <router-view v-if="!showDashboardHome"/>
    
    <!-- 医生工作台主页内容 -->
    <div v-else class="dashboard-content">
      <!-- 欢迎区域 -->
      <div class="welcome-section">
        <h1 class="welcome-title">欢迎使用 BoneAI 系统</h1>
        <p class="welcome-date">今日工作概览: {{ currentDate }}</p>
      </div>
      
      <!-- 统计卡片区域 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingCases }}</div>
            <div class="stat-label">待处理病例</div>
            <div class="stat-change">↑ 2个新增</div>
          </div>
          <button class="stat-action" @click="goToCases">查看详情</button>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ todayDiagnoses }}</div>
            <div class="stat-label">今日诊断</div>
            <div class="stat-change green">↑ 3个完成</div>
          </div>
          <button class="stat-action" @click="goToReports">查看详情</button>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <div class="stat-value">{{ accuracy }}%</div>
            <div class="stat-label">准确率</div>
            <div class="stat-change red">↓ 1.2%下降</div>
          </div>
          <div class="stat-notice">较上周下降1.2%，需关注</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🟢</div>
          <div class="stat-content">
            <div class="stat-value">正常</div>
            <div class="stat-label">系统状态</div>
            <div class="stat-status">运行中</div>
          </div>
          <div class="stat-notice">连续运行时间: 128天</div>
        </div>
      </div>
      
      <!-- 图表和功能区域 -->
      <div class="charts-section">
        <!-- 月度诊断统计 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>月度诊断统计</h3>
            <div class="chart-actions">
              <button class="export-btn">导出数据</button>
              <button class="refresh-btn" @click="refreshData">刷新</button>
            </div>
          </div>
          <div class="chart-content">
            <!-- 这里可以放置图表组件，暂时使用占位内容 -->
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div class="chart-bar" :style="{ height: '60%' }"></div>
                <div class="chart-bar" :style="{ height: '80%' }"></div>
                <div class="chart-bar" :style="{ height: '40%' }"></div>
                <div class="chart-bar" :style="{ height: '70%' }"></div>
                <div class="chart-bar" :style="{ height: '50%' }"></div>
                <div class="chart-bar" :style="{ height: '90%' }"></div>
                <div class="chart-bar" :style="{ height: '95%' }"></div>
              </div>
              <div class="chart-labels">
                <span>1月</span><span>2月</span><span>3月</span><span>4月</span><span>5月</span><span>6月</span><span>7月</span>
              </div>
              <div class="chart-values">
                <span>0</span><span>50</span><span>100</span><span>150</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 疾病分类分布 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>疾病分类分布</h3>
            <button class="refresh-btn" @click="refreshData">刷新</button>
          </div>
          <div class="chart-content">
            <!-- 这里可以放置饼图组件，暂时使用占位内容 -->
            <div class="pie-chart-placeholder">
              <div class="pie-chart"></div>
              <div class="pie-legend">
                <div class="legend-item"><span class="legend-color blue"></span>半月板损伤 (50%)</div>
                <div class="legend-item"><span class="legend-color orange"></span>骨折 (25%)</div>
                <div class="legend-item"><span class="legend-color red"></span>韧带撕裂 (15%)</div>
                <div class="legend-item"><span class="legend-color green"></span>关节炎 (8%)</div>
                <div class="legend-item"><span class="legend-color purple"></span>其他 (2%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 快捷功能区域 -->
      <div class="quick-actions-section">
        <h3 class="section-title">快捷功能</h3>
        <div class="function-grid">
          <div class="function-card" @click="goToDiagnosis">
            <div class="card-icon">🤖</div>
            <h4>AI诊断分析</h4>
            <p>使用AI进行疾病诊断和分析</p>
          </div>
          
          <div class="function-card" @click="goToCases">
            <div class="card-icon">📋</div>
            <h4>病例管理</h4>
            <p>管理患者病例和诊断记录</p>
          </div>
          
          <div class="function-card" @click="goToKnowledge">
            <div class="card-icon">📚</div>
            <h4>知识库</h4>
            <p>查询疾病诊断标准和治疗方案</p>
          </div>
          
          <div class="function-card" @click="goToReports">
            <div class="card-icon">📄</div>
            <h4>报告生成</h4>
            <p>生成和编辑诊断报告</p>
          </div>
          
          <div class="function-card" @click="goToFeedback">
            <div class="card-icon">💬</div>
            <h4>意见反馈</h4>
            <p>提供系统使用反馈和建议</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 判断是否是仪表板主页（空路径或根路径）
const showDashboardHome = computed(() => {
  return route.name === 'DoctorDashboardMain' || route.path === '/dashboard/doctor'
})

// 统计数据 - 这些可以从API获取，暂时使用静态数据
const pendingCases = ref(12)
const todayDiagnoses = ref(8)
const accuracy = ref(94.2)

// 获取当前日期
const currentDate = computed(() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
})

// 刷新数据
const refreshData = () => {
  // 模拟数据刷新
  ElMessage.success('数据已刷新')
  // 这里可以添加实际的数据刷新逻辑
}

// 导航函数
const goToDiagnosis = () => {
  try {
    router.push({ name: 'doctor.aiDiagnosis' })
    console.log('成功跳转到AI诊断页面')
  } catch (error) {
    console.error('路由跳转失败:', error)
    ElMessage.error('跳转失败，请稍后重试')
  }
}

const goToCases = () => {
  try {
    router.push({ name: 'doctor.caseManagement' })
    console.log('成功跳转到病例管理页面')
  } catch (error) {
    console.error('路由跳转失败:', error)
    ElMessage.error('跳转失败，请稍后重试')
  }
}

const goToKnowledge = () => {
  try {
    router.push({ name: 'doctor.knowledgeBase' })
    console.log('成功跳转到知识库页面')
  } catch (error) {
    console.error('路由跳转失败:', error)
    ElMessage.error('跳转失败，请稍后重试')
  }
}

const goToReports = () => {
  try {
    router.push({ name: 'doctor.reports' })
    console.log('成功跳转到报告中心页面')
  } catch (error) {
    console.error('路由跳转失败:', error)
    ElMessage.error('跳转失败，请稍后重试')
  }
}

const goToFeedback = () => {
  try {
    router.push({ name: 'doctor.feedbackHistory' })
    console.log('成功跳转到反馈历史页面')
  } catch (error) {
    console.error('路由跳转失败:', error)
    ElMessage.error('跳转失败，请稍后重试')
  }
}
</script>

<style scoped>
.doctor-dashboard {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 0;
  width: 100%;
}

.dashboard-content {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 欢迎区域 */
.welcome-section {
  margin-bottom: 32px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1f2937;
}

.welcome-date {
  font-size: 14px;
  color: #999;
}

/* 统计卡片 */
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
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 32px;
  background: #f0f9ff;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0ea5e9;
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.stat-change {
  font-size: 12px;
  color: #dc2626;
  font-weight: 500;
}

.stat-change.green {
  color: #16a34a;
}

.stat-change.red {
  color: #dc2626;
}

.stat-status {
  font-size: 12px;
  color: #16a34a;
  font-weight: 500;
}

.stat-notice {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.stat-action {
  background: #f3f4f6;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-action:hover {
  background: #e5e7eb;
  color: #2563eb;
}

/* 图表区域 */
.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
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

.chart-actions {
  display: flex;
  gap: 12px;
}

.export-btn,
.refresh-btn {
  background: #f3f4f6;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-btn:hover,
.refresh-btn:hover {
  background: #e5e7eb;
}

.chart-content {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 图表占位符 */
.chart-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  height: 240px;
  gap: 12px;
  padding: 0 20px;
  position: relative;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 6px 6px 0 0;
  transition: height 0.5s ease;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px 0;
  font-size: 12px;
  color: #6b7280;
}

.chart-values {
  position: absolute;
  left: 0;
  top: 0;
  height: 240px;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  padding: 0 8px;
  font-size: 12px;
  color: #6b7280;
}

/* 饼图占位符 */
.pie-chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pie-chart {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(
    #3b82f6 0% 50%,
    #f97316 50% 75%,
    #ef4444 75% 90%,
    #22c55e 90% 98%,
    #9333ea 98% 100%
  );
  margin-bottom: 20px;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 200px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.blue {
  background: #3b82f6;
}

.legend-color.orange {
  background: #f97316;
}

.legend-color.red {
  background: #ef4444;
}

.legend-color.green {
  background: #22c55e;
}

.legend-color.purple {
  background: #9333ea;
}

/* 快捷功能区域 */
.quick-actions-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.function-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.function-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.function-card h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.function-card p {
  color: #6b7280;
  line-height: 1.5;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .stat-action {
    width: 100%;
    margin-top: 8px;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .function-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .chart-card {
    padding: 16px;
  }
  
  .chart-content {
    height: 250px;
  }
  
  .pie-chart {
    width: 150px;
    height: 150px;
  }
}
</style>