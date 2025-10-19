<template>
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
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginForm.value) return

  try {
    // 验证表单
    await loginForm.value.validate()
    loading.value = true

    console.log('开始登录...', form)

    // 调用登录方法 - 添加错误处理
    try {
      await authStore.login(form.username, form.password, form.role)
      
      console.log('登录成功，用户信息:', authStore.user)
      console.log('认证状态:', authStore.isAuthenticated)
      console.log('Token:', authStore.token)

      ElMessage.success('登录成功！')

      // 确保用户信息存在后再跳转
      if (authStore.user && authStore.isAuthenticated) {
        const targetRoute = getTargetRoute(authStore.user.role)
        console.log('准备跳转到:', targetRoute)
        
        // 使用 setTimeout 确保状态更新完成后再跳转
        setTimeout(() => {
          router.push(targetRoute)
        }, 100)
      } else {
        console.error('用户信息或认证状态异常')
        ElMessage.error('登录状态异常，请重试')
      }
      
    } catch (loginError: any) {
      console.error('登录API错误:', loginError)
      ElMessage.error(loginError.message || '登录失败，请检查用户名和密码')
    }
    
  } catch (validationError: any) {
    console.error('表单验证失败:', validationError)
    if (validationError?.errors) {
      ElMessage.warning('请完善表单信息')
    } else {
      ElMessage.error('表单验证失败')
    }
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
  border: 1px solid #d1d5db;
  transition: all 0.3s;
}

:deep(.el-input__inner:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
</style>