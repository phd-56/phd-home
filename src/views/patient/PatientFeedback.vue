<template>
  <div class="patient-feedback">
    <div class="page-header">
      <h1>意见反馈</h1>
      <p>我们重视您的每一条建议，请告诉我们您的想法</p>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>提交反馈</span>
        </div>
      </template>

      <el-form :model="feedbackForm" :rules="rules" ref="feedbackFormRef" label-width="100px">
        <el-form-item label="反馈类型" prop="type">
          <el-select v-model="feedbackForm.type" placeholder="请选择反馈类型">
            <el-option label="功能建议" value="suggestion" />
            <el-option label="问题反馈" value="bug" />
            <el-option label="功能请求" value="feature" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="反馈标题" prop="title">
          <el-input v-model="feedbackForm.title" placeholder="请输入反馈标题" maxlength="50" show-word-limit />
        </el-form-item>

        <el-form-item label="反馈内容" prop="content">
          <el-input 
            v-model="feedbackForm.content" 
            type="textarea" 
            :rows="6" 
            placeholder="请详细描述您的问题或建议..." 
            maxlength="1000" 
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 提交成功提示 -->
    <el-dialog v-model="successVisible" title="提交成功" width="400px" :show-close="false">
      <div class="success-content">
        <el-icon class="success-icon"><Check /></el-icon>
        <p>感谢您的反馈！我们会尽快处理您的问题。</p>
      </div>
      <template #footer>
        <el-button type="primary" @click="successVisible = false; goBack()">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
//import { Check } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const feedbackFormRef = ref()
const successVisible = ref(false)

const feedbackForm = reactive({
  type: '',
  title: '',
  content: ''
})

const rules = {
  type: [
    { required: true, message: '请选择反馈类型', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入反馈标题', trigger: 'blur' },
    { min: 5, max: 50, message: '标题长度应为5-50个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入反馈内容', trigger: 'blur' },
    { min: 10, max: 1000, message: '内容长度应为10-1000个字符', trigger: 'blur' }
  ]
}

const submitFeedback = async () => {
  if (!feedbackFormRef.value.validate()) {
    return
  }

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    
    console.log('提交反馈:', {
      ...feedbackForm,
      userName: authStore.user?.fullName || '患者',
      createTime: new Date().toISOString(),
      status: 'pending'
    })
    
    successVisible.value = true
  } catch (error) {
    ElMessage.error('提交反馈失败，请稍后重试')
    console.error('提交反馈失败:', error)
  }
}

const resetForm = () => {
  feedbackFormRef.value.resetFields()
}

const goBack = () => {
  router.push('/dashboard/patient')
}
</script>

<style scoped>
.patient-feedback {
  padding: 20px;
  max-width: 800px;
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

.success-content {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 48px;
  color: #67c23a;
  margin-bottom: 20px;
}
</style>