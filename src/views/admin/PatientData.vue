<template>
  <div class="patient-data">
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">患者数据</h1>
        <p class="text-gray-600">患者信息数据统计与管理</p>
      </div>
      
      <!-- 患者统计概览 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stat-card bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-blue-600 text-sm font-medium">总患者数</span>
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-blue-900 mb-1">2,456</div>
          <div class="text-xs text-blue-600">注册患者</div>
        </div>

        <div class="stat-card bg-green-50 rounded-xl p-6 border border-green-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-green-600 text-sm font-medium">活跃患者</span>
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-green-900 mb-1">1,234</div>
          <div class="text-xs text-green-600">本月活跃</div>
        </div>

        <div class="stat-card bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-yellow-600 text-sm font-medium">新增患者</span>
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-yellow-900 mb-1">156</div>
          <div class="text-xs text-yellow-600">本月新增</div>
        </div>

        <div class="stat-card bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-purple-600 text-sm font-medium">检查完成</span>
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-purple-900 mb-1">3,245</div>
          <div class="text-xs text-purple-600">完成检查</div>
        </div>
      </div>

      <!-- 患者年龄分布 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">患者年龄分布</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">0-18岁</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 15%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">15%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">19-35岁</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 25%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">25%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">36-50岁</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-yellow-500 h-2 rounded-full" style="width: 35%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">35%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">51-65岁</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-orange-500 h-2 rounded-full" style="width: 20%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">20%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">65岁以上</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-red-500 h-2 rounded-full" style="width: 5%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">5%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">检查类型分布</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">MRI检查</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 32%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">32%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">CT检查</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 28%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">28%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">X光检查</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-yellow-500 h-2 rounded-full" style="width: 22%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">22%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">超声检查</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div class="bg-purple-500 h-2 rounded-full" style="width: 18%"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">18%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 患者列表 -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">患者列表</h3>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">患者信息</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年龄</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">检查次数</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最后检查</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="patient in patients" :key="patient.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img :src="patient.avatar" :alt="patient.name" class="h-10 w-10 rounded-full">
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ patient.name }}</div>
                        <div class="text-sm text-gray-500">{{ patient.gender }} | {{ patient.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ patient.age }}岁</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ patient.exams }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ patient.lastExam }}</td>
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

const patients = ref([
  {
    id: 'P001',
    name: '张三',
    gender: '男',
    age: 35,
    exams: 3,
    lastExam: '2023-08-20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patient1'
  },
  {
    id: 'P002',
    name: '李四',
    gender: '女',
    age: 28,
    exams: 2,
    lastExam: '2023-08-19',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patient2'
  },
  {
    id: 'P003',
    name: '王五',
    gender: '男',
    age: 45,
    exams: 5,
    lastExam: '2023-08-18',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patient3'
  },
  {
    id: 'P004',
    name: '赵六',
    gender: '女',
    age: 52,
    exams: 4,
    lastExam: '2023-08-17',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patient4'
  }
])
</script>

<style scoped>
.patient-data {
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
