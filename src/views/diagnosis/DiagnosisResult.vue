<template>
  <div class="diagnosis-result-page">
    <div class="diagnosis-header">
      <h1>YOLO肌肉骨骼智能诊断系统</h1>
      <div class="system-status">
        <span>YOLO引擎: 分析完成</span>
        <span class="version">版本: Ultimate v3.0</span>
      </div>
    </div>

    <div class="result-content">
      <!-- 操作工具栏 -->
      <div class="action-toolbar">
        <el-button @click="goBack" icon="Back">重新上传</el-button>
        <el-button @click="editReport" type="primary" icon="Edit">编辑报告</el-button>
        <el-button @click="previewReport" type="success" icon="View">预览报告</el-button>
        <el-button @click="downloadReport" type="warning" icon="Download">直接下载</el-button>
        <el-button @click="reDiagnose" icon="Refresh">重新诊断</el-button>
      </div>

      <!-- 诊断摘要 -->
      <div class="diagnosis-summary">
        <h2>诊断摘要</h2>
        <div class="summary-cards">
          <el-card class="summary-card">
            <div class="card-content">
              <div class="card-icon">📍</div>
              <div class="card-info">
                <div class="card-label">检查部位</div>
                <div class="card-value">{{ diagnosisData.bodyPart || '未知部位' }}</div>
              </div>
            </div>
          </el-card>
          
          <el-card class="summary-card">
            <div class="card-content">
              <div class="card-icon">🎯</div>
              <div class="card-info">
                <div class="card-label">置信度</div>
                <div class="card-value">{{ diagnosisData.confidence || '0' }}%</div>
              </div>
            </div>
          </el-card>
          
          <el-card class="summary-card">
            <div class="card-content">
              <div class="card-icon">🔍</div>
              <div class="card-info">
                <div class="card-label">发现数量</div>
                <div class="card-value">{{ diagnosisData.findingsCount || '0' }}个</div>
              </div>
            </div>
          </el-card>
          
          <el-card class="summary-card">
            <div class="card-content">
              <div class="card-icon">⏱️</div>
              <div class="card-info">
                <div class="card-label">处理时间</div>
                <div class="card-value">{{ diagnosisData.processingTime || '0' }}ms</div>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- YOLO检测结果 -->
      <div class="detection-results">
        <h2>YOLO检测结果 ({{ diagnosisData.findingsCount || 0 }}个发现)</h2>
        <div class="results-grid">
          <el-card 
            v-for="(finding, index) in diagnosisData.findings" 
            :key="index"
            class="finding-card"
            :class="getFindingClass(finding.confidence)"
          >
            <template #header>
              <div class="finding-header">
                <span class="finding-title">发现 {{ index + 1 }}</span>
                <el-tag :type="getConfidenceType(finding.confidence)">
                  {{ finding.confidence }}%
                </el-tag>
              </div>
            </template>
            <div class="finding-content">
              <p><strong>部位:</strong> {{ finding.location }}</p>
              <p><strong>类型:</strong> {{ finding.type }}</p>
              <p><strong>描述:</strong> {{ finding.description }}</p>
              <p><strong>建议:</strong> {{ finding.recommendation }}</p>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 原始影像预览 -->
      <div class="image-preview" v-if="diagnosisData.imageUrl">
        <h2>影像预览</h2>
        <div class="preview-container">
          <img :src="diagnosisData.imageUrl" alt="诊断影像" class="preview-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 诊断数据
const diagnosisData = ref({
  bodyPart: '膝关节',
  confidence: 87.5,
  findingsCount: 3,
  processingTime: 93.5,
  findings: [
    {
      location: '右膝关节内侧',
      type: '骨质增生',
      confidence: 87.5,
      description: '关节边缘可见骨质增生影，关节间隙稍变窄',
      recommendation: '建议进一步CT检查评估骨质情况'
    },
    {
      location: '右膝关节腔',
      type: '少量积液',
      confidence: 76.2,
      description: '关节腔内可见少量液体信号',
      recommendation: '临床结合症状评估，必要时抽液检查'
    },
    {
      location: '右膝半月板',
      type: '退行性改变',
      confidence: 68.9,
      description: '半月板信号不均，提示退行性改变',
      recommendation: '建议MRI进一步明确半月板损伤程度'
    }
  ],
  imageUrl: '/api/placeholder/400/300'
})

// 根据置信度获取标签类型
const getConfidenceType = (confidence: number) => {
  if (confidence >= 80) return 'success'
  if (confidence >= 60) return 'warning'
  return 'danger'
}

// 根据置信度获取卡片样式类
const getFindingClass = (confidence: number) => {
  if (confidence >= 80) return 'high-confidence'
  if (confidence >= 60) return 'medium-confidence'
  return 'low-confidence'
}

// 返回上传页面
const goBack = () => {
  router.push({ name: 'ImageUpload' })
}

// 编辑报告
const editReport = () => {
  router.push({
    name: 'ReportEditor',
    query: {
      diagnosisData: JSON.stringify(diagnosisData.value)
    }
  })
}

// 预览报告
const previewReport = () => {
  router.push({
    name: 'ReportPreview',
    query: {
      diagnosisData: JSON.stringify(diagnosisData.value),
      reportType: 'spect'
    }
  })
}

// 下载报告
const downloadReport = () => {
  ElMessage.success('报告下载功能开发中...')
}

// 重新诊断
const reDiagnose = () => {
  router.push({ name: 'ImageUpload' })
}

onMounted(() => {
  // 从路由参数获取上传的文件信息
  const fileId = route.query.fileId
  const fileName = route.query.fileName
  console.log('诊断文件:', { fileId, fileName })
  
  // 这里可以调用API获取实际的诊断结果
  // fetchDiagnosisData(fileId)
})
</script>

<style scoped>
.diagnosis-result-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.diagnosis-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
}

.diagnosis-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
}

.system-status {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 14px;
}

.version {
  font-weight: bold;
}

.action-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.diagnosis-summary {
  margin-bottom: 30px;
}

.diagnosis-summary h2 {
  margin-bottom: 20px;
  color: #333;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.summary-card {
  text-align: center;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.card-icon {
  font-size: 24px;
}

.card-info {
  text-align: left;
}

.card-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.card-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.detection-results {
  margin-bottom: 30px;
}

.detection-results h2 {
  margin-bottom: 20px;
  color: #333;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.finding-card.high-confidence {
  border-left: 4px solid #67c23a;
}

.finding-card.medium-confidence {
  border-left: 4px solid #e6a23c;
}

.finding-card.low-confidence {
  border-left: 4px solid #f56c6c;
}

.finding-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.finding-title {
  font-weight: bold;
}

.finding-content p {
  margin: 8px 0;
  font-size: 14px;
}

.image-preview {
  margin-bottom: 30px;
}

.image-preview h2 {
  margin-bottom: 15px;
  color: #333;
}

.preview-container {
  text-align: center;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .action-toolbar {
    flex-direction: column;
  }
  
  .summary-cards {
    grid-template-columns: 1fr 1fr;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>