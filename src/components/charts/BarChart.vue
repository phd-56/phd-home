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
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
    }>,
    required: true,
    description: '柱状图数据数组'
  },
  xAxis: {
    type: Array as () => string[],
    required: true,
    description: 'X轴标签数组'
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
  barPercentage: {
    type: Number,
    default: 0.6,
    description: '柱子宽度占类别宽度的比例'
  },
  categoryPercentage: {
    type: Number,
    default: 0.8,
    description: '类别宽度占整个轴宽度的比例'
  },
  isHorizontal: {
    type: Boolean,
    default: false,
    description: '是否为水平柱状图'
  }
})

// 图表实例引用
const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// 预设颜色方案
const COLOR_SCHEMES = [
  ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
  ['#ff9900', '#66cc00', '#cc0066', '#0066cc', '#6600cc'],
  ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FF6D01']
]

// 获取数据集颜色
const getDatasetColors = (index: number) => {
  const scheme = COLOR_SCHEMES[index % COLOR_SCHEMES.length]
  return {
    backgroundColor: scheme.map(color => `${color}80`), // 带透明度
    borderColor: scheme,
    borderWidth: 1
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  // 销毁已有图表实例
  if (chartInstance) {
    chartInstance.destroy()
  }

  // 准备数据集
  const datasets = props.data.map((item, index) => {
    const colors = getDatasetColors(index)
    
    return {
      label: item.name,
      data: item.data,
      backgroundColor: item.backgroundColor || colors.backgroundColor,
      borderColor: item.borderColor || colors.borderColor,
      borderWidth: 1,
      borderRadius: 4,
      hoverOffset: 4
    }
  })

  // 创建图表实例
  chartInstance = new Chart(chartRef.value, {
    type: props.isHorizontal ? 'bar' : 'bar',
    data: {
      labels: props.xAxis,
      datasets
    },
    options: {
      indexAxis: props.isHorizontal ? 'y' : 'x',
      responsive: props.responsive,
      maintainAspectRatio: props.maintainAspectRatio,
      plugins: {
        legend: {
          position: 'top',
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
              return `${context.dataset.label}: ${context.raw}`
            }
          }
        }
      },
      scales: {
        x: props.isHorizontal ? {
          beginAtZero: true,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        } : {
          beginAtZero: true,
          grid: {
            display: false
          }
        },
        y: props.isHorizontal ? {
          grid: {
            display: false
          }
        } : {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      barPercentage: props.barPercentage,
      categoryPercentage: props.categoryPercentage
    }
  })
}

// 监听数据变化，重新渲染图表
watch(
  () => [props.data, props.xAxis, props.isHorizontal],
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