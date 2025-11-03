import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import doctorRoutes from './doctorRoutes'
import adminRoutes from './adminRoutes'
// 静态导入Login组件以测试加载问题
import LoginView from '@/views/Login.vue'



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
      component: () => import('@/components/LoginLayout.vue'),
      children: [
        {
          path: '',
          name: 'LoginView',
          component: LoginView
        }
      ]
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/components/LoginLayout.vue'),
      children: [
        {
          path: '',
          name: 'RegisterView',
          component: () => import('@/views/Register.vue')
        }
      ]
    },
    // {      path: '/upload',      name: 'Upload',      component: () => import('@/views/Upload.vue'),      meta: { requiresAuth: true }    },
    {
      path: '/report-preview',
      name: 'ReportPreview',
      component: () => import('@/views/ReportPreview.vue')
    },

    // 独立的知识库路由
    {
      path: '/dashboard/patient/knowledge',
      name: 'PatientKnowledge',
      component: () => import('@/views/patient/PatientKnowledgeBase.vue'),
      meta: { role: 'patient', requiresAuth: true }
    },

    // 仪表板路由组
    {
      path: '/dashboard',
      meta: { requiresAuth: true },
      children: [
        // 患者仪表板
        {
          path: 'patient',
          name: 'PatientDashboard',
          component: () => import('@/views/PatientDashboard.vue'),
          meta: { role: 'patient', requiresAuth: true },
          children: [
            {
              path: 'reports',
              name: 'PatientReports',
              component: () => import('@/views/patient/PatientReports.vue'),
              meta: { role: 'patient', requiresAuth: true }
            },
            {
              path: 'appointment',
              name: 'PatientAppointment',
              component: () => import('@/views/patient/PatientAppointment.vue'),
              meta: { role: 'patient', requiresAuth: true }
            },
            {
              path: 'settings',
              name: 'PatientSettings',
              component: () => import('@/views/patient/PatientSettings.vue'),
              meta: { role: 'patient', requiresAuth: true }
            },
            {
              path: 'help',
              name: 'PatientHelp',
              component: () => import('@/views/patient/PatientHelp.vue'),
              meta: { role: 'patient', requiresAuth: true }
            },
            // 保留原有的路由以兼容性
            {
              path: 'image-upload',
              name: 'PatientImageUpload',
              component: () => import('@/views/patient/PatientImageUpload.vue'),
              meta: { role: 'patient', requiresAuth: true }
            },
            {
              path: 'knowledge-base',
              name: 'PatientKnowledgeBase',
              component: () => import('@/views/patient/PatientKnowledgeBase.vue'),
              meta: { role: 'patient', requiresAuth: true }
            },
            {
              path: 'feedback',
              name: 'PatientFeedback',
              component: () => import('@/views/patient/PatientFeedback.vue'),
              meta: { role: 'patient', requiresAuth: true }
            },
            {
              path: 'image-history',
              name: 'PatientImageHistory',
              component: () => import('@/views/patient/ImageHistory.vue'),
              meta: { role: 'patient', requiresAuth: true }
            }
          ]
        },

        // 医生仪表板
        {
          path: 'doctor',
          component: () => import('@/components/AppLayout.vue'),
          meta: { role: 'doctor' },
          children: [
            {
              path: '',
              name: 'DoctorDashboardMain',
              component: () => import('@/views/DoctorDashboard.vue')
            },
            ...doctorRoutes
          ]
        },

        // 管理员仪表板 - 使用 adminRoutes 配置
        {
          path: 'admin',
          component: () => import('@/components/AppLayout.vue'),
          meta: { requiresAuth: true, role: 'admin' },
          redirect: '/dashboard/admin/dashboard',
          children: [
            // 管理员首页
            {
              path: '',
              name: 'AdminDashboard',
              component: () => import('@/views/AdminDashboard.vue')
            },
            {
              path: 'dashboard',
              name: 'admin.dashboard',
              component: () => import('@/views/AdminDashboard.vue')
            },

            // 用户管理
            {
              path: 'user-management',
              name: 'admin.userManagement',
              component: () => import('@/views/UserManagement.vue'),
              meta: {
                requiresAuth: true,
                role: 'admin',
                title: '用户管理',
                icon: 'user',
                breadcrumb: '用户管理'
              }
            },
            {
              path: 'data-analysis',
              name: 'admin.dataAnalysis',
              component: () => import('@/views/admin/DataAnalysis.vue')
            },
            {
              path: 'doctor-data',
              name: 'admin.doctorData',
              component: () => import('@/views/admin/DoctorData.vue')
            },
            {
              path: 'patient-data',
              name: 'admin.patientData',
              component: () => import('@/views/admin/PatientData.vue')
            },
            {
              path: 'feedback-data',
              name: 'admin.feedbackData',
              component: () => import('@/views/admin/FeedbackData.vue')
            },
            {
              path: 'roles-permissions',
              name: 'admin.rolesPermissions',
              component: () => import('@/views/admin/RolesPermissions.vue')
            },
            {
              path: 'system-config',
              name: 'admin.systemConfig',
              component: () => import('@/views/admin/SystemConfig.vue')
            },
            // 系统监控路由
            {
              path: 'system-monitoring',
              name: 'admin.systemMonitoring',
              component: () => import('@/views/admin/SystemMonitor.vue'),
              meta: {
                requiresAuth: true,
                role: 'admin',
                title: '系统监控',
                icon: 'monitor',
                breadcrumb: '系统监控'
              }
            },
            // 操作审计日志路由
            {
              path: 'audit-logs',
              name: 'admin.auditLogs',
              component: () => import('@/views/admin/AuditLogs.vue'),
              meta: {
                requiresAuth: true,
                role: 'admin',
                title: '操作审计日志',
                icon: 'document',
                breadcrumb: '操作审计日志'
              }
            }
          ]
        }
      ]
    },

    // 独立路由（不需要仪表板布局）
    {
      path: '/diagnosis',
      name: 'PublicDiagnosis',
      component: () => import('@/views/diagnosis/ImageUpload.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/diagnosis/result',
      name: 'PublicDiagnosisResult',
      component: () => import('@/views/diagnosis/DiagnosisResult.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cases',
      name: 'PublicCases',
      component: () => import('@/views/case-management/CaseList.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cases/create',
      name: 'PublicCaseCreate',
      component: () => import('@/views/case-management/CaseCreate.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cases/:id',
      name: 'PublicCaseDetail',
      component: () => import('@/views/case-management/CaseDetail.vue'),
      meta: { requiresAuth: true }
    },

    // 医生独立路由
    {
      path: '/doctor/ai-diagnosis',
      name: 'PublicAIDiagnosis',
      component: () => import('@/views/doctor/AIDiagnosis.vue'),
      meta: { requiresAuth: true, role: 'doctor' }
    },
    {
      path: '/doctor/knowledge-base',
      name: 'PublicKnowledgeBase',
      component: () => import('@/views/doctor/KnowledgeBase.vue'),
      meta: { requiresAuth: true, role: 'doctor' }
    },
    {
      path: '/doctor/feedback',
      name: 'PublicFeedbackHistory',
      component: () => import('@/views/doctor/FeedbackHistory.vue'),
      meta: { requiresAuth: true, role: 'doctor' }
    },

    // 404 页面
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/Home.vue')
    }
  ]
})

// 路由守卫
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

  // 检查是否需要认证 - 检查当前路由和父路由的 meta
  const requiresAuthRoute = to.matched.find(record => record.meta.requiresAuth)
  if (requiresAuthRoute && !authStore.isAuthenticated) {
    console.log('未认证，跳转到登录页')
    next('/login')
    return
  }

  // 检查角色权限 - 检查当前路由和父路由的 meta
  const roleRoute = to.matched.find(record => record.meta.role)
  if (roleRoute) {
    const requiredRole = roleRoute.meta.role
    if (requiredRole && authStore.user?.role !== requiredRole) {
      console.log('角色权限不足，跳转到首页')
      console.log('- 需要角色:', requiredRole)
      console.log('- 当前用户角色:', authStore.user?.role)
      console.log('- 目标路由:', to.path)
      next('/')
      return
    }
  }

  // 其他情况直接放行
  console.log('允许访问:', to.path)
  next()
})

export default router