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

// 转化需求进展节点类型
export type TransformRequirementType = 
  | 'investment'           // 投资
  | 'company-operation'    // 公司化运营
  | 'license-transfer'     // 许可转让
  | 'pending'              // 待推进

// 转化需求接口（简化版）
export interface TransformRequirement {
  type: TransformRequirementType            // 转化需求（类型）
  currentProgress: string                   // 进展节点
}

// 统一项目类型定义
export interface UnifiedProject {
  _id?: string                                                                              // 项目ID
  
  // 通用必填字段
  department: string                                                                        // 归属部门，必填
  name: string                                                                              // 项目名称，必填
  projectType: 'chinese-medicine-modernization' | 'ai-medical-research' | 'diagnostic-detection' | 'cell-therapy' | 'drug' | 'medical-device' | 'medical-material' | 'other' // 项目分类型，必填
  source: string                                                                            // 医院来源，必填
  importance: 'very-important' | 'important' | 'normal'                                     // 重要程度，必填
  status: string                                                                            // 项目进展状态，必填
  leader: string                                                                            // 负责人，必填
  transformRequirements: TransformRequirement[]                                             // 转化需求列表，必填

  // 通用选填字段
  indication?: string                                                                       // 适应症/科室，非必填
  dockingCompany?: string                                                                   // 对接企业，非必填
  hospitalDoctor?: string                                                                   // 院端医生，非必填
  patent?: string                                                                           // 专利信息，非必填
  clinicalData?: string                                                                     // 临床数据，非必填
  transformAmount?: number                                                                  // 转化金额（万元），非必填
  conclusion?: string                                                                       // 项目结论，非必填
  
  // 中药现代化特有字段（原院内制剂）

  // 中药现代化必填字段
  composition?: string                                                                      // 组方，必填
  function?: string                                                                         // 功能，必填

  // 中药现代化选填字段
  specification?: string                                                                    // 制剂规格，非必填
  duration?: string                                                                         // 使用年限，非必填
  recordNumber?: string                                                                     // 备案号，非必填
  
  // 其他类型特有字段

  // 其他类型必填字段
  startDate?: string                                                                        // 开始日期，必填
  
  // 系统字段
  attachments: string[]                                                                     // 附件管理数组
  createTime: string                                                                        // 创建时间
  updateTime: string                                                                        // 更新时间
  createdBy: string                                                                         // 创建人
  
  // AI报告
  aiReport?: {
    reportUrl?: string                                                                      // AI报告URL
    status: 'idle' | 'generating' | 'completed' | 'error'                                   // AI报告状态
    firstGeneratedAt?: string                                                               // AI报告首次生成时间
    lastGeneratedAt?: string                                                                // AI报告最后生成时间
  }
}

// 统一项目枚举类型
export const UnifiedProjectDepartmentEnum = {
  DEPT_ONE: 'transfer-investment-dept-1',
  DEPT_TWO: 'transfer-investment-dept-2',
  DEPT_THREE: 'transfer-investment-dept-3'
} as const

export const UnifiedProjectTypeEnum = {
  CHINESE_MEDICINE_MODERNIZATION: 'chinese-medicine-modernization',  // 中药现代化（原院内制剂）
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
  NORMAL: 'normal'
} as const

// 项目进展状态枚举（根据projectType不同）
export const UnifiedProjectStatusEnum = {
  // 中药现代化专用状态
  CHINESE_MEDICINE: {
    HOSPITAL_PREPARATION: 'hospital-preparation',  // 院内制剂
    EXPERIENCE_FORMULA: 'experience-formula',      // 经验方
    PROTOCOL_FORMULA: 'protocol-formula',          // 协定方
    EARLY_RESEARCH: 'early-research'               // 早期研究
  },
  // 医疗器械专用状态
  MEDICAL_DEVICE: {
    EARLY_STAGE: 'early-stage',                    // 早期
    SAMPLE_DESIGN: 'sample-design',                // 样品设计
    TYPE_INSPECTION: 'type-inspection',            // 型检
    CLINICAL_STAGE: 'clinical-stage',              // 临床阶段
    MARKET_PRODUCT: 'market-product'               // 上市产品
  },
  // 其他项目通用状态
  OTHER: {
    EARLY_STAGE: 'early-stage',                    // 早期
    PRECLINICAL: 'preclinical',                    // 临床前
    CLINICAL_STAGE: 'clinical-stage',              // 临床阶段
    MARKET_PRODUCT: 'market-product'               // 上市产品
  }
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

// 转化需求类型枚举
export const TransformRequirementTypeEnum = {
  INVESTMENT: 'investment',
  COMPANY_OPERATION: 'company-operation',
  LICENSE_TRANSFER: 'license-transfer',
  PENDING: 'pending'
} as const

// 转化需求进展节点映射
export const TransformRequirementProgressNodesMap = {
  investment: [
    '入库', '初筛', '立项', '尽调', '投决', 
    '投资协议签署', '交割', '投后管理', '退出'
  ],
  'company-operation': [
    '合同签署', '注册完成', '拟签约已过董事会或总裁会', '潜在待推进'
  ],
  'license-transfer': [
    '已完成', '院端已过会', '医企实质性谈判', '潜在待推进'
  ],
  pending: []  // 待推进项目无节点（空数组）
} as const

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
  projectType: 'overall' | 'chinese-medicine-modernization' | 'type2' | 'ai-medical-research' | 'diagnostic-detection' | 'cell-therapy' | 'drug' | 'medical-device' | 'medical-material' | 'other'
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
