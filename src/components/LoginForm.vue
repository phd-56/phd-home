<template>
  <!-- 登录表单 -->

  <el-form 
    :model="form" 
    :rules="rules" 
    ref="loginForm" 
    class="login-form"
    @submit.prevent="handleLogin"
  >
    <!-- 角色选择 -->
    <div class="form-group">
      <label class="form-label">选择角色</label>
      <el-select 
        v-model="form.role" 
        placeholder="请选择您的角色"
        class="form-control"
        size="large"
      >
        <el-option label="患者" value="patient" />
        <el-option label="医生" value="doctor" />
        <el-option label="管理员" value="admin" />
      </el-select>
    </div>

    <!-- 用户名输入 -->
    <div class="form-group">
      <label class="form-label">用户名</label>
      <el-input
        v-model="form.username"
        placeholder="请输入用户名"
        size="large"
        class="form-control"
      />
    </div>

    <!-- 密码输入 -->
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

    <!-- 记住我和忘记密码 -->
    <div class="form-options">
      <el-checkbox v-model="form.remember">记住密码</el-checkbox>
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
      {{ loading ? '登录中...' : '登录' }}
    </el-button>

    <!-- 注册链接 -->
    <div class="register-section">
      <span class="register-text">还没有账号？</span>
      <router-link to="/register" class="register-link">立即注册</router-link>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = ref<FormInstance>()
const loading = ref(false)

interface LoginForm {
  role: 'patient' | 'doctor' | 'admin'
  username: string
  password: string
  remember: boolean
}

const form = reactive<LoginForm>({
  role: 'patient',
  username: '',
  password: '',
  remember: false
})

const rules: FormRules = {
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
    // 注意：演示环境密码可以是123456
  ]
}

const handleLogin = async () => {
  if (!loginForm.value) return

  try {
    // 验证表单
    await loginForm.value.validate()
    loading.value = true

    console.log('开始登录...', form)

    // 显示演示账号提示
    if (form.password === '') {
      ElMessage.info('提示：演示账号密码均为123456')
    }

    // 调用登录方法
    const user = await authStore.login(form.username, form.password, form.role)
    
    console.log('登录成功，用户信息:', authStore.user)
    console.log('认证状态:', authStore.isAuthenticated)
    console.log('Token:', authStore.token)

    ElMessage.success('登录成功！')

    // 立即跳转，不使用setTimeout
    const targetRoute = getTargetRoute(user.role)
    console.log('准备跳转到:', targetRoute)
    router.push(targetRoute)
      
  } catch (error: any) {
    console.error('登录错误:', error)
    ElMessage.error(error.message || '登录失败，请检查用户名、密码和角色选择')
  } finally {
    loading.value = false
  }
}

// 根据角色获取目标路由
const getTargetRoute = (role: string): string => {
  switch (role) {
    case 'patient': return '/dashboard/patient'
    case 'doctor': return '/dashboard/doctor'
    case 'admin': return  '/dashboard/admin/user-management' // 管理员默认跳转到上传页面
    default: return '/dashboard/patient'
  }
}
</script>

<style scoped>
.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
}

:deep(.el-input__inner) {
  height: 48px;
  border-radius: 8px;
  border: none;
  background-color: #f9fafb;
  transition: all 0.3s;
}

:deep(.el-input__inner:focus) {
  border: none;
  background-color: #ffffff;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

:deep(.el-select .el-input__inner) {
  height: 48px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

:deep(.el-checkbox) {
  color: #6b7280;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.register-section {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.register-text {
  color: #6b7280;
  font-size: 0.9rem;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
}

.register-link:hover {
  text-decoration: underline;
}

/* 美化输入框容器 */
  :deep(.el-input) {
    background-color: #f9fafb;
    border-radius: 8px;
  }
</style>