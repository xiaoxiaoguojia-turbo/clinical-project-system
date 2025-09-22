/**
 * @swagger
 * /api/internal-preparations/{id}/generate-report:
 *   post:
 *     tags:
 *       - 院内制剂管理
 *     summary: 生成AI报告
 *     description: |
 *       为指定的院内制剂项目生成AI报告。
 *       
 *       **功能说明：**
 *       - 获取项目完整信息
 *       - 调用Coze工作流生成报告
 *       - 返回飞书文档链接
 *       
 *       **生成时间：** 通常需要30秒-2分钟
 *       **报告格式：** 飞书在线文档
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: 项目ID（MongoDB ObjectId）
 *         example: "64f123456789abcd12345678"
 *     responses:
 *       200:
 *         description: 报告生成成功
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
 *                         reportUrl:
 *                           type: string
 *                           description: 生成的报告链接（飞书文档）
 *                           example: "https://jd4omasmev.feishu.cn/docx/RlmWdBSi2ourIsx3yIicHCUJnVf"
 *                         debugUrl:
 *                           type: string
 *                           description: 工作流调试链接
 *                         usage:
 *                           type: object
 *                           description: Token使用统计
 *             examples:
 *               success:
 *                 summary: 报告生成成功
 *                 value:
 *                   success: true
 *                   data:
 *                     reportUrl: "https://jd4omasmev.feishu.cn/docx/RlmWdBSi2ourIsx3yIicHCUJnVf"
 *                     debugUrl: "https://www.coze.cn/work_flow?execute_id=xxx"
 *                     usage:
 *                       input_count: 1550
 *                       output_count: 8086
 *                       token_count: 9636
 *                   message: "AI报告生成成功"
 *       400:
 *         description: 请求错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_id:
 *                 summary: 无效的项目ID
 *                 value:
 *                   success: false
 *                   error: "无效的项目ID格式"
 *               incomplete_data:
 *                 summary: 项目数据不完整
 *                 value:
 *                   success: false
 *                   error: "项目数据不完整：药方名称不能为空, 组方信息不能为空"
 *       404:
 *         description: 项目不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               not_found:
 *                 summary: 项目不存在
 *                 value:
 *                   success: false
 *                   error: "项目不存在"
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import InternalPreparationProject from '@/models/InternalPreparationProject'
import { cozeService, ReportGenerationResult } from '@/services/cozeService'
import { ApiResponse } from '@/types'
import mongoose from 'mongoose'

// 报告生成响应数据接口
interface ReportGenerationData {
  reportUrl: string
  debugUrl?: string
  usage?: {
    input_count: number
    output_count: number
    token_count: number
  }
}

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<ReportGenerationData>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: '不支持的请求方法，请使用POST'
    })
  }

  try {
    // 连接数据库
    await connectDB()

    // 获取项目ID
    const { id } = req.query
    
    // 验证项目ID格式
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: '缺少项目ID参数'
      })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: '无效的项目ID格式'
      })
    }

    console.log('开始为项目生成AI报告，项目ID:', id, '用户:', req.user.userId)

    // 查找项目
    const project = await InternalPreparationProject.findById(id)
    if (!project) {
      return res.status(404).json({
        success: false,
        error: '项目不存在'
      })
    }

    console.log('找到项目:', project.name, '备案号:', project.recordNumber)

    // 检查用户权限（可选：根据需要添加权限控制）
    // 这里可以添加逻辑检查用户是否有权为此项目生成报告
    
    // 调用CozeService生成报告
    console.log('调用CozeService生成AI报告...')
    const result: ReportGenerationResult = await cozeService.generateReport(project.toObject())

    if (!result.success) {
      console.error('AI报告生成失败:', result.error)
      return res.status(500).json({
        success: false,
        error: result.error || 'AI报告生成失败'
      })
    }

    console.log('AI报告生成成功:', result.reportUrl)

    // 可选：将报告信息保存到项目中
    // 这里可以扩展项目模型来保存报告历史
    // project.aiReports = project.aiReports || []
    // project.aiReports.push({
    //   reportUrl: result.reportUrl,
    //   generateTime: new Date(),
    //   generatedBy: req.user.userId
    // })
    // await project.save()

    // 返回成功结果
    res.status(200).json({
      success: true,
      data: {
        reportUrl: result.reportUrl!,
        debugUrl: result.debugUrl,
        usage: result.usage
      },
      message: 'AI报告生成成功'
    })

  } catch (error) {
    console.error('生成AI报告API错误:', error)

    // 处理MongoDB连接错误
    if (error.name === 'MongooseError') {
      return res.status(500).json({
        success: false,
        error: '数据库连接错误'
      })
    }

    // 处理其他错误
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误'
    })
  }
}

export default authMiddleware(handler)
