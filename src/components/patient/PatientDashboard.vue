<template>
  <div class="patient-dashboard">
    <h2>患者工作台</h2>
    <p>欢迎回来！这里是您的个人健康管理中心。</p>
    
    <!-- 快速导航卡片 -->
    <div class="quick-nav">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="nav-card" @click="navigateTo('images')">
            <div class="card-content">
              <div class="card-icon">🖼️</div>
              <h3>我的影像</h3>
              <p>查看和管理医学影像</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="nav-card" @click="navigateTo('diagnosis')">
            <div class="card-content">
              <div class="card-icon">📋</div>
              <h3>我的诊断</h3>
              <p>查看诊断结果和历史</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="nav-card" @click="navigateTo('reports')">
            <div class="card-content">
              <div class="card-icon">📄</div>
              <h3>我的报告</h3>
              <p>查看和下载医疗报告</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="nav-card" @click="navigateTo('profile')">
            <div class="card-content">
              <div class="card-icon">👤</div>
              <h3>个人资料</h3>
              <p>管理个人信息</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 健康概览 -->
    <div class="health-overview">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>健康概览</span>
          </div>
        </template>
        <div class="health-stats">
          <div class="stat-item">
            <div class="stat-value">5</div>
            <div class="stat-label">影像文件</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">3</div>
            <div class="stat-label">诊断记录</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">2</div>
            <div class="stat-label">待处理</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">95%</div>
            <div class="stat-label">健康状况</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activity">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>最近活动</span>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item timestamp="2024-01-15" placement="top">
            <el-card>
              <h4>新的诊断报告</h4>
              <p>膝关节MRI检查已完成，AI分析结果显示轻度骨关节炎。</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2024-01-10" placement="top">
            <el-card>
              <h4>影像上传</h4>
              <p>成功上传了新的MRI影像文件。</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2024-01-05" placement="top">
            <el-card>
              <h4>预约提醒</h4>
              <p>下次复诊时间：2024年2月1日。</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (page: string) => {
  router.push(`/patient/${page}`)
}
</script>

<style scoped>
.patient-dashboard {
  padding: 20px;
}

.quick-nav {
  margin: 20px 0;
}

.nav-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 140px;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-content {
  text-align: center;
  padding: 20px 0;
}

.card-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.card-content h3 {
  margin: 10px 0 5px 0;
  color: #333;
}

.card-content p {
  color: #666;
  font-size: 0.9em;
}

.health-overview {
  margin: 30px 0;
}

.health-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item {
  padding: 10px;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9em;
}

.recent-activity {
  margin: 30px 0;
}

.card-header {
  font-weight: bold;
  font-size: 1.1em;
}
</style>