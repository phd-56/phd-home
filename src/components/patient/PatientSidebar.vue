<template>
  <div class="patient-sidebar">
    <div class="sidebar-header">
      <div class="user-info">
        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span class="text-blue-600 text-sm">{{ userInfo.name.charAt(0) }}</span>
        </div>
        <div class="user-details">
          <h4>{{ userInfo.name }}</h4>
          <p class="user-role">账号: ID {{ userInfo.id }}</p>
        </div>
      </div>
    </div>

    <div class="sidebar-menu">
      <div class="menu-section">
        <div class="section-title">患者管理</div>
        <nav class="menu-nav">
          <a 
            href="#" 
            :class="['menu-item', { active: activeTab === 'dashboard' }]"
            @click.prevent="handleMenuSelect('dashboard')"
          >
            <i class="fas fa-desktop"></i>
            <span>我的工作台</span>
          </a>
          <a 
            href="#" 
            :class="['menu-item', { active: activeTab === 'reports' }]"
            @click.prevent="handleMenuSelect('reports')"
          >
            <i class="fas fa-file-medical"></i>
            <span>影像报告</span>
          </a>
          <a 
            href="#" 
            :class="['menu-item', { active: activeTab === 'appointment' }]"
            @click.prevent="handleMenuSelect('appointment')"
          >
            <i class="fas fa-stethoscope"></i>
            <span>检查预约</span>
          </a>
        </nav>
      </div>

      <div class="menu-section">
        <div class="section-title">账户管理</div>
        <nav class="menu-nav">
          <a 
            href="#" 
            :class="['menu-item', { active: activeTab === 'settings' }]"
            @click.prevent="handleMenuSelect('settings')"
          >
            <i class="fas fa-user-cog"></i>
            <span>账户设置</span>
          </a>
          <a 
            href="#" 
            :class="['menu-item', { active: activeTab === 'help' }]"
            @click.prevent="handleMenuSelect('help')"
          >
            <i class="fas fa-question-circle"></i>
            <span>帮助中心</span>
          </a>
        </nav>
      </div>
    </div>

    <div class="sidebar-footer">
      <button 
        class="logout-btn"
        @click="handleLogout"
      >
        <i class="fas fa-sign-out-alt"></i>
        <span>退出登录</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

interface UserInfo {
  name: string
  id: string
}

const props = defineProps<{
  activeTab: string
}>()

const emit = defineEmits<{
  tabChange: [tab: string]
}>()

const router = useRouter()
const authStore = useAuthStore()

const userInfo = reactive<UserInfo>({
  name: '张老师',
  id: '2023051008'
})

const handleMenuSelect = (tab: string) => {
  emit('tabChange', tab)
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    authStore.logout()
    ElMessage.success('已退出登录')
    router.push('/')
  } catch (error) {
    // 用户取消退出
  }
}
</script>

<style scoped>
.patient-sidebar {
  width: 224px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  overflow-y: auto;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-details h4 {
  margin: 0;
  color: #1f2937;
  font-size: 14px;
  font-weight: 500;
}

.user-role {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
}

.sidebar-menu {
  flex: 1;
  padding: 16px;
}

.menu-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  color: #374151;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 14px;
}

.menu-item:hover {
  background-color: #f3f4f6;
}

.menu-item.active {
  background-color: #dbeafe;
  color: #2563eb;
}

.menu-item i {
  width: 16px;
  text-align: center;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: none;
  border: none;
  color: #374151;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: #f3f4f6;
}

.logout-btn i {
  width: 16px;
  text-align: center;
}
</style>