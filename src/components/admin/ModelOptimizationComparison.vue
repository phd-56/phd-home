<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-semibold text-gray-800">模型优化效果对比</h3>
      <div class="flex space-x-3">
        <el-select v-model="selectedModelVersion" placeholder="选择模型版本" class="w-48">
          <el-option v-for="version in modelVersions" :key="version.value" :label="version.label" :value="version.value" />
        </el-select>
        <el-button type="primary" size="small" @click="refreshComparisonData">
          <el-icon><Refresh /></el-icon> 刷新数据
        </el-button>
      </div>
    </div>

    <!-- 关键指标对比表格 -->
    <div class="mb-8">
      <h4 class="text-md font-medium text-gray-700 mb-3">关键性能指标对比</h4>
      <el-table :data="performanceIndicators" border stripe class="w-full">
        <el-table-column prop="indicator" label="指标名称" width="180" />
        <el-table-column prop="beforeValue" label="优化前" align="center" />
        <el-table-column prop="afterValue" label="优化后" align="center" />
        <el-table-column prop="improvement" label="提升幅度" align="center">
          <template #default="scope">
            <span :class="scope.row.improvement >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ scope.row.improvement >= 0 ? '+' : '' }}{{ scope.row.improvement }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 可视化对比图表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="text-md font-medium text-gray-700 mb-3">准确率对比趋势</h4>
        <LineChart :data="accuracyTrendData" :x-axis="['1月', '2月', '3月', '4月', '5月', '6月']" />
      </div>
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="text-md font-medium text-gray-700 mb-3">错误类型分布对比</h4>
        <PieChart :data="errorTypeData" />
      </div>
    </div>

    <!-- 典型案例对比 -->
    <div>
      <h4 class="text-md font-medium text-gray-700 mb-3">典型案例优化对比</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="item in typicalCases" :key="item.id" class="border rounded-lg overflow-hidden">
          <div class="p-4 bg-gray-50 border-b">
            <h5 class="font-medium">{{ item.title }}</h5>
            <p class="text-sm text-gray-500">病例ID: {{ item.caseId }}</p>
          </div>
          <div class="p-4">
            <div class="flex justify-between mb-2">
              <span class="text-sm">优化前诊断结果:</span>
              <span class="text-sm font-medium text-red-500">{{ item.beforeDiagnosis }}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-sm">优化后诊断结果:</span>
              <span class="text-sm font-medium text-green-500">{{ item.afterDiagnosis }}</span>
            </div>
            <div class="text-xs text-gray-500">
              <p>优化点: {{ item.improvementPoint }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import { Refresh } from '@element-plus/icons-vue'

// 定义数据类型
interface PerformanceIndicator {
  indicator: string
  beforeValue: string
  afterValue: string
  improvement: number
}

interface TypicalCase {
  id: number
  caseId: string
  title: string
  beforeDiagnosis: string
  afterDiagnosis: string
  improvementPoint: string
}

// 模型版本选择
const selectedModelVersion = ref('v2.1.0')
const modelVersions = [
  { value: 'v2.1.0', label: '版本 v2.1.0 (最新)' },
  { value: 'v2.0.0', label: '版本 v2.0.0' },
  { value: 'v1.5.0', label: '版本 v1.5.0' }
]

// 性能指标数据
const performanceIndicators = ref<PerformanceIndicator[]>([
  { indicator: '总体准确率', beforeValue: '89.2%', afterValue: '94.5%', improvement: 5.9 },
  { indicator: '肺结节检测召回率', beforeValue: '82.5%', afterValue: '91.3%', improvement: 10.7 },
  { indicator: '肺炎识别F1分数', beforeValue: '0.86', afterValue: '0.92', improvement: 7.0 },
  { indicator: '模型推理速度', beforeValue: '2.4s', afterValue: '1.2s', improvement: 50.0 },
  { indicator: '假阳性率', beforeValue: '12.3%', afterValue: '6.8%', improvement: -44.7 }
])

// 准确率趋势数据
const accuracyTrendData = ref([
  { name: '优化前', data: [85.2, 86.5, 87.3, 88.1, 88.7, 89.2] },
  { name: '优化后', data: [89.5, 90.8, 91.7, 92.5, 93.6, 94.5] }
])

// 错误类型分布数据
const errorTypeData = ref([
  {
    name: '优化前',
    data: [
      { name: '假阳性', value: 35 },
      { name: '假阴性', value: 28 },
      { name: '类型误判', value: 22 },
      { name: '边界错误', value: 15 }
    ]
  },
  {
    name: '优化后',
    data: [
      { name: '假阳性', value: 18 },
      { name: '假阴性', value: 15 },
      { name: '类型误判', value: 10 },
      { name: '边界错误', value: 7 }
    ]
  }
])

// 典型案例数据
const typicalCases = ref<TypicalCase[]>([
  {
    id: 1,
    caseId: 'CASE-20230512-876',
    title: '早期肺结节检测',
    beforeDiagnosis: '未检测到结节',
    afterDiagnosis: '检测到3mm肺结节',
    improvementPoint: '优化了小尺寸结节的特征提取算法，提高了检出灵敏度'
  },
  {
    id: 2,
    caseId: 'CASE-20230603-421',
    title: '肺炎类型判断',
    beforeDiagnosis: '细菌性肺炎',
    afterDiagnosis: '病毒性肺炎',
    improvementPoint: '增强了病毒感染特征的识别能力，减少类型误判'
  }
])

// 定义加载状态
const isLoading = ref(false)

// 刷新数据方法
const refreshComparisonData = () => {
  // 在实际项目中，这里会调用API获取最新数据
  // 这里仅做演示用的加载状态模拟
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    // 模拟数据更新
    performanceIndicators.value = performanceIndicators.value.map(item => ({
      ...item,
      afterValue: item.indicator === '总体准确率' ? '94.6%' : item.afterValue
    }))
  }, 800)
}
</script>

<style scoped>
/* 组件样式 */
:deep(.el-table) {
  margin-bottom: 1rem;
}

:deep(.el-select) {
  margin-right: 0.5rem;
}
</style>