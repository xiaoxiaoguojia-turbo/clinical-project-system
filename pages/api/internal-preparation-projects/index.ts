/**
 * @swagger
 * /api/internal-preparation-projects:
 *   get:
 *     tags:
 *       - 院内制剂项目管理
 *     summary: 获取院内制剂项目列表
 *     description: 分页获取院内制剂项目列表，支持搜索和筛选
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
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词（制剂名称、组方、功能、备案号）
 *         example: "感冒灵"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, paused]
 *         description: 项目状态筛选
 *         example: "active"
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: 来源筛选
 *         example: "中医科"
 *     responses:
 *       200:
 *         description: 获取制剂项目列表成功
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
 *                                 $ref: '#/components/schemas/InternalPreparationProject'
 *             examples:
 *               success:
 *                 summary: 成功响应示例
 *                 value:
 *                   success: true
 *                   data:
 *                     data:
 *                       - _id: "64f123456789abcd12345678"
 *                         department: "转移转化与投资部门"
 *                         source: "中医科"
 *                         name: "清热解毒颗粒"
 *                         composition: "金银花、连翘、板蓝根"
 *                         function: "清热解毒，抗病毒"
 *                         specification: "10g/袋"
 *                         duration: "3年"
 *                         dosage: "每次1袋，每日3次"
 *                         recordNumber: "ZZ-2024-001"
 *                         patent: "已申请发明专利"
 *                         status: "active"
 *                         createTime: "2024-01-15T08:30:00.000Z"
 *                         updateTime: "2024-01-15T08:30:00.000Z"
 *                     pagination:
 *                       current: 1
 *                       pageSize: 10
 *                       total: 25
 *                       totalPages: 3
 *                   message: "获取院内制剂项目列表成功"
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
 *   post:
 *     tags:
 *       - 院内制剂项目管理
 *     summary: 创建院内制剂项目
 *     description: 创建新的院内制剂项目记录
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - source
 *               - name
 *               - composition
 *               - function
 *               - specification
 *               - duration
 *               - dosage
 *               - recordNumber
 *             properties:
 *               department:
 *                 type: string
 *                 default: "转移转化与投资部门"
 *                 description: 部门名称
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
 *                 example: "金银花15g、连翘12g、板蓝根10g"
 *               function:
 *                 type: string
 *                 description: 功能主治
 *                 example: "清热解毒，抗病毒感染"
 *               specification:
 *                 type: string
 *                 description: 规格
 *                 example: "10g/袋"
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
 *                 example: "临床试验阶段，效果良好"
 *           examples:
 *             example1:
 *               summary: 创建制剂项目示例
 *               value:
 *                 source: "中医科"
 *                 name: "清热解毒颗粒"
 *                 composition: "金银花15g、连翘12g、板蓝根10g、甘草6g"
 *                 function: "清热解毒，抗病毒感染，增强免疫力"
 *                 specification: "10g/袋，每盒30袋"
 *                 duration: "3年"
 *                 dosage: "每次1袋，每日3次，温水冲服"
 *                 recordNumber: "ZZ-2024-001"
 *                 patent: "已申请发明专利ZL202410001234.5"
 *                 remarks: "临床试验阶段，疗效显著"
 *     responses:
 *       201:
 *         description: 创建制剂项目成功
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
 *                 summary: 创建成功响应
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
 *                   message: "创建院内制剂项目成功"
 *       400:
 *         description: 请求参数错误或备案号已存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: 参数验证错误
 *                 value:
 *                   success: false
 *                   error: "请填写所有必填字段（来源、名称、组方、功能、规格、年限、用量、备案号）"
 *               duplicate_error:
 *                 summary: 备案号重复
 *                 value:
 *                   success: false
 *                   error: "备案号已存在"
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
import { ApiResponse, PaginatedResponse, InternalPreparationProject as IInternalPreparationProject } from '@/types'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<IInternalPreparationProject> | IInternalPreparationProject>>
) {
  try {
    // 连接数据库
    await connectDB()
    
    // 确保所有相关模型都被注册（解决MissingSchemaError）
    // 通过访问模型属性来强制触发注册
    const ensureModels = [InternalPreparationProject, Attachment]
    ensureModels.forEach(model => model.modelName) // 强制引用每个模型

    if (req.method === 'GET') {
      // 获取院内制剂项目列表
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 10
      const search = req.query.search as string
      const status = req.query.status as string
      const source = req.query.source as string

      // 构建查询条件
      const query: any = {}
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { composition: { $regex: search, $options: 'i' } },
          { function: { $regex: search, $options: 'i' } },
          { recordNumber: { $regex: search, $options: 'i' } }
        ]
      }
      
      if (status) {
        query.status = status
      }
      
      if (source) {
        query.source = { $regex: source, $options: 'i' }
      }

      // 计算分页
      const skip = (page - 1) * pageSize
      const total = await InternalPreparationProject.countDocuments(query)
      const totalPages = Math.ceil(total / pageSize)

      // 查询项目列表
      const projects = await InternalPreparationProject.find(query)
        .sort({ createTime: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('createdBy', 'username realName')
        .populate('attachments')

      const formattedProjects = projects.map(project => ({
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
        createdBy: project.createdBy?.toString()
      }))

      res.status(200).json({
        success: true,
        data: {
          data: formattedProjects as any[],
          pagination: {
            current: page,
            pageSize,
            total,
            totalPages
          }
        },
        message: '获取院内制剂项目列表成功'
      })

    } else if (req.method === 'POST') {
      // 创建新的院内制剂项目
      const {
        department = '转移转化与投资部门',
        source,
        name,
        composition,
        function: functionField,
        specification,
        duration,
        dosage,
        recordNumber,
        patent,
        remarks
      } = req.body

      // 验证必填字段
      if (!source || !name || !composition || !functionField || !specification || !duration || !dosage || !recordNumber) {
        return res.status(400).json({
          success: false,
          error: '请填写所有必填字段（来源、名称、组方、功能、规格、年限、用量、备案号）'
        })
      }

      // 检查备案号是否已存在
      const existingProject = await InternalPreparationProject.findOne({ recordNumber })
      if (existingProject) {
        return res.status(400).json({
          success: false,
          error: '备案号已存在'
        })
      }

      // 创建项目
      const newProject = new InternalPreparationProject({
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
        createdBy: req.user.userId
      })

      const savedProject = await newProject.save()

      res.status(201).json({
        success: true,
        data: {
          _id: savedProject._id.toString(),
          department: savedProject.department,
          source: savedProject.source,
          name: savedProject.name,
          composition: savedProject.composition,
          function: savedProject.function,
          specification: savedProject.specification,
          duration: savedProject.duration,
          dosage: savedProject.dosage,
          recordNumber: savedProject.recordNumber,
          patent: savedProject.patent,
          remarks: savedProject.remarks,
          attachments: [],
          status: savedProject.status,
          createTime: savedProject.createTime,
          updateTime: savedProject.updateTime,
          createdBy: savedProject.createdBy.toString()
        } as any,
        message: '创建院内制剂项目成功'
      })

    } else {
      res.status(405).json({
        success: false,
        error: '不支持的请求方法'
      })
    }

  } catch (error) {
    console.error('院内制剂项目管理API错误:', error)
    
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: error.message
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
