<template>
  <div class="container">
    <!-- 左侧内容 -->
    <div class="left-section">
      <div class="logo">固</div>
      <h1>医学影像诊断系统</h1>
      <p>连接医患的专业影像诊断平台，提供便捷的病例管理与诊断服务</p>
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">🔒</div>
          <div class="feature-content">
            <h3>医疗级安全保障</h3>
            <p>符合HIPAA及国家医疗数据安全标准</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📊</div>
          <div class="feature-content">
            <h3>专业影像分析</h3>
            <p>支持多模态影像处理与三维重建</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">👥</div>
          <div class="feature-content">
            <h3>医患协同平台</h3>
            <p>医生患者无缝沟通，提升诊断效率</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📋</div>
          <div class="feature-content">
            <h3>智能报告管理</h3>
            <p>自动化诊断报告与病例分析</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧登录表单 -->
    <div class="right-section">
      <div class="login-card">
        <h2>账号登录</h2>
        <p>请选择您的身份并输入账号信息</p>
        <!-- 身份选择 -->
        <div class="identity-selector">
          <button :class="['identity-btn', role==='doctor' ? 'active' : '']" @click="setRole('doctor')">
            <span class="identity-icon">👨‍⚕️</span>
            <span>医生</span>
          </button>
          <button :class="['identity-btn', role==='patient' ? 'active' : '']" @click="setRole('patient')">
            <span class="identity-icon">👤</span>
            <span>患者</span>
          </button>
          <button :class="['identity-btn', role==='admin' ? 'active' : '']" @click="setRole('admin')">
            <span class="identity-icon">⚙️</span>
            <span>管理员</span>
          </button>
        </div>
        <!-- 登录切换 -->
        <div style="display:flex; gap:12px; margin-bottom:28px;">
          <button :class="['identity-btn', loginType==='phone' ? 'active' : '']" style="flex:1;" @click="loginType='phone'">手机号码登录</button>
          <button :class="['identity-btn', loginType==='account' ? 'active' : '']" style="flex:1;" @click="loginType='account'">账号密码登录</button>
        </div>
        <form @submit.prevent="handleLogin">
          <template v-if="loginType==='phone'">
          <!-- 手机号码 -->
          <div class="form-group">
            <label class="form-label">手机号码</label>
            <div class="form-input-wrapper">
              <span class="phone-prefix">📱 +86</span>
              <input type="tel" class="form-input with-prefix" v-model="phone" placeholder="请输入手机号码">
            </div>
          </div>
          <!-- 验证码 -->
          <div class="form-group">
            <label class="form-label">验证码</label>
            <div class="verify-code-wrapper">
              <input type="text" class="form-input" v-model="code" placeholder="请输入验证码">
              <button class="verify-btn" type="button" :disabled="codeBtnDisabled" @click="onSendCode">{{codeBtnText}}</button>
            </div>
          </div>
          </template>
          <template v-else>
            <div class="form-group">
              <label class="form-label">账号</label>
              <input type="text" class="form-input" v-model="username" placeholder="请输入账号">
            </div>
            <div class="form-group">
              <label class="form-label">密码</label>
              <input type="password" class="form-input" v-model="password" placeholder="请输入密码">
            </div>
          </template>
          <!-- 记住我 -->
          <div class="checkbox-group">
            <input type="checkbox" id="remember" v-model="remember">
            <label for="remember">记住我 7 天</label>
          </div>
          <!-- 登录按钮 -->
          <button class="login-btn" type="submit">登录系统</button>
        </form>
        <!-- 协议 -->
        <div class="agreement">
          登录即表示同意用户协议和<a href="#">隐私政策</a>
        </div>
        <!-- 其他登录方式 -->
        <div class="other-login-title">其他登录方式</div>
        <div class="other-login-methods">
          <button class="login-method" title="微信登录">💬</button>
          <button class="login-method" title="支付宝登录">👤</button>
          <button class="login-method" title="一卡通登录">🎫</button>
        </div>
        <!-- 注册链接 -->
        <div class="register-link">
          还没有账号？<a href="#" @click.prevent="goRegister">立即注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 身份和切换
