import { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { generateTokenPair } from '@/lib/jwt'
import { LoginRequest, ApiResponse, LoginResponse } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LoginResponse>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: '不支持的请求方法'
    })
  }

  try {
    // 连接数据库
    await connectDB()

    const { username, password }: LoginRequest = req.body

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: '用户名和密码为必填项'
      })
    }

    // 查找用户
    const user = await User.findOne({ username, status: 'active' })
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      })
    }

    // 简单密码验证（明文对比，如需求所述）
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      })
    }

    // 更新最后登录时间
    await User.findByIdAndUpdate(user._id, { 
      lastLogin: new Date() 
    })

    // 生成JWT令牌
    const tokenPair = generateTokenPair({
      userId: user._id.toString(),
      username: user.username,
      role: user.role
    })

    // 返回用户信息和令牌（不返回密码）
    const userResponse = {
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
    }

    res.status(200).json({
      success: true,
      data: {
        user: userResponse as any,
        token: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken
      },
      message: '登录成功'
    })

  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
}
