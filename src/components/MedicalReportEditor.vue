<template>
  <div class="report-editor">
    <!-- 明确的模式切换和操作按钮 -->
    <div class="editor-header">
      <div class="mode-indicator">
        <span class="mode-badge" :class="{ editing: editMode }">
          {{ editMode ? '编辑模式' : '预览模式' }}
        </span>
        <span class="mode-hint" v-if="editMode">点击下方内容区域进行编辑</span>
      </div>
      
      <div class="action-buttons">
        <!-- 模式切换按钮 -->
        <button 
          @click="toggleEditMode" 
          class="mode-toggle"
          :class="{ active: editMode }"
        >
          <span v-if="editMode">🔒 进入预览</span>
          <span v-else>✏️ 进入编辑</span>
        </button>

        <!-- 编辑模式专用按钮 -->
        <div class="edit-actions" v-if="editMode">
          <button @click="addSignature" class="btn-signature">
            🖊️ 添加签名
          </button>
          <button @click="clearAllSignatures" class="btn-clear">
            🗑️ 清除签名
          </button>
          <button @click="resetToAIContent" class="btn-reset">
            🔄 重置为AI内容
          </button>
        </div>

        <!-- 通用操作按钮 -->
        <div class="common-actions">
          <button @click="saveDraft" class="btn-save">
            💾 保存草稿
          </button>
          <button @click="exportToPDF" class="btn-export">
            📄 导出PDF
          </button>
          <button @click="printReport" class="btn-print">
            🖨️ 直接打印
          </button>
        </div>
      </div>
    </div>

    <!-- 报告内容 - 明确显示可编辑区域 -->
    <div class="report-container">
      <!-- 可编辑区域提示 -->
      <div class="editable-hint" v-if="editMode">
        <div class="hint-content">
          <span>💡 提示：在下方<span class="highlight">文本框</span>中进行编辑</span>
        </div>
      </div>

      <div 
        class="report-content" 
        :class="{ 
          'edit-mode': editMode,
          'preview-mode': !editMode
        }" 
        ref="reportContent"
      >
        <!-- 医院信息 -->
        <div class="hospital-header">
          <h1>{{ hospitalInfo.name || '智能医学影像诊断中心' }}</h1>
          <p>{{ hospitalInfo.department || '放射科' }}</p>
          <h2>医学影像诊断报告</h2>
        </div>

        <!-- 患者信息表格 -->
        <div class="section">
          <h3 class="section-title">患者基本信息</h3>
          <table class="patient-info">
            <tr>
              <td class="label">姓名</td>
              <td>
                <input 
                  v-if="editMode"
                  v-model="patientInfo.name" 
                  class="editable-input"
                  placeholder="请输入患者姓名"
                >
                <span v-else>{{ patientInfo.name || '________' }}</span>
              </td>
              <td class="label">性别</td>
              <td>
                <input 
                  v-if="editMode"
                  v-model="patientInfo.gender" 
                  class="editable-input"
                  placeholder="请输入性别"
                >
                <span v-else>{{ patientInfo.gender || '________' }}</span>
              </td>
              <td class="label">年龄</td>
              <td>
                <input 
                  v-if="editMode"
                  v-model="patientInfo.age" 
                  class="editable-input"
                  placeholder="请输入年龄"
                >
                <span v-else>{{ patientInfo.age || '________' }}</span>
              </td>
            </tr>
            <tr>
              <td class="label">病历号</td>
              <td>
                <input 
                  v-if="editMode"
                  v-model="patientInfo.medicalRecordNo" 
                  class="editable-input"
                  placeholder="请输入病历号"
                >
                <span v-else>{{ patientInfo.medicalRecordNo || '________' }}</span>
              </td>
              <td class="label">检查部位</td>
              <td><strong>{{ reportData.bodyPart }}</strong></td>
              <td class="label">报告日期</td>
              <td>{{ currentDate }}</td>
            </tr>
          </table>
        </div>

        <!-- 影像所见 - 使用 textarea 编辑 -->
        <div class="section">
          <h3 class="section-title">
            影像所见
            <span class="edit-badge" v-if="editMode">✏️ 可编辑</span>
          </h3>
          <div class="editable-area findings">
            <textarea 
              v-if="editMode"
              v-model="editedFindingsText"
              @input="updateFindings"
              class="editable-textarea"
              placeholder="请输入影像所见描述..."
              rows="6"
            ></textarea>
            <div v-else class="content-display" v-html="editedFindings"></div>
          </div>
        </div>

        <!-- 诊断意见 - 使用 textarea 编辑 -->
        <div class="section">
          <h3 class="section-title">
            诊断意见
            <span class="edit-badge" v-if="editMode">✏️ 可编辑</span>
          </h3>
          <div class="editable-area diagnosis">
            <textarea 
              v-if="editMode"
              v-model="editedDiagnosisText"
              @input="updateDiagnosis"
              class="editable-textarea"
              placeholder="请输入诊断意见..."
              rows="4"
            ></textarea>
            <div v-else class="content-display" v-html="editedDiagnosis"></div>
          </div>
        </div>

        <!-- 建议 - 使用 textarea 编辑 -->
        <div class="section">
          <h3 class="section-title">
            建议
            <span class="edit-badge" v-if="editMode">✏️ 可编辑</span>
          </h3>
          <div class="editable-area recommendation">
            <textarea 
              v-if="editMode"
              v-model="editedRecommendationText"
              @input="updateRecommendation"
              class="editable-textarea"
              placeholder="请输入建议..."
              rows="4"
            ></textarea>
            <div v-else class="content-display" v-html="editedRecommendation"></div>
          </div>
        </div>

        <!-- 医生签名区域 -->
        <div class="section signature-section">
          <h3 class="section-title">
            医生签名
            <span class="edit-badge" v-if="editMode">🖊️ 可签名</span>
          </h3>
          
          <div class="signature-fields">
            <!-- 报告医生 -->
            <div class="signature-field">
              <div class="doctor-info">
                <label>报告医生:</label>
                <input 
                  v-model="doctorInfo.reportDoctor" 
                  placeholder="请输入报告医生姓名"
                  :readonly="!editMode"
                  class="doctor-input"
                />
              </div>
              
              <div class="signature-area">
                <div v-if="editMode" class="signature-edit">
                  <div class="signature-instruction">
                    <small>在下方画板中签名</small>
                  </div>
                  <canvas 
                    ref="reportDoctorCanvas"
                    class="signature-canvas"
                    @mousedown="startSigning('reportDoctor', $event)"
                    @mousemove="drawSign"
                    @mouseup="stopSigning"
                    @mouseleave="stopSigning"
                    @touchstart="startSigning('reportDoctor', $event)"
                    @touchmove="drawSign"
                    @touchend="stopSigning"
                  ></canvas>
                  <button @click="clearSignature('reportDoctor')" class="btn-clear-signature">
                    清除
                  </button>
                </div>
                <div v-else class="signature-display">
                  <div v-if="signatures.reportDoctor" class="signature-image">
                    <img :src="signatures.reportDoctor" alt="报告医生签名">
                    <div class="signature-label">报告医生签名</div>
                  </div>
                  <div v-else class="no-signature">
                    <span>未签名</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 审核医生 -->
            <div class="signature-field">
              <div class="doctor-info">
                <label>审核医生:</label>
                <input 
                  v-model="doctorInfo.reviewDoctor" 
                  placeholder="请输入审核医生姓名"
                  :readonly="!editMode"
                  class="doctor-input"
                />
              </div>
              
              <div class="signature-area">
                <div v-if="editMode" class="signature-edit">
                  <div class="signature-instruction">
                    <small>在下方画板中签名</small>
                  </div>
                  <canvas 
                    ref="reviewDoctorCanvas"
                    class="signature-canvas"
                    @mousedown="startSigning('reviewDoctor', $event)"
                    @mousemove="drawSign"
                    @mouseup="stopSigning"
                    @mouseleave="stopSigning"
                    @touchstart="startSigning('reviewDoctor', $event)"
                    @touchmove="drawSign"
                    @touchend="stopSigning"
                  ></canvas>
                  <button @click="clearSignature('reviewDoctor')" class="btn-clear-signature">
                    清除
                  </button>
                </div>
                <div v-else class="signature-display">
                  <div v-if="signatures.reviewDoctor" class="signature-image">
                    <img :src="signatures.reviewDoctor" alt="审核医生签名">
                    <div class="signature-label">审核医生签名</div>
                  </div>
                  <div v-else class="no-signature">
                    <span>未签名</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="report-time">
            <p>报告时间: {{ currentDateTime }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- AI建议面板 -->
    <div class="ai-suggestions-panel" v-if="showAISuggestions && editMode">
      <div class="panel-header">
        <h4>🤖 AI诊断建议</h4>
        <button @click="applyAllSuggestions" class="btn-apply-all">
          应用所有建议
        </button>
      </div>
      <div class="suggestions-list">
        <div 
          v-for="(suggestion, index) in aiSuggestions" 
          :key="index"
          class="suggestion-item"
          :class="suggestion.type"
        >
          <div class="suggestion-content">
            <p>{{ suggestion.text }}</p>
          </div>
          <button @click="applySuggestion(suggestion)" class="btn-apply">
            应用
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface Props {
  reportData: any
  patientInfo: any
  hospitalInfo: any
}

const props = defineProps<Props>()
const emit = defineEmits(['export-complete', 'save-draft'])

// 编辑状态
const editMode = ref(true)
const reportContent = ref<HTMLElement>()

// 签名相关
const reportDoctorCanvas = ref<HTMLCanvasElement>()
const reviewDoctorCanvas = ref<HTMLCanvasElement>()
const isSigning = ref(false)
const currentSignType = ref<'reportDoctor' | 'reviewDoctor'>('reportDoctor')
const lastX = ref(0)
const lastY = ref(0)

// 数据状态 - 使用 textarea 文本
const editedFindingsText = ref('')
const editedDiagnosisText = ref('')
const editedRecommendationText = ref('')

// HTML 显示内容
const editedFindings = ref('')
const editedDiagnosis = ref('')
const editedRecommendation = ref('')

const doctorInfo = reactive({
  reportDoctor: '',
  reviewDoctor: ''
})

const signatures = reactive({
  reportDoctor: '',
  reviewDoctor: ''
})

// 计算属性
const currentDate = computed(() => new Date().toLocaleDateString('zh-CN'))
const currentDateTime = computed(() => new Date().toLocaleString('zh-CN'))

const aiSuggestions = computed(() => {
  if (!props.reportData?.yoloResult) return []
  
  const result = props.reportData.yoloResult
  const suggestions = []
  
  // 影像所见建议
  if (result.detectedDiseases.length > 0) {
    suggestions.push({
      text: `影像表现：${result.detectedDiseases.map((d: any) => 
        `${d.anatomicalLocation}${d.class}`
      ).join('，')}。`,
      type: 'findings',
      section: 'findings'
    })
  }
  
  // 诊断意见建议
  if (result.detectedDiseases.length > 0) {
    const primary = result.detectedDiseases[0]
    suggestions.push({
      text: `诊断意见：${primary.anatomicalLocation}${primary.class}。`,
      type: 'diagnosis', 
      section: 'diagnosis'
    })
  }
  
  return suggestions
})

const showAISuggestions = computed(() => aiSuggestions.value.length > 0)

// 初始化
onMounted(() => {
  initializeReportContent()
  initializeSignatureCanvases()
})

function initializeReportContent() {
  if (props.reportData?.yoloResult) {
    const result = props.reportData.yoloResult
    const findings = generateInitialFindings(result)
    const diagnosis = generateInitialDiagnosis(result)
    const recommendation = generateInitialRecommendation(result)
    
    // 设置文本和HTML内容
    editedFindingsText.value = htmlToText(findings)
    editedDiagnosisText.value = htmlToText(diagnosis)
    editedRecommendationText.value = htmlToText(recommendation)
    
    editedFindings.value = findings
    editedDiagnosis.value = diagnosis
    editedRecommendation.value = recommendation
  }
}

function htmlToText(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

function textToHtml(text: string): string {
  return text.replace(/\n/g, '<br>')
}

function generateInitialFindings(result: any): string {
  if (result.detectedDiseases.length === 0) {
    return '<p>影像表现未见明确异常。</p>'
  }
  
  return result.detectedDiseases.map((disease: any) => 
    `<p>${disease.anatomicalLocation}可见${disease.class}，${disease.clinicalSignificance}。</p>`
  ).join('')
}

function generateInitialDiagnosis(result: any): string {
  if (result.detectedDiseases.length === 0) {
    return '<p>未见明确异常征象。</p>'
  }
  
  const primary = result.detectedDiseases[0]
  return `<p>${primary.anatomicalLocation}${primary.class}。</p>`
}

function generateInitialRecommendation(result: any): string {
  if (result.detectedDiseases.length === 0) {
    return '<p>建议定期复查。</p>'
  }
  
  const hasFracture = result.detectedDiseases.some((d: any) => d.class.includes('fracture'))
  if (hasFracture) {
    return '<p>建议进一步行CT检查明确诊断，并请骨科会诊。</p>'
  }
  
  return '<p>建议临床随访，必要时进一步检查。</p>'
}

// 编辑模式控制
function toggleEditMode() {
  editMode.value = !editMode.value
  if (!editMode.value) {
    // 切换到预览模式时保存签名
    saveAllSignatures()
  }
}

// 内容更新
function updateFindings() {
  editedFindings.value = textToHtml(editedFindingsText.value)
}

function updateDiagnosis() {
  editedDiagnosis.value = textToHtml(editedDiagnosisText.value)
}

function updateRecommendation() {
  editedRecommendation.value = textToHtml(editedRecommendationText.value)
}

// AI建议功能
function applySuggestion(suggestion: any) {
  if (suggestion.section === 'findings') {
    editedFindingsText.value += `\n${suggestion.text}`
    updateFindings()
  } else if (suggestion.section === 'diagnosis') {
    editedDiagnosisText.value += `\n${suggestion.text}`
    updateDiagnosis()
  }
}

function applyAllSuggestions() {
  aiSuggestions.value.forEach(suggestion => {
    applySuggestion(suggestion)
  })
}

function resetToAIContent() {
  if (props.reportData?.yoloResult) {
    const result = props.reportData.yoloResult
    editedFindingsText.value = htmlToText(generateInitialFindings(result))
    editedDiagnosisText.value = htmlToText(generateInitialDiagnosis(result))
    editedRecommendationText.value = htmlToText(generateInitialRecommendation(result))
    updateFindings()
    updateDiagnosis()
    updateRecommendation()
  }
}

// 签名功能
function initializeSignatureCanvases() {
  ;[reportDoctorCanvas.value, reviewDoctorCanvas.value].forEach(canvas => {
    if (canvas) {
      const ctx = canvas.getContext('2d')!
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      // 设置白色背景
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  })
}

function startSigning(type: 'reportDoctor' | 'reviewDoctor', event: MouseEvent | TouchEvent) {
  if (!editMode.value) return
  
  isSigning.value = true
  currentSignType.value = type
  
  const canvas = getCurrentCanvas()
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')!
  const rect = canvas.getBoundingClientRect()
  
  // 获取正确的坐标
  let clientX, clientY
  if (event instanceof MouseEvent) {
    clientX = event.clientX
    clientY = event.clientY
  } else {
    clientX = event.touches[0].clientX
    clientY = event.touches[0].clientY
  }
  
  lastX.value = clientX - rect.left
  lastY.value = clientY - rect.top
  
  ctx.beginPath()
  ctx.moveTo(lastX.value, lastY.value)
  
  // 阻止默认行为
  event.preventDefault()
}

function drawSign(event: MouseEvent | TouchEvent) {
  if (!isSigning.value) return
  
  const canvas = getCurrentCanvas()
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')!
  const rect = canvas.getBoundingClientRect()
  
  // 获取正确的坐标
  let clientX, clientY
  if (event instanceof MouseEvent) {
    clientX = event.clientX
    clientY = event.clientY
  } else {
    clientX = event.touches[0].clientX
    clientY = event.touches[0].clientY
  }
  
  const currentX = clientX - rect.left
  const currentY = clientY - rect.top
  
  ctx.lineTo(currentX, currentY)
  ctx.stroke()
  
  lastX.value = currentX
  lastY.value = currentY
  
  // 阻止默认行为避免页面滚动
  event.preventDefault()
}

function stopSigning() {
  if (!isSigning.value) return
  
  isSigning.value = false
  saveAllSignatures()
}

function getCurrentCanvas(): HTMLCanvasElement | null {
  const canvas = currentSignType.value === 'reportDoctor' 
    ? reportDoctorCanvas.value 
    : reviewDoctorCanvas.value
  
  return canvas || null
}

function saveAllSignatures() {
  if (reportDoctorCanvas.value) {
    signatures.reportDoctor = reportDoctorCanvas.value.toDataURL()
  }
  if (reviewDoctorCanvas.value) {
    signatures.reviewDoctor = reviewDoctorCanvas.value.toDataURL()
  }
}

function clearSignature(type: 'reportDoctor' | 'reviewDoctor') {
  const canvas = type === 'reportDoctor' ? reportDoctorCanvas.value : reviewDoctorCanvas.value
  if (canvas) {
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // 重新设置画笔样式
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    signatures[type] = ''
  }
}

function clearAllSignatures() {
  clearSignature('reportDoctor')
  clearSignature('reviewDoctor')
}

function addSignature() {
  // 可以在这里添加签名提示
  console.log('请在下方的签名区域进行签名')
}

// 保存和导出
function saveDraft() {
  const draft = {
    findings: editedFindings.value,
    diagnosis: editedDiagnosis.value,
    recommendation: editedRecommendation.value,
    doctorInfo: { ...doctorInfo },
    signatures: { ...signatures },
    timestamp: new Date().toISOString()
  }
  
  localStorage.setItem('medicalReportDraft', JSON.stringify(draft))
  emit('save-draft', draft)
  
  showMessage('草稿已保存', 'success')
}

async function exportToPDF() {
  try {
    // 切换到预览模式以确保签名保存
    editMode.value = false
    await nextTick()
    
    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!reportContent.value) {
      throw new Error('报告内容未找到')
    }

    console.log('开始生成PDF...')
    
    const canvas = await html2canvas(reportContent.value, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false
    })

    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    
    const pdfWidth = 210
    const imgHeight = (canvas.height * pdfWidth) / canvas.width
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight)
    
    const filename = `医学诊断报告_${props.reportData.bodyPart}_${Date.now()}.pdf`
    
    // 直接下载，不显示在页面上
    pdf.save(filename)
    
    console.log('PDF下载完成')
    emit('export-complete', filename)
    
    showMessage('PDF导出成功', 'success')
    
  } catch (error) {
    console.error('PDF导出失败:', error)
    showMessage('PDF导出失败，请重试', 'error')
  } finally {
    // 切换回编辑模式
    editMode.value = true
  }
}

