<template>
  <div class="treatment-form">
    <el-card>
      <div class="form-header">
        <h3>治疗方案管理</h3>
        <el-button 
          type="primary" 
          icon="el-icon-plus" 
          size="small"
          @click="addTreatmentItem"
        >
          添加治疗项目
        </el-button>
      </div>

      <el-divider></el-divider>

      <div v-if="treatmentItems.length === 0" class="empty-state">
        <el-empty description="暂无治疗项目，请添加"></el-empty>
      </div>

      <el-collapse v-else accordion>
        <el-collapse-item 
          v-for="(item, index) in treatmentItems" 
          :key="item.id" 
          :title="`治疗项目 #${index + 1}: ${item.treatmentName || '未命名'}`"
          class="treatment-item"
        >
          <el-form 
            ref="treatmentFormRefs[index]" 
            :model="item" 
            :rules="treatmentRules" 
            label-width="120px"
            size="medium"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="治疗项目名称" prop="treatmentName">
                  <el-input 
                    v-model="item.treatmentName" 
                    placeholder="请输入治疗项目名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="治疗类型" prop="treatmentType">
                  <el-select 
                    v-model="item.treatmentType" 
                    placeholder="请选择治疗类型"
                  >
                    <el-option label="药物治疗" value="medication"></el-option>
                    <el-option label="手术治疗" value="surgery"></el-option>
                    <el-option label="物理治疗" value="physical"></el-option>
                    <el-option label="康复训练" value="rehabilitation"></el-option>
                    <el-option label="其他治疗" value="other"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20" v-if="item.treatmentType === 'medication'">
              <el-col :span="12">
                <el-form-item label="药物名称" prop="medicationName">
                  <el-input 
                    v-model="item.medicationName" 
                    placeholder="请输入药物名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="药物剂量" prop="dosage">
                  <el-input 
                    v-model="item.dosage" 
                    placeholder="请输入药物剂量，如：5mg/次"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20" v-if="item.treatmentType === 'medication'">
              <el-col :span="12">
                <el-form-item label="用药频率" prop="frequency">
                  <el-select 
                    v-model="item.frequency" 
                    placeholder="请选择用药频率"
                  >
                    <el-option label="每日一次" value="once"></el-option>
                    <el-option label="每日两次" value="twice"></el-option>
                    <el-option label="每日三次" value="threeTimes"></el-option>
                    <el-option label="每日四次" value="fourTimes"></el-option>
                    <el-option label="按需使用" value="asNeeded"></el-option>
                    <el-option label="自定义" value="custom"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用药途径" prop="administrationRoute">
                  <el-select 
                    v-model="item.administrationRoute" 
                    placeholder="请选择用药途径"
                  >
                    <el-option label="口服" value="oral"></el-option>
                    <el-option label="静脉注射" value="intravenous"></el-option>
                    <el-option label="肌肉注射" value="intramuscular"></el-option>
                    <el-option label="皮下注射" value="subcutaneous"></el-option>
                    <el-option label="外用" value="topical"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="开始日期" prop="startDate">
                  <el-date-picker
                    v-model="item.startDate"
                    type="date"
                    placeholder="选择开始日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束日期" prop="endDate">
                  <el-date-picker
                    v-model="item.endDate"
                    type="date"
                    placeholder="选择结束日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="治疗医生" prop="doctorName">
              <el-input 
                v-model="item.doctorName" 
                placeholder="请输入治疗医生姓名"
              />
            </el-form-item>

            <el-form-item label="治疗说明" prop="description">
              <el-input
                v-model="item.description"
                type="textarea"
                rows="4"
                placeholder="请输入治疗说明或备注"
              />
            </el-form-item>

            <el-form-item label="治疗状态" prop="status">
              <el-radio-group v-model="item.status">
                <el-radio label="计划中"></el-radio>
                <el-radio label="进行中"></el-radio>
                <el-radio label="已完成"></el-radio>
                <el-radio label="已取消"></el-radio>
              </el-radio-group>
            </el-form-item>

            <div class="form-actions">
              <el-button 
                type="text" 
                icon="el-icon-delete" 
                class="delete-btn"
                @click="removeTreatmentItem(index)"
              >
                删除
              </el-button>
              <el-button 
                type="primary" 
                size="small"
                @click="saveTreatmentItem(index)"
              >
                保存
              </el-button>
            </div>
          </el-form>
        </el-collapse-item>
      </el-collapse>

      <div class="form-footer" v-if="treatmentItems.length > 0">
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button 
          type="primary" 
          @click="submitForm"
        >
          提交治疗方案
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { v4 as uuidv4 } from 'uuid';

