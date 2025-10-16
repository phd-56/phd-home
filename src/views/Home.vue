<template>
  <div class="home-container">
    <!-- 简约导航栏 -->
    <nav class="navbar">
      <div class="nav-content">
        <div class="logo">
          <div class="logo-icon"></div>
          <span class="logo-text">医学影像处理模块</span>
        </div>
        <div class="nav-actions">
          <el-button link @click="scrollToSection('features')">系统详情</el-button>
          <el-button type="primary" @click="$router.push('/upload')">
            <el-icon><Upload /></el-icon>
            开始诊断
          </el-button>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="main-content">
      <!-- 英雄区域 -->
      <section class="hero-section">
        <div class="hero-background"></div>
        <div class="hero-content">
          <!-- <div class="hero-badge">AI驱动的医疗诊断</div> -->
          <h1 class="hero-title">
            智能骨骼疾病
            <span class="gradient-text">诊断系统</span>
          </h1>
          <p class="hero-description">
            基于深度学习的先进AI技术，为肌肉骨骼影像提供精准、高效的智能分析解决方案
          </p>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="$router.push('/upload')" class="primary-btn">
              <el-icon><Magic /></el-icon>
              立即体验
            </el-button>
            <!-- <el-button size="large" @click="scrollToSection('features')" class="outline-btn">
              <el-icon><View /></el-icon>
              了解详情
            </el-button> -->
          </div>
          <div class="hero-stats">
            <div class="stat">
              <div class="stat-value">95.4%</div>
              <div class="stat-label">诊断准确率</div>
            </div>
            <div class="stat">
              <div class="stat-value">2.3min</div>
              <div class="stat-label">平均分析时间</div>
            </div>
            <div class="stat">
              <div class="stat-value">12.8k+</div>
              <div class="stat-label">累计病例</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 核心功能 -->
      <section class="features-section" id="features">
        <div class="section-header">
          <h2 class="section-title">系统详情</h2>
          <p class="section-subtitle">先进的人工智能技术，重塑医疗诊断体验</p>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <!-- CTA区域 -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>准备好开始智能诊断了吗？</h2>
          <p>上传医学影像，体验AI驱动的精准诊断</p>
          <el-button type="primary" size="large" @click="$router.push('/upload')" class="cta-btn">
            <el-icon><UploadFilled /></el-icon>
            上传影像开始诊断
          </el-button>
        </div>
      </section>
    </main>

    <!-- 简约底部 -->
    <footer class="footer">
      <p>&copy; 2025 AI的肌肉骨骼系统疾病智能诊断系统 - 智能医疗的未来</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Mic, View, UploadFilled } from '@element-plus/icons-vue'

const features = ref([
  {
    id: 1,
    icon: '🧠',
    title: '智能分析',
    description: '深度学习算法精准识别骨骼疾病特征'
  },
  {
    id: 2,
    icon: '⚡',
    title: '快速诊断',
    description: '分钟级完成影像分析，提升诊断效率'
  },
  {
    id: 3,
    icon: '🎯',
    title: '精准定位',
    description: '精确识别病灶位置，提供详细分析'
  },
  {
    id: 4,
    icon: '🛡️',
    title: '安全可靠',
    description: '医疗级数据保护，确保隐私安全'
  }
])

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #ffffff;
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 英雄区域 */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  margin-top: 72px;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.05) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  text-align: center;
  max-width: 800px;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 32px;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 48px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 80px;
}

.primary-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 1.125rem;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

.outline-btn {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 1.125rem;
  font-weight: 600;
  background: transparent;
  color: #374151;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 64px;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 0.875rem;
  font-weight: 600;
}

/* 功能区域 */
.features-section {
  padding: 120px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.feature-card {
  background: #fff;
  padding: 48px 32px;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 4rem;
  margin-bottom: 24px;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.feature-description {
  color: #666;
  line-height: 1.6;
}

/* CTA区域 */
.cta-section {
  padding: 120px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  margin: 0 -24px;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  color: white;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.cta-content p {
  font-size: 1.25rem;
  margin-bottom: 48px;
  opacity: 0.9;
}

.cta-btn {
  background: white;
  color: #6366f1;
  border: none;
  border-radius: 12px;
  padding: 16px 40px;
  font-size: 1.125rem;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.cta-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
}

/* 底部 */
.footer {
  padding: 40px 24px;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .primary-btn,
  .outline-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .hero-stats {
    gap: 32px;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-content h2 {
    font-size: 2rem;
  }
}
</style>