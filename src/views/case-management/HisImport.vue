<template>
  <div class="import-cases-page">
    <el-card>
      <h2 class="page-title">HIS系统数据导入</h2>
      
      <el-steps :active="currentStep" finish-status="success" class="import-steps">
        <el-step title="选择导入方式"></el-step>
        <el-step title="上传文件/配置接口"></el-step>
        <el-step title="数据验证"></el-step>
        <el-step title="导入数据"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <div class="import-content">
        <component 
          :is="currentComponent" 
          @next="handleNext" 
          @prev="handlePrev"
          @complete="handleComplete"
          :import-data="importData"
        ></component>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import ImportOptions from '@/components/case-management/ImportOptions.vue';
import FileUploader from '@/components/case-management/FileUploader.vue';
import DataValidator from '@/components/case-management/DataValidator.vue';
import ImportProgress from '@/components/case-management/ImportProgress.vue';
import ImportComplete from '@/components/case-management/ImportComplete.vue';
import { useCaseStore } from '@/stores/caseStore';

// Router and store
const router = useRouter();
const caseStore = useCaseStore();

// State
const currentStep = ref(0);
const importData = reactive({
  importMethod: 'file', // 'file' or 'api'
  file: null,
  fileType: 'csv',
  apiConfig: {
    url: '',
    username: '',
    password: '',
    format: 'json'
  },
  validationResults: {
    total: 0,
    valid: 0,
    invalid: 0,
    errors: []
  },
  importResults: {
    total: 0,
    success: 0,
    failed: 0,
    log: []
  }
});

// Components for each step
const stepComponents = [
  ImportOptions,
  FileUploader,
  DataValidator,
  ImportProgress,
  ImportComplete
];

// Current component to render
const currentComponent = computed(() => stepComponents[currentStep.value]);

// Handle next step
const handleNext = (stepData) => {
  // Save data from current step
  switch (currentStep.value) {
    case 0:
      importData.importMethod = stepData.importMethod;
      importData.fileType = stepData.fileType;
      break;
    case 1:
      if (importData.importMethod === 'file') {
        importData.file = stepData.file;
      } else {
        importData.apiConfig = stepData.apiConfig;
      }
      break;
    case 2:
      importData.validationResults = stepData.validationResults;
      break;
    case 3:
      importData.importResults = stepData.importResults;
      break;
  }
  
  currentStep.value++;
};

// Handle previous step
const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// Handle import complete
const handleComplete = () => {
  if (importData.importResults.success > 0) {
    ElMessage.success(`成功导入 ${importData.importResults.success} 条病例数据`);
  }
  
  // Offer options to user
  if (confirm('导入完成，是否返回病例列表？')) {
    router.push('/cases');
  } else {
    // Reset for new import
    currentStep.value = 0;
    Object.assign(importData, {
      importMethod: 'file',
      file: null,
      validationResults: { total: 0, valid: 0, invalid: 0, errors: [] },
      importResults: { total: 0, success: 0, failed: 0, log: [] }
    });
  }
};
</script>

<style scoped>
.import-cases-page {
  padding: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
}

.import-steps {
  margin-bottom: 40px;
}

.import-content {
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>