<template>
  <div class="case-create-page">
    <el-card title="创建新病例">
      <el-steps :active="currentStep" finish-status="success" class="mb-6">
        <el-step title="基本信息"></el-step>
        <el-step title="诊断记录"></el-step>
        <el-step title="治疗方案"></el-step>
        <el-step title="文档上传"></el-step>
      </el-steps>

      <component 
        :is="currentComponent" 
        @next="handleNext" 
        @prev="handlePrev" 
        @submit="handleSubmit"
        :case-data="caseData"
      ></component>

      <div class="step-navigation mt-6">
        <el-button 
          v-if="currentStep > 0" 
          @click="handlePrev"
          icon="el-icon-arrow-left"
        >
          上一步
        </el-button>
        <div class="flex-1"></div>
        <el-button 
          v-if="currentStep < 3" 
          type="primary" 
          @click="handleNext"
          icon="el-icon-arrow-right"
        >
          下一步
        </el-button>
        <el-button 
          v-if="currentStep === 3" 
          type="success" 
          @click="handleSubmit"
          icon="el-icon-check"
        >
          提交病例
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import CaseForm from '@/components/case-management/CaseForm.vue';
import DiagnosisForm from '@/components/case-management/DiagnosisForm.vue';
import TreatmentForm from '@/components/case-management/TreatmentForm.vue';
import DocumentUpload from '@/components/case-management/DocumentUpload.vue';
import { useCaseStore } from '@/stores/caseStore';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

// 步骤管理
const currentStep = ref(0);
const caseData = reactive({
  basicInfo: {},
  diagnosis: [],
  treatment: [],
  documents: []
});

// 步骤对应的组件
const components = [
  CaseForm,
  DiagnosisForm,
  TreatmentForm,
  DocumentUpload
];

const currentComponent = computed(() => components[currentStep.value]);

// 状态管理和路由
const caseStore = useCaseStore();
const router = useRouter();

// 步骤导航处理
const handleNext = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// 表单数据收集
const handleFormData = (step: number, data: any) => {
  switch (step) {
    case 0:
      caseData.basicInfo = data;
      break;
    case 1:
      caseData.diagnosis = data;
      break;
    case 2:
      caseData.treatment = data;
      break;
    case 3:
      caseData.documents = data;
      break;
  }
};

// 提交病例
const handleSubmit = async () => {
  try {
    // 整合所有数据
    const caseToCreate = {
      ...caseData.basicInfo,
      diagnosis: caseData.diagnosis,
      treatmentPlan: caseData.treatment,
      documents: caseData.documents,
      status: 'active'
    };

    // 调用store创建病例
    await caseStore.createCase(caseToCreate);
    ElMessage.success('病例创建成功！');
    router.push('/cases');
  } catch (error) {
    ElMessage.error('病例创建失败，请重试');
    console.error('Case creation error:', error);
  }
};
</script>

<style scoped>
.case-create-page {
  padding: 20px;
}

.step-navigation {
  display: flex;
  align-items: center;
}

.flex-1 {
  flex: 1;
}
</style>