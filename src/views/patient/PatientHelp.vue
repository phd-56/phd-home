<template>
  <div class="patient-layout">
    <!-- 患者侧边栏 -->
    <PatientSidebar 
      :active-tab="'help'" 
      @tab-change="handleTabChange"
    />
    
    <div class="patient-help">
      <div class="help-content">
        <div class="page-header">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800 mb-1">帮助中心</h1>
          <p class="text-sm text-gray-500">查找常见问题解答和使用指南</p>
        </div>
      </div>

    <!-- 搜索栏 -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div class="relative">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="搜索您遇到的问题..." 
          class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="searchHelp"
        >
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
    </div>

    <!-- 快速链接 -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <a 
        href="#" 
        class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
        @click.prevent="openGuide"
      >
        <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
          <el-icon class="text-blue-600 text-xl"><Document /></el-icon>
        </div>
        <div class="text-sm font-medium text-gray-800">使用指南</div>
      </a>
      <a 
        href="#" 
        class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
        @click.prevent="openVideo"
      >
        <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
          <el-icon class="text-green-600 text-xl"><VideoPlay /></el-icon>
        </div>
        <div class="text-sm font-medium text-gray-800">视频教程</div>
      </a>
      <a 
        href="#" 
        class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
        @click.prevent="openChat"
      >
        <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
          <el-icon class="text-purple-600 text-xl"><Headset /></el-icon>
        </div>
        <div class="text-sm font-medium text-gray-800">在线客服</div>
      </a>
      <a 
        href="#" 
        class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
        @click.prevent="openContact"
      >
        <div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-3">
          <el-icon class="text-orange-600 text-xl"><Message /></el-icon>
        </div>
        <div class="text-sm font-medium text-gray-800">联系我们</div>
      </a>
    </div>

    <!-- FAQ部分 -->
    <div class="space-y-6">
      <!-- 常见问题 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <i class="fas fa-question-circle text-blue-600"></i>
          常见问题
        </h2>
        <div class="space-y-3">
          <details 
            v-for="faq in commonFAQs" 
            :key="faq.id"
            class="group"
          >
            <summary class="flex items-center justify-between cursor-pointer py-3 border-b border-gray-200">
              <span class="text-gray-800">{{ faq.question }}</span>
              <i class="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
            </summary>
            <div class="py-3 text-sm text-gray-600">
              <p class="mb-2">{{ faq.answer }}</p>
              <ol v-if="faq.steps" class="list-decimal list-inside space-y-1 ml-2">
                <li v-for="step in faq.steps" :key="step">{{ step }}</li>
              </ol>
              <ul v-if="faq.list" class="list-disc list-inside space-y-1 ml-2">
                <li v-for="item in faq.list" :key="item">{{ item }}</li>
              </ul>
              <p v-if="faq.note" class="mt-2">{{ faq.note }}</p>
            </div>
          </details>
        </div>
      </div>

      <!-- 账户与安全 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <i class="fas fa-shield-alt text-green-600"></i>
          账户与安全
        </h2>
        <div class="space-y-3">
          <a 
            v-for="security in securityFAQs" 
            :key="security.id"
            href="#" 
            class="flex items-center justify-between py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded"
            @click.prevent="openSecurityFAQ(security)"
          >
            <span class="text-gray-800">{{ security.question }}</span>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </a>
        </div>
      </div>

      <!-- 联系客服 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <i class="fas fa-headset text-purple-600"></i>
          联系客服
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <i class="fas fa-phone text-blue-600"></i>
              </div>
              <div>
                <div class="text-sm text-gray-600">客服热线</div>
                <div class="font-semibold text-gray-800">400-123-4567</div>
              </div>
            </div>
            <p class="text-xs text-gray-500">工作时间：周一至周日 8:00-20:00</p>
          </div>

          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <i class="fas fa-envelope text-green-600"></i>
              </div>
              <div>
                <div class="text-sm text-gray-600">客服邮箱</div>
                <div class="font-semibold text-gray-800">support@hospital.com</div>
              </div>
            </div>
            <p class="text-xs text-gray-500">我们会在24小时内回复您的邮件</p>
          </div>
        </div>

        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
          <div class="flex items-start gap-3">
            <i class="fas fa-info-circle text-blue-600 mt-1"></i>
            <div class="text-sm text-gray-700">
              <p class="font-medium mb-1">在线客服</p>
              <p class="text-gray-600">如需即时帮助，您可以点击页面右下角的在线客服图标，我们的客服人员将为您提供实时帮助。</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 浮动聊天按钮 -->
    <button 
      class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"
      @click="openChat"
    >
      <i class="fas fa-comments text-xl"></i>
    </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import PatientSidebar from '@/components/patient/PatientSidebar.vue'

