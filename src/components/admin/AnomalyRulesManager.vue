<template>
  <div class="anomaly-rules-manager">
    <el-button type="primary" @click="showAddRuleDialog" class="mb-4">
      <el-icon><Plus /></el-icon> 添加规则
    </el-button>
    
    <el-table :data="rules" style="width: 100%">
      <el-table-column prop="name" label="规则名称" width="200" />
      <el-table-column prop="description" label="规则描述" />
      <el-table-column prop="threshold" label="阈值" width="100" />
      <el-table-column prop="action" label="触发动作" width="150" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editRule(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="deleteRule(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 添加/编辑规则对话框 -->
    <el-dialog
      v-model="ruleDialogVisible"
      :title="isEditMode ? '编辑规则' : '添加规则'"
      width="500px"
    >
      <el-form :model="currentRule" label-width="100px">
        <el-form-item label="规则名称" required>
          <el-input v-model="currentRule.name" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="规则描述">
          <el-input
            v-model="currentRule.description"
            type="textarea"
            rows="3"
            placeholder="请输入规则描述"
          />
        </el-form-item>
        <el-form-item label="阈值" required>
          <el-input-number v-model="currentRule.threshold" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="触发动作" required>
          <el-select v-model="currentRule.action" placeholder="请选择触发动作">
            <el-option label="标记异常" value="mark_anomaly" />
            <el-option label="发送告警" value="send_alert" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeRuleDialog">取消</el-button>
        <el-button type="primary" @click="saveRule">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { Plus } from '@element-plus/icons-vue';

// 属性定义
const props = defineProps({
  rules: {
    type: Array,
    default: () => []
  }
});

// 事件定义
const emit = defineEmits(['save-rule', 'delete-rule']);

// 状态
const ruleDialogVisible = ref(false);
const isEditMode = ref(false);
const currentRule = ref({
  id: '',
  name: '',
  description: '',
  threshold: 5,
  action: 'mark_anomaly'
});

// 显示添加规则对话框
const showAddRuleDialog = () => {
  isEditMode.value = false;
  currentRule.value = {
    id: Date.now().toString(),
    name: '',
    description: '',
    threshold: 5,
    action: 'mark_anomaly'
  };
  ruleDialogVisible.value = true;
};

// 编辑规则
const editRule = (rule: any) => {
  isEditMode.value = true;
  currentRule.value = { ...rule };
  ruleDialogVisible.value = true;
};

// 关闭对话框
const closeRuleDialog = () => {
  ruleDialogVisible.value = false;
};

// 保存规则
const saveRule = () => {
  emit('save-rule', { ...currentRule.value });
  ruleDialogVisible.value = false;
};

// 删除规则
const deleteRule = (ruleId: string) => {
  emit('delete-rule', ruleId);
};
</script>

<style scoped>
.anomaly-rules-manager {
  padding: 10px 0;
}
</style>