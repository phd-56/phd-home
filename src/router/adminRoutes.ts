import { RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent } from 'vue'

// 异步加载管理员页面组件
const AdminDashboard = defineAsyncComponent(() => import('@/views/admin/AdminDashboard.vue'))
const UserManagement = defineAsyncComponent(() => import('@/views/UserManagement.vue'))
const ModelManagement = defineAsyncComponent(() => import('@/views/admin/ModelManagement.vue'))
const ModelPerformance = defineAsyncComponent(() => import('@/views/admin/ModelPerformance.vue'))
const OptimizationManagement = defineAsyncComponent(() => import('@/views/admin/OptimizationManagement.vue'))
const ModelOptimizationComparison = defineAsyncComponent(() => import('@/views/admin/ModelOptimizationComparison.vue'))
const SystemSettings = defineAsyncComponent(() => import('@/views/admin/SystemSettings.vue'))
// 使用现有的组件文件
const SystemMonitor = defineAsyncComponent(() => import('@/views/admin/SystemMonitor.vue'))
const BackupManagement = defineAsyncComponent(() => import('@/views/admin/BackupManagement.vue'))
const AuditLogs = defineAsyncComponent(() => import('@/views/admin/AuditLogs.vue'))
const ModelOptimization = defineAsyncComponent(() => import('@/views/admin/ModelOptimization.vue'))

/**
 * 管理员路由配置
 * 所有路由需要管理员权限才能访问
 */
const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'admin',
    component: defineAsyncComponent(() => import('@/layouts/AdminLayout.vue')),
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
          icon: '📊',
          breadcrumb: '管理控制台'
        }
      },
      {
        path: 'user-management',
        name: 'admin.userManagement',
        component: UserManagement,
        meta: {
          title: '用户管理',
          icon: '👥',
          breadcrumb: '用户管理'
        }
      },
      {
        path: 'monitoring',
        name: 'admin.monitoring',
        component: SystemMonitor,
        meta: {
          title: '系统监控',
          icon: '📊',
          breadcrumb: '系统监控'
        }
      },
      {
        path: 'backups',
        name: 'admin.backups',
        component: BackupManagement,
        meta: {
          title: '数据备份',
          icon: '💾',
          breadcrumb: '数据备份'
        }
      },
      {
        path: 'audit-logs',
        name: 'admin.auditLogs',
        component: AuditLogs,
        meta: {
          title: '操作日志',
          icon: '📝',
          breadcrumb: '操作日志'
        }
      },
      {
        path: 'model-optimization',
        name: 'admin.modelOptimization',
        component: ModelOptimization,
        meta: {
          title: '模型优化',
          icon: '⚙️',
          breadcrumb: '模型优化'
        }
      },
      {
        path: 'models',
        name: 'admin.models',
        component: ModelManagement,
        meta: {
          title: '模型管理',
          icon: '🤖',
          breadcrumb: '模型管理'
        }
      },
      {
        path: 'model-performance',
        name: 'admin.modelPerformance',
        component: ModelPerformance,
        meta: {
          title: '模型性能监控',
          icon: '📈',
          breadcrumb: '模型性能监控'
        }
      },
      {
        path: 'optimization-management',
        name: 'admin.optimizationManagement',
        component: OptimizationManagement,
        meta: {
          title: '优化管理',
          icon: '⚙️',
          breadcrumb: '优化管理'
        }
      },
      {
        path: 'model-optimization-comparison',
        name: 'admin.modelOptimizationComparison',
        component: ModelOptimizationComparison,
        meta: {
          title: '模型优化对比',
          icon: '📉',
          breadcrumb: '模型优化对比'
        }
      },
      // 知识库管理路由已移除，因为组件导入不可用
      {
        path: 'system-settings',
        name: 'admin.systemSettings',
        component: SystemSettings,
        meta: {
          title: '系统设置',
          icon: '🔧',
          breadcrumb: '系统设置'
        }
      },
      // 保留原有的优化管理路由作为别名
      {
        path: 'optimization-management',
        name: 'admin.optimizationManagement',
        component: OptimizationManagement,
        meta: {
          title: '优化管理',
          icon: '⚙️',
          breadcrumb: '优化管理'
        }
      }
    ]
  }
]

export default adminRoutes