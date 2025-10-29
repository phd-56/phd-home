<template>
  <div class="patient-sidebar">
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
                  <a 
                    href="#" 
                    :class="['menu-item', { active: activeTab === 'knowledge' }]"
                    @click.prevent="handleMenuSelect('knowledge')"
                  >
                    <i class="fas fa-book"></i>
                    <span>知识库</span>
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
  name: '张患者',
  id: '2023051008'
})

const handleMenuSelect = (tab: string) => {
  if (tab === 'knowledge') {
    // 知识库直接跳转到独立路由，不通过父组件
    router.push('/dashboard/patient/knowledge')
  } else {
    emit('tabChange', tab)
  }
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
  height: calc(100vh - 60px);
  background: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 60px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-menu {
  flex: 1;
  padding: 20px 0;
}

.menu-section {
  margin-bottom: 0;
}

.section-title {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
  padding: 0 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: normal;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #606266;
  text-decoration: none;
  border-radius: 0;
  transition: all 0.3s ease;
  font-size: 14px;
  position: relative;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.menu-item.active {
  background-color: #ecf5ff;
  color: #409eff;
  border-right: 3px solid #409eff;
}

.menu-item i {
  width: 16px;
  text-align: center;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  color: #606266;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.logout-btn:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.logout-btn i {
  width: 16px;
  text-align: center;
}
</style>