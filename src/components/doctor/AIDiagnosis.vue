
<template>
<<<<<<< Updated upstream
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
=======
  <div class="ultimate-diagnosis">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>🦴 YOLO肌肉骨骼智能诊断系统</h1>
      <div class="system-status">
        <el-tag type="success">YOLO引擎: 就绪</el-tag>
        <el-tag type="info">版本: Ultimate v3.0</el-tag>
      </div>
    </div>

    <!-- 上传区域 -->
    <div class="upload-section">
      <el-card class="upload-card">
        <template #header>
          <div class="upload-header">
            <span>📤 上传医学影像</span>
            <el-tag type="danger">YOLO深度学习</el-tag>
          </div>
        </template>
        
        <el-upload
          class="ultimate-upload"
          drag
          action=""
          :before-upload="handleUltimateDiagnosis"
          :show-file-list="false"
          :disabled="loading"
          accept=".jpg,.jpeg,.png,.dcm"
        >
          <div class="upload-content">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
>>>>>>> Stashed changes
            <div class="el-upload__text">
              将肌肉骨骼影像拖到此处，或<em>点击上传</em>
            </div>
<<<<<<< Updated upstream
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
=======
            <div class="el-upload__tip">
              支持格式: JPEG, PNG, DICOM • YOLOv8医学专用模型
            </div>
          </div>
        </el-upload>
      </el-card>
    </div>

    <!-- 初始状态提示 -->
    <div v-if="!diagnosisResult && !loading" class="initial-state">
      <el-card>
        <div class="initial-content">
          <el-icon size="48" color="#909399"><Picture /></el-icon>
          <h3>👨‍⚕️ 欢迎使用AI诊断系统</h3>
          <p>请上传医学影像文件开始诊断分析</p>
        </div>
      </el-card>
    </div>

    <!-- 诊断结果 -->
    <div v-if="diagnosisResult && diagnosisResult.yoloResult" class="results-section">
      <el-card class="results-card">
        <template #header>
          <div class="result-header">
            <h2>🎯 诊断结果</h2>
            <div class="action-buttons">
    <el-button @click="startEditing" type="primary" class="btn-edit-report">
      📝 编辑报告
    </el-button>
    <el-button @click="previewReport" type="warning" class="btn-preview">
      👁️ 预览报告
    </el-button>
    <el-button @click="downloadReportDirectly" type="success" class="btn-download-direct">
      📄 直接下载
    </el-button>
    <el-button @click="resetDiagnosis" type="info" plain>
      🔄 重新诊断
    </el-button>
  </div>
          </div>
        </template>
        
        <!-- 显示诊断结果摘要 -->
        <div class="result-summary">
          <h3>诊断摘要</h3>
          <div class="summary-content">
            <p><strong>检查部位:</strong> {{ diagnosisResult.yoloResult.bodyPart }}</p>
            <p><strong>置信度:</strong> {{ diagnosisResult.yoloResult.confidenceScore }}%</p>
            <p><strong>发现数量:</strong> {{ diagnosisResult.yoloResult.detectedDiseases.length }}个</p>
            <p><strong>处理时间:</strong> {{ diagnosisResult.yoloResult.processingTime }}ms</p>
          </div>
        </div>

        <!-- 检测结果 -->
        <div class="detections-section">
          <h3>YOLO检测结果 ({{ diagnosisResult.yoloResult.detectedDiseases.length }}个发现)</h3>
          <div v-if="diagnosisResult.yoloResult.detectedDiseases.length > 0" class="detections-grid">
            <div 
              v-for="(detection, index) in diagnosisResult.yoloResult.detectedDiseases" 
              :key="index"
              class="detection-card"
              :class="detection.severity"
            >
              <div class="detection-header">
                <h4>{{ detection.anatomicalLocation }}</h4>
                <el-tag 
                  :type="detection.severity === '重度' ? 'danger' : 
                         detection.severity === '中度' ? 'warning' : 'success'"
                >
                  {{ detection.severity }}
                </el-tag>
              </div>
              <p class="detection-class">{{ detection.class }}</p>
              <p class="detection-desc">{{ detection.clinicalSignificance }}</p>
              <div class="detection-meta">
                <span class="confidence">置信度: {{ (detection.confidence * 100).toFixed(1) }}%</span>
                <span class="algorithm">YOLO检测</span>
              </div>
            </div>
          </div>
          <div v-else class="no-findings">
            <el-empty description="未发现异常病变" />
          </div>
        </div>

        <!-- 测量数据 -->
        <div v-if="diagnosisResult.yoloResult.measurements && diagnosisResult.yoloResult.measurements.length > 0" class="measurements-section">
          <h3>📏 定量测量分析</h3>
          <el-table :data="diagnosisResult.yoloResult.measurements" border>
            <el-table-column prop="type" label="测量项目" width="180" />
            <el-table-column prop="value" label="测量值" width="120">
              <template #default="scope">
                {{ scope.row.value }} {{ scope.row.unit }}
              </template>
            </el-table-column>
            <el-table-column prop="normalRange" label="正常范围" width="120" />
            <el-table-column prop="deviation" label="偏差" width="100">
              <template #default="scope">
                <span :class="scope.row.deviation > 0 ? 'deviation-positive' : 'deviation-negative'">
                  {{ scope.row.deviation > 0 ? '+' : '' }}{{ scope.row.deviation }}{{ scope.row.unit }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="significance" label="临床意义" />
          </el-table>
        </div>

        <!-- 热力图预览 -->
        <div v-if="diagnosisResult.yoloResult.heatmapData" class="heatmap-section">
          <h3>🔥 AI热力图分析</h3>
          <div class="heatmap-preview">
            <div class="heatmap-grid">
              <div 
                v-for="(row, i) in diagnosisResult.yoloResult.heatmapData" 
                :key="i"
                class="heatmap-row"
              >
                <div 
                  v-for="(value, j) in row" 
                  :key="j"
                  class="heatmap-cell"
                  :style="{
                    backgroundColor: `rgba(255, ${Math.round(255 * (1 - value))}, ${Math.round(255 * (1 - value))}, ${value})`
                  }"
                  :title="`置信度: ${(value * 100).toFixed(1)}%`"
                ></div>
              </div>
            </div>
            <div class="heatmap-legend">
              <span>低置信度</span>
              <div class="gradient-bar"></div>
              <span>高置信度</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 报告编辑区域 -->
    <div v-if="showReportEditor && diagnosisResult && diagnosisResult.yoloResult" class="report-editor-section">
      <el-card>
        <template #header>
          <div class="editor-header">
            <h2>📋 诊断报告编辑</h2>
            <p>请医生审核并完善诊断报告内容</p>
          </div>
        </template>
        
        <MedicalReportEditor
          :report-data="diagnosisResult"
          :patient-info="patientInfo"
          :hospital-info="hospitalInfo"
          @export-complete="onExportComplete"
          @save-draft="onSaveDraft"
          ref="reportEditor"
        />
      </el-card>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <el-card>
        <div class="loading-content">
          <el-icon class="loading-icon"><Loading /></el-icon>
          <div>YOLO深度学习中...</div>
          <div class="loading-tip">正在分析影像特征，请稍候</div>
        </div>
      </el-card>
    </div>
