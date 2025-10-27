<template>
  <div class="patient-dashboard">
    <!-- 路由出口 - 始终存在，用于显示子路由内容 -->
    <router-view />
    
    <!-- 只有当访问根路径时才显示主页内容 -->
    <div v-if="$route.path === '/dashboard/patient'">
      <!-- 患者头部 -->
      <div class="dashboard-header">
        <h1>患者工作台</h1>
        <p>欢迎回来！</p>
        <div class="header-actions">
          <el-button type="primary" @click="goToUpload">📁 上传影像</el-button>
        <el-button @click="goToImageHistory">🖼️ 历史影像</el-button>
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
        </div>
        
        <div class="function-card" @click="goToMyReports">
          <div class="card-icon">📄</div>
          <h3>我的报告</h3>
          <p>查看历史诊断报告和结果</p>
        </div>
        
        <div class="function-card" @click="goToMyCases">
          <div class="card-icon">📋</div>
          <h3>我的病例</h3>
          <p>管理个人病例和诊断记录</p>
        </div>
        
        <div class="function-card" @click="goToAppointment">
          <div class="card-icon">📅</div>
          <h3>预约医生</h3>
          <p>在线预约专业医生咨询</p>
        </div>
        
        <div class="function-card" @click="goToKnowledge">
          <div class="card-icon">📚</div>
          <h3>健康知识</h3>
          <p>了解疾病知识和健康指导</p>
        </div>
        
        <div class="function-card" @click="goToFeedback">
          <div class="card-icon">💬</div>
          <h3>意见反馈</h3>
          <p>提供使用反馈和改进建议</p>
        </div>
        
        <div class="function-card" @click="goToImageHistory">
          <div class="card-icon">🖼️</div>
          <h3>历史影像</h3>
          <p>查看和管理历史上传的影像记录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';

const router = useRouter();
const authStore = useAuthStore();

const goToUpload = () => {
  router.push('/dashboard/patient/image-upload');
};

const goToMyReports = () => {
  router.push('/dashboard/patient/reports');
};

const goToMyCases = () => {
  ElMessage.info('我的病例功能开发中...');
};

const goToAppointment = () => {
  ElMessage.info('预约医生功能开发中...');
};

const goToKnowledge = () => {
  router.push('/dashboard/patient/knowledge-base');
};

const goToFeedback = () => {
  router.push('/dashboard/patient/feedback');
}

const goToImageHistory = () => {
  router.push('/dashboard/patient/image-history');
};

const handleLogout = () => {
  authStore.logout();
  ElMessage.success('已退出登录');
  router.push('/');
};
</script>

<style scoped>
.patient-dashboard {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.dashboard-header h1 {
  color: #1890ff;
  margin-bottom: 10px;
}

.header-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.function-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
}

.function-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.function-card h3 {
  color: #303133;
  margin-bottom: 8px;
}

.function-card p {
  color: #606266;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .function-grid {
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