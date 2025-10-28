<template>
  <div class="patient-settings">
    <div class="page-header">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800 mb-1">账户设置</h1>
        <p class="text-sm text-gray-500">管理您的个人信息和账户安全设置</p>
      </div>
      <button 
        class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200"
        @click="handleLogout"
      >
        <i class="fas fa-sign-out-alt"></i>
        <span>退出登录</span>
      </button>
    </div>

    <div class="flex gap-6">
      <!-- 设置导航 -->
      <div class="w-56">
        <div class="bg-white rounded-lg border border-gray-200 p-2">
          <nav class="space-y-1">
            <a 
              href="#" 
              :class="['flex items-center gap-3 px-3 py-2 rounded-lg',
                activeTab === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              ]"
              @click.prevent="activeTab = 'profile'"
            >
              <i class="fas fa-user"></i>
              <span>个人信息</span>
            </a>
            <a 
              href="#" 
              :class="['flex items-center gap-3 px-3 py-2 rounded-lg',
                activeTab === 'security' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              ]"
              @click.prevent="activeTab = 'security'"
            >
              <i class="fas fa-lock"></i>
              <span>安全设置</span>
            </a>
            <a 
              href="#" 
              :class="['flex items-center gap-3 px-3 py-2 rounded-lg',
                activeTab === 'notification' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              ]"
              @click.prevent="activeTab = 'notification'"
            >
              <i class="fas fa-bell"></i>
              <span>通知设置</span>
            </a>
            <a 
              href="#" 
              :class="['flex items-center gap-3 px-3 py-2 rounded-lg',
                activeTab === 'privacy' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              ]"
              @click.prevent="activeTab = 'privacy'"
            >
              <i class="fas fa-shield-alt"></i>
              <span>隐私设置</span>
            </a>
          </nav>
        </div>
      </div>

      <!-- 设置内容 -->
      <div class="flex-1 space-y-6">
        <!-- 个人信息 -->
        <div v-if="activeTab === 'profile'" class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">个人信息</h2>
          
          <!-- 头像 -->
          <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600 text-2xl">{{ userInfo.name.charAt(0) }}</span>
            </div>
            <div>
              <button 
                class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                @click="changeAvatar"
              >
                更换头像
              </button>
              <p class="text-xs text-gray-500 mt-2">支持 JPG、PNG 格式，文件大小不超过 2MB</p>
            </div>
          </div>

          <!-- 表单字段 -->
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                <input 
                  v-model="userInfo.name"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">性别</label>
                <select 
                  v-model="userInfo.gender"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">出生日期</label>
                <input 
                  v-model="userInfo.birthDate"
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">身份证号</label>
                <input 
                  v-model="userInfo.idCard"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">手机号码</label>
              <div class="flex gap-2">
                <input 
                  v-model="userInfo.phone"
                  type="tel" 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <button 
                  class="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                  @click="changePhone"
                >
                  修改
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">电子邮箱</label>
              <div class="flex gap-2">
                <input 
                  v-model="userInfo.email"
                  type="email" 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <button 
                  class="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                  @click="changeEmail"
                >
                  修改
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">联系地址</label>
              <input 
                v-model="userInfo.address"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button 
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              @click="resetProfile"
            >
              取消
            </button>
            <button 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              @click="saveProfile"
            >
              保存修改
            </button>
          </div>
        </div>

        <!-- 安全设置 -->
        <div v-if="activeTab === 'security'" class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">安全设置</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <div class="font-medium text-gray-800">登录密码</div>
                <div class="text-sm text-gray-500">定期更换密码可以提高账户安全性</div>
              </div>
              <button 
                class="text-blue-600 hover:underline"
                @click="changePassword"
              >
                修改
              </button>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <div class="font-medium text-gray-800">手机验证</div>
                <div class="text-sm text-gray-500">已绑定手机：{{ userInfo.phone }}</div>
              </div>
              <button 
                class="text-blue-600 hover:underline"
                @click="changePhone"
              >
                更换
              </button>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <div class="font-medium text-gray-800">邮箱验证</div>
                <div class="text-sm text-gray-500">已绑定邮箱：{{ userInfo.email }}</div>
              </div>
              <button 
                class="text-blue-600 hover:underline"
                @click="changeEmail"
              >
                更换
              </button>
            </div>

            <div class="flex items-center justify-between py-3">
              <div>
                <div class="font-medium text-gray-800">两步验证</div>
                <div class="text-sm text-gray-500">开启后登录需要额外验证码</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  v-model="securitySettings.twoFactorAuth"
                  type="checkbox" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- 通知设置 -->
        <div v-if="activeTab === 'notification'" class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">通知设置</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <div class="font-medium text-gray-800">检查结果通知</div>
                <div class="text-sm text-gray-500">检查完成后通过短信和邮件通知</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  v-model="notificationSettings.examResult"
                  type="checkbox" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <div class="font-medium text-gray-800">预约提醒</div>
                <div class="text-sm text-gray-500">预约前24小时和2小时提醒</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  v-model="notificationSettings.appointmentReminder"
                  type="checkbox" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <div class="font-medium text-gray-800">健康建议</div>
                <div class="text-sm text-gray-500">定期推送健康知识和建议</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  v-model="notificationSettings.healthTips"
                  type="checkbox" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between py-3">
              <div>
                <div class="font-medium text-gray-800">系统通知</div>
                <div class="text-sm text-gray-500">系统维护和重要更新通知</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  v-model="notificationSettings.systemNotification"
                  type="checkbox" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- 隐私设置 -->
        <div v-if="activeTab === 'privacy'" class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">隐私设置</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <div class="font-medium text-gray-800">数据收集</div>
                <div class="text-sm text-gray-500">允许收集匿名使用数据以改善服务</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  v-model="privacySettings.dataCollection"
                  type="checkbox" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <div class="font-medium text-gray-800">个性化推荐</div>
                <div class="text-sm text-gray-500">基于您的健康数据提供个性化建议</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  v-model="privacySettings.personalizedRecommendation"
                  type="checkbox" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between py-3">
              <div>
                <div class="font-medium text-gray-800">第三方分享</div>
                <div class="text-sm text-gray-500">允许与医疗机构分享您的健康数据</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  v-model="privacySettings.thirdPartySharing"
                  type="checkbox" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- 账户信息 -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">账户信息</h2>
          
          <div class="space-y-3">
            <div class="flex justify-between py-2">
              <span class="text-gray-600">账户ID</span>
              <span class="text-gray-800">{{ userInfo.id }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600">注册时间</span>
              <span class="text-gray-800">{{ userInfo.registerDate }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600">最后登录</span>
              <span class="text-gray-800">{{ userInfo.lastLogin }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600">账户状态</span>
              <span class="text-green-600 flex items-center gap-1">
                <i class="fas fa-check-circle"></i>
                正常
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 当前活跃的标签页
const activeTab = ref('profile')

// 用户信息
const userInfo = reactive({
  name: '张老师',
  gender: '男',
  birthDate: '1985-06-15',
  idCard: '320***********1234',
  phone: '138****5678',
  email: 'zhang***@email.com',
  address: '江苏省南京市玄武区中山路123号',
  id: '2023051008',
  registerDate: '2023年5月10日',
  lastLogin: '2023年8月20日 14:32'
})

// 安全设置
const securitySettings = reactive({
  twoFactorAuth: false
})

// 通知设置
const notificationSettings = reactive({
  examResult: true,
  appointmentReminder: true,
  healthTips: false,
  systemNotification: true
})

// 隐私设置
const privacySettings = reactive({
  dataCollection: true,
  personalizedRecommendation: true,
  thirdPartySharing: false
})

// 方法
const changeAvatar = () => {
  ElMessage.info('头像更换功能开发中...')
}

const changePhone = () => {
  ElMessageBox.prompt('请输入新的手机号码', '修改手机号', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^1[3-9]\d{9}$/,
    inputErrorMessage: '请输入正确的手机号码'
  }).then(({ value }) => {
    userInfo.phone = value
    ElMessage.success('手机号码修改成功')
  }).catch(() => {
    // 用户取消
  })
}

const changeEmail = () => {
  ElMessageBox.prompt('请输入新的邮箱地址', '修改邮箱', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    inputErrorMessage: '请输入正确的邮箱地址'
  }).then(({ value }) => {
    userInfo.email = value
    ElMessage.success('邮箱地址修改成功')
  }).catch(() => {
    // 用户取消
  })
}

const changePassword = () => {
  ElMessageBox.prompt('请输入新密码', '修改密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'password'
  }).then(({ value }) => {
    ElMessage.success('密码修改成功')
  }).catch(() => {
    // 用户取消
  })
}

