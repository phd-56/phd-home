import html2pdf from 'html2pdf.js';

/**
 * PDF生成工具类，提供HTML转PDF、文本转PDF等功能
 */
export class PDFGenerator {
  private static defaultOptions: html2pdf.Options = {
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
    options?: html2pdf.Options,
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
        }).catch(error => {
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
        const pdfOptions: html2pdf.Options = {
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
        }).catch(error => {
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
    pages: Array<{ title: string; content: string }>,
    fileName?: string,
    options?: html2pdf.Options
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
        }).catch(error => {
          document.body.removeChild(container);
          reject(error);
        });
      } catch (error) {
        console.error('Error generating multi-page PDF:', error);
        reject(new Error('生成多页PDF失败: ' + (error as Error).message));
      }
    });
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