>>>>>>> Stashed changes
  </div>
</template>

<script setup lang="ts">
<<<<<<< Updated upstream
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
=======
import { ref, onMounted, reactive, nextTick } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
//import { UploadFilled, Loading } from '@element-plus/icons-vue';
>>>>>>> Stashed changes

import { UltimateDiagnosisSystem } from '@/utils/ultimateDiagnosisSystem';
import MedicalReportEditor from '@/components/MedicalReportEditor.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

// 响应式数据
const diagnosisResult = ref<any>(null);
const loading = ref(false);
const showReportEditor = ref(false);
const reportEditor = ref();

<<<<<<< Updated upstream
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
=======
// 患者信息和医院信息
const patientInfo = reactive({
  name: '张先生',
  gender: '男',
  age: '45',
  medicalRecordNo: 'MR202400123'
});
>>>>>>> Stashed changes

const hospitalInfo = reactive({
  name: '智能医学影像诊断中心',
  department: '放射科'
});

// 内容生成函数
const generateInitialFindings = (result: any): string => {
  if (result.detectedDiseases.length === 0) {
    return '<p>影像表现未见明确异常。</p>'
  }
<<<<<<< Updated upstream
  availableImages.value.push(newImage)
  selectImage(newImage)
  ElMessage.success('影像上传成功')
=======
  
  return result.detectedDiseases.map((disease: any) => 
    `<p>${disease.anatomicalLocation}可见${disease.class}，${disease.clinicalSignificance}。</p>`
  ).join('')
>>>>>>> Stashed changes
}

const generateInitialDiagnosis = (result: any): string => {
  if (result.detectedDiseases.length === 0) {
    return '<p>未见明确异常征象。</p>'
  }
  
<<<<<<< Updated upstream
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
=======
  const primary = result.detectedDiseases[0]
  return `<p>${primary.anatomicalLocation}${primary.class}。</p>`
}

