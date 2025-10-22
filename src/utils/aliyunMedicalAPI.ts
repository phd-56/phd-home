// src/utils/aliyunMedicalAPI.ts
export class AliyunMedicalAPI {
  private static readonly ENDPOINT = 'https://mediv.cn-shanghai.aliyuncs.com';
  private static readonly API_VERSION = '2020-09-10';

  // 配置您的阿里云访问密钥（从环境变量获取）
  private static getAccessKey() {
    return {
      accessKeyId: import.meta.env.VITE_ALIYUN_ACCESS_KEY_ID || '',
      accessKeySecret: import.meta.env.VITE_ALIYUN_ACCESS_KEY_SECRET || '',
    };
  }

  /**
   * 分析X光影像
   * @param imageFile 图像文件
   * @returns AI分析结果
   */
  static async analyzeXRay(imageFile: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      // 这里简化了阿里云实际的签名流程，实际需要更复杂的签名计算
      const response = await fetch(`${this.ENDPOINT}/api/v1/xray/analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.generateSignature()}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`阿里云API请求失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('阿里云医疗API调用错误:', error);
      throw error;
    }
  }

  private static generateSignature(): string {
    // 实际的阿里云签名生成逻辑（简化版）
    // 真实场景需要按照阿里云文档实现完整的签名算法
    return 'simulated-signature-for-demo';
  }

  /**
   * 转换阿里云结果为标准格式
   */
  static convertToStandardFormat(aliyunResult: any) {
    const findings = aliyunResult.lesions?.map((lesion: any) => ({
      description: lesion.description,
      location: lesion.location || '未指定',
      confidence: lesion.confidence * 100, // 转换为百分比
      clinicalSignificance: this.mapClinicalSignificance(lesion.type)
    })) || [];

    return {
      findings,
      qualityMetrics: {
        imageQuality: aliyunResult.image_quality || '良好',
        analysisConfidence: aliyunResult.overall_confidence || 0
      }
    };
  }

  private static mapClinicalSignificance(lesionType: string): string {
    const significanceMap: Record<string, string> = {
      'fracture': '明确骨折，需急诊处理',
      'degeneration': '退行性关节病变',
      'osteoporosis': '骨质疏松表现',
      'normal': '未见明显异常'
    };
    return significanceMap[lesionType] || '请结合临床进一步检查';
  }
}