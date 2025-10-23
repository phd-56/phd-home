<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h2 class="logo">AI骨龄诊断系统</h2>
        <p class="user-info">{{ getUserDisplayName() }} ({{ getRoleName(authStore.user?.role) }})</p>
      </div>
      
      <div class="sidebar-menu">
        <!-- 根据用户角色显示不同的菜单 -->
        <div v-for="section in menuSections" :key="section.title" class="menu-section">
          <h3 class="section-title">{{ section.title }}</h3>
          <el-menu
            :default-active="activeMenu"
            class="sidebar-menu-list"
            @select="handleMenuSelect"
          >
            <el-menu-item 
              v-for="item in section.items" 
              :key="item.key"
              :index="item.key"
              :disabled="!isMenuVisible(item)"
            >
              <span class="menu-icon">{{ item.icon }}</span>
              <span class="menu-text">{{ item.name }}</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
      
      <div class="sidebar-footer">
        <el-button type="primary" @click="handleLogout" class="logout-btn">
          🚪 退出登录
        </el-button>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeMenu = ref('')

// 根据当前路由设置激活的菜单
onMounted(() => {
  activeMenu.value = route.path
})

// 菜单数据结构 - 修正为正确的路由路径格式
const menuSections = [
  {
    title: '系统管理',
    items: [
      { key: '/dashboard/admin/user-management', name: '用户管理', icon: '👥', roles: ['admin'] },
      { key: '/dashboard/admin/system-monitor', name: '数据监控', icon: '📊', roles: ['admin'] },
      { key: '/dashboard/admin/data-backup', name: '数据备份', icon: '💾', roles: ['admin'] },
      { key: '/dashboard/admin/audit-logs', name: '操作日志', icon: '📝', roles: ['admin'] },
    ]
  },
  {
    title: '模型管理',
    items: [
      { key: '/dashboard/admin/model-optimization', name: '模型优化', icon: '⚙️', roles: ['admin'] },
    ]
  }
]

// 检查菜单是否对当前用户可见
const isMenuVisible = (menuItem: any) => {
  const userRole = authStore.user?.role
  return userRole ? menuItem.roles.includes(userRole) : false
}

// 获取角色中文名 - 修复类型错误
const getRoleName = (role: string | undefined): string => {
  if (!role) return '未知角色'
  
  const roleMap: Record<string, string> = {
    patient: '患者',
    doctor: '医生',
    admin: '管理员'
  }
  return roleMap[role] || '用户'
}

// 获取用户显示名称 - 安全地处理可能的undefined
const getUserDisplayName = (): string => {
  return authStore.user?.fullName || authStore.user?.username || '未知用户'
}

// 菜单选择处理
const handleMenuSelect = (key: string) => {
  try {
    // 直接使用key作为完整路径，因为已经包含了/admin前缀
    router.push(key)
  } catch (error) {
    console.error('菜单跳转错误:', error)
    ElMessage.error('页面跳转失败，请检查系统设置')
  }
}

// 退出登录
const handleLogout = () => {
  authStore.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

/* 侧边栏样式 */
.sidebar {
  width: 280px;
  background: #1f2937;
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #374151;
}

.logo {
  font-size: 1.25rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 8px;
}

.user-info {
  font-size: 0.875rem;
  color: #9ca3af;
}

.sidebar-menu {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.menu-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 20px 8px;
  margin: 0;
}

/* Element Plus 菜单样式重写 */
:deep(.sidebar-menu-list) {
  background: transparent;
  border: none;
}

:deep(.sidebar-menu-list .el-menu-item) {
  height: 44px;
  line-height: 44px;
  color: #d1d5db;
  background: transparent;
  border: none;
  margin: 2px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

:deep(.sidebar-menu-list .el-menu-item:hover) {
  background: #374151;
  color: white;
}

:deep(.sidebar-menu-list .el-menu-item.is-active) {
  background: #3b82f6;
  color: white;
}

:deep(.sidebar-menu-list .el-menu-item.is-disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}

.menu-icon {
  margin-right: 12px;
  font-size: 1.1rem;
}

.menu-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #374151;
}

.logout-btn {
  width: 100%;
  background: #ef4444;
  border: none;
  border-radius: 6px;
  padding: 12px;
}

.logout-btn:hover {
  background: #dc2626;
}

/* 主内容区 */
.main-content {
  flex: 1;
  background: #f8fafc;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 240px;
  }
}
</style>