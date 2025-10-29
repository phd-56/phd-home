<template>
  <div class="user-management-page">
    <div class="page-header">
      <h1>用户管理</h1>
      <p>管理系统用户、角色和权限</p>
    </div>

    <!-- 用户统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon"><User /></el-icon>
          <div class="stat-info">
            <div class="stat-number">{{ totalUsers }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon"><UserFilled /></el-icon>
          <div class="stat-info">
            <div class="stat-number">{{ doctorCount }}</div>
            <div class="stat-label">医生用户</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon"><User /></el-icon>
          <div class="stat-info">
            <div class="stat-number">{{ patientCount }}</div>
            <div class="stat-label">患者用户</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon"><Lock /></el-icon>
          <div class="stat-info">
            <div class="stat-number">{{ adminCount }}</div>
            <div class="stat-label">管理员</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 用户操作工具栏 -->
    <el-card class="toolbar-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAddUser">
            <el-icon><Plus /></el-icon>
            添加用户
          </el-button>
          <el-button @click="handleExportUsers">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户名、邮箱或角色..."
            style="width: 300px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </el-card>

    <!-- 用户表格 -->
    <el-card class="table-card">
      <el-table 
        :data="filteredUsers" 
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" />
        
        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="user-info">
              <div class="user-avatar">
                <el-icon><component :is="getAvatarIcon(row.role)" /></el-icon>
              </div>
              <div class="user-details">
                <div class="user-name">{{ row.fullName }}</div>
                <div class="user-username">@{{ row.username }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="邮箱" min-width="200" />
        
        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role)">
              {{ getRoleName(row.role) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditUser(row)">
              编辑
            </el-button>
            <el-button 
              size="small" 
              :type="row.status === 'active' ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalUsers"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="userForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userForm.fullName" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userForm.role" placeholder="选择角色">
            <el-option label="患者" value="patient" />
            <el-option label="医生" value="doctor" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="userForm.status"
            active-value="active"
            inactive-value="inactive"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, UserFilled, Lock, Plus, Download, Search } from '@element-plus/icons-vue'

interface User {
  id: number
  username: string
  email: string
  fullName: string
  role: 'patient' | 'doctor' | 'admin'
  status: 'active' | 'inactive'
  createdAt: string
  hospital?: string
  medicalRecord?: string
}

// 修复 UserForm 接口，包含可选的 id
interface UserForm {
  id?: number  // 添加可选 id
  username: string
  fullName: string
  email: string
  role: 'patient' | 'doctor' | 'admin'
  status: 'active' | 'inactive'
}

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const isEditing = ref(false)

// 修复 userForm 的初始值
const userForm = ref<UserForm>({
  username: '',
  fullName: '',
  email: '',
  role: 'patient',
  status: 'active'
})

// 模拟用户数据
const users = ref<User[]>([
  {
    id: 1,
    username: 'doctor_li',
    email: 'doctor_li@hospital.com',
    fullName: '李医生',
    role: 'doctor',
    status: 'active',
    createdAt: '2023-01-15',
    hospital: '北京协和医院'
  },
  {
    id: 2,
    username: 'patient_zhang',
    email: 'patient_zhang@email.com',
    fullName: '张患者',
    role: 'patient',
    status: 'active',
    createdAt: '2023-03-20',
    medicalRecord: 'MR2023001'
  },
  {
    id: 3,
    username: 'admin_wang',
    email: 'admin_wang@hospital.com',
    fullName: '王管理员',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-01'
  },
  {
    id: 4,
    username: 'doctor_chen',
    email: 'doctor_chen@hospital.com',
    fullName: '陈医生',
    role: 'doctor',
    status: 'inactive',
    createdAt: '2023-02-10',
    hospital: '上海瑞金医院'
  }
])

// 计算属性
const totalUsers = computed(() => users.value.length)
const doctorCount = computed(() => users.value.filter(u => u.role === 'doctor').length)
const patientCount = computed(() => users.value.filter(u => u.role === 'patient').length)
const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length)

const filteredUsers = computed(() => {
  let filtered = users.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.username.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.fullName.toLowerCase().includes(keyword) ||
      user.role.toLowerCase().includes(keyword)
    )
  }
  
  return filtered
})

const dialogTitle = computed(() => isEditing.value ? '编辑用户' : '添加用户')

// 方法
const getAvatarIcon = (role: string) => {
  const iconMap: { [key: string]: any } = {
    patient: User,
    doctor: UserFilled,
    admin: Lock
  }
  return iconMap[role] || User
}

const getRoleTagType = (role: string) => {
  const typeMap: { [key: string]: string } = {
    patient: 'info',
    doctor: 'primary',
    admin: 'warning'
  }
  return typeMap[role] || 'info'
}

const getRoleName = (role: string) => {
  const nameMap: { [key: string]: string } = {
    patient: '患者',
    doctor: '医生',
    admin: '管理员'
  }
  return nameMap[role] || '未知'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const handleAddUser = () => {
  isEditing.value = false
  userForm.value = {
    username: '',
    fullName: '',
    email: '',
    role: 'patient',
    status: 'active'
  }
  dialogVisible.value = true
}

const handleEditUser = (user: User) => {
  isEditing.value = true
  // 将 User 类型转换为 UserForm 类型
  userForm.value = {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status
  }
  dialogVisible.value = true
}

// 修复 handleSaveUser 方法
const handleSaveUser = () => {
  if (isEditing.value && userForm.value.id) {
    // 编辑用户 - 添加 id 检查
    const index = users.value.findIndex(u => u.id === userForm.value.id)
    if (index !== -1) {
      users.value[index] = { 
        ...users.value[index], 
        username: userForm.value.username,
        fullName: userForm.value.fullName,
        email: userForm.value.email,
        role: userForm.value.role,
        status: userForm.value.status
      }
    }
    ElMessage.success('用户信息更新成功')
  } else {
    // 添加用户
    const newUser: User = {
      id: users.value.length + 1,
      username: userForm.value.username,
      fullName: userForm.value.fullName,
      email: userForm.value.email,
      role: userForm.value.role,
      status: userForm.value.status,
      createdAt: new Date().toISOString()
    }
    users.value.push(newUser)
    ElMessage.success('用户添加成功')
  }
  dialogVisible.value = false
}

const handleToggleStatus = async (user: User) => {
  const action = user.status === 'active' ? '禁用' : '启用'
  
  try {
    await ElMessageBox.confirm(
      `确定要${action}用户 "${user.fullName}" 吗？`,
      `确认${action}`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    user.status = user.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`用户已${action}`)
  } catch {
    // 用户取消操作
  }
}

const handleExportUsers = () => {
  ElMessage.info('导出功能开发中...')
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.user-management-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-header p {
  color: #6b7280;
  font-size: 1.1rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  font-size: 3rem;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 4px;
}

.toolbar-card {
  margin-bottom: 20px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.table-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.user-username {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 20px 0;
}
</style>