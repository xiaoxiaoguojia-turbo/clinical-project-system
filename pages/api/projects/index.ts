/**
 * @swagger
 * /api/projects:
 *   get:
 *     tags:
 *       - 统一项目管理
 *     summary: 获取项目列表（所有类型）
 *     description: |
 *       分页获取所有类型项目列表，支持搜索和筛选
 *       
 *       **支持的项目类型：**
 *       - internal-preparation: 院内制剂
 *       - ai-medical: AI医疗及系统研究  
 *       - diagnostic-detection: 检测诊断
 *       - cell-therapy: 细胞治疗
 *       - drug: 药物
 *       - medical-device: 医疗器械
 *       - medical-material: 医用材料
 *       - other: 其他
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: 页码
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: 每页大小
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词（项目名称、组方、功能等）
 *         example: "清热解毒"
 *       - in: query
 *         name: projectType
 *         schema:
 *           type: string
 *           enum: [internal-preparation, ai-medical, diagnostic-detection, cell-therapy, drug, medical-device, medical-material, other]
 *         description: 项目类型筛选
 *         example: "internal-preparation"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [early-stage, preclinical, clinical-stage, market-product]
 *         description: 项目状态筛选
 *         example: "early-stage"
 *       - in: query
 *         name: importance
 *         schema:
 *           type: string
 *           enum: [very-important, important, normal, unimportant]
 *         description: 重要程度筛选
 *         example: "very-important"
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *           enum: [transfer-investment-dept-1, transfer-investment-dept-2, innovation-center, ip-dept]
 *         description: 部门筛选
 *         example: "transfer-investment-dept-1"
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: 来源筛选
 *         example: "中医科"
 *     responses:
 *       200:
 *         description: 获取项目列表成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/PaginatedResponse'
 *                         - type: object
 *                           properties:
 *                             data:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/UnifiedProject'
 *             examples:
 *               success:
 *                 summary: 成功响应示例
 *                 value:
 *                   success: true
 *                   data:
 *                     data:
 *                       - _id: "64f123456789abcd12345678"
 *                         department: "transfer-investment-dept-1"
 *                         name: "清热解毒颗粒"
 *                         projectType: "internal-preparation"
 *                         source: "中医科"
 *                         importance: "very-important"
 *                         status: "early-stage"
 *                         composition: "金银花、连翘、板蓝根"
 *                         function: "清热解毒，抗病毒"
 *                         createTime: "2024-01-15T08:30:00.000Z"
 *                       - _id: "64f123456789abcd12345679"
 *                         department: "transfer-investment-dept-1"
 *                         name: "新型抗肿瘤药物研发"
 *                         projectType: "drug"
 *                         source: "科研处"
 *                         importance: "important"
 *                         status: "clinical-stage"
 *                         leader: "张医生"
 *                         indication: "肿瘤科"
 *                         createTime: "2024-02-01T10:00:00.000Z"
 *                     pagination:
 *                       current: 1
 *                       pageSize: 10
 *                       total: 25
 *                       totalPages: 3
 *                   message: "获取项目列表成功"
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 *   post:
 *     tags:
 *       - 统一项目管理
 *     summary: 创建新项目
 *     description: |
 *       创建新的项目记录，支持所有8大项目类型
 *       
 *       **字段要求：**
 *       - 院内制剂类型：需要组方、功能、规格等特有字段
 *       - 其他类型：需要负责人、适应症等通用字段
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - projectType
 *               - source
 *             properties:
 *               department:
 *                 type: string
 *                 enum: [transfer-investment-dept-1, transfer-investment-dept-2, innovation-center, ip-dept]
 *                 default: "transfer-investment-dept-1"
 *                 description: 部门名称
 *               name:
 *                 type: string
 *                 description: 项目名称
 *                 example: "清热解毒颗粒"
 *               projectType:
 *                 type: string
 *                 enum: [internal-preparation, ai-medical, diagnostic-detection, cell-therapy, drug, medical-device, medical-material, other]
 *                 description: 项目类型
 *                 example: "internal-preparation"
 *               source:
 *                 type: string
 *                 description: 项目来源
 *                 example: "中医科"
 *               importance:
 *                 type: string
 *                 enum: [very-important, important, normal, unimportant]
 *                 default: "normal"
 *                 description: 重要程度
 *               status:
 *                 type: string
 *                 enum: [early-stage, preclinical, clinical-stage, market-product]
 *                 default: "early-stage"
 *                 description: 项目状态
 *               # 院内制剂特有字段
 *               composition:
 *                 type: string
 *                 description: 组方成分（院内制剂必需）
 *                 example: "金银花15g、连翘12g、板蓝根10g"
 *               function:
 *                 type: string
 *                 description: 功能主治（院内制剂必需）
 *                 example: "清热解毒，抗病毒感染"
 *               specification:
 *                 type: string
 *                 description: 规格（院内制剂必需）
 *                 example: "10g/袋"
 *               duration:
 *                 type: string
 *                 description: 有效期（院内制剂必需）
 *                 example: "3年"
 *               dosage:
 *                 type: string
 *                 description: 用法用量（院内制剂必需）
 *                 example: "每次1袋，每日3次"
 *               recordNumber:
 *                 type: string
 *                 description: 备案号（院内制剂必需）
 *                 example: "ZZ-2024-001"
 *               remarks:
 *                 type: string
 *                 description: 备注信息（院内制剂可选）
 *               # 其他类型特有字段
 *               leader:
 *                 type: string
 *                 description: 项目负责人（其他类型必需）
 *                 example: "张医生"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: 开始日期（其他类型必需）
 *                 example: "2024-01-15"
 *               indication:
 *                 type: string
 *                 description: 适应症/科室（其他类型必需）
 *                 example: "肿瘤科"
 *               followUpWeeks:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 104
 *                 description: 跟进时间周数（其他类型必需）
 *                 example: 24
 *               transformRequirement:
 *                 type: string
 *                 enum: [license-transfer, equity-investment, agent-holding, custodial-management, corporate-operation, license-transfer-cash, to-be-determined]
 *                 default: "to-be-determined"
 *                 description: 转化需求（其他类型可选）
 *               hospitalDoctor:
 *                 type: string
 *                 description: 院端医生（其他类型可选）
 *                 example: "李教授"
 *               conclusion:
 *                 type: string
 *                 description: 项目结论（其他类型可选）
 *               # 通用字段
 *               patent:
 *                 type: string
 *                 description: 专利信息
 *                 example: "已申请发明专利ZL202410001234.5"
 *           examples:
 *             internal_preparation:
 *               summary: 创建院内制剂项目
 *               value:
 *                 name: "清热解毒颗粒"
 *                 projectType: "internal-preparation"
 *                 source: "中医科"
 *                 importance: "very-important"
 *                 composition: "金银花15g、连翘12g、板蓝根10g"
 *                 function: "清热解毒，抗病毒感染"
 *                 specification: "10g/袋"
 *                 duration: "3年"
 *                 dosage: "每次1袋，每日3次"
 *                 recordNumber: "ZZ-2024-001"
 *                 patent: "已申请发明专利"
 *             drug_research:
 *               summary: 创建药物研发项目
 *               value:
 *                 name: "新型抗肿瘤药物研发"
 *                 projectType: "drug"
 *                 source: "科研处"
 *                 importance: "important"
 *                 leader: "张医生"
 *                 startDate: "2024-01-15"
 *                 indication: "肿瘤科"
 *                 followUpWeeks: 24
 *                 transformRequirement: "license-transfer"
 *                 hospitalDoctor: "李教授"
 *     responses:
 *       201:
 *         description: 创建项目成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UnifiedProject'
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 */

import { NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import UnifiedProject from '@/models/UnifiedProject'
import Attachment from '@/models/Attachment'
import User from '@/models/User'
import { ApiResponse, PaginatedResponse, UnifiedProject as IUnifiedProject } from '@/types'
import { 
  isInternalPreparationType, 
  getRequiredFieldsForType, 
  buildSearchQuery,
  validateProjectData 
} from '@/utils/projectHelpers'

/* ------------------------------------------------------------------------------------------ */

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<IUnifiedProject> | IUnifiedProject>>
) {
  try {
    await connectDB()

    // 确保模型都被注册
    const ensureModels = [UnifiedProject, Attachment, User]
    ensureModels.forEach(model => model.modelName)

    if (req.method === 'GET') {
      return await handleGetProjects(req, res)
    } else if (req.method === 'POST') {
      return await handleCreateProject(req, res)
    } else {
      return res.status(405).json({
        success: false,
        error: '不支持的请求方法'
      })
    }
  } catch (error: any) {
    console.error('统一项目管理API错误:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

async function handleGetProjects(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<IUnifiedProject>>>
) {
  const {
    page = '1',
    pageSize = '10',
    search = '',
    projectType = '',
    status = '',
    importance = '',
    department = '',
    source = ''
  } = req.query

  // 参数验证和转换
  const currentPage = Math.max(1, parseInt(page as string, 10))
  const size = Math.min(100, Math.max(1, parseInt(pageSize as string, 10)))
  const skip = (currentPage - 1) * size

  try {
    // 构建查询条件
    const query = buildSearchQuery({
      search: search as string,
      projectType: projectType as string,
      status: status as string,
      importance: importance as string,
      department: department as string,
      source: source as string
    })

    // 执行查询
    const [projects, total] = await Promise.all([
      UnifiedProject.find(query)
        .populate('createdBy', 'name email')
        .populate('attachments')
        .sort({ createTime: -1 })
        .skip(skip)
        .limit(size)
        .lean(),
      UnifiedProject.countDocuments(query)
    ])

    const totalPages = Math.ceil(total / size)

    return res.status(200).json({
      success: true,
      data: {
        data: projects as IUnifiedProject[],
        pagination: {
          current: currentPage,
          pageSize: size,
          total,
          totalPages
        }
      },
      message: `获取项目列表成功，共${total}个项目`
    })

  } catch (error: any) {
    console.error('获取项目列表失败:', error)
    return res.status(500).json({
      success: false,
      error: '获取项目列表失败'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

async function handleCreateProject(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<IUnifiedProject>>
) {
  const projectData = req.body

  try {
    // 基础字段验证
    if (!projectData.name || !projectData.projectType || !projectData.source) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段：项目名称、项目类型、来源'
      })
    }

    // 根据项目类型验证特有字段
    const requiredFields = getRequiredFieldsForType(projectData.projectType)
    const missingFields = requiredFields.filter((field: string) => !projectData[field])
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `缺少${projectData.projectType === 'internal-preparation' ? '院内制剂' : '项目（除院内制剂）'}必填字段: ${missingFields.join(', ')}`
      })
    }

    // 数据验证
    const validation = validateProjectData(projectData)
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: `数据验证失败: ${validation.errors.join(', ')}`
      })
    }

    // 院内制剂特殊验证：备案号唯一性
    if (projectData.projectType === 'internal-preparation' && projectData.recordNumber) {
      const existingProject = await UnifiedProject.findOne({
        projectType: 'internal-preparation',
        recordNumber: projectData.recordNumber
      })

      if (existingProject) {
        return res.status(400).json({
          success: false,
          error: `备案号 "${projectData.recordNumber}" 已存在`
        })
      }
    }

    // 创建项目数据
    const newProjectData = {
      ...projectData,
      department: projectData.department || 'transfer-investment-dept-1',
      importance: projectData.importance || 'normal',
      status: projectData.status || 'early-stage',
      createdBy: req.user.userId,
      createTime: new Date(),
      updateTime: new Date()
    }

    // 根据项目类型设置默认的转化需求
    if (!isInternalPreparationType(projectData.projectType)) {
      newProjectData.transformRequirement = newProjectData.transformRequirement || 'to-be-determined'
    }

    // 保存到数据库
    const newProject = new UnifiedProject(newProjectData)
    const savedProject = await newProject.save()

    // 返回完整的项目信息
    const populatedProject = await UnifiedProject.findById(savedProject._id)
      .populate('createdBy', 'name email')
      .populate('attachments')
      .lean()

    return res.status(201).json({
      success: true,
      data: populatedProject as IUnifiedProject,
      message: `${isInternalPreparationType(projectData.projectType) ? '院内制剂' : '项目（除院内制剂）'}创建成功`
    })

  } catch (error: any) {
    console.error('创建项目失败:', error)
    
    // 处理MongoDB验证错误
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return res.status(400).json({
        success: false,
        error: `数据验证失败: ${validationErrors.join(', ')}`
      })
    }

    // 处理重复键错误
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: '项目名称或备案号已存在'
      })
    }

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '创建项目失败'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

export default authMiddleware(handler)
