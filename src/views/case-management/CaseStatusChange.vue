<template>
  <div class="case-status-change-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <a href="#" class="back-button" @click.prevent="goBack">
        ← 返回病例管理
      </a>
      <h1 class="page-title">变更病例状态</h1>
      <p class="page-subtitle">更新病例状态以开始查看更新病例</p>
    </div>

    <!-- 病例信息卡片 -->
    <div class="case-info-card">
      <div class="case-header">
        <div class="case-id-section">
          <div class="case-id">{{ caseData.caseNumber }}</div>
          <div class="patient-info">患者：{{ caseData.patientName }} / {{ caseData.age }}岁 / {{ caseData.gender }}</div>
        </div>
        <div class="case-status-section">
          <span class="status-badge" :class="`status-${caseData.status}`">
            {{ getStatusText(caseData.status) }}
          </span>
          <span class="creation-time">创建于: {{ formatDate(caseData.createTime) }}</span>
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

    <!-- 状态变更卡片 -->
    <div class="status-change-card">
      <h2 class="section-title">状态变更</h2>
      <p class="section-subtitle">请选择新状态并填写变更原因</p>

      <div class="form-group">
        <label class="form-label">当前状态</label>
        <div class="current-status-flow">
          <span class="status-badge" :class="`status-${caseData.status}`">
            {{ getStatusText(caseData.status) }}
          </span>
          <span class="arrow">→</span>
          <span style="font-size: 14px; color: #666;">等待影像诊断</span>
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
          :style="{ borderColor: changeReason.length > 0 && changeReason.length < 20 ? '#ff4d4f' : '#d9d9d9' }"
        ></textarea>
        <div class="form-hint">* 状态变更原因将被记录并显示给相关人员</div>
      </div>

      <div class="form-group">
        <label class="form-label">主治医师</label>
        <div class="processor-info">
          <span class="processor-name">{{ selectedDoctor.name }} ({{ selectedDoctor.title }})</span>
          <a href="#" class="edit-link" @click.prevent="showDoctorSelector = true">编辑</a>
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

    <!-- 状态历史卡片 -->
    <div class="status-history-card">
      <h2 class="section-title">状态变更历史</h2>
      <p class="section-subtitle">病例状态变更记录与操作轨迹</p>

      <div class="timeline">
        <div 
          v-for="(history, index) in statusHistory" 
          :key="index"
          class="timeline-item"
          :class="{ active: index === 0, collapsed: index > 0 }"
        >
          <div class="timeline-header">
            <div class="timeline-status">
              <span class="status-badge" :class="`status-${history.status}`">
                {{ getStatusText(history.status) }}
              </span>
              <span class="timeline-title">{{ history.title }}</span>
            </div>
            <span class="timeline-time">{{ formatDateTime(history.time) }}</span>
          </div>
          <div class="timeline-content">
            {{ history.content }}
          </div>
          <div v-if="history.operator" class="timeline-meta">
            操作人：{{ history.operator }}
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button class="btn btn-cancel" @click="goBack">取消</button>
      <button class="btn btn-primary" @click="submitStatusChange">确认变更</button>
    </div>

    <!-- 成功消息 -->
    <div v-if="showSuccessMessage" class="success-message show">
      <span class="success-icon">✓</span>
      <span class="success-text">状态变更成功</span>
    </div>

    <!-- 医生选择弹窗 -->
    <div v-if="showDoctorSelector" class="doctor-selector-modal" @click.self="showDoctorSelector = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>选择主治医师</h3>
          <button class="close-btn" @click="showDoctorSelector = false">×</button>
        </div>
        <div class="modal-body">
          <div class="department-filter">
            <label>科室筛选：</label>
            <select v-model="selectedDepartment" @change="filterDoctorsByDepartment">
              <option value="">全部科室</option>
              <option value="骨科">骨科</option>
              <option value="神经外科">神经外科</option>
              <option value="心内科">心内科</option>
              <option value="呼吸科">呼吸科</option>
              <option value="胸外科">胸外科</option>
            </select>
          </div>
          <div class="doctors-list">
            <div 
              v-for="doctor in filteredDoctors" 
              :key="doctor.id"
              class="doctor-item"
              :class="{ selected: selectedDoctor.id === doctor.id }"
              @click="selectDoctor(doctor)"
            >
              <div class="doctor-info">
                <div class="doctor-name">{{ doctor.name }}</div>
                <div class="doctor-title">{{ doctor.title }}</div>
                <div class="doctor-department">{{ doctor.department }}</div>
              </div>
              <div class="doctor-status">
                <span class="status-indicator" :class="doctor.status"></span>
                {{ doctor.statusText }}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDoctorSelector = false">取消</button>
          <button class="btn btn-primary" @click="confirmDoctorSelection">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 表单数据
