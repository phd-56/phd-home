<template>
  <div class="user-management">
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">用户账号管理</h1>
        <p class="text-gray-600">管理系统用户账号和权限</p>
      </div>
      
      <!-- 用户统计概览 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stat-card bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-blue-600 text-sm font-medium">总用户数</span>
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-blue-900 mb-1">1,286</div>
          <div class="text-xs text-blue-600">注册用户</div>
        </div>

        <div class="stat-card bg-green-50 rounded-xl p-6 border border-green-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-green-600 text-sm font-medium">活跃用户</span>
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-green-900 mb-1">856</div>
          <div class="text-xs text-green-600">在线用户</div>
        </div>

        <div class="stat-card bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-yellow-600 text-sm font-medium">新增用户</span>
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-yellow-900 mb-1">45</div>
          <div class="text-xs text-yellow-600">本月新增</div>
        </div>

        <div class="stat-card bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-purple-600 text-sm font-medium">管理员</span>
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-purple-900 mb-1">8</div>
          <div class="text-xs text-purple-600">管理员账号</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            添加用户
          </button>
          <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            批量导入
          </button>
          <button class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            导出数据
          </button>
        </div>
        <div class="flex items-center gap-2">
          <input type="text" placeholder="搜索用户..." class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <button class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            搜索
          </button>
        </div>
      </div>

      <!-- 用户列表 -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">用户列表</h3>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户信息</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最后登录</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img :src="user.avatar" :alt="user.name" class="h-10 w-10 rounded-full">
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getRoleClass(user.role)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="user.status === '在线' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.lastLogin }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                    <button class="text-red-600 hover:text-red-900 mr-3">禁用</button>
                    <button class="text-green-600 hover:text-green-900">重置密码</button>
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

const users = ref([
  {
    id: 1,
    name: '管理员',
    email: 'admin@hospital.com',
    role: '管理员',
    status: '在线',
    lastLogin: '2023-08-20 14:30',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  {
    id: 2,
    name: '李医生',
    email: 'li.doctor@hospital.com',
    role: '医生',
    status: '在线',
    lastLogin: '2023-08-20 14:25',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor1'
  },
  {
    id: 3,
    name: '王医生',
    email: 'wang.doctor@hospital.com',
    role: '医生',
    status: '离线',
    lastLogin: '2023-08-20 13:45',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor2'
  },
  {
    id: 4,
    name: '张护士',
    email: 'zhang.nurse@hospital.com',
    role: '护士',
    status: '在线',
    lastLogin: '2023-08-20 14:20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nurse1'
  }
])

const getRoleClass = (role: string) => {
  switch (role) {
    case '管理员':
      return 'bg-purple-100 text-purple-800'
    case '医生':
      return 'bg-blue-100 text-blue-800'
    case '护士':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<style scoped>
.user-management {
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
