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
 *       - chinese-medicine-modernization: 中药现代化
 *       - ai-medical-research: AI医疗及系统研究  
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
 *           enum: [chinese-medicine-modernization, ai-medical-research, diagnostic-detection, cell-therapy, drug, medical-device, medical-material, other]
 *         description: 项目类型筛选
 *         example: "chinese-medicine-modernization"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: 项目状态筛选（值根据项目类型不同）
 *         example: "hospital-preparation"
 *       - in: query
 *         name: importance
 *         schema:
 *           type: string
 *           enum: [very-important, important, normal]
 *         description: 重要程度筛选
 *         example: "very-important"
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *           enum: [transfer-investment-dept-1, transfer-investment-dept-2, transfer-investment-dept-3]
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
 *                 summary: 成功获取项目列表
 *                 value:
 *                   success: true
 *                   message: "获取项目列表成功，共13个项目"
 *                   data:
 *                     data:
 *                       - _id: "68ff5fd9fa4eae1dc3cab7b5"
 *                         department: "transfer-investment-dept-1"
 *                         name: "蒲莲清解颗粒"
 *                         projectType: "chinese-medicine-modernization"
 *                         source: "上海市皮肤病医院"
 *                         importance: "very-important"
 *                         status: "hospital-preparation"
 *                         leader: "yangfeng"
 *                         transformRequirements:
 *                           - type: "license-transfer"
 *                             currentProgress: "潜在待推进"
 *                         composition: "蒲公英，穿心莲，野菊花，连翘，马齿苋"
 *                         function: "清热解毒、消痈散结"
 *                         createTime: "2025-10-01T08:00:00.000Z"
 *                         updateTime: "2025-10-10T15:30:00.000Z"
 *                         createdBy: "张三"
 *                         aiReport: {
 *                           reportUrl: "https://example.com/report.pdf",
 *                           status: "completed",
 *                           firstGeneratedAt: "2025-10-01T08:30:00.000Z",
 *                           lastGeneratedAt: "2025-10-05T14:20:00.000Z"
 *                         }
 *                     pagination:
 *                       current: 1
 *                       pageSize: 10
 *                       total: 13
 *                       totalPages: 2
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     tags:
 *       - 统一项目管理
 *     summary: 创建新项目（所有类型）
 *     description: |
 *       创建新的项目，支持所有项目类型
 *       
 *       **必填字段（所有项目）：**
 *       - department: 归属部门
 *       - name: 项目名称
 *       - projectType: 项目类型
 *       - source: 医院来源
 *       - importance: 重要程度
 *       - status: 项目进展状态（值根据projectType不同）
 *       - leader: 负责人
 *       - transformRequirements: 转化需求列表
 *       
 *       **中药现代化额外必填字段：**
 *       - composition: 组方
 *       - function: 功能
 *       
 *       **其他类型额外必填字段：**
 *       - startDate: 开始日期
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - department
 *               - name
 *               - projectType
 *               - source
 *               - importance
 *               - status
 *               - leader
 *               - transformRequirements
 *             properties:
 *               department:
 *                 type: string
 *                 enum: [transfer-investment-dept-1, transfer-investment-dept-2, transfer-investment-dept-3]
 *                 description: 归属部门
 *                 example: "transfer-investment-dept-1"
 *               name:
 *                 type: string
 *                 description: 项目名称
 *                 example: "蒲莲清解颗粒"
 *               projectType:
 *                 type: string
 *                 enum: [chinese-medicine-modernization, ai-medical-research, diagnostic-detection, cell-therapy, drug, medical-device, medical-material, other]
 *                 description: 项目类型
 *                 example: "chinese-medicine-modernization"
 *               source:
 *                 type: string
 *                 description: 医院来源
 *                 example: "上海市皮肤病医院"
 *               importance:
 *                 type: string
 *                 enum: [very-important, important, normal]
 *                 description: 重要程度
 *                 example: "very-important"
 *               status:
 *                 type: string
 *                 description: 项目进展状态（根据projectType不同而不同）
 *                 example: "hospital-preparation"
 *               leader:
 *                 type: string
 *                 enum: [yangfeng, qinqingsong, haojingjing, chenlong, wangliyan, maoshiwei, xiaolanchuan, to-be-determined]
 *                 description: 负责人
 *                 example: "yangfeng"
 *               transformRequirements:
 *                 type: array
 *                 description: 转化需求列表（必填）
 *                 items:
 *                   type: object
 *                   required:
 *                     - type
 *                     - currentProgress
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [investment, company-operation, license-transfer, pending]
 *                       description: 转化需求类型
 *                       example: "license-transfer"
 *                     currentProgress:
 *                       type: string
 *                       description: 当前进展节点
 *                       example: "潜在待推进"
 *               indication:
 *                 type: string
 *                 description: 适应症/科室
 *                 example: "皮肤科"
 *               dockingCompany:
 *                 type: string
 *                 description: 对接企业
 *                 example: "XX医药公司"
 *               hospitalDoctor:
 *                 type: string
 *                 description: 院端医生
 *                 example: "李医生"
 *               patent:
 *                 type: string
 *                 description: 专利信息
 *                 example: "专利已授权"
 *               clinicalData:
 *                 type: string
 *                 description: 临床数据
 *                 example: "临床数据完整"
 *               transformAmount:
 *                 type: number
 *                 description: 转化金额（万元）
 *                 example: 500
 *               conclusion:
 *                 type: string
 *                 description: 项目结论
 *                 example: "项目进展顺利"
 *               composition:
 *                 type: string
 *                 description: 组方成分（中药现代化必填）
 *                 example: "金银花15g、连翘12g、板蓝根10g"
 *               function:
 *                 type: string
 *                 description: 功能主治（中药现代化必填）
 *                 example: "清热解毒、消痈散结"
 *               specification:
 *                 type: string
 *                 description: 制剂规格
 *                 example: "颗粒剂，每袋装20g"
 *               duration:
 *                 type: string
 *                 description: 使用年限
 *                 example: "30"
 *               recordNumber:
 *                 type: string
 *                 description: 备案号
 *                 example: "沪药制备字Z20190019000"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: 开始日期（其他类型必填）
 *                 example: "2025-01-01T00:00:00.000Z"
 *           examples:
 *             chinese-medicine:
 *               summary: 创建中药现代化项目
 *               value:
 *                 department: "transfer-investment-dept-1"
 *                 name: "新制剂项目"
 *                 projectType: "chinese-medicine-modernization"
 *                 source: "上海市中医医院"
 *                 importance: "very-important"
 *                 status: "hospital-preparation"
 *                 leader: "yangfeng"
 *                 transformRequirements:
 *                   - type: "investment"
 *                     currentProgress: "入库"
 *                 composition: "金银花、连翘、板蓝根"
 *                 function: "清热解毒"
 *                 specification: "颗粒剂"
 *                 duration: "20"
 *             other-project:
 *               summary: 创建其他类型项目
 *               value:
 *                 department: "transfer-investment-dept-2"
 *                 name: "新药研发项目"
 *                 projectType: "drug"
 *                 source: "某医院"
 *                 importance: "important"
 *                 status: "early-stage"
 *                 leader: "qinqingsong"
 *                 transformRequirements:
 *                   - type: "company-operation"
 *                     currentProgress: "合同签署"
 *                 startDate: "2025-01-01T00:00:00.000Z"
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
 *             examples:
 *               success:
 *                 summary: 创建成功
 *                 value:
 *                   success: true
 *                   message: "中药现代化项目创建成功"
 *                   data:
 *                     _id: "68ff5fd9fa4eae1dc3cab7b6"
 *                     department: "transfer-investment-dept-1"
 *                     name: "新制剂项目"
 *                     projectType: "chinese-medicine-modernization"
 *                     status: "hospital-preparation"
 *                     transformRequirements:
 *                       - type: "investment"
 *                         currentProgress: "入库"
 *                     createTime: "2025-10-11T10:30:00.000Z"
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing-field:
 *                 summary: 缺少必填字段
 *                 value:
 *                   success: false
 *                   error: "缺少必填字段：项目名称、项目类型、来源"
 *               validation-error:
 *                 summary: 数据验证失败
 *                 value:
 *                   success: false
 *                   error: "数据验证失败: 转化需求列表不能为空"
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

