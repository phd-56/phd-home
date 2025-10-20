<template>
  <div class="import-progress">
    <el-card>
      <div class="progress-header">
        <h3>数据导入进度</h3>
        <el-tag :type="status === 'success' ? 'success' : status === 'error' ? 'danger' : 'info'">
          {{ status === 'success' ? '导入成功' : status === 'error' ? '导入失败' : status === 'processing' ? '导入中' : '等待导入' }}
        </el-tag>
      </div>

      <el-progress 
        :percentage="progress" 
        :status="status === 'error' ? 'exception' : status === 'success' ? 'success' : 'progress'"
        :text-inside="true"
        :stroke-width="24"
        class="main-progress"
      ></el-progress>

      <div class="import-stats" v-if="status !== 'waiting'">
        <div class="stat-item">
          <span class="stat-label">总记录数:</span>
          <span class="stat-value">{{ totalCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">成功导入:</span>
          <span class="stat-value success">{{ successCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">导入失败:</span>
          <span class="stat-value error">{{ failCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">耗时:</span>
          <span class="stat-value">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <el-collapse v-model="activeNames" class="error-details" v-if="status === 'error' && errorLogs.length > 0">
        <el-collapse-item title="错误详情" name="errors">
          <el-table 
            :data="errorLogs" 
            border 
            size="small"
            max-height="300"
          >
            <el-table-column prop="row" label="行号" width="80"></el-table-column>
            <el-table-column prop="message" label="错误信息"></el-table-column>
            <el-table-column prop="data" label="数据预览" width="200">
              <template #default="scope">
                <el-tooltip :content="JSON.stringify(scope.row.data)" placement="top">
                  <span class="data-preview">查看数据</span>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-button 
            type="text" 
            icon="el-icon-download" 
            class="download-log-btn"
            @click="downloadErrorLog"
          >
            下载错误日志
          </el-button>
        </el-collapse-item>
      </el-collapse>

      <div class="progress-actions" v-if="status !== 'processing'">
        <el-button 
          v-if="status === 'error'" 
          type="primary" 
          @click="$emit('retry')"
        >
          重试导入
        </el-button>
        <el-button 
          v-if="status === 'success'" 
          type="primary" 
          @click="$emit('complete')"
        >
          完成
        </el-button>
        <el-button 
          v-if="status === 'waiting'" 
          type="primary" 
          @click="$emit('start')"
        >
          开始导入
        </el-button>
        <el-button 
          v-if="status === 'processing'" 
          type="danger" 
          @click="$emit('cancel')"
        >
          取消导入
        </el-button>
        <el-button @click="$emit('back')">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';

// 定义Props
const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'waiting', // waiting/processing/success/error
    validator: (value: string) => {
      return ['waiting', 'processing', 'success', 'error'].includes(value);
    }
  },
  totalCount: {
    type: Number,
    default: 0
  },
  successCount: {
    type: Number,
    default: 0
  },
  failCount: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0 // 耗时(秒)
  },
  errorLogs: {
    type: Array,
    default: () => []
  }
});

// 定义Emits
const emit = defineEmits(['start', 'retry', 'cancel', 'back', 'complete']);

// 状态管理
const activeNames = ref(['errors']);

// 格式化时间
const formatTime = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds}秒`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  }
};

// 下载错误日志
const downloadErrorLog = () => {
  // 转换错误日志为CSV格式
  const headers = ['行号,错误信息,数据\n'];
  const rows = props.errorLogs.map(log => 
    `${log.row},${log.message.replace(/,/g, ';')},"${JSON.stringify(log.data).replace(/"/g, '""')}"`
  );
  
  const csvContent = headers.concat(rows).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `import-error-log-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
.import-progress {
  padding: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.main-progress {
  margin-bottom: 20px;
}

.import-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-right: 5px;
}

.stat-value {
  font-size: 16px;
  font-weight: 500;
}

.success {
  color: #67c23a;
}

.error {
  color: #f56c6c;
}

.progress-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.error-details {
  margin-top: 20px;
}

.download-log-btn {
  margin-top: 10px;
  float: right;
}
</style>