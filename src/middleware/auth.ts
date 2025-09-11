import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt'
import { JwtPayload } from '@/types'

// 扩展NextApiRequest以包含用户信息
export interface AuthenticatedRequest extends NextApiRequest {
  user: JwtPayload
}

/**
 * 认证中间件 - 验证JWT令牌
 */
export function authMiddleware(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // 提取令牌
      const token = extractTokenFromHeader(req.headers.authorization)
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: '缺少认证令牌'
        })
      }

      // 验证令牌
      const decoded = verifyToken(token)
      
      // 将用户信息添加到请求对象
      ;(req as AuthenticatedRequest).user = decoded
      
      // 调用下一个处理器
      await handler(req as AuthenticatedRequest, res)
      
    } catch (error) {
      console.error('认证中间件错误:', error)
      return res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : '认证失败'
      })
    }
  }
}

/**
 * 管理员权限中间件 - 仅允许管理员访问
 */
export function adminMiddleware(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return authMiddleware(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: '权限不足，需要管理员权限'
        })
      }
      
      await handler(req, res)
    } catch (error) {
      console.error('管理员权限中间件错误:', error)
      return res.status(500).json({
        success: false,
        error: '服务器内部错误'
      })
    }
  })
}

/**
 * 可选认证中间件 - 如果有令牌则验证，没有则继续
 */
export function optionalAuthMiddleware(
  handler: (req: AuthenticatedRequest | NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = extractTokenFromHeader(req.headers.authorization)
      
      if (token) {
        try {
          const decoded = verifyToken(token)
          ;(req as AuthenticatedRequest).user = decoded
        } catch (error) {
          // 令牌无效，但不阻止访问
          console.warn('可选认证中间件: 令牌验证失败', error)
        }
      }
      
      await handler(req, res)
    } catch (error) {
      console.error('可选认证中间件错误:', error)
      return res.status(500).json({
        success: false,
        error: '服务器内部错误'
      })
    }
  }
}

/**
 * CORS中间件 - 处理跨域请求
 */
export function corsMiddleware(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }
    
    await handler(req, res)
  }
}
