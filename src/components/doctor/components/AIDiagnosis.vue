<template>
  <div class="ai-diagnosis">
    <div class="diagnosis-header">
      <h2>AI智能诊断分析</h2>
      <div class="header-actions">
        <el-button type="primary" @click="runAIDiagnosis" :disabled="!selectedImage">
          <el-icon><StarFilled /></el-icon>
          开始AI诊断
        </el-button>
      </div>
    </div>

    <div class="diagnosis-content">
      <!-- 左侧：影像选择和上传 -->
      <div class="left-panel">
        <el-card>
          <div class="upload-section">
            <h3>选择诊断影像</h3>
            <el-upload
              class="upload-area"
              drag
              :before-upload="beforeImageUpload"
              :http-request="handleImageUpload"
              :show-file-list="false"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽影像文件到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 JPG、PNG 格式，文件大小不超过 10MB
                </div>
              </template>
            </el-upload>
          </div>

          <!-- 历史影像选择功能已移除，避免与影像上传功能冗余 -->
        </el-card>
      </div>

      <!-- 中间：影像显示和AI分析结果 -->
      <div class="center-panel">
        <el-card>
          <div class="image-display">
            <div class="display-area" ref="displayArea">
              <img 
                v-if="selectedImage" 
                :src="selectedImage.url" 
                :alt="selectedImage.name"
                :style="{
                  transform: `scale(${imageScale})`,
                  transformOrigin: 'center center'
                }"
              />
              
              <!-- AI检测框 -->
              <div
                v-for="(detection, index) in aiDetections"
                :key="index"
                class="detection-box"
                :style="{
                  left: `${detection.x}%`,
                  top: `${detection.y}%`,
                  width: `${detection.width}%`,
                  height: `${detection.height}%`,
                  borderColor: getConfidenceColor(detection.confidence)
                }"
              >
                <div class="detection-label" :style="{ backgroundColor: getConfidenceColor(detection.confidence) }">
                  {{ detection.disease }} ({{ (detection.confidence * 100).toFixed(1) }}%)
                </div>
              </div>
            </div>
          </div>

          <div class="image-controls">
            <el-slider
              v-model="imageScale"
              :min="0.1"
              :max="3"
              :step="0.1"
              show-stops
            />
            <div class="control-buttons">
              <el-button-group>
                <el-button @click="imageScale = Math.max(0.1, imageScale - 0.1)">
                  <el-icon><ZoomOut /></el-icon>
                </el-button>
                <el-button @click="imageScale = 1">
                  100%
                </el-button>
                <el-button @click="imageScale = Math.min(3, imageScale + 0.1)">
                  <el-icon><ZoomIn /></el-icon>
                </el-button>
              </el-button-group>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右侧：诊断结果和分析 -->
      <div class="right-panel">
        <el-card>
          <div class="results-section" v-loading="analyzing">
            <h3>AI诊断结果</h3>
            
            <div v-if="diagnosisResult" class="diagnosis-results">
              <!-- 疾病分类 -->
              <div class="result-category">
                <h4>疾病分类</h4>
                <div class="disease-list">
                  <div
                    v-for="disease in diagnosisResult.diseases"
                    :key="disease.name"
                    class="disease-item"
                  >
                    <div class="disease-header">
                      <span class="disease-name">{{ disease.name }}</span>
                      <el-tag :type="getConfidenceTagType(disease.confidence)">
                        {{ (disease.confidence * 100).toFixed(1) }}%
                      </el-tag>
                    </div>
                    <el-progress
                      :percentage="disease.confidence * 100"
                      :show-text="false"
                      :color="getConfidenceColor(disease.confidence)"
                    />
                  </div>
                </div>
              </div>

              <!-- 病灶检测 -->
              <div class="result-category">
                <h4>病灶检测</h4>
                <div class="detection-list">
                  <div
                    v-for="(detection, index) in diagnosisResult.detections"
                    :key="index"
                    class="detection-item"
                  >
                    <div class="detection-info">
                      <span class="location">{{ detection.location }}</span>
                      <el-tag size="small" :type="getConfidenceTagType(detection.confidence)">
                        {{ (detection.confidence * 100).toFixed(1) }}%
                      </el-tag>
                    </div>
                    <span class="description">{{ detection.description }}</span>
                  </div>
                </div>
              </div>

              <!-- 可解释性分析 -->
              <div class="result-category">
                <h4>可解释性分析</h4>
                <div class="explanation">
                  <p>{{ diagnosisResult.explanation }}</p>
                  <div class="heatmap-preview">
                    <img :src="diagnosisResult.heatmap" alt="热力图" />
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="no-results">
              <el-empty description="请选择影像并开始AI诊断分析" />
            </div>
          </div>

          <!-- 诊断建议 -->
          <div class="suggestions-section" v-if="diagnosisResult">
            <h3>诊断建议</h3>
            <div class="suggestions">
              <div class="suggestion-item">
                <el-icon><InfoFilled /></el-icon>
                <span>建议进行进一步检查确认诊断结果</span>
              </div>
              <div class="suggestion-item">
                <el-icon><WarningFilled /></el-icon>
                <span>关注高风险病灶区域，及时制定治疗方案</span>
              </div>
            </div>

            <div class="report-section">
              <el-button 
                type="primary" 
                @click="generateReport"
              >
                <el-icon><Document /></el-icon>
                生成诊断报告
              </el-button>
            </div>

            <!-- 诊断反馈按钮 -->
            <div class="feedback-section" v-if="diagnosisResult">
              <el-button 
                type="default"
                class="feedback-button"
                @click="showFeedbackForm = true"
                style="width: 100%; margin-top: 15px;"
              >
                <el-icon><ChatDotRound /></el-icon>
                提交诊断反馈
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>



    <!-- 报告编辑区域 -->
    <div v-if="showReportEditor && diagnosisResult" class="report-editor-section">
      <el-card>
        <template #header>
          <div class="editor-header">
            <h2>📋 诊断报告编辑</h2>
            <p>请医生审核并完善诊断报告内容</p>
          </div>
        </template>
        
        <!-- 简化报告编辑器 -->
        <div class="simple-report-editor">
          <el-form :model="reportForm" label-width="100px">
            <el-form-item label="患者姓名">
              <el-input v-model="reportForm.patientName" placeholder="请输入患者姓名" />
            </el-form-item>
            <el-form-item label="诊断结论">
              <el-input 
                v-model="reportForm.diagnosis" 
                type="textarea" 
                :rows="4"
                placeholder="请输入诊断结论" 
              />
            </el-form-item>
            <el-form-item label="治疗建议">
              <el-input 
                v-model="reportForm.treatment" 
                type="textarea" 
                :rows="4"
                placeholder="请输入治疗建议" 
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="exportReport">导出报告</el-button>
              <el-button @click="saveDraft">保存草稿</el-button>
              <el-button @click="showReportEditor = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>

    <!-- 反馈对话框 -->
    <el-dialog v-model="showFeedbackForm" title="提交诊断反馈" width="500px">
      <el-form :model="feedbackForm" label-width="80px">
        <el-form-item label="反馈类型">
          <el-select v-model="feedbackForm.type" placeholder="请选择反馈类型">
            <el-option label="诊断准确性" value="accuracy" />
            <el-option label="系统建议" value="suggestion" />
            <el-option label="Bug反馈" value="bug" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="反馈内容">
          <el-input 
            v-model="feedbackForm.content" 
            type="textarea" 
            :rows="4"
            placeholder="请输入您的反馈内容" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showFeedbackForm = false">取消</el-button>
        <el-button type="primary" @click="submitFeedback">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { StarFilled, UploadFilled, ZoomOut, ZoomIn, InfoFilled, WarningFilled, Document, ChatDotRound, Picture } from '@element-plus/icons-vue'


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

