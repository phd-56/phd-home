<template>
  <div class="case-status-change-page">
    <div class="page-header">
      <a class="back-button" @click="handleCancel">← 变更病例状态</a>
      <h1 class="page-title">变更病例状态</h1>
      <p class="page-subtitle">更新病例状态以开始查看更新病例</p>
    </div>

    <!-- Case Info Card -->
    <div class="case-info-card">
      <div class="case-header">
        <div class="case-id-section">
          <div class="case-id">{{ caseData.caseNumber }}</div>
          <div class="patient-info">患者：{{ caseData.patientName }} / {{ caseData.age }}岁 / {{ caseData.gender === 'male' ? '男' : '女' }}</div>
        </div>
        <div class="case-status-section">
          <span class="status-badge" :class="getStatusClass(caseData.status)">{{ getStatusText(caseData.status) }}</span>
          <span class="creation-time">创建于: {{ caseData.createTime }}</span>
        </div>
      </div>
      <div class="case-details">
        <div class="detail-item">
          <span class="detail-label">检查部位</span>
          <span class="detail-value">{{ caseData.examPart }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">检查类型</span>
          <span class="detail-value">{{ caseData.examType }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">申请科室</span>
          <span class="detail-value">{{ caseData.department }}</span>
        </div>
      </div>
    </div>

    <!-- Status Change Section -->
    <div class="status-change-card">
      <h2 class="section-title">状态变更</h2>
      <p class="section-subtitle">请选择新状态并填写变更原因</p>

      <div class="form-group">
        <label class="form-label">当前状态</label>
        <div class="current-status-flow">
          <span class="status-badge" :class="getStatusClass(caseData.status)">{{ getStatusText(caseData.status) }}</span>
          <span class="arrow">→</span>
          <span style="font-size: 14px; color: #666;">{{ getStatusDescription(caseData.status) }}</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">新状态<span class="required">*</span></label>
        <select class="form-select" v-model="newStatus" required>
          <option value="">请选择新状态</option>
          <option value="processing">诊断中</option>
          <option value="completed">已完成</option>
          <option value="rejected">已拒绝</option>
          <option value="pending-review">待审核</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">变更原因<span class="required">*</span></label>
        <textarea 
          class="form-textarea" 
          v-model="changeReason"
          placeholder="请详细描述状态变更的原因和依据（至少20字）"
          required
        ></textarea>
        <div class="form-hint">* 状态变更原因将被记录并显示给相关人员</div>
      </div>

      <div class="form-group">
        <label class="form-label">处理医生</label>
        <div class="processor-info">
          <a href="#" class="edit-link" @click.prevent="toggleDoctorDropdown">编辑</a>
          <span class="processor-name">{{ processorName }}</span>
        </div>
        <!-- 医生选择下拉框 -->
        <div v-if="showDoctorDropdown" class="doctor-dropdown">
          <div class="dropdown-header">
            <span>选择主治医师</span>
            <button class="close-btn" @click="toggleDoctorDropdown">×</button>
          </div>
          <div class="doctor-list">
            <div 
              v-for="doctor in doctors" 
              :key="doctor.id"
              class="doctor-item"
              :class="{ active: selectedDoctorId === doctor.id }"
              @click="selectDoctor(doctor)"
            >
              <div class="doctor-info">
                <div class="doctor-name">{{ doctor.name }}</div>
                <div class="doctor-title">{{ doctor.title }}</div>
              </div>
              <div class="doctor-badge" v-if="selectedDoctorId === doctor.id">✓</div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">附加说明</label>
        <textarea 
          class="form-textarea" 
          v-model="additionalNotes"
          placeholder="请输入人员相关说明的信息（选填）"
        ></textarea>
      </div>
    </div>

    <!-- Status History Section -->
    <div class="status-history-card">
      <h2 class="section-title">状态变更历史</h2>
      <p class="section-subtitle">病例状态变更记录与操作轨迹</p>

      <div class="timeline">
        <div v-for="(history, index) in statusHistory" :key="index" class="timeline-item" :class="{ active: index === 0, collapsed: index > 0 }">
          <div class="timeline-header">
            <div class="timeline-status">
              <span class="status-badge" :class="getStatusClass(history.status)">{{ getStatusText(history.status) }}</span>
              <span class="timeline-title">{{ history.title }}</span>
            </div>
            <span class="timeline-time">{{ history.time }}</span>
          </div>
          <div class="timeline-content">
            {{ history.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="btn btn-cancel" @click="handleCancel">取消</button>
      <button class="btn btn-primary" @click="submitStatusChange">确认变更</button>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccess" class="success-message">
      <span class="success-icon">✓</span>
      <span class="success-text">状态变更成功</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const newStatus = ref('')
const changeReason = ref('')
const additionalNotes = ref('')
const processorName = ref('张医生 (主任医师)')
const showSuccess = ref(false)
const showDoctorDropdown = ref(false)
const selectedDoctorId = ref('1')

// 医生列表数据
const doctors = ref([
  { id: '1', name: '张医生', title: '主任医师' },
  { id: '2', name: '李医生', title: '副主任医师' },
  { id: '3', name: '王医生', title: '主治医师' },
  { id: '4', name: '刘医生', title: '住院医师' },
  { id: '5', name: '陈医生', title: '主任医师' },
  { id: '6', name: '赵医生', title: '副主任医师' },
  { id: '7', name: '孙医生', title: '主治医师' },
  { id: '8', name: '周医生', title: '住院医师' }
])

const caseData = reactive({
  caseNumber: 'CASE-20230815-003',
  patientName: '张美丽',
  age: 45,
  gender: 'female',
  examPart: '腰椎 (L1-L5)',
  examType: 'MRI平扫',
  department: '骨科',
  status: 'pending',
  createTime: '2023-08-15 09:30'
})

const statusHistory = ref([
  {
    status: 'pending',
    title: '病例创建',
    time: '2023-08-15 09:30',
    content: '患者：系统自动创建病例，等待医生诊断'
  }
])

onMounted(() => {
  // 从路由参数或store中加载病例数据
  const caseNumber = route.params.caseNumber as string
  if (caseNumber) {
    // 这里应该从API加载数据
    console.log('加载病例:', caseNumber)
  }

  // 添加点击外部关闭下拉框的监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // 移除监听
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.processor-info') && !target.closest('.doctor-dropdown')) {
    showDoctorDropdown.value = false
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'status-pending',
    processing: 'status-processing',
    completed: 'status-completed',
    rejected: 'status-rejected',
    'pending-review': 'status-pending-review'
  }
  return classes[status] || ''
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '待处理',
    processing: '诊断中',
    completed: '已完成',
    rejected: '已拒绝',
    'pending-review': '待审核'
  }
  return texts[status] || status
}

const getStatusDescription = (status: string) => {
  const descs: Record<string, string> = {
    pending: '等待影像诊断',
    processing: '医生正在诊断中',
    completed: '诊断已完成',
    rejected: '病例已被拒绝',
    'pending-review': '等待审核'
  }
  return descs[status] || ''
}

const submitStatusChange = () => {
  if (!newStatus.value) {
    alert('请选择新状态')
    return
  }

  if (!changeReason.value || changeReason.value.length < 20) {
    alert('请输入至少20字的变更原因')
    return
  }

  // 显示成功消息
  showSuccess.value = true

  // 2秒后跳转
  setTimeout(() => {
    showSuccess.value = false
    router.push('/dashboard/doctor/case-management')
  }, 2000)
}

const toggleDoctorDropdown = () => {
  showDoctorDropdown.value = !showDoctorDropdown.value
}

const selectDoctor = (doctor: { id: string; name: string; title: string }) => {
  selectedDoctorId.value = doctor.id
  processorName.value = `${doctor.name} (${doctor.title})`
  showDoctorDropdown.value = false
}

const handleCancel = () => {
  router.push('/dashboard/doctor/case-management')
}
</script>

<style scoped>
.case-status-change-page {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 24px;
}

.page-header {
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
  cursor: pointer;
}

.back-button:hover {
  color: #4285f4;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #999;
}

/* Case Info Card */
.case-info-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.case-id-section {
  flex: 1;
}

.case-id {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.patient-info {
  font-size: 14px;
  color: #666;
}

.case-status-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.creation-time {
  font-size: 13px;
  color: #999;
}

.case-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 13px;
  color: #999;
}

.detail-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* Status Change Section */
.status-change-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 13px;
  color: #999;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.required {
  color: #ff4d4f;
  margin-left: 2px;
}

.current-status-flow {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
  margin-bottom: 20px;
}

.arrow {
  color: #999;
}

.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.form-select:hover {
  border-color: #4285f4;
}

.form-select:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s;
}

.form-textarea:hover {
  border-color: #4285f4;
}

.form-textarea:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
}

