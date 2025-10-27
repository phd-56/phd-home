<template>
  <div class="log-detail">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="ID">{{ log?.id || '-' }}</el-descriptions-item>
      <el-descriptions-item label="时间">{{ formatTime(log?.timestamp) || '-' }}</el-descriptions-item>
      <el-descriptions-item label="用户">{{ log?.user || '-' }}</el-descriptions-item>
      <el-descriptions-item label="IP地址">{{ log?.ip || '-' }}</el-descriptions-item>
      <el-descriptions-item label="操作模块">{{ log?.module || '-' }}</el-descriptions-item>
      <el-descriptions-item label="操作类型">{{ log?.action || '-' }}</el-descriptions-item>
      <el-descriptions-item label="详情" v-if="log?.details">
        <pre class="log-details-pre">{{ log.details }}</pre>
      </el-descriptions-item>
      <el-descriptions-item label="是否异常">
        <el-tag v-if="log?.isAnomaly" type="danger">是</el-tag>
        <el-tag v-else type="success">否</el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

// 属性定义
const props = defineProps({
  log: {
    type: Object,
    default: () => ({})
  }
});

// 格式化时间
const formatTime = (timestamp?: string) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
</script>

<style scoped>
.log-detail {
  padding: 10px 0;
}

.log-details-pre {
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin: 0;
}
</style>