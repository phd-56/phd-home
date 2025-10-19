<template>
  <div class="logs-audit">
    <div class="page-header">
      <h2>日志审计</h2>
      <div class="header-actions">
        <el-button @click="refreshLogs">
          <el-icon><Refresh /></el-icon>
          刷新日志
        </el-button>
        <el-button type="primary" @click="exportLogs">
          <el-icon><Download /></el-icon>
          导出日志
        </el-button>
        <el-button type="danger" @click="clearLogs">
          <el-icon><Delete /></el-icon>
          清理日志
        </el-button>
      </div>
    </div>

    <!-- 日志统计 -->
    <div class="logs-stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon total">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ logStats.total }}</div>
              <div class="stat-label">总日志数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon today">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ logStats.today }}</div>
              <div class="stat-label">今日日志</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon error">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ logStats.errors }}</div>
              <div class="stat-label">错误日志</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon security">
              <el-icon><Lock /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ logStats.security }}</div>
              <div class="stat-label">安全事件</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 日志筛选 -->
    <div class="logs-filters">
      <el-form :model="filterForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="日志级别">
              <el-select v-model="filterForm.level" placeholder="全部级别" clearable>
                <el-option label="DEBUG" value="debug" />
                <el-option label="INFO" value="info" />
                <el-option label="WARN" value="warn" />
                <el-option label="ERROR" value="error" />
                <el-option label="FATAL" value="fatal" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日志类型">
              <el-select v-model="filterForm.type" placeholder="全部类型" clearable>
                <el-option label="系统日志" value="system" />
                <el-option label="操作日志" value="operation" />
                <el-option label="安全日志" value="security" />
                <el-option label="访问日志" value="access" />
                <el-option label="错误日志" value="error" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户">
              <el-input
                v-model="filterForm.user"
                placeholder="用户名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IP地址">
              <el-input
                v-model="filterForm.ip"
                placeholder="IP地址"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关键词">
              <el-input
                v-model="filterForm.keyword"
                placeholder="搜索日志内容"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="searchLogs">搜索</el-button>
              <el-button @click="resetFilters">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 日志列表 -->
    <div class="logs-list">
      <el-table
        :data="filteredLogs"
        v-loading="loading"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="timestamp" label="时间" width="180" sortable>
          <template #default="{ row }">
            {{ formatDateTime(row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column prop="level" label="级别" width="100" sortable>
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)" size="small">
              {{ row.level.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="120" sortable>
          <template #default="{ row }">
            {{ getTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column prop="ip" label="IP地址" width="140" />
        <el-table-column prop="module" label="模块" width="150" />
        <el-table-column prop="action" label="操作" width="200" show-overflow-tooltip />
        <el-table-column prop="message" label="日志内容" min-width="300" show-overflow-tooltip />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewLogDetail(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="totalLogs"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="showLogDetailDialog"
      title="日志详情"
      width="700px"
    >
      <div v-if="selectedLog" class="log-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="时间">
            {{ formatDateTime(selectedLog.timestamp) }}
          </el-descriptions-item>
          <el-descriptions-item label="级别">
            <el-tag :type="getLevelType(selectedLog.level)">
              {{ selectedLog.level.toUpperCase() }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="类型">
            {{ getTypeText(selectedLog.type) }}
          </el-descriptions-item>
          <el-descriptions-item label="用户">
            {{ selectedLog.user || '系统' }}
          </el-descriptions-item>
          <el-descriptions-item label="IP地址">
            {{ selectedLog.ip || 'N/A' }}
          </el-descriptions-item>
          <el-descriptions-item label="模块">
            {{ selectedLog.module }}
          </el-descriptions-item>
          <el-descriptions-item label="操作" :span="2">
            {{ selectedLog.action }}
          </el-descriptions-item>
          <el-descriptions-item label="日志内容" :span="2">
            <pre class="log-message">{{ selectedLog.message }}</pre>
          </el-descriptions-item>
          <el-descriptions-item label="请求参数" :span="2" v-if="selectedLog.params">
            <pre class="log-params">{{ formatJSON(selectedLog.params) }}</pre>
          </el-descriptions-item>
          <el-descriptions-item label="响应结果" :span="2" v-if="selectedLog.response">
            <pre class="log-response">{{ formatJSON(selectedLog.response) }}</pre>
          </el-descriptions-item>
          <el-descriptions-item label="异常堆栈" :span="2" v-if="selectedLog.stackTrace">
            <pre class="log-stack">{{ selectedLog.stackTrace }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      
      <template #footer>
        <el-button @click="showLogDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 实时日志监控 -->
    <div class="realtime-monitor">
      <div class="monitor-header">
        <h3>实时日志监控</h3>
        <div class="monitor-controls">
          <el-switch
            v-model="realtimeEnabled"
            active-text="开启监控"
            inactive-text="关闭监控"
            @change="toggleRealtimeMonitor"
          />
          <el-button
            type="primary"
            link
            @click="clearRealtimeLogs"
            :disabled="realtimeLogs.length === 0"
          >
            清空
          </el-button>
        </div>
      </div>
      
      <div class="realtime-logs" ref="realtimeLogsContainer">
        <div
          v-for="log in realtimeLogs"
          :key="log.id"
          :class="['realtime-log-item', log.level]"
        >
          <div class="log-time">{{ formatTime(log.timestamp) }}</div>
          <div class="log-level">
            <el-tag :type="getLevelType(log.level)" size="small">
              {{ log.level.toUpperCase() }}
            </el-tag>
          </div>
          <div class="log-message" :title="log.message">{{ log.message }}</div>
        </div>
        
        <div v-if="realtimeLogs.length === 0" class="no-realtime-logs">
          <el-empty description="暂无实时日志" :image-size="80" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Download, Delete, Document, Calendar, Warning, Lock, Search } from '@element-plus/icons-vue'

interface SystemLog {
  id: string
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  type: 'system' | 'operation' | 'security' | 'access' | 'error'
  user: string
  ip: string
  module: string
  action: string
  message: string
  params?: any
  response?: any
  stackTrace?: string
}

const loading = ref(false)
const showLogDetailDialog = ref(false)
const realtimeEnabled = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)

const selectedLog = ref<SystemLog | null>(null)
const realtimeLogsContainer = ref<HTMLElement>()

const logStats = reactive({
  total: 12458,
  today: 342,
  errors: 156,
  security: 23
})

const filterForm = reactive({
  level: '',
  type: '',
  user: '',
  ip: '',
  keyword: '',
  dateRange: [] as string[]
})

// 模拟系统日志数据
const systemLogs = ref<SystemLog[]>([
  {
    id: 'log1',
    timestamp: '2024-01-18T14:30:25',
    level: 'info',
    type: 'operation',
    user: 'doctor_li',
    ip: '192.168.1.100',
    module: '病例管理',
    action: '创建新病例',
    message: '用户 doctor_li 创建了新病例 C20240015'
  },
  {
    id: 'log2',
    timestamp: '2024-01-18T14:28:10',
    level: 'error',
    type: 'system',
    user: 'system',
    ip: '',
    module: 'AI推理服务',
    action: '模型推理',
    message: 'AI模型推理超时，响应时间超过5000ms',
    stackTrace: 'TimeoutError: Inference timeout at ModelService.inference...'
  },
  {
    id: 'log3',
    timestamp: '2024-01-18T14:25:45',
    level: 'warn',
    type: 'security',
    user: 'unknown',
    ip: '203.0.113.5',
    module: '用户认证',
    action: '登录尝试',
    message: '检测到异常登录尝试，IP地址 203.0.113.5'
  },
  {
    id: 'log4',
    timestamp: '2024-01-18T14:20:30',
    level: 'info',
    type: 'access',
    user: 'patient_zhang',
    ip: '192.168.1.150',
    module: '影像上传',
    action: '文件上传',
    message: '用户 patient_zhang 上传了膝关节X光片，文件大小 2.3MB'
  },
  {
    id: 'log5',
    timestamp: '2024-01-18T14:15:20',
    level: 'debug',
    type: 'system',
    user: 'system',
    ip: '',
    module: '数据库',
    action: '查询操作',
    message: '执行SQL查询: SELECT * FROM medical_cases WHERE status = ?',
    params: { status: 'pending' }
  }
])

const realtimeLogs = ref<SystemLog[]>([])

const filteredLogs = computed(() => {
  let logs = systemLogs.value
  
  if (filterForm.level) {
    logs = logs.filter(log => log.level === filterForm.level)
  }
  
  if (filterForm.type) {
    logs = logs.filter(log => log.type === filterForm.type)
  }
  
  if (filterForm.user) {
    logs = logs.filter(log => log.user.includes(filterForm.user))
  }
  
  if (filterForm.ip) {
    logs = logs.filter(log => log.ip.includes(filterForm.ip))
  }
  
  if (filterForm.keyword) {
    const keyword = filterForm.keyword.toLowerCase()
    logs = logs.filter(log =>
      log.message.toLowerCase().includes(keyword) ||
      log.action.toLowerCase().includes(keyword) ||
      log.module.toLowerCase().includes(keyword)
    )
  }
  
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const [start, end] = filterForm.dateRange
    logs = logs.filter(log => {
      const logTime = new Date(log.timestamp)
      const startTime = new Date(start)
      const endTime = new Date(end)
      return logTime >= startTime && logTime <= endTime
    })
  }
  
  return logs
})

const totalLogs = computed(() => filteredLogs.value.length)

const getLevelType = (level: string) => {
  const typeMap = {
    debug: 'info',
    info: 'primary',
    warn: 'warning',
    error: 'danger',
    fatal: 'danger'
  }
  return typeMap[level as keyof typeof typeMap] || 'info'
}

const getTypeText = (type: string) => {
  const textMap = {
    system: '系统日志',
    operation: '操作日志',
    security: '安全日志',
    access: '访问日志',
    error: '错误日志'
  }
  return textMap[type as keyof typeof textMap] || '未知'
}

const formatDateTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN')
}

const formatJSON = (obj: any) => {
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return String(obj)
  }
}

const searchLogs = () => {
  currentPage.value = 1
  ElMessage.success('日志搜索完成')
}

const resetFilters = () => {
  Object.assign(filterForm, {
    level: '',
    type: '',
    user: '',
    ip: '',
    keyword: '',
    dateRange: []
  })
  currentPage.value = 1
}

const refreshLogs = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('日志数据已刷新')
  }, 1000)
}

const exportLogs = () => {
  ElMessage.success('日志导出成功')
}

const clearLogs = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清理所有日志吗？此操作不可恢复。',
      '清理确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    systemLogs.value = []
    logStats.total = 0
    logStats.today = 0
    logStats.errors = 0
    logStats.security = 0
    ElMessage.success('日志清理完成')
  } catch (error) {
    // 用户取消操作
  }
}

