<template>
  <div class="patient-layout">
    <!-- 患者侧边栏 -->
    <PatientSidebar 
      :active-tab="'settings'" 
      @tab-change="handleTabChange"
    />
    
    <div class="patient-settings">
      <div class="page-header">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800 mb-1">账户设置</h1>
          <p class="text-sm text-gray-500">管理您的个人资料、安全设置和偏好</p>
        </div>
      </div>

      <!-- 两栏布局 -->
      <div class="settings-container">
        <!-- 左侧主内容区（可滚动） -->
        <div class="settings-list">
          
          <!-- 卡片1: 个人资料 -->
          <div class="setting-card" id="profile">
            <div class="setting-card-icon">
              <i class="fas fa-user"></i>
            </div>
            <div class="setting-card-content">
              <h2 class="setting-card-title">个人资料</h2>
              
              <!-- 头像 -->
              <div class="setting-item">
                <label class="setting-label">头像</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 text-xl">{{ userInfo.name.charAt(0) }}</span>
                  </div>
                  <div>
                    <button 
                      class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                      @click="changeAvatar"
                    >
                      上传新头像
                    </button>
                  </div>
                </div>
              </div>

              <!-- 表单字段 -->
              <div class="setting-item">
                <label class="setting-label">昵称</label>
                <input 
                  v-model="userInfo.name"
                  type="text" 
                  class="setting-input"
                  placeholder="请输入昵称"
                >
              </div>

              <div class="setting-item">
                <label class="setting-label">电子邮箱</label>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">j***@example.com</span>
                  <a href="#" class="text-blue-600 hover:underline text-sm">更改</a>
                </div>
              </div>

              <div class="setting-item">
                <label class="setting-label">性别</label>
                <select 
                  v-model="userInfo.gender"
                  class="setting-input"
                >
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>

              <div class="setting-item">
                <label class="setting-label">出生日期</label>
                <input 
                  v-model="userInfo.birthDate"
                  type="date" 
                  class="setting-input"
                >
              </div>

              <div class="setting-item">
                <label class="setting-label">手机号码</label>
                <input 
                  v-model="userInfo.phone"
                  type="tel" 
                  class="setting-input"
                >
              </div>
            </div>
          </div>

          <!-- 卡片2: 安全设置 -->
          <div class="setting-card" id="security">
            <div class="setting-card-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <div class="setting-card-content">
              <h2 class="setting-card-title">安全设置</h2>
              
              <div class="setting-item">
                <label class="setting-label">登录密码</label>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">********</span>
                  <a href="#" class="text-blue-600 hover:underline text-sm">更改</a>
                </div>
              </div>

              <div class="setting-item">
                <label class="setting-label">两步验证 (2FA)</label>
                <div class="flex items-center justify-between">
                  <span class="text-green-600">已启用</span>
                  <button class="setting-btn-secondary">管理</button>
                </div>
              </div>

              <div class="setting-item">
                <label class="setting-label">登录设备管理</label>
                <p class="text-sm text-gray-500 mb-3">当前有 2 台设备登录</p>
                <button class="setting-btn-secondary">查看所有设备</button>
              </div>
            </div>
          </div>

          <!-- 卡片3: 通知设置 -->
          <div class="setting-card" id="notification">
            <div class="setting-card-icon">
              <i class="fas fa-bell"></i>
            </div>
            <div class="setting-card-content">
              <h2 class="setting-card-title">通知设置</h2>
              
              <div class="setting-item">
                <label class="checkbox-label">
                  <input 
                    v-model="notificationSettings.email"
                    type="checkbox"
                    class="setting-checkbox"
                  >
                  <span>邮件通知（活动与更新）</span>
                </label>
              </div>

              <div class="setting-item">
                <label class="checkbox-label">
                  <input 
                    v-model="notificationSettings.inApp"
                    type="checkbox"
                    class="setting-checkbox"
                  >
                  <span>站内信通知（系统消息）</span>
                </label>
              </div>

              <div class="setting-item">
                <label class="checkbox-label">
                  <input 
                    v-model="notificationSettings.sms"
                    type="checkbox"
                    class="setting-checkbox"
                  >
                  <span>短信通知（重要安全警报）</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 卡片4: 偏好设置 -->
          <div class="setting-card" id="preference">
            <div class="setting-card-icon">
              <i class="fas fa-cog"></i>
            </div>
            <div class="setting-card-content">
              <h2 class="setting-card-title">偏好设置</h2>
              
              <div class="setting-item">
                <label class="setting-label">语言</label>
                <select class="setting-input">
                  <option>简体中文</option>
                  <option>English</option>
                </select>
              </div>

              <div class="setting-item">
                <label class="setting-label">时区</label>
                <select class="setting-input">
                  <option>中国标准时间 (UTC+8)</option>
                  <option>美国东部时间 (UTC-5)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        <!-- 右侧导航与操作区（固定） -->
        <div class="settings-sidebar">
          <div class="sidebar-card">
            <h3 class="sidebar-title">页面导航</h3>
            <div class="sidebar-nav">
              <a href="#profile" class="sidebar-nav-item" @click.prevent="scrollToSection('profile')">
                <i class="fas fa-circle"></i>
                <span>个人资料</span>
              </a>
              <a href="#security" class="sidebar-nav-item" @click.prevent="scrollToSection('security')">
                <i class="fas fa-circle"></i>
                <span>安全设置</span>
              </a>
              <a href="#notification" class="sidebar-nav-item" @click.prevent="scrollToSection('notification')">
                <i class="fas fa-circle"></i>
                <span>通知设置</span>
              </a>
              <a href="#preference" class="sidebar-nav-item" @click.prevent="scrollToSection('preference')">
                <i class="fas fa-circle"></i>
                <span>偏好设置</span>
              </a>
            </div>
          </div>

          <div class="sidebar-actions">
            <button 
              class="sidebar-btn-primary"
              @click="saveSettings"
            >
              <i class="fas fa-save mr-2"></i>
              保存更改
            </button>
            <button 
              class="sidebar-btn-secondary"
              @click="goBack"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              返回
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PatientSidebar from '@/components/patient/PatientSidebar.vue'

