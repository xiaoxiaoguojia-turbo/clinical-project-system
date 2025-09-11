import { NextApiResponse } from 'next'
import { adminMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { ApiResponse, User as IUser } from '@/types'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<IUser>>
) {
  try {
    // 连接数据库
    await connectDB()

    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: '无效的用户ID'
      })
    }

    if (req.method === 'GET') {
      // 获取单个用户详情
      const user = await User.findById(id).select('-password').populate('createdBy', 'username realName')
      
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
          createdBy: user.createdBy?.toString()
        } as any,
        message: '获取用户详情成功'
      })

    } else if (req.method === 'PUT') {
      // 更新用户信息
      const { username, password, role, email, realName, department, status } = req.body

      // 如果更新用户名，检查是否已存在
      if (username) {
        const existingUser = await User.findOne({ username, _id: { $ne: id } })
        if (existingUser) {
          return res.status(400).json({
            success: false,
            error: '用户名已存在'
          })
        }
      }

      // 构建更新数据
      const updateData: any = {}
      if (username) updateData.username = username
      if (password) updateData.password = password // 明文存储（按需求）
      if (role) updateData.role = role
      if (email !== undefined) updateData.email = email
      if (realName !== undefined) updateData.realName = realName
      if (department !== undefined) updateData.department = department
      if (status) updateData.status = status

      const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password')

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: '用户不存在'
        })
      }

      res.status(200).json({
        success: true,
        data: {
          _id: updatedUser._id.toString(),
          username: updatedUser.username,
          role: updatedUser.role,
          email: updatedUser.email,
          realName: updatedUser.realName,
          department: updatedUser.department,
          status: updatedUser.status,
          createTime: updatedUser.createTime,
          updateTime: updatedUser.updateTime,
          lastLogin: updatedUser.lastLogin,
        } as any,
        message: '更新用户成功'
      })

    } else if (req.method === 'DELETE') {
      // 删除用户
      
      // 防止删除自己
      if (id === req.user.userId) {
        return res.status(400).json({
          success: false,
          error: '不能删除自己的账号'
        })
      }

      const user = await User.findById(id)
      if (!user) {
        return res.status(404).json({
          success: false,
          error: '用户不存在'
        })
      }

      // 软删除 - 将状态设为inactive而不是真正删除
      await User.findByIdAndUpdate(id, { status: 'inactive' })

      res.status(200).json({
        success: true,
        message: '删除用户成功'
      })

    } else {
      res.status(405).json({
        success: false,
        error: '不支持的请求方法'
      })
    }

  } catch (error) {
    console.error('用户操作API错误:', error)
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
      })
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: '无效的用户ID格式'
      })
    }

    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
}

export default adminMiddleware(handler)