const router = useRouter()
const authStore = useAuthStore()

// 搜索查询
const searchQuery = ref('')

// 常见问题数据
const commonFAQs = ref([
  {
    id: 1,
    question: '如何预约影像检查？',
    answer: '您可以通过以下步骤预约影像检查：',
    steps: [
      '点击首页的"预约检查"按钮',
      '选择您需要的检查项目',
      '选择合适的时间段',
      '确认预约信息并提交',
      '等待系统确认，您将收到短信通知'
    ]
  },
  {
    id: 2,
    question: '如何查看我的检查报告？',
    answer: '查看检查报告的方法：',
    steps: [
      '进入"影像报告"页面',
      '在报告列表中找到您需要查看的报告',
      '点击"查看详情"按钮',
      '您也可以下载PDF格式的报告保存到本地'
    ]
  },
  {
    id: 3,
    question: '检查前需要做哪些准备？',
    answer: '不同的检查项目有不同的准备要求：',
    list: [
      'CT检查：部分检查需要空腹4-6小时',
      'MRI检查：需要取下所有金属物品',
      '超声检查：腹部超声需要空腹，膀胱超声需要憋尿',
      'X光检查：一般无特殊要求'
    ],
    note: '具体要求请查看预约确认短信或咨询医护人员。'
  },
  {
    id: 4,
    question: '如何取消或修改预约？',
    answer: '取消或修改预约的步骤：',
    steps: [
      '进入"我的工作台"或"检查预约"页面',
      '找到您要修改的预约记录',
      '点击"修改"或"取消"按钮',
      '请注意：检查前24小时内无法取消预约'
    ]
  },
  {
    id: 5,
    question: '报告多久可以出来？',
    answer: '不同检查的报告时间：',
    list: [
      'X光检查：通常1-2小时内出报告',
      'CT检查：通常24小时内出报告',
      'MRI检查：通常24-48小时内出报告',
      '超声检查：通常当天出报告'
    ],
    note: '报告完成后，系统会通过短信通知您。'
  }
])

// 安全相关FAQ
const securityFAQs = ref([
  { id: 1, question: '如何修改登录密码？' },
  { id: 2, question: '如何绑定/更换手机号？' },
  { id: 3, question: '忘记密码怎么办？' },
  { id: 4, question: '如何开启两步验证？' }
])

// 方法
const searchHelp = () => {
  if (searchQuery.value.trim()) {
    ElMessage.info(`搜索"${searchQuery.value}"的相关帮助信息`)
  }
}

const openGuide = () => {
  ElMessage.info('正在打开使用指南...')
}

const openVideo = () => {
  ElMessage.info('正在打开视频教程...')
}

const openChat = () => {
  ElMessage.info('正在连接在线客服...')
}

const openContact = () => {
  ElMessage.info('正在打开联系方式...')
}

