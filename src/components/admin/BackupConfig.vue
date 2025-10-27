<template>
  <el-form 
    ref="configForm" 
    :model="config" 
    label-width="150px"
    :rules="rules"
  >
    <el-form-item 
      label="配置名称" 
      prop="name"
    >
      <el-input 
        v-model="config.name" 
        placeholder="请输入备份配置名称"
        maxlength="50"
      />
    </el-form-item>
    
    <el-form-item 
      label="备份类型" 
      prop="type"
    >
      <el-radio-group v-model="config.type">
        <el-radio label="full">全量备份</el-radio>
        <el-radio label="incremental">增量备份</el-radio>
      </el-radio-group>
    </el-form-item>
    
    <el-form-item label="备份计划">
      <el-collapse v-model="scheduleCollapse">
        <el-collapse-item title="计划设置" name="schedule">
          <el-form-item 
            prop="schedule.frequency"
          >
            <el-select 
              v-model="config.schedule.frequency" 
              placeholder="选择备份频率"
              style="width: 100%;"
              @change="handleFrequencyChange"
            >
              <el-option label="每天" value="daily" />
              <el-option label="每周" value="weekly" />
              <el-option label="每月" value="monthly" />
            </el-select>
          </el-form-item>
          
          <el-form-item 
            prop="schedule.time"
          >
            <el-time-picker
              v-model="config.schedule.time"
              placeholder="选择备份时间"
              format="HH:mm"
              value-format="HH:mm"
              style="width: 100%;"
            />
          </el-form-item>
          
          <el-form-item 
            v-if="config.schedule.frequency === 'weekly'"
            prop="schedule.dayOfWeek"
          >
            <el-select 
              v-model="config.schedule.dayOfWeek" 
              placeholder="选择星期几"
              style="width: 100%;"
            >
              <el-option label="星期日" value="0" />
              <el-option label="星期一" value="1" />
              <el-option label="星期二" value="2" />
              <el-option label="星期三" value="3" />
              <el-option label="星期四" value="4" />
              <el-option label="星期五" value="5" />
              <el-option label="星期六" value="6" />
            </el-select>
          </el-form-item>
          
          <el-form-item 
            v-if="config.schedule.frequency === 'monthly'"
            prop="schedule.dayOfMonth"
          >
            <el-input 
              v-model.number="config.schedule.dayOfMonth" 
              placeholder="输入日期（1-31）"
              type="number"
              min="1"
              max="31"
            />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form-item>
    
    <el-form-item label="保留策略">
      <el-collapse v-model="retentionCollapse">
        <el-collapse-item title="保留设置" name="retention">
          <el-form-item 
            prop="retentionPolicy.keepDays"
          >
            <el-input 
              v-model.number="config.retentionPolicy.keepDays" 
              placeholder="备份保留天数"
              type="number"
              min="1"
              max="365"
            />
            <div class="form-help">备份文件保留的天数，超过将自动删除</div>
          </el-form-item>
          
          <el-form-item 
            prop="retentionPolicy.maxBackups"
          >
            <el-input 
              v-model.number="config.retentionPolicy.maxBackups" 
              placeholder="最大备份数"
              type="number"
              min="1"
              max="100"
            />
            <div class="form-help">最多保留的备份文件数量</div>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form-item>
    
    <el-form-item label="高级选项">
      <el-collapse v-model="advancedCollapse">
        <el-collapse-item title="高级设置" name="advanced">
          <el-form-item 
            prop="encryption"
          >
            <el-switch v-model="config.encryption" />
            <div class="form-help">启用备份文件加密</div>
          </el-form-item>
          
          <el-form-item 
            v-if="config.encryption"
            prop="encryptionPassword"
          >
            <el-input 
              v-model="encryptionPassword" 
              placeholder="输入加密密码"
              type="password"
              show-password
            />
          </el-form-item>
          
          <el-form-item 
            prop="compression"
          >
            <el-select 
              v-model="config.compression" 
              placeholder="选择压缩级别"
              style="width: 100%;"
            >
              <el-option label="无压缩" value="none" />
              <el-option label="普通压缩" value="normal" />
              <el-option label="高压缩" value="high" />
            </el-select>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form-item>
    
    <el-form-item 
      v-if="!isEdit"
      prop="isEnabled"
    >
      <el-switch v-model="config.isEnabled" />
      <div class="form-help">启用此备份配置</div>
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
  config: {
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
const configForm = ref(null);
const encryptionPassword = ref('');
const scheduleCollapse = ref(['schedule']);
const retentionCollapse = ref(['retention']);
const advancedCollapse = ref(['advanced']);

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入配置名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择备份类型', trigger: 'change' }
  ],
  'schedule.frequency': [
    { required: true, message: '请选择备份频率', trigger: 'change' }
  ],
  'schedule.time': [
    { required: true, message: '请选择备份时间', trigger: 'change' }
  ],
  'retentionPolicy.keepDays': [
    { required: true, message: '请输入保留天数', trigger: 'blur' },
    { type: 'number', min: 1, max: 365, message: '保留天数在 1 到 365 之间', trigger: 'blur' }
  ],
  'retentionPolicy.maxBackups': [
    { required: true, message: '请输入最大备份数', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '最大备份数在 1 到 100 之间', trigger: 'blur' }
  ]
};

// 方法
const handleSave = async () => {
  try {
    await configForm.value.validate();
    
    // 如果启用加密但没有设置密码
    if (props.config.encryption && !encryptionPassword.value && !props.isEdit) {
      ElMessage.warning('请设置加密密码');
      return;
    }
    
    emits('save', props.config);
  } catch (error) {
    // 表单验证失败
    console.error('表单验证失败:', error);
  }
};

const handleCancel = () => {
  emits('cancel');
};

const handleFrequencyChange = (frequency: string) => {
  // 重置不相关的频率设置
  if (frequency !== 'weekly') {
    props.config.schedule.dayOfWeek = 0;
  }
  if (frequency !== 'monthly') {
    props.config.schedule.dayOfMonth = 1;
  }
};

// 初始化
watch(() => props.config, (newVal) => {
  if (newVal && newVal.encryption) {
    // 在实际应用中，这里不会显示密码，仅作示例
    encryptionPassword.value = '** ** **';
  }
}, { immediate: true });
</script>

<style scoped>
.form-help {
  color: #606266;
  font-size: 12px;
  margin-top: 4px;
}

.form-actions {
  margin-top: 20px;
}
</style>