const viewLogDetail = (log: SystemLog) => {
  selectedLog.value = log
  showLogDetailDialog.value = true
}

const toggleRealtimeMonitor = () => {
  if (realtimeEnabled.value) {
    startRealtimeMonitor()
  } else {
    stopRealtimeMonitor()
  }
}

const startRealtimeMonitor = () => {
  // 模拟实时日志生成
  const interval = setInterval(() => {
    if (!realtimeEnabled.value) {
      clearInterval(interval)
      return
    }
    
    const levels: ('info' | 'warn' | 'error')[] = ['info', 'warn', 'error']
    const types: ('system' | 'operation' | 'access')[] = ['system', 'operation', 'access']
    const users = ['doctor_li', 'patient_zhang', 'admin', 'system']
    const modules = ['病例管理', '影像处理', 'AI诊断', '用户认证', '系统监控']
    const actions = [
      '查询病例', '上传影像', 'AI分析', '用户登录', '系统备份',
      '数据导出', '配置修改', '服务重启', '错误报告'
    ]
    const messages = [
      '用户执行了查询操作',
      '文件上传成功',
      'AI模型推理完成',
      '用户登录系统',
      '系统自动备份完成',
      '数据导出任务开始',
      '系统配置已更新',
      '服务重启完成',
      '检测到系统异常'
    ]
    
    const newLog: SystemLog = {
      id: `realtime_${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: levels[Math.floor(Math.random() * levels.length)],
      type: types[Math.floor(Math.random() * types.length)],
      user: users[Math.floor(Math.random() * users.length)],
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      module: modules[Math.floor(Math.random() * modules.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      message: messages[Math.floor(Math.random() * messages.length)]
    }
    
    realtimeLogs.value.unshift(newLog)
    
    // 限制实时日志数量
    if (realtimeLogs.value.length > 100) {
      realtimeLogs.value = realtimeLogs.value.slice(0, 100)
    }
    
    // 自动滚动到底部
    nextTick(() => {
      if (realtimeLogsContainer.value) {
        realtimeLogsContainer.value.scrollTop = 0
      }
    })
  }, 2000)
}

const stopRealtimeMonitor = () => {
  // 清理操作在startRealtimeMonitor中处理
}

const clearRealtimeLogs = () => {
  realtimeLogs.value = []
  ElMessage.success('实时日志已清空')
}

const scrollToBottom = () => {
  if (realtimeLogsContainer.value) {
    realtimeLogsContainer.value.scrollTop = realtimeLogsContainer.value.scrollHeight
  }
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})

onUnmounted(() => {
  realtimeEnabled.value = false
})
</script>

<style scoped>
.logs-audit {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.logs-stats {
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.total {
  background: #409eff;
}

.stat-icon.today {
  background: #67c23a;
}

.stat-icon.error {
  background: #e6a23c;
}

.stat-icon.security {
  background: #f56c6c;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.logs-filters {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.logs-list {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.log-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.log-message, .log-params, .log-response, .log-stack {
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
  margin: 0;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.realtime-monitor {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.monitor-header h3 {
  margin: 0;
  color: #333;
}

.monitor-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.realtime-logs {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
  background: #fafafa;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

.realtime-log-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 8px;
  border-bottom: 1px solid #f0f0f0;
}

.realtime-log-item:last-child {
  border-bottom: none;
}

.realtime-log-item.debug {
  background: #f0f9ff;
}

.realtime-log-item.info {
  background: #f0f9ff;
}

.realtime-log-item.warn {
  background: #fdf6ec;
}

.realtime-log-item.error {
  background: #fef0f0;
}

.realtime-log-item.fatal {
  background: #fef0f0;
}

.log-time {
  color: #666;
  min-width: 80px;
}

.log-level {
  min-width: 50px;
}

.log-message {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-realtime-logs {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>