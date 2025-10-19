<template>
  <LoginLayout>
    <div class="login-form-wrapper">
      <div class="form-header">
        <h1 class="text-2xl font-bold text-center text-slate-800 mb-2">AI 骨龄诊断系统</h1>
        <p class="text-center text-gray-600 mb-8">欢迎回来，请登录您的账户</p>
      </div>
      
      <LoginForm />
    </div>
  </LoginLayout>
</template>

<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue'
import LoginLayout from '@/components/LoginLayout.vue'
</script>

<style scoped>
.login-form-wrapper {
  width: 100%;
}

.form-header {
  margin-bottom: 2rem;
}
</style>