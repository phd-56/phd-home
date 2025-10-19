<template>
  <LoginLayout>
    <div class="register-form-wrapper">
      <div class="form-header">
        <h1 class="text-2xl font-bold text-center text-slate-800 mb-2">用户注册</h1>
        <p class="text-center text-gray-600 mb-8">创建您的账户</p>
      </div>
      
      <RegisterForm />
    </div>
  </LoginLayout>
</template>

<script setup lang="ts">
import RegisterForm from '@/components/RegisterForm.vue'
import LoginLayout from '@/components/LoginLayout.vue'
</script>

<style scoped>
.register-form-wrapper {
  width: 100%;
}

.form-header {
  margin-bottom: 2rem;
}
</style>