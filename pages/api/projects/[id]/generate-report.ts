/**
 * @swagger
 * /api/projects/{id}/generate-report:
 *   post:
 *     tags:
 *       - 统一项目管理
 *     summary: 生成项目AI报告
 *     description: |
 *       为指定项目生成AI分析报告，根据项目类型提供不同的功能支持
 *       
 *       **功能支持情况：**
 *       - ✅ 院内制剂(internal-preparation): 完整AI报告生成功能
 *       - 🚫 其他类型: 功能暂未开放，敬请期待
 *       
 *       **院内制剂报告生成说明：**
 *       - 自动获取项目完整信息
 *       - 调用Coze工作流生成专业报告
 *       - 返回飞书在线文档链接
 *       - 生成时间：通常需要30秒-2分钟
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
 *         description: 报告生成成功（仅院内制剂）
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
 *                           example: "https://www.coze.cn/work_flow?execute_id=xxx"
 *                         usage:
 *                           type: object
 *                           description: Token使用统计
 *                           properties:
 *                             input_count:
 *                               type: integer
 *                               example: 1550
 *                             output_count:
 *                               type: integer
 *                               example: 8086
 *                             token_count:
 *                               type: integer
 *                               example: 9636
 *             examples:
 *               internal_preparation_success:
 *                 summary: 院内制剂报告生成成功
 *                 value:
 *                   success: true
 *                   data:
 *                     reportUrl: "https://jd4omasmev.feishu.cn/docx/RlmWdBSi2ourIsx3yIicHCUJnVf"
 *                     debugUrl: "https://www.coze.cn/work_flow?execute_id=7438921965947224081"
 *                     usage:
 *                       input_count: 1550
 *                       output_count: 8086
 *                       token_count: 9636
 *                   message: "院内制剂AI报告生成成功"
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
 *                 summary: 项目数据不完整（院内制剂）
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
 *       503:
 *         description: 功能暂未开放（非院内制剂项目）
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               feature_unavailable:
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
import UnifiedProject from '@/models/UnifiedProject'
import { cozeService, ReportGenerationResult } from '@/services/cozeService'
import { ApiResponse } from '@/types'
import { 
  isInternalPreparationType,
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
    token_count: number
  }
}

/* ------------------------------------------------------------------------------------------ */

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

    // 查找项目
    const project = await UnifiedProject.findById(id)
    if (!project) {
      return res.status(404).json({
        success: false,
        error: '项目不存在'
      })
    }

    // 根据项目类型分发处理逻辑
    if (isInternalPreparationType(project.projectType)) {
      return await handleInternalPreparationReport(req, res, project)
    } else {
      return await handleOtherProjectTypeReport(req, res, project)
    }

  } catch (error) {
    console.error('统一报告生成API错误:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

async function handleInternalPreparationReport(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<ReportGenerationData>>,
  project: any
) {
  try {
    console.log(`🚀 开始为院内制剂项目 [${project.name}] 生成AI报告`)

    // 验证院内制剂项目数据完整性
    const validation = validateProjectDataForReport(project.toObject())
    if (!validation.isValid) {
      console.warn(`❌ 院内制剂项目数据不完整: ${validation.errors.join(', ')}`)
      return res.status(400).json({
        success: false,
        error: `项目数据不完整：${validation.errors.join(', ')}`
      })
    }

    // 设置生成状态
    project.aiReport = project.aiReport || {}
    project.aiReport.status = 'generating'
    project.aiReport.lastGeneratedAt = new Date()
    await project.save()

    console.log(`⏳ 调用Coze服务生成报告...`)

    // 调用Coze服务生成报告
    const result: ReportGenerationResult = await cozeService.generateReport(project.toObject())
    
    if (!result.success) {
      console.error(`💥 Coze服务调用失败: ${result.error}`)
      
      // 更新失败状态
      project.aiReport.status = 'error'
      await project.save()
      
      return res.status(500).json({ 
        success: false, 
        error: result.error || 'AI报告生成失败' 
      })
    }

    console.log(`✅ 报告生成成功: ${result.reportUrl}`)

    // 更新成功状态
    project.aiReport.status = 'completed'
    project.aiReport.reportUrl = result.reportUrl || null
    project.aiReport.lastGeneratedAt = new Date()
    if (!project.aiReport.firstGeneratedAt) {
      project.aiReport.firstGeneratedAt = new Date()
    }
    await project.save()

    return res.status(200).json({
      success: true,
      data: {
        reportUrl: result.reportUrl!,
        debugUrl: result.debugUrl,
        usage: result.usage
      },
      message: '院内制剂AI报告生成成功'
    })

  } catch (error) {
    console.error('院内制剂报告生成失败:', error)
    
    // 更新错误状态
    try {
      project.aiReport = project.aiReport || {}
      project.aiReport.status = 'error'
      await project.save()
    } catch (saveError) {
      console.error('更新项目状态失败:', saveError)
    }

    return res.status(500).json({
      success: false,
      error: '院内制剂AI报告生成失败'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

async function handleOtherProjectTypeReport(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<ReportGenerationData>>,
  project: any
) {
  const projectTypeName = getProjectTypeDisplayName(project.projectType)
  
  console.log(`🚫 项目类型 [${project.projectType}] 的AI报告功能暂未开放`)

  // 返回功能暂未开放的响应
  return res.status(503).json({
    success: false,
    error: `${projectTypeName}AI报告功能暂未开放，敬请期待`,
    // 额外信息供前端使用
    projectType: project.projectType,
    projectTypeName: projectTypeName
  } as any)

  /* ------------------------------------------------------------------------------------------ */
  
  // 以下是预留的其他项目类型报告生成逻辑（暂时注释）
  /*
  
  console.log(`🔮 未来此处将实现 [${projectTypeName}] 的AI报告生成逻辑`)
  
  try {
    // 设置生成状态
    project.aiReport = project.aiReport || {}
    project.aiReport.status = 'generating'
    project.aiReport.lastGeneratedAt = new Date()
    await project.save()

    // 根据项目类型调用不同的AI服务
    let result: ReportGenerationResult
    
    switch (project.projectType) {
      case 'drug':
        // result = await drugAIService.generateReport(project.toObject())
        break
      case 'medical-device':
        // result = await deviceAIService.generateReport(project.toObject())
        break
      case 'ai-medical':
        // result = await aiMedicalService.generateReport(project.toObject())
        break
      default:
        // result = await generalAIService.generateReport(project.toObject())
        break
    }
    
    if (!result.success) {
      project.aiReport.status = 'error'
      await project.save()
      return res.status(500).json({ 
        success: false, 
        error: result.error || `${projectTypeName}AI报告生成失败` 
      })
    }

    // 更新成功状态
    project.aiReport.status = 'completed'
    project.aiReport.reportUrl = result.reportUrl || null
    project.aiReport.lastGeneratedAt = new Date()
    if (!project.aiReport.firstGeneratedAt) {
      project.aiReport.firstGeneratedAt = new Date()
    }
    await project.save()

    return res.status(200).json({
      success: true,
      data: {
        reportUrl: result.reportUrl!,
        debugUrl: result.debugUrl,
        usage: result.usage
      },
      message: `${projectTypeName}AI报告生成成功`
    })

  } catch (error) {
    console.error(`${projectTypeName}报告生成失败:`, error)
    
    // 更新错误状态
    try {
      project.aiReport = project.aiReport || {}
      project.aiReport.status = 'error'
      await project.save()
    } catch (saveError) {
      console.error('更新项目状态失败:', saveError)
    }

    return res.status(500).json({
      success: false,
      error: `${projectTypeName}AI报告生成失败`
    })
  }
  
  */
}

/* ------------------------------------------------------------------------------------------ */

export default authMiddleware(handler)
