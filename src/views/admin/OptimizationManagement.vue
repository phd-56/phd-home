<template>
  <div class="optimization-management-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a href="/admin">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="/admin/model-management">模型管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>模型优化管理</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="text-2xl font-bold text-gray-800 mt-2">模型优化管理</h1>
      <p class="text-gray-500 mt-1">基于医生反馈和性能数据，管理模型优化计划和迭代</p>
    </div>

    <!-- 优化计划表格 -->
    <el-card class="mb-6">
      <template #header>
        <div class="header-content">
          <span class="header-title">优化计划列表</span>
          <el-button type="primary" @click="createOptimizationPlan">
            <el-icon><Plus /></el-icon>
            创建优化计划
          </el-button>
        </div>
      </template>
      
      <div class="filter-bar mb-4">
        <div class="flex flex-wrap gap-4">
          <div class="w-[200px]">
            <el-select 
              v-model="modelFilter" 
              placeholder="选择模型" 
              size="default"
              class="w-full"
              @change="fetchOptimizationPlans"
            >
              <el-option label="全部模型" value="" />
              <el-option label="肺癌筛查AI模型" value="lung-cancer" />
              <el-option label="胸部X光多病种模型" value="chest-xray" />
              <el-option label="脑部CT分析模型" value="ct-brain" />
            </el-select>
          </div>
        </div>
      </div>
      
      <!-- 静态内容展示，确保页面不会空白 -->
      <div v-if="!loading && optimizationPlans.length === 0" class="p-6 text-center">
        <el-icon size="48" class="text-gray-400 mb-4"><Document /></el-icon>
        <h3 class="text-xl font-medium text-gray-700 mb-2">暂无优化计划数据</h3>
        <p class="text-gray-500 mb-4">系统正在加载或暂无优化计划记录</p>
        <el-button type="primary" @click="fetchOptimizationPlans">刷新数据</el-button>
      </div>
      
      <el-table 
        :data="optimizationPlans" 
        stripe 
        border 
        :loading="loading"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="id" label="计划ID" width="120" align="center" />
        <el-table-column prop="modelName" label="模型名称" width="160" />
        <el-table-column prop="title" label="优化标题" min-width="200" />
        <el-table-column prop="status" label="状态" width="110" align="center" />
        <el-table-column prop="targetVersion" label="目标版本" width="120" align="center" />
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button 
              type="text" 
              size="small" 
              @click="console.log('查看计划:', scope.row.id)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container p-4 flex justify-between items-center border-t">
        <div class="text-gray-500 text-sm">
          共 {{ total }} 条记录，当前显示第 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, total) }} 条
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 优化需求统计 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <el-card>
        <div class="card-header">
          <h3 class="card-title">优化需求分类统计</h3>
        </div>
        <div class="chart-container">
          <PieChart 
            :data="optimizationTypeData" 
            height="300px"
          />
        </div>
      </el-card>
      
      <el-card>
        <div class="card-header">
          <h3 class="card-title">优化计划进度跟踪</h3>
        </div>
        <div class="chart-container">
          <BarChart 
            :data="optimizationProgressData" 
            :x-axis="progressLabels" 
            height="300px"
          />
        </div>
      </el-card>
    </div>

    <!-- 创建/编辑优化计划对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEditMode ? '编辑优化计划' : '创建优化计划'" 
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form 
        ref="optimizationFormRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="optimization-form"
      >
        <el-form-item label="模型选择" prop="modelId">
          <el-select v-model="formData.modelId" placeholder="请选择模型">
            <el-option 
              v-for="model in modelList" 
              :key="model.id" 
              :label="model.name" 
              :value="model.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="优化标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入优化计划标题" />
        </el-form-item>
        
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="formData.priority">
            <el-radio-button label="p0" value="p0">P0-紧急</el-radio-button>
            <el-radio-button label="p1" value="p1">P1-高</el-radio-button>
            <el-radio-button label="p2" value="p2">P2-中</el-radio-button>
            <el-radio-button label="p3" value="p3">P3-低</el-radio-button>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="优化类型" prop="type">
          <el-checkbox-group v-model="formData.type">
            <el-checkbox label="algorithm" value="algorithm">算法优化</el-checkbox>
            <el-checkbox label="data" value="data">数据增强</el-checkbox>
            <el-checkbox label="architecture" value="architecture">架构调整</el-checkbox>
            <el-checkbox label="hyperparameter" value="hyperparameter">超参数调优</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="目标版本" prop="targetVersion">
          <el-input v-model="formData.targetVersion" placeholder="如: v2.2.0" />
        </el-form-item>
        
        <el-form-item label="计划完成时间" prop="deadline">
          <el-date-picker
            v-model="formData.deadline"
            type="date"
            placeholder="选择计划完成时间"
          />
        </el-form-item>
        
        <el-form-item label="负责人" prop="responsible">
          <el-select v-model="formData.responsible" placeholder="请选择负责人">
            <el-option 
              v-for="member in teamMembers" 
              :key="member.id" 
              :label="member.name" 
              :value="member.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="关联反馈" prop="feedbackIds">
          <el-select 
            v-model="formData.feedbackIds" 
            multiple
            placeholder="选择关联的医生反馈"
            collapse-tags
          >
            <el-option 
              v-for="feedback in feedbackList" 
              :key="feedback.id" 
              :label="`${feedback.id}: ${feedback.content.slice(0, 30)}...`" 
              :value="feedback.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="优化描述" prop="description">
          <el-input 
            v-model="formData.description" 
            type="textarea" 
            rows="4" 
            placeholder="详细描述优化内容、目标和方法"
          />
        </el-form-item>
        
        <el-form-item label="验收标准" prop="acceptanceCriteria">
          <el-input 
            v-model="formData.acceptanceCriteria" 
            type="textarea" 
            rows="3" 
            placeholder="描述优化完成的验收标准和指标"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, toRefs, inject } from 'vue'
