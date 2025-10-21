<template>
  <div class="optimization-trigger-page">
    <div class="page-header">
      <h1>模型优化管理</h1>
      <el-button
        type="primary"
        @click="analyzeFeedback"
        :loading="isAnalyzing"
      >
        <el-icon><Analysis /></el-icon>
        分析最新反馈
      </el-button>
    </div>

    <el-card>
      <div class="optimization-status">
        <div class="status-item">
          <div class="status-label">待处理反馈数量：</div>
          <div class="status-value">{{ pendingFeedbackCount }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">需优化问题数量：</div>
          <div class="status-value">{{ optimizationIssuesCount }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">当前优化队列：</div>
          <div class="status-value">{{ optimizationQueueCount }} 项</div>
        </div>
        <div class="status-item">
          <div class="status-label">上次分析时间：</div>
          <div class="status-value">{{ lastAnalysisTime || '从未分析' }}</div>
        </div>
      </div>

      <div class="optimization-issues">
        <h2>优化问题列表</h2>
        <el-table
          :data="optimizationIssues"
          stripe
          border
          :loading="isLoading"
        >
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="id" label="问题ID" width="120" />
          <el-table-column label="问题类型" width="150">
            <template #default="scope">
              <el-tag :type="getIssueTypeTag(scope.row.type)">
                {{ getIssueTypeName(scope.row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="问题描述" />
          <el-table-column label="严重程度" width="120">
            <template #default="scope">
              <el-rate
                :model-value="scope.row.severity"
                :max="5"
                disabled
                :colors="['#f5222d', '#fa8c16', '#faad14', '#52c41a', '#52c41a']"
              />
            </template>
          </el-table-column>
          <el-table-column prop="feedbackCount" label="相关反馈数" width="120" />
          <el-table-column label="优化优先级" width="120" sortable>
            <template #default="scope">
              <el-tag :type="getPriorityTagType(scope.row.priority)">
                {{ scope.row.priority }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="处理状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                @click="viewIssueDetails(scope.row)"
              >
                查看详情
              </el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.status === 'pending'"
                @click="addtoOptimizationQueue(scope.row.id)"
              >
                加入优化队列
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useFeedbackStore } from '@/stores/feedbackStore';
import { Analysis } from '@element-plus/icons-vue';

// 状态管理
const feedbackStore = useFeedbackStore();
const isLoading = ref(false);
const isAnalyzing = ref(false);

// 模拟数据 - 实际应从store获取
const pendingFeedbackCount = ref(24);
const optimizationIssuesCount = ref(8);
const optimizationQueueCount = ref(3);
const lastAnalysisTime = ref('2023-10-18 09:30:00');

const optimizationIssues = ref([
  {
    id: 'OPT-202310-001',
    type: 'diagnosis_accuracy',
    description: '肺部结节良恶性判断准确率低于80%',
    severity: 5,
    feedbackCount: 12,
    priority: 'high',
    status: 'pending'
  },
  {
    id: 'OPT-202310-002',
    type: 'treatment_rationality',
    description: '糖尿病合并肾病的用药建议存在冲突',
    severity: 4,
    feedbackCount: 8,
    priority: 'high',
    status: 'in_progress'
  },
  {
    id: 'OPT-202310-003',
    type: 'case_analysis_depth',
    description: '对罕见病的病例分析深度不足',
    severity: 3,
    feedbackCount: 5,
    priority: 'medium',
    status: 'pending'
  },
  {
    id: 'OPT-202310-004',
    type: 'user_experience',
    description: '诊断报告生成速度慢，超过10秒',
    severity: 3,
    feedbackCount: 7,
    priority: 'medium',
    status: 'pending'
  }
]);

// 方法
const analyzeFeedback = async () => {
  isAnalyzing.value = true;
  try {
    await feedbackStore.analyzeFeedbackData();
    // 模拟分析后的更新
    pendingFeedbackCount.value = 18;
    optimizationIssuesCount.value = 10;
    lastAnalysisTime.value = new Date().toLocaleString();
  } catch (error) {
    console.error('分析反馈数据失败:', error);
  } finally {
    isAnalyzing.value = false;
  }
};

const viewIssueDetails = (issue) => {
  // 查看问题详情逻辑
  console.log('查看问题详情:', issue);
};

const addtoOptimizationQueue = (issueId) => {
  // 加入优化队列逻辑
  console.log('加入优化队列:', issueId);
  optimizationQueueCount.value++;
};

// 格式化显示
const getIssueTypeName = (type) => {
  const typeMap = {
    diagnosis_accuracy: '诊断准确性',
    treatment_rationality: '治疗建议合理性',
    case_analysis_depth: '病例分析深度',
    user_experience: '用户体验',
    interface_design: '界面设计',
    system_performance: '系统性能'
  };
  return typeMap[type] || type;
};

const getIssueTypeTag = (type) => {
  const typeMap = {
    diagnosis_accuracy: 'danger',
    treatment_rationality: 'warning',
    case_analysis_depth: 'primary',
    user_experience: 'info',
    interface_design: 'purple',
    system_performance: 'success'
  };
  return typeMap[type] || 'default';
};

const getPriorityTagType = (priority) => {
  const priorityMap = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  };
  return priorityMap[priority] || 'default';
};

const getStatusTagType = (status) => {
  const statusMap = {
    pending: 'info',
    in_progress: 'processing',
    completed: 'success',
    rejected: 'default'
  };
  return statusMap[status] || 'default';
};

onMounted(() => {
  // 初始化数据
});
</script>

<style scoped>
.optimization-status {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.status-item {
  display: flex;
  align-items: center;
}

.status-label {
  font-weight: bold;
  color: #606266;
  margin-right: 10px;
}

.status-value {
  font-size: 18px;
  font-weight: bold;
}

.optimization-issues {
  margin-top: 20px;
}

.optimization-issues h2 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #1890ff;
}
</style>