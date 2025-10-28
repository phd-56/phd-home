<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <header class="home-header" id="navbar">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <div class="logo-icon">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 8v16l14 6 14-6V8L16 2z" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M8 12l8 6 8-6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span>BoneVision AI</span>
          </div>
          <nav class="nav-menu">
            <a href="#features" class="nav-link">功能</a>
            <a href="#stats" class="nav-link">数据</a>
            <a href="#advantages" class="nav-link">优势</a>
            <a href="#contact" class="nav-link">联系</a>
          </nav>
          <div class="user-actions">
            <el-button @click="navigateToLogin" class="login-btn">登录</el-button>
            <el-button type="primary" @click="navigateToRegister" class="register-btn">注册</el-button>
          </div>
        </div>
      </div>
    </header>

    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            智能识别<span class="aurora-text">肌肉骨骼疾病</span>提升诊断精准度与效率
          </h1>
          <p class="hero-subtitle">
            BoneVision AI专注于肌肉骨骼系统智能诊断，融合深度学习与骨科专家经验，
            为临床医生提供精准、高效的辅助诊断决策支持系统
          </p>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="navigateToRegister" class="cta-button-primary">
              立即体验
            </el-button>
            <el-button size="large" @click="navigateToLogin" class="cta-button-secondary">
              了解更多
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据统计区域 -->
    <section id="stats" class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value counter" data-target="96.8">0</div>
            <div class="stat-label">诊断准确率</div>
            <p class="stat-desc">基于数万临床病例验证</p>
          </div>
          <div class="stat-card">
            <div class="stat-value counter" data-target="94.2">0</div>
            <div class="stat-label">病变检出敏感性</div>
            <p class="stat-desc">最大化疾病检出率</p>
          </div>
          <div class="stat-card">
            <div class="stat-value counter" data-target="72">0</div>
            <div class="stat-label">诊断效率提升</div>
            <p class="stat-desc">显著缩短诊断时间</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能区域 -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">专为肌肉骨骼疾病设计的AI诊断功能</h2>
          <p class="section-subtitle">
            BoneVision AI融合骨科专家经验与深度学习技术，为各类肌肉骨骼疾病提供精准全面的智能分析
          </p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon-bg feature-icon-bg-1"></div>
            </div>
            <h3 class="feature-title">骨折智能检测</h3>
            <ul class="feature-list">
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>骨折线精确定位</li>
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>多类型骨折识别</li>
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>愈合进程评估</li>
            </ul>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon-bg feature-icon-bg-2"></div>
            </div>
            <h3 class="feature-title">关节病变分析</h3>
            <ul class="feature-list">
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>关节退变程度评估</li>
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>关节炎早期诊断</li>
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>软骨损伤检测</li>
            </ul>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon-bg feature-icon-bg-3"></div>
            </div>
            <h3 class="feature-title">骨肿瘤良恶性鉴别</h3>
            <ul class="feature-list">
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>肿瘤边界识别</li>
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>恶性特征评估</li>
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>影像学分类建议</li>
            </ul>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon-bg feature-icon-bg-4"></div>
            </div>
            <h3 class="feature-title">脊柱疾病分析</h3>
            <ul class="feature-list">
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>椎体病变检测</li>
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>曲度异常分析</li>
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>椎间盘评估</li>
            </ul>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon-bg feature-icon-bg-5"></div>
            </div>
            <h3 class="feature-title">骨密度分析</h3>
            <ul class="feature-list">
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>骨质疏松评估</li>
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>骨质量定量分析</li>
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>骨折风险评估</li>
            </ul>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon-bg feature-icon-bg-6"></div>
            </div>
            <h3 class="feature-title">术后评估系统</h3>
            <ul class="feature-list">
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>愈合情况监测</li>
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>并发症早期预警</li>
              <li><svg class="check-icon" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>康复进度评估</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- AI深度学习模型 -->
    <section class="algorithm-section">
      <div class="container">
        <div class="algorithm-content">
          <div class="algorithm-text">
            <h2 class="section-title">专为肌肉骨骼系统优化的AI深度学习模型</h2>
            <p class="section-subtitle">
              BoneVision AI采用专门的深度学习架构，基于数十万肌肉骨骼影像数据训练，
              深度融合优化骨科临床需求，为临床提供可靠智能决策
            </p>
            <div class="algorithm-features">
              <div class="algorithm-feature">
                <div class="algorithm-feature-icon">📊</div>
                <h3>专科化训练数据集</h3>
              </div>
              <div class="algorithm-feature">
                <div class="algorithm-feature-icon">⚡</div>
                <h3>毫秒级实时推理</h3>
              </div>
              <div class="algorithm-feature">
                <div class="algorithm-feature-icon">🔬</div>
                <h3>多模态影像融合分析</h3>
              </div>
              <div class="algorithm-feature">
                <div class="algorithm-feature-icon">💡</div>
                <h3>AI决策可解释性</h3>
              </div>
            </div>
          </div>
          <div class="algorithm-visual">
            <div class="neural-visualization"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 系统优势 -->
    <section id="advantages" class="advantages-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">真实临床案例见证AI诊断价值</h2>
          <p class="section-subtitle">
            BoneVision AI已在全国300+骨科医院成功临床应用，助力医生提升诊断准确率与效率
          </p>
        </div>
        <div class="case-study">
          <div class="case-content">
            <h3 class="case-title">早期股骨头坏死AI检出案例</h3>
            <p class="case-description">
              12岁男性患者，传统影像学难以发现的早期股骨头坏死，BoneVision AI系统精准检出，
              为患者争取到最佳治疗时机，获得临床医生高度认可。
            </p>
            <div class="case-comparison">
              <div class="comparison-item comparison-before">
                <div class="comparison-label">传统阅片结果</div>
                <div class="comparison-value">未见异常</div>
            </div>
              <div class="comparison-item comparison-after">
                <div class="comparison-label">AI诊断结果</div>
                <div class="comparison-value">早期坏死</div>
          </div>
            </div>
            <ul class="case-stats">
              <li>诊断准确率提升15%</li>
              <li>早期病变检出率提升32%</li>
              <li>诊断时间缩短80%</li>
            </ul>
          </div>
          <div class="case-image">
            <div class="case-image-placeholder"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section id="contact" class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>体验AI赋能的肌肉骨骼疾病诊断</h2>
          <p>立即注册BoneVision AI账号，获得7天免费试用权限，体验专科AI诊断带来的临床价值</p>
          <el-button type="primary" size="large" @click="navigateToRegister" class="cta-button">
            立即注册
          </el-button>
          <p class="cta-note">已有全国300+医疗机构选择BoneVision AI</p>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="home-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section footer-brand">
            <div class="footer-logo">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 8v16l14 6 14-6V8L16 2z" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M8 12l8 6 8-6" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>BoneVision AI</span>
            </div>
            <p class="footer-desc">
              专注于肌肉骨骼系统智能诊断，融合深度学习与医学专家经验，
              为医疗机构提供精准、高效的AI诊断服务
            </p>
          </div>
          <div class="footer-section">
            <h4>产品服务</h4>
            <ul>
              <li><a href="#features">AI诊断功能</a></li>
              <li><a href="#stats">解决方案</a></li>
              <li><a href="#advantages">临床案例</a></li>
              <li><a href="#contact">定价方案</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>联系我们</h4>
            <ul>
              <li>电话：400-888-8888</li>
              <li>邮箱：contact@bonevision.ai</li>
              <li>地址：北京市海淀区中关村科技园</li>
              <li>工作时间：周一至周五 9:00-18:00</li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>法律</h4>
            <ul>
              <li><a href="#">隐私政策</a></li>
              <li><a href="#">服务条款</a></li>
              <li><a href="#">法律声明</a></li>
              <li><a href="#">数据安全</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2024 BoneVision AI医疗科技有限公司. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'

