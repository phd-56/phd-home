<template>
  <div class="login-page">
    <!-- 左侧系统介绍模块 -->
    <div class="left-module">
      <div class="system-info">
        <div class="logo">
          <div class="logo-icon">AI</div>
        </div>
        <h1 class="system-title">医学影像诊断系统</h1>
        <p class="system-desc">快速安全的医学影像分析与诊断</p>
      </div>
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">
              <el-icon><Search /></el-icon>
            </div>
          <div class="feature-content">
            <h3>医疗级安全保障</h3>
            <p>符合HIPAA及国家医疗数据安全标准</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">
            <el-icon><Picture /></el-icon>
          </div>
          <div class="feature-content">
            <h3>专业影像分析</h3>
            <p>支持多模态影像处理与三维重建</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="feature-content">
            <h3>医患协同</h3>
            <p>医生患者无缝沟通，提升诊断效率</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="feature-content">
            <h3>智能报告管理</h3>
            <p>自动化诊断报告与病例跟踪</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录框模块 -->
    <div class="right-module">
      <div class="login-card">
        <!-- 角色选择 -->
        <div class="role-select">
          <el-button type="text" class="role-btn" :class="{ active: currentRole === 'doctor' }" @click="currentRole = 'doctor'">
            <el-icon><User /></el-icon>
            <span>医生</span>
          </el-button>
          <el-button type="text" class="role-btn" :class="{ active: currentRole === 'patient' }" @click="currentRole = 'patient'">
            <el-icon><UserFilled /></el-icon>
            <span>患者</span>
          </el-button>
          <el-button type="text" class="role-btn" :class="{ active: currentRole === 'admin' }" @click="currentRole = 'admin'">
            <el-icon><Setting /></el-icon>
            <span>管理员</span>
          </el-button>
        </div>

        <!-- 登录方式切换 -->
        <div class="login-tabs">
          <el-button type="text" class="tab-btn" :class="{ active: loginType === 'phone' }" @click="loginType = 'phone'">
            手机号码登录
          </el-button>
          <el-button type="text" class="tab-btn" :class="{ active: loginType === 'account' }" @click="loginType = 'account'">
            账号密码登陆
          </el-button>
        </div>

        <!-- 表单 - 手机号登录 -->
        <el-form v-if="loginType === 'phone'" ref="phoneFormRef" :model="phoneForm" :rules="phoneRules" class="login-form">
          <el-form-item prop="phone">
            <el-input v-model="phoneForm.phone" placeholder="请输入手机号码" prefix-icon="Phone" />
          </el-form-item>
          <div class="code-row">
            <el-form-item prop="code" style="width: calc(100% - 120px);">
              <el-input v-model="phoneForm.code" placeholder="请输入验证码" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="code-btn" :disabled="codeDisabled" @click="getVerificationCode">
                {{ codeText }}
              </el-button>
            </el-form-item>
          </div>
          <el-form-item class="remember-row" prop="remember">
            <el-checkbox v-model="phoneForm.remember">记住我7天</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn" block @click="handlePhoneLogin">登录系统</el-button>
          </el-form-item>
        </el-form>

        <!-- 表单 - 账号密码登录 -->
        <el-form v-else ref="accountFormRef" :model="accountForm" :rules="accountRules" class="login-form">
          <el-form-item prop="username">
            <el-input v-model="accountForm.username" placeholder="请输入账号" prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="accountForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
          </el-form-item>
          <el-form-item class="remember-row" prop="remember">
            <el-checkbox v-model="accountForm.remember">记住我7天</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn" block @click="handleAccountLogin">登录系统</el-button>
          </el-form-item>
        </el-form>

        <div class="register-link">
          未注册用户？<router-link to="/register" class="register-link-btn">立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton, ElCheckbox, ElLink, ElMessage } from 'element-plus';
import { Search, Picture, User, UserFilled, Setting, Phone, Document, Lock } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const currentRole = ref('doctor');
const loginType = ref('phone');

const phoneFormRef = ref();
const phoneForm = reactive({
  phone: '',
  code: '',
  remember: false
});

const phoneRules = reactive({
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ],
  remember: []
});

const codeDisabled = ref(false);
const codeText = ref('获取验证码');
const countdown = ref(60);

const getVerificationCode = () => {
  if (!phoneForm.phone) {
    ElMessage.error('请先输入手机号码');
    return;
  }
  codeDisabled.value = true;
  codeText.value = `重新发送(${countdown.value}s)`;
  const timer = setInterval(() => {
    countdown.value--;
    codeText.value = `重新发送(${countdown.value}s)`;
    if (countdown.value <= 0) {
      clearInterval(timer);
      countdown.value = 60;
      codeText.value = '获取验证码';
      codeDisabled.value = false;
    }
  }, 1000);
};

const accountFormRef = ref();
const accountForm = reactive({
  username: '',
  password: '',
  remember: false
});

const accountRules = reactive({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  remember: []
});

const handlePhoneLogin = async () => {
  if (!phoneFormRef.value) return;
  await phoneFormRef.value.validate();
  const result = await authStore.loginByPhone(phoneForm);
  if (result.success) {
    ElMessage.success('登录成功');
    const dashboardPath = getDashboardPath(result.user?.role);
    router.push(dashboardPath);
  } else {
    ElMessage.error(result.message || '登录失败，请检查信息');
  }
};

const handleAccountLogin = async () => {
  if (!accountFormRef.value) return;
  await accountFormRef.value.validate();
  const result = await authStore.login(accountForm);
  if (result.success) {
    ElMessage.success('登录成功');
    const dashboardPath = getDashboardPath(result.user?.role);
    router.push(dashboardPath);
  } else {
    ElMessage.error(result.message || '登录失败，请检查信息');
  }
};

const getDashboardPath = (role) => {
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
.login-page {
  display: flex;
  min-height: 100vh;
  background-color: #e6f2ff;
  justify-content: center;
  align-items: center;
  padding: 40px;
  box-sizing: border-box;
}

.left-module {
  max-width: 600px;
  margin-right: 80px;
}

.system-info {
  margin-bottom: 30px;
}

.logo {
  width: 50px;
  height: 50px;
  background-color: #007bff;
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

.system-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.system-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 0;
}

.features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.feature-icon {
  background-color: rgba(0, 123, 255, 0.1);
  color: #007bff;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-content h3 {
  font-size: 16px;
  margin-bottom: 4px;
}

.feature-content p {
  font-size: 12px;
  color: #666;
}

.right-module {
  width: 400px;
  min-width: 320px;
}

.login-card {
  width: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.role-select {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.role-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  font-size: 14px;
}

.role-btn.active {
  color: #007bff;
  font-weight: bold;
}

.role-btn .el-icon {
  font-size: 20px;
  margin-bottom: 6px;
}

.login-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 14px;
}

.tab-btn {
  margin: 0 8px;
  color: #666;
}

.tab-btn.active {
  color: #007bff;
  font-weight: bold;
}

.code-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.code-btn {
  width: 90px;
  font-size: 13px;
}

.remember-row {
  margin-bottom: 16px !important;
  font-size: 13px;
}

.login-btn {
  height: 40px;
  margin-bottom: 12px;
  font-size: 14px;
}

.register-link {
  text-align: center;
  font-size: 13px;
}

@media (max-width: 992px) {
  .login-page {
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  .left-module {
    margin-right: 0;
    margin-bottom: 40px;
    text-align: center;
  }
  .features {
    grid-template-columns: 1fr;
  }
  .feature-item {
    justify-content: center;
  }
}
</style>