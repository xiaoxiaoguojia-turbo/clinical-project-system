import { NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { ApiResponse } from '@/types'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: '不支持的请求方法'
    })
  }

  try {
    // 连接数据库
    await connectDB()

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
}

export default authMiddleware(handler)
