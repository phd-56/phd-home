<template>
  <div class="image-diagnosis-center">
    <!-- 顶部信息栏 -->
    <div class="top-bar">
      <div class="top-bar-left">影像诊断中心</div>
      <div class="top-bar-center">
        <span>病例编号：{{ caseInfo.caseNumber }}</span>
        <span>患者：{{ caseInfo.patientName }}（{{ caseInfo.gender }}，{{ caseInfo.age }}岁）</span>
        <span>部位：{{ caseInfo.examPart }}</span>
      </div>
      <div class="top-bar-right">
        <button class="btn btn-save" @click="handleSave">保存</button>
        <button class="btn btn-ai" @click="handleAIAnalysis">AI分析</button>
        <button class="btn btn-report" @click="handleGenerateReport">生成报告</button>
      </div>
    </div>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 左侧工具栏 -->
      <div class="left-toolbar">
        <div 
          class="toolbar-item" 
          :class="{ active: activeTool === 'pan' }" 
          @click="setActiveTool('pan')"
          title="平移"
        >
          ⊙
        </div>
        <div 
          class="toolbar-item" 
          :class="{ active: activeTool === 'rotate' }" 
          @click="setActiveTool('rotate')"
          title="旋转"
        >
          ↻
        </div>
        <div 
          class="toolbar-item" 
          :class="{ active: activeTool === 'measure' }" 
          @click="setActiveTool('measure')"
          title="测量"
        >
          ⬚
        </div>
        <div 
          class="toolbar-item" 
          :class="{ active: activeTool === 'circle' }" 
          @click="setActiveTool('circle')"
          title="圆形标注"
        >
          ○
        </div>
        <div 
          class="toolbar-item" 
          :class="{ active: activeTool === 'rectangle' }" 
          @click="setActiveTool('rectangle')"
          title="矩形标注"
        >
          ✏
        </div>
        <div 
          class="toolbar-item" 
          :class="{ active: activeTool === 'arrow' }" 
          @click="setActiveTool('arrow')"
          title="箭头标注"
        >
          →
        </div>
        <div 
          class="toolbar-item" 
          :class="{ active: activeTool === 'text' }" 
          @click="setActiveTool('text')"
          title="文字标注"
        >
          T
        </div>
        <div 
          class="toolbar-item" 
          :class="{ active: activeTool === 'freehand' }" 
          @click="setActiveTool('freehand')"
          title="自由绘制"
        >
          ✎
        </div>
        <div 
          class="toolbar-item" 
          :class="{ active: activeTool === 'reset' }" 
          @click="resetView"
          title="重置视图"
        >
          ⬆
        </div>
      </div>

      <!-- 中间影像区域 -->
      <div class="middle-section">
        <!-- 影像控制栏 -->
        <div class="image-controls">
          <div class="series-info">影像序列：{{ currentSeries.name }} ({{ currentImageIndex + 1 }}/{{ images.length }})</div>
          <div class="nav-buttons">
            <button class="nav-btn" @click="previousImage" :disabled="currentImageIndex === 0">←</button>
            <button class="nav-btn" @click="nextImage" :disabled="currentImageIndex === images.length - 1">→</button>
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
              <p>请在影像诊断页面上传影像后进入</p>
              <div class="debug-info">
                <p>调试信息：</p>
                <p>影像数量: {{ images.length }}</p>
                <p>当前索引: {{ currentImageIndex }}</p>
                <p>路由状态: {{ route.state ? '有数据' : '无数据' }}</p>
              </div>
            </div>
            
            <!-- 动态标注 -->
            <div 
              v-for="(annotation, index) in annotations" 
              :key="index"
              class="annotation" 
              :class="annotation.type"
              :style="annotation.style"
              @click="selectAnnotation(index)"
            >
              <div class="annotation-label">{{ annotation.label }}</div>
              <div v-if="selectedAnnotation === index" class="annotation-controls">
                <button @click="editAnnotation(index)">编辑</button>
                <button @click="deleteAnnotation(index)">删除</button>
              </div>
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
        <div class="thumbnail-nav" v-if="images.length > 0">
          <div 
            v-for="(image, index) in images" 
            :key="index"
            class="thumbnail" 
            :class="{ active: index === currentImageIndex }"
            @click="selectImage(index)"
          >
            <img v-if="image.url" :src="image.url" :alt="image.name" class="thumbnail-image">
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
            :class="{ active: activeTab === 'annotations' }"
            @click="setActiveTab('annotations')"
          >
            标注对照表
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

          <!-- 标注对照表 -->
          <div v-if="activeTab === 'annotations'">
            <div class="section-title">标注列表</div>
            <div 
              v-for="(annotation, index) in annotations" 
              :key="index"
              class="annotation-item"
              :class="{ selected: selectedAnnotation === index }"
              @click="selectAnnotation(index)"
            >
              <div class="annotation-info">
                <div class="annotation-name">{{ annotation.label }}</div>
                <div class="annotation-type">{{ annotation.type }}</div>
              </div>
              <div class="annotation-actions">
                <button @click="editAnnotation(index)">编辑</button>
                <button @click="deleteAnnotation(index)">删除</button>
              </div>
            </div>
          </div>

          <!-- 患者信息 -->
          <div v-if="activeTab === 'patient'">
            <div class="section-title">基本信息</div>
            <div class="patient-info">
              <div class="info-item">
                <span class="label">姓名：</span>
                <span class="value">{{ caseInfo.patientName }}</span>
              </div>
              <div class="info-item">
                <span class="label">性别：</span>
                <span class="value">{{ caseInfo.gender }}</span>
              </div>
              <div class="info-item">
                <span class="label">年龄：</span>
                <span class="value">{{ caseInfo.age }}岁</span>
              </div>
              <div class="info-item">
                <span class="label">科室：</span>
                <span class="value">{{ caseInfo.department }}</span>
              </div>
              <div class="info-item">
                <span class="label">医生：</span>
                <span class="value">{{ caseInfo.doctor }}</span>
              </div>
            </div>

            <div class="section-title">检查信息</div>
            <div class="exam-info">
              <div class="info-item">
                <span class="label">检查类型：</span>
                <span class="value">{{ caseInfo.examType }}</span>
              </div>
              <div class="info-item">
                <span class="label">检查部位：</span>
                <span class="value">{{ caseInfo.examPart }}</span>
              </div>
              <div class="info-item">
                <span class="label">检查日期：</span>
                <span class="value">{{ caseInfo.examDate }}</span>
              </div>
              <div class="info-item">
                <span class="label">设备：</span>
                <span class="value">{{ caseInfo.equipment }}</span>
              </div>
            </div>

            <div class="section-title">临床症状</div>
            <div class="symptoms-info">
              {{ caseInfo.symptoms || '暂无临床症状描述' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 响应式数据
const activeTool = ref('pan')
const activeTab = ref('diagnosis')
const currentImageIndex = ref(0)
const selectedAnnotation = ref(-1)
const isDrawing = ref(false)
const currentColor = ref('#ff4d4f')

// 影像相关
const windowLevel = ref(40)
const windowWidth = ref(400)
const zoomLevel = ref(1)
const panX = ref(0)
const panY = ref(0)

// 绘制相关
const drawingPath = ref('')
const drawingRect = ref({ x: 0, y: 0, width: 0, height: 0 })
const drawingCircle = ref({ cx: 0, cy: 0, r: 0 })
const drawingStyle = ref({})

// 引用
const imageViewer = ref<HTMLElement>()
const imageContainer = ref<HTMLElement>()
const annotationCanvas = ref<HTMLCanvasElement>()

// Canvas相关
let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let isMouseDown = false
let startX = 0
let startY = 0

// 病例信息
const caseInfo = reactive({
  caseNumber: '',
  patientName: '',
  gender: '',
  age: '',
  department: '',
  doctor: '',
  examType: '',
  examPart: '',
  examDate: '',
  equipment: '',
  symptoms: ''
})

// 影像数据
const images = ref<Array<{
  name: string
  url: string
  type: string
  size: number
  index: number
}>>([])

const currentSeries = ref({
  name: 'AX T2WI',
  count: 0
})

// 标注数据
const annotations = ref([
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

// 诊断结果
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

// 计算属性
const currentImage = computed(() => {
  return images.value.length > 0 ? images.value[currentImageIndex.value] : null
})

const imageStyle = computed(() => ({
  transform: `scale(${zoomLevel.value}) translate(${panX.value}px, ${panY.value}px)`,
  filter: `contrast(${windowWidth.value / 100}) brightness(${windowLevel.value / 100})`
}))

// 方法
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
  if (currentImageIndex.value < images.value.length - 1) {
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
    windowLevel.value = 400
    windowWidth.value = 2000
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

const resetView = () => {
  resetZoom()
  windowLevel.value = 40
  windowWidth.value = 400
}

const selectAnnotation = (index: number) => {
  selectedAnnotation.value = index
}

const editAnnotation = (index: number) => {
  const newLabel = prompt('请输入新的标注名称:', annotations.value[index].label)
  if (newLabel) {
    annotations.value[index].label = newLabel
  }
}

const deleteAnnotation = (index: number) => {
  if (confirm('确定要删除这个标注吗？')) {
    annotations.value.splice(index, 1)
    selectedAnnotation.value = -1
  }
}

const onImageLoad = () => {
  // 图片加载完成
}

const onMouseDown = (e: MouseEvent) => {
  if (activeTool.value === 'pan') {
    // 平移功能
    isDrawing.value = true
  } else if (['rectangle', 'circle', 'freehand'].includes(activeTool.value)) {
    // 绘制功能
    isDrawing.value = true
    const rect = imageContainer.value?.getBoundingClientRect()
    if (rect) {
      const startX = e.clientX - rect.left
      const startY = e.clientY - rect.top
      
      if (activeTool.value === 'rectangle') {
        drawingRect.value = { x: startX, y: startY, width: 0, height: 0 }
      } else if (activeTool.value === 'circle') {
        drawingCircle.value = { cx: startX, cy: startY, r: 0 }
      } else if (activeTool.value === 'freehand') {
        drawingPath.value = `M ${startX} ${startY}`
      }
    }
  }
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDrawing.value) return
  
  const rect = imageContainer.value?.getBoundingClientRect()
  if (!rect) return
  
  const currentX = e.clientX - rect.left
  const currentY = e.clientY - rect.top
  
  if (activeTool.value === 'rectangle') {
    drawingRect.value.width = currentX - drawingRect.value.x
    drawingRect.value.height = currentY - drawingRect.value.y
  } else if (activeTool.value === 'circle') {
    const dx = currentX - drawingCircle.value.cx
    const dy = currentY - drawingCircle.value.cy
    drawingCircle.value.r = Math.sqrt(dx * dx + dy * dy)
  } else if (activeTool.value === 'freehand') {
    drawingPath.value += ` L ${currentX} ${currentY}`
  }
}

const onMouseUp = () => {
  if (isDrawing.value) {
    isDrawing.value = false
    
    // 完成绘制，添加到标注列表
    if (['rectangle', 'circle', 'freehand'].includes(activeTool.value)) {
      const newAnnotation = {
        type: activeTool.value === 'freehand' ? 'red' : 'yellow',
        label: `标注${annotations.value.length + 1}`,
        style: {
          width: activeTool.value === 'rectangle' ? `${Math.abs(drawingRect.value.width)}px` : '100px',
          height: activeTool.value === 'rectangle' ? `${Math.abs(drawingRect.value.height)}px` : '80px',
          left: `${drawingRect.value.x}px`,
          top: `${drawingRect.value.y}px`
        }
      }
      annotations.value.push(newAnnotation)
    }
  }
}

const onWheel = (e: WheelEvent) => {
  e.preventDefault()
  if (e.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

const handleSave = () => {
  ElMessage.success('诊断结果已保存')
}

const handleAIAnalysis = () => {
  ElMessage.info('正在重新进行AI分析...')
  // 这里可以调用AI分析API
}

const handleGenerateReport = () => {
  ElMessage.success('报告生成中...')
  // 这里可以生成诊断报告
}

// Canvas初始化
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
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // 添加事件监听器
      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseup', handleMouseUp)
      
      console.log('Canvas initialized successfully')
    }
  }
}

// 鼠标事件处理
const handleMouseDown = (e: MouseEvent) => {
  if (!canvas || !ctx) return
  
  isMouseDown = true
  const rect = canvas.getBoundingClientRect()
  startX = e.clientX - rect.left
  startY = e.clientY - rect.top
  
  if (activeTool.value === 'freehand') {
    ctx.beginPath()
    ctx.moveTo(startX, startY)
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isMouseDown || !canvas || !ctx) return
  
  const rect = canvas.getBoundingClientRect()
  const currentX = e.clientX - rect.left
  const currentY = e.clientY - rect.top
  
  switch (activeTool.value) {
    case 'freehand':
      ctx.lineTo(currentX, currentY)
      ctx.stroke()
      break
      
    case 'rectangle':
      // 清除并重绘
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeRect(startX, startY, currentX - startX, currentY - startY)
      break
      
    case 'circle':
      // 清除并重绘
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2))
      ctx.beginPath()
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI)
      ctx.stroke()
      break
      
    case 'pan':
      // 平移逻辑
      panX.value += currentX - startX
      panY.value += currentY - startY
      startX = currentX
      startY = currentY
      break
  }
}