const openSecurityFAQ = (faq: any) => {
  ElMessage.info(`正在查看：${faq.question}`)
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

const handleTabChange = (tab: string) => {
  switch (tab) {
    case 'dashboard':
      router.push('/dashboard/patient');
      break;
    case 'reports':
      router.push('/dashboard/patient/reports');
      break;
    case 'appointment':
      router.push('/dashboard/patient/appointment');
      break;
    case 'knowledge':
      router.push('/dashboard/patient/knowledge');
      break;
    case 'settings':
      router.push('/dashboard/patient/settings');
      break;
    case 'help':
      router.push('/dashboard/patient/help');
      break;
  }
}
</script>

<style scoped>
.patient-layout {
  min-height: 100vh;
  background: #f9fafb;
}

.patient-help {
  margin-left: 224px;
  padding: 24px;
  min-height: 100vh;
  width: calc(100% - 224px);
}

.help-content {
  max-width: 1200px;
  width: 100%;
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

.p-6 {
  padding: 24px;
}

.mb-6 {
  margin-bottom: 24px;
}

.relative {
  position: absolute;
}

.w-full {
  width: 100%;
}

.px-4 {
  padding-left: 16px;
  padding-right: 16px;
}

.py-3 {
  padding-top: 12px;
  padding-bottom: 12px;
}

.pl-12 {
  padding-left: 48px;
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

.absolute {
  position: absolute;
}

.left-4 {
  left: 16px;
}

.top-1\/2 {
  top: 50%;
}

.-translate-y-1\/2 {
  transform: translateY(-50%);
}

.text-gray-400 {
  color: #9ca3af;
}

.grid {
  display: grid;
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.gap-4 {
  gap: 16px;
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.text-center {
  text-align: center;
}

.w-12 {
  width: 48px;
}

.h-12 {
  height: 48px;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.bg-purple-50 {
  background-color: #faf5ff;
}

.bg-orange-50 {
  background-color: #fff7ed;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mb-3 {
  margin-bottom: 12px;
}

.text-blue-600 {
  color: #2563eb;
}

.text-green-600 {
  color: #16a34a;
}

.text-purple-600 {
  color: #9333ea;
}

.text-orange-600 {
  color: #ea580c;
}

.text-xl {
  font-size: 20px;
  line-height: 28px;
}

.text-sm {
  font-size: 14px;
  line-height: 20px;
}

.font-medium {
  font-weight: 500;
}

.text-gray-800 {
  color: #1f2937;
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

.mb-4 {
  margin-bottom: 16px;
}

.gap-2 {
  gap: 8px;
}

.text-green-600 {
  color: #16a34a;
}

.text-purple-600 {
  color: #9333ea;
}

.space-y-3 > * + * {
  margin-top: 12px;
}

.group {
  position: relative;
}

.cursor-pointer {
  cursor: pointer;
}

.py-3 {
  padding-top: 12px;
  padding-bottom: 12px;
}

.border-b {
  border-bottom-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.justify-between {
  justify-content: space-between;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-400 {
  color: #9ca3af;
}

.group-open\:rotate-180:open {
  transform: rotate(180deg);
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.text-gray-600 {
  color: #4b5563;
}

.mb-2 {
  margin-bottom: 8px;
}

.list-decimal {
  list-style-type: decimal;
}

.list-inside {
  list-style-position: inside;
}

.space-y-1 > * + * {
  margin-top: 4px;
}

.ml-2 {
  margin-left: 8px;
}

.list-disc {
  list-style-type: disc;
}

.mt-2 {
  margin-top: 8px;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.px-2 {
  padding-left: 8px;
  padding-right: 8px;
}

.rounded {
  border-radius: 4px;
}

.fa-chevron-right {
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.w-10 {
  width: 40px;
}

.h-10 {
  height: 40px;
}

.text-gray-600 {
  color: #4b5563;
}

.font-semibold {
  font-weight: 600;
}

.text-xs {
  font-size: 12px;
  line-height: 16px;
}

.text-gray-500 {
  color: #6b7280;
}

.mt-4 {
  margin-top: 16px;
}

.p-4 {
  padding: 16px;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.items-start {
  align-items: flex-start;
}

.gap-3 {
  gap: 12px;
}

.mt-1 {
  margin-top: 4px;
}

.text-gray-700 {
  color: #374151;
}

.font-medium {
  font-weight: 500;
}

.mb-1 {
  margin-bottom: 4px;
}

.fixed {
  position: fixed;
}

.bottom-6 {
  bottom: 24px;
}

.right-6 {
  right: 24px;
}

.w-14 {
  width: 56px;
}

.h-14 {
  height: 56px;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.text-white {
  color: #ffffff;
}

.rounded-full {
  border-radius: 9999px;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

@media (max-width: 1024px) {
  .patient-help {
    margin-left: 0;
    padding: 16px;
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .fixed {
    position: fixed;
    bottom: 16px;
    right: 16px;
  }
}
</style>
