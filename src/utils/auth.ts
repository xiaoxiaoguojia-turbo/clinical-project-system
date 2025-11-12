import { User } from '@/types'

export interface AuthUser {
  _id: string
  username: string
  role: 'admin' | 'user'
  realName?: string
  email?: string
  department?: string
  status: 'active' | 'inactive'
  createTime: Date
  updateTime: Date
  lastLogin?: Date
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data?: {
    user: AuthUser
    token: string
  }
  error?: string
}

// Token 管理
export class TokenManager {
  private static readonly TOKEN_KEY = 'token'
  private static readonly USER_KEY = 'user'
  private static readonly REMEMBER_USERNAME_KEY = 'remember_username'

  // 保存登录状态
  static saveAuth(token: string, user: AuthUser, rememberUsername?: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
      
      if (rememberUsername) {
        localStorage.setItem(this.REMEMBER_USERNAME_KEY, rememberUsername)
      } else {
        localStorage.removeItem(this.REMEMBER_USERNAME_KEY)
      }
    }
  }

  // 获取token
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY)
    }
    return null
  }

  // 获取用户信息
  static getUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.USER_KEY)
      if (userStr) {
        try {
          return JSON.parse(userStr)
        } catch (error) {
          console.error('解析用户信息失败:', error)
          return null
        }
      }
    }
    return null
  }

  // 获取记住的用户名
  static getRememberedUsername(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REMEMBER_USERNAME_KEY)
    }
    return null
  }

  // 清除登录状态
  static clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
      // 保留记住的用户名
    }
  }

  // 检查是否已登录
  static isAuthenticated(): boolean {
    return this.getToken() !== null && this.getUser() !== null
  }

  // 检查是否为管理员
  static isAdmin(): boolean {
    const user = this.getUser()
    return user?.role === 'admin'
  }

  // 获取用户显示名称
  static getUserDisplayName(): string {
    const user = this.getUser()
    return user?.realName || user?.username || '未知用户'
  }

  // 退出登录
  static logout() {
    this.clearAuth()
    // 注意：不在这里处理跳转，由调用方处理
  }

  // 安全的认证检查（避免hydration错误）
  static isAuthenticatedSafe(): boolean {
    // 在服务端渲染时总是返回false，避免hydration不匹配
    if (typeof window === 'undefined') {
      return false
    }
    return this.isAuthenticated()
  }
}

// API 调用封装
export class ApiClient {
  private static readonly BASE_URL = '/api'

  // 创建带token的请求headers
  private static createHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (includeAuth) {
      const token = TokenManager.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  // 处理API响应
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // 如果是401错误，清除登录状态
      if (response.status === 401) {
        TokenManager.clearAuth()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
      
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // 登录
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${this.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.createHeaders(false),
      body: JSON.stringify(credentials),
    })

    return this.handleResponse<LoginResponse>(response)
  }

  // 获取用户个人资料
  static async getProfile(): Promise<{ success: boolean; data?: AuthUser; error?: string }> {
    const response = await fetch(`${this.BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: this.createHeaders(),
    })

    return this.handleResponse(response)
  }

  // 通用GET请求
  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.createHeaders(),
    })

    return this.handleResponse<T>(response)
  }

  // 通用POST请求
  static async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.createHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  // 通用PUT请求
  static async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.createHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  // 通用DELETE请求
  static async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.createHeaders(),
    })

    return this.handleResponse<T>(response)
  }
}

// 权限检查函数
export const checkPermission = (requiredRole?: 'admin' | 'user'): boolean => {
  if (!TokenManager.isAuthenticatedSafe()) {
    return false
  }

  if (!requiredRole) {
    return true
  }

  const user = TokenManager.getUser()
  if (!user) {
    return false
  }

  // 管理员可以访问所有内容
  if (user.role === 'admin') {
    return true
  }

  // 普通用户只能访问user级别的内容
  return requiredRole === 'user'
}

// 格式化日期
export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 格式化日期时间
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取用户角色显示名称
export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    user: '普通用户'
  }
  return roleMap[role] || role
}

// 获取项目状态显示名称
export const getProjectStatusDisplayName = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: '进行中',
    completed: '已完成', 
    paused: '已暂停'
  }
  return statusMap[status] || status
}

// 获取项目状态颜色类名
export function getProjectStatusColorClass(status: string): string {
  switch (status) {
    case 'early-stage': return 'text-green-600 bg-green-100'
    case 'preclinical': return 'text-blue-600 bg-blue-100'
    case 'clinical-stage': return 'text-yellow-600 bg-yellow-100'
    case 'market-product': return 'text-red-600 bg-red-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

/**
 * 统一的认证请求函数 - 自动处理401错误
 * @param url 请求URL
 * @param options fetch选项
 * @returns 响应数据
 */
export async function authenticatedFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const token = TokenManager.getToken()
  
  if (!token) {
    // 没有令牌，直接跳转到登录页面
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new Error('未找到认证令牌')
  }

  // 合并headers
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options?.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // 处理401错误
    if (response.status === 401) {
      console.warn('🔒 令牌已过期或无效，正在跳转到登录页面...')
      TokenManager.clearAuth()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('认证令牌已过期')
    }

    // 处理其他错误
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    // 返回JSON数据
    return response.json()
  } catch (error) {
    // 如果是401错误已经处理过了
    if (error instanceof Error && error.message === '认证令牌已过期') {
      throw error
    }
    
    // 其他错误
    console.error('API请求失败:', error)
    throw error
  }
}
