<template>
  <div class="patient-dashboard">
    <!-- 患者头部 -->
    <div class="dashboard-header">
      <h1>患者工作台</h1>
      <p>欢迎回来，{{ authStore.user?.fullName }}！</p>
      <div class="header-actions">
        <el-button type="primary" @click="goToUpload">📁 上传影像</el-button>
        <el-button @click="goToFeedback">💬 意见反馈</el-button>
        <el-button @click="handleLogout">🚪 退出登录</el-button>
      </div>
    </div>

    <!-- 患者核心功能 -->
    <div class="function-grid">
      <div class="function-card" @click="goToUpload">
        <div class="card-icon">📁</div>
        <h3>影像上传</h3>
        <p>上传医学影像进行AI诊断分析</p>
        <div class="card-badge">核心功能</div>
      </div>
      
      <div class="function-card" @click="goToMyReports">
        <div class="card-icon">📄</div>
        <h3>我的报告</h3>
        <p>查看历史诊断报告和结果</p>
        <div class="card-badge">查看</div>
      </div>
      
      <div class="function-card" @click="goToMyCases">
        <div class="card-icon">📋</div>
        <h3>我的病例</h3>
        <p>管理个人病例和诊断记录</p>
        <div class="card-badge">管理</div>
      </div>
      
      <div class="function-card" @click="goToAppointment">
        <div class="card-icon">📅</div>
        <h3>预约医生</h3>
        <p>在线预约专业医生咨询</p>
        <div class="card-badge">预约</div>
      </div>
      
      <div class="function-card" @click="goToKnowledge">
        <div class="card-icon">📚</div>
        <h3>健康知识</h3>
        <p>了解疾病知识和健康指导</p>
        <div class="card-badge">学习</div>
      </div>
      
      <div class="function-card" @click="goToFeedback">
        <div class="card-icon">💬</div>
        <h3>意见反馈</h3>
        <p>提供使用反馈和改进建议</p>
        <div class="card-badge">反馈</div>
      </div>
    </div>

    <!-- 患者信息卡片 -->
    <div class="info-section">
      <div class="info-card">
        <h3>个人信息</h3>
        <div class="info-content">
          <div class="info-item">
            <span class="label">姓名：</span>
            <span class="value">{{ authStore.user?.fullName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">病历号：</span>
            <span class="value">{{ authStore.user?.medicalRecord || '暂无' }}</span>
          </div>
          <div class="info-item">
            <span class="label">注册日期：</span>
            <span class="value">{{ formatDate(authStore.user?.createdAt) }}</span>
          </div>
          <div class="info-item">
            <span class="label">用户类型：</span>
            <span class="value patient-badge">患者</span>
          </div>
        </div>
      </div>

      <div class="info-card">
        <h3>快速操作</h3>
        <div class="quick-actions">
          <el-button type="primary" class="quick-btn" @click="goToUpload">
            <span class="btn-icon">📁</span>
            <span>上传新影像</span>
          </el-button>
          <el-button class="quick-btn" @click="goToMyReports">
            <span class="btn-icon">📄</span>
            <span>查看报告</span>
          </el-button>
          <el-button class="quick-btn" @click="goToFeedback">
            <span class="btn-icon">💬</span>
            <span>意见反馈</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'  
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const goToUpload = () => {
  router.push('/upload')
}

const goToMyReports = () => {
  ElMessage.info('我的报告功能开发中...')
}

const goToMyCases = () => {
  ElMessage.info('我的病例功能开发中...')
}

const goToAppointment = () => {
  ElMessage.info('预约医生功能开发中...')
}

const goToKnowledge = () => {
  ElMessage.info('健康知识库功能开发中...')
}

const goToFeedback = () => {
  ElMessage.info('意见反馈功能开发中...')
}

const handleLogout = () => {
  authStore.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.patient-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f3ff 100%);
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 50px;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.dashboard-header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 10px;
}

.dashboard-header p {
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 25px;
}

.header-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.function-card {
  background: white;
  border-radius: 16px;
  padding: 30px 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.function-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

.card-icon {
  font-size: 3.5rem;
  margin-bottom: 16px;
}

.function-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 10px;
}

.function-card p {
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 15px;
}

.card-badge {
  display: inline-block;
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.info-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
}

.info-content {
  space-y: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #6b7280;
}

.value {
  color: #1f2937;
  font-weight: 500;
}

.patient-badge {
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.quick-btn:hover {
  transform: translateX(5px);
}

.btn-icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .patient-dashboard {
    padding: 20px 15px;
  }
  
  .dashboard-header {
    padding: 20px;
  }
  
  .dashboard-header h1 {
    font-size: 2rem;
  }
  
  .function-grid {
    grid-template-columns: 1fr;
  }
  
  .info-section {
    grid-template-columns: 1fr;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .header-actions .el-button {
    width: 200px;
  }
}
</style>