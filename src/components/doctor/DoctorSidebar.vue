<template>
  <div class="doctor-sidebar">
    <div class="sidebar-header">
      <div class="user-info">
        <el-avatar :size="50" :src="userInfo.avatar" />
        <div class="user-details">
          <h4>{{ userInfo.name }}</h4>
          <p class="user-role">医生</p>
          <p class="user-hospital">{{ userInfo.hospital }}</p>
        </div>
      </div>
    </div>

    <!-- 简化的导航菜单 -->
    <div class="simple-menu">
      <div 
        v-for="item in menuItems" 
        :key="item.index"
        class="menu-item"
        :class="{ active: activeTab === item.index }"
        @click="handleMenuSelect(item.index)"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-text">{{ item.text }}</span>
      </div>
    </div>

    <!-- 快速操作区域 -->
    <div class="quick-actions">
      <h4>快速操作</h4>
      <div class="action-buttons">
        <el-button type="primary" class="action-btn" @click="createNewCase">
          ➕ 新建病例
        </el-button>
        <el-button class="action-btn" @click="uploadImage">
          ⬆️ 上传影像
        </el-button>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="doctor-stats">
        <div class="stat-item">
          <span class="stat-label">今日诊断:</span>
          <span class="stat-value">{{ todayStats.diagnosisCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">待处理:</span>
          <span class="stat-value">{{ todayStats.pendingCases }}</span>
        </div>
      </div>
      
      <el-button type="danger" text @click="handleLogout" class="logout-btn">
        🚪 退出登录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

interface UserInfo {
  name: string
  avatar: string
  hospital: string
  department: string
}

interface TodayStats {
  diagnosisCount: number
  pendingCases: number
}

interface MenuItem {
  index: string
  icon: string
  text: string
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
  name: '李医生',
  avatar: '/doctor-avatar.png', // 使用本地图片避免证书错误
  hospital: '北京协和医院',
  department: '骨科'
})

const todayStats = reactive<TodayStats>({
  diagnosisCount: 8,
  pendingCases: 3
})

const menuItems = reactive<MenuItem[]>([
  { index: 'cases', icon: '📁', text: '病例管理' },
  { index: 'images', icon: '🖼️', text: '影像查看' },
  { index: 'diagnosis', icon: '🤖', text: 'AI诊断分析' },
  { index: 'reports', icon: '📄', text: '报告生成' },
  { index: 'knowledge', icon: '📚', text: '知识库' },
  { index: 'statistics', icon: '📊', text: '数据统计' }
])

const handleMenuSelect = (index: string) => {
  emit('tabChange', index)
}

const createNewCase = () => {
  ElMessage.info('创建新病例功能')
  emit('tabChange', 'cases')
}

const uploadImage = () => {
  router.push('/doctor/image-processing')
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
.doctor-sidebar {
  height: 100%;
  background: #fff;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e6e6e6;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details h4 {
  margin: 0;
  color: white;
  font-size: 16px;
}

.user-role {
  margin: 4px 0 0 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.user-hospital {
  margin: 2px 0 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
}

/* 简化菜单样式 */
.simple-menu {
  flex: 1;
  padding: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item.active {
  background-color: #ecf5ff;
  color: #409eff;
}

.menu-icon {
  margin-right: 8px;
  font-size: 16px;
}

.menu-text {
  font-size: 14px;
}

/* 其他样式保持不变 */
.quick-actions {
  padding: 16px;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
}

.quick-actions h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  width: 100%;
  justify-content: flex-start;
  padding: 10px 16px;
}

.sidebar-footer {
  padding: 16px;
}

.doctor-stats {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  color: #666;
  font-size: 12px;
}

.stat-value {
  color: #409eff;
  font-weight: bold;
  font-size: 14px;
}

.logout-btn {
  width: 100%;
  justify-content: flex-start;
  color: #f56c6c;
}

.logout-btn:hover {
  background-color: #fef0f0;
}
</style>