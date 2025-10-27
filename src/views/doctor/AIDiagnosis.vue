<template>
  <div class="ai-diagnosis-page">
    <h1>AI 辅助诊断</h1>
    <p>此页面将集成 YOLO 模型进行图像分析。</p>
    <!-- YOLO 分析结果将显示在这里 -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAIDiagnosisStore } from '@/stores/aiDiagnosisStore';
//import { Loading } from '@element-plus/icons-vue';

const router = useRouter();
const store = useAIDiagnosisStore();

const isLoading = computed(() => store.isLoading);
const error = computed(() => store.error);
const hasResult = computed(() => store.hasResult);
const currentResult = computed(() => store.currentResult);
const originalImage = computed(() => store.originalImage);
const mainFindings = computed(() => store.mainFindings);
const diagnosisConfidence = computed(() => store.diagnosisConfidence);

const goBack = () => {
  router.back();
};

const goToUpload = () => {
  router.push({ name: 'doctor.imageProcessing' });
};

const getFindingStyle = (finding: any) => {
  if (!finding.box) return {};
  const [x, y, width, height] = finding.box;
  return {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    width: `${width * 100}%`,
    height: `${height * 100}%`,
  };
};
</script>

<style scoped>
.ai-diagnosis-page {
  padding: 20px;
}
.loading-container, .error-container, .no-result-container {
  text-align: center;
  margin-top: 50px;
}
.results-container h1 {
  text-align: center;
  margin-bottom: 20px;
}
.main-content {
  display: flex;
  gap: 20px;
}
.image-container {
  position: relative;
  max-width: 60%;
}
.image-container img {
  max-width: 100%;
  height: auto;
}
.finding-box {
  position: absolute;
  border: 2px solid red;
  color: red;
  font-size: 12px;
  background-color: rgba(255, 0, 0, 0.2);
}
.details-container {
  flex-grow: 1;
}
</style>