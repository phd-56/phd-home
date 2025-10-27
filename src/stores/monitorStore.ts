import { defineStore } from 'pinia';
import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import axios from '@/utils/axios';

// 系统资源类型定义
interface SystemResource {
  cpu: number;          // CPU使用率(%)
  memory: number;       // 内存使用率(%)
  disk: number;         // 磁盘使用率(%)
  network: {            // 网络流量(Mbps)
    in: number;
    out: number;
  };
  timestamp: string;    // 数据时间戳
}

// 告警规则类型定义
interface AlarmRule {
  id: string;
  resource: 'cpu' | 'memory' | 'disk' | 'network';
  threshold: number;    // 告警阈值(%)
  operator: 'gt' | 'lt' | 'gte' | 'lte'; // 比较运算符
  notificationMethods: ('email' | 'sms' | 'system')[]; // 通知方式
  isEnabled: boolean;   // 是否启用
}

// 告警记录类型定义
interface AlarmRecord {
  id: string;
  resource: string;
  message: string;
  level: 'info' | 'warning' | 'error';
  timestamp: string;
  status: 'unhandled' | 'handled';
}

export const useMonitorStore = defineStore('monitor', () => {
  // 状态变量
  const resources = ref<SystemResource[]>([]);
  const currentResource = ref<SystemResource>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: { in: 0, out: 0 },
    timestamp: ''
  });
  const alarmRules = ref<AlarmRule[]>([]);
  const alarmRecords = ref<AlarmRecord[]>([]);
  const isLoading = ref(false);
  const isMonitoring = ref(false);
  
  // 获取系统资源数据
  const fetchResources = async () => {
    try {
      isLoading.value = true;
      const response = await axios.get('/api/monitoring/resources');
      const data = (response as any).data || {};
      // 确保数据结构完整，添加默认值避免undefined错误
      currentResource.value = {
        cpu: data.cpu || 0,
        memory: data.memory || 0,
        disk: data.disk || 0,
        network: data.network || { in: 0, out: 0 },
        timestamp: data.timestamp || new Date().toISOString()
      };
      // 保留最近30条记录用于趋势图表
      if (resources.value.length >= 30) {
        resources.value.shift();
      }
      resources.value.push(currentResource.value);
      
      // 检查是否触发告警
      checkAlarms(currentResource.value);
    } catch (error) {
      console.error('获取系统资源失败:', error);
      ElMessage.error('无法获取系统资源数据');
      // 在错误情况下提供默认资源数据，避免页面崩溃
      const defaultResource: SystemResource = {
        cpu: 0,
        memory: 0,
        disk: 0,
        network: { in: 0, out: 0 },
        timestamp: new Date().toISOString()
      };
      currentResource.value = defaultResource;
      if (resources.value.length >= 30) {
        resources.value.shift();
      }
      resources.value.push(defaultResource);
    } finally {
      isLoading.value = false;
    }
  };
  
  // 获取告警规则
  const fetchAlarmRules = async () => {
    try {
      const response = await axios.get('/api/monitoring/alarm-rules');
      alarmRules.value = (response as any).data;
    } catch (error) {
      console.error('获取告警规则失败:', error);
      ElMessage.error('无法加载告警规则');
    }
  };
  
  // 获取告警记录
  const fetchAlarmRecords = async () => {
    try {
      const response = await axios.get('/api/monitoring/alarms');
      alarmRecords.value = (response as any).data;
    } catch (error) {
      console.error('获取告警记录失败:', error);
      ElMessage.error('无法加载告警历史');
    }
  };
  
  // 检查是否触发告警
  const checkAlarms = (resource: SystemResource) => {
    alarmRules.value.forEach(rule => {
      if (!rule.isEnabled) return;
      
      let value: number;
      switch (rule.resource) {
        case 'cpu':
          value = resource.cpu;
          break;
        case 'memory':
          value = resource.memory;
          break;
        case 'disk':
          value = resource.disk;
          break;
        case 'network':
          value = resource.network.in; // 以入站流量为例
          break;
        default:
          return;
      }
      
      // 根据运算符判断是否触发告警
      let isTriggered = false;
      switch (rule.operator) {
        case 'gt':
          isTriggered = value > rule.threshold;
          break;
        case 'lt':
          isTriggered = value < rule.threshold;
          break;
        case 'gte':
          isTriggered = value >= rule.threshold;
          break;
        case 'lte':
          isTriggered = value <= rule.threshold;
          break;
      }
      
      // 如果触发告警，添加到告警记录
      if (isTriggered) {
        const newAlarm: AlarmRecord = {
          id: Date.now().toString(),
          resource: rule.resource,
          message: `${rule.resource} usage ${rule.operator} ${rule.threshold}% (current: ${value}%)`,
          level: 'warning',
          timestamp: new Date().toISOString(),
          status: 'unhandled'
        };
        alarmRecords.value.unshift(newAlarm);
        
        // 限制告警记录数量为50条
        if (alarmRecords.value.length > 50) {
          alarmRecords.value = alarmRecords.value.slice(0, 50);
        }
        
        ElMessage.warning(newAlarm.message);
        
        // 发送通知
        sendNotifications(rule, newAlarm);
      }
    });
  };
  
  // 发送通知
  const sendNotifications = (rule: AlarmRule, alarm: AlarmRecord) => {
    rule.notificationMethods.forEach(method => {
      switch (method) {
        case 'system':
          console.log('系统通知:', alarm.message);
          break;
        case 'email':
          console.log('邮件通知:', alarm.message);
          break;
        case 'sms':
          console.log('短信通知:', alarm.message);
          break;
      }
    });
  };
  
  // 保存告警规则
  const saveAlarmRules = async () => {
    try {
      await axios.put('/api/monitoring/alarm-rules', alarmRules.value) as any;
      ElMessage.success('告警规则保存成功');
    } catch (error) {
      console.error('保存告警规则失败:', error);
      ElMessage.error('保存告警规则失败，请重试');
    }
  };
  
  // 添加告警规则（兼容方法）
  const addAlarmRule = async (ruleData: Partial<AlarmRule>) => {
    try {
      const newRule = {
        ...ruleData,
        id: Date.now().toString(),
        isEnabled: true
      } as AlarmRule;
      
      alarmRules.value.push(newRule);
      await saveAlarmRules();
      return newRule;
    } catch (error) {
      console.error('添加告警规则失败:', error);
      ElMessage.error('添加告警规则失败');
      throw error;
    }
  };
  
  // 更新告警规则（兼容方法）
  const updateAlarmRule = async (id: string, updatedData: Partial<AlarmRule>) => {
    try {
      const index = alarmRules.value.findIndex(rule => rule.id === id);
      if (index !== -1) {
        alarmRules.value[index] = { ...alarmRules.value[index], ...updatedData };
        await saveAlarmRules();
        return alarmRules.value[index];
      }
      throw new Error('告警规则不存在');
    } catch (error) {
      console.error('更新告警规则失败:', error);
      ElMessage.error('更新告警规则失败');
      throw error;
    }
  };
  
  // 删除告警规则（兼容方法）
  const deleteAlarmRule = async (id: string) => {
    try {
      const index = alarmRules.value.findIndex(rule => rule.id === id);
      if (index !== -1) {
        alarmRules.value.splice(index, 1);
        await saveAlarmRules();
        return true;
      }
      throw new Error('告警规则不存在');
    } catch (error) {
      console.error('删除告警规则失败:', error);
      ElMessage.error('删除告警规则失败');
      throw error;
    }
  };
  
  // 处理告警
  const handleAlarm = async (alarmId: string) => {
    try {
      await axios.patch(`/api/monitoring/alarms/${alarmId}`, {
        status: 'handled'
      }) as any;
      const alarm = alarmRecords.value.find(a => a.id === alarmId);
      if (alarm) {
        alarm.status = 'handled';
      }
    } catch (error) {
      console.error('处理告警失败:', error);
      ElMessage.error('处理告警失败');
    }
  };
  
  // 启动/停止监控
  const toggleMonitoring = (start?: boolean) => {
    // 如果没有传入参数，则切换当前状态
    const newState = start !== undefined ? start : !isMonitoring.value;
    
    if (newState && !isMonitoring.value) {
      isMonitoring.value = true;
      fetchResources(); // 立即获取一次
      // 设置定时器，每5秒获取一次数据
      const intervalId = setInterval(fetchResources, 5000);
      
      // 保存定时器ID以便后续清除
      localStorage.setItem('monitorIntervalId', intervalId.toString());
    } else if (!newState && isMonitoring.value) {
      isMonitoring.value = false;
      const intervalId = localStorage.getItem('monitorIntervalId');
      if (intervalId) {
        clearInterval(parseInt(intervalId));
        localStorage.removeItem('monitorIntervalId');
      }
    }
  };
  
  // 初始化时加载数据
  onMounted(() => {
    fetchAlarmRules();
    fetchAlarmRecords();
    
    // 如果页面刷新，恢复监控状态
    if (localStorage.getItem('monitorIntervalId')) {
      toggleMonitoring(true);
    }
  });
  
  return {
    resources,
    currentResource,
    alarmRules,
    alarmRecords,
    isLoading,
    isMonitoring,
    fetchResources,
    fetchAlarmRules,
    fetchAlarmRecords,
    saveAlarmRules,
    handleAlarm,
    toggleMonitoring,
    checkAlarms,
    addAlarmRule,
    updateAlarmRule,
    deleteAlarmRule,
    sendNotifications
  };
});