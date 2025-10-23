import { RouteRecordRaw } from 'vue-router'

const doctorRoutes: RouteRecordRaw[] = [
  {
    path: 'ai-diagnosis',
    name: 'doctor.aiDiagnosis',
    component: () => import('@/components/doctor/components/AIDiagnosis.vue')
  },
  {
    path: 'case-management',
    name: 'doctor.caseManagement',
    component: () => import('@/views/case-management/CaseList.vue')
  },
  {
    path: 'case-management/create',
    name: 'doctor.caseCreate',
    component: () => import('@/views/case-management/CaseCreate.vue')
  },
  {
    path: 'case-management/:id',
    name: 'doctor.caseDetail',
    component: () => import('@/views/case-management/CaseDetail.vue')
  },


  {
    path: 'reports',
    name: 'doctor.reports',
    component: () => import('@/views/doctor/DoctorReports.vue')
  },
  {
    path: 'reports/editor',
    name: 'doctor.reportEditor',
    component: () => import('@/components/MedicalReportEditor.vue')
  },
  {
    path: 'knowledge-base',
    name: 'doctor.knowledgeBase',
    component: () => import('@/views/doctor/KnowledgeBase.vue')
  },
  {
    path: 'feedback',
    name: 'doctor.feedbackHistory',
    component: () => import('@/views/doctor/FeedbackHistory.vue')
  },
  {
    path: 'statistics',
    name: 'doctor.statistics',
    component: () => import('@/views/ReportPreview.vue') // 暂时使用报告预览页
  }
]

export default doctorRoutes