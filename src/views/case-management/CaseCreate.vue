<template>
  <div class="case-create-page">
    <div class="page-header">
      <div class="page-title-row">
        <div>
          <h1 class="page-title">新建病例</h1>
          <p class="page-subtitle">请仔细填写病例信息并上传影像资料创建新病例</p>
        </div>
      </div>
    </div>

    <form id="newCaseForm" @submit.prevent="handleSubmit">
      <!-- 患者基本信息 -->
      <div class="form-card">
        <h2 class="section-title">患者基本信息</h2>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label required">患者姓名</label>
            <input type="text" class="form-input" v-model="formData.patientName" placeholder="请输入患者姓名" required>
          </div>
          <div class="form-group">
            <label class="form-label required">年龄</label>
            <input type="text" class="form-input" v-model="formData.age" placeholder="请输入年龄" required>
          </div>
          <div class="form-group">
            <label class="form-label required">性别</label>
            <select class="form-select" v-model="formData.gender" required>
              <option value="">请选择性别</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">身份证号</label>
            <input type="text" class="form-input" v-model="formData.idNumber" placeholder="请输入身份证号（选填）">
            <span class="form-note">选填</span>
          </div>
          <div class="form-group">
            <label class="form-label required">联系电话</label>
            <input type="tel" class="form-input" v-model="formData.phone" placeholder="请输入联系电话" required>
          </div>
          <div class="form-group">
            <label class="form-label">医保卡号</label>
            <input type="text" class="form-input" v-model="formData.insuranceCard" placeholder="请输入医保卡号（选填）">
            <span class="form-note">选填</span>
          </div>
        </div>
      </div>

      <!-- 检查信息 -->
      <div class="form-card">
        <h2 class="section-title">检查信息</h2>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label required">申请科室</label>
            <select class="form-select" v-model="formData.department" required>
              <option value="">请选择科室</option>
              <option value="骨科">骨科</option>
              <option value="神经外科">神经外科</option>
              <option value="心内科">心内科</option>
              <option value="呼吸科">呼吸科</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">检查类型</label>
            <select class="form-select" v-model="formData.examType" required>
              <option value="">请选择检查类型</option>
              <option value="CT平扫">CT平扫</option>
              <option value="MRI平扫">MRI平扫</option>
              <option value="X光">X光</option>
              <option value="超声">超声</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">检查部位</label>
            <select class="form-select" v-model="formData.examPart" required>
              <option value="">请选择检查部位</option>
              <option value="头部">头部</option>
              <option value="胸部">胸部</option>
              <option value="腹部">腹部</option>
              <option value="脊柱">脊柱</option>
              <option value="四肢">四肢</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label required">检查日期</label>
            <input type="date" class="form-input" v-model="formData.examDate" required>
          </div>
          <div class="form-group">
            <label class="form-label required">申请医生</label>
            <select class="form-select" v-model="formData.doctorName" required>
              <option value="">请选择医生</option>
              <option value="张医生">张医生</option>
              <option value="李医生">李医生</option>
              <option value="王医生">王医生</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">紧急程度</label>
            <select class="form-select" v-model="formData.urgency">
              <option value="">请选择紧急程度</option>
              <option value="紧急">紧急</option>
              <option value="普通">普通</option>
              <option value="不急">不急</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 临床信息 -->
      <div class="form-card">
        <h2 class="section-title">临床信息</h2>
        <div class="form-row full">
          <div class="form-group">
            <label class="form-label required">主诉</label>
            <textarea class="form-textarea" v-model="formData.chiefComplaint" placeholder="请输入患者主要症状和不适的时间" required></textarea>
          </div>
        </div>
        <div class="form-row full">
          <div class="form-group">
            <label class="form-label">现病史</label>
            <textarea class="form-textarea" v-model="formData.presentIllness" placeholder="请输入患者当前疾病的发生、发展、诊疗过程（选填）"></textarea>
            <span class="form-note">选填</span>
          </div>
        </div>
        <div class="form-row full">
          <div class="form-group">
            <label class="form-label">既往史</label>
            <textarea class="form-textarea" v-model="formData.pastHistory" placeholder="请输入患者过去的健康状况和疾病史（选填）"></textarea>
            <span class="form-note">选填</span>
          </div>
        </div>
        <div class="form-row full">
          <div class="form-group">
            <label class="form-label required">检查目的</label>
            <textarea class="form-textarea" v-model="formData.examPurpose" placeholder="请说明此次检查的目的和需要解决的临床问题" required></textarea>
          </div>
        </div>
      </div>

      <!-- 影像上传 -->
      <div class="form-card">
        <h2 class="section-title">影像上传</h2>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">拖放文件到此处或点击上传</p>
        <p style="font-size: 12px; color: #999; margin-bottom: 16px;">支持 DICOM、JPG、PNG、PDF 格式，单个文件不超过 100MB</p>
        <div class="upload-count">已上传文件 ({{ uploadedFiles.length }})</div>
        <div 
          class="upload-area" 
          @click="triggerFileInput"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <div v-if="uploadedFiles.length === 0">
            <div class="upload-icon">📄</div>
            <div class="upload-text">暂无上传文件</div>
          </div>
          <div v-else>
            <div class="upload-icon">✓</div>
            <div class="upload-text">已上传 {{ uploadedFiles.length }} 个文件</div>
            <div class="upload-hint">点击继续添加文件</div>
          </div>
        </div>
        <input type="file" ref="fileInput" style="display: none;" multiple accept=".dcm,.jpg,.jpeg,.png,.pdf" @change="handleFileChange">
        
        <!-- 文件列表 -->
        <div v-if="uploadedFiles.length > 0" class="file-list">
          <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">({{ formatFileSize(file.size) }})</span>
            <button type="button" class="file-remove" @click="removeFile(index)">×</button>
          </div>
        </div>
      </div>

      <!-- 其他信息 -->
      <div class="form-card">
        <h2 class="section-title">其他信息</h2>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">备注信息</label>
            <textarea class="form-textarea" v-model="formData.remarks" placeholder="请输入其他需要说明的信息（选填）"></textarea>
            <span class="form-note">选填</span>
          </div>
          <div class="form-group">
            <label class="form-label">初始诊断</label>
            <textarea class="form-textarea" v-model="formData.initialDiagnosis" placeholder="请输入初步诊断意见（选填）"></textarea>
            <span class="form-note">选填</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="handleCancel">取消</button>
        <button type="button" class="btn btn-secondary" @click="saveDraft">保存草稿</button>
        <button type="submit" class="btn btn-primary">提交病例</button>
      </div>
    </form>
  </div>

  <!-- Success Message -->
  <div v-if="showSuccess" class="success-message">
    {{ successMessage }}
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const fileInput = ref<HTMLInputElement>()
const uploadedFiles = ref<File[]>([])
const showSuccess = ref(false)
const successMessage = ref('')

