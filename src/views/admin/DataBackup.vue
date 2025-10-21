<template>
  <div class="data-backup">
    <h1 class="page-title">数据备份</h1>
    
    <div class="backup-container">
      <el-card class="backup-card">
        <template #header>
          <div class="card-header">
            <span>备份操作</span>
            <el-button type="primary" @click="createBackup" :loading="isCreatingBackup">
              📥 创建新备份
            </el-button>
          </div>
        </template>
        
        <div class="backup-options">
          <el-form :model="backupForm" label-width="120px">
            <el-form-item label="备份类型">
              <el-radio-group v-model="backupForm.type">
                <el-radio label="full">完整备份</el-radio>
                <el-radio label="incremental">增量备份</el-radio>
                <el-radio label="database">仅数据库</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="备份说明">
              <el-input v-model="backupForm.description" placeholder="请输入备份说明（可选）" />
            </el-form-item>
            
            <el-form-item label="自动清理">
              <el-switch v-model="backupForm.autoClean" />
              <div class="form-hint">启用后将自动删除30天前的备份</div>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      
      <el-card class="backup-card">
        <template #header>
          <div class="card-header">
            <span>备份历史</span>
            <el-input v-model="searchQuery" placeholder="搜索备份..." clearable style="width: 200px;" />
          </div>
        </template>
        
        <el-table :data="filteredBackups" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="type" label="类型" width="120">
            <template #default="scope">
              <el-tag :type="getTypeTagType(scope.row.type)">
                {{ getTypeText(scope.row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="说明" />
          <el-table-column prop="size" label="大小" width="100" />
          <el-table-column prop="createdAt" label="创建时间" width="180" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'completed' ? 'success' : 'warning'">{{ getStatusText(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="downloadBackup(scope.row.id)">
                📥 下载
              </el-button>
              <el-button type="danger" size="small" @click="deleteBackup(scope.row.id)" :disabled="scope.row.status !== 'completed'">
                🗑️ 删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="backups.length"
          />
        </div>
      </el-card>
      
      <el-card class="backup-card">
        <template #header>
          <div class="card-header">
            <span>恢复操作</span>
          </div>
        </template>
        
        <div class="restore-options">
          <el-alert
            title="警告"
            type="warning"
            description="恢复操作将覆盖当前数据，请确保已创建最新备份！"
            show-icon
          />
          
          <div class="restore-selector">
            <el-form :model="restoreForm" label-width="120px">
              <el-form-item label="选择备份">
                <el-select v-model="restoreForm.backupId" placeholder="请选择要恢复的备份">
                  <el-option
                    v-for="backup in availableBackups"
                    :key="backup.id"
                    :label="`${backup.id} - ${backup.type} - ${formatDate(backup.createdAt)}`"
                    :value="backup.id"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item label="恢复范围">
                <el-checkbox-group v-model="restoreForm.scope">
                  <el-checkbox label="database">数据库</el-checkbox>
                  <el-checkbox label="images">医学图像</el-checkbox>
                  <el-checkbox label="reports">诊断报告</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item>
                <el-button type="success" @click="restoreBackup" :loading="isRestoring">
                  🔄 执行恢复
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 备份表单
const backupForm = ref({
  type: 'full',
  description: '',
  autoClean: true
})

// 恢复表单
const restoreForm = ref({
  backupId: '',
  scope: ['database']
})

// 加载状态
const isCreatingBackup = ref(false)
const isRestoring = ref(false)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')

// 模拟备份数据
const backups = ref([
  { id: 'bkp-001', type: 'full', description: '系统初始化完整备份', size: '2.3GB', createdAt: '2023-10-01 10:00:00', status: 'completed' },
  { id: 'bkp-002', type: 'incremental', description: '每日增量备份', size: '456MB', createdAt: '2023-10-02 02:00:00', status: 'completed' },
  { id: 'bkp-003', type: 'incremental', description: '每日增量备份', size: '389MB', createdAt: '2023-10-03 02:00:00', status: 'completed' },
  { id: 'bkp-004', type: 'database', description: '数据库定时备份', size: '123MB', createdAt: '2023-10-04 12:00:00', status: 'completed' },
  { id: 'bkp-005', type: 'full', description: '每周完整备份', size: '2.5GB', createdAt: '2023-10-08 02:00:00', status: 'completed' }
])

// 计算属性
const filteredBackups = computed(() => {
  let filtered = backups.value
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(backup => 
      backup.id.toLowerCase().includes(query) ||
      backup.description.toLowerCase().includes(query) ||
      backup.type.toLowerCase().includes(query)
    )
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.slice(start, start + pageSize.value)
})

const availableBackups = computed(() => {
  return backups.value.filter(backup => backup.status === 'completed')
})

// 方法
const createBackup = async () => {
  isCreatingBackup.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newBackup = {
      id: `bkp-${String(backups.value.length + 1).padStart(3, '0')}`,
      type: backupForm.value.type,
      description: backupForm.value.description || `${getTypeText(backupForm.value.type)}备份`,
      size: '0KB',
      createdAt: new Date().toLocaleString('zh-CN'),
      status: 'completed'
    }
    
    backups.value.unshift(newBackup)
    ElMessage.success('备份创建成功！')
    
    // 重置表单
    backupForm.value.description = ''
  } catch (error) {
    ElMessage.error('备份创建失败！')
  } finally {
    isCreatingBackup.value = false
  }
}

const downloadBackup = (backupId: string) => {
  ElMessage.info('开始下载备份文件...')
}

const deleteBackup = (backupId: string) => {
  if (confirm('确定要删除此备份吗？此操作不可撤销。')) {
    backups.value = backups.value.filter(backup => backup.id !== backupId)
    ElMessage.success('备份已删除！')
  }
}

const restoreBackup = async () => {
  if (!restoreForm.value.backupId) {
    ElMessage.warning('请选择要恢复的备份！')
    return
  }
  
  if (!restoreForm.value.scope.length) {
    ElMessage.warning('请选择恢复范围！')
    return
  }
  
  if (confirm('确定要执行恢复操作吗？这将覆盖当前数据！')) {
    isRestoring.value = true
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 3000))
      ElMessage.success('恢复操作已成功完成！')
    } catch (error) {
      ElMessage.error('恢复操作失败！')
    } finally {
      isRestoring.value = false
    }
  }
}

const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    full: '完整备份',
    incremental: '增量备份',
    database: '数据库备份'
  }
  return typeMap[type] || type
}

const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    full: 'success',
    incremental: 'warning',
    database: 'primary'
  }
  return typeMap[type] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: '已完成',
    pending: '等待中',
    failed: '失败',
    in_progress: '进行中'
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>

<style scoped>
.data-backup {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.backup-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.backup-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.backup-options,
.restore-options {
  padding: 10px 0;
}

.form-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.restore-selector {
  margin-top: 20px;
}
</style>