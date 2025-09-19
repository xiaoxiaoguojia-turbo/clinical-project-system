/**
 * @swagger
 * /api/overall-projects:
 *   get:
 *     tags:
 *       - 总体项目管理
 *     summary: 获取总体项目列表
 *     description: |
 *       分页获取总体项目列表，支持多种搜索和筛选条件。
 *       
 *       **搜索功能：**
 *       - 按项目名称搜索
 *       - 按研发团队搜索
 *       - 按技术领域搜索
 *       - 按合作方式搜索
 *       
 *       **筛选功能：**
 *       - 按项目状态筛选
 *       - 按技术领域筛选
 *       - 按合作方式筛选
 *       - 按创建者筛选
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
 *         description: 搜索关键词（项目名称、研发团队、技术领域、合作方式）
 *         example: "人工智能"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, paused]
 *         description: 项目状态筛选
 *         example: "active"
 *       - in: query
 *         name: technologyField
 *         schema:
 *           type: string
 *         description: 技术领域筛选
 *         example: "人工智能"
 *       - in: query
 *         name: cooperationMode
 *         schema:
 *           type: string
 *         description: 合作方式筛选
 *         example: "技术开发"
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: 创建者ID筛选
 *         example: "64f123456789abcd12345677"
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
 *             examples:
 *               success:
 *                 summary: 成功响应示例
 *                 value:
 *                   success: true
 *                   data:
 *                     data:
 *                       - _id: "64f123456789abcd12345678"
 *                         department: "转移转化与投资部门"
 *                         projectName: "智能诊断辅助系统"
 *                         researchTeam: "上海交通大学AI实验室"
 *                         technologyField: "人工智能"
 *                         cooperationMode: "技术开发"
 *                         projectDescription: "基于深度学习的医学影像智能诊断系统"
 *                         technologyDescription: "采用卷积神经网络和注意力机制进行医学影像分析"
 *                         expectedResults: "提高诊断准确率至95%以上"
 *                         riskAssessment: "技术风险：中等；市场风险：低；监管风险：低"
 *                         budget: "500万元"
 *                         timeline: "24个月"
 *                         milestones: "需求分析（3个月）、原型开发（8个月）、临床试验（10个月）、产品化（3个月）"
 *                         status: "active"
 *                         createTime: "2024-01-15T08:30:00.000Z"
 *                         updateTime: "2024-01-15T08:30:00.000Z"
 *                         createdBy: "64f123456789abcd12345677"
 *                     pagination:
 *                       current: 1
 *                       pageSize: 10
 *                       total: 45
 *                       totalPages: 5
 *                   message: "获取总体项目列表成功"
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
 *       - 总体项目管理
 *     summary: 创建总体项目
 *     description: |
 *       创建新的总体项目记录。
 *       
 *       **必填字段：**
 *       - 项目名称
 *       - 研发团队
 *       - 技术领域
 *       - 合作方式
 *       - 项目描述
 *       - 技术描述
 *       - 预期成果
 *       
 *       **可选字段：**
 *       - 风险评估
 *       - 预算
 *       - 时间节点
 *       - 里程碑
 *       - 备注
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectName
 *               - researchTeam
 *               - technologyField
 *               - cooperationMode
 *               - projectDescription
 *               - technologyDescription
 *               - expectedResults
 *             properties:
 *               department:
 *                 type: string
 *                 default: "转移转化与投资部门"
 *                 description: 部门名称
 *               projectName:
 *                 type: string
 *                 maxLength: 200
 *                 description: 项目名称
 *                 example: "智能诊断辅助系统"
 *               researchTeam:
 *                 type: string
 *                 maxLength: 200
 *                 description: 研发团队
 *                 example: "上海交通大学AI实验室"
 *               technologyField:
 *                 type: string
 *                 maxLength: 100
 *                 description: 技术领域
 *                 example: "人工智能"
 *               cooperationMode:
 *                 type: string
 *                 maxLength: 100
 *                 description: 合作方式
 *                 example: "技术开发"
 *               projectDescription:
 *                 type: string
 *                 description: 项目描述
 *                 example: "基于深度学习的医学影像智能诊断系统，能够辅助医生进行疾病诊断"
 *               technologyDescription:
 *                 type: string
 *                 description: 技术描述
 *                 example: "采用卷积神经网络和注意力机制进行医学影像分析"
 *               expectedResults:
 *                 type: string
 *                 description: 预期成果
 *                 example: "提高诊断准确率至95%以上，减少误诊率30%"
 *               riskAssessment:
 *                 type: string
 *                 description: 风险评估
 *                 example: "技术风险：中等；市场风险：低；监管风险：低"
 *               budget:
 *                 type: string
 *                 description: 预算
 *                 example: "500万元"
 *               timeline:
 *                 type: string
 *                 description: 时间节点
 *                 example: "24个月"
 *               milestones:
 *                 type: string
 *                 description: 里程碑
 *                 example: "需求分析（3个月）、原型开发（8个月）、临床试验（10个月）、产品化（3个月）"
 *               remarks:
 *                 type: string
 *                 description: 备注
 *                 example: "与上海市第一人民医院合作进行临床试验"
 *           examples:
 *             ai_diagnosis:
 *               summary: AI诊断系统项目
 *               value:
 *                 projectName: "智能诊断辅助系统"
 *                 researchTeam: "上海交通大学AI实验室"
 *                 technologyField: "人工智能"
 *                 cooperationMode: "技术开发"
 *                 projectDescription: "基于深度学习的医学影像智能诊断系统，能够辅助医生进行疾病诊断，提高诊断效率和准确性"
 *                 technologyDescription: "采用卷积神经网络和注意力机制进行医学影像分析，结合多模态数据融合技术"
 *                 expectedResults: "提高诊断准确率至95%以上，减少误诊率30%，提升诊断效率50%"
 *                 riskAssessment: "技术风险：中等（深度学习模型复杂性）；市场风险：低（医疗需求大）；监管风险：低"
 *                 budget: "500万元"
 *                 timeline: "24个月"
 *                 milestones: "需求分析（3个月）、原型开发（8个月）、临床试验（10个月）、产品化（3个月）"
 *                 remarks: "与上海市第一人民医院合作进行临床试验验证"
 *             drug_discovery:
 *               summary: 药物发现项目
 *               value:
 *                 projectName: "AI驱动的新药发现平台"
 *                 researchTeam: "复旦大学药学院"
 *                 technologyField: "生物技术"
 *                 cooperationMode: "联合研发"
 *                 projectDescription: "利用人工智能技术加速新药发现和开发过程"
 *                 technologyDescription: "分子对接、QSAR建模、深度生成模型"
 *                 expectedResults: "缩短药物发现周期40%，提高命中率20%"
 *                 budget: "800万元"
 *                 timeline: "36个月"
 *     responses:
 *       201:
 *         description: 创建项目成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/OverallProject'
 *             examples:
 *               success:
 *                 summary: 创建成功响应
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "64f123456789abcd12345678"
 *                     department: "转移转化与投资部门"
 *                     projectName: "智能诊断辅助系统"
 *                     researchTeam: "上海交通大学AI实验室"
 *                     technologyField: "人工智能"
 *                     cooperationMode: "技术开发"
 *                     projectDescription: "基于深度学习的医学影像智能诊断系统"
 *                     technologyDescription: "采用卷积神经网络和注意力机制进行医学影像分析"
 *                     expectedResults: "提高诊断准确率至95%以上"
 *                     riskAssessment: "技术风险：中等；市场风险：低；监管风险：低"
 *                     budget: "500万元"
 *                     timeline: "24个月"
 *                     milestones: "需求分析（3个月）、原型开发（8个月）、临床试验（10个月）、产品化（3个月）"
 *                     remarks: "与上海市第一人民医院合作进行临床试验"
 *                     status: "active"
 *                     createTime: "2024-01-15T08:30:00.000Z"
 *                     updateTime: "2024-01-15T08:30:00.000Z"
 *                     createdBy: "64f123456789abcd12345677"
 *                   message: "创建总体项目成功"
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: 参数验证错误
 *                 value:
 *                   success: false
 *                   error: "请填写所有必填字段"
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 */

import { NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import OverallProject from '@/models/OverallProject'
import Attachment from '@/models/Attachment'  // 添加Attachment模型导入
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
