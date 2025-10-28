<template>
  <div class="image-diagnosis-page">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">🏥</div>
        <div class="header-title">医学影像诊断系统</div>
      </div>
      <div class="header-right">
        <div class="header-icon">⚙️</div>
        <div class="user-info">
          <span class="user-name">张医生</span>
          <span>▼</span>
        </div>
      </div>
    </div>

    <!-- 主容器 -->
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">新建影像检查</h1>
        <p class="page-subtitle">上传患者影像并填写检查信息，开始诊断流程</p>
      </div>

      <!-- 步骤指示器 -->
      <div class="steps">
        <div class="step" :class="{ active: currentStep >= 1 }">
          <div class="step-number">1</div>
          <div class="step-label">填写病例信息</div>
        </div>
        <div class="step" :class="{ active: currentStep >= 2 }">
          <div class="step-number">2</div>
          <div class="step-label">影像上传</div>
        </div>
        <div class="step" :class="{ active: currentStep >= 3 }">
          <div class="step-number">3</div>
          <div class="step-label">AI诊断</div>
        </div>
        <div class="step" :class="{ active: currentStep >= 4 }">
          <div class="step-number">4</div>
          <div class="step-label">确认诊断</div>
        </div>
      </div>

      <!-- 步骤1: 患者基本信息 -->
      <div v-if="currentStep === 1" class="form-card">
        <div class="form-section-title">患者基本信息</div>
        <div class="form-section-subtitle">请填写患者的基本信息，其中*为必填项</div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">病例编号 <span class="required">*</span></label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="自动生成" 
              v-model="formData.caseNumber"
            >
          </div>
          <div class="form-group">
            <label class="form-label">患者姓名 <span class="required">*</span></label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="请输入患者姓名"
              v-model="formData.patientName"
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">性别 <span class="required">*</span></label>
            <select class="form-select" v-model="formData.gender">
              <option value="">请选择性别</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">年龄 <span class="required">*</span></label>
            <input 
              type="number" 
              class="form-input" 
              placeholder="请输入患者年龄"
              v-model="formData.age"
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">申请科室 <span class="required">*</span></label>
            <select class="form-select" v-model="formData.department">
              <option value="">请选择科室</option>
              <option value="骨科">骨科</option>
              <option value="脊柱外科">脊柱外科</option>
              <option value="创伤骨科">创伤骨科</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">申请医生 <span class="required">*</span></label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="当前用户"
              v-model="formData.doctor"
            >
          </div>
        </div>
      </div>

      <!-- 步骤2: 检查信息和影像上传 -->
      <div v-if="currentStep === 2">
        <!-- 检查信息 -->
        <div class="form-card">
          <div class="form-section-title">检查信息</div>
          <div class="form-section-subtitle">请选择检查相关信息，以便准确分析和诊断</div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">检查类型 <span class="required">*</span></label>
              <select class="form-select" v-model="formData.examType">
                <option value="">请选择检查类型</option>
                <option value="X光">X光</option>
                <option value="CT">CT</option>
                <option value="MRI">MRI</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">检查部位 <span class="required">*</span></label>
              <select class="form-select" v-model="formData.examPart">
                <option value="">请选择检查部位</option>
                <option value="脊柱">脊柱</option>
                <option value="骨盆">骨盆</option>
                <option value="四肢">四肢</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">检查设备</label>
              <select class="form-select" v-model="formData.equipment">
                <option value="">请选择检查设备</option>
                <option value="设备1">设备1</option>
                <option value="设备2">设备2</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">检查日期 <span class="required">*</span></label>
              <input 
                type="date" 
                class="form-input" 
                placeholder="请选择检查日期"
                v-model="formData.examDate"
              >
            </div>
          </div>
        </div>

        <!-- 影像上传 -->
        <div class="form-card">
          <div class="form-section-title">影像上传</div>
          <div class="form-section-subtitle">支持DICOM、JPG、PNG格式文件，单个文件不超过200MB，最多可上传50个文件</div>

          <div class="upload-section">
            <div 
              class="upload-area" 
              :class="{ dragover: isDragOver }"
              @dragover.prevent="handleDragOver"
              @dragleave="handleDragLeave"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <div class="upload-icon">☁️</div>
              <div class="upload-title">拖拽文件到此或点击上传</div>
              <div class="upload-subtitle">支持DICOM、JPG、PNG格式</div>
              <div class="upload-hint">单个文件不超过200MB，最多可上传50个文件</div>
              <button class="upload-btn" @click.stop="triggerFileInput">开始上传</button>
            </div>
            
            <!-- 文件列表 -->
            <div v-if="uploadedFiles.length > 0" class="file-list">
              <h4>已上传文件：</h4>
              <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <button class="remove-btn" @click="removeFile(index)">删除</button>
              </div>
            </div>
          </div>

          <div class="help-section">
            <div class="help-title">📋 上传帮助</div>
            <ul class="help-list">
              <li>DICOM文件说明：支持标准DICOM 3.0格式的医学影像文件上传</li>
              <li>批量上传：支持一次性上传多个文件，系统会自动处理</li>
              <li>隐私保护：上传的所有医学影像数据均采用医疗级加密保护</li>
            </ul>
          </div>
        </div>

        <!-- 临床症状与病史 -->
        <div class="form-card">
          <div class="form-section-title">临床症状与病史</div>
          <div class="form-group">
            <textarea 
              class="form-textarea" 
              placeholder="请输入患者的临床症状、病史信息、既往诊断（选填）"
              v-model="formData.symptoms"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 步骤3: AI诊断分析 -->
      <div v-if="currentStep === 3" class="form-card">
        <div class="form-section-title">AI诊断分析</div>
        <div class="form-section-subtitle">基于YOLO算法的智能诊断结果</div>

        <!-- 诊断进度 -->
        <div v-if="isAnalyzing" class="analysis-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: analysisProgress + '%' }"></div>
          </div>
          <p class="progress-text">AI正在分析影像数据... {{ analysisProgress }}%</p>
        </div>

        <!-- 诊断结果 -->
        <div v-if="diagnosisResult" class="diagnosis-result">
          <div class="result-summary">
            <h3>AI诊断完成</h3>
            <div class="confidence-score">
              分析时间: {{ new Date().toLocaleString() }}
            </div>
          </div>

          <div class="findings">
            <h4>主要诊断结果：</h4>
            <div v-for="(finding, index) in diagnosisResult.findings" :key="index" class="finding-item">
              <div class="finding-name">{{ finding.name }}</div>
              <div class="finding-confidence">置信度: {{ (finding.confidence * 100).toFixed(1) }}%</div>
              <div class="finding-description">{{ finding.description }}</div>
            </div>
          </div>

          <div class="recommendations">
            <h4>AI建议：</h4>
            <ul>
              <li v-for="(rec, index) in diagnosisResult.recommendations" :key="index">{{ rec }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 步骤4: 确认诊断 -->
      <div v-if="currentStep === 4" class="diagnosis-confirmation">
        <!-- 顶部信息栏 -->
        <div class="top-bar">
          <div class="top-bar-left">影像诊断中心</div>
          <div class="top-bar-center">
            <span>病例编号：{{ formData.caseNumber }}</span>
            <span>患者：{{ formData.patientName }}（{{ formData.gender }}，{{ formData.age }}岁）</span>
            <span>部位：{{ formData.examPart }}</span>
          </div>
          <div class="top-bar-right">
            <button class="btn btn-save" @click="handleSave">保存</button>
            <button class="btn btn-ai" @click="handleAIAnalysis">重新分析</button>
            <button class="btn btn-report" @click="handleGenerateReport">生成报告</button>
          </div>
        </div>

        <!-- 主容器 -->
        <div class="main-container">
          <!-- 左侧工具栏 -->
          <div class="left-toolbar">
            <div class="toolbar-section">
              <div class="toolbar-title">影像诊断中心</div>
            </div>
            
            <div class="toolbar-section">
              <div class="toolbar-item" 
                :class="{ active: activeTool === 'pan' }" 
                @click="setActiveTool('pan')"
                title="平移"
              >
                ⊙
              </div>
              <div class="toolbar-item" 
                :class="{ active: activeTool === 'measure' }" 
                @click="setActiveTool('measure')"
                title="测量"
              >
                ⬚
              </div>
            </div>
            
            <div class="toolbar-section">
              <div class="toolbar-item" 
                :class="{ active: activeTool === 'rectangle' }" 
                @click="setActiveTool('rectangle')"
                title="矩形标注"
              >
                ⬜
              </div>
              <div class="toolbar-item" 
                :class="{ active: activeTool === 'circle' }" 
                @click="setActiveTool('circle')"
                title="圆形标注"
              >
                ○
              </div>
              <div class="toolbar-item" 
                :class="{ active: activeTool === 'freehand' }" 
                @click="setActiveTool('freehand')"
                title="自由绘制"
              >
                ✎
              </div>
              <div class="toolbar-item" 
                :class="{ active: activeTool === 'text' }" 
                @click="setActiveTool('text')"
                title="文字标注"
              >
                T
              </div>
            </div>
            
            <div class="toolbar-section">
              <div class="toolbar-item" 
                @click="undoLastAnnotation"
                title="撤销"
              >
                ↶
              </div>
              <div class="toolbar-item" 
                @click="clearAnnotations"
                title="清除所有"
              >
                🗑
              </div>
            </div>
            
            <div class="toolbar-section">
              <div class="color-picker">
                <input 
                  type="color" 
                  v-model="currentColor" 
                  title="选择颜色"
                  class="color-input"
                >
              </div>
            </div>
          </div>

          <!-- 中间影像区域 -->
          <div class="middle-section">
            <!-- 影像控制栏 -->
            <div class="image-controls">
              <div class="series-info">影像序列：{{ currentImage ? currentImage.name : 'N/A' }} ({{ currentImageIndex + 1 }}/{{ uploadedFiles.length }})</div>
              <div class="nav-buttons">
                <button class="nav-btn" @click="previousImage" :disabled="currentImageIndex === 0">←</button>
                <button class="nav-btn" @click="nextImage" :disabled="currentImageIndex === uploadedFiles.length - 1">→</button>
              </div>
              <div class="image-input">
                <input 
                  type="text" 
                  placeholder="窗位:" 
                  v-model="windowLevel"
                  @change="updateWindowLevel"
                >
                <input 
                  type="text" 
                  placeholder="窗宽:" 
                  v-model="windowWidth"
                  @change="updateWindowWidth"
                >
              </div>
              <div style="display: flex; gap: 10px; margin-left: 20px;">
                <button class="zoom-btn" @click="setPresetWindow('soft')">软组织</button>
                <button class="zoom-btn" @click="setPresetWindow('bone')">骨窗</button>
              </div>
              <div class="zoom-controls">
                <button class="zoom-btn" @click="zoomOut">🔍</button>
                <button class="zoom-btn" @click="resetZoom">100%</button>
                <button class="zoom-btn" @click="zoomIn">🔍</button>
                <button class="zoom-btn" @click="fitToWindow">⛶</button>
              </div>
            </div>

            <!-- 影像显示区域 -->
            <div class="image-viewer" ref="imageViewer">
              <div class="image-container" ref="imageContainer">
                <img 
                  v-if="currentImage"
                  :src="currentImage.url" 
                  :alt="currentImage.name" 
                  class="medical-image"
                  :style="imageStyle"
                  @load="onImageLoad"
                  @wheel="onWheel"
                >
                <div v-else class="no-image-placeholder">
                  <p>暂无影像可显示</p>
                </div>
                
                <!-- AI标注 -->
                <div 
                  v-for="(annotation, index) in aiAnnotations" 
                  :key="index"
                  class="annotation" 
                  :class="annotation.type"
                  :style="annotation.style"
                >
                  <div class="annotation-label">{{ annotation.label }}</div>
                </div>

                <!-- Canvas绘制层 -->
                <canvas 
                  ref="annotationCanvas"
                  class="annotation-canvas"
                  :style="{ cursor: getCursorStyle() }"
                ></canvas>
              </div>
            </div>

            <!-- 缩略图导航 -->
            <div class="thumbnail-nav" v-if="uploadedFiles.length > 0">
              <div 
                v-for="(file, index) in uploadedFiles" 
                :key="index"
                class="thumbnail" 
                :class="{ active: index === currentImageIndex }"
                @click="selectImage(index)"
              >
                <img v-if="file.url" :src="file.url" :alt="file.name" class="thumbnail-image">
                <span class="thumbnail-number">{{ index + 1 }}</span>
              </div>
            </div>
          </div>

          <!-- 右侧诊断结果面板 -->
          <div class="right-panel">
            <div class="panel-tabs">
              <div 
                class="panel-tab" 
                :class="{ active: activeTab === 'diagnosis' }"
                @click="setActiveTab('diagnosis')"
              >
                AI诊断结果
              </div>
              <div 
                class="panel-tab" 
                :class="{ active: activeTab === 'review' }"
                @click="setActiveTab('review')"
              >
                医生审核
              </div>
              <div 
                class="panel-tab" 
                :class="{ active: activeTab === 'patient' }"
                @click="setActiveTab('patient')"
              >
                患者信息
              </div>
            </div>

            <div class="panel-content">
              <!-- AI诊断结果 -->
              <div v-if="activeTab === 'diagnosis'">
                <div class="section-title">主要诊断结果</div>

                <div 
                  v-for="(result, index) in diagnosisResults" 
                  :key="index"
                  class="result-item"
                >
                  <div class="result-title">
                    <div class="result-name">{{ result.name }}</div>
                    <div class="result-confidence">{{ (result.confidence * 100).toFixed(0) }}%置信度</div>
                  </div>
                  <div class="result-description">{{ result.description }}</div>
                </div>

                <div class="section-title">次要发现</div>
                <div 
                  v-for="(finding, index) in minorFindings" 
                  :key="index"
                  class="finding-item"
                >
                  {{ finding }}
                </div>

                <div class="ai-info">
                  <div class="ai-info-title">AI建议</div>
                  <div 
                    v-for="(suggestion, index) in aiSuggestions" 
                    :key="index"
                    class="ai-info-item"
                  >
                    {{ index + 1 }}. {{ suggestion }}
                  </div>
                </div>
              </div>

              <!-- 医生审核 -->
              <div v-if="activeTab === 'review'">
                <div class="section-title">医生审核意见</div>
                
                <div class="review-section">
                  <h4>AI诊断评估</h4>
                  <div class="review-item">
                    <label>诊断准确性：</label>
                    <select v-model="doctorReview.accuracy">
                      <option value="accurate">准确</option>
                      <option value="mostly-accurate">基本准确</option>
                      <option value="partially-accurate">部分准确</option>
                      <option value="inaccurate">不准确</option>
                    </select>
                  </div>
                  
                  <div class="review-item">
                    <label>置信度评估：</label>
                    <select v-model="doctorReview.confidence">
                      <option value="high">高</option>
                      <option value="medium">中等</option>
                      <option value="low">低</option>
                    </select>
                  </div>
                </div>

                <div class="review-section">
                  <h4>医生意见</h4>
                  <textarea 
                    v-model="doctorReview.comments"
                    placeholder="请输入您的诊断意见和修改建议..."
                    class="review-textarea"
                  ></textarea>
                </div>

                <div class="review-section">
                  <h4>最终诊断</h4>
                  <div class="final-diagnosis">
                    <div v-for="(result, index) in finalDiagnosis" :key="index" class="diagnosis-item">
                      <input v-model="result.name" placeholder="诊断名称" class="diagnosis-input">
                      <input v-model="result.confidence" placeholder="置信度" class="confidence-input">
                      <textarea v-model="result.description" placeholder="诊断描述" class="description-textarea"></textarea>
                      <button @click="removeDiagnosis(index)" class="remove-btn">删除</button>
                    </div>
                    <button @click="addDiagnosis" class="add-btn">添加诊断</button>
                  </div>
                </div>

                <div class="review-section">
                  <h4>治疗建议</h4>
                  <textarea 
                    v-model="doctorReview.treatment"
                    placeholder="请输入治疗建议..."
                    class="review-textarea"
                  ></textarea>
                </div>
              </div>

              <!-- 患者信息 -->
              <div v-if="activeTab === 'patient'">
                <div class="section-title">基本信息</div>
                <div class="patient-info">
                  <div class="info-item">
                    <span class="label">姓名：</span>
                    <span class="value">{{ formData.patientName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">性别：</span>
                    <span class="value">{{ formData.gender }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">年龄：</span>
                    <span class="value">{{ formData.age }}岁</span>
                  </div>
                  <div class="info-item">
                    <span class="label">科室：</span>
                    <span class="value">{{ formData.department }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">医生：</span>
                    <span class="value">{{ formData.doctor }}</span>
                  </div>
                </div>

                <div class="section-title">检查信息</div>
                <div class="exam-info">
                  <div class="info-item">
                    <span class="label">检查类型：</span>
                    <span class="value">{{ formData.examType }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">检查部位：</span>
                    <span class="value">{{ formData.examPart }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">检查日期：</span>
                    <span class="value">{{ formData.examDate }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">设备：</span>
                    <span class="value">{{ formData.equipment }}</span>
                  </div>
                </div>

                <div class="section-title">临床症状</div>
                <div class="symptoms-info">
                  {{ formData.symptoms || '暂无临床症状描述' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 按钮组 -->
      <div class="form-actions">
        <button class="btn btn-cancel" @click="handleCancel">取消</button>
        <button 
          v-if="currentStep < 3" 
          class="btn btn-next" 
          @click="handleNext"
          :disabled="!canProceed"
        >
          下一步
        </button>
        
        <!-- 提示信息 -->
        <div v-if="!canProceed" class="validation-hint">
          <p>请完成以下必填项：</p>
          <ul>
            <li v-if="currentStep === 1">
              <span v-if="!formData.caseNumber">• 病例编号</span>
              <span v-if="!formData.patientName">• 患者姓名</span>
              <span v-if="!formData.gender">• 性别</span>
              <span v-if="!formData.age">• 年龄</span>
              <span v-if="!formData.department">• 申请科室</span>
            </li>
            <li v-if="currentStep === 2">
              <span v-if="!formData.examType">• 检查类型</span>
              <span v-if="!formData.examPart">• 检查部位</span>
              <span v-if="!formData.examDate">• 检查日期</span>
              <span v-if="uploadedFiles.length === 0">• 影像文件</span>
            </li>
          </ul>
        </div>
        <button 
          v-if="currentStep === 3 && !diagnosisResult" 
          class="btn btn-start" 
          @click="startAIDiagnosis"
          :disabled="uploadedFiles.length === 0"
        >
          开始AI诊断
        </button>
        <button 
          v-if="currentStep === 3 && diagnosisResult" 
          class="btn btn-next" 
          @click="handleNext"
        >
          进入确认诊断
        </button>
        <button 
          v-if="currentStep === 4" 
          class="btn btn-finish" 
          @click="handleFinish"
        >
          完成诊断
        </button>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input 
      ref="fileInput" 
      type="file" 
      multiple 
      accept=".dcm,.jpg,.jpeg,.png" 
      style="display: none"
      @change="handleFileSelect"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 当前步骤
const currentStep = ref(1)

// 表单数据
const formData = reactive({
  caseNumber: '',
  patientName: '',
  gender: '',
  age: '',
  department: '',
  doctor: '张医生',
  examType: '',
  examPart: '',
  equipment: '',
  examDate: '',
  symptoms: ''
})

// 文件上传相关
const uploadedFiles = ref<File[]>([])
const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement>()

// 诊断相关
const isAnalyzing = ref(false)
const analysisProgress = ref(0)
const diagnosisResult = ref<any>(null)

// 第四步确认诊断相关数据
const activeTool = ref('pan')
const activeTab = ref('diagnosis')
const currentImageIndex = ref(0)
const windowLevel = ref(40)
const windowWidth = ref(400)
const zoomLevel = ref(1)
const panX = ref(0)
const panY = ref(0)

// Canvas相关
const imageViewer = ref<HTMLElement>()
const imageContainer = ref<HTMLElement>()
const annotationCanvas = ref<HTMLCanvasElement>()

// 绘制相关
let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let isDrawing = false
let startX = 0
let startY = 0
let currentPath: any[] = []

// AI处理后的图像数据（包含标注）
const aiProcessedImages = ref<any[]>([])

// AI标注数据
const aiAnnotations = ref([
  {
    type: 'red',
    label: '椎间盘突出',
    style: { width: '120px', height: '100px', left: '35%', top: '25%' }
  },
  {
    type: 'yellow',
    label: '椎体骨质增生',
    style: { width: '100px', height: '80px', left: '45%', top: '45%' }
  }
])

// 诊断结果数据
const diagnosisResults = ref([
  {
    name: '腰椎间盘突出 (L4-L5)',
    confidence: 0.94,
    description: 'L4-L5椎间盘后方突出约9.5mm，压迫硬膜囊，相应水平管有效宽度变窄。'
  },
  {
    name: '椎体骨质增生 (L3-L5)',
    confidence: 0.87,
    description: 'L3-L5椎体边缘见骨质增生，符合退行性改变，待合并其他影像学表现。'
  },
  {
    name: '椎管狭窄 (L5-S1)',
    confidence: 0.82,
    description: 'L5-S1水平椎管有效宽度约9mm，提示椎管狭窄。'
  }
])

const minorFindings = ref([
  'L2-L3椎间盘轻度膨出',
  '腰椎生理曲度变直',
  '椎体软骨终板不规则异常'
])

const aiSuggestions = ref([
  '结合患者临床症状，必要时进一步行CT或增强MRI检查',
  '患者年龄及影像学表现，建议骨科临床医生评估是否需要进一步治疗',
  '建议定期复查，监测病情变化'
])

// 医生审核数据
const doctorReview = reactive({
  accuracy: 'accurate',
  confidence: 'high',
  comments: '',
  treatment: ''
})

const finalDiagnosis = ref([
  {
    name: '腰椎间盘突出 (L4-L5)',
    confidence: '94%',
    description: 'L4-L5椎间盘后方突出约9.5mm，压迫硬膜囊，相应水平管有效宽度变窄。'
  }
])

// 标注相关数据
const annotations = ref<any[]>([])
const currentColor = ref('#ff0000')
const currentLineWidth = ref(2)
const isPanning = ref(false)

// 计算属性
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return formData.caseNumber && formData.patientName && formData.gender && formData.age && formData.department
  }
  if (currentStep.value === 2) {
    return formData.examType && formData.examPart && formData.examDate && uploadedFiles.value.length > 0
  }
  return true
})

// 初始化
onMounted(() => {
  // 生成病例编号
  formData.caseNumber = generateCaseNumber()
})

// 生成病例编号
const generateCaseNumber = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `CASE${year}${month}${day}${random}`
}

// 文件拖拽处理
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  
  const files = Array.from(e.dataTransfer?.files || [])
  processFiles(files)
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 文件选择处理
const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)
}

// 处理文件
const processFiles = (files: File[]) => {
  const validFiles = files.filter(file => {
    const validTypes = ['.dcm', '.jpg', '.jpeg', '.png']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validTypes.includes(fileExtension)) {
      ElMessage.error(`不支持的文件格式: ${file.name}`)
      return false
    }
    
    if (file.size > 200 * 1024 * 1024) {
      ElMessage.error(`文件过大: ${file.name}`)
      return false
    }
    
    return true
  })
  
  if (uploadedFiles.value.length + validFiles.length > 50) {
    ElMessage.error('最多只能上传50个文件')
    return
  }
  
  uploadedFiles.value.push(...validFiles)
  ElMessage.success(`成功添加 ${validFiles.length} 个文件`)
}

// 删除文件
const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 下一步
const handleNext = () => {
  if (currentStep.value < 4) {
    currentStep.value++
    
    // 如果进入第三步，开始YOLO诊断
    if (currentStep.value === 3) {
      startYOLODiagnosis()
    }
    
    // 如果进入第四步，初始化确认诊断界面
    if (currentStep.value === 4) {
      initConfirmDiagnosis()
    }
  }
}

// 开始AI诊断
const startAIDiagnosis = async () => {
  await startYOLODiagnosis()
}

// 开始YOLO诊断
const startYOLODiagnosis = async () => {
  isAnalyzing.value = true
  analysisProgress.value = 0
  
  try {
    // 模拟YOLO诊断过程
    const interval = setInterval(() => {
      if (analysisProgress.value < 90) {
        analysisProgress.value += Math.random() * 10
      }
    }, 200)
    
    // 模拟诊断时间
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    clearInterval(interval)
    analysisProgress.value = 100
    
    // 模拟诊断结果
    diagnosisResult.value = {
      confidence: 0.87,
      findings: [
        {
          name: '腰椎间盘突出 (L4-L5)',
          confidence: 0.94,
          description: 'L4-L5椎间盘后方突出约9.5mm，压迫硬膜囊，相应水平管有效宽度变窄。'
        },
        {
          name: '椎体骨质增生 (L3-L5)',
          confidence: 0.87,
          description: 'L3-L5椎体边缘见骨质增生，符合退行性改变，待合并其他影像学表现。'
        },
        {
          name: '椎管狭窄 (L5-S1)',
          confidence: 0.82,
          description: 'L5-S1水平椎管有效宽度约9mm，提示椎管狭窄。'
        }
      ],
      recommendations: [
        '结合患者临床症状，必要时进一步行CT或增强MRI检查',
        '患者年龄及影像学表现，建议骨科临床医生评估是否需要进一步治疗',
        '建议定期复查，监测病情变化'
      ]
    }
    
    // 生成AI处理后的图像（包含标注）
    generateAIProcessedImages()
    
    ElMessage.success('AI诊断分析完成')
  } catch (error) {
    ElMessage.error('诊断分析失败，请重试')
  } finally {
    isAnalyzing.value = false
  }
}

// 完成诊断
const handleFinish = () => {
  ElMessage.success('诊断流程完成')
  // 这里可以跳转到诊断结果页面或返回工作台
  router.push('/dashboard/doctor')
}

// 生成AI处理后的图像
const generateAIProcessedImages = () => {
  aiProcessedImages.value = uploadedFiles.value.map((file, index) => ({
    name: file.name,
    url: URL.createObjectURL(file),
    type: file.type,
    size: file.size,
    index: index,
    annotations: aiAnnotations.value // 添加AI标注
  }))
}

// 初始化确认诊断界面
const initConfirmDiagnosis = () => {
  // 设置默认的AI处理后的图像
  if (aiProcessedImages.value.length === 0) {
    generateAIProcessedImages()
  }
  
  // 重置界面状态
  activeTab.value = 'diagnosis'
  activeTool.value = 'pan'
  currentImageIndex.value = 0
  
  // 初始化Canvas
  nextTick(() => {
    initCanvas()
  })
}

// 初始化Canvas
const initCanvas = () => {
  if (annotationCanvas.value && imageViewer.value) {
    canvas = annotationCanvas.value
    ctx = canvas.getContext('2d')
    
    if (ctx) {
      // 设置Canvas尺寸
      const rect = imageViewer.value.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      
      // 设置Canvas样式
      ctx.strokeStyle = currentColor.value
      ctx.lineWidth = currentLineWidth.value
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // 添加事件监听器
      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseup', handleMouseUp)
      canvas.addEventListener('wheel', handleWheel)
      
      console.log('Canvas初始化成功')
    }
  }
}

// 第四步相关方法
const setActiveTool = (tool: string) => {
  activeTool.value = tool
}

const setActiveTab = (tab: string) => {
  activeTab.value = tab
}

const selectImage = (index: number) => {
  currentImageIndex.value = index
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (currentImageIndex.value < aiProcessedImages.value.length - 1) {
    currentImageIndex.value++
  }
}

const updateWindowLevel = () => {
  // 更新窗位
}

const updateWindowWidth = () => {
  // 更新窗宽
}

const setPresetWindow = (type: string) => {
  if (type === 'soft') {
    windowLevel.value = 40
    windowWidth.value = 400
  } else if (type === 'bone') {
    windowLevel.value = 300
    windowWidth.value = 1500
  }
}

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value * 1.2, 5)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value / 1.2, 0.1)
}

