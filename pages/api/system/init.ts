import { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { ApiResponse } from '@/types/index'

interface InitRequest {
  username: string
  password: string
  email?: string
  realName?: string
  department?: string
}

/**
 * @swagger
 * /api/system/init:
 *   post:
 *     tags:
 *       - 系统管理
 *     summary: 系统初始化 - 创建第一个管理员
 *     description: |
 *       **仅在系统无管理员时可用！**
 *       
 *       用于创建系统的第一个管理员账号，解决初始化问题。
 *       
 *       ⚠️ **安全说明**：
 *       - 只有在数据库中没有任何管理员用户时才能调用
 *       - 一旦有管理员存在，此接口将被禁用
 *       - 建议创建管理员后立即修改默认密码
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
 *                 description: 管理员用户名
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: 管理员密码
 *                 example: "admin123456"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 管理员邮箱
 *                 example: "admin@clinical-innovation.com"
 *               realName:
 *                 type: string
 *                 description: 管理员真实姓名
 *                 example: "系统管理员"
 *               department:
 *                 type: string
 *                 description: 所属部门
 *                 example: "转移转化与投资部门"
 *     responses:
 *       201:
 *         description: 管理员创建成功
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
 *                         message:
 *                           type: string
 *                           example: "系统初始化完成，管理员账号创建成功"
 *                         admin:
 *                           $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: 请求参数错误或系统已初始化
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               already_initialized:
 *                 summary: 系统已初始化
 *                 value:
 *                   success: false
 *                   error: "系统已经初始化，已存在管理员账号"
 *               validation_error:
 *                 summary: 参数验证失败
 *                 value:
 *                   success: false
 *                   error: "用户名和密码为必填项"
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: '只允许POST请求'
    })
  }

  try {
    // 连接数据库
    await connectDB()

    // 确保所有相关模型都被注册（解决MissingSchemaError）
    const ensureModels = [User]
    ensureModels.forEach(model => model.modelName)

    // 🔍 检查系统是否已经初始化（是否已有管理员）
    const existingAdmin = await User.findOne({ role: 'admin' })
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: '系统已经初始化，已存在管理员账号。如需创建新管理员，请使用现有管理员账号登录后操作。'
      })
    }

    // 📝 验证请求参数
    const { username, password, email, realName, department }: InitRequest = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: '用户名和密码为必填项'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: '密码长度不能少于6个字符'
      })
    }

    // 🔍 检查用户名是否已存在
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: '用户名已存在'
      })
    }

    // 🔐 创建第一个管理员账号
    const adminUser = new User({
      username,
      password, // 模型会自动处理密码（这里是明文存储，如需要可以添加加密）
      role: 'admin', // 强制设置为管理员
      email: email || `${username}@clinical-innovation.com`,
      realName: realName || '系统管理员',
      department: department || '转移转化与投资部门',
      status: 'active',
      createdBy: null // 系统创建，无创建者
    })

    await adminUser.save()

    // 📊 记录初始化日志
    console.log('🎉 系统初始化完成！')
    console.log('👤 管理员账号创建成功:', {
      id: adminUser._id,
      username: adminUser.username,
      role: adminUser.role,
      createTime: adminUser.createTime
    })

    // 🎯 返回成功响应（不包含敏感信息）
    res.status(201).json({
      success: true,
      data: {
        message: '🎉 系统初始化完成！管理员账号创建成功',
        admin: {
          _id: adminUser._id,
          username: adminUser.username,
          role: adminUser.role,
          email: adminUser.email,
          realName: adminUser.realName,
          department: adminUser.department,
          status: adminUser.status,
          createTime: adminUser.createTime,
          updateTime: adminUser.updateTime
        },
        nextSteps: [
          '1. 使用创建的管理员账号登录系统',
          '2. 调用 POST /api/auth/login 获取JWT令牌',
          '3. 在Swagger UI中设置Authorization',
          '4. 开始使用所有管理员功能'
        ]
      }
    })

  } catch (error) {
    console.error('❌ 系统初始化失败:', error)
    
    // 处理MongoDB错误
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          error: '用户名已存在'
        })
      }
    }

    res.status(500).json({
      success: false,
      error: '系统初始化失败，请稍后重试'
    })
  }
}
