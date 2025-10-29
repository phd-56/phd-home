<template>
  <div class="patient-layout">
    <!-- 患者侧边栏 -->
    <PatientSidebar 
      :active-tab="currentTab" 
      @tab-change="handleTabChange"
    />
    
    <div class="patient-dashboard">
      <!-- 顶部导航栏 -->
      <div class="top-navbar">
        <div class="navbar-left">
          <div class="logo">
            <span class="logo-text">🦴 BoneAI Diagnostics</span>
          </div>
        </div>
        <div class="navbar-right">
          <div class="notification-center">
            <el-badge :value="3" class="notification-badge">
              <el-button circle>
                <i class="fas fa-bell"></i>
              </el-button>
            </el-badge>
          </div>
          <div class="user-profile">
            <el-dropdown @command="handleUserAction">
              <span class="user-info">
                <div class="user-avatar">张</div>
                <div class="user-details">
                  <div class="user-name">张患者</div>
                  <div class="user-role">患者</div>
                </div>
                <i class="fas fa-caret-down"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="settings">账户设置</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="main-content-area">
        <!-- 路由出口 - 始终存在，用于显示子路由内容 -->
        <router-view />
        
        <!-- 只有当访问根路径时才显示主页内容 -->
        <div v-if="$route.path === '/dashboard/patient'" class="dashboard-content">
          <!-- 页面头部 -->
          <div class="page-header">
            <div>
              <h1 class="text-2xl font-semibold text-gray-800 mb-1">我的工作台</h1>
              <p class="text-sm text-gray-500">欢迎回来，张患者！在这里您可以查看您的健康管理中心</p>
            </div>
            <div class="header-actions">
              <button 
                class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                @click="goToAppointment"
              >
                <i class="fas fa-calendar-plus"></i>
                <span>预约检查</span>
              </button>
            </div>
          </div>

        <div class="flex gap-6">
          <!-- 左侧主要内容 -->
          <div class="flex-1">
            <!-- 快速访问卡片 -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <!-- 我的报告卡片 -->
              <div 
                class="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                @click="goToReports"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <i class="fas fa-file-alt text-blue-600 text-lg"></i>
                  </div>
                </div>
                <h3 class="text-gray-800 font-medium mb-1">我的报告</h3>
                <p class="text-sm text-gray-500 mb-3">查看您的影像诊断报告和检查记录</p>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-400">共 5 份报告</span>
                  <i class="fas fa-arrow-right text-gray-400"></i>
                </div>
              </div>

              <!-- 检查预约卡片 -->
              <div 
                class="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                @click="goToAppointment"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <i class="fas fa-calendar-check text-green-600 text-lg"></i>
                  </div>
                </div>
                <h3 class="text-gray-800 font-medium mb-1">检查预约</h3>
                <p class="text-sm text-gray-500 mb-3">预约影像检查或查看预约记录</p>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-400">1 个待检查</span>
                  <i class="fas fa-arrow-right text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- 近期影像报告 -->
            <div class="bg-white rounded-lg border border-gray-200">
              <div class="p-5 border-b border-gray-200 flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-800">近期影像报告</h2>
                <button 
                  class="text-blue-600 text-sm hover:underline flex items-center gap-1"
                  @click="goToReports"
                >
                  <span>查看全部</span>
                  <i class="fas fa-arrow-right text-xs"></i>
                </button>
              </div>

              <!-- 报告列表 -->
              <div class="divide-y divide-gray-200">
                <!-- 报告1 -->
                <div class="p-5">
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <h3 class="text-gray-800 font-medium mb-1">核磁共振检查</h3>
                      <p class="text-sm text-gray-500">检查日期: 2023-08-15 | 报告日期: 2023-08-16</p>
                    </div>
                    <span class="bg-green-50 text-green-600 text-xs px-2 py-1 rounded">已完成</span>
                  </div>
                  <div class="flex gap-4">
                    <img src="https://via.placeholder.com/80x80/e0e7ff/4f46e5?text=MRI" alt="MRI Scan" class="w-20 h-20 rounded-lg object-cover">
                    <div class="flex-1">
                      <p class="text-sm text-gray-600 mb-3">诊断意见：左膝关节半月板损伤合并积液（上图），关节囊肿胀，建议进一步治疗。请遵医嘱进行后续治疗，如有疑问，请咨询主治医生。</p>
                      <div class="flex gap-3 text-sm text-gray-500">
                        <button class="flex items-center gap-1 hover:text-blue-600">
                          <i class="far fa-eye"></i>
                          <span>查看详情</span>
                        </button>
                        <button class="flex items-center gap-1 hover:text-blue-600">
                          <i class="fas fa-download"></i>
                          <span>下载报告</span>
                        </button>
                        <button class="flex items-center gap-1 hover:text-blue-600">
                          <i class="far fa-share-square"></i>
                          <span>分享</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 报告2 -->
                <div class="p-5">
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <h3 class="text-gray-800 font-medium mb-1">胸部CT检查</h3>
                      <p class="text-sm text-gray-500">检查日期: 2023-07-22 | 报告日期: 2023-07-23</p>
                    </div>
                    <span class="bg-green-50 text-green-600 text-xs px-2 py-1 rounded">已完成</span>
                  </div>
                  <div class="flex gap-4">
                    <img src="https://via.placeholder.com/80x80/1e293b/94a3b8?text=CT" alt="CT Scan" class="w-20 h-20 rounded-lg object-cover">
                    <div class="flex-1">
                      <p class="text-sm text-gray-600 mb-3">诊断意见：1.右肺中叶结节性病变，建议进行活检。2.纵隔淋巴结肿大，需进一步检查。3.请遵医嘱进行后续治疗，如有疑问，请咨询主治医生。</p>
                      <div class="flex gap-3 text-sm text-gray-500">
                        <button class="flex items-center gap-1 hover:text-blue-600">
                          <i class="far fa-eye"></i>
                          <span>查看详情</span>
                        </button>
                        <button class="flex items-center gap-1 hover:text-blue-600">
                          <i class="fas fa-download"></i>
                          <span>下载报告</span>
                        </button>
                        <button class="flex items-center gap-1 hover:text-blue-600">
                          <i class="far fa-share-square"></i>
                          <span>分享</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 报告3 -->
                <div class="p-5">
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <h3 class="text-gray-800 font-medium mb-1">胸部X光检查</h3>
                      <p class="text-sm text-gray-500">检查日期: 2023-06-30 | 报告日期: 2023-07-01</p>
                    </div>
                    <span class="bg-green-50 text-green-600 text-xs px-2 py-1 rounded">已完成</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧边栏 -->
          <div class="w-80 space-y-4">
            <!-- 检查预约 -->
            <div class="bg-white rounded-lg border border-gray-200 p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-gray-800 font-medium">检查预约</h3>
                <span class="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">进行中</span>
              </div>
              <p class="text-sm text-gray-500 mb-3">您的影像检查已安排</p>
            </div>

            <!-- AI问诊 -->
            <div class="bg-white rounded-lg border border-gray-200 p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-gray-800 font-medium">继续AI问诊</h3>
                <span class="bg-yellow-50 text-yellow-600 text-xs px-2 py-1 rounded">待续诊</span>
              </div>
              <div class="space-y-3 mb-4">
                <div class="flex items-start gap-2">
                  <i class="fas fa-circle text-yellow-400 text-xs mt-1"></i>
                  <div class="text-sm">
                    <div class="text-gray-600">下一次复诊</div>
                    <div class="text-gray-800">2023年9月10日 (星期日) 上午 9:20</div>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <i class="fas fa-circle text-yellow-400 text-xs mt-1"></i>
                  <div class="text-sm">
                    <div class="text-gray-600">复诊项目</div>
                    <div class="text-gray-800">第二次复查 复查右膝关节半月板</div>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <i class="fas fa-circle text-yellow-400 text-xs mt-1"></i>
                  <div class="text-sm">
                    <div class="text-gray-600">主治医生</div>
                    <div class="text-gray-800">王医生 (骨科)</div>
                  </div>
                </div>
              </div>
              <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">联系问诊</button>
            </div>

            <!-- 即将到来的检查 -->
            <div class="bg-white rounded-lg border border-gray-200 p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-gray-800 font-medium">胸部CT检查</h3>
                <span class="bg-green-50 text-green-600 text-xs px-2 py-1 rounded">已完成</span>
              </div>
              <div class="flex items-start gap-2 mb-3">
                <i class="fas fa-circle text-blue-400 text-xs mt-1"></i>
                <div class="text-sm">
                  <div class="text-gray-600">检查日期</div>
                  <div class="text-gray-800">2023年8月1日 (星期二) 下午 2:15</div>
                </div>
              </div>
              <button class="w-full text-blue-600 border border-blue-600 py-2 rounded-lg hover:bg-blue-50">查看报告</button>
            </div>

            <!-- 健康提示 -->
            <div class="bg-white rounded-lg border border-gray-200 p-5">
              <h3 class="text-gray-800 font-medium mb-4">健康提示</h3>
              <div class="space-y-3">
                <div class="text-sm">
                  <div class="flex items-start gap-2 mb-2">
                    <i class="fas fa-circle text-blue-400 text-xs mt-1"></i>
                    <div class="font-medium text-gray-800">膝关节保护建议</div>
                  </div>
                  <p class="text-gray-600 text-xs pl-5">针对您的半月板损伤，建议减少剧烈运动，避免长时间站立或行走，可适当进行游泳等低冲击运动，有助于关节恢复。</p>
                </div>
                <div class="text-sm">
                  <div class="flex items-start gap-2 mb-2">
                    <i class="fas fa-circle text-green-400 text-xs mt-1"></i>
                    <div class="font-medium text-gray-800">肺部健康评估</div>
                  </div>
                  <p class="text-gray-600 text-xs pl-5">您的胸部CT显示有结节性病变，建议定期复查，保持良好的生活习惯，避免吸烟和二手烟，增强免疫力。</p>
                </div>
                <div class="text-sm">
                  <div class="flex items-start gap-2 mb-2">
                    <i class="fas fa-circle text-yellow-400 text-xs mt-1"></i>
                    <div class="font-medium text-gray-800">复查提醒</div>
                  </div>
                  <p class="text-gray-600 text-xs pl-5">您的复查时间即将到来，请提前做好准备，按时就诊。如有任何不适，请及时联系医生。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage, ElMessageBox } from 'element-plus';
