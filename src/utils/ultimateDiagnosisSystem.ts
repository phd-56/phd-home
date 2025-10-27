//诊断系统
// src/utils/ultimateDiagnosisSystem.ts - 终极诊断系统
// src/utils/ultimateDiagnosisSystem.ts
import { YOLOMedicalEngine, DetectionResult } from './yoloMedicalEngine';
import { UltimateReportGenerator } from './ultimateReportGenerator';

// 正确的导入方式
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export class UltimateDiagnosisSystem {
  private static yoloEngine = new YOLOMedicalEngine();
  private static isInitialized = false;

  /**
   * 初始化终极系统
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 初始化终极肌肉骨骼诊断系统...');
      await this.yoloEngine.loadModel();
      this.isInitialized = true;
      console.log('✅ 终极系统初始化完成');
    } catch (error) {
      console.error('系统初始化失败:', error);
      throw error;
    }
  }

  /**
   * 终极诊断流程
   */
  static async ultimateDiagnosis(imageFile: File): Promise<{
    yoloResult: DetectionResult;
    reportData: any;
    canGenerateReport: boolean;
  }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('🎯 开始终极YOLO诊断...');

      // 1. YOLO深度学习分析
      // 使用正确的detect方法，并传入HTML元素
      const imageElement = new Image();
      imageElement.src = URL.createObjectURL(imageFile);
      await new Promise(resolve => { imageElement.onload = resolve; });
      const yoloResult = await this.yoloEngine.detect(imageElement);
      URL.revokeObjectURL(imageElement.src);

      // 2. 准备报告数据
      const reportData = this.prepareReportData(yoloResult, imageFile);

      // 3. 检查报告生成能力
      const canGenerateReport = this.checkReportCapability();

      return {
        yoloResult,
        reportData,
        canGenerateReport
      };

    } catch (error: unknown) {
      console.error('终极诊断失败:', error);
      if (error instanceof Error) {
        throw new Error(`YOLO诊断系统错误: ${error.message}`);
      } else {
        throw new Error(`YOLO诊断系统错误: ${String(error)}`);
      }
    }
  }
  private static checkReportCapability(): boolean {
    console.log('检查PDF依赖:', {
      html2canvas: !!html2canvas,
      jsPDF: !!jsPDF,
      html2canvasType: typeof html2canvas,
      jsPDFType: typeof jsPDF
    });

    return !!html2canvas && !!jsPDF;
  }
  /**
   * 生成终极PDF报告
   */
  static async generateUltimatePDF(
    yoloResult: DetectionResult,
    patientInfo: any = {},
    hospitalInfo: any = {}
  ): Promise<Blob> {
    if (!this.checkReportCapability()) {
      throw new Error('报告生成功能不可用');
    }

    // 使用 UltimateReportGenerator 生成 PDF Blob，优先使用该模块的可用生成函数
    const _maybeBlob = await UltimateReportGenerator.generatePrintableReport(
      yoloResult,
      await this.getImageUrl(yoloResult),
      patientInfo,
      hospitalInfo
    ) as unknown;

    // 如果直接返回了 Blob，则直接返回
    if (
      _maybeBlob &&
      (
        (typeof Blob !== 'undefined' && _maybeBlob instanceof Blob) ||
        (typeof (_maybeBlob as any).size === 'number' && typeof (_maybeBlob as any).type === 'string')
      )
    ) {
      return _maybeBlob as Blob;
    }

    // 如果模块未返回 Blob，但全局或返回值中包含 jsPDF 实例（常见实现），尝试从中导出 PDF
    if (typeof jsPDF !== 'undefined') {
      try {
        const maybeDoc = (_maybeBlob as any) || (globalThis as any).jsPDFInstance || (globalThis as any).lastGeneratedPdf;
        if (maybeDoc && typeof maybeDoc.output === 'function') {
          // 尝试以 arraybuffer 导出并构造 Blob
          const arrayBuffer = maybeDoc.output('arraybuffer');
          return new Blob([arrayBuffer], { type: 'application/pdf' });
        }
      } catch {
        // 忽略并进入错误处理
      }
    }

    // 无法获取有效的 Blob 时抛出明确错误
    throw new Error('生成PDF失败：UltimateReportGenerator 未返回可用的 Blob');
  }

  /**
   * 下载终极报告
   */
  static async downloadUltimateReport(
    yoloResult: DetectionResult,
    patientInfo: any = {},
    hospitalInfo: any = {},
    filename?: string
  ): Promise<void> {
    try {
      console.log('🎯 开始生成PDF报告...');

      // 检查依赖
      if (!this.checkReportCapability()) {
        console.error('PDF依赖检查失败');
        throw new Error('请先安装PDF依赖 (html2canvas 和 jspdf)');
      }

      console.log('✅ PDF依赖检查通过');

      // 生成图片URL
      const imageUrl = await this.getImageUrl(yoloResult);
      console.log('📷 图片URL:', imageUrl);

      // 使用 UltimateReportGenerator 生成PDF
      const pdfBlob = await UltimateReportGenerator.generatePrintableReport(
        yoloResult,
        imageUrl,
        patientInfo,
        hospitalInfo
      );

      console.log('✅ PDF Blob 生成成功:', pdfBlob);

      // 下载PDF
      const name = filename || `医学诊断报告_${Date.now()}.pdf`;
      const downloadUrl = URL.createObjectURL(pdfBlob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 清理URL
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);

      console.log('🎉 PDF报告下载成功');

    } catch (error) {
      console.error('❌ PDF报告生成失败:', error);
      throw new Error('报告生成失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  }
  /**
   * 获取图片URL
   */
  private static async getImageUrl(yoloResult: DetectionResult): Promise<string> {
    // 临时使用占位图
    return 'https://via.placeholder.com/400x300/007acc/white?text=医学影像';
  }
  /**
   * 准备报告数据
   */
  private static prepareReportData(yoloResult: DetectionResult, imageFile: File): any {
    const now = new Date();

    return {
      reportId: `ULT_${now.getTime()}`,
      timestamp: now.toISOString(),
      imageInfo: {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      },
      systemInfo: {
        engine: 'YOLOv8-Medical',
        version: 'Ultimate v3.0',
        modelStatus: 'initialized' // 直接返回字符串，避免访问私有属性
      }
    };
  }


  /**
   * 获取系统状态
   */
  static getSystemStatus(): {
    yoloEngine: boolean;
    reportSystem: boolean;
    version: string;
  } {
    return {
      yoloEngine: this.isInitialized,
      reportSystem: this.checkReportCapability(),
      version: 'Ultimate YOLO Diagnosis v3.0'
    };
  }
}