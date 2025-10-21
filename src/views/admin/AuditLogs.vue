<template>
  <div class="audit-logs-page">
    <div class="page-header">
      <div class="header-left">
        <el-button 
          type="primary" 
          size="small"
          @click="goBack"
          style="margin-right: 10px;"
        >
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1>操作审计日志</h1>
      </div>
      <div class="header-actions">
        <el-button type="success" @click="startRealtimeMonitor" v-if="!isRealtimeMonitoring">
          <el-icon><VideoPlay /></el-icon>
          实时监控
        </el-button>
        <el-button type="warning" @click="stopRealtimeMonitor" v-else>
          <el-icon><VideoPause /></el-icon>
          停止监控
        </el-button>
        <el-button type="danger" @click="clearLogs" style="margin-left: 10px;">
          <el-icon><Delete /></el-icon>
          清理日志
        </el-button>
        <el-button type="primary" @click="exportLogs" style="margin-left: 10px;">
          <el-icon><Download /></el-icon>
          导出日志
        </el-button>
      </div>
    </div>
    
    <!-- 统计概览 -->
    <div class="stats-overview">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ totalLogs }}</div>
          <div class="stat-label">总日志数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number" style="color: #f56c6c;">{{ errorLogsCount }}</div>
          <div class="stat-label">错误日志</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ todayLogsCount }}</div>
          <div class="stat-label">今日新增</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ activeUsersCount }}</div>
          <div class="stat-label">活跃用户</div>
        </div>
      </el-card>
    </div>
    
    <!-- 筛选搜索栏 -->
    <el-card class="filter-card">
      <div class="filter-container">
        <div class="filter-row">
          <el-input 
            v-model="searchKeyword" 
            placeholder="搜索关键字（用户名、操作详情）" 
            prefix-icon="Search" 
            style="width: 350px; margin-right: 15px;"
          />
          <el-select 
            v-model="actionTypeFilter" 
            placeholder="操作类型" 
            style="width: 150px; margin-right: 15px;"
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="登录" value="login" />
            <el-option label="登出" value="logout" />
            <el-option label="上传" value="upload" />
            <el-option label="下载" value="download" />
            <el-option label="更新" value="update" />
            <el-option label="删除" value="delete" />
            <el-option label="创建" value="create" />
            <el-option label="查询" value="query" />
          </el-select>
          <el-select 
            v-model="userTypeFilter" 
            placeholder="用户类型" 
            style="width: 120px; margin-right: 15px;"
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="管理员" value="admin" />
            <el-option label="医生" value="doctor" />
            <el-option label="患者" value="patient" />
          </el-select>
          <el-select 
            v-model="statusFilter" 
            placeholder="操作状态" 
            style="width: 120px; margin-right: 15px;"
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="成功" value="success" />
            <el-option label="失败" value="error" />
            <el-option label="警告" value="warning" />
          </el-select>
        </div>
        <div class="filter-row" style="margin-top: 10px;">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 320px; margin-right: 15px;"
          />
          <el-input 
            v-model="ipFilter" 
            placeholder="IP地址" 
            prefix-icon="DocumentCopy" 
            style="width: 200px; margin-right: 15px;"
          />
          <el-input 
            v-model="moduleFilter" 
            placeholder="模块" 
            prefix-icon="Menu" 
            style="width: 150px; margin-right: 15px;"
          />
          <el-button type="primary" @click="resetFilters" style="margin-right: 10px;">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="info" @click="refreshLogs">
            <el-icon><RefreshLeft /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
    </el-card>
    
    <!-- 操作日志表格 -->
    <el-card class="logs-table-card">
      <el-table 
        :data="paginatedFilteredLogs" 
        stripe 
        border
        style="width: 100%;"
        @row-click="viewLogDetail"
        row-class-name="log-row"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag 
              :type="getStatusTagType(scope.row.status)"
              :size="'small'"
            >
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="timestamp" label="操作时间" width="180" sortable>
          <template #default="scope">
            <div>{{ formatDateTime(scope.row.timestamp) }}</div>
            <div class="relative-time">{{ getRelativeTime(scope.row.timestamp) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="130" sortable show-overflow-tooltip>
          <template #default="scope">
            <div class="user-info">
              <el-avatar :size="20" :icon="getUserAvatar(scope.row.username)">{{ scope.row.username.substring(0, 1).toUpperCase() }}</el-avatar>
              <span>{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userType" label="用户类型" width="100">
          <template #default="scope">
            <el-tag 
              :type="getUserTypeTagType(scope.row.userType)"
              :size="'small'"
            >
              {{ getUserTypeText(scope.row.userType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" width="140" show-overflow-tooltip />
        <el-table-column prop="module" label="模块" width="120" show-overflow-tooltip />
        <el-table-column prop="action" label="操作类型" width="100">
          <template #default="scope">
            <el-tag 
              :type="getActionTagType(scope.row.action)"
              :size="'small'"
            >
              {{ getActionText(scope.row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="details" label="操作详情" min-width="300" show-overflow-tooltip>
          <template #default="scope">
            <div class="details-content">
              {{ scope.row.details }}
              <el-button 
                type="text" 
                size="small" 
                @click.stop="viewLogDetail(scope.row)"
                class="view-detail-btn"
              >
                详情
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.stop="viewLogDetail(scope.row)">
              <el-icon><View /></el-icon>
            </el-button>
            <el-button link type="danger" size="small" @click.stop="deleteLog(scope.row.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredLogs.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 日志详情对话框 -->
    <el-dialog 
      v-model="showLogDetailDialog" 
      title="日志详情" 
      width="700px"
    >
      <div v-if="selectedLog" class="log-detail-content">
        <el-descriptions :column="1" border :size="'small'">
          <el-descriptions-item label="日志ID">{{ selectedLog.id }}</el-descriptions-item>
          <el-descriptions-item label="操作时间">{{ formatDateTime(selectedLog.timestamp) }}</el-descriptions-item>
          <el-descriptions-item label="相对时间">{{ getRelativeTime(selectedLog.timestamp) }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ selectedLog.username }}</el-descriptions-item>
          <el-descriptions-item label="用户类型">{{ getUserTypeText(selectedLog.userType) }}</el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ selectedLog.ip }}</el-descriptions-item>
          <el-descriptions-item label="模块">{{ selectedLog.module }}</el-descriptions-item>
          <el-descriptions-item label="操作类型">{{ getActionText(selectedLog.action) }}</el-descriptions-item>
          <el-descriptions-item label="操作状态">{{ getStatusText(selectedLog.status) }}</el-descriptions-item>
          <el-descriptions-item label="操作详情">{{ selectedLog.details }}</el-descriptions-item>
          <el-descriptions-item label="请求参数" v-if="selectedLog.params">
            <pre class="params-json">{{ JSON.stringify(selectedLog.params, null, 2) }}</pre>
          </el-descriptions-item>
          <el-descriptions-item label="响应结果" v-if="selectedLog.result">
            <pre class="params-json">{{ JSON.stringify(selectedLog.result, null, 2) }}</pre>
          </el-descriptions-item>
          <el-descriptions-item label="浏览器信息" v-if="selectedLog.userAgent">
            <div class="user-agent">{{ selectedLog.userAgent }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showLogDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Search, Refresh, RefreshLeft, Delete, Download, VideoPlay, VideoPause, View, DocumentCopy, Menu } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 状态管理
const router = useRouter();
const logs = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);
const showLogDetailDialog = ref(false);
const selectedLog = ref<any>(null);
const isRealtimeMonitoring = ref(false);
let realtimeInterval: number | null = null;

// 搜索和筛选条件
const searchKeyword = ref('');
const actionTypeFilter = ref('');
const userTypeFilter = ref('');
const statusFilter = ref('');
const ipFilter = ref('');
const moduleFilter = ref('');
const dateRange = ref<[Date, Date] | null>(null);

// 返回用户管理页面
const goBack = () => {
  router.push('/dashboard/admin/user-management');
};

// 模拟数据生成
const generateMockLogs = () => {
  const actions = ['login', 'logout', 'upload', 'download', 'update', 'delete', 'create', 'query'];
  const userTypes = ['admin', 'doctor', 'patient'];
  const statuses = ['success', 'error', 'warning'];
  const modules = ['用户管理', '病例管理', '影像处理', 'AI诊断', '系统设置', '备份恢复', '报表统计'];
  const usernames = ['admin_wang', 'admin_li', 'doctor_zhang', 'doctor_sun', 'doctor_chen', 'patient_zhao', 'patient_qian'];
  const ipAddresses = ['192.168.1.101', '192.168.1.102', '10.0.0.5', '172.16.0.23', '203.0.113.42'];
  
  const detailsTemplates = {
    login: ['用户登录系统', '管理员登录系统', '登录失败：密码错误', '登录失败：账户锁定'],
    logout: ['用户登出系统', '管理员登出系统'],
    upload: ['上传患者影像数据', '上传病例资料', '上传报告文件'],
    download: ['下载患者报告', '下载影像数据', '导出统计报表'],
    update: ['更新用户信息', '更新系统配置', '修改病例信息', '更新诊断结果'],
    delete: ['删除病例记录', '删除临时文件', '清除缓存数据'],
    create: ['创建新用户', '创建病例', '新建诊断任务', '创建备份计划'],
    query: ['查询患者信息', '搜索病例记录', '获取系统状态', '查询操作日志']
  };
  
  const logsData: any[] = [];
  const now = Date.now();
  
  for (let i = 0; i < 100; i++) {
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomUserType = userTypes[Math.floor(Math.random() * userTypes.length)];
    const randomStatus = Math.random() > 0.1 ? 'success' : statuses[Math.floor(Math.random() * statuses.length)];
    const randomModule = modules[Math.floor(Math.random() * modules.length)];
    const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
    const randomIp = ipAddresses[Math.floor(Math.random() * ipAddresses.length)];
    const randomDetails = detailsTemplates[randomAction as keyof typeof detailsTemplates][Math.floor(Math.random() * detailsTemplates[randomAction as keyof typeof detailsTemplates].length)];
    
    // 生成随机时间（过去7天内）
    const randomTime = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    const log: any = {
      id: `log_${Date.now()}_${i}`,
      timestamp: new Date(randomTime).toISOString(),
      username: randomUsername,
      userType: randomUserType,
      ip: randomIp,
      module: randomModule,
      action: randomAction,
      status: randomStatus,
      details: randomDetails
    };
    
    // 随机添加一些额外信息
    if (Math.random() > 0.5) {
      log.params = {
        page: 1,
        limit: 20,
        sort: 'desc'
      };
    }
    
    if (Math.random() > 0.7) {
      log.result = {
        code: randomStatus === 'success' ? 200 : 400,
        message: randomStatus === 'success' ? '操作成功' : '操作失败',
        data: null
      };
    }
    
    if (Math.random() > 0.6) {
      log.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }
    
    logsData.push(log);
  }
  
  // 按时间倒序排列
  logsData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return logsData;
};

// 计算属性
const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    // 关键字搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      if (!log.username.toLowerCase().includes(keyword) && !log.details.toLowerCase().includes(keyword)) {
        return false;
      }
    }
    
    // 操作类型筛选
    if (actionTypeFilter.value && log.action !== actionTypeFilter.value) {
      return false;
    }
    
    // 用户类型筛选
    if (userTypeFilter.value && log.userType !== userTypeFilter.value) {
      return false;
    }
    
    // 状态筛选
    if (statusFilter.value && log.status !== statusFilter.value) {
      return false;
    }
    
    // IP地址筛选
    if (ipFilter.value && !log.ip.includes(ipFilter.value)) {
      return false;
    }
    
    // 模块筛选
    if (moduleFilter.value && !log.module.includes(moduleFilter.value)) {
      return false;
    }
    
    // 日期范围筛选
    if (dateRange.value) {
      const logDate = new Date(log.timestamp);
      const startDate = new Date(dateRange.value[0]);
      const endDate = new Date(dateRange.value[1]);
      endDate.setHours(23, 59, 59, 999);
      
      if (logDate < startDate || logDate > endDate) {
        return false;
      }
    }
    
    return true;
  });
});

const paginatedFilteredLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredLogs.value.slice(start, end);
});

const totalLogs = computed(() => logs.value.length);

const errorLogsCount = computed(() => {
  return logs.value.filter(log => log.status === 'error').length;
});

const todayLogsCount = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return logs.value.filter(log => new Date(log.timestamp) >= today).length;
});

const activeUsersCount = computed(() => {
  const uniqueUsers = new Set(logs.value.map(log => log.username));
  return uniqueUsers.size;
});

// 方法
const viewLogDetail = (log: any) => {
  selectedLog.value = log;
  showLogDetailDialog.value = true;
};

const deleteLog = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除此日志记录吗？',
      '确认删除',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
    );
    
    const index = logs.value.findIndex(log => log.id === id);
    if (index !== -1) {
      logs.value.splice(index, 1);
      ElMessage.success('日志删除成功');
    }
  } catch (error) {
    // 用户取消操作
  }
};

const clearLogs = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有日志记录吗？此操作不可恢复！',
      '确认清空',
      { confirmButtonText: '确认清空', cancelButtonText: '取消', type: 'danger' }
    );
    
    logs.value = [];
    ElMessage.success('日志已清空');
  } catch (error) {
    // 用户取消操作
  }
};

const exportLogs = () => {
  // 模拟导出功能
  ElMessage.success('日志导出成功，文件已下载');
};

