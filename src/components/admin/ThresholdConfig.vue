<template>
  <el-form 
    ref="thresholdForm" 
    :model="rule" 
    label-width="150px"
    :rules="rules"
  >
    <el-form-item 
      label="规则名称" 
      prop="name"
    >
      <el-input 
        v-model="rule.name" 
        placeholder="请输入告警规则名称"
        maxlength="50"
      />
    </el-form-item>
    
    <el-form-item 
      label="监控资源类型" 
      prop="resource"
    >
      <el-select 
        v-model="rule.resource" 
        placeholder="选择监控资源类型"
      >
        <el-option label="CPU使用率" value="cpu" />
        <el-option label="内存使用率" value="memory" />
        <el-option label="磁盘使用率" value="disk" />
        <el-option label="网络流量" value="network" />
      </el-select>
    </el-form-item>
    
    <el-form-item 
      label="告警阈值(%)" 
      prop="threshold"
    >
      <el-slider 
        v-model="rule.threshold" 
        :min="1" 
        :max="100" 
        :step="1"
        show-input
      />
      <div class="threshold-hint">
        当前阈值: {{ rule.threshold }}%
      </div>
    </el-form-item>
    
    <el-form-item 
      label="比较运算符" 
      prop="operator"
    >
      <el-radio-group v-model="rule.operator">
        <el-radio label="gt">大于</el-radio>
        <el-radio label="lt">小于</el-radio>
        <el-radio label="gte">大于等于</el-radio>
        <el-radio label="lte">小于等于</el-radio>
      </el-radio-group>
    </el-form-item>
    
    <el-form-item 
      label="通知方式" 
      prop="notificationMethods"
    >
      <el-checkbox-group v-model="rule.notificationMethods">
        <el-checkbox label="system" name="notification">系统通知</el-checkbox>
        <el-checkbox label="email" name="notification">邮件通知</el-checkbox>
        <el-checkbox label="sms" name="notification">短信通知</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    
    <el-form-item v-if="!isEdit" label="启用规则" prop="isEnabled">
      <el-switch v-model="rule.isEnabled" />
    </el-form-item>
    
    <div class="form-actions" style="margin-top: 30px; text-align: right;">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import { ElMessage } from 'element-plus';

// Props and Emits
const props = defineProps({
  rule: {
    type: Object,
    required: true,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['save', 'cancel']);

// 表单状态
const thresholdForm = ref(null);
const localRule = ref({ ...props.rule });

// 监听props变化
watch(() => props.rule, (newVal) => {
  localRule.value = { ...newVal };
}, { immediate: true });

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入规则名称', trigger: 'blur' },
    { min: 2, max: 50, message: '规则名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  resource: [
    { required: true, message: '请选择监控资源类型', trigger: 'change' }
  ],
  threshold: [
    { required: true, message: '请设置告警阈值', trigger: 'change' }
  ],
  operator: [
    { required: true, message: '请选择比较运算符', trigger: 'change' }
  ],
  notificationMethods: [
    { 
      type: 'array', 
      required: true, 
      message: '请至少选择一种通知方式', 
      trigger: 'change' 
    }
  ]
};

// 方法
const handleSave = async () => {
  try {
    await thresholdForm.value.validate();
    emits('save', localRule.value);
  } catch (error) {
    // 表单验证失败
    console.error('表单验证失败:', error);
  }
};

const handleCancel = () => {
  emits('cancel');
};
</script>

<style scoped>
.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.threshold-hint {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
  text-align: center;
}
</style>