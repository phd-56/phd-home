<template>
  <div class="line-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { Chart, type ChartConfiguration, registerables } from 'chart.js'

// 注册 Chart.js 组件
Chart.register(...registerables)

// 定义数据集接口
interface LineDataset {
  label: string
  data: number[]
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  fill?: boolean
  tension?: number
}

interface Props {
  data: {
    labels: string[]
    datasets: LineDataset[]
  }
  options?: any
}

// 默认数据函数
const defaultData = () => ({
  labels: [] as string[],
  datasets: [{
    label: '',
    data: [] as number[],
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 2,
    fill: true,
    tension: 0.4
  }] as LineDataset[]
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
      position: 'top' as const
    }
  },
  scales: {
    y: {
      beginAtZero: true
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
    type: 'line',
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
.line-chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>