import { RouteRecordRaw } from 'vue-router';

const feedbackRoutes: RouteRecordRaw[] = [
  {
    path: '/feedback/history',
    name: 'FeedbackHistory',
    component: () => import('@/views/doctor/FeedbackHistory.vue'),
    meta: {
      title: '反馈历史记录',
      requiresAuth: true,
      role: ['doctor', 'admin']
    }
  },
  {
    path: '/admin/model-performance',
    name: 'ModelPerformance',
    component: () => import('@/views/admin/ModelPerformance.vue'),
    meta: {
      title: '模型性能指标',
      requiresAuth: true,
      role: ['admin']
    }
  },
  {
    path: '/admin/optimization-management',
    name: 'OptimizationManagement',
    component: () => import('@/views/admin/OptimizationManagement.vue'),
    meta: {
      title: '模型优化管理',
      requiresAuth: true,
      role: ['admin']
    }
  }
];

export default feedbackRoutes;