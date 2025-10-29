<template>
  <div class="system-config">
    <div class="page-header">
      <h1 class="page-title">系统参数配置</h1>
      <p class="page-description">配置系统全局参数、安全策略、存储管理等通知设置</p>
    </div>

    <div class="action-buttons">
      <el-button @click="handleResetDefault">恢复默认</el-button>
      <el-button type="primary" @click="handleSaveConfig">保存配置</el-button>
    </div>

    <div class="config-layout">
      <!-- 配置菜单 -->
      <el-card class="config-menu-card">
        <div class="menu-item" :class="{ active: activeMenu === 'basic' }" @click="activeMenu = 'basic'">
          基础配置
        </div>
        <div class="menu-item" :class="{ active: activeMenu === 'security' }" @click="activeMenu = 'security'">
          安全策略
        </div>
        <div class="menu-item" :class="{ active: activeMenu === 'storage' }" @click="activeMenu = 'storage'">
          存储管理
        </div>
        <div class="menu-item" :class="{ active: activeMenu === 'notification' }" @click="activeMenu = 'notification'">
          通知设置
        </div>
        <div class="menu-item" :class="{ active: activeMenu === 'log' }" @click="activeMenu = 'log'">
          日志管理
        </div>
      </el-card>

      <!-- 配置内容 -->
      <el-card class="config-content-card">
        <template v-if="activeMenu === 'basic'">
          <h3 class="content-title">基础配置</h3>
          <p class="content-subtitle">配置系统基本信息与运行参数</p>
          
          <el-form :model="basicConfig" label-width="120px" class="config-form">
            <el-form-item label="系统名称">
              <el-input v-model="basicConfig.systemName" />
            </el-form-item>
            <el-form-item label="系统简称">
              <el-input v-model="basicConfig.shortName" />
            </el-form-item>
            <el-form-item label="系统版本">
              <el-input v-model="basicConfig.version" disabled />
            </el-form-item>
            <el-form-item label="描述信息">
              <el-input v-model="basicConfig.description" type="textarea" :rows="3" />
            </el-form-item>
          </el-form>
        </template>

        <template v-if="activeMenu === 'security'">
          <h3 class="content-title">安全策略</h3>
          <p class="content-subtitle">配置系统安全策略</p>
          
          <el-form :model="securityConfig" label-width="200px" class="config-form">
            <el-form-item label="密码最小长度">
              <el-input-number v-model="securityConfig.minPasswordLength" :min="6" :max="20" />
            </el-form-item>
            <el-form-item label="密码有效期（天）">
              <el-input-number v-model="securityConfig.passwordExpireDays" :min="0" />
            </el-form-item>
            <el-form-item label="登录失败次数锁定">
              <el-input-number v-model="securityConfig.lockAttempts" :min="3" :max="10" />
            </el-form-item>
            <el-form-item label="启用双因素认证">
              <el-switch v-model="securityConfig.enable2FA" />
            </el-form-item>
          </el-form>
        </template>

        <template v-if="activeMenu === 'storage'">
          <h3 class="content-title">存储管理</h3>
          <p class="content-subtitle">配置系统存储设置</p>
          
          <el-form :model="storageConfig" label-width="150px" class="config-form">
            <el-form-item label="存储路径">
              <el-input v-model="storageConfig.storagePath" />
            </el-form-item>
            <el-form-item label="最大文件大小（MB）">
              <el-input-number v-model="storageConfig.maxFileSize" />
            </el-form-item>
            <el-form-item label="自动清理">
              <el-switch v-model="storageConfig.autoClean" />
            </el-form-item>
            <el-form-item label="清理周期（天）">
              <el-input-number v-model="storageConfig.cleanInterval" />
            </el-form-item>
          </el-form>
        </template>

        <template v-if="activeMenu === 'notification'">
          <h3 class="content-title">通知设置</h3>
          <p class="content-subtitle">配置系统通知参数</p>
          
          <el-form :model="notificationConfig" label-width="150px" class="config-form">
            <el-form-item label="邮件通知">
              <el-switch v-model="notificationConfig.emailEnabled" />
            </el-form-item>
            <el-form-item label="短信通知">
              <el-switch v-model="notificationConfig.smsEnabled" />
            </el-form-item>
            <el-form-item label="系统消息">
              <el-switch v-model="notificationConfig.systemEnabled" />
            </el-form-item>
          </el-form>
        </template>

        <template v-if="activeMenu === 'log'">
          <h3 class="content-title">日志管理</h3>
          <p class="content-subtitle">配置系统日志参数</p>
          
          <el-form :model="logConfig" label-width="150px" class="config-form">
            <el-form-item label="日志级别">
              <el-select v-model="logConfig.logLevel">
                <el-option label="DEBUG" value="debug" />
                <el-option label="INFO" value="info" />
                <el-option label="WARN" value="warn" />
                <el-option label="ERROR" value="error" />
              </el-select>
            </el-form-item>
            <el-form-item label="日志保留天数">
              <el-input-number v-model="logConfig.retentionDays" />
            </el-form-item>
            <el-form-item label="启用审计日志">
              <el-switch v-model="logConfig.enableAudit" />
            </el-form-item>
          </el-form>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeMenu = ref<'basic' | 'security' | 'storage' | 'notification' | 'log'>('basic')

const basicConfig = ref({
  systemName: '医疗影像管理系统',
  shortName: '医像系统',
  version: 'v2.3.1',
  description: '专业的医疗影像管理系统'
})

const securityConfig = ref({
  minPasswordLength: 8,
  passwordExpireDays: 90,
  lockAttempts: 5,
  enable2FA: false
})

const storageConfig = ref({
  storagePath: '/data/medical-images',
  maxFileSize: 500,
  autoClean: true,
  cleanInterval: 30
})

const notificationConfig = ref({
  emailEnabled: true,
  smsEnabled: false,
  systemEnabled: true
})

const logConfig = ref({
  logLevel: 'info',
  retentionDays: 30,
  enableAudit: true
})

const handleResetDefault = () => {
  ElMessage.warning('恢复默认配置')
}

const handleSaveConfig = () => {
  ElMessage.success('配置保存成功')
}
</script>

<style scoped>
.system-config {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-description {
  color: #6b7280;
  font-size: 1rem;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.config-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
}

.config-menu-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 16px;
}

.menu-item {
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
  margin-bottom: 4px;
}

.menu-item:hover {
  background: #f9fafb;
}

.menu-item.active {
  background: #eff6ff;
  color: #3b82f6;
  font-weight: 500;
}

.config-content-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.content-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.content-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 24px;
}

.config-form {
  max-width: 800px;
}
</style>

