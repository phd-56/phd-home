<template>
  <div class="report-editor-page">
    <header class="app-header">
      <span class="header-title">医学影像诊断系统</span>
      <div class="header-actions">
        <button class="btn-default" @click="saveDraft">保存报告</button>
        <button class="btn-primary" @click="exportToPDF">导出PDF</button>
        <button class="btn-default" @click="handlePrint">打印报告</button>
        <a href="#" class="btn-secondary" @click.prevent="goBackToReports">返回报告中心</a>
        <a href="#" class="btn-secondary" @click.prevent="handleNewReport">清空报告</a>
      </div>
    </header>

    <main class="main-content">
      <div class="editor-pane">
        <div class="editor-header">
          <div>
            <h1>诊断报告生成</h1>
            <p>编辑并生成最终诊断报告，支持导出PDF格式</p>
          </div>
          <select v-model="reportType">
            <option value="dr">DR检查报告单</option>
            <option value="ct">CT检查报告单</option>
            <option value="mri">MRI检查报告单</option>
            <option value="ultrasound">超声检查报告单</option>
          </select>
        </div>

        <div class="card">
          <div class="patient-info-grid">
            <div class="form-group">
              <label for="input-xray-no">X线号</label>
              <input type="text" id="input-xray-no" v-model="formData.xrayNo">
            </div>
            <div class="form-group">
              <label for="input-inpatient-no">住院号</label>
              <input type="text" id="input-inpatient-no" v-model="formData.inpatientNo">
            </div>
            <div class="form-group">
              <label for="input-report-date">报告日期</label>
              <input type="text" id="input-report-date" v-model="formData.reportDate">
            </div>
            <div class="form-group">
              <label for="input-name">姓名</label>
              <input type="text" id="input-name" v-model="formData.name">
            </div>
            <div class="form-group">
              <label for="input-sex">性别</label>
              <input type="text" id="input-sex" v-model="formData.sex">
            </div>
            <div class="form-group">
              <label for="input-age">年龄</label>
              <input type="text" id="input-age" v-model="formData.age">
            </div>
            <div class="form-group">
              <label for="input-department">申请科室</label>
              <input type="text" id="input-department" v-model="formData.department">
            </div>
            <div class="form-group">
              <label for="input-bed-no">床号</label>
              <input type="text" id="input-bed-no" v-model="formData.bedNo">
            </div>
            <div class="form-group">
              <label for="input-exam-part">检查部位</label>
              <input type="text" id="input-exam-part" v-model="formData.examPart">
            </div>
          </div>
        </div>

        <div class="card">
          <h2>X线所见</h2>
          <textarea id="input-findings" v-model="formData.findings" rows="5"></textarea>
        </div>

        <div class="card">
          <h2>诊断意见</h2>
          <textarea id="input-diagnosis" v-model="formData.diagnosis" rows="5"></textarea>
        </div>

        <div class="card">
          <h2>医师签名</h2>
          <div class="signatures-grid">
            <div class="signature-box">
              <label>报告医师</label>
              <input type="file" id="file-input-report" accept="image/*" @change="handleReportSignatureChange" ref="reportSignatureInput">
              <div class="signature-pad" :class="{ 'has-image': signatures.report }">
                <span class="placeholder">（签名区域）</span>
                <img :src="signatures.report" alt="报告医师签名" class="signature-image" v-if="signatures.report">
              </div>
              <div class="signature-actions">
                <a @click.prevent="clearReportSignature">清除</a>
                <a @click.prevent="triggerReportSignatureUpload">上传</a>
              </div>
            </div>
            <div class="signature-box">
              <label>审核医师</label>
              <input type="file" id="file-input-audit" accept="image/*" @change="handleAuditSignatureChange" ref="auditSignatureInput">
              <div class="signature-pad" :class="{ 'has-image': signatures.audit }">
                <span class="placeholder">（签名区域）</span>
                <img :src="signatures.audit" alt="审核医师签名" class="signature-image" v-if="signatures.audit">
              </div>
              <div class="signature-actions">
                <a @click.prevent="clearAuditSignature">清除</a>
                <a @click.prevent="triggerAuditSignatureUpload">上传</a>
              </div>
            </div>
          </div>
        </div>

        <div class="editor-footer">
          <span>注：报告签字有效</span>
          <span>报告日期：{{ formData.reportDate }}</span>
        </div>
      </div>

      <div class="preview-pane">
        <div class="preview-header">
          <h2>报告预览</h2>
          <p>实时预览最终报告样式</p>
        </div>

        <div id="report-preview" ref="reportPreview">
          <div class="report-title">
            <h1>检查报告单</h1>
          </div>

          <div class="report-patient-info">
            <div><span>X线号:</span> <span>{{ formData.xrayNo || '' }}</span></div>
            <div><span>住院号:</span> <span>{{ formData.inpatientNo || '' }}</span></div>
            <div><span>姓名:</span> <span>{{ formData.name || '' }}</span></div>
            <div><span>性别:</span> <span>{{ formData.sex || '' }}</span></div>
            <div><span>年龄:</span> <span>{{ formData.age || '' }}</span></div>
            <div><span>申请科室:</span> <span>{{ formData.department || '' }}</span></div>
            <div><span>床号:</span> <span>{{ formData.bedNo || '' }}</span></div>
            <div style="grid-column: 1 / 3;">
              <span>检查部位:</span> <span>{{ formData.examPart || '' }}</span>
            </div>
          </div>

          <div class="report-section">
            <h3>X线所见</h3>
            <div class="content">{{ formData.findings || '' }}</div>
          </div>

          <div class="report-section">
            <h3>诊断意见</h3>
            <div class="content pre-line">{{ formData.diagnosis || '' }}</div>
          </div>

          <div class="report-footer">
            <div class="report-footer-signatures">
              <span v-if="signatures.report">
                报告医师
                <img :src="signatures.report" alt="报告医师签名">
              </span>
              <span v-if="signatures.audit">
                审核医师
                <img :src="signatures.audit" alt="审核医师签名">
              </span>
            </div>
            <div class="report-footer-meta">
              <span>注：报告签字有效</span>
              <span>报告日期: {{ formData.reportDate || '' }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const reportType = ref('dr')
const reportPreview = ref<HTMLElement>()
const reportSignatureInput = ref<HTMLInputElement>()
const auditSignatureInput = ref<HTMLInputElement>()

const formData = reactive({
  xrayNo: '',
  inpatientNo: '',
  reportDate: '',
  name: '',
  sex: '',
  age: '',
  department: '',
  bedNo: '',
  examPart: '',
  findings: '',
  diagnosis: ''
})

const signatures = reactive({
  report: '',
  audit: ''
})

onMounted(() => {
  // 设置默认报告日期为今天
  const today = new Date()
  formData.reportDate = today.toISOString().split('T')[0]
  
  // 检查是否有AI诊断数据
  const aiDiagnosisData = sessionStorage.getItem('aiDiagnosisReportData')
  if (aiDiagnosisData) {
    try {
      const data = JSON.parse(aiDiagnosisData)
      // 加载AI诊断数据
      formData.name = data.name || ''
      formData.sex = data.sex || ''
      formData.age = data.age || ''
      formData.department = data.department || ''
      formData.examPart = data.examPart || ''
      formData.findings = data.findings || ''
      formData.diagnosis = data.diagnosis || ''
      formData.reportDate = data.reportDate || formData.reportDate
      
      // 清除sessionStorage中的数据
      sessionStorage.removeItem('aiDiagnosisReportData')
    } catch (e) {
      console.error('Failed to parse AI diagnosis data:', e)
    }
  }
  
  // 如果是编辑模式，从localStorage加载报告数据
  const reportId = route.params.id
  if (reportId) {
    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]')
    const report = savedReports.find((r: any) => String(r.id) === String(reportId))
    
    if (report && report.formData) {
      Object.assign(formData, report.formData)
      Object.assign(signatures, report.signatures || {})
    }
  }
})

const handleReportSignatureChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      signatures.report = dataUrl
    }
    reader.readAsDataURL(file)
  }
}

const handleAuditSignatureChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      signatures.audit = dataUrl
    }
    reader.readAsDataURL(file)
  }
}

const triggerReportSignatureUpload = () => {
  reportSignatureInput.value?.click()
}

const triggerAuditSignatureUpload = () => {
  auditSignatureInput.value?.click()
}

const clearReportSignature = () => {
  signatures.report = ''
  if (reportSignatureInput.value) {
    reportSignatureInput.value.value = ''
  }
}

const clearAuditSignature = () => {
  signatures.audit = ''
  if (auditSignatureInput.value) {
    auditSignatureInput.value.value = ''
  }
}

const saveDraft = () => {
  // 从localStorage获取现有报告列表
  const existingReports = JSON.parse(localStorage.getItem('savedReports') || '[]')
  const reportId = route.params.id
  
  let reportData: any
  
  if (reportId) {
    // 编辑模式：更新现有报告
    const reportIndex = existingReports.findIndex((r: any) => String(r.id) === String(reportId))
    if (reportIndex !== -1) {
      reportData = {
        ...existingReports[reportIndex],
        patientName: formData.name || '未命名患者',
        reportType: reportType.value === 'dr' ? 'DR检查' : 
                    reportType.value === 'ct' ? 'CT检查' : 
                    reportType.value === 'mri' ? 'MRI检查' : '超声检查',
        examPart: formData.examPart || '未指定',
        reportDate: formData.reportDate || new Date().toISOString().split('T')[0],
        formData: { ...formData },
        signatures: { ...signatures },
        updatedAt: new Date().toISOString()
      }
      existingReports[reportIndex] = reportData
    } else {
      // 如果找不到现有报告，创建新报告
      reportData = {
        id: Date.now().toString(),
        reportNo: `RPT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        patientName: formData.name || '未命名患者',
        reportType: reportType.value === 'dr' ? 'DR检查' : 
                    reportType.value === 'ct' ? 'CT检查' : 
                    reportType.value === 'mri' ? 'MRI检查' : '超声检查',
        examPart: formData.examPart || '未指定',
        reportDate: formData.reportDate || new Date().toISOString().split('T')[0],
        status: 'draft',
        formData: { ...formData },
        signatures: { ...signatures },
        createdAt: new Date().toISOString()
      }
      existingReports.unshift(reportData)
    }
  } else {
    // 新建模式：创建新报告
    reportData = {
      id: Date.now().toString(),
      reportNo: `RPT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      patientName: formData.name || '未命名患者',
      reportType: reportType.value === 'dr' ? 'DR检查' : 
                  reportType.value === 'ct' ? 'CT检查' : 
                  reportType.value === 'mri' ? 'MRI检查' : '超声检查',
      examPart: formData.examPart || '未指定',
      reportDate: formData.reportDate || new Date().toISOString().split('T')[0],
      status: 'draft',
      formData: { ...formData },
      signatures: { ...signatures },
      createdAt: new Date().toISOString()
    }
    existingReports.unshift(reportData)
  }
  
  // 保存到localStorage
  localStorage.setItem('savedReports', JSON.stringify(existingReports))
  
  alert(reportId ? '报告更新成功！' : '报告保存成功！')
  
  // 跳转回报告中心
  router.push({ name: 'doctor.reports' })
}

const exportToPDF = async () => {
  // 动态导入jsPDF和html2canvas
  try {
    const { jsPDF } = await import('jspdf')
    const html2canvas = (await import('html2canvas')).default

    const element = reportPreview.value
    if (!element) {
      alert('无法找到报告内容')
      return
    }

    // 显示加载提示
    const loadingMsg = '正在生成PDF，请稍候...'
    console.log(loadingMsg)

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
      removeContainer: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png', 0.95)
      const pdf = new jsPDF('p', 'mm', 'a4')

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height

      // 设置页面边距
      const margin = 15
      const contentWidth = pdfWidth - (margin * 2)
      const contentHeight = (canvasHeight * contentWidth) / canvasWidth

      let heightLeft = contentHeight
      let position = margin

      // 添加第一页
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight)
      heightLeft -= (pdfHeight - (margin * 2))

      // 如果内容超过一页，继续添加新页
      while (heightLeft > 0) {
        pdf.addPage()
        position = -heightLeft + margin
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight)
        heightLeft -= (pdfHeight - (margin * 2))
      }

      // 生成文件名
      const fileName = `医学影像报告_${formData.patientName || '未命名'}_${new Date().getTime()}.pdf`
      
      // 保存PDF
      pdf.save(fileName)
      
      console.log('PDF生成成功！')
    }).catch(err => {
      console.error('PDF生成失败:', err)
      alert('生成PDF时出错，请重试。错误信息：' + err.message)
    })
  } catch (error) {
    console.error('导入PDF库失败:', error)
    alert('无法加载PDF生成库，请刷新页面重试。')
  }
}

