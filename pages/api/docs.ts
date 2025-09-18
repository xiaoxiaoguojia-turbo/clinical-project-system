import { NextApiRequest, NextApiResponse } from 'next'
import swaggerSpec from '@/lib/swagger'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 设置CORS头部，允许swagger-ui访问
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    // 只允许GET请求
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // 检查swagger规范是否生成成功
    if (!swaggerSpec || !swaggerSpec.paths) {
      console.error('Swagger spec is empty or invalid:', swaggerSpec)
      return res.status(500).json({ 
        error: 'Swagger规范生成失败',
        debug: {
          hasSpec: !!swaggerSpec,
          hasPaths: !!(swaggerSpec && swaggerSpec.paths),
          pathsCount: swaggerSpec && swaggerSpec.paths ? Object.keys(swaggerSpec.paths).length : 0
        }
      })
    }

    // 在开发环境下打印调试信息
    if (process.env.NODE_ENV === 'development') {
      console.log('📋 Swagger API文档请求')
      console.log('🔍 发现的API路径数量:', Object.keys(swaggerSpec.paths).length)
      console.log('📄 API路径列表:', Object.keys(swaggerSpec.paths))
    }

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(swaggerSpec)
  } catch (error) {
    console.error('生成Swagger文档时出错:', error)
    res.status(500).json({ 
      error: '服务器内部错误', 
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
