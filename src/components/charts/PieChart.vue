<template>
  <div class="chart-container" :style="{ width: width, height: height }">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, watch } from 'vue'
import Chart from 'chart.js/auto'

// 定义组件属性
const props = defineProps({
  data: {
    type: Array as () => Array<{
      name: string
      data: Array<{ name: string; value: number; color?: string }>
    }>,
    required: true,
    description: '饼图数据数组，支持多组数据对比'
  },
  width: {
    type: String,
    default: '100%',
    description: '图表宽度'
  },
  height: {
    type: String,
    default: '300px',
    description: '图表高度'
  },
  title: {
    type: String,
    default: '',
    description: '图表标题'
  },
  responsive: {
    type: Boolean,
    default: true,
    description: '是否响应式'
  },
  maintainAspectRatio: {
    type: Boolean,
    default: false,
    description: '是否保持纵横比'
  },
  displayLegend: {
    type: Boolean,
    default: true,
    description: '是否显示图例'
  },
  legendPosition: {
    type: String as () => 'top' | 'right' | 'bottom' | 'left',
    default: 'right',
    description: '图例位置'
  }
})

// 图表实例引用
const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// 生成随机颜色
const getRandomColor = () => {
  const colors = [
    '#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', 
    '#ff9900', '#66cc00', '#cc0066', '#0066cc', '#6600cc'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  // 销毁已有图表实例
  if (chartInstance) {
    chartInstance.destroy()
  }

  // 处理单组数据和多组数据的情况
  let datasets: any[] = []
  
  if (props.data.length === 1 && Array.isArray(props.data[0].data)) {
    // 单组数据 - 标准饼图
    const data = props.data[0].data
    datasets = [{
      label: props.data[0].name,
      data: data.map(item => item.value),
      backgroundColor: data.map(item => item.color || getRandomColor()),
      borderColor: '#ffffff',
      borderWidth: 2
    }]
  } else {
    // 多组数据 - 环形对比图
    datasets = props.data.map((dataset, index) => ({
      label: dataset.name,
      data: dataset.data.map(item => item.value),
      backgroundColor: dataset.data.map(item => item.color || getRandomColor()),
      borderColor: '#ffffff',
      borderWidth: 2,
      radius: index === 0 ? '70%' : '50%',
      hoverOffset: 4
    }))
  }

  // 准备标签
  const labels = props.data[0]?.data.map(item => item.name) || []

  // 创建图表实例
  chartInstance = new Chart(chartRef.value, {
    type: 'doughnut', // 使用doughnut类型支持多环图
    data: {
      labels,
      datasets
    },
    options: {
      responsive: props.responsive,
      maintainAspectRatio: props.maintainAspectRatio,
      plugins: {
        legend: {
          display: props.displayLegend,
          position: props.legendPosition,
          labels: {
            padding: 20,
            font: {
              size: 12
            },
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        title: {
          display: props.title !== '',
          text: props.title,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.raw || 0
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
              const percentage = Math.round((value / total) * 100)
              return `${label}: ${value} (${percentage}%)`
            }
          }
        }
      },
      cutout: props.data.length > 1 ? '40%' : '0%', // 多组数据时显示为环形图
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  })
}

// 监听数据变化，重新渲染图表
watch(
  () => props.data,
  () => {
    initChart()
  },
  { deep: true }
)

// 组件挂载时初始化图表
onMounted(() => {
  initChart()
})

// 组件卸载时销毁图表
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
}
</style>