const newStatus = ref('')
const changeReason = ref('')
const additionalNotes = ref('')
const showSuccessMessage = ref(false)

// 医生选择相关
const showDoctorSelector = ref(false)
const selectedDepartment = ref('')
const tempSelectedDoctor = ref<any>(null)

// 当前选中的医生
const selectedDoctor = reactive({
  id: 1,
  name: '张医生',
  title: '主任医师',
  department: '骨科'
})

// 病例数据
const caseData = reactive({
  id: 0,
  caseNumber: '',
  patientName: '',
  age: '',
  gender: '',
  examPart: '',
  examType: '',
  department: '',
  status: 'pending',
  createTime: ''
})

// 状态历史
const statusHistory = ref([
  {
    status: 'pending',
    title: '病例创建',
    content: '患者：系统自动创建病例，等待医生诊断',
    time: new Date().toISOString(),
    operator: '系统'
  }
])

// 医生数据
const doctors = ref([
  { id: 1, name: '张医生', title: '主任医师', department: '骨科', status: 'online', statusText: '在线' },
  { id: 2, name: '李医生', title: '副主任医师', department: '骨科', status: 'busy', statusText: '忙碌' },
  { id: 3, name: '王医生', title: '主治医师', department: '骨科', status: 'online', statusText: '在线' },
  { id: 4, name: '刘医生', title: '主任医师', department: '神经外科', status: 'online', statusText: '在线' },
  { id: 5, name: '陈医生', title: '副主任医师', department: '神经外科', status: 'offline', statusText: '离线' },
  { id: 6, name: '赵医生', title: '主治医师', department: '心内科', status: 'online', statusText: '在线' },
  { id: 7, name: '孙医生', title: '主任医师', department: '心内科', status: 'busy', statusText: '忙碌' },
  { id: 8, name: '周医生', title: '副主任医师', department: '呼吸科', status: 'online', statusText: '在线' },
  { id: 9, name: '吴医生', title: '主治医师', department: '呼吸科', status: 'offline', statusText: '离线' },
  { id: 10, name: '郑医生', title: '主任医师', department: '胸外科', status: 'online', statusText: '在线' }
])

// 根据科室筛选医生
const filteredDoctors = computed(() => {
  if (!selectedDepartment.value) {
    return doctors.value
  }
  return doctors.value.filter(doctor => doctor.department === selectedDepartment.value)
})

// 状态文本映射
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    processing: '诊断中',
    completed: '已完成',
    rejected: '已拒绝',
    'pending-review': '待审核'
  }
  return statusMap[status] || status
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 医生选择相关方法
const selectDoctor = (doctor: any) => {
  tempSelectedDoctor.value = doctor
}

const confirmDoctorSelection = () => {
  if (tempSelectedDoctor.value) {
    Object.assign(selectedDoctor, tempSelectedDoctor.value)
    showDoctorSelector.value = false
    ElMessage.success(`已选择主治医师：${tempSelectedDoctor.value.name}`)
  }
}

const filterDoctorsByDepartment = () => {
  // 筛选逻辑已在 computed 中处理
}

