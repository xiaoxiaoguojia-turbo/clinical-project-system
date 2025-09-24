import mongoose, { Schema, Document } from 'mongoose'
import { Type2Project as IType2Project } from '@/types'

export interface Type2ProjectDocument extends Omit<IType2Project, '_id'>, Document {}

const Type2ProjectSchema: Schema = new Schema({
  department: {
    type: String,
    required: [true, '部门为必填项'],
    default: '转移转化与投资部门',
    maxlength: [100, '部门名称不能超过100个字符']
  },
  source: {
    type: String,
    required: [true, '来源为必填项'],
    trim: true,
    maxlength: [100, '来源不能超过100个字符']
  },
  name: {
    type: String,
    required: [true, '项目名称为必填项'],
    trim: true,
    maxlength: [200, '项目名称不能超过200个字符']
  },
  category: {
    type: String,
    required: [true, '分类为必填项'],
    trim: true,
    maxlength: [100, '分类不能超过100个字符']
  },
  leader: {
    type: String,
    required: [true, '负责人为必填项'],
    trim: true,
    maxlength: [50, '负责人姓名不能超过50个字符']
  },
  startDate: {
    type: Date,
    required: [true, '开始日期为必填项']
  },
  indication: {
    type: String,
    required: [true, '适应症/科室为必填项'],
    trim: true,
    maxlength: [200, '适应症/科室不能超过200个字符']
  },
  followUpWeeks: {
    type: Number,
    required: [true, '跟进时间为必填项'],
    min: [1, '跟进时间至少为1周'],
    max: [104, '跟进时间不能超过104周（2年）']
  },
  importance: {
    type: String,
    enum: {
      values: ['very-important', 'important', 'normal'],
      message: '重要程度必须是：非常重要、重要、一般 之一'
    },
    required: [true, '重要程度为必填项'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: {
      values: ['initial-assessment', 'project-approval', 'implementation'],
      message: '状态必须是：初始评估、立项上会、落地转化 之一'
    },
    default: 'initial-assessment',
    required: true
  },
  transformMethod: {
    type: String,
    required: [true, '转化方式/需求为必填项'],
    trim: true,
    maxlength: [300, '转化方式/需求不能超过300个字符']
  },
  hospitalPI: {
    type: String,
    required: [true, '院端PI为必填项'],
    trim: true,
    maxlength: [50, '院端PI姓名不能超过50个字符']
  },
  projectConclusion: {
    type: String,
    trim: true,
    maxlength: [1000, '项目结论不能超过1000个字符']
  },
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: 'Attachment'
  }],
  createTime: {
    type: Date,
    default: Date.now
  },
  updateTime: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '创建者为必填项']
  },
  // AI报告相关信息（暂时禁用功能）
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

// 更新时间中间件
Type2ProjectSchema.pre('save', function(next) {
  this.updateTime = new Date()
  next()
})

// 索引设置
Type2ProjectSchema.index({ department: 1 })
Type2ProjectSchema.index({ source: 1 })
Type2ProjectSchema.index({ status: 1 })
Type2ProjectSchema.index({ importance: 1 })
Type2ProjectSchema.index({ leader: 1 })
Type2ProjectSchema.index({ category: 1 })
Type2ProjectSchema.index({ startDate: -1 })
Type2ProjectSchema.index({ createTime: -1 })
Type2ProjectSchema.index({ createdBy: 1 })

// 复合索引
Type2ProjectSchema.index({ department: 1, status: 1 })
Type2ProjectSchema.index({ leader: 1, status: 1 })
Type2ProjectSchema.index({ importance: 1, status: 1 })

/* ------------------------------------------------------------------------------------------ */

// 虚拟字段
Type2ProjectSchema.virtual('isHighPriority').get(function() {
  return this.importance === 'very-important'
})

Type2ProjectSchema.virtual('daysSinceStart').get(function() {
  if (!this.startDate) return 0
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - this.startDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// 实例方法
Type2ProjectSchema.methods.canAdvanceStatus = function() {
  const statusFlow = ['initial-assessment', 'project-approval', 'implementation']
  const currentIndex = statusFlow.indexOf(this.status)
  return currentIndex < statusFlow.length - 1
}

Type2ProjectSchema.methods.getNextStatus = function() {
  const statusFlow = ['initial-assessment', 'project-approval', 'implementation']
  const currentIndex = statusFlow.indexOf(this.status)
  return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null
}

/* ------------------------------------------------------------------------------------------ */

export default mongoose.models.Type2Project || mongoose.model<Type2ProjectDocument>('Type2Project', Type2ProjectSchema)
