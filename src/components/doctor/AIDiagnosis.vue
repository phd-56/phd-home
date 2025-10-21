<template>
  <div class="ai-diagnosis">
    <div class="diagnosis-header">
      <h2>AI智能诊断分析</h2>
      <el-button 
        type="primary" 
        icon="el-icon-zoom-in" 
        :loading="analyzing" 
        @click="runAIDiagnosis"
      >
        开始AI诊断
      </el-button>
    </div>

    <div class="diagnosis-content">
      <!-- 左侧：影像选择区域 -->
      <div class="left-panel">
        <div class="upload-section">
          <h3>选择诊断影像</h3>
          <el-upload
            class="upload-area"
            drag
            action="#"
            :before-upload="beforeImageUpload"
            :on-success="handleImageUpload"
            :auto-upload="true"
          >
            <el-icon class="upload-icon"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽影像文件到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__hint">支持 DICOM、JPG、PNG 格式</div>
          </el-upload>
        </div>

        <div class="image-selection">
          <h3>历史影像</h3>
          <div class="image-grid">
            <div 
              v-for="image in availableImages" 
              :key="image.id" 
              class="image-card" 
              :class="{ active: selectedImage?.id === image.id }"
              @click="selectImage(image)"
            >
              <img :src="image.thumbnail" :alt="image.name" />
              <div class="image-info">
                <div class="name">{{ image.name }}</div>
                <div class="date">{{ formatDate(image.uploadTime) }}</div>
                <div 
                  v-for="detection in aiDetections" 
                  :key="detection.x + detection.y"
                  class="detection-tag"
                  :style="{ backgroundColor: getConfidenceColor(detection.confidence) }"
                >
                  {{ detection.disease }} ({{ (detection.confidence * 100).toFixed(1) }}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间：影像显示区域 -->
      <div class="center-panel">
        <div class="image-display">
          <div ref="displayArea" class="display-area">
            <img 
              v-if="selectedImage" 
              :src="selectedImage.url" 
              :alt="selectedImage.name"
              :style="{ transform: `scale(${imageScale})` }"
            />
            <div v-else class="placeholder">请选择或上传影像进行诊断</div>
            
            <!-- AI检测框 -->
            <div 
              v-for="detection in aiDetections" 
              :key="detection.x + detection.y"
              class="detection-box"
              :style="{
                left: `${detection.x}%`,
                top: `${detection.y}%`,
                width: `${detection.width}%`,
                height: `${detection.height}%`,
                borderColor: getConfidenceColor(detection.confidence)
              }"
            >
              <div 
                class="detection-label"
                :style="{ backgroundColor: getConfidenceColor(detection.confidence) }"
              >
                {{ detection.disease }} ({{ (detection.confidence * 100).toFixed(1) }}%)
              </div>
            </div>
          </div>
        </div>

        <div class="image-controls">
          <div class="control-buttons">
            <el-button 
              icon="el-icon-zoom-out" 
              size="small" 
              @click="imageScale = Math.max(0.5, imageScale - 0.1)"
            />
            <el-button 
              icon="el-icon-zoom-in" 
              size="small" 
              @click="imageScale = Math.min(2, imageScale + 0.1)"
            />
          </div>
          
          <div class="zoom-level">
            缩放: {{ (imageScale * 100).toFixed(0) }}%
          </div>
        </div>
      </div>

      <!-- 右侧：诊断结果区域 -->
      <div class="right-panel">
        <div class="results-section">
          <h3>AI诊断结果</h3>
          
          <div v-if="diagnosisResult" class="result-content">
            <div class="result-category">
              <h4>疾病分类</h4>
              <div class="disease-list">
                <div v-for="disease in diagnosisResult.diseases" :key="disease.name" class="disease-item">
                  <div class="disease-header">
                    <span class="disease-name">{{ disease.name }}</span>
                    <el-tag :type="getConfidenceTagType(disease.confidence)">
                      {{ (disease.confidence * 100).toFixed(1) }}%
                    </el-tag>
                  </div>
                  <div class="description">{{ disease.description }}</div>
                </div>
              </div>
            </div>

            <div class="result-category">
              <h4>病灶检测</h4>
              <div class="detection-list">
                <div v-for="detection in diagnosisResult.detections" :key="detection.location" class="detection-item">
                  <div class="detection-info">
                    <span class="location">{{ detection.location }}</span>
                    <el-tag :type="getConfidenceTagType(detection.confidence)">
                      {{ (detection.confidence * 100).toFixed(1) }}%
                    </el-tag>
                  </div>
                  <div class="description">{{ detection.description }}</div>
                </div>
              </div>
            </div>

            <div class="result-category">
              <h4>可解释性分析</h4>
              <div class="explanation">{{ diagnosisResult.explanation }}</div>
              <div class="heatmap-preview">
                <img :src="diagnosisResult.heatmap" alt="AI分析热力图" />
              </div>
            </div>
          </div>

          <div v-else class="no-results">
            <el-empty description="暂无诊断结果，请选择影像并点击开始AI诊断"></el-empty>
          </div>
        </div>

        <div class="suggestions-section">
          <h3>诊断建议</h3>
          <div class="suggestions">
            <div class="suggestion-item">
              <el-icon><warning-filled /></el-icon>
              <span>建议进行进一步检查确认诊断结果</span>
            </div>
            <div class="suggestion-item">
              <el-icon><info-filled /></el-icon>
              <span>关注高风险病灶区域，及时制定治疗方案</span>
            </div>
          </div>

          <div class="report-section">
            <el-button 
              type="primary" 
              icon="el-icon-document" 
              @click="generateReport"
            >
              生成诊断报告
            </el-button>
          </div>

          <!-- 新增：诊断反馈按钮 -->
          <div class="feedback-section" v-if="diagnosisResult">
            <el-button 
              type="default" 
              icon="el-icon-comment" 
              class="feedback-button"
              @click="showFeedbackForm = true"
              style="width: 100%; margin-top: 15px;"
            >
              提交诊断反馈
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增：诊断反馈弹窗 -->
    <el-dialog 
      title="AI诊断反馈" 
      v-model="showFeedbackForm" 
      width="600px"
      :close-on-click-modal="false"
    >
      <feedback-form 
        :diagnosis-result="diagnosisResult"
        :image-id="selectedImage?.id"
        :loading="loading"
        :success="feedbackSuccess"
        @close="handleFeedbackClose"
        @submit-success="handleFeedbackSubmitted"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElTag, ElEmpty, ElDialog } from 'element-plus'
