
import { defineStore } from 'pinia';
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from '@/utils/axios';

// 备份配置类型定义
interface BackupConfig {
  id: string;
  name: string;
  type: 'full' | 'incremental'; // 全量备份或增量备份
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly'; // 备份频率
    time: string; // 备份时间，格式HH:MM
    dayOfWeek?: number; // 每周备份的星期几(0-6)
    dayOfMonth?: number; // 每月备份的日期(1-31)
  };
  retentionPolicy: {
    keepDays: number; // 保留天数
    maxBackups: number; // 最大备份数
  };
  encryption: boolean; // 是否加密
  compression: 'none' | 'normal' | 'high'; // 压缩级别
  isEnabled: boolean; // 是否启用
}

// 备份记录类型定义
interface BackupRecord {
  id: string;
  configId: string;
  configName: string;
  type: 'full' | 'incremental';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  size: number; // 备份大小(MB)
  duration: number; // 持续时间(秒)
  fileHash: string; // 文件哈希值
  storagePath: string;
}

// 恢复点类型定义
interface RestorePoint {
  backupId: string;
  timestamp: string;
  type: 'full' | 'incremental';
  size: number;
  configName: string;
}

export const useBackupStore = defineStore('backup', () => {
  // 状态变量
  const backupConfigs = ref<BackupConfig[]>([
    {
      id: '1',
      name: '数据库每日全量备份',
      type: 'full',
      schedule: {
        frequency: 'daily',
        time: '02:00'
      },
      retentionPolicy: {
        keepDays: 30,
        maxBackups: 10
      },
      encryption: true,
      compression: 'normal',
      isEnabled: true
    },
    {
      id: '2',
      name: '用户数据每周备份',
      type: 'incremental',
      schedule: {
        frequency: 'weekly',
        time: '01:00',
        dayOfWeek: 0
      },
      retentionPolicy: {
        keepDays: 60,
        maxBackups: 20
      },
      encryption: false,
      compression: 'high',
      isEnabled: true
    }
  ]);
  
  const backupRecords = ref<BackupRecord[]>([
    {
      id: 'record1',
      configId: '1',
      configName: '数据库每日全量备份',
      type: 'full',
      status: 'completed',
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
      type: 'incremental',
      status: 'completed',
      startTime: new Date(Date.now() - 604800000).toISOString(),
      endTime: new Date(Date.now() - 604800000 + 1800000).toISOString(),
      size: 45.2,
      duration: 1800,
      fileHash: 'def456',
      storagePath: '/backups/2023-10-15/user-inc-backup.tar.gz'
    }
  ]);
  
  const restorePoints = ref<RestorePoint[]>([]);
  const currentBackup = ref<BackupRecord | null>(null);
  const isLoading = ref(true); // 初始化为true，模拟加载状态
  const isBackupRunning = ref(false);
  
  // 获取备份配置
  const fetchBackupConfigs = async () => {
    try {
      // 直接返回已有的模拟数据，不设置loading状态
      // 这样组件可以立即访问数据
      return backupConfigs.value;
    } catch (error) {
      console.error('获取备份配置失败:', error);
      ElMessage.error('无法加载备份配置');
      throw error;
    }
  };
  
  // 获取备份记录
  const fetchBackupRecords = async (configId?: string) => {
    try {
      // 直接返回已有的模拟数据，不设置loading状态
      if (configId) {
        return backupRecords.value.filter(record => record.configId === configId);
      }
      // 提取恢复点
      extractRestorePoints();
      return backupRecords.value;
    } catch (error) {
      console.error('获取备份记录失败:', error);
      ElMessage.error('无法加载备份记录');
      throw error;
    }
  };
  
  // 提取恢复点（最新的全量备份和之后的增量备份）
  const extractRestorePoints = () => {
    const points: RestorePoint[] = [];
    let lastFullBackup: BackupRecord | null = null;
    
    // 按时间倒序处理备份记录
    [...backupRecords.value].sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    ).forEach(record => {
      if (record.status === 'completed') {
        if (record.type === 'full') {
          lastFullBackup = record;
          points.push({
            backupId: record.id,
            timestamp: record.startTime,
            type: record.type,
            size: record.size,
            configName: record.configName
          });
        } else if (lastFullBackup) {
          // 只添加最新全量备份之后的增量备份
          points.push({
            backupId: record.id,
            timestamp: record.startTime,
            type: record.type,
            size: record.size,
            configName: record.configName
          });
        }
      }
    });
    
    restorePoints.value = points;
  };
  
  // 保存备份配置
  const saveBackupConfig = async (config: BackupConfig) => {
    try {
      isLoading.value = true;
      if (config.id) {
        // 更新现有配置
        await axios.put(`/api/backup/configs/${config.id}`, config);
        ElMessage.success('备份配置更新成功');
      } else {
        // 创建新配置
        await axios.post('/api/backup/configs', config);
        ElMessage.success('备份配置创建成功');
      }
      fetchBackupConfigs();
    } catch (error) {
      console.error('保存备份配置失败:', error);
      ElMessage.error('保存备份配置失败，请重试');
    } finally {
      isLoading.value = false;
    }
  };
  
  // 删除备份配置
  const deleteBackupConfig = async (id: string) => {
    try {
      await ElMessageBox.confirm(
        '确定要删除此备份配置吗？相关的备份记录不会被删除。',
        '确认删除',
        { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
      );
      
      isLoading.value = true;
      await axios.delete(`/api/backup/configs/${id}`);
      backupConfigs.value = backupConfigs.value.filter(c => c.id !== id);
      ElMessage.success('备份配置已删除');
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除备份配置失败:', error);
        ElMessage.error('删除备份配置失败');
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  // 执行手动备份
  const runManualBackup = async (configId: string) => {
    try {
      isBackupRunning.value = true;
      currentBackup.value = null;
      
      const response = await axios.post('/api/backup/manual', { configId });
      currentBackup.value = response.data;
      
      ElMessage.success('备份任务已启动');
      // 轮询检查备份状态
      checkBackupStatus(currentBackup.value.id);
    } catch (error) {
      console.error('启动手动备份失败:', error);
      ElMessage.error('启动备份失败，请重试');
    } finally {
      isBackupRunning.value = false;
    }
  };
  
  // 检查备份状态
  const checkBackupStatus = async (backupId: string, interval = 3000) => {
    const checkInterval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/backup/records/${backupId}`);
        const backup = response.data;
        
        currentBackup.value = backup;
        
        if (backup.status === 'completed' || backup.status === 'failed') {
          clearInterval(checkInterval);
          fetchBackupRecords(); // 刷新备份记录
          
          if (backup.status === 'completed') {
            ElMessage.success('备份任务已完成');
          } else {
            ElMessage.error('备份任务失败');
          }
        }
      } catch (error) {
        console.error('检查备份状态失败:', error);
        clearInterval(checkInterval);
      }
    }, interval);
  };
  
  // 执行恢复操作
  const performRestore = async (backupId: string) => {
    try {
      await ElMessageBox.confirm(
        '恢复操作将覆盖现有数据，是否继续？',
        '警告',
        { confirmButtonText: '确认', cancelButtonText: '取消', type: 'error' }
      );
      
      isLoading.value = true;
      await axios.post('/api/backup/restore', { backupId });
      ElMessage.success('恢复操作已成功执行');
    } catch (error) {
      if (error !== 'cancel') {
        console.error('恢复操作失败:', error);
        ElMessage.error('恢复操作失败，请重试');
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  // 定时任务管理
  const scheduleBackup = (schedule: string, configId: string) => {
    // 根据cron表达式设置定时任务
    // 这里简化处理，实际应该使用node-cron等库
    console.log(`设置备份定时任务: ${schedule} for config ${configId}`);
  };

  // 取消定时任务
  const cancelBackupSchedule = (configId: string) => {
    console.log(`取消备份定时任务: ${configId}`);
  };

  // 执行手动备份
  const executeManualBackup = async (configId: string) => {
    try {
      const config = backupConfigs.value.find(c => c.id === configId);
      if (!config) {
        throw new Error('备份配置不存在');
      }

      isLoading.value = true;
      const backupRecord = {
        id: Date.now().toString(),
        configId: config.id,
        configName: config.name,
        type: config.type,
        startTime: new Date().toISOString(),
        status: 'running' as const,
        size: 0,
        duration: 0,
        fileHash: '',
        storagePath: ''
      };

      backupRecords.value.unshift(backupRecord);

      // 模拟备份过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 更新备份记录
      backupRecord.status = 'completed';
      backupRecord.endTime = new Date().toISOString();
      backupRecord.size = Math.floor(Math.random() * 1024) + 100; // 模拟大小
      backupRecord.duration = 3600;
      backupRecord.fileHash = 'mock-hash-' + Math.random().toString(36).substr(2, 9);
      backupRecord.storagePath = `/backups/manual/${Date.now()}.tar.gz`;

      ElMessage.success(`备份完成: ${config.name}`);
      return backupRecord;
    } catch (error) {
      console.error('执行手动备份失败:', error);
      ElMessage.error('备份失败');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 恢复备份
  const restoreBackup = async (backupId: string) => {
    try {
      const backup = backupRecords.value.find(b => b.id === backupId);
      if (!backup || backup.status !== 'success') {
        throw new Error('无效的备份记录');
      }

      isLoading.value = true;
      // 模拟恢复过程
      await new Promise(resolve => setTimeout(resolve, 3000));

      ElMessage.success('数据恢复成功');
      return true;
    } catch (error) {
      console.error('恢复备份失败:', error);
      ElMessage.error('恢复失败');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 验证备份
  const verifyBackup = async (backupId: string) => {
    try {
      isLoading.value = true;
      // 模拟验证过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      ElMessage.success('备份验证成功');
      return { valid: true, details: '备份文件完整有效' };
    } catch (error) {
      console.error('验证备份失败:', error);
      ElMessage.error('验证失败');
      return { valid: false, error: String(error) };
    } finally {
      isLoading.value = false;
    }
  };
  
  // 删除备份记录
  const deleteBackupRecord = async (backupId: string) => {
    try {
      await ElMessageBox.confirm(
        '确定要删除此备份记录吗？此操作不可撤销。',
        '确认删除',
        { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
      );
      
      isLoading.value = true;
      await axios.delete(`/api/backup/records/${backupId}`);
      backupRecords.value = backupRecords.value.filter(r => r.id !== backupId);
      extractRestorePoints(); // 更新恢复点
      ElMessage.success('备份记录已删除');
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除备份记录失败:', error);
        ElMessage.error('删除备份记录失败');
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  // 初始化加载数据
  onMounted(async () => {
    try {
      // 设置短暂延迟后将loading设为false，确保UI显示
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    } catch (error) {
      console.error('初始化备份数据失败:', error);
      isLoading.value = false;
    }
  });
  
  return {
    backupConfigs,
    backupRecords,
    restorePoints,
    currentBackup,
    isLoading,
    isBackupRunning,
    fetchBackupConfigs,
    fetchBackupRecords,
    saveBackupConfig,
    deleteBackupConfig,
    runManualBackup,
    executeManualBackup,
    performRestore,
    deleteBackupRecord,
    checkBackupStatus,
    verifyBackup
  };
});