import mongoose, { Schema, Document } from 'mongoose'

/* ------------------------------------------------------------------------------------------ */

// 枚举定义
export const DepartmentEnum = {
  DEPT_ONE: 'transfer-investment-dept-1',              // 转移转化与投资一部
  DEPT_TWO: 'transfer-investment-dept-2',              // 转移转化与投资二部
  DEPT_THREE: 'transfer-investment-dept-3'             // 转移转化与投资三部
} as const

export const ProjectTypeEnum = {
  CHINESE_MEDICINE_MODERNIZATION: 'chinese-medicine-modernization',           // 中药现代化（原院内制剂）
  AI_MEDICAL_RESEARCH: 'ai-medical-research',                                 // AI医疗及系统研究
  DIAGNOSTIC_DETECTION: 'diagnostic-detection',                               // 检测诊断
  CELL_THERAPY: 'cell-therapy',                                               // 细胞治疗
  DRUG: 'drug',                                                               // 药物
  MEDICAL_DEVICE: 'medical-device',                                           // 医疗器械
  MEDICAL_MATERIAL: 'medical-material',                                       // 医用材料
  OTHER: 'other'                                                              // 其他
} as const

export const ImportanceEnum = {
  VERY_IMPORTANT: 'very-important',                    // 非常重要
  IMPORTANT: 'important',                              // 重要
  NORMAL: 'normal'                                     // 一般
  // 删除了 NOT_IMPORTANT
} as const

// 项目进展状态枚举（根据projectType不同）
export const ProjectStatusEnum = {
  // 中药现代化专用状态
  CHINESE_MEDICINE: {
    HOSPITAL_PREPARATION: 'hospital-preparation',      // 院内制剂
    EXPERIENCE_FORMULA: 'experience-formula',          // 经验方
    PROTOCOL_FORMULA: 'protocol-formula',              // 协定方
    EARLY_RESEARCH: 'early-research'                   // 早期研究
  },
  // 医疗器械专用状态
  MEDICAL_DEVICE: {
    EARLY_STAGE: 'early-stage',                        // 早期
    SAMPLE_DESIGN: 'sample-design',                    // 样品设计
    TYPE_INSPECTION: 'type-inspection',                // 型检
    CLINICAL_STAGE: 'clinical-stage',                  // 临床阶段
    MARKET_PRODUCT: 'market-product'                   // 上市产品
  },
  // 其他项目通用状态
  OTHER: {
    EARLY_STAGE: 'early-stage',                        // 早期
    PRECLINICAL: 'preclinical',                        // 临床前
    CLINICAL_STAGE: 'clinical-stage',                  // 临床阶段
    MARKET_PRODUCT: 'market-product'                   // 上市产品
  }
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

// 转化需求类型枚举
export const TransformRequirementTypeEnum = {
  INVESTMENT: 'investment',                            // 投资
  COMPANY_OPERATION: 'company-operation',              // 公司化运营
  LICENSE_TRANSFER: 'license-transfer',                // 许可转让
  PENDING: 'pending'                                   // 待推进
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

/* ------------------------------------------------------------------------------------------ */

// 转化需求接口（简化版）
export interface ITransformRequirement {
  type: string                             // 转化需求（类型）
  currentProgress: string                  // 进展节点
}

// 统一项目接口定义
export interface IUnifiedProject {
  _id?: string                             // 项目ID
  
  // 通用必填字段
  department: string                       // 归属部门
  name: string                             // 项目名称
  projectType: string                      // 项目分类型
  source: string                           // 医院来源
  importance: string                       // 重要程度
  status: string                           // 项目进展状态（值根据projectType不同）
  leader: string                           // 负责人
  transformRequirements: ITransformRequirement[]  // 转化需求列表（必填）

  // 通用选填字段
  indication?: string                      // 适应症/科室
  dockingCompany?: string                  // 对接企业
  hospitalDoctor?: string                  // 院端医生
  patent?: string                          // 专利信息
  clinicalData?: string                    // 临床数据
  transformAmount?: number                 // 转化金额（万元）
  conclusion?: string                      // 项目结论
  
  // 中药现代化特有字段（原院内制剂）

  // 中药现代化必填字段
  composition?: string                     // 组方
  function?: string                        // 功能

  // 中药现代化选填字段
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

// 转化需求Schema（简化版）
const TransformRequirementSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(TransformRequirementTypeEnum),
    required: true
  },
  currentProgress: {
    type: String,
    required: true
  }
}, { _id: false })

