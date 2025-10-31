<template>
  <div class="sidebar-wrapper h-full">
    <div class="simple-menu">
      <div 
        v-for="item in menuItems" 
        :key="item.index" 
        class="menu-item" 
        :class="{ active: activeIndex === item.index }"
        @click.stop="handleMenuSelect(item.index, $event)"
      >
        <el-icon class="menu-icon"><component :is="item.icon" /></el-icon>
        <span class="menu-text">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  DataAnalysis,
  Search,
  Folder,
  Reading,
  Document,
  TrendCharts,
  ChatDotRound,
  QuestionFilled
} from '@element-plus/icons-vue'

interface MenuItem {
  index: string
  icon: any
  text: string
}

const route = useRoute()
const router = useRouter()
const activeIndex = ref('dashboard')

// 定义菜单项，使用Element Plus图标
const menuItems = reactive<MenuItem[]>([
  { index: 'dashboard', icon: DataAnalysis, text: '工作台' },
  { index: 'diagnosis', icon: Search, text: '影像诊断' },
  { index: 'cases', icon: Folder, text: '病例管理' },
  { index: 'knowledge', icon: Reading, text: '知识库' },
  { index: 'reports', icon: Document, text: '报告中心' },
  { index: 'statistics', icon: TrendCharts, text: '数据统计' },
  { index: 'feedback', icon: ChatDotRound, text: '反馈中心' },
  { index: 'help', icon: QuestionFilled, text: '帮助文档' }
])

// 计算当前活动路由
const currentPath = computed(() => {
  const path = route.path
  if (path === '/dashboard/doctor' || path === '/dashboard/doctor/') {
    return 'dashboard'
  }
  if (path.startsWith('/dashboard/doctor/case-management')) {
    return 'cases'
  }
  if (path.startsWith('/dashboard/doctor/ai-diagnosis')) {
    return 'diagnosis'
  }
  if (path.startsWith('/dashboard/doctor/reports')) {
    return 'reports'
  }
  if (path.startsWith('/dashboard/doctor/knowledge-base')) {
    return 'knowledge'
  }
  if (path.startsWith('/dashboard/doctor/statistics')) {
    return 'statistics'
  }
  if (path.startsWith('/dashboard/doctor/feedback')) {
    return 'feedback'
  }
  if (path.startsWith('/dashboard/doctor/help')) {
    return 'help'
  }
  return 'dashboard'
})

onMounted(() => {
  // 初始化活动路由
  activeIndex.value = currentPath.value
})

// 监听路由变化
watch(currentPath, (newPath) => {
  activeIndex.value = newPath
})

// 处理菜单选择
const handleMenuSelect = (index: string, event?: Event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  activeIndex.value = index
  
  // 根据选择的菜单项导航到对应的路由
  const routeMap: Record<string, string> = {
    'dashboard': '/dashboard/doctor',
    'cases': '/dashboard/doctor/case-management',
    'diagnosis': '/dashboard/doctor/ai-diagnosis',
    'reports': '/dashboard/doctor/reports',
    'knowledge': '/dashboard/doctor/knowledge-base',
    'statistics': '/dashboard/doctor/statistics',
    'feedback': '/dashboard/doctor/feedback',
    'help': '/dashboard/doctor/help'
  }
  
  const targetPath = routeMap[index]
  if (targetPath) {
    router.push(targetPath).catch((error) => {
      console.error('路由跳转失败:', error)
    })
  }
}
</script>

<style scoped>
.sidebar-wrapper {
  width: 240px;
  height: 100%;
  padding: 10px 0;
  background-color: #ffffff;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
  overflow-y: auto;
}

.simple-menu {
  padding: 10px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 50px;
  cursor: pointer;
  color: #333333;
  transition: all 0.3s ease;
  user-select: none;
  -webkit-user-select: none;
  position: relative;
  z-index: 10;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.menu-item.active {
  background-color: #e6f7ff;
  color: #1890ff;
  font-weight: 500;
}

.menu-item:active {
  background-color: #d4edff;
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 20px;
  text-align: center;
  pointer-events: none;
  flex-shrink: 0;
  color: inherit;
}

.menu-text {
  font-size: 14px;
  pointer-events: none;
  color: inherit;
}
</style>