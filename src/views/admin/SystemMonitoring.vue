<template>
  <div class="system-monitoring">
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">系统监控</h1>
        <p class="text-gray-600">实时监控系统运行状态和性能指标</p>
      </div>
      
      <!-- 系统状态概览 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stat-card bg-green-50 rounded-xl p-6 border border-green-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-green-600 text-sm font-medium">CPU使用率</span>
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-green-900 mb-1">45%</div>
          <div class="text-xs text-green-600">正常</div>
          </div>

        <div class="stat-card bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-blue-600 text-sm font-medium">内存使用率</span>
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-blue-900 mb-1">68%</div>
          <div class="text-xs text-blue-600">正常</div>
          </div>

        <div class="stat-card bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-yellow-600 text-sm font-medium">磁盘使用率</span>
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
              </svg>
          </div>
        </div>
          <div class="text-3xl font-bold text-yellow-900 mb-1">82%</div>
          <div class="text-xs text-yellow-600">警告</div>
        </div>

        <div class="stat-card bg-green-50 rounded-xl p-6 border border-green-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-green-600 text-sm font-medium">网络状态</span>
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-green-900 mb-1">正常</div>
          <div class="text-xs text-green-600">100Mbps</div>
        </div>
          </div>

      <!-- 服务状态监控 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">服务状态监控</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-gray-700">数据库服务</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">正常运行</span>
                <span class="text-xs text-green-600">99.9%</span>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-gray-700">Web服务</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">正常运行</span>
                <span class="text-xs text-green-600">99.8%</span>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="text-gray-700">文件存储服务</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-yellow-600">负载较高</span>
                <span class="text-xs text-yellow-600">85%</span>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-gray-700">AI处理服务</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">正常运行</span>
                <span class="text-xs text-green-600">92%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">系统性能趋势</h3>
          <div style="height: 300px;" class="flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">性能趋势图 - 待实现</p>
          </div>
        </div>
          </div>

      <!-- 系统日志 -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">系统日志</h3>
            <button class="text-blue-600 text-sm hover:underline">刷新</button>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="log in logs" :key="log.id" class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div :class="getLogLevelClass(log.level)" class="w-2 h-2 rounded-full mt-2"></div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-gray-900">{{ log.message }}</span>
                  <span class="text-xs text-gray-500">{{ log.time }}</span>
                </div>
                <p class="text-xs text-gray-600">{{ log.details }}</p>
              </div>
            </div>
          </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const logs = ref([
  {
    id: 1,
    level: 'info',
    message: '系统启动完成',
    details: '所有服务已正常启动，系统运行正常',
    time: '2023-08-20 14:30:15'
  },
  {
    id: 2,
    level: 'warning',
    message: '磁盘空间不足',
    details: '系统磁盘使用率达到82%，建议清理临时文件',
    time: '2023-08-20 14:25:30'
  },
  {
    id: 3,
    level: 'error',
    message: '数据库连接超时',
    details: '数据库连接超时，已自动重连',
    time: '2023-08-20 14:20:45'
  },
  {
    id: 4,
    level: 'info',
    message: '用户登录成功',
    details: '用户 admin 登录成功，IP: 192.168.1.100',
    time: '2023-08-20 14:15:20'
  }
])

const getLogLevelClass = (level: string) => {
  switch (level) {
    case 'info':
      return 'bg-blue-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}
</script>

<style scoped>
.system-monitoring {
  @apply p-8;
}

.stat-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>