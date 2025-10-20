<template>
  <el-card 
    class="case-management-card" 
    @click="handleCardClick"
    hover-shadow
  >
    <div class="card-content">
      <div class="card-icon">
        <el-icon :size="48"><folder-opened /></el-icon>
      </div>
      <div class="card-info">
        <h3 class="card-title">病例管理</h3>
        <p class="card-desc">管理患者病例信息、诊断记录和治疗方案</p>
        <div class="card-stats">
          <span class="stat-item">
            <el-icon :size="16"><document /></el-icon>
            <span class="stat-value">128</span>
            <span class="stat-label">活跃病例</span>
          </span>
          <span class="stat-item">
            <el-icon :size="16"><timer /></el-icon>
            <span class="stat-value">今日新增</span>
            <span class="stat-label">12</span>
          </span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { FolderOpened, Document, Timer } from '@element-plus/icons-vue';

const router = useRouter();

// 卡片点击事件处理函数
const handleCardClick = () => {
  console.log('跳转至病例管理页面');
  // 跳转到病例管理路由，与路由配置中的path对应
  router.push('/cases').catch(err => {
    console.error('路由跳转失败:', err);
    // 错误处理：显示提示信息
    ElMessage.error({
      message: '无法跳转到病例管理页面，请检查权限或联系管理员',
      duration: 5000
    });
  });
};
</script>

<style scoped>
.case-management-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.case-management-card:hover {
  transform: translateY(-5px);
}

.card-content {
  display: flex;
  align-items: center;
  padding: 15px 0;
}

.card-icon {
  color: #409eff;
  margin-right: 20px;
}

.card-info {
  flex: 1;
}

.card-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #303133;
}

.card-desc {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
}

.card-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #909399;
}

.stat-value {
  margin: 0 5px;
  font-weight: 500;
  color: #303133;
}
</style>