const saveProfile = () => {
  ElMessage.success('个人信息保存成功')
}

const resetProfile = () => {
  ElMessage.info('已重置为原始信息')
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    authStore.logout()
    ElMessage.success('已退出登录')
    router.push('/')
  } catch (error) {
    // 用户取消退出
  }
}
</script>

<style scoped>
.patient-settings {
  min-height: 100vh;
  background: #f9fafb;
  margin-left: 224px;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;
}

.page-header p {
  margin: 4px 0 0 0;
  color: #6b7280;
  font-size: 14px;
}

.flex {
  display: flex;
}

.gap-6 {
  gap: 24px;
}

.w-56 {
  width: 224px;
}

.bg-white {
  background-color: #ffffff;
}

.rounded-lg {
  border-radius: 8px;
}

.border {
  border-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.p-2 {
  padding: 8px;
}

.p-6 {
  padding: 24px;
}

.space-y-1 > * + * {
  margin-top: 4px;
}

.items-center {
  align-items: center;
}

.gap-3 {
  gap: 12px;
}

.px-3 {
  padding-left: 12px;
  padding-right: 12px;
}

.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}

.text-blue-600 {
  color: #2563eb;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.text-gray-700 {
  color: #374151;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.flex-1 {
  flex: 1 1 0%;
}

