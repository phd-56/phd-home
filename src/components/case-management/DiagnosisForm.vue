<template>
  <div class="diagnosis-form">
    <el-button 
      type="primary" 
      icon="el-icon-plus" 
      class="add-diagnosis-btn"
      @click="addDiagnosis"
    >
      添加诊断记录
    </el-button>

    <el-divider>诊断记录列表</el-divider>

    <div v-if="diagnosisList.length === 0" class="empty-state">
      <el-empty description="暂无诊断记录，请添加"></el-empty>
    </div>

    <el-card v-for="(diagnosis, index) in diagnosisList" :key="diagnosis.id" class="diagnosis-card">
      <div class="diagnosis-header">
        <h4>诊断 #{{ index + 1 }}</h4>
        <el-button 
          type="text" 
          icon="el-icon-delete" 
          class="delete-btn"
          @click="removeDiagnosis(index)"
        />
      </div>

      <el-form 
        :model="diagnosis" 
        :rules="diagnosisRules" 
        label-width="100px"
        size="small"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="疾病编码" prop="diseaseCode">
              <el-input v-model="diagnosis.diseaseCode" placeholder="请输入疾病编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="疾病名称" prop="diseaseName">
              <el-input v-model="diagnosis.diseaseName" placeholder="请输入疾病名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="诊断日期" prop="diagnosisDate">
              <el-date-picker
                v-model="diagnosis.diagnosisDate"
                type="date"
                placeholder="选择诊断日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="诊断医生" prop="diagnosedBy">
              <el-input v-model="diagnosis.diagnosedBy" placeholder="请输入医生姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="诊断描述" prop="description">
          <el-input
            v-model="diagnosis.description"
            type="textarea"
            :rows="3"
            placeholder="请输入诊断描述"
          />
        </el-form-item>

        <el-form-item label="诊断类型" prop="diagnosisType">
          <el-select v-model="diagnosis.diagnosisType" placeholder="请选择诊断类型">
            <el-option label="初步诊断" value="preliminary" />
            <el-option label="确定诊断" value="confirmed" />
            <el-option label="鉴别诊断" value="differential" />
            <el-option label="出院诊断" value="discharge" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="form-actions">
      <el-button @click="emit('prev')">上一步</el-button>
      <el-button type="primary" @click="handleSubmit">下一步</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';

// Props and Emits
const props = defineProps({
  caseData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['prev', 'next', 'update:caseData']);

// Diagnosis list and form rules
const diagnosisList = ref([]);

const diagnosisRules = {
  diseaseCode: [
    { required: true, message: '请输入疾病编码', trigger: 'blur' }
  ],
  diseaseName: [
    { required: true, message: '请输入疾病名称', trigger: 'blur' }
  ],
  diagnosisDate: [
    { required: true, message: '请选择诊断日期', trigger: 'change' }
  ],
  diagnosedBy: [
    { required: true, message: '请输入医生姓名', trigger: 'blur' }
  ],
  diagnosisType: [
    { required: true, message: '请选择诊断类型', trigger: 'change' }
  ]
};

// Add new diagnosis entry
const addDiagnosis = () => {
  diagnosisList.value.push({
    id: uuidv4(),
    diseaseCode: '',
    diseaseName: '',
    diagnosisDate: '',
    diagnosedBy: '',
    description: '',
    diagnosisType: ''
  });
};

// Remove diagnosis entry
const removeDiagnosis = (index) => {
  diagnosisList.value.splice(index, 1);
};

// Validate all diagnosis forms
const validateAllDiagnoses = () => {
  let isValid = true;
  
  diagnosisList.value.forEach((diagnosis, index) => {
    // Simple validation check (in real implementation use el-form validate)
    if (!diagnosis.diseaseCode || !diagnosis.diseaseName) {
      isValid = false;
      console.error(`诊断 #${index + 1} 验证失败: 疾病编码和名称为必填项`);
    }
  });
  
  return isValid;
};

// Handle form submission
const handleSubmit = () => {
  if (diagnosisList.value.length === 0) {
    alert('请至少添加一项诊断记录');
    return;
  }
  
  if (validateAllDiagnoses()) {
    emit('update:caseData', diagnosisList.value);
    emit('next');
  }
};

// Initialize with existing data if provided
onMounted(() => {
  if (props.caseData && Array.isArray(props.caseData.diagnosis) && props.caseData.diagnosis.length > 0) {
    diagnosisList.value = [...props.caseData.diagnosis];
  } else {
    addDiagnosis(); // Add one empty diagnosis form by default
  }
});
</script>

<style scoped>
.add-diagnosis-btn {
  margin-bottom: 20px;
}

.diagnosis-card {
  margin-bottom: 20px;
}

.diagnosis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.delete-btn {
  color: #ff4d4f;
}

.empty-state {
  margin: 40px 0;
  text-align: center;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
</style>