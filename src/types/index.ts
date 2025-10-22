export interface User {
  id: number
  username: string
  email: string
  role: 'patient' | 'doctor' | 'admin'
  avatar?: string
  fullName?: string
  medicalRecord?: string
  hospital?: string
  createdAt: string
}

export interface LoginForm {
  username: string
  password: string
  role: 'patient' | 'doctor' | 'admin'
  rememberMe?: boolean
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  role: 'patient' | 'doctor' | 'admin'
  fullName?: string
  hospital?: string
  medicalRecord?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

<<<<<<< Updated upstream
// 影像引用接口
interface ImageReference {
  id: string;                  // 影像唯一标识
  fileUrl: string;             // 影像文件URL
  type: 'dicom' | 'jpg' | 'png'; // 影像类型
  thumbnailUrl?: string;       // 缩略图URL
  uploadedAt: string;          // 上传时间
  seriesId?: string;           // 系列ID（用于DICOM序列）
}

// 病例基本信息接口
interface Case {
  id: string;                  // 病例唯一标识
  patientId: string;           // 关联患者ID
  caseNumber: string;          // 病例编号(自动生成)
  admissionDate: string;       // 就诊日期（ISO字符串格式）
  dischargeDate?: string;      // 出院日期(可选，ISO字符串格式)
  diagnosis: Diagnosis[];      // 诊断信息数组
  treatmentPlan: Treatment[];  // 治疗方案数组
  status: 'active' | 'closed' | 'archived'; // 病例状态
  createdBy: string;           // 创建医生ID
  createdAt: string;           // 创建时间（ISO字符串格式）
  updatedAt: string;           // 更新时间（ISO字符串格式）
  documents: Document[];       // 相关文档列表
  images: ImageReference[];    // 关联影像引用
}

// 诊断信息接口
interface Diagnosis {
  id: string;
  diseaseCode: string;         // 疾病编码
  diseaseName: string;         // 疾病名称
  diagnosisDate: string;       // 诊断日期（ISO字符串格式）
  diagnosedBy: string;         // 诊断医生
  description?: string;        // 诊断描述
}

// 治疗方案接口
interface Treatment {
  id: string;
  type: 'medication' | 'procedure' | 'therapy'; // 治疗类型
  name: string;                // 治疗名称
  dosage?: string;             // 剂量(药物治疗)
  frequency?: string;          // 频率
  startDate: string;           // 开始日期（ISO字符串格式）
  endDate?: string;            // 结束日期(可选，ISO字符串格式)
  notes?: string;              // 备注
}

// 文档接口
interface Document {
  id: string;
  name: string;                // 文档名称
  type: 'report' | 'prescription' | 'other'; // 文档类型
  fileUrl: string;             // 文件URL
  fileType: string;            // 文件格式
  fileSize: number;            // 文件大小(字节)
  uploadedAt: string;          // 上传时间（ISO字符串格式）
  uploadedBy: string;          // 上传者
}

// 知识库项类型
export interface KnowledgeItem {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  overview: string
  symptoms: string[]
  diagnosisCriteria: Array<{
    title: string
    description: string
  }>
  treatments: {
    medication: string[]
    physical: string[]
    surgical: string[]
  }
  preventionTips: string[]
  updateTime: string
  viewCount: number
  isFavorite?: boolean
  isNew?: boolean
=======

// 影像相关类型
export interface MedicalImage {
  id: string;
  patientId: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  modality: string; // CT, MRI, X-Ray等
  bodyPart: string;
  imageUrl?: string;
  dicomData?: any;
  annotations: Annotation[];
  aiAnalysis?: AIAnalysis;
}

export interface Annotation {
  id: string;
  imageId: string;
  type: 'rectangle' | 'circle' | 'polygon' | 'point';
  coordinates: number[];
  label: string;
  color: string;
  createdAt: string;
  createdBy: string;
}

export interface AIAnalysis {
  id: string;
  imageId: string;
  diseases: DetectedDisease[];
  lesions: DetectedLesion[];
  confidence: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  analysisTime: number;
  explanation?: ExplanationMap;
}

export interface DetectedDisease {
  name: string;
  confidence: number;
  icdCode?: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  treatmentSuggestions: string[];
}

export interface DetectedLesion {
  id: string;
  type: string;
  confidence: number;
  boundingBox: number[]; // [x, y, width, height]
  area: number;
  characteristics: LesionCharacteristic[];
}

export interface LesionCharacteristic {
  type: string;
  value: string | number;
  confidence: number;
}

export interface ExplanationMap {
  heatmapUrl?: string;
  featureImportance: FeatureImportance[];
  decisionFactors: string[];
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  description: string;
}

// 肌肉骨骼疾病类型
export const MUSCULOSKELETAL_DISEASES = [
  '骨关节炎', '类风湿关节炎', '骨质疏松', '骨折', '椎间盘突出',
  '脊柱侧弯', '肌腱炎', '滑囊炎', '骨坏死', '骨髓炎',
  '骨肿瘤', '韧带损伤', '肌肉拉伤', '关节脱位', '颈椎病'
] as const;

// 在现有类型后添加以下内容

export interface AIDiagnosisResult {
  id: string;
  imageId: string;
  findings: MedicalFinding[];
  suggestions: string[];
  overallConfidence: number;
  analysisTime: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processed: boolean;
  timestamp: string;
}

export interface MedicalFinding {
  id: string;
  description: string;
  confidence: number;
  location?: string;
  clinicalSignificance?: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  category: 'bone' | 'joint' | 'soft_tissue' | 'other';
  boundingBox?: number[]; // [x, y, width, height] for YOLO detection
}

export interface ImageAnalysisRequest {
  imageId: string;
  imageFile: File;
  analysisType: 'musculoskeletal' | 'chest' | 'brain' | 'general';
  priority: 'normal' | 'urgent';
  useYOLO?: boolean; // 是否使用YOLO进行目标检测
}

// 肌肉骨骼特定的发现类型
export interface MusculoskeletalFinding extends MedicalFinding {
  boneDensity?: 'normal' | 'osteopenia' | 'osteoporosis';
  jointSpace?: 'normal' | 'narrowed' | 'widened';
  fractureType?: 'none' | 'hairline' | 'displaced' | 'comminuted';
}

// YOLO检测结果
export interface YOLODetection {
  class: string;
  confidence: number;
  bbox: number[]; // [x, y, width, height]
}

// 在您现有的类型定义后面添加以下内容

// AI诊断相关类型扩展
export interface AIDiagnosisResult {
  id: string;
  imageId: string;
  findings: MedicalFinding[];
  suggestions: string[];
  overallConfidence: number;
  analysisTime: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processed: boolean;
  timestamp: string;
}

export interface MedicalFinding {
  id: string;
  description: string;
  confidence: number;
  location?: string;
  clinicalSignificance?: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  category: 'bone' | 'joint' | 'soft_tissue' | 'other';
  boundingBox?: number[];
}

export interface ImageAnalysisRequest {
  imageId: string;
  imageFile: File;
  analysisType: 'musculoskeletal' | 'chest' | 'brain' | 'general';
  priority: 'normal' | 'urgent';
  useYOLO?: boolean;
}

// 兼容您原有的 DiagnosisResult 类型
export interface DiagnosisResult {
  diagnosis: string;
  confidence: number;
  findings: DiagnosisFinding[];
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
  probabilities: Record<string, number>;
  regions: any[];
  differential_diagnosis: string[];
  clinical_correlation: string;
}

export interface DiagnosisFinding {
  region: string;
  description: string;
  characteristic: string;
>>>>>>> Stashed changes
}