const resetZoom = () => {
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
}

const fitToWindow = () => {
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
}

const handleSave = () => {
  ElMessage.success('诊断结果已保存')
}

const handleAIAnalysis = () => {
  ElMessage.info('重新进行AI分析')
  currentStep.value = 3
  diagnosisResult.value = null
  startAIDiagnosis()
}

const handleGenerateReport = () => {
  ElMessage.success('正在跳转到报告生成页面...')
  
  // 准备传递给报告页面的数据
  const reportData = {
    caseInfo: { ...formData },
    diagnosisResult: diagnosisResult.value,
    aiProcessedImages: aiProcessedImages.value,
    doctorReview: { ...doctorReview },
    finalDiagnosis: [...finalDiagnosis.value]
  }
  
  // 跳转到报告生成页面
  router.push({
    name: 'doctor.reportGeneration',
    state: reportData
  })
}

const addDiagnosis = () => {
  finalDiagnosis.value.push({
    name: '',
    confidence: '',
    description: ''
  })
}

const removeDiagnosis = (index: number) => {
  finalDiagnosis.value.splice(index, 1)
}

// 计算属性
const currentImage = computed(() => {
  return aiProcessedImages.value[currentImageIndex.value] || null
})

const imageStyle = computed(() => {
  return {
    transform: `scale(${zoomLevel.value}) translate(${panX.value}px, ${panY.value}px)`,
    filter: `contrast(${windowWidth.value / 100}) brightness(${windowLevel.value / 100})`
  }
})

