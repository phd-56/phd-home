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
      'CaseManagement': 'cases',
      'ImageViewer': 'images',
      'ImageUpload': 'ai-diagnosis',
      'DiagnosisResult': 'ai-diagnosis',
      'AIDiagnosis': 'ai-diagnosis',
      'ReportGenerator': 'reports',
      'ReportPreview': 'reports',
      'KnowledgeBase': 'knowledge',
      'Statistics': 'statistics'
    }
    activeTab.value = routeToTabMap[routeName as string] || 'cases'
  },
  { immediate: true }
)

// 处理标签页切换
const handleTabChange = (tab: string) => {
  activeTab.value = tab
  
  const tabToRouteMap: Record<string, string> = {
    'cases': '/doctor/cases',
    'images': '/doctor/images',
    'ai-diagnosis': '/doctor/ai-diagnosis/upload', // 修正为正确的上传路径
    'reports': '/doctor/reports',
    'knowledge': '/doctor/knowledge',
    'statistics': '/doctor/statistics'
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