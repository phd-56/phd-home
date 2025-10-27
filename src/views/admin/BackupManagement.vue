<template>
  <div class="backup-management-page">
    <div class="page-header">
      <div class="header-left">
        <el-button 
          type="primary" 
          size="small"
          @click="goBack"
          style="margin-right: 10px;"
        >
          <el-icon><arrow-left /></el-icon>
          返回
        </el-button>
        <h1>数据备份与恢复</h1>
      </div>
      <el-button type="primary" @click="showAddConfigDialog">
        <el-icon><Plus /></el-icon>
        添加备份配置
      </el-button>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ backupConfigs.length }}</div>
          <div class="stat-label">备份配置</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ backupRecords.length }}</div>
          <div class="stat-label">备份记录</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ getStorageUsed() }}GB</div>
          <div class="stat-label">存储空间已用</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ getLastBackupTime() }}</div>
          <div class="stat-label">最近备份</div>
        </div>
      </el-card>
    </div>
    
    <!-- 备份配置标签页 -->
    <el-tabs v-model="activeTab" class="backup-tabs">
      <el-tab-pane label="备份配置" name="configs">
        <el-card>
          <!-- 配置操作栏 -->
          <div class="config-actions">
            <div class="search-filter">
              <el-input 
                v-model="configSearch" 
                placeholder="搜索配置名称" 
                prefix-icon="Search" 
                style="width: 300px;"
              />
              <el-select 
                v-model="configTypeFilter" 
                placeholder="筛选备份类型" 
                style="width: 150px; margin-left: 10px;"
              >
                <el-option label="全部类型" value="" />
                <el-option label="全量备份" value="full" />
                <el-option label="增量备份" value="incremental" />
              </el-select>
            </div>
            <div class="action-buttons">
              <el-button type="success" @click="runManualBackup">
                <el-icon><Refresh /></el-icon>
                立即备份
              </el-button>
            </div>
          </div>
          
          <!-- 配置表格 -->
          <el-table 
            :data="filteredConfigs" 
            stripe 
            border
            style="margin-top: 15px;"
          >
            <el-table-column prop="name" label="配置名称" width="200" show-overflow-tooltip />
            <el-table-column label="备份类型" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.type === 'full' ? 'primary' : 'success'">
                  {{ scope.row.type === 'full' ? '全量备份' : '增量备份' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备份频率" width="180">
              <template #default="scope">
                {{ getScheduleText(scope.row.schedule) }}
              </template>
            </el-table-column>
            <el-table-column label="保留策略" width="160">
              <template #default="scope">
                <div>保留 {{ scope.row.retentionPolicy.keepDays }} 天</div>
                <div>最多 {{ scope.row.retentionPolicy.maxBackups }} 个</div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-switch 
                  v-model="scope.row.isEnabled" 
                  active-color="#13ce66" 
                  inactive-color="#ff4949"
                  @change="toggleConfigStatus(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <el-button size="small" type="primary" @click="editConfig(scope.row)">
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click="deleteConfig(scope.row.id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="备份历史" name="history">
        <el-card>
          <!-- 历史记录筛选栏 -->
          <div class="history-filters">
            <div class="filter-group">
              <el-select 
                v-model="recordConfigFilter" 
                placeholder="选择配置" 
                style="width: 200px; margin-right: 10px;"
              >
                <el-option label="全部配置" value="" />
                <el-option 
                  v-for="config in backupConfigs" 
                  :key="config.id" 
                  :label="config.name" 
                  :value="config.id" 
                />
              </el-select>
              <el-select 
                v-model="recordStatusFilter" 
                placeholder="筛选状态" 
                style="width: 150px; margin-right: 10px;"
              >
                <el-option label="全部状态" value="" />
                <el-option label="已完成" value="completed" />
                <el-option label="运行中" value="running" />
                <el-option label="已失败" value="failed" />
              </el-select>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 300px;"
              />
            </div>
            <el-button type="info" @click="refreshHistory">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
          
          <!-- 历史记录表格 -->
          <el-table 
            :data="paginatedRecords" 
            stripe 
            border
            style="margin-top: 15px;"
          >
            <el-table-column prop="configName" label="配置名称" width="180" show-overflow-tooltip />
            <el-table-column label="备份类型" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.type === 'full' ? 'primary' : 'success'">
                  {{ scope.row.type === 'full' ? '全量' : '增量' }}
                </el-tag>
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
            <el-table-column prop="startTime" label="开始时间" width="180" />
            <el-table-column label="结束时间" width="180">
              <template #default="scope">
                {{ scope.row.endTime || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="耗时" width="100">
              <template #default="scope">
                {{ formatDuration(scope.row.duration) }}
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
                  size="small" 
                  type="primary" 
                  @click="restoreFromBackup(scope.row.id)"
                  :disabled="scope.row.status !== 'completed'"
                >
                  恢复
                </el-button>
                <el-button 
                  size="small" 
                  type="danger" 
                  @click="deleteBackupRecord(scope.row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="filteredRecords.length"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 添加/编辑配置对话框 -->
    <el-dialog 
      v-model="configDialogVisible" 
      :title="isEditMode ? '编辑备份配置' : '添加备份配置'"
      width="600px"
    >
      <el-form 
        :model="currentConfig" 
        label-width="120px"
        :rules="configRules"
        ref="configFormRef"
      >
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="currentConfig.name" placeholder="请输入配置名称" />
        </el-form-item>
        <el-form-item label="备份类型" prop="type">
          <el-radio-group v-model="currentConfig.type">
            <el-radio label="full">全量备份</el-radio>
            <el-radio label="incremental">增量备份</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备份频率">
          <el-select v-model="currentConfig.schedule.frequency">
            <el-option label="每日" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
          </el-select>
          <el-time-picker
            v-model="currentConfig.schedule.time"
            placeholder="选择备份时间"
            format="HH:mm"
            value-format="HH:mm"
            style="margin-left: 10px;"
          />
        </el-form-item>
        <el-form-item 
          v-if="currentConfig.schedule.frequency === 'weekly'"
          label="星期几"
        >
          <el-select v-model="currentConfig.schedule.dayOfWeek">
            <el-option label="星期日" value="0" />
            <el-option label="星期一" value="1" />
            <el-option label="星期二" value="2" />
            <el-option label="星期三" value="3" />
            <el-option label="星期四" value="4" />
            <el-option label="星期五" value="5" />
            <el-option label="星期六" value="6" />
          </el-select>
        </el-form-item>
        <el-form-item 
          v-if="currentConfig.schedule.frequency === 'monthly'"
          label="日期"
        >
          <el-input 
            v-model.number="currentConfig.schedule.dayOfMonth" 
            placeholder="输入日期（1-31）"
            type="number"
            min="1"
            max="31"
          />
        </el-form-item>
        <el-form-item label="保留策略">
          <el-input 
            v-model.number="currentConfig.retentionPolicy.keepDays" 
            placeholder="保留天数"
            type="number"
            min="1"
            style="width: 150px; margin-right: 10px;"
          />
          <el-input 
            v-model.number="currentConfig.retentionPolicy.maxBackups" 
            placeholder="最大备份数"
            type="number"
            min="1"
            style="width: 150px;"
          />
        </el-form-item>
        <el-form-item label="其他选项">
          <el-checkbox v-model="currentConfig.encryption">启用加密</el-checkbox>
          <el-select v-model="currentConfig.compression" style="margin-left: 20px; width: 120px;">
            <el-option label="无压缩" value="none" />
            <el-option label="普通压缩" value="normal" />
            <el-option label="高压缩" value="high" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="configDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConfig">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, reactive } from 'vue';
import { ArrowLeft, Plus, Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 使用本地状态管理
const activeTab = ref('configs');
const configDialogVisible = ref(false);
const isEditMode = ref(false);
const router = useRouter();

// 搜索和筛选
const configSearch = ref('');
const configTypeFilter = ref('');
const recordConfigFilter = ref('');
const recordStatusFilter = ref('');
const dateRange = ref<[Date, Date] | null>(null);

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 表单引用
const configFormRef = ref();

// 当前配置
const currentConfig = reactive({
  id: '',
  name: '',
  type: 'full' as 'full' | 'incremental',
  schedule: {
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    time: '02:00',
    dayOfWeek: 0,
    dayOfMonth: 1
  },
  retentionPolicy: {
    keepDays: 30,
    maxBackups: 10
  },
  encryption: false,
  compression: 'normal' as 'none' | 'normal' | 'high',
  isEnabled: true
});

// 表单验证规则
const configRules = {
  name: [
    { required: true, message: '请输入配置名称', trigger: 'blur' },
    { min: 2, max: 50, message: '配置名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择备份类型', trigger: 'change' }
  ]
};

// 返回用户管理页面
const goBack = () => {
  router.push('/dashboard/admin/user-management');
};

// 模拟数据
const backupConfigs = ref([
  {
    id: '1',
    name: '数据库每日全量备份',
    type: 'full' as const,
    schedule: {
      frequency: 'daily' as const,
      time: '02:00'
    },
    retentionPolicy: {
      keepDays: 30,
      maxBackups: 10
    },
    encryption: true,
    compression: 'normal' as const,
    isEnabled: true
  },
  {
    id: '2',
    name: '用户数据每周备份',
    type: 'incremental' as const,
    schedule: {
      frequency: 'weekly' as const,
      time: '01:00',
      dayOfWeek: 0
    },
    retentionPolicy: {
      keepDays: 60,
      maxBackups: 20
    },
    encryption: false,
    compression: 'high' as const,
    isEnabled: true
  },
  {
    id: '3',
    name: '系统配置每月备份',
    type: 'full' as const,
    schedule: {
      frequency: 'monthly' as const,
      time: '03:00',
      dayOfMonth: 1
    },
    retentionPolicy: {
      keepDays: 90,
      maxBackups: 6
    },
    encryption: true,
    compression: 'normal' as const,
    isEnabled: false
  }
]);

const backupRecords = ref([
  {
    id: 'record1',
    configId: '1',
    configName: '数据库每日全量备份',
    type: 'full' as const,
    status: 'completed' as const,
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    size: 125.5,
    duration: 3600,
    fileHash: 'abc123',
    storagePath: '/backups/2023-10-20/db-full-backup.sql.gz'
  },
  {
    id: 'record2',
    configId: '2',
    configName: '用户数据每周备份',
    type: 'incremental' as const,
    status: 'completed' as const,
    startTime: new Date(Date.now() - 604800000).toISOString(),
    endTime: new Date(Date.now() - 604800000 + 1800000).toISOString(),
    size: 45.2,
    duration: 1800,
    fileHash: 'def456',
    storagePath: '/backups/2023-10-15/user-inc-backup.tar.gz'
  },
  {
    id: 'record3',
    configId: '1',
    configName: '数据库每日全量备份',
    type: 'full' as const,
    status: 'completed' as const,
    startTime: new Date(Date.now() - 172800000).toISOString(),
    endTime: new Date(Date.now() - 172800000 + 3600000).toISOString(),
    size: 120.8,
    duration: 3600,
    fileHash: 'ghi789',
    storagePath: '/backups/2023-10-19/db-full-backup.sql.gz'
  },
  {
    id: 'record4',
    configId: '3',
    configName: '系统配置每月备份',
    type: 'full' as const,
    status: 'failed' as const,
    startTime: new Date(Date.now() - 2592000000).toISOString(),
    endTime: null,
    size: 0,
    duration: 0,
    fileHash: '',
    storagePath: ''
  },
  {
    id: 'record5',
    configId: '1',
    configName: '数据库每日全量备份',
    type: 'full' as const,
    status: 'running' as const,
    startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: null,
    size: 50.2,
    duration: 3600,
    fileHash: '',
    storagePath: ''
  }
]);

// 计算属性
const filteredConfigs = computed(() => {
  let filtered = [...backupConfigs.value];
  
  // 搜索筛选
  if (configSearch.value) {
    filtered = filtered.filter(config => 
      config.name.toLowerCase().includes(configSearch.value.toLowerCase())
    );
  }
  
  // 类型筛选
  if (configTypeFilter.value) {
    filtered = filtered.filter(config => config.type === configTypeFilter.value);
  }
  
  return filtered;
});

const filteredRecords = computed(() => {
  let filtered = [...backupRecords.value];
  
  // 配置筛选
  if (recordConfigFilter.value) {
    filtered = filtered.filter(record => record.configId === recordConfigFilter.value);
  }
  
  // 状态筛选
  if (recordStatusFilter.value) {
    filtered = filtered.filter(record => record.status === recordStatusFilter.value);
  }
  
  // 日期范围筛选
  if (dateRange.value) {
    const startDate = new Date(dateRange.value[0]);
    const endDate = new Date(dateRange.value[1]);
    endDate.setHours(23, 59, 59, 999);
    
    filtered = filtered.filter(record => {
      const recordDate = new Date(record.startTime);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }
  
  return filtered;
});

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredRecords.value.slice(start, end);
});

// 方法
const showAddConfigDialog = () => {
  isEditMode.value = false;
  // 重置表单
  Object.assign(currentConfig, {
    id: '',
    name: '',
    type: 'full',
    schedule: {
      frequency: 'daily',
      time: '02:00',
      dayOfWeek: 0,
      dayOfMonth: 1
    },
    retentionPolicy: {
      keepDays: 30,
      maxBackups: 10
    },
    encryption: false,
    compression: 'normal',
    isEnabled: true
  });
  configDialogVisible.value = true;
};

const editConfig = (config: any) => {
  isEditMode.value = true;
  // 复制配置数据到当前配置
  Object.assign(currentConfig, JSON.parse(JSON.stringify(config)));
  configDialogVisible.value = true;
};

const saveConfig = async () => {
  if (!configFormRef.value) return;
  
  try {
    await configFormRef.value.validate();
    
    if (isEditMode.value) {
      // 编辑现有配置
      const index = backupConfigs.value.findIndex(c => c.id === currentConfig.id);
      if (index !== -1) {
        backupConfigs.value[index] = { ...currentConfig };
        ElMessage.success('配置更新成功');
      }
    } else {
      // 添加新配置
      const newConfig = { ...currentConfig, id: Date.now().toString() };
      backupConfigs.value.push(newConfig);
      ElMessage.success('配置添加成功');
    }
    
    configDialogVisible.value = false;
  } catch (error) {
    // 表单验证失败
  }
};

const deleteConfig = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除此备份配置吗？',
      '确认删除',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
    );
    
    const index = backupConfigs.value.findIndex(c => c.id === id);
    if (index !== -1) {
      backupConfigs.value.splice(index, 1);
      ElMessage.success('配置删除成功');
    }
  } catch (error) {
    // 用户取消操作
  }
};

const toggleConfigStatus = (config: any) => {
  ElMessage.success(`备份配置已${config.isEnabled ? '启用' : '禁用'}`);
};

const runManualBackup = () => {
  ElMessage.success('立即备份任务已开始');
  // 这里可以添加模拟的备份过程
};

const restoreFromBackup = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要从此备份恢复数据吗？此操作可能会覆盖当前数据。',
      '确认恢复',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
    );
    
    ElMessage.success('数据恢复任务已开始');
    // 这里可以添加模拟的恢复过程
  } catch (error) {
    // 用户取消操作
  }
};

