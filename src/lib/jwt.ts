import jwt from 'jsonwebtoken'
import { JwtPayload } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = '24h'
const REFRESH_TOKEN_EXPIRES_IN = '7d'

if (!JWT_SECRET) {
  throw new Error('请在环境变量中设置 JWT_SECRET')
}

/**
 * 生成访问令牌
 * @param payload JWT载荷
 * @returns JWT令牌
 */
export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'clinical-project-system',
  })
}

/**
 * 生成刷新令牌
 * @param payload JWT载荷
 * @returns 刷新令牌
 */
export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: 'clinical-project-system',
  })
}

/**
 * 验证JWT令牌
 * @param token JWT令牌
 * @returns 解码后的载荷
 */
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('令牌已过期')
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('无效的令牌')
    } else {
      throw new Error('令牌验证失败')
    }
  }
}

/**
 * 从请求头中提取令牌
 * @param authHeader Authorization头
 * @returns JWT令牌
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }
  
  return parts[1]
}

/**
 * 检查令牌是否即将过期（剩余时间少于1小时）
 * @param token JWT令牌
 * @returns 是否即将过期
 */
export function isTokenExpiringSoon(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JwtPayload
    if (!decoded || !decoded.exp) return true
    
    const now = Math.floor(Date.now() / 1000)
    const timeLeft = decoded.exp - now
    
    // 如果剩余时间少于1小时（3600秒），则认为即将过期
    return timeLeft < 3600
  } catch {
    return true
  }
}

/**
 * 生成令牌对（访问令牌 + 刷新令牌）
 * @param payload JWT载荷
 * @returns 令牌对
 */
export function generateTokenPair(payload: JwtPayload) {
  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(payload)
  
  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRES_IN
  }
}
