<template>
  <div class="register-page">
    <div class="container">
      <!-- 左侧内容 -->
      <div class="left-section">
        <div class="logo">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L2 8v16l14 6 14-6V8L16 2z" stroke="white" stroke-width="2" fill="none"/>
            <path d="M8 12l8 6 8-6" stroke="white" stroke-width="2"/>
          </svg>
        </div>
        <h1>BoneVision AI</h1>
        <p>注册账号并加入专业影像诊断平台，享受便捷的病例管理与诊断服务</p>
        
        <div class="features">
          <div class="feature-item">
            <div class="feature-icon">✓</div>
            <div class="feature-content">
              <h3>专业身份认证</h3>
              <p>户籍的身份信息认证，确保医疗服务质量</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <div class="feature-content">
              <h3>安全数据保护</h3>
              <p>医疗级数据加密，保障隐私安全</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚙️</div>
            <div class="feature-content">
              <h3>专属功能权限</h3>
              <p>根据身份提供定制化能力与服务</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">👥</div>
            <div class="feature-content">
              <h3>医患协同平台</h3>
              <p>连接医生与患者的专业沟通渠道</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧表单 -->
      <div class="right-section">
        <div class="form-header">
          <h2>用户注册</h2>
          <p>创建账号并加入医学影像诊断平台</p>
        </div>

        <!-- 步骤指示器 -->
        <div class="steps">
          <div 
            class="step" 
            :class="{ active: currentStep === 1, completed: currentStep > 1 }"
          >
            <div class="step-number">{{ currentStep > 1 ? '✓' : '1' }}</div>
            <div class="step-label">身份选择</div>
          </div>
          <div 
            class="step" 
            :class="{ active: currentStep === 2, completed: currentStep > 2 }"
          >
            <div class="step-number">{{ currentStep > 2 ? '✓' : '2' }}</div>
            <div class="step-label">手机验证</div>
          </div>
          <div 
            class="step" 
            :class="{ active: currentStep === 3, completed: currentStep > 3 }"
          >
            <div class="step-number">{{ currentStep > 3 ? '✓' : '3' }}</div>
            <div class="step-label">信息完善</div>
          </div>
          <div 
            class="step" 
            :class="{ active: currentStep === 4 }"
          >
            <div class="step-number">4</div>
            <div class="step-label">完成注册</div>
          </div>
        </div>

        <!-- 第一步：身份选择 -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="identity-options">
            <div 
              class="identity-card"
              :class="{ selected: form.role === 'doctor' }"
              @click="form.role = 'doctor'"
            >
              <div class="identity-icon">👨‍⚕️</div>
              <div class="identity-name">医生</div>
            </div>
            <div 
              class="identity-card"
              :class="{ selected: form.role === 'patient' }"
              @click="form.role = 'patient'"
            >
              <div class="identity-icon">👤</div>
              <div class="identity-name">患者</div>
            </div>
            <div 
              class="identity-card"
              :class="{ selected: form.role === 'admin' }"
              @click="form.role = 'admin'"
            >
              <div class="identity-icon">⚙️</div>
              <div class="identity-name">管理员</div>
            </div>
          </div>

          <div class="form-actions">
            <el-button 
              type="primary" 
              size="large"
              class="btn-primary"
              @click="currentStep = 2"
            >
              下一步
            </el-button>
          </div>
        </div>

        <!-- 第二步：手机验证 -->
        <div v-else-if="currentStep === 2" class="step-content">
          <div class="form-group">
            <label>手机号码</label>
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号码"
              size="large"
              class="form-control"
              type="tel"
            />
          </div>

          <div class="form-group">
            <label>验证码</label>
            <div class="verification-code-group">
              <el-input
                v-model="form.verificationCode"
                placeholder="请输入验证码"
                size="large"
                class="form-control"
                maxlength="6"
              />
              <el-button 
                class="get-code-btn"
                @click="getVerificationCode"
                :disabled="codeSent"
              >
                {{ codeSent ? `${countdown}s` : '获取验证码' }}
              </el-button>
            </div>
          </div>

          <div class="checkbox-group">
            <el-checkbox v-model="form.remember">记住我 7 天</el-checkbox>
          </div>

          <div class="form-actions">
            <el-button 
              class="btn-secondary"
              size="large"
              @click="currentStep = 1"
            >
              上一步
            </el-button>
            <el-button 
              type="primary" 
              size="large"
              class="btn-primary"
              @click="currentStep = 3"
            >
              下一步
            </el-button>
          </div>
        </div>

        <!-- 第三步：信息填写 -->
        <RegisterForm 
          v-else-if="currentStep === 3" 
          :role="form.role"
          @next="handleNext" 
          @back="currentStep = 2" 
        />

        <!-- 第四步：完成 -->
        <div v-else-if="currentStep === 4" class="step-content success-content">
          <div class="success-icon">✓</div>
          <h3>注册成功</h3>
          <p>您的账号已成功创建，现在可以登录使用系统</p>
          <el-button 
            type="primary" 
            size="large"
            class="login-redirect-btn"
            @click="router.push('/login')"
          >
            返回登录
          </el-button>
        </div>

        <!-- 底部链接 -->
        <div class="login-link" v-if="currentStep < 4">
          已有账号？<router-link to="/login">立即登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import RegisterForm from '@/components/RegisterForm.vue'

