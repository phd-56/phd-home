export interface User {
  id: number
  username: string
  email: string
  role: 'patient' | 'doctor' | 'admin'
  avatar?: string
  fullName?: string
  medicalRecord?: string
  hospital?: string
  createdAt: string
}

export interface LoginForm {
  username: string
  password: string
  remember: boolean
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  role: 'patient' | 'doctor' | 'admin'
  fullName?: string
  hospital?: string
  medicalRecord?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}