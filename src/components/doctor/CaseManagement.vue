<template>
  <div class="case-management">
    <h2>病例管理</h2>
    <el-table :data="cases" v-loading="loading">
      <el-table-column prop="id" label="病例ID" width="100" />
      <el-table-column prop="patientName" label="患者姓名" width="120" />
      <el-table-column prop="diagnosis" label="诊断结果" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="日期" width="120" />
    </el-table>
  </div>
</template>

// 在 CaseManagement.vue 的 script 部分
<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义病例接口
interface MedicalCase {
  id: string
  patientName: string
  diagnosis: string
  status: string
  date: string
}

// 响应式数据
const cases = ref<MedicalCase[]>([])
const loading = ref(false)

// 获取病例列表
const fetchCases = async () => {
  loading.value = true
  try {
    // 模拟数据
    cases.value = [
      {
        id: '1',
        patientName: '张先生',
        diagnosis: '胫骨平台骨折',
        status: '待处理',
        date: '2025-10-21'
      },
      {
        id: '2', 
        patientName: '李女士',
        diagnosis: '膝关节退行性变',
        status: '已完成',
        date: '2025-10-20'
      }
    ]
  } catch (error) {
    console.error('获取病例失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCases()
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