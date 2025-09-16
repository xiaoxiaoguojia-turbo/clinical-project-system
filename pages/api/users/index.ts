import { NextApiResponse } from 'next'
import { adminMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { ApiResponse, PaginatedResponse, UserResponse } from '@/types'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<UserResponse> | UserResponse>>
) {
  try {
    // 连接数据库
    await connectDB()

    if (req.method === 'GET') {
      // 获取用户列表
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 10
      const search = req.query.search as string
      const status = req.query.status as string
      const role = req.query.role as string

      // 构建查询条件
      const query: any = {}
      
      if (search) {
        query.$or = [
          { username: { $regex: search, $options: 'i' } },
          { realName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
      
      if (status) {
        query.status = status
      }
      
      if (role) {
        query.role = role
      }

      // 计算分页
      const skip = (page - 1) * pageSize
      const total = await User.countDocuments(query)
      const totalPages = Math.ceil(total / pageSize)

      // 查询用户列表（不返回密码）
      const users = await User.find(query)
        .select('-password')
        .sort({ createTime: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('createdBy', 'username realName')

      const formattedUsers: UserResponse[] = users.map(user => ({
        _id: user._id.toString(),
        username: user.username,
        role: user.role,
        email: user.email,
        realName: user.realName,
        department: user.department,
        status: user.status,
        createTime: user.createTime,
        updateTime: user.updateTime,
        lastLogin: user.lastLogin,
        createdBy: user.createdBy?.toString()
      }))

      res.status(200).json({
        success: true,
        data: {
          data: formattedUsers,
          pagination: {
            current: page,
            pageSize,
            total,
            totalPages
          }
        },
        message: '获取用户列表成功'
      })

    } else if (req.method === 'POST') {
      // 创建新用户
      const { username, password, role, email, realName, department } = req.body

      // 验证必填字段
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: '用户名和密码为必填项'
        })
      }

      // 检查用户名是否已存在
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: '用户名已存在'
        })
      }

      // 创建用户
      const newUser = new User({
        username,
        password, // 明文存储（按需求）
        role: role || 'user',
        email,
        realName,
        department,
        createdBy: req.user.userId
      })

      const savedUser = await newUser.save()

      // 构造响应数据（不包含密码）
      const userResponse: UserResponse = {
        _id: savedUser._id.toString(),
        username: savedUser.username,
        role: savedUser.role,
        email: savedUser.email,
        realName: savedUser.realName,
        department: savedUser.department,
        status: savedUser.status,
        createTime: savedUser.createTime,
        updateTime: savedUser.updateTime,
        lastLogin: savedUser.lastLogin,
        createdBy: savedUser.createdBy?.toString()
      }

      res.status(201).json({
        success: true,
        data: userResponse,
        message: '创建用户成功'
      })

    } else {
      res.status(405).json({
        success: false,
        error: '不支持的请求方法'
      })
    }

  } catch (error) {
    console.error('用户管理API错误:', error)
    
    // 类型安全的错误处理
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
          error: '用户名已存在'
        })
      }
    }

    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
}

export default adminMiddleware(handler)
