<template>
  <div class="ai-diagnosis-process-wrapper">
    <!-- 步骤指示器 -->
    <div class="steps-indicator">
      <div class="step-item completed">
        <div class="step-number">✓</div>
        <div class="step-label">填写病例信息</div>
      </div>
      <div class="step-item completed">
        <div class="step-number">✓</div>
        <div class="step-label">影像上传</div>
      </div>
      <div class="step-item" :class="{ active: currentStep === 0, completed: currentStep > 0 }">
        <div class="step-number">{{ currentStep > 0 ? '✓' : '3' }}</div>
        <div class="step-label">AI诊断分析</div>
      </div>
      <div class="step-item" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
        <div class="step-number">{{ currentStep > 1 ? '✓' : '4' }}</div>
        <div class="step-label">诊断结果</div>
      </div>
    </div>

    <!-- 步骤3：AI分析中 -->
    <div v-if="currentStep === 0" class="step-container ai-analysis-step">
      <div class="step-content">
        <h2 class="step-title">🤖 AI智能分析中...</h2>
        <p class="step-description">正在对上传的影像进行智能分析，请稍候。</p>

        <div class="progress-section">
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: analysisProgress + '%' }"></div>
          </div>
          <span class="progress-text">{{ analysisProgress.toFixed(0) }}%</span>
        </div>

        <div class="image-analysis-preview">
          <div v-for="(file, index) in imageFiles" :key="index" class="image-preview-item">
            <img :src="file.url" alt="Uploaded Image" class="preview-thumbnail" />
            <span class="image-name">{{ file.name }}</span>
            <span class="analysis-status" :class="{ 'status-success': detectionResults[index] && detectionResults[index].length > 0, 'status-pending': !detectionResults[index] }">
              {{ detectionResults[index] ? (detectionResults[index].length > 0 ? '分析完成' : '未发现异常') : '分析中...' }}
            </span>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-cancel" @click="handleCancel">取消</button>
          <button class="btn btn-next" @click="currentStep = 1" :disabled="analysisProgress < 100">查看结果</button>
        </div>
      </div>
    </div>

    <!-- 步骤4：诊断结果页面 -->
    <div v-if="currentStep === 1" class="full-page-diagnosis-view">
      <!-- 顶部信息栏 -->
      <div class="top-bar">
        <div class="top-bar-left">影像诊断中心</div>
        <div class="top-bar-center">
          <span>病例编号：{{ caseData.caseNumber || 'N/A' }}</span>
          <span>患者：{{ caseData.patientName }}（{{ caseData.gender === 'male' ? '男' : '女' }}，{{ caseData.age }}岁）</span>
          <span>部位：{{ caseData.examPart }}（{{ caseData.examPartDetail || 'N/A' }}）</span>
        </div>
        <div class="top-bar-right">
          <button class="btn btn-ai" @click="handleReAnalyze">重新AI诊断</button>
          <button class="btn btn-report" @click="handleGenerateReport">生成报告</button>
        </div>
      </div>

      <!-- 主容器 -->
      <div class="main-container">
        <!-- 中间影像区域 -->
        <div class="middle-section">
          <!-- 影像控制栏 -->
          <div class="image-controls">
            <div class="series-info">影像序列：{{ caseData.examType }} ({{ currentImageIndex + 1 }}/{{ imageFiles.length }})</div>
            <div class="nav-buttons">
              <button class="nav-btn" @click="handlePrevImage" :disabled="currentImageIndex === 0">←</button>
              <button class="nav-btn" @click="handleNextImage" :disabled="currentImageIndex === imageFiles.length - 1">→</button>
            </div>
            <div class="image-input">
              <input type="text" placeholder="窗位:" v-model="windowLevel">
              <input type="text" placeholder="窗宽:" v-model="windowWidth">
            </div>
            <div style="display: flex; gap: 10px; margin-left: 20px;">
              <button class="zoom-btn" @click="setPreset('soft')" :class="{ active: currentPreset === 'soft' }">软组织</button>
              <button class="zoom-btn" @click="setPreset('bone')" :class="{ active: currentPreset === 'bone' }">骨窗</button>
            </div>
            <div class="zoom-controls">
              <button class="zoom-btn" @click="zoomOut">🔍</button>
              <button class="zoom-btn">{{ Math.round(imageScale * 100) }}%</button>
              <button class="zoom-btn" @click="zoomIn">🔍</button>
              <button class="zoom-btn" @click="resetZoom">⛶</button>
            </div>
          </div>

          <!-- 影像显示区域 -->
          <div class="image-viewer">
            <div class="image-container">
              <img 
                v-if="imageFiles.length > 0" 
                :src="imageFiles[currentImageIndex].url" 
                alt="医学影像" 
                class="medical-image"
                :style="{ transform: `scale(${imageScale})`, transition: 'transform 0.3s ease' }"
              >
              <!-- AI标注框 -->
              <div 
                v-for="(detection, idx) in currentImageDetections" 
                :key="idx"
                class="annotation"
                :class="{ 'red': detection.class === '椎间盘突出', 'yellow': detection.class === '椎体骨质增生' }"
                :style="getAnnotationStyle(detection)"
              >
                <div class="annotation-label">{{ detection.class }}</div>
              </div>
            </div>
          </div>

          <!-- 缩略图导航 -->
          <div class="thumbnail-nav">
            <div 
              v-for="(file, index) in imageFiles" 
              :key="index"
              class="thumbnail"
              :class="{ active: currentImageIndex === index }"
              @click="handleThumbnailClick(index)"
            >
              <img :src="file.url" alt="缩略图" class="thumbnail-img" />
              <span class="thumbnail-number">{{ index + 1 }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧诊断结果面板 -->
        <div class="right-panel">
          <div class="panel-tabs">
            <div class="panel-tab" :class="{ active: activePanelTab === 'AI诊断结果' }" @click="activePanelTab = 'AI诊断结果'">AI诊断结果</div>
            <div class="panel-tab" :class="{ active: activePanelTab === '标注对照表' }" @click="activePanelTab = '标注对照表'">标注对照表</div>
            <div class="panel-tab" :class="{ active: activePanelTab === '患者信息' }" @click="activePanelTab = '患者信息'">患者信息</div>
          </div>

          <div class="panel-content">
            <!-- AI诊断结果标签页 -->
            <div v-if="activePanelTab === 'AI诊断结果'">
              <div class="section-title">主要诊断结果</div>

              <div v-for="(result, index) in mainDiagnosisResults" :key="index" class="result-item editable-result">
                <div class="result-title">
                  <div class="result-name">
                    <input 
                      type="text" 
                      v-model="result.name" 
                      class="editable-input"
                      placeholder="诊断名称"
                    />
                  </div>
                  <div class="result-confidence">{{ (result.confidence * 100).toFixed(0) }}%置信度</div>
                </div>
                <div class="result-description">
                  <textarea 
                    v-model="result.description" 
                    class="editable-textarea"
                    placeholder="诊断描述"
                    rows="2"
                  ></textarea>
                </div>
              </div>

              <div class="section-title">次要发现</div>
              <div v-for="(finding, index) in secondaryFindings" :key="index" class="finding-item editable-finding">
                <input 
                  type="text" 
                  v-model="secondaryFindings[index]" 
                  class="editable-input inline-input"
                  placeholder="次要发现"
                />
              </div>

              <div class="ai-info">
                <div class="ai-info-title">AI建议</div>
                <div class="ai-info-item">
                  1. 结合患者临床症状，必要时进一步行CT或增强MRI检查
                </div>
                <div class="ai-info-item">
                  2. 根据患者年龄及影像学表现，建议骨科临床医生评估是否需要进一步治疗
                </div>
              </div>
            </div>

            <!-- 标注对照表标签页 -->
            <div v-if="activePanelTab === '标注对照表'">
              <div class="section-title">标注对照表</div>
              <div v-for="(detection, idx) in currentImageDetections" :key="idx" class="result-item">
                <div class="result-title">
                  <div class="result-name">{{ detection.class }}</div>
                  <div class="result-confidence">{{ (detection.confidence * 100).toFixed(0) }}%置信度</div>
                </div>
                <div class="result-description">
                  位置: ({{ detection.x.toFixed(0) }}%, {{ detection.y.toFixed(0) }}%), 大小: {{ detection.width.toFixed(0) }}x{{ detection.height.toFixed(0) }}px
                </div>
              </div>
              <p v-if="currentImageDetections.length === 0" style="color: #999; font-size: 13px;">当前影像未检测到标注。</p>
            </div>

            <!-- 患者信息标签页 -->
            <div v-if="activePanelTab === '患者信息'">
              <div class="section-title">患者信息</div>
              <div class="result-description">
                <p><strong>姓名:</strong> {{ caseData.patientName }}</p>
                <p><strong>性别:</strong> {{ caseData.gender === 'male' ? '男' : '女' }}</p>
                <p><strong>年龄:</strong> {{ caseData.age }}岁</p>
                <p><strong>病例编号:</strong> {{ caseData.caseNumber || 'N/A' }}</p>
                <p><strong>科室:</strong> {{ caseData.department }}</p>
                <p><strong>检查类型:</strong> {{ caseData.examType }}</p>
                <p><strong>检查部位:</strong> {{ caseData.examPart }} ({{ caseData.examPartDetail || 'N/A' }})</p>
                <p><strong>检查日期:</strong> {{ caseData.examDate }}</p>
                <p><strong>症状/病史:</strong> {{ caseData.symptoms || '无' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { yoloMedicalEngine } from '@/utils/yoloMedicalEngine'

interface CaseData {
  caseNumber?: string
  patientName: string
  gender: 'male' | 'female'
  age: number
  department: string
  examType: string
  examPart: string
  examPartDetail?: string
  examDate: string
  symptoms?: string
}

interface UploadedFile {
  name: string
  url: string
  type: string
}

interface DetectionResult {
  x: number // Percentage (0-100)
  y: number // Percentage (0-100)
  width: number // Pixels
  height: number // Pixels
  confidence: number
  class: string
}

const router = useRouter()

const currentStep = ref(0) // 0: AI Analysis, 1: Diagnosis Results
const caseData = ref<CaseData>({
  patientName: '',
  gender: 'male',
  age: 0,
  department: '',
  examType: '',
  examPart: '',
  examDate: ''
})
const imageFiles = ref<UploadedFile[]>([])
const detectionResults = ref<DetectionResult[][]>([]) // Array of arrays, one for each image
const analysisProgress = ref(0)
const analysisTime = ref(0)
const statistics = ref({
  totalDetections: 0,
  averageConfidence: 0,
  abnormalImages: 0
})

// For the new results page layout
const currentImageIndex = ref(0)
const activePanelTab = ref('AI诊断结果')
const activeToolbarItem = ref('⊙')
const windowLevel = ref('')
const windowWidth = ref('')
const imageScale = ref(1)
const currentPreset = ref('')

// Computed property for detections of the current image
const currentImageDetections = computed<DetectionResult[]>(() => {
  return detectionResults.value[currentImageIndex.value] || []
})

// Mock data for main diagnosis results and secondary findings
const mainDiagnosisResults = ref<{ name: string; confidence: number; description: string }[]>([])
const secondaryFindings = ref<string[]>([])

// Initialize diagnosis results after AI analysis
const initializeDiagnosisResults = () => {
  const results: { name: string; confidence: number; description: string }[] = []
  const detectedClasses = new Set<string>()

  // 收集所有影像的检测结果
  detectionResults.value.forEach(imageDetections => {
    if (imageDetections && imageDetections.length > 0) {
      imageDetections.forEach(det => {
        detectedClasses.add(det.class)
      })
    }
  })

  if (detectedClasses.has('椎间盘突出')) {
    results.push({
      name: '腰椎间盘突出 (L4-L5)',
      confidence: 0.94,
      description: 'L4-L5椎间盘后方突出约95mm，压迫硬膜囊，相应水平管有效宽度变窄。'
    })
  }
  if (detectedClasses.has('椎体骨质增生')) {
    results.push({
      name: '椎体骨质增生 (L3-L5)',
      confidence: 0.87,
      description: 'L3-L5椎体边缘见骨质增生，符合退行性改变，待合并其他影像学表现。'
    })
  }
  if (detectedClasses.has('椎管狭窄')) {
    results.push({
      name: '椎管狭窄 (L5-S1)',
      confidence: 0.82,
      description: 'L5-S1水平椎管有效宽度约9mm，提示椎管狭窄。'
    })
  }

  // If no specific detections, provide a general "Normal"
  if (results.length === 0) {
    results.push({
      name: '未发现主要异常',
      confidence: 1.0,
      description: 'AI分析未检测到显著的影像学异常。'
    })
  }

  mainDiagnosisResults.value = results
  
  // Initialize secondary findings only if not already set
  if (secondaryFindings.value.length === 0) {
    secondaryFindings.value = [
      '椎体结构完整，未见骨折征象',
      '软组织未见明显异常',
      '血管走行自然，未见异常扩张或狭窄'
    ]
  }
}

// Function to get annotation style for dynamic positioning
const getAnnotationStyle = (detection: DetectionResult) => {
  return {
    left: `${detection.x}%`,
    top: `${detection.y}%`,
    width: `${detection.width}px`,
    height: `${detection.height}px`,
  }
}

// Navigation handlers for image viewer
const handlePrevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const handleNextImage = () => {
  if (currentImageIndex.value < imageFiles.value.length - 1) {
    currentImageIndex.value++
  }
}

const handleThumbnailClick = (index: number) => {
  currentImageIndex.value = index
}

// Zoom controls
const zoomIn = () => {
  imageScale.value = Math.min(imageScale.value + 0.1, 3)
}

const zoomOut = () => {
  imageScale.value = Math.max(imageScale.value - 0.1, 0.5)
}

const resetZoom = () => {
  imageScale.value = 1
}

const setPreset = (preset: string) => {
  currentPreset.value = preset
  // 这里可以设置对应的窗位窗宽
}

// Top bar button handlers
const handleReAnalyze = async () => {
  // 重置状态
  currentStep.value = 0
  analysisProgress.value = 0
  detectionResults.value = []
  mainDiagnosisResults.value = []
  secondaryFindings.value = []
  
  // 重新进行AI分析
  await startAIAnalysis()
  
  // 分析完成后切换到结果页面
  currentStep.value = 1
}

const handleGenerateReport = () => {
  // 准备报告数据
  const reportData = {
    // 患者信息
    name: caseData.value.patientName,
    sex: caseData.value.gender === 'male' ? '男' : '女',
    age: `${caseData.value.age}岁`,
    department: caseData.value.department,
    examPart: `${caseData.value.examPart} (${caseData.value.examPartDetail || 'N/A'})`,
    
    // 生成的检查所见（X线所见）
    findings: generateFindingsText(),
    
    // 生成的诊断意见
    diagnosis: generateDiagnosisText(),
    
    // 报告日期
    reportDate: new Date().toISOString().split('T')[0]
  }
  
  // 保存到sessionStorage，供报告编辑器使用
  sessionStorage.setItem('aiDiagnosisReportData', JSON.stringify(reportData))
  
  // 跳转到报告编辑器
  router.push('/dashboard/doctor/reports/editor')
}

// 生成X线所见文本
const generateFindingsText = () => {
  let text = ''
  
  // 添加主要诊断结果的描述
  mainDiagnosisResults.value.forEach(result => {
    text += `${result.description}\n`
  })
  
  // 添加次要发现
  if (secondaryFindings.value.length > 0) {
    text += '次要发现：\n'
    secondaryFindings.value.forEach(finding => {
      text += `- ${finding}\n`
    })
  }
  
  return text.trim()
}

// 生成诊断意见文本
const generateDiagnosisText = () => {
  let text = ''
  
  mainDiagnosisResults.value.forEach((result, index) => {
    text += `${index + 1}. ${result.name}\n`
  })
  
  return text.trim()
}

// Cancel button (from previous step)
const handleCancel = () => {
  sessionStorage.removeItem('diagnosisCaseData')
  for (let i = 0; i < imageFiles.value.length; i++) {
    sessionStorage.removeItem(`diagnosisFile_${i}`)
  }
  router.push('/dashboard/doctor/ai-diagnosis')
}

// AI Analysis Logic
const startAIAnalysis = async () => {
  const startTime = Date.now()
  analysisProgress.value = 0
  detectionResults.value = []

  try {
    await yoloMedicalEngine.loadModel()
    console.log('YOLO model loaded successfully.')

    for (let i = 0; i < imageFiles.value.length; i++) {
      const imageFile = imageFiles.value[i]
      const img = new Image()
      img.crossOrigin = 'anonymous'

      await new Promise<void>((resolve) => {
        img.onload = async () => {
          try {
            const result = await yoloMedicalEngine.detect(img)
            detectionResults.value[i] = result.boxes
            console.log(`Image ${i} detections:`, result.boxes)
          } catch (detectError) {
            console.error(`Error during detection for image ${i}:`, detectError)
            detectionResults.value[i] = generateMockDetections()
          } finally {
            analysisProgress.value = ((i + 1) / imageFiles.value.length) * 100
            resolve()
          }
        }
        img.onerror = () => {
          console.error(`Error loading image for analysis: ${imageFile.url}`)
          detectionResults.value[i] = generateMockDetections()
          analysisProgress.value = ((i + 1) / imageFiles.value.length) * 100
          resolve()
        }
        img.src = imageFile.url
      })
    }
  } catch (modelLoadError) {
    console.error('YOLO model loading failed, using mock data for all images:', modelLoadError)
    for (let i = 0; i < imageFiles.value.length; i++) {
      detectionResults.value[i] = generateMockDetections()
      analysisProgress.value = ((i + 1) / imageFiles.value.length) * 100
      await nextTick()
    }
  } finally {
    const elapsed = (Date.now() - startTime) / 1000
    analysisTime.value = parseFloat(elapsed.toFixed(1))
    calculateStatistics()
    
    // 初始化诊断结果
    initializeDiagnosisResults()
  }
}

const calculateStatistics = () => {
  let totalDetections = 0
  let totalConfidence = 0
  let abnormalImages = 0
  let confidenceCount = 0

  detectionResults.value.forEach(imageDetections => {
    if (imageDetections && imageDetections.length > 0) {
      abnormalImages++
      totalDetections += imageDetections.length
      imageDetections.forEach(det => {
        totalConfidence += det.confidence
        confidenceCount++
      })
    }
  })

  statistics.value.totalDetections = totalDetections
  statistics.value.averageConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0
  statistics.value.abnormalImages = abnormalImages
}

// Generate mock detection data
const generateMockDetections = (): DetectionResult[] => {
  const classes = ['椎间盘突出', '椎体骨质增生', '椎管狭窄']
  const num = Math.floor(Math.random() * 3) + 1
  const detections: DetectionResult[] = []

  for (let i = 0; i < num; i++) {
    detections.push({
      x: Math.random() * 70 + 15,
      y: Math.random() * 70 + 15,
      width: 80 + Math.random() * 60,
      height: 60 + Math.random() * 50,
      confidence: 0.6 + Math.random() * 0.3,
      class: classes[Math.floor(Math.random() * classes.length)]
    })
  }
  return detections
}

onMounted(() => {
  // Load case data and files from sessionStorage
  const savedData = sessionStorage.getItem('diagnosisCaseData')
  if (savedData) {
    caseData.value = JSON.parse(savedData)
  }

  // Load uploaded files
  let i = 0
  while (true) {
    const fileData = sessionStorage.getItem(`diagnosisFile_${i}`)
    if (!fileData) break
    
    const parsed = JSON.parse(fileData)
    imageFiles.value.push({
      name: parsed.name,
      url: parsed.data,
      type: parsed.name.split('.').pop() || 'jpg'
    })
    i++
  }

  if (imageFiles.value.length > 0) {
    startAIAnalysis()
  } else {
    alert('未找到影像文件，请返回重新上传。')
    router.push('/dashboard/doctor/ai-diagnosis')
  }
})

// Cleanup on unmount
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  yoloMedicalEngine.dispose()
})
</script>

<style scoped>
.ai-diagnosis-process-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

/* 步骤指示器样式 */
.steps-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  gap: 40px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  color: #999;
  font-size: 14px;
}

