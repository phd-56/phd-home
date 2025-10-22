<template>
  <div class="dicom-viewer">
    <div class="viewer-container">
      <div class="toolbar">
        <el-button-group>
          <el-button 
            :type="activeTool === 'pan' ? 'primary' : ''"
            @click="setActiveTool('pan')"
            size="small"
          >
            <i class="el-icon-rank"></i> 移动
          </el-button>
          <el-button 
            :type="activeTool === 'zoom' ? 'primary' : ''"
            @click="setActiveTool('zoom')"
            size="small"
          >
            <i class="el-icon-zoom-in"></i> 缩放
          </el-button>
          <el-button 
            :type="activeTool === 'rectangle' ? 'primary' : ''"
            @click="setActiveTool('rectangle')"
            size="small"
          >
            <i class="el-icon-crop"></i> 矩形标注
          </el-button>
          <el-button 
            :type="activeTool === 'circle' ? 'primary' : ''"
            @click="setActiveTool('circle')"
            size="small"
          >
            <i class="el-icon-circle-check"></i> 圆形标注
          </el-button>
          <el-button 
            :type="activeTool === 'measure' ? 'primary' : ''"
            @click="setActiveTool('measure')"
            size="small"
          >
            <i class="el-icon-odometer"></i> 测量
          </el-button>
        </el-button-group>
        
        <el-button-group style="margin-left: 10px;">
          <el-button @click="toggleAnnotations" size="small">
            {{ showAnnotations ? '隐藏' : '显示' }}标注
          </el-button>
          <el-button @click="analyzeWithAI" :loading="isAnalyzing" size="small">
            AI分析
          </el-button>
        </el-button-group>
      </div>

      <div 
        ref="canvasContainer" 
        class="canvas-container"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @wheel="onWheel"
      >
        <canvas ref="mainCanvas" class="main-canvas"></canvas>
        <canvas ref="annotationCanvas" class="annotation-canvas"></canvas>
        
        <!-- AI分析结果覆盖层 -->
        <div v-if="showAIAnalysis && aiAnalysis" class="ai-analysis-overlay">
          <div class="analysis-panel">
            <h4>AI分析结果</h4>
            <div class="disease-list">
              <div 
                v-for="disease in aiAnalysis.diseases" 
                :key="disease.name"
                class="disease-item"
              >
                <span class="disease-name">{{ disease.name }}</span>
                <el-progress 
                  :percentage="Math.round(disease.confidence * 100)" 
                  :show-text="false"
                  :color="getConfidenceColor(disease.confidence)"
                />
                <span class="confidence">{{ Math.round(disease.confidence * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 标注属性面板 -->
      <div v-if="currentAnnotation" class="annotation-panel">
        <h4>标注属性</h4>
        <el-form label-width="80px">
          <el-form-item label="标签">
            <el-input v-model="currentAnnotation.label" />
          </el-form-item>
          <el-form-item label="颜色">
            <el-color-picker v-model="currentAnnotation.color" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveAnnotation">保存</el-button>
            <el-button @click="cancelAnnotation">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useMedicalImageStore } from '../../stores/medicalImageStore';
import type { Annotation, AIAnalysis } from '../../types';

const props = defineProps<{
  imageId: string;
  imageUrl: string;
}>();

const medicalImageStore = useMedicalImageStore();

// 响应式数据
const activeTool = ref<'pan' | 'zoom' | 'rectangle' | 'circle' | 'measure'>('pan');
const showAnnotations = ref(true);
const showAIAnalysis = ref(false);
const isAnalyzing = ref(false);
const currentAnnotation = ref<any>(null);
const isDrawing = ref(false);
const startX = ref(0);
const startY = ref(0);

const canvasContainer = ref<HTMLDivElement>();
const mainCanvas = ref<HTMLCanvasElement>();
const annotationCanvas = ref<HTMLCanvasElement>();

const aiAnalysis = computed(() => 
  medicalImageStore.images.find(img => img.id === props.imageId)?.aiAnalysis
);

// 工具方法
const setActiveTool = (tool: typeof activeTool.value) => {
  activeTool.value = tool;
};

const toggleAnnotations = () => {
  showAnnotations.value = !showAnnotations.value;
  drawAnnotations();
};

const analyzeWithAI = async () => {
  isAnalyzing.value = true;
  try {
    await medicalImageStore.analyzeImage(props.imageId);
    showAIAnalysis.value = true;
  } finally {
    isAnalyzing.value = false;
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence > 0.8) return '#67C23A';
  if (confidence > 0.6) return '#E6A23C';
  return '#F56C6C';
};

// 标注功能实现
const onMouseDown = (event: MouseEvent) => {
  if (!['rectangle', 'circle'].includes(activeTool.value)) return;
  
  const rect = canvasContainer.value!.getBoundingClientRect();
  startX.value = event.clientX - rect.left;
  startY.value = event.clientY - rect.top;
  isDrawing.value = true;
  
  currentAnnotation.value = {
    type: activeTool.value,
    coordinates: [startX.value, startY.value, 0, 0],
    label: '',
    color: '#ff0000'
  };
};

const onMouseMove = (event: MouseEvent) => {
  if (!isDrawing.value || !currentAnnotation.value) return;
  
  const rect = canvasContainer.value!.getBoundingClientRect();
  const currentX = event.clientX - rect.left;
  const currentY = event.clientY - rect.top;
  
  const width = currentX - startX.value;
  const height = currentY - startY.value;
  
  currentAnnotation.value.coordinates = [
    startX.value, 
    startY.value, 
    width, 
    height
  ];
  
  drawTemporaryAnnotation();
};

const onMouseUp = () => {
  isDrawing.value = false;
};

const onWheel = (event: WheelEvent) => {
  if (activeTool.value === 'zoom') {
    event.preventDefault();
    // 实现缩放逻辑
  }
};

const drawTemporaryAnnotation = () => {
  if (!annotationCanvas.value || !currentAnnotation.value) return;
  
  const ctx = annotationCanvas.value.getContext('2d')!;
  ctx.clearRect(0, 0, annotationCanvas.value.width, annotationCanvas.value.height);
  
  const [x, y, width, height] = currentAnnotation.value.coordinates;
  
  ctx.strokeStyle = currentAnnotation.value.color;
  ctx.lineWidth = 2;
  
  if (currentAnnotation.value.type === 'rectangle') {
    ctx.strokeRect(x, y, width, height);
  } else if (currentAnnotation.value.type === 'circle') {
    const radius = Math.sqrt(width * width + height * height);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
};

const drawAnnotations = () => {
  if (!annotationCanvas.value || !showAnnotations.value) return;
  
  const ctx = annotationCanvas.value.getContext('2d')!;
  ctx.clearRect(0, 0, annotationCanvas.value.width, annotationCanvas.value.height);
  
  const image = medicalImageStore.images.find(img => img.id === props.imageId);
  if (!image) return;
  
  image.annotations.forEach(annotation => {
    ctx.strokeStyle = annotation.color;
    ctx.lineWidth = 2;
    
    if (annotation.type === 'rectangle') {
      const [x, y, width, height] = annotation.coordinates;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = annotation.color + '20';
      ctx.fillRect(x, y, width, height);
    }
    // 其他标注类型的绘制逻辑...
  });
};

const saveAnnotation = () => {
  if (currentAnnotation.value) {
    medicalImageStore.addAnnotation(props.imageId, currentAnnotation.value);
    currentAnnotation.value = null;
    drawAnnotations();
  }
};

const cancelAnnotation = () => {
  currentAnnotation.value = null;
  drawAnnotations();
};

// 初始化
onMounted(() => {
  // 初始化Canvas大小
  const resizeCanvases = () => {
    if (canvasContainer.value && mainCanvas.value && annotationCanvas.value) {
      const { width, height } = canvasContainer.value.getBoundingClientRect();
      mainCanvas.value.width = width;
      mainCanvas.value.height = height;
      annotationCanvas.value.width = width;
      annotationCanvas.value.height = height;
    }
  };
  
  resizeCanvases();
  window.addEventListener('resize', resizeCanvases);
});

watch(() => props.imageId, drawAnnotations);
</script>

<style scoped>
.dicom-viewer {
  height: 100%;
  background: #000;
}

.viewer-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.toolbar {
  padding: 10px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
}

.main-canvas, .annotation-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.annotation-canvas {
  pointer-events: none;
}

.ai-analysis-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 4px;
  padding: 15px;
  min-width: 250px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.analysis-panel h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.disease-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 10px;
}

.disease-name {
  min-width: 80px;
  font-size: 12px;
}

.confidence {
  min-width: 40px;
  font-size: 12px;
  color: #909399;
}

.annotation-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  background: white;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 200px;
}
</style>