<template>
  <div class="report-preview">
    <!-- 操作工具栏 -->
    <div v-if="!isExporting" class="preview-toolbar">
      <el-button @click="goBack" type="primary" icon="Back">
        返回
      </el-button>
      <el-button @click="handleDirectPrint" type="success" icon="Printer" :loading="printing">
        直接打印
      </el-button>
      <el-button @click="exportToPDF" type="warning" icon="Download" :loading="exporting">
        导出PDF
      </el-button>
    </div>

    <!-- SPECT报告内容 -->
    <div ref="printContent" class="print-content" :class="{ 'printing': isPrinting }">
      <!-- SPECT号标题 -->
      <div class="spect-header">
        <h2>SPECT号</h2>
      </div>
      
      <!-- 患者基本信息表格 -->
      <table class="info-table">
        <tr>
          <td width="25%">姓名______ {{ patientInfo.name || '' }}</td>
          <td width="25%">性别______ {{ patientInfo.gender || '' }}</td>
          <td width="25%">年龄______ {{ patientInfo.age || '' }}</td>
          <td width="25%">住址______ {{ patientInfo.address || '' }}</td>
        </tr>
        <tr>
          <td>病室______ {{ patientInfo.room || '' }}</td>
          <td>床号______ {{ patientInfo.bedNumber || '' }}</td>
          <td>住院号______ {{ patientInfo.inpatientNumber || '' }}</td>
          <td>门诊号______ {{ patientInfo.outpatientNumber || '' }}</td>
        </tr>
        <tr>
          <td colspan="4">临床诊断______ {{ patientInfo.clinicalDiagnosis || '' }}</td>
        </tr>
      </table>

      <!-- 病史 -->
      <div class="section">
        <div class="section-label">病史：</div>
        <div class="underline-content">{{ reportData.medicalHistory || '' }}</div>
      </div>

      <!-- 辅助检查项目 -->
      <div class="section">
        <div class="section-label">辅助检查项目：</div>
        <div class="check-items">
          <div class="check-row">
            <span class="check-name">CT</span>
            <span class="check-result">{{ reportData.auxiliaryExams?.ct || '' }}</span>
            <span class="check-name">心电图</span>
            <span class="check-result">{{ reportData.auxiliaryExams?.ecg || '' }}</span>
          </div>
          <div class="check-row">
            <span class="check-name">X线</span>
            <span class="check-result">{{ reportData.auxiliaryExams?.xray || '' }}</span>
            <span class="check-name">化验结果</span>
            <span class="check-result">{{ reportData.auxiliaryExams?.labResults || '' }}</span>
          </div>
          <div class="check-row">
            <span class="check-name">超声</span>
            <span class="check-result">{{ reportData.auxiliaryExams?.ultrasound || '' }}</span>
            <span class="check-name">其它</span>
            <span class="check-result">{{ reportData.auxiliaryExams?.other || '' }}</span>
          </div>
        </div>
      </div>

      <!-- 临床诊断 -->
      <div class="section">
        <div class="section-label">临床诊断</div>
        <div class="underline-content">{{ reportData.clinicalDiagnosis || '' }}</div>
      </div>

      <!-- 申请检查项目 -->
      <div class="section">
        <div class="section-label">申请检查项目（请将项目上打圈"O"号）</div>
        <div class="exam-items">
          <div class="exam-row">
            <span 
              v-for="item in examItems" 
              :key="item"
              class="exam-item"
              :class="{ 'circled': isExamSelected(item) }"
            >
              {{ item }}
            </span>
          </div>
          <div class="other-exam">
            其他：{{ reportData.otherExams || '' }}
          </div>
        </div>
      </div>

      <!-- 临床检查部位目的及要求 -->
      <div class="section">
        <div class="section-label">临床检查部位目的及要求：</div>
        <div class="underline-content">{{ reportData.examPurpose || '' }}</div>
      </div>

      <!-- 底部签名区域 -->
      <div class="footer-section">
        <div class="fee-line">收费验讫</div>
        <div class="note-line">（以上请详细填写）</div>
        <div class="doctor-line">申请医师______ {{ doctorInfo.reportDoctor || '' }}</div>
        <div class="website">whsczp.1688.com</div>
        <div class="date-line">日期______ {{ currentDate }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const router = useRouter()
const route = useRoute()
const printContent = ref<HTMLElement>()

// 状态管理
const isPrinting = ref(false)
const isExporting = ref(false)
const printing = ref(false)
const exporting = ref(false)

// 检查项目列表
const examItems = ['骨', '甲状腺', '肝', '肾', '心功能', '肺', '淋巴结', '乳腺']

// 从路由参数获取数据
const reportData = ref({
  medicalHistory: '',
  clinicalDiagnosis: '',
  examPurpose: '',
  otherExams: '',
  requestedExams: [] as string[],
  auxiliaryExams: {
    ct: '',
    ecg: '',
    xray: '',
    labResults: '',
    ultrasound: '',
    other: ''
  },
  ...JSON.parse(route.query.reportData as string || '{}')
})

const patientInfo = ref({
  name: '',
  gender: '',
  age: '',
  address: '',
  room: '',
  bedNumber: '',
  inpatientNumber: '',
  outpatientNumber: '',
  clinicalDiagnosis: '',
  ...JSON.parse(route.query.patientInfo as string || '{}')
})

const doctorInfo = ref({
  reportDoctor: '',
  ...JSON.parse(route.query.doctorInfo as string || '{}')
})

// 计算属性
const currentDate = computed(() => new Date().toLocaleDateString('zh-CN'))

// 检查项目是否被选中
const isExamSelected = (item: string) => {
  return reportData.value.requestedExams?.includes(item) || false
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 直接打印功能
const handleDirectPrint = async () => {
  printing.value = true
  isPrinting.value = true
  isExporting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('请允许弹出窗口以进行打印')
      return
    }

    const printContentHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>SPECT检查申请单</title>
          <meta charset="UTF-8">
          <style>
            ${getPrintStyles()}
          </style>
        </head>
        <body>
          <div class="print-content">
            ${printContent.value?.innerHTML || ''}
          </div>
        </body>
      </html>
    `

    printWindow.document.write(printContentHTML)
    printWindow.document.close()
    
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      printWindow.onafterprint = () => {
        printWindow.close()
        printing.value = false
        isPrinting.value = false
        isExporting.value = false
      }
      
      // 备用关闭机制
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close()
          printing.value = false
          isPrinting.value = false
          isExporting.value = false
        }
      }, 3000)
    }
  } catch (error) {
    console.error('打印失败:', error)
    printing.value = false
    isPrinting.value = false
    isExporting.value = false
  }
}

// 导出PDF功能
const exportToPDF = async () => {
  if (!printContent.value) return
  
  exporting.value = true
  isExporting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const canvas = await html2canvas(printContent.value, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: printContent.value.scrollWidth,
      height: printContent.value.scrollHeight
    })
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = pdfWidth / imgWidth
    
    pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio)
    pdf.save(`SPECT申请单_${patientInfo.value.name || '未知'}_${Date.now()}.pdf`)
    
  } catch (error) {
    console.error('导出PDF失败:', error)
    alert('导出PDF失败，请重试')
  } finally {
    exporting.value = false
    isExporting.value = false
  }
}

const getPrintStyles = () => `
  @media print {
    @page {
      margin: 20mm;
      size: A4;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'SimSun', '宋体', serif;
      background: white;
      color: black;
      font-size: 14pt;
      line-height: 1.8;
    }
    
    .print-content {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border: none !important;
    }
    
    .preview-toolbar {
      display: none !important;
    }
    
    .underline-content {
      border-bottom: 1px solid #000 !important;
    }
    
    .exam-item.circled {
      background: transparent !important;
    }
    
    .exam-item.circled::before {
      content: "○" !important;
      margin-right: 4px !important;
    }
  }
  
  .report-preview {
    padding: 20px;
    background: #f5f5f5;
    min-height: 100vh;
  }
  
  .preview-toolbar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .print-content {
    max-width: 210mm;
    margin: 0 auto;
    padding: 25mm;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: 'SimSun', '宋体', serif;
    line-height: 2;
    min-height: 297mm;
    font-size: 16pt;
  }
  
  .printing {
    box-shadow: none !important;
  }
  
  .spect-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .spect-header h2 {
    margin: 0;
    font-size: 20pt;
    font-weight: bold;
  }
  
  .info-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
    border: 2px solid #000;
  }
  
  .info-table td {
    padding: 15px 10px;
    border: 1px solid #000;
    font-size: 14pt;
  }
  
  .section {
    margin-bottom: 35px;
  }
  
  .section-label {
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 16pt;
  }
  
  .underline-content {
    min-height: 30px;
    border-bottom: 1px solid #666;
    padding: 8px 0;
  }
  
  .check-items {
    margin-left: 20px;
  }
  
  .check-row {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
  }
  
  .check-name {
    display: inline-block;
    width: 80px;
    font-size: 14pt;
  }
  
  .check-result {
    width: 200px;
    border-bottom: 1px solid #666;
    margin-right: 60px;
    padding: 4px 8px;
    font-size: 14pt;
  }
  
  .exam-items {
    margin-left: 20px;
  }
  
  .exam-row {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
  }
  
  .exam-item {
    font-size: 14pt;
    position: relative;
    padding: 4px 8px;
  }
  
  .exam-item.circled::before {
    content: "○";
    margin-right: 6px;
    color: #000;
    font-weight: bold;
  }
  
  .other-exam {
    font-size: 14pt;
  }
  
  .footer-section {
    margin-top: 60px;
    text-align: left;
  }
  
  .fee-line, .note-line, .doctor-line, .date-line {
    margin-bottom: 20px;
    font-size: 14pt;
  }
  
  .website {
    margin: 25px 0;
    font-size: 12pt;
    color: #666;
    text-align: center;
  }
  
  .note-line {
    font-size: 12pt;
    color: #666;
  }
`

onMounted(() => {
  const style = document.createElement('style')
  style.textContent = getPrintStyles()
  document.head.appendChild(style)
})
</script>

<style scoped>
/* 移动端适配 */
@media (max-width: 768px) {
  .report-preview {
    padding: 10px;
  }
  
  .preview-toolbar {
    flex-direction: column;
  }
  
  .print-content {
    padding: 15mm;
    font-size: 14pt;
  }
  
  .check-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .check-result {
    width: 100%;
    margin-right: 0;
  }
  
  .exam-row {
    gap: 15px;
  }
  
  .info-table td {
    padding: 10px 5px;
    font-size: 12pt;
  }
}
</style>