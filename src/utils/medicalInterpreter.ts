// utils/medicalInterpreter.ts
export interface DiagnosisFinding {
  type: string;
  description: string;
  location: string;
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe';
  clinicalSignificance: string;
}

export interface MedicalDiagnosis {
  findings: DiagnosisFinding[];
  overallAssessment: string;
  differentialDiagnosis: string[];
  recommendations: string[];
}

export class MedicalInterpreter {
  interpretAnalysisResults(analysisResult: any, imageType: string): MedicalDiagnosis {
    const findings: DiagnosisFinding[] = [];

    // 分析图像统计特征
    this.analyzeImageStats(analysisResult.imageStats, findings);

    // 分析检测到的区域
    this.analyzeRegions(analysisResult.regions, findings, imageType);

    return {
      findings,
      overallAssessment: this.generateOverallAssessment(findings),
      differentialDiagnosis: this.generateDifferentialDiagnosis(findings, imageType),
      recommendations: this.generateRecommendations(findings, imageType)
    };
  }

  private analyzeImageStats(stats: any, findings: DiagnosisFinding[]): void {
    // 基于整体图像统计的分析
    if (stats.meanIntensity > 180) {
      findings.push({
        type: '整体密度增高',
        description: '图像整体密度偏高，可能提示骨质硬化或技术因素',
        location: '弥漫性',
        confidence: 0.6,
        severity: 'mild',
        clinicalSignificance: '可能为骨质硬化、Paget病或曝光过度'
      });
    }

    if (stats.contrast < 20) {
      findings.push({
        type: '对比度降低',
        description: '图像整体对比度偏低，细节显示欠佳',
        location: '弥漫性',
        confidence: 0.7,
        severity: 'mild',
        clinicalSignificance: '可能影响细微病变的观察'
      });
    }

    if (stats.entropy > 7) {
      findings.push({
        type: '纹理复杂性增加',
        description: '图像纹理复杂度较高，提示结构紊乱',
        location: '弥漫性',
        confidence: 0.5,
        severity: 'moderate',
        clinicalSignificance: '可能为骨质疏松、骨小梁结构改变'
      });
    }
  }

  private analyzeRegions(regions: any[], findings: DiagnosisFinding[], imageType: string): void {
    regions.forEach((region, index) => {
      switch (region.type) {
        case 'high_density':
          findings.push({
            type: '局灶性高密度影',
            description: this.getHighDensityDescription(region, imageType),
            location: `区域${index + 1} (X:${region.x.toFixed(2)}, Y:${region.y.toFixed(2)})`,
            confidence: region.confidence,
            severity: 'moderate',
            clinicalSignificance: this.getHighDensitySignificance(imageType)
          });
          break;

        case 'low_density':
          findings.push({
            type: '局灶性低密度灶',
            description: this.getLowDensityDescription(region, imageType),
            location: `区域${index + 1} (X:${region.x.toFixed(2)}, Y:${region.y.toFixed(2)})`,
            confidence: region.confidence,
            severity: 'moderate',
            clinicalSignificance: this.getLowDensitySignificance(imageType)
          });
          break;

        case 'texture_abnormal':
          findings.push({
            type: '纹理异常区域',
            description: '局部纹理分布异常，结构紊乱',
            location: `区域${index + 1} (X:${region.x.toFixed(2)}, Y:${region.y.toFixed(2)})`,
            confidence: region.confidence,
            severity: 'mild',
            clinicalSignificance: '可能为早期退行性变或炎症改变'
          });
          break;
      }
    });
  }

  private getHighDensityDescription(region: any, imageType: string): string {
    const descriptions: { [key: string]: string } = {
      'xray': `高密度区域（强度: ${region.meanIntensity.toFixed(1)}），可能为骨质硬化、骨折愈合或异物`,
      'ct': `高衰减区域（强度: ${region.meanIntensity.toFixed(1)}），提示钙化、骨质增生或造影剂残留`,
      'mri': `低信号区域，可能为钙化、骨刺或金属伪影`
    };
    return descriptions[imageType] || `高密度异常区域（强度: ${region.meanIntensity.toFixed(1)}）`;
  }

  private getLowDensityDescription(region: any, imageType: string): string {
    const descriptions: { [key: string]: string } = {
      'xray': `低密度透亮区（强度: ${region.meanIntensity.toFixed(1)}），可能为骨质溶解、囊肿或骨质疏松`,
      'ct': `低衰减区域（强度: ${region.meanIntensity.toFixed(1)}），提示骨质破坏、囊肿或坏死`,
      'mri': `高信号区域，可能为水肿、炎症或肿瘤`
    };
    return descriptions[imageType] || `低密度异常区域（强度: ${region.meanIntensity.toFixed(1)}）`;
  }

  private getHighDensitySignificance(imageType: string): string {
    const significance: { [key: string]: string } = {
      'xray': '鉴别诊断：骨质增生、骨岛、骨折愈合期、骨肿瘤',
      'ct': '鉴别诊断：钙化灶、骨赘形成、成骨性转移',
      'mri': '鉴别诊断：钙化、纤维化、金属异物'
    };
    return significance[imageType] || '需要结合临床进一步评估';
  }

  private getLowDensitySignificance(imageType: string): string {
    const significance: { [key: string]: string } = {
      'xray': '鉴别诊断：骨质疏松、骨囊肿、溶骨性病变、感染',
      'ct': '鉴别诊断：骨质破坏、骨髓水肿、囊肿、肿瘤',
      'mri': '鉴别诊断：水肿、炎症、肿瘤、退行性变'
    };
    return significance[imageType] || '需要结合临床进一步评估';
  }

  private generateOverallAssessment(findings: DiagnosisFinding[]): string {
    if (findings.length === 0) {
      return '未见明确异常影像学改变';
    }

    const severeCount = findings.filter(f => f.severity === 'severe').length;
    const moderateCount = findings.filter(f => f.severity === 'moderate').length;

    if (severeCount > 0) {
      return `发现${severeCount}处重要异常征象，建议紧急临床关注`;
    } else if (moderateCount > 0) {
      return `发现${moderateCount}处中度异常，建议进一步检查明确`;
    } else {
      return '发现轻度异常改变，建议定期随访观察';
    }
  }

  private generateDifferentialDiagnosis(findings: DiagnosisFinding[], imageType: string): string[] {
    const diagnoses: string[] = [];

    findings.forEach(finding => {
      if (finding.type.includes('高密度')) {
        diagnoses.push('骨质增生', '骨岛', '成骨性病变', '骨折愈合期');
      }
      if (finding.type.includes('低密度')) {
        diagnoses.push('骨质疏松', '骨囊肿', '溶骨性肿瘤', '骨髓炎');
      }
      if (finding.type.includes('纹理')) {
        diagnoses.push('早期退行性变', '代谢性骨病', '轻度创伤后改变');
      }
    });

    // 去重
    return [...new Set(diagnoses)].slice(0, 5);
  }

  private generateRecommendations(findings: DiagnosisFinding[], imageType: string): string[] {
    const recommendations: string[] = [];

    if (findings.length === 0) {
      return ['建议定期健康体检'];
    }

    findings.forEach(finding => {
      if (finding.severity === 'severe') {
        recommendations.push('建议立即临床就诊');
        recommendations.push('完善相关实验室检查');
      } else if (finding.severity === 'moderate') {
        recommendations.push('建议专科门诊进一步评估');
        recommendations.push('考虑CT/MRI进一步明确病变性质');
      }
    });

    recommendations.push('结合临床症状综合判断');
    recommendations.push('定期复查观察动态变化');

    return recommendations;
  }
}