// 定义Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

// 定义Emits
const emit = defineEmits(['update:modelValue', 'submit', 'cancel']);

// 治疗项目列表
const treatmentItems = ref([]);
// 表单引用数组
const treatmentFormRefs = ref([]);

// 初始化治疗项目
onMounted(() => {
  if (props.modelValue && props.modelValue.length > 0) {
    treatmentItems.value = [...props.modelValue];
  } else {
    // 默认添加一个空项目
    addTreatmentItem();
  }
});

// 添加治疗项目
const addTreatmentItem = () => {
  const newItem = {
    id: uuidv4(),
    treatmentName: '',
    treatmentType: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    administrationRoute: '',
    startDate: '',
    endDate: '',
    doctorName: '',
    description: '',
    status: '计划中'
  };
  
  treatmentItems.value.push(newItem);
  // 为新添加的项目创建表单引用
  treatmentFormRefs.value.push(ref(null));
};

// 移除治疗项目
const removeTreatmentItem = (index) => {
  treatmentItems.value.splice(index, 1);
  treatmentFormRefs.value.splice(index, 1);
  
  if (treatmentItems.value.length === 0) {
    addTreatmentItem();
  }
};

// 保存单个治疗项目
const saveTreatmentItem = async (index) => {
  const formRef = treatmentFormRefs.value[index];
  
  if (!formRef) return;
  
  try {
    await formRef.validate();
    ElMessage.success('治疗项目保存成功');
    // 更新父组件数据
    emit('update:modelValue', treatmentItems.value);
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};

// 提交整个治疗方案
const submitForm = async () => {
  // 验证所有表单
  let isValid = true;
  
  for (let i = 0; i < treatmentFormRefs.value.length; i++) {
    const formRef = treatmentFormRefs.value[i];
    if (formRef) {
      try {
        await formRef.validate();
      } catch (error) {
        isValid = false;
        // 展开有错误的表单项
        // 这里需要根据具体的UI库实现
      }
    }
  }
  
  if (isValid) {
    emit('update:modelValue', treatmentItems.value);
    emit('submit', treatmentItems.value);
    ElMessage.success('治疗方案提交成功');
  } else {
    ElMessage.error('请完善所有治疗项目信息');
  }
};

// 治疗项目表单验证规则
const treatmentRules = reactive({
  treatmentName: [
    { required: true, message: '请输入治疗项目名称', trigger: 'blur' }
  ],
  treatmentType: [
    { required: true, message: '请选择治疗类型', trigger: 'change' }
  ],
  medicationName: [
    { required: true, message: '请输入药物名称', trigger: 'blur' },
    { required: (rule, value, callback) => {
      const currentIndex = treatmentItems.value.findIndex(item => item.medicationName === value);
      return treatmentItems.value[currentIndex].treatmentType === 'medication' ? [
        { required: true, message: '请输入药物名称', trigger: 'blur' }
      ] : [];
    }}
  ],
  dosage: [
    { required: (rule, value, callback) => {
      const currentIndex = treatmentItems.value.findIndex(item => item.dosage === value);
      return treatmentItems.value[currentIndex].treatmentType === 'medication' ? [
        { required: true, message: '请输入药物剂量', trigger: 'blur' }
      ] : [];
    }}
  ],
  startDate: [
    { required: true, message: '请选择开始日期', trigger: 'change' }
  ],
  doctorName: [
    { required: true, message: '请输入治疗医生姓名', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择治疗状态', trigger: 'change' }
  ]
});
</script>

<style scoped>
.treatment-form {
  padding: 10px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.empty-state {
  margin: 40px 0;
  text-align: center;
}

.treatment-item {
  margin-bottom: 10px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.delete-btn {
  color: #f56c6c;
}

.form-footer {
  margin-top: 20px;
  text-align: right;
}
</style>