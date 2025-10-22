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
}