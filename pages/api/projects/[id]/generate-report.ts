/**
 * @swagger
 * /api/projects/{id}/generate-report:
 *   post:
 *     tags:
 *       - 统一项目管理
 *     summary: 生成项目AI报告
 *     description: |
 *       为指定项目生成AI分析报告
 *       
 *       **功能说明：**
 *       - 仅支持中药现代化项目生成AI报告
 *       - 其他类型项目的AI报告功能暂未开放
 *       - 使用Coze AI工作流生成专业报告
 *       
 *       **生成条件：**
 *       - 项目必须是中药现代化类型
 *       - 项目必须有完整的基础信息（组方、功能等）
 *       - 项目状态不能是"正在生成"
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
 *         example: "68ff5fd9fa4eae1dc3cab7b5"
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
 *                           description: AI报告URL
 *                           example: "https://www.coze.cn/docs/report_123456"
 *                         debugUrl:
 *                           type: string
 *                           description: 调试URL（可选）
 *                           example: "https://www.coze.cn/workflow/debug/123456"
 *                         usage:
 *                           type: object
 *                           description: API使用统计
 *                           properties:
 *                             input_count:
 *                               type: number
 *                               example: 1500
 *                             output_count:
 *                               type: number
 *                               example: 3000
 *                             total_count:
 *                               type: number
 *                               example: 4500
 *             examples:
 *               success:
 *                 summary: 报告生成成功
 *                 value:
 *                   success: true
 *                   message: "AI报告生成成功"
 *                   data:
 *                     reportUrl: "https://www.coze.cn/docs/report_123456"
 *                     debugUrl: "https://www.coze.cn/workflow/debug/123456"
 *                     usage:
 *                       input_count: 1500
 *                       output_count: 3000
 *                       total_count: 4500
 *       400:
 *         description: 请求参数错误或项目不满足生成条件
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_id:
 *                 summary: 项目ID无效
 *                 value:
 *                   success: false
 *                   error: "无效的项目ID格式"
 *               unsupported_type:
 *                 summary: 功能暂未开放
 *                 value:
 *                   success: false
 *                   error: "该项目类型的AI报告功能暂未开放，敬请期待"
 *                   projectType: "drug"
 *                   projectTypeName: "药物研发项目"
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

import { NextApiResponse } from 'next'
import mongoose from 'mongoose'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import UnifiedProject, { IUnifiedProject } from '@/models/UnifiedProject'
import { cozeService, ReportGenerationResult } from '@/services/cozeService'
import { ApiResponse, UnifiedProject as UnifiedProjectType } from '@/types'
import { 
  isChineseMedicineModernization,
  getProjectTypeDisplayName,
  validateProjectDataForReport 
} from '@/utils/projectHelpers'

/* ------------------------------------------------------------------------------------------ */

// 报告生成响应数据接口
interface ReportGenerationData {
  reportUrl: string
  debugUrl?: string
  usage?: {
    input_count: number
    output_count: number
    total_count: number
  }
}

/* ------------------------------------------------------------------------------------------ */

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<ReportGenerationData>>
) {
  // 只支持POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: `方法 ${req.method} 不被允许`
    })
  }

  await connectDB()

  const { id } = req.query

  // 验证项目ID格式
  if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: '无效的项目ID格式'
    })
  }

  try {
    // 查找项目
    const projectDoc = await UnifiedProject.findById(id).lean()
    
    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        error: '项目不存在'
      })
    }

    // 类型断言为 IUnifiedProject
    const project = projectDoc as unknown as IUnifiedProject

    // 检查项目类型：仅支持中药现代化项目
    if (!isChineseMedicineModernization(project.projectType)) {
      const projectTypeName = getProjectTypeDisplayName(project.projectType)
      return res.status(400).json({
        success: false,
        error: `该项目类型的AI报告功能暂未开放，敬请期待`,
        projectType: project.projectType,
        projectTypeName
      } as any)
    }

    // 验证项目数据完整性
    const validation = validateProjectDataForReport(project as unknown as Partial<UnifiedProjectType>)
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: `项目数据不完整，无法生成报告: ${validation.errors.join(', ')}`
      })
    }

    // 检查当前报告状态
    if (project.aiReport?.status === 'generating') {
      return res.status(400).json({
        success: false,
        error: '报告正在生成中，请勿重复提交'
      })
    }

    // 更新项目状态为"正在生成"
    await UnifiedProject.findByIdAndUpdate(id, {
      'aiReport.status': 'generating',
      updateTime: new Date()
    })

    try {
      // 调用Coze服务生成报告
      console.log(`🚀 开始为中药现代化项目 [${project.name}] 生成AI报告`)
      const result: ReportGenerationResult = await cozeService.generateReport(project as unknown as UnifiedProjectType)
      
      // 更新项目的AI报告信息
      const now = new Date()
      const updateData: any = {
        'aiReport.reportUrl': result.reportUrl,
        'aiReport.status': 'completed',
        'aiReport.lastGeneratedAt': now,
        updateTime: now
      }

      // 如果是首次生成，记录首次生成时间
      if (!project.aiReport?.firstGeneratedAt) {
        updateData['aiReport.firstGeneratedAt'] = now
      }

      await UnifiedProject.findByIdAndUpdate(id, updateData)

      console.log(`✅ 中药现代化项目 [${project.name}] AI报告生成成功`)

      // 返回成功响应
      return res.status(200).json({
        success: true,
        data: {
          reportUrl: result.reportUrl || '',
          debugUrl: result.debugUrl,
          usage: result.usage ? {
            input_count: result.usage.input_count,
            output_count: result.usage.output_count,
            total_count: result.usage.token_count || (result.usage.input_count + result.usage.output_count)
          } : undefined
        },
        message: 'AI报告生成成功'
      })

    } catch (generateError: any) {
      // 报告生成失败，更新状态
      await UnifiedProject.findByIdAndUpdate(id, {
        'aiReport.status': 'error',
        updateTime: new Date()
      })

      console.error(`💥 中药现代化项目 [${project.name}] AI报告生成失败:`, generateError.message)

      return res.status(500).json({
        success: false,
        error: `AI报告生成失败: ${generateError.message || '未知错误'}`
      })
    }

  } catch (error: any) {
    console.error('生成AI报告时发生错误:', error)
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '生成AI报告失败'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

export default authMiddleware(handler)
