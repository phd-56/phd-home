<template>
<div class="ai-diagnosis-container">
    <!-- 主容器 -->
    <div class="container">
        <!-- 页面标题 -->
        <div class="page-header">
            <h1 class="page-title">新建影像检查</h1>
            <p class="page-subtitle">上传患者影像并填写检查信息，开始诊断流程</p>
        </div>
        <!-- 步骤指示器 -->
        <div class="steps">
            <div class="step active">
                <div class="step-number">1</div>
                <div class="step-label">填写病例信息</div>
            </div>
            <div class="step active">
                <div class="step-number">2</div>
                <div class="step-label">影像上传</div>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <div class="step-label">AI诊断分析</div>
            </div>
            <div class="step">
                <div class="step-number">4</div>
                <div class="step-label">诊断结果</div>
            </div>
        </div>
        <!-- 患者基本信息 -->
        <div class="form-card">
            <div class="form-section-title">患者基本信息</div>
            <div class="form-section-subtitle">请填写患者的基本信息，其中*为必填项</div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">病例编号 <span class="required">*</span></label>
                    <input type="text" class="form-input" v-model="formData.caseId" placeholder="自动生成" disabled>
                </div>
                <div class="form-group">
                    <label class="form-label">患者姓名 <span class="required">*</span></label>
                    <input type="text" class="form-input" v-model="formData.patientName" placeholder="请输入患者姓名">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">性别 <span class="required">*</span></label>
                    <select class="form-select" v-model="formData.gender">
                        <option value="">请选择性别</option>
                        <option value="男">男</option>
                        <option value="女">女</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">年龄 <span class="required">*</span></label>
                    <input type="number" class="form-input" v-model="formData.age" placeholder="请输入患者年龄">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">申请科室 <span class="required">*</span></label>
                    <select class="form-select" v-model="formData.department">
                        <option value="">请选择科室</option>
                        <option value="骨科">骨科</option>
                        <option value="脊柱外科">脊柱外科</option>
                        <option value="创伤骨科">创伤骨科</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">申请医生 <span class="required">*</span></label>
                    <input type="text" class="form-input" v-model="formData.doctorName" placeholder="当前用户">
                </div>
            </div>
        </div>
        <!-- 检查信息 -->
        <div class="form-card">
            <div class="form-section-title">检查信息</div>
            <div class="form-section-subtitle">请选择检查相关信息，以便准确分析和诊断</div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">检查类型 <span class="required">*</span></label>
                    <select class="form-select" v-model="formData.examType">
                        <option value="">请选择检查类型</option>
                        <option value="X光">X光</option>
                        <option value="CT">CT</option>
                        <option value="MRI">MRI</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">检查部位 <span class="required">*</span></label>
                    <select class="form-select" v-model="formData.examPart">
                        <option value="">请选择检查部位</option>
                        <option value="脊柱">脊柱</option>
                        <option value="骨盆">骨盆</option>
                        <option value="四肢">四肢</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">检查设备</label>
                    <select class="form-select" v-model="formData.examDevice">
                        <option value="">请选择检查设备</option>
                        <option value="设备1">设备1</option>
                        <option value="设备2">设备2</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">检查日期 <span class="required">*</span></label>
                    <input type="date" class="form-input" v-model="formData.examDate" placeholder="请选择检查日期">
                </div>
            </div>
        </div>
        <!-- 影像上传 -->
        <div class="form-card">
            <div class="form-section-title">影像上传</div>
            <div class="form-section-subtitle">支持DICOM、JPG、PNG格式文件，单个文件不超过200MB，最多可上传50个文件</div>
            <div class="upload-section">
                <div class="upload-area" @click="handleFileUpload">
                    <div class="upload-icon">☁️</div>
                    <div class="upload-title">拖拽文件到此或点击上传</div>
                    <div class="upload-subtitle">支持DICOM、JPG、PNG格式</div>
                    <div class="upload-hint">单个文件不超过200MB，最多可上传50个文件</div>
                    <button class="upload-btn" type="button">开始上传</button>
                </div>
                <!-- 上传的文件列表 -->
                <div v-if="uploadedFiles.length > 0" class="uploaded-files">
                    <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">({{ formatFileSize(file.size) }})</span>
                        <button class="file-remove" @click="removeFile(index)">×</button>
                    </div>
                </div>
            </div>
            <div class="help-section">
                <div class="help-title">📋 上传帮助</div>
                <ul class="help-list">
                    <li>DICOM文件说明：支持标准DICOM 3.0格式的医学影像文件上传</li>
                    <li>批量上传：支持一次性上传多个文件，系统会自动处理</li>
                    <li>隐私保护：上传的所有医学影像数据均采用医疗级加密保护</li>
                </ul>
            </div>
        </div>
        <!-- 临床症状与病史 -->
        <div class="form-card">
            <div class="form-section-title">临床症状与病史</div>
            <div class="form-group">
                <textarea class="form-textarea" v-model="formData.symptoms" placeholder="请输入患者的临床症状、病史信息、既往诊断（选填）"></textarea>
            </div>
        </div>
        <!-- 按钮组 -->
        <div class="form-actions">
            <button class="btn btn-cancel" @click="handleCancel">取消</button>
            <button class="btn btn-next" @click="handleNext">开始AI诊断</button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const formData = ref({
  caseId: '',
  patientName: '',
  gender: '',
  age: '',
  department: '',
  doctorName: '',
  examType: '',
  examPart: '',
  examDevice: '',
  examDate: '',
  symptoms: ''
})

