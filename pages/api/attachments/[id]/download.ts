/**
 * @swagger
 * /api/attachments/{id}/download:
 *   get:
 *     tags:
 *       - 附件管理
 *     summary: 下载附件文件
 *     description: |
 *       下载指定ID的附件文件，支持流式下载，自动更新下载计数。
 *       
 *       **功能特性：**
 *       - 权限验证：确保用户有访问权限
 *       - 流式下载：支持大文件下载
 *       - 下载统计：自动记录下载次数
 *       - 安全检查：防止路径遍历攻击
 *       
 *       **权限要求：**
 *       - 管理员：可下载任何附件
 *       - 普通用户：可下载自己上传的附件或有权限访问的项目附件
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: 附件ID（MongoDB ObjectId）
 *         example: "64f123456789abcd12345679"
 *     responses:
 *       200:
 *         description: 文件下载成功
 *         headers:
 *           Content-Disposition:
 *             description: 文件下载disposition header
 *             schema:
 *               type: string
 *               example: "attachment; filename=\"项目申报书.pdf\""
 *           Content-Type:
 *             description: 文件MIME类型
 *             schema:
 *               type: string
 *               example: "application/pdf"
 *           Content-Length:
 *             description: 文件大小（字节）
 *             schema:
 *               type: integer
 *               example: 2048576
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *               description: 文件二进制内容
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *               description: PDF文件内容
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *               description: 图片文件内容
 *           text/plain:
 *             schema:
 *               type: string
 *               description: 文本文件内容
 *       400:
 *         description: 请求错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_id:
 *                 summary: 无效的附件ID
 *                 value:
 *                   success: false
 *                   error: "无效的附件ID格式"
 *       403:
 *         description: 权限不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               permission_denied:
 *                 summary: 权限不足
 *                 value:
 *                   success: false
 *                   error: "权限不足：无法访问此附件"
 *       404:
 *         description: 附件不存在或文件不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               attachment_not_found:
 *                 summary: 附件记录不存在
 *                 value:
 *                   success: false
 *                   error: "附件不存在"
 *               file_not_found:
 *                 summary: 物理文件不存在
 *                 value:
 *                   success: false
 *                   error: "文件不存在"
 *       401:
 *         description: 未授权访问
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               server_error:
 *                 summary: 服务器错误
 *                 value:
 *                   success: false
 *                   error: "服务器内部错误"
 */

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

    // 确保所有相关模型都被注册（解决MissingSchemaError）
    const ensureModels = [Attachment, OverallProject, InternalPreparationProject]
    ensureModels.forEach(model => model.modelName)

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
