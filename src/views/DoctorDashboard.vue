<template>
  <div class="doctor-dashboard">
    <!-- 医生头部 - 只在仪表板主页显示 -->
    <div v-if="showDashboardHeader" class="dashboard-header">
      <h1>医生工作台</h1>
      <p>欢迎回来，{{ authStore.user?.fullName }} 医生</p>
      <div class="header-actions">
        <el-button @click="goToFeedback">💬 意见反馈</el-button>
        <el-button @click="handleLogout">🚪 退出登录</el-button>
      </div>
    </div>

    <!-- 路由出口 -->
    <router-view v-if="!showDashboardHome"/>
    
    <!-- 医生核心功能 - 只在仪表板主页显示 -->
    <div v-else class="function-grid">

      
      <div class="function-card" @click="goToDiagnosis">
        <div class="card-icon">🤖</div>
        <h3>AI诊断分析</h3>
        <p>使用AI进行疾病诊断和分析</p>
      </div>
      
      <div class="function-card" @click="goToCases">
        <div class="card-icon">📋</div>
        <h3>病例管理</h3>
        <p>管理患者病例和诊断记录</p>
      </div>
      
      <div class="function-card" @click="goToKnowledge">
        <div class="card-icon">📚</div>
        <h3>知识库</h3>
        <p>查询疾病诊断标准和治疗方案</p>
      </div>
      
      <div class="function-card" @click="goToReports">
        <div class="card-icon">📄</div>
        <h3>报告生成</h3>
        <p>生成和编辑诊断报告</p>
      </div>
      
      <div class="function-card" @click="goToFeedback">
        <div class="card-icon">💬</div>
        <h3>意见反馈</h3>
        <p>提供系统使用反馈和建议</p>
      </div>
    </div>
    
    <!-- 额外的仪表板内容 -->
    <div class="dashboard">
      <div class="card-container">
        <!-- 这里可以添加更多卡片或内容 -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 判断是否是仪表板主页（空路径或根路径）
const showDashboardHome = computed(() => {
  return route.name === 'DoctorDashboardMain' || route.path === '/dashboard/doctor'
})

// 判断是否显示仪表板头部（在主页和某些页面显示）
const showDashboardHeader = computed(() => {
  return showDashboardHome.value
})



const goToDiagnosis = () => {
  router.push({ name: 'doctor.aiDiagnosis' })
}

const goToCases = () => {
  router.push({ name: 'doctor.caseManagement' })
}

const goToKnowledge = () => {
  router.push({ name: 'doctor.knowledgeBase' })
}

const goToReports = () => {
  router.push({ name: 'doctor.reports' })
}

const goToFeedback = () => {
  try {
    // 跳转到反馈历史页面
    router.push({ name: 'doctor.feedbackHistory' })
    console.log('成功跳转到反馈历史页面')
  } catch (error) {
    console.error('路由跳转失败:', error)
    ElMessage.error('跳转失败，请稍后重试')
  }
}

const handleLogout = () => {
  authStore.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.doctor-dashboard {
  min-height: 100vh;
  background: #f8fafc;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 50px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 10px;
}

.dashboard-header p {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.function-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.function-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.function-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.function-card p {
  color: #6b7280;
  line-height: 1.5;
}
</style>