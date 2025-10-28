<template>
  <div class="register-form-wrapper">
    <el-form 
      :model="form" 
      :rules="rules" 
      ref="registerForm" 
      class="register-form"
      @submit.prevent="handleRegister"
    >

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
    <div class="form-actions">
      <el-button 
        class="btn-secondary"
        size="large"
        @click="$emit('back')"
      >
        上一步
      </el-button>
      <el-button 
        type="primary" 
        size="large" 
        class="register-btn btn-primary"
        :loading="loading"
        @click="handleRegister"
      >
        {{ loading ? '注册中...' : '下一步' }}
      </el-button>
    </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  role: 'patient' | 'doctor' | 'admin'
}>()

const emit = defineEmits<{
  next: []
  back: []
}>()

const authStore = useAuthStore()

const registerForm = ref<FormInstance>()
const loading = ref(false)

interface RegisterFormData {
  fullName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

const form = reactive<RegisterFormData>({
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
      role: props.role
    }
    
    await authStore.register(userData)
    ElMessage.success('注册成功！')
    emit('next')
    
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
.register-form-wrapper {
  flex: 1;
}

.register-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1f2937;
  font-size: 14px;
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

  border: none;
  background-color: #f9fafb;
  transition: all 0.3s;
}

:deep(.el-input__inner:focus) {
  border: none;
  background-color: #ffffff;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

/* 美化输入框容器 */
:deep(.el-input) {
  background-color: #f9fafb;
  border-radius: 8px;

}

:deep(.el-input.is-focus .el-input__wrapper) {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.btn-secondary {
  flex: 1;
  background: #f3f4f6;
  color: #1f2937;
  border: 1px solid #e5e7eb;
}

.btn-primary {
  flex: 1;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

:deep(.el-button--primary:hover) {
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
}

.register-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
}
</style>