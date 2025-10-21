<template>
  <div class="model-performance-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a href="/admin">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="/admin/model-management">模型管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>模型性能指标</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="text-2xl font-bold text-gray-800 mt-2">模型性能指标监控</h1>
      <p class="text-gray-500 mt-1">实时监控和分析AI诊断模型的各项性能指标</p>
    </div>

    <!-- 模型选择和时间范围 -->
    <div class="filter-bar bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="w-[220px]">
          <el-select 
            v-model="selectedModel" 
            placeholder="选择模型" 
            size="default"
            class="w-full"
            @change="handleModelChange"
          >
            <el-option 
              v-for="model in modelList" 
              :key="model.id" 
              :label="model.name" 
              :value="model.id"
            />
          </el-select>
        </div>
        <div class="w-[220px]">
          <el-select 
            v-model="selectedVersion" 
            placeholder="选择版本" 
            size="default"
            class="w-full"
            @change="fetchPerformanceData"
          >
            <el-option 
              v-for="version in versionList" 
              :key="version.id" 
              :label="version.name" 
              :value="version.id"
            />
          </el-select>
        </div>
        <div class="w-[220px]">
          <el-select 
            v-model="timeRange" 
            placeholder="时间范围" 
            size="default"
            class="w-full"
            @change="fetchPerformanceData"
          >
            <el-option label="近7天" value="7d" />
            <el-option label="近30天" value="30d" />
            <el-option label="近90天" value="90d" />
            <el-option label="近半年" value="180d" />
            <el-option label="近一年" value="365d" />
          </el-select>
        </div>
        <div class="w-[220px]">
          <el-select 
            v-model="departmentFilter" 
            placeholder="科室筛选" 
            size="default"
            class="w-full"
            @change="fetchPerformanceData"
          >
            <el-option label="全部科室" value="" />
            <el-option label="放射科" value="radiology" />
            <el-option label="胸外科" value="thoracic" />
            <el-option label="呼吸科" value="respiratory" />
            <el-option label="急诊科" value="emergency" />
          </el-select>
        </div>
        <div class="ml-auto">
          <el-button type="primary" @click="fetchPerformanceData">
            <el-icon><Refresh /></el-icon> 刷新数据
          </el-button>
          <el-button type="default" @click="exportPerformanceReport" class="ml-2">
            <el-icon><Download /></el-icon> 导出报告
          </el-button>
        </div>
      </div>
    </div>

    <!-- 关键指标概览 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-title">总体准确率</span>
          <el-icon class="stat-icon" :class="accuracyTrend > 0 ? 'text-green-500' : 'text-red-500'">
            {{ accuracyTrend > 0 ? 'TrendingUp' : 'TrendingDown' }}
          </el-icon>
        </div>
        <div class="stat-value">{{ overallAccuracy }}%</div>
        <div class="stat-trend" :class="accuracyTrend > 0 ? 'text-green-500' : 'text-red-500'">
          {{ accuracyTrend > 0 ? '+' : '' }}{{ accuracyTrend }}% 较上期
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-title">肺结节检测率</span>
          <el-icon class="stat-icon" :class="noduleTrend > 0 ? 'text-green-500' : 'text-red-500'">
            {{ noduleTrend > 0 ? 'TrendingUp' : 'TrendingDown' }}
          </el-icon>
        </div>
        <div class="stat-value">{{ noduleDetectionRate }}%</div>
        <div class="stat-trend" :class="noduleTrend > 0 ? 'text-green-500' : 'text-red-500'">
          {{ noduleTrend > 0 ? '+' : '' }}{{ noduleTrend }}% 较上期
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-title">假阳性率</span>
          <el-icon class="stat-icon" :class="fpTrend < 0 ? 'text-green-500' : 'text-red-500'">
            {{ fpTrend < 0 ? 'TrendingDown' : 'TrendingUp' }}
          </el-icon>
        </div>
        <div class="stat-value">{{ falsePositiveRate }}%</div>
        <div class="stat-trend" :class="fpTrend < 0 ? 'text-green-500' : 'text-red-500'">
          {{ fpTrend > 0 ? '+' : '' }}{{ fpTrend }}% 较上期
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-title">平均推理时间</span>
          <el-icon class="stat-icon" :class="inferenceTrend < 0 ? 'text-green-500' : 'text-red-500'">
            {{ inferenceTrend < 0 ? 'TrendingDown' : 'TrendingUp' }}
          </el-icon>
        </div>
        <div class="stat-value">{{ avgInferenceTime }}s</div>
        <div class="stat-trend" :class="inferenceTrend < 0 ? 'text-green-500' : 'text-red-500'">
          {{ inferenceTrend > 0 ? '+' : '' }}{{ inferenceTrend }}s 较上期
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <el-card class="chart-card">
        <div class="card-header">
          <h3 class="card-title">准确率趋势</h3>
          <el-select v-model="accuracyPeriod" size="small" @change="fetchPerformanceData">
            <el-option label="日" value="day" />
            <el-option label="周" value="week" />
            <el-option label="月" value="month" />
          </el-select>
        </div>
        <div class="chart-container">
          <LineChart 
            :data="accuracyTrendData" 
            :x-axis="accuracyXAxis" 
            height="300px"
          />
        </div>
      </el-card>
      
      <el-card class="chart-card">
        <div class="card-header">
          <h3 class="card-title">错误类型分布</h3>
          <el-select v-model="errorTypeView" size="small" @change="updateErrorTypeChart">
            <el-option label="数量" value="count" />
            <el-option label="百分比" value="percentage" />
          </el-select>
        </div>
        <div class="chart-container">
          <PieChart 
            :data="errorTypeData" 
            height="300px"
          />
        </div>
      </el-card>
      
      <el-card class="chart-card">
        <div class="card-header">
          <h3 class="card-title">各部位检测准确率</h3>
        </div>
        <div class="chart-container">
          <BarChart 
            :data="bodyPartAccuracyData" 
            :x-axis="bodyPartLabels" 
            height="300px"
            :is-horizontal="true"
          />
        </div>
      </el-card>
      
      <el-card class="chart-card">
        <div class="card-header">
          <h3 class="card-title">不同医院部署效果</h3>
        </div>
        <div class="chart-container">
          <BarChart 
            :data="hospitalComparisonData" 
            :x-axis="hospitalLabels" 
            height="300px"
          />
        </div>
      </el-card>
    </div>

    <!-- 性能详情表格 -->
    <el-card class="mb-6">
      <div class="card-header">
        <h3 class="card-title">详细性能指标</h3>
      </div>
      <el-table 
        v-loading="loading"
        :data="performanceDetails" 
        border
        stripe
        class="w-full"
      >
        <el-table-column prop="indicator" label="指标名称" width="200" />
        <el-table-column prop="currentValue" label="当前值" width="120" align="center" />
        <el-table-column prop="previousValue" label="上期值" width="120" align="center" />
        <el-table-column prop="change" label="变化" width="120" align="center">
          <template #default="scope">
            <span :class="scope.row.change >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ scope.row.change >= 0 ? '+' : '' }}{{ scope.row.change }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="target" label="目标值" width="120" align="center" />
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="指标说明" />
      </el-table>
    </el-card>

    <!-- 性能问题预警 -->
    <el-card v-if="performanceIssues.length > 0">
      <div class="card-header">
        <h3 class="card-title">性能问题预警</h3>
      </div>
      <el-timeline>
        <el-timeline-item 
          v-for="issue in performanceIssues" 
          :key="issue.id"
          :timestamp="issue.time"
          :icon="issue.severity === 'critical' ? 'WarningFilled' : 'InfoFilled'"
          :color="issue.severity === 'critical' ? '#ff4d4f' : '#faad14'"
        >
          <el-card>
            <h4 class="font-medium">{{ issue.title }}</h4>
            <p class="text-sm text-gray-600 mt-1">{{ issue.description }}</p>
            <div class="mt-2 flex justify-between items-center">
              <el-tag :type="issue.severity === 'critical' ? 'danger' : 'warning'">
                {{ issue.severity === 'critical' ? '严重' : '警告' }}
              </el-tag>
              <el-button 
                type="text" 
                size="small" 
                @click="gotoIssueDetail(issue.id)"
              >
                查看详情
              </el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, toRefs, inject } from 'vue'
