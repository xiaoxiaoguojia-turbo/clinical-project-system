import { NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { ApiResponse } from '@/types'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      error: '不支持的请求方法'
    })
  }

  try {
    // 连接数据库
    await connectDB()

    // 确保所有相关模型都被注册
    const ensureModels = [User]
    ensureModels.forEach(model => model.modelName)

    const { currentPassword, newPassword } = req.body

    // 验证必填字段
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: '当前密码和新密码为必填项'
      })
    }

    // 验证新密码长度
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: '新密码长度不能少于6个字符'
      })
    }

    // 查找当前用户
    const user = await User.findById(req.user.userId)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      })
    }

    // 验证当前密码是否正确（明文对比）
    if (user.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        error: '当前密码不正确'
      })
    }

    // 检查新密码是否与当前密码相同
    if (newPassword === currentPassword) {
      return res.status(400).json({
        success: false,
        error: '新密码不能与当前密码相同'
      })
    }

    // 更新密码（明文存储，与登录逻辑保持一致）
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: '密码修改成功'
    })

  } catch (error) {
    console.error('修改密码错误:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
}

export default authMiddleware(handler)