import { 
  ZoomIn, 
  ZoomOut, 
  UploadFilled, 
  InfoFilled, 
  WarningFilled, 
  Document, 
  Comment 
} from '@element-plus/icons-vue'
// 新增：导入反馈表单组件
import FeedbackForm from '@/components/doctor/FeedbackForm.vue'
import { useFeedbackStore } from '@/stores/feedbackStore'

interface MedicalImage {
  id: string
  name: string
  url: string
  thumbnail: string
  type: string
  uploadTime: string
}

interface AIDetection {
  x: number
  y: number
  width: number
  height: number
  disease: string
  confidence: number
}

interface DiagnosisResult {
  diseases: Array<{
    name: string
    confidence: number
    description: string
  }>
  detections: Array<{
    location: string
    confidence: number
    description: string
  }>
  explanation: string
  heatmap: string
}

// 新增：反馈表单显示状态
const showFeedbackForm = ref(false)
const feedbackSuccess = ref(false)
const loading = ref(false)

// 使用状态管理
const feedbackStore = useFeedbackStore()

const displayArea = ref<HTMLElement>()
const selectedImage = ref<MedicalImage | null>(null)
const imageScale = ref(1)
const analyzing = ref(false)
const aiDetections = ref<AIDetection[]>([])
const diagnosisResult = ref<DiagnosisResult | null>(null)

// 模拟可用影像数据
const availableImages = ref<MedicalImage[]>([
  {
    id: '1',
    name: '膝关节X光片',
    url: 'https://via.placeholder.com/600x400?text=Knee+X-Ray',
    thumbnail: 'https://via.placeholder.com/150x100?text=Knee',
    type: 'image/jpeg',
    uploadTime: '2024-01-15T10:30:00'
  },
  {
    id: '2',
    name: '腰椎MRI',
    url: 'https://via.placeholder.com/600x400?text=Spine+MRI',
    thumbnail: 'https://via.placeholder.com/150x100?text=Spine',
    type: 'image/jpeg',
    uploadTime: '2024-01-14T14:20:00'
  }
])

const beforeImageUpload = (file: File) => {
  const isValidType = ['image/jpeg', 'image/png', 'application/dicom'].includes(file.type)
  if (!isValidType) {
    ElMessage.error('只能上传 JPG、PNG 或 DICOM 格式的影像文件!')
    return false
  }
  return true
}

const handleImageUpload = (response: any, file: File) => {
  const newImage: MedicalImage = {
    id: Date.now().toString(),
    name: file.name,
    url: URL.createObjectURL(file),
    thumbnail: URL.createObjectURL(file),
    type: file.type,
    uploadTime: new Date().toISOString()
  }
  availableImages.value.push(newImage)
  selectImage(newImage)
  ElMessage.success('影像上传成功')
}

const selectImage = (image: MedicalImage) => {
  selectedImage.value = image
  aiDetections.value = []
  diagnosisResult.value = null
  imageScale.value = 1
}