import PatientSidebar from '@/components/patient/PatientSidebar.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 根据当前路由确定活动标签
const currentTab = computed(() => {
  const path = route.path;
  if (path.includes('/reports')) return 'reports';
  if (path.includes('/appointment')) return 'appointment';
  if (path.includes('/settings')) return 'settings';
  if (path.includes('/help')) return 'help';
  return 'dashboard';
});

const goToReports = () => {
  router.push('/dashboard/patient/reports');
};

const goToAppointment = () => {
  router.push('/dashboard/patient/appointment');
};

const goToSettings = () => {
  router.push('/dashboard/patient/settings');
};

const goToHelp = () => {
  router.push('/dashboard/patient/help');
};

const handleTabChange = (tab: string) => {
  switch (tab) {
    case 'dashboard':
      router.push('/dashboard/patient');
      break;
    case 'reports':
      router.push('/dashboard/patient/reports');
      break;
    case 'appointment':
      router.push('/dashboard/patient/appointment');
      break;
    case 'knowledge':
      router.push('/dashboard/patient/knowledge');
      break;
    case 'settings':
      router.push('/dashboard/patient/settings');
      break;
    case 'help':
      router.push('/dashboard/patient/help');
      break;
  }
};

const handleLogout = () => {
  authStore.logout();
  ElMessage.success('已退出登录');
  router.push('/');
};

