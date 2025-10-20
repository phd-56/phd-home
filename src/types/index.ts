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

// 病例基本信息接口
interface Case {
  id: string;                  // 病例唯一标识
  patientId: string;           // 关联患者ID
  caseNumber: string;          // 病例编号(自动生成)
  admissionDate: Date;         // 就诊日期
  dischargeDate?: Date;        // 出院日期(可选)
  diagnosis: Diagnosis[];      // 诊断信息数组
  treatmentPlan: Treatment[];  // 治疗方案数组
  status: 'active' | 'closed' | 'archived'; // 病例状态
  createdBy: string;           // 创建医生ID
  createdAt: Date;             // 创建时间
  updatedAt: Date;             // 更新时间
  documents: Document[];       // 相关文档列表
  images: ImageReference[];    // 关联影像引用
}

// 诊断信息接口
interface Diagnosis {
  id: string;
  diseaseCode: string;         // 疾病编码
  diseaseName: string;         // 疾病名称
  diagnosisDate: Date;         // 诊断日期
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
  startDate: Date;             // 开始日期
  endDate?: Date;              // 结束日期(可选)
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
  uploadedAt: Date;            // 上传时间
  uploadedBy: string;          // 上传者
}