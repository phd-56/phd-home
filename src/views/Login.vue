<template>
  <div class="login-page">
    <div class="container">
      <!-- 左侧内容 -->
      <div class="left-section">
        <div class="logo">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L2 8v16l14 6 14-6V8L16 2z" stroke="#2563eb" stroke-width="2" fill="none"/>
            <path d="M8 12l8 6 8-6" stroke="#2563eb" stroke-width="2"/>
          </svg>
        </div>
        <h1>BoneVision AI</h1>
        <p>专注于肌肉骨骼系统智能诊断，融合深度学习与医学专家经验，为医疗机构提供精准、高效的AI诊断服务</p>
        
        <div class="features">
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <div class="feature-content">
              <h3>医疗级安全保障</h3>
              <p>符合HIPAA及国家医疗数据安全标准</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <div class="feature-content">
              <h3>专业影像分析</h3>
              <p>支持多模态影像处理与三维重建</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">👥</div>
            <div class="feature-content">
              <h3>医患协同平台</h3>
              <p>医生患者无缝沟通，提升诊断效率</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📋</div>
            <div class="feature-content">
              <h3>智能报告管理</h3>
              <p>自动化诊断报告与病例分析</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="right-section">
        <div class="login-card">
          <h2>账号登录</h2>
          <p>请选择您的身份并输入账号信息</p>

          <!-- 角色选择 -->
          <div class="identity-selector">
            <button 
              class="identity-btn"
              :class="{ active: form.role === 'doctor' }"
              @click="form.role = 'doctor'"
            >
              <span class="identity-icon">👨‍⚕️</span>
              <span>医生</span>
            </button>
            <button 
              class="identity-btn"
              :class="{ active: form.role === 'patient' }"
              @click="form.role = 'patient'"
            >
              <span class="identity-icon">👤</span>
              <span>患者</span>
            </button>
            <button 
              class="identity-btn"
              :class="{ active: form.role === 'admin' }"
              @click="form.role = 'admin'"
            >
              <span class="identity-icon">⚙️</span>
              <span>管理员</span>
            </button>
          </div>

          <!-- 用户名/手机号码 -->
          <div class="form-group">
            <label class="form-label">账号登录</label>
            <el-input
              v-model="form.username"
              placeholder="请输入用户名或手机号"
              size="large"
              class="form-control"
            />
          </div>

          <!-- 密码 -->
          <div class="form-group">
            <label class="form-label">密码</label>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              class="form-control"
              show-password
            />
          </div>

          <!-- 记住我 -->
          <div class="checkbox-group">
            <el-checkbox v-model="form.remember">记住我 7 天</el-checkbox>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>

          <!-- 登录按钮 -->
          <el-button 
            type="primary" 
            size="large" 
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录系统' }}
          </el-button>

          <!-- 协议 -->
          <div class="agreement">
            登录即表示同意<a href="#">用户协议</a>和<a href="#">隐私政策</a>
          </div>

          <!-- 注册链接 -->
          <div class="register-link">
            还没有账号？<router-link to="/register">立即注册</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)

interface LoginForm {
  role: 'patient' | 'doctor' | 'admin'
  username: string
  password: string
  remember: boolean
}

const form = reactive<LoginForm>({
  role: 'doctor',
  username: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  try {
    if (!form.username || !form.password) {
      ElMessage.warning('请填写完整信息')
      return
    }

    loading.value = true

    console.log('开始登录...', form)

    await authStore.login(form.username, form.password, form.role)
    
    ElMessage.success('登录成功！')

    if (authStore.user && authStore.isAuthenticated) {
      const targetRoute = getTargetRoute(authStore.user.role)
      
      setTimeout(() => {
        router.push(targetRoute)
      }, 100)
    } else {
      ElMessage.error('登录状态异常，请重试')
    }
    
  } catch (error: any) {
    console.error('登录错误:', error)
    ElMessage.error(error.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

const getTargetRoute = (role: string): string => {
  switch (role) {
    case 'patient': return '/dashboard/patient'
    case 'doctor': return '/dashboard/doctor'
    case 'admin': return '/dashboard/admin/user-management'
    default: return '/dashboard/patient'
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

.login-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #e8f0ff 0%, #f5f7ff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  display: flex;
  gap: 60px;
  max-width: 1200px;
  width: 100%;
  align-items: center;
}

/* 左侧内容 */
.left-section {
  flex: 1;
  min-width: 300px;
}

.logo {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
}

.logo svg {
  width: 32px;
  height: 32px;
  color: white;
}

.left-section h1 {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 12px;
  font-weight: 700;
}

.left-section p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 40px;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.feature-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  font-size: 20px;
  flex-shrink: 0;
}

.feature-content h3 {
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 4px;
  font-weight: 600;
}

.feature-content p {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

/* 右侧登录表单 */
.right-section {
  flex: 1;
  min-width: 300px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.login-card h2 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 8px;
  font-weight: 700;
}

.login-card > p {
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 24px;
}

/* 身份选择 */
.identity-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.identity-btn {
  flex: 1;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.identity-btn:hover {
  border-color: #2563eb;
  background: #f0f9ff;
}

.identity-btn.active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.identity-icon {
  font-size: 24px;
}

/* 表单组 */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  color: #374151;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-control {
  width: 100%;
}

:deep(.el-input__wrapper) {
  height: 48px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  background-color: #ffffff;
  box-shadow: none;
  padding: 0 14px;
}

:deep(.el-input__wrapper:hover) {
  border-color: #2563eb;
}

:deep(.el-input.is-focus .el-input__wrapper) {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

:deep(.el-input__inner) {
  font-size: 14px;
}

:deep(.el-checkbox) {
  font-size: 13px;
}

:deep(.el-checkbox__label) {
  color: #6b7280;
  font-size: 13px;
}

/* 复选框 */
.checkbox-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #6b7280;
}

.forgot-link {
  color: #2563eb;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  margin-bottom: 16px;
}

:deep(.el-button) {
  width: 100%;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
  transform: translateY(-2px);
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

/* 协议链接 */
.agreement {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 24px;
}

.agreement a {
  color: #2563eb;
  text-decoration: none;
}

.agreement a:hover {
  text-decoration: underline;
}

/* 注册链接 */
.register-link {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
}

.register-link a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 40px;
  }

  .left-section h1 {
    font-size: 24px;
  }

  .login-card {
    padding: 30px 20px;
  }

  .features {
    grid-template-columns: 1fr;
  }
}
</style>