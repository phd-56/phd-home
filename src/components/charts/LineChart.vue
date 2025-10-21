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
      borderColor?: string
      backgroundColor?: string
      tension?: number
    }>,
    required: true,
    description: '图表数据数组，每个对象代表一条线'
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
  }
})

// 图表实例引用
const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// 生成随机颜色
const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  // 销毁已有图表实例
  if (chartInstance) {
    chartInstance.destroy()
  }

  // 准备数据集
  const datasets = props.data.map(item => ({
    label: item.name,
    data: item.data,
    borderColor: item.borderColor || getRandomColor(),
    backgroundColor: item.backgroundColor || `${getRandomColor()}20`, // 带透明度的背景色
    tension: item.tension !== undefined ? item.tension : 0.3,
    fill: item.backgroundColor !== undefined,
    pointRadius: 4,
    pointHoverRadius: 6
  }))

  // 创建图表实例
  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: props.xAxis,
      datasets
    },
    options: {
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
          mode: 'index',
          intersect: false,
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
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 12
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: 12
            },
            callback: function(value) {
              // 如果是百分比，添加%符号
              if (value <= 1 && value >= 0) {
                return `${(value * 100).toFixed(0)}%`
              }
              return value
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  })
}

// 监听数据变化，重新渲染图表
watch(
  () => [props.data, props.xAxis],
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