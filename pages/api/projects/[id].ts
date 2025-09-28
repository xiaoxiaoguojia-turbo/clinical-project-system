/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     tags:
 *       - 统一项目管理
 *     summary: 获取项目详情
 *     description: |
 *       根据项目ID获取项目的详细信息，支持所有项目类型
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
 *         description: 获取项目详情成功
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
 *               internal_preparation:
 *                 summary: 院内制剂项目详情
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "64f123456789abcd12345678"
 *                     department: "transfer-investment-dept-1"
 *                     name: "清热解毒颗粒"
 *                     projectType: "internal-preparation"
 *                     source: "中医科"
 *                     importance: "very-important"
 *                     status: "early-stage"
 *                     composition: "金银花15g、连翘12g、板蓝根10g"
 *                     function: "清热解毒，抗病毒感染"
 *                     specification: "10g/袋"
 *                     duration: "3年"
 *                     dosage: "每次1袋，每日3次"
 *                     recordNumber: "ZZ-2024-001"
 *                     patent: "已申请发明专利"
 *                     createTime: "2024-01-15T08:30:00.000Z"
 *                     updateTime: "2024-01-15T08:30:00.000Z"
 *                     aiReport:
 *                       reportUrl: "https://example.com/report.pdf"
 *                       status: "completed"
 *                       firstGeneratedAt: "2024-01-15T08:30:00.000Z"
 *                       lastGeneratedAt: "2024-01-15T08:30:00.000Z"
 *                   message: "获取项目详情成功"
 *               drug_research:
 *                 summary: 药物研发项目详情
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "64f123456789abcd12345679"
 *                     department: "transfer-investment-dept-1"
 *                     name: "新型抗肿瘤药物研发"
 *                     projectType: "drug"
 *                     source: "科研处"
 *                     importance: "important"
 *                     status: "clinical-stage"
 *                     leader: "张医生"
 *                     startDate: "2024-01-15"
 *                     indication: "肿瘤科"
 *                     followUpWeeks: 24
 *                     transformRequirement: "license-transfer"
 *                     hospitalDoctor: "李教授"
 *                     createTime: "2024-02-01T10:00:00.000Z"
 *                   message: "获取项目详情成功"
 *       400:
 *         description: 项目ID格式无效
 *       404:
 *         description: 项目不存在
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 *   put:
 *     tags:
 *       - 统一项目管理
 *     summary: 更新项目信息
 *     description: |
 *       更新指定ID的项目信息，支持所有项目类型
 *       
 *       **注意事项：**
 *       - 不能修改项目类型(projectType)
 *       - 院内制剂的备案号必须唯一
 *       - 根据项目类型验证必填字段
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department:
 *                 type: string
 *                 enum: [transfer-investment-dept-1, transfer-investment-dept-2, innovation-center, ip-dept]
 *                 description: 部门名称
 *               name:
 *                 type: string
 *                 description: 项目名称
 *               source:
 *                 type: string
 *                 description: 项目来源
 *               importance:
 *                 type: string
 *                 enum: [very-important, important, normal, unimportant]
 *                 description: 重要程度
 *               status:
 *                 type: string
 *                 enum: [early-stage, preclinical, clinical-stage, market-product]
 *                 description: 项目状态
 *               # 院内制剂特有字段
 *               composition:
 *                 type: string
 *                 description: 组方成分（院内制剂）
 *               function:
 *                 type: string
 *                 description: 功能主治（院内制剂）
 *               specification:
 *                 type: string
 *                 description: 规格（院内制剂）
 *               duration:
 *                 type: string
 *                 description: 有效期（院内制剂）
 *               dosage:
 *                 type: string
 *                 description: 用法用量（院内制剂）
 *               recordNumber:
 *                 type: string
 *                 description: 备案号（院内制剂）
 *               remarks:
 *                 type: string
 *                 description: 备注信息（院内制剂）
 *               # 其他类型特有字段
 *               leader:
 *                 type: string
 *                 description: 项目负责人（其他类型）
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: 开始日期（其他类型）
 *               indication:
 *                 type: string
 *                 description: 适应症/科室（其他类型）
 *               followUpWeeks:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 104
 *                 description: 跟进时间周数（其他类型）
 *               transformRequirement:
 *                 type: string
 *                 enum: [license-transfer, equity-investment, agent-holding, custodial-management, corporate-operation, license-transfer-cash, to-be-determined]
 *                 description: 转化需求（其他类型）
 *               hospitalDoctor:
 *                 type: string
 *                 description: 院端医生（其他类型）
 *               conclusion:
 *                 type: string
 *                 description: 项目结论（其他类型）
 *               # 通用字段
 *               patent:
 *                 type: string
 *                 description: 专利信息
 *           examples:
 *             update_internal_preparation:
 *               summary: 更新院内制剂项目
 *               value:
 *                 name: "清热解毒颗粒（改良版）"
 *                 composition: "金银花15g、连翘12g、板蓝根10g、薄荷3g"
 *                 function: "清热解毒，抗病毒感染，清咽利喉"
 *                 specification: "12g/袋"
 *                 remarks: "临床试验完成，准备申请上市许可"
 *                 status: "clinical-stage"
 *             update_drug_research:
 *               summary: 更新药物研发项目
 *               value:
 *                 name: "新型抗肿瘤药物研发（二期）"
 *                 leader: "王医生"
 *                 followUpWeeks: 36
 *                 transformRequirement: "corporate-operation"
 *                 conclusion: "二期临床试验结果良好"
 *                 status: "clinical-stage"
 *     responses:
 *       200:
 *         description: 更新项目成功
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
 *         description: 请求参数错误或项目ID格式错误
 *       404:
 *         description: 项目不存在
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 *   delete:
 *     tags:
 *       - 统一项目管理
 *     summary: 删除项目
 *     description: |
 *       删除指定ID的项目（软删除）
 *       
 *       **注意事项：**
 *       - 实施软删除，项目数据保留但标记为已删除
 *       - 删除操作不可恢复，请谨慎操作
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
 *         description: 删除项目成功
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
 *                   example: "项目删除成功"
 *       400:
 *         description: 项目ID格式错误
 *       404:
 *         description: 项目不存在
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 */

