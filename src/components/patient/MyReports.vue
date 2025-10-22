<template>
  <div class="my-reports">
    <div class="page-header">
      <h2>我的诊断报告</h2>
      <div class="header-actions">
        <el-button @click="exportAllReports">
          <el-icon><Download /></el-icon>
          批量导出
        </el-button>
      </div>
    </div>

    <!-- 报告统计 -->
    <div class="report-stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon total">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ reportStats.total }}</div>
              <div class="stat-label">总报告数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon recent">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ reportStats.recent }}</div>
              <div class="stat-label">近期报告</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon signed">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ reportStats.signed }}</div>
              <div class="stat-label">已签名报告</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon shared">
              <el-icon><Share /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ reportStats.shared }}</div>
              <div class="stat-label">已分享报告</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 报告列表 -->
    <div class="report-list">
      <div class="list-header">
        <h3>报告列表</h3>
        <div class="list-filters">
          <el-input
            v-model="searchQuery"
            placeholder="搜索报告..."
            clearable
            style="width: 200px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select v-model="filterStatus" placeholder="报告状态" clearable>
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="已签名" value="signed" />
          </el-select>
          
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </div>

      <div class="report-items">
        <div
          v-for="report in filteredReports"
          :key="report.id"
          class="report-item"
        >
          <div class="report-main">
            <div class="report-header">
              <div class="report-title-section">
                <h4 class="report-title">{{ report.title }}</h4>
                <div class="report-tags">
                  <el-tag size="small" :type="getStatusType(report.status)">
                    {{ getStatusText(report.status) }}
                  </el-tag>
                  <el-tag size="small" type="info">
                    {{ report.bodyPart }}
                  </el-tag>
                </div>
              </div>
              <div class="report-meta">
                <span class="report-date">{{ formatDate(report.createTime) }}</span>
                <span class="report-doctor">诊断医生: {{ report.doctor }}</span>
              </div>
            </div>

            <div class="report-content">
              <div class="diagnosis-summary">
                <p class="diagnosis-text">{{ report.diagnosis }}</p>
                <div class="confidence-indicator" v-if="report.confidence">
                  <span class="confidence-label">AI置信度:</span>
                  <el-progress
                    :percentage="report.confidence * 100"
                    :show-text="false"
                    :color="getConfidenceColor(report.confidence)"
                  />
                  <span class="confidence-value">{{ (report.confidence * 100).toFixed(1) }}%</span>
                </div>
              </div>

              <div class="report-images">
                <div
                  v-for="image in report.images.slice(0, 3)"
                  :key="image.id"
                  class="report-image-thumb"
                >
                  <img :src="image.thumbnail" :alt="image.description" />
                </div>
                <div v-if="report.images.length > 3" class="more-images">
                  +{{ report.images.length - 3 }}
                </div>
              </div>
            </div>
          </div>

          <div class="report-actions">
            <el-button type="primary" @click="viewReport(report)">
              <el-icon><View /></el-icon>
              查看报告
            </el-button>
            <el-button @click="downloadReport(report)">
              <el-icon><Download /></el-icon>
              下载PDF
            </el-button>
            <el-button @click="shareReport(report)">
              <el-icon><Share /></el-icon>
              分享
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredReports.length === 0" class="empty-state">
        <el-empty description="暂无诊断报告" />
      </div>
    </div>

    <!-- 报告查看对话框 -->
    <!-- 暂时注释掉不存在的组件 -->
    <!-- <el-dialog
      v-model="showReportDialog"
      :title="selectedReport?.title"
      width="90%"
      top="5vh"
      fullscreen
    >
      <ReportViewer 
        v-if="selectedReport"
        :report="selectedReport"
        @close="showReportDialog = false"
      />
    </el-dialog> -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
//import { Download, Document, Clock, Check, Share, Search, View } from '@element-plus/icons-vue'

interface ReportImage {
  id: string
  thumbnail: string
  originalUrl: string
  description: string
}

interface DiagnosisReport {
  id: string
  title: string
  bodyPart: string
  diagnosis: string
  confidence?: number
  status: 'draft' | 'published' | 'signed'
  createTime: string
  doctor: string
  images: ReportImage[]
  content: string
  recommendations: string[]
}

const showReportDialog = ref(false)
const selectedReport = ref<DiagnosisReport | null>(null)
const searchQuery = ref('')
const filterStatus = ref('')
// 使用更明确的类型
const dateRange = ref<[Date, Date] | null>(null)

const reportStats = reactive({
  total: 8,
  recent: 3,
  signed: 6,
  shared: 2
})

