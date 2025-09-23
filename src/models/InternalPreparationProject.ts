import mongoose, { Schema, Document } from 'mongoose'
import { InternalPreparationProject as IInternalPreparationProject } from '@/types'

export interface InternalPreparationProjectDocument extends Omit<IInternalPreparationProject, '_id'>, Document {}

const InternalPreparationProjectSchema: Schema = new Schema({
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
    required: [true, '名称为必填项'],
    trim: true,
    maxlength: [200, '名称不能超过200个字符']
  },
  composition: {
    type: String,
    required: [true, '组方为必填项'],
    trim: true,
    maxlength: [500, '组方不能超过500个字符']
  },
  function: {
    type: String,
    required: [true, '功能为必填项'],
    trim: true,
    maxlength: [300, '功能描述不能超过300个字符']
  },
  specification: {
    type: String,
    required: [true, '规格为必填项'],
    trim: true,
    maxlength: [100, '规格不能超过100个字符']
  },
  duration: {
    type: String,
    required: [true, '年限为必填项'],
    trim: true,
    maxlength: [50, '年限不能超过50个字符']
  },
  dosage: {
    type: String,
    required: [true, '用量为必填项'],
    trim: true,
    maxlength: [100, '用量不能超过100个字符']
  },
  recordNumber: {
    type: String,
    required: [true, '备案号为必填项'],
    trim: true,
    unique: true,
    maxlength: [100, '备案号不能超过100个字符']
  },
  patent: {
    type: String,
    trim: true,
    maxlength: [200, '专利情况不能超过200个字符']
  },
  remarks: {
    type: String,
    trim: true,
    maxlength: [500, '备注不能超过500个字符']
  },
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: 'Attachment'
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
    required: true
  },
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

// 更新时间中间件
InternalPreparationProjectSchema.pre('save', function(next) {
  this.updateTime = new Date()
  next()
})

// 更新操作时自动设置updateTime
InternalPreparationProjectSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function() {
  this.set({ updateTime: new Date() })
})

// 创建索引
InternalPreparationProjectSchema.index({ name: 1 })
InternalPreparationProjectSchema.index({ recordNumber: 1 })
InternalPreparationProjectSchema.index({ department: 1 })
InternalPreparationProjectSchema.index({ status: 1 })
InternalPreparationProjectSchema.index({ createTime: -1 })
InternalPreparationProjectSchema.index({ source: 1 })

export default mongoose.models.InternalPreparationProject || mongoose.model<InternalPreparationProjectDocument>('InternalPreparationProject', InternalPreparationProjectSchema)