import { NextApiResponse } from 'next'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import UnifiedProject from '@/models/UnifiedProject'
import Attachment from '@/models/Attachment'
import { IUnifiedProject } from '@/models/UnifiedProject'
import { ApiResponse, PaginatedResponse } from '@/types'
import { 
  validateProjectData, 
  buildSearchQuery, 
  isChineseMedicineModernization,
  getRequiredFieldsForType 
} from '@/utils/projectHelpers'

/* ------------------------------------------------------------------------------------------ */

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<IUnifiedProject> | IUnifiedProject>>
) {
  await connectDB()

  // 获取项目列表
  if (req.method === 'GET') {
    return handleGetProjects(req, res as NextApiResponse<ApiResponse<PaginatedResponse<IUnifiedProject>>>)
  }
  
  // 创建新项目
  if (req.method === 'POST') {
    return handleCreateProject(req, res as NextApiResponse<ApiResponse<IUnifiedProject>>)
  }
  
  return res.status(405).json({
    success: false,
    error: `方法 ${req.method} 不被允许`
  })
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

    // 验证转化需求列表（必填）
    if (!projectData.transformRequirements || projectData.transformRequirements.length === 0) {
      return res.status(400).json({
        success: false,
        error: '转化需求列表为必填项，至少需要一个转化需求'
      })
    }

    // 根据项目类型验证特有字段
    const requiredFields = getRequiredFieldsForType(projectData.projectType)
    const missingFields = requiredFields.filter((field: string) => !projectData[field])
    
    if (missingFields.length > 0) {
      const projectTypeName = isChineseMedicineModernization(projectData.projectType) ? '中药现代化' : '该类型项目'
      return res.status(400).json({
        success: false,
        error: `缺少${projectTypeName}必填字段: ${missingFields.join(', ')}`
      })
    }

    // 完整数据验证
    const validation = validateProjectData(projectData)
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: `数据验证失败: ${validation.errors.join(', ')}`
      })
    }

    // 中药现代化特殊验证：备案号唯一性
    if (isChineseMedicineModernization(projectData.projectType) && projectData.recordNumber) {
      const existingProject = await UnifiedProject.findOne({
        projectType: 'chinese-medicine-modernization',
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
      createdBy: req.user.userId,
      createTime: new Date(),
      updateTime: new Date()
    }

    // 保存到数据库（Schema会自动验证必填字段）
    const newProject = new UnifiedProject(newProjectData)
    const savedProject = await newProject.save()

    // 返回完整的项目信息
    const populatedProject = await UnifiedProject.findById(savedProject._id)
      .populate('createdBy', 'name email')
      .populate('attachments')
      .lean()

    const projectTypeName = isChineseMedicineModernization(projectData.projectType) ? '中药现代化' : '项目'
    return res.status(201).json({
      success: true,
      data: populatedProject as IUnifiedProject,
      message: `${projectTypeName}创建成功`
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
