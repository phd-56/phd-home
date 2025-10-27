<template>
  <div class="alarm-list-page">
    <div class="page-header">
      <h1>告警历史记录</h1>
      <div class="header-actions">
        <el-input 
          v-model="searchKeyword" 
          placeholder="搜索告警..." 
          style="width: 300px;"
          prefix-icon="Search"
        />
        <el-button 
          type="primary" 
          @click="handleClearAll"
          :loading="isLoading"
          style="margin-left: 10px;"
        >
          <el-icon><delete /></el-icon>
          清空已处理
        </el-button>
      </div>
    </div>
    
    <el-card>
      <el-table 
        :data="filteredAlarms" 
        stripe 
        border
        :loading="isLoading"
        @row-click="handleAlarmClick"
        :row-class-name="rowClassName"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="timestamp" label="告警时间" width="180" sortable />
        <el-table-column label="告警资源" width="100">
          <template #default="scope">
            <el-tag :type="getResourceTypeTag(scope.row.resource)">
              {{ getResourceTypeName(scope.row.resource) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="告警信息" />
        <el-table-column label="当前值" width="100">
          <template #default="scope">
            <span :class="scope.row.status === 'unhandled' ? 'warning-value' : ''">
              {{ scope.row.value }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="阈值" width="100">
          <template #default="scope">
            {{ scope.row.threshold }}%
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" sortable>
          <template #default="scope">
            <el-tag 
              :type="scope.row.status === 'unhandled' ? 'danger' : 'success'"
            >
              {{ scope.row.status === 'unhandled' ? '未处理' : '已处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="scope">
            <el-button 
              v-if="scope.row.status === 'unhandled'"
              type="primary" 
              size="small" 
              @click="handleAlarm(scope.row.id)"
            >
              处理
            </el-button>
            <el-button 
              v-else
              type="text" 
              size="small" 
              disabled
            >
              已处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination" style="margin-top: 15px; text-align: right;">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="alarmRecords.length"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMonitorStore } from '@/stores/monitorStore';
import { Delete, Search } from '@element-plus/icons-vue';

// 状态管理
const monitorStore = useMonitorStore();
const isLoading = computed(() => monitorStore.isLoading);
const alarmRecords = computed(() => monitorStore.alarmRecords);

// 分页和搜索
const currentPage = ref(1);
const pageSize = ref(10);
const searchKeyword = ref('');

// 过滤告警记录
const filteredAlarms = computed(() => {
  return [...alarmRecords.value]
    .filter(record => {
      // 搜索过滤
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        return (
          record.message.toLowerCase().includes(keyword) ||
          record.resource.toLowerCase().includes(keyword) ||
          record.status.toLowerCase().includes(keyword)
        );
      }
      return true;
    })
    .sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

// 方法
const handleAlarm = async (alarmId: string) => {
  await monitorStore.handleAlarm(alarmId);
};

const handleClearAll = async () => {
  await monitorStore.clearHandledAlarms();
};

const handleAlarmClick = (row: any) => {
  if (row.status === 'unhandled') {
    handleAlarm(row.id);
  }
};

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

// 格式化显示文本
const getResourceTypeName = (resource: string) => {
  const resourceMap: Record<string, string> = {
    'cpu': 'CPU',
    'memory': '内存',
    'disk': '磁盘',
    'network': '网络'
  };
  return resourceMap[resource] || resource;
};

const getResourceTypeTag = (resource: string) => {
  const tagMap: Record<string, string> = {
    'cpu': 'primary',
    'memory': 'success',
    'disk': 'warning',
    'network': 'info'
  };
  return tagMap[resource] || 'default';
};

// 表格行样式
const rowClassName = ({ row }: any) => {
  return row.status === 'unhandled' ? 'warning-row' : '';
};
</script>

<style scoped>
.alarm-list-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
}

.warning-row {
  background-color: #fff1f0;
}

.warning-value {
  color: #f56c6c;
  font-weight: bold;
}

.pagination {
  margin-top: 15px;
  text-align: right;
}
</style>