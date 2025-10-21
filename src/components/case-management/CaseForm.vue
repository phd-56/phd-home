<template>
  <el-form 
    ref="caseFormRef" 
    :model="formData" 
    :rules="formRules" 
    label-width="120px"
    @submit.prevent
  >
    <el-form-item label="患者ID" prop="patientId">
      <el-input 
        v-model="formData.patientId" 
        placeholder="请输入患者ID"
        @change="fetchPatientInfo"
      />
    </el-form-item>

    <el-form-item label="患者姓名" prop="patientName">
      <el-input v-model="formData.patientName" placeholder="请输入患者姓名" />
    </el-form-item>

    <el-form-item label="性别" prop="gender">
      <el-radio-group v-model="formData.gender">
        <el-radio label="male">男</el-radio>
        <el-radio label="female">女</el-radio>
        <el-radio label="other">其他</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="年龄" prop="age">
      <el-input v-model.number="formData.age" type="number" placeholder="请输入患者年龄" />
    </el-form-item>

    <el-form-item label="就诊日期" prop="admissionDate">
      <el-date-picker
        v-model="formData.admissionDate"
        type="date"
        placeholder="选择就诊日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
      />
    </el-form-item>

    <el-form-item label="主诉" prop="chiefComplaint">
      <el-input
        v-model="formData.chiefComplaint"
        type="textarea"
        :rows="3"
        placeholder="请输入患者主诉"
      />
    </el-form-item>

    <el-form-item label="现病史" prop="presentIllness">
      <el-input
        v-model="formData.presentIllness"
        type="textarea"
        :rows="4"
        placeholder="请输入现病史"
      />
    </el-form-item>

    <el-form-item label="既往史" prop="pastHistory">
      <el-input
        v-model="formData.pastHistory"
        type="textarea"
        :rows="3"
        placeholder="请输入既往史"
      />
    </el-form-item>

    <div class="form-actions">
      <el-button type="primary" @click="handleSubmit">保存并继续</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
import { useCaseStore } from '@/stores/caseStore';

// Props and Emits
const props = defineProps({
  caseData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['next', 'submit', 'update:caseData']);

// Form references and data
const caseFormRef = ref(null);
const caseStore = useCaseStore();

const formData = reactive({
  patientId: '',
  patientName: '',
  gender: '',
  age: null,
  admissionDate: '',
  chiefComplaint: '',
  presentIllness: '',
  pastHistory: ''
});

// Form validation rules
const formRules = reactive({
  patientId: [
    { required: true, message: '请输入患者ID', trigger: 'blur' }
  ],
  patientName: [
    { required: true, message: '请输入患者姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 0, max: 150, message: '年龄必须在0-150之间', trigger: 'blur' }
  ],
  admissionDate: [
    { required: true, message: '请选择就诊日期', trigger: 'change' }
  ],
  chiefComplaint: [
    { required: true, message: '请输入主诉', trigger: 'blur' },
    { min: 5, message: '主诉至少5个字符', trigger: 'blur' }
  ]
});

// Fetch patient info by ID
const fetchPatientInfo = async () => {
  if (formData.patientId) {
    try {
      const patientInfo = await caseStore.getPatientInfo(formData.patientId);
      formData.patientName = patientInfo.name;
      formData.gender = patientInfo.gender;
      formData.age = patientInfo.age;
    } catch (error) {
      console.warn('无法获取患者信息，可能是新患者');
    }
  }
};

// Handle form submission
const handleSubmit = async () => {
  const formRef = caseFormRef.value;
  if (!formRef) return;

  try {
    await formRef.validate();
    // Emit the form data to parent component
    emit('update:case-data', formData);
    emit('next');
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};

// Initialize form data if provided
onMounted(() => {
  // 检查并正确初始化表单数据
  console.log('CaseForm props:', props.caseData);
  // 无论props如何，确保表单数据有初始值以显示文本框
  if (!formData.patientId) {
    // 初始化空表单，确保文本框显示
    Object.assign(formData, {
      patientId: '',
      patientName: '',
      gender: '',
      age: null,
      admissionDate: '',
      chiefComplaint: '',
      presentIllness: '',
      pastHistory: ''
    });
  }
});
</script>

<style scoped>
.form-actions {
  margin-top: 20px;
  text-align: right;
}
</style>