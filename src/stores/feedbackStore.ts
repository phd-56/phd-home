import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

// 从类型定义文件导入类型
import type { FeedbackItem, FeedbackDetail, FeedbackStatus, FeedbackType } from '@/types/feedback';

// 反馈数据类型定义
interface Feedback extends Omit<FeedbackItem, 'feedbackType' | 'status'> {
  rating: number;
  tags: string[];
  comment: string;
  isPublic: boolean;
  timestamp: string;
  status: 'pending' | 'processed';
  processNote?: string;
}

// 优化问题类型定义
interface OptimizationIssue {
  id: string;
  type: string;
  description: string;
  severity: number;
  feedbackCount: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  createdAt: string;
}

// 优化计划类型定义
interface OptimizationPlan {
  id: string;
  modelId: string;
  modelName: string;
  title: string;
  priority: string;
  type: string[];
  status: string;
  targetVersion: string;
  deadline: string;
  responsible: string;
  feedbackCount?: number;
  description?: string;
  acceptanceCriteria?: string;
  createdAt?: string;
}

// 性能指标类型定义
interface PerformanceMetrics {
  accuracy: number;
  accuracyTrend: number;
  adoptionRate: number;
  adoptionRateTrend: number;
  satisfaction: number;
  satisfactionTrend: number;
  resolutionRate: number;
  resolutionRateTrend: number;
}

