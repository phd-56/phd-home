<template>
  <div class="patient-reports">
    <div class="page-header">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800 mb-1">我的影像报告</h1>
        <p class="text-sm text-gray-500">在这里您可以查看您的影像检查报告详情，并且支持在线打印和保存</p>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="bg-white rounded-lg border border-gray-200 p-5 mb-6">
      <div class="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label class="text-sm text-gray-600 mb-2 block">影像类型</label>
          <select 
            v-model="filters.imageType" 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
          >
            <option value="">全部影像类型</option>
            <option value="MRI">MRI检查</option>
            <option value="CT">CT检查</option>
            <option value="X光">X光检查</option>
            <option value="超声">超声检查</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-600 mb-2 block">医院名称</label>
          <select 
            v-model="filters.hospital" 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
          >
            <option value="">全部医院</option>
            <option value="人民医院">人民医院</option>
            <option value="中医院">中医院</option>
            <option value="专科医院">专科医院</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-600 mb-2 block">检查时间</label>
          <select 
            v-model="filters.timeRange" 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
          >
            <option value="year">最近一年</option>
            <option value="quarter">最近三个月</option>
            <option value="month">最近一个月</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-600 mb-2 block">检索报告</label>
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="搜索影像报告、检查项目等" 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
        </div>
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <button 
            v-for="type in reportTypes" 
            :key="type.value"
            :class="['px-4 py-1.5 rounded-lg text-sm font-medium', 
              filters.activeType === type.value 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            ]"
            @click="filters.activeType = type.value"
          >
            {{ type.label }}
          </button>
        </div>
        <div class="flex gap-2">
          <button 
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
            @click="searchReports"
          >
            <i class="fas fa-search mr-1"></i>
            查询报告
          </button>
          <button 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            @click="goToAppointment"
          >
            <i class="fas fa-calendar-plus mr-1"></i>
            我的预约
          </button>
        </div>
      </div>
    </div>

    <div class="flex gap-6">
      <!-- 左侧边栏 -->
      <div class="w-64 space-y-6">
        <!-- 时间轴 -->
        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <h3 class="text-gray-800 font-medium mb-4">报告时间轴</h3>
          <div class="space-y-3">
            <div 
              v-for="year in timeline" 
              :key="year.year"
              :class="['flex items-center gap-3 p-3 rounded-lg cursor-pointer',
                year.active ? 'bg-blue-50' : 'hover:bg-gray-50'
              ]"
              @click="selectYear(year.year)"
            >
              <i :class="['fas fa-calendar', year.active ? 'text-blue-600' : 'text-gray-400']"></i>
              <div>
                <div class="text-sm font-medium text-gray-800">{{ year.year }}年</div>
                <div class="text-xs text-gray-500">{{ year.count }}次影像检查报告</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 检查类型分析 -->
        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <h3 class="text-gray-800 font-medium mb-4">检查类型分析</h3>
          <div class="space-y-3">
            <div v-for="analysis in analysisData" :key="analysis.type">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-gray-600">{{ analysis.type }}</span>
                <span class="text-gray-800 font-medium">{{ analysis.count }} 次</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2">
                <div 
                  :class="analysis.bgClass" 
                  class="h-2 rounded-full" 
                  :style="{ width: analysis.percentage + '%' }"
                ></div>
              </div>
          </div>
          </div>
        </div>
      </div>

      <!-- 主报告列表 -->
      <div class="flex-1">
        <div class="bg-white rounded-lg border border-gray-200">
          <div class="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-800">报告列表</h2>
            <div class="flex gap-2">
              <button 
                :class="['p-2 rounded', viewMode === 'list' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50']"
                @click="viewMode = 'list'"
              >
                <i class="fas fa-list"></i>
              </button>
              <button 
                :class="['p-2 rounded', viewMode === 'grid' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50']"
                @click="viewMode = 'grid'"
              >
                <i class="fas fa-th"></i>
              </button>
            </div>
          </div>

          <!-- 报告项目 -->
          <div class="divide-y divide-gray-200">
            <div 
              v-for="report in filteredReports" 
              :key="report.id" 
              class="p-5"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-gray-800 font-medium">{{ report.title }}</h3>
                    <span :class="['text-xs px-2 py-1 rounded', getStatusClass(report.status)]">
                      {{ report.status }}
                    </span>
                  </div>
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span><i class="far fa-calendar mr-1"></i>检查: {{ report.examDate }}</span>
                    <span><i class="far fa-file-alt mr-1"></i>报告: {{ report.reportDate }}</span>
                    <span><i class="fas fa-user-md mr-1"></i>{{ report.doctor }} ({{ report.department }})</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button 
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    @click="viewReport(report)"
                  >
                    <i class="far fa-eye"></i>
                  </button>
                  <button 
                    class="p-2 text-gray-600 hover:bg-gray-50 rounded"
                    @click="downloadReport(report)"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                  <button 
                    class="p-2 text-gray-600 hover:bg-gray-50 rounded"
                    @click="shareReport(report)"
                  >
                    <i class="fas fa-share-alt"></i>
                  </button>
                  <button 
                    class="p-2 text-gray-600 hover:bg-gray-50 rounded"
                    @click="printReport(report)"
                  >
                    <i class="fas fa-print"></i>
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-3">{{ report.diagnosis }}</p>
              <div class="flex gap-2">
                <span 
                  v-for="tag in report.tags" 
                  :key="tag"
                  :class="['px-2 py-1 text-xs rounded', getTagClass(tag)]"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
      </div>

          <!-- 分页 -->
          <div class="p-5 border-t border-gray-200 flex items-center justify-between">
            <div class="text-sm text-gray-500">共有{{ totalReports }}条，共{{ totalPages }}页报告</div>
            <div class="flex gap-2">
              <button 
                class="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button 
                v-for="page in visiblePages" 
                :key="page"
                :class="['px-3 py-1 rounded text-sm', 
                  page === currentPage 
                    ? 'bg-blue-600 text-white' 
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                ]"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
              <button 
                class="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
      </div>
          </div>
        </div>
        
        <!-- 使用指南 -->
        <div class="bg-white rounded-lg border border-gray-200 p-5 mt-6">
          <h3 class="text-gray-800 font-medium mb-4">报告使用指南</h3>
          <div class="grid grid-cols-4 gap-4">
            <div class="text-center">
              <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fas fa-eye text-blue-600 text-xl"></i>
              </div>
              <div class="text-sm font-medium text-gray-800 mb-1">可在线查看报告</div>
              <div class="text-xs text-gray-500">点击报告卡片，可查看完整报告内容，可在线浏览报告详情</div>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fas fa-download text-green-600 text-xl"></i>
              </div>
              <div class="text-sm font-medium text-gray-800 mb-1">下载报告文件</div>
              <div class="text-xs text-gray-500">支持下载PDF格式，可用于打印或存档，方便随时查看</div>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fas fa-share-alt text-purple-600 text-xl"></i>
              </div>
              <div class="text-sm font-medium text-gray-800 mb-1">分享给医生</div>
              <div class="text-xs text-gray-500">通过系统分享给医生，方便医生查看，可用于远程会诊</div>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fas fa-cloud text-orange-600 text-xl"></i>
        </div>
              <div class="text-sm font-medium text-gray-800 mb-1">云端储存</div>
              <div class="text-xs text-gray-500">所有报告云端存储，永久保存，随时随地可以查看</div>
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

