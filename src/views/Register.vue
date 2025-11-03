<template>
  <div class="cards-wrapper">
    <div class="blue-card-container">
      <div class="blue-card">
        <form @submit.prevent="handleRegister" class="register-form">
          <h1>REGISTER</h1>
          <div class="input-group">
            <label>用户名</label>
            <input type="text" v-model="form.username" placeholder="请输入用户名" />
          </div>
          <div class="input-group">
            <label>邮箱</label>
            <input type="email" v-model="form.email" placeholder="请输入邮箱" />
          </div>
          <div class="input-group">
            <label>密码</label>
            <input type="password" v-model="form.password" placeholder="请输入密码" />
          </div>
          <div class="input-group">
            <label>确认密码</label>
            <input type="password" v-model="form.confirmPassword" placeholder="请再次输入密码" />
          </div>
          <button type="submit" class="submit-btn">注册</button>
        </form>
      </div>
    </div>

    <div class="white-card-container">
      <div class="white-card">
        <div class="white-card-column left">
        </div>
        <div class="white-card-column right">
          <h2>欢迎来到</h2>
          <h3>BoneVersion AI</h3>
          <div class="image-wrapper stitch-wrapper">
            <img :src="stitchImage" alt="stitch" />
          </div>
          <p>已有账号</p>
          <router-link to="/login" class="action-btn" id="signIn">去登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import stitchImage from '@/assets/images/stitch.png';

const router = useRouter();

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const handleRegister = async () => {
  if (!form.username || !form.email || !form.password || !form.confirmPassword) {
    ElMessage.error('请填写完整信息');
    return;
  }

  if (form.password !== form.confirmPassword) {
    ElMessage.error('两次输入的密码不一致');
    return;
  }

  if (form.password.length < 6) {
    ElMessage.error('密码长度至少6位');
    return;
  }

  // 这里可以调用注册 API
  ElMessage.success('注册成功，请登录');
  router.push('/login');
};
</script>

<style scoped>
/* 1. 导入我们创建的公共样式 */
@import '@/assets/login-cards.css';

/* 2. 只定义这个页面特有的样式：蓝色卡片在左侧 */
.blue-card-container {
  transform: translate(-150px, 0);
}
</style>