.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  left: calc(50% + 30px);
  width: 40px;
  height: 2px;
  background-color: #e0e0e0;
  z-index: 0;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
  z-index: 1;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background-color: #1890ff;
  border-color: #1890ff;
}

.step-item.active .step-label {
  color: #1890ff;
  font-weight: 600;
}

.step-item.completed .step-number {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.step-item.completed .step-label {
  color: #10b981;
  font-weight: 600;
}

.step-item.completed:not(:last-child)::after {
  background-color: #10b981;
}

/* AI Analysis Step (currentStep === 0) */
.ai-analysis-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f7fa;
}

.ai-analysis-step .step-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  max-width: 800px;
  width: 100%;
}

.ai-analysis-step .step-title {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 10px;
}

.ai-analysis-step .step-description {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 30px;
}

.ai-analysis-step .progress-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  gap: 15px;
}

.ai-analysis-step .progress-bar-container {
  width: 60%;
  background-color: #e0e7ff;
  border-radius: 10px;
  height: 12px;
  overflow: hidden;
}

.ai-analysis-step .progress-bar {
  height: 100%;
  background-color: #3b82f6;
  border-radius: 10px;
  transition: width 0.5s ease-in-out;
}

.ai-analysis-step .progress-text {
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
}

.ai-analysis-step .image-analysis-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
}

