import mongoose, { Schema, Document } from 'mongoose'
import { User as IUser } from '@/types'

export interface UserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, '用户名为必填项'],
    unique: true,
    trim: true,
    maxlength: [50, '用户名不能超过50个字符']
  },
  password: {
    type: String,
    required: [true, '密码为必填项'],
    minlength: [6, '密码不能少于6个字符']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
  },
  realName: {
    type: String,
    trim: true,
    maxlength: [50, '真实姓名不能超过50个字符']
  },
  department: {
    type: String,
    trim: true,
    maxlength: [100, '部门名称不能超过100个字符']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
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
  lastLogin: {
    type: Date
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

// 更新时间中间件
UserSchema.pre('save', function(next) {
  this.updateTime = new Date()
  next()
})

// 更新操作时自动设置updateTime
UserSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function() {
  this.set({ updateTime: new Date() })
})

// 创建索引
UserSchema.index({ username: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ status: 1 })
UserSchema.index({ createTime: -1 })

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema)
