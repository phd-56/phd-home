<template>
  <div class="min-h-screen bg-slate-50">
    <div class="container mx-auto py-8 px-4">
      <div class="glassmorphism p-6 rounded-lg mb-6">
        <h1 class="text-2xl font-bold text-slate-800 mb-4">管理员仪表板</h1>
        <p class="text-slate-600">欢迎回来，系统管理员！</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="glassmorphism p-6 rounded-lg">
          <h2 class="text-xl font-semibold text-slate-800 mb-4">系统概览</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span>总用户数：</span>
              <span class="font-medium">{{ userCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span>医生数量：</span>
              <span class="font-medium">{{ doctorCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span>患者数量：</span>
              <span class="font-medium">{{ patientCount }}</span>
            </div>
          </div>
        </div>
        
        <div class="glassmorphism p-6 rounded-lg">
          <h2 class="text-xl font-semibold text-slate-800 mb-4">系统操作</h2>
          <el-button type="primary" class="w-full mb-3">用户管理</el-button>
          <el-button type="primary" class="w-full mb-3">数据统计</el-button>
          <el-button type="primary" class="w-full" @click="handleLogout">退出登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 模拟数据
const userCount = ref(100)
const doctorCount = ref(20)
const patientCount = ref(80)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.glassmorphism {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(31, 38, 135, 0.1);
}
</style>