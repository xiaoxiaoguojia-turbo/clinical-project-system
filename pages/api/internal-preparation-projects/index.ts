import { NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import InternalPreparationProject from '@/models/InternalPreparationProject'
import { ApiResponse, PaginatedResponse, InternalPreparationProject as IInternalPreparationProject } from '@/types'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<IInternalPreparationProject> | IInternalPreparationProject>>
) {
  try {
    // 连接数据库
    await connectDB()

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