// 模拟报告数据
const diagnosisReports = ref<DiagnosisReport[]>([
  {
    id: 'R20240001',
    title: '膝关节X光片诊断报告',
    bodyPart: '膝关节',
    diagnosis: '右侧膝关节骨关节炎（中度），表现为关节间隙变窄和边缘骨质增生。',
    confidence: 0.87,
    status: 'signed',
    createTime: '2024-01-15T10:30:00',
    doctor: '李医生',
    images: [
      {
        id: 'IMG001',
        thumbnail: 'https://via.placeholder.com/100x100?text=Knee+X-Ray',
        originalUrl: 'https://via.placeholder.com/800x600?text=Knee+X-Ray',
        description: '右膝关节正位X光片'
      }
    ],
    content: '详细的诊断报告内容...',
    recommendations: [
      '药物治疗：非甾体抗炎药',
      '物理治疗：关节功能锻炼',
      '生活方式：减轻体重，避免剧烈运动'
    ]
  },
  {
    id: 'R20240002',
    title: '腰椎MRI诊断报告',
    bodyPart: '腰椎',
    diagnosis: 'L4/L5椎间盘突出，压迫硬膜囊，伴有轻度椎管狭窄。',
    confidence: 0.92,
    status: 'signed',
    createTime: '2024-01-10T14:20:00',
    doctor: '王医生',
    images: [
      {
        id: 'IMG002',
        thumbnail: 'https://via.placeholder.com/100x100?text=Spine+MRI',
        originalUrl: 'https://via.placeholder.com/800x600?text=Spine+MRI',
        description: '腰椎MRI矢状位'
      },
      {
        id: 'IMG003',
        thumbnail: 'https://via.placeholder.com/100x100?text=Spine+MRI+2',
        originalUrl: 'https://via.placeholder.com/800x600?text=Spine+MRI+2',
        description: '腰椎MRI轴位'
      }
    ],
    content: '详细的诊断报告内容...',
    recommendations: [
      '保守治疗：卧床休息，物理治疗',
      '药物治疗：止痛药和肌肉松弛剂',
      '必要时考虑微创手术'
    ]
  }
])

const filteredReports = computed(() => {
  let reports = diagnosisReports.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    reports = reports.filter(report =>
      report.title.toLowerCase().includes(query) ||
      report.diagnosis.toLowerCase().includes(query) ||
      report.bodyPart.toLowerCase().includes(query)
    )
  }
  
  if (filterStatus.value) {
    reports = reports.filter(report => report.status === filterStatus.value)
  }
  
  // 修复：安全的日期范围过滤
  if (dateRange.value) {
    const [start, end] = dateRange.value
    reports = reports.filter(report => {
      const createTime = new Date(report.createTime)
      return createTime >= start && createTime <= end
    })
  }
  
  return reports
})

const getStatusType = (status: string) => {
  const typeMap = {
    draft: 'info',
    published: 'warning',
    signed: 'success'
  }
  return typeMap[status as keyof typeof typeMap] || 'info'
}

const getStatusText = (status: string) => {
  const textMap = {
    draft: '草稿',
    published: '已发布',
    signed: '已签名'
  }
  return textMap[status as keyof typeof textMap] || '未知'
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return '#67c23a'
  if (confidence >= 0.6) return '#e6a23c'
  return '#f56c6c'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const viewReport = (report: DiagnosisReport) => {
  selectedReport.value = report
  showReportDialog.value = true
}

const downloadReport = (report: DiagnosisReport) => {
  ElMessage.success(`开始下载 ${report.title}`)
  // 这里实现PDF下载逻辑
}

const shareReport = (report: DiagnosisReport) => {
  ElMessage.info(`分享报告: ${report.title}`)
  // 这里实现分享逻辑
}

const exportAllReports = () => {
  ElMessage.success('开始批量导出报告')
  // 这里实现批量导出逻辑
}
</script>

<style scoped>
.my-reports {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.report-stats {
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.total {
  background: #409eff;
}

.stat-icon.recent {
  background: #e6a23c;
}

.stat-icon.signed {
  background: #67c23a;
}

.stat-icon.shared {
  background: #f56c6c;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.list-filters {
  display: flex;
  gap: 12px;
}

.report-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.report-item {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.report-main {
  flex: 1;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.report-title-section {
  flex: 1;
}

.report-title {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
}

.report-tags {
  display: flex;
  gap: 8px;
}

.report-meta {
  text-align: right;
  font-size: 14px;
  color: #666;
}

.report-date {
  display: block;
  margin-bottom: 4px;
}

.report-doctor {
  display: block;
}

.report-content {
  display: flex;
  gap: 20px;
}

.diagnosis-summary {
  flex: 1;
}

.diagnosis-text {
  margin: 0 0 12px 0;
  color: #333;
  line-height: 1.5;
}

.confidence-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-label {
  font-size: 14px;
  color: #666;
  min-width: 80px;
}

.confidence-value {
  font-size: 14px;
  color: #666;
  min-width: 40px;
}

.report-images {
  display: flex;
  gap: 8px;
}

.report-image-thumb {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
}

.report-image-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.more-images {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
}

.report-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.empty-state {
  margin-top: 60px;
}
</style>