// 筛选条件
const filters = reactive({
  imageType: '',
  hospital: '',
  timeRange: 'year',
  search: '',
  activeType: 'MRI'
})

// 报告类型
const reportTypes = [
  { label: 'MRI检查', value: 'MRI' },
  { label: 'CT检查', value: 'CT' },
  { label: 'X光检查', value: 'X光' },
  { label: '超声检查', value: '超声' },
  { label: '健康体检', value: '体检' }
]

// 视图模式
const viewMode = ref<'list' | 'grid'>('list')

// 分页
const currentPage = ref(1)
const totalPages = ref(3)
const totalReports = ref(15)

// 时间轴数据
const timeline = ref([
  { year: 2023, count: 5, active: true },
  { year: 2022, count: 3, active: false },
  { year: 2021, count: 1, active: false }
])

// 分析数据
const analysisData = ref([
  { type: 'MRI检查', count: 5, percentage: 100, bgClass: 'bg-blue-500' },
  { type: 'CT检查', count: 3, percentage: 60, bgClass: 'bg-blue-400' },
  { type: 'X光检查', count: 2, percentage: 40, bgClass: 'bg-blue-300' },
  { type: '超声检查', count: 1, percentage: 20, bgClass: 'bg-blue-200' }
])

// 报告数据
const reports = ref([
  {
    id: 1,
    title: '腰关节MRI检查',
    status: '已完成',
    examDate: '2023-06-15',
    reportDate: '2023-06-16',
    doctor: '李医生',
    department: '骨科',
    diagnosis: '诊断意见：左膝关节半月板损伤合并积液（上图），关节囊肿胀，建议进一步治疗。请遵医嘱进行后续治疗，如有疑问，请咨询主治医生。',
    tags: ['腰关节', '半月板损伤'],
    type: 'MRI'
  },
  {
    id: 2,
    title: '胸部CT检查',
    status: '已完成',
    examDate: '2023-07-22',
    reportDate: '2023-07-23',
    doctor: '王医生',
    department: '呼科',
    diagnosis: '诊断意见：1.右肺中叶结节性病变，建议进行活检。2.纵隔淋巴结肿大，需进一步检查。3.请遵医嘱进行后续治疗，如有疑问，请咨询主治医生。',
    tags: ['CT', '肺部', '肺部感染'],
    type: 'CT'
  },
  {
    id: 3,
    title: '颅部X光检查',
    status: '已完成',
    examDate: '2023-06-30',
    reportDate: '2023-07-01',
    doctor: '张医生',
    department: '神经科',
    diagnosis: '诊断意见：颅骨未见明显异常，心影大小正常，双肺纹理清晰，未见明显异常，肋骨及脊柱，均未见明显异常，诊断结果正常，定期复查即可。',
    tags: ['关节', '颅部', '平衡'],
    type: 'X光'
  },
  {
    id: 4,
    title: '头部MRI扫描',
    status: '已完成',
    examDate: '2023-05-10',
    reportDate: '2023-05-11',
    doctor: '刘医生',
    department: '神经科',
    diagnosis: '诊断意见：头部MRI扫描未见异常，大脑皮层正常，双侧脑室对称，未见占位性病变，血管系统正常，建议定期复查，如有不适请及时就医。',
    tags: ['MRI', '头部', '平衡'],
    type: 'MRI'
  },
  {
    id: 5,
    title: '胸关节超声检查',
    status: '已完成',
    examDate: '2023-03-18',
    reportDate: '2023-03-18',
    doctor: '赵医生',
    department: '骨科',
    diagnosis: '诊断意见：右肩关节超声检查，关节囊未见明显异常，肌腱未见明显损伤，关节腔内未见积液，少量关节积液，建议定期复查，如有不适请及时就医。',
    tags: ['超声', '胸关节', '肌腱损伤'],
    type: '超声'
  }
])

