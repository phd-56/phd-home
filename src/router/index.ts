import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue')
    },
    {
      path: '/upload',
      name: 'Upload',
      component: () => import('@/views/Upload.vue'),
      meta: { requiresAuth: true }
    },

    // 仪表板路由组
    {
      path: '/dashboard',
      meta: { requiresAuth: true },
      children: [
        // 患者和医生使用简单布局
        {
          path: 'patient',
          name: 'PatientDashboard',
          component: () => import('@/views/PatientDashboard.vue'),
          meta: { role: 'patient' }
        },
        {
          path: 'doctor',
          name: 'DoctorDashboard',
          component: () => import('@/views/DoctorDashboard.vue'),
          meta: { role: 'doctor' }
        },
        // 管理员使用带侧边栏的布局
        {
          path: 'admin',
          component: () => import('@/components/AppLayout.vue'),
          meta: { role: 'admin' },
          children: [
            {
              path: 'user-management',
              name: 'UserManagement',
              component: () => import('@/views/UserManagement.vue')
            },
            {
              path: 'upload',
              name: 'AdminUpload',
              component: () => import('@/views/Upload.vue')
            }
            // 暂时只启用必要的路由组件
          ]
        }
      ]
    },
    // 病例管理路由
    {
      path: '/cases',
      name: 'CaseManagement',
      component: () => import('@/views/case-management/CaseList.vue'),
      meta: { requiresAuth: true, role: 'doctor' }
    },
    {
      path: '/cases/:caseId',
      name: 'CaseDetail',
      component: () => import('@/views/case-management/CaseDetail.vue'),
      meta: { requiresAuth: true, role: 'doctor' },
      props: true
    }
  ]
})

// 简化路由守卫 - 移除根路径重定向
router.beforeEach(async (to, from, next) => {
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()

  console.log('🚀 路由守卫调试信息:')
  console.log('- 目标路由:', to.path)
  console.log('- 认证状态:', authStore.isAuthenticated)
  console.log('- 用户信息:', authStore.user)

  // 根路径 '/' 始终显示首页，不做重定向
  if (to.path === '/') {
    console.log('访问首页，直接显示')
    next()
    return
  }

  // 如果需要认证但未认证，跳转到登录页
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('未认证，跳转到登录页')
    next('/login')
    return
  }

  // 检查角色权限
  if (to.meta.requiresAuth && to.meta.role && authStore.user?.role !== to.meta.role) {
    console.log('角色权限不足，跳转到首页')
    next('/')
    return
  }

  // 其他情况直接放行
  console.log('允许访问:', to.path)
  next()
})

export default router