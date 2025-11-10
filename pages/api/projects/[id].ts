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
 *               chinese_medicine:
 *                 summary: 中药现代化项目详情
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "68ff5fd9fa4eae1dc3cab7b5"
 *                     department: "transfer-investment-dept-1"
 *                     name: "蒲莲清解颗粒"
 *                     projectType: "chinese-medicine-modernization"
 *                     source: "上海市皮肤病医院"
 *                     importance: "very-important"
 *                     status: "hospital-preparation"
 *                     leader: "yangfeng"
 *                     indication: "皮肤科"
 *                     transformRequirements:
 *                       - type: "license-transfer"
 *                         currentProgress: "潜在待推进"
 *                     dockingCompany: "XX医药公司"
 *                     hospitalDoctor: "李医生"
 *                     patent: "专利已授权"
 *                     clinicalData: "临床数据完整"
 *                     transformAmount: 500
 *                     conclusion: "项目进展顺利"
 *                     composition: "蒲公英，穿心莲，野菊花，连翘，马齿苋"
 *                     function: "清热解毒、消痈散结"
 *                     specification: "颗粒剂，每袋装20g"
 *                     duration: "30"
 *                     recordNumber: "沪药制备字Z20190019000"
 *                     attachments: []
 *                     createTime: "2025-10-01T08:00:00.000Z"
 *                     updateTime: "2025-10-10T15:30:00.000Z"
 *                     createdBy: "张三"
 *                     aiReport:
 *                       reportUrl: "https://example.com/report.pdf"
 *                       status: "completed"
 *                       firstGeneratedAt: "2025-10-01T08:30:00.000Z"
 *                       lastGeneratedAt: "2025-10-05T14:20:00.000Z"
 *                   message: "获取项目详情成功"
 *               drug_research:
 *                 summary: 药物研发项目详情
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "68ff5fd9fa4eae1dc3cab7b6"
 *                     department: "transfer-investment-dept-2"
 *                     name: "新型抗肿瘤药物研发"
 *                     projectType: "drug"
 *                     source: "某医院科研处"
 *                     importance: "important"
 *                     status: "clinical-stage"
 *                     leader: "qinqingsong"
 *                     startDate: "2025-01-15T00:00:00.000Z"
 *                     indication: "肿瘤科"
 *                     transformRequirements:
 *                       - type: "investment"
 *                         currentProgress: "立项"
 *                     hospitalDoctor: "李教授"
 *                     patent: "已申请PCT国际专利"
 *                     clinicalData: "已完成II期临床试验"
 *                     transformAmount: 2000
 *                     conclusion: "项目进展顺利"
 *                     attachments: []
 *                     createTime: "2025-02-01T10:00:00.000Z"
 *                     updateTime: "2025-02-01T10:00:00.000Z"
 *                     createdBy: "李四"
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
 *       - 中药现代化的备案号必须唯一
 *       - Schema会自动验证必填字段
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department:
 *                 type: string
 *                 enum: [transfer-investment-dept-1, transfer-investment-dept-2, transfer-investment-dept-3]
 *                 description: 归属部门
 *               name:
 *                 type: string
 *                 description: 项目名称
 *               source:
 *                 type: string
 *                 description: 医院来源
 *               importance:
 *                 type: string
 *                 enum: [very-important, important, normal]
 *                 description: 重要程度
 *               status:
 *                 type: string
 *                 description: 项目进展状态（根据projectType不同）
 *               leader:
 *                 type: string
 *                 enum: [yangfeng, qinqingsong, haojingjing, chenlong, wangliyan, maoshiwei, xiaolanchuan, to-be-determined]
 *                 description: 负责人
 *               transformRequirements:
 *                 type: array
 *                 description: 转化需求列表
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [investment, company-operation, license-transfer, pending]
 *                     currentProgress:
 *                       type: string
 *               indication:
 *                 type: string
 *                 description: 适应症/科室
 *               dockingCompany:
 *                 type: string
 *                 description: 对接企业
 *               hospitalDoctor:
 *                 type: string
 *                 description: 院端医生
 *               patent:
 *                 type: string
 *                 description: 专利信息
 *               clinicalData:
 *                 type: string
 *                 description: 临床数据
 *               transformAmount:
 *                 type: number
 *                 description: 转化金额（万元）
 *               conclusion:
 *                 type: string
 *                 description: 项目结论
 *               composition:
 *                 type: string
 *                 description: 组方（中药现代化必填）
 *               function:
 *                 type: string
 *                 description: 功能（中药现代化必填）
 *               specification:
 *                 type: string
 *                 description: 制剂规格
 *               duration:
 *                 type: string
 *                 description: 使用年限
 *               recordNumber:
 *                 type: string
 *                 description: 备案号
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: 开始日期（其他类型必填）
 *           examples:
 *             update_status:
 *               summary: 更新项目状态
 *               value:
 *                 status: "clinical-stage"
 *                 transformRequirements:
 *                   - type: "investment"
 *                     currentProgress: "投决"
 *                 clinicalData: "II期临床试验入组患者300例"
 *                 transformAmount: 800
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
 *         description: 请求参数错误
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
 *     description: 删除指定ID的项目（软删除或硬删除）
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
 *         description: 删除项目成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               success:
 *                 summary: 删除成功
 *                 value:
 *                   success: true
 *                   message: "项目删除成功"
 *       400:
 *         description: 项目ID格式无效
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
import { IUnifiedProject } from '@/models/UnifiedProject'
import { ApiResponse } from '@/types'
import { 
  isChineseMedicineModernization, 
  getRequiredFieldsForType,
  validateProjectData
} from '@/utils/projectHelpers'

