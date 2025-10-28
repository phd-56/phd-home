<template>
  <div class="report-generation">
    <!-- 顶部导航栏 -->
    <div class="top-navbar">
      <div class="navbar-left">
        <div class="logo">🦴</div>
        <div class="brand-name">医学影像诊断系统</div>
      </div>
      <div class="navbar-right">
        <button class="btn btn-save-draft" @click="saveDraft">保存草稿</button>
        <button class="btn btn-generate-pdf" @click="generatePDF">生成PDF</button>
        <button class="btn btn-print" @click="printReport">打印报告</button>
        <button class="btn btn-return" @click="returnToDiagnosis">返回诊断</button>
        <div class="user-info">张医生</div>
      </div>
    </div>

    <div class="main-container">
      <!-- 左侧编辑区域 -->
      <div class="left-panel">
        <div class="panel-header">
          <h2>诊断报告生成</h2>
          <p>编辑并生成最终诊断报告，支持导出PDF格式</p>
        </div>

        <!-- 患者/检查信息卡片 -->
        <div class="info-card">
          <div class="card-title">患者/检查信息</div>
          <div class="info-grid">
            <div class="info-column">
              <div class="info-item">
                <label>X线号</label>
                <input v-model="reportData.xrayNumber" type="text" class="form-input">
              </div>
              <div class="info-item">
                <label>姓名</label>
                <input v-model="reportData.patientName" type="text" class="form-input">
              </div>
              <div class="info-item">
                <label>申请科室</label>
                <input v-model="reportData.department" type="text" class="form-input">
              </div>
            </div>
            <div class="info-column">
              <div class="info-item">
                <label>住院号</label>
                <input v-model="reportData.hospitalNumber" type="text" class="form-input">
              </div>
              <div class="info-item">
                <label>报告日期</label>
                <input v-model="reportData.reportDate" type="date" class="form-input">
              </div>
              <div class="info-item">
                <label>性别</label>
                <select v-model="reportData.gender" class="form-select">
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
              <div class="info-item">
                <label>年龄</label>
                <input v-model="reportData.age" type="text" class="form-input">
              </div>
              <div class="info-item">
                <label>床号</label>
                <input v-model="reportData.bedNumber" type="text" class="form-input">
              </div>
              <div class="info-item">
                <label>检查部位</label>
                <input v-model="reportData.examPart" type="text" class="form-input">
              </div>
            </div>
          </div>
        </div>

        <!-- X线所见 -->
        <div class="section">
          <div class="section-title">X线所见</div>
          <textarea 
            v-model="reportData.findings" 
            class="findings-textarea"
            placeholder="请输入X线所见内容..."
          ></textarea>
        </div>

        <!-- 诊断意见 -->
        <div class="section">
          <div class="section-title">诊断意见</div>
          <div class="diagnosis-list">
            <div 
              v-for="(diagnosis, index) in reportData.diagnoses" 
              :key="index"
              class="diagnosis-item"
            >
              <input 
                v-model="diagnosis.text" 
                type="text" 
                class="diagnosis-input"
                :placeholder="`诊断意见 ${index + 1}`"
              >
              <button 
                v-if="reportData.diagnoses.length > 1"
                @click="removeDiagnosis(index)" 
                class="remove-btn"
              >
                删除
              </button>
            </div>
            <button @click="addDiagnosis" class="add-diagnosis-btn">添加诊断意见</button>
          </div>
        </div>

        <!-- 医师签名 -->
        <div class="section">
          <div class="section-title">医师签名</div>
          <div class="signature-area">
            <div class="signature-item">
              <label>报告医师</label>
              <div class="signature-box">
                <div v-if="reportData.reportDoctorSignature" class="signature-preview">
                  <img :src="reportData.reportDoctorSignature" alt="报告医师签名">
                </div>
                <div v-else class="signature-placeholder">点击上传签名</div>
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="uploadSignature('reportDoctor', $event)"
                  style="display: none"
                  ref="reportDoctorInput"
                >
                <div class="signature-actions">
                  <button @click="triggerSignatureUpload('reportDoctor')" class="upload-btn">上传</button>
                  <button @click="clearSignature('reportDoctor')" class="clear-btn">清除</button>
                </div>
              </div>
            </div>
            <div class="signature-item">
              <label>审核医师</label>
              <div class="signature-box">
                <div v-if="reportData.reviewDoctorSignature" class="signature-preview">
                  <img :src="reportData.reviewDoctorSignature" alt="审核医师签名">
                </div>
                <div v-else class="signature-placeholder">点击上传签名</div>
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="uploadSignature('reviewDoctor', $event)"
                  style="display: none"
                  ref="reviewDoctorInput"
                >
                <div class="signature-actions">
                  <button @click="triggerSignatureUpload('reviewDoctor')" class="upload-btn">上传</button>
                  <button @click="clearSignature('reviewDoctor')" class="clear-btn">清除</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 页脚信息 -->
        <div class="footer-info">
          <div class="footer-left">注：报告签字有效</div>
          <div class="footer-right">报告日期：{{ reportData.reportDate }}</div>
        </div>
      </div>

      <!-- 右侧预览区域 -->
      <div class="right-panel">
        <div class="panel-header">
          <h2>报告预览</h2>
          <p>实时预览最终报告样式</p>
        </div>
        
        <div class="report-preview">
          <div id="report-preview" class="report-content">
            <div class="report-title">
              <h2>检查报告单</h2>
            </div>
            
            <div class="report-info">
              <div><span>X线号:</span> <span>{{ reportData.xrayNumber }}</span></div>
              <div><span>住院号:</span> <span>{{ reportData.hospitalNumber }}</span></div>
              <div></div>
              <div><span>姓名:</span> <span>{{ reportData.patientName }}</span></div>
              <div><span>性别:</span> <span>{{ reportData.gender }}</span></div>
              <div><span>年龄:</span> <span>{{ reportData.age }}</span></div>
              <div><span>申请科室:</span> <span>{{ reportData.department }}</span></div>
              <div><span>床号:</span> <span>{{ reportData.bedNumber }}</span></div>
              <div></div>
              <div style="grid-column: 1 / 4;">
                <span>检查部位:</span> <span>{{ reportData.examPart }}</span>
              </div>
            </div>

            <div class="report-section">
              <div class="section-title">X线所见</div>
              <div class="section-content">{{ reportData.findings }}</div>
            </div>

            <div class="report-section">
              <div class="section-title">诊断意见</div>
              <div class="diagnosis-list">
                <div 
                  v-for="(diagnosis, index) in reportData.diagnoses" 
                  :key="index"
                  class="diagnosis-item"
                >
                  {{ index + 1 }}. {{ diagnosis.text }}
                </div>
              </div>
            </div>

            <div class="report-section">
              <div class="section-title">医师签名</div>
              <div class="signature-section">
                <div class="signature-line">
                  <span>报告医师：</span>
                  <div v-if="reportData.reportDoctorSignature" class="signature-display">
                    <img :src="reportData.reportDoctorSignature" alt="报告医师签名">
                  </div>
                  <div v-else class="signature-placeholder">________________</div>
                </div>
                <div class="signature-line">
                  <span>审核医师：</span>
                  <div v-if="reportData.reviewDoctorSignature" class="signature-display">
                    <img :src="reportData.reviewDoctorSignature" alt="审核医师签名">
                  </div>
                  <div v-else class="signature-placeholder">________________</div>
                </div>
              </div>
            </div>

            <div class="report-footer">
              <div class="report-footer-signatures">
                <span>报告医师: <img :src="reportData.reportDoctorSignature" alt="报告医师签名"></span>
                <span>审核医师: <img :src="reportData.reviewDoctorSignature" alt="审核医师签名"></span>
              </div>
              <div class="report-footer-meta">
                <span>注：报告签字有效</span>
                <span>报告日期: {{ reportData.reportDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 报告数据
const reportData = reactive({
  xrayNumber: '',
  patientName: '',
  department: '',
  hospitalNumber: '',
  reportDate: '',
  gender: '女',
  age: '',
  bedNumber: '',
  examPart: '',
  findings: '',
  diagnoses: [
    { text: '' }
  ],
  reportDoctorSignature: '',
  reviewDoctorSignature: ''
})

// 文件输入引用
const reportDoctorInput = ref<HTMLInputElement>()
const reviewDoctorInput = ref<HTMLInputElement>()

// 初始化
onMounted(() => {
  // 设置默认报告日期
  reportData.reportDate = new Date().toISOString().split('T')[0]
  
  // 从路由状态获取数据
  if (route.state) {
    console.log('从路由状态获取数据:', route.state)
    
    // 填充患者信息
    if (route.state.caseInfo) {
      reportData.patientName = route.state.caseInfo.patientName || ''
      reportData.gender = route.state.caseInfo.gender || '女'
      reportData.age = route.state.caseInfo.age || ''
      reportData.department = route.state.caseInfo.department || ''
      reportData.examPart = route.state.caseInfo.examPart || ''
      reportData.xrayNumber = route.state.caseInfo.caseNumber || ''
    }
    
    // 填充诊断信息
    if (route.state.diagnosisResult) {
      const diagnosis = route.state.diagnosisResult
      
      // 填充X线所见
      if (diagnosis.findings && diagnosis.findings.length > 0) {
        reportData.findings = diagnosis.findings.map((finding: any) => 
          `${finding.name}：${finding.description}`
        ).join('；')
      }
      
      // 填充诊断意见
      if (diagnosis.findings && diagnosis.findings.length > 0) {
        reportData.diagnoses = diagnosis.findings.map((finding: any) => ({
          text: finding.name
        }))
      }
    }
  }
})

// 添加诊断意见
const addDiagnosis = () => {
  reportData.diagnoses.push({ text: '' })
}

// 删除诊断意见
const removeDiagnosis = (index: number) => {
  reportData.diagnoses.splice(index, 1)
}

// 触发签名上传
const triggerSignatureUpload = (type: 'reportDoctor' | 'reviewDoctor') => {
  if (type === 'reportDoctor') {
    reportDoctorInput.value?.click()
  } else {
    reviewDoctorInput.value?.click()
  }
}

// 上传签名
const uploadSignature = (type: 'reportDoctor' | 'reviewDoctor', event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (type === 'reportDoctor') {
        reportData.reportDoctorSignature = result
      } else {
        reportData.reviewDoctorSignature = result
      }
      ElMessage.success('签名上传成功')
    }
    reader.readAsDataURL(file)
  }
}

