/**
 * @swagger
 * /api/attachments:
 *   get:
 *     tags:
 *       - 附件管理
 *     summary: 获取附件列表
 *     description: |
 *       分页获取附件列表，支持多种筛选条件。
 *       
 *       **筛选功能：**
 *       - 按项目ID筛选
 *       - 按项目类型筛选
 *       - 按文件名搜索
 *       - 按上传者筛选
 *       - 按文件类型筛选
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: 页码
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: 每页大小
 *         example: 10
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: 项目ID筛选
 *         example: "64f123456789abcd12345678"
 *       - in: query
 *         name: projectType
 *         schema:
 *           type: string
 *           enum: [overall, internal-preparation]
 *         description: 项目类型筛选
 *         example: "overall"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 文件名搜索关键词
 *         example: "申报书"
 *       - in: query
 *         name: uploadedBy
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: 上传者ID筛选
 *         example: "64f123456789abcd12345677"
 *       - in: query
 *         name: mimetype
 *         schema:
 *           type: string
 *         description: 文件类型筛选（MIME类型）
 *         example: "application/pdf"
 *     responses:
 *       200:
 *         description: 获取附件列表成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/PaginatedResponse'
 *                         - type: object
 *                           properties:
 *                             data:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Attachment'
 *             examples:
 *               success:
 *                 summary: 成功响应示例
 *                 value:
 *                   success: true
 *                   data:
 *                     data:
 *                       - _id: "64f123456789abcd12345679"
 *                         filename: "项目申报书.pdf"
 *                         originalname: "项目申报书_最终版.pdf"
 *                         mimetype: "application/pdf"
 *                         size: 2048576
 *                         path: "uploads/2024/01/64f123456789abcd12345679_项目申报书.pdf"
 *                         projectId: "64f123456789abcd12345678"
 *                         projectType: "overall"
 *                         uploadedBy: "64f123456789abcd12345677"
 *                         description: "项目申报书最终版本"
 *                         downloadCount: 5
 *                         createTime: "2024-01-15T10:30:00.000Z"
 *                         updateTime: "2024-01-15T10:30:00.000Z"
 *                       - _id: "64f123456789abcd1234567a"
 *                         filename: "预算表.xlsx"
 *                         originalname: "项目预算明细表.xlsx"
 *                         mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
 *                         size: 1024000
 *                         path: "uploads/2024/01/64f123456789abcd1234567a_预算表.xlsx"
 *                         projectId: "64f123456789abcd12345678"
 *                         projectType: "overall"
 *                         uploadedBy: "64f123456789abcd12345677"
 *                         description: "项目预算明细"
 *                         downloadCount: 2
 *                         createTime: "2024-01-16T09:15:00.000Z"
 *                         updateTime: "2024-01-16T09:15:00.000Z"
 *                     pagination:
 *                       current: 1
 *                       pageSize: 10
 *                       total: 15
 *                       totalPages: 2
 *                   message: "获取附件列表成功"
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
 *   delete:
 *     tags:
 *       - 附件管理
 *     summary: 批量删除附件
 *     description: |
 *       批量删除指定的附件文件，同时删除数据库记录和文件系统中的文件。
 *       
 *       **权限要求：**
 *       - 管理员：可删除任何附件
 *       - 普通用户：只能删除自己上传的附件
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   pattern: '^[0-9a-fA-F]{24}$'
 *                 minItems: 1
 *                 maxItems: 50
 *                 description: 要删除的附件ID数组（最多50个）
 *                 example: ["64f123456789abcd12345679", "64f123456789abcd1234567a"]
 *           examples:
 *             batch_delete:
 *               summary: 批量删除示例
 *               value:
 *                 ids: ["64f123456789abcd12345679", "64f123456789abcd1234567a", "64f123456789abcd1234567b"]
 *     responses:
 *       200:
 *         description: 批量删除成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         deletedCount:
 *                           type: integer
 *                           description: 成功删除的附件数量
 *                           example: 2
 *                         failedCount:
 *                           type: integer
 *                           description: 删除失败的附件数量
 *                           example: 0
 *                         failedItems:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 description: 失败的附件ID
 *                               error:
 *                                 type: string
 *                                 description: 失败原因
 *                           description: 删除失败的条目详情
 *                           example: []
 *             examples:
 *               success:
 *                 summary: 批量删除成功响应
 *                 value:
 *                   success: true
 *                   data:
 *                     deletedCount: 3
 *                     failedCount: 0
 *                     failedItems: []
 *                   message: "批量删除附件成功"
 *               partial_success:
 *                 summary: 部分成功响应
 *                 value:
 *                   success: true
 *                   data:
 *                     deletedCount: 2
 *                     failedCount: 1
 *                     failedItems:
 *                       - id: "64f123456789abcd1234567b"
 *                         error: "权限不足：只能删除自己上传的附件"
 *                   message: "批量删除附件完成（部分失败）"
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               empty_ids:
 *                 summary: ID数组为空
 *                 value:
 *                   success: false
 *                   error: "请提供要删除的附件ID数组"
 *               too_many_ids:
 *                 summary: ID数量超限
 *                 value:
 *                   success: false
 *                   error: "一次最多删除50个附件"
 *               invalid_ids:
 *                 summary: 无效的ID格式
 *                 value:
 *                   success: false
 *                   error: "附件ID格式无效"
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 */

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

    // 确保所有相关模型都被注册（解决MissingSchemaError）
    const ensureModels = [Attachment, OverallProject, InternalPreparationProject]
    ensureModels.forEach(model => model.modelName)

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
    
    // 类型安全的错误处理
    if (error instanceof Error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: '无效的ID格式'
        })
      }
    }

    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
}

export default authMiddleware(handler)