// 文件上传
const uploadedFiles = ref<File[]>([])

// 初始化
onMounted(() => {
  // 生成病例编号
  formData.value.caseId = generateCaseId()
  
  // 自动填充当前医生信息
  if (authStore.user) {
    formData.value.doctorName = authStore.user.fullName || '当前用户'
  }
  
  // 设置默认检查日期为今天
  const today = new Date()
  formData.value.examDate = today.toISOString().split('T')[0]
})

// 生成病例编号
const generateCaseId = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `CASE${year}${month}${day}${random}`
}

// 文件上传处理
const handleFileUpload = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.accept = '.dcm,.jpg,.jpeg,.png'
  input.onchange = (e: any) => {
    const files = Array.from(e.target.files) as File[]
    uploadedFiles.value = [...uploadedFiles.value, ...files]
  }
  input.click()
}

// 删除文件
const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

// 下一步
const handleNext = async () => {
  // 验证必填项
  if (!formData.value.patientName || !formData.value.gender || !formData.value.age || 
      !formData.value.department || !formData.value.examType || !formData.value.examPart || 
      !formData.value.examDate) {
    alert('请填写所有必填项')
    return
  }
  
  // 验证是否上传了文件
  if (uploadedFiles.value.length === 0) {
    alert('请至少上传一个影像文件')
    return
  }
  
  // 保存表单数据到本地存储
  const caseData = {
    ...formData.value,
    files: Array.from(uploadedFiles.value).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }))
  }
  
  // 将实际文件数据也保存（使用sessionStorage）
  sessionStorage.setItem('diagnosisCaseData', JSON.stringify(caseData))
  
  // 保存文件到sessionStorage（转换为base64）
  const filePromises = uploadedFiles.value.map((file, index) => {
    return new Promise<void>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const fileData = {
          name: file.name,
          data: e.target?.result
        }
        sessionStorage.setItem(`diagnosisFile_${index}`, JSON.stringify(fileData))
        resolve()
      }
      reader.readAsDataURL(file)
    })
  })
  
  // 等待所有文件读取完成
  await Promise.all(filePromises)
  
  // 跳转到AI诊断流程页面
  router.push('/dashboard/doctor/ai-diagnosis/process')
}

