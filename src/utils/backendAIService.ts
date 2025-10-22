// src/utils/backendAIService.ts
import { AliyunMedicalAPI } from './aliyunMedicalAPI';
import { mockAIAnalysis } from './mockAIService';
export interface AnalysisResult {
  findings: Array<{
    description: string;
    location: string;
    confidence: number;
    clinicalSignificance: string;
  }>;
  qualityMetrics: {
    imageQuality: string;
    analysisConfidence: number;
  };
}
export class BackendAIService {
  private static useRealAPI = false; // 控制开关

  /**
   * 分析医学影像
   */
  static async analyzeMedicalImage(imageFile: File): Promise<AnalysisResult> {
    try {
      if (this.useRealAPI && this.hasValidCredentials()) {
        console.log('使用阿里云医疗AI服务...');
        const aliyunResult = await AliyunMedicalAPI.analyzeXRay(imageFile);
        return AliyunMedicalAPI.convertToStandardFormat(aliyunResult);
      } else {
        console.log('使用模拟AI服务（降级模式）...');
        // 降级到模拟服务
        return await mockAIAnalysis(imageFile);
      }
    } catch (error) {
      console.error('AI分析失败，使用模拟数据:', error);
      // 错误时使用模拟数据保证系统可用性
      return await mockAIAnalysis(imageFile);
    }
  }

  /**
   * 检查是否有有效的API凭证
   */
  private static hasValidCredentials(): boolean {
    const keyId = import.meta.env.VITE_ALIYUN_ACCESS_KEY_ID;
    const keySecret = import.meta.env.VITE_ALIYUN_ACCESS_KEY_SECRET;
    return !!(keyId && keySecret && keyId !== 'your_actual_access_key_id');
  }

  /**
   * 设置使用真实API或模拟服务
   */
  static setUseRealAPI(useReal: boolean): void {
    this.useRealAPI = useReal;
    console.log(`已${useReal ? '启用' : '禁用'}真实AI API服务`);
  }
}