import { useRouter } from 'vue-router'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

// 引入类型定义
import type { 
  ModelPerformance, 
  PerformanceMetric,
  PerformanceIssue,
  ModelVersion
} from '@/types/feedback'

// 状态管理
const state = reactive({
  // 筛选条件
  selectedModel: '',
  selectedVersion: '',
  timeRange: '30d',
  departmentFilter: '',
  accuracyPeriod: 'day',
  errorTypeView: 'count',
  
  // 数据加载状态
  loading: false,
  
  // 模型列表
  modelList: [],
  versionList: [],
  
  // 关键指标
  overallAccuracy: 0,
  noduleDetectionRate: 0,
  falsePositiveRate: 0,
  avgInferenceTime: 0,
  
  // 趋势指标
  accuracyTrend: 0,
  noduleTrend: 0,
  fpTrend: 0,
  inferenceTrend: 0,
  
  // 图表数据
  accuracyTrendData: [],
  accuracyXAxis: [],
  errorTypeData: [],
  bodyPartAccuracyData: [],
  bodyPartLabels: [],
  hospitalComparisonData: [],
  hospitalLabels: [],
  
  // 详细指标
  performanceDetails: [],
  
  // 性能问题
  performanceIssues: []
})

// 解构响应式状态
const {
  selectedModel, selectedVersion, timeRange, departmentFilter,
  accuracyPeriod, errorTypeView, loading, modelList, versionList,
  overallAccuracy, noduleDetectionRate, falsePositiveRate, avgInferenceTime,
  accuracyTrend, noduleTrend, fpTrend, inferenceTrend, accuracyTrendData,
  accuracyXAxis, errorTypeData, bodyPartAccuracyData, bodyPartLabels,
  hospitalComparisonData, hospitalLabels, performanceDetails, performanceIssues
} = toRefs(state)

