import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import doctorRoutes from './doctorRoutes'
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
      component: LoginView
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue')
    },
    // {      path: '/upload',      name: 'Upload',      component: () => import('@/views/Upload.vue'),      meta: { requiresAuth: true }    },
    {
      path: '/report-preview',
      name: 'ReportPreview',
      component: () => import('@/views/ReportPreview.vue')
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
          component: () => import('@/views/DoctorDashboard.vue'),
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

        // 管理员仪表板
        {
          path: 'admin',
          component: () => import('@/components/AppLayout.vue'),
          meta: { role: 'admin' },
          children: [
            // 管理员首页
            {
              path: '',
              name: 'AdminDashboard',
              component: () => import('@/views/AdminDashboard.vue')
            },

            // 用户管理
            {
              path: 'user-management',
              name: 'UserManagement',
              component: () => import('@/views/UserManagement.vue')
            },

            // 上传功能
            // {              path: 'upload',              name: 'AdminUpload',              component: () => import('@/views/Upload.vue')            },

            // 诊断相关路由
            {
              path: 'diagnosis',
              name: 'AdminDiagnosis',
              component: () => import('@/views/diagnosis/ImageUpload.vue')
            },
            {
              path: 'diagnosis/result',
              name: 'AdminDiagnosisResult',
              component: () => import('@/views/diagnosis/DiagnosisResult.vue')
            },
            {
              path: 'diagnosis/image-viewer',
              name: 'AdminImageViewer',
              component: () => import('@/views/diagnosis/ImageViewer.vue')
            },

            // 病例管理路由
            {
              path: 'cases',
              name: 'AdminCases',
              component: () => import('@/views/case-management/CaseList.vue')
            },
            {
              path: 'cases/create',
              name: 'AdminCaseCreate',
              component: () => import('@/views/case-management/CaseCreate.vue')
            },
            {
              path: 'cases/:id',
              name: 'AdminCaseDetail',
              component: () => import('@/views/case-management/CaseDetail.vue')
            },
            // 病例管理路由 - 注释掉因为文件不存在
            // {
            //   path: 'cases/import',
            //   name: 'AdminCaseImport',
            //   component: () => import('@/views/case-management/HisImport.vue')
            // },
            {
              path: 'cases/document-upload',
              name: 'AdminDocumentUpload',
              component: () => import('@/views/case-management/DocumentUpload.vue')
            },

            // 知识库路由
            {
              path: 'knowledge',
              name: 'AdminKnowledge',
              component: () => import('@/views/doctor/KnowledgeBase.vue')
            },

            // 报告路由
            {
              path: 'reports',
              name: 'AdminReports',
              component: () => import('@/views/ReportPreview.vue')
            },

            // 系统监控路由
            {
              path: 'system-monitor',
              name: 'SystemMonitor',
              component: () => import('@/views/admin/SystemMonitor.vue')
            },
            {
              path: 'system-monitoring',
              name: 'SystemMonitoring',
              component: () => import('@/views/admin/SystemMonitoring.vue')
            },

            // 数据备份路由
            {
              path: 'data-backup',
              name: 'DataBackup',
              component: () => import('@/views/admin/DataBackup.vue')
            },
            {
              path: 'backup-management',
              name: 'BackupManagement',
              component: () => import('@/views/admin/BackupManagement.vue')
            },
            {
              path: 'restore-operation',
              name: 'RestoreOperation',
              component: () => import('@/views/admin/RestoreOperation.vue')
            },

            // 审计日志路由
            {
              path: 'audit-logs',
              name: 'AuditLogs',
              component: () => import('@/views/admin/AuditLogs.vue')
            },

            // 反馈路由
            {
              path: 'feedback',
              name: 'AdminFeedback',
              component: () => import('@/views/Feedback.vue')
            },

            // 模型优化路由
            {
              path: 'model-optimization',
              name: 'ModelOptimization',
              component: () => import('@/views/admin/ModelOptimization.vue')
            },
            {
              path: 'optimization-management',
              name: 'OptimizationManagement',
              component: () => import('@/views/admin/OptimizationManagement.vue')
            },
            {
              path: 'model-optimization-comparison',
              name: 'ModelOptimizationComparison',
              component: () => import('@/views/admin/ModelOptimizationComparison.vue')
            },
            {
              path: 'model-performance',
              name: 'ModelPerformance',
              component: () => import('@/views/admin/ModelPerformance.vue')
            },

            // 告警设置路由
            {
              path: 'alarm-settings',
              name: 'AlarmSettings',
              component: () => import('@/views/admin/AlarmSettings.vue')
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

  // 如果需要认证但未认证，跳转到登录页
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('未认证，跳转到登录页')
    next('/login')
    return
  }

  // 检查角色权限
  if (to.meta.requiresAuth && to.meta.role && authStore.user?.role !== to.meta.role) {
    console.log('角色权限不足，跳转到首页')
    // 移除了 ElMessage 的使用，因为它在路由守卫中不可用
    // 可以在跳转后通过其他方式显示提示，比如在目标页面中显示
    next('/')
    return
  }

  // 其他情况直接放行
  console.log('允许访问:', to.path)
  next()
})

export default router