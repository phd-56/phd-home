import { RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent } from 'vue'

// 异步加载组件
const CaseManagement = defineAsyncComponent(() => import('@/views/doctor/CaseManagement.vue'))
const CaseDetail = defineAsyncComponent(() => import('@/views/doctor/CaseDetail.vue'))
const ImageProcessing = defineAsyncComponent(() => import('@/views/doctor/ImageProcessing.vue'))
const AIDiagnosis = defineAsyncComponent(() => import('@/views/doctor/AIDiagnosis.vue'))
const ReportGenerator = defineAsyncComponent(() => import('@/views/doctor/ReportGenerator.vue'))
const KnowledgeBase = defineAsyncComponent(() => import('@/views/doctor/KnowledgeBase.vue'))
const Statistics = defineAsyncComponent(() => import('@/views/doctor/Statistics.vue'))
// 新增：反馈历史组件
const FeedbackHistory = defineAsyncComponent(() => import('@/views/doctor/FeedbackHistory.vue'))

/**
 * 医生端路由配置
 * 包含医生相关的所有页面路由
 */
const doctorRoutes: RouteRecordRaw[] = [
  {
    path: '/doctor',
    name: 'doctor',
    redirect: '/doctor/cases',
    meta: {
      requiresAuth: true,
      role: 'doctor'
    },
    children: [
      {
        path: 'cases',
        name: 'doctor.cases',
        component: CaseManagement,
        meta: {
          title: '病例管理',
          icon: '📁'
        }
      },
      {
        path: 'cases/:id',
        name: 'doctor.caseDetail',
        component: CaseDetail,
        meta: {
          title: '病例详情',
          icon: '📄',
          hidden: true
        }
      },
      {
        path: 'image-processing',
        name: 'doctor.imageProcessing',
        component: ImageProcessing,
        meta: {
          title: '影像处理',
          icon: '🖼️'
        }
      },
      {
        path: 'ai-diagnosis',
        name: 'doctor.aiDiagnosis',
        component: AIDiagnosis,
        meta: {
          title: 'AI诊断分析',
          icon: '🤖'
        }
      },
      // 新增：反馈历史路由
      {
        path: 'feedback-history',
        name: 'doctor.feedbackHistory',
        component: FeedbackHistory,
        meta: {
          title: '反馈历史',
          icon: '📝'
        }
      },
      {
        path: 'reports',
        name: 'doctor.reports',
        component: ReportGenerator,
        meta: {
          title: '报告生成',
          icon: '📑'
        }
      },
      {
        path: 'knowledge',
        name: 'doctor.knowledge',
        component: KnowledgeBase,
        meta: {
          title: '知识库',
          icon: '📚'
        }
      },
      {
        path: 'statistics',
        name: 'doctor.statistics',
        component: Statistics,
        meta: {
          title: '数据统计',
          icon: '📊'
        }
      }
    ]
  }
]

export default doctorRoutes
