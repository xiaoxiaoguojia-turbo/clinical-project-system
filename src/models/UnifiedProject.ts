import mongoose, { Schema, Document } from 'mongoose'

/* ------------------------------------------------------------------------------------------ */

// 枚举定义
export const ProjectTypeEnum = {
  INTERNAL_PREPARATION: 'internal-preparation',        // 院内制剂
  AI_MEDICAL_RESEARCH: 'ai-medical-research',          // AI医疗及系统研究
  DIAGNOSTIC_DETECTION: 'diagnostic-detection',        // 检测诊断
  CELL_THERAPY: 'cell-therapy',                        // 细胞治疗
  DRUG: 'drug',                                        // 药物
  MEDICAL_DEVICE: 'medical-device',                    // 医疗器械
  MEDICAL_MATERIAL: 'medical-material',                // 医用材料
  OTHER: 'other'                                       // 其他
} as const

export const DepartmentEnum = {
  DEPT_ONE: 'transfer-investment-dept-1',              // 转移转化与投资一部
  DEPT_TWO: 'transfer-investment-dept-2',              // 转移转化与投资二部
  DEPT_THREE: 'transfer-investment-dept-3'             // 转移转化与投资三部
} as const

export const ImportanceEnum = {
  VERY_IMPORTANT: 'very-important',                    // 非常重要
  IMPORTANT: 'important',                              // 重要
  NORMAL: 'normal',                                    // 一般
  NOT_IMPORTANT: 'not-important'                       // 不重要
} as const

export const ProjectStatusEnum = {
  EARLY_STAGE: 'early-stage',                          // 早期
  PRECLINICAL: 'preclinical',                          // 临床前
  CLINICAL_STAGE: 'clinical-stage',                    // 临床阶段
  MARKET_PRODUCT: 'market-product'                     // 上市产品
} as const

export const TransformRequirementEnum = {
  LICENSE: 'license',                                  // 许可
  TRANSFER: 'transfer',                                // 转让
  COMPANY_OPERATION: 'company-operation',              // 公司化运营
  OTHER: 'other'                                       // 其他
} as const

export const TransformProgressEnum = {
  CONTRACT_COMPLETED: 'contract-completed',            // 签约已完成
  CONTRACT_INCOMPLETE: 'contract-incomplete'           // 未完成
} as const

export const LeaderEnum = {
  YANGFENG: 'yangfeng',                                // 杨锋
  QINQINGSONG: 'qinqingsong',                          // 秦青松
  HAOJINGJING: 'haojingjing',                          // 郝菁菁
  CHENLONG: 'chenlong',                                // 陈栊
  WANGLIYAN: 'wangliyan',                              // 王立言
  MAOSHIWEI: 'maoshiwei',                              // 毛世伟
  XIAOLANCHUAN: 'xiaolanchuan',                        // 肖蓝川
  TO_BE_DETERMINED: 'to-be-determined'                 // 待定
} as const

/* ------------------------------------------------------------------------------------------ */

// 统一项目接口定义
export interface IUnifiedProject {
  _id?: string                             // ID
  
  // 通用必填字段
  department: string                       // 归属部门
  name: string                             // 项目名称
  projectType: string                      // 项目分类型
  source: string                           // 医院来源
  importance: string                       // 重要程度
  status: string                           // 项目进展状态
  leader: string                           // 负责人

  // 通用选填字段
  indication?: string                      // 适应症/科室
  transformRequirement?: string            // 转化需求（许可、转让、公司化运营、其他）
  transformProgress?: string               // 转化推进状态（签约已完成、未完成）
  hospitalDoctor?: string                  // 院端医生
  patent?: string                          // 专利信息
  clinicalData?: string                    // 临床数据
  marketSize?: string                      // 市场规模
  competitorStatus?: string                // 竞品状态
  conclusion?: string                      // 项目结论
  
  // 院内制剂特有字段

  // 院内制剂必填字段
  composition?: string                     // 组方
  function?: string                        // 功能

  // 院内制剂选填字段
  specification?: string                   // 制剂规格
  duration?: string                        // 使用年限
  recordNumber?: string                    // 备案号
  
  // 其他类型特有字段

  // 其他类型必填字段
  startDate?: Date                         // 开始日期

  // 系统字段
  attachments: string[]                    // 附件管理数组
  createTime: Date                         // 创建时间
  updateTime: Date                         // 更新时间
  createdBy: string                        // 创建人
  
  // AI报告
  aiReport?: {
    reportUrl?: string
    status: string
    firstGeneratedAt?: Date
    lastGeneratedAt?: Date
  }
}

export interface UnifiedProjectDocument extends Omit<IUnifiedProject, '_id'>, Document {}

/* ------------------------------------------------------------------------------------------ */

