/**
 * @swagger
 * /api/internal-preparation-projects/{id}:
 *   get:
 *     tags:
 *       - 院内制剂项目管理
 *     summary: 获取院内制剂项目详情
 *     description: 根据项目ID获取院内制剂项目的详细信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: 院内制剂项目ID（MongoDB ObjectId）
 *         example: "64f123456789abcd12345678"
 *     responses:
 *       200:
 *         description: 获取制剂项目详情成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/InternalPreparationProject'
 *             examples:
 *               success:
 *                 summary: 成功获取项目详情
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "64f123456789abcd12345678"
 *                     department: "转移转化与投资部门"
 *                     source: "中医科"
 *                     name: "清热解毒颗粒"
 *                     composition: "金银花15g、连翘12g、板蓝根10g、甘草6g"
 *                     function: "清热解毒，抗病毒感染，增强免疫力"
 *                     specification: "10g/袋，每盒30袋"
 *                     duration: "3年"
 *                     dosage: "每次1袋，每日3次，温水冲服"
 *                     recordNumber: "ZZ-2024-001"
 *                     patent: "已申请发明专利ZL202410001234.5"
 *                     remarks: "临床试验阶段，疗效显著"
 *                     status: "active"
 *                     createTime: "2024-01-15T08:30:00.000Z"
 *                     updateTime: "2024-01-15T08:30:00.000Z"
 *                     createdBy: "64f123456789abcd12345677"
 *                     aiReport:
 *                       reportUrl: "https://example.com/report.pdf"
 *                       status: "generated"
 *                       firstGeneratedAt: "2024-01-15T08:30:00.000Z"
 *                       lastGeneratedAt: "2024-01-15T08:30:00.000Z"
 *                   message: "获取院内制剂项目详情成功"
 *       400:
 *         description: 项目ID格式无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_id:
 *                 summary: 无效的项目ID
 *                 value:
 *                   success: false
 *                   error: "无效的项目ID格式"
 *       404:
 *         description: 项目不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               not_found:
 *                 summary: 项目不存在
 *                 value:
 *                   success: false
 *                   error: "项目不存在"
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 *   put:
 *     tags:
 *       - 院内制剂项目管理
 *     summary: 更新院内制剂项目
 *     description: 更新指定ID的院内制剂项目信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: 院内制剂项目ID（MongoDB ObjectId）
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
 *                 example: "转移转化与投资部门"
 *               source:
 *                 type: string
 *                 description: 制剂来源
 *                 example: "中医科"
 *               name:
 *                 type: string
 *                 description: 制剂名称
 *                 example: "清热解毒颗粒"
 *               composition:
 *                 type: string
 *                 description: 组方成分
 *                 example: "金银花15g、连翘12g、板蓝根10g、甘草6g"
 *               function:
 *                 type: string
 *                 description: 功能主治
 *                 example: "清热解毒，抗病毒感染，增强免疫力"
 *               specification:
 *                 type: string
 *                 description: 规格
 *                 example: "10g/袋，每盒30袋"
 *               duration:
 *                 type: string
 *                 description: 有效期
 *                 example: "3年"
 *               dosage:
 *                 type: string
 *                 description: 用法用量
 *                 example: "每次1袋，每日3次，温水冲服"
 *               recordNumber:
 *                 type: string
 *                 description: 备案号（唯一）
 *                 example: "ZZ-2024-001"
 *               patent:
 *                 type: string
 *                 description: 专利信息
 *                 example: "已申请发明专利ZL202410001234.5"
 *               remarks:
 *                 type: string
 *                 description: 备注信息
 *                 example: "临床试验阶段，疗效显著"
 *               status:
 *                 type: string
 *                 enum: [active, completed, paused]
 *                 description: 项目状态
 *                 example: "active"
 *           examples:
 *             update_example:
 *               summary: 更新制剂项目示例
 *               value:
 *                 name: "清热解毒颗粒（改良版）"
 *                 composition: "金银花15g、连翘12g、板蓝根10g、甘草6g、薄荷3g"
 *                 function: "清热解毒，抗病毒感染，增强免疫力，清咽利喉"
 *                 specification: "12g/袋，每盒25袋"
 *                 remarks: "临床试验完成，准备申请上市许可"
 *                 status: "completed"
 *     responses:
 *       200:
 *         description: 更新制剂项目成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/InternalPreparationProject'
 *             examples:
 *               success:
 *                 summary: 更新成功响应
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "64f123456789abcd12345678"
 *                     department: "转移转化与投资部门"
 *                     source: "中医科"
 *                     name: "清热解毒颗粒（改良版）"
 *                     composition: "金银花15g、连翘12g、板蓝根10g、甘草6g、薄荷3g"
 *                     function: "清热解毒，抗病毒感染，增强免疫力，清咽利喉"
 *                     specification: "12g/袋，每盒25袋"
 *                     duration: "3年"
 *                     dosage: "每次1袋，每日3次，温水冲服"
 *                     recordNumber: "ZZ-2024-001"
 *                     patent: "已申请发明专利ZL202410001234.5"
 *                     remarks: "临床试验完成，准备申请上市许可"
 *                     status: "completed"
 *                     createTime: "2024-01-15T08:30:00.000Z"
 *                     updateTime: "2024-01-20T14:25:00.000Z"
 *                     createdBy: "64f123456789abcd12345677"
 *                     aiReport:
 *                       reportUrl: "https://example.com/report.pdf"
 *                       status: "generated"
 *                       firstGeneratedAt: "2024-01-15T08:30:00.000Z"
 *                       lastGeneratedAt: "2024-01-15T08:30:00.000Z"
 *                   message: "更新院内制剂项目成功"
 *       400:
 *         description: 请求参数错误或备案号重复
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 权限不足（非创建者且非管理员）
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               permission_denied:
 *                 summary: 权限不足
 *                 value:
 *                   success: false
 *                   error: "权限不足：只有项目创建者或管理员可以修改项目"
 *       404:
 *         description: 项目不存在
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 *   delete:
 *     tags:
 *       - 院内制剂项目管理
 *     summary: 删除院内制剂项目
 *     description: 软删除指定ID的院内制剂项目（将状态设为inactive）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: 院内制剂项目ID（MongoDB ObjectId）
 *         example: "64f123456789abcd12345678"
 *     responses:
 *       200:
 *         description: 删除制剂项目成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               success:
 *                 summary: 删除成功响应
 *                 value:
 *                   success: true
 *                   data: null
 *                   message: "删除院内制剂项目成功"
 *       400:
 *         description: 项目ID格式无效
 *       403:
 *         description: 权限不足（非创建者且非管理员）
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               permission_denied:
 *                 summary: 权限不足
 *                 value:
 *                   success: false
 *                   error: "权限不足：只有项目创建者或管理员可以删除项目"
 *       404:
 *         description: 项目不存在
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 */

import { NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import InternalPreparationProject from '@/models/InternalPreparationProject'
import Attachment from '@/models/Attachment'
import { ApiResponse, InternalPreparationProject as IInternalPreparationProject } from '@/types'
import mongoose from 'mongoose'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<IInternalPreparationProject>>
) {
  try {
    // 连接数据库
    await connectDB()

    // 确保所有相关模型都被注册（解决MissingSchemaError）
    const ensureModels = [InternalPreparationProject, Attachment]
    ensureModels.forEach(model => model.modelName)

    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: '无效的项目ID'
      })
    }

    if (req.method === 'GET') {
      // 获取单个院内制剂项目详情
      const project = await InternalPreparationProject.findById(id)
        .populate('createdBy', 'username realName')
        .populate('attachments')
      
      if (!project) {
        return res.status(404).json({
          success: false,
          error: '项目不存在'
        })
      }

      res.status(200).json({
        success: true,
        data: {
          _id: project._id.toString(),
          department: project.department,
          source: project.source,
          name: project.name,
          composition: project.composition,
          function: project.function,
          specification: project.specification,
          duration: project.duration,
          dosage: project.dosage,
          recordNumber: project.recordNumber,
          patent: project.patent,
          remarks: project.remarks,
          attachments: project.attachments.map((att: any) => att._id.toString()),
          status: project.status,
          createTime: project.createTime,
          updateTime: project.updateTime,
          createdBy: project.createdBy?.toString(),
          aiReport: {
            reportUrl: project.aiReport?.reportUrl || null,
            status: project.aiReport?.status || 'idle',
            firstGeneratedAt: project.aiReport?.firstGeneratedAt || null,
            lastGeneratedAt: project.aiReport?.lastGeneratedAt || null
          }
        } as any,
        message: '获取项目详情成功'
      })

    } else if (req.method === 'PUT') {
      // 更新院内制剂项目
      const {
        department,
        source,
        name,
        composition,
        function: functionField,
        specification,
        duration,
        dosage,
        recordNumber,
        patent,
        remarks,
        status
      } = req.body

      // 检查权限：只有管理员或项目创建者可以修改
      const project = await InternalPreparationProject.findById(id)
      if (!project) {
        return res.status(404).json({
          success: false,
          error: '项目不存在'
        })
      }

      if (req.user.role !== 'admin' && project.createdBy.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          error: '权限不足，只能修改自己创建的项目'
        })
      }

      // 如果更新备案号，检查是否已存在
      if (recordNumber && recordNumber !== project.recordNumber) {
        const existingProject = await InternalPreparationProject.findOne({ 
          recordNumber, 
          _id: { $ne: id } 
        })
        if (existingProject) {
          return res.status(400).json({
            success: false,
            error: '备案号已存在'
          })
        }
      }

      // 构建更新数据
      const updateData: any = {}
      if (department !== undefined) updateData.department = department
      if (source !== undefined) updateData.source = source
      if (name !== undefined) updateData.name = name
      if (composition !== undefined) updateData.composition = composition
      if (functionField !== undefined) updateData.function = functionField
      if (specification !== undefined) updateData.specification = specification
      if (duration !== undefined) updateData.duration = duration
      if (dosage !== undefined) updateData.dosage = dosage
      if (recordNumber !== undefined) updateData.recordNumber = recordNumber
      if (patent !== undefined) updateData.patent = patent
      if (remarks !== undefined) updateData.remarks = remarks
      if (status !== undefined) updateData.status = status

      const updatedProject = await InternalPreparationProject.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )

      res.status(200).json({
        success: true,
        data: {
          _id: updatedProject._id.toString(),
          department: updatedProject.department,
          source: updatedProject.source,
          name: updatedProject.name,
          composition: updatedProject.composition,
          function: updatedProject.function,
          specification: updatedProject.specification,
          duration: updatedProject.duration,
          dosage: updatedProject.dosage,
          recordNumber: updatedProject.recordNumber,
          patent: updatedProject.patent,
          remarks: updatedProject.remarks,
          attachments: updatedProject.attachments.map((att: any) => att.toString()),
          status: updatedProject.status,
          createTime: updatedProject.createTime,
          updateTime: updatedProject.updateTime,
          createdBy: updatedProject.createdBy.toString(),
          aiReport: {
            reportUrl: updatedProject.aiReport?.reportUrl || null,
            status: updatedProject.aiReport?.status || 'idle',
            firstGeneratedAt: updatedProject.aiReport?.firstGeneratedAt || null,
            lastGeneratedAt: updatedProject.aiReport?.lastGeneratedAt || null
          }
        } as any,
        message: '更新项目成功'
      })

    } else if (req.method === 'DELETE') {
      // 删除院内制剂项目
      
      // 检查权限：只有管理员可以删除项目
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: '权限不足，只有管理员可以删除项目'
        })
      }

      const project = await InternalPreparationProject.findById(id)
      if (!project) {
        return res.status(404).json({
          success: false,
          error: '项目不存在'
        })
      }

      // 软删除 - 将状态设为paused而不是真正删除
      await InternalPreparationProject.findByIdAndUpdate(id, { status: 'paused' })

      res.status(200).json({
        success: true,
        message: '删除项目成功'
      })

    } else {
      res.status(405).json({
        success: false,
        error: '不支持的请求方法'
      })
    }

  } catch (error) {
    console.error('院内制剂项目操作API错误:', error)
    
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: error.message
        })
      }

      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: '无效的项目ID格式'
        })
      }

      // 处理MongoDB唯一约束错误
      if ('code' in error && error.code === 11000) {
        return res.status(400).json({
          success: false,
          error: '备案号已存在'
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