// 清除签名
const clearSignature = (type: 'reportDoctor' | 'reviewDoctor') => {
  if (type === 'reportDoctor') {
    reportData.reportDoctorSignature = ''
  } else {
    reportData.reviewDoctorSignature = ''
  }
  ElMessage.info('签名已清除')
}

// 保存草稿
const saveDraft = () => {
  ElMessage.success('草稿已保存')
}

// 生成PDF
const generatePDF = async () => {
  try {
    ElMessage.info('正在生成PDF...')
    
    // 动态加载jsPDF和html2canvas
    const { jsPDF } = await import('jspdf')
    const html2canvas = (await import('html2canvas')).default
    
    const reportElement = document.getElementById('report-preview')
    if (!reportElement) {
      ElMessage.error('找不到报告预览元素')
      return
    }
    
    // 生成canvas
    const canvas = await html2canvas(reportElement, {
      scale: 2, // 提高分辨率
      useCORS: true, // 允许跨域图片
      backgroundColor: '#ffffff' // 确保背景是白色
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4') // A4 纸张 (210x297mm)
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    
    // 计算图像在PDF中的尺寸
    const margin = 15 // 15mm 边距
    const contentWidth = pdfWidth - (margin * 2)
    const contentHeight = (canvasHeight * contentWidth) / canvasWidth
    
    let heightLeft = contentHeight
    let position = margin // 初始Y轴位置（带上边距）
    
    // 添加第一页
    pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight)
    heightLeft -= (pdfHeight - (margin * 2)) // 减去一页的可用高度
    
    // 如果内容超出一页，循环添加新页
    while (heightLeft > 0) {
      pdf.addPage()
      position = -heightLeft + margin // 关键：Y轴位置为负，将图像向上"推"
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight)
      heightLeft -= (pdfHeight - (margin * 2))
    }
    
    // 保存PDF
    const fileName = `检查报告单_${reportData.patientName}_${reportData.reportDate}.pdf`
    pdf.save(fileName)
    
    ElMessage.success('PDF生成成功')
  } catch (error) {
    console.error('PDF生成失败:', error)
    ElMessage.error('PDF生成失败，请重试')
  }
}

