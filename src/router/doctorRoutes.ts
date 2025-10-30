import { RouteRecordRaw } from 'vue-router'

const doctorRoutes: RouteRecordRaw[] = [
  {
    path: 'ai-diagnosis',
    name: 'doctor.aiDiagnosis',
    component: () => import('@/views/doctor/AIDiagnosis.vue')
  },
  {
    path: 'ai-diagnosis/process',
    name: 'doctor.aiDiagnosisProcess',
    component: () => import('@/views/doctor/AIDiagnosisProcess.vue')
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
    path: 'case-management/change-status/:caseNumber',
    name: 'doctor.caseStatusChange',
    component: () => import('@/views/case-management/CaseStatusChange.vue')
  },


  {
    path: 'reports',
    name: 'doctor.reports',
    component: () => import('@/views/doctor/DoctorReports.vue')
  },
  {
    path: 'reports/editor',
    name: 'doctor.reportEditor',
    component: () => import('@/views/reports/ReportEditor.vue')
  },
  {
    path: 'reports/detail/:id',
    name: 'doctor.reportDetail',
    component: () => import('@/views/reports/ReportDetail.vue')
  },
  {
    path: 'knowledge-base',
    name: 'doctor.knowledgeBase',
    component: () => import('@/views/doctor/KnowledgeBase.vue')
  },
  {
    path: 'feedback',
    name: 'doctor.feedbackHistory',
    component: () => import('@/views/feedback/FeedbackCenter.vue')
  },
  {
    path: 'help',
    name: 'doctor.help',
    component: () => import('@/views/doctor/DoctorHelp.vue')
  },
  {
    path: 'statistics',
    name: 'doctor.statistics',
    component: () => import('@/views/doctor/DoctorStatistics.vue')
  }
]

export default doctorRoutes