.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.processor-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-link {
  color: #4285f4;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.edit-link:hover {
  text-decoration: underline;
}

.processor-name {
  font-size: 14px;
  color: #333;
}

/* 医生选择下拉框样式 */
.doctor-dropdown {
  margin-top: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 8px 8px 0 0;
}

.dropdown-header span {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #e8e8e8;
  color: #333;
}

.doctor-list {
  padding: 8px;
}

.doctor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 4px;
}

.doctor-item:hover {
  background: #f5f7fa;
}

.doctor-item.active {
  background: #e6f7ff;
  border: 1px solid #4285f4;
}

.doctor-info {
  flex: 1;
}

.doctor-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.doctor-title {
  font-size: 12px;
  color: #999;
}

.doctor-badge {
  color: #4285f4;
  font-size: 18px;
  font-weight: bold;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-processing {
  background: #e6f7ff;
  color: #1890ff;
}

.status-completed {
  background: #f6ffed;
  color: #52c41a;
}

.status-rejected {
  background: #f5f5f5;
  color: #999;
}

.status-pending-review {
  background: #fff1f0;
  color: #cf1322;
}

/* Status History Section */
.status-history-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.timeline {
  position: relative;
  padding-left: 32px;
}

.timeline-item {
  position: relative;
  padding-bottom: 24px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -24px;
  top: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  border: 2px solid #4285f4;
}

.timeline-item.active::before {
  background: #4285f4;
}

.timeline-item::after {
  content: '';
  position: absolute;
  left: -19px;
  top: 20px;
  width: 2px;
  height: calc(100% - 12px);
  background: #e8eaed;
}

.timeline-item:last-child::after {
  display: none;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.timeline-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.timeline-time {
  font-size: 13px;
  color: #999;
}

.timeline-content {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.timeline-item.collapsed .timeline-content {
  color: #999;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.btn {
  padding: 8px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
}

.btn-cancel {
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
}

.btn-cancel:hover {
  color: #4285f4;
  border-color: #4285f4;
}

.btn-primary {
  background: #4285f4;
  color: white;
}

.btn-primary:hover {
  background: #3367d6;
}

/* Success Message */
.success-message {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 12px 24px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.success-icon {
  color: #52c41a;
  font-size: 16px;
}

.success-text {
  color: #333;
  font-size: 14px;
}

@media (max-width: 768px) {
  .case-details {
    grid-template-columns: 1fr;
  }
}
</style>