const handleMouseUp = () => {
  if (!isMouseDown) return
  
  isMouseDown = false
  
  if (['rectangle', 'circle'].includes(activeTool.value)) {
    // 完成绘制，添加到标注列表
    const newAnnotation = {
      type: activeTool.value === 'rectangle' ? 'yellow' : 'red',
      label: `${activeTool.value === 'rectangle' ? '矩形' : '圆形'}标注${annotations.value.length + 1}`,
      style: {
        width: '100px',
        height: '80px',
        left: `${startX}px`,
        top: `${startY}px`
      }
    }
    annotations.value.push(newAnnotation)
  }
}

// 初始化
onMounted(async () => {
  console.log('ImageDiagnosisCenter mounted')
  console.log('Route state:', route.state)
  
  // 从路由状态获取数据
  if (route.state) {
    console.log('Found route state, processing data...')
    
    if (route.state.caseInfo) {
      console.log('Case info:', route.state.caseInfo)
      Object.assign(caseInfo, route.state.caseInfo)
    }
    
    if (route.state.images && Array.isArray(route.state.images)) {
      console.log('Images data:', route.state.images)
      images.value = route.state.images
      currentSeries.value.count = images.value.length
      console.log('Images loaded:', images.value.length)
    }
    
    if (route.state.diagnosisResult) {
      console.log('Diagnosis result:', route.state.diagnosisResult)
      diagnosisResult.value = route.state.diagnosisResult
    }
  } else {
    console.log('No route state found')
    // 如果没有路由状态，使用默认的测试影像
    if (images.value.length === 0) {
      console.log('Using default test image')
      images.value = [{
        name: 'test-image.png',
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%B1%80%E9%83%A8%E6%88%AA%E5%8F%96_20251028_012318-sgzgq9tgcZWM3DmBU6q0DVxf9GQNws.png',
        type: 'image/png',
        size: 0,
        index: 0
      }]
      currentSeries.value.count = 1
      
      // 设置默认的病例信息
      Object.assign(caseInfo, {
        caseNumber: 'CASE-20230815-003',
        patientName: '张美丽',
        gender: '女',
        age: 45,
        department: '骨科',
        doctor: '张医生',
        examType: 'MRI',
        examPart: '腰椎（L1-L5）',
        examDate: '2023-08-15',
        equipment: 'MRI设备1',
        symptoms: '腰痛伴下肢放射痛3个月，加重1周'
      })
    }
  }
  
  // 等待DOM更新后初始化Canvas
  await nextTick()
  initCanvas()
})

