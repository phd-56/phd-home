<template>
  <!-- 顶部导航栏 -->
  <div class="navbar">
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
  <div class="app-layout-container">
    <!-- 侧边栏 - 根据路由动态显示 -->
    <AdminSidebar v-if="isAdminRoute" />
    <div v-else class="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-title">主导航</div>
        <div class="sidebar-item active">
          ⏱️ 工作台
        </div>
        <div class="sidebar-item">
          🖼️ 影像诊断
        </div>
        <div class="sidebar-item">
          📋 病例管理
          <span class="sidebar-badge">12</span>
        </div>
        <div class="sidebar-item">
          📚 知识库
        </div>
        <div class="sidebar-item">
          📊 报告中心
        </div>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">辅助功能</div>
        <div class="sidebar-item">
          📈 数据统计
        </div>
        <div class="sidebar-item">
          💬 反馈中心
        </div>
        <div class="sidebar-item">
          ❓ 帮助文档
        </div>
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
  padding: 0 20px;
  height: 60px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 24px;
  margin-right: 10px;
}

.brand-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification {
  position: relative;
  font-size: 20px;
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4757;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 50%;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background-color: #3498db;
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
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.user-role {
  font-size: 12px;
  color: #666;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: #2980b9;
}

/* 主容器样式 */
.app-layout-container {
  display: flex;
  height: calc(100vh - 60px);
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* 侧边栏样式 */
.sidebar {
  width: 240px;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
  padding: 20px 0;
  overflow-y: auto;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
}

.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-title {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  padding: 0 20px 10px;
  letter-spacing: 0.5px;
}

.sidebar-item {
  padding: 12px 20px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.2s;
}

.sidebar-item:hover {
  background-color: #e9ecef;
}

.sidebar-item.active {
  background-color: #3498db;
  color: white;
}

.sidebar-badge {
  background-color: #ff4757;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.sidebar-item.active .sidebar-badge {
  background-color: rgba(255, 255, 255, 0.3);
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
</style>
