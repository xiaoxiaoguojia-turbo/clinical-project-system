/**
 * Coze工作流服务类
 * 使用@coze/api官方SDK调用Coze工作流生成AI报告
 */

import { CozeAPI, COZE_CN_BASE_URL } from '@coze/api'
import { InternalPreparationProject } from '@/types'

// Coze工作流配置
const COZE_CONFIG = {
  token: 'sat_wdiLBGPfC1CJJ6k9vuNRabHI4XQg5zO4aPr1XI7q489pVuVKUV1BjJmWSfdNjgII',
  workflowId: '7547613197532938275',
  baseURL: COZE_CN_BASE_URL
}

// Coze工作流参数接口 - 添加索引签名以兼容API
interface CozeWorkflowParameters {
  [key: string]: unknown // 添加索引签名
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

// Coze API响应接口
interface CozeApiResponse {
  code?: number
  msg?: string
  data?: string | any
  debug_url?: string
  usage?: {
    input_count: number
    output_count: number
    token_count: number
  }
}

export class CozeService {
  private cozeClient: CozeAPI

  constructor() {
    // 初始化Coze API客户端
    this.cozeClient = new CozeAPI({
      token: COZE_CONFIG.token,
      baseURL: COZE_CONFIG.baseURL
    })
    
    console.log('CozeService初始化完成，使用官方SDK')
  }

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
   * 调用Coze工作流生成AI报告（使用官方SDK）
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

      // 3. 使用官方SDK调用工作流
      console.log('使用Coze SDK调用工作流...')
      const response = await this.cozeClient.workflows.runs.create({
        workflow_id: COZE_CONFIG.workflowId,
        parameters: parameters as Record<string, unknown>,
        is_async: false
      })

      console.log('Coze SDK响应:', response)

      // 4. 处理SDK响应（类型断言为我们的接口）
      const apiResponse = response as unknown as CozeApiResponse

      // 检查响应状态
      if (!apiResponse || (apiResponse.code !== undefined && apiResponse.code !== 0)) {
        console.error('Coze工作流执行失败:', apiResponse?.msg || '未知错误')
        return {
          success: false,
          error: `工作流执行失败: ${apiResponse?.msg || '未知错误'}`
        }
      }

      // 5. 解析报告数据
      let reportData: { output: string }
      try {
        // SDK返回的data可能是字符串或对象
        const dataString = typeof apiResponse.data === 'string' ? apiResponse.data : JSON.stringify(apiResponse.data)
        reportData = JSON.parse(dataString)
      } catch (parseError) {
        console.error('解析报告数据失败:', parseError, '原始数据:', apiResponse.data)
        return {
          success: false,
          error: '解析报告数据失败'
        }
      }

      if (!reportData.output) {
        console.error('报告URL为空，数据:', reportData)
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

    } catch (error: unknown) {
      console.error('生成AI报告时发生错误:', error)
      
      // 类型安全的错误处理
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      
      // 处理SDK特定错误
      if (error instanceof Error && error.name === 'CozeError') {
        return {
          success: false,
          error: `Coze API错误: ${errorMessage}`
        }
      }
      
      // 处理网络错误
      if (error instanceof TypeError && errorMessage.includes('fetch')) {
        return {
          success: false,
          error: '网络连接错误，请检查网络设置'
        }
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * 测试Coze连接和配置
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('测试Coze连接...')
      
      // 使用一个简单的测试参数
      const testParams: CozeWorkflowParameters = {
        bumen: '测试部门',
        laiyuan: '测试来源',
        yaofang: '测试药方',
        zufang: '测试组方',
        function: '测试功能',
        guige: '测试规格',
        nianxian: '测试年限',
        yongliang: '测试用量',
        beianhao: 'TEST001',
        zhuanli: '测试专利'
      }

      const response = await this.cozeClient.workflows.runs.create({
        workflow_id: COZE_CONFIG.workflowId,
        parameters: testParams as Record<string, unknown>,
        is_async: false
      })

      // 类型断言
      const apiResponse = response as unknown as CozeApiResponse

      if (apiResponse && (apiResponse.code === undefined || apiResponse.code === 0)) {
        console.log('Coze连接测试成功')
        return { success: true }
      } else {
        return { 
          success: false, 
          error: `测试失败: ${apiResponse?.msg || '未知错误'}` 
        }
      }

    } catch (error: unknown) {
      console.error('Coze连接测试失败:', error)
      const errorMessage = error instanceof Error ? error.message : '连接测试失败'
      return { 
        success: false, 
        error: errorMessage 
      }
    }
  }

  /**
   * 获取工作流调试信息
   */
  getDebugInfo() {
    return {
      config: {
        workflowId: COZE_CONFIG.workflowId,
        baseURL: COZE_CONFIG.baseURL,
        // 不暴露token
        hasToken: !!COZE_CONFIG.token
      },
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
      },
      sdkInfo: {
        using: '@coze/api',
        version: 'latest'
      }
    }
  }
}

// 导出单例实例
export const cozeService = new CozeService()
export default cozeService
