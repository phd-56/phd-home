<template>
  <div class="new-case-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <a href="#" class="back-button" @click.prevent="goBack">
        ← 返回病例管理
      </a>
      <h1 class="page-title">新建病例</h1>
      <p class="page-subtitle">请仔细填写病例信息并上传影像资料创建新病例</p>
    </div>

    <form @submit.prevent="submitCase">
      <!-- 患者基本信息 -->
      <div class="form-card">
        <h2 class="section-title">患者基本信息</h2>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label required">患者姓名</label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="请输入患者姓名" 
              v-model="formData.patientName"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label required">年龄</label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="请输入年龄" 
              v-model="formData.age"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label required">性别</label>
            <select class="form-select" v-model="formData.gender" required>
              <option value="">请选择性别</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">身份证号</label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="请输入身份证号（选填）"
              v-model="formData.idCard"
            >
            <span class="form-note">选填</span>
          </div>
          <div class="form-group">
            <label class="form-label required">联系电话</label>
            <input 
              type="tel" 
              class="form-input" 
              placeholder="请输入联系电话" 
              v-model="formData.phone"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">医保卡号</label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="请输入医保卡号（选填）"
              v-model="formData.insuranceCard"
            >
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
            <input 
              type="date" 
              class="form-input" 
              v-model="formData.examDate"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label required">申请医生</label>
            <select class="form-select" v-model="formData.doctor" required>
              <option value="">请选择医生</option>
              <option value="张医生">张医生</option>
              <option value="李医生">李医生</option>
              <option value="王医生">王医生</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">紧急程度</label>
            <select class="form-select" v-model="formData.priority">
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
            <textarea 
              class="form-textarea" 
              placeholder="请输入患者主要症状和不适的时间" 
              v-model="formData.complaint"
              required
            ></textarea>
          </div>
        </div>
        <div class="form-row full">
          <div class="form-group">
            <label class="form-label">现病史</label>
            <textarea 
              class="form-textarea" 
              placeholder="请输入患者当前疾病的发生、发展、诊疗过程（选填）"
              v-model="formData.currentHistory"
            ></textarea>
            <span class="form-note">选填</span>
          </div>
        </div>
        <div class="form-row full">
          <div class="form-group">
            <label class="form-label">既往史</label>
            <textarea 
              class="form-textarea" 
              placeholder="请输入患者过去的健康状况和疾病史（选填）"
              v-model="formData.pastHistory"
            ></textarea>
            <span class="form-note">选填</span>
          </div>
        </div>
        <div class="form-row full">
          <div class="form-group">
            <label class="form-label required">检查目的</label>
            <textarea 
              class="form-textarea" 
              placeholder="请说明此次检查的目的和需要解决的临床问题" 
              v-model="formData.examPurpose"
              required
            ></textarea>
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
          <div class="upload-icon">{{ uploadedFiles.length > 0 ? '✓' : '📄' }}</div>
          <div class="upload-text">
            {{ uploadedFiles.length > 0 ? `已上传 ${uploadedFiles.length} 个文件` : '暂无上传文件' }}
          </div>
          <div v-if="uploadedFiles.length > 0" class="upload-hint">点击继续添加文件</div>
        </div>
        <input 
          ref="fileInput"
          type="file" 
          style="display: none;" 
          multiple 
          accept=".dcm,.jpg,.jpeg,.png,.pdf"
          @change="handleFileSelect"
        >
      </div>

      <!-- 其他信息 -->
      <div class="form-card">
        <h2 class="section-title">其他信息</h2>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">备注信息</label>
            <textarea 
              class="form-textarea" 
              placeholder="请输入其他需要说明的信息（选填）"
              v-model="formData.notes"
            ></textarea>
            <span class="form-note">选填</span>
          </div>
          <div class="form-group">
            <label class="form-label">初始诊断</label>
            <textarea 
              class="form-textarea" 
              placeholder="请输入初步诊断意见（选填）"
              v-model="formData.initialDiagnosis"
            ></textarea>
            <span class="form-note">选填</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="goBack">取消</button>
        <button type="button" class="btn btn-secondary" @click="saveDraft">保存草稿</button>
        <button type="submit" class="btn btn-primary">提交病例</button>
      </div>
    </form>

    <!-- 成功消息 -->
    <div v-if="showSuccessMessage" class="success-message show">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 表单数据
const formData = reactive({
  patientName: '',
  age: '',
  gender: '',
  idCard: '',
  phone: '',
  insuranceCard: '',
  department: '',
  examType: '',
  examPart: '',
  examDate: '',
  doctor: '',
  priority: '',
  complaint: '',
  currentHistory: '',
  pastHistory: '',
  examPurpose: '',
  notes: '',
  initialDiagnosis: ''
})

// 文件上传相关
const uploadedFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement>()
const showSuccessMessage = ref(false)
const successMessage = ref('')

// 文件上传处理
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const files = Array.from(target.files)
    uploadedFiles.value = [...uploadedFiles.value, ...files]
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  const uploadArea = event.currentTarget as HTMLElement
  uploadArea.style.borderColor = '#1890ff'
  uploadArea.style.background = '#f0f7ff'
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  const uploadArea = event.currentTarget as HTMLElement
  uploadArea.style.borderColor = '#d9d9d9'
  uploadArea.style.background = '#fafafa'
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const uploadArea = event.currentTarget as HTMLElement
  uploadArea.style.borderColor = '#d9d9d9'
  uploadArea.style.background = '#fafafa'
  
  if (event.dataTransfer?.files) {
    const files = Array.from(event.dataTransfer.files)
    uploadedFiles.value = [...uploadedFiles.value, ...files]
  }
}

// 表单提交
const submitCase = () => {
  // 生成病例编号
  const caseNumber = `CASE-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
  
  // 生成唯一ID
  const caseId = Date.now()
  
  const caseData = {
    id: caseId,
    ...formData,
    caseNumber,
    status: 'pending',
    createTime: new Date().toISOString(),
    lastUpdateTime: new Date().toISOString(),
    files: uploadedFiles.value,
    priority: formData.priority || 'normal'
  }
  
  // 保存到本地存储
  const existingCases = JSON.parse(localStorage.getItem('cases') || '[]')
  existingCases.unshift(caseData) // 添加到数组开头
  localStorage.setItem('cases', JSON.stringify(existingCases))
  
  console.log('提交病例数据:', caseData)
  
  showSuccessMessage.value = true
  successMessage.value = '病例创建成功！'
  
  setTimeout(() => {
    showSuccessMessage.value = false
    router.push('/dashboard/doctor/case-management')
  }, 2000)
}

// 保存草稿
const saveDraft = () => {
  console.log('保存草稿:', formData)
  
  showSuccessMessage.value = true
  successMessage.value = '草稿保存成功！'
  
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 2000)
}

// 返回
const goBack = () => {
  router.push('/dashboard/doctor/case-management')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.new-case-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  padding: 24px;
  margin-bottom: 24px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 8px;
}

.back-button:hover {
  color: #1890ff;
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

/* 表单卡片 */
.form-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  margin: 0 24px 16px 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

/* 表单布局 */
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

.required::after {
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
  font-family: inherit;
}

.form-note {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

/* 文件上传 */
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

/* 操作按钮 */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  margin-top: 24px;
  margin: 24px 24px 0 24px;
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

/* 成功消息 */
.success-message {
  position: fixed;
  top: 24px;
  right: 24px;
  background: #52c41a;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: none;
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

.success-message.show {
  display: block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-card {
    margin: 0 12px 16px 12px;
    padding: 16px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    margin: 24px 12px 0 12px;
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