// Schema定义
const UnifiedProjectSchema: Schema = new Schema({
  // 通用必填字段
  department: {
    type: String,
    enum: {
      values: Object.values(DepartmentEnum),
      message: '部门必须是：转移转化与投资一部、转移转化与投资二部、转移转化与投资三部 之一'
    },
    required: [true, '部门为必填项'],
    default: DepartmentEnum.DEPT_ONE,
    maxlength: [100, '部门名称不能超过100个字符']
  },
  
  name: {
    type: String,
    required: [true, '项目名称为必填项'],
    trim: true,
    maxlength: [200, '项目名称不能超过200个字符'],
    index: true  // 添加索引用于搜索
  },
  
  projectType: {
    type: String,
    enum: {
      values: Object.values(ProjectTypeEnum),
      message: '项目类型必须是：院内制剂、AI医疗及系统研究、检测诊断、细胞治疗、药物、医疗器械、医用材料、其他 之一'
    },
    required: [true, '项目类型为必填项'],
    default: ProjectTypeEnum.INTERNAL_PREPARATION,
    index: true  // 添加索引用于筛选
  },
  
  source: {
    type: String,
    required: [true, '项目来源为必填项'],
    trim: true,
    maxlength: [100, '项目来源不能超过100个字符']
  },
  
  importance: {
    type: String,
    enum: {
      values: Object.values(ImportanceEnum),
      message: '重要程度必须是：非常重要、重要、一般、不重要 之一'
    },
    required: [true, '重要程度为必填项'],
    default: ImportanceEnum.VERY_IMPORTANT,
    index: true  // 添加索引用于筛选
  },
  
  status: {
    type: String,
    enum: {
      values: Object.values(ProjectStatusEnum),
      message: '项目状态必须是：早期、临床前、临床阶段、上市产品 之一'
    },
    required: [true, '项目状态为必填项'],
    default: ProjectStatusEnum.EARLY_STAGE,
    index: true  // 添加索引用于筛选
  },
  
  leader: {
    type: String,
    enum: {
      values: Object.values(LeaderEnum),
      message: '负责人必须是：杨锋、秦青松、郝菁菁、陈栊、王立言、毛世伟、肖蓝川、待定 之一'
    },
    required: [true, '负责人为必填项'],
    default: LeaderEnum.TO_BE_DETERMINED,
    trim: true,
    maxlength: [50, '负责人姓名不能超过50个字符'],
    index: true  // 添加索引用于筛选
  },

  // 通用选填字段
  indication: {
    type: String,
    trim: true,
    maxlength: [200, '适应症/科室不能超过200个字符']
  },
  
  transformRequirement: {
    type: String,
    enum: {
      values: Object.values(TransformRequirementEnum),
      message: '转化需求必须是：许可、转让、公司化运营、其他 之一'
    },
    default: TransformRequirementEnum.OTHER,
    trim: true
  },
  
  transformProgress: {
    type: String,
    enum: {
      values: Object.values(TransformProgressEnum),
      message: '转化推进状态必须是：签约已完成、未完成 之一'
    },
    default: TransformProgressEnum.CONTRACT_INCOMPLETE,
    trim: true
  },
  
  hospitalDoctor: {
    type: String,
    trim: true,
    maxlength: [50, '院端医生姓名不能超过50个字符']
  },

  patent: {
    type: String,
    trim: true,
    maxlength: [500, '专利信息不能超过500个字符']
  },
  
  clinicalData: {
    type: String,
    trim: true,
    maxlength: [1000, '临床数据不能超过1000个字符']
  },
  
  marketSize: {
    type: String,
    trim: true,
    maxlength: [200, '市场规模不能超过200个字符']
  },
  
  competitorStatus: {
    type: String,
    trim: true,
    maxlength: [500, '竞品状态不能超过500个字符']
  },
  
  conclusion: {
    type: String,
    trim: true,
    maxlength: [1000, '项目结论不能超过1000个字符']
  },
  
  // 院内制剂特有字段

  // 院内制剂必填字段
  composition: {
    type: String,
    trim: true,
    maxlength: [500, '组方不能超过500个字符'],
    // 动态必填验证：仅院内制剂类型必填
    validate: {
      validator: function(this: UnifiedProjectDocument, value: string) {
        if (this.projectType === ProjectTypeEnum.INTERNAL_PREPARATION) {
          return value && value.trim().length > 0
        }
        return true
      },
      message: '院内制剂项目的组方为必填项'
    }
  },
  
  function: {
    type: String,
    trim: true,
    maxlength: [300, '功能描述不能超过300个字符'],
    validate: {
      validator: function(this: UnifiedProjectDocument, value: string) {
        if (this.projectType === ProjectTypeEnum.INTERNAL_PREPARATION) {
          return value && value.trim().length > 0
        }
        return true
      },
      message: '院内制剂项目的功能为必填项'
    }
  },
  
  // 院内制剂选填字段
  specification: {
    type: String,
    trim: true,
    maxlength: [100, '规格不能超过100个字符']
  },
  
  duration: {
    type: String,
    trim: true,
    maxlength: [50, '年限不能超过50个字符']
  },
  
  recordNumber: {
    type: String,
    trim: true,
    maxlength: [100, '备案号不能超过100个字符']
    // 注意：按业务要求，不设置unique约束
  },
  
  // 其他类型特有字段

  // 其他类型必填字段
  startDate: {
    type: Date,
    validate: {
      validator: function(this: UnifiedProjectDocument, value: Date) {
        // 非院内制剂类型必填
        if (this.projectType !== ProjectTypeEnum.INTERNAL_PREPARATION) {
          return value != null
        }
        return true
      },
      message: '该项目类型的开始日期为必填项'
    }
  },

  // 系统字段
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: 'Attachment'
  }],
  
  createTime: {
    type: Date,
    default: Date.now,
    index: true  // 添加索引用于排序
  },
  
  updateTime: {
    type: Date,
    default: Date.now
  },
  
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '创建者为必填项'],
    index: true  // 添加索引用于筛选
  },
  
  // AI报告相关信息
  aiReport: {
    reportUrl: {
      type: String,
      default: null,
      maxlength: [2000, 'AI报告URL不能超过2000个字符']
    },
    status: {
      type: String,
      enum: ['idle', 'generating', 'completed', 'error'],
      default: 'idle',
      required: true
    },
    firstGeneratedAt: {
      type: Date,
      default: null
    },
    lastGeneratedAt: {
      type: Date,
      default: null
    }
  }
})

