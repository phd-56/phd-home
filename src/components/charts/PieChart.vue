<template>
  <div class="pie-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { Chart, type ChartConfiguration, registerables } from 'chart.js'

// 注册 Chart.js 组件
Chart.register(...registerables)

// 定义数据集接口
interface Dataset {
  data: number[]
  backgroundColor?: string[]
  borderColor?: string[]
  borderWidth?: number
}

interface Props {
  data: {
    labels: string[]
    datasets: Dataset[]
  }
  options?: any
}

// 默认数据函数
const defaultData = () => ({
  labels: [] as string[],
  datasets: [{
    data: [] as number[],
    backgroundColor: [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ],
    borderColor: ['#fff'],
    borderWidth: 2
  }] as Dataset[]
})

const props = withDefaults(defineProps<Props>(), {
  data: defaultData,
  options: () => ({})
})

const chartCanvas = ref<HTMLCanvasElement>()
let chart: Chart | null = null

// 默认图表选项
const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return `${label}: ${value} (${percentage}%)`
        }
      }
    }
  }
}

// 初始化图表
const initChart = () => {
  if (!chartCanvas.value) return

  // 销毁现有图表
  if (chart) {
    chart.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  const config: ChartConfiguration = {
    type: 'pie',
    data: props.data,
    options: { ...defaultOptions, ...props.options }
  }

  chart = new Chart(ctx, config)
}

// 更新图表数据
const updateChart = () => {
  if (chart) {
    chart.data = props.data
    chart.update()
  }
}

// 生命周期
onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})

// 监听数据变化
watch(() => props.data, () => {
  updateChart()
}, { deep: true })

watch(() => props.options, () => {
  initChart()
}, { deep: true })
</script>

<style scoped>
.pie-chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>