import { NextApiResponse } from 'next'
import mongoose from 'mongoose'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import connectDB from '@/lib/mongodb'
import UnifiedProject from '@/models/UnifiedProject'
import Attachment from '@/models/Attachment'
import User from '@/models/User'
import { ApiResponse, UnifiedProject as IUnifiedProject } from '@/types'
import { 
  isInternalPreparationType, 
  getRequiredFieldsForType,
  validateProjectData 
} from '@/utils/projectHelpers'

/* ------------------------------------------------------------------------------------------ */

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<IUnifiedProject | null>>
) {
  try {
    await connectDB()
    
    // 确保所有相关模型都被注册
    const ensureModels = [UnifiedProject, Attachment, User]
    ensureModels.forEach(model => model.modelName)

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

    if (req.method === 'GET') {
      return await handleGetProject(req, res, id)
    } else if (req.method === 'PUT') {
      return await handleUpdateProject(req, res, id)
    } else if (req.method === 'DELETE') {
      return await handleDeleteProject(req, res, id)
    } else {
      return res.status(405).json({
        success: false,
        error: '不支持的请求方法'
      })
    }
  } catch (error) {
    console.error('统一项目管理API错误:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

async function handleGetProject(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<IUnifiedProject>>,
  id: string
) {
  try {
    const project = await UnifiedProject.findById(id)
      .populate('createdBy', 'name email')
      .populate('attachments')
      .lean()

    if (!project) {
      return res.status(404).json({
        success: false,
        error: '项目不存在'
      })
    }

    const projectTypeName = isInternalPreparationType(project.projectType) 
      ? '院内制剂项目' 
      : '项目'

    return res.status(200).json({
      success: true,
      data: project as IUnifiedProject,
      message: `获取${projectTypeName}详情成功`
    })

  } catch (error) {
    console.error('获取项目详情失败:', error)
    return res.status(500).json({
      success: false,
      error: '获取项目详情失败'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

async function handleUpdateProject(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<IUnifiedProject>>,
  id: string
) {
  const updateData = req.body

  try {
    // 查找现有项目
    const existingProject = await UnifiedProject.findById(id)
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        error: '项目不存在'
      })
    }

    // 防止修改项目类型
    if (updateData.projectType && updateData.projectType !== existingProject.projectType) {
      return res.status(400).json({
        success: false,
        error: '不允许修改项目类型'
      })
    }

    // 根据现有项目类型验证更新数据
    const projectType = existingProject.projectType
    
    // 如果更新了关键字段，验证必填字段完整性
    const requiredFields = getRequiredFieldsForType(projectType)
    const hasRequiredFieldUpdates = requiredFields.some(field => updateData.hasOwnProperty(field))
    
    if (hasRequiredFieldUpdates) {
      // 合并现有数据和更新数据进行验证
      const mergedData = { ...existingProject.toObject(), ...updateData }
      const missingFields = requiredFields.filter(field => !mergedData[field])
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `缺少${isInternalPreparationType(projectType) ? '院内制剂' : '项目'}必填字段: ${missingFields.join(', ')}`
        })
      }

      // 数据验证
      const validation = validateProjectData(mergedData)
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: `数据验证失败: ${validation.errors.join(', ')}`
        })
      }
    }

    // 院内制剂特殊验证：备案号唯一性
    if (projectType === 'internal-preparation' && updateData.recordNumber) {
      const existingWithSameRecord = await UnifiedProject.findOne({
        _id: { $ne: id },
        projectType: 'internal-preparation',
        recordNumber: updateData.recordNumber
      })

      if (existingWithSameRecord) {
        return res.status(400).json({
          success: false,
          error: `备案号 "${updateData.recordNumber}" 已存在`
        })
      }
    }

    // 准备更新数据
    const updatePayload = {
      ...updateData,
      updateTime: new Date()
    }

    // 执行更新
    const updatedProject = await UnifiedProject.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('attachments')
      .lean()

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        error: '项目不存在'
      })
    }

    const projectTypeName = isInternalPreparationType(projectType) 
      ? '院内制剂项目' 
      : '项目'

    return res.status(200).json({
      success: true,
      data: updatedProject as IUnifiedProject,
      message: `${projectTypeName}更新成功`
    })

  } catch (error) {
    console.error('更新项目失败:', error)
    
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
      error: '更新项目失败'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

async function handleDeleteProject(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<null>>,
  id: string
) {
  try {
    // 查找项目
    const project = await UnifiedProject.findById(id)
    if (!project) {
      return res.status(404).json({
        success: false,
        error: '项目不存在'
      })
    }

    const projectTypeName = isInternalPreparationType(project.projectType) 
      ? '院内制剂项目' 
      : '项目'

    // 软删除：标记为已删除而不是物理删除
    await UnifiedProject.findByIdAndUpdate(id, {
      deletedAt: new Date(),
      updateTime: new Date()
    })

    // 也可以选择硬删除（根据业务需求）
    // await UnifiedProject.findByIdAndDelete(id)

    return res.status(200).json({
      success: true,
      data: null,
      message: `${projectTypeName}删除成功`
    })

  } catch (error) {
    console.error('删除项目失败:', error)
    return res.status(500).json({
      success: false,
      error: '删除项目失败'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

export default authMiddleware(handler)
