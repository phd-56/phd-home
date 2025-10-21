<template>
  <div class="log-table-container">
    <el-table 
      :data="logs" 
      stripe 
      border
      :loading="loading"
      size="medium"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="timestamp" label="操作时间" width="180" sortable>
        <template #default="scope">
          {{ formatDate(scope.row.timestamp) }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="120" sortable />
      <el-table-column prop="userId" label="用户ID" width="120" sortable />
      <el-table-column prop="userRole" label="用户角色" width="100" />
      <el-table-column prop="action" label="操作类型" width="120" sortable>
        <template #default="scope">
          <el-tag :type="getActionTagType(scope.row.action)">
            {{ getActionText(scope.row.action) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="resourceType" label="资源类型" width="120" sortable>
        <template #default="scope">
          {{ getResourceTypeText(scope.row.resourceType) }}
        </template>
      </el-table-column>
      <el-table-column prop="resourceId" label="资源ID" width="140" />
      <el-table-column prop="ipAddress" label="IP地址" width="140" />
      <el-table-column label="异常状态" width="120" sortable>
        <template #default="scope">
          <el-tag 
            v-if="scope.row.isAnomaly" 
            type="danger"
            @click="handleMarkAnomaly(scope.row.id, false)"
          >
            异常
          </el-tag>
          <el-tag 
            v-else
            @click="handleMarkAnomaly(scope.row.id, true)"
          >
            正常
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="scope">
          <el-button 
            type="text" 
            size="small" 
            @click="handleViewDetails(scope.row.id)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination" style="margin-top: 15px; text-align: right;">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';

// Props and Emits
const props = defineProps({
  logs: {
    type: Array,
    required: true,
    default: () => []
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  pageSize: {
    type: Number,
    required: true,
    default: 10
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['page-change', 'mark-anomaly', 'view-details']);

// 方法
const handleSizeChange = (size: number) => {
  emits('page-change', props.currentPage, size);
};

const handleCurrentChange = (page: number) => {
  emits('page-change', page, props.pageSize);
};

const handleMarkAnomaly = (logId: string, isAnomaly: boolean) => {
  emits('mark-anomaly', logId, isAnomaly);
};

const handleViewDetails = (logId: string) => {
  emits('view-details', logId);
};

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 获取操作类型文本
const getActionText = (action: string) => {
  const actionMap: Record<string, string> = {
    'create': '创建',
    'update': '更新',
    'delete': '删除',
    'login': '登录',
    'logout': '登出',
    'download': '下载',
    'upload': '上传',
    'query': '查询',
    'export': '导出',
    'import': '导入',
    'enable': '启用',
    'disable': '禁用'
  };
  return actionMap[action] || action;
};

// 获取操作类型标签样式
const getActionTagType = (action: string) => {
  switch (action) {
    case 'create': return 'success';
    case 'update': return 'primary';
    case 'delete': return 'danger';
    case 'login': return 'info';
    case 'logout': return 'warning';
    default: return 'default';
  }
};

// 获取资源类型文本
const getResourceTypeText = (resourceType: string) => {
  const resourceMap: Record<string, string> = {
    'user': '用户',
    'case': '病例',
    'image': '影像',
    'report': '报告',
    'configuration': '配置',
    'role': '角色',
    'permission': '权限',
    'system': '系统'
  };
  return resourceMap[resourceType] || resourceType;
};
</script>

<style scoped>
.log-table-container {
  margin-top: 15px;
}
</style>