const handleUserAction = async (command: string) => {
  switch (command) {
    case 'profile':
      // 跳转到个人中心（如果有的话）
      ElMessage.info('个人中心功能开发中');
      break;
    case 'settings':
      router.push('/dashboard/patient/settings');
      break;
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        handleLogout();
      } catch {
        // 用户取消
      }
      break;
  }
};
</script>

<style scoped>
.patient-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.patient-dashboard {
  flex: 1;
  margin-left: 224px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 顶部导航栏样式 */
.top-navbar {
  background-color: #1890ff;
  color: white;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo .logo-text {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-center {
  position: relative;
}

.notification-badge {
  border: none;
}

.notification-badge :deep(.el-badge__content) {
  background-color: #ff4d4f;
}

.notification-badge .el-button {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 18px;
}

.notification-badge .el-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background-color: #ff7875;
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
  color: white;
}

.user-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.user-info .fa-caret-down {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

/* 主内容区域 */
.main-content-area {
  flex: 1;
  padding: 24px;
  margin-top: 60px;
  overflow-y: auto;
}

/* 工作台页面 - 居中显示 */
.dashboard-content {
  max-width: 1400px;
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  margin: 0 auto; /* 工作台页面居中显示 */
}

/* 子页面内容样式 - 距离侧边栏较近，统一24px */
.main-content-area :deep(.patient-reports),
.main-content-area :deep(.patient-appointment),
.main-content-area :deep(.patient-settings),
.main-content-area :deep(.patient-help) {
  background: #ffffff;
  padding: 24px;
  border-radius: 8px;
  min-height: calc(100vh - 120px);
  max-width: 1200px;
  margin: 0 auto;
}

.main-content-area :deep(.page-header) {
  margin-bottom: 24px;
}

.main-content-area :deep(h1) {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.main-content-area :deep(.text-gray-500) {
  color: #909399;
  font-size: 14px;
}

.dashboard-content {
  max-width: 1400px; /* 工作台页面更宽 */
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
}

.page-header {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;
}

.page-header p {
  margin: 4px 0 0 0;
  color: #6b7280;
  font-size: 14px;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-4 {
  gap: 16px;
}

.gap-6 {
  gap: 24px;
}

.mb-6 {
  margin-bottom: 24px;
}

.bg-white {
  background-color: #ffffff;
}

.rounded-lg {
  border-radius: 8px;
}

.border {
  border-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.p-5 {
  padding: 20px;
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.cursor-pointer {
  cursor: pointer;
}

.flex {
  display: flex;
}

.items-start {
  align-items: flex-start;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.w-10 {
  width: 40px;
}

.h-10 {
  height: 40px;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.text-blue-600 {
  color: #2563eb;
}

.text-lg {
  font-size: 18px;
  line-height: 28px;
}

.font-medium {
  font-weight: 500;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-sm {
  font-size: 14px;
  line-height: 20px;
}

.mb-1 {
  margin-bottom: 4px;
}

.mb-3 {
  margin-bottom: 12px;
}

.text-xs {
  font-size: 12px;
  line-height: 16px;
}

.px-2 {
  padding-left: 8px;
  padding-right: 8px;
}

.py-1 {
  padding-top: 4px;
  padding-bottom: 4px;
}

.rounded {
  border-radius: 4px;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.text-green-600 {
  color: #16a34a;
}

.w-20 {
  width: 80px;
}

.h-20 {
  height: 80px;
}

.object-cover {
  object-fit: cover;
}

.text-gray-600 {
  color: #4b5563;
}

.hover\:text-blue-600:hover {
  color: #2563eb;
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.w-80 {
  width: 320px;
}

.space-y-4 > * + * {
  margin-top: 16px;
}

.space-y-3 > * + * {
  margin-top: 12px;
}

.bg-yellow-50 {
  background-color: #fefce8;
}

.text-yellow-600 {
  color: #ca8a04;
}

.text-yellow-400 {
  color: #facc15;
}

.text-blue-400 {
  color: #60a5fa;
}

.text-green-400 {
  color: #4ade80;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.text-white {
  color: #ffffff;
}

.px-4 {
  padding-left: 16px;
  padding-right: 16px;
}

.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\:bg-blue-50:hover {
  background-color: #eff6ff;
}

.border-blue-600 {
  border-color: #2563eb;
}

.w-full {
  width: 100%;
}

.text-center {
  text-align: center;
}

.font-semibold {
  font-weight: 600;
}

.text-2xl {
  font-size: 24px;
  line-height: 32px;
}

.border-b {
  border-bottom-width: 1px;
}

.divide-y > * + * {
  border-top-width: 1px;
}

.divide-gray-200 > * + * {
  border-color: #e5e7eb;
}

.pl-5 {
  padding-left: 20px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .patient-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    height: calc(100vh - 60px);
    top: 60px;
  }
  
  .patient-dashboard {
    margin-left: 0;
  }
  
  .main-content-area {
    margin-left: 0;
  }
  
  .flex {
    flex-direction: column;
  }
  
  .w-80 {
    width: 100%;
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>