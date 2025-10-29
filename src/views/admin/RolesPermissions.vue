<template>
  <div class="roles-permissions">
    <div class="page-header">
      <h1 class="page-title">角色与权限管理</h1>
      <p class="page-description">管理系统角色与权限分配，灵活控制用户访问权限</p>
    </div>

    <div class="roles-layout">
      <!-- 角色列表 -->
      <el-card class="roles-list-card">
        <div class="card-header">
          <h3 class="card-title">角色列表</h3>
          <el-button type="primary" @click="handleAddRole">添加角色</el-button>
        </div>
        
        <el-input
          v-model="searchKeyword"
          placeholder="搜索角色..."
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <div class="roles-grid">
          <div
            v-for="role in filteredRoles"
            :key="role.id"
            class="role-item"
            :class="{ active: selectedRole?.id === role.id }"
            @click="selectRole(role)"
          >
            <div class="role-header">
              <h4 class="role-name">{{ role.name }}</h4>
              <span class="role-count">{{ role.count }}人</span>
            </div>
            <p class="role-description">{{ role.description }}</p>
          </div>
        </div>
      </el-card>

      <!-- 权限配置 -->
      <el-card class="permissions-card" v-if="selectedRole">
        <div class="card-header">
          <h3 class="card-title">权限配置 - {{ selectedRole.name }}</h3>
          <el-button type="primary" @click="handleSavePermissions">保存权限</el-button>
        </div>

        <el-tree
          :data="permissionTree"
          :props="{ children: 'children', label: 'name' }"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          ref="permissionTreeRef"
          class="permission-tree"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

interface Role {
  id: number
  name: string
  description: string
  count: number
}

interface Permission {
  id: string
  name: string
  children?: Permission[]
}

const searchKeyword = ref('')
const selectedRole = ref<Role | null>(null)
const permissionTreeRef = ref()

const roles = ref<Role[]>([
  { id: 1, name: '超级管理员', description: '拥有所有权限', count: 1 },
  { id: 2, name: '医生', description: '可查看和管理患者', count: 86 },
  { id: 3, name: '医师', description: '可查看上传影像资料', count: 32 },
  { id: 4, name: '财务人员', description: '财务管理人员', count: 5 },
  { id: 5, name: '普通用户', description: '基础访问权限', count: 8 },
  { id: 6, name: '实习医生', description: '实习医生，监督指导', count: 3 }
])

const permissionTree = ref<Permission[]>([
  {
    id: '1',
    name: '系统管理',
    children: [
      { id: '1-1', name: '用户管理' },
      { id: '1-2', name: '角色管理' },
      { id: '1-3', name: '权限管理' }
    ]
  },
  {
    id: '2',
    name: '患者管理',
    children: [
      { id: '2-1', name: '查看患者' },
      { id: '2-2', name: '添加患者' },
      { id: '2-3', name: '编辑患者' },
      { id: '2-4', name: '删除患者' }
    ]
  },
  {
    id: '3',
    name: '影像管理',
    children: [
      { id: '3-1', name: '上传影像' },
      { id: '3-2', name: '查看影像' },
      { id: '3-3', name: '编辑影像' }
    ]
  }
])

const filteredRoles = computed(() => {
  if (!searchKeyword.value) return roles.value
  return roles.value.filter(role =>
    role.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const selectRole = (role: Role) => {
  selectedRole.value = role
}

const handleAddRole = () => {
  ElMessage.info('添加角色功能开发中...')
}

const handleSavePermissions = () => {
  if (!selectedRole.value) return
  ElMessage.success('权限保存成功')
}
</script>

<style scoped>
.roles-permissions {
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-description {
  color: #6b7280;
  font-size: 1rem;
}

.roles-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
}

.roles-list-card,
.permissions-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.search-input {
  margin-bottom: 16px;
}

.roles-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.role-item {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.role-item:hover {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.role-item.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.role-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.role-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.role-count {
  font-size: 0.875rem;
  color: #3b82f6;
}

.role-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.permission-tree {
  max-height: 600px;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .roles-layout {
    grid-template-columns: 1fr;
  }
}
</style>