// 注入依赖
const message = inject('$message')
const router = useRouter()

// 页面加载时初始化数据
onMounted(() => {
  // 加载模型列表
  loadModelList()
  
  // 如果有默认模型，加载性能数据
  if (modelList.value.length > 0) {
    state.selectedModel = modelList.value[0].id
    loadVersionList(modelList.value[0].id)
  }
})

// 加载模型列表
const loadModelList = () => {
  // 模拟模型列表数据
  state.modelList = [
    { id: 'lung-cancer', name: '肺癌筛查AI模型' },
    { id: 'chest-xray', name: '胸部X光多病种模型' },
    { id: 'ct-brain', name: '脑部CT分析模型' },
    { id: 'mri-liver', name: '肝脏MRI评估模型' }
  ]
}

// 加载版本列表
const loadVersionList = (modelId: string) => {
  // 模拟版本数据
  state.versionList = [
    { id: 'v2.1.0', name: 'v2.1.0 (当前生产环境)' },
    { id: 'v2.0.0', name: 'v2.0.0' },
    { id: 'v1.5.0', name: 'v1.5.0' }
  ]
  
  // 默认选择第一个版本
  if (state.versionList.length > 0) {
    state.selectedVersion = state.versionList[0].id
    fetchPerformanceData()
  }
}

// 模型变更处理
const handleModelChange = (modelId: string) => {
  loadVersionList(modelId)
}

