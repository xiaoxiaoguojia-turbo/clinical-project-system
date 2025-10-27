import mongoose, { Schema, Document } from 'mongoose'
import { Attachment as IAttachment } from '@/types'

export interface AttachmentDocument extends Omit<IAttachment, '_id'>, Document {}

const AttachmentSchema: Schema = new Schema({
  filename: {
    type: String,
    required: [true, '文件名为必填项'],
    trim: true,
    maxlength: [255, '文件名不能超过255个字符']
  },
  originalName: {
    type: String,
    required: [true, '原始文件名为必填项'],
    trim: true,
    maxlength: [255, '原始文件名不能超过255个字符']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME类型为必填项'],
    trim: true
  },
  size: {
    type: Number,
    required: [true, '文件大小为必填项'],
    min: [0, '文件大小不能为负数']
  },
  storageType: {
    type: String,
    enum: ['gridfs', 'filesystem'],
    required: [true, '存储类型为必填项']
  },
  filePath: {
    type: String,
    trim: true,
    // 当storageType为filesystem时必填
    validate: {
      validator: function(this: AttachmentDocument, value: string) {
        if (this.storageType === 'filesystem') {
          return !!value
        }
        return true
      },
      message: '文件系统存储时文件路径为必填项'
    }
  },
  gridfsId: {
    type: Schema.Types.ObjectId,
    // 当storageType为gridfs时必填
    validate: {
      validator: function(this: AttachmentDocument, value: any) {
        if (this.storageType === 'gridfs') {
          return !!value
        }
        return true
      },
      message: 'GridFS存储时GridFS ID为必填项'
    }
  },
  projectId: {
    type: Schema.Types.ObjectId,
    required: [true, '关联项目ID为必填项']
  },
  projectType: {
    type: String,
    enum: [
      'overall', 
      'internal-preparation',
      'ai-medical-research',
      'diagnostic-detection',
      'cell-therapy',
      'drug',
      'medical-device',
      'medical-material',
      'other'
    ],
    required: [true, '项目类型为必填项']
  },
  uploadTime: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '上传者为必填项']
  }
})

// 创建索引
AttachmentSchema.index({ projectId: 1 })
AttachmentSchema.index({ projectType: 1 })
AttachmentSchema.index({ uploadedBy: 1 })
AttachmentSchema.index({ uploadTime: -1 })
AttachmentSchema.index({ mimeType: 1 })
AttachmentSchema.index({ filename: 1 })

// 文件大小格式化方法
AttachmentSchema.methods.getFormattedSize = function() {
  const bytes = this.size
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 文件类型判断方法
AttachmentSchema.methods.getFileType = function() {
  const mimeType = this.mimeType.toLowerCase()
  
  if (mimeType.includes('image')) return 'image'
  if (mimeType.includes('pdf')) return 'pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'document'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel'
  if (mimeType.includes('text')) return 'text'
  if (mimeType.includes('zip') || mimeType.includes('rar')) return 'archive'
  
  return 'unknown'
}

export default mongoose.models.Attachment || mongoose.model<AttachmentDocument>('Attachment', AttachmentSchema)