function printReport() {
  window.print()
}

function showMessage(message: string, type: 'success' | 'error' | 'info' = 'info') {
  // 这里可以集成一个消息提示组件
  alert(message) // 临时使用alert，你可以替换为更优雅的提示
}

// 暴露方法给父组件
defineExpose({
  getEditedContent: () => ({
    findings: editedFindings.value,
    diagnosis: editedDiagnosis.value,
    recommendation: editedRecommendation.value
  }),
  doctorInfo,
  signatures
})
</script>

<style scoped>
/* 样式部分保持不变，与之前相同 */
.report-editor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
}

.mode-indicator {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mode-badge {
  padding: 5px 12px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
}

.mode-badge.editing {
  background: #ffd700;
  color: #333;
}

.mode-hint {
  font-size: 12px;
  opacity: 0.9;
}

.highlight {
  color: #ffd700;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.mode-toggle {
  padding: 10px 20px;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-toggle.active {
  background: #ffd700;
  color: #333;
  border-color: #ffd700;
}

.edit-actions,
.common-actions {
  display: flex;
  gap: 8px;
}

.edit-actions button,
.common-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-signature {
  background: #28a745;
  color: white;
}

.btn-clear {
  background: #dc3545;
  color: white;
}

.btn-reset {
  background: #fd7e14;
  color: white;
}

.btn-save {
  background: #17a2b8;
  color: white;
}

.btn-export {
  background: #6610f2;
  color: white;
}

.btn-print {
  background: #6f42c1;
  color: white;
}

.editable-hint {
  margin-bottom: 15px;
  padding: 10px;
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 6px;
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1976d2;
  font-size: 14px;
}

.report-container {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.report-content {
  padding: 25mm;
  min-height: 297mm;
}

.report-content.edit-mode {
  background: #fafafa;
}

.report-content.preview-mode {
  background: white;
}

.hospital-header {
  text-align: center;
  border-bottom: 2px solid #000;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.patient-info {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  border: 1px solid #000;
}

.patient-info td {
  padding: 8px 12px;
  border: 1px solid #000;
}

.patient-info .label {
  background: #f0f0f0;
  font-weight: bold;
  text-align: center;
  width: 80px;
}

.editable-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: inherit;
}

.editable-input:focus {
  outline: none;
  border-color: #409eff;
}

.section {
  margin: 25px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e0e0;
}

.edit-badge {
  font-size: 12px;
  padding: 2px 8px;
  background: #2196f3;
  color: white;
  border-radius: 10px;
}

.editable-area {
  border-radius: 6px;
  transition: all 0.3s;
}

.edit-mode .editable-area {
  border: 2px dashed #2196f3;
  background: #f8fdff;
}

.preview-mode .editable-area {
  border: 1px solid #e0e0e0;
  background: white;
}

.editable-textarea {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
  background: transparent;
}

.editable-textarea:focus {
  outline: none;
}

.content-display {
  padding: 12px;
  min-height: 50px;
}

.findings {
  border-left: 4px solid #4caf50;
}

.diagnosis {
  border-left: 4px solid #ff9800;
}

.recommendation {
  border-left: 4px solid #2196f3;
}

.signature-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid #ccc;
}

.signature-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 20px;
}