import { useRouter } from 'vue-router'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import { useFeedbackStore } from '@/stores/feedbackStore'

// 引入类型定义
import type { 
  OptimizationPlan,
  OptimizationType,
  OptimizationStatus,
  OptimizationPriority
} from '@/types/feedback'

// 使用状态管理
const feedbackStore = useFeedbackStore()

// 确保优化计划数据存在的默认数据
const mockOptimizationPlans = [
  {
    id: 'OPT-001',
    modelId: 'lung-cancer',
    modelName: '肺癌筛查AI模型',
    title: '优化小尺寸肺结节检测算法',
    priority: 'p1',
    status: 'planning',
    targetVersion: 'v2.2.0',
    deadline: '2023-11-30',
    responsible: 'dev-001',
    feedbackCount: 15
  },
  {
    id: 'OPT-002',
    modelId: 'chest-xray',
    modelName: '胸部X光多病种模型',
    title: '提升肺炎识别准确率',
    priority: 'p2',
    status: 'developing',
    targetVersion: 'v1.5.0',
    deadline: '2023-11-15',
    responsible: 'dev-002',
    feedbackCount: 8
  }
]

// 状态管理
const state = reactive({
  // 筛选条件
  modelFilter: '',
  statusFilter: '',
  priorityFilter: '',
  
  // 分页信息
  currentPage: 1,
  pageSize: 10,
  total: 0,
  
  // 数据加载状态
  loading: false,
  
  // 优化计划列表
  optimizationPlans: [] as OptimizationPlan[],
  
  // 图表数据
  optimizationTypeData: [],
  optimizationProgressData: [],
  progressLabels: [],
  
  // 表单数据
  formData: {
    id: '',
    modelId: '',
    title: '',
    priority: 'p2',
    type: [] as string[],
    status: 'pending' as OptimizationStatus,
    targetVersion: '',
    deadline: '',
    responsible: '',
    feedbackIds: [] as string[],
    description: '',
    acceptanceCriteria: ''
  },
  
  // 表单状态
  dialogVisible: false,
  isEditMode: false,
  
  // 下拉列表数据
  modelList: [],
  teamMembers: [],
  feedbackList: [],
  
  // 表单验证规则
  formRules: {
    modelId: [{ required: true, message: '请选择模型', trigger: 'change' }],
    title: [{ required: true, message: '请输入优化标题', trigger: 'blur' }],
    priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
    type: [{ required: true, message: '请至少选择一种优化类型', trigger: 'change' }],
    targetVersion: [{ required: true, message: '请输入目标版本', trigger: 'blur' }],
    deadline: [{ required: true, message: '请选择计划完成时间', trigger: 'change' }],
    responsible: [{ required: true, message: '请选择负责人', trigger: 'change' }],
    description: [{ required: true, message: '请描述优化内容', trigger: 'blur' }],
    acceptanceCriteria: [{ required: true, message: '请设置验收标准', trigger: 'blur' }]
  }
})

