import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IntelligentVisionAI } from '../utils/intelligentVisionAI'; // 改为导入视觉AI
import { DiagnosisResult, DiagnosisFinding, AIDiagnosisResult, ImageAnalysisRequest } from '../types';
import { SmartMedicalAI } from '../utils/smartMedicalAI'; // 改为导入智能AI

// AI服务地址
const AI_SERVICE_URL = 'http://localhost:8000/api';

interface AIDiagnosisState {
  currentResult: DiagnosisResult | AIDiagnosisResult | null;
  isLoading: boolean;
  error: string | null;
  analysisProgress: number;
  originalImage: string | null;
  useBackendAI: boolean;
}

// 类型守卫函数
function isAIDiagnosisResult(result: any): result is AIDiagnosisResult {
  return result && Array.isArray(result.findings) && typeof result.overallConfidence === 'number';
}

function isDiagnosisResult(result: any): result is DiagnosisResult {
  return result && Array.isArray(result.findings) && typeof result.confidence === 'number';
}

export const useAIDiagnosisStore = defineStore('aiDiagnosis', {
  state: (): AIDiagnosisState => ({
    currentResult: null,
    isLoading: false,
    error: null,
    analysisProgress: 0,
    originalImage: null,
    useBackendAI: true,
  }),

  actions: {
    async analyzeMedicalImage(imageFile: File, imageType: string = 'xray', useBackend: boolean = true) {
      this.isLoading = true;
      this.error = null;
      this.analysisProgress = 0;
      this.useBackendAI = useBackend;

      // 保存原始图像预览
      this.originalImage = await this.fileToBase64(imageFile);

      // 模拟进度更新
      const progressInterval = setInterval(() => {
        if (this.analysisProgress < 90) {
          this.analysisProgress += 10;
        }
      }, 300);

      try {
        if (useBackend) {
          // 使用真实AI服务
          await this.analyzeWithRealAI(imageFile, imageType);
        } else {
          // 使用原有的服务
          await this.analyzeWithLegacyAPI(imageFile);
        }

        this.analysisProgress = 100;
        console.log('AI分析完成:', this.currentResult);

      } catch (error) {
        console.error('AI诊断错误:', error);
        this.error = error instanceof Error ? error.message : 'AI分析服务暂时不可用';
      } finally {
        clearInterval(progressInterval);
        this.isLoading = false;
      }
    },

    // 使用真实AI服务
    async analyzeWithRealAI(imageFile: File, imageType: string) {
      const visionAI = new IntelligentVisionAI();

      const request: ImageAnalysisRequest = {
        imageId: `img_${Date.now()}`,
        imageFile: imageFile,
        analysisType: 'musculoskeletal',
        priority: 'normal'
      };

      this.currentResult = await visionAI.analyzeImage(request);
    },

    // 原有的API调用（保持兼容）
    async analyzeWithLegacyAPI(imageFile: File) {
      const formData = new FormData();
      formData.append('file', imageFile);

      console.log('开始调用AI分析服务...');

      try {
        const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`AI服务错误: ${response.status}`);
        }

        const result = await response.json();
        this.currentResult = result.success ? result.data : result;
      } catch (error) {
        // 如果真实API失败，回退到真实AI服务
        console.warn('真实AI服务不可用，使用本地AI分析');
        await this.analyzeWithRealAI(imageFile, 'xray');
      }
    },

    async fileToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    },

    clearResult() {
      this.currentResult = null;
      this.originalImage = null;
      this.analysisProgress = 0;
      this.error = null;
    },

    debugStore() {
      console.log('🔍 Store调试信息:');
      console.log('currentResult:', this.currentResult);
      console.log('hasResult:', this.hasResult);
      console.log('isLoading:', this.isLoading);
      console.log('analysisProgress:', this.analysisProgress);
      console.log('useBackendAI:', this.useBackendAI);
    },

    setUseBackendAI(useBackend: boolean) {
      this.useBackendAI = useBackend;
    }
  },

  getters: {
    hasResult: (state) => state.currentResult !== null,

    mainFindings: (state) => {
      if (!state.currentResult) return [];

      if (isAIDiagnosisResult(state.currentResult)) {
        return state.currentResult.findings;
      } else if (isDiagnosisResult(state.currentResult)) {
        return state.currentResult.findings;
      }

      return [];
    },

    diagnosisConfidence: (state) => {
      if (!state.currentResult) return '0%';

      if (isAIDiagnosisResult(state.currentResult)) {
        const confidence = Number(state.currentResult.overallConfidence) || 0;
        return confidence + '%';
      } else if (isDiagnosisResult(state.currentResult)) {
        const confidence = Number(state.currentResult.confidence) || 0;
        return (confidence * 100).toFixed(1) + '%';
      }

      return '0%';
    },

    resultType: (state) => {
      if (!state.currentResult) return 'none';
      if (isAIDiagnosisResult(state.currentResult)) return 'ai-diagnosis';
      if (isDiagnosisResult(state.currentResult)) return 'diagnosis';
      return 'unknown';
    },

    suggestions: (state) => {
      if (!state.currentResult) return [];

      if (isAIDiagnosisResult(state.currentResult)) {
        return state.currentResult.suggestions || [];
      } else if (isDiagnosisResult(state.currentResult)) {
        return state.currentResult.recommendations || [];
      }

      return [];
    }
  }
});

// 导出类型以在组件中使用
export type AIDiagnosisStore = ReturnType<typeof useAIDiagnosisStore>;