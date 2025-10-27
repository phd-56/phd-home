/**
 * 反馈与优化模块类型定义
 * 定义反馈数据、优化计划和相关统计信息的类型
 */

/**
 * 反馈类型枚举
 */
export type FeedbackType = 'accuracy' | 'detection' | 'report' | 'system' | 'other';

/**
 * 反馈状态枚举
 */
export type FeedbackStatus = 'pending' | 'processing' | 'resolved' | 'rejected';

/**
 * 优化优先级枚举
 */
export type OptimizationPriority = 'p0' | 'p1' | 'p2' | 'p3';

/**
 * 优化状态枚举
 */
export type OptimizationStatus = 'pending' | 'planning' | 'developing' | 'testing' | 'released' | 'cancelled';

/**
 * 优化类型枚举
 */
export type OptimizationType = 'algorithm' | 'data' | 'architecture' | 'hyperparameter';

/**
 * 反馈附件类型
 */
export interface FeedbackAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file';
  size: number;
  uploadedAt: string;
}

/**
 * 医生反馈列表项类型
 */
export interface FeedbackItem {
  /** 反馈ID */
  id: string;
  /** 病例ID */
  caseId: string;
  /** 反馈类型 */
  feedbackType: FeedbackType;
  /** 反馈内容 */
  content: string;
  /** 反馈状态 */
  status: FeedbackStatus;
  /** 提交时间 */
  submittedAt: string;
  /** 处理时间 */
  processedAt?: string;
  /** 提交医生ID */
  doctorId: string;
  /** 提交医生姓名 */
  doctorName: string;
  /** 关联图片数量 */
  imageCount: number;
}

/**
 * 反馈详情类型
 */
export interface FeedbackDetail extends FeedbackItem {
  /** 反馈附件列表 */
  attachments?: FeedbackAttachment[];
  /** 处理人信息 */
  processedBy?: {
    id: string;
    name: string;
    role: string;
  };
  /** 处理意见 */
  processNote?: string;
  /** 关联的优化计划 */
  optimizationPlan?: {
    id: string;
    content: string;
    targetVersion?: string;
    status: OptimizationStatus;
  };
}

/**
 * 反馈表单数据类型
 */
export interface FeedbackFormData {
  /** 病例ID */
  caseId: string;
  /** 反馈类型 */
  feedbackType: FeedbackType;
  /** 反馈内容 */
  content: string;
  /** 上传的图片文件 */
  images?: File[];
}

/**
 * 模型性能指标类型
 */
export interface ModelPerformanceMetric {
  /** 指标名称 */
  name: string;
  /** 当前值 */
  currentValue: number | string;
  /** 上期值 */
  previousValue: number | string;
  /** 变化量 */
  change: number;
  /** 目标值 */
  target: number | string;
  /** 状态 */
  status: '优秀' | '正常' | '警告' | '异常';
  /** 指标描述 */
  description: string;
}

/**
 * 模型版本信息类型
 */
export interface ModelVersion {
  /** 版本ID */
  id: string;
  /** 版本名称 */
  name: string;
  /** 发布时间 */
  releaseTime: string;
  /** 是否为当前生产版本 */
  isCurrent: boolean;
  /** 优化点描述 */
  optimizations: string[];
  /** 性能指标 */
  metrics: Record<string, number>;
}

/**
 * 优化计划类型
 */
export interface OptimizationPlan {
  /** 计划ID */
  id: string;
  /** 模型ID */
  modelId: string;
  /** 模型名称 */
  modelName: string;
  /** 优化标题 */
  title: string;
  /** 优化描述 */
  description: string;
  /** 优先级 */
  priority: OptimizationPriority;
  /** 优化类型 */
  type: OptimizationType[];
  /** 状态 */
  status: OptimizationStatus;
  /** 目标版本 */
  targetVersion: string;
  /** 计划完成时间 */
  deadline: string;
  /** 负责人ID */
  responsible: string;
  /** 负责人姓名 */
  responsibleName: string;
  /** 关联反馈数量 */
  feedbackCount: number;
  /** 关联反馈ID列表 */
  feedbackIds: string[];
  /** 验收标准 */
  acceptanceCriteria: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 优化计划详情类型
 */
export interface OptimizationPlanDetail extends OptimizationPlan {
  /** 关联的反馈详情 */
  feedbacks?: FeedbackDetail[];
  /** 实施步骤 */
  implementationSteps?: {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    assignee: string;
    dueDate: string;
  }[];
  /** 测试结果 */
  testResults?: {
    id: string;
    testDate: string;
    tester: string;
    metrics: Record<string, number>;
    passed: boolean;
    comment: string;
  }[];
}

/**
 * 性能问题预警类型
 */
export interface PerformanceIssue {
  /** 问题ID */
  id: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 严重程度 */
  severity: 'critical' | 'warning';
  /** 发生时间 */
  time: string;
  /** 关联模型 */
  modelId: string;
  /** 关联版本 */
  versionId?: string;
  /** 是否已处理 */
  handled: boolean;
}

/**
 * 反馈统计数据类型
 */
export interface FeedbackStatistics {
  /** 总反馈数量 */
  totalCount: number;
  /** 按类型统计 */
  byType: Record<FeedbackType, number>;
  /** 按状态统计 */
  byStatus: Record<FeedbackStatus, number>;
  /** 平均处理时长(小时) */
  avgProcessTime: number;
  /** 已转化为优化的反馈数量 */
  convertedToOptimization: number;
  /** 月度反馈趋势 */
  monthlyTrend: {
    month: string;
    count: number;
  }[];
}

/**
 * 反馈与优化状态管理类型
 */
export interface FeedbackStoreState {
  /** 反馈列表 */
  feedbackList: FeedbackItem[];
  /** 当前查看的反馈详情 */
  currentFeedback: FeedbackDetail | null;
  /** 反馈列表加载状态 */
  feedbackLoading: boolean;
  /** 反馈统计数据 */
  feedbackStats: FeedbackStatistics | null;
  /** 优化计划列表 */
  optimizationPlans: OptimizationPlan[];
  /** 优化计划加载状态 */
  optimizationLoading: boolean;
  /** 模型版本列表 */
  modelVersions: ModelVersion[];
}