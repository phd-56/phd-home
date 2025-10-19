<template>
  <div class="report-generator">
    <div class="generator-header">
      <h2>诊断报告生成</h2>
      <div class="header-actions">
        <el-button @click="previewReport">
          <el-icon><View /></el-icon>
          预览报告
        </el-button>
        <el-button type="primary" @click="generatePDF">
          <el-icon><Document /></el-icon>
          生成PDF
        </el-button>
        <el-button type="success" @click="saveReport">
          <el-icon><Check /></el-icon>
          保存报告
        </el-button>
      </div>
    </div>

    <div class="report-content">
      <!-- 左侧：报告编辑 -->
      <div class="editor-panel">
        <div class="case-selection">
          <h3>选择病例</h3>
          <el-select v-model="selectedCaseId" placeholder="请选择病例" @change="loadCaseData">
            <el-option
              v-for="caseItem in availableCases"
              :key="caseItem.caseId"
              :label="`${caseItem.patientName} - ${caseItem.caseId}`"
              :value="caseItem.caseId"
            />
          </el-select>
        </div>

        <div class="report-editor">
          <h3>报告编辑</h3>
          <el-form :model="reportForm" label-width="100px">
            <el-form-item label="报告标题">
              <el-input v-model="reportForm.title" placeholder="请输入报告标题" />
            </el-form-item>
            
            <el-form-item label="临床诊断">
              <el-input
                v-model="reportForm.clinicalDiagnosis"
                type="textarea"
                :rows="3"
                placeholder="请输入临床诊断"
              />
            </el-form-item>
            
            <el-form-item label="影像表现">
              <el-input
                v-model="reportForm.imagingFindings"
                type="textarea"
                :rows="4"
                placeholder="描述影像学表现"
              />
            </el-form-item>
            
            <el-form-item label="AI分析">
              <el-input
                v-model="reportForm.aiAnalysis"
                type="textarea"
                :rows="4"
                placeholder="AI分析结果"
              />
            </el-form-item>
            
            <el-form-item label="诊断意见">
              <el-input
                v-model="reportForm.diagnosisOpinion"
                type="textarea"
                :rows="3"
                placeholder="请输入诊断意见"
              />
            </el-form-item>
            
            <el-form-item label="治疗建议">
              <el-input
                v-model="reportForm.treatmentSuggestions"
                type="textarea"
                :rows="3"
                placeholder="请输入治疗建议"
              />
            </el-form-item>
            
            <el-form-item label="备注">
              <el-input
                v-model="reportForm.notes"
                type="textarea"
                :rows="2"
                placeholder="其他备注信息"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 电子签名 -->
        <div class="signature-section">
          <h3>电子签名</h3>
          <div class="signature-area">
            <div class="signature-preview">
              <img v-if="signatureData" :src="signatureData" alt="电子签名" />
              <div v-else class="no-signature">暂无签名</div>
            </div>
            <el-button @click="showSignatureDialog = true">
              {{ signatureData ? '重新签名' : '添加签名' }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧：报告预览 -->
      <div class="preview-panel">
        <h3>报告预览</h3>
        <div class="report-preview" ref="reportPreview">
          <div class="report-header">
            <div class="hospital-info">
              <h2>某某医院</h2>
              <p>医学影像诊断报告</p>
            </div>
            <div class="report-meta">
              <p>报告编号: {{ reportForm.reportId }}</p>
              <p>报告日期: {{ currentDate }}</p>
            </div>
          </div>

          <div class="patient-info">
            <h4>患者信息</h4>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="姓名">{{ selectedCase?.patientName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="性别">
                {{ selectedCase?.patientGender === 'male' ? '男' : '女' }}
              </el-descriptions-item>
              <el-descriptions-item label="年龄">{{ selectedCase?.patientAge || '-' }}岁</el-descriptions-item>
              <el-descriptions-item label="病历号">{{ selectedCase?.caseId || '-' }}</el-descriptions-item>
              <el-descriptions-item label="检查部位" :span="2">膝关节</el-descriptions-item>
              <el-descriptions-item label="临床表现" :span="2">
                {{ selectedCase?.symptoms || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="report-body">
            <div class="report-section">
              <h4>影像学表现</h4>
              <p>{{ reportForm.imagingFindings || '请输入影像学表现...' }}</p>
            </div>

            <div class="report-section">
              <h4>AI智能分析</h4>
              <p>{{ reportForm.aiAnalysis || '请输入AI分析结果...' }}</p>
            </div>

            <div class="report-section">
              <h4>诊断意见</h4>
              <p>{{ reportForm.diagnosisOpinion || '请输入诊断意见...' }}</p>
            </div>

            <div class="report-section">
              <h4>治疗建议</h4>
              <p>{{ reportForm.treatmentSuggestions || '请输入治疗建议...' }}</p>
            </div>
          </div>

          <div class="report-footer">
            <div class="doctor-signature">
              <div class="signature-area">
                <div class="signature-line"></div>
                <p>诊断医师: {{ currentDoctor }}</p>
                <div v-if="signatureData" class="signature-image">
                  <img :src="signatureData" alt="医师签名" />
                </div>
              </div>
            </div>
            <div class="report-date">
              <p>报告日期: {{ currentDate }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 电子签名对话框 -->
    <el-dialog v-model="showSignatureDialog" title="电子签名" width="500px">
      <div class="signature-dialog">
        <div class="signature-canvas-container">
          <canvas
            ref="signatureCanvas"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
          ></canvas>
        </div>
        <div class="signature-actions">
          <el-button @click="clearSignature">清除</el-button>
          <el-button type="primary" @click="saveSignature">保存签名</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { View, Document, Check } from '@element-plus/icons-vue'
import type { MedicalCase } from '@/types/medical'

interface ReportForm {
  reportId: string
  title: string
  clinicalDiagnosis: string
  imagingFindings: string
  aiAnalysis: string
  diagnosisOpinion: string
  treatmentSuggestions: string
  notes: string
}

// 模拟数据
const availableCases: MedicalCase[] = [
  {
    caseId: 'C20240001',
    patientName: '张三',
    patientAge: 45,
    patientGender: 'male',
    contact: '13800138000',
    symptoms: '右膝关节疼痛，活动受限',
    medicalHistory: '高血压病史5年',
    status: 'pending',
    createTime: '2024-01-15T10:30:00',
    doctorId: 'D001'
  },
  {
    caseId: 'C20240002',
    patientName: '李四',
    patientAge: 62,
    patientGender: 'female',
    contact: '13900139000',
    symptoms: '腰椎间盘突出，下肢麻木',
    medicalHistory: '糖尿病病史8年',
    status: 'diagnosed',
    createTime: '2024-01-14T14:20:00',
    doctorId: 'D001'
  }
]

const reportPreview = ref<HTMLElement>()
const signatureCanvas = ref<HTMLCanvasElement>()
const showSignatureDialog = ref(false)

const selectedCaseId = ref('')
const selectedCase = ref<MedicalCase | null>(null)
const signatureData = ref('')
const isDrawing = ref(false)
const lastX = ref(0)
const lastY = ref(0)

const currentDoctor = '张医生'
const currentDate = new Date().toLocaleDateString('zh-CN')

const reportForm = reactive<ReportForm>({
  reportId: `R${new Date().getTime()}`,
  title: '膝关节X光片诊断报告',
  clinicalDiagnosis: '',
  imagingFindings: '',
  aiAnalysis: '',
  diagnosisOpinion: '',
  treatmentSuggestions: '',
  notes: ''
})

const loadCaseData = () => {
  const caseItem = availableCases.find(c => c.caseId === selectedCaseId.value)
  if (caseItem) {
    selectedCase.value = caseItem
    // 自动填充一些报告内容
    reportForm.imagingFindings = `右侧膝关节X光片显示：关节间隙变窄，边缘骨质增生，符合骨关节炎表现。`
    reportForm.aiAnalysis = `AI分析检测到膝关节内侧间隙明显变窄（置信度87%），股骨髁边缘骨质增生（置信度76%）。`
    reportForm.diagnosisOpinion = `右侧膝关节骨关节炎（中度）`
    reportForm.treatmentSuggestions = `建议：1. 药物治疗；2. 物理治疗；3. 定期复查；4. 必要时考虑手术治疗。`
  }
}

const previewReport = () => {
  ElMessage.info('报告预览功能')
}

const generatePDF = async () => {
  ElMessage.success('PDF报告生成成功')
  // 这里可以集成html2pdf或类似库来生成PDF
}

const saveReport = () => {
  if (!selectedCase.value) {
    ElMessage.warning('请先选择病例')
    return
  }
  
  ElMessage.success('诊断报告保存成功')
}

const initSignatureCanvas = () => {
  if (!signatureCanvas.value) return
  
  const canvas = signatureCanvas.value
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return
  
  canvas.width = 400
  canvas.height = 200
  
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

const startDrawing = (event: MouseEvent) => {
  if (!signatureCanvas.value) return
  
  isDrawing.value = true
  const rect = signatureCanvas.value.getBoundingClientRect()
  lastX.value = event.clientX - rect.left
  lastY.value = event.clientY - rect.top
}

const draw = (event: MouseEvent) => {
  if (!isDrawing.value || !signatureCanvas.value) return
  
  const rect = signatureCanvas.value.getBoundingClientRect()
  const currentX = event.clientX - rect.left
  const currentY = event.clientY - rect.top
  
  const ctx = signatureCanvas.value.getContext('2d')
  if (!ctx) return
  
  ctx.beginPath()
  ctx.moveTo(lastX.value, lastY.value)
  ctx.lineTo(currentX, currentY)
  ctx.stroke()
  
  lastX.value = currentX
  lastY.value = currentY
}

const stopDrawing = () => {
  isDrawing.value = false
}

const clearSignature = () => {
  if (!signatureCanvas.value) return
  
  const ctx = signatureCanvas.value.getContext('2d')
  if (!ctx) return
  
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
}

const saveSignature = () => {
  if (!signatureCanvas.value) return
  
  signatureData.value = signatureCanvas.value.toDataURL('image/png')
  showSignatureDialog.value = false
  ElMessage.success('签名保存成功')
}

onMounted(() => {
  // 初始化签名画布
  if (showSignatureDialog.value) {
    nextTick(initSignatureCanvas)
  }
  
  // 默认选择第一个病例
  if (availableCases.length > 0) {
    selectedCaseId.value = availableCases[0].caseId
    loadCaseData()
  }
})
</script>

<style scoped>
.report-generator {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.generator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.report-content {
  display: flex;
  flex: 1;
  gap: 20px;
  height: calc(100vh - 160px);
}

.editor-panel {
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.case-selection, .report-editor, .signature-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.report-editor {
  flex: 1;
  overflow-y: auto;
}

.signature-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.signature-preview {
  width: 200px;
  height: 80px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signature-preview img {
  max-width: 100%;
  max-height: 100%;
}

.no-signature {
  color: #c0c4cc;
}

.preview-panel {
  flex: 1;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.report-preview {
  flex: 1;
  background: white;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #409eff;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.hospital-info h2 {
  margin: 0;
  color: #409eff;
}

.hospital-info p {
  margin: 5px 0 0 0;
  font-size: 16px;
  font-weight: bold;
}

.report-meta {
  text-align: right;
  font-size: 14px;
}

.patient-info {
  margin-bottom: 20px;
}

.patient-info h4 {
  margin-bottom: 10px;
  color: #333;
}

.report-body {
  margin-bottom: 30px;
}

.report-section {
  margin-bottom: 20px;
}

.report-section h4 {
  margin-bottom: 8px;
  color: #333;
  border-left: 4px solid #409eff;
  padding-left: 8px;
}

.report-section p {
  margin: 0;
  line-height: 1.6;
  text-indent: 2em;
}

.report-footer {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.doctor-signature {
  text-align: center;
}

.signature-line {
  width: 200px;
  border-bottom: 1px solid #000;
  margin-bottom: 5px;
}

.signature-image img {
  height: 40px;
  margin-top: 5px;
}

.report-date {
  text-align: right;
}

.signature-dialog {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.signature-canvas-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.signature-canvas-container canvas {
  width: 100%;
  height: 200px;
  background: white;
  cursor: crosshair;
}

.signature-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>