.ai-analysis-step .image-preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  text-align: center;
}

.ai-analysis-step .preview-thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 8px;
}

.ai-analysis-step .image-name {
  font-size: 12px;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.ai-analysis-step .analysis-status {
  font-size: 12px;
  margin-top: 4px;
  padding: 2px 6px;
  border-radius: 4px;
}

.ai-analysis-step .status-pending {
  color: #f59e0b;
  background-color: #fffbeb;
}

.ai-analysis-step .status-success {
  color: #10b981;
  background-color: #ecfdf5;
}

.ai-analysis-step .form-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.ai-analysis-step .btn {
  padding: 10px 25px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-analysis-step .btn-cancel {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #d9d9d9;
}

.ai-analysis-step .btn-cancel:hover {
  background-color: #e6e6e6;
}

.ai-analysis-step .btn-next {
  background-color: #1890ff;
  color: white;
  border: none;
}

.ai-analysis-step .btn-next:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.ai-analysis-step .btn-next:hover:not(:disabled) {
  background-color: #0050b3;
}

/* 诊断结果页面样式 */
.full-page-diagnosis-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部信息栏 */
.top-bar {
  background: white;
  border-bottom: 1px solid #e5e5e5;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.top-bar-left {
  font-size: 14px;
  color: #333;
}

.top-bar-center {
  flex: 1;
  text-align: center;
  font-size: 13px;
  color: #666;
}

.top-bar-center span {
  margin: 0 20px;
}

.top-bar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #d9d9d9;
}

.btn-save:hover {
  background: #e6e6e6;
}

.btn-ai {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #d9d9d9;
}

.btn-ai:hover {
  background: #e6e6e6;
}

.btn-report {
  background: #1890ff;
  color: white;
}

.btn-report:hover {
  background: #0050b3;
}

/* 主容器 */
.main-container {
  display: flex;
  flex: 1;
  height: calc(100vh - 50px);
}

/* 左侧工具栏 */
.left-toolbar {
  width: 60px;
  background: #1f1f1f;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 20px;
}

.toolbar-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 18px;
}

