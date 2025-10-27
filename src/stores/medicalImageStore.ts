import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 简化的类型定义
interface Annotation {
  id: string;
  type: string;
  [key: string]: any;
}

interface DetectedDisease {
  name: string;
  confidence: number;
  [key: string]: any;
}

interface AIAnalysis {
  id: string;
  imageId: string;
  diseases: DetectedDisease[];
  [key: string]: any;
}

interface MedicalImage {
  id: string;
  patientId: string;
  type: string;
  url: string;
  annotations: Annotation[];
  [key: string]: any;
}

export const useMedicalImageStore = defineStore('medicalImage', () => {
  const images = ref<MedicalImage[]>([]);
  const currentImage = ref<MedicalImage | null>(null);
  const isAnalyzing = ref(false);
  const analysisProgress = ref(0);

  // 获取患者影像
  const getPatientImages = computed(() => (patientId: string) => {
    return images.value.filter(img => img.patientId === patientId);
  });

  // 添加标注
  const addAnnotation = (imageId: string, annotation: Omit<Annotation, 'id' | 'createdAt'>) => {
    const image = images.value.find(img => img.id === imageId);
    if (image) {
      const newAnnotation: Annotation = {
        ...annotation,
        id: generateId(),
        createdAt: new Date().toISOString(),
        type: 'annotation'
      };
      image.annotations.push(newAnnotation);
    }
  };

  // 删除标注
  const removeAnnotation = (imageId: string, annotationId: string) => {
    const image = images.value.find(img => img.id === imageId);
    if (image) {
      image.annotations = image.annotations.filter(anno => anno.id !== annotationId);
    }
  };

  // AI分析影像
  const analyzeImage = async (imageId: string): Promise<AIAnalysis> => {
    isAnalyzing.value = true;
    analysisProgress.value = 0;

    try {
      // 模拟分析过程
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        analysisProgress.value = i;
      }

      // 模拟AI分析结果
      const mockAnalysis: AIAnalysis = {
        id: generateId(),
        imageId,
        diseases: generateMockDiseases(),
        lesions: generateMockLesions(),
        confidence: 0.87,
        status: 'completed',
        createdAt: new Date().toISOString(),
        analysisTime: 3.2,
        explanation: generateMockExplanation()
      };

      // 更新影像的分析结果
      const image = images.value.find(img => img.id === imageId);
      if (image) {
        image.aiAnalysis = mockAnalysis;
      }

      return mockAnalysis;
    } finally {
      isAnalyzing.value = false;
      analysisProgress.value = 0;
    }
  };

  // 辅助函数
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const generateMockDiseases = (): DetectedDisease[] => [
    {
      name: '骨关节炎',
      confidence: 0.92,
      severity: 'moderate',
      description: '关节软骨退行性改变，伴有关节间隙狭窄',
      treatmentSuggestions: ['物理治疗', '非甾体抗炎药', '体重管理']
    },
    {
      name: '骨质疏松',
      confidence: 0.78,
      severity: 'mild',
      description: '骨密度降低，骨小梁变细',
      treatmentSuggestions: ['钙剂补充', '维生素D', '负重运动']
    }
  ];

  const generateMockLesions = () => [
    // 模拟病灶数据
  ];

  const generateMockExplanation = () => ({
    featureImportance: [
      { feature: '关节间隙', importance: 0.85, description: '关节间隙明显狭窄' },
      { feature: '骨赘形成', importance: 0.76, description: '关节边缘骨赘' },
      { feature: '软骨下骨硬化', importance: 0.68, description: '软骨下骨密度增高' }
    ],
    decisionFactors: [
      '关节间隙不对称狭窄',
      '骨赘形成明显',
      '患者年龄相关性改变'
    ]
  });

  return {
    images,
    currentImage,
    isAnalyzing,
    analysisProgress,
    getPatientImages,
    addAnnotation,
    removeAnnotation,
    analyzeImage
  };
});