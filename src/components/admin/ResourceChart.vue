<template>
  <div class="resource-chart">
    <h3>{{ title }}</h3>
    <div class="chart-container">
      <el-loading v-if="!chartData.length">加载图表数据中...</el-loading>
      <div ref="chartRef" class="chart" :style="{ height: '300px' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineProps } from 'vue';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';

// 属性定义
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  resource: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    default: ''
  }
});

// ECharts实例和DOM引用
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: ECharts | null = null;
const chartData = ref<any[]>([]);

// 处理数据格式
const processChartData = () => {
  if (!props.data || props.data.length === 0) return [];
  
  return props.data.map(item => {
    let value = 0; // 默认为0
    
    if (item) {
      switch (props.resource) {
        case 'cpu':
          value = typeof item.cpu === 'number' ? item.cpu : 0;
          break;
        case 'memory':
          value = typeof item.memory === 'number' ? item.memory : 0;
          break;
        case 'disk':
          value = typeof item.disk === 'number' ? item.disk : 0;
          break;
        case 'network':
          // 安全地获取network.in，确保item.network存在
          value = item.network && typeof item.network.in === 'number' ? item.network.in : 0;
          break;
        default:
          value = 0;
      }
    }
    
    return {
      time: item?.timestamp ? new Date(item.timestamp).toLocaleTimeString() : '--:--:--',
      value: value.toFixed(1) // 现在value保证是数字，可以安全调用toFixed
    };
  });
};

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;
  
  // 销毁已有实例
  if (chartInstance) {
    chartInstance.dispose();
  }
  
  // 创建新实例
  chartInstance = echarts.init(chartRef.value);
  
  // 图表配置
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}' + props.unit
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.value.map(item => item.time),
      axisLabel: {
        rotate: 45,
        interval: 2 // 间隔显示，避免拥挤
      }
    },
    yAxis: {
      type: 'value',
      name: props.unit,
      min: 0,
      max: props.resource === 'network' ? null : 100
    },
    series: [
      {
        data: chartData.value.map(item => parseFloat(item.value)),
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        },
        itemStyle: {
          radius: 4
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0)' }
          ])
        }
      }
    ]
  };
  
  chartInstance.setOption(option);
  
  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    chartInstance?.resize();
  });
};

// 生命周期和数据监听
onMounted(() => {
  chartData.value = processChartData();
  initChart();
});

watch(
  () => props.data,
  () => {
    chartData.value = processChartData();
    initChart();
  },
  { deep: true }
);

// 组件卸载时销毁图表
onUnmounted(() => {
  chartInstance?.dispose();
});
</script>

<style scoped>
.resource-chart {
  margin-top: 10px;
}

.chart-container {
  width: 100%;
  position: relative;
}

.chart {
  width: 100%;
}
</style>