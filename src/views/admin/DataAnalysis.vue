<template>
  <div class="data-analysis">
    <div class="page-header">
      <h1 class="page-title">数据统计分析</h1>
      <p class="page-description">系统数据统计与分析中心，帮助您全面了解平台运行状况</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <!-- 医生数据 -->
      <el-card class="stat-card-blue">
        <div class="card-header-section">
          <div class="stat-icon-section">
            <div class="icon-box-blue">
              <el-icon :size="24"><UserFilled /></el-icon>
            </div>
            <div>
              <h3 class="stat-title">医生数据统计</h3>
              <p class="stat-subtitle">医生数据统计与趋势分析</p>
            </div>
          </div>
        </div>
        <div class="stat-numbers">
          <div class="stat-item">
            <div class="stat-label-row">
              <span class="stat-label">医生总数</span>
              <span class="stat-change positive">↑ +15.2%</span>
            </div>
            <div class="stat-value">128</div>
          </div>
          <div class="stat-item">
            <div class="stat-label-row">
              <span class="stat-label">本月活跃医生</span>
              <span class="stat-change positive">↑ +8.7%</span>
            </div>
            <div class="stat-value">86</div>
          </div>
          <div class="stat-item">
            <div class="stat-label-row">
              <span class="stat-label">医生平均接诊数</span>
              <span class="stat-change negative">↓ -1.3%</span>
            </div>
            <div class="stat-value">42.8</div>
          </div>
        </div>
        <div class="card-footer">
          <div class="mini-chart">图表区域</div>
          <el-button type="primary" @click="router.push('/dashboard/admin/doctor-data')">
            查看医生数据详情
          </el-button>
        </div>
      </el-card>

      <!-- 患者数据 -->
      <el-card class="stat-card-green">
        <div class="card-header-section">
          <div class="stat-icon-section">
            <div class="icon-box-green">
              <el-icon :size="24"><User /></el-icon>
            </div>
            <div>
              <h3 class="stat-title">患者数据统计</h3>
              <p class="stat-subtitle">患者基础与检查量分析</p>
            </div>
          </div>
        </div>
        <div class="stat-numbers">
          <div class="stat-item">
            <div class="stat-label-row">
              <span class="stat-label">患者总数</span>
              <span class="stat-change positive">↑ +12.5%</span>
            </div>
            <div class="stat-value">1,158</div>
          </div>
          <div class="stat-item">
            <div class="stat-label-row">
              <span class="stat-label">本月新增患者</span>
              <span class="stat-change positive">↑ +18.3%</span>
            </div>
            <div class="stat-value">146</div>
          </div>
          <div class="stat-item">
            <div class="stat-label-row">
              <span class="stat-label">累计诊疗总量</span>
              <span class="stat-change positive">↑ +8.7%</span>
            </div>
            <div class="stat-value">4,327</div>
          </div>
        </div>
        <div class="card-footer">
          <div class="mini-chart">图表区域</div>
          <el-button type="primary" @click="router.push('/dashboard/admin/patient-data')">
            查看患者数据详情
          </el-button>
        </div>
      </el-card>

      <!-- 反馈数据 -->
      <el-card class="stat-card-purple">
        <div class="card-header-section">
          <div class="stat-icon-section">
            <div class="icon-box-purple">
              <el-icon :size="24"><ChatDotRound /></el-icon>
            </div>
            <div>
              <h3 class="stat-title">反馈数据统计</h3>
              <p class="stat-subtitle">用户反馈与满意度分析</p>
            </div>
          </div>
        </div>
        <div class="stat-numbers">
          <div class="stat-item">
            <div class="stat-label-row">
              <span class="stat-label">总反馈量</span>
              <span class="stat-change positive">↑ +7.8%</span>
            </div>
            <div class="stat-value">326</div>
          </div>
          <div class="stat-item">
            <div class="stat-label-row">
              <span class="stat-label">平均满意度</span>
              <span class="stat-change positive">↑ +0.2</span>
            </div>
            <div class="stat-value">4.7/5.0</div>
          </div>
          <div class="stat-item">
            <div class="stat-label-row">
              <span class="stat-label">待处理反馈</span>
              <span class="stat-change negative">↑ +8.0%</span>
            </div>
            <div class="stat-value">287</div>
          </div>
        </div>
        <div class="card-footer">
          <div class="mini-chart">图表区域</div>
          <el-button type="primary" @click="router.push('/dashboard/admin/feedback-data')">
            查看反馈数据详情
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { UserFilled, User, ChatDotRound } from '@element-plus/icons-vue'

const router = useRouter()
</script>

<style scoped>
.data-analysis {
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.stat-card-blue {
  background: #eff6ff;
  border-radius: 12px;
  border: 1px solid #bfdbfe;
}

.stat-card-green {
  background: #f0fdf4;
  border-radius: 12px;
  border: 1px solid #bbf7d0;
}

.stat-card-purple {
  background: #faf5ff;
  border-radius: 12px;
  border: 1px solid #e9d5ff;
}

.card-header-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.stat-icon-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-box-blue {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-box-green {
  width: 48px;
  height: 48px;
  background: #22c55e;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-box-purple {
  width: 48px;
  height: 48px;
  background: #a855f7;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
}

.stat-numbers {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mini-chart {
  height: 120px;
  background: rgba(255,255,255,0.6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}
</style>

