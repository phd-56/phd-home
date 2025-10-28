<template>
  <div class="doctor-data">
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">医生数据</h1>
        <p class="text-gray-600">医生用户数据统计与管理</p>
      </div>
      
      <!-- 医生统计概览 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stat-card bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-blue-600 text-sm font-medium">总医生数</span>
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-blue-900 mb-1">156</div>
          <div class="text-xs text-blue-600">注册医生</div>
        </div>

        <div class="stat-card bg-green-50 rounded-xl p-6 border border-green-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-green-600 text-sm font-medium">活跃医生</span>
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-green-900 mb-1">86</div>
          <div class="text-xs text-green-600">在线医生</div>
        </div>

        <div class="stat-card bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-yellow-600 text-sm font-medium">本月诊断</span>
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-yellow-900 mb-1">3,245</div>
          <div class="text-xs text-yellow-600">诊断次数</div>
        </div>

        <div class="stat-card bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-purple-600 text-sm font-medium">平均评分</span>
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-purple-900 mb-1">4.8</div>
          <div class="text-xs text-purple-600">分</div>
        </div>
      </div>

      <!-- 医生列表 -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">医生列表</h3>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">医生信息</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">科室</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">本月诊断</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="doctor in doctors" :key="doctor.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img :src="doctor.avatar" :alt="doctor.name" class="h-10 w-10 rounded-full">
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ doctor.name }}</div>
                        <div class="text-sm text-gray-500">{{ doctor.title }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ doctor.department }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="doctor.status === '在线' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ doctor.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ doctor.diagnoses }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3">查看</button>
                    <button class="text-green-600 hover:text-green-900">编辑</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const doctors = ref([
  {
    id: 1,
    name: '李医生',
    title: '主任医师',
    department: '放射科',
    status: '在线',
    diagnoses: 156,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor1'
  },
  {
    id: 2,
    name: '王医生',
    title: '副主任医师',
    department: '影像科',
    status: '在线',
    diagnoses: 134,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor2'
  },
  {
    id: 3,
    name: '张医生',
    title: '主治医师',
    department: '神经科',
    status: '离线',
    diagnoses: 98,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor3'
  },
  {
    id: 4,
    name: '陈医生',
    title: '住院医师',
    department: '骨科',
    status: '在线',
    diagnoses: 87,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor4'
  }
])
</script>

<style scoped>
.doctor-data {
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
