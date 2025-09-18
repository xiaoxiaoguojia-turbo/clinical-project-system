import { NextApiRequest, NextApiResponse } from 'next'
import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'
import { SwaggerSpec } from '@/lib/swagger'

/**
 * @swagger
 * /api/test-swagger:
 *   get:
 *     tags:
 *       - 系统测试
 *     summary: 测试Swagger文档生成
 *     description: 用于测试swagger-jsdoc是否能正确扫描和生成API文档
 *     responses:
 *       200:
 *         description: 测试成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Swagger测试成功"
 *                 debug:
 *                   type: object
 *                   properties:
 *                     scanPaths:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: 扫描的文件路径
 *                     foundPaths:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: 发现的API路径
 *                     pathsCount:
 *                       type: integer
 *                       description: API路径数量
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 创建测试用的swagger配置
    const testOptions: swaggerJsdoc.Options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0',
        },
      },
      apis: [
        path.join(process.cwd(), 'pages', 'api', '**', '*.ts'),
        path.join(process.cwd(), 'pages', 'api', '*.ts'),
      ],
    }

    // 生成swagger规范
    const testSpecs = swaggerJsdoc(testOptions) as SwaggerSpec
    
    // 收集调试信息
    const debugInfo = {
      scanPaths: testOptions.apis,
      foundPaths: testSpecs.paths ? Object.keys(testSpecs.paths) : [],
      pathsCount: testSpecs.paths ? Object.keys(testSpecs.paths).length : 0,
      cwd: process.cwd(),
      nodeEnv: process.env.NODE_ENV,
    }

    console.log('🧪 Swagger测试调试信息:')
    console.log('📁 当前工作目录:', debugInfo.cwd)
    console.log('🔍 扫描路径:', debugInfo.scanPaths)
    console.log('📄 发现的API路径:', debugInfo.foundPaths)
    console.log('📊 API路径数量:', debugInfo.pathsCount)

    res.status(200).json({
      success: true,
      message: 'Swagger测试成功',
      debug: debugInfo,
    })
  } catch (error) {
    console.error('❌ Swagger测试失败:', error)
    res.status(500).json({
      success: false,
      error: 'Swagger测试失败',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
