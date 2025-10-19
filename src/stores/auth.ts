import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

// 定义更明确的用户类型
interface AuthUser extends User {
  id: number
  username: string
  email: string
  role: 'patient' | 'doctor' | 'admin'
  fullName: string
  createdAt: string
  hospital?: string
  medicalRecord?: string
}

export const useAuthStore = defineStore('auth', () => {
  // 使用明确的类型注解
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(localStorage.getItem('token')) // 从localStorage初始化

  // 使用 computed 的正确方式
  const isAuthenticated = computed(() => !!token.value)

  // 模拟用户数据
  const mockUsers: AuthUser[] = [
    {
      id: 1,
      username: 'doctor_li',
      email: 'doctor_li@hospital.com',
      role: 'doctor',
      fullName: '李医生',
      hospital: '北京协和医院',
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      username: 'patient_zhang',
      email: 'patient_zhang@email.com',
      role: 'patient',
      fullName: '张患者',
      medicalRecord: 'MR2023001',
      createdAt: '2023-03-20'
    },
    {
      id: 3,
      username: 'admin_wang',
      email: 'admin_wang@hospital.com',
      role: 'admin',
      fullName: '王管理员',
      createdAt: '2023-01-01'
    }
  ]

  const login = async (username: string, password: string, role: string): Promise<AuthUser> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(u =>
          u.username === username && u.role === role
        )

        if (foundUser && password === '123456') {
          user.value = foundUser
          token.value = 'mock-jwt-token-' + Date.now()

          // 保存到localStorage
          localStorage.setItem('token', token.value)
          localStorage.setItem('userInfo', JSON.stringify(foundUser))

          resolve(foundUser)
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }, 1000)
    })
  }

  const register = async (userData: Omit<AuthUser, 'id' | 'createdAt'>): Promise<AuthUser> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: AuthUser = {
          id: mockUsers.length + 1,
          ...userData,
          createdAt: new Date().toISOString()
        }
        mockUsers.push(newUser)
        resolve(newUser)
      }, 1000)
    })
  }

  const logout = (): void => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  const checkAuth = (): boolean => {
    // 从localStorage恢复状态
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('userInfo')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      return true
    }
    return false
  }

  const initialize = (): void => {
    checkAuth() // 初始化时检查认证状态
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    initialize
  }
})