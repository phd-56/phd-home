<template>
  <div class="dashboard-sidebar">
    <!-- 主导航 -->
    <div class="sidebar-section">
      <div class="sidebar-title">主导航</div>
      <div 
        class="sidebar-item"
        :class="{ active: activeTab === 'dashboard' }"
        @click="navigateTo('dashboard')"
      >
        工作台
      </div>
            <div
              class="sidebar-item"
              :class="{ active: activeTab === 'ai-diagnosis' }"
              @click="navigateTo('ai-diagnosis')"
            >
              影像诊断
            </div>
      <div 
        class="sidebar-item"
        :class="{ active: activeTab === 'case-management' }"
        @click="navigateTo('case-management')"
      >
        病例管理
      </div>
      <div 
        class="sidebar-item"
        :class="{ active: activeTab === 'knowledge-base' }"
        @click="navigateTo('knowledge-base')"
      >
        知识库
      </div>
      <div 
        class="sidebar-item"
        :class="{ active: activeTab === 'reports' }"
        @click="navigateTo('reports')"
      >
        报告中心
      </div>
    </div>

    <!-- 辅助功能 -->
    <div class="sidebar-section">
      <div class="sidebar-title">辅助功能</div>
      <div 
        class="sidebar-item"
        :class="{ active: activeTab === 'statistics' }"
        @click="navigateTo('statistics')"
      >
        数据统计
      </div>
      <div 
        class="sidebar-item"
        :class="{ active: activeTab === 'feedback' }"
        @click="navigateTo('feedback')"
      >
        反馈中心
      </div>
      <div 
        class="sidebar-item"
        :class="{ active: activeTab === 'help' }"
        @click="navigateTo('help')"
      >
        帮助文档
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeTab = ref('dashboard')

// 根据当前路由设置激活的标签页
watch(
  () => route.name,
  (routeName) => {
        const routeToTabMap: Record<string, string> = {
          'DoctorDashboardMain': 'dashboard',
          'doctor.aiDiagnosis': 'ai-diagnosis',
          'doctor.caseManagement': 'case-management',
          'doctor.knowledgeBase': 'knowledge-base',
          'doctor.reports': 'reports',
          'doctor.statistics': 'statistics',
          'doctor.feedbackHistory': 'feedback',
          'doctor.help': 'help'
        }
    activeTab.value = routeToTabMap[routeName as string] || 'dashboard'
  },
  { immediate: true }
)

// 导航函数
const navigateTo = (tab: string) => {
  activeTab.value = tab
  
        const tabToRouteMap: Record<string, string> = {
          'dashboard': '/dashboard/doctor',
          'ai-diagnosis': '/dashboard/doctor/ai-diagnosis',
          'case-management': '/dashboard/doctor/case-management',
          'knowledge-base': '/dashboard/doctor/knowledge-base',
          'reports': '/dashboard/doctor/reports',
          'statistics': '/dashboard/doctor/statistics',
          'feedback': '/dashboard/doctor/feedback',
          'help': '/dashboard/doctor/help'
        }
  
  const targetRoute = tabToRouteMap[tab]
  if (targetRoute && route.path !== targetRoute) {
    router.push(targetRoute)
  }
}
</script>

<style scoped>
.dashboard-sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  padding: 24px 0;
}

.sidebar-section {
  margin-bottom: 24px;
}

.sidebar-title {
  font-size: 12px;
  color: #999;
  font-weight: 600;
  padding: 0 16px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
}

.sidebar-item:hover {
  background: #f0f4f8;
  color: #1e40af;
}

.sidebar-item.active {
  color: #1e40af;
  background: #eff6ff;
  border-left: 3px solid #1e40af;
  padding-left: 13px;
}

.sidebar-badge {
  margin-left: auto;
  background: #fecaca;
  color: #dc2626;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    overflow-x: auto;
    padding: 12px 0;
  }

  .sidebar-section {
    margin-bottom: 0;
    margin-right: 24px;
  }
}
</style>