const getCursorStyle = () => {
  const cursorMap: Record<string, string> = {
    pan: 'grab',
    measure: 'crosshair',
    rectangle: 'crosshair',
    circle: 'crosshair',
    freehand: 'crosshair',
    text: 'text'
  }
  return cursorMap[activeTool.value] || 'default'
}

// 鼠标事件处理
const handleMouseDown = (e: MouseEvent) => {
  if (!canvas || !ctx) return
  
  const rect = canvas.getBoundingClientRect()
  startX = e.clientX - rect.left
  startY = e.clientY - rect.top
  
  if (activeTool.value === 'pan') {
    isPanning.value = true
    canvas.style.cursor = 'grabbing'
  } else if (activeTool.value === 'freehand') {
    isDrawing = true
    currentPath = [{ x: startX, y: startY }]
    ctx.beginPath()
    ctx.moveTo(startX, startY)
  } else if (activeTool.value === 'rectangle' || activeTool.value === 'circle') {
    isDrawing = true
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!canvas || !ctx) return
  
  const rect = canvas.getBoundingClientRect()
  const currentX = e.clientX - rect.left
  const currentY = e.clientY - rect.top
  
  if (isPanning.value) {
    // 平移图像
    panX.value += (currentX - startX) * 0.1
    panY.value += (currentY - startY) * 0.1
    startX = currentX
    startY = currentY
  } else if (isDrawing && activeTool.value === 'freehand') {
    // 自由绘制
    currentPath.push({ x: currentX, y: currentY })
    ctx.lineTo(currentX, currentY)
    ctx.stroke()
  } else if (isDrawing && (activeTool.value === 'rectangle' || activeTool.value === 'circle')) {
    // 绘制矩形或圆形
    redrawCanvas()
    ctx.strokeStyle = currentColor.value
    ctx.lineWidth = currentLineWidth.value
    ctx.beginPath()
    
    if (activeTool.value === 'rectangle') {
      ctx.rect(startX, startY, currentX - startX, currentY - startY)
    } else if (activeTool.value === 'circle') {
      const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2))
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI)
    }
    ctx.stroke()
  }
}