// 打印报告
const printReport = () => {
  window.print()
}

// 返回诊断
const returnToDiagnosis = () => {
  router.back()
}
</script>

<style scoped>
.report-generation {
  min-height: 100vh;
  background: #f8fafc;
}

.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  font-size: 24px;
}

.brand-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save-draft {
  background: #f3f4f6;
  color: #374151;
}

.btn-save-draft:hover {
  background: #e5e7eb;
}

.btn-generate-pdf {
  background: #3b82f6;
  color: white;
}

.btn-generate-pdf:hover {
  background: #2563eb;
}

.btn-print {
  background: #10b981;
  color: white;
}

.btn-print:hover {
  background: #059669;
}

.btn-return {
  background: #6b7280;
  color: white;
}

.btn-return:hover {
  background: #4b5563;
}

.user-info {
  font-size: 14px;
  color: #6b7280;
  margin-left: 8px;
}

.main-container {
  display: flex;
  height: calc(100vh - 80px);
}

.left-panel {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: white;
  margin: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.right-panel {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: white;
  margin: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.panel-header {
  margin-bottom: 24px;
}

.panel-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.panel-header p {
  font-size: 14px;
  color: #6b7280;
}

.info-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-item {
  margin-bottom: 16px;
}

.info-item label {
  display: block;
  font-size: 14px;
  color: #374151;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-input, .form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.findings-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
}

.findings-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.diagnosis-list {
  space-y: 12px;
}

.diagnosis-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.diagnosis-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.diagnosis-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.remove-btn {
  padding: 6px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.remove-btn:hover {
  background: #dc2626;
}

.add-diagnosis-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.add-diagnosis-btn:hover {
  background: #2563eb;
}

.signature-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.signature-item {
  text-align: center;
}

.signature-item label {
  display: block;
  font-size: 14px;
  color: #374151;
  margin-bottom: 12px;
  font-weight: 500;
}

.signature-box {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.signature-box:hover {
  border-color: #3b82f6;
}

.signature-preview img {
  max-width: 100%;
  max-height: 80px;
  object-fit: contain;
}

.signature-placeholder {
  color: #9ca3af;
  font-size: 14px;
}

.signature-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.upload-btn, .clear-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.upload-btn {
  background: #3b82f6;
  color: white;
}

.upload-btn:hover {
  background: #2563eb;
}

.clear-btn {
  background: #6b7280;
  color: white;
}

.clear-btn:hover {
  background: #4b5563;
}

.footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
  color: #6b7280;
}

.report-preview {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  min-height: 600px;
}

.report-content {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-family: 'Times New Roman', serif;
  color: #000;
}

.report-title {
  text-align: center;
  margin-bottom: 30px;
}

.report-title h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #000;
}

.report-title h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #000;
}

.report-info {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 8px 16px;
  font-size: 14px;
  line-height: 1.6;
  border-bottom: 1.5px solid #000;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.info-row {
  display: contents;
}

.info-row span:first-child {
  font-weight: 600;
  color: #000;
}

.info-row span:last-child {
  margin-left: 8px;
  font-family: 'Songti SC', 'SimSun', serif;
}

.report-section {
  margin-bottom: 20px;
}

.report-section .section-title {
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #000;
  padding-bottom: 4px;
  margin: 0 0 12px 0;
  color: #000;
}

.section-content {
  font-size: 14px;
  line-height: 1.8;
  padding-left: 1em;
  min-height: 50px;
  font-family: 'Songti SC', 'SimSun', serif;
  color: #000;
}

.report-section .diagnosis-list {
  font-size: 14px;
  line-height: 2;
  color: #000;
  white-space: pre-line;
  font-family: 'Songti SC', 'SimSun', serif;
}

.report-section .diagnosis-item {
  margin-bottom: 8px;
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
  height: 80px;
  align-items: center;
}

.report-footer-signatures span {
  display: flex;
  align-items: center;
}

.report-footer-signatures img {
  max-height: 60px;
  max-width: 150px;
  margin-left: 10px;
  object-fit: contain;
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
  .top-navbar,
  .left-panel {
    display: none;
  }
  
  .main-container {
    display: block;
  }
  
  .right-panel {
    margin: 0;
    padding: 0;
    background: white;
  }
  
  .report-preview {
    background: white;
    border: none;
    padding: 0;
  }
}
</style>
