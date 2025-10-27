<template>
  <div class="sidebar-wrapper h-full">
    <div class="simple-menu">
      <div 
        v-for="item in menuItems" 
        :key="item.index" 
        class="menu-item" 
        :class="{ active: activeIndex === item.index }"
        @click="handleMenuSelect(item.index)"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-text">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface MenuItem {
  index: string
  icon: string
  text: string
}

const route = useRoute()
const router = useRouter()
const activeIndex = ref('/admin/dashboard')

// 定义菜单项，使用emoji图标
const menuItems = reactive<MenuItem[]>([
  { index: '/admin/dashboard', icon: '📊', text: '管理控制台' },
  { index: '/admin/user-management', icon: '👥', text: '用户管理' },
  { index: '/admin/models', icon: '🤖', text: '模型管理' },
  { index: '/admin/model-optimization', icon: '⚙️', text: '模型优化' },
  { index: '/admin/model-performance', icon: '📈', text: '模型性能监控' },
  { index: '/admin/model-optimization-comparison', icon: '📊', text: '模型优化对比' },
  { index: '/admin/monitoring', icon: '⚠️', text: '系统监控' },
  { index: '/admin/backups', icon: '💾', text: '数据备份' },
  { index: '/admin/audit-logs', icon: '📋', text: '操作日志' },
  { index: '/admin/system-settings', icon: '⚙️', text: '系统设置' }
])

// 计算当前活动路由
const currentPath = computed(() => route.path)

onMounted(() => {
  // 初始化活动路由
  activeIndex.value = currentPath.value || '/admin/dashboard'
})

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  activeIndex.value = index
  router.push(index)
}
</script>

<style scoped>
.sidebar-wrapper {
  height: 100%;
  padding: 10px 0;
  background-color: #ffffff;
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
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.menu-item.active {
  background-color: #e6f7ff;
  color: #1890ff;
  font-weight: 500;
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 20px;
  text-align: center;
}

.menu-text {
  font-size: 14px;
}
</style>