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

// 统一项目类型定义
export interface UnifiedProject {
  _id?: string
  
  // 通用必填字段
  department: string
  name: string
  projectType: 'internal-preparation' | 'ai-medical-research' | 'diagnostic-detection' | 'cell-therapy' | 'drug' | 'medical-device' | 'medical-material' | 'other'
  source: string
  importance: 'very-important' | 'important' | 'normal' | 'not-important'
  status: 'early-stage' | 'preclinical' | 'clinical-stage' | 'market-product'
  
  // 院内制剂特有字段
  composition?: string
  function?: string
  specification?: string
  duration?: string
  dosage?: string
  recordNumber?: string
  remarks?: string
  
  // 其他类型特有字段
  leader?: string
  startDate?: string
  indication?: string
  followUpWeeks?: number
  transformRequirement?: 'license-transfer' | 'equity-investment' | 'trust-holding' | 'trust-management' | 'company-operation' | 'license-transfer-cash' | 'to-be-determined'
  hospitalDoctor?: string
  conclusion?: string
  
  // 通用扩展字段
  patent?: string
  clinicalData?: string
  marketSize?: string
  competitorStatus?: string
  
  // 系统字段
  attachments: string[]
  createTime: string
  updateTime: string
  createdBy: string
  
  // AI报告
  aiReport?: {
    reportUrl?: string
    status: 'idle' | 'generating' | 'completed' | 'error'
    firstGeneratedAt?: string
    lastGeneratedAt?: string
  }
}

// 统一项目枚举类型
export const UnifiedProjectTypeEnum = {
  INTERNAL_PREPARATION: 'internal-preparation',
  AI_MEDICAL_RESEARCH: 'ai-medical-research',
  DIAGNOSTIC_DETECTION: 'diagnostic-detection',
  CELL_THERAPY: 'cell-therapy',
  DRUG: 'drug',
  MEDICAL_DEVICE: 'medical-device',
  MEDICAL_MATERIAL: 'medical-material',
  OTHER: 'other'
} as const

export const UnifiedProjectImportanceEnum = {
  VERY_IMPORTANT: 'very-important',
  IMPORTANT: 'important',
  NORMAL: 'normal',
  NOT_IMPORTANT: 'not-important'
} as const

export const UnifiedProjectStatusEnum = {
  EARLY_STAGE: 'early-stage',
  PRECLINICAL: 'preclinical',
  CLINICAL_STAGE: 'clinical-stage',
  MARKET_PRODUCT: 'market-product'
} as const

export const UnifiedProjectTransformRequirementEnum = {
  LICENSE_TRANSFER: 'license-transfer',
  EQUITY_INVESTMENT: 'equity-investment',
  TRUST_HOLDING: 'trust-holding',
  TRUST_MANAGEMENT: 'trust-management',
  COMPANY_OPERATION: 'company-operation',
  LICENSE_TRANSFER_CASH: 'license-transfer-cash',
  TO_BE_DETERMINED: 'to-be-determined'
} as const

export const UnifiedProjectDepartmentEnum = {
  DEPT_ONE: 'transfer-investment-dept-1',
  DEPT_TWO: 'transfer-investment-dept-2',
  DEPT_THREE: 'transfer-investment-dept-3'
} as const

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
  // AI报告相关信息
  aiReport: {
    reportUrl?: string | null
    status: 'idle' | 'generating' | 'completed' | 'error'
    firstGeneratedAt?: Date | null
    lastGeneratedAt?: Date | null
  }
}

// 类型2项目类型
export interface Type2Project {
  _id: string
  department: string
  source: string
  name: string
  category: string                           // 分类
  leader: string                            // 负责人
  startDate: Date                           // 开始日期
  indication: string                        // 适应症/科室
  followUpWeeks: number                     // 跟进时间/周
  importance: 'very-important' | 'important' | 'normal'  // 重要程度
  status: 'initial-assessment' | 'project-approval' | 'implementation'  // 状态
  transformMethod: string                   // 转化方式/需求
  hospitalPI: string                        // 院端PI
  projectConclusion: string                 // 项目结论
  attachments: string[]
  createTime: Date
  updateTime: Date
  createdBy: string
  // AI报告相关信息（暂时禁用）
  aiReport: {
    reportUrl?: string | null
    status: 'idle' | 'generating' | 'completed' | 'error'
    firstGeneratedAt?: Date | null
    lastGeneratedAt?: Date | null
  }
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
  projectType: 'overall' | 'internal-preparation' | 'type2'
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