const generateInitialRecommendation = (result: any): string => {
  if (result.detectedDiseases.length === 0) {
    return '<p>建议定期复查。</p>'
  }
  
  const hasFracture = result.detectedDiseases.some((d: any) => d.class.includes('fracture'))
  if (hasFracture) {
    return '<p>建议进一步行CT检查明确诊断，并请骨科会诊。</p>'
  }
  
  return '<p>建议临床随访，必要时进一步检查。</p>'
}

const htmlToText = (html: string): string => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

// 组件挂载时初始化系统
onMounted(async () => {
  try {
    await UltimateDiagnosisSystem.initialize();
    console.log('✅ YOLO诊断系统初始化完成');
    ElMessage.success('系统初始化完成');
  } catch (error) {
    console.error('系统初始化失败:', error);
    ElMessage.error('系统初始化失败，请刷新页面重试');
  }
});

// 诊断处理
const handleUltimateDiagnosis = async (file: File) => {
  try {
    console.log('开始YOLO诊断分析...', file.name);
    loading.value = true;
    diagnosisResult.value = null;
    showReportEditor.value = false;

    // 显示加载提示
    const loadingInstance = ElLoading.service({
      lock: true,
      text: 'AI正在分析影像特征...',
      background: 'rgba(0, 0, 0, 0.7)',
    });

    // 执行诊断
    const result = await UltimateDiagnosisSystem.ultimateDiagnosis(file);
    diagnosisResult.value = result;
    
    console.log('诊断结果:', result);
    ElMessage.success('诊断完成！');

    loadingInstance.close();
    
  } catch (error) {
    console.error('诊断失败:', error);
    ElMessage.error('诊断失败: ' + (error instanceof Error ? error.message : '未知错误'));
    diagnosisResult.value = null;
  } finally {
    loading.value = false;
  }
};

// 预览报告
const previewReport = () => {
  if (!diagnosisResult.value?.yoloResult) {
    ElMessage.warning('暂无诊断结果，请先进行诊断');
    return;
  }

  // 收集所有报告数据
  const reportPreviewData = {
    reportData: diagnosisResult.value,
    editedContent: reportEditor.value?.getEditedContent?.() || {
      findings: generateInitialFindings(diagnosisResult.value.yoloResult),
      diagnosis: generateInitialDiagnosis(diagnosisResult.value.yoloResult),
      recommendation: generateInitialRecommendation(diagnosisResult.value.yoloResult)
    },
    patientInfo: patientInfo,
    hospitalInfo: hospitalInfo,
    doctorInfo: reportEditor.value?.doctorInfo || { reportDoctor: '', reviewDoctor: '' },
    signatures: reportEditor.value?.signatures || { reportDoctor: '', reviewDoctor: '' }
  }

  // 跳转到报告预览页面
  router.push({
    path: '/report-preview',
    query: {
      reportData: JSON.stringify(reportPreviewData.reportData),
      editedContent: JSON.stringify(reportPreviewData.editedContent),
      patientInfo: JSON.stringify(reportPreviewData.patientInfo),
      hospitalInfo: JSON.stringify(reportPreviewData.hospitalInfo),
      doctorInfo: JSON.stringify(reportPreviewData.doctorInfo),
      signatures: JSON.stringify(reportPreviewData.signatures)
    }
  })
}

// 直接下载报告（不编辑）
const downloadReportDirectly = async () => {
  if (!diagnosisResult.value?.yoloResult) {
    ElMessage.warning('暂无诊断结果，请先进行诊断');
    return;
  }
  
  try {
    ElMessage.info('开始生成PDF报告...');
    await UltimateDiagnosisSystem.downloadUltimateReport(
      diagnosisResult.value.yoloResult,
      patientInfo,
      hospitalInfo
    );
    ElMessage.success('PDF报告下载成功！');
>>>>>>> Stashed changes
  } catch (error) {
    console.error('直接下载失败:', error);
    ElMessage.error('下载失败: ' + (error instanceof Error ? error.message : '未知错误'));
  }
};

