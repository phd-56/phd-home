<template>
  <div class="model-performance-page">
    <div class="page-header">
      <h1>模型性能指标</h1>
      <div class="header-actions">
        <el-select v-model="modelVersion" placeholder="选择模型版本">
          <el-option
            v-for="version in modelVersions"
            :key="version.value"
            :label="version.label"
            :value="version.value"
          />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="margin-left: 10px;"
        />
        <el-button
          type="primary"
          style="margin-left: 10px;"
          @click="refreshData"
        >
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <el-card>
      <div class="performance-metrics">
        <div class="metric-card">
          <div class="metric-title">诊断准确率</div>
          <div class="metric-value">{{ accuracy }}%</div>
          <div class="metric-trend" :class="accuracyTrend > 0 ? 'up' : 'down'">
            <el-icon v-if="accuracyTrend > 0"><CaretTop /></el-icon>
            <el-icon v-else><CaretBottom /></el-icon>
            {{ Math.abs(accuracyTrend) }}%
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-title">治疗建议采纳率</div>
          <div class="metric-value">{{ adoptionRate }}%</div>
          <div class="metric-trend" :class="adoptionRateTrend > 0 ? 'up' : 'down'">
            <el-icon v-if="adoptionRateTrend > 0"><CaretTop /></el-icon>
            <el-icon v-else><CaretBottom /></el-icon>
            {{ Math.abs(adoptionRateTrend) }}%
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-title">医生满意度</div>
          <div class="metric-value">{{ satisfaction }}/5</div>
          <div class="metric-trend" :class="satisfactionTrend > 0 ? 'up' : 'down'">
            <el-icon v-if="satisfactionTrend > 0"><CaretTop /></el-icon>
            <el-icon v-else><CaretBottom /></el-icon>
            {{ Math.abs(satisfactionTrend).toFixed(1) }}
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-title">反馈解决率</div>
          <div class="metric-value">{{ resolutionRate }}%</div>
          <div class="metric-trend" :class="resolutionRateTrend > 0 ? 'up' : 'down'">
            <el-icon v-if="resolutionRateTrend > 0"><CaretTop /></el-icon>
            <el-icon v-else><CaretBottom /></el-icon>
            {{ Math.abs(resolutionRateTrend) }}%
          </div>
        </div>
      </div>

      <div class="chart-container">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="诊断准确率趋势" name="accuracy">
            <div class="chart-wrapper">
              <line-chart
                :data="accuracyData"
                :title="'诊断准确率趋势'"
                :y-label="'准确率(%)'"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="满意度评分趋势" name="satisfaction">
            <div class="chart-wrapper">
              <line-chart
                :data="satisfactionData"
                :title="'医生满意度评分趋势'"
                :y-label="'评分(1-5)'"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="反馈标签分布" name="feedbackTags">
            <div class="chart-wrapper">
              <pie-chart
                :data="tagDistributionData"
                :title="'反馈标签分布'"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="优化效果对比" name="optimization">
            <div class="chart-wrapper">
              <bar-chart
                :data="optimizationComparisonData"
                :title="'模型迭代优化效果对比'"
                :y-label="'提升率(%)'"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useFeedbackStore } from '@/stores/feedbackStore';
import { Refresh, CaretTop, CaretBottom } from '@element-plus/icons-vue';
import LineChart from '@/components/admin/charts/LineChart.vue';
import PieChart from '@/components/admin/charts/PieChart.vue';
import BarChart from '@/components/admin/charts/BarChart.vue';

// 状态管理
const feedbackStore = useFeedbackStore();
const modelVersion = ref('latest');
const dateRange = ref([]);
const activeTab = ref('accuracy');
const isLoading = ref(false);

// 模拟性能指标数据 - 实际应从store获取
const accuracy = ref(89.5);
const accuracyTrend = ref(2.3);
const adoptionRate = ref(76.8);
const adoptionRateTrend = ref(-1.2);
const satisfaction = ref(4.2);
const satisfactionTrend = ref(0.5);
const resolutionRate = ref(68.3);
const resolutionRateTrend = ref(5.7);

// 模拟图表数据
const accuracyData = ref([
  { date: '1月', value: 82.3 },
  { date: '2月', value: 83.5 },
  { date: '3月', value: 85.1 },
  { date: '4月', value: 84.8 },
  { date: '5月', value: 86.7 },
  { date: '6月', value: 89.5 }
]);

const satisfactionData = ref([
  { date: '1月', value: 3.5 },
  { date: '2月', value: 3.6 },
  { date: '3月', value: 3.8 },
  { date: '4月', value: 4.0 },
  { date: '5月', value: 4.1 },
  { date: '6月', value: 4.2 }
]);

const tagDistributionData = ref([
  { name: '诊断准确性', value: 35 },
  { name: '治疗建议合理性', value: 25 },
  { name: '病例分析深度', value: 20 },
  { name: '用户体验', value: 10 },
  { name: '界面设计', value: 5 },
  { name: '其他', value: 5 }
]);

const optimizationComparisonData = ref([
  { name: '诊断准确性', v1: 0, v2: 2.1, v3: 3.5 },
  { name: '治疗合理性', v1: 0, v2: 1.8, v3: 2.9 },
  { name: '分析深度', v1: 0, v2: 3.2, v3: 4.1 },
  { name: '用户满意度', v1: 0, v2: 0.3, v3: 0.5 }
]);

const modelVersions = ref([
  { value: 'latest', label: '最新版本' },
  { value: 'v2.1.0', label: 'v2.1.0' },
  { value: 'v2.0.0', label: 'v2.0.0' },
  { value: 'v1.2.0', label: 'v1.2.0' }
]);

// 方法
const refreshData = async () => {
  isLoading.value = true;
  try {
    await feedbackStore.fetchPerformanceMetrics(modelVersion.value, dateRange.value);
  } catch (error) {
    console.error('刷新数据失败:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  refreshData();
});
</script>

<style scoped>
.performance-metrics {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  flex: 1;
  min-width: 200px;
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.metric-title {
  font-size: 16px;
  color: #606266;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
}

.metric-trend {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.up {
  color: #52c41a;
}

.down {
  color: #f5222d;
}

.chart-container {
  margin-top: 30px;
}

.chart-wrapper {
  height: 400px;
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
}
</style>