const handleMouseUp = (e: MouseEvent) => {
  if (!canvas || !ctx) return
  
  const rect = canvas.getBoundingClientRect()
  const endX = e.clientX - rect.left
  const endY = e.clientY - rect.top
  
  if (isPanning.value) {
    isPanning.value = false
    canvas.style.cursor = 'grab'
  } else if (isDrawing) {
    isDrawing = false
    
    if (activeTool.value === 'freehand' && currentPath.length > 1) {
      // 保存自由绘制路径
      annotations.value.push({
        type: 'freehand',
        path: [...currentPath],
        color: currentColor.value,
        lineWidth: currentLineWidth.value
      })
    } else if (activeTool.value === 'rectangle') {
      // 保存矩形标注
      annotations.value.push({
        type: 'rectangle',
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
        color: currentColor.value,
        lineWidth: currentLineWidth.value
      })
    } else if (activeTool.value === 'circle') {
      // 保存圆形标注
      const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
      annotations.value.push({
        type: 'circle',
        x: startX,
        y: startY,
        radius: radius,
        color: currentColor.value,
        lineWidth: currentLineWidth.value
      })
    }
    
    currentPath = []
  }
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  zoomLevel.value = Math.max(0.1, Math.min(5, zoomLevel.value * delta))
}

// 重绘Canvas
const redrawCanvas = () => {
  if (!canvas || !ctx) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 重绘所有标注
  annotations.value.forEach(annotation => {
    ctx.strokeStyle = annotation.color
    ctx.lineWidth = annotation.lineWidth
    ctx.beginPath()
    
    if (annotation.type === 'freehand') {
      if (annotation.path.length > 0) {
        ctx.moveTo(annotation.path[0].x, annotation.path[0].y)
        for (let i = 1; i < annotation.path.length; i++) {
          ctx.lineTo(annotation.path[i].x, annotation.path[i].y)
        }
        ctx.stroke()
      }
    } else if (annotation.type === 'rectangle') {
      ctx.rect(annotation.x, annotation.y, annotation.width, annotation.height)
      ctx.stroke()
    } else if (annotation.type === 'circle') {
      ctx.arc(annotation.x, annotation.y, annotation.radius, 0, 2 * Math.PI)
      ctx.stroke()
    }
  })
}

