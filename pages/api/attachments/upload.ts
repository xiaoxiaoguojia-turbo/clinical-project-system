/**
 * @swagger
 * /api/attachments/upload:
 *   post:
 *     tags:
 *       - 附件管理
 *     summary: 上传附件文件
 *     description: |
 *       上传附件文件到服务器，支持多种文件类型。
 *       
 *       **支持的文件类型：**
 *       - 文档：pdf, doc, docx, xls, xlsx, ppt, pptx, txt, md
 *       - 图片：jpg, jpeg, png, gif, bmp, webp
 *       - 压缩包：zip, rar, 7z
 *       
 *       **文件大小限制：** 10MB
 *       
 *       **使用步骤：**
 *       1. 选择要上传的文件
 *       2. 设置关联的项目ID和项目类型
 *       3. 调用此接口上传
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - projectId
 *               - projectType
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 要上传的文件
 *               projectId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: 关联项目ID（MongoDB ObjectId）
 *                 example: "64f123456789abcd12345678"
 *               projectType:
 *                 type: string
 *                 enum: [overall, internal-preparation, ai-medical-research, diagnostic-detection, cell-therapy, drug, medical-device, medical-material, other]
 *                 description: 项目类型
 *                 example: "overall"
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 description: 文件描述（可选）
 *                 example: "项目申报书最终版本"
 *           encoding:
 *             file:
 *               contentType: 'application/*'
 *     responses:
 *       201:
 *         description: 文件上传成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Attachment'
 *             examples:
 *               success:
 *                 summary: 上传成功响应
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "64f123456789abcd12345679"
 *                     filename: "项目申报书.pdf"
 *                     originalname: "项目申报书_最终版.pdf"
 *                     mimetype: "application/pdf"
 *                     size: 2048576
 *                     path: "uploads/2024/01/64f123456789abcd12345679_项目申报书.pdf"
 *                     projectId: "64f123456789abcd12345678"
 *                     projectType: "overall"
 *                     uploadedBy: "64f123456789abcd12345677"
 *                     description: "项目申报书最终版本"
 *                     downloadCount: 0
 *                     createTime: "2024-01-15T10:30:00.000Z"
 *                     updateTime: "2024-01-15T10:30:00.000Z"
 *                   message: "文件上传成功"
 *       400:
 *         description: 请求错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               no_file:
 *                 summary: 未选择文件
 *                 value:
 *                   success: false
 *                   error: "请选择要上传的文件"
 *               invalid_type:
 *                 summary: 文件类型不支持
 *                 value:
 *                   success: false
 *                   error: "不支持的文件类型，请上传支持的文件格式：PDF、DOC、DOCX、XLS、XLSX、PPT、PPTX、TXT、MD、JPG、PNG、GIF、BMP、WebP、ZIP、RAR、7Z"
 *               file_too_large:
 *                 summary: 文件过大
 *                 value:
 *                   success: false
 *                   error: "文件大小超过限制（最大10MB）"
 *               missing_params:
 *                 summary: 缺少必需参数
 *                 value:
 *                   success: false
 *                   error: "缺少必需参数：projectId 和 projectType"
 *               invalid_project:
 *                 summary: 项目不存在
 *                 value:
 *                   success: false
 *                   error: "关联的项目不存在"
 *       401:
 *         description: 未授权访问
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       413:
 *         description: 文件过大
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               payload_too_large:
 *                 summary: 请求体过大
 *                 value:
 *                   success: false
 *                   error: "文件大小超过限制"
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import Attachment from '@/models/Attachment'
import OverallProject from '@/models/OverallProject'
import InternalPreparationProject from '@/models/InternalPreparationProject'
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
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 默认10MB (1024*1024)
  },
  fileFilter: (req, file, cb) => {
    // 允许的文件类型
    const allowedTypes = [
      // 文档类型
      'application/pdf',                                                    // PDF文档
      'application/msword',                                                 // DOC文档 (Word 97-2003)
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX文档 (Word 2007+)
      'application/vnd.ms-excel',                                          // XLS表格 (Excel 97-2003)
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX表格 (Excel 2007+)
      'application/vnd.ms-powerpoint',                                     // PPT演示 (PowerPoint 97-2003)
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX演示 (PowerPoint 2007+)
      'text/plain',                                                        // TXT纯文本
      'text/markdown',                                                     // MD Markdown文档
      
      // 图片类型
      'image/jpeg',                                                        // JPG/JPEG图片
      'image/png',                                                         // PNG图片
      'image/gif',                                                         // GIF图片
      'image/bmp',                                                         // BMP位图
      'image/webp',                                                        // WebP图片
      
      // 压缩包类型
      'application/zip',                                                   // ZIP压缩包
      'application/x-rar-compressed',                                      // RAR压缩包
      'application/vnd.rar',                                              // RAR压缩包 (备用MIME类型)
      'application/x-7z-compressed'                                       // 7Z压缩包
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('不支持的文件类型'))
    }
  }
})

const uploadSingle = promisify(upload.single('file'))

// 修复文件名编码问题的辅助函数
function fixFileNameEncoding(filename: string): string {
  try {
    console.log('开始修复文件名编码:', filename)
    
    // 检测是否包含疑似乱码字符（常见的UTF-8被当作Latin1解析的模式）
    const hasGarbledChars = /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/i.test(filename)
    
    if (hasGarbledChars) {
      console.log('检测到疑似乱码字符，尝试修复...')
      
      // 方法1: 直接从Latin1转UTF-8
      try {
        const buffer = Buffer.from(filename, 'latin1')
        const utf8String = buffer.toString('utf8')
        console.log('方法1修复结果:', utf8String)
        
        // 检查修复后是否包含合理的中文字符
        if (/[\u4e00-\u9fff]/.test(utf8String)) {
          console.log('方法1成功，检测到中文字符')
          return utf8String
        }
      } catch (e) {
        console.log('方法1失败:', e)
      }
      
      // 方法2: 尝试URL解码
      try {
        const decoded = decodeURIComponent(escape(filename))
        console.log('方法2修复结果:', decoded)
        
        if (/[\u4e00-\u9fff]/.test(decoded) && decoded !== filename) {
          console.log('方法2成功')
          return decoded
        }
      } catch (e) {
        console.log('方法2失败:', e)
      }
      
      // 方法3: 手动字节转换
      try {
        // 将字符串转为字节数组，然后重新解释为UTF-8
        const bytes = []
        for (let i = 0; i < filename.length; i++) {
          bytes.push(filename.charCodeAt(i) & 0xFF)
        }
        const buffer = Buffer.from(bytes)
        const utf8String = buffer.toString('utf8')
        console.log('方法3修复结果:', utf8String)
        
        if (/[\u4e00-\u9fff]/.test(utf8String)) {
          console.log('方法3成功')
          return utf8String
        }
      } catch (e) {
        console.log('方法3失败:', e)
      }
    }
    
    console.log('无需修复或修复失败，返回原始文件名')
    return filename
    
  } catch (error) {
    console.error('文件名编码修复出错:', error)
    return filename
  }
}

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

    // 确保所有相关模型都被注册（解决MissingSchemaError）
    const ensureModels = [Attachment, OverallProject, InternalPreparationProject]
    ensureModels.forEach(model => model.modelName)

    // 处理文件上传
    await uploadSingle(req as any, res as any)

    const file = (req as any).file
    if (!file) {
      return res.status(400).json({
        success: false,
        error: '没有上传文件'
      })
    }

    // 修复文件名编码问题
    const originalName = fixFileNameEncoding(file.originalname)
    console.log('原始文件名:', file.originalname, '修复后:', originalName)

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

    // 验证项目类型 - 支持所有统一项目类型
    const validProjectTypes = [
      'overall', 
      'internal-preparation', 
      'ai-medical-research', 
      'diagnostic-detection', 
      'cell-therapy', 
      'drug', 
      'medical-device', 
      'medical-material', 
      'other'
    ]
    
    if (!validProjectTypes.includes(projectType)) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }
      return res.status(400).json({
        success: false,
        error: `无效的项目类型。支持的类型：${validProjectTypes.join(', ')}`
      })
    }

    // 创建附件记录
    const attachment = new Attachment({
      filename: originalName,
      originalName: originalName,
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

    // 类型安全的错误处理
    if (error instanceof Error) {
      // 处理自定义业务错误
      if (error.message === '不支持的文件类型') {
        return res.status(400).json({
          success: false,
          error: '不支持的文件类型，请上传支持的文件格式：PDF、DOC、DOCX、XLS、XLSX、PPT、PPTX、TXT、MD、JPG、PNG、GIF、BMP、WebP、ZIP、RAR、7Z'
        })
      }

      // 处理 Multer 文件上传错误
      if ('code' in error) {
        switch (error.code) {
          case 'LIMIT_FILE_SIZE':
            return res.status(400).json({
              success: false,
              error: '文件大小超出限制（最大10MB）'
            })
          case 'LIMIT_FILE_COUNT':
            return res.status(400).json({
              success: false,
              error: '文件数量超出限制'
            })
          case 'LIMIT_UNEXPECTED_FILE':
            return res.status(400).json({
              success: false,
              error: '意外的文件字段'
            })
        }
      }

      // 处理 mongoose 验证错误
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: error.message
        })
      }
    }

    // 处理其他未知错误（兜底错误处理）
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
    sizeLimit: '10mb', // 设置请求体大小限制为10MB
  },
}

export default authMiddleware(handler)