<<<<<<< Updated upstream
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
=======
// 进入编辑模式
const startEditing = () => {
  if (!diagnosisResult.value?.yoloResult) {
    ElMessage.warning('暂无诊断结果，请先进行诊断');
    return;
  }
  
  showReportEditor.value = true;
  
  // 滚动到编辑区域
  nextTick(() => {
    document.querySelector('.report-editor-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  });
};
>>>>>>> Stashed changes

// 重置诊断
const resetDiagnosis = () => {
  diagnosisResult.value = null;
  showReportEditor.value = false;
  ElMessage.info('已重置诊断结果');
};

// 报告导出完成回调
const onExportComplete = (filename: string) => {
  console.log(`PDF导出完成: ${filename}`);
  ElMessage.success(`报告已成功导出: ${filename}`);
};

// 保存草稿回调
const onSaveDraft = (draft: any) => {
  console.log('草稿已保存:', draft);
  ElMessage.success('报告草稿已保存');
};

// 下载终极报告（备用方法）
const downloadUltimateReport = async () => {
  if (!diagnosisResult.value?.yoloResult) {
    ElMessage.warning('暂无诊断结果，请先进行诊断');
    return;
  }
  
  try {
    ElMessage.info('开始生成PDF报告...');
    await UltimateDiagnosisSystem.downloadUltimateReport(
      diagnosisResult.value.yoloResult,
      patientInfo,
      hospitalInfo,
      `诊断报告_${new Date().getTime()}.pdf`
    );
    ElMessage.success('PDF报告下载成功！');
  } catch (error) {
    console.error('报告生成失败:', error);
    ElMessage.error('报告生成失败: ' + (error instanceof Error ? error.message : '未知错误'));
  }
};
</script>

<style scoped>
.ultimate-diagnosis {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #1890ff;
  margin-bottom: 15px;
  font-size: 28px;
}

.system-status {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.upload-card {
  margin-bottom: 30px;
}

.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ultimate-upload {
  width: 100%;
}

.upload-content {
  padding: 40px 0;
}

.initial-state {
  margin: 30px 0;
}

.initial-content {
  text-align: center;
  padding: 40px;
  color: #909399;
}

.initial-content h3 {
  margin: 16px 0 8px 0;
  color: #606266;
}

.results-card {
  margin-top: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.result-header h2 {
  margin: 0;
  color: #1890ff;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.result-summary {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.result-summary h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 8px;
}

.summary-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.summary-content p {
  margin: 0;
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #1890ff;
}

.detections-section {
  margin: 30px 0;
}

.detections-section h3 {
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.detections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.detection-card {
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #ddd;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.detection-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.detection-card.重度 {
  border-left-color: #ff4d4f;
  background: #fff2f0;
}

.detection-card.中度 {
  border-left-color: #faad14;
  background: #fffbe6;
}

.detection-card.轻度 {
  border-left-color: #52c41a;
  background: #f6ffed;
}

.detection-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.detection-header h4 {
  margin: 0;
  flex: 1;
  color: #333;
}

.detection-class {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
  font-style: italic;
}

.detection-desc {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.detection-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

.no-findings {
  text-align: center;
  padding: 40px;
  color: #999;
}

.measurements-section {
  margin: 30px 0;
}

.measurements-section h3 {
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.deviation-positive {
  color: #ff4d4f;
  font-weight: bold;
}

.deviation-negative {
  color: #52c41a;
  font-weight: bold;
}

<<<<<<< Updated upstream
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
=======
.heatmap-section {
  margin: 30px 0;
}

.heatmap-section h3 {
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.heatmap-preview {
  display: flex;
  flex-direction: column;
>>>>>>> Stashed changes
  align-items: center;
  gap: 15px;
}

<<<<<<< Updated upstream
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
=======
.heatmap-grid {
  border: 1px solid #ddd;
>>>>>>> Stashed changes
  padding: 10px;
  border-radius: 8px;
  background: white;
}

.heatmap-row {
  display: flex;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s;
  cursor: pointer;
}

.heatmap-cell:hover {
  transform: scale(1.2);
  z-index: 1;
  position: relative;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #666;
}

.gradient-bar {
  width: 200px;
  height: 10px;
  background: linear-gradient(90deg, #ffffff, #ff4444);
  border-radius: 5px;
}

.report-editor-section {
  margin-top: 30px;
}

<<<<<<< Updated upstream
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
=======
.editor-header {
>>>>>>> Stashed changes
  text-align: center;
}

.editor-header h2 {
  color: #1890ff;
  margin-bottom: 8px;
}

.editor-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  padding: 30px;
  color: white;
}

.loading-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 16px;
  animation: spin 1s linear infinite;
}

.loading-tip {
  margin-top: 8px;
  color: #ccc;
  font-size: 14px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ultimate-diagnosis {
    padding: 10px;
  }
  
  .result-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .summary-content {
    grid-template-columns: 1fr;
  }
  
  .detections-grid {
    grid-template-columns: 1fr;
  }
}

/* 新增：反馈相关样式 */
.feedback-section {
  margin-top: 15px;
}

.feedback-button .el-icon-comment {
  margin-right: 5px;
}
</style>