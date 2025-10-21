<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部导航栏 -->
    <el-header height="60px" class="bg-white shadow-sm flex items-center justify-between px-6">
      <div class="flex items-center">
        <el-icon class="mr-2 text-blue-600"><Menu /></el-icon>
        <h1 class="text-xl font-semibold text-gray-800">AI医学影像诊断系统</h1>
      </div>
      <div class="flex items-center space-x-4">
        <el-breadcrumb separator="/" class="hidden md:block">
          <el-breadcrumb-item><a href="/dashboard/admin">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item><a href="/dashboard/admin/model-management">模型管理</a></el-breadcrumb-item>
          <el-breadcrumb-item>模型优化</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown>
          <span class="flex items-center cursor-pointer">
            <el-avatar size="32" class="mr-2">
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="管理员头像">
            </el-avatar>
            <span class="hidden md:inline">系统管理员</span>
            <el-icon class="ml-1"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item><el-icon><User /></el-icon> 个人中心</el-dropdown-item>
              <el-dropdown-item><el-icon><Setting /></el-icon> 系统设置</el-dropdown-item>
              <el-dropdown-item><el-icon><Logout /></el-icon> 退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 主内容区 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="bg-white shadow-sm h-full overflow-y-auto">
        <AdminSidebar />
      </el-aside>

      <!-- 内容区域 -->
      <el-main class="p-6 overflow-y-auto">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800">模型优化管理</h2>
          <p class="text-gray-500 mt-1">管理AI诊断模型的优化计划、对比分析和实施记录</p>
        </div>

        <!-- 优化计划状态卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <el-card class="shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">待实施优化</p>
                <h3 class="text-3xl font-bold mt-1">8</h3>
                <p class="text-green-500 text-sm mt-2">较上月 +2</p>
              </div>
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <el-icon class="text-xl"><RefreshLeft /></el-icon>
              </div>
            </div>
          </el-card>
          
          <el-card class="shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">实施中优化</p>
                <h3 class="text-3xl font-bold mt-1">4</h3>
                <p class="text-gray-500 text-sm mt-2">较上月 持平</p>
              </div>
              <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <el-icon class="text-xl"><Loading /></el-icon>
              </div>
            </div>
          </el-card>
          
          <el-card class="shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">已完成优化</p>
                <h3 class="text-3xl font-bold mt-1">12</h3>
                <p class="text-green-500 text-sm mt-2">较上月 +5</p>
              </div>
              <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <el-icon class="text-xl"><CheckCircle /></el-icon>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 优化计划列表 -->
        <el-card class="shadow-sm mb-8">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">优化计划列表</h3>
            <el-button type="primary" @click="createNewOptimization">
              <el-icon><Plus /></el-icon> 创建优化计划
            </el-button>
          </div>
          
          <el-table :data="optimizationPlans" border stripe>
            <el-table-column prop="id" label="计划ID" width="100" />
            <el-table-column prop="title" label="优化标题" />
            <el-table-column prop="modelName" label="模型名称" width="140" />
            <el-table-column prop="priority" label="优先级" width="90">
              <template #default="scope">
                <el-tag :type="getPriorityTagType(scope.row.priority)">
                  {{ scope.row.priority.toUpperCase() }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="110">
              <template #default="scope">
                <el-tag :type="getStatusTagType(scope.row.status)">
                  {{ formatStatus(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deadline" label="计划完成时间" width="140" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="viewOptimizationDetail(scope.row.id)">查看</el-button>
                <el-button size="small" type="primary" @click="editOptimization(scope.row.id)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 优化效果对比 -->
        <el-card class="shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">最新优化效果对比</h3>
            <el-button type="default" @click="gotoComparisonPage">
              查看完整对比 <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
          
          <ModelOptimizationComparison />
        </el-card>
      </el-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import ModelOptimizationComparison from '@/components/admin/ModelOptimizationComparison.vue'
import { 
  Menu, ArrowDown, User, Setting, Logout, 
  Plus, RefreshLeft, Loading, CheckCircle, ArrowRight 
} from '@element-plus/icons-vue'

// 路由实例
const router = useRouter()

// 模拟优化计划数据
const optimizationPlans = ref([
  {
    id: 'OP-20230601',
    title: '肺结节检测算法优化',
    modelName: '胸部CT诊断模型',
    priority: 'p0',
    status: 'completed',
    deadline: '2023-06-30',
    responsible: '张工程师'
  },
  {
    id: 'OP-20230605',
    title: '肺炎类型识别优化',
    modelName: '胸部X光诊断模型',
    priority: 'p1',
    status: 'completed',
    deadline: '2023-07-15',
    responsible: '李工程师'
  },
  {
    id: 'OP-20230610',
    title: '模型推理速度优化',
    modelName: '多模态诊断模型',
    priority: 'p1',
    status: 'in_progress',
    deadline: '2023-08-20',
    responsible: '王工程师'
  },
  {
    id: 'OP-20230615',
    title: '小病灶检出率提升',
    modelName: '乳腺钼靶诊断模型',
    priority: 'p0',
    status: 'pending',
    deadline: '2023-09-10',
    responsible: '赵工程师'
  },
  {
    id: 'OP-20230620',
    title: '超参数调优',
    modelName: '脑部MRI诊断模型',
    priority: 'p2',
    status: 'planning',
    deadline: '2023-10-05',
    responsible: '刘工程师'
  }
])

// 优先级标签类型映射
const getPriorityTagType = (priority: string) => {
  const typeMap = {
    'p0': 'danger',
    'p1': 'warning',
    'p2': 'info',
    'p3': 'default'
  }
  return typeMap[priority] || 'default'
}

// 状态标签类型映射
const getStatusTagType = (status: string) => {
  const typeMap = {
    'pending': 'default',
    'planning': 'info',
    'in_progress': 'primary',
    'testing': 'warning',
    'completed': 'success',
    'cancelled': 'danger'
  }
  return typeMap[status] || 'default'
}

// 格式化状态文本
const formatStatus = (status: string) => {
  const statusMap = {
    'pending': '待处理',
    'planning': '规划中',
    'in_progress': '实施中',
    'testing': '测试中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

// 跳转到优化详情页
const viewOptimizationDetail = (id: string) => {
  router.push(`/dashboard/admin/optimization-plans/${id}`)
}

// 编辑优化计划
const editOptimization = (id: string) => {
  router.push(`/dashboard/admin/optimization-plans/${id}/edit`)
}

// 创建新优化计划
const createNewOptimization = () => {
  router.push('/dashboard/admin/optimization-plans/new')
}

// 前往对比页面
const gotoComparisonPage = () => {
  router.push('/dashboard/admin/model-optimization-comparison')
}
</script>

<style scoped>
::v-deep .el-main {
  padding: 24px;
}

::v-deep .el-aside {
  border-right: 1px solid #e5e7eb;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid-cols-1\.md\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>