export const useFeedbackStore = defineStore('feedback', () => {
  // 状态
  const feedbackHistory = ref<Feedback[]>([]);
  const optimizationIssues = ref<OptimizationIssue[]>([]);
  const optimizationPlans = ref<OptimizationPlan[]>([]);
  const performanceMetrics = ref<PerformanceMetrics>({
    accuracy: 89.5,
    accuracyTrend: 1.2,
    adoptionRate: 76.3,
    adoptionRateTrend: 3.5,
    satisfaction: 4.2,
    satisfactionTrend: 0.3,
    resolutionRate: 92.1,
    resolutionRateTrend: 2.8
  });
  const isLoading = ref(false);
  const lastAnalysisTime = ref('');

  // 模拟数据 - 用于开发环境
  const mockFeedbackData: Feedback[] = [
    {
      id: '1',
      caseId: 'CASE-20231001-001',
      diagnosisId: 'DIAG-20231001-001',
      rating: 4,
      tags: ['diagnosis_accuracy', 'treatment_rationality'],
      comment: '诊断准确，治疗建议合理，但对并发症的考虑可以更全面。',
      timestamp: '2023-10-01 14:30:00',
      status: 'processed',
      isPublic: true,
      processNote: '已纳入模型优化计划，增强并发症预测能力',
      doctorId: 'DOC-001',
      doctorName: '张医生',
      submittedAt: '2023-10-01 14:30:00',
      processedAt: '2023-10-02 09:00:00',
      imageCount: 0
    },
    {
      id: '2',
      caseId: 'CASE-20231002-002',
      diagnosisId: 'DIAG-20231002-002',
      rating: 3,
      tags: ['case_analysis_depth', 'user_experience'],
      comment: '病例分析深度一般，界面操作略显复杂，希望能简化流程。',
      timestamp: '2023-10-02 09:15:00',
      status: 'pending',
      isPublic: false,
      doctorId: 'DOC-002',
      doctorName: '李医生',
      submittedAt: '2023-10-02 09:15:00',
      imageCount: 1
    }
  ];

  // Getters
  const pendingFeedbackCount = computed(() => {
    return feedbackHistory.value.filter(f => f.status === 'pending').length;
  });

  const feedbackStatsByTag = computed(() => {
    const stats: Record<string, number> = {};
    feedbackHistory.value.forEach(feedback => {
      feedback.tags.forEach(tag => {
        stats[tag] = (stats[tag] || 0) + 1;
      });
    });
    return stats;
  });

  // 获取标签中文名称的辅助函数
  const getTagName = (tag: string): string => {
    const tagMap: Record<string, string> = {
      'diagnosis_accuracy': '诊断准确性',
      'treatment_rationality': '治疗建议合理性',
      'case_analysis_depth': '病例分析深度',
      'user_experience': '用户体验',
      'interface_design': '界面设计',
      'other': '其他'
    };
    return tagMap[tag] || tag;
  };

  // Actions
  const submitFeedback = async (feedbackData: any) => {
    isLoading.value = true;
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 创建新的反馈对象
      const newFeedback: Feedback = {
        id: `feedback-${Date.now()}`,
        caseId: feedbackData.caseId,
        diagnosisId: feedbackData.diagnosisId,
        rating: feedbackData.rating,
        tags: feedbackData.tags,
        comment: feedbackData.comment,
        isPublic: feedbackData.isPublic,
        timestamp: new Date().toISOString(),
        status: 'pending',
        doctorId: 'DOC-001', // 实际应从用户状态获取
        doctorName: '当前医生',
        submittedAt: new Date().toLocaleString(),
        imageCount: feedbackData.files?.length || 0
      };
      
      feedbackHistory.value.unshift(newFeedback);
      return newFeedback;
    } catch (error) {
      console.error('提交反馈失败:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchFeedbackHistory = async () => {
    isLoading.value = true;
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      feedbackHistory.value = [...mockFeedbackData];
    } catch (error) {
      console.error('获取反馈历史失败:', error);
      // 失败时使用模拟数据
      feedbackHistory.value = [...mockFeedbackData];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchOptimizationIssues = async () => {
    isLoading.value = true;
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 600));
      
      optimizationIssues.value = [
        {
          id: 'issue-001',
          type: 'diagnosis_accuracy',
          description: '提高小尺寸结节检测准确率',
          severity: 4,
          feedbackCount: 15,
          priority: 'high',
          status: 'in_progress',
          createdAt: '2023-09-20 10:00:00'
        },
        {
          id: 'issue-002',
          type: 'treatment_rationality',
          description: '优化治疗方案建议的个性化程度',
          severity: 3,
          feedbackCount: 8,
          priority: 'medium',
          status: 'pending',
          createdAt: '2023-09-25 14:30:00'
        }
      ];
    } catch (error) {
      console.error('获取优化问题列表失败:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchOptimizationPlans = async () => {
    isLoading.value = true;
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟优化计划数据
      optimizationPlans.value = [
        {
          id: 'OPT-001',
          modelId: 'lung-cancer',
          modelName: '肺癌筛查AI模型',
          title: '优化小尺寸肺结节检测算法',
          priority: 'p1',
          type: ['algorithm', 'data'],
          status: 'planning',
          targetVersion: 'v2.2.0',
          deadline: '2023-11-30',
          responsible: 'dev-001',
          feedbackCount: 15
        },
        {
          id: 'OPT-002',
          modelId: 'chest-xray',
          modelName: '胸部X光多病种模型',
          title: '提升肺炎识别准确率',
          priority: 'p2',
          type: ['algorithm', 'hyperparameter'],
          status: 'developing',
          targetVersion: 'v1.5.0',
          deadline: '2023-11-15',
          responsible: 'dev-002',
          feedbackCount: 8
        },
        {
          id: 'OPT-003',
          modelId: 'ct-brain',
          modelName: '脑部CT分析模型',
          title: '优化脑肿瘤分类算法',
          priority: 'p3',
          type: ['architecture', 'data'],
          status: 'testing',
          targetVersion: 'v3.0.0',
          deadline: '2023-12-10',
          responsible: 'dev-003',
          feedbackCount: 12
        },
        {
          id: 'OPT-004',
          modelId: 'lung-cancer',
          modelName: '肺癌筛查AI模型',
          title: '改进假阳性过滤机制',
          priority: 'p2',
          type: ['algorithm'],
          status: 'released',
          targetVersion: 'v2.1.0',
          deadline: '2023-10-20',
          responsible: 'dev-001',
          feedbackCount: 10
        },
        {
          id: 'OPT-005',
          modelId: 'mri-liver',
          modelName: '肝脏MRI评估模型',
          title: '增强肝硬化分期能力',
          priority: 'p1',
          type: ['data', 'algorithm'],
          status: 'planning',
          targetVersion: 'v1.2.0',
          deadline: '2023-12-20',
          responsible: 'dev-004',
          feedbackCount: 6
        }
      ];
    } catch (error) {
      console.error('获取优化计划失败:', error);
      // 失败时使用模拟数据
      optimizationPlans.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchPerformanceMetrics = async (version?: string, dateRange?: string[]) => {
    isLoading.value = true;
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 根据版本或日期范围调整指标值（模拟）
      if (version === 'v2.1.0') {
        performanceMetrics.value = {
          accuracy: 87.2,
          accuracyTrend: 0.8,
          adoptionRate: 72.5,
          adoptionRateTrend: 2.1,
          satisfaction: 4.0,
          satisfactionTrend: 0.2,
          resolutionRate: 89.3,
          resolutionRateTrend: 1.5
        };
      }
    } catch (error) {
      console.error('获取性能指标失败:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const analyzeFeedbackData = async () => {
    isLoading.value = true;
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // 分析结果
      const analysisResult = {
        issues: optimizationIssues.value,
        summary: {
          totalFeedback: feedbackHistory.value.length,
          averageRating: feedbackHistory.value.length > 0 
            ? feedbackHistory.value.reduce((sum, f) => sum + f.rating, 0) / feedbackHistory.value.length
            : 0,
          topIssues: ['诊断准确性', '病例分析深度', '治疗建议合理性']
        }
      };
      
      lastAnalysisTime.value = new Date().toISOString();
      return analysisResult;
    } catch (error) {
      console.error('分析反馈数据失败:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const handleFeedback = async (feedbackId: string, processNote: string) => {
    isLoading.value = true;
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = feedbackHistory.value.findIndex(f => f.id === feedbackId);
      if (index !== -1) {
        feedbackHistory.value[index] = {
          ...feedbackHistory.value[index],
          status: 'processed' as const,
          processNote,
          processedAt: new Date().toLocaleString()
        };
        return feedbackHistory.value[index];
      }
      
      throw new Error('反馈不存在');
    } catch (error) {
      console.error('处理反馈失败:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const addToOptimizationQueue = async (issueId: string) => {
    isLoading.value = true;
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const issueIndex = optimizationIssues.value.findIndex(i => i.id === issueId);
      if (issueIndex !== -1) {
        optimizationIssues.value[issueIndex].status = 'in_progress';
      }
      
      return { success: true, message: '已成功加入优化队列' };
    } catch (error) {
      console.error('加入优化队列失败:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    feedbackHistory,
    optimizationIssues,
    optimizationPlans,
    performanceMetrics,
    isLoading,
    lastAnalysisTime,
    pendingFeedbackCount,
    feedbackStatsByTag,
    getTagName,
    submitFeedback,
    fetchFeedbackHistory,
    fetchOptimizationPlans,
    fetchOptimizationIssues,
    fetchPerformanceMetrics,
    analyzeFeedbackData,
    handleFeedback,
    addToOptimizationQueue
  };
});