/* ------------------------------------------------------------------------------------------ */

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<IUnifiedProject | null>>
) {
  await connectDB()

  const { id } = req.query

  // 验证项目ID格式
  if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: '无效的项目ID格式'
    })
  }

  // 根据请求方法调用对应的处理函数
  switch (req.method) {
    case 'GET':
      return handleGetProject(req, res as NextApiResponse<ApiResponse<IUnifiedProject>>, id)
    case 'PUT':
      return handleUpdateProject(req, res as NextApiResponse<ApiResponse<IUnifiedProject>>, id)
    case 'DELETE':
      return handleDeleteProject(req, res as NextApiResponse<ApiResponse<null>>, id)
    default:
      return res.status(405).json({
        success: false,
        error: `方法 ${req.method} 不被允许`
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

    return res.status(200).json({
      success: true,
      data: project as IUnifiedProject,
      message: '获取项目详情成功'
    })

  } catch (error: any) {
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
    if (updateData.projectType && updateData.projectType !== (existingProject as any).projectType) {
      return res.status(400).json({
        success: false,
        error: '不允许修改项目类型'
      })
    }

    // 根据现有项目类型验证更新数据
    const projectType = (existingProject as any).projectType

    // 如果更新了关键字段，验证必填字段完整性
    const requiredFields = getRequiredFieldsForType(projectType)
    const hasRequiredFieldUpdates = requiredFields.some((field: string) => updateData.hasOwnProperty(field))
    
    if (hasRequiredFieldUpdates) {
      // 合并现有数据和更新数据进行验证
      const mergedData = { ...existingProject.toObject(), ...updateData }
      const missingFields = requiredFields.filter((field: string) => !mergedData[field])
      
      if (missingFields.length > 0) {
        const projectTypeName = isChineseMedicineModernization(projectType) ? '中药现代化' : '该类型项目'
        return res.status(400).json({
          success: false,
          error: `缺少${projectTypeName}必填字段: ${missingFields.join(', ')}`
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

    // 中药现代化特殊验证：备案号唯一性
    if (isChineseMedicineModernization(projectType) && updateData.recordNumber) {
      const existingWithSameRecord = await UnifiedProject.findOne({
        _id: { $ne: id },
        projectType: 'chinese-medicine-modernization',
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

    // 执行更新（Schema会自动验证必填字段）
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

    const projectTypeName = isChineseMedicineModernization(projectType) 
      ? '中药现代化项目' 
      : '项目'

    return res.status(200).json({
      success: true,
      data: updatedProject as IUnifiedProject,
      message: `${projectTypeName}更新成功`
    })

  } catch (error: any) {
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
      error: error instanceof Error ? error.message : '未知错误'
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
    const deletedProject = await UnifiedProject.findByIdAndDelete(id)

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        error: '项目不存在'
      })
    }

    return res.status(200).json({
      success: true,
      data: null,
      message: '项目删除成功'
    })

  } catch (error: any) {
    console.error('删除项目失败:', error)
    return res.status(500).json({
      success: false,
      error: '删除项目失败'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

export default authMiddleware(handler)
