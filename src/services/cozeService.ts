/**
 * Coze工作流服务类
 * 用于调用Coze API生成AI报告
 */

import { InternalPreparationProject } from '@/types'

// Coze工作流配置
const COZE_CONFIG = {
  baseURL: 'https://api.coze.cn',
  token: 'sat_wdiLBGPfC1CJJ6k9vuNRabHI4XQg5zO4aPr1XI7q489pVuVKUV1BjJmWSfdNjgII',
  workflowId: '7547613197532938275',
  timeout: 10 * 60 * 1000 // 10分钟超时
}

// Coze工作流参数接口
interface CozeWorkflowParameters {
  bumen: string      // 部门
  laiyuan: string    // 来源
  yaofang: string    // 药方名称
  zufang: string     // 组方
  function: string   // 功能
  guige: string      // 规格
  nianxian: string   // 年限
  yongliang: string  // 用量
  beianhao: string   // 备案号
  zhuanli?: string   // 专利（可选）
}

// API响应接口
interface CozeApiResponse {
  code: number
  msg: string
  data: string
  debug_url?: string
  usage?: {
    input_count: number
    output_count: number
    token_count: number
  }
}

// 报告生成结果接口
export interface ReportGenerationResult {
  success: boolean
  reportUrl?: string
  debugUrl?: string
  usage?: {
    input_count: number
    output_count: number
    token_count: number
  }
  error?: string
}

export class CozeService {
  /**
   * 将数据库项目数据映射为Coze工作流参数
   */
  private mapProjectToCozeParameters(project: InternalPreparationProject): CozeWorkflowParameters {
    return {
      bumen: project.department || '转移转化与投资部门',
      laiyuan: project.source,
      yaofang: project.name,
      zufang: project.composition,
      function: project.function,
      guige: project.specification,
      nianxian: project.duration,
      yongliang: project.dosage,
      beianhao: project.recordNumber,
      zhuanli: project.patent || ''
    }
  }

  /**
   * 验证项目数据完整性
   */
  private validateProjectData(project: InternalPreparationProject): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (!project.department?.trim()) errors.push('部门信息不能为空')
    if (!project.source?.trim()) errors.push('来源信息不能为空')
    if (!project.name?.trim()) errors.push('药方名称不能为空')
    if (!project.composition?.trim()) errors.push('组方信息不能为空')
    if (!project.function?.trim()) errors.push('功能信息不能为空')
    if (!project.specification?.trim()) errors.push('规格信息不能为空')
    if (!project.duration?.trim()) errors.push('年限信息不能为空')
    if (!project.dosage?.trim()) errors.push('用量信息不能为空')
    if (!project.recordNumber?.trim()) errors.push('备案号不能为空')

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 调用Coze工作流生成AI报告
   */
  async generateReport(project: InternalPreparationProject): Promise<ReportGenerationResult> {
    try {
      console.log('开始生成AI报告，项目ID:', project._id)
      
      // 1. 验证项目数据
      const validation = this.validateProjectData(project)
      if (!validation.isValid) {
        return {
          success: false,
          error: `项目数据不完整：${validation.errors.join(', ')}`
        }
      }

      // 2. 映射参数
      const parameters = this.mapProjectToCozeParameters(project)
      console.log('Coze工作流参数:', parameters)

      // 3. 构建请求体
      const requestBody = {
        workflow_id: COZE_CONFIG.workflowId,
        parameters,
        is_async: false
      }

      console.log('调用Coze API，请求体:', JSON.stringify(requestBody, null, 2))

      // 4. 调用Coze API
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), COZE_CONFIG.timeout)

      const response = await fetch(`${COZE_CONFIG.baseURL}/v1/workflow/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COZE_CONFIG.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // 5. 处理HTTP响应
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Coze API HTTP错误:', response.status, response.statusText, errorText)
        return {
          success: false,
          error: `API调用失败 (HTTP ${response.status}): ${response.statusText}`
        }
      }

      // 6. 解析响应数据
      const apiResponse: CozeApiResponse = await response.json()
      console.log('Coze API响应:', apiResponse)

      // 7. 检查业务状态码
      if (apiResponse.code !== 0) {
        console.error('Coze工作流执行失败:', apiResponse.msg)
        return {
          success: false,
          error: `工作流执行失败: ${apiResponse.msg}`
        }
      }

      // 8. 解析报告URL
      let reportData: { output: string }
      try {
        reportData = JSON.parse(apiResponse.data)
      } catch (parseError) {
        console.error('解析报告数据失败:', parseError)
        return {
          success: false,
          error: '解析报告数据失败'
        }
      }

      if (!reportData.output) {
        console.error('报告URL为空')
        return {
          success: false,
          error: '未获得报告链接'
        }
      }

      console.log('AI报告生成成功，链接:', reportData.output)

      return {
        success: true,
        reportUrl: reportData.output,
        debugUrl: apiResponse.debug_url,
        usage: apiResponse.usage
      }

    } catch (error) {
      console.error('生成AI报告时发生错误:', error)
      
      // 处理不同类型的错误
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: '请求超时，请重试'
        }
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: '网络连接错误，请检查网络设置'
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  /**
   * 获取工作流调试信息（用于开发调试）
   */
  getDebugInfo() {
    return {
      config: COZE_CONFIG,
      mappingInfo: {
        department: 'bumen',
        source: 'laiyuan',
        name: 'yaofang',
        composition: 'zufang',
        function: 'function',
        specification: 'guige',
        duration: 'nianxian',
        dosage: 'yongliang',
        recordNumber: 'beianhao',
        patent: 'zhuanli'
      }
    }
  }
}

// 导出单例实例
export const cozeService = new CozeService()
export default cozeService
