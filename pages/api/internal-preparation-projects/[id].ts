import { NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import InternalPreparationProject from '@/models/InternalPreparationProject'
import { ApiResponse, InternalPreparationProject as IInternalPreparationProject } from '@/types'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<IInternalPreparationProject>>
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
          createdBy: project.createdBy?.toString()
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
          createdBy: updatedProject.createdBy.toString()
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

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: '备案号已存在'
      })
    }

    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
}

export default authMiddleware(handler)
