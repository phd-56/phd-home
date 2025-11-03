<template>
  <div class="cards-wrapper">
    <div class="blue-card-container">
      <div class="blue-card">
        <form @submit.prevent="handleLogin" class="login-form">
          <h1>LOGIN</h1>
          <div class="input-group">
            <label>用户名</label>
            <input type="text" v-model="username" placeholder="请输入用户名" />
          </div>
          <div class="input-group">
            <label>密码</label>
            <input type="password" v-model="password" placeholder="请输入密码" />
          </div>
          <button type="submit" class="submit-btn">登录</button>
        </form>
      </div>
    </div>

    <div class="white-card-container">
      <div class="white-card">
        <div class="white-card-column left">
          <h2>欢迎来到</h2>
          <h3>BoneVersion AI</h3>
          <div class="image-wrapper skeleton-wrapper">
            <img :src="skeletonImage" alt="skeleton" />
          </div>
          <p>没有账号？</p>
          <router-link to="/register" class="action-btn" id="signUp">去注册</router-link>
        </div>
        <div class="white-card-column right">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';
import skeletonImage from '@/assets/images/skeleton.png';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');

const handleLogin = async () => {
  if (!username.value || !password.value) {
    ElMessage.error('请填写完整信息');
    return;
  }

  const result = await authStore.login({
    username: username.value,
    password: password.value
  });

  if (result.success) {
    ElMessage.success('登录成功');
    const dashboardPath = getDashboardPath(result.user?.role);
    router.push(dashboardPath);
  } else {
    ElMessage.error(result.message || '登录失败，请检查信息');
  }
};

const getDashboardPath = (role?: string) => {
  switch (role) {
    case 'patient':
      return '/dashboard/patient';
    case 'doctor':
      return '/dashboard/doctor';
    case 'admin':
      return '/dashboard/admin';
    default:
      return '/dashboard/patient';
  }
};
</script>

<style scoped>
/* 1. 导入我们创建的公共样式 */
@import '@/assets/login-cards.css';

/* 2. 只定义这个页面特有的样式：蓝色卡片在右侧 */
.blue-card-container {
  transform: translate(150px, 0);
}
</style>