// 统一项目Schema
const UnifiedProjectSchema = new Schema<UnifiedProjectDocument>({
  // 通用必填字段
  department: {
    type: String,
    enum: Object.values(DepartmentEnum),
    required: [true, '归属部门为必填项'],
    default: DepartmentEnum.DEPT_ONE,
    index: true
  },
  
  name: {
    type: String,
    required: [true, '项目名称为必填项'],
    trim: true,
    maxLength: [200, '项目名称长度不能超过200个字符'],
    index: true
  },
  
  projectType: {
    type: String,
    enum: Object.values(ProjectTypeEnum),
    required: [true, '项目分类型为必填项'],
    default: ProjectTypeEnum.OTHER,
    index: true
  },
  
  source: {
    type: String,
    required: [true, '医院来源为必填项'],
    trim: true,
    maxLength: [200, '医院来源长度不能超过200个字符'],
    index: true
  },
  
  importance: {
    type: String,
    enum: Object.values(ImportanceEnum),
    required: [true, '重要程度为必填项'],
    default: ImportanceEnum.VERY_IMPORTANT,
    index: true
  },
  
  status: {
    type: String,
    required: [true, '项目进展状态为必填项'],
    index: true,
    validate: {
      validator: function(this: UnifiedProjectDocument, value: string) {
        // 根据 projectType 验证 status 的有效性
        const projectType = this.projectType
        
        // 在 UPDATE 操作中，this.projectType 可能是 undefined
        // 此时跳过验证，因为后端 API 已经做了验证
        if (!projectType) {
          return true
        }
        
        if (projectType === ProjectTypeEnum.CHINESE_MEDICINE_MODERNIZATION) {
          return Object.values(ProjectStatusEnum.CHINESE_MEDICINE).includes(value as any)
        } else if (projectType === ProjectTypeEnum.MEDICAL_DEVICE) {
          return Object.values(ProjectStatusEnum.MEDICAL_DEVICE).includes(value as any)
        } else {
          return Object.values(ProjectStatusEnum.OTHER).includes(value as any)
        }
      },
      message: '项目进展状态与项目类型不匹配'
    }
  },
  
  leader: {
    type: String,
    enum: Object.values(LeaderEnum),
    required: [true, '负责人为必填项'],
    default: LeaderEnum.TO_BE_DETERMINED,
    index: true
  },
  
  transformRequirements: {
    type: [TransformRequirementSchema],
    required: [true, '转化需求列表为必填项'],
    default: []
  },
  
  // 通用选填字段
  indication: {
    type: String,
    required: false,
    maxLength: [200, '适应症/科室长度不能超过200个字符'],
    trim: true
  },
  
  dockingCompany: {
    type: String,
    required: false,
    maxLength: [200, '对接企业长度不能超过200个字符'],
    trim: true
  },
  
  hospitalDoctor: {
    type: String,
    required: false,
    trim: true
  },
  
  patent: {
    type: String,
    required: false,
    trim: true
  },
  
  clinicalData: {
    type: String,
    required: false
  },
  
  transformAmount: {
    type: Number,
    required: false,
    min: [0, '转化金额不能为负数']
  },
  
  conclusion: {
    type: String,
    required: false
  },
  
  // 中药现代化特有字段（原院内制剂）
  composition: {
    type: String,
    required: false,
    validate: {
      validator: function(this: UnifiedProjectDocument, value: string) {
        if (this.projectType === ProjectTypeEnum.CHINESE_MEDICINE_MODERNIZATION) {
          return value && value.length > 0
        }
        return true
      },
      message: '中药现代化项目的组方为必填项'
    }
  },
  
  function: {
    type: String,
    required: false,
    validate: {
      validator: function(this: UnifiedProjectDocument, value: string) {
        if (this.projectType === ProjectTypeEnum.CHINESE_MEDICINE_MODERNIZATION) {
          return value && value.length > 0
        }
        return true
      },
      message: '中药现代化项目的功能为必填项'
    }
  },
  
  // 中药现代化选填字段
  specification: {
    type: String,
    required: false
  },
  
  duration: {
    type: String,
    required: false
  },
  
  recordNumber: {
    type: String,
    required: false
  },
  
  // 其他类型特有字段
  startDate: {
    type: Date,
    required: false,
    validate: {
      validator: function(this: UnifiedProjectDocument, value: Date) {
        if (this.projectType !== ProjectTypeEnum.CHINESE_MEDICINE_MODERNIZATION && 
            this.projectType !== ProjectTypeEnum.MEDICAL_DEVICE) {
          return !!value
        }
        return true
      },
      message: '该项目类型的开始日期为必填项'
    }
  },

  // 系统字段
  attachments: {
    type: [String],
    default: []
  },
  
  createTime: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  updateTime: {
    type: Date,
    default: Date.now
  },
  
  createdBy: {
    type: String,
    required: true
  },
  
  // AI报告
  aiReport: {
    reportUrl: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ['idle', 'generating', 'completed', 'error'],
      default: 'idle'
    },
    firstGeneratedAt: {
      type: Date,
      required: false
    },
    lastGeneratedAt: {
      type: Date,
      required: false
    }
  }
}, {
  timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
  collection: 'unifiedprojects'
})

