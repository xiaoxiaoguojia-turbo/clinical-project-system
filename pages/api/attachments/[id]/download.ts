import { NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import Attachment from '@/models/Attachment'
import OverallProject from '@/models/OverallProject'
import InternalPreparationProject from '@/models/InternalPreparationProject'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'

const streamPipeline = promisify(pipeline)

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: '不支持的请求方法'
    })
  }

  try {
    // 连接数据库
    await connectDB()

    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: '无效的附件ID'
      })
    }

    // 查找附件
    const attachment = await Attachment.findById(id)
    if (!attachment) {
      return res.status(404).json({
        success: false,
        error: '附件不存在'
      })
    }

    // 检查用户是否有权限下载此附件
    let hasPermission = false

    if (req.user.role === 'admin') {
      // 管理员有所有权限
      hasPermission = true
    } else {
      // 检查用户是否是项目的创建者或有访问权限
      if (attachment.projectType === 'overall') {
        const project = await OverallProject.findById(attachment.projectId)
        if (project && project.createdBy.toString() === req.user.userId) {
          hasPermission = true
        }
      } else if (attachment.projectType === 'internal-preparation') {
        const project = await InternalPreparationProject.findById(attachment.projectId)
        if (project && project.createdBy.toString() === req.user.userId) {
          hasPermission = true
        }
      }
    }

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: '权限不足，无法下载此附件'
      })
    }

    // 根据存储类型处理下载
    if (attachment.storageType === 'filesystem') {
      // 文件系统存储
      if (!attachment.filePath || !fs.existsSync(attachment.filePath)) {
        return res.status(404).json({
          success: false,
          error: '文件不存在'
        })
      }

      // 设置响应头
      res.setHeader('Content-Type', attachment.mimeType || 'application/octet-stream')
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(attachment.originalName)}"`)
      res.setHeader('Content-Length', attachment.size.toString())
      res.setHeader('Cache-Control', 'private, no-cache')

      // 创建读取流并管道到响应
      const fileStream = fs.createReadStream(attachment.filePath)
      
      fileStream.on('error', (error) => {
        console.error('文件流错误:', error)
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: '文件读取错误'
          })
        }
      })

      await streamPipeline(fileStream, res)

    } else if (attachment.storageType === 'gridfs') {
      // GridFS存储 (暂未实现，为未来扩展预留)
      return res.status(501).json({
        success: false,
        error: 'GridFS下载功能暂未实现'
      })
    } else {
      return res.status(500).json({
        success: false,
        error: '不支持的存储类型'
      })
    }

  } catch (error) {
    console.error('文件下载API错误:', error)

    // 类型安全的错误处理
    if (error instanceof Error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: '无效的附件ID格式'
        })
      }
    }

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: '服务器内部错误'
      })
    }
  }
}

export default authMiddleware(handler)
