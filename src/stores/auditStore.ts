import { defineStore } from 'pinia';
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from '@/utils/axios';
// 使用window对象访问XLSX，避免模块导入问题
const XLSX = (window as any).XLSX || {};

// 审计日志类型定义
interface AuditLog {
  id: string;
  userId: string;
  username: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  details: Record<string, any>;
  isAnomaly: boolean;
  anomalyScore: number;
}

// 日志查询参数类型
interface LogQueryParams {
  userId?: string;
  username?: string;
  action?: string;
  resourceType?: string;
  startTime?: string;
  endTime?: string;
  isAnomaly?: boolean;
  page: number;
  pageSize: number;
}

// 异常规则类型
interface AnomalyRule {
  id: string;
  name: string;
  description: string;
  conditions: any[];
  threshold: number;
  isEnabled: boolean;
}

export const useAuditStore = defineStore('audit', () => {
  // 状态变量
  const logs = ref<AuditLog[]>([]);
  const totalLogs = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const isLoading = ref(false);
  const anomalyRules = ref<AnomalyRule[]>([]);
  const queryParams = ref<LogQueryParams>({
    page: 1,
    pageSize: 10
  });
  
  // 获取审计日志列表
  const fetchAuditLogs = async () => {
    try {
      isLoading.value = true;
      
      // 构建查询参数
      const params = { ...queryParams.value };
      if (params.startTime) params.startTime = new Date(params.startTime).toISOString();
      if (params.endTime) params.endTime = new Date(params.endTime).toISOString();
      
      const response = await axios.get('/api/audit/logs', { params });
      logs.value = (response as any).data.items;
      totalLogs.value = (response as any).data.total;
    } catch (error) {
      console.error('获取审计日志失败:', error);
      ElMessage.error('无法加载审计日志');
    } finally {
      isLoading.value = false;
    }
  };

  // 识别异常操作
  const identifyAnomalies = () => {
    const currentTime = new Date();
    const timeWindow = 60 * 60 * 1000; // 1小时内
    const recentLogs = logs.value.filter(log => 
      currentTime.getTime() - new Date(log.timestamp).getTime() < timeWindow
    );
    
    // 规则1: 短时间内多次失败登录尝试
    const failedLogins = recentLogs.filter(log => 
      log.action === 'login' && !log.details.success
    );
    
    if (failedLogins.length >= 5) {
      failedLogins.forEach(log => {
        log.isAnomaly = true;
        log.details.anomalyType = 'multiple_failed_logins';
        log.anomalyScore = 90;
      });
    }
    
    // 规则2: 敏感操作在非工作时间进行
    const sensitiveActions = ['delete', 'modify_permissions', 'change_password', 'backup', 'restore'];
    recentLogs.forEach(log => {
      if (sensitiveActions.includes(log.action)) {
        const hour = new Date(log.timestamp).getHours();
        if (hour < 8 || hour > 18) {
          log.isAnomaly = true;
          log.details.anomalyType = 'off_hours_sensitive_action';
          log.anomalyScore = 70;
        }
      }
    });
    
    // 规则3: 同一IP访问多个不同账号
    const ipAccountMap = new Map<string, Set<string>>();
    recentLogs.forEach(log => {
      if (!ipAccountMap.has(log.ipAddress)) {
        ipAccountMap.set(log.ipAddress, new Set());
      }
      ipAccountMap.get(log.ipAddress)!.add(log.userId);
    });
    
    ipAccountMap.forEach((accounts, ip) => {
      if (accounts.size > 3) {
        recentLogs
          .filter(log => log.ipAddress === ip)
          .forEach(log => {
            log.isAnomaly = true;
            log.details.anomalyType = 'multiple_accounts_same_ip';
            log.anomalyScore = 80;
          });
      }
    });
    
    return logs.value.filter(log => log.isAnomaly);
  };

  // 获取统计信息
  const getAuditStatistics = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = logs.value.filter(log => 
      new Date(log.timestamp) >= today
    );
    
    const stats = {
      totalLogs: logs.value.length,
      todayLogs: todayLogs.length,
      failedActions: todayLogs.filter(log => log.details && !log.details.success).length,
      anomalies: logs.value.filter(log => log.isAnomaly).length,
      actionTypeDistribution: {} as Record<string, number>
    };
    
    // 统计各操作类型分布
    todayLogs.forEach(log => {
      stats.actionTypeDistribution[log.action] = 
        (stats.actionTypeDistribution[log.action] || 0) + 1;
    });
    
    return stats;
  };

  // 生成操作报告
  const generateOperationReport = async () => {
    try {
      isLoading.value = true;
      
      const report = {
        generatedAt: new Date().toISOString(),
        timeRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        },
        statistics: getAuditStatistics(),
        topAnomalies: logs.value
          .filter(log => log.isAnomaly)
          .sort((a, b) => b.anomalyScore - a.anomalyScore)
          .slice(0, 10),
        userActivity: {} as Record<string, { total: number; failed: number; anomalies: number }>
      };
      
      ElMessage.success('操作报告生成成功');
      return report;
    } catch (error) {
      console.error('生成操作报告失败:', error);
      ElMessage.error('报告生成失败');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };
  
  // 获取异常检测规则
  const fetchAnomalyRules = async () => {
    try {
      const response = await axios.get('/api/audit/anomaly-rules');
      anomalyRules.value = (response as any).data;
    } catch (error) {
      console.error('获取异常规则失败:', error);
      ElMessage.error('无法加载异常检测规则');
    }
  };
  
  // 导出日志
  const exportLogs = async (format: 'csv' | 'xlsx' = 'xlsx') => {
    try {
      isLoading.value = true;
      
      // 构建查询参数（导出全部符合条件的日志，忽略分页）
      const exportParams = { ...queryParams.value };
      (exportParams as any).page = undefined;
      (exportParams as any).pageSize = undefined;
      
      const response = await axios.get('/api/audit/logs/export', { 
        params: exportParams,
        responseType: 'blob'
      });
      
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([(response as any).data]));
      const a = document.createElement('a');
      a.href = url;
      
      // 设置文件名
      const fileName = `audit_logs_${new Date().toISOString().split('T')[0]}.${format}`;
      a.setAttribute('download', fileName);
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      ElMessage.success(`日志已导出为 ${fileName}`);
    } catch (error) {
      console.error('导出日志失败:', error);
      ElMessage.error('日志导出失败，请重试');
    } finally {
      isLoading.value = false;
    }
  };
  
  // 更新查询参数并重新获取日志
  const updateQueryParams = (params: Partial<LogQueryParams>) => {
    queryParams.value = { ...queryParams.value, ...params, page: 1 };
    currentPage.value = 1;
    fetchAuditLogs();
  };
  
  // 分页变更
  const handlePageChange = (page: number, size: number) => {
    currentPage.value = page;
    pageSize.value = size;
    queryParams.value = { ...queryParams.value, page, pageSize: size };
    fetchAuditLogs();
  };
  
  // 重置查询参数
  const resetQueryParams = () => {
    queryParams.value = {
      page: 1,
      pageSize: 10
    };
    currentPage.value = 1;
    fetchAuditLogs();
  };
  
  // 获取日志详情
  const getLogDetails = async (logId: string): Promise<AuditLog | null> => {
    try {
      const response = await axios.get(`/api/audit/logs/${logId}`);
      return (response as any).data;
    } catch (error) {
      console.error(`获取日志 ${logId} 详情失败:`, error);
      ElMessage.error('无法加载日志详情');
      return null;
    }
  };
  
  // 更新异常规则
  const updateAnomalyRule = async (rule: AnomalyRule) => {
    try {
      isLoading.value = true;
      if (rule.id) {
        await axios.put(`/api/audit/anomaly-rules/${rule.id}`, rule);
        ElMessage.success('异常规则更新成功');
      } else {
        await axios.post('/api/audit/anomaly-rules', rule);
        ElMessage.success('异常规则创建成功');
      }
      fetchAnomalyRules();
    } catch (error) {
      console.error('更新异常规则失败:', error);
      ElMessage.error('保存异常规则失败');
    } finally {
      isLoading.value = false;
    }
  };
  
  // 删除异常规则
  const deleteAnomalyRule = async (ruleId: string) => {
    try {
      await ElMessageBox.confirm(
        '确定要删除此异常检测规则吗？',
        '确认删除',
        { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
      );
      
      isLoading.value = true;
      await axios.delete(`/api/audit/anomaly-rules/${ruleId}`);
      anomalyRules.value = anomalyRules.value.filter(rule => rule.id !== ruleId);
      ElMessage.success('异常规则已删除');
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除异常规则失败:', error);
        ElMessage.error('删除异常规则失败');
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  // 标记日志异常状态
  const markLogAnomaly = async (logId: string, isAnomaly: boolean, score?: number) => {
    try {
      isLoading.value = true;
      await axios.patch(`/api/audit/logs/${logId}/anomaly`, { 
        isAnomaly,
        anomalyScore: score || (isAnomaly ? 100 : 0)
      });
      
      // 更新本地日志状态
      const logIndex = logs.value.findIndex(log => log.id === logId);
      if (logIndex !== -1) {
        logs.value[logIndex].isAnomaly = isAnomaly;
        logs.value[logIndex].anomalyScore = score || (isAnomaly ? 100 : 0);
      }
      
      ElMessage.success(`日志已${isAnomaly ? '标记为异常' : '取消异常标记'}`);
    } catch (error) {
      console.error('更新日志异常状态失败:', error);
      ElMessage.error('操作失败，请重试');
    } finally {
      isLoading.value = false;
    }
  };
  
  // 初始化加载数据
  onMounted(() => {
    fetchAuditLogs();
    fetchAnomalyRules();
  });
  
  return {
    logs,
    totalLogs,
    currentPage,
    pageSize,
    isLoading,
    anomalyRules,
    queryParams,
    fetchAuditLogs,
    fetchAnomalyRules,
    exportLogs,
    updateQueryParams,
    handlePageChange,
    resetQueryParams,
    getLogDetails,
    updateAnomalyRule,
    deleteAnomalyRule,
    markLogAnomaly,
    identifyAnomalies,
    getAuditStatistics,
    generateOperationReport
  };
});