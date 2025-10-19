<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <header class="home-header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <span>AI肌肉骨骼诊断系统</span>
          </div>
          <nav class="nav-menu">
            <a href="#features" class="nav-link">核心功能</a>
            <a href="#advantages" class="nav-link">系统优势</a>
            <a href="#about" class="nav-link">关于我们</a>
          </nav>
          <div class="user-actions">
            <el-button type="primary" @click="navigateToLogin" class="login-btn">登录</el-button>
            <el-button @click="navigateToRegister" class="register-btn">注册</el-button>
          </div>
        </div>
      </div>
    </header>

    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">AI肌肉骨骼系统疾病智能诊断系统</h1>
          <p class="hero-subtitle">
            基于先进人工智能技术，为医生和患者提供精准、高效的肌肉骨骼系统疾病诊断服务
          </p>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="navigateToRegister" class="cta-button">
              立即体验
            </el-button>
            <el-button size="large" @click="navigateToLogin" class="secondary-button">
              已有账号登录
            </el-button>
          </div>
        </div>
        <div class="hero-image">
          <!-- 这里可以放置医疗相关的插图 -->
          <div class="medical-illustration">🩺</div>
        </div>
      </div>
    </section>

    <!-- 核心功能区域 -->
    <section id="features" class="features-section">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🩻</div>
            <h3 class="feature-title">多格式影像支持</h3>
            <p class="feature-desc">全面支持DICOM、NIfTI、JPG、PNG等多种医疗影像格式</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3 class="feature-title">AI智能分析</h3>
            <p class="feature-desc">基于深度学习算法的精准疾病诊断与辅助决策</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3 class="feature-title">三维重建</h3>
            <p class="feature-desc">先进的医学影像三维重建与可视化技术</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3 class="feature-title">快速诊断</h3>
            <p class="feature-desc">分钟级完成影像分析，大幅提升诊断效率</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3 class="feature-title">智能报告</h3>
            <p class="feature-desc">自动生成结构化诊断报告，支持个性化定制</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3 class="feature-title">多角色协作</h3>
            <p class="feature-desc">患者、医生、管理员协同工作的完整平台生态</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 系统优势 -->
    <section id="advantages" class="advantages-section">
      <div class="container">
        <h2 class="section-title">为什么选择我们</h2>
        <div class="advantages-content">
          <div class="advantage-item">
            <div class="advantage-icon">🎯</div>
            <div class="advantage-text">
              <h3>精准诊断</h3>
              <p>基于百万级医学影像数据训练，诊断准确率超过95%</p>
            </div>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon">🚀</div>
            <div class="advantage-text">
              <h3>高效便捷</h3>
              <p>简化诊断流程，大幅提升医疗工作效率</p>
            </div>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon">🛡️</div>
            <div class="advantage-text">
              <h3>安全可靠</h3>
              <p>医疗级数据加密，确保患者隐私安全</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>立即体验智能诊断</h2>
          <p>注册账号，开启高效的医疗影像诊断之旅</p>
          <el-button type="primary" size="large" @click="navigateToRegister" class="cta-button">
            免费注册体验
          </el-button>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="home-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>AI肌肉骨骼诊断系统</h3>
            <p>智能医疗新时代，AI赋能健康未来</p>
          </div>
          <div class="footer-section">
            <h4>联系我们</h4>
            <p>客服热线：400-123-4567</p>
            <p>邮箱：ai@aimedical.com</p>
          </div>
          <div class="footer-section">
            <h4>快速链接</h4>
            <a href="#features" class="footer-link">核心功能</a>
            <a href="#advantages" class="footer-link">系统优势</a>
            <a href="#about" class="footer-link">关于我们</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2024 基于AI的肌肉骨骼系统疾病智能诊断系统 保留所有权利</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToLogin = () => {
  router.push('/login')
}

const navigateToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* 导航栏样式 */
.home-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo span {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a73e8;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #1a73e8;
}

.user-actions {
  display: flex;
  gap: 1rem;
}

.login-btn, .register-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
}

/* 英雄区域样式 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 120px 0 80px;
  margin-top: 60px;
}

.hero-section .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.cta-button, .secondary-button {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
}

.cta-button {
  background: white;
  color: #667eea;
  border: none;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.secondary-button {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.secondary-button:hover {
  background: white;
  color: #667eea;
}

.medical-illustration {
  font-size: 8rem;
  text-align: center;
}

/* 功能区域样式 */
.features-section {
  padding: 80px 0;
  background: #f8fafc;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a365d;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.feature-desc {
  color: #718096;
  line-height: 1.6;
}

/* 优势区域样式 */
.advantages-section {
  padding: 80px 0;
  background: white;
}

.advantages-content {
  max-width: 800px;
  margin: 0 auto;
}

.advantage-item {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: #f7fafc;
  border-radius: 12px;
}

.advantage-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.advantage-text h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.advantage-text p {
  color: #718096;
  line-height: 1.6;
}

/* CTA区域样式 */
.cta-section {
  background: linear-gradient(135deg, #1a73e8 0%, #6c8ef5 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

/* 页脚样式 */
.home-footer {
  background: #1a365d;
  color: white;
  padding: 60px 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h3 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.footer-section h4 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section p {
  color: #cbd5e0;
  margin-bottom: 0.5rem;
}

.footer-link {
  display: block;
  color: #cbd5e0;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s;
}

.footer-link:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #2d3748;
  color: #a0aec0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section .container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .nav-menu {
    display: none;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .advantage-item {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>