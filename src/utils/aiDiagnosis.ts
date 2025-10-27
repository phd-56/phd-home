// utils/aiDiagnosis.ts
export interface DiagnosisResult {
  diagnosis: string;
  confidence: number;
  findings: string[];
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
}

export class AIDiagnosisService {
  // 模拟基于图像类型的诊断逻辑
  async analyzeMedicalImage(imageFile: File, imageType: string): Promise<DiagnosisResult> {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 基于文件名或类型的简单分析（实际中应该分析图像内容）
    const fileName = imageFile.name.toLowerCase();

    return this.generateMockDiagnosis(fileName, imageType);
  }

  private generateMockDiagnosis(fileName: string, imageType: string): DiagnosisResult {
    // 简单的规则引擎模拟AI分析
    const conditions = this.getPossibleConditions(fileName, imageType);
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      diagnosis: randomCondition.name,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% 置信度
      findings: randomCondition.findings,
      recommendations: randomCondition.recommendations,
      severity: randomCondition.severity
    };
  }

  private getPossibleConditions(fileName: string, imageType: string): any[] {
    // 基于图像类型返回可能的诊断结果
    const conditions = {
      'xray': [
        {
          name: '肺炎',
          findings: ['右下肺野可见斑片状高密度影', '肺纹理增粗'],
          recommendations: ['建议抗感染治疗', '一周后复查胸片', '完善血常规检查'],
          severity: 'medium'
        },
        {
          name: '肺结核',
          findings: ['双上肺可见纤维条索影', '部分区域见空洞形成'],
          recommendations: ['建议结核菌素试验', '痰培养检查', '专科医院就诊'],
          severity: 'high'
        }
      ],
      'ct': [
        {
          name: '肺部结节',
          findings: ['右肺中叶见小结节影', '边界清晰，大小约0.8cm'],
          recommendations: ['建议3-6个月后复查CT', '定期随访观察'],
          severity: 'low'
        },
        {
          name: '脑梗死',
          findings: ['左侧基底节区见低密度灶', '边界欠清'],
          recommendations: ['神经内科就诊', '完善MRI检查', '控制危险因素'],
          severity: 'high'
        }
      ],
      'mri': [
        {
          name: '腰椎间盘突出',
          findings: ['L4/L5椎间盘向后突出', '压迫硬膜囊'],
          recommendations: ['避免重体力劳动', '康复理疗', '定期复查'],
          severity: 'medium'
        }
      ]
    };

    return conditions[imageType as keyof typeof conditions] || [
      {
        name: '未见明显异常',
        findings: ['各组织结构清晰', '未见明确占位性病变'],
        recommendations: ['定期健康体检'],
        severity: 'low'
      }
    ];
  }
}