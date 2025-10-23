<template>
  <div class="patient-reports">
    <div class="page-header">
      <h1>我的报告</h1>
      <p>查看您的诊断报告和病例记录</p>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>报告列表</span>
          <div class="header-actions">
            <el-input
              v-model="searchParams.keyword"
              placeholder="搜索报告类型、标题或医生姓名"
              style="width: 300px; margin-right: 10px;"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="searchReports">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </div>
        </div>
      </template>

      <div class="patient-info">
        <h4>患者信息</h4>
        <div class="info-grid">
          <div class="info-item">
            <label>姓名：</label>
            <span>{{ authStore.user?.fullName || '-' }}</span>
          </div>
          <div class="info-item">
            <label>病历号：</label>
            <span class="medical-record">{{ authStore.user?.medicalRecord || '暂无' }}</span>
          </div>
        </div>
      </div>

      <el-table :data="filteredReports" v-loading="loading" style="margin-top: 20px;">
        <el-table-column prop="reportNo" label="病历号" width="150" />
        <el-table-column prop="reportType" label="报告类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getReportTypeTag(row.reportType)">
              {{ row.reportType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="报告标题" min-width="200" />
        <el-table-column prop="doctorName" label="医生" width="100" />
        <el-table-column prop="reportDate" label="报告日期" width="150">
          <template #default="{ row }">
            {{ formatDate(row.reportDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="viewReport(row)" :disabled="row.status === '待审核'">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!loading && filteredReports.length === 0" class="empty-state">
        <el-empty description="暂无报告数据" />
      </div>

      <div v-if="filteredReports.length > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredReports.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 报告详情对话框 -->
    <el-dialog v-model="reportDetailVisible" :title="selectedReport?.title || '报告详情'" width="800px" destroy-on-close>
      <div v-if="selectedReport" class="report-detail">
        <div class="detail-header">
          <h3>{{ selectedReport.title }}</h3>
          <div class="detail-meta">
            <span>病历号：{{ selectedReport.reportNo }}</span>
            <span>报告日期：{{ formatDate(selectedReport.reportDate) }}</span>
            <span>医生：{{ selectedReport.doctorName }}</span>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>诊断结果</h4>
          <div class="result-content" v-html="selectedReport.diagnosisResult"></div>
        </div>
        
        <div class="detail-section" v-if="selectedReport.analysis">
          <h4>AI分析</h4>
          <div class="analysis-content" v-html="selectedReport.analysis"></div>
        </div>
        
        <div class="detail-section">
          <h4>医生结论</h4>
          <div class="doctor-content">{{ selectedReport.doctorConclusion || '待医生填写' }}</div>
        </div>
        
        <div class="detail-section">
          <h4>治疗建议</h4>
          <div class="treatment-content">{{ selectedReport.treatmentSuggestion || '待医生填写' }}</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="reportDetailVisible = false">关闭</el-button>
        <el-button type="primary" @click="downloadReport">下载报告</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
//import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const reportDetailVisible = ref(false)
const selectedReport = ref<any>(null)

// 搜索参数
const searchParams = reactive({
  keyword: ''
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

// 模拟报告数据
const reports = ref([
  {
    id: '1',
    reportNo: '20240701001',
    reportType: 'X光诊断',
    title: '胸部X光片检查报告',
    doctorName: '张医生',
    reportDate: '2024-07-01T10:30:00',
    status: '已完成',
    diagnosisResult: '<p>双侧肺野清晰，未见明显异常密度影。心脏大小形态正常。双侧膈肌光滑，肋膈角锐利。</p>',
    analysis: '<p>AI分析：胸部X光片显示肺部结构正常，无明显病变迹象。</p>',
    doctorConclusion: '胸部X光片检查未见明显异常。',
    treatmentSuggestion: '建议保持健康生活方式，定期体检。'
  },
  {
    id: '2',
    reportNo: '20240701001',
    reportType: 'CT诊断',
    title: '头部CT检查报告',
    doctorName: '李医生',
    reportDate: '2024-07-02T14:20:00',
    status: '已完成',
    diagnosisResult: '<p>颅骨结构完整，脑实质密度均匀，脑室系统大小形态正常，脑沟裂池清晰。中线结构居中。</p>',
    analysis: '<p>AI分析：头部CT扫描未发现异常密度灶，无占位性病变。</p>',
    doctorConclusion: '头部CT检查未见明显异常。',
    treatmentSuggestion: '建议继续观察，如有不适及时就诊。'
  },
  {
    id: '3',
    reportNo: '20240701001',
    reportType: 'MRI诊断',
    title: '膝关节MRI检查报告',
    doctorName: '王医生',
    reportDate: '2024-07-03T09:15:00',
    status: '待审核',
    diagnosisResult: '<p>右侧膝关节间隙轻度变窄，内侧半月板后角可见高信号影，未达关节面。前后交叉韧带形态正常。</p>',
    analysis: '<p>AI分析：考虑右侧膝关节轻度骨关节炎改变，内侧半月板后角轻度变性。</p>',
    doctorConclusion: '',
    treatmentSuggestion: ''
  }
])

// 根据搜索条件过滤报告
const filteredReports = computed(() => {
  let result = [...reports.value]
  
  // 获取当前患者的病历号
  const patientMedicalRecord = authStore.user?.medicalRecord
  
  // 总是根据患者病历号过滤报告，确保只显示当前患者的报告
  if (patientMedicalRecord) {
    result = result.filter(report => report.reportNo === patientMedicalRecord)
  }
  
  // 如果有关键词搜索条件，则在报告类型、标题和医生姓名中搜索
  if (searchParams.keyword) {
    const keyword = searchParams.keyword.toLowerCase()
    result = result.filter(report => 
      report.reportType.toLowerCase().includes(keyword) ||
      report.title.toLowerCase().includes(keyword) ||
      report.doctorName.toLowerCase().includes(keyword)
    )
  }
  
  // 按报告日期降序排列
  result.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
  
  return result
})

// 加载报告数据
const loadReports = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 获取当前患者的病历号
    const patientMedicalRecord = authStore.user?.medicalRecord
    
    // 在实际应用中，这里应该从服务器获取数据
    // reports.value = await api.getPatientReports(patientMedicalRecord)
    
    // 模拟根据病历号更新报告数据（仅在需要时进行更新）
    if (patientMedicalRecord) {
      // 先备份当前数据，确保不会丢失
      const currentReports = [...reports.value]
      // 更新病历号
      reports.value = currentReports.map(report => ({
        ...report,
        reportNo: patientMedicalRecord
      }))
    }
  } catch (error) {
    ElMessage.error('加载报告数据失败')
    console.error('加载报告失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索报告
const searchReports = () => {
  pagination.currentPage = 1
  loadReports()
}

// 重置搜索
const resetSearch = () => {
  searchParams.keyword = ''
  pagination.currentPage = 1
  loadReports()
}

// 查看报告详情
const viewReport = (report: any) => {
  selectedReport.value = report
  reportDetailVisible.value = true
}

// 下载报告
const downloadReport = () => {
  // 模拟报告下载
  ElMessage.success('报告下载成功')
  // 实际应用中这里会调用下载API
}

// 获取报告类型标签
const getReportTypeTag = (type: string) => {
  const typeMap: { [key: string]: string } = {
    'X光诊断': 'primary',
    'CT诊断': 'success',
    'MRI诊断': 'warning',
    '超声诊断': 'info'
  }
  return typeMap[type] || 'info'
}

// 获取状态标签
const getStatusTag = (status: string) => {
  const statusMap: { [key: string]: string } = {
    '已完成': 'success',
    '待审核': 'warning',
    '已驳回': 'danger'
  }
  return statusMap[status] || 'info'
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (current: number) => {
  pagination.currentPage = current
}

// 返回患者工作台
const goBack = () => {
  router.push('/dashboard/patient')
}

// 组件挂载时加载数据
onMounted(() => {
  loadReports()
})
</script>

<style scoped>
.patient-reports {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  color: #1890ff;
  margin-bottom: 8px;
}

.page-header p {
  color: #666;
  margin: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
}

.patient-info {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
  margin: 20px 0;
}

.patient-info h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item label {
  font-weight: 500;
  margin-right: 10px;
  color: #666;
}

.medical-record {
  font-weight: 600;
  color: #1890ff;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 报告详情样式 */
.report-detail {
  line-height: 1.8;
}

.detail-header {
  padding-bottom: 20px;
  border-bottom: 2px solid #e8e8e8;
  margin-bottom: 20px;
}

.detail-header h3 {
  margin: 0 0 10px 0;
  color: #1890ff;
}

.detail-meta {
  display: flex;
  gap: 30px;
  color: #666;
  font-size: 14px;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  border-left: 4px solid #1890ff;
  padding-left: 10px;
}

.result-content,
.analysis-content,
.doctor-content,
.treatment-content {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.doctor-content,
.treatment-content {
  white-space: pre-wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .header-actions .el-input {
    width: 100% !important;
    margin-right: 0 !important;
  }
  
  .detail-meta {
    flex-direction: column;
    gap: 10px;
  }
}
</style>