// 创建占位图
const createPlaceholderImage = (text: string, width: number = 600, height: number = 400) => {
  // 使用encodeURIComponent处理中文字符
  const encodedText = encodeURIComponent(text);
  return `data:image/svg+xml,\
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f2f5"/>
      <text x="50%" y="50%" font-family="Arial, 'Microsoft YaHei'" font-size="14" text-anchor="middle" dy=".3em" fill="#666">${encodedText}</text>
    </svg>`
}

// 创建真实医学影像热力图
const createHeatmapImage = (width: number = 300, height: number = 200) => {
  // 生成更真实的医学影像热力图SVG
  const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- 医学影像底图 -->
        <rect width="100%" height="100%" fill="#e0e0e0"/>
        
        <!-- 添加医学影像纹理效果 -->
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <rect width="100%" height="100%" fill="#d0d0d0" filter="url(%23noise)" opacity="0.8"/>
        
        <!-- 骨骼轮廓 -->
        <path d="M60,50 Q100,20 150,40 T240,50" stroke="#b0b0b0" stroke-width="2" fill="none"/>
        <path d="M60,150 Q100,120 150,140 T240,150" stroke="#b0b0b0" stroke-width="2" fill="none"/>
        <line x1="60" y1="50" x2="60" y2="150" stroke="#b0b0b0" stroke-width="2"/>
        <line x1="240" y1="50" x2="240" y2="150" stroke="#b0b0b0" stroke-width="2"/>
        
        <!-- 专业热力图配色方案 -->
        <defs>
          <!-- 专业热力图色阶 - 从低关注度到高关注度 -->
          <linearGradient id="medicalHeatScale" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#0000ff"/>
            <stop offset="25%" stop-color="#00ffff"/>
            <stop offset="50%" stop-color="#ffff00"/>
            <stop offset="75%" stop-color="#ff7700"/>
            <stop offset="100%" stop-color="#ff0000"/>
          </linearGradient>
          
          <!-- 热点径向渐变 -->
          <radialGradient id="hotspot1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="#ff0000" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#ff0000" stop-opacity="0.1"/>
          </radialGradient>
          
          <radialGradient id="hotspot2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="#ff7700" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#ff7700" stop-opacity="0.1"/>
          </radialGradient>
          
          <radialGradient id="hotspot3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="#ffff00" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#ffff00" stop-opacity="0.05"/>
          </radialGradient>
        </defs>
        
        <!-- 主要病变热点区域 -->
        <circle cx="100" cy="90" r="30" fill="url(%23hotspot1)"/>
        
        <!-- 次要病变区域 -->
        <circle cx="180" cy="70" r="25" fill="url(%23hotspot2)"/>
        <circle cx="140" cy="130" r="20" fill="url(%23hotspot3)"/>
        
        <!-- 病变标记点 -->
        <circle cx="100" cy="90" r="3" fill="#000" stroke="#fff" stroke-width="1"/>
        <text x="105" y="86" font-family="Arial, 'Microsoft YaHei'" font-size="11" fill="#000">A</text>
        
        <circle cx="180" cy="70" r="3" fill="#000" stroke="#fff" stroke-width="1"/>
        <text x="185" y="66" font-family="Arial, 'Microsoft YaHei'" font-size="11" fill="#000">B</text>
        
        <!-- 专业热力图图例 -->
        <rect x="${width * 0.67}" y="${height * 0.75}" width="${width * 0.27}" height="${height * 0.05}" fill="url(%23medicalHeatScale)"/>
        <text x="${width * 0.67}" y="${height * 0.85}" font-family="Arial, 'Microsoft YaHei'" font-size="10" fill="#333">低</text>
        <text x="${width * 0.94}" y="${height * 0.85}" font-family="Arial, 'Microsoft YaHei'" font-size="10" fill="#333" text-anchor="end">高</text>
        <text x="${width * 0.8}" y="${height * 0.72}" font-family="Arial, 'Microsoft YaHei'" font-size="9" fill="#333" text-anchor="middle">关注度</text>
        
        <!-- 技术参数标签 -->
        <text x="20" y="20" font-family="Arial, 'Microsoft YaHei'" font-size="9" fill="#666">AI置信度: 87.5%</text>
        <text x="20" y="35" font-family="Arial, 'Microsoft YaHei'" font-size="9" fill="#666">分辨率: 512×512</text>
        
        <!-- 医学解剖标记 -->
        <text x="30" y="${height * 0.9}" font-family="Arial, 'Microsoft YaHei'" font-size="10" fill="#333">医学影像热力图分析</text>
        
        <!-- 分析结论 -->
        <rect x="20" y="${height * 0.78}" width="${width * 0.53}" height="15" fill="rgba(255,255,255,0.7)"/>
        <text x="25" y="${height * 0.86}" font-family="Arial, 'Microsoft YaHei'" font-size="9" fill="#d00">发现高关注区域A: 疑似病变</text>
      </svg>
    `.trim();
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}

const displayArea = ref<HTMLElement>()
const selectedImage = ref<MedicalImage | null>(null)
const imageScale = ref(1)
const analyzing = ref(false)
const aiDetections = ref<AIDetection[]>([])
const diagnosisResult = ref<DiagnosisResult | null>(null)
const showReportEditor = ref(false)
const showFeedbackForm = ref(false)
const loading = ref(false)

// 模拟数据
const patientInfo = reactive({
  name: '张三',
  age: 45,
  gender: '男'
})

const hospitalInfo = reactive({
  name: 'XX市人民医院',
  department: '骨科'
})

// 报告表单
const reportForm = reactive({
  patientName: '张三',
  diagnosis: '',
  treatment: ''
})

// 反馈表单
const feedbackForm = reactive({
  type: '',
  content: ''
})

// 使用base64占位图的模拟数据
const availableImages = ref<MedicalImage[]>([
  {
    id: '1',
    name: '膝关节X光片',
    url: createPlaceholderImage('膝关节X光片', 600, 400),
    thumbnail: createPlaceholderImage('膝关节', 150, 100),
    type: 'image/jpeg',
    uploadTime: '2024-01-15T10:30:00'
  },
  {
    id: '2',
    name: '腰椎MRI',
    url: createPlaceholderImage('腰椎MRI', 600, 400),
    thumbnail: createPlaceholderImage('腰椎', 150, 100),
    type: 'image/jpeg',
    uploadTime: '2024-01-14T14:20:00'
  }
])

const beforeImageUpload = (file: File) => {
  const isValidType = ['image/jpeg', 'image/png'].includes(file.type)
  const isValidSize = file.size / 1024 / 1024 < 10 // 10MB
  
  if (!isValidType) {
    ElMessage.error('只能上传 JPG、PNG 格式的影像文件!')
    return false
  }
  
  if (!isValidSize) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  
  return true
}

// 自定义上传处理
const handleImageUpload = async (options: any) => {
  const { file } = options
  
  try {
    // 创建本地预览
    const objectUrl = URL.createObjectURL(file)
    
    const newImage: MedicalImage = {
      id: Date.now().toString(),
      name: file.name,
      url: objectUrl,
      thumbnail: objectUrl,
      type: file.type,
      uploadTime: new Date().toISOString()
    }
    
    availableImages.value.push(newImage)
    selectImage(newImage)
    ElMessage.success('影像上传成功')
    
    // 模拟上传到服务器
    await simulateUploadToServer(file)
    
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

const simulateUploadToServer = async (file: File): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('文件模拟上传完成:', file.name)
      resolve()
    }, 1000)
  })
}

const selectImage = (image: MedicalImage) => {
  selectedImage.value = image
  aiDetections.value = []
  diagnosisResult.value = null
  imageScale.value = 1
}

const runAIDiagnosis = async () => {
  if (!selectedImage.value) {
    ElMessage.warning('请先选择影像')
    return
  }
  
  analyzing.value = true
  
  try {
    // 模拟AI诊断过程
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 模拟AI检测结果
    aiDetections.value = [
      {
        x: 25,
        y: 30,
        width: 15,
        height: 20,
        disease: '骨关节炎',
        confidence: 0.87
      },
      {
        x: 60,
        y: 45,
        width: 12,
        height: 15,
        disease: '骨质增生',
        confidence: 0.76
      }
    ]
    
    // 模拟诊断结果
    diagnosisResult.value = {
      diseases: [
        {
          name: '膝关节骨关节炎',
          confidence: 0.87,
          description: '中度骨关节炎，关节间隙变窄'
        },
        {
          name: '骨质增生',
          confidence: 0.76,
          description: '关节边缘骨质增生'
        },
        {
          name: '软骨损伤',
          confidence: 0.63,
          description: '轻度软骨磨损'
        }
      ],
      detections: [
        {
          location: '右膝关节内侧',
          confidence: 0.87,
          description: '关节间隙明显变窄'
        },
        {
          location: '股骨髁',
          confidence: 0.76,
          description: '边缘骨质增生'
        }
      ],
      explanation: 'AI模型在膝关节区域检测到明显的骨关节炎特征，包括关节间隙变窄和边缘骨质增生。这些特征与中度骨关节炎的诊断一致。',
      heatmap: createHeatmapImage(300, 200)
    }
    
    ElMessage.success('AI诊断分析完成')
  } catch (error) {
    ElMessage.error('AI诊断分析失败')
  } finally {
    analyzing.value = false
  }
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
  // 填充报告表单数据
  if (diagnosisResult.value) {
    reportForm.diagnosis = diagnosisResult.value.diseases.map(d => `${d.name} (${(d.confidence * 100).toFixed(1)}%)`).join('；')
    reportForm.treatment = '建议进行进一步影像学检查确认诊断结果，并根据具体情况制定个性化治疗方案。'
  }
  showReportEditor.value = true
}

const exportReport = async () => {
  try {
    console.log('开始导出报告...');
    
    // 验证必要的数据
    if (!diagnosisResult.value) {
      ElMessage.warning('没有诊断结果，无法生成报告');
      return;
    }
    
    if (!reportForm.patientName) {
      ElMessage.warning('请输入患者姓名');
      return;
    }
    
    // 导入PDFGenerator类
    import('@/utils/pdf-generator').then(({ PDFGenerator }) => {
      // 构建AI诊断报告数据
      const reportData = {
        hospitalInfo: {
          name: hospitalInfo.name || '未知医院',
          department: hospitalInfo.department || '未知科室'
        },
        patientInfo: {
          name: reportForm.patientName,
          id: '未提供',
          gender: '未提供',
          age: '未提供'
        },
        reportDate: new Date().toISOString(),
        reportNo: Date.now(),
        diagnosisResult: {
          diseases: Array.isArray(diagnosisResult.value.diseases) ? diagnosisResult.value.diseases : [],
          detections: diagnosisResult.value.detections || [],
          explanation: diagnosisResult.value.explanation || 'AI未提供详细解释',
          heatmap: diagnosisResult.value.heatmap || ''
        },
        doctorDiagnosis: reportForm.diagnosis || '待医生填写诊断结论',
        treatmentSuggestion: reportForm.treatment || '待医生填写治疗建议'
      };
      
      // 生成PDF文件名
      const fileName = `AI诊断报告_${reportForm.patientName}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.pdf`;
      
      // 使用项目中已有的PDFGenerator来生成AI诊断报告PDF
      PDFGenerator.generateAIDiagnosisReport(reportData, fileName)
        .then(() => {
          console.log('PDF导出成功');
          ElMessage.success('诊断报告已导出为PDF文件');
          showReportEditor.value = false;
        })
        .catch(error => {
          console.error('PDF导出失败:', error);
          ElMessage.error('PDF导出失败: ' + (error instanceof Error ? error.message : String(error)));
        });
    }).catch(error => {
      console.error('导入PDFGenerator失败:', error);
      ElMessage.error('PDF导出功能加载失败');
    });
  } catch (error) {
    console.error('导出报告失败:', error);
    ElMessage.error('导出报告失败，请重试: ' + (error instanceof Error ? error.message : String(error)));
  }
}

const saveDraft = () => {
  ElMessage.success('草稿保存成功')
}

const submitFeedback = () => {
  if (!feedbackForm.type || !feedbackForm.content) {
    ElMessage.warning('请填写完整的反馈信息')
    return
  }
  
  ElMessage.success('反馈提交成功')
  showFeedbackForm.value = false
  feedbackForm.type = ''
  feedbackForm.content = ''
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.ai-diagnosis {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.diagnosis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8e8e8;
}

.diagnosis-header h2 {
  color: #1890ff;
  margin: 0;
}

.diagnosis-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.left-panel,
.center-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-section,
.image-selection {
  margin-bottom: 20px;
}

.upload-area {
  width: 100%;
}

.image-grid {
  display: grid;
  gap: 10px;
}

.image-card {
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.image-card:hover {
  border-color: #409eff;
}

.image-card.active {
  border-color: #409eff;
  background-color: #f0f7ff;
}

.image-card img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.image-info {
  padding: 5px 0;
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

.display-area {
  position: relative;
  width: 100%;
  height: 400px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.display-area img {
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.3s;
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
  padding: 15px 0;
}

.control-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.result-category {
  margin-bottom: 20px;
}

.result-category h4 {
  margin-bottom: 10px;
  color: #333;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 5px;
}

.disease-item,
.detection-item {
  margin-bottom: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
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

.explanation p {
  line-height: 1.6;
  color: #333;
}

.heatmap-preview {
  margin-top: 10px;
  text-align: center;
}

.heatmap-preview img {
  max-width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px;
  background: #f0f9eb;
  border: 1px solid #e1f3d8;
  border-radius: 4px;
}

.initial-state {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.initial-content {
  text-align: center;
  color: #666;
}

.initial-content h3 {
  margin: 15px 0 10px;
  color: #333;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header p {
  color: #666;
  margin: 0;
}

.simple-report-editor {
  padding: 20px 0;
}

.feedback-section {
  margin-top: 20px;
}
</style>