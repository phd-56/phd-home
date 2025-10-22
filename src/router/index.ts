<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { createRouter, createWebHistory } from 'vue-router';
import adminRoutes from './adminRoutes';
import doctorRoutes from './doctorRoutes';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...adminRoutes,
    ...doctorRoutes,
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
            },
            // 这些路由引用了不存在的文件，已注释掉
            /*
            {              path: 'diagnosis',              name: 'AdminDiagnosis',              component: () => import('@/views/Diagnosis.vue')            },            {              path: 'cases',              name: 'AdminCases',              component: () => import('@/views/Cases.vue')            },            {              path: 'knowledge',              name: 'AdminKnowledge',              component: () => import('@/views/Knowledge.vue')            },            {              path: 'reports',              name: 'AdminReports',              component: () => import('@/views/Reports.vue')            },
            */
            // 这些路由已在adminRoutes.ts中正确配置，此处注释以避免冲突
            /*
            {              path: 'system-monitor',              name: 'SystemMonitor',              component: () => import('@/views/admin/SystemMonitor.vue')            },            {              path: 'data-backup',              name: 'DataBackup',              component: () => import('@/views/admin/BackupManagement.vue')            },            {              path: 'audit-logs',              name: 'AuditLogs',              component: () => import('@/views/admin/AuditLogs.vue')            },            {              path: 'feedback',              name: 'AdminFeedback',              component: null            },
            */
            // 这些路由已在adminRoutes.ts中配置
          ]
        }
      ]
    }
  ]
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  console.log('🚀 路由守卫调试信息:');
  console.log('- 目标路由:', to.path);
  console.log('- 认证状态:', authStore.isAuthenticated);
  console.log('- 用户信息:', authStore.user);

  // 根路径 '/' 始终显示首页
  if (to.path === '/') {
    console.log('访问首页，直接显示');
    next();
    return;
  }

  // 如果需要认证但未认证，跳转到登录页
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('未认证，跳转到登录页');
    next('/login');
    return;
  }

  // 检查角色权限
  if (to.meta.requiresAuth && to.meta.role && authStore.user?.role !== to.meta.role) {
    console.log('角色权限不足，跳转到首页');
    next('/');
    return;
  }

  // 其他情况直接放行
  console.log('允许访问:', to.path);
  next();
});
=======
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
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
    component: () => import('@/views/Upload.vue')
  },

  // 医生仪表板路由 - 使用 DoctorLayout 作为布局
  {
    path: '/doctor',
    name: 'Doctor',
    redirect: '/doctor/cases',
    component: () => import('@/components/doctor/DoctorLayout.vue'),
    meta: { requiresAuth: true, role: 'doctor' },
    children: [
      {
        path: 'cases',
        name: 'CaseManagement',
        component: () => import('@/components/doctor/CaseManagement.vue'),
        meta: { title: '病例管理' }
      },
      {
        path: 'images',
        name: 'ImageViewer',
        component: () => import('@/components/doctor/ImageViewer.vue'),
        meta: { title: '影像查看' }
      },
      {
        path: 'ai-diagnosis',
        name: 'AIDiagnosis',
        redirect: '/doctor/ai-diagnosis/upload',
        meta: { title: 'AI诊断分析' },
        children: [
          {
            path: 'upload',
            name: 'ImageUpload',
            component: () => import('@/views/diagnosis/ImageUpload.vue'),
            meta: { title: '上传影像' }
          },
          {
            path: 'result',
            name: 'DiagnosisResult',
            component: () => import('@/views/diagnosis/DiagnosisResult.vue'),
            meta: { title: '诊断结果' }
          }
        ]
      },
      {
        path: 'reports',
        name: 'ReportGenerator',
        component: () => import('@/components/doctor/ReportGenerator.vue'),
        meta: { title: '报告生成' }
      },
      {
        path: 'knowledge',
        name: 'KnowledgeBase',
        component: () => import('@/components/doctor/KnowledgeBase.vue'),
        meta: { title: '知识库' }
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/components/doctor/Statistics.vue'),
        meta: { title: '数据统计' }
      },
      {
        path: 'report-preview',
        name: 'ReportPreview',
        component: () => import('@/views/ReportPreview.vue'),
        meta: { title: '报告预览' }
      }
    ]
  },

  // 患者仪表板路由
  {
    path: '/patient',
    name: 'Patient',
    redirect: '/patient/dashboard',
    component: () => import('@/views/PatientDashboard.vue'),
    meta: { requiresAuth: true, role: 'patient' },
    children: [
      {
        path: 'dashboard',
        name: 'PatientDashboardMain',
        component: () => import('@/components/patient/PatientDashboard.vue')
      },
      {
        path: 'images',
        name: 'PatientImages',
        component: () => import('@/components/patient/MyImages.vue')
      },
      {
        path: 'diagnosis',
        name: 'PatientDiagnosis',
        component: () => import('@/components/patient/MyDiagnosis.vue')
      },
      {
        path: 'reports',
        name: 'PatientReports',
        component: () => import('@/components/patient/MyReports.vue')
      },
      {
        path: 'profile',
        name: 'PatientProfile',
        component: () => import('@/components/patient/Profile.vue')
      },
      {
        path: 'education',
        name: 'HealthEducation',
        component: () => import('@/components/patient/HealthEducation.vue')
      }
    ]
  },

  // 管理员路由
  {
    path: '/admin',
    name: 'Admin',
    redirect: '/admin/users',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/components/admin/UserManagement.vue')
      },
      {
        path: 'models',
        name: 'ModelManagement',
        component: () => import('@/components/admin/ModelManagement.vue')
      },
      {
        path: 'knowledge',
        name: 'KnowledgeManagement',
        component: () => import('@/components/admin/KnowledgeManagement.vue')
      },
      {
        path: 'monitor',
        name: 'SystemMonitor',
        component: () => import('@/components/admin/SystemMonitor.vue')
      },
      {
        path: 'logs',
        name: 'LogsAudit',
        component: () => import('@/components/admin/LogsAudit.vue')
      }
    ]
  },

  // 保留原有的诊断路由用于直接访问
  {
    path: '/diagnosis',
    name: 'Diagnosis',
    component: () => import('@/views/diagnosis/ImageUpload.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/diagnosis/viewer',
    name: 'ImageViewer',
    component: () => import('@/views/diagnosis/ImageViewer.vue'),
    meta: { requiresAuth: true }
  },

  // 重定向旧路径到新路径
  {
    path: '/dashboard/doctor',
    redirect: '/doctor'
  },
  {
    path: '/dashboard/patient',
    redirect: '/patient'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
=======
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
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
    component: () => import('@/views/Upload.vue')
  },

  // 医生仪表板路由 - 使用 DoctorLayout 作为布局
  {
    path: '/doctor',
    name: 'Doctor',
    redirect: '/doctor/cases',
    component: () => import('@/components/doctor/DoctorLayout.vue'),
    meta: { requiresAuth: true, role: 'doctor' },
    children: [
      {
        path: 'cases',
        name: 'CaseManagement',
        component: () => import('@/components/doctor/CaseManagement.vue'),
        meta: { title: '病例管理' }
      },
      {
        path: 'images',
        name: 'ImageViewer',
        component: () => import('@/components/doctor/ImageViewer.vue'),
        meta: { title: '影像查看' }
      },
      {
        path: 'ai-diagnosis',
        name: 'AIDiagnosis',
        redirect: '/doctor/ai-diagnosis/upload',
        meta: { title: 'AI诊断分析' },
        children: [
          {
            path: 'upload',
            name: 'ImageUpload',
            component: () => import('@/views/diagnosis/ImageUpload.vue'),
            meta: { title: '上传影像' }
          },
          {
            path: 'result',
            name: 'DiagnosisResult',
            component: () => import('@/views/diagnosis/DiagnosisResult.vue'),
            meta: { title: '诊断结果' }
          }
        ]
      },
      {
        path: 'reports',
        name: 'ReportGenerator',
        component: () => import('@/components/doctor/ReportGenerator.vue'),
        meta: { title: '报告生成' }
      },
      {
        path: 'knowledge',
        name: 'KnowledgeBase',
        component: () => import('@/components/doctor/KnowledgeBase.vue'),
        meta: { title: '知识库' }
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/components/doctor/Statistics.vue'),
        meta: { title: '数据统计' }
      },
      {
        path: 'report-preview',
        name: 'ReportPreview',
        component: () => import('@/views/ReportPreview.vue'),
        meta: { title: '报告预览' }
      }
    ]
  },

  // 患者仪表板路由
  {
    path: '/patient',
    name: 'Patient',
    redirect: '/patient/dashboard',
    component: () => import('@/views/PatientDashboard.vue'),
    meta: { requiresAuth: true, role: 'patient' },
    children: [
      {
        path: 'dashboard',
        name: 'PatientDashboardMain',
        component: () => import('@/components/patient/PatientDashboard.vue')
      },
      {
        path: 'images',
        name: 'PatientImages',
        component: () => import('@/components/patient/MyImages.vue')
      },
      {
        path: 'diagnosis',
        name: 'PatientDiagnosis',
        component: () => import('@/components/patient/MyDiagnosis.vue')
      },
      {
        path: 'reports',
        name: 'PatientReports',
        component: () => import('@/components/patient/MyReports.vue')
      },
      {
        path: 'profile',
        name: 'PatientProfile',
        component: () => import('@/components/patient/Profile.vue')
      },
      {
        path: 'education',
        name: 'HealthEducation',
        component: () => import('@/components/patient/HealthEducation.vue')
      }
    ]
  },

  // 管理员路由
  {
    path: '/admin',
    name: 'Admin',
    redirect: '/admin/users',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/components/admin/UserManagement.vue')
      },
      {
        path: 'models',
        name: 'ModelManagement',
        component: () => import('@/components/admin/ModelManagement.vue')
      },
      {
        path: 'knowledge',
        name: 'KnowledgeManagement',
        component: () => import('@/components/admin/KnowledgeManagement.vue')
      },
      {
        path: 'monitor',
        name: 'SystemMonitor',
        component: () => import('@/components/admin/SystemMonitor.vue')
      },
      {
        path: 'logs',
        name: 'LogsAudit',
        component: () => import('@/components/admin/LogsAudit.vue')
      }
    ]
  },

  // 保留原有的诊断路由用于直接访问
  {
    path: '/diagnosis',
    name: 'Diagnosis',
    component: () => import('@/views/diagnosis/ImageUpload.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/diagnosis/viewer',
    name: 'ImageViewer',
    component: () => import('@/views/diagnosis/ImageViewer.vue'),
    meta: { requiresAuth: true }
  },

  // 重定向旧路径到新路径
  {
    path: '/dashboard/doctor',
    redirect: '/doctor'
  },
  {
    path: '/dashboard/patient',
    redirect: '/patient'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    next('/')
  } else {
    next()
  }
>>>>>>> Stashed changes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    next('/')
  } else {
    next()
  }
})
>>>>>>> Stashed changes

export default router