const router = useRouter()

// 用户信息
const userInfo = reactive({
  name: '张老师',
  gender: '男',
  birthDate: '1990-01-01',
  phone: '13800138000'
})

// 通知设置
const notificationSettings = reactive({
  email: true,
  inApp: true,
  sms: false
})

// 方法
const handleTabChange = (tab: string) => {
  switch (tab) {
    case 'dashboard':
      router.push('/dashboard/patient')
      break
    case 'reports':
      router.push('/dashboard/patient/reports')
      break
    case 'appointment':
      router.push('/dashboard/patient/appointment')
      break
    case 'settings':
      router.push('/dashboard/patient/settings')
      break
    case 'help':
      router.push('/dashboard/patient/help')
      break
    case 'knowledge':
      router.push('/dashboard/patient/knowledge')
      break
  }
}

const changeAvatar = () => {
  ElMessage.info('头像更换功能开发中')
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const saveSettings = () => {
  ElMessage.success('设置保存成功')
}

const goBack = () => {
  router.push('/dashboard/patient')
}
</script>

<style scoped>
.patient-layout {
  min-height: 100vh;
  background: #f9fafb;
}

.patient-settings {
  margin-left: 224px;
  padding: 24px;
  min-height: 100vh;
  width: calc(100% - 224px);
}

.page-header {
  margin-bottom: 24px;
}

/* 两栏布局容器 */
.settings-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

/* 左侧列表区 */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 设置卡片 */
.setting-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  display: flex;
  transition: all 0.2s ease;
}

.setting-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 卡片图标 */
.setting-card-icon {
  width: 60px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.setting-card-icon i {
  font-size: 24px;
  color: #3b82f6;
}

/* 卡片内容 */
.setting-card-content {
  flex: 1;
  padding: 24px;
}

.setting-card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

/* 设置项 */
.setting-item {
  margin-bottom: 20px;
}

.setting-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.setting-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.setting-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.setting-btn-secondary {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.setting-btn-secondary:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

/* 复选框样式 */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.setting-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 右侧边栏 */
.settings-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 24px;
  height: fit-content;
}

.sidebar-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 16px;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  color: #6b7280;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.sidebar-nav-item:hover {
  background: #f3f4f6;
  color: #3b82f6;
}

.sidebar-nav-item i {
  font-size: 6px;
}

/* 操作按钮 */
.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-btn-primary {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-btn-primary:hover {
  background: #2563eb;
}

.sidebar-btn-secondary {
  width: 100%;
  padding: 12px;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .settings-container {
    grid-template-columns: 1fr;
  }
  
  .settings-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .patient-settings {
    margin-left: 0;
    padding: 16px;
    width: 100%;
  }
  
  .setting-card {
    flex-direction: column;
  }
  
  .setting-card-icon {
    width: 100%;
    height: 60px;
  }
}
</style>
