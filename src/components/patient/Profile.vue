<template>
  <div class="profile-page">
    <div class="page-header">
      <h2>个人资料</h2>
      <p class="page-subtitle">管理您的个人信息和账户设置</p>
    </div>

    <div class="profile-content">
      <!-- 左侧：个人信息 -->
      <div class="profile-sidebar">
        <div class="user-card">
          <div class="avatar-section">
            <el-avatar :size="100" :src="userInfo.avatar" />
            <div class="avatar-actions">
              <el-button text @click="changeAvatar">更换头像</el-button>
            </div>
          </div>
          
          <div class="user-info">
            <h3 class="user-name">{{ userInfo.name }}</h3>
            <p class="user-role">患者</p>
            <p class="user-id">病历号: {{ userInfo.medicalRecord }}</p>
          </div>
          
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">{{ userStats.diagnosisCount }}</div>
              <div class="stat-label">诊断次数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userStats.reportsCount }}</div>
              <div class="stat-label">报告数量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userStats.memberDays }}</div>
              <div class="stat-label">会员天数</div>
            </div>
          </div>
        </div>

        <!-- 健康档案摘要 -->
        <div class="health-summary">
          <h4>健康档案摘要</h4>
          <div class="health-items">
            <div class="health-item">
              <span class="label">主要诊断:</span>
              <span class="value">{{ healthSummary.mainDiagnosis }}</span>
            </div>
            <div class="health-item">
              <span class="label">过敏史:</span>
              <span class="value">{{ healthSummary.allergies || '无' }}</span>
            </div>
            <div class="health-item">
              <span class="label">手术史:</span>
              <span class="value">{{ healthSummary.surgeryHistory || '无' }}</span>
            </div>
            <div class="health-item">
              <span class="label">家族病史:</span>
              <span class="value">{{ healthSummary.familyHistory || '无' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：资料编辑 -->
      <div class="profile-main">
        <el-tabs v-model="activeTab">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <div class="tab-content">
              <el-form
                ref="basicFormRef"
                :model="basicForm"
                :rules="basicRules"
                label-width="100px"
              >
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="basicForm.name" placeholder="请输入姓名" />
                </el-form-item>
                
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="basicForm.gender">
                    <el-radio label="male">男</el-radio>
                    <el-radio label="female">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="出生日期" prop="birthDate">
                  <el-date-picker
                    v-model="basicForm.birthDate"
                    type="date"
                    placeholder="选择出生日期"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                
                <el-form-item label="联系电话" prop="phone">
                  <el-input v-model="basicForm.phone" placeholder="请输入联系电话" />
                </el-form-item>
                
                <el-form-item label="电子邮箱" prop="email">
                  <el-input v-model="basicForm.email" placeholder="请输入电子邮箱" />
                </el-form-item>
                
                <el-form-item label="联系地址" prop="address">
                  <el-input
                    v-model="basicForm.address"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入联系地址"
                  />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveBasicInfo" :loading="saving">
                    保存修改
                  </el-button>
                  <el-button @click="resetBasicForm">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <!-- 健康信息 -->
          <el-tab-pane label="健康信息" name="health">
            <div class="tab-content">
              <el-form
                ref="healthFormRef"
                :model="healthForm"
                label-width="120px"
              >
                <el-form-item label="血型">
                  <el-select v-model="healthForm.bloodType" placeholder="请选择血型">
                    <el-option label="A型" value="A" />
                    <el-option label="B型" value="B" />
                    <el-option label="O型" value="O" />
                    <el-option label="AB型" value="AB" />
                    <el-option label="未知" value="unknown" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="身高 (cm)">
                  <el-input-number
                    v-model="healthForm.height"
                    :min="100"
                    :max="250"
                    controls-position="right"
                  />
                </el-form-item>
                
                <el-form-item label="体重 (kg)">
                  <el-input-number
                    v-model="healthForm.weight"
                    :min="30"
                    :max="200"
                    controls-position="right"
                  />
                </el-form-item>
                
                <el-form-item label="过敏史">
                  <el-input
                    v-model="healthForm.allergies"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入过敏史，如药物过敏、食物过敏等"
                  />
                </el-form-item>
                
                <el-form-item label="手术史">
                  <el-input
                    v-model="healthForm.surgeryHistory"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入手术史"
                  />
                </el-form-item>
                
                <el-form-item label="家族病史">
                  <el-input
                    v-model="healthForm.familyHistory"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入家族病史"
                  />
                </el-form-item>
                
                <el-form-item label="长期服药">
                  <el-input
                    v-model="healthForm.medications"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入长期服用的药物"
                  />
                </el-form-item>
                
                <el-form-item label="生活习惯">
                  <el-checkbox-group v-model="healthForm.lifestyle">
                    <el-checkbox label="吸烟">吸烟</el-checkbox>
                    <el-checkbox label="饮酒">饮酒</el-checkbox>
                    <el-checkbox label="规律运动">规律运动</el-checkbox>
                    <el-checkbox label="熬夜">经常熬夜</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveHealthInfo" :loading="saving">
                    保存健康信息
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <!-- 账户安全 -->
          <el-tab-pane label="账户安全" name="security">
            <div class="tab-content">
              <div class="security-items">
                <div class="security-item">
                  <div class="item-info">
                    <h4>登录密码</h4>
                    <p>定期更改密码可以提高账户安全性</p>
                  </div>
                  <el-button @click="changePassword">修改密码</el-button>
                </div>
                
                <div class="security-item">
                  <div class="item-info">
                    <h4>绑定手机</h4>
                    <p>已绑定手机: {{ userInfo.phone }}</p>
                  </div>
                  <el-button @click="changePhone">更换手机</el-button>
                </div>
                
                <div class="security-item">
                  <div class="item-info">
                    <h4>登录记录</h4>
                    <p>查看最近的登录活动</p>
                  </div>
                  <el-button @click="viewLoginHistory">查看记录</el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- 隐私设置 -->
          <el-tab-pane label="隐私设置" name="privacy">
            <div class="tab-content">
              <div class="privacy-settings">
                <h4>数据共享设置</h4>
                <div class="privacy-item">
                  <div class="item-info">
                    <h5>允许医生查看我的健康数据</h5>
                    <p>授权医生在诊断时查看您的健康档案信息</p>
                  </div>
                  <el-switch v-model="privacySettings.shareWithDoctors" />
                </div>
                
                <div class="privacy-item">
                  <div class="item-info">
                    <h5>参与匿名医学研究</h5>
                    <p>匿名分享数据用于医学研究和AI模型训练</p>
                  </div>
                  <el-switch v-model="privacySettings.participateResearch" />
                </div>
                
                <div class="privacy-item">
                  <div class="item-info">
                    <h5>接收健康资讯推送</h5>
                    <p>接收个性化的健康知识和疾病预防信息</p>
                  </div>
                  <el-switch v-model="privacySettings.receiveNotifications" />
                </div>
                
                <el-button type="primary" @click="savePrivacySettings" class="save-privacy-btn">
                  保存隐私设置
                </el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="400px">
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="80px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="submitPasswordChange" :loading="changingPassword">
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const activeTab = ref('basic')
const saving = ref(false)
const showPasswordDialog = ref(false)
const changingPassword = ref(false)

const basicFormRef = ref<FormInstance>()
const healthFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

const userInfo = reactive({
  name: '张患者',
  avatar: 'https://via.placeholder.com/100x100?text=Patient',
  medicalRecord: 'MR20240001',
  phone: '138****1234',
  email: 'patient@example.com'
})

const userStats = reactive({
  diagnosisCount: 12,
  reportsCount: 8,
  memberDays: 156
})

const healthSummary = reactive({
  mainDiagnosis: '膝关节骨关节炎',
  allergies: '青霉素过敏',
  surgeryHistory: '无',
  familyHistory: '父亲有高血压病史'
})

const basicForm = reactive({
  name: '张患者',
  gender: 'male',
  birthDate: '1980-01-15',
  phone: '13800138000',
  email: 'patient@example.com',
  address: '北京市朝阳区某某街道123号'
})

const healthForm = reactive({
  bloodType: 'A',
  height: 175,
  weight: 70,
  allergies: '青霉素过敏',
  surgeryHistory: '无',
  familyHistory: '父亲有高血压病史',
  medications: '钙片，维生素D',
  lifestyle: ['规律运动']
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const privacySettings = reactive({
  shareWithDoctors: true,
  participateResearch: false,
  receiveNotifications: true
})

const basicRules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const changeAvatar = () => {
  ElMessage.info('更换头像功能开发中')
}

const saveBasicInfo = async () => {
  if (!basicFormRef.value) return

  try {
    await basicFormRef.value.validate()
    saving.value = true
    
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    userInfo.name = basicForm.name
    userInfo.phone = basicForm.phone
    userInfo.email = basicForm.email
    
    ElMessage.success('基本信息保存成功')
  } catch (error) {
    ElMessage.error('保存失败，请检查表单')
  } finally {
    saving.value = false
  }
}

const resetBasicForm = () => {
  basicFormRef.value?.resetFields()
}

const saveHealthInfo = async () => {
  saving.value = true
  
  try {
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    healthSummary.allergies = healthForm.allergies
    healthSummary.surgeryHistory = healthForm.surgeryHistory
    healthSummary.familyHistory = healthForm.familyHistory
    
    ElMessage.success('健康信息保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

const changePassword = () => {
  showPasswordDialog.value = true
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const submitPasswordChange = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    changingPassword.value = true
    
    // 模拟密码修改过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('密码修改成功')
    showPasswordDialog.value = false
  } catch (error) {
    ElMessage.error('密码修改失败')
  } finally {
    changingPassword.value = false
  }
}

const changePhone = () => {
  ElMessage.info('更换手机功能开发中')
}

const viewLoginHistory = () => {
  ElMessage.info('查看登录记录功能开发中')
}

const savePrivacySettings = () => {
  ElMessage.success('隐私设置保存成功')
}
</script>

<style scoped>
.profile-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.page-subtitle {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 16px;
}

.profile-content {
  display: flex;
  gap: 24px;
}

.profile-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.profile-main {
  flex: 1;
}

.user-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 20px;
}

.avatar-section {
  margin-bottom: 16px;
}

.avatar-actions {
  margin-top: 12px;
}

.user-info {
  margin-bottom: 20px;
}

.user-name {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 20px;
}

.user-role {
  margin: 0 0 4px 0;
  color: #409eff;
  font-size: 14px;
}

.user-id {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.health-summary {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.health-summary h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}

.health-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.health-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.health-item .label {
  color: #666;
  font-size: 14px;
  min-width: 80px;
  text-align: left;
}

.health-item .value {
  color: #333;
  font-size: 14px;
  text-align: right;
  flex: 1;
  margin-left: 12px;
}

.tab-content {
  padding: 20px;
  background: white;
  border-radius: 0 0 8px 8px;
}

.security-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.item-info h4 {
  margin: 0 0 4px 0;
  color: #333;
}

.item-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.privacy-settings {
  max-width: 600px;
}

.privacy-settings h4 {
  margin: 0 0 20px 0;
  color: #333;
}

.privacy-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.privacy-item:last-child {
  border-bottom: none;
}

.privacy-item .item-info h5 {
  margin: 0 0 4px 0;
  color: #333;
}

.privacy-item .item-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.save-privacy-btn {
  margin-top: 20px;
}
</style>