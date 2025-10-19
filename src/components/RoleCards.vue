<template>
  <section class="py-16 bg-white" id="roles">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-slate-800 mb-4">选择您的角色</h2>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          根据您的身份选择对应入口，获取专属服务
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 医生入口 -->
        <div class="glassmorphism p-8 card-hover text-center">
          <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-6">
            <i class="fas fa-user-md text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-4">医生入口</h3>
          <p class="text-slate-600 mb-6">
            专业医生使用AI辅助诊断工具，提高诊断效率和准确率
          </p>
          <router-link 
            to="/login?role=doctor" 
            class="px-6 py-2 rounded-lg bg-gradient-primary text-white font-medium hover:shadow-md transition-all inline-block"
          >
            医生登录
          </router-link>
        </div>
        
        <!-- 患者入口 -->
        <div class="glassmorphism p-8 card-hover text-center">
          <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-6">
            <i class="fas fa-procedures text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-4">患者入口</h3>
          <p class="text-slate-600 mb-6">
            患者上传影像资料，获取AI辅助诊断结果和康复建议
          </p>
          <router-link 
            to="/login?role=patient" 
            class="px-6 py-2 rounded-lg bg-gradient-primary text-white font-medium hover:shadow-md transition-all inline-block"
          >
            患者登录
          </router-link>
        </div>
        
        <!-- 管理员入口 -->
        <div class="glassmorphism p-8 card-hover text-center">
          <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-6">
            <i class="fas fa-cogs text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-4">管理员入口</h3>
          <p class="text-slate-600 mb-6">
            系统管理员进行用户管理、数据维护和系统配置
          </p>
          <router-link 
            to="/login?role=admin" 
            class="px-6 py-2 rounded-lg bg-gradient-primary text-white font-medium hover:shadow-md transition-all inline-block"
          >
            管理员登录
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped>
.glassmorphism {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(30, 83, 191, 0.1);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #1e83e6 0%, #3b82f6 100%);
}
</style>