const deleteBackupRecord = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除此备份记录吗？',
      '确认删除',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
    );
    
    const index = backupRecords.value.findIndex(r => r.id === id);
    if (index !== -1) {
      backupRecords.value.splice(index, 1);
      ElMessage.success('备份记录删除成功');
    }
  } catch (error) {
    // 用户取消操作
  }
};

const refreshHistory = () => {
  ElMessage.success('备份历史已刷新');
  // 这里可以添加刷新逻辑
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

// 辅助函数
const getScheduleText = (schedule: any) => {
  let text = '';
  switch (schedule.frequency) {
    case 'daily':
      text = `每日 ${schedule.time}`;
      break;
    case 'weekly':
      const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      text = `每周星期${weekdays[schedule.dayOfWeek]} ${schedule.time}`;
      break;
    case 'monthly':
      text = `每月${schedule.dayOfMonth}日 ${schedule.time}`;
      break;
  }
  return text;
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed': return '已完成';
    case 'running': return '运行中';
    case 'failed': return '已失败';
    default: return status;
  }
};

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'running': return 'info';
    case 'failed': return 'danger';
    default: return 'default';
  }
};

const formatDuration = (seconds: number) => {
  if (!seconds) return '-';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

const getStorageUsed = () => {
  const totalSize = backupRecords.value.reduce((sum, record) => sum + (record.size || 0), 0);
  return (totalSize / 1024).toFixed(2);
};

const getLastBackupTime = () => {
  if (backupRecords.value.length === 0) return '从未备份';
  
  const completedBackups = backupRecords.value
    .filter(record => record.status === 'completed' && record.endTime)
    .sort((a, b) => new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime());
  
  if (completedBackups.length === 0) return '备份中';
  
  const lastBackup = new Date(completedBackups[0].endTime!);
  const now = new Date();
  const diffMs = now.getTime() - lastBackup.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) {
    return `${diffMins}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else {
    return `${diffDays}天前`;
  }
};

// 初始化数据
onMounted(() => {
  console.log('BackupManagement组件已挂载');
});
</script>

<style scoped>
.backup-management-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  text-align: center;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.backup-tabs {
  margin-top: 15px;
}

.config-actions, .history-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.search-filter {
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .config-actions, .history-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter, .filter-group {
    flex-direction: column;
  }
  
  .search-filter .el-input,
  .search-filter .el-select,
  .filter-group .el-select,
  .filter-group .el-date-picker {
    width: 100%;
    margin-left: 0;
    margin-bottom: 10px;
  }
}
</style>