.space-y-6 > * + * {
  margin-top: 24px;
}

.text-lg {
  font-size: 18px;
  line-height: 28px;
}

.font-semibold {
  font-weight: 600;
}

.text-gray-800 {
  color: #1f2937;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.pb-6 {
  padding-bottom: 24px;
}

.border-b {
  border-bottom-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.w-20 {
  width: 80px;
}

.h-20 {
  height: 80px;
}

.bg-blue-100 {
  background-color: #dbeafe;
}

.text-blue-600 {
  color: #2563eb;
}

.text-2xl {
  font-size: 24px;
  line-height: 32px;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.text-white {
  color: #ffffff;
}

.text-sm {
  font-size: 14px;
  line-height: 20px;
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.text-xs {
  font-size: 12px;
  line-height: 16px;
}

.text-gray-500 {
  color: #6b7280;
}

.mt-2 {
  margin-top: 8px;
}

.space-y-4 > * + * {
  margin-top: 16px;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-4 {
  gap: 16px;
}

.block {
  display: block;
}

.font-medium {
  font-weight: 500;
}

.text-gray-700 {
  color: #374151;
}

.mb-2 {
  margin-bottom: 8px;
}

.w-full {
  width: 100%;
}

.px-3 {
  padding-left: 12px;
  padding-right: 12px;
}

.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.focus\:ring-blue-500:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.border-blue-600 {
  border-color: #2563eb;
}

.hover\:bg-blue-50:hover {
  background-color: #eff6ff;
}

.justify-end {
  justify-content: flex-end;
}

.gap-3 {
  gap: 12px;
}

.mt-6 {
  margin-top: 24px;
}

.pt-6 {
  padding-top: 24px;
}

.border-t {
  border-top-width: 1px;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.justify-between {
  justify-content: space-between;
}

.py-3 {
  padding-top: 12px;
  padding-bottom: 12px;
}

.text-gray-600 {
  color: #4b5563;
}

.hover\:underline:hover {
  text-decoration: underline;
}

.relative {
  position: relative;
}

.inline-flex {
  display: inline-flex;
}

.cursor-pointer {
  cursor: pointer;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.peer:focus ~ .peer-focus\:outline-none {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.peer:focus ~ .peer-focus\:ring-4 {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.peer:focus ~ .peer-focus\:ring-blue-300 {
  box-shadow: 0 0 0 2px rgba(147, 197, 253, 0.5);
}

.w-11 {
  width: 44px;
}

.h-6 {
  height: 24px;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.peer-checked\:after\:translate-x-full:checked::after {
  transform: translateX(100%);
}

.peer-checked\:after\:border-white:checked::after {
  border-color: #ffffff;
}

.peer-checked\:bg-blue-600:checked {
  background-color: #2563eb;
}

.after\:content-\[\'\'\]:after {
  content: '';
}

.after\:absolute:after {
  position: absolute;
}

.after\:top-\[2px\]:after {
  top: 2px;
}

.after\:left-\[2px\]:after {
  left: 2px;
}

.after\:bg-white:after {
  background-color: #ffffff;
}

.after\:border-gray-300:after {
  border-color: #d1d5db;
}

.after\:border:after {
  border-width: 1px;
}

.after\:rounded-full:after {
  border-radius: 9999px;
}

.after\:h-5:after {
  height: 20px;
}

.after\:w-5:after {
  width: 20px;
}

.after\:transition-all:after {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.space-y-3 > * + * {
  margin-top: 12px;
}

.text-green-600 {
  color: #16a34a;
}

.gap-1 {
  gap: 4px;
}

@media (max-width: 1024px) {
  .patient-settings {
    margin-left: 0;
    padding: 16px;
  }
  
  .flex {
    flex-direction: column;
  }
  
  .w-56 {
    width: 100%;
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