// 清除所有标注
const clearAnnotations = () => {
  annotations.value = []
  if (canvas && ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

// 撤销最后一个标注
const undoLastAnnotation = () => {
  if (annotations.value.length > 0) {
    annotations.value.pop()
    redrawCanvas()
  }
}

// 进入诊断中心
const goToDiagnosisCenter = () => {
  if (uploadedFiles.value.length === 0) {
    ElMessage.warning('请先上传影像文件才能进入诊断中心')
    return
  }
  
  ElMessage.success('正在进入诊断中心...')
  
  // 创建影像数据，为每个文件创建临时URL
  const imageData = uploadedFiles.value.map((file, index) => ({
    name: file.name,
    url: URL.createObjectURL(file),
    type: file.type,
    size: file.size,
    index: index
  }))
  
  console.log('准备跳转到诊断中心')
  console.log('上传的文件数量:', uploadedFiles.value.length)
  console.log('创建的影像数据:', imageData)
  console.log('病例信息:', formData)
  console.log('诊断结果:', diagnosisResult.value)
  
  // 通过路由状态传递数据
  router.push({
    name: 'doctor.imageCenter',
    state: {
      caseInfo: { ...formData },
      images: imageData,
      diagnosisResult: diagnosisResult.value
    }
  })
}

// 取消
const handleCancel = () => {
  router.push('/dashboard/doctor')
}
</script>

<style scoped>
.image-diagnosis-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 顶部导航栏 */
.header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.header-title {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  font-size: 18px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f0f9ff;
  border-radius: 6px;
  cursor: pointer;
}

.user-name {
  font-size: 14px;
  color: #2563eb;
  font-weight: 600;
}

/* 主容器 */
.container {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
}

/* 页面标题 */
.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

/* 步骤指示器 */
.steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
}

.steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #9ca3af;
  font-size: 16px;
}