const role = ref('doctor');
const loginType = ref('phone');
function setRole(r) { role.value = r; }

// 登录表单数据
const phone = ref('');
const code = ref('');
const username = ref('');
const password = ref('');
const remember = ref(false);

// 验证码倒计时
const codeBtnText = ref('获取验证码');
const codeBtnDisabled = ref(false);
let timer = null;
function onSendCode() {
  if (!/^1\d{10}$/.test(phone.value)) {
    alert('请输入合法的手机号');
    return;
  }
  codeBtnDisabled.value = true;
  let count = 60;
  codeBtnText.value = `已发送 (${count}s)`;
  timer = setInterval(() => {
    count--;
    codeBtnText.value = `已发送 (${count}s)`;
    if (count <= 0) {
      clearInterval(timer);
      codeBtnDisabled.value = false;
      codeBtnText.value = '获取验证码';
    }
  }, 1000);
}

// 登录跳转逻辑
const router = useRouter();
function handleLogin() {
  if (loginType.value==='phone') {
    if (!phone.value || !code.value) { alert('请填写完整信息'); return; }
    alert('登录成功！');
  } else {
    if (!username.value || !password.value) { alert('请填写完整信息'); return; }
    alert('登录成功！');
  }
}
function goRegister() {
  router.push('/register');
}
</script>

<style scoped>
/* 直接粘贴你的 HTML CSS 部分覆盖 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #e8f0ff 0%, #f5f7ff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.container {
  display: flex;
  gap: 60px;
  max-width: 1200px;
  width: 100%;
  align-items: center;
}
.left-section {
  flex: 1;
  min-width: 300px;
}
.logo {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
}
.left-section h1 {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 12px;
  font-weight: 700;
}
.left-section p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 40px;
  line-height: 1.6;
}
.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.feature-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}
.feature-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
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
.right-section {
  flex: 1;
  min-width: 300px;
}
.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}
.login-card h2 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 8px;
  font-weight: 700;
}
.login-card > p {
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 24px;
}
.identity-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}
.identity-btn {
  flex: 1;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}
.identity-btn:hover {
  border-color: #2563eb;
  background: #f0f9ff;
}
.identity-btn.active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}
.identity-icon {
  font-size: 24px;
}
.form-group {
  margin-bottom: 16px;
}
.form-label {
  display: block;
  font-size: 13px;
  color: #374151;
  margin-bottom: 8px;
  font-weight: 500;
}
.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}
.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
.phone-prefix {
  position: absolute;
  left: 14px;
  color: #9ca3af;
  font-size: 14px;
  pointer-events: none;
}
.form-input.with-prefix {
  padding-left: 50px;
}
.verify-code-wrapper {
  display: flex;
  gap: 8px;
}
.verify-code-wrapper .form-input {
  flex: 1;
}
.verify-btn {
  padding: 12px 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  font-weight: 500;
}
.verify-btn:hover {
  background: #e5e7eb;
}
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #6b7280;
}
.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #2563eb;
}
.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}
.login-btn:hover {
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
  transform: translateY(-2px);
}
.agreement {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 24px;
}
.agreement a {
  color: #2563eb;
  text-decoration: none;
}
.agreement a:hover {
  text-decoration: underline;
}
.other-login-title {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 16px;
}
.other-login-methods {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}
.login-method {
  width: 50px;
  height: 50px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 24px;
}
.login-method:hover {
  border-color: #2563eb;
  background: #f0f9ff;
}
.register-link {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
}
.register-link a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}
.register-link a:hover {
  text-decoration: underline;
}
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 40px;
  }
  .left-section h1 {
    font-size: 24px;
  }
  .login-card {
    padding: 30px 20px;
  }
  .features {
    grid-template-columns: 1fr;
  }
}
</style>