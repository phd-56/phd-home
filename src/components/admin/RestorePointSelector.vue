<template>
  <div class="restore-point-selector">
    <el-table 
      :data="restorePoints" 
      stripe 
      border
      @row-click="selectRestorePoint"
      :row-class-name="rowClassName"
    >
      <el-table-column label="备份类型" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.type === 'full' ? 'primary' : 'success'">
            {{ scope.row.type === 'full' ? '全量' : '增量' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="timestamp" label="备份时间" width="180" />
      <el-table-column label="备份大小" width="120">
        <template #default="scope">
          {{ scope.row.size ? scope.row.size.toFixed(2) + ' MB' : 'N/A' }}
        </template>
      </el-table-column>
      <el-table-column label="配置名称" prop="configName" width="160" />
      <el-table-column label="说明" width="auto">
        <template #default="scope">
          <div v-if="scope.row.type === 'full'">
            完整系统备份，可独立恢复
          </div>
          <div v-else>
            增量备份，基于最新全量备份
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="selected-info" v-if="selectedPoint">
      <el-alert 
        title="已选择恢复点" 
        type="info" 
        :closable="false"
        style="margin-top: 15px;"
      >
        <div>
          <strong>时间:</strong> {{ selectedPoint.timestamp }}&nbsp;&nbsp;
          <strong>类型:</strong> {{ selectedPoint.type === 'full' ? '全量备份' : '增量备份' }}&nbsp;&nbsp;
          <strong>配置:</strong> {{ selectedPoint.configName }}
        </div>
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';

// Props and Emits
const props = defineProps({
  restorePoints: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedPoint: {
    type: Object,
    default: null
  }
});

const emits = defineEmits(['select']);

// 状态
const internalSelectedPoint = ref(props.selectedPoint);

// 监听props变化
watch(() => props.selectedPoint, (newVal) => {
  internalSelectedPoint.value = newVal;
});

// 方法
const selectRestorePoint = (row: any) => {
  internalSelectedPoint.value = row;
  emits('select', row);
};

const rowClassName = ({ row }: any) => {
  return row === internalSelectedPoint.value ? 'selected-row' : '';
};
</script>

<style scoped>
.restore-point-selector {
  margin: 10px 0;
}

.selected-row {
  background-color: #f0f9ff;
}

.selected-info {
  margin-top: 15px;
}
</style>