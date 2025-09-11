import mongoose, { Schema, Document } from 'mongoose'
import { OverallProject as IOverallProject } from '@/types'

export interface OverallProjectDocument extends Omit<IOverallProject, '_id'>, Document {}

const OverallProjectSchema: Schema = new Schema({
  department: {
    type: String,
    required: [true, '部门为必填项'],
    default: '转移转化与投资部门',
    maxlength: [100, '部门名称不能超过100个字符']
  },
  type: {
    type: String,
    required: [true, '项目类型为必填项'],
    trim: true,
    maxlength: [50, '项目类型不能超过50个字符']
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
    min: [0, '跟进时间不能为负数']
  },
  importance: {
    type: String,
    required: [true, '重要程度为必填项'],
    enum: ['高', '中', '低'],
    default: '中'
  },
  stageOne: {
    type: String,
    trim: true,
    maxlength: [500, '阶段一描述不能超过500个字符']
  },
  stageTwo: {
    type: String,
    trim: true,
    maxlength: [500, '阶段二描述不能超过500个字符']
  },
  stageThree: {
    type: String,
    trim: true,
    maxlength: [500, '阶段三描述不能超过500个字符']
  },
  transformMethod: {
    type: String,
    trim: true,
    maxlength: [200, '转化方式/需求不能超过200个字符']
  },
  hospitalPI: {
    type: String,
    trim: true,
    maxlength: [50, '院端PI不能超过50个字符']
  },
  projectOverview: {
    type: String,
    trim: true,
    maxlength: [1000, '项目概况不能超过1000个字符']
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
  }
})

// 更新时间中间件
OverallProjectSchema.pre('save', function(next) {
  this.updateTime = new Date()
  next()
})

// 更新操作时自动设置updateTime
OverallProjectSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function() {
  this.set({ updateTime: new Date() })
})

// 创建索引
OverallProjectSchema.index({ name: 1 })
OverallProjectSchema.index({ leader: 1 })
OverallProjectSchema.index({ department: 1 })
OverallProjectSchema.index({ status: 1 })
OverallProjectSchema.index({ importance: 1 })
OverallProjectSchema.index({ createTime: -1 })
OverallProjectSchema.index({ startDate: -1 })

export default mongoose.models.OverallProject || mongoose.model<OverallProjectDocument>('OverallProject', OverallProjectSchema)
