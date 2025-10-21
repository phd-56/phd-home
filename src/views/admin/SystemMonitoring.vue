<template>
  <div class="system-monitoring">
    <h1 class="page-title">系统监控</h1>
    
    <div class="monitoring-dashboard">
      <el-card class="monitoring-card">
        <template #header>
          <div class="card-header">
            <span>系统资源使用情况</span>
          </div>
        </template>
        
        <div class="resource-stats">
          <div class="stat-item">
            <div class="stat-value">CPU: 45%</div>
            <el-progress :percentage="45" :status="'success'" />
          </div>
          <div class="stat-item">
            <div class="stat-value">内存: 62%</div>
            <el-progress :percentage="62" :status="'warning'" />
          </div>
          <div class="stat-item">
            <div class="stat-value">磁盘: 30%</div>
            <el-progress :percentage="30" :status="'success'" />
          </div>
        </div>
      </el-card>
      
      <el-card class="monitoring-card">
        <template #header>
          <div class="card-header">
            <span>服务状态</span>
          </div>
        </template>
        
        <el-table :data="servicesData" style="width: 100%">
          <el-table-column prop="name" label="服务名称" width="180" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'running' ? 'success' : 'danger'">
                {{ scope.row.status === 'running' ? '运行中' : '已停止' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="uptime" label="运行时间" />
          <el-table-column prop="version" label="版本" />
        </el-table>
      </el-card>
      
      <el-card class="monitoring-card">
        <template #header>
          <div class="card-header">
            <span>系统日志</span>
          </div>
        </template>
        
        <div class="system-logs">
          <div class="log-item" v-for="(log, index) in systemLogs" :key="index">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-level" :class="`level-${log.level}`">{{ log.level }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 服务状态数据
const servicesData = ref([
  { name: 'AI诊断服务', status: 'running', uptime: '36天4小时', version: '1.2.3' },
  { name: '用户认证服务', status: 'running', uptime: '36天4小时', version: '1.2.3' },
  { name: '数据存储服务', status: 'running', uptime: '36天4小时', version: '1.2.3' },
  { name: '模型训练服务', status: 'running', uptime: '2天12小时', version: '1.2.3' },
])

// 系统日志数据
const systemLogs = ref([
  { time: '2023-10-20 14:30:25', level: 'info', message: '系统启动成功' },
  { time: '2023-10-20 14:31:05', level: 'info', message: 'AI模型加载完成' },
  { time: '2023-10-20 15:45:12', level: 'warning', message: '磁盘空间低于50%' },
  { time: '2023-10-20 16:20:33', level: 'info', message: '用户admin登录成功' },
  { time: '2023-10-20 17:10:45', level: 'error', message: '数据库连接超时' },
])
</script>

<style scoped>
.system-monitoring {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.monitoring-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.monitoring-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resource-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-value {
  font-weight: bold;
  color: #606266;
}

.system-logs {
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  gap: 10px;
  align-items: center;
}

.log-time {
  color: #909399;
  font-size: 12px;
  width: 150px;
}

.log-level {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
  width: 60px;
  text-align: center;
}

.level-info {
  background-color: #ecf5ff;
  color: #409eff;
}

.level-warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.level-error {
  background-color: #fef0f0;
  color: #f56c6c;
}

.log-message {
  flex: 1;
}
</style>