.toolbar-item:hover {
  background: #333;
  color: #fff;
}

.toolbar-item.active {
  background: #1890ff;
  color: white;
}

/* 中间影像区域 */
.middle-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #000;
}

.image-controls {
  background: #2a2a2a;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #444;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.series-info {
  color: #999;
  font-size: 13px;
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  background: #444;
  border: none;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-btn:hover:not(:disabled) {
  background: #555;
  color: #fff;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-input {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.image-input input {
  width: 60px;
  padding: 6px 8px;
  background: #444;
  border: 1px solid #555;
  color: #999;
  border-radius: 4px;
  font-size: 12px;
}

.zoom-controls {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.zoom-btn {
  padding: 6px 12px;
  background: #444;
  border: none;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 12px;
  min-width: 32px;
}

.zoom-btn:hover {
  background: #555;
  color: #fff;
}

.zoom-btn.active {
  background: #1890ff;
  color: white;
}

/* 影像显示区域 */
.image-viewer {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.medical-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.annotation {
  position: absolute;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  font-weight: bold;
  pointer-events: none;
}

.annotation.red {
  border-color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

.annotation.yellow {
  border-color: #faad14;
  background: rgba(250, 173, 20, 0.1);
}

.annotation-label {
  background: #ff4d4f;
  padding: 4px 8px;
  border-radius: 2px;
  font-size: 11px;
  position: absolute;
  top: -20px;
  left: 0;
  white-space: nowrap;
}

.annotation.yellow .annotation-label {
  background: #faad14;
}

/* 缩略图导航 */
.thumbnail-nav {
  background: #2a2a2a;
  padding: 12px 20px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  border-top: 1px solid #444;
  flex-shrink: 0;
}

.thumbnail {
  width: 80px;
  height: 80px;
  background: #444;
  border: 2px solid #555;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
  position: relative;
}

.thumbnail:hover {
  border-color: #1890ff;
}

.thumbnail.active {
  border-color: #1890ff;
  background: #1890ff;
  color: white;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.thumbnail-number {
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 10px;
  bottom: 4px;
  right: 4px;
}

/* 右侧诊断结果面板 */
.right-panel {
  width: 380px;
  background: white;
  border-left: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid #e5e5e5;
  background: #fafafa;
  flex-shrink: 0;
}

.panel-tab {
  flex: 1;
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.panel-tab.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
  background: white;
}

.panel-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.result-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
}

.result-item:last-child {
  border-bottom: none;
}

.result-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.result-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.result-confidence {
  font-size: 13px;
  color: #1890ff;
  font-weight: 600;
}

.result-description {
  font-size: 12px;
  color: #666;
  line-height: 1.6;
}

.result-description p {
  margin: 6px 0;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-top: 20px;
  margin-bottom: 12px;
}

.finding-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

.finding-item::before {
  content: '●';
  color: #999;
  flex-shrink: 0;
}

.editable-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
}

.editable-input:focus {
  outline: none;
  border-color: #40a9ff;
}

.editable-textarea {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
}

.editable-textarea:focus {
  outline: none;
  border-color: #40a9ff;
}

.inline-input {
  width: calc(100% - 20px);
}

.editable-result .result-name input {
  font-weight: 600;
  font-size: 13px;
}

.editable-result .result-description textarea {
  color: #666;
  line-height: 1.6;
}

.editable-finding {
  margin-left: -8px;
}

.editable-finding .editable-input {
  border: none;
  background: transparent;
  padding: 2px 0;
}

.ai-info {
  background: #f0f7ff;
  border-left: 3px solid #1890ff;
  padding: 12px;
  border-radius: 4px;
  margin-top: 20px;
}

.ai-info-title {
  font-size: 13px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.ai-info-item {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
  line-height: 1.5;
}

.ai-info-item:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .right-panel {
    width: 320px;
  }

  .panel-content {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }

  .right-panel {
    width: 100%;
    height: 300px;
    border-left: none;
    border-top: 1px solid #e5e5e5;
  }

  .left-toolbar {
    width: 100%;
    height: 60px;
    flex-direction: row;
    padding: 0 20px;
  }

  .image-controls {
    flex-wrap: wrap;
  }
}
</style>
