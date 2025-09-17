/**
 * @swagger
 * /api/overall-projects:
 *   get:
 *     tags:
 *       - 总体项目管理
 *     summary: 获取总体项目列表
 *     description: 分页获取总体项目列表，支持搜索和筛选
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页大小
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, paused]
 *         description: 项目状态筛选
 *     responses:
 *       200:
 *         description: 获取项目列表成功
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
 *                                 $ref: '#/components/schemas/OverallProject'
 *   post:
 *     tags:
 *       - 总体项目管理
 *     summary: 创建新项目
 *     description: 创建新的总体项目
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - leader
 *               - startDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: 项目名称
 *               leader:
 *                 type: string
 *                 description: 项目负责人
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: 开始日期
 *     responses:
 *       201:
 *         description: 创建项目成功
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权访问
 */

import { NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import OverallProject from '@/models/OverallProject'
import { ApiResponse, PaginatedResponse, OverallProject as IOverallProject } from '@/types'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<IOverallProject> | IOverallProject>>
) {
  try {
    // 连接数据库
    await connectDB()

    if (req.method === 'GET') {
      // 获取总体项目列表
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 10
      const search = req.query.search as string
      const status = req.query.status as string
      const importance = req.query.importance as string
      const leader = req.query.leader as string

      // 构建查询条件
      const query: any = {}
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { leader: { $regex: search, $options: 'i' } },
          { indication: { $regex: search, $options: 'i' } },
          { hospitalPI: { $regex: search, $options: 'i' } }
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

      // 计算分页
      const skip = (page - 1) * pageSize
      const total = await OverallProject.countDocuments(query)
      const totalPages = Math.ceil(total / pageSize)

      // 查询项目列表
      const projects = await OverallProject.find(query)
        .sort({ createTime: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('createdBy', 'username realName')
        .populate('attachments')

      const formattedProjects = projects.map(project => ({
        _id: project._id.toString(),
        department: project.department,
        type: project.type,
        source: project.source,
        name: project.name,
        leader: project.leader,
        startDate: project.startDate,
        indication: project.indication,
        followUpWeeks: project.followUpWeeks,
        importance: project.importance,
        stageOne: project.stageOne,
        stageTwo: project.stageTwo,
        stageThree: project.stageThree,
        transformMethod: project.transformMethod,
        hospitalPI: project.hospitalPI,
        projectOverview: project.projectOverview,
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
        message: '获取总体项目列表成功'
      })

    } else if (req.method === 'POST') {
      // 创建新的总体项目
      const {
        department = '转移转化与投资部门',
        type,
        source,
        name,
        leader,
        startDate,
        indication,
        followUpWeeks,
        importance = '中',
        stageOne,
        stageTwo,
        stageThree,
        transformMethod,
        hospitalPI,
        projectOverview
      } = req.body

      // 验证必填字段
      if (!type || !source || !name || !leader || !startDate || !indication || followUpWeeks === undefined) {
        return res.status(400).json({
          success: false,
          error: '请填写所有必填字段（类型、来源、名称、负责人、开始日期、适应症/科室、跟进时间）'
        })
      }

      // 创建项目
      const newProject = new OverallProject({
        department,
        type,
        source,
        name,
        leader,
        startDate: new Date(startDate),
        indication,
        followUpWeeks: Number(followUpWeeks),
        importance,
        stageOne,
        stageTwo,
        stageThree,
        transformMethod,
        hospitalPI,
        projectOverview,
        createdBy: req.user.userId
      })

      const savedProject = await newProject.save()

      res.status(201).json({
        success: true,
        data: {
          _id: savedProject._id.toString(),
          department: savedProject.department,
          type: savedProject.type,
          source: savedProject.source,
          name: savedProject.name,
          leader: savedProject.leader,
          startDate: savedProject.startDate,
          indication: savedProject.indication,
          followUpWeeks: savedProject.followUpWeeks,
          importance: savedProject.importance,
          stageOne: savedProject.stageOne,
          stageTwo: savedProject.stageTwo,
          stageThree: savedProject.stageThree,
          transformMethod: savedProject.transformMethod,
          hospitalPI: savedProject.hospitalPI,
          projectOverview: savedProject.projectOverview,
          attachments: [],
          status: savedProject.status,
          createTime: savedProject.createTime,
          updateTime: savedProject.updateTime,
          createdBy: savedProject.createdBy.toString()
        } as any,
        message: '创建总体项目成功'
      })

    } else {
      res.status(405).json({
        success: false,
        error: '不支持的请求方法'
      })
    }

  } catch (error) {
    console.error('总体项目管理API错误:', error)
    
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: error.message
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
