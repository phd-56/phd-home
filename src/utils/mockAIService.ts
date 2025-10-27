// src/utils/mockAIService.ts
export interface MockAnalysisResult {
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

/**
 * 模拟AI分析服务
 */
export const mockAIAnalysis = async (imageFile: File): Promise<MockAnalysisResult> => {
  console.log('模拟AI分析:', imageFile.name);

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 基于您提供的病例生成模拟数据
  return {
    findings: [
      {
        description: "胫骨平台压缩性骨折，关节面塌陷>3mm",
        location: "胫骨平台",
        confidence: 92.5,
        clinicalSignificance: "明确骨折，需急诊处理"
      },
      {
        description: "关节间隙不对称狭窄，股骨眼及胫骨平台骨质增生硬化",
        location: "膝关节",
        confidence: 78.3,
        clinicalSignificance: "退行性关节病变，Kellgren-Lawrence分级2级"
      },
      {
        description: "多发椎体楔形变，以T12、L1为著，骨小梁稀疏",
        location: "脊柱",
        confidence: 85.7,
        clinicalSignificance: "骨质疏松，T值-2.5"
      }
    ],
    qualityMetrics: {
      imageQuality: "良好",
      analysisConfidence: 85.5
    }
  };
};

// 默认导出
export default mockAIAnalysis;