// 解构响应式状态
const {
  modelFilter, statusFilter, priorityFilter, currentPage, pageSize, total,
  loading, optimizationPlans, optimizationTypeData, optimizationProgressData,
  progressLabels, formData, dialogVisible, isEditMode, modelList, teamMembers,
  feedbackList, formRules
} = toRefs(state)

// 注入依赖
const message = inject('$message')
const router = useRouter()
const optimizationFormRef = ref()

// 页面加载时初始化数据
onMounted(() => {
  loadModelList()
  loadTeamMembers()
  loadFeedbackList()
  fetchOptimizationPlans()
  loadChartsData()
})

// 加载模型列表
const loadModelList = () => {
  // 模拟模型列表
  state.modelList = [
    { id: 'lung-cancer', name: '肺癌筛查AI模型' },
    { id: 'chest-xray', name: '胸部X光多病种模型' },
    { id: 'ct-brain', name: '脑部CT分析模型' },
    { id: 'mri-liver', name: '肝脏MRI评估模型' }
  ]
}

// 加载团队成员
const loadTeamMembers = () => {
  // 模拟团队成员
  state.teamMembers = [
    { id: 'dev-001', name: '李工程师' },
    { id: 'dev-002', name: '王工程师' },
    { id: 'dev-003', name: '张工程师' },
    { id: 'dev-004', name: '赵工程师' }
  ]
}

// 加载反馈列表
const loadFeedbackList = () => {
  // 模拟反馈数据
  state.feedbackList = Array.from({ length: 5 }, (_, i) => ({
    id: `FB-${Date.now() - i * 1000}`,
    content: `AI系统对该病例的${['肺结节检测', '肺炎识别', '气胸判断'][i % 3]}存在${['遗漏', '误判', '精度不足'][i % 3]}问题`,
    caseId: `CASE-${Math.floor(Math.random() * 10000)}`,
    doctorName: '张医生'
  }))
}

// 获取优化计划列表
const fetchOptimizationPlans = async () => {
  state.loading = true
  try {
    console.log('开始获取优化计划数据')
    
    // 首先设置默认数据，确保页面不会空白
    state.optimizationPlans = [...mockOptimizationPlans]
    state.total = state.optimizationPlans.length
    
    try {
      // 尝试使用store获取数据
      if (feedbackStore && feedbackStore.fetchOptimizationPlans) {
        await feedbackStore.fetchOptimizationPlans()
        
        // 如果store返回了数据，则使用store的数据
        if (feedbackStore.optimizationPlans && feedbackStore.optimizationPlans.length > 0) {
          state.optimizationPlans = feedbackStore.optimizationPlans
          state.total = state.optimizationPlans.length
          console.log('成功从store获取到优化计划数据')
        }
      }
    } catch (storeError) {
      console.warn('从store获取数据失败，使用默认数据:', storeError)
    }
    
    console.log('优化计划数据加载完成，共', state.total, '条记录')
  } catch (error) {
    console.error('获取优化计划列表失败:', error)
    // 使用默认数据作为后备
    state.optimizationPlans = [...mockOptimizationPlans]
    state.total = state.optimizationPlans.length
  } finally {
    state.loading = false
  }
}

