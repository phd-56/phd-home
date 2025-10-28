<template>
  <div class="patient-appointment">
    <div class="page-header">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800 mb-2">影像检查预约</h1>
        <p class="text-gray-500 text-sm">轻松预约您需要的影像学检查项目，选择合适的时间和地点</p>
      </div>
    </div>

    <!-- 进度步骤 -->
    <div class="bg-white rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between max-w-3xl mx-auto">
        <!-- 步骤1 - 活跃 -->
        <div class="flex flex-col items-center flex-1">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-medium mb-2', 
            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500']">
            1
          </div>
          <span :class="['text-sm font-medium', currentStep >= 1 ? 'text-blue-600' : 'text-gray-500']">
            选择检查项目
          </span>
        </div>
        <div class="flex-1 h-px bg-gray-200 mx-4 mb-8"></div>
        
        <!-- 步骤2 -->
        <div class="flex flex-col items-center flex-1">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-medium mb-2', 
            currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500']">
            2
          </div>
          <span :class="['text-sm', currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500']">
            选择时间
          </span>
        </div>
        <div class="flex-1 h-px bg-gray-200 mx-4 mb-8"></div>
        
        <!-- 步骤3 -->
        <div class="flex flex-col items-center flex-1">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-medium mb-2', 
            currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500']">
            3
          </div>
          <span :class="['text-sm', currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500']">
            确认信息
          </span>
        </div>
        <div class="flex-1 h-px bg-gray-200 mx-4 mb-8"></div>
        
        <!-- 步骤4 -->
        <div class="flex flex-col items-center flex-1">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-medium mb-2', 
            currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500']">
            4
          </div>
          <span :class="['text-sm', currentStep >= 4 ? 'text-blue-600 font-medium' : 'text-gray-500']">
            预约完成
          </span>
        </div>
      </div>
    </div>

    <!-- 主要内容网格 -->
    <div class="grid grid-cols-3 gap-6">
      <!-- 左侧部分 - 检查选择 -->
      <div class="col-span-2">
        <div class="bg-white rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">选择检查项目</h2>
          <p class="text-gray-500 text-sm mb-6">请选择您需要进行的影像学检查项目，可在右侧查看检查须知</p>
          
          <!-- 筛选标签 -->
          <div class="flex gap-2 mb-6 border-b border-gray-200">
            <button 
              v-for="category in categories" 
              :key="category.value"
              :class="['px-4 py-2 font-medium', 
                selectedCategory === category.value 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              ]"
              @click="selectedCategory = category.value"
            >
              {{ category.label }}
            </button>
          </div>

          <!-- 检查卡片网格 -->
          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="exam in filteredExams" 
              :key="exam.id"
              :class="['border rounded-lg p-4 cursor-pointer relative transition-all',
                selectedExam?.id === exam.id 
                  ? 'border-blue-300 shadow-sm bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
              ]"
              @click="selectExam(exam)"
            >
              <div class="absolute top-4 right-4">
                <input 
                  type="radio" 
                  :name="'examination'" 
                  :checked="selectedExam?.id === exam.id"
                  class="w-4 h-4 text-blue-600"
                >
              </div>
              <div class="flex items-start gap-3 mb-3">
                <div :class="['w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', exam.iconBg]">
                  <i :class="[exam.icon, exam.iconColor, 'text-xl']"></i>
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-gray-800 mb-1">{{ exam.name }}</h3>
                  <p class="text-xs text-gray-500 leading-relaxed">{{ exam.description }}</p>
                </div>
              </div>
              <div class="flex gap-2 mb-3">
                <span 
                  v-for="tag in exam.tags" 
                  :key="tag"
                  :class="['px-2 py-1 text-xs rounded', getTagClass(tag)]"
                >
                  {{ tag }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-gray-400 text-sm line-through mr-2">{{ exam.originalPrice }}</span>
                  <span class="text-lg font-semibold text-gray-800">{{ exam.price }}</span>
                </div>
                <div class="text-green-600 text-sm">
                  会员价 {{ exam.memberPrice }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 医生信息 -->
        <div class="bg-white rounded-lg p-6 mt-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800">开单医生信息</h2>
            <button class="text-blue-600 text-sm hover:underline">
              <i class="fas fa-edit"></i>
            </button>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-blue-600 text-lg font-medium">王</span>
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-800 mb-1">王医生</h3>
              <p class="text-sm text-gray-500">神经科 - 脑部专家组</p>
              <p class="text-xs text-gray-400 mt-1">开单日期：2023.08.20</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧部分 - 预约须知 -->
      <div class="col-span-1">
        <div class="bg-white rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">预约须知</h2>
          <div class="space-y-4 text-sm text-gray-600">
            <div class="flex gap-2">
              <span class="text-blue-600 flex-shrink-0">•</span>
              <p>请提前30分钟到达检查地点，携带身份证和预约凭证</p>
            </div>
            <div class="flex gap-2">
              <span class="text-blue-600 flex-shrink-0">•</span>
              <p>部分检查需要空腹，请提前咨询医生</p>
            </div>
            <div class="flex gap-2">
              <span class="text-blue-600 flex-shrink-0">•</span>
              <p>如需取消或改期，请至少提前24小时联系我们</p>
            </div>
            <div class="flex gap-2">
              <span class="text-blue-600 flex-shrink-0">•</span>
              <p>检查结果将在3-5个工作日内出具</p>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="mt-6 space-y-3">
          <button 
            class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            :disabled="!selectedExam"
            @click="nextStep"
          >
            下一步：选择时间
          </button>
          <button 
            class="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            @click="goBack"
          >
            返回工作台
          </button>
        </div>

        <!-- 已选择的检查项目 -->
        <div v-if="selectedExam" class="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-blue-800 mb-2">已选择的检查项目</h3>
          <div class="text-sm text-blue-700">
            <p class="font-medium">{{ selectedExam.name }}</p>
            <p class="text-xs mt-1">{{ selectedExam.description }}</p>
            <div class="flex justify-between items-center mt-2">
              <span>价格：</span>
              <span class="font-semibold">{{ selectedExam.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 当前步骤
const currentStep = ref(1)

// 选中的检查项目
const selectedExam = ref<any>(null)

// 选中的分类
const selectedCategory = ref('all')

// 分类选项
const categories = [
  { label: '全部检查', value: 'all' },
  { label: 'MRI检查', value: 'MRI' },
  { label: 'CT检查', value: 'CT' },
  { label: 'X光检查', value: 'X光' },
  { label: '超声检查', value: '超声' }
]

// 检查项目数据
const exams = ref([
  {
    id: 1,
    name: '颅脑MRI检查',
    description: '对颅脑进行磁共振成像检查，清晰显示脑部结构，适用于脑部疾病诊断',
    category: 'MRI',
    tags: ['脑部', '头部', '3D成像'],
    price: '¥850.00',
    originalPrice: '¥1200.00',
    memberPrice: '¥680.00',
    icon: 'fas fa-brain',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50'
  },
  {
    id: 2,
    name: '胸部CT检查',
    description: '对胸部进行CT扫描检查，可清晰显示肺部、纵隔等结构',
    category: 'CT',
    tags: ['CT', '胸部', '1小时'],
    price: '¥420.00',
    originalPrice: '¥600.00',
    memberPrice: '¥336.00',
    icon: 'fas fa-lungs',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50'
  },
  {
    id: 3,
    name: '腰椎X光检查',
    description: '采用X光对腰椎进行检查，可快速诊断骨骼相关疾病',
    category: 'X光',
    tags: ['关节', '腰椎', '10分钟'],
    price: '¥230.00',
    originalPrice: '¥350.00',
    memberPrice: '¥184.00',
    icon: 'fas fa-x-ray',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50'
  },
  {
    id: 4,
    name: '腹部超声检查',
    description: '对腹部进行超声检查，可检查肝、胆、胰、脾、肾等脏器情况',
    category: '超声',
    tags: ['超声', '腹部', '20分钟'],
    price: '¥280.00',
    originalPrice: '¥380.00',
    memberPrice: '¥224.00',
    icon: 'fas fa-heartbeat',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50'
  },
  {
    id: 5,
    name: '心脏MRI检查',
    description: '精确评估心脏结构和功能，诊断心脏疾病',
    category: 'MRI',
    tags: ['MRI', '心内科', '60分钟'],
    price: '¥1080.00',
    originalPrice: '¥1500.00',
    memberPrice: '¥864.00',
    icon: 'fas fa-heart',
    iconColor: 'text-red-600',
    iconBg: 'bg-red-50'
  },
  {
    id: 6,
    name: '骨密度检测',
    description: '评估骨质健康状况，预防骨质疏松',
    category: 'X光',
    tags: ['X光', '骨科', '10分钟'],
    price: '¥180.00',
    originalPrice: '¥280.00',
    memberPrice: '¥144.00',
    icon: 'fas fa-bone',
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-50'
  }
])

// 计算属性
const filteredExams = computed(() => {
  if (selectedCategory.value === 'all') {
    return exams.value
  }
  return exams.value.filter(exam => exam.category === selectedCategory.value)
})

// 方法
const selectExam = (exam: any) => {
  selectedExam.value = exam
}

const getTagClass = (tag: string) => {
  const tagClasses: { [key: string]: string } = {
    'MRI': 'bg-purple-50 text-purple-600',
    'CT': 'bg-blue-50 text-blue-600',
    'X光': 'bg-orange-50 text-orange-600',
    '超声': 'bg-green-50 text-green-600',
    '脑部': 'bg-purple-50 text-purple-600',
    '胸部': 'bg-blue-50 text-blue-600',
    '腹部': 'bg-green-50 text-green-600',
    '关节': 'bg-orange-50 text-orange-600',
    '骨科': 'bg-yellow-50 text-yellow-600',
    '心内科': 'bg-red-50 text-red-600'
  }
  
  return tagClasses[tag] || 'bg-gray-50 text-gray-600'
}

const nextStep = () => {
  if (!selectedExam.value) {
    ElMessage.warning('请先选择一个检查项目')
    return
  }
  
  currentStep.value = 2
  ElMessage.success('已选择检查项目，进入下一步')
}

const goBack = () => {
  router.push('/dashboard/patient')
}
</script>

<style scoped>
.patient-appointment {
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
  margin: 8px 0 0 0;
  color: #6b7280;
  font-size: 14px;
}

.bg-white {
  background-color: #ffffff;
}

.rounded-lg {
  border-radius: 8px;
}

.p-6 {
  padding: 24px;
}

.mb-6 {
  margin-bottom: 24px;
}

.mb-2 {
  margin-bottom: 8px;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.max-w-3xl {
  max-width: 768px;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.flex-col {
  flex-direction: column;
}

.flex-1 {
  flex: 1 1 0%;
}

.w-10 {
  width: 40px;
}

.h-10 {
  height: 40px;
}

.rounded-full {
  border-radius: 9999px;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.font-medium {
  font-weight: 500;
}

.mb-2 {
  margin-bottom: 8px;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.text-white {
  color: #ffffff;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.text-gray-500 {
  color: #6b7280;
}

.text-blue-600 {
  color: #2563eb;
}

.text-sm {
  font-size: 14px;
  line-height: 20px;
}

.font-semibold {
  font-weight: 600;
}

.h-px {
  height: 1px;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.mx-4 {
  margin-left: 16px;
  margin-right: 16px;
}

.mb-8 {
  margin-bottom: 32px;
}

.grid {
  display: grid;
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.gap-6 {
  gap: 24px;
}

.col-span-2 {
  grid-column: span 2 / span 2;
}

.col-span-1 {
  grid-column: span 1 / span 1;
}

.text-lg {
  font-size: 18px;
  line-height: 28px;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-500 {
  color: #6b7280;
}

.mb-6 {
  margin-bottom: 24px;
}

.border-b {
  border-bottom-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.px-4 {
  padding-left: 16px;
  padding-right: 16px;
}

.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}

.hover\:text-gray-800:hover {
  color: #1f2937;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-4 {
  gap: 16px;
}

.border {
  border-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.border-blue-300 {
  border-color: #93c5fd;
}

.cursor-pointer {
  cursor: pointer;
}

.relative {
  position: relative;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.hover\:border-blue-300:hover {
  border-color: #93c5fd;
}

.hover\:shadow-sm:hover {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.absolute {
  position: absolute;
}

.top-4 {
  top: 16px;
}

.right-4 {
  right: 16px;
}

.w-4 {
  width: 16px;
}

.h-4 {
  width: 16px;
  height: 16px;
}

.text-blue-600 {
  color: #2563eb;
}

.items-start {
  align-items: flex-start;
}

.gap-3 {
  gap: 12px;
}

.w-10 {
  width: 40px;
}

.h-10 {
  height: 40px;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.font-medium {
  font-weight: 500;
}

.text-gray-800 {
  color: #1f2937;
}

.text-xs {
  font-size: 12px;
  line-height: 16px;
}

.text-gray-500 {
  color: #6b7280;
}

.leading-relaxed {
  line-height: 1.625;
}

.mb-3 {
  margin-bottom: 12px;
}

.mb-1 {
  margin-bottom: 4px;
}

.px-2 {
  padding-left: 8px;
  padding-right: 8px;
}

.py-1 {
  padding-top: 4px;
  padding-bottom: 4px;
}

.rounded {
  border-radius: 4px;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-sm {
  font-size: 14px;
  line-height: 20px;
}

.line-through {
  text-decoration: line-through;
}

.mr-2 {
  margin-right: 8px;
}

.text-lg {
  font-size: 18px;
  line-height: 28px;
}

.font-semibold {
  font-weight: 600;
}

.text-green-600 {
  color: #16a34a;
}

.mt-6 {
  margin-top: 24px;
}

.space-y-4 > * + * {
  margin-top: 16px;
}

.text-gray-600 {
  color: #4b5563;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.hover\:underline:hover {
  text-decoration: underline;
}

.w-full {
  width: 100%;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.text-white {
  color: #ffffff;
}

.py-3 {
  padding-top: 12px;
  padding-bottom: 12px;
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.text-gray-700 {
  color: #374151;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.space-y-3 > * + * {
  margin-top: 12px;
}

.mt-6 {
  margin-top: 24px;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.p-4 {
  padding: 16px;
}

.text-blue-800 {
  color: #1e40af;
}

.text-blue-700 {
  color: #1d4ed8;
}

.text-xs {
  font-size: 12px;
  line-height: 16px;
}

.mt-1 {
  margin-top: 4px;
}

.mt-2 {
  margin-top: 8px;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.font-semibold {
  font-weight: 600;
}

.w-12 {
  width: 48px;
}

.h-12 {
  width: 48px;
  height: 48px;
}

.bg-blue-100 {
  background-color: #dbeafe;
}

.text-blue-600 {
  color: #2563eb;
}

.text-lg {
  font-size: 18px;
  line-height: 28px;
}

.font-medium {
  font-weight: 500;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-xs {
  font-size: 12px;
  line-height: 16px;
}

.mt-1 {
  margin-top: 4px;
}

.bg-purple-50 {
  background-color: #faf5ff;
}

.text-purple-600 {
  color: #9333ea;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.text-blue-600 {
  color: #2563eb;
}

.bg-orange-50 {
  background-color: #fff7ed;
}

.text-orange-600 {
  color: #ea580c;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.text-green-600 {
  color: #16a34a;
}

.bg-red-50 {
  background-color: #fef2f2;
}

.text-red-600 {
  color: #dc2626;
}

.bg-yellow-50 {
  background-color: #fefce8;
}

.text-yellow-600 {
  color: #ca8a04;
}

.text-xl {
  font-size: 20px;
  line-height: 28px;
}

@media (max-width: 1024px) {
  .patient-appointment {
    margin-left: 0;
    padding: 16px;
  }
  
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .col-span-2 {
    grid-column: span 1 / span 1;
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