const formData = reactive({
  patientName: '',
  age: '',
  gender: '',
  idNumber: '',
  phone: '',
  insuranceCard: '',
  department: '',
  examType: '',
  examPart: '',
  examDate: '',
  doctorName: '',
  urgency: '',
  chiefComplaint: '',
  presentIllness: '',
  pastHistory: '',
  examPurpose: '',
  remarks: '',
  initialDiagnosis: ''
})

onMounted(() => {
  // 设置默认检查日期为今天
  const today = new Date()
  formData.examDate = today.toISOString().split('T')[0]
  
  // 自动填充当前医生信息
  if (authStore.user) {
    formData.doctorName = authStore.user.fullName || '张医生'
  }
})

const handleSubmit = async () => {
  // 验证必填项
  if (!formData.patientName || !formData.age || !formData.gender || 
      !formData.phone || !formData.department || !formData.examType || 
      !formData.examPart || !formData.examDate || !formData.doctorName ||
      !formData.chiefComplaint || !formData.examPurpose) {
    ElMessage.warning('请填写所有必填项')
    return
  }
  
  // 验证是否上传了文件
  if (uploadedFiles.value.length === 0) {
    ElMessage.warning('请至少上传一个影像文件')
    return
  }
  
  try {
    // 这里应该调用API保存数据
    console.log('提交病例数据:', { ...formData, files: uploadedFiles.value })
    
    // 显示成功消息
    successMessage.value = '病例创建成功！'
    showSuccess.value = true
    
    // 2秒后跳转
    setTimeout(() => {
      showSuccess.value = false
      router.push('/dashboard/doctor/case-management')
    }, 2000)
  } catch (error) {
    ElMessage.error('创建病例失败，请重试')
  }
}

const saveDraft = () => {
  // 保存草稿到localStorage
  const draftData = {
    ...formData,
    uploadedFiles: uploadedFiles.value.map(f => ({ name: f.name, size: f.size }))
  }
  localStorage.setItem('caseDraft', JSON.stringify(draftData))
  ElMessage.success('草稿保存成功！')
}

const handleCancel = () => {
  router.push('/dashboard/doctor/case-management')
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (e: any) => {
  const files = Array.from(e.target.files) as File[]
  uploadedFiles.value = [...uploadedFiles.value, ...files]
}

const handleDragOver = (e: DragEvent) => {
  const uploadArea = e.currentTarget as HTMLElement
  uploadArea.style.borderColor = '#1890ff'
  uploadArea.style.background = '#f0f7ff'
}

const handleDragLeave = (e: DragEvent) => {
  const uploadArea = e.currentTarget as HTMLElement
  uploadArea.style.borderColor = '#d9d9d9'
  uploadArea.style.background = '#fafafa'
}

const handleDrop = (e: DragEvent) => {
  const uploadArea = e.currentTarget as HTMLElement
  uploadArea.style.borderColor = '#d9d9d9'
  uploadArea.style.background = '#fafafa'
  
  const files = Array.from(e.dataTransfer?.files || [])
  uploadedFiles.value = [...uploadedFiles.value, ...files]
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.case-create-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.page-title {
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #999;
}

.form-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.form-row.full {
  grid-template-columns: 1fr;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.form-label.required::after {
  content: '*';
  color: #ff4d4f;
  margin-left: 4px;
}

.form-input,
.form-select,
.form-textarea {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #bfbfbf;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-note {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.upload-area:hover {
  border-color: #1890ff;
  background: #f0f7ff;
}

.upload-icon {
  font-size: 48px;
  color: #d9d9d9;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}

.upload-count {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.file-list {
  margin-top: 16px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.file-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.file-size {
  font-size: 12px;
  color: #999;
  margin-right: 12px;
}

.file-remove {
  background: #ff4d4f;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.file-remove:hover {
  background: #ff7875;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  margin-top: 24px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.btn {
  padding: 8px 24px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  background: white;
  transition: all 0.3s;
}

.btn:hover {
  opacity: 0.8;
}

.btn-primary {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.btn-primary:hover {
  background: #40a9ff;
  border-color: #40a9ff;
  opacity: 1;
}

.btn-secondary {
  background: white;
  color: #666;
  border-color: #d9d9d9;
}

.success-message {
  position: fixed;
  top: 24px;
  right: 24px;
  background: #52c41a;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
