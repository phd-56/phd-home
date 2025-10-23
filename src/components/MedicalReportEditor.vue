<template>
  <div class="editor-container">
    <div class="editor-header">
      <div class="header-left">
        <button class="btn btn-primary" @click="createNewReport">新建报告</button>
      </div>
      <div class="header-right">
        <button class="btn btn-success" @click="saveReport">保存报告</button>
        <button class="btn btn-info" @click="exportToPDF">导出PDF</button>
        <button class="btn btn-secondary" @click="printReport">打印报告</button>
      </div>
    </div>
    
    <div class="report-container">
      <!-- 医院信息 -->
      <div class="hospital-info">
        <h2>{{ hospitalInfo.name }}</h2>
        <p>{{ hospitalInfo.department }}</p>
        <p>地址：{{ hospitalInfo.address }}</p>
        <p>联系方式：{{ hospitalInfo.contact }}</p>
        <p>报告编号：{{ hospitalInfo.reportNo }}</p>
      </div>
      
      <!-- 患者基本信息 -->
      <div class="section">
        <h3 class="section-title">患者基本信息</h3>
        <div class="patient-info-container">
          <div class="info-field">
            <label>姓名:</label>
            <input 
              v-model="patientInfo.name" 
              placeholder="请输入患者姓名"
              class="info-input"
            />
          </div>
          <div class="info-field">
            <label>年龄:</label>
            <input 
              v-model="patientInfo.age" 
              type="number"
              placeholder="请输入患者年龄"
              class="info-input"
            />
          </div>
          <div class="info-field">
            <label>性别:</label>
            <input 
              v-model="patientInfo.gender" 
              placeholder="请输入性别"
              class="info-input"
            />
          </div>
          <div class="info-field">
            <label>病历号:</label>
            <input 
              v-model="patientInfo.medicalRecordNumber" 
              placeholder="请输入病历号"
              class="info-input"
            />
          </div>
        </div>
      </div>

      <!-- 检查信息 -->
      <div class="section">
        <h3 class="section-title">检查信息</h3>
        <div class="examination-info">
          <div class="info-row">
            <div class="info-group">
              <label class="label">检查类型</label>
              <input 
                v-model="reportData.examinationType" 
                class="editable-input"
                placeholder="请输入检查类型"
              >
            </div>
            <div class="info-group">
              <label class="label">检查部位</label>
              <input 
                v-model="reportData.bodyPart" 
                class="editable-input"
                placeholder="请输入检查部位"
              >
            </div>
          </div>
          <div class="info-row">
            <div class="info-group">
              <label class="label">检查设备</label>
              <input 
                v-model="reportData.equipment" 
                class="editable-input"
                placeholder="请输入检查设备"
              >
            </div>
            <div class="info-group">
              <label class="label">申请科室</label>
              <input 
                v-model="patientInfo.department" 
                class="editable-input"
                placeholder="请输入申请科室"
              >
            </div>
          </div>
          <div class="info-row">
            <div class="info-group full-width">
              <label class="label">主诉</label>
              <textarea 
                v-model="patientInfo.chiefComplaint" 
                class="editable-textarea"
                placeholder="请输入主诉"
                rows="2"
              ></textarea>
            </div>
          </div>
          <div class="info-row">
            <div class="info-group full-width">
              <label class="label">临床病史</label>
              <textarea 
                v-model="patientInfo.clinicalHistory" 
                class="editable-textarea"
                placeholder="请输入临床病史"
                rows="3"
              ></textarea>
            </div>
          </div>
          <div class="info-row">
            <div class="info-group">
              <label class="label">报告日期</label>
              <span class="info-display">{{ reportData.reportDate || currentDate }}</span>
            </div>
            <div class="info-group">
              <label class="label">报告时间</label>
              <span class="info-display">{{ reportData.reportTime || new Date().toLocaleTimeString('zh-CN') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 影像所见 -->
      <div class="section">
        <h3 class="section-title">影像所见</h3>
        
        <!-- 影像上传区域 -->
        <div class="image-upload-section">
          <input 
            type="file" 
            @change="handleImageUpload" 
            accept="image/*" 
            class="image-upload-input"
            id="image-upload"
          />
          <label for="image-upload" class="upload-button">
            📁 上传影像
          </label>
        </div>
        
        <!-- 显示上传的影像 -->
        <div v-if="uploadedImage" class="uploaded-image-container">
          <img :src="uploadedImage" alt="上传的影像" class="uploaded-image" />
        </div>
        
        <div class="editable-area">
          <textarea 
            v-model="editedFindingsText"
            @input="updateFindings"
            class="editable-textarea"
            placeholder="请详细描述影像所见..."
            rows="8"
          ></textarea>
        </div>
      </div>

      <!-- 诊断意见 -->
      <div class="section">
        <h3 class="section-title">诊断意见</h3>
        <div class="editable-area">
          <textarea 
            v-model="editedDiagnosisText"
            @input="updateDiagnosis"
            class="editable-textarea"
            placeholder="请列出诊断意见..."
            rows="6"
          ></textarea>
        </div>
      </div>

      <!-- 建议 -->
      <div class="section">
        <h3 class="section-title">建议</h3>
        <div class="editable-area">
          <textarea 
            v-model="editedRecommendationText"
            @input="updateRecommendation"
            class="editable-textarea"
            placeholder="请提供详细的后续检查、治疗和随访建议..."
            rows="6"
          ></textarea>
        </div>
      </div>

      <!-- 医生签名区域 -->
      <div class="section signature-section">
        <h3 class="section-title">医生签名</h3>
        
        <div class="signature-fields vertical">
          <!-- 报告医生 -->
          <div class="signature-field vertical">
            <div class="doctor-info">
              <label>报告医生</label>
              <input 
                v-model="doctorInfo.reportDoctor" 
                class="doctor-input"
                placeholder="请输入医生姓名"
              >
            </div>
            <canvas 
              ref="reportSignatureCanvas"
              class="signature-canvas"
              @mousedown="startSigning($event, 'reportDoctor')"
              @mousemove="draw($event, 'reportDoctor')"
              @mouseup="stopSigning"
              @mouseleave="stopSigning"
              @touchstart="startSigning($event, 'reportDoctor')"
              @touchmove="draw($event, 'reportDoctor')"
              @touchend="stopSigning"
              width="400" 
              height="150"
            ></canvas>
            <button 
              class="clear-signature" 
              @click="clearSignature('reportDoctor')"
            >
              清除签名
            </button>
          </div>
          
          <!-- 审核医生 -->
          <div class="signature-field vertical">
            <div class="doctor-info">
              <label>审核医生</label>
              <input 
                v-model="doctorInfo.reviewDoctor" 
                class="doctor-input"
                placeholder="请输入医生姓名"
              >
            </div>
            <canvas 
              ref="reviewSignatureCanvas"
              class="signature-canvas"
              @mousedown="startSigning($event, 'reviewDoctor')"
              @mousemove="draw($event, 'reviewDoctor')"
              @mouseup="stopSigning"
              @mouseleave="stopSigning"
              @touchstart="startSigning($event, 'reviewDoctor')"
              @touchmove="draw($event, 'reviewDoctor')"
              @touchend="stopSigning"
              width="400" 
              height="150"
            ></canvas>
            <button 
              class="clear-signature" 
              @click="clearSignature('reviewDoctor')"
            >
              清除签名
            </button>
          </div>
        </div>
      </div>
      
      <!-- 报告时间 -->
      <div class="report-time">
        <p>报告时间：{{ currentDateTime }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { Ref } from 'vue'

// 生成报告编号
function generateReportNo(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `REP-${year}${month}${day}-${random}`;
}

// 默认模拟数据
const defaultHospitalInfo = {
  name: '智能医学影像诊断中心',
  department: '放射科',
  address: '北京市海淀区医院路88号',
  contact: '010-12345678',
  reportNo: generateReportNo()
}

const defaultPatientInfo = {
  name: '',
  gender: '',
  age: '',
  medicalRecordNumber: '',
  dateOfBirth: '',
  department: '',
  chiefComplaint: '',
  clinicalHistory: ''
}

const defaultReportData = {
  examinationType: '',
  bodyPart: '',
  equipment: '',
  reportDate: new Date().toLocaleDateString('zh-CN'),
  reportTime: new Date().toLocaleTimeString('zh-CN')
}

const defaultDoctorInfo = {
  reportDoctor: '',
  reviewDoctor: ''
}

// 响应式数据
const hospitalInfo = reactive({ ...defaultHospitalInfo })
const patientInfo = reactive({ ...defaultPatientInfo })
const reportData = reactive({ ...defaultReportData })
const doctorInfo = reactive({ ...defaultDoctorInfo })

// 计算属性 - 当前日期时间
const currentDate = computed(() => new Date().toLocaleDateString('zh-CN'))
const currentDateTime = computed(() => new Date().toLocaleString('zh-CN'))

// 编辑器文本状态
const editedFindingsText = ref('')
const editedDiagnosisText = ref('')
const editedRecommendationText = ref('')

// 上传的影像
const uploadedImage = ref<string>('')

// 签名相关状态
const reportSignatureCanvas = ref<HTMLCanvasElement>()
const reviewSignatureCanvas = ref<HTMLCanvasElement>()
const isSigning = ref(false)
const currentSignatureType = ref<'reportDoctor' | 'reviewDoctor'>('reportDoctor')
const signatures = ref({
  reportDoctor: '',
  reviewDoctor: ''
})

// 处理文件上传
function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  
  const file = target.files[0]
  const reader = new FileReader()
  
  reader.onload = (e) => {
    uploadedImage.value = e.target?.result as string
  }
  
  reader.readAsDataURL(file)
}

// 签名相关方法
function startSigning(event: MouseEvent | TouchEvent, type: 'reportDoctor' | 'reviewDoctor') {
  event.preventDefault()
  isSigning.value = true
  currentSignatureType.value = type
  const canvas = type === 'reportDoctor' ? reportSignatureCanvas.value : reviewSignatureCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.beginPath()
  
  let x, y
  if (event instanceof MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    x = event.clientX - rect.left
    y = event.clientY - rect.top
  } else {
    const rect = canvas.getBoundingClientRect()
    const touch = event.touches[0]
    x = touch.clientX - rect.left
    y = touch.clientY - rect.top
  }
  
  ctx.moveTo(x, y)
}

function draw(event: MouseEvent | TouchEvent, type: 'reportDoctor' | 'reviewDoctor') {
  if (!isSigning.value || currentSignatureType.value !== type) return
  
  const canvas = type === 'reportDoctor' ? reportSignatureCanvas.value : reviewSignatureCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  event.preventDefault()
  
  let x, y
  if (event instanceof MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    x = event.clientX - rect.left
    y = event.clientY - rect.top
  } else {
    const rect = canvas.getBoundingClientRect()
    const touch = event.touches[0]
    x = touch.clientX - rect.left
    y = touch.clientY - rect.top
  }
  
  ctx.lineTo(x, y)
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.stroke()
}

function stopSigning() {
  isSigning.value = false
  
  if (currentSignatureType.value === 'reportDoctor' && reportSignatureCanvas.value) {
    signatures.value.reportDoctor = reportSignatureCanvas.value.toDataURL()
  } else if (currentSignatureType.value === 'reviewDoctor' && reviewSignatureCanvas.value) {
    signatures.value.reviewDoctor = reviewSignatureCanvas.value.toDataURL()
  }
}

function clearSignature(type: 'reportDoctor' | 'reviewDoctor') {
  const canvas = type === 'reportDoctor' ? reportSignatureCanvas.value : reviewSignatureCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  signatures.value[type] = ''
}

// 编辑器内容更新方法
function updateFindings() {
  console.log('Findings updated:', editedFindingsText.value)
}

function updateDiagnosis() {
  console.log('Diagnosis updated:', editedDiagnosisText.value)
}

function updateRecommendation() {
  console.log('Recommendation updated:', editedRecommendationText.value)
}

// 报告操作方法
function createNewReport() {
  Object.assign(hospitalInfo, { ...defaultHospitalInfo, reportNo: generateReportNo() })
  Object.assign(patientInfo, defaultPatientInfo)
  Object.assign(reportData, defaultReportData)
  Object.assign(doctorInfo, defaultDoctorInfo)
  
  editedFindingsText.value = ''
  editedDiagnosisText.value = ''
  editedRecommendationText.value = ''
  uploadedImage.value = ''
  
  clearSignature('reportDoctor')
  clearSignature('reviewDoctor')
  
  console.log('New report created')
}

function saveReport() {
  const report = {
    hospitalInfo,
    patientInfo,
    reportData,
    doctorInfo,
    findings: editedFindingsText.value,
    diagnosis: editedDiagnosisText.value,
    recommendation: editedRecommendationText.value,
    uploadedImage: uploadedImage.value,
    signatures: signatures.value,
    createdAt: new Date().toISOString()
  }
  
  console.log('Report saved:', report)
  alert('报告保存成功！')
}

function exportToPDF() {
  console.log('Exporting to PDF...')
  // 导入PDFGenerator类
  import('@/utils/pdf-generator').then(({ PDFGenerator }) => {
    // 构建报告数据
    const reportDataForPDF = {
      caseNumber: hospitalInfo.reportNo,
      patientId: patientInfo.id,
      patientName: patientInfo.name,
      gender: patientInfo.gender,
      age: patientInfo.age,
      admissionDate: reportData.examineDate,
      doctorName: doctorInfo.name,
      status: 'completed',
      chiefComplaint: reportData.chiefComplaint || '未记录',
      presentIllness: reportData.presentIllness || '未记录',
      pastHistory: reportData.pastHistory || '未记录',
      examinationResults: editedFindingsText.value,
      diagnosis: [
        {
          diseaseName: editedDiagnosisText.value || '未指定诊断',
          diagnosisDate: new Date().toISOString()
        }
      ],
      treatmentPlan: [
        {
          treatmentName: '建议治疗方案',
          description: editedRecommendationText.value || '未提供治疗建议',
          treatmentType: 'other',
          startDate: new Date().toISOString()
        }
      ]
    };
    
    // 生成PDF文件名
    const fileName = `医疗报告_${hospitalInfo.reportNo}_${patientInfo.name}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.pdf`;
    
    // 生成PDF
    PDFGenerator.generateCaseReport(reportDataForPDF, fileName)
      .then(() => {
        console.log('PDF导出成功');
        // 可以添加成功提示
      })
      .catch(error => {
        console.error('PDF导出失败:', error);
        alert('PDF导出失败: ' + error.message);
      });
  }).catch(error => {
    console.error('导入PDFGenerator失败:', error);
    alert('PDF导出功能加载失败');
  });
}

function printReport() {
  window.print()
}

// 组件挂载时的初始化
onMounted(() => {
  console.log('Medical Report Editor mounted')
})
</script>

<style scoped>
.editor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.header-left,
.header-right {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary { background-color: #007bff; color: white; }
.btn-primary:hover { background-color: #0056b3; }
.btn-success { background-color: #28a745; color: white; }
.btn-success:hover { background-color: #218838; }
.btn-info { background-color: #17a2b8; color: white; }
.btn-info:hover { background-color: #138496; }
.btn-secondary { background-color: #6c757d; color: white; }
.btn-secondary:hover { background-color: #5a6268; }

.report-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
}

.hospital-info {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.hospital-info h2 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 24px;
}

.hospital-info p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.section {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.section-title {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.patient-info-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.info-field {
  display: flex;
  flex-direction: column;
  min-width: 150px;
  flex: 1;
}

.info-field label {
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.info-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.info-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.examination-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.info-group {
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
}

.info-group.full-width {
  flex: 1 1 100%;
  min-width: 100%;
}

.label {
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.editable-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.editable-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.editable-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s;
  font-family: inherit;
}

.editable-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.info-display {
  padding: 8px 0;
  font-size: 14px;
  color: #333;
}

.image-upload-section {
  margin-bottom: 15px;
}

.upload-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.upload-button:hover { background-color: #0056b3; }

.image-upload-input { display: none; }

.uploaded-image-container {
  margin-bottom: 15px;
  text-align: center;
}

.uploaded-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.editable-area { margin-top: 10px; }

.signature-section { margin-top: 30px; }

.signature-fields.vertical {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.signature-field.vertical {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.doctor-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.doctor-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
  transition: border-color 0.3s;
}

.doctor-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.signature-canvas {
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
}

.clear-signature {
  padding: 6px 16px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  align-self: flex-start;
  transition: background-color 0.3s;
}

.clear-signature:hover { background-color: #e64340; }

.report-time {
  margin-top: 20px;
  text-align: right;
  color: #666;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .header-left,
  .header-right {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .patient-info-container {
    flex-direction: column;
  }
  
  .info-field {
    width: 100%;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .info-group {
    width: 100%;
    min-width: unset;
  }
  
  .report-container {
    padding: 15px;
  }
  
  .hospital-info h2 {
    font-size: 20px;
  }
}
</style>