//报告生成器
// src/utils/ultimateReportGenerator.ts - 终极专业报告生成器
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const generateReport = () => { /* ... */ };
export default generateReport; // 使用默认导出
// 在 UltimateReportGenerator 类中添加修复方法
export class UltimateReportGenerator {
  /**
   * 修复版PDF生成 - 确保可打印并显示图片
   */
  static async generatePrintableReport(
    yoloResult: any,
    imageUrl: string,
    patientInfo: any = {},
    hospitalInfo: any = {}
  ): Promise<Blob> {
    try {
      console.log('开始生成可打印PDF报告...');

      // 检查依赖
      if (!html2canvas || !jsPDF) {
        throw new Error('PDF依赖未正确导入');
      }

      return await this.generateFixedReport(yoloResult, imageUrl, patientInfo, hospitalInfo);
    } catch (error) {
      console.error('PDF生成失败:', error);
      throw new Error('PDF报告生成失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  }

  /**
   * 修复版报告生成
   */
  private static async generateFixedReport(
    yoloResult: any,
    imageUrl: string,
    patientInfo: any,
    hospitalInfo: any
  ): Promise<Blob> {
    const reportHTML = this.createFixedReportHTML(yoloResult, imageUrl, patientInfo, hospitalInfo);

    // 创建临时div
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = reportHTML;
    tempDiv.style.position = 'fixed';
    tempDiv.style.top = '0';
    tempDiv.style.left = '0';
    tempDiv.style.width = '210mm';
    tempDiv.style.minHeight = '297mm';
    tempDiv.style.padding = '15mm';
    tempDiv.style.background = 'white';
    tempDiv.style.zIndex = '9999';
    tempDiv.style.fontFamily = 'Arial, SimSun, sans-serif';

    document.body.appendChild(tempDiv);

    try {
      // 等待图片加载
      await this.waitForImages(tempDiv);

      // 使用导入的 html2canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff'
      });

      // 使用导入的 jsPDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdfWidth = 210;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
      document.body.removeChild(tempDiv);

      return pdf.output('blob');

    } catch (error) {
      document.body.removeChild(tempDiv);
      console.error('html2canvas错误:', error);
      throw error;
    }
  }


  /**
   * 等待图片加载完成
   */
  private static waitForImages(container: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      const images = container.getElementsByTagName('img');
      let loadedCount = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        resolve();
        return;
      }

      for (let i = 0; i < totalImages; i++) {
        const img = images[i];
        if (img.complete) {
          loadedCount++;
        } else {
          img.onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) resolve();
          };
          img.onerror = () => {
            loadedCount++; // 即使加载失败也继续
            if (loadedCount === totalImages) resolve();
          };
        }
      }

      if (loadedCount === totalImages) {
        resolve();
      }
    });
  }

  /**
   * 创建修复版报告HTML - 添加图片显示
   */
  private static createFixedReportHTML(
    yoloResult: any,
    imageUrl: string,
    patientInfo: any,
    hospitalInfo: any
  ): string {
    const now = new Date();
    const reportId = `MSK_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          /* 修复版医疗报告样式 */
          body {
            font-family: Arial, 'Microsoft YaHei', sans-serif;
            line-height: 1.6;
            color: #000000;
            margin: 0;
            padding: 0;
            font-size: 12pt;
            background: white;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #000000;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          
          .hospital-name {
            font-size: 16pt;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .report-title {
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
          
          .patient-info {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            border: 1px solid #000000;
          }
          
          .patient-info td {
            padding: 8px 12px;
            border: 1px solid #000000;
            vertical-align: top;
          }
          
          .patient-info .label {
            background: #f0f0f0;
            font-weight: bold;
            width: 100px;
            text-align: center;
          }
          
          .section {
            margin: 20px 0;
            page-break-inside: avoid;
          }
          
          .section-title {
            font-weight: bold;
            font-size: 13pt;
            margin-bottom: 10px;
            background: #f8f8f8;
            padding: 8px 12px;
            border-left: 4px solid #007acc;
          }
          
          .image-section {
            text-align: center;
            margin: 20px 0;
            border: 1px solid #ddd;
            padding: 10px;
            background: #f9f9f9;
          }
          
          .medical-image {
            max-width: 100%;
            max-height: 300px;
            border: 1px solid #ccc;
          }
          
          .findings-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 15px 0;
          }
          
          .finding-card {
            border: 1px solid #cccccc;
            padding: 12px;
            border-radius: 4px;
            background: #f9f9f9;
          }
          
          .finding-card.severe {
            border-left: 4px solid #ff4444;
            background: #fff2f0;
          }
          
          .finding-card.moderate {
            border-left: 4px solid #ffaa00;
            background: #fffbe6;
          }
          
          .finding-card.mild {
            border-left: 4px solid #52c41a;
            background: #f6ffed;
          }
          
          .measurements-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            border: 1px solid #000000;
          }
          
          .measurements-table th,
          .measurements-table td {
            border: 1px solid #000000;
            padding: 8px 12px;
            text-align: center;
          }
          
          .measurements-table th {
            background: #f0f0f0;
            font-weight: bold;
          }
          
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10pt;
            color: #666666;
            border-top: 1px solid #cccccc;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <!-- 医院抬头 -->
        <div class="header">
          <div class="hospital-name">${hospitalInfo.name || '智能医学影像诊断中心'}</div>
          <div>${hospitalInfo.department || '放射科'}</div>
          <div style="font-size: 12pt; margin-top: 5px;">医学影像诊断报告</div>
        </div>

        <div class="report-title">X线诊断报告单</div>

        <!-- 患者基本信息 -->
        <table class="patient-info">
          <tr>
            <td class="label">姓名</td>
            <td>${patientInfo.name || '________'}</td>
            <td class="label">性别</td>
            <td>${patientInfo.gender || '________'}</td>
            <td class="label">年龄</td>
            <td>${patientInfo.age || '________'}</td>
          </tr>
          <tr>
            <td class="label">病历号</td>
            <td>${patientInfo.medicalRecordNo || '________'}</td>
            <td class="label">检查部位</td>
            <td><strong>${yoloResult.bodyPart}</strong></td>
            <td class="label">报告日期</td>
            <td>${now.toLocaleDateString('zh-CN')}</td>
          </tr>
        </table>

        <!-- 影像图片显示 -->
        <div class="section">
          <div class="section-title">影像资料</div>
          <div class="image-section">
            <img src="${imageUrl}" alt="医学影像" class="medical-image" 
                 onerror="this.style.display='none'" 
                 crossorigin="anonymous">
            <div style="margin-top: 8px; font-size: 11pt; color: #666;">
              原始影像资料 - ${yoloResult.bodyPart}
            </div>
          </div>
        </div>

        <!-- AI诊断摘要 -->
        <div class="section">
          <div class="section-title">AI智能诊断摘要</div>
          <table class="patient-info">
            <tr>
              <td class="label">AI置信度</td>
              <td><strong>${yoloResult.confidenceScore}%</strong></td>
              <td class="label">处理时间</td>
              <td>${yoloResult.processingTime.toFixed(0)}ms</td>
              <td class="label">发现数量</td>
              <td>${yoloResult.detectedDiseases.length}个</td>
            </tr>
          </table>
        </div>

        <!-- 影像学发现 -->
        <div class="section">
          <div class="section-title">影像学发现</div>
          <div class="findings-grid">
            ${yoloResult.detectedDiseases.map((finding: any) => `
              <div class="finding-card ${finding.severity}">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                  <h4 style="margin: 0; font-size: 12pt;">${finding.anatomicalLocation}</h4>
                  <span style="background: ${finding.severity === '重度' ? '#ff4444' : finding.severity === '中度' ? '#ffaa00' : '#52c41a'}; 
                        color: white; padding: 2px 8px; border-radius: 10px; font-size: 10pt;">
                    ${finding.severity}
                  </span>
                </div>
                <p style="margin: 6px 0; font-size: 11pt;">${finding.clinicalSignificance}</p>
                <div style="display: flex; justify-content: space-between; font-size: 10pt; color: #666;">
                  <span>置信度: ${(finding.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 医学测量 -->
        ${yoloResult.measurements.length > 0 ? `
        <div class="section">
          <div class="section-title">定量测量分析</div>
          <table class="measurements-table">
            <thead>
              <tr>
                <th>测量项目</th>
                <th>测量值</th>
                <th>正常范围</th>
                <th>偏差</th>
              </tr>
            </thead>
            <tbody>
              ${yoloResult.measurements.map((measure: any) => `
                <tr>
                  <td>${measure.type}</td>
                  <td><strong>${measure.value} ${measure.unit}</strong></td>
                  <td>${measure.normalRange}</td>
                  <td style="color: ${measure.deviation > 0 ? '#ff4444' : '#52c41a'};">
                    ${measure.deviation > 0 ? '+' : ''}${measure.deviation}${measure.unit}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        <!-- 诊断意见 -->
        <div class="section">
          <div class="section-title">诊断意见</div>
          <div style="border: 1px solid #007acc; padding: 15px; background: #f0f8ff;">
            <div style="font-size: 13pt; font-weight: bold; margin-bottom: 8px;">
              ${this.generatePrimaryDiagnosis(yoloResult.detectedDiseases)}
            </div>
            <div style="font-size: 11pt; color: #666;">
              基于AI智能分析系统，结合影像学特征综合判断
            </div>
          </div>
        </div>

        <!-- 报告脚注 -->
        <div class="footer">
          报告ID: ${reportId} | 生成时间: ${now.toLocaleString('zh-CN')}<br>
          注: 本报告由AI智能诊断系统生成，检测结果仅供参考
        </div>
      </body>
      </html>
    `;
  }

  /**
   * 修复下载功能
   */
  static async downloadPrintableReport(
    yoloResult: any,
    imageUrl: string,
    filename?: string,
    patientInfo?: any,
    hospitalInfo?: any
  ): Promise<void> {
    try {
      const pdfBlob = await this.generatePrintableReport(yoloResult, imageUrl, patientInfo, hospitalInfo);

      // 创建下载链接
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `医学诊断报告_${yoloResult.bodyPart}_${Date.now()}.pdf`;

      // 添加到DOM并触发点击
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 清理URL
      setTimeout(() => URL.revokeObjectURL(url), 100);

    } catch (error) {
      console.error('PDF下载失败:', error);
      throw new Error('报告下载失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  }

  // 保留原有的工具方法
  private static generatePrimaryDiagnosis(detections: any[]): string {
    if (detections.length === 0) return '未见明确异常';
    const primary = detections.reduce((prev, current) =>
      (prev.confidence > current.confidence) ? prev : current
    );
    return `${primary.anatomicalLocation}${primary.class.includes('fracture') ? '骨折' : '病变'}`;
  }

  // 在 ultimateReportGenerator.ts 文件末尾添加
}
export function testExports() {
  console.log('默认导出:', typeof generateReport);
  console.log('命名导出:', typeof UltimateReportGenerator);
  return {
    defaultExport: generateReport,
    namedExport: UltimateReportGenerator
  };
}