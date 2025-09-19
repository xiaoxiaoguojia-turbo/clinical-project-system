// 用户相关类型
export interface User {
  _id: string
  username: string
  password: string
  role: 'admin' | 'user'
  email?: string
  realName?: string
  department?: string
  status: 'active' | 'inactive'
  createTime: Date
  updateTime: Date
  lastLogin?: Date
  createdBy?: string
}

// 用户响应类型（不包含敏感信息）
export interface UserResponse {
  _id: string
  username: string
  role: 'admin' | 'user'
  email?: string
  realName?: string
  department?: string
  status: 'active' | 'inactive'
  createTime: Date
  updateTime: Date
  lastLogin?: Date
  createdBy?: string
}

// 总体项目类型
export interface OverallProject {
  _id: string
  department: string
  type: string
  source: string
  name: string
  leader: string
  startDate: Date
  indication: string
  followUpWeeks: number
  importance: string
  stageOne: string
  stageTwo: string
  stageThree: string
  transformMethod: string
  hospitalPI: string
  projectOverview: string
  attachments: string[]
  status: 'active' | 'completed' | 'paused'
  createTime: Date
  updateTime: Date
  createdBy: string
}

// 院内制剂项目类型
export interface InternalPreparationProject {
  _id: string
  department: string
  source: string
  name: string
  composition: string
  function: string
  specification: string
  duration: string
  dosage: string
  recordNumber: string
  patent: string
  remarks: string
  attachments: string[]
  status: 'active' | 'completed' | 'paused'
  createTime: Date
  updateTime: Date
  createdBy: string
}

// 附件类型
export interface Attachment {
  _id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  storageType: 'gridfs' | 'filesystem'
  filePath?: string
  gridfsId?: string
  projectId: string
  projectType: 'overall' | 'internal-preparation'
  uploadTime: Date
  uploadedBy: string
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 分页参数类型
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    current: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// 登录请求类型
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应类型
export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

// JWT载荷类型
export interface JwtPayload {
  userId: string
  username: string
  role: string
  iat?: number
  exp?: number
}

// 统计数据类型
export interface StatisticsData {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  pausedProjects: number
  totalUsers: number
  activeUsers: number
  totalAttachments: number
  totalFileSize: number
}

// 图表数据类型
export interface ChartData {
  name: string
  value: number
  percentage?: number
}

// 表单字段类型
export interface FormField {
  name: string
  label: string
  type: 'input' | 'textarea' | 'select' | 'date' | 'number'
  required?: boolean
  options?: { label: string; value: any }[]
  placeholder?: string
}

// 菜单项类型
export interface MenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  children?: MenuItem[]
  path?: string
}

// 表格列配置类型
export interface TableColumn {
  title: string
  dataIndex: string
  key: string
  width?: number
  sorter?: boolean
  filters?: { text: string; value: string }[]
  render?: (text: any, record: any, index: number) => React.ReactNode
}