// 组件卸载时清理资源
onBeforeUnmount(() => {
  // 释放临时URL对象，避免内存泄漏
  images.value.forEach(img => {
    if (img.url.startsWith('blob:')) {
      URL.revokeObjectURL(img.url)
    }
  })
  
  // 清理Canvas事件监听器
  if (canvas) {
    canvas.removeEventListener('mousedown', handleMouseDown)
    canvas.removeEventListener('mousemove', handleMouseMove)
    canvas.removeEventListener('mouseup', handleMouseUp)
  }
})

// 获取鼠标样式
const getCursorStyle = () => {
  switch (activeTool.value) {
    case 'pan':
      return 'grab'
    case 'freehand':
      return 'crosshair'
    case 'rectangle':
    case 'circle':
      return 'crosshair'
    case 'measure':
      return 'crosshair'
    case 'text':
      return 'text'
    default:
      return 'default'
  }
}
</script>

<style scoped>
.image-diagnosis-center {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

/* 顶部信息栏 */
.top-bar {
  background: white;
  border-bottom: 1px solid #e5e5e5;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.zoom-btn {
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
  font-size: 12px;
}

.zoom-btn:hover {
  background: #555;
  color: #fff;
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
  transition: transform 0.3s ease;
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
  cursor: pointer;
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
}

.annotation.yellow .annotation-label {
  background: #faad14;
}

.annotation-controls {
  position: absolute;
  top: -40px;
  left: 0;
  display: flex;
  gap: 4px;
}

.annotation-controls button {
  padding: 2px 6px;
  font-size: 10px;
  background: #333;
  color: white;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}

.annotation-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  z-index: 10;
}

