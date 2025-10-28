<template>
  <div class="bar-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { Chart, type ChartConfiguration, registerables } from 'chart.js'

// 注册 Chart.js 组件
Chart.register(...registerables)

// 定义数据集接口
interface BarDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
}

interface Props {
  data: {
    labels: string[]
    datasets: BarDataset[]
  }
  options?: any
}

// 定义组件属性
const props = withDefaults(defineProps<Props>(), {
  data: () => {
    const defaultData = {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'] as string[],
      datasets: [
        {
          label: '诊断数量',
          data: [120, 190, 150, 180, 220, 250] as number[],
          backgroundColor: 'rgba(64, 158, 255, 0.7)'
        } as BarDataset
      ]
    }
    return defaultData
  },
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
    type: 'bar',
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
.bar-chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>