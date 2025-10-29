import { RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent } from 'vue'

// 异步加载管理员页面组件
const AdminDashboard = defineAsyncComponent(() => import('@/views/AdminDashboard.vue'))
const UserManagement = defineAsyncComponent(() => import('@/views/UserManagement.vue'))
const DataAnalysis = defineAsyncComponent(() => import('@/views/admin/DataAnalysis.vue'))
const DoctorData = defineAsyncComponent(() => import('@/views/admin/DoctorData.vue'))
const PatientData = defineAsyncComponent(() => import('@/views/admin/PatientData.vue'))
const FeedbackData = defineAsyncComponent(() => import('@/views/admin/FeedbackData.vue'))
const RolesPermissions = defineAsyncComponent(() => import('@/views/admin/RolesPermissions.vue'))
const SystemConfig = defineAsyncComponent(() => import('@/views/admin/SystemConfig.vue'))
const SystemMonitor = defineAsyncComponent(() => import('@/views/admin/SystemMonitor.vue'))

/**
 * 管理员路由配置
 * 所有路由需要管理员权限才能访问
 */
const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'admin',
    component: defineAsyncComponent(() => import('@/components/AppLayout.vue')),
    meta: {
      requiresAuth: true,
      role: 'admin', // 仅管理员可访问
      title: '管理员中心'
    },
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'admin.dashboard',
        component: AdminDashboard,
        meta: {
          title: '管理控制台',
          icon: 'data-analysis',
          breadcrumb: '管理控制台'
        }
      },
      {
        path: 'user-management',
        name: 'admin.userManagement',
        component: UserManagement,
        meta: {
          title: '用户管理',
          icon: 'user',
          breadcrumb: '用户管理'
        }
      },
      {
        path: 'data-analysis',
        name: 'admin.dataAnalysis',
        component: DataAnalysis,
        meta: {
          title: '数据统计分析',
          icon: 'trend-charts',
          breadcrumb: '数据统计分析'
        }
      },
      {
        path: 'doctor-data',
        name: 'admin.doctorData',
        component: DoctorData,
        meta: {
          title: '医生数据',
          icon: 'user',
          breadcrumb: '医生数据'
        }
      },
      {
        path: 'patient-data',
        name: 'admin.patientData',
        component: PatientData,
        meta: {
          title: '患者数据',
          icon: 'user',
          breadcrumb: '患者数据'
        }
      },
      {
        path: 'feedback-data',
        name: 'admin.feedbackData',
        component: FeedbackData,
        meta: {
          title: '反馈数据统计',
          icon: 'chat-dot-round',
          breadcrumb: '反馈数据统计'
        }
      },
      {
        path: 'system-monitoring',
        name: 'admin.systemMonitoring',
        component: SystemMonitor,
        meta: {
          title: '系统监控',
          icon: 'monitor',
          breadcrumb: '系统监控'
        }
      },
      {
        path: 'roles-permissions',
        name: 'admin.rolesPermissions',
        component: RolesPermissions,
        meta: {
          title: '角色与权限',
          icon: 'lock',
          breadcrumb: '角色与权限'
        }
      },
      {
        path: 'system-config',
        name: 'admin.systemConfig',
        component: SystemConfig,
        meta: {
          title: '系统参数配置',
          icon: 'setting',
          breadcrumb: '系统参数配置'
        }
      }
    ]
  }
]

export default adminRoutes
