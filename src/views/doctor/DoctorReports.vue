<template>
  <div class="doctor-reports-page">
    <div class="page-header">
      <h1>医生报告管理</h1>
      <p>创建新报告或查看历史报告记录</p>
    </div>
    
    <div class="reports-functions">
      <div class="function-card new-report" @click="goToNewReport">
        <div class="card-icon">📝</div>
        <h3>新建报告</h3>
        <p>创建一份新的医学影像诊断报告</p>
      </div>
      
      <div class="function-card report-records" @click="goToReportRecords">
        <div class="card-icon">📋</div>
        <h3>报告记录</h3>
        <p>查看和管理历史报告记录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 跳转到新建报告页面
const goToNewReport = () => {
  // 跳转到新的报告生成页面
  router.push({ name: 'doctor.reportGeneration' })
}

// 跳转到报告记录页面
const goToReportRecords = () => {
  // 这里暂时显示提示，后续可以实现报告记录页面
  ElMessage.info('报告记录功能正在开发中...')
}
</script>

<style scoped>
.doctor-reports-page {
  min-height: 100vh;
  background: white;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  font-size: 2.2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 1.1rem;
  color: #6b7280;
}

.reports-functions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.function-card {
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.function-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
  border-color: #1890ff;
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #1890ff;
}

.function-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.function-card p {
  font-size: 1.1rem;
  color: #6b7280;
  line-height: 1.6;
}

.new-report .card-icon {
  color: #52c41a;
}

.report-records .card-icon {
  color: #1890ff;
}

.new-report:hover {
  border-color: #52c41a;
}

.report-records:hover {
  border-color: #1890ff;
}

@media (max-width: 768px) {
  .doctor-reports-page {
    padding: 30px 15px;
  }
  
  .page-header h1 {
    font-size: 1.8rem;
  }
  
  .reports-functions {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .function-card {
    padding: 30px 20px;
  }
  
  .card-icon {
    font-size: 3rem;
  }
}
</style>