/* ------------------------------------------------------------------------------------------ */

// 索引优化
UnifiedProjectSchema.index({ projectType: 1, status: 1 })               // 复合索引：类型+状态
UnifiedProjectSchema.index({ department: 1, importance: 1 })            // 复合索引：部门+重要性
UnifiedProjectSchema.index({ leader: 1, projectType: 1 })               // 复合索引：负责人+类型
UnifiedProjectSchema.index({ name: 'text', source: 'text' })            // 文本搜索索引
UnifiedProjectSchema.index({ createTime: -1 })                          // 创建时间降序索引

// 更新时间中间件
UnifiedProjectSchema.pre('save', function(next) {
  this.updateTime = new Date()
  next()
})

/* ------------------------------------------------------------------------------------------ */

// 实例方法
UnifiedProjectSchema.methods.isInternalPreparation = function(): boolean {
  return this.projectType === ProjectTypeEnum.INTERNAL_PREPARATION
}

UnifiedProjectSchema.methods.canGenerateAIReport = function(): boolean {
  return this.aiReport?.status !== 'generating'
}

UnifiedProjectSchema.methods.getDisplayStatus = function(): string {
  const statusMap = {
    [ProjectStatusEnum.EARLY_STAGE]: '早期',
    [ProjectStatusEnum.PRECLINICAL]: '临床前', 
    [ProjectStatusEnum.CLINICAL_STAGE]: '临床阶段',
    [ProjectStatusEnum.MARKET_PRODUCT]: '上市产品'
  }
  return statusMap[this.status as keyof typeof statusMap] || this.status
}

UnifiedProjectSchema.methods.getDisplayImportance = function(): string {
  const importanceMap = {
    [ImportanceEnum.VERY_IMPORTANT]: '非常重要',
    [ImportanceEnum.IMPORTANT]: '重要',
    [ImportanceEnum.NORMAL]: '一般',
    [ImportanceEnum.NOT_IMPORTANT]: '不重要'
  }
  return importanceMap[this.importance as keyof typeof importanceMap] || this.importance
}

// 静态方法
UnifiedProjectSchema.statics.getProjectTypeDisplayName = function(projectType: string): string {
  const typeMap = {
    [ProjectTypeEnum.INTERNAL_PREPARATION]: '院内制剂',
    [ProjectTypeEnum.AI_MEDICAL_RESEARCH]: 'AI医疗及系统研究',
    [ProjectTypeEnum.DIAGNOSTIC_DETECTION]: '检测诊断',
    [ProjectTypeEnum.CELL_THERAPY]: '细胞治疗',
    [ProjectTypeEnum.DRUG]: '药物',
    [ProjectTypeEnum.MEDICAL_DEVICE]: '医疗器械',
    [ProjectTypeEnum.MEDICAL_MATERIAL]: '医用材料',
    [ProjectTypeEnum.OTHER]: '其他'
  }
  return typeMap[projectType as keyof typeof typeMap] || projectType
}

/* ------------------------------------------------------------------------------------------ */

export default mongoose.models.UnifiedProject || mongoose.model<UnifiedProjectDocument>('UnifiedProject', UnifiedProjectSchema)
