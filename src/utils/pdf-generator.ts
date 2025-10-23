// 导入html2pdf库
import html2pdf from 'html2pdf.js';

/**
 * 生成PDF文档的工具类
 */
export class PDFGenerator {
  private static defaultOptions: any = {
    margin: 10,
    filename: 'document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  /**
   * 将HTML元素转换为PDF文件
   * @param element 要转换的HTML元素选择器或DOM元素
   * @param options PDF生成选项
   * @param fileName 导出文件名
   */
  static generateFromHtml(
    element: string | HTMLElement,
    options?: any,
    fileName?: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // 获取目标元素
        const targetElement = typeof element === 'string' 
          ? document.querySelector<HTMLElement>(element) 
          : element;

        if (!targetElement) {
          reject(new Error('Target element not found'));
          return;
        }

        // 合并选项
        const pdfOptions = {
          ...this.defaultOptions,
          ...options,
          filename: fileName || 'document.pdf'
        };

        // 创建临时元素克隆，避免影响原页面
        const clonedElement = targetElement.cloneNode(true) as HTMLElement;
        
        // 添加到body以便html2canvas可以访问样式
        document.body.appendChild(clonedElement);
        
        // 隐藏克隆元素
        clonedElement.style.position = 'absolute';
        clonedElement.style.top = '-9999px';
        clonedElement.style.left = '-9999px';
        clonedElement.style.visibility = 'hidden';

        // 生成PDF
        const worker = html2pdf().from(clonedElement).set(pdfOptions).save();

        // 处理完成后清理
        worker.then(() => {
          document.body.removeChild(clonedElement);
          resolve();
        }).catch((error: Error) => {
          document.body.removeChild(clonedElement);
          reject(error);
        });
      } catch (error) {
        console.error('Error generating PDF from HTML:', error);
        reject(new Error('生成PDF失败: ' + (error as Error).message));
      }
    });
  }

  /**
   * 生成病例报告PDF
   * @param caseData 病例数据
   * @param fileName 导出文件名
   */
  static generateCaseReport(
    caseData: any,
    fileName?: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // 创建临时DOM元素
        const reportElement = document.createElement('div');
        reportElement.className = 'case-report-pdf';
        
        // 构建报告HTML结构
        reportElement.innerHTML = this.generateCaseReportHtml(caseData);
        
        // 添加到body
        document.body.appendChild(reportElement);
        
        // 隐藏报告元素
        reportElement.style.display = 'none';

        // 自定义PDF选项 - 横向布局更适合报告
        const pdfOptions = {
          ...this.defaultOptions,
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait' // 病例报告使用纵向布局
          },
          filename: fileName || `病例报告_${caseData.caseNumber || new Date().getTime()}.pdf`
        };

        // 生成PDF
        const worker = html2pdf().from(reportElement).set(pdfOptions).save();

        // 处理完成后清理
        worker.then(() => {
          document.body.removeChild(reportElement);
          resolve();
        }).catch((error: Error) => {
          document.body.removeChild(reportElement);
          reject(error);
        });
      } catch (error) {
        console.error('Error generating case report PDF:', error);
        reject(new Error('生成病例报告失败: ' + (error as Error).message));
      }
    });
  }

  /**
   * 生成病例报告的HTML内容
   * @param caseData 病例数据
   * @returns HTML字符串  
   */
  private static generateCaseReportHtml(caseData: any): string {
    // 格式化日期
    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // 生成诊断列表HTML
    const generateDiagnosisList = (diagnoses: any[]) => {
      if (!diagnoses || diagnoses.length === 0) {
        return '<p>无诊断记录</p>';
      }

      return `
        <ul class="diagnosis-list">
          ${diagnoses.map((diagnosis, index) => `
            <li class="diagnosis-item">
              <strong>${index + 1}. ${diagnosis.diseaseName || '未命名诊断'}</strong>
              ${diagnosis.diseaseCode ? `<span class="diagnosis-code">(${diagnosis.diseaseCode})</span>` : ''}
              <div class="diagnosis-date">诊断日期: ${formatDate(diagnosis.diagnosisDate)}</div>
              ${diagnosis.description ? `<div class="diagnosis-desc"><strong>描述:</strong> ${diagnosis.description}</div>` : ''}
            </li>
          `).join('')}
        </ul>
      `;
    };

    // 生成治疗计划HTML
    const generateTreatmentPlan = (treatments: any[]) => {
      if (!treatments || treatments.length === 0) {
        return '<p>无治疗计划</p>';
      }

      return `
        <ul class="treatment-list">
          ${treatments.map((treatment, index) => `
            <li class="treatment-item">
              <strong>${index + 1}. ${treatment.treatmentName || '未命名治疗项目'}</strong>
              <div class="treatment-type">类型: ${this.getTreatmentTypeName(treatment.treatmentType)}</div>
              <div class="treatment-period">
                治疗周期: ${formatDate(treatment.startDate)} - ${treatment.endDate ? formatDate(treatment.endDate) : '进行中'}
              </div>
              ${treatment.description ? `<div class="treatment-desc"><strong>描述:</strong> ${treatment.description}</div>` : ''}
              ${treatment.treatmentType === 'medication' ? `
                <div class="medication-details">
                  <div><strong>药物名称:</strong> ${treatment.medicationName || '未指定'}</div>
                  <div><strong>剂量:</strong> ${treatment.dosage || '未指定'}</div>
                  <div><strong>用药途径:</strong> ${this.getAdministrationRouteName(treatment.administrationRoute)}</div>
                  <div><strong>用药频率:</strong> ${this.getFrequencyName(treatment.frequency)}</div>
                </div>
              ` : ''}
            </li>
          `).join('')}
        </ul>
      `;
    };

    // 生成文档列表HTML
    const generateDocumentsList = (documents: any[]) => {
      if (!documents || documents.length === 0) {
        return '<p>无相关文档</p>';
      }

      return `
        <ul class="documents-list">
          ${documents.map((doc, index) => `
            <li class="document-item">
              <strong>${index + 1}. ${doc.name}</strong>
              <div class="document-meta">
                <span class="document-type">类型: ${doc.type || '未指定'}</span>
                <span class="document-size">大小: ${this.formatFileSize(doc.size)}</span>
                <span class="document-date">上传日期: ${formatDate(doc.uploadTime)}</span>
              </div>
            </li>
          `).join('')}
        </ul>
      `;
    };

    // 构建报告HTML
    return `
      <style>
        .case-report {
          font-family: Arial, "Microsoft YaHei", sans-serif;
          padding: 20px;
          color: #333;
        }
        .report-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .hospital-info h1 {
          margin: 0 0 10px 0;
          color: #2c3e50;
        }
        .hospital-info div {
          margin: 5px 0;
          font-size: 14px;
          color: #666;
        }
        .report-title h2 {
          margin: 20px 0 10px 0;
          color: #2c3e50;
          font-size: 22px;
        }
        .report-date {
          font-size: 14px;
          color: #666;
        }
        .header-divider {
          border: 0;
          height: 1px;
          background: #ddd;
          margin: 20px 0;
        }
        .section-title {
          color: #34495e;
          border-bottom: 2px solid #3498db;
          padding-bottom: 5px;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .basic-info-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .basic-info-table td {
          padding: 8px 12px;
          border: 1px solid #ddd;
        }
        .info-label {
          background-color: #f8f9fa;
          font-weight: bold;
          width: 20%;
        }
        .info-value {
          width: 30%;
        }
        .history-item {
          margin-bottom: 15px;
        }
        .history-item strong {
          display: block;
          margin-bottom: 5px;
          color: #34495e;
        }
        .history-content {
          padding: 10px;
          background-color: #f8f9fa;
          border-left: 3px solid #3498db;
          line-height: 1.6;
        }
        .diagnosis-list, .treatment-list, .progress-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        .diagnosis-item, .treatment-item, .progress-item {
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
        .diagnosis-date, .treatment-type, .treatment-period, .progress-date {
          font-size: 13px;
          color: #666;
          margin-top: 5px;
        }
        .diagnosis-desc, .treatment-desc {
          margin-top: 8px;
          line-height: 1.5;
        }
        .medication-details {
          margin-top: 8px;
          padding: 8px;
          background-color: #fff;
          border-radius: 4px;
          font-size: 14px;
        }
        .medication-details div {
          margin: 3px 0;
        }
        .report-footer {
          margin-top: 40px;
          font-size: 12px;
          color: #666;
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }
      </style>
      <div class="case-report">
        <!-- 报告头部 -->
        <div class="report-header">
          <div class="hospital-info">
            <h1 class="hospital-name">智能医疗系统</h1>
            <div class="hospital-address">医院地址: 北京市海淀区医疗科技园A座</div>
            <div class="hospital-contact">联系电话: 010-12345678</div>
          </div>
          <div class="report-title">
            <h2>病例报告</h2>
            <div class="report-date">生成日期: ${new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
          </div>
        </div>
        
        <hr class="header-divider">
        
        <!-- 病例基本信息 -->
        <div class="case-basic-info">
          <h3 class="section-title">一、基本信息</h3>
          <table class="basic-info-table">
            <tr>
              <td class="info-label">病例编号:</td>
              <td class="info-value">${caseData.caseNumber || 'N/A'}</td>
              <td class="info-label">患者ID:</td>
              <td class="info-value">${caseData.patientId || 'N/A'}</td>
            </tr>
            <tr>
              <td class="info-label">患者姓名:</td>
              <td class="info-value">${caseData.patientName || 'N/A'}</td>
              <td class="info-label">性别:</td>
              <td class="info-value">${caseData.gender === 'male' ? '男' : caseData.gender === 'female' ? '女' : '未指定'}</td>
            </tr>
            <tr>
              <td class="info-label">年龄:</td>
              <td class="info-value">${caseData.age || 'N/A'}岁</td>
              <td class="info-label">就诊日期:</td>
              <td class="info-value">${formatDate(caseData.admissionDate)}</td>
            </tr>
            <tr>
              <td class="info-label">主治医生:</td>
              <td class="info-value">${caseData.doctorName || 'N/A'}</td>
              <td class="info-label">病例状态:</td>
              <td class="info-value">${this.getCaseStatusName(caseData.status)}</td>
            </tr>
          </table>
        </div>
        
        <!-- 主诉与病史 -->
        <div class="case-history">
          <h3 class="section-title">二、主诉与病史</h3>
          <div class="history-item">
            <strong>主诉:</strong>
            <div class="history-content">${caseData.chiefComplaint || '未记录'}</div>
          </div>
          <div class="history-item">
            <strong>现病史:</strong>
            <div class="history-content">${caseData.presentIllness || '未记录'}</div>
          </div>
          <div class="history-item">
            <strong>既往史:</strong>
            <div class="history-content">${caseData.pastHistory || '未记录'}</div>
          </div>
        </div>
        
        <!-- 诊断信息 -->
        <div class="case-diagnosis">
          <h3 class="section-title">三、诊断信息</h3>
          ${generateDiagnosisList(caseData.diagnosis || [])}
        </div>
        
        <!-- 治疗计划 -->
        <div class="case-treatment">
          <h3 class="section-title">四、治疗计划</h3>
          ${generateTreatmentPlan(caseData.treatmentPlan || [])}
        </div>
        
        <!-- 检查结果 -->
        ${caseData.examinationResults ? `
        <div class="case-examinations">
          <h3 class="section-title">五、检查结果</h3>
          <div class="examination-item">
            <div class="history-content">${caseData.examinationResults || '未记录'}</div>
          </div>
        </div>
        ` : ''}
        
        <!-- 病程记录 -->
        ${caseData.progressRecords && caseData.progressRecords.length > 0 ? `
        <div class="case-progress">
          <h3 class="section-title">六、病程记录</h3>
          <ul class="progress-list">
            ${caseData.progressRecords.map((record: any) => `
              <li class="progress-item">
                <div class="progress-date">${formatDate(record.recordDate)} - ${record.doctorName || '未记录'}</div>
                <div class="progress-content">${record.content}</div>
              </li>
            `).join('')}
          </ul>
        </div>
        ` : ''}
        
        <!-- 文档列表 -->
        ${caseData.documents && caseData.documents.length > 0 ? `
        <div class="case-documents">
          <h3 class="section-title">七、相关文档</h3>
          ${generateDocumentsList(caseData.documents)}
        </div>
        ` : ''}
        
        <!-- 报告底部 -->
        <div class="report-footer">
          <hr>
          <div class="footer-content">
            <div class="footer-left">本报告由智能医疗系统自动生成，仅供医疗参考</div>
            <div class="footer-right">报告版本: 1.0.0</div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 获取治疗类型名称
   */
  private static getTreatmentTypeName(type: string): string {
    const typeMap: Record<string, string> = {
      'medication': '药物治疗',
      'surgery': '手术治疗',
      'physical': '物理治疗',
      'rehabilitation': '康复训练',
      'other': '其他治疗'
    };
    return typeMap[type] || '未指定';
  }

  /**
   * 获取用药途径名称
   */
  private static getAdministrationRouteName(route: string): string {
    const routeMap: Record<string, string> = {
      'oral': '口服',
      'intravenous': '静脉注射',
      'intramuscular': '肌肉注射',
      'subcutaneous': '皮下注射',
      'topical': '外用'
    };
    return routeMap[route] || '未指定';
  }

  /**
   * 获取用药频率名称
   */
  private static getFrequencyName(frequency: string): string {
    const frequencyMap: Record<string, string> = {
      'once': '每日一次',
      'twice': '每日两次',
      'threeTimes': '每日三次',
      'fourTimes': '每日四次',
      'asNeeded': '按需使用',
      'custom': '自定义'
    };
    return frequencyMap[frequency] || '未指定';
  }

  /**
   * 获取病例状态名称
   */
  private static getCaseStatusName(status: string): string {
    const statusMap: Record<string, string> = {
      'active': '进行中',
      'closed': '已结案',
      'archived': '已归档',
      'cancelled': '已取消'
    };
    return statusMap[status] || status;
  }

  /**
   * 格式化文件大小
   */
  private static formatFileSize(bytes: number): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 生成多页PDF文档
   * @param pages 页面内容数组
   * @param fileName 文件名
   * @param options PDF选项
   */
  static generateMultiPagePdf(
    pages: any[],
    fileName?: string,
    options?: any
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // 创建临时容器
        const container = document.createElement('div');
        container.className = 'multi-page-pdf-container';
        
        // 添加页面内容
        pages.forEach((page, index) => {
          const pageElement = document.createElement('div');
          pageElement.className = 'pdf-page';
          
          // 添加页面标题
          const titleElement = document.createElement('h2');
          titleElement.className = 'page-title';
          titleElement.textContent = page.title;
          pageElement.appendChild(titleElement);
          
          // 添加页面内容
          const contentElement = document.createElement('div');
          contentElement.className = 'page-content';
          contentElement.innerHTML = page.content;
          pageElement.appendChild(contentElement);
          
          // 添加分页符（最后一页不需要）
          if (index < pages.length - 1) {
            const pageBreak = document.createElement('div');
            pageBreak.style.pageBreakAfter = 'always';
            pageElement.appendChild(pageBreak);
          }
          
          container.appendChild(pageElement);
        });
        
        // 添加到文档
        document.body.appendChild(container);
        container.style.display = 'none';
        
        // 生成PDF
        const pdfOptions = {
          ...this.defaultOptions,
          ...options,
          filename: fileName || 'multi-page-document.pdf'
        };
        
        const worker = html2pdf().from(container).set(pdfOptions).save();
        
        // 清理并解析结果
        worker.then(() => {
          document.body.removeChild(container);
          resolve();
        }).catch((error: Error) => {
          document.body.removeChild(container);
          reject(error);
        });
      } catch (error) {
        console.error('Error generating multi-page PDF:', error);
        reject(new Error('生成多页PDF失败: ' + (error as Error).message));
      }
    });
  }
  
  /**
   * 生成AI诊断分析报告PDF
   * @param reportData AI诊断报告数据
   * @param fileName 导出文件名
   */
  static generateAIDiagnosisReport(
    reportData: any,
    fileName?: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('开始生成AI诊断报告PDF...');
        
        // 直接使用更简单的配置
        const pdfFileName = fileName || `AI诊断报告_${reportData.patientName || '未命名'}_${new Date().getTime()}.pdf`;
        console.log(`设置PDF文件名: ${pdfFileName}`);
        
        // 创建一个更简单的临时元素
        const reportElement = document.createElement('div');
        reportElement.id = 'temp-report-element';
        reportElement.style.visibility = 'hidden';
        reportElement.style.position = 'fixed';
        reportElement.style.top = '0';
        reportElement.style.left = '0';
        reportElement.style.width = '210mm';
        reportElement.style.height = 'auto';
        
        // 设置HTML内容
        reportElement.innerHTML = this.generateAIDiagnosisReportHtml(reportData);
        
        // 添加到body
        document.body.appendChild(reportElement);
        
        // 立即使用更简单的html2pdf配置
        const opt = {
          margin: 10,
          filename: pdfFileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 1 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        console.log('调用html2pdf生成PDF...');
        // 使用链式调用但不使用Promise
        (html2pdf() as any).set(opt).from(reportElement).save().then(() => {
          console.log('PDF生成成功并已下载');
          // 清理元素
          if (document.getElementById('temp-report-element')) {
            document.body.removeChild(reportElement);
          }
          resolve();
        }).catch((error: any) => {
          console.error('PDF生成失败:', error);
          // 清理元素
          if (document.getElementById('temp-report-element')) {
            document.body.removeChild(reportElement);
          }
          reject(error);
        });
      } catch (error) {
        console.error('生成AI诊断报告时出错:', error);
        reject(new Error('生成AI诊断报告失败: ' + (error as Error).message));
      }
    });
  }
  
  /**
   * 生成AI诊断分析报告的HTML内容
   * @param reportData AI诊断报告数据
   * @returns HTML字符串  
   */
  private static generateAIDiagnosisReportHtml(reportData: any): string {
    // 生成疾病分类HTML
    const generateDiseasesList = (diseases: any[]) => {
      if (!diseases || diseases.length === 0) {
        return '<p>无疾病分类数据</p>';
      }

      return `
        <table class="disease-table">
          <thead>
            <tr>
              <th>疾病名称</th>
              <th>置信度</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            ${diseases.map((disease) => `
              <tr>
                <td>${disease.name || '未命名疾病'}</td>
                <td>
                  <div class="confidence-item">
                    <div class="confidence-bar">
                      <div class="confidence-fill" style="width: ${Math.min(100, disease.confidence * 100)}%" 
                           data-confidence="${(disease.confidence * 100).toFixed(1)}%"></div>
                    </div>
                    <span class="confidence-value">${(disease.confidence * 100).toFixed(1)}%</span>
                  </div>
                </td>
                <td>${disease.description || '无描述'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    // 生成病灶检测HTML
    const generateDetectionsList = (detections: any[]) => {
      if (!detections || detections.length === 0) {
        return '<p>无病灶检测数据</p>';
      }

      return `
        <table class="detection-table">
          <thead>
            <tr>
              <th>位置</th>
              <th>置信度</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            ${detections.map((detection) => `
              <tr>
                <td>${detection.location || '未知位置'}</td>
                <td>
                  <div class="confidence-item">
                    <div class="confidence-bar">
                      <div class="confidence-fill" style="width: ${Math.min(100, detection.confidence * 100)}%" 
                           data-confidence="${(detection.confidence * 100).toFixed(1)}%"></div>
                    </div>
                    <span class="confidence-value">${(detection.confidence * 100).toFixed(1)}%</span>
                  </div>
                </td>
                <td>${detection.description || '无描述'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    // 构建报告HTML
    return `
      <style>
        .ai-diagnosis-report {
          font-family: Arial, "Microsoft YaHei", sans-serif;
          padding: 20px;
          color: #333;
        }
        .report-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .hospital-info h1 {
          margin: 0 0 10px 0;
          color: #2c3e50;
          font-size: 24px;
        }
        .hospital-info div {
          margin: 5px 0;
          font-size: 14px;
          color: #666;
        }
        .report-title h2 {
          margin: 20px 0 10px 0;
          color: #2c3e50;
          font-size: 22px;
          font-weight: bold;
        }
        .report-meta {
          font-size: 14px;
          color: #666;
          margin-top: 15px;
        }
        .meta-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .header-divider {
          border: 0;
          height: 1px;
          background: #ddd;
          margin: 20px 0 30px 0;
        }
        .section-title {
          color: #34495e;
          border-bottom: 2px solid #3498db;
          padding-bottom: 8px;
          margin: 30px 0 15px 0;
          font-size: 18px;
          font-weight: bold;
        }
        .patient-info {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
        }
        .patient-info-item {
          display: flex;
          margin-bottom: 10px;
        }
        .patient-info-label {
          font-weight: bold;
          width: 100px;
          color: #555;
        }
        .patient-info-value {
          color: #333;
        }
        .disease-table, .detection-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .disease-table th, .detection-table th {
          background-color: #3498db;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        .disease-table td, .detection-table td {
          padding: 10px 12px;
          border: 1px solid #ddd;
        }
        .disease-table tr:nth-child(even), .detection-table tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        .confidence-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .confidence-bar {
          flex: 1;
          height: 20px;
          background-color: #e9ecef;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }
        .confidence-fill {
          height: 100%;
          background-color: #28a745;
          transition: width 0.3s ease;
        }
        .confidence-fill[data-confidence^="9"] {
          background-color: #dc3545;
        }
        .confidence-fill[data-confidence^="8"] {
          background-color: #fd7e14;
        }
        .confidence-fill[data-confidence^="7"] {
          background-color: #ffc107;
        }
        .confidence-value {
          font-weight: bold;
          min-width: 50px;
          text-align: right;
        }
        .explanation-section {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .heatmap-container {
          margin: 20px 0;
          text-align: center;
        }
        .heatmap-container img {
          max-width: 100%;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .doctor-diagnosis, .treatment-suggestion {
          background-color: #e3f2fd;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          line-height: 1.6;
          border-left: 4px solid #2196f3;
        }
        .doctor-diagnosis h4, .treatment-suggestion h4 {
          margin-top: 0;
          color: #1976d2;
        }
        .image-preview {
          margin: 20px 0;
          text-align: center;
        }
        .image-preview img {
          max-width: 100%;
          max-height: 400px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .report-footer {
          margin-top: 40px;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        .footer-content {
          margin-top: 10px;
          border-top: 1px solid #eee;
          padding-top: 10px;
        }
      </style>
      <div class="ai-diagnosis-report">
        <!-- 报告头部 -->
        <div class="report-header">
          <div class="hospital-info">
            <h1 class="hospital-name">${reportData.hospitalName || '智能医疗系统'}</h1>
            <div class="hospital-department">科室: ${reportData.department || '未指定'}</div>
          </div>
          <div class="report-title">
            <h2>AI智能诊断分析报告</h2>
          </div>
          <div class="report-meta">
            <div class="meta-row">
              <span>报告日期: ${reportData.reportDate || new Date().toLocaleDateString('zh-CN')}</span>
              <span>报告编号: ${Date.now().toString()}</span>
            </div>
          </div>
        </div>
        
        <hr class="header-divider">
        
        <!-- 患者基本信息 -->
        <div class="patient-info">
          <h3 class="section-title">一、患者信息</h3>
          <div class="patient-info-item">
            <div class="patient-info-label">患者姓名:</div>
            <div class="patient-info-value">${reportData.patientName || '未提供'}</div>
          </div>
        </div>
        
        <!-- 影像信息 -->
        ${reportData.selectedImage ? `
        <div class="image-info">
          <h3 class="section-title">二、影像信息</h3>
          <div class="patient-info-item">
            <div class="patient-info-label">影像名称:</div>
            <div class="patient-info-value">${reportData.selectedImage.name}</div>
          </div>
          <div class="patient-info-item">
            <div class="patient-info-label">影像类型:</div>
            <div class="patient-info-value">${reportData.selectedImage.type}</div>
          </div>
          <div class="image-preview">
            <img src="${reportData.selectedImage.url}" alt="患者影像">
          </div>
        </div>
        ` : ''}
        
        <!-- AI诊断结果 -->
        ${reportData.diagnosisResult ? `
        <div class="ai-results">
          <h3 class="section-title">三、AI诊断结果</h3>
          
          <!-- 疾病分类 -->
          <div class="disease-section">
            <h4>疾病分类</h4>
            ${generateDiseasesList(reportData.diagnosisResult.diseases)}
          </div>
          
          <!-- 病灶检测 -->
          <div class="detection-section">
            <h4>病灶检测</h4>
            ${generateDetectionsList(reportData.diagnosisResult.detections)}
          </div>
          
          <!-- 可解释性分析 -->
          <div class="explanation-section">
            <h4>可解释性分析</h4>
            <p>${reportData.diagnosisResult.explanation || '无详细解释'}</p>
            ${reportData.diagnosisResult.heatmap ? `
            <div class="heatmap-container">
              <h5>AI关注区域热力图</h5>
              <img src="${reportData.diagnosisResult.heatmap}" alt="AI热力图分析">
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}
        
        <!-- 医生诊断结论 -->
        <div class="doctor-diagnosis">
          <h3 class="section-title">四、医生诊断结论</h3>
          <p>${reportData.doctorDiagnosis || '待医生填写诊断结论'}</p>
        </div>
        
        <!-- 治疗建议 -->
        <div class="treatment-suggestion">
          <h3 class="section-title">五、治疗建议</h3>
          <p>${reportData.treatmentSuggestion || '待医生填写治疗建议'}</p>
        </div>
        
        <!-- 报告底部 -->
        <div class="report-footer">
          <div class="footer-content">
            <p>本报告由AI智能诊断系统辅助生成，最终诊断以医生意见为准</p>
            <p>报告生成时间: ${new Date().toLocaleString('zh-CN')}</p>
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * 从HTML生成PDF的便捷函数
 */
export const htmlToPdf = PDFGenerator.generateFromHtml;

/**
 * 生成病例报告PDF的便捷函数
 */
export const generateCasePdf = PDFGenerator.generateCaseReport;

export default PDFGenerator;