.no-image-placeholder {
  color: #ccc;
  text-align: center;
  font-size: 16px;
}

.no-image-placeholder p {
  margin: 10px 0;
}

.debug-info {
  margin-top: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 12px;
}

.debug-info p {
  margin: 5px 0;
  color: #999;
}

/* 缩略图导航 */
.thumbnail-nav {
  background: #2a2a2a;
  padding: 12px 20px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  border-top: 1px solid #444;
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
  overflow: hidden;
}

.thumbnail:hover {
  border-color: #1890ff;
}

.thumbnail.active {
  border-color: #1890ff;
  background: #1890ff;
  color: white;
}

/* 右侧诊断结果面板 */
.right-panel {
  width: 380px;
  background: white;
  border-left: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid #e5e5e5;
  background: #fafafa;
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

.annotation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.annotation-item:hover {
  background: #f5f5f5;
}

.annotation-item.selected {
  border-color: #1890ff;
  background: #f0f7ff;
}

.annotation-info {
  flex: 1;
}

.annotation-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.annotation-type {
  font-size: 11px;
  color: #999;
}

.annotation-actions {
  display: flex;
  gap: 4px;
}

.annotation-actions button {
  padding: 4px 8px;
  font-size: 11px;
  background: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}

.patient-info,
.exam-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 13px;
}

.info-item .label {
  width: 80px;
  color: #666;
}

.info-item .value {
  color: #333;
  font-weight: 500;
}

.symptoms-info {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
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
