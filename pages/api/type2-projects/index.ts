/**
 * @swagger
 * /api/type2-projects:
 *   get:
 *     tags:
 *       - 类型2项目管理
 *     summary: 获取类型2项目列表
 *     description: 分页获取类型2项目列表，支持搜索和筛选
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
 *         description: 搜索关键词（项目名称、分类、适应症、负责人）
 *         example: "新药研发"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [initial-assessment, project-approval, implementation]
 *         description: 项目状态筛选
 *         example: "initial-assessment"
 *       - in: query
 *         name: importance
 *         schema:
 *           type: string
 *           enum: [very-important, important, normal]
 *         description: 重要程度筛选
 *         example: "very-important"
 *       - in: query
 *         name: leader
 *         schema:
 *           type: string
 *         description: 负责人筛选
 *         example: "张医生"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 分类筛选
 *         example: "药物研发"
 *     responses:
 *       200:
 *         description: 获取类型2项目列表成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Type2Project'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *                 message:
 *                   type: string
 *                   example: "获取类型2项目列表成功"
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 *   post:
 *     tags:
 *       - 类型2项目管理
 *     summary: 创建类型2项目
 *     description: 创建新的类型2项目记录
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
 *               - category
 *               - leader
 *               - startDate
 *               - indication
 *               - followUpWeeks
 *               - transformMethod
 *               - hospitalPI
 *             properties:
 *               department:
 *                 type: string
 *                 default: "转移转化与投资部门"
 *                 description: 部门名称
 *               source:
 *                 type: string
 *                 description: 项目来源
 *                 example: "科研处"
 *               name:
 *                 type: string
 *                 description: 项目名称
 *                 example: "新型抗肿瘤药物研发"
 *               category:
 *                 type: string
 *                 description: 项目分类
 *                 example: "药物研发"
 *               leader:
 *                 type: string
 *                 description: 项目负责人
 *                 example: "张医生"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: 项目开始日期
 *                 example: "2024-01-15"
 *               indication:
 *                 type: string
 *                 description: 适应症/科室
 *                 example: "肿瘤科/胃癌治疗"
 *               followUpWeeks:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 104
 *                 description: 跟进时间（周）
 *                 example: 24
 *               importance:
 *                 type: string
 *                 enum: [very-important, important, normal]
 *                 default: normal
 *                 description: 重要程度
 *                 example: "very-important"
 *               transformMethod:
 *                 type: string
 *                 description: 转化方式/需求
 *                 example: "临床试验转化"
 *               hospitalPI:
 *                 type: string
 *                 description: 院端PI
 *                 example: "李教授"
 *               projectConclusion:
 *                 type: string
 *                 description: 项目结论
 *                 example: "项目进展顺利，预期效果良好"
 *     responses:
 *       201:
 *         description: 创建类型2项目成功
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
 *                   example: "创建类型2项目成功"
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 */

import { NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import Type2Project from '@/models/Type2Project'
import Attachment from '@/models/Attachment'  
import User from '@/models/User'  
import { ApiResponse, PaginatedResponse, Type2Project as IType2Project } from '@/types'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<IType2Project> | IType2Project>>
) {
  try {
    // 连接数据库
    await connectDB()
    
    // 确保所有相关模型都被注册（解决MissingSchemaError）
    const ensureModels = [Type2Project, Attachment, User]
    ensureModels.forEach(model => model.modelName) // 强制引用每个模型

    if (req.method === 'GET') {
      // 获取类型2项目列表
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 10
      const search = req.query.search as string
      const status = req.query.status as string
      const importance = req.query.importance as string
      const leader = req.query.leader as string
      const category = req.query.category as string

      // 构建查询条件
      const query: any = {}
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { indication: { $regex: search, $options: 'i' } },
          { leader: { $regex: search, $options: 'i' } },
          { transformMethod: { $regex: search, $options: 'i' } }
        ]
      }
      
      if (status) {
        query.status = status
      }
      
      if (importance) {
        query.importance = importance
      }
      
      if (leader) {
        query.leader = { $regex: leader, $options: 'i' }
      }
      
      if (category) {
        query.category = { $regex: category, $options: 'i' }
      }

      // 计算分页
      const skip = (page - 1) * pageSize
      const total = await Type2Project.countDocuments(query)
      const totalPages = Math.ceil(total / pageSize)

      // 查询项目列表
      const projects = await Type2Project.find(query)
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
        // AI报告相关信息（暂时禁用）
        aiReport: {
          reportUrl: project.aiReport?.reportUrl || null,
          status: project.aiReport?.status || 'idle',
          firstGeneratedAt: project.aiReport?.firstGeneratedAt || null,
          lastGeneratedAt: project.aiReport?.lastGeneratedAt || null
        }
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
        message: '获取类型2项目列表成功'
      })

    } else if (req.method === 'POST') {
      // 创建新的类型2项目
      const {
        department = '转移转化与投资部门',
        source,
        name,
        category,
        leader,
        startDate,
        indication,
        followUpWeeks,
        importance = 'normal',
        transformMethod,
        hospitalPI,
        projectConclusion
      } = req.body

      // 验证必填字段
      const requiredFields = {
        source: '项目来源',
        name: '项目名称',
        category: '项目分类',
        leader: '项目负责人',
        startDate: '开始日期',
        indication: '适应症/科室',
        followUpWeeks: '跟进时间',
        transformMethod: '转化方式/需求',
        hospitalPI: '院端PI'
      }

      const missingFields = []
      for (const [field, label] of Object.entries(requiredFields)) {
        if (!req.body[field]) {
          missingFields.push(label)
        }
      }

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `请填写所有必填字段：${missingFields.join('、')}`
        })
      }

      // 验证跟进时间范围
      if (followUpWeeks < 1 || followUpWeeks > 104) {
        return res.status(400).json({
          success: false,
          error: '跟进时间必须在1-104周之间'
        })
      }

      // 验证枚举值
      const validImportance = ['very-important', 'important', 'normal']
      if (importance && !validImportance.includes(importance)) {
        return res.status(400).json({
          success: false,
          error: '重要程度必须是：非常重要、重要、一般 之一'
        })
      }

      // 创建项目
      const newProject = new Type2Project({
        department,
        source,
        name,
        category,
        leader,
        startDate: new Date(startDate),
        indication,
        followUpWeeks: parseInt(followUpWeeks),
        importance,
        transformMethod,
        hospitalPI,
        projectConclusion: projectConclusion || '',
        createdBy: req.user.userId
      })

      const savedProject = await newProject.save()

      // 格式化响应数据
      const formattedProject = {
        _id: savedProject._id.toString(),
        department: savedProject.department,
        source: savedProject.source,
        name: savedProject.name,
        category: savedProject.category,
        leader: savedProject.leader,
        startDate: savedProject.startDate,
        indication: savedProject.indication,
        followUpWeeks: savedProject.followUpWeeks,
        importance: savedProject.importance,
        status: savedProject.status,
        transformMethod: savedProject.transformMethod,
        hospitalPI: savedProject.hospitalPI,
        projectConclusion: savedProject.projectConclusion,
        attachments: [],
        createTime: savedProject.createTime,
        updateTime: savedProject.updateTime,
        createdBy: savedProject.createdBy.toString(),
        aiReport: {
          reportUrl: null,
          status: 'idle',
          firstGeneratedAt: null,
          lastGeneratedAt: null
        }
      }

      res.status(201).json({
        success: true,
        data: formattedProject as any,
        message: '创建类型2项目成功'
      })

    } else {
      res.status(405).json({
        success: false,
        error: `不支持的请求方法: ${req.method}`
      })
    }

  } catch (error) {
    console.error('类型2项目API错误:', error)
    
    // 处理Mongoose验证错误
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationError = error as any
      const errors = Object.values(validationError.errors).map((err: any) => err.message)
      return res.status(400).json({
        success: false,
        error: `数据验证失败: ${errors.join(', ')}`
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
