// 统一的诊断结果类型
export interface UnifiedDiagnosisResult {
  id: string;
  imageId?: string;
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
  location: string;
  clinicalSignificance: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  category: 'bone' | 'joint' | 'soft_tissue' | 'other';
  boundingBox?: number[];
}

// 旧版本的兼容类型
export interface LegacyDiagnosisResult {
  diagnosis: string;
  confidence: number;
  findings: LegacyFinding[];
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
  probabilities: Record<string, number>;
  regions: any[];
  differential_diagnosis: string[];
  clinical_correlation: string;
}

export interface LegacyFinding {
  region: string;
  description: string;
  characteristic: string;
}