// 提交状态变更
const submitStatusChange = () => {
  // 验证
  if (!newStatus.value) {
    ElMessage.warning('请选择新状态')
    return
  }

  if (!changeReason.value || changeReason.value.length < 20) {
    ElMessage.warning('请输入至少20字的变更原因')
    return
  }

  // 更新病例状态
  const cases = JSON.parse(localStorage.getItem('cases') || '[]')
  const caseIndex = cases.findIndex((c: any) => c.id === caseData.id)
  
  if (caseIndex !== -1) {
    // 添加状态变更历史
    const newHistory = {
      status: newStatus.value,
      title: '状态变更',
      content: changeReason.value,
      time: new Date().toISOString(),
      operator: '张医生'
    }
    
    // 更新病例状态
    cases[caseIndex].status = newStatus.value
    cases[caseIndex].lastUpdateTime = new Date().toISOString()
    
    // 保存到本地存储
    localStorage.setItem('cases', JSON.stringify(cases))
    
    // 添加历史记录
    statusHistory.value.unshift(newHistory)
  }

  // 显示成功消息
  showSuccessMessage.value = true
  
  setTimeout(() => {
    showSuccessMessage.value = false
    router.push('/dashboard/doctor/case-management')
  }, 2000)
}

// 返回
const goBack = () => {
  router.push('/dashboard/doctor/case-management')
}

// 初始化
onMounted(() => {
  // 从路由参数获取病例ID
  const caseId = parseInt(route.params.id as string)
  
  // 从本地存储获取病例数据
  const cases = JSON.parse(localStorage.getItem('cases') || '[]')
  const caseItem = cases.find((c: any) => c.id === caseId)
  
  if (caseItem) {
    Object.assign(caseData, caseItem)
  } else {
    ElMessage.error('病例不存在')
    router.push('/dashboard/doctor/case-management')
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.case-status-change-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  border-bottom: 1px solid #e8eaed;
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

/* 病例信息卡片 */
.case-info-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin: 0 24px 16px 24px;
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

.status-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.status-pending {
  background: #fff7e6;
  color: #d46b08;
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
  background: #fff1f0;
  color: #cf1322;
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

/* 状态变更卡片 */
.status-change-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin: 0 24px 16px 24px;
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

.form-select,
.form-textarea {
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

.form-select:hover,
.form-textarea:hover {
  border-color: #4285f4;
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.processor-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

/* 状态历史卡片 */
.status-history-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin: 0 24px 24px 24px;
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

.timeline-meta {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.timeline-item.collapsed .timeline-content {
  color: #999;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  margin: 0 24px;
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

/* 成功消息 */
.success-message {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 12px 24px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: none;
  align-items: center;
  gap: 8px;
  z-index: 1000;
}

.success-message.show {
  display: flex;
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

/* 医生选择弹窗 */
.doctor-selector-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e8eaed;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.department-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.department-filter label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.department-filter select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  min-width: 120px;
}

.doctors-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.doctor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e8eaed;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.doctor-item:hover {
  border-color: #4285f4;
  background: #f8f9ff;
}

.doctor-item.selected {
  border-color: #4285f4;
  background: #e6f7ff;
}

.doctor-info {
  flex: 1;
}

.doctor-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.doctor-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 2px;
}

.doctor-department {
  font-size: 12px;
  color: #999;
}

.doctor-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.online {
  background: #52c41a;
}

.status-indicator.busy {
  background: #fa8c16;
}

.status-indicator.offline {
  background: #d9d9d9;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e8eaed;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  color: #4285f4;
  border-color: #4285f4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .case-info-card,
  .status-change-card,
  .status-history-card {
    margin: 0 12px 16px 12px;
    padding: 16px;
  }
  
  .case-details {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    margin: 0 12px;
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
  
  .doctor-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .doctor-status {
    align-self: flex-end;
  }
}
</style>
