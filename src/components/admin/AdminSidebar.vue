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
  User,
  TrendCharts,
  Monitor,
  Lock,
  Setting
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
  { index: 'dashboard', icon: DataAnalysis, text: '管理仪表盘' },
  { index: 'user-management', icon: User, text: '用户账号管理' },
  { index: 'data-analysis', icon: TrendCharts, text: '数据统计分析' },
  { index: 'system-monitoring', icon: Monitor, text: '系统监控' },
  { index: 'roles-permissions', icon: Lock, text: '角色与权限' },
  { index: 'system-config', icon: Setting, text: '系统参数配置' }
])

// 计算当前活动路由
const currentPath = computed(() => {
  const path = route.path
  // 从 /dashboard/admin/xxx 或 /admin/xxx 中提取 xxx
  const match = path.match(/\/(?:dashboard\/)?admin\/(.+)$/)
  return match ? match[1] : 'dashboard'
})

onMounted(() => {
  // 初始化活动路由
  activeIndex.value = currentPath.value
})

// 监听路由变化
watch(currentPath, (newPath) => {
  activeIndex.value = newPath
})

// 路由名称映射
const routeNameMap: Record<string, string> = {
  'dashboard': 'admin.dashboard',
  'user-management': 'admin.userManagement',
  'data-analysis': 'admin.dataAnalysis',
  'system-monitoring': 'admin.systemMonitoring',
  'roles-permissions': 'admin.rolesPermissions',
  'system-config': 'admin.systemConfig'
}

// 处理菜单选择
const handleMenuSelect = (index: string, event?: Event) => {
  console.log('点击菜单项:', index)
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  activeIndex.value = index
  
  // 优先使用路由名称进行跳转，更可靠
  const routeName = routeNameMap[index]
  if (routeName) {
    console.log('使用路由名称跳转:', routeName)
    router.push({ name: routeName }).catch((error) => {
      console.error('路由跳转失败:', error)
      // 如果路由名称跳转失败，尝试使用路径跳转
      const basePath = route.path.startsWith('/dashboard/admin') ? '/dashboard/admin' : '/admin'
      router.push(`${basePath}/${index}`).catch((err) => {
        console.error('路径跳转也失败:', err)
      })
    })
  } else {
    // 备用方案：使用路径跳转
    const basePath = route.path.startsWith('/dashboard/admin') ? '/dashboard/admin' : '/admin'
    console.log('使用路径跳转:', `${basePath}/${index}`)
    router.push(`${basePath}/${index}`).catch((error) => {
      console.error('路径跳转失败:', error)
    })
  }
}
</script>

<style scoped>
.sidebar-wrapper {
  height: 100%;
  padding: 10px 0;
  background-color: #ffffff;
  position: relative;
  z-index: 100;
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
}

.menu-text {
  font-size: 14px;
  pointer-events: none;
}
</style>
