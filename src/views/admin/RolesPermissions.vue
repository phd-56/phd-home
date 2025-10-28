<template>
  <div class="roles-permissions">
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">角色与权限</h1>
        <p class="text-gray-600">管理系统角色和权限配置</p>
      </div>
      
      <!-- 角色统计概览 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stat-card bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-blue-600 text-sm font-medium">总角色数</span>
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-blue-900 mb-1">5</div>
          <div class="text-xs text-blue-600">系统角色</div>
        </div>

        <div class="stat-card bg-green-50 rounded-xl p-6 border border-green-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-green-600 text-sm font-medium">权限总数</span>
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-green-900 mb-1">24</div>
          <div class="text-xs text-green-600">权限项</div>
        </div>

        <div class="stat-card bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-yellow-600 text-sm font-medium">活跃角色</span>
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-yellow-900 mb-1">4</div>
          <div class="text-xs text-yellow-600">使用中</div>
        </div>

        <div class="stat-card bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-purple-600 text-sm font-medium">用户分配</span>
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-purple-900 mb-1">1,286</div>
          <div class="text-xs text-purple-600">用户</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            添加角色
          </button>
          <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            权限管理
          </button>
          <button class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            批量分配
          </button>
        </div>
      </div>

      <!-- 角色列表 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div v-for="role in roles" :key="role.id" class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div :class="getRoleColorClass(role.name)" class="w-10 h-10 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ role.name }}</h3>
                <p class="text-sm text-gray-500">{{ role.description }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button class="text-blue-600 hover:text-blue-900 text-sm">编辑</button>
              <button class="text-red-600 hover:text-red-900 text-sm">删除</button>
            </div>
          </div>
          
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">用户数量</span>
              <span class="text-sm text-gray-900">{{ role.userCount }} 人</span>
            </div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">权限数量</span>
              <span class="text-sm text-gray-900">{{ role.permissionCount }} 项</span>
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700">主要权限：</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="permission in role.permissions" :key="permission" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {{ permission }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 权限矩阵 -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">权限矩阵</h3>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">权限模块</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">管理员</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">医生</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">护士</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">患者</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="module in permissionMatrix" :key="module.name">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ module.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span class="text-green-600">✓</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span :class="module.doctor ? 'text-green-600' : 'text-gray-400'">{{ module.doctor ? '✓' : '✗' }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span :class="module.nurse ? 'text-green-600' : 'text-gray-400'">{{ module.nurse ? '✓' : '✗' }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span :class="module.patient ? 'text-green-600' : 'text-gray-400'">{{ module.patient ? '✓' : '✗' }}</span>
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

const roles = ref([
  {
    id: 1,
    name: '管理员',
    description: '系统管理员，拥有所有权限',
    userCount: 8,
    permissionCount: 24,
    permissions: ['用户管理', '系统设置', '数据统计', '权限管理']
  },
  {
    id: 2,
    name: '医生',
    description: '医生用户，可以进行诊断和病例管理',
    userCount: 156,
    permissionCount: 12,
    permissions: ['影像诊断', '病例管理', '报告生成', '知识库']
  },
  {
    id: 3,
    name: '护士',
    description: '护士用户，协助医生进行患者管理',
    userCount: 89,
    permissionCount: 8,
    permissions: ['患者管理', '预约管理', '基础操作']
  },
  {
    id: 4,
    name: '患者',
    description: '患者用户，查看自己的检查结果',
    userCount: 1033,
    permissionCount: 4,
    permissions: ['查看报告', '预约检查', '个人信息']
  }
])

const permissionMatrix = ref([
  { name: '用户管理', doctor: false, nurse: false, patient: false },
  { name: '系统设置', doctor: false, nurse: false, patient: false },
  { name: '影像诊断', doctor: true, nurse: false, patient: false },
  { name: '病例管理', doctor: true, nurse: true, patient: false },
  { name: '报告生成', doctor: true, nurse: false, patient: false },
  { name: '患者管理', doctor: true, nurse: true, patient: false },
  { name: '预约管理', doctor: true, nurse: true, patient: true },
  { name: '查看报告', doctor: true, nurse: true, patient: true },
  { name: '数据统计', doctor: false, nurse: false, patient: false },
  { name: '知识库', doctor: true, nurse: true, patient: false }
])

const getRoleColorClass = (roleName: string) => {
  switch (roleName) {
    case '管理员':
      return 'bg-purple-500'
    case '医生':
      return 'bg-blue-500'
    case '护士':
      return 'bg-green-500'
    case '患者':
      return 'bg-gray-500'
    default:
      return 'bg-gray-500'
  }
}
</script>

<style scoped>
.roles-permissions {
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
