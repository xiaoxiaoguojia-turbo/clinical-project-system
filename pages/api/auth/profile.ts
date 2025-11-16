import { NextApiRequest, NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { ApiResponse } from '@/types'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === 'GET') {
    try {
      // 连接数据库
      await connectDB()

      // 确保所有相关模型都被注册（解决MissingSchemaError）
      const ensureModels = [User]
      ensureModels.forEach(model => model.modelName)

      // 根据JWT中的用户ID查找用户
      const user = await User.findById(req.user.userId).select('-password')
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: '用户不存在'
        })
      }

      res.status(200).json({
        success: true,
        data: {
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
        },
        message: '获取用户资料成功'
      })

    } catch (error) {
      console.error('获取用户资料错误:', error)
      res.status(500).json({
        success: false,
        error: '服务器内部错误'
      })
    }
  } else if (req.method === 'PUT') {
    try {
      // 连接数据库
      await connectDB()

      // 确保所有相关模型都被注册（解决MissingSchemaError）
      const ensureModels = [User]
      ensureModels.forEach(model => model.modelName)

      // 验证邮箱格式
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
          success: false,
          error: '邮箱格式不正确'
        })
      }

      // 验证字段长度
      if (req.body.realName.length > 20 || req.body.department.length > 50) {
        return res.status(400).json({
          success: false,
          error: '字段长度超出限制'
        })
      }

      // 根据JWT中的用户ID查找用户
      const user = await User.findById(req.user.userId)
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: '用户不存在'
        })
      }

      // 更新用户信息
      user.email = req.body.email
      user.realName = req.body.realName
      user.department = req.body.department
      await user.save()

      res.status(200).json({
        success: true,
        data: {
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
        },
        message: '更新用户资料成功'
      })

    } catch (error) {
      console.error('更新用户资料错误:', error)
      res.status(500).json({
        success: false,
        error: '服务器内部错误'
      })
    }
  } else {
    return res.status(405).json({
      success: false,
      error: '不支持的请求方法'
    })
  }
}

export default authMiddleware(handler)
