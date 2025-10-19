<template>
  <div class="case-management">
    <div class="header">
      <h2>病例管理</h2>
      <el-button type="primary" @click="showCreateCaseDialog = true">
        <el-icon><Plus /></el-icon>
        新建病例
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filters">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchQuery"
            placeholder="搜索患者姓名、病历号"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterStatus" placeholder="病例状态" clearable>
            <el-option label="待诊断" value="pending" />
            <el-option label="已诊断" value="diagnosed" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-col>
      </el-row>
    </div>

    <!-- 病例列表 -->
    <div class="case-list">
      <el-table :data="filteredCases" v-loading="loading">
        <el-table-column prop="caseId" label="病例编号" width="120" />
        <el-table-column prop="patientName" label="患者姓名" width="120" />
        <el-table-column prop="patientAge" label="年龄" width="80" />
        <el-table-column prop="patientGender" label="性别" width="80">
          <template #default="{ row }">
            {{ row.patientGender === 'male' ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="symptoms" label="主要症状" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTypeMap[row.status]">
              {{ statusTextMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewCaseDetail(row)">
              查看
            </el-button>
            <el-button link type="primary" @click="editCase(row)">
              编辑
            </el-button>
            <el-button link type="danger" @click="deleteCase(row.caseId)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalCases"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <!-- 创建病例对话框 -->
    <el-dialog
      v-model="showCreateCaseDialog"
      title="新建病例"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="caseFormRef"
        :model="caseForm"
        :rules="caseRules"
        label-width="100px"
      >
        <el-form-item label="患者姓名" prop="patientName">
          <el-input v-model="caseForm.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="年龄" prop="patientAge">
          <el-input-number
            v-model="caseForm.patientAge"
            :min="0"
            :max="120"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="性别" prop="patientGender">
          <el-radio-group v-model="caseForm.patientGender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="caseForm.contact" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="主要症状" prop="symptoms">
          <el-input
            v-model="caseForm.symptoms"
            type="textarea"
            :rows="3"
            placeholder="请输入患者主要症状"
          />
        </el-form-item>
        <el-form-item label="病史" prop="medicalHistory">
          <el-input
            v-model="caseForm.medicalHistory"
            type="textarea"
            :rows="3"
            placeholder="请输入患者病史"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateCaseDialog = false">取消</el-button>
        <el-button type="primary" @click="createCase" :loading="creating">
          创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import type { MedicalCase } from '@/types/medical'

// 模拟数据
const mockCases: MedicalCase[] = [
  {
    caseId: 'C20240001',
    patientName: '张三',
    patientAge: 45,
    patientGender: 'male',
    contact: '13800138000',
    symptoms: '右膝关节疼痛，活动受限',
    medicalHistory: '高血压病史5年',
    status: 'pending',
    createTime: '2024-01-15T10:30:00',
    doctorId: 'D001'
  },
  {
    caseId: 'C20240002',
    patientName: '李四',
    patientAge: 62,
    patientGender: 'female',
    contact: '13900139000',
    symptoms: '腰椎间盘突出，下肢麻木',
    medicalHistory: '糖尿病病史8年',
    status: 'diagnosed',
    createTime: '2024-01-14T14:20:00',
    doctorId: 'D001'
  }
]

const loading = ref(false)
const creating = ref(false)
const showCreateCaseDialog = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalCases = ref(mockCases.length)

const caseFormRef = ref<FormInstance>()
const caseForm = reactive({
  patientName: '',
  patientAge: 35,
  patientGender: 'male',
  contact: '',
  symptoms: '',
  medicalHistory: ''
})

const caseRules: FormRules = {
  patientName: [
    { required: true, message: '请输入患者姓名', trigger: 'blur' }
  ],
  patientAge: [
    { required: true, message: '请输入患者年龄', trigger: 'blur' }
  ],
  patientGender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
}

const statusTypeMap = {
  pending: 'warning',
  diagnosed: 'success',
  archived: 'info'
}

const statusTextMap = {
  pending: '待诊断',
  diagnosed: '已诊断',
  archived: '已归档'
}

const filteredCases = computed(() => {
  let cases = mockCases
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    cases = cases.filter(caseItem => 
      caseItem.patientName.toLowerCase().includes(query) ||
      caseItem.caseId.toLowerCase().includes(query)
    )
  }
  
  if (filterStatus.value) {
    cases = cases.filter(caseItem => caseItem.status === filterStatus.value)
  }
  
  return cases
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const viewCaseDetail = (caseItem: MedicalCase) => {
  // 跳转到病例详情页
  ElMessage.info(`查看病例 ${caseItem.caseId}`)
}

const editCase = (caseItem: MedicalCase) => {
  // 编辑病例
  ElMessage.info(`编辑病例 ${caseItem.caseId}`)
}

const deleteCase = async (caseId: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个病例吗？此操作不可恢复。',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 调用删除API
    ElMessage.success('病例删除成功')
  } catch (error) {
    // 用户取消删除
  }
}

const createCase = async () => {
  if (!caseFormRef.value) return

  try {
    await caseFormRef.value.validate()
    creating.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newCase: MedicalCase = {
      caseId: `C${new Date().getTime()}`,
      ...caseForm,
      status: 'pending',
      createTime: new Date().toISOString(),
      doctorId: 'D001' // 当前医生ID
    }
    
    mockCases.unshift(newCase)
    totalCases.value = mockCases.length
    
    ElMessage.success('病例创建成功')
    showCreateCaseDialog.value = false
  } catch (error) {
    ElMessage.error('病例创建失败')
  } finally {
    creating.value = false
  }
}

const resetForm = () => {
  caseFormRef.value?.resetFields()
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.case-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters {
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>