// 获取性能数据
const fetchPerformanceData = () => {
  state.loading = true
  
  try {
    // 模拟API请求延迟
    setTimeout(() => {
      // 模拟关键指标数据
      state.overallAccuracy = 94.5
      state.noduleDetectionRate = 91.3
      state.falsePositiveRate = 6.8
      state.avgInferenceTime = 1.2
      
      // 趋势数据
      state.accuracyTrend = 5.9
      state.noduleTrend = 10.7
      state.fpTrend = -44.7
      state.inferenceTrend = -50.0
      
      // 准确率趋势数据
      state.accuracyXAxis = ['1月', '2月', '3月', '4月', '5月', '6月']
      state.accuracyTrendData = [
        { name: '实际准确率', data: [89.5, 90.8, 91.7, 92.5, 93.6, 94.5] },
        { name: '目标准确率', data: [90, 91, 92, 93, 94, 95] }
      ]
      
      // 错误类型分布数据
      state.errorTypeData = [
        {
          name: '错误类型分布',
          data: [
            { name: '假阳性', value: 18 },
            { name: '假阴性', value: 15 },
            { name: '类型误判', value: 10 },
            { name: '边界错误', value: 7 }
          ]
        }
      ]
      
      // 各部位检测准确率
      state.bodyPartLabels = ['肺结节', '肺炎', '气胸', '胸腔积液', '肺纤维化']
      state.bodyPartAccuracyData = [
        { name: '准确率', data: [91.3, 93.7, 88.5, 90.2, 87.6] }
      ]
      
      // 不同医院部署效果
      state.hospitalLabels = ['协和医院', '301医院', '瑞金医院', '华西医院', '湘雅医院']
      state.hospitalComparisonData = [
        { name: '准确率', data: [94.5, 93.8, 92.6, 93.1, 92.9] }
      ]
      
      // 详细性能指标
      state.performanceDetails = [
        {
          indicator: '总体准确率',
          currentValue: '94.5%',
          previousValue: '89.2%',
          change: 5.9,
          target: '95%',
          status: '正常',
          description: '模型对所有疾病类型的总体诊断准确率'
        },
        {
          indicator: '肺结节检测召回率',
          currentValue: '91.3%',
          previousValue: '82.5%',
          change: 10.7,
          target: '90%',
          status: '优秀',
          description: '模型对肺结节的检出能力，特别是<5mm小结节'
        },
        {
          indicator: '肺炎识别F1分数',
          currentValue: '0.92',
          previousValue: '0.86',
          change: 0.06,
          target: '0.90',
          status: '优秀',
          description: '模型对肺炎的分类性能综合评价指标'
        },
        {
          indicator: '模型推理速度',
          currentValue: '1.2s',
          previousValue: '2.4s',
          change: -1.2,
          target: '1.5s',
          status: '优秀',
          description: '模型完成一次完整诊断所需的平均时间'
        },
        {
          indicator: '假阳性率',
          currentValue: '6.8%',
          previousValue: '12.3%',
          change: -5.5,
          target: '8%',
          status: '优秀',
          description: '模型错误判断为阳性的比例'
        },
        {
          indicator: '假阴性率',
          currentValue: '5.2%',
          previousValue: '7.8%',
          change: -2.6,
          target: '5%',
          status: '正常',
          description: '模型错误判断为阴性的比例'
        }
      ]
      
      // 性能问题预警
      state.performanceIssues = [
        {
          id: 'issue-001',
          title: '小尺寸肺结节检测率下降',
          description: '最近一周直径<3mm的肺结节检测率下降了3.2%，低于目标值85%',
          severity: 'warning',
          time: '2023-06-15 08:30',
          status: '处理中'
        },
        {
          id: 'issue-002',
          title: '模型推理时间突增',
          description: '6月18日开始，模型平均推理时间从1.2s增加到1.8s，可能影响临床使用体验',
          severity: 'critical',
          time: '2023-06-20 14:20',
          status: '待处理'
        }
      ]
      
      state.loading = false
    }, 1200)
  } catch (error) {
    console.error('获取性能数据失败:', error)
    message?.error('获取性能数据失败，请重试')
    state.loading = false
  }
}

// 更新错误类型图表
const updateErrorTypeChart = () => {
  // 根据视图类型更新图表数据
  if (state.errorTypeView === 'percentage') {
    state.errorTypeData = [
      {
        name: '错误类型分布(百分比)',
        data: [
          { name: '假阳性', value: 36 },
          { name: '假阴性', value: 30 },
          { name: '类型误判', value: 20 },
          { name: '边界错误', value: 14 }
        ]
      }
    ]
  } else {
    state.errorTypeData = [
      {
        name: '错误类型分布(数量)',
        data: [
          { name: '假阳性', value: 18 },
          { name: '假阴性', value: 15 },
          { name: '类型误判', value: 10 },
          { name: '边界错误', value: 7 }
        ]
      }
    ]
  }
}

// 导出性能报告
const exportPerformanceReport = () => {
  state.loading = true
  // 模拟导出
  setTimeout(() => {
    message?.success('性能报告导出成功')
    state.loading = false
  }, 1000)
}

// 查看问题详情
const gotoIssueDetail = (issueId: string) => {
  router.push(`/admin/model-performance/issues/${issueId}`)
}

// 获取状态标签类型
const getStatusTagType = (status: string): string => {
  switch (status) {
    case '优秀':
      return 'success'
    case '正常':
      return 'primary'
    case '警告':
      return 'warning'
    case '异常':
      return 'danger'
    default:
      return 'default'
  }
}

// 暴露方法
defineExpose({
  fetchPerformanceData,
  exportPerformanceReport
})
</script>

<style scoped>
.model-performance-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

/* 统计卡片样式 */
.stat-card {
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    .stat-title {
      font-size: 14px;
      color: #606266;
    }
    
    .stat-icon {
      font-size: 16px;
    }
  }
  
  .stat-value {
    font-size: 28px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
  }
  
  .stat-trend {
    font-size: 14px;
  }
}

/* 图表卡片样式 */
.chart-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: #1f2937;
    }
  }
  
  .chart-container {
    width: 100%;
    height: 300px;
  }
}
</style>