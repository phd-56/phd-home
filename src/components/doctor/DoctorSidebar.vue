<template>
  <div class="doctor-sidebar">
    <!-- 侧边栏导航菜单 -->
    <div class="sidebar-menu">
      <div class="main-menu">
        <div 
          v-for="item in mainMenuItems" 
          :key="item.index" 
          class="menu-item" 
          :class="{ active: isActive(item.index) }"
          @click="handleMenuSelect(item.index)"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-text">{{ item.text }}</span>
          <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
        </div>
      </div>
      
      <div class="sub-menu">
        <h4 class="menu-section-title">辅助功能</h4>
        <div 
          v-for="item in subMenuItems" 
          :key="item.index" 
          class="menu-item" 
          :class="{ active: isActive(item.index) }"
          @click="handleMenuSelect(item.index)"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-text">{{ item.text }}</span>
        </div>
      </div>
    </div>

    <!-- 快速操作区域 -->
    <div class="quick-actions">
      <h4 class="section-title">快速操作</h4>
      <div class="action-buttons">
        <el-button 
          type="primary" 
          class="action-btn" 
          @click="startAIDiagnosis"
        >
          🤖 开始AI诊断
        </el-button>
        <el-button 
          type="default" 
          class="action-btn" 
          @click="createNewCase"
        >
          ➕ 新建病例
        </el-button>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="sidebar-footer">
      <div class="system-info">
        <p class="system-version">BoneAI v2.0</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

interface MenuItem {
  index: string
  icon: string
  text: string
  badge?: string
}

const props = defineProps<{
  activeTab: string
}>()

const emit = defineEmits<{
  tabChange: [tab: string]
}>()

const router = useRouter()
const route = useRoute()

// 主菜单项
const mainMenuItems = reactive<MenuItem[]>([
  { index: 'dashboard', icon: '🏠', text: '工作台', badge: '12' },
  { index: 'cases', icon: '📋', text: '病例管理' },
  { index: 'diagnosis', icon: '🔍', text: '影像诊断' },
  { index: 'reports', icon: '📄', text: '报告中心' }
])

// 辅助菜单项
const subMenuItems = reactive<MenuItem[]>([
  { index: 'knowledge', icon: '📚', text: '知识库' },
  { index: 'statistics', icon: '📊', text: '数据统计' },
  { index: 'feedback', icon: '💬', text: '反馈中心' }
])

// 路由到菜单项的映射
const routeToMenuMap: Record<string, string> = {
  '': 'dashboard',
  '/dashboard/doctor': 'dashboard',
  '/dashboard/doctor/case-management': 'cases',
  '/dashboard/doctor/case-management/create': 'cases',
  '/dashboard/doctor/case-management/:id': 'cases',
  '/dashboard/doctor/ai-diagnosis': 'diagnosis',
  '/dashboard/doctor/reports': 'reports',
  '/dashboard/doctor/reports/editor': 'reports',
  '/dashboard/doctor/knowledge-base': 'knowledge',
  '/dashboard/doctor/statistics': 'statistics',
  '/dashboard/doctor/feedback': 'feedback'
}

// 判断菜单项是否激活
const isActive = (index: string) => {
  // 首先尝试通过当前路由路径匹配
  const currentPath = route.path
  
  // 检查路径是否匹配对应的菜单项
  if (index === 'dashboard' && (currentPath === '/dashboard/doctor' || currentPath === '/dashboard/doctor/')) {
    return true
  }
  if (index === 'cases' && currentPath.startsWith('/dashboard/doctor/case-management')) {
    return true
  }
  if (index === 'diagnosis' && currentPath.startsWith('/dashboard/doctor/ai-diagnosis')) {
    return true
  }
  if (index === 'reports' && currentPath.startsWith('/dashboard/doctor/reports')) {
    return true
  }
  if (index === 'knowledge' && currentPath.startsWith('/dashboard/doctor/knowledge-base')) {
    return true
  }
  if (index === 'statistics' && currentPath.startsWith('/dashboard/doctor/statistics')) {
    return true
  }
  if (index === 'feedback' && currentPath.startsWith('/dashboard/doctor/feedback')) {
    return true
  }
  
  // 如果路由匹配失败，则使用 props.activeTab（向后兼容）
  return props.activeTab === index
}

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  emit('tabChange', index)
  
  // 根据选择的菜单项导航到对应的路由
  const routeMap: Record<string, string> = {
    'dashboard': '/dashboard/doctor',
    'cases': '/dashboard/doctor/case-management',
    'diagnosis': '/dashboard/doctor/ai-diagnosis',
    'reports': '/dashboard/doctor/reports',
    'knowledge': '/dashboard/doctor/knowledge-base',
    'statistics': '/dashboard/doctor/statistics',
    'feedback': '/dashboard/doctor/feedback'
  }
  
  if (routeMap[index]) {
    router.push(routeMap[index])
  }
}

// 快速操作函数
const createNewCase = () => {
  router.push('/dashboard/doctor/case-management/create')
  emit('tabChange', 'cases')
}

const startAIDiagnosis = () => {
  ElMessage.success({
    message: '启动AI智能诊断分析',
    duration: 2000,
    showClose: true
  })
  router.push('/dashboard/doctor/ai-diagnosis')
  emit('tabChange', 'diagnosis')
}
</script>

<style scoped>
.doctor-sidebar {
  width: 240px;
  background-color: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

/* 侧边栏菜单 */
.sidebar-menu {
  padding: 20px 0;
  flex: 1;
  overflow-y: auto;
}

/* 主菜单 */
.main-menu {
  padding-bottom: 16px;
}

/* 子菜单 */
.sub-menu {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.menu-section-title {
  font-size: 12px;
  color: #909399;
  padding: 0 16px 8px;
  margin: 0;
  font-weight: normal;
  text-transform: uppercase;
}

/* 菜单项 */
.menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 8px 16px;
  padding: 12px 20px;
  min-height: 44px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-size: 14px;
  color: #606266;
  background-color: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.menu-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
  border-color: #c6e2ff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
  transform: translateY(-2px);
}

.menu-item.active {
  background-color: #ecf5ff;
  color: #409eff;
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.menu-icon {
  font-size: 16px;
  margin-right: 8px;
  width: 20px;
  text-align: center;
  display: inline-block;
}

.menu-text {
  flex: 1;
  font-weight: 500;
  text-align: center;
}

.menu-badge {
  margin-left: 8px;
  background-color: #ff4d4f;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

/* 快速操作区域 */
.quick-actions {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 100%;
  justify-content: center;
  padding: 10px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 底部信息 */
.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.system-info {
  text-align: center;
}

.system-version {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .doctor-sidebar {
    width: 200px;
  }
  
  .menu-text {
    font-size: 13px;
  }
  
  .menu-icon {
    font-size: 14px;
  }
}
</style>