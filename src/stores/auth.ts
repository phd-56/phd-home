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

  interface LoginFormData {
    username: string;
    password: string;
    remember?: boolean;
  }

  const login = async (loginForm: LoginFormData): Promise<{ success: boolean; message?: string; user?: AuthUser }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
          const { username, password } = loginForm;
          
          // 查找用户（只通过username查找，不检查role）
          const foundUser = mockUsers.find(u => u.username === username);

          if (foundUser && password === '123456') {
            user.value = foundUser;
            token.value = 'mock-jwt-token-' + Date.now();

            // 保存到localStorage
            localStorage.setItem('token', token.value);
            localStorage.setItem('userInfo', JSON.stringify(foundUser));

            resolve({ success: true, user: foundUser });
          } else {
            resolve({ success: false, message: '用户名或密码错误' });
          }
        }, 1000);
      });
  }

  const loginByPhone = async (phoneForm: { phone: string; code: string; remember?: boolean }): Promise<{ success: boolean; message?: string; user?: AuthUser }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟手机号登录，这里可以根据手机号匹配用户
        // 为了演示，我们使用第一个患者用户
        const foundUser = mockUsers.find(u => u.role === 'patient');

        if (foundUser && phoneForm.code === '123456') {
          user.value = foundUser;
          token.value = 'mock-jwt-token-' + Date.now();

          // 保存到localStorage
          localStorage.setItem('token', token.value);
          localStorage.setItem('userInfo', JSON.stringify(foundUser));

          resolve({ success: true, user: foundUser });
        } else {
          resolve({ success: false, message: '手机号或验证码错误' });
        }
      }, 1000);
    });
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
    loginByPhone,
    register,
    logout,
    checkAuth,
    initialize
  }
})