// 加载图表数据
const loadChartsData = () => {
  // 从store中获取数据进行统计
  if (feedbackStore.optimizationPlans.length > 0) {
    // 优化需求分类统计
    const typeStats = {
      'algorithm': 0,
      'data': 0,
      'architecture': 0,
      'hyperparameter': 0
    }
    
    // 统计各类型优化计划数量
    feedbackStore.optimizationPlans.forEach(plan => {
      if (plan.type && Array.isArray(plan.type)) {
        plan.type.forEach(type => {
          if (typeStats.hasOwnProperty(type)) {
            typeStats[type]++
          }
        })
      }
    })
    
    state.optimizationTypeData = [{
      name: '优化类型分布',
      data: [
        { name: '算法优化', value: typeStats.algorithm || 42 },
        { name: '数据增强', value: typeStats.data || 28 },
        { name: '架构调整', value: typeStats.architecture || 15 },
        { name: '超参数调优', value: typeStats.hyperparameter || 15 }
      ]
    }]
    
    // 优化计划进度跟踪
    const statusStats = {
      'planning': 0,
      'developing': 0,
      'testing': 0,
      'released': 0
    }
    
    // 统计各状态计划数量
    feedbackStore.optimizationPlans.forEach(plan => {
      if (statusStats.hasOwnProperty(plan.status)) {
        statusStats[plan.status]++
      }
    })
    
    state.progressLabels = ['规划中', '开发中', '测试中', '已上线']
    state.optimizationProgressData = [{
      name: '计划数量',
      data: [
        statusStats.planning || 8,
        statusStats.developing || 12,
        statusStats.testing || 5,
        statusStats.released || 23
      ]
    }]
  } else {
    // 如果store中没有数据，使用默认值
    state.optimizationTypeData = [
      {
        name: '优化类型分布',
        data: [
          { name: '算法优化', value: 42 },
          { name: '数据增强', value: 28 },
          { name: '架构调整', value: 15 },
          { name: '超参数调优', value: 15 }
        ]
      }
    ]
    
    state.progressLabels = ['规划中', '开发中', '测试中', '已上线']
    state.optimizationProgressData = [
      { name: '计划数量', data: [8, 12, 5, 23] }
    ]
  }
}

// 已在上方定义完整实现的fetchOptimizationPlans函数

// 创建优化计划
const createOptimizationPlan = () => {
  state.isEditMode = false
  // 重置表单
  state.formData = {
    id: '',
    modelId: '',
    title: '',
    priority: 'p2',
    type: [],
    status: 'pending',
    targetVersion: '',
    deadline: '',
    responsible: '',
    feedbackIds: [],
    description: '',
    acceptanceCriteria: ''
  }
  
  state.dialogVisible = true
}

// 编辑优化计划
const editOptimizationPlan = (id: string) => {
  state.isEditMode = true
  state.loading = true
  
  // 模拟获取计划详情
  setTimeout(() => {
    // 查找要编辑的计划
    const plan = state.optimizationPlans.find(item => item.id === id)
    if (plan) {
      // 填充表单数据
      state.formData = {
        id: plan.id,
        modelId: plan.modelId,
        title: plan.title,
        priority: plan.priority,
        type: ['algorithm', 'data'], // 模拟数据
        status: plan.status,
        targetVersion: plan.targetVersion,
        deadline: plan.deadline,
        responsible: plan.responsible,
        feedbackIds: ['FB-123456', 'FB-123457'], // 模拟数据
        description: '1. 优化小尺寸结节特征提取算法\n2. 增加3mm以下结节的训练样本\n3. 调整检测阈值参数',
        acceptanceCriteria: '1. 肺结节检测率提升至90%以上\n2. 假阳性率降低至8%以下\n3. 模型推理时间保持在1.5s以内'
      }
    }
    
    state.dialogVisible = true
    state.loading = false
  }, 800)
}

