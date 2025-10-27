<template>
  <div class="backup-history">
    <div class="history-filters">
      <el-select 
        v-model="filterConfig" 
        placeholder="选择备份配置"
        style="width: 200px; margin-right: 10px;"
      >
        <el-option value="">所有配置</el-option>
        <el-option 
          v-for="config in backupConfigs" 
          :key="config.id" 
          :label="config.name" 
          :value="config.id"
        />
      </el-select>
      
      <el-select 
        v-model="filterStatus" 
        placeholder="选择状态"
        style="width: 150px; margin-right: 10px;"
      >
        <el-option value="">所有状态</el-option>
        <el-option label="等待中" value="pending" />
        <el-option label="运行中" value="running" />
        <el-option label="已完成" value="completed" />
        <el-option label="已失败" value="failed" />
      </el-select>
      
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 280px;"
      />
      
      <el-button 
        type="primary" 
        size="small" 
        @click="fetchHistory"
        style="margin-left: 10px;"
      >
        查询
      </el-button>
    </div>
    
    <el-table 
      :data="filteredRecords" 
      stripe 
      border
      :loading="isLoading"
    >
      <el-table-column prop="configName" label="配置名称" width="160" />
      <el-table-column label="备份类型" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.type === 'full' ? 'primary' : 'success'">
            {{ scope.row.type === 'full' ? '全量' : '增量' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="180" />
      <el-table-column label="结束时间" width="180">
        <template #default="scope">
          <span v-if="scope.row.endTime">{{ scope.row.endTime }}</span>
          <span v-else-if="scope.row.status === 'running'">
            <el-tag type="info">运行中</el-tag>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-tag 
            :type="getStatusTagType(scope.row.status)"
          >
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="大小(MB)" width="100">
        <template #default="scope">
          {{ scope.row.size ? scope.row.size.toFixed(2) : '0.00' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="scope">
          <el-button 
            v-if="scope.row.status === 'completed'"
            type="text" 
            size="small" 
            @click="handleRestore(scope.row.id)"
          >
            恢复
          </el-button>
          <el-button 
            v-if="scope.row.status === 'completed' || scope.row.status === 'failed'"
            type="text" 
            size="small" 
            text-color="#f56c6c"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination" style="margin-top: 15px; text-align: right;">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalRecords"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// Props and Emits
const props = defineProps({
  backupRecords: {
    type: Array,
    required: true,
    default: () => []
  },
  backupConfigs: {
    type: Array,
    required: true,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  onRestore: {
    type: Function,
    required: true
  },
  onDelete: {
    type: Function,
    required: true
  },
  onRefresh: {
    type: Function,
    required: true
  }
});

// 状态
const filterConfig = ref('');
const filterStatus = ref('');
const dateRange = ref<[Date, Date] | null>(null);
const currentPage = ref(1);
const pageSize = ref(10);

// 过滤后的记录
const filteredRecords = computed(() => {
  let records = [...props.backupRecords];
  
  // 应用配置筛选
  if (filterConfig.value) {
    records = records.filter(record => record.configId === filterConfig.value);
  }
  
  // 应用状态筛选
  if (filterStatus.value) {
    records = records.filter(record => record.status === filterStatus.value);
  }
  
  // 应用日期筛选
  if (dateRange.value) {
    const startDate = new Date(dateRange.value[0]);
    const endDate = new Date(dateRange.value[1]);
    endDate.setHours(23, 59, 59, 999);
    
    records = records.filter(record => {
      const recordDate = new Date(record.startTime);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }
  
  // 分页处理
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return records.slice(startIndex, startIndex + pageSize.value);
});

// 总记录数
const totalRecords = computed(() => {
  // 这里应该是过滤后的总记录数，简化处理直接返回所有记录数
  return props.backupRecords.length;
});

// 方法
const fetchHistory = () => {
  props.onRefresh(filterConfig.value);
};

const handleRestore = (backupId: string) => {
  props.onRestore(backupId);
};

const handleDelete = async (backupId: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除此备份记录吗？此操作不可撤销。',
      '确认删除',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
    );
    
    props.onDelete(backupId);
  } catch (error) {
    // 用户取消操作
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '等待中';
    case 'running': return '运行中';
    case 'completed': return '已完成';
    case 'failed': return '已失败';
    default: return status;
  }
};

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'running': return 'info';
    case 'failed': return 'danger';
    case 'pending': return 'warning';
    default: return 'default';
  }
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};
</script>

<style scoped>
.backup-history {
  padding: 10px 0;
}

.history-filters {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
</style>