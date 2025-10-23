import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * 环境变量检查API
 * 用于验证所有必需的环境变量是否正确配置
 * 访问: GET /api/check-env
 */

interface EnvCheckResult {
  name: string
  configured: boolean
  value?: string
  maskedValue?: string
  required: boolean
}

interface EnvCheckResponse {
  success: boolean
  environment: string
  timestamp: string
  checks: EnvCheckResult[]
  summary: {
    total: number
    configured: number
    missing: number
    missingRequired: string[]
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EnvCheckResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      environment: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString(),
      checks: [],
      summary: { total: 0, configured: 0, missing: 0, missingRequired: [] }
    })
  }

  // 定义需要检查的环境变量
  const envVarsToCheck = [
    // MongoDB配置
    { name: 'MONGODB_URI', required: true, sensitive: true },
    
    // JWT配置
    { name: 'JWT_SECRET', required: true, sensitive: true },
    
    // 文件上传配置
    { name: 'MAX_FILE_SIZE', required: true, sensitive: false },
    { name: 'UPLOAD_DIR', required: true, sensitive: false },
    
    // 应用配置
    { name: 'API_BASE_URL', required: false, sensitive: false },
    { name: 'NEXT_PUBLIC_APP_NAME', required: false, sensitive: false },
    { name: 'NEXT_PUBLIC_APP_VERSION', required: false, sensitive: false },
    
    // Coze AI配置
    { name: 'COZE_API_KEY', required: false, sensitive: true },
    { name: 'COZE_BOT_ID', required: false, sensitive: false },
    { name: 'COZE_WORKFLOW_ID', required: false, sensitive: false },
    
    // Docker相关（仅在Docker环境）
    { name: 'MONGO_ROOT_USERNAME', required: false, sensitive: false },
    { name: 'MONGO_ROOT_PASSWORD', required: false, sensitive: true },
    { name: 'MONGO_DATABASE', required: false, sensitive: false },
  ]

  // 执行检查
  const checks: EnvCheckResult[] = envVarsToCheck.map(({ name, required, sensitive }) => {
    const value = process.env[name]
    const configured = !!value && value.trim() !== ''

    return {
      name,
      configured,
      value: configured ? (sensitive ? undefined : value) : undefined,
      maskedValue: configured && sensitive ? maskSensitiveValue(value!) : undefined,
      required
    }
  })

  // 统计
  const total = checks.length
  const configured = checks.filter(c => c.configured).length
  const missing = total - configured
  const missingRequired = checks
    .filter(c => c.required && !c.configured)
    .map(c => c.name)

  // 返回结果
  res.status(200).json({
    success: true,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    checks,
    summary: {
      total,
      configured,
      missing,
      missingRequired
    }
  })
}

/**
 * 脱敏敏感信息
 */
function maskSensitiveValue(value: string): string {
  if (value.length <= 8) {
    return '***'
  }
  
  const start = value.substring(0, 4)
  const end = value.substring(value.length - 4)
  const middle = '*'.repeat(Math.min(value.length - 8, 20))
  
  return `${start}${middle}${end}`
}
