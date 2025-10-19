<template>
  <el-form 
    :model="form" 
    :rules="rules" 
    ref="registerForm" 
    class="register-form"
    @submit.prevent="handleRegister"
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

    <!-- 姓名 -->
    <div class="form-group">
      <label class="form-label">姓名</label>
      <el-input
        v-model="form.fullName"
        placeholder="请输入真实姓名"
        size="large"
        class="form-control"
      />
    </div>

    <!-- 用户名 -->
    <div class="form-group">
      <label class="form-label">用户名</label>
      <el-input
        v-model="form.username"
        placeholder="请输入用户名"
        size="large"
        class="form-control"
      />
    </div>

    <!-- 邮箱 -->
    <div class="form-group">
      <label class="form-label">邮箱</label>
      <el-input
        v-model="form.email"
        placeholder="请输入邮箱地址"
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

    <!-- 确认密码 -->
    <div class="form-group">
      <label class="form-label">确认密码</label>
      <el-input
        v-model="form.confirmPassword"
        type="password"
        placeholder="请再次输入密码"
        size="large"
        class="form-control"
        show-password
      />
    </div>

    <!-- 注册按钮 -->
    <el-button 
      type="primary" 
      size="large" 
      class="register-btn"
      :loading="loading"
      @click="handleRegister"
    >
      {{ loading ? '注册中...' : '注册' }}
    </el-button>

    <!-- 登录链接 -->
    <div class="login-section">
      <span class="login-text">已有账号？</span>
      <router-link to="/login" class="login-link">立即登录</router-link>
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

const registerForm = ref<FormInstance>()
const loading = ref(false)

interface RegisterForm {
  role: 'patient' | 'doctor' | 'admin'
  fullName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

const form = reactive<RegisterForm>({
  role: 'patient',
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  fullName: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerForm.value) return

  try {
    await registerForm.value.validate()
    loading.value = true

    const userData = {
      username: form.username,
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      role: form.role
    }
    
    await authStore.register(userData)
    
    ElMessage.success('注册成功！')
    router.push('/login')
    
  } catch (error: any) {
    if (error?.errors) {
      ElMessage.warning('请完善表单信息')
    } else {
      ElMessage.error(error.message || '注册失败，请重试')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-form {
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

.register-btn {
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

.register-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.login-section {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.login-text {
  color: #6b7280;
  font-size: 0.9rem;
}

.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
}

.login-link:hover {
  text-decoration: underline;
}
</style>