<template>
  <!-- 顶部导航栏 -->
  <div class="navbar" v-if="!shouldHideLayout">
    <div class="navbar-left">
      <div class="logo">🦴</div>
      <div class="brand-name">BoneAI Diagnostics</div>
    </div>
    <div class="navbar-right">
      <div class="notification">
        🔔
        <div class="notification-badge">3</div>
      </div>
      <div class="user-info">
        <div class="user-avatar">{{ userInitial }}</div>
        <div class="user-details">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>
  </div>

  <!-- 主容器 -->
  <div class="app-layout-container" :class="{ 'no-navbar': shouldHideLayout }">
    <!-- 侧边栏 - 根据路由动态显示 -->
    <AdminSidebar v-if="isAdminRoute && !shouldHideLayout" />
    <div v-else-if="!shouldHideLayout" class="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-title">主导航</div>
        <router-link class="sidebar-item" to="/dashboard/doctor" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" :class="{ active: isActive }">
            <span>工作台</span>
            <span></span>
          </a>
        </router-link>
        <router-link class="sidebar-item" to="/dashboard/doctor/ai-diagnosis" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" :class="{ active: isActive }">
            <span>影像诊断</span>
            <span></span>
          </a>
        </router-link>
        <router-link class="sidebar-item" to="/dashboard/doctor/case-management" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" :class="{ active: isActive }">
            <span>病例管理</span>
            <span class="sidebar-badge">12</span>
          </a>
        </router-link>
        <router-link class="sidebar-item" to="/dashboard/doctor/knowledge-base" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" :class="{ active: isActive }">
            <span>知识库</span>
            <span></span>
          </a>
        </router-link>
        <router-link class="sidebar-item" to="/dashboard/doctor/reports" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" :class="{ active: isActive }">
            <span>报告中心</span>
            <span></span>
          </a>
        </router-link>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-title">辅助功能</div>
        <router-link class="sidebar-item" to="/dashboard/doctor/statistics" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" :class="{ active: isActive }">
            <span>数据统计</span>
            <span></span>
          </a>
        </router-link>
        <router-link class="sidebar-item" to="/dashboard/doctor/feedback" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" :class="{ active: isActive }">
            <span>反馈中心</span>
            <span></span>
          </a>
        </router-link>
        <router-link class="sidebar-item" to="/dashboard/doctor/help" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" :class="{ active: isActive }">
            <span>帮助文档</span>
            <span></span>
          </a>
        </router-link>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <router-view :key="route.fullPath" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isAdminRoute = computed(() => {
  return route.path.startsWith('/dashboard/admin') || route.path.startsWith('/admin')
})

const shouldHideLayout = computed(() => {
  return route.path.includes('/ai-diagnosis/process')
})

const userInitial = computed(() => {
  return authStore.user?.fullName?.charAt(0) || '用'
})

const userName = computed(() => {
  return authStore.user?.fullName || '用户'
})

const userRole = computed(() => {
  const roleMap: Record<string, string> = {
    admin: '系统管理员',
    doctor: '医生',
    patient: '患者'
  }
  return roleMap[authStore.user?.role || ''] || '用户'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 顶部导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  margin-right: 0;
}

.brand-name {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.notification {
  position: relative;
  font-size: 20px;
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  padding: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.user-role {
  font-size: 12px;
  color: white;
  opacity: 0.9;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 主容器样式 */
.app-layout-container {
  display: flex;
  height: calc(100vh - 64px);
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.app-layout-container.no-navbar {
  height: 100vh;
}

/* 侧边栏样式 */
.sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 24px 0;
  overflow-y: auto;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
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
  display: block;
}

.sidebar-item a {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 0;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none;
  justify-content: center;
}

.sidebar-item a span:first-child {
  flex: 1;
  text-align: center;
}

.sidebar-item a:hover {
  background: #f0f4f8;
  color: #1e40af;
}

.sidebar-item a.active {
  color: #1e40af;
  background: #eff6ff;
  border-left: 3px solid #1e40af;
  padding-left: 13px;
}

.sidebar-badge {
  margin-left: 8px;
  background: #fecaca;
  color: #dc2626;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f5f7fa;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-layout-container {
    flex-direction: column;
  }

  .sidebar {
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

  .navbar-right {
    gap: 12px;
  }

  .user-details {
    display: none;
  }
}
</style>
