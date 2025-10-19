<template>
  <div class="login-layout">
    <div class="login-container">
      <div class="login-content">
        <div class="login-header">
          <div class="login-logo">基于AI的肌肉骨骼系统疾病智能诊断系统</div>
          <div class="login-subtitle">整合先进AI技术，提供精准诊断与个性化健康管理</div>
          <div class="login-title">欢迎登录</div>
        </div>
        <div class="login-form-wrapper">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 布局组件逻辑
</script>

<style scoped>
.login-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-logo {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1a73e8;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.login-subtitle {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.login-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.login-form-wrapper {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-layout {
    padding: 15px;
  }
  
  .login-content {
    padding: 30px 25px;
  }
  
  .login-logo {
    font-size: 1.1rem;
  }
}
</style>