const resetFilters = () => {
  searchKeyword.value = '';
  actionTypeFilter.value = '';
  userTypeFilter.value = '';
  statusFilter.value = '';
  ipFilter.value = '';
  moduleFilter.value = '';
  dateRange.value = null;
  currentPage.value = 1;
};

const refreshLogs = () => {
  // 模拟刷新，重新生成一些新日志
  const newLogs = generateMockLogs().slice(0, 5);
  logs.value = [...newLogs, ...logs.value];
  ElMessage.success('日志已刷新');
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

const startRealtimeMonitor = () => {
  isRealtimeMonitoring.value = true;
  
  // 每3秒模拟添加一条新日志
  realtimeInterval = window.setInterval(() => {
    const actions = ['login', 'upload', 'query', 'update'];
    const modules = ['实时监控', '病例管理', '影像处理', 'AI诊断'];
    const usernames = ['admin_wang', 'doctor_zhang', 'doctor_sun'];
    
    const newLog: any = {
      id: `realtime_${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: usernames[Math.floor(Math.random() * usernames.length)],
      userType: 'admin',
      ip: '192.168.1.100',
      module: modules[Math.floor(Math.random() * modules.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      status: 'success',
      details: '实时监控产生的日志记录'
    };
    
    logs.value.unshift(newLog);
  }, 3000);
  
  ElMessage.success('实时监控已启动');
};

const stopRealtimeMonitor = () => {
  isRealtimeMonitoring.value = false;
  if (realtimeInterval) {
    clearInterval(realtimeInterval);
    realtimeInterval = null;
  }
  ElMessage.success('实时监控已停止');
};

// 辅助函数
const formatDateTime = (timestamp: string) => {
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

const getRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) {
    return '刚刚';
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return date.toLocaleDateString('zh-CN');
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'success': return '成功';
    case 'error': return '错误';
    case 'warning': return '警告';
    default: return status;
  }
};

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'success': return 'success';
    case 'error': return 'danger';
    case 'warning': return 'warning';
    default: return 'info';
  }
};

const getActionText = (action: string) => {
  const actionMap: Record<string, string> = {
    'login': '登录',
    'logout': '登出',
    'upload': '上传',
    'download': '下载',
    'update': '更新',
    'delete': '删除',
    'create': '创建',
    'query': '查询'
  };
  return actionMap[action] || action;
};

const getActionTagType = (action: string) => {
  const actionTypeMap: Record<string, string> = {
    'login': 'primary',
    'logout': 'info',
    'upload': 'success',
    'download': 'warning',
    'update': 'info',
    'delete': 'danger',
    'create': 'success',
    'query': 'primary'
  };
  return actionTypeMap[action] || 'default';
};

const getUserTypeText = (userType: string) => {
  const userTypeMap: Record<string, string> = {
    'admin': '管理员',
    'doctor': '医生',
    'patient': '患者'
  };
  return userTypeMap[userType] || userType;
};

const getUserTypeTagType = (userType: string) => {
  const userTypeTagMap: Record<string, string> = {
    'admin': 'primary',
    'doctor': 'success',
    'patient': 'info'
  };
  return userTypeTagMap[userType] || 'default';
};

const getUserAvatar = (username: string) => {
  // 可以根据需要返回不同的头像图标
  return 'User';
};

// 生命周期
onMounted(() => {
  logs.value = generateMockLogs();
  console.log('操作日志页面已加载');
});

onUnmounted(() => {
  // 清理定时器
  if (realtimeInterval) {
    clearInterval(realtimeInterval);
  }
});
</script>

<style scoped>
.audit-logs-page {
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

.header-actions {
  display: flex;
  gap: 5px;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-container {
  padding: 10px 0;
}

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.logs-table-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.log-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.log-row:hover {
  background-color: #f5f7fa;
}

.details-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-detail-btn {
  color: #1890ff;
}

.relative-time {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.log-detail-content {
  max-height: 500px;
  overflow-y: auto;
}

.params-json {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.user-agent {
  font-size: 13px;
  color: #666;
  font-family: monospace;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .header-actions {
    flex-wrap: wrap;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-row .el-input,
  .filter-row .el-select,
  .filter-row .el-date-picker {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .details-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .view-detail-btn {
    align-self: flex-end;
  }
}
</style>