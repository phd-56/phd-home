<template>
  <div class="login-layout-wrapper">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style scoped>
/* 这里是我们从 style.css 移过来的 body 样式 */
.login-layout-wrapper {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: #0a1a2e;
  position: relative;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* 科幻背景 */
.login-layout-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(0, 150, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(0, 150, 255, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, rgba(0, 150, 255, 0.05) 0%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}
</style>
