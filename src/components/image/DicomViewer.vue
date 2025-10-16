<template>
  <div class="simple-viewer">
    <h3>DICOM查看器</h3>
    <div class="viewer-area">
      <canvas ref="canvasRef" width="600" height="400" style="border: 1px solid #ccc;"></canvas>
    </div>
    <div class="controls">
      <button @click="drawTest">绘制测试图像</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()

const drawTest = () => {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx) return
  
  // 清空画布
  ctx.clearRect(0, 0, 600, 400)
  
  // 绘制背景
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, 600, 400)
  
  // 绘制测试文本
  ctx.fillStyle = '#409eff'
  ctx.font = 'bold 24px Arial'
  ctx.fillText('DICOM 查看器', 200, 150)
  
  ctx.fillStyle = '#666'
  ctx.font = '16px Arial' 
  ctx.fillText('功能开发中...', 240, 200)
  
  // 绘制一个简单的医学图像示意
  ctx.strokeStyle = '#ff6b6b'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(300, 280, 50, 0, 2 * Math.PI)
  ctx.stroke()
  
  ctx.fillStyle = '#ff6b6b'
  ctx.fillText('影像区域', 260, 350)
}

onMounted(() => {
  drawTest()
})
</script>

<style scoped>
.simple-viewer {
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin: 10px 0;
}
.controls {
  margin-top: 10px;
}
button {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #66b1ff;
}
</style>