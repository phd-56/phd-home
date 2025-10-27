<template>
  <div class="image-viewer">
    <div class="viewer-header">
      <h2>医学影像查看器</h2>
      <div class="toolbar">
        <el-button-group>
          <el-button @click="zoomIn">
            <el-icon><ZoomIn /></el-icon>
          </el-button>
          <el-button @click="zoomOut">
            <el-icon><ZoomOut /></el-icon>
          </el-button>
          <el-button @click="resetView">
            <el-icon><FullScreen /></el-icon>
          </el-button>
        </el-button-group>
        
        <el-button-group class="ml-2">
          <el-button 
            :type="activeTool === 'select' ? 'primary' : 'default'"
            @click="setTool('select')"
          >
            选择
          </el-button>
          <el-button 
            :type="activeTool === 'rectangle' ? 'primary' : 'default'"
            @click="setTool('rectangle')"
          >
            矩形
          </el-button>
          <el-button 
            :type="activeTool === 'circle' ? 'primary' : 'default'"
            @click="setTool('circle')"
          >
            圆形
          </el-button>
          <el-button 
            :type="activeTool === 'line' ? 'primary' : 'default'"
            @click="setTool('line')"
          >
            直线
          </el-button>
        </el-button-group>
        
        <el-button class="ml-2" @click="clearAnnotations">
          清除标注
        </el-button>
      </div>
    </div>

    <div class="viewer-content">
      <!-- 影像列表 -->
      <div class="image-list">
        <div class="list-header">
          <h3>影像列表</h3>
          <el-button type="primary" size="small" @click="uploadImage">
            <el-icon><Upload /></el-icon>
            上传影像
          </el-button>
        </div>
        
        <div class="image-thumbnails">
          <div
            v-for="image in images"
            :key="image.id"
            :class="['thumbnail', { active: currentImage?.id === image.id }]"
            @click="selectImage(image)"
          >
            <img :src="image.thumbnail" :alt="image.name" />
            <div class="thumbnail-info">
              <span>{{ image.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 主查看区域 -->
      <div class="main-viewer">
        <div class="viewer-container" ref="viewerContainer">
          <canvas ref="canvas" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" />
        </div>
        
        <div class="viewer-info">
          <div class="info-item">
            <span class="label">缩放:</span>
            <span class="value">{{ (zoom * 100).toFixed(0) }}%</span>
          </div>
          <div class="info-item">
            <span class="label">位置:</span>
            <span class="value">{{ mousePosition.x }}, {{ mousePosition.y }}</span>
          </div>
          <div class="info-item">
            <span class="label">当前工具:</span>
            <span class="value">{{ getToolName(activeTool) }}</span>
          </div>
        </div>
      </div>

      <!-- 标注列表 -->
      <div class="annotations-panel">
        <h3>标注列表</h3>
        <div class="annotations-list">
          <div
            v-for="(annotation, index) in annotations"
            :key="index"
            class="annotation-item"
          >
            <div class="annotation-info">
              <span class="type">{{ annotation.type }}</span>
              <span class="coordinates">
                ({{ annotation.x }}, {{ annotation.y }})
              </span>
            </div>
            <div class="annotation-actions">
              <el-button link type="primary" @click="editAnnotation(annotation)">
                编辑
              </el-button>
              <el-button link type="danger" @click="deleteAnnotation(index)">
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传影像对话框 -->
    <el-dialog v-model="showUploadDialog" title="上传医学影像" width="500px">
      <el-upload
        class="upload-demo"
        drag
        multiple
        :before-upload="beforeUpload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 DICOM、JPG、PNG 格式，单文件不超过 10MB
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
//import { ZoomIn, ZoomOut, FullScreen, Upload, UploadFilled } from '@element-plus/icons-vue'

interface MedicalImage {
  id: string
  name: string
  url: string
  thumbnail: string
  type: string
  size: number
  uploadTime: string
}

interface Annotation {
  type: string
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  color: string
}

const viewerContainer = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const showUploadDialog = ref(false)

const images = ref<MedicalImage[]>([
  {
    id: '1',
    name: '膝关节X光片',
    url: 'https://via.placeholder.com/800x600?text=Knee+X-Ray',
    thumbnail: 'https://via.placeholder.com/100x100?text=Knee',
    type: 'image/jpeg',
    size: 2048,
    uploadTime: '2024-01-15T10:30:00'
  },
  {
    id: '2',
    name: '腰椎MRI',
    url: 'https://via.placeholder.com/800x600?text=Spine+MRI',
    thumbnail: 'https://via.placeholder.com/100x100?text=Spine',
    type: 'image/jpeg',
    size: 4096,
    uploadTime: '2024-01-14T14:20:00'
  }
])

const currentImage = ref<MedicalImage | null>(null)
const zoom = ref(1)
const activeTool = ref('select')
const isDrawing = ref(false)
const startPos = reactive({ x: 0, y: 0 })
const mousePosition = reactive({ x: 0, y: 0 })
const annotations = ref<Annotation[]>([])
const ctx = ref<CanvasRenderingContext2D | null>(null)
// 修复 TypeScript 错误：使用函数而不是对象索引
const getToolName = (tool: string): string => {
  const toolNames: Record<string, string> = {
    select: '选择',
    rectangle: '矩形', 
    circle: '圆形',
    line: '直线'
  }
  return toolNames[tool] || '未知工具'
}

const toolNames = {
  select: '选择',
  rectangle: '矩形',
  circle: '圆形',
  line: '直线'
}

const initCanvas = () => {
  if (!canvas.value) return
  
  ctx.value = canvas.value.getContext('2d')
  resizeCanvas()
}

const resizeCanvas = () => {
  if (!canvas.value || !viewerContainer.value) return
  
  const container = viewerContainer.value
  canvas.value.width = container.clientWidth
  canvas.value.height = container.clientHeight
  
  drawImage()
}

const drawImage = () => {
  if (!ctx.value || !currentImage.value) return
  
  // 清空画布
  ctx.value.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
  
  // 绘制背景网格
  drawGrid()
  
  // 绘制影像（模拟）
  ctx.value.fillStyle = '#ffffff'
  ctx.value.fillRect(50, 50, 600, 400)
  ctx.value.fillStyle = '#000000'
  ctx.value.font = '16px Arial'
  ctx.value.fillText('医学影像显示区域', 250, 250)
  ctx.value.fillText(currentImage.value.name, 250, 280)
  
  // 绘制标注
  drawAnnotations()
}

const drawGrid = () => {
  if (!ctx.value) return
  
  ctx.value.strokeStyle = '#e0e0e0'
  ctx.value.lineWidth = 0.5
  
  const width = canvas.value!.width
  const height = canvas.value!.height
  const gridSize = 20
  
  for (let x = 0; x <= width; x += gridSize) {
    ctx.value.beginPath()
    ctx.value.moveTo(x, 0)
    ctx.value.lineTo(x, height)
    ctx.value.stroke()
  }
  
  for (let y = 0; y <= height; y += gridSize) {
    ctx.value.beginPath()
    ctx.value.moveTo(0, y)
    ctx.value.lineTo(width, y)
    ctx.value.stroke()
  }
}

const drawAnnotations = () => {
  if (!ctx.value) return
  
  annotations.value.forEach(annotation => {
    ctx.value!.strokeStyle = annotation.color
    ctx.value!.lineWidth = 2
    
    switch (annotation.type) {
      case 'rectangle':
        ctx.value!.strokeRect(annotation.x, annotation.y, annotation.width!, annotation.height!)
        break
      case 'circle':
        ctx.value!.beginPath()
        ctx.value!.arc(annotation.x, annotation.y, annotation.radius!, 0, 2 * Math.PI)
        ctx.value!.stroke()
        break
      case 'line':
        ctx.value!.beginPath()
        ctx.value!.moveTo(annotation.x, annotation.y)
        ctx.value!.lineTo(annotation.x + (annotation.width || 0), annotation.y + (annotation.height || 0))
        ctx.value!.stroke()
        break
    }
  })
}

const selectImage = (image: MedicalImage) => {
  currentImage.value = image
  drawImage()
}

const zoomIn = () => {
  zoom.value = Math.min(zoom.value * 1.2, 5)
  drawImage()
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value / 1.2, 0.2)
  drawImage()
}

const resetView = () => {
  zoom.value = 1
  drawImage()
}

const setTool = (tool: string) => {
  activeTool.value = tool
}

const clearAnnotations = () => {
  annotations.value = []
  drawImage()
  ElMessage.success('已清除所有标注')
}

const onMouseDown = (event: MouseEvent) => {
  if (!canvas.value || activeTool.value === 'select') return
  
  const rect = canvas.value.getBoundingClientRect()
  startPos.x = event.clientX - rect.left
  startPos.y = event.clientY - rect.top
  isDrawing.value = true
}

const onMouseMove = (event: MouseEvent) => {
  if (!canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  mousePosition.x = event.clientX - rect.left
  mousePosition.y = event.clientY - rect.top
  
  if (isDrawing.value) {
    // 实时绘制预览
    drawImage()
    
    const currentAnnotation: Annotation = {
      type: activeTool.value,
      x: startPos.x,
      y: startPos.y,
      color: '#ff0000'
    }
    
    switch (activeTool.value) {
      case 'rectangle':
        currentAnnotation.width = mousePosition.x - startPos.x
        currentAnnotation.height = mousePosition.y - startPos.y
        break
      case 'circle':
        currentAnnotation.radius = Math.sqrt(
          Math.pow(mousePosition.x - startPos.x, 2) + 
          Math.pow(mousePosition.y - startPos.y, 2)
        )
        break
      case 'line':
        currentAnnotation.width = mousePosition.x - startPos.x
        currentAnnotation.height = mousePosition.y - startPos.y
        break
    }
    
    // 临时绘制当前标注
    if (ctx.value) {
      ctx.value.strokeStyle = currentAnnotation.color
      ctx.value.lineWidth = 2
      
      switch (currentAnnotation.type) {
        case 'rectangle':
          ctx.value.strokeRect(
            currentAnnotation.x, 
            currentAnnotation.y, 
            currentAnnotation.width!, 
            currentAnnotation.height!
          )
          break
        case 'circle':
          ctx.value.beginPath()
          ctx.value.arc(
            currentAnnotation.x, 
            currentAnnotation.y, 
            currentAnnotation.radius!, 
            0, 
            2 * Math.PI
          )
          ctx.value.stroke()
          break
        case 'line':
          ctx.value.beginPath()
          ctx.value.moveTo(currentAnnotation.x, currentAnnotation.y)
          ctx.value.lineTo(
            currentAnnotation.x + currentAnnotation.width!, 
            currentAnnotation.y + currentAnnotation.height!
          )
          ctx.value.stroke()
          break
      }
    }
  }
}

const onMouseUp = (event: MouseEvent) => {
  if (!isDrawing.value || !canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const endX = event.clientX - rect.left
  const endY = event.clientY - rect.top
  
  const annotation: Annotation = {
    type: activeTool.value,
    x: startPos.x,
    y: startPos.y,
    color: '#ff0000'
  }
  
  switch (activeTool.value) {
    case 'rectangle':
      annotation.width = endX - startPos.x
      annotation.height = endY - startPos.y
      break
    case 'circle':
      annotation.radius = Math.sqrt(
        Math.pow(endX - startPos.x, 2) + Math.pow(endY - startPos.y, 2)
      )
      break
    case 'line':
      annotation.width = endX - startPos.x
      annotation.height = endY - startPos.y
      break
  }
  
  annotations.value.push(annotation)
  isDrawing.value = false
  drawImage()
}

const uploadImage = () => {
  showUploadDialog.value = true
}

const beforeUpload = (file: File) => {
  const isValidType = ['image/jpeg', 'image/png', 'application/dicom'].includes(file.type)
  const isValidSize = file.size / 1024 / 1024 < 10
    
  if (!isValidType) {
    ElMessage.error('只能上传 JPG、PNG 或 DICOM 格式的影像文件!')
    return false
  }
  if (!isValidSize) {
    ElMessage.error('影像文件大小不能超过 10MB!')
    return false
  }
  return true
}

const handleUploadSuccess = (response: any, file: File) => {
  ElMessage.success('影像上传成功')
  showUploadDialog.value = false
  
  // 添加到影像列表
  const newImage: MedicalImage = {
    id: Date.now().toString(),
    name: file.name,
    url: URL.createObjectURL(file),
    thumbnail: URL.createObjectURL(file),
    type: file.type,
    size: file.size,
    uploadTime: new Date().toISOString()
  }
  
  images.value.push(newImage)
}

const handleUploadError = (error: Error) => {
  ElMessage.error('影像上传失败')
}

const editAnnotation = (annotation: Annotation) => {
  // 编辑标注逻辑
  ElMessage.info('编辑标注功能')
}

const deleteAnnotation = (index: number) => {
  annotations.value.splice(index, 1)
  drawImage()
  ElMessage.success('标注已删除')
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  // 默认选择第一个影像
  if (images.value.length > 0) {
    selectImage(images.value[0])
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.image-viewer {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.viewer-content {
  display: flex;
  flex: 1;
  gap: 20px;
  height: calc(100vh - 160px);
}

.image-list {
  width: 250px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.image-thumbnails {
  flex: 1;
  overflow-y: auto;
}

.thumbnail {
  border: 2px solid transparent;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.thumbnail.active {
  border-color: #409eff;
}

.thumbnail img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.thumbnail-info {
  padding: 5px;
  font-size: 12px;
  text-align: center;
}

.main-viewer {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.viewer-container {
  flex: 1;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.viewer-container canvas {
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.viewer-info {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-top: 10px;
  display: flex;
  gap: 20px;
}

.info-item {
  display: flex;
  gap: 5px;
}

.label {
  font-weight: bold;
  color: #666;
}

.annotations-panel {
  width: 250px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.annotations-list {
  max-height: 400px;
  overflow-y: auto;
}

.annotation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.annotation-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.annotation-info .type {
  font-weight: bold;
  font-size: 12px;
}

.annotation-info .coordinates {
  font-size: 10px;
  color: #666;
}

.ml-2 {
  margin-left: 8px;
}
</style>