const router = useRouter()
const currentStep = ref(1)
const codeSent = ref(false)
const countdown = ref(60)

interface RegisterForm {
  role: 'patient' | 'doctor' | 'admin'
  phone: string
  verificationCode: string
  remember: boolean
  fullName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

const form = reactive<RegisterForm>({
  role: 'doctor',
  phone: '',
  verificationCode: '',
  remember: false,
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const getVerificationCode = () => {
  if (!form.phone) {
    alert('请先输入手机号码')
    return
  }
  
  codeSent.value = true
  countdown.value = 60
  
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
      codeSent.value = false
      countdown.value = 60
    }
  }, 1000)
}

const handleNext = () => {
  currentStep.value = 4
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

.register-page {
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
  width: 100%;
  max-width: 1200px;
  gap: 0;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

/* 左侧内容 */
.left-section {
  flex: 1;
  background: linear-gradient(135deg, #e8f0ff 0%, #f0f5ff 100%);
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
}

.logo svg {
  width: 28px;
  height: 28px;
  color: white;
}

.left-section h1 {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 12px;
  font-weight: 700;
}

.left-section p {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 40px;
  line-height: 1.6;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: rgba(37, 99, 235, 0.1);
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

/* 右侧表单 */
.right-section {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
}

.form-header h2 {
  font-size: 28px;
  color: #1f2937;
  margin-bottom: 8px;
  font-weight: 700;
}

.form-header p {
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 30px;
}

/* 步骤指示器 */
.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;
}

.steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.step.completed .step-number {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  transition: color 0.3s ease;
}

.step.active .step-label {
  color: #2563eb;
  font-weight: 600;
}

/* 身份选择 */
.identity-section {
  margin-bottom: 30px;
}

.identity-label {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 16px;
  display: block;
}

.identity-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.identity-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.identity-card:hover {
  border-color: #2563eb;
  background: #f0f9ff;
}

.identity-card.selected {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.identity-icon {
  font-size: 32px;
  margin-bottom: 12px;
  display: block;
}

.identity-name {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
}

.step-content {
  flex: 1;
  min-height: 300px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #1f2937;
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
}

:deep(.el-input__wrapper:hover) {
  border-color: #2563eb;
}

:deep(.el-input.is-focus .el-input__wrapper) {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.verification-code-group {
  display: flex;
  gap: 12px;
}

.verification-code-group .form-control {
  flex: 1;
}

.get-code-btn {
  padding: 12px 20px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

:deep(.el-button.get-code-btn:hover:not(:disabled)) {
  background: #e5e7eb;
}

:deep(.el-button.get-code-btn:disabled) {
  color: #9ca3af;
  cursor: not-allowed;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

:deep(.el-checkbox) {
  font-size: 12px;
  color: #6b7280;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.btn-primary {
  flex: 1;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.btn-secondary {
  flex: 1;
  background: #f3f4f6;
  color: #1f2937;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

:deep(.el-button--primary:hover) {
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
}

/* 成功页面 */
.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 0;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: white;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}

.success-content h3 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 12px;
  font-weight: 700;
}

.success-content p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
}

.login-redirect-btn {
  width: 100%;
}

/* 底部链接 */
.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: #6b7280;
}

.login-link a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 0;
  }

  .left-section {
    padding: 40px 20px;
  }

  .left-section h1 {
    font-size: 24px;
  }

  .right-section {
    padding: 40px 20px;
  }

  .identity-options {
    grid-template-columns: 1fr;
  }

  .steps {
    gap: 10px;
  }

  .step-label {
    font-size: 10px;
  }

  .verification-code-group {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>