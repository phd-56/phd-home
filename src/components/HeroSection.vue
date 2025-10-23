<template>
  <section class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">AI肌肉骨骼疾病智能诊断系统</h1>
      <p class="hero-subtitle">基于先进人工智能技术，提供精准、快速的肌肉骨骼系统疾病诊断服务</p>
      <div class="hero-actions">
        <router-link to="/upload" class="cta-button">开始诊断</router-link>
        <router-link to="/ai-diagnosis" class="secondary-button">了解AI诊断</router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white !important;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.cta-button, .secondary-button {
  padding: 0.75rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.cta-button {
  background: white;
  color: #667eea;
}

.secondary-button {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.secondary-button:hover {
  background: white;
  color: #667eea;
}
</style>