<template>
  <div class="doctor-layout">
    <doctor-sidebar :active-tab="activeTab" @tab-change="handleTabChange" />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DoctorSidebar from './DoctorSidebar.vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref('cases') // 默认激活病例管理

// 根据当前路由设置激活的标签页
watch(
  () => route.name,
  (routeName) => {
    const routeToTabMap: Record<string, string> = {
      'DoctorDashboardMain': 'dashboard',
      'doctor.caseManagement': 'cases',
      'doctor.caseCreate': 'cases',
      'doctor.caseDetail': 'cases',
      'doctor.aiDiagnosis': 'diagnosis',
      'doctor.reports': 'reports',
      'doctor.reportEditor': 'reports',
      'doctor.knowledgeBase': 'knowledge',
      'doctor.statistics': 'statistics',
      'doctor.feedbackHistory': 'feedback',
    }
    activeTab.value = routeToTabMap[routeName as string] || 'cases'
  },
  { immediate: true }
)

// 处理标签页切换，所有tab跳转都用'/dashboard/doctor/xxx'前缀
const handleTabChange = (tab: string) => {
  activeTab.value = tab
  const tabToRouteMap: Record<string, string> = {
    'dashboard': '/dashboard/doctor',
    'cases': '/dashboard/doctor/case-management',
    'diagnosis': '/dashboard/doctor/ai-diagnosis',
    'reports': '/dashboard/doctor/reports',
    'knowledge': '/dashboard/doctor/knowledge-base',
    'statistics': '/dashboard/doctor/statistics',
    'feedback': '/dashboard/doctor/feedback',
  }
  const targetRoute = tabToRouteMap[tab]
  if (targetRoute && route.path !== targetRoute) {
    router.push(targetRoute)
  }
}
</script>

<style scoped>
.doctor-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
  background: #f5f5f5;
}
</style>