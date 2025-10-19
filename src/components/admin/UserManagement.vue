<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="showAddUserDialog = true">
          <el-icon><Plus /></el-icon>
          新增用户
        </el-button>
        <el-button @click="exportUserData">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
      </div>
    </div>

    <!-- 用户统计 -->
    <div class="user-stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon total">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ userStats.total }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon doctors">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ userStats.doctors }}</div>
              <div class="stat-label">医生用户</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon patients">
              <el-icon><Avatar /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ userStats.patients }}</div>
              <div class="stat-label">患者用户</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon active">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ userStats.active }}</div>
              <div class="stat-label">活跃用户</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 用户列表 -->
    <div class="user-list">
      <div class="list-header">
        <h3>用户列表</h3>
        <div class="list-filters">
          <el-input
            v-model="searchQuery"
            placeholder="搜索用户名、姓名、邮箱..."
            clearable
            style="width: 250px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select v-model="filterRole" placeholder="用户角色" clearable>
            <el-option label="全部" value="" />
            <el-option label="患者" value="patient" />
            <el-option label="医生" value="doctor" />
            <el-option label="管理员" value="admin" />
          </el-select>
          
          <el-select v-model="filterStatus" placeholder="账户状态" clearable>
            <el-option label="正常" value="active" />
            <el-option label="禁用" value="disabled" />
            <el-option label="未激活" value="inactive" />
          </el-select>
          
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="注册开始日期"
            end-placeholder="注册结束日期"
          />
        </div>
      </div>

      <el-table
        :data="filteredUsers"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column prop="id" label="用户ID" width="100" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">
              {{ getRoleText(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.registerTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="180">
          <template #default="{ row }">
            {{ row.lastLogin ? formatDate(row.lastLogin) : '从未登录' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="editUser(row)">
              编辑
            </el-button>
            <el-button 
              link 
              :type="row.status === 'active' ? 'warning' : 'success'" 
              @click="toggleUserStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button link type="danger" @click="deleteUser(row.id)">
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
          :total="totalUsers"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog
      v-model="showAddUserDialog"
      :title="isEditing ? '编辑用户' : '新增用户'"
      width="600px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入真实姓名" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        
        <el-form-item label="用户角色" prop="role">
          <el-radio-group v-model="userForm.role">
            <el-radio label="patient">患者</el-radio>
            <el-radio label="doctor">医生</el-radio>
            <el-radio label="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="账户状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio label="active">正常</el-radio>
            <el-radio label="disabled">禁用</el-radio>
            <el-radio label="inactive">未激活</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item v-if="!isEditing" label="初始密码" prop="password">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入初始密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input
            v-model="userForm.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddUserDialog = false">取消</el-button>
        <el-button type="primary" @click="saveUser" :loading="saving">
          {{ isEditing ? '保存修改' : '创建用户' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Download, Search, User, UserFilled, Avatar, TrendCharts } from '@element-plus/icons-vue'

interface SystemUser {
  id: string
  username: string
  name: string
  email: string
  phone: string
  role: 'patient' | 'doctor' | 'admin'
  status: 'active' | 'disabled' | 'inactive'
  registerTime: string
  lastLogin?: string
  notes?: string
}

const loading = ref(false)
const saving = ref(false)
const showAddUserDialog = ref(false)
const isEditing = ref(false)
const searchQuery = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const userFormRef = ref<FormInstance>()
const userForm = reactive({
  id: '',
  username: '',
  name: '',
  email: '',
  phone: '',
  role: 'patient' as const,
  status: 'active' as const,
  password: '123456',
  notes: ''
})

const userStats = reactive({
  total: 156,
  doctors: 23,
  patients: 130,
  active: 142
})

// 模拟用户数据
const systemUsers = ref<SystemUser[]>([
  {
    id: 'U1001',
    username: 'doctor_li',
    name: '李医生',
    email: 'doctor_li@hospital.com',
    phone: '13800138001',
    role: 'doctor',
    status: 'active',
    registerTime: '2023-05-10T14:30:00',
    lastLogin: '2024-01-18T09:15:00'
  },
  {
    id: 'U1002',
    username: 'patient_zhang',
    name: '张患者',
    email: 'patient_zhang@email.com',
    phone: '13800138002',
    role: 'patient',
    status: 'active',
    registerTime: '2024-01-15T10:30:00',
    lastLogin: '2024-01-18T14:20:00'
  },
  {
    id: 'U1003',
    username: 'admin_wang',
    name: '王管理员',
    email: 'admin_wang@hospital.com',
    phone: '13800138003',
    role: 'admin',
    status: 'active',
    registerTime: '2023-01-08T09:00:00',
    lastLogin: '2024-01-18T16:45:00'
  }
])

const userRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能少于3位', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入初始密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const filteredUsers = computed(() => {
  let users = systemUsers.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    users = users.filter(user =>
      user.username.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }
  
  if (filterRole.value) {
    users = users.filter(user => user.role === filterRole.value)
  }
  
  if (filterStatus.value) {
    users = users.filter(user => user.status === filterStatus.value)
  }
  
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    users = users.filter(user => {
      const registerTime = new Date(user.registerTime)
      return registerTime >= start && registerTime <= end
    })
  }
  
  return users
})

const totalUsers = computed(() => filteredUsers.value.length)

const getRoleType = (role: string) => {
  const typeMap = {
    patient: 'success',
    doctor: 'primary',
    admin: 'danger'
  }
  return typeMap[role as keyof typeof typeMap] || 'info'
}

const getRoleText = (role: string) => {
  const textMap = {
    patient: '患者',
    doctor: '医生',
    admin: '管理员'
  }
  return textMap[role as keyof typeof textMap] || '未知'
}

const getStatusType = (status: string) => {
  const typeMap = {
    active: 'success',
    disabled: 'danger',
    inactive: 'warning'
  }
  return typeMap[status as keyof typeof typeMap] || 'info'
}

const getStatusText = (status: string) => {
  const textMap = {
    active: '正常',
    disabled: '禁用',
    inactive: '未激活'
  }
  return textMap[status as keyof typeof textMap] || '未知'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const editUser = (user: SystemUser) => {
  isEditing.value = true
  Object.assign(userForm, user)
  showAddUserDialog.value = true
}

const toggleUserStatus = async (user: SystemUser) => {
  const newStatus = user.status === 'active' ? 'disabled' : 'active'
  const action = user.status === 'active' ? '禁用' : '启用'
  
  try {
    await ElMessageBox.confirm(
      `确定要${action}用户 "${user.name}" 吗？`,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    user.status = newStatus
    ElMessage.success(`用户${action}成功`)
  } catch (error) {
    // 用户取消操作
  }
}

const deleteUser = async (userId: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个用户吗？此操作不可恢复。',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const index = systemUsers.value.findIndex(user => user.id === userId)
    if (index > -1) {
      systemUsers.value.splice(index, 1)
      userStats.total--
      ElMessage.success('用户删除成功')
    }
  } catch (error) {
    // 用户取消删除
  }
}

const saveUser = async () => {
  if (!userFormRef.value) return

  try {
    await userFormRef.value.validate()
    saving.value = true
    
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isEditing.value) {
      // 更新用户
      const index = systemUsers.value.findIndex(user => user.id === userForm.id)
      if (index > -1) {
        systemUsers.value[index] = { ...userForm }
      }
      ElMessage.success('用户信息更新成功')
    } else {
      // 新增用户
      const newUser: SystemUser = {
        ...userForm,
        id: `U${Date.now()}`,
        registerTime: new Date().toISOString()
      }
      systemUsers.value.unshift(newUser)
      userStats.total++
      ElMessage.success('用户创建成功')
    }
    
    showAddUserDialog.value = false
    resetUserForm()
  } catch (error) {
    ElMessage.error('保存失败，请检查表单')
  } finally {
    saving.value = false
  }
}

const resetUserForm = () => {
  userFormRef.value?.resetFields()
  userForm.id = ''
  userForm.password = '123456'
  isEditing.value = false
}

const exportUserData = () => {
  ElMessage.success('开始导出用户数据')
  // 这里实现数据导出逻辑
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.user-stats {
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.total {
  background: #409eff;
}

.stat-icon.doctors {
  background: #67c23a;
}

.stat-icon.patients {
  background: #e6a23c;
}

.stat-icon.active {
  background: #f56c6c;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.list-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>