const handlePrint = () => {
  // 创建新窗口来打印预览内容
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('无法打开打印窗口，请检查浏览器弹窗设置')
    return
  }

  const previewElement = reportPreview.value
  if (!previewElement) return

  // 获取预览区域的HTML和样式
  const htmlContent = previewElement.innerHTML
  
  // 获取相关的CSS样式
  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules || [])
          .map(rule => rule.cssText)
          .join('\n')
      } catch (e) {
        return ''
      }
    })
    .join('\n')

  // 写入到新窗口
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>打印报告</title>
        <style>
          ${styles}
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          /* 确保报告样式正确 */
          .report-title {
            text-align: center;
          }
          .report-title h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 8px 0;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `)
  
  printWindow.document.close()
  
  // 等待内容加载后打印
  setTimeout(() => {
    printWindow.print()
    // 打印后可选择关闭窗口
    // printWindow.close()
  }, 250)
}

const handleNewReport = () => {
  // 重置表单数据
  Object.assign(formData, {
    xrayNo: '',
    inpatientNo: '',
    reportDate: new Date().toISOString().split('T')[0],
    name: '',
    sex: '',
    age: '',
    department: '',
    bedNo: '',
    examPart: '',
    findings: '',
    diagnosis: ''
  })
  signatures.report = ''
  signatures.audit = ''
  
  // 清空文件输入
  if (reportSignatureInput.value) {
    reportSignatureInput.value.value = ''
  }
  if (auditSignatureInput.value) {
    auditSignatureInput.value.value = ''
  }
}

const goBackToReports = () => {
  router.push({ name: 'doctor.reports' })
}
</script>

<style scoped>
:root {
  --primary-color: #409EFF;
  --border-color: #DCDFE6;
  --text-color-primary: #303133;
  --text-color-regular: #606266;
  --text-color-secondary: #909399;
  --bg-color-page: #f0f2f5;
  --bg-color-preview-pane: #e9ebee;
}

.report-editor-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  background-color: var(--bg-color-page);
  color: var(--text-color-primary);
}

/* Header */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
}

.header-actions button, .header-actions a {
  margin-left: 12px;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.header-actions .btn-primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: #000 !important;
}

.header-actions .btn-default {
  background-color: #fff;
  color: var(--text-color-primary);
}

.header-actions .btn-secondary {
  border: none;
  background: none;
  color: var(--text-color-regular);
}

.header-actions .btn-secondary:hover {
  color: var(--primary-color);
}

/* Main Content Area */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Editor Pane (Left) */
.editor-pane {
  flex: 6;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--bg-color-page);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.editor-header h1 {
  font-size: 20px;
  margin: 0;
}

.editor-header p {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin: 4px 0 0 0;
}

.editor-header select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
}

.card {
  background-color: #fff;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 24px;
}

.patient-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.form-group {
  display: flex;
  align-items: center;
}

.form-group label {
  flex-shrink: 0;
  width: 70px;
  color: var(--text-color-regular);
  text-align: right;
  margin-right: 10px;
}

.form-group input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
}

.card h2 {
  font-size: 16px;
  margin: 0 0 16px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.card textarea {
  width: 100%;
  min-height: 100px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 10px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
}

.signatures-grid {
  display: flex;
  justify-content: space-around;
}

.signature-box {
  text-align: center;
  width: 45%;
}

.signature-pad {
  height: 120px;
  border: 2px dashed var(--border-color);
  border-radius: 4px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
  position: relative;
  overflow: hidden;
  background-color: #fafafa;
}

.signature-pad .placeholder {
  display: block;
  color: var(--text-color-secondary);
  font-size: 14px;
}

.signature-pad .signature-image {
  display: none;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.signature-pad.has-image .placeholder {
  display: none;
}

.signature-pad.has-image .signature-image {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.signature-box input[type="file"] {
  display: none;
}

.signature-actions {
  margin-top: 8px;
}

.signature-actions a {
  color: var(--primary-color);
  text-decoration: none;
  margin: 0 8px;
  cursor: pointer;
}

.signature-actions a:hover {
  text-decoration: underline;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  color: var(--text-color-secondary);
  font-size: 13px;
  padding: 0 24px;
}

/* Preview Pane (Right) */
.preview-pane {
  flex: 4;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--bg-color-preview-pane);
}

.preview-header {
  margin-bottom: 16px;
}

.preview-header h2 {
  font-size: 18px;
  margin: 0;
}

.preview-header p {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin: 4px 0 0 0;
}

#report-preview {
  background-color: #fff;
  padding: 40px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  border: 1px solid #ddd;
  margin: 0 auto;
  max-width: 800px;
  color: #000;
}

.report-title {
  text-align: center;
}

.report-title h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #000;
}

.report-patient-info {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px 16px;
  font-size: 14px;
  line-height: 1.6;
  border-bottom: 1.5px solid #000;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.report-patient-info div span:first-child {
  font-weight: 600;
  color: #000;
}

.report-patient-info div span:last-child {
  margin-left: 8px;
  font-family: 'Songti SC', 'SimSun', serif;
}

.report-section {
  margin-bottom: 20px;
}

.report-section h3 {
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #000;
  padding-bottom: 4px;
  margin: 0 0 12px 0;
  color: #000;
}

.report-section .content {
  font-size: 14px;
  line-height: 1.8;
  padding-left: 1em;
  min-height: 50px;
  font-family: 'Songti SC', 'SimSun', serif;
}

.report-section .content.pre-line {
  white-space: pre-line;
  line-height: 2;
}

.report-footer {
  margin-top: 40px;
}

.report-footer-signatures {
  display: flex;
  justify-content: flex-end;
  gap: 80px;
  font-size: 14px;
  font-weight: 600;
  padding-right: 40px;
  min-height: 80px;
  padding-top: 20px;
}

.report-footer-signatures span {
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
  flex: 0 1 auto;
  min-width: 0;
}

.report-footer-signatures img {
  max-height: 80px;
  max-width: 250px;
  width: 100%;
  height: auto;
  margin-top: 4px;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.report-footer-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 13px;
}

.report-footer-meta span {
  font-family: 'Songti SC', 'SimSun', serif;
}

@media print {
  .app-header,
  .editor-pane,
  .preview-pane .preview-header,
  .header-actions {
    display: none !important;
  }

  .preview-pane {
    padding: 0;
    background: white;
  }

  #report-preview {
    box-shadow: none;
    border: none;
    max-width: 100%;
  }
}
</style>