.signature-field {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.doctor-info label {
  font-weight: bold;
  min-width: 80px;
}

.doctor-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
}

.edit-mode .doctor-input {
  background: white;
}

.preview-mode .doctor-input {
  background: #f5f5f5;
  border: none;
}

.signature-area {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.signature-edit {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.signature-instruction {
  writing-mode: vertical-lr;
  text-orientation: mixed;
  font-size: 12px;
  color: #666;
}

.signature-canvas {
  border: 2px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: crosshair;
  width: 300px;
  height: 100px;
  touch-action: none;
}

.btn-clear-signature {
  padding: 4px 8px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.signature-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.signature-image img {
  max-width: 200px;
  max-height: 80px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.signature-label {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: 5px;
}

.no-signature {
  padding: 20px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  color: #999;
  text-align: center;
}

.report-time {
  text-align: center;
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  color: #666;
}

.ai-suggestions-panel {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.panel-header h4 {
  margin: 0;
  color: #28a745;
}

.btn-apply-all {
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: start;
  background: white;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.suggestion-item.findings {
  border-left: 3px solid #4caf50;
}

.suggestion-item.diagnosis {
  border-left: 3px solid #ff9800;
}

.suggestion-content {
  flex: 1;
  margin-right: 10px;
}

.suggestion-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.btn-apply {
  padding: 4px 8px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

@media print {
  .editor-header,
  .editable-hint,
  .ai-suggestions-panel,
  .edit-badge {
    display: none !important;
  }
  
  .report-container {
    box-shadow: none;
  }
  
  .report-content {
    padding: 0;
    background: white;
  }
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .action-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .signature-fields {
    grid-template-columns: 1fr;
  }
  
  .report-content {
    padding: 10mm;
  }
  
  .signature-canvas {
    width: 200px;
    height: 80px;
  }
}
</style>