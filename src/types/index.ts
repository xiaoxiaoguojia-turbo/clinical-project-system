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
  department: string // 归属部门，必填
  name: string // 项目名称，必填
  projectType: 'internal-preparation' | 'ai-medical-research' | 'diagnostic-detection' | 'cell-therapy' | 'drug' | 'medical-device' | 'medical-material' | 'other' // 项目分类型，必填
  source: string // 医院来源，必填
  importance: 'very-important' | 'important' | 'normal' | 'not-important' // 重要程度，必填
  status: 'early-stage' | 'preclinical' | 'clinical-stage' | 'market-product' // 项目进展状态，必填
  leader: string // 负责人，必填

  // 通用选填字段
  indication?: string // 适应症/科室，非必填
  transformRequirement?: 'license' | 'transfer' | 'company-operation' | 'other' // 转化需求，非必填
  transformProgress?: 'contract-completed' | 'contract-incomplete' // 转化推进状态，非必填
  hospitalDoctor?: string // 院端医生，非必填
  patent?: string // 专利信息，非必填
  clinicalData?: string // 临床数据，非必填
  marketSize?: string // 市场规模，非必填
  competitorStatus?: string // 竞品状态，非必填
  conclusion?: string // 项目结论，非必填
  
  // 院内制剂特有字段

  // 院内制剂必填字段
  composition?: string // 组方，必填
  function?: string // 功能，必填

  // 院内制剂选填字段
  specification?: string // 制剂规格，非必填
  duration?: string // 使用年限，非必填
  recordNumber?: string // 备案号，非必填
  
  // 其他类型特有字段

  // 其他类型必填字段
  startDate?: string // 开始日期，必填
  
  // 系统字段
  attachments: string[] // 附件管理数组
  createTime: string // 创建时间
  updateTime: string // 更新时间
  createdBy: string // 创建人
  
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
  LICENSE: 'license',
  TRANSFER: 'transfer',
  COMPANY_OPERATION: 'company-operation',
  OTHER: 'other'
} as const

export const UnifiedProjectTransformProgressEnum = {
  CONTRACT_COMPLETED: 'contract-completed',
  CONTRACT_INCOMPLETE: 'contract-incomplete'
} as const

export const UnifiedProjectLeaderEnum = {
  YANGFENG: 'yangfeng',
  QINQINGSONG: 'qinqingsong',
  HAOJINGJING: 'haojingjing',
  CHENLONG: 'chenlong',
  WANGLIYAN: 'wangliyan',
  MAOSHIWEI: 'maoshiwei',
  XIAOLANCHUAN: 'xiaolanchuan',
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
