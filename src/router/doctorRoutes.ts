import { RouteRecordRaw } from 'vue-router'

const doctorRoutes: RouteRecordRaw[] = [
  {
    path: 'ai-diagnosis',
    name: 'doctor.aiDiagnosis',
    component: () => import('@/views/doctor/ImageDiagnosis.vue')
  },
  {
    path: 'image-center',
    name: 'doctor.imageCenter',
    component: () => import('@/views/doctor/ImageDiagnosisCenter.vue')
  },
  {
    path: 'case-management',
    name: 'doctor.caseManagement',
    component: () => import('@/views/case-management/CaseList.vue')
  },
  {
    path: 'case-management/new',
    name: 'doctor.newCase',
    component: () => import('@/views/case-management/NewCase.vue')
  },
  {
    path: 'case-management/status/:id',
    name: 'doctor.caseStatusChange',
    component: () => import('@/views/case-management/CaseStatusChange.vue')
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
    path: 'report-generation',
    name: 'doctor.reportGeneration',
    component: () => import('@/views/doctor/ReportGeneration.vue')
  },
  {
    path: 'knowledge-base',
    name: 'doctor.knowledgeBase',
    component: () => import('@/views/doctor/KnowledgeBase.vue')
  },
  {
    path: 'feedback',
    name: 'doctor.feedbackCenter',
    component: () => import('@/views/doctor/FeedbackCenter.vue')
  },
  {
    path: 'feedback-history',
    name: 'doctor.feedbackHistory',
    component: () => import('@/views/doctor/FeedbackHistory.vue')
  },
  {
    path: 'statistics',
    name: 'doctor.statistics',
    component: () => import('@/views/doctor/Statistics.vue')
  },
  {
    path: 'help',
    name: 'doctor.help',
    component: () => import('@/views/doctor/HelpDocumentation.vue')
  }
]

export default doctorRoutes