const router = useRouter()

const navigateToLogin = () => {
  router.push('/login')
}

const navigateToRegister = () => {
  router.push('/register')
}

onMounted(() => {
  // Navbar scroll effect
  const navbar = document.getElementById('navbar')
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled')
    } else {
      navbar?.classList.remove('scrolled')
    }
  }

  window.addEventListener('scroll', handleScroll)

  // Counter animation
  const counters = document.querySelectorAll('.counter')
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px',
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        const counter = entry.target as HTMLElement
        const target = parseFloat(counter.getAttribute('data-target') || '0')
        const duration = 2000
        const increment = target / (duration / 16)
        let current = 0

        const updateCounter = () => {
          current += increment
          if (current < target) {
            counter.textContent = Math.floor(current).toString()
            requestAnimationFrame(updateCounter)
          } else {
            counter.textContent = target.toString() + (target < 10 ? '' : '%')
            counter.classList.add('animated')
          }
        }

        updateCounter()
        counterObserver.unobserve(counter)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  scroll-behavior: smooth;
}

.home-page {
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background: hsl(222, 56%, 10%);
  color: hsl(0, 0%, 100%);
}

/* 导航栏样式 */
.home-header {
  background: rgba(34, 51, 84, 0.95);
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.home-header.scrolled {
  background: rgba(17, 24, 39, 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: hsl(193, 82%, 52%);
}

.logo span {
  font-size: 1.5rem;
  font-weight: 600;
  color: hsl(0, 0%, 100%);
  letter-spacing: -0.02em;
}

.nav-menu {
  display: flex;
  gap: 2.5rem;
}

.nav-link {
  text-decoration: none;
  color: hsl(210, 100%, 98%);
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover {
  color: hsl(193, 82%, 52%);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 0;
  height: 2px;
  background: hsl(193, 82%, 52%);
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.user-actions {
  display: flex;
  gap: 1rem;
}

.login-btn, .register-btn {
  padding: 0.625rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.login-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: hsl(210, 100%, 98%);
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: hsl(193, 82%, 52%);
  color: hsl(193, 82%, 52%);
}

.register-btn {
  background: hsl(193, 82%, 52%);
  border: none;
}

.register-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(26, 167, 236, 0.4);
}

/* 英雄区域样式 */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, hsl(193, 82%, 52%), hsl(226, 84%, 66%));
  top: -200px;
  right: -200px;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, hsl(240, 100%, 73%), hsl(193, 82%, 52%));
  bottom: -150px;
  left: -150px;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(50px, -50px) scale(1.1);
  }
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 800px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: hsl(0, 0%, 100%);
}

