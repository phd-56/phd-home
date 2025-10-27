import {
  UnifiedDiagnosisResult,
  MedicalFinding,
  LegacyDiagnosisResult
} from '../types/diagnosis';

// 将任何诊断结果转换为统一格式
export function adaptDiagnosisResult(result: any): UnifiedDiagnosisResult | null {
  if (!result) return null;

  // 检查是否是新的 AIDiagnosisResult 类型
  if (isAIDiagnosisResult(result)) {
    return convertAIDiagnosisResult(result);
  }

  // 检查是否是旧的 DiagnosisResult 类型
  if (isLegacyDiagnosisResult(result)) {
    return convertLegacyDiagnosisResult(result);
  }

  // 未知类型
  console.warn('未知的诊断结果类型:', result);
  return createDefaultResult();
}

// 类型守卫
function isAIDiagnosisResult(result: any): boolean {
  return result &&
    typeof result.overallConfidence === 'number' &&
    Array.isArray(result.findings) &&
    Array.isArray(result.suggestions);
}

function isLegacyDiagnosisResult(result: any): boolean {
  return result &&
    typeof result.confidence === 'number' &&
    Array.isArray(result.findings) &&
    Array.isArray(result.recommendations);
}

// 转换新的 AIDiagnosisResult
function convertAIDiagnosisResult(result: any): UnifiedDiagnosisResult {
  return {
    id: result.id || `ai_${Date.now()}`,
    imageId: result.imageId,
    findings: result.findings.map((f: any, index: number) => ({
      id: f.id || `finding_${index}`,
      description: f.description || '',
      confidence: Number(f.confidence) || 0,
      location: f.location || '',
      clinicalSignificance: f.clinicalSignificance || '',
      severity: f.severity || 'normal',
      category: f.category || 'bone',
      boundingBox: f.boundingBox
    })),
    suggestions: result.suggestions || [],
    overallConfidence: Number(result.overallConfidence) || 0,
    analysisTime: result.analysisTime || '',
    status: result.status || 'completed',
    processed: result.processed !== false,
    timestamp: result.timestamp || new Date().toISOString()
  };
}

// 转换旧的 DiagnosisResult
function convertLegacyDiagnosisResult(result: any): UnifiedDiagnosisResult {
  return {
    id: `legacy_${Date.now()}`,
    findings: (result.findings || []).map((f: any, index: number) => ({
      id: `legacy_finding_${index}`,
      description: f.description || f.characteristic || '',
      confidence: (result.confidence || 0) * 100, // 转换为百分比
      location: f.location || f.region || '',
      clinicalSignificance: '',
      severity: mapLegacySeverity(result.severity),
      category: 'bone'
    })),
    suggestions: result.recommendations || [],
    overallConfidence: (result.confidence || 0) * 100, // 转换为百分比
    analysisTime: '',
    status: 'completed',
    processed: true,
    timestamp: new Date().toISOString()
  };
}

function mapLegacySeverity(severity: string): 'normal' | 'mild' | 'moderate' | 'severe' {
  const map: Record<string, 'normal' | 'mild' | 'moderate' | 'severe'> = {
    low: 'mild',
    medium: 'moderate',
    high: 'severe'
  };
  return map[severity] || 'normal';
}

function createDefaultResult(): UnifiedDiagnosisResult {
  return {
    id: `default_${Date.now()}`,
    findings: [],
    suggestions: ['暂无分析结果'],
    overallConfidence: 0,
    analysisTime: '',
    status: 'completed',
    processed: true,
    timestamp: new Date().toISOString()
  };
}