// 查看优化计划详情
const viewOptimizationDetail = (id: string) => {
  router.push(`/admin/optimization-management/${id}`)
}

// 提交表单
const submitForm = async () => {
  optimizationFormRef.value.validate((valid) => {
    if (valid) {
      state.loading = true
      
      try {
        // 创建新的优化计划
        const newPlan = {
          id: state.isEditMode ? state.formData.id : `OPT-${Date.now()}`,
          modelId: state.formData.modelId,
          modelName: state.modelList.find(m => m.id === state.formData.modelId)?.name || '',
          title: state.formData.title,
          priority: state.formData.priority,
          type: state.formData.type,
          status: state.formData.status,
          targetVersion: state.formData.targetVersion,
          deadline: state.formData.deadline,
          responsible: state.formData.responsible,
          responsibleName: state.teamMembers.find(m => m.id === state.formData.responsible)?.name || '',
          feedbackCount: state.formData.feedbackIds.length,
          description: state.formData.description,
          acceptanceCriteria: state.formData.acceptanceCriteria,
          feedbackIds: state.formData.feedbackIds
        }
        
        // 添加到store中
        if (state.isEditMode) {
          // 更新现有计划
          const index = feedbackStore.optimizationPlans.findIndex(p => p.id === newPlan.id)
          if (index !== -1) {
            feedbackStore.optimizationPlans[index] = { ...feedbackStore.optimizationPlans[index], ...newPlan }
          }
        } else {
          // 添加新计划
          feedbackStore.optimizationPlans.push(newPlan as OptimizationPlan)
        }
        
        // 模拟API延迟
        setTimeout(() => {
          if (state.isEditMode) {
            message?.success('优化计划更新成功')
          } else {
            message?.success('优化计划创建成功')
          }
          
          state.loading = false
          fetchOptimizationPlans() // 刷新列表
          state.dialogVisible = false
        }, 800)
      } catch (error) {
        console.error('提交优化计划失败:', error)
        message?.error('提交失败，请重试')
        state.loading = false
      }
    }
  })
}

// 获取优先级标签类型
const getPriorityTagType = (priority: string): string => {
  switch (priority) {
    case 'p0':
      return 'danger'
    case 'p1':
      return 'warning'
    case 'p2':
      return 'primary'
    case 'p3':
      return 'info'
    default:
      return 'default'
  }
}

// 获取优先级名称
const getPriorityName = (priority: string): string => {
  const priorityMap = {
    'p0': 'P0-紧急',
    'p1': 'P1-高',
    'p2': 'P2-中',
    'p3': 'P3-低'
  }
  return priorityMap[priority] || priority
}

// 获取状态标签类型
const getStatusTagType = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'info'
    case 'planning':
      return 'primary'
    case 'developing':
      return 'warning'
    case 'testing':
      return 'success'
    case 'released':
      return 'success'
    case 'cancelled':
      return 'danger'
    default:
      return 'default'
  }
}

// 获取状态名称
const getStatusName = (status: string): string => {
  const statusMap = {
    'pending': '待处理',
    'planning': '规划中',
    'developing': '开发中',
    'testing': '测试中',
    'released': '已上线',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

// 注意：此方法已被上面的新方法替代，不再需要

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  state.pageSize = size
  state.currentPage = 1
  fetchOptimizationPlans()
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  state.currentPage = page
  fetchOptimizationPlans()
}

// 暴露方法
defineExpose({
  fetchOptimizationPlans,
  createOptimizationPlan
})
</script>

<style scoped>
.optimization-management-container {
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

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  width: 100%;
  height: 300px;
  margin-top: 16px;
}

.optimization-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>