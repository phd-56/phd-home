<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <el-header height="60px" class="bg-white shadow-sm flex items-center justify-between px-6">
      <div class="flex items-center">
        <el-icon class="mr-2 text-blue-600"><Menu /></el-icon>
        <h1 class="text-xl font-semibold text-gray-800">AI医学影像诊断系统</h1>
      </div>
      <div class="flex items-center space-x-4">
        <el-breadcrumb separator="/" class="hidden md:block">
          <el-breadcrumb-item><a href="/admin">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item><a href="/admin/model-management">模型管理</a></el-breadcrumb-item>
          <el-breadcrumb-item>模型优化对比</el-breadcrumb-item>
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
    <div class="flex">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="bg-white shadow-sm h-[calc(100vh-60px)]">
        <AdminSidebar />
      </el-aside>

      <!-- 内容区域 -->
      <el-main class="p-6">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800">模型优化效果对比分析</h2>
          <p class="text-gray-500 mt-1">对比不同模型版本的性能指标，分析优化效果与改进空间</p>
        </div>

        <!-- 操作工具栏 -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap justify-between items-center gap-4">
          <div class="flex flex-wrap gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">模型版本</label>
              <el-select v-model="selectedVersion" placeholder="选择模型版本" class="w-48">
                <el-option v-for="version in modelVersions" :key="version.id" :label="version.name" :value="version.id" />
              </el-select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">对比周期</label>
              <el-select v-model="timeRange" placeholder="选择对比周期" class="w-48">
                <el-option label="近1个月" value="month" />
                <el-option label="近3个月" value="quarter" />
                <el-option label="近6个月" value="halfyear" />
                <el-option label="近1年" value="year" />
              </el-select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">优化类型</label>
              <el-select v-model="optimizationType" placeholder="选择优化类型" class="w-48">
                <el-option label="算法优化" value="algorithm" />
                <el-option label="数据增强" value="data" />
                <el-option label="架构调整" value="architecture" />
                <el-option label="超参数调优" value="hyperparameter" />
              </el-select>
            </div>
          </div>
          <div class="flex gap-3">
            <el-button type="primary" @click="fetchComparisonData">
              <el-icon><Refresh /></el-icon> 刷新数据
            </el-button>
            <el-button type="default" @click="exportReport">
              <el-icon><Download /></el-icon> 导出报告
            </el-button>
          </div>
        </div>

        <!-- 模型优化对比组件 -->
        <ModelOptimizationComparison />

        <!-- 优化建议区域 -->
        <div class="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-5">
          <h3 class="text-lg font-semibold text-blue-800 flex items-center mb-3">
            <el-icon class="mr-2 text-blue-600"><Lightbulb /></el-icon>
            系统优化建议
          </h3>
          <ul class="list-disc pl-5 text-blue-700 space-y-2">
            <li>基于对比结果，建议重点关注肺结节检测算法的进一步优化，特别是<3mm结节的检出率</li>
            <li>考虑在下次迭代中增加更多样化的临床数据，尤其是罕见病例的数据增强</li>
            <li>模型推理速度已有显著提升，但在边缘设备部署时仍有优化空间</li>
            <li>建议开展针对优化后模型的临床验证研究，收集医生实际使用反馈</li>
          </ul>
        </div>
      </el-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import ModelOptimizationComparison from '@/components/admin/ModelOptimizationComparison.vue'
import { Refresh, Download, Menu, ArrowDown, User, Setting, Logout, Lightbulb } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

// 路由实例
const router = useRouter()

// 状态管理
const selectedVersion = ref('v2.1.0')
const timeRange = ref('quarter')
const optimizationType = ref('algorithm')
const loading = ref(false)

// 模型版本数据
const modelVersions = ref([
  { id: 'v2.1.0', name: '版本 v2.1.0 (2023-06)' },
  { id: 'v2.0.0', name: '版本 v2.0.0 (2023-03)' },
  { id: 'v1.5.0', name: '版本 v1.5.0 (2022-12)' },
  { id: 'v1.0.0', name: '版本 v1.0.0 (2022-09)' }
])

// 页面加载时获取数据
onMounted(() => {
  fetchComparisonData()
})

// 获取对比数据
const fetchComparisonData = () => {
  loading.value = true
  // 在实际项目中，这里会调用API获取数据
  // 模拟加载延迟
  setTimeout(() => {
    loading.value = false
    console.log('获取模型对比数据:', {
      version: selectedVersion.value,
      timeRange: timeRange.value,
      optimizationType: optimizationType.value
    })
  }, 1000)
}

// 导出报告
const exportReport = () => {
  // 模拟导出功能
  alert('报告导出功能已触发，实际项目中会生成PDF报告并下载')
  // 实际实现中可以调用后端API生成报告
}
</script>

<style scoped>
/* 页面样式 */
::v-deep .el-main {
  padding: 24px;
}

::v-deep .el-aside {
  overflow-y: auto;
}

/* 响应式调整 */
@media (max-width: 768px) {
  ::v-deep .el-aside {
    width: 60px !important;
  }
  
  .mobile-hidden {
    display: none;
  }
}
</style>