const runAIDiagnosis = async () => {
  if (!selectedImage.value) return
  
  analyzing.value = true
  try {
    // 模拟AI诊断过程
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 模拟AI检测结果
    aiDetections.value = [
      { x: 25, y: 30, width: 15, height: 20, disease: '骨关节炎', confidence: 0.87 },
      { x: 60, y: 45, width: 12, height: 15, disease: '骨质增生', confidence: 0.76 }
    ]
    
    // 模拟诊断结果
    diagnosisResult.value = {
      diseases: [
        { name: '膝关节骨关节炎', confidence: 0.87, description: '中度骨关节炎，关节间隙变窄' },
        { name: '骨质增生', confidence: 0.76, description: '关节边缘骨质增生' },
        { name: '软骨损伤', confidence: 0.63, description: '轻度软骨磨损' }
      ],
      detections: [
        { location: '右膝关节内侧', confidence: 0.87, description: '关节间隙明显变窄' },
        { location: '股骨髁', confidence: 0.76, description: '边缘骨质增生' }
      ],
      explanation: 'AI模型在膝关节区域检测到明显的骨关节炎特征，包括关节间隙变窄和边缘骨质增生。这些特征与中度骨关节炎的诊断一致。',
      heatmap: 'https://via.placeholder.com/300x200?text=Heatmap'
    }
    
    ElMessage.success('AI诊断分析完成')
  } catch (error) {
    ElMessage.error('AI诊断分析失败')
  } finally {
    analyzing.value = false
  }
}

// 新增：反馈提交成功处理
const handleFeedbackSubmitted = async (feedbackData: any) => {
  loading.value = true
  try {
    // 提交反馈到store
    await feedbackStore.submitFeedback({
      ...feedbackData,
      caseId: selectedImage.value?.id || '',
      submittedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    })
    
    feedbackSuccess.value = true
    ElMessage.success('感谢您的反馈！我们将认真分析您的意见。')
    
    // 延迟关闭对话框，让用户看到成功提示
    setTimeout(() => {
      showFeedbackForm.value = false
      feedbackSuccess.value = false
    }, 1500)
  } catch (error) {
    console.error('提交反馈失败:', error)
    ElMessage.error('提交反馈失败，请重试')
  } finally {
    loading.value = false
  }
}

// 处理反馈弹窗关闭
const handleFeedbackClose = () => {
  showFeedbackForm.value = false
  feedbackSuccess.value = false
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return '#f56c6c' // 高置信度 - 红色
  if (confidence >= 0.6) return '#e6a23c' // 中置信度 - 橙色
  return '#67c23a' // 低置信度 - 绿色
}

const getConfidenceTagType = (confidence: number) => {
  if (confidence >= 0.8) return 'danger'
  if (confidence >= 0.6) return 'warning'
  return 'success'
}

const generateReport = () => {
  ElMessage.success('诊断报告生成成功')
  // 这里可以跳转到报告页面或打开报告对话框
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.ai-diagnosis {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.diagnosis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.diagnosis-content {
  display: flex;
  flex: 1;
  gap: 20px;
  height: calc(100vh - 160px);
}

.left-panel {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-section, .image-selection {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.upload-area {
  width: 100%;
}

.image-grid {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.image-card {
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.image-card.active {
  border-color: #409eff;
}

.image-card img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.image-info {
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.image-info .name {
  font-size: 12px;
  font-weight: bold;
}

.image-info .date {
  font-size: 10px;
  color: #666;
}

.detection-tag {
  font-size: 10px;
  color: white;
  padding: 2px 4px;
  border-radius: 2px;
  display: inline-block;
}

.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.image-display {
  flex: 1;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.display-area {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.display-area img {
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.3s;
}

.display-area .placeholder {
  color: #fff;
  font-size: 18px;
}

.detection-box {
  position: absolute;
  border: 2px solid;
  pointer-events: none;
}

.detection-label {
  position: absolute;
  top: -25px;
  left: 0;
  padding: 2px 6px;
  color: white;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
}

.image-controls {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.control-buttons {
  display: flex;
  gap: 5px;
}

.zoom-level {
  font-size: 14px;
  color: #666;
}

.right-panel {
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.results-section, .suggestions-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  flex: 1;
}

.suggestions-section {
  flex: 0;
}

.result-category {
  margin-bottom: 20px;
}

.result-category h4 {
  margin-bottom: 10px;
  color: #333;
}

.disease-list, .detection-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.disease-item, .detection-item {
  background: white;
  padding: 10px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.disease-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.disease-name {
  font-weight: bold;
}

.detection-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.location {
  font-weight: bold;
}

.description {
  font-size: 12px;
  color: #666;
}

.explanation {
  font-size: 14px;
  line-height: 1.5;
}

.heatmap-preview {
  margin-top: 10px;
}

.heatmap-preview img {
  width: 100%;
  border-radius: 4px;
}

.suggestions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  font-size: 14px;
}

.suggestion-item .el-icon {
  color: #e6a23c;
}

.report-section {
  margin-top: 20px;
  text-align: center;
}

.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

/* 新增：反馈相关样式 */
.feedback-section {
  margin-top: 15px;
}

.feedback-button .el-icon-comment {
  margin-right: 5px;
}
</style>