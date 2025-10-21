// 基础axios mock实现，用于提供模拟数据
class MockAxios {
  private mockData: any = {};
  
  constructor() {
    this.initMockData();
  }
  
  private initMockData() {
    // 初始化模拟数据
    this.mockData = {
      // 系统监控数据
      '/api/monitoring/resources': {
        data: [
          { cpu: 65.2, memory: 72.8, disk: 58.5, network: { in: 23.5, out: 12.8 }, timestamp: new Date().toISOString() },
          { cpu: 63.1, memory: 71.5, disk: 58.5, network: { in: 22.1, out: 11.9 }, timestamp: new Date(Date.now() - 60000).toISOString() },
          { cpu: 67.8, memory: 73.2, disk: 58.5, network: { in: 24.7, out: 13.5 }, timestamp: new Date(Date.now() - 120000).toISOString() },
        ]
      },
      '/api/monitoring/alarm-rules': {
        data: [
          { id: '1', resource: 'cpu', threshold: 80, operator: 'gt', notificationMethods: ['system'], isEnabled: true },
          { id: '2', resource: 'memory', threshold: 85, operator: 'gt', notificationMethods: ['system'], isEnabled: true },
          { id: '3', resource: 'disk', threshold: 90, operator: 'gt', notificationMethods: ['system'], isEnabled: true },
          { id: '4', resource: 'network', threshold: 50, operator: 'gt', notificationMethods: ['system'], isEnabled: true },
        ]
      },
      '/api/monitoring/alarms': {
        data: [
          { id: '1', resource: 'cpu', message: 'CPU使用率过高', level: 'warning', timestamp: new Date().toISOString(), status: 'unhandled' },
        ]
      },
      // 备份数据
      '/api/backup/configs': {
        data: [
          { id: '1', name: '每日完整备份', type: 'full', schedule: { frequency: 'daily', time: '02:00' }, isEnabled: true },
        ]
      },
      '/api/backup/records': {
        data: [
          { id: '1', configId: '1', startTime: new Date().toISOString(), endTime: new Date().toISOString(), status: 'success', size: '512MB' },
        ]
      },
      // 审计日志数据
      '/api/audit/logs': {
        data: {
          logs: [
            { id: '1', timestamp: new Date().toISOString(), user: 'admin_wang', ip: '127.0.0.1', action: 'login', module: '认证', details: '用户登录成功' },
          ],
          total: 1
        }
      },
      '/api/audit/anomaly-rules': {
        data: []
      }
    };
  }
  
  private getMockResponse(url: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockData[url] || { data: null });
      }, 300);
    });
  }
  
  async get(url: string, options?: any) {
    return this.getMockResponse(url);
  }
  
  async post(url: string, data?: any, options?: any) {
    return this.getMockResponse(url);
  }
  
  async put(url: string, data?: any, options?: any) {
    return this.getMockResponse(url);
  }
  
  async delete(url: string, options?: any) {
    return this.getMockResponse(url);
  }
  
  async patch(url: string, data?: any, options?: any) {
    return this.getMockResponse(url);
  }
}

export default new MockAxios();