// 取消
const handleCancel = () => {
  router.push('/dashboard/doctor')
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.ai-diagnosis-container {
    min-height: 100vh;
    background: #f5f7fa;
    padding: 20px;
}
.container {
    max-width: 900px;
    margin: 40px auto;
    padding: 0 20px;
}
.page-header {
    margin-bottom: 30px;
}
.page-title {
    font-size: 28px;
    color: #1f2937;
    font-weight: 700;
    margin-bottom: 8px;
}
.page-subtitle {
    font-size: 14px;
    color: #6b7280;
}
.steps {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    position: relative;
}
.steps::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: #e5e7eb;
    z-index: 0;
}
.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 1;
    flex: 1;
}
.step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 2px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #9ca3af;
    font-size: 16px;
}
.step.active .step-number {
    background: #2563eb;
    border-color: #2563eb;
    color: white;
}
.step-label {
    font-size: 12px;
    color: #6b7280;
    text-align: center;
}
.step.active .step-label {
    color: #2563eb;
    font-weight: 600;
}
.form-card {
    background: white;
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.form-section-title {
    font-size: 16px;
    color: #1f2937;
    font-weight: 600;
    margin-bottom: 8px;
}
.form-section-subtitle {
    font-size: 12px;
    color: #9ca3af;
    margin-bottom: 20px;
}
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}
.form-row.full {
    grid-template-columns: 1fr;
}
.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.form-label {
    font-size: 14px;
    color: #1f2937;
    font-weight: 500;
}
.form-label .required {
    color: #ef4444;
}
.form-input,
.form-select,
.form-textarea {
    padding: 12px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    transition: all 0.3s ease;
}
.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
.form-input::placeholder,
.form-select::placeholder {
    color: #9ca3af;
}
.form-textarea {
    resize: vertical;
    min-height: 100px;
}
.upload-section {
    margin-bottom: 20px;
}
.upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #fafbfc;
}
.upload-area:hover,
.upload-area.dragover {
    border-color: #2563eb;
    background: #f0f9ff;
}
.upload-icon {
    font-size: 48px;
    margin-bottom: 12px;
    color: #9ca3af;
}
.upload-title {
    font-size: 14px;
    color: #1f2937;
    font-weight: 600;
    margin-bottom: 4px;
}
.upload-subtitle {
    font-size: 12px;
    color: #9ca3af;
    margin-bottom: 16px;
}
.upload-hint {
    font-size: 12px;
    color: #9ca3af;
    margin-bottom: 16px;
}
.upload-btn {
    padding: 10px 24px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}
.upload-btn:hover {
    background: #1d4ed8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
.uploaded-files {
    margin-top: 16px;
}
.file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: #f9fafb;
    border-radius: 6px;
    margin-bottom: 8px;
}
.file-name {
    flex: 1;
    font-size: 14px;
    color: #1f2937;
}
.file-size {
    font-size: 12px;
    color: #9ca3af;
    margin: 0 12px;
}
.file-remove {
    width: 24px;
    height: 24px;
    border: none;
    background: #ef4444;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}
.file-remove:hover {
    background: #dc2626;
    transform: scale(1.1);
}
.help-section {
    background: #f0f9ff;
    border-left: 4px solid #2563eb;
    padding: 16px;
    border-radius: 8px;
    margin-top: 20px;
}
.help-title {
    font-size: 14px;
    color: #2563eb;
    font-weight: 600;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.help-list {
    list-style: none;
    font-size: 12px;
    color: #6b7280;
    line-height: 1.8;
}
.help-list li {
    margin-bottom: 4px;
}
.help-list li::before {
    content: '• ';
    color: #2563eb;
    font-weight: bold;
}
.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 30px;
}
.btn {
    padding: 12px 32px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}
.btn-cancel {
    background: white;
    color: #1f2937;
    border: 1px solid #e5e7eb;
}
.btn-cancel:hover {
    background: #f9fafb;
    border-color: #d1d5db;
}
.btn-next {
    background: #2563eb;
    color: white;
    min-width: 120px;
}
.btn-next:hover {
    background: #1d4ed8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
.btn-next::after {
    content: ' →';
}
@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }
    .steps {
        gap: 10px;
    }
    .step-label {
        font-size: 10px;
    }
    .form-card {
        padding: 20px;
    }
    .page-title {
        font-size: 20px;
    }
    .form-actions {
        flex-direction: column-reverse;
    }
    .btn {
        width: 100%;
    }
}
</style>