import { NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import Attachment from '@/models/Attachment'
import OverallProject from '@/models/OverallProject'
import InternalPreparationProject from '@/models/InternalPreparationProject'
import { ApiResponse, PaginatedResponse, Attachment as IAttachment } from '@/types'
import fs from 'fs'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<IAttachment> | string>>
) {
  try {
    // 连接数据库
    await connectDB()

    if (req.method === 'GET') {
      // 获取附件列表
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 10
      const projectType = req.query.projectType as string
      const projectId = req.query.projectId as string
      const search = req.query.search as string

      // 构建查询条件
      const query: any = {}
      
      if (projectType) {
        query.projectType = projectType
      }
      
      if (projectId) {
        query.projectId = projectId
      }
      
      if (search) {
        query.$or = [
          { filename: { $regex: search, $options: 'i' } },
          { originalName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }

      // 权限检查：非管理员用户只能看到自己相关的附件
      if (req.user.role !== 'admin') {
        // 获取用户有权访问的项目ID列表
        const userProjectIds: string[] = []
        
        // 获取用户创建的总体项目
        const overallProjects = await OverallProject.find({ createdBy: req.user.userId }).select('_id')
        userProjectIds.push(...overallProjects.map(p => p._id.toString()))
        
        // 获取用户创建的院内制剂项目
        const internalProjects = await InternalPreparationProject.find({ createdBy: req.user.userId }).select('_id')
        userProjectIds.push(...internalProjects.map(p => p._id.toString()))
        
        // 限制查询范围
        query.projectId = { $in: userProjectIds }
      }

      // 计算分页
      const skip = (page - 1) * pageSize
      const total = await Attachment.countDocuments(query)
      const totalPages = Math.ceil(total / pageSize)

      // 查询附件列表
      const attachments = await Attachment.find(query)
        .sort({ uploadTime: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('uploadedBy', 'username realName')

      const formattedAttachments = attachments.map(attachment => ({
        _id: attachment._id.toString(),
        filename: attachment.filename,
        originalName: attachment.originalName,
        mimeType: attachment.mimeType,
        size: attachment.size,
        storageType: attachment.storageType,
        filePath: attachment.filePath,
        gridFSFileId: attachment.gridFSFileId?.toString(),
        projectType: attachment.projectType,
        projectId: attachment.projectId.toString(),
        description: attachment.description,
        uploadTime: attachment.uploadTime,
        uploadedBy: attachment.uploadedBy?.toString()
      }))

      res.status(200).json({
        success: true,
        data: {
          data: formattedAttachments as any[],
          pagination: {
            current: page,
            pageSize,
            total,
            totalPages
          }
        },
        message: '获取附件列表成功'
      })

    } else if (req.method === 'DELETE') {
      // 批量删除附件
      const { ids } = req.body

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          error: '请提供要删除的附件ID列表'
        })
      }

      // 查找要删除的附件
      const attachments = await Attachment.find({ _id: { $in: ids } })
      
      if (attachments.length === 0) {
        return res.status(404).json({
          success: false,
          error: '没有找到要删除的附件'
        })
      }

      // 权限检查：非管理员只能删除自己上传的附件
      if (req.user.role !== 'admin') {
        const unauthorizedAttachments = attachments.filter(
          att => att.uploadedBy.toString() !== req.user.userId
        )
        
        if (unauthorizedAttachments.length > 0) {
          return res.status(403).json({
            success: false,
            error: '权限不足，只能删除自己上传的附件'
          })
        }
      }

      // 删除文件系统中的文件
      const deletePromises = attachments.map(async (attachment) => {
        try {
          if (attachment.storageType === 'filesystem' && attachment.filePath) {
            if (fs.existsSync(attachment.filePath)) {
              fs.unlinkSync(attachment.filePath)
            }
          }
          // TODO: 处理GridFS文件删除
          
          return await Attachment.findByIdAndDelete(attachment._id)
        } catch (error) {
          console.error(`删除附件 ${attachment._id} 失败:`, error)
          throw error
        }
      })

      await Promise.all(deletePromises)

      res.status(200).json({
        success: true,
        data: `成功删除 ${attachments.length} 个附件`,
        message: '删除附件成功'
      })

    } else {
      res.status(405).json({
        success: false,
        error: '不支持的请求方法'
      })
    }

  } catch (error) {
    console.error('附件管理API错误:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: '无效的ID格式'
      })
    }

    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
}

export default authMiddleware(handler)