// 索引
UnifiedProjectSchema.index({ projectType: 1, status: 1 })
UnifiedProjectSchema.index({ department: 1, importance: 1 })
UnifiedProjectSchema.index({ source: 1 })
UnifiedProjectSchema.index({ leader: 1 })
UnifiedProjectSchema.index({ createTime: -1 })

// 实例方法
UnifiedProjectSchema.methods.isChineseMedicineModernization = function(): boolean {
  return this.projectType === ProjectTypeEnum.CHINESE_MEDICINE_MODERNIZATION
}

UnifiedProjectSchema.methods.getDisplayImportance = function(): string {
  const importanceMap: {[key: string]: string} = {
    'very-important': '非常重要',
    'important': '重要',
    'normal': '一般'
  }
  return importanceMap[this.importance] || this.importance
}

UnifiedProjectSchema.methods.getDisplayStatus = function(): string {
  const statusMap: {[key: string]: string} = {
    // 中药现代化状态
    'hospital-preparation': '院内制剂',
    'experience-formula': '经验方',
    'protocol-formula': '协定方',
    'early-research': '早期研究',
    // 医疗器械状态
    'sample-design': '样品设计',
    'type-inspection': '型检',
    // 通用状态
    'early-stage': '早期',
    'preclinical': '临床前',
    'clinical-stage': '临床阶段',
    'market-product': '上市产品'
  }
  return statusMap[this.status] || this.status
}

UnifiedProjectSchema.methods.canGenerateAIReport = function(): boolean {
  return this.projectType === ProjectTypeEnum.CHINESE_MEDICINE_MODERNIZATION
}

// 静态方法
UnifiedProjectSchema.statics.getProjectTypeDisplayName = function(projectType: string): string {
  const projectTypeMap: {[key: string]: string} = {
    'chinese-medicine-modernization': '中药现代化',
    'ai-medical-research': 'AI医疗及系统研究',
    'diagnostic-detection': '检测诊断',
    'cell-therapy': '细胞治疗',
    'drug': '药物',
    'medical-device': '医疗器械',
    'medical-material': '医用材料',
    'other': '其他'
  }
  return projectTypeMap[projectType] || projectType
}

/* ------------------------------------------------------------------------------------------ */

export default mongoose.models.UnifiedProject || mongoose.model<UnifiedProjectDocument>('UnifiedProject', UnifiedProjectSchema)
