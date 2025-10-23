<template>
  <div class="system-monitor-page">
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
        <h1>系统监控</h1>
      </div>
      <div class="header-actions">
        <el-switch 
          v-model="isMonitoring" 
          :active-value="true" 
          :inactive-value="false"
          @change="toggleMonitoring"
        />
        <span class="ml-2">{{ isMonitoring ? '监控中' : '已停止' }}</span>
        <el-button 
          type="primary" 
          size="small" 
          class="ml-4"
          @click="gotoAlarmSettings"
        >
          <el-icon><setting /></el-icon>
          告警设置
        </el-button>
      </div>
    </div>
    
    <el-card v-loading="isLoading" class="status-card">
      <div class="resource-overview">
        <h2>资源概览</h2>
        <div class="resource-grid">
          <!-- CPU使用率 -->
          <ResourceMeter 
            title="CPU使用率" 
            :value="currentResource.cpu" 
            unit="%" 
            :threshold="cpuThreshold"
            :color="getColor(currentResource.cpu)"
          />
          
          <!-- 内存使用率 -->
          <ResourceMeter 
            title="内存使用率" 
            :value="currentResource.memory" 
            unit="%" 
            :threshold="memoryThreshold"
            :color="getColor(currentResource.memory)"
          />
          
          <!-- 磁盘使用率 -->
          <ResourceMeter 
            title="磁盘使用率" 
            :value="currentResource.disk" 
            unit="%" 
            :threshold="diskThreshold"
            :color="getColor(currentResource.disk)"
          />
          
          <!-- 网络流量 -->
          <ResourceMeter 
            title="网络入站" 
            :value="currentResource?.network?.in || 0" 
            unit="Mbps" 
            :threshold="networkThreshold"
            :color="getColor(currentResource?.network?.in || 0)"
          />
        </div>
      </div>
      
      <!-- 资源趋势图表 -->
      <div class="resource-trends">
        <h2>资源趋势 (最近30分钟)</h2>
        <el-tabs v-model="activeChartTab">
          <el-tab-pane label="CPU" name="cpu">
            <ResourceChart 
              :data="resources" 
              resource="cpu" 
              title="CPU使用率趋势" 
              unit="%"
            />
          </el-tab-pane>
          <el-tab-pane label="内存" name="memory">
            <ResourceChart 
              :data="resources" 
              resource="memory" 
              title="内存使用率趋势" 
              unit="%"
            />
          </el-tab-pane>
          <el-tab-pane label="磁盘" name="disk">
            <ResourceChart 
              :data="resources" 
              resource="disk" 
              title="磁盘使用率趋势" 
              unit="%"
            />
          </el-tab-pane>
          <el-tab-pane label="网络" name="network">
            <ResourceChart 
              :data="resources" 
              resource="network" 
              title="网络流量趋势" 
              unit="Mbps"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <!-- 最近告警 -->
      <div class="recent-alarms">
        <h2>最近告警 <span class="text-red-500">({{ unhandledCount }})</span></h2>
        <el-table :data="recentAlarms" stripe>
          <el-table-column prop="timestamp" label="时间" width="180" />
          <el-table-column prop="resource" label="资源类型" width="100" />
          <el-table-column prop="message" label="告警信息" />
          <el-table-column prop="level" label="级别" width="80">
            <template #default="scope">
              <el-tag 
                :type="scope.row.level === 'error' ? 'danger' : 
                      scope.row.level === 'warning' ? 'warning' : 'info'"
              >
                {{ scope.row.level === 'error' ? '错误' : 
                  scope.row.level === 'warning' ? '警告' : '信息' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button 
                v-if="scope.row.status === 'unhandled'"
                type="text" 
                size="small"
                @click="handleAlarm(scope.row.id)"
              >
                处理
              </el-button>
              <span v-else class="text-gray-500">已处理</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="text-right mt-2">
          <el-button type="text" @click="viewAllAlarms">查看全部告警</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useMonitorStore } from '@/stores/monitorStore';
import ResourceMeter from '@/components/admin/ResourceMeter.vue';
import ResourceChart from '@/components/admin/ResourceChart.vue';
import { Setting } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// 状态和路由
const router = useRouter();
const monitorStore = useMonitorStore();
const activeChartTab = ref('cpu');
const isMonitoring = computed(() => monitorStore.isMonitoring);

// 返回用户管理页面
const goBack = () => {
  router.push('/dashboard/admin/user-management');
};
const isLoading = computed(() => monitorStore.isLoading);
const currentResource = computed(() => monitorStore.currentResource);
const resources = computed(() => monitorStore.resources);

// 从告警规则中获取各资源阈值
const cpuThreshold = computed(() => {
  return monitorStore.alarmRules.find(rule => rule.resource === 'cpu')?.threshold || 80;
});

const memoryThreshold = computed(() => {
  return monitorStore.alarmRules.find(rule => rule.resource === 'memory')?.threshold || 85;
});

const diskThreshold = computed(() => {
  return monitorStore.alarmRules.find(rule => rule.resource === 'disk')?.threshold || 90;
});

const networkThreshold = computed(() => {
  return monitorStore.alarmRules.find(rule => rule.resource === 'network')?.threshold || 50;
});

// 未处理告警数量
const unhandledCount = computed(() => {
  return monitorStore.alarmRecords.filter(alarm => alarm.status === 'unhandled').length;
});

// 最近5条告警
const recentAlarms = computed(() => {
  return monitorStore.alarmRecords.slice(0, 5);
});

// 根据资源使用率获取颜色
const getColor = (value: number) => {
  if (value > 80) return '#f56c6c'; // 红色
  if (value > 60) return '#e6a23c'; // 橙色
  return '#67c23a'; // 绿色
};

// 方法
const toggleMonitoring = (value: boolean) => {
  monitorStore.toggleMonitoring(value);
};

const gotoAlarmSettings = () => {
  router.push('/admin/alarm-settings');
};

const viewAllAlarms = () => {
  router.push('/admin/alarms');
};

// 处理告警
const handleAlarm = async (alarmId: string) => {
  try {
    await monitorStore.handleAlarm(alarmId);
    ElMessage.success('告警处理成功');
  } catch (error) {
    console.error('处理告警失败:', error);
  }
};

// 暴露给模板的属性和方法
defineExpose({
  isMonitoring,
  toggleMonitoring,
  handleAlarm
});
</script>

<style scoped>
.system-monitor-page {
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
  align-items: center;
}

.resource-overview {
  margin-bottom: 30px;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.resource-trends {
  margin-top: 30px;
}

.recent-alarms {
  margin-top: 20px;
}
</style>