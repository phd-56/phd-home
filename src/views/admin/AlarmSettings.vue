<template>
  <div class="alarm-settings-page">
    <div class="page-header">
      <h1>告警设置</h1>
      <el-button 
        type="primary" 
        @click="addNewRule"
        :loading="isLoading"
      >
        <el-icon><plus /></el-icon>
        添加告警规则
      </el-button>
    </div>
    
    <el-card>
      <el-table 
        :data="alarmRules" 
        stripe 
        border
        :loading="isLoading"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="规则名称" width="180" />
        <el-table-column label="监控资源" width="120">
          <template #default="scope">
            <el-tag :type="getResourceTypeTag(scope.row.resource)">
              {{ getResourceTypeName(scope.row.resource) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="告警阈值" width="120">
          <template #default="scope">
            {{ scope.row.threshold }}%
          </template>
        </el-table-column>
        <el-table-column label="比较运算符" width="120">
          <template #default="scope">
            {{ getOperatorText(scope.row.operator) }}
          </template>
        </el-table-column>
        <el-table-column label="通知方式" width="180">
          <template #default="scope">
            <div class="notification-methods">
              <el-tag 
                v-for="method in scope.row.notificationMethods" 
                :key="method" 
                size="small"
              >
                {{ getNotificationMethodText(method) }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-switch 
              v-model="scope.row.isEnabled" 
              @change="toggleRuleStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
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
    
    <!-- 添加/编辑告警规则对话框 -->
    <el-dialog 
      v-model="ruleDialogVisible" 
      :title="isEditMode ? '编辑告警规则' : '添加告警规则'"
      width="600px"
    >
      <threshold-config 
        :rule="currentRule" 
        :is-edit="isEditMode"
        @save="saveAlarmRule"
        @cancel="closeRuleDialog"
      />
    </el-dialog>
  </div>
    
    <!-- 最近告警记录 -->
    <div class="alarms-section" style="margin-top: 30px;">
      <h2>最近告警记录</h2>
      <el-card>
        <el-table 
          :data="recentAlarms" 
          stripe 
          border
          :loading="isLoading"
        >
          <el-table-column prop="ruleName" label="规则名称" width="200" />
          <el-table-column prop="message" label="告警消息" />
          <el-table-column prop="resourceValue" label="资源值" width="150">
            <template #default="scope">
              {{ scope.row.resourceValue }}%
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="告警时间" width="180">
            <template #default="scope">
              {{ formatTime(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.isRead ? 'info' : 'danger'">
                {{ scope.row.isRead ? '已读' : '未读' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMonitorStore } from '@/stores/monitorStore';
import ThresholdConfig from '@/components/admin/ThresholdConfig.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 状态管理
const monitorStore = useMonitorStore();
const isLoading = computed(() => monitorStore.isLoading);
const alarmRules = computed(() => monitorStore.alarmRules || []);
const recentAlarms = computed(() => monitorStore.recentAlarms || []);

// 对话框状态
const ruleDialogVisible = ref(false);
const isEditMode = ref(false);
const currentRule = ref({
  id: '',
  name: '',
  resource: 'cpu',
  threshold: 80,
  operator: 'gt',
  notificationMethods: ['system'],
  isEnabled: true
});

// 初始化数据
const loadData = async () => {
  try {
    await monitorStore.loadAlarmRules();
    await monitorStore.loadRecentAlarms();
  } catch (error) {
    console.error('加载数据失败:', error);
    ElMessage.error('加载数据失败');
  }
};

// 方法
const addNewRule = () => {
  isEditMode.value = false;
  currentRule.value = {
    id: '',
    name: '',
    resource: 'cpu',
    threshold: 80,
    operator: 'gt',
    notificationMethods: ['system'],
    isEnabled: true
  };
  ruleDialogVisible.value = true;
};

const editRule = (rule: any) => {
  isEditMode.value = true;
  currentRule.value = { ...rule };
  ruleDialogVisible.value = true;
};

const closeRuleDialog = () => {
  ruleDialogVisible.value = false;
};

const saveAlarmRule = async (ruleData: any) => {
  try {
    if (isEditMode.value) {
      await monitorStore.updateAlarmRule(currentRule.value.id, ruleData);
      ElMessage.success('规则更新成功');
    } else {
      await monitorStore.addAlarmRule(ruleData);
      ElMessage.success('规则添加成功');
    }
    closeRuleDialog();
    loadData();
  } catch (error) {
    console.error('保存规则失败:', error);
    ElMessage.error('保存规则失败');
  }
};

const deleteRule = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条告警规则吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    await monitorStore.deleteAlarmRule(id);
    ElMessage.success('规则删除成功');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除规则失败:', error);
      ElMessage.error('删除规则失败');
    }
  }
};

const toggleRuleStatus = async (rule: any) => {
  try {
    const updatedRule = { ...rule };
    await monitorStore.updateAlarmRule(rule.id, updatedRule);
    ElMessage.success('状态更新成功');
  } catch (error) {
    console.error('状态更新失败:', error);
    ElMessage.error('状态更新失败');
    await loadData(); // 恢复原状态
  }
};

// 格式化显示文本
const getResourceTypeName = (resource: string) => {
  const resourceMap: Record<string, string> = {
    'cpu': 'CPU使用率',
    'memory': '内存使用率',
    'disk': '磁盘使用率',
    'network': '网络流量'
  };
  return resourceMap[resource] || resource;
};

const getResourceTypeTag = (resource: string) => {
  const tagMap: Record<string, string> = {
    'cpu': 'primary',
    'memory': 'success',
    'disk': 'warning',
    'network': 'info'
  };
  return tagMap[resource] || 'default';
};

const getOperatorText = (operator: string) => {
  const operatorMap: Record<string, string> = {
    'gt': '大于',
    'lt': '小于',
    'gte': '大于等于',
    'lte': '小于等于'
  };
  return operatorMap[operator] || operator;
};

const getNotificationMethodText = (method: string) => {
  const methodMap: Record<string, string> = {
    'system': '系统通知',
    'email': '邮件通知',
    'sms': '短信通知'
  };
  return methodMap[method] || method;
};

const formatTime = (time: any) => {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleString('zh-CN');
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.alarm-settings-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.alarm-settings-page h2 {
  font-size: 20px;
  margin-bottom: 15px;
}

.notification-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>