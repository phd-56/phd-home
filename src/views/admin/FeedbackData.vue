<template>
  <div class="feedback-data">
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">反馈数据统计</h1>
        <p class="text-gray-600">用户反馈数据统计与分析</p>
      </div>
      
      <!-- 反馈统计概览 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stat-card bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-blue-600 text-sm font-medium">总反馈数</span>
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-blue-900 mb-1">1,234</div>
          <div class="text-xs text-blue-600">条反馈</div>
        </div>

        <div class="stat-card bg-green-50 rounded-xl p-6 border border-green-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-green-600 text-sm font-medium">已处理</span>
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-green-900 mb-1">1,156</div>
          <div class="text-xs text-green-600">已处理</div>
        </div>

        <div class="stat-card bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-yellow-600 text-sm font-medium">待处理</span>
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-yellow-900 mb-1">78</div>
          <div class="text-xs text-yellow-600">待处理</div>
        </div>

        <div class="stat-card bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-purple-600 text-sm font-medium">满意度</span>
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-purple-900 mb-1">4.6</div>
          <div class="text-xs text-purple-600">平均分</div>
        </div>
      </div>

      <!-- 反馈类型分布 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">反馈类型分布</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">功能建议</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 40%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">40%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">故障报告</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-red-500 h-2 rounded-full" style="width: 25%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">25%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">使用咨询</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 20%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">20%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">其他</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-gray-500 h-2 rounded-full" style="width: 15%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">15%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">满意度趋势</h3>
          <div style="height: 200px;" class="flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">满意度趋势图 - 待实现</p>
          </div>
        </div>
      </div>

      <!-- 反馈列表 -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">最新反馈</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="feedback in feedbacks" :key="feedback.id" class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <img :src="feedback.avatar" :alt="feedback.user" class="w-10 h-10 rounded-full">
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-900">{{ feedback.user }}</span>
                  <span class="text-xs text-gray-500">{{ feedback.time }}</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ feedback.content }}</p>
                <div class="flex items-center gap-2">
                  <span :class="getStatusClass(feedback.status)" class="px-2 py-1 text-xs rounded-full">
                    {{ feedback.status }}
                  </span>
                  <span class="text-xs text-gray-500">{{ feedback.type }}</span>
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
import { ref } from 'vue'

const feedbacks = ref([
  {
    id: 1,
    user: '李医生',
    content: '希望增加批量导出功能，提高工作效率',
    type: '功能建议',
    status: '已处理',
    time: '2023-08-20 14:30',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=feedback1'
  },
  {
    id: 2,
    user: '王医生',
    content: '系统偶尔出现卡顿现象，影响使用体验',
    type: '故障报告',
    status: '处理中',
    time: '2023-08-20 13:45',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=feedback2'
  },
  {
    id: 3,
    user: '张医生',
    content: '如何设置自动保存功能？',
    type: '使用咨询',
    status: '已回复',
    time: '2023-08-20 12:20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=feedback3'
  },
  {
    id: 4,
    user: '陈医生',
    content: '界面设计很美观，使用起来很流畅',
    type: '其他',
    status: '已处理',
    time: '2023-08-20 11:15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=feedback4'
  }
])

const getStatusClass = (status: string) => {
  switch (status) {
    case '已处理':
      return 'bg-green-100 text-green-800'
    case '处理中':
      return 'bg-yellow-100 text-yellow-800'
    case '已回复':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<style scoped>
.feedback-data {
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
