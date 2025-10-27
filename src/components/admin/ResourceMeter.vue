<template>
  <div class="resource-meter">
    <div class="resource-header">
      <h3>{{ title }}</h3>
      <span class="resource-value">{{ value.toFixed(1) }}{{ unit }}</span>
    </div>
    <el-progress 
      :percentage="normalizedValue" 
      :status="getStatus()" 
      :color="color"
      :stroke-width="8"
    />
    <div class="threshold-indicator" v-if="threshold">
      <span>阈值: {{ threshold }}{{ unit }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

// 属性定义
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  threshold: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: ''
  }
});

// 计算属性
const normalizedValue = computed(() => {
  // 对于网络流量等没有固定上限的资源，使用相对值
  if (props.unit === 'Mbps' || !props.threshold) {
    return Math.min(100, props.value);
  }
  return Math.min(100, (props.value / props.threshold) * 100);
});

// 获取进度条状态
const getStatus = () => {
  if (props.threshold && props.value > props.threshold) {
    return 'exception';
  }
  return 'success';
};


</script>

<style scoped>
.resource-meter {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.resource-header h3 {
  font-size: 16px;
  margin: 0;
  color: #404040;
}

.resource-value {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
}

.threshold-indicator {
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}
</style>