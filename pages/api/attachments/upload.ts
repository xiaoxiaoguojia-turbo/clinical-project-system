import { NextApiRequest, NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import Attachment from '@/models/Attachment'
import { ApiResponse, Attachment as IAttachment } from '@/types'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = process.env.UPLOAD_DIR || './uploads'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 默认10MB
  },
  fileFilter: (req, file, cb) => {
    // 允许的文件类型
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'image/jpeg',
      'image/png',
      'image/gif'
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('不支持的文件类型'))
    }
  }
})

const uploadSingle = promisify(upload.single('file'))

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<IAttachment>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: '不支持的请求方法'
    })
  }

  try {
    // 连接数据库
    await connectDB()

    // 处理文件上传
    await uploadSingle(req as any, res as any)

    const file = (req as any).file
    if (!file) {
      return res.status(400).json({
        success: false,
        error: '没有上传文件'
      })
    }

    const { projectType, projectId, description } = req.body

    // 验证必填字段
    if (!projectType || !projectId) {
      // 如果验证失败，删除已上传的文件
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }
      return res.status(400).json({
        success: false,
        error: '请提供项目类型和项目ID'
      })
    }

    // 验证项目类型
    if (!['overall', 'internal-preparation'].includes(projectType)) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }
      return res.status(400).json({
        success: false,
        error: '无效的项目类型'
      })
    }

    // 创建附件记录
    const attachment = new Attachment({
      filename: file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      storageType: 'filesystem', // 使用文件系统存储
      filePath: file.path,
      projectType,
      projectId,
      description: description || '',
      uploadedBy: req.user.userId
    })

    const savedAttachment = await attachment.save()

    res.status(201).json({
      success: true,
      data: {
        _id: savedAttachment._id.toString(),
        filename: savedAttachment.filename,
        originalName: savedAttachment.originalName,
        mimeType: savedAttachment.mimeType,
        size: savedAttachment.size,
        storageType: savedAttachment.storageType,
        filePath: savedAttachment.filePath,
        gridFSFileId: savedAttachment.gridFSFileId,
        projectType: savedAttachment.projectType,
        projectId: savedAttachment.projectId.toString(),
        description: savedAttachment.description,
        uploadTime: savedAttachment.uploadTime,
        uploadedBy: savedAttachment.uploadedBy.toString()
      } as any,
      message: '文件上传成功'
    })

  } catch (error) {
    console.error('文件上传API错误:', error)

    // 如果有文件被上传但出错，删除文件
    const file = (req as any).file
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }

    if (error.message === '不支持的文件类型') {
      return res.status(400).json({
        success: false,
        error: '不支持的文件类型，请上传PDF、DOC、DOCX、TXT、MD或图片文件'
      })
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: '文件大小超出限制'
      })
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
      })
    }

    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
}

// 禁用 Next.js 默认的 body parser，让 multer 处理
export const config = {
  api: {
    bodyParser: false,
  },
}

export default authMiddleware(handler)
