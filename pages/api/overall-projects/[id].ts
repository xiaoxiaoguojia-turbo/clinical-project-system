/**
 * @swagger
 * /api/overall-projects/{id}:
 *   get:
 *     tags:
 *       - 总体项目管理
 *     summary: 获取总体项目详情
 *     description: |
 *       根据项目ID获取总体项目的详细信息，包含完整的项目数据和关联信息。
 *       
 *       **返回信息包含：**
 *       - 项目基本信息
 *       - 创建者信息
 *       - 关联附件列表
 *       - 项目状态和时间戳
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: 总体项目ID（MongoDB ObjectId）
 *         example: "64f123456789abcd12345678"
 *     responses:
 *       200:
 *         description: 获取项目详情成功
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
 *                 summary: 成功获取项目详情
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
 *                     milestones: "需求分析、原型开发、临床试验、产品化"
 *                     remarks: "与上海市第一人民医院合作进行临床试验"
 *                     status: "active"
 *                     createTime: "2024-01-15T08:30:00.000Z"
 *                     updateTime: "2024-01-15T08:30:00.000Z"
 *                     createdBy: 
 *                       _id: "64f123456789abcd12345677"
 *                       username: "zhangsan"
 *                       realName: "张三"
 *                   message: "获取总体项目详情成功"
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
 *                   error: "无效的项目ID"
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
 *       - 总体项目管理
 *     summary: 更新总体项目
 *     description: |
 *       更新指定ID的总体项目信息。
 *       
 *       **权限要求：**
 *       - 管理员：可更新任何项目
 *       - 普通用户：只能更新自己创建的项目
 *       
 *       **可更新字段：**
 *       - 项目基本信息（名称、团队、领域等）
 *       - 技术信息（描述、预期成果等）
 *       - 管理信息（预算、时间、状态等）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: 总体项目ID（MongoDB ObjectId）
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
 *               projectName:
 *                 type: string
 *                 maxLength: 200
 *                 description: 项目名称
 *                 example: "智能诊断辅助系统（升级版）"
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
 *                 example: "基于深度学习的医学影像智能诊断系统，升级版增加多模态融合"
 *               technologyDescription:
 *                 type: string
 *                 description: 技术描述
 *                 example: "采用Transformer架构和多模态融合技术"
 *               expectedResults:
 *                 type: string
 *                 description: 预期成果
 *                 example: "提高诊断准确率至98%以上"
 *               riskAssessment:
 *                 type: string
 *                 description: 风险评估
 *                 example: "技术风险：低；市场风险：低；监管风险：中等"
 *               budget:
 *                 type: string
 *                 description: 预算
 *                 example: "800万元"
 *               timeline:
 *                 type: string
 *                 description: 时间节点
 *                 example: "30个月"
 *               milestones:
 *                 type: string
 *                 description: 里程碑
 *                 example: "算法优化、临床验证、产品升级、市场推广"
 *               remarks:
 *                 type: string
 *                 description: 备注
 *                 example: "升级现有系统，增加多模态诊断能力"
 *               status:
 *                 type: string
 *                 enum: [active, completed, paused]
 *                 description: 项目状态
 *                 example: "active"
 *           examples:
 *             update_example:
 *               summary: 更新项目示例
 *               value:
 *                 projectName: "智能诊断辅助系统（升级版）"
 *                 projectDescription: "基于深度学习的医学影像智能诊断系统，升级版增加多模态融合功能"
 *                 technologyDescription: "采用最新的Transformer架构和多模态融合技术，提升诊断性能"
 *                 expectedResults: "提高诊断准确率至98%以上，支持更多病种诊断"
 *                 budget: "800万元"
 *                 timeline: "30个月"
 *                 status: "active"
 *     responses:
 *       200:
 *         description: 更新项目成功
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
 *                 summary: 更新成功响应
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "64f123456789abcd12345678"
 *                     department: "转移转化与投资部门"
 *                     projectName: "智能诊断辅助系统（升级版）"
 *                     researchTeam: "上海交通大学AI实验室"
 *                     technologyField: "人工智能"
 *                     cooperationMode: "技术开发"
 *                     projectDescription: "基于深度学习的医学影像智能诊断系统，升级版增加多模态融合功能"
 *                     technologyDescription: "采用最新的Transformer架构和多模态融合技术"
 *                     expectedResults: "提高诊断准确率至98%以上"
 *                     budget: "800万元"
 *                     timeline: "30个月"
 *                     status: "active"
 *                     createTime: "2024-01-15T08:30:00.000Z"
 *                     updateTime: "2024-01-25T14:20:00.000Z"
 *                     createdBy: "64f123456789abcd12345677"
 *                   message: "更新总体项目成功"
 *       400:
 *         description: 请求参数错误
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
 *       - 总体项目管理
 *     summary: 删除总体项目
 *     description: |
 *       软删除指定ID的总体项目（将状态设为inactive）。
 *       
 *       **权限要求：**
 *       - 管理员：可删除任何项目
 *       - 普通用户：只能删除自己创建的项目
 *       
 *       **注意事项：**
 *       - 删除操作为软删除，不会物理删除数据
 *       - 关联的附件不会被自动删除
 *       - 删除后项目状态变为inactive
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: 总体项目ID（MongoDB ObjectId）
 *         example: "64f123456789abcd12345678"
 *     responses:
 *       200:
 *         description: 删除项目成功
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
 *                   message: "删除总体项目成功"
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
import OverallProject from '@/models/OverallProject'
import { ApiResponse, OverallProject as IOverallProject } from '@/types'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<IOverallProject>>
) {
  try {
    // 连接数据库
    await connectDB()

    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: '无效的项目ID'
      })
    }

    if (req.method === 'GET') {
      // 获取单个总体项目详情
      const project = await OverallProject.findById(id)
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
        } as any,
        message: '获取项目详情成功'
      })

    } else if (req.method === 'PUT') {
      // 更新总体项目
      const {
        department,
        type,
        source,
        name,
        leader,
        startDate,
        indication,
        followUpWeeks,
        importance,
        stageOne,
        stageTwo,
        stageThree,
        transformMethod,
        hospitalPI,
        projectOverview,
        status
      } = req.body

      // 检查权限：只有管理员或项目创建者可以修改
      const project = await OverallProject.findById(id)
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

      // 构建更新数据
      const updateData: any = {}
      if (department !== undefined) updateData.department = department
      if (type !== undefined) updateData.type = type
      if (source !== undefined) updateData.source = source
      if (name !== undefined) updateData.name = name
      if (leader !== undefined) updateData.leader = leader
      if (startDate !== undefined) updateData.startDate = new Date(startDate)
      if (indication !== undefined) updateData.indication = indication
      if (followUpWeeks !== undefined) updateData.followUpWeeks = Number(followUpWeeks)
      if (importance !== undefined) updateData.importance = importance
      if (stageOne !== undefined) updateData.stageOne = stageOne
      if (stageTwo !== undefined) updateData.stageTwo = stageTwo
      if (stageThree !== undefined) updateData.stageThree = stageThree
      if (transformMethod !== undefined) updateData.transformMethod = transformMethod
      if (hospitalPI !== undefined) updateData.hospitalPI = hospitalPI
      if (projectOverview !== undefined) updateData.projectOverview = projectOverview
      if (status !== undefined) updateData.status = status

      const updatedProject = await OverallProject.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )

      res.status(200).json({
        success: true,
        data: {
          _id: updatedProject._id.toString(),
          department: updatedProject.department,
          type: updatedProject.type,
          source: updatedProject.source,
          name: updatedProject.name,
          leader: updatedProject.leader,
          startDate: updatedProject.startDate,
          indication: updatedProject.indication,
          followUpWeeks: updatedProject.followUpWeeks,
          importance: updatedProject.importance,
          stageOne: updatedProject.stageOne,
          stageTwo: updatedProject.stageTwo,
          stageThree: updatedProject.stageThree,
          transformMethod: updatedProject.transformMethod,
          hospitalPI: updatedProject.hospitalPI,
          projectOverview: updatedProject.projectOverview,
          attachments: updatedProject.attachments.map((att: any) => att.toString()),
          status: updatedProject.status,
          createTime: updatedProject.createTime,
          updateTime: updatedProject.updateTime,
          createdBy: updatedProject.createdBy.toString()
        } as any,
        message: '更新项目成功'
      })

    } else if (req.method === 'DELETE') {
      // 删除总体项目
      
      // 检查权限：只有管理员可以删除项目
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: '权限不足，只有管理员可以删除项目'
        })
      }

      const project = await OverallProject.findById(id)
      if (!project) {
        return res.status(404).json({
          success: false,
          error: '项目不存在'
        })
      }

      // 软删除 - 将状态设为paused而不是真正删除
      await OverallProject.findByIdAndUpdate(id, { status: 'paused' })

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
    console.error('总体项目操作API错误:', error)
    
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
    }

    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
}

export default authMiddleware(handler)