.aurora-text {
  background: linear-gradient(90deg, hsl(193, 82%, 52%), hsl(226, 84%, 66%), hsl(193, 82%, 52%));
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: aurora-shift 3s linear infinite;
}

@keyframes aurora-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.cta-button-primary, .cta-button-secondary {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s;
  cursor: pointer;
}

.cta-button-primary {
  background: hsl(193, 82%, 52%);
  border: none;
}

.cta-button-primary:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(26, 167, 236, 0.4);
}

.cta-button-secondary {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.cta-button-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: hsl(193, 82%, 52%);
}

/* 数据统计区域 */
.stats-section {
  padding: 80px 0;
  background: hsl(220, 13%, 18%);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 3rem 2rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.stat-value {
  font-size: 4rem;
  font-weight: 700;
  color: hsl(193, 82%, 52%);
  margin-bottom: 1rem;
  line-height: 1;
}

.stat-label {
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(0, 0%, 100%);
  margin-bottom: 0.5rem;
}

.stat-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

/* 功能区域 */
.features-section {
  padding: 100px 0;
  background: hsl(220, 13%, 18%);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: hsl(0, 0%, 100%);
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

.section-subtitle {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.feature-icon-wrapper {
  margin-bottom: 1rem;
}

.feature-icon-bg {
  width: 48px;
  height: 48px;
  border-radius: 8px;
}

.feature-icon-bg-1 { background: #48bb78; }
.feature-icon-bg-2 { background: #4299e1; }
.feature-icon-bg-3 { background: #f687b3; }
.feature-icon-bg-4 { background: #9f7aea; }
.feature-icon-bg-5 { background: #f6ad55; }
.feature-icon-bg-6 { background: #fc8181; }

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(0, 0%, 100%);
  margin-bottom: 1rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.8;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.check-icon {
  width: 18px;
  height: 18px;
  color: #48bb78;
  flex-shrink: 0;
}

/* 算法部分 */
.algorithm-section {
  padding: 100px 0;
  background: hsl(220, 13%, 18%);
}

.algorithm-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.algorithm-text {
  max-width: 600px;
}

.algorithm-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 3rem;
}

.algorithm-feature {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.algorithm-feature-icon {
  font-size: 2rem;
}

.algorithm-feature h3 {
  font-size: 1rem;
  font-weight: 500;
  color: hsl(0, 0%, 100%);
  margin: 0;
}

.algorithm-visual {
  position: relative;
  height: 400px;
}

.neural-visualization {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(26, 167, 236, 0.1), rgba(142, 68, 173, 0.1));
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.neural-visualization::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 30% 30%, hsl(193, 82%, 52%, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, hsl(226, 84%, 66%, 0.3) 0%, transparent 50%);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 案例部分 */
.advantages-section {
  padding: 100px 0;
  background: hsl(220, 13%, 18%);
}

.advantages-section .section-header {
  margin-bottom: 4rem;
}

.advantages-section .section-title {
  color: hsl(0, 0%, 100%);
}

.advantages-section .section-subtitle {
  color: rgba(255, 255, 255, 0.7);
  max-width: 900px;
}

.case-study {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.case-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: hsl(222, 56%, 10%);
  margin-bottom: 1.25rem;
}

.case-description {
  font-size: 1rem;
  color: hsl(220, 13%, 30%);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.case-comparison {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.comparison-item {
  flex: 1;
  padding: 1.25rem;
  border-radius: 10px;
}

.comparison-before {
  background: hsl(220, 13%, 93%);
}

.comparison-before .comparison-label {
  color: hsl(220, 13%, 50%);
  margin-bottom: 0.5rem;
}

.comparison-before .comparison-value {
  color: hsl(220, 13%, 30%);
}

.comparison-after {
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
}

.comparison-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.comparison-value {
  font-size: 1.125rem;
  font-weight: 600;
}

.case-stats {
  list-style: none;
  padding: 0;
  margin: 0;
}

.case-stats li {
  color: hsl(220, 13%, 30%);
  margin-bottom: 0.75rem;
  font-size: 1rem;
  padding-left: 1.5rem;
  position: relative;
}

.case-stats li::before {
  content: '✓';
  color: #48bb78;
  font-size: 1.15rem;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
  line-height: 1.5;
}

.case-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.case-image-placeholder {
  width: 100%;
  height: 100%;
  min-height: 450px;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  border-radius: 12px;
}

/* CTA区域 */
.cta-section {
  padding: 100px 0;
  background: hsl(220, 13%, 18%);
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: hsl(0, 0%, 100%);
  margin-bottom: 1.5rem;
}

.cta-content p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  padding: 1rem 3rem;
  background: hsl(193, 82%, 52%);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.cta-button:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(26, 167, 236, 0.4);
}

.cta-note {
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

/* 页脚样式 */
.home-footer {
  background: hsl(222, 56%, 10%);
  padding: 80px 0 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-brand {
  max-width: 350px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.footer-logo svg {
  width: 32px;
  height: 32px;
  color: hsl(193, 82%, 52%);
}

.footer-logo span {
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(0, 0%, 100%);
}

.footer-desc {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-size: 0.95rem;
}

.footer-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: hsl(0, 0%, 100%);
  margin-bottom: 1.5rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 0.75rem;
}

.footer-section ul li a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: hsl(193, 82%, 52%);
}

.footer-section ul li {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .algorithm-content {
    grid-template-columns: 1fr;
  }
  
  .case-study {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .algorithm-features {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .user-actions {
    gap: 0.5rem;
  }
  
  .login-btn, .register-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  
  .case-study {
    padding: 2rem 1.5rem;
  }
  
  .case-image-placeholder {
    min-height: 300px;
  }
}
</style>