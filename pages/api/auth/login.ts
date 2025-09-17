/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - 用户认证
 *     summary: 用户登录
 *     description: 用户使用用户名和密码进行登录，成功后返回JWT访问令牌和刷新令牌
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 description: 密码
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/UserResponse'
 *                         accessToken:
 *                           type: string
 *                           description: JWT访问令牌
 *                         refreshToken:
 *                           type: string
 *                           description: JWT刷新令牌
 *       400:
 *         description: 请求参数错误或登录失败
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
 */

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
