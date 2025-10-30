<template>
  <div class="report-detail-page">
    <header class="app-header">
      <span class="header-title">医学影像诊断系统</span>
      <div class="header-actions">
        <button class="btn-primary" @click="exportToPDF">导出PDF</button>
        <button class="btn-default" @click="handlePrint">打印报告</button>
        <a href="#" class="btn-secondary" @click.prevent="goBackToReports">返回报告中心</a>
      </div>
    </header>

    <main class="main-content">
      <!-- 只显示预览，无编辑功能 -->
      <div class="preview-pane">
        <div class="preview-header">
          <h2>报告详情</h2>
          <p>查看医学影像诊断报告</p>
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

const reportPreview = ref<HTMLElement>()

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
  // 从localStorage加载报告数据
  const reportId = route.params.id
  const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]')
  
  // 查找指定ID的报告
  const report = savedReports.find((r: any) => String(r.id) === String(reportId))
  
  if (report && report.formData) {
    // 加载报告数据
    Object.assign(formData, report.formData)
    Object.assign(signatures, report.signatures || {})
  } else {
    alert('报告不存在')
    goBackToReports()
  }
})

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

      const margin = 15
      const contentWidth = pdfWidth - (margin * 2)
      const contentHeight = (canvasHeight * contentWidth) / canvasWidth

      let heightLeft = contentHeight
      let position = margin

      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight)
      heightLeft -= (pdfHeight - (margin * 2))

      while (heightLeft > 0) {
        pdf.addPage()
        position = -heightLeft + margin
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight)
        heightLeft -= (pdfHeight - (margin * 2))
      }

      const fileName = `医学影像报告_${formData.patientName || '未命名'}_${new Date().getTime()}.pdf`
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
  // 询问是否打印PDF
  if (confirm('是否需要打印PDF版本报告？')) {
    exportToPDF()
  } else {
    // 普通打印
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('无法打开打印窗口，请检查浏览器弹窗设置')
      return
    }

    const previewElement = reportPreview.value
    if (!previewElement) return

    const htmlContent = previewElement.innerHTML
    
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
    
    setTimeout(() => {
      printWindow.print()
    }, 250)
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

.report-detail-page {
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
  justify-content: center;
}

/* Preview Pane */
.preview-pane {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--bg-color-preview-pane);
  max-width: 1200px;
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
</style>