.step.active .step-number {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.step.active .step-label {
  color: #2563eb;
  font-weight: 600;
}

/* 表单卡片 */
.form-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section-title {
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 8px;
}

.form-section-subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 20px;
}

/* 表单行 */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-row.full {
  grid-template-columns: 1fr;
}

/* 表单组 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.form-label .required {
  color: #ef4444;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input::placeholder,
.form-select::placeholder {
  color: #9ca3af;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* 上传区域 */
.upload-section {
  margin-bottom: 20px;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.upload-area:hover {
  border-color: #2563eb;
  background: #f0f9ff;
}

.upload-area.dragover {
  border-color: #2563eb;
  background: #f0f9ff;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 12px;
  color: #9ca3af;
}

.upload-title {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 4px;
}

.upload-subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 16px;
}

.upload-hint {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 16px;
}

.upload-btn {
  padding: 10px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* 文件列表 */
.file-list {
  margin-top: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.file-list h4 {
  margin-bottom: 12px;
  color: #1f2937;
  font-size: 14px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.file-item:last-child {
  border-bottom: none;
}

.file-name {
  font-size: 14px;
  color: #1f2937;
  flex: 1;
}

.file-size {
  font-size: 12px;
  color: #6b7280;
  margin: 0 12px;
}

.remove-btn {
  padding: 4px 8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

/* 帮助信息 */
.help-section {
  background: #f0f9ff;
  border-left: 4px solid #2563eb;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
}

.help-title {
  font-size: 14px;
  color: #2563eb;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.help-list {
  list-style: none;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.8;
}

.help-list li {
  margin-bottom: 4px;
}

.help-list li::before {
  content: '• ';
  color: #2563eb;
  font-weight: bold;
}

/* 诊断结果 */
.analysis-progress {
  margin: 20px 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.diagnosis-result {
  margin-top: 20px;
}

.result-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
}

.result-summary h3 {
  color: #1f2937;
  font-size: 18px;
}

.confidence-score {
  font-size: 16px;
  color: #2563eb;
  font-weight: 600;
}

.findings {
  margin-bottom: 20px;
}

.findings h4 {
  color: #1f2937;
  margin-bottom: 12px;
}

.finding-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
}

.finding-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.finding-confidence {
  font-size: 12px;
  color: #2563eb;
  margin-bottom: 4px;
}

.finding-description {
  font-size: 14px;
  color: #6b7280;
}

.recommendations h4 {
  color: #1f2937;
  margin-bottom: 12px;
}

.recommendations ul {
  list-style: none;
  padding-left: 0;
}

.recommendations li {
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
}

.recommendations li:last-child {
  border-bottom: none;
}

.recommendations li::before {
  content: '• ';
  color: #2563eb;
  font-weight: bold;
}

/* 按钮组 */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
}

.btn {
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: white;
  color: #1f2937;
  border: 1px solid #e5e7eb;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-next {
  background: #2563eb;
  color: white;
  min-width: 120px;
}

.btn-next:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-next::after {
  content: ' →';
}

.btn-center {
  background: #52c41a;
  color: white;
  min-width: 120px;
}

.btn-center:hover {
  background: #389e0d;
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

/* 第四步确认诊断样式 */
.diagnosis-confirmation {
  position: fixed;
  top: 80px; /* 导航栏高度 */
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  z-index: 1000;
  width: 100vw;
  height: calc(100vh - 80px);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.top-bar-left {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.top-bar-center {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #6b7280;
}

.top-bar-right {
  display: flex;
  gap: 12px;
}

.btn-save, .btn-ai, .btn-report {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save {
  background: #f3f4f6;
  color: #374151;
}

.btn-save:hover {
  background: #e5e7eb;
}

.btn-ai {
  background: #3b82f6;
  color: white;
}

.btn-ai:hover {
  background: #2563eb;
}

.btn-report {
  background: #10b981;
  color: white;
}

.btn-report:hover {
  background: #059669;
}

.main-container {
  flex: 1;
  display: flex;
  height: calc(100vh - 140px); /* 减去顶部导航栏和顶部信息栏的高度 */
  overflow: hidden;
  min-height: 0;
}

.left-toolbar {
  width: 80px;
  background: #374151;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 8px;
  overflow-y: auto;
}

.toolbar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.toolbar-title {
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.toolbar-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #4b5563;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.toolbar-item:hover {
  background: #6b7280;
}

.toolbar-item.active {
  background: #3b82f6;
}

.color-picker {
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-input {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: none;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}

.middle-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  min-height: 0; /* 允许flex子元素收缩 */
}

.image-controls {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  gap: 16px;
}

.series-info {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.nav-buttons {
  display: flex;
  gap: 8px;
}

.nav-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.nav-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-input {
  display: flex;
  gap: 8px;
}

.image-input input {
  width: 80px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
}

.zoom-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.zoom-btn:hover {
  background: #f3f4f6;
}

.zoom-controls {
  display: flex;
  gap: 8px;
}

.image-viewer {
  flex: 1;
  position: relative;
  background: #000;
  overflow: hidden;
  min-height: 0; /* 允许flex子元素收缩 */
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
  transition: transform 0.2s;
}

.no-image-placeholder {
  color: white;
  text-align: center;
}

.annotation {
  position: absolute;
  border: 2px solid;
  border-radius: 4px;
  cursor: pointer;
}

.annotation.red {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.annotation.yellow {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.annotation-label {
  position: absolute;
  top: -24px;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  white-space: nowrap;
}

.annotation-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}

.thumbnail-nav {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  overflow-x: auto;
}

.thumbnail {
  position: relative;
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.thumbnail.active {
  border-color: #3b82f6;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
}

.thumbnail-number {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 10px;
}

.right-panel {
  width: 350px;
  background: white;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 允许flex子元素收缩 */
}

.panel-tabs {
  display: flex;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.panel-tab {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.panel-tab:hover {
  color: #374151;
}

.panel-tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.panel-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  min-height: 0; /* 允许flex子元素收缩 */
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.result-item {
  margin-bottom: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
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
  color: #1f2937;
}

.result-confidence {
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
}

.result-description {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.finding-item {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
  padding-left: 12px;
  position: relative;
}

.finding-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #9ca3af;
}

.ai-info {
  margin-top: 20px;
  padding: 12px;
  background: #eff6ff;
  border-radius: 6px;
}

.ai-info-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 8px;
}

.ai-info-item {
  font-size: 13px;
  color: #1e40af;
  margin-bottom: 4px;
}

.review-section {
  margin-bottom: 20px;
}

.review-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.review-item {
  margin-bottom: 12px;
}

.review-item label {
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

.review-item select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
}

.review-textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  resize: vertical;
}

.final-diagnosis {
  margin-top: 12px;
}

.diagnosis-item {
  margin-bottom: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.diagnosis-input, .confidence-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  margin-bottom: 8px;
}

.description-textarea {
  width: 100%;
  min-height: 60px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  resize: vertical;
  margin-bottom: 8px;
}

.remove-btn {
  padding: 4px 8px;
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

.add-btn {
  width: 100%;
  padding: 8px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.add-btn:hover {
  background: #2563eb;
}

.patient-info, .exam-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
}

.info-item .label {
  width: 80px;
  font-size: 13px;
  color: #6b7280;
}

.info-item .value {
  font-size: 13px;
  color: #374151;
}

.symptoms-info {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

/* 验证提示信息 */
.validation-hint {
  margin-top: 16px;
  padding: 12px;
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  font-size: 12px;
}

.validation-hint p {
  margin-bottom: 8px;
  color: #0369a1;
  font-weight: 600;
}

.validation-hint ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.validation-hint li {
  margin-bottom: 4px;
  color: #0369a1;
}

.validation-hint span {
  display: block;
  padding: 2px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .steps {
    gap: 10px;
  }

  .step-label {
    font-size: 10px;
  }

  .form-card {
    padding: 20px;
  }

  .page-title {
    font-size: 20px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
