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

    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
}

export default authMiddleware(handler)
