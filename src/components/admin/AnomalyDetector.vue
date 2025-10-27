<template>
  <div class="anomaly-detector">
    <div class="anomaly-stats">
      <el-card class="stat-card">
        <div class="stat-item">
          <span class="stat-label">总操作次数</span>
          <span class="stat-value">{{ totalOperations }}</span>
        </div>
      </el-card>
      
      <el-card class="stat-card warning-card">
        <div class="stat-item">
          <span class="stat-label">异常操作次数</span>
          <span class="stat-value">{{ anomalyCount }}</span>
        </div>
      </el-card>
      
      <el-card class="stat-card danger-card">
        <div class="stat-item">
          <span class="stat-label">异常率</span>
          <span class="stat-value">{{ anomalyRate.toFixed(2) }}%</span>
        </div>
      </el-card>
    </div>
    
    <el-card style="margin-top: 20px;">
      <h3 style="margin-bottom: 15px;">最近异常操作</h3>
      
      <el-table 
        :data="recentAnomalies" 
        stripe 
        border
        max-height="400"
        @row-click="handleViewLog"
      >
        <el-table-column prop="timestamp" label="时间" width="180" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="action" label="操作" width="100">
          <template #default="scope">
            <el-tag type="danger">
              {{ getActionText(scope.row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resourceType" label="资源类型" width="120" />
        <el-table-column prop="ipAddress" label="IP地址" width="140" />
        <el-table-column prop="anomalyScore" label="异常分数" width="100">
          <template #default="scope">
            <div class="score-indicator">
              <el-progress 
                :percentage="scope.row.anomalyScore" 
                status="exception"
                :stroke-width="6"
              />
              <span class="score-text">{{ scope.row.anomalyScore }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <div style="text-align: right; margin-top: 10px;">
        <el-button type="text" @click="showAllAnomalies">查看全部异常</el-button>
      </div>
    </el-card>
    
    <el-card style="margin-top: 20px;">
      <h3 style="margin-bottom: 15px;">异常规则管理</h3>
      
      <div class="rule-actions" style="margin-bottom: 15px;">
        <el-button 
          type="primary" 
          size="small" 
          @click="showAddRuleDialog"
        >
          <el-icon><plus /></el-icon>
          添加规则
        </el-button>
      </div>
      
      <el-table 
        :data="anomalyRules" 
        stripe 
        border
      >
        <el-table-column prop="name" label="规则名称" width="200" />
        <el-table-column prop="description" label="规则描述" />
        <el-table-column prop="threshold" label="阈值" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-switch 
              v-model="scope.row.isEnabled" 
              @change="toggleRuleStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="scope">
            <el-button 
              type="text" 
              size="small" 
              @click="editRule(scope.row)"
            >
              编辑
            </el-button>
            <el-button 
              type="text" 
              size="small" 
              text-color="#f56c6c"
              @click="deleteRule(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { useAuditStore } from '@/stores/auditStore';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

// Props and Emits
const props = defineProps({
  logs: {
    type: Array,
    required: true,
    default: () => []
  },
  anomalyRules: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emits = defineEmits(['view-log', 'manage-rules']);

// 状态管理
const auditStore = useAuditStore();
const addRuleDialogVisible = ref(false);
const currentRule = ref<any>(null);

// 计算属性
const totalOperations = computed(() => props.logs.length);
const anomalyCount = computed(() => {
  return props.logs.filter(log => log.isAnomaly).length;
});
const anomalyRate = computed(() => {
  return totalOperations.value > 0 
    ? (anomalyCount.value / totalOperations.value) * 100 
    : 0;
});

const recentAnomalies = computed(() => {
  return [...props.logs]
    .filter(log => log.isAnomaly)
    .sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 5);
});

// 方法
const handleViewLog = (log: any) => {
  emits('view-log', log.id);
};

const showAllAnomalies = () => {
  emits('manage-rules', 'showAllAnomalies');
};

const showAddRuleDialog = () => {
  currentRule.value = {
    id: '',
    name: '',
    description: '',
    conditions: [],
    threshold: 80,
    isEnabled: true
  };
  addRuleDialogVisible.value = true;
};

const editRule = (rule: any) => {
  currentRule.value = { ...rule };
  addRuleDialogVisible.value = true;
};

const saveRule = async () => {
  await auditStore.updateAnomalyRule(currentRule.value);
  addRuleDialogVisible.value = false;
};

const deleteRule = async (ruleId: string) => {
  await auditStore.deleteAnomalyRule(ruleId);
};

const toggleRuleStatus = async (rule: any) => {
  const updatedRule = { ...rule, isEnabled: !rule.isEnabled };
  await auditStore.updateAnomalyRule(updatedRule);
};

const getActionText = (action: string) => {
  const actionMap: Record<string, string> = {
    'create': '创建',
    'update': '更新',
    'delete': '删除',
    'login': '登录',
    'logout': '登出',
    'download': '下载',
    'upload': '上传'
  };
  return actionMap[action] || action;
};
</script>

<style scoped>
.anomaly-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-card {
  text-align: center;
  padding: 15px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-top: 5px;
  display: block;
}

.warning-card {
  border-top: 3px solid #e6a23c;
}

.danger-card {
  border-top: 3px solid #f56c6c;
}

.score-indicator {
  position: relative;
  padding-right: 40px;
}

.score-text {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  color: #f56c6c;
}
</style>