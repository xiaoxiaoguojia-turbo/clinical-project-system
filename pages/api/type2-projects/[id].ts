/**
 * @swagger
 * /api/type2-projects/{id}:
 *   get:
 *     tags:
 *       - 类型2项目管理
 *     summary: 获取类型2项目详情
 *     description: 根据项目ID获取类型2项目的详细信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: 项目ID（MongoDB ObjectId格式）
 *         example: "64f123456789abcd12345678"
 *     responses:
 *       200:
 *         description: 获取项目详情成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Type2Project'
 *                 message:
 *                   type: string
 *                   example: "获取类型2项目详情成功"
 *       400:
 *         description: 项目ID格式错误
 *       404:
 *         description: 项目不存在
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 *   put:
 *     tags:
 *       - 类型2项目管理
 *     summary: 更新类型2项目
 *     description: 根据项目ID更新类型2项目信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: 项目ID（MongoDB ObjectId格式）
 *         example: "64f123456789abcd12345678"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department:
 *                 type: string
 *                 description: 部门名称
 *               source:
 *                 type: string
 *                 description: 项目来源
 *               name:
 *                 type: string
 *                 description: 项目名称
 *               category:
 *                 type: string
 *                 description: 项目分类
 *               leader:
 *                 type: string
 *                 description: 项目负责人
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: 项目开始日期
 *               indication:
 *                 type: string
 *                 description: 适应症/科室
 *               followUpWeeks:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 104
 *                 description: 跟进时间（周）
 *               importance:
 *                 type: string
 *                 enum: [very-important, important, normal]
 *                 description: 重要程度
 *               status:
 *                 type: string
 *                 enum: [initial-assessment, project-approval, implementation]
 *                 description: 项目状态
 *               transformMethod:
 *                 type: string
 *                 description: 转化方式/需求
 *               hospitalPI:
 *                 type: string
 *                 description: 院端PI
 *               projectConclusion:
 *                 type: string
 *                 description: 项目结论
 *     responses:
 *       200:
 *         description: 更新项目成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Type2Project'
 *                 message:
 *                   type: string
 *                   example: "更新类型2项目成功"
 *       400:
 *         description: 请求参数错误或项目ID格式错误
 *       404:
 *         description: 项目不存在
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 *   delete:
 *     tags:
 *       - 类型2项目管理
 *     summary: 删除类型2项目
 *     description: 根据项目ID删除类型2项目（软删除或硬删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: 项目ID（MongoDB ObjectId格式）
 *         example: "64f123456789abcd12345678"
 *     responses:
 *       200:
 *         description: 删除项目成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "删除类型2项目成功"
 *       400:
 *         description: 项目ID格式错误
 *       404:
 *         description: 项目不存在
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 */

import { NextApiResponse } from 'next'
import mongoose from 'mongoose'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import Type2Project from '@/models/Type2Project'
import Attachment from '@/models/Attachment'
import User from '@/models/User'
import { ApiResponse, Type2Project as IType2Project } from '@/types'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<IType2Project | null>>
) {
  try {
    // 连接数据库
    await connectDB()
    
    // 确保所有相关模型都被注册
    const ensureModels = [Type2Project, Attachment, User]
    ensureModels.forEach(model => model.modelName)

    const { id } = req.query

    // 验证项目ID格式
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: '缺少项目ID参数'
      })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: '无效的项目ID格式'
      })
    }

    if (req.method === 'GET') {
      // 获取类型2项目详情
      const project = await Type2Project.findById(id)
        .populate('createdBy', 'username realName')
        .populate('attachments')

      if (!project) {
        return res.status(404).json({
          success: false,
          error: '项目不存在'
        })
      }

      const formattedProject = {
        _id: project._id.toString(),
        department: project.department,
        source: project.source,
        name: project.name,
        category: project.category,
        leader: project.leader,
        startDate: project.startDate,
        indication: project.indication,
        followUpWeeks: project.followUpWeeks,
        importance: project.importance,
        status: project.status,
        transformMethod: project.transformMethod,
        hospitalPI: project.hospitalPI,
        projectConclusion: project.projectConclusion,
        attachments: project.attachments.map((att: any) => att._id.toString()),
        createTime: project.createTime,
        updateTime: project.updateTime,
        createdBy: project.createdBy?.toString(),
        aiReport: {
          reportUrl: project.aiReport?.reportUrl || null,
          status: project.aiReport?.status || 'idle',
          firstGeneratedAt: project.aiReport?.firstGeneratedAt || null,
          lastGeneratedAt: project.aiReport?.lastGeneratedAt || null
        }
      }

      res.status(200).json({
        success: true,
        data: formattedProject as any,
        message: '获取类型2项目详情成功'
      })

    } else if (req.method === 'PUT') {
      // 更新类型2项目
      const {
        department,
        source,
        name,
        category,
        leader,
        startDate,
        indication,
        followUpWeeks,
        importance,
        status,
        transformMethod,
        hospitalPI,
        projectConclusion
      } = req.body

      // 查找项目
      const project = await Type2Project.findById(id)
      if (!project) {
        return res.status(404).json({
          success: false,
          error: '项目不存在'
        })
      }

      // 验证必填字段（如果提供的话）
      if (followUpWeeks !== undefined && (followUpWeeks < 1 || followUpWeeks > 104)) {
        return res.status(400).json({
          success: false,
          error: '跟进时间必须在1-104周之间'
        })
      }

      // 验证枚举值
      if (importance && !['very-important', 'important', 'normal'].includes(importance)) {
        return res.status(400).json({
          success: false,
          error: '重要程度必须是：非常重要、重要、一般 之一'
        })
      }

      if (status && !['initial-assessment', 'project-approval', 'implementation'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: '状态必须是：初始评估、立项上会、落地转化 之一'
        })
      }

      // 更新项目字段
      const updateFields: any = {}
      if (department !== undefined) updateFields.department = department
      if (source !== undefined) updateFields.source = source
      if (name !== undefined) updateFields.name = name
      if (category !== undefined) updateFields.category = category
      if (leader !== undefined) updateFields.leader = leader
      if (startDate !== undefined) updateFields.startDate = new Date(startDate)
      if (indication !== undefined) updateFields.indication = indication
      if (followUpWeeks !== undefined) updateFields.followUpWeeks = parseInt(followUpWeeks)
      if (importance !== undefined) updateFields.importance = importance
      if (status !== undefined) updateFields.status = status
      if (transformMethod !== undefined) updateFields.transformMethod = transformMethod
      if (hospitalPI !== undefined) updateFields.hospitalPI = hospitalPI
      if (projectConclusion !== undefined) updateFields.projectConclusion = projectConclusion

      // 更新时间
      updateFields.updateTime = new Date()

      const updatedProject = await Type2Project.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      ).populate('createdBy', 'username realName')
       .populate('attachments')

      const formattedProject = {
        _id: updatedProject._id.toString(),
        department: updatedProject.department,
        source: updatedProject.source,
        name: updatedProject.name,
        category: updatedProject.category,
        leader: updatedProject.leader,
        startDate: updatedProject.startDate,
        indication: updatedProject.indication,
        followUpWeeks: updatedProject.followUpWeeks,
        importance: updatedProject.importance,
        status: updatedProject.status,
        transformMethod: updatedProject.transformMethod,
        hospitalPI: updatedProject.hospitalPI,
        projectConclusion: updatedProject.projectConclusion,
        attachments: updatedProject.attachments.map((att: any) => att._id.toString()),
        createTime: updatedProject.createTime,
        updateTime: updatedProject.updateTime,
        createdBy: updatedProject.createdBy?.toString(),
        aiReport: {
          reportUrl: updatedProject.aiReport?.reportUrl || null,
          status: updatedProject.aiReport?.status || 'idle',
          firstGeneratedAt: updatedProject.aiReport?.firstGeneratedAt || null,
          lastGeneratedAt: updatedProject.aiReport?.lastGeneratedAt || null
        }
      }

      res.status(200).json({
        success: true,
        data: formattedProject as any,
        message: '更新类型2项目成功'
      })

    } else if (req.method === 'DELETE') {
      // 删除类型2项目
      const project = await Type2Project.findById(id)
      if (!project) {
        return res.status(404).json({
          success: false,
          error: '项目不存在'
        })
      }

      // 删除项目关联的附件（可选：根据业务需求决定是否同时删除附件文件）
      // await Attachment.deleteMany({ projectId: id, projectType: 'type2' })

      // 删除项目记录
      await Type2Project.findByIdAndDelete(id)

      res.status(200).json({
        success: true,
        data: null,
        message: '删除类型2项目成功'
      })

    } else {
      res.status(405).json({
        success: false,
        error: `不支持的请求方法: ${req.method}`
      })
    }

  } catch (error) {
    console.error('类型2项目详情API错误:', error)
    
    // 处理Mongoose验证错误
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationError = error as any
      const errors = Object.values(validationError.errors).map((err: any) => err.message)
      return res.status(400).json({
        success: false,
        error: `数据验证失败: ${errors.join(', ')}`
      })
    }

    // 处理转换错误
    if (error && typeof error === 'object' && 'name' in error && error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: '数据格式错误'
      })
    }

    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

export default authMiddleware(handler)