// 计算属性
const filteredReports = computed(() => {
  let filtered = reports.value

  if (filters.imageType) {
    filtered = filtered.filter(report => report.type === filters.imageType)
  }

  if (filters.search) {
    filtered = filtered.filter(report => 
      report.title.includes(filters.search) || 
      report.diagnosis.includes(filters.search)
    )
  }

  return filtered
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 方法
const searchReports = () => {
  ElMessage.success('搜索完成')
}

const selectYear = (year: number) => {
  timeline.value.forEach(item => {
    item.active = item.year === year
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case '已完成':
      return 'bg-green-50 text-green-600'
    case '进行中':
      return 'bg-blue-50 text-blue-600'
    case '待处理':
      return 'bg-yellow-50 text-yellow-600'
    default:
      return 'bg-gray-50 text-gray-600'
  }
}

const getTagClass = (tag: string) => {
  const tagClasses: { [key: string]: string } = {
    'MRI': 'bg-blue-50 text-blue-600',
    'CT': 'bg-green-50 text-green-600',
    'X光': 'bg-purple-50 text-purple-600',
    '超声': 'bg-yellow-50 text-yellow-600',
    '腰关节': 'bg-blue-50 text-blue-600',
    '肺部': 'bg-green-50 text-green-600',
    '头部': 'bg-purple-50 text-purple-600',
    '胸关节': 'bg-yellow-50 text-yellow-600'
  }
  
  return tagClasses[tag] || 'bg-gray-50 text-gray-600'
}

const viewReport = (report: any) => {
  ElMessage.info(`查看报告：${report.title}`)
}

const downloadReport = (report: any) => {
  ElMessage.success(`正在下载报告：${report.title}`)
}

const shareReport = (report: any) => {
  ElMessage.info(`分享报告：${report.title}`)
}

const printReport = (report: any) => {
  ElMessage.info(`打印报告：${report.title}`)
}

const goToAppointment = () => {
  router.push('/dashboard/patient/appointment')
}
</script>

<style scoped>
.patient-reports {
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

.grid {
  display: grid;
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.gap-4 {
  gap: 16px;
}

.gap-6 {
  gap: 24px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
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

.p-5 {
  padding: 20px;
}

.text-sm {
  font-size: 14px;
  line-height: 20px;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-700 {
  color: #374151;
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

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.text-2xl {
  font-size: 24px;
  line-height: 32px;
}

.mb-1 {
  margin-bottom: 4px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-3 {
  margin-bottom: 12px;
}

.block {
  display: block;
}

.w-full {
  width: 100%;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.px-3 {
  padding-left: 12px;
  padding-right: 12px;
}

.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}

.px-4 {
  padding-left: 16px;
  padding-right: 16px;
}

.py-1\.5 {
  padding-top: 6px;
  padding-bottom: 6px;
}

.rounded-lg {
  border-radius: 8px;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.text-blue-600 {
  color: #2563eb;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.text-white {
  color: #ffffff;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
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

.gap-2 {
  gap: 8px;
}

.w-64 {
  width: 256px;
}

.space-y-6 > * + * {
  margin-top: 24px;
}

.space-y-3 > * + * {
  margin-top: 12px;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.text-blue-600 {
  color: #2563eb;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-500 {
  color: #6b7280;
}

.flex-1 {
  flex: 1 1 0%;
}

.border-b {
  border-bottom-width: 1px;
}

.divide-y > * + * {
  border-top-width: 1px;
}

.divide-gray-200 > * + * {
  border-color: #e5e7eb;
}

.items-start {
  align-items: flex-start;
}

.gap-3 {
  gap: 12px;
}

.text-lg {
  font-size: 18px;
  line-height: 28px;
}

.p-2 {
  padding: 8px;
}

.rounded {
  border-radius: 4px;
}

.text-blue-600 {
  color: #2563eb;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.text-gray-600 {
  color: #4b5563;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\:bg-blue-50:hover {
  background-color: #eff6ff;
}

.px-2 {
  padding-left: 8px;
  padding-right: 8px;
}

.py-1 {
  padding-top: 4px;
  padding-bottom: 4px;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.text-green-600 {
  color: #16a34a;
}

.bg-purple-50 {
  background-color: #faf5ff;
}

.text-purple-600 {
  color: #9333ea;
}

.bg-yellow-50 {
  background-color: #fefce8;
}

.text-yellow-600 {
  color: #ca8a04;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.text-gray-600 {
  color: #4b5563;
}

.border-t {
  border-top-width: 1px;
}

.px-3 {
  padding-left: 12px;
  padding-right: 12px;
}

.py-1 {
  padding-top: 4px;
  padding-bottom: 4px;
}

.border {
  border-width: 1px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.mt-6 {
  margin-top: 24px;
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
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

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mb-1 {
  margin-bottom: 4px;
}

.mb-2 {
  margin-bottom: 8px;
}

.text-xs {
  font-size: 12px;
  line-height: 16px;
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

.mr-1 {
  margin-right: 4px;
}

@media (max-width: 1024px) {
  .patient-reports {
    margin-left: 0;
    padding: 16px;
  }
  
  .flex {
    flex-direction: column;
  }
  
  .w-64 {
    width: 100%;
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>