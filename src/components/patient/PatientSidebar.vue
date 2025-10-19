<template>
  <div class="patient-sidebar">
    <div class="sidebar-header">
      <div class="user-info">
        <el-avatar :size="50" :src="userInfo.avatar" />
        <div class="user-details">
          <h4>{{ userInfo.name }}</h4>
          <p class="user-role">患者</p>
        </div>
      </div>
    </div>

    <el-menu-item index="diagnosis">
  <span>🖥️ 我的诊断</span>
</el-menu-item>

<el-menu-item index="images">
  <span>🖼️ 我的影像</span>
</el-menu-item>

<el-menu-item index="reports">
  <span>📄 我的报告</span>
</el-menu-item>

<el-menu-item index="education">
  <span>📖 健康教育</span>
</el-menu-item>

<el-menu-item index="profile">
  <span>👤 个人资料</span>
</el-menu-item>

<!-- 退出登录按钮 -->
<el-button type="danger" text @click="handleLogout" class="logout-btn">
  🚪 退出登录
</el-button>

    <div class="sidebar-footer">
      <el-button type="danger" text @click="handleLogout" class="logout-btn">
        <el-icon><SwitchButton /></el-icon>
        退出登录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
//import { Monitor, Picture, Document, Reading, User, SwitchButton } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

interface UserInfo {
  name: string
  avatar: string
  medicalRecord: string
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
  avatar: 'https://via.placeholder.com/50x50?text=Patient',
  medicalRecord: 'MR20240001'
})

const handleMenuSelect = (index: string) => {
  emit('tabChange', index)
}

// const submitImage = () => {
//   router.push('/doctor/image-processing')
// }

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
  height: 100%;
  background: #fff;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e6e6e6;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.user-role {
  margin: 4px 0 0 0;
  color: #666;
  font-size: 12px;
}

.sidebar-menu {
  border: none;
  flex: 1;
}

.sidebar-menu .el-menu-item {
  height: 50px;
  margin: 4px 8px;
  border-radius: 6px;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #ecf5ff;
  color: #409eff;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e6e6e6;
}

.logout-btn {
  width: 100%;
  justify-content: flex-start;
}
</style>