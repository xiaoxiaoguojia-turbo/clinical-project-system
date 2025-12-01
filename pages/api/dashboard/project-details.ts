import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '@/lib/mongodb'
import UnifiedProject from '@/models/UnifiedProject'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'

/* ------------------------------------------------------------------------------------------ */

// 项目详情接口
export interface ProjectDetail {
  _id: string
  name: string
  department: string
  source: string
  transformRequirements: Array<{
    type: string
    currentProgress: string
    mode?: string
  }>
  dockingCompany?: string
}

/* ------------------------------------------------------------------------------------------ */

async function handleProjectDetails(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: '方法不被允许'
    })
  }

  try {
    await connectDB()

    // 获取查询参数
    const { 
      chartType,        // 图表类型：department/projectType/source/transformAmount/transformProgress
      filterValue,      // 筛选值：如 transfer-investment-dept-1
      minAmount,        // 最小金额（用于转化金额筛选）
      maxAmount,        // 最大金额（用于转化金额筛选）
      progressNode,     // 进展节点（用于转化需求进度筛选）
      requirementType,  // 转化需求类型（用于转化需求进度筛选）
      departments,      // 全局部门筛选
      sources,          // 全局来源筛选
      transformRequirementTypes  // 全局转化需求类型筛选
    } = req.query

    // 构建基础查询条件
    const matchConditions: any = {}

    // 根据图表类型添加特定筛选
    if (chartType) {
      switch (chartType) {
        case 'department':
          if (filterValue) {
            matchConditions.department = filterValue
          }
          break
        case 'projectType':
          if (filterValue) {
            matchConditions.projectType = filterValue
          }
          break
        case 'source':
          if (filterValue) {
            matchConditions.source = filterValue
          }
          break
        case 'transformAmount':
          // 转化金额区间筛选
          if (minAmount !== undefined || maxAmount !== undefined) {
            // 构建金额查询条件（与stats.ts中的$bucket逻辑保持一致）
            const amountCondition: any = {
              $exists: true,
              $ne: null,
              $gt: 0  // 重要：只查询有效的转化金额（>0）
            }
            
            // 添加区间筛选
            if (minAmount !== undefined) {
              amountCondition.$gte = parseFloat(minAmount as string)
            }
            if (maxAmount !== undefined && maxAmount !== 'Infinity') {
              amountCondition.$lt = parseFloat(maxAmount as string)
            }
            
            matchConditions.transformAmount = amountCondition
          }
          break
        case 'transformProgress':
          // 转化需求进度筛选
          if (progressNode && requirementType) {
            matchConditions['transformRequirements'] = {
              $elemMatch: {
                type: requirementType,
                currentProgress: progressNode
              }
            }
          }
          break
      }
    }

    // 应用全局筛选条件
    if (departments && typeof departments === 'string') {
      const deptArray = departments.split(',')
      if (deptArray.length > 0) {
        matchConditions.department = { $in: deptArray }
      }
    }

    if (sources && typeof sources === 'string') {
      const sourceArray = sources.split(',')
      if (sourceArray.length > 0) {
        matchConditions.source = { $in: sourceArray }
      }
    }

    if (transformRequirementTypes && typeof transformRequirementTypes === 'string') {
      const types = transformRequirementTypes.split(',')
      if (types.length > 0) {
        matchConditions['transformRequirements.type'] = { $in: types }
      }
    }

    // 查询项目列表，只返回需要的字段
    const projects = await UnifiedProject.find(matchConditions)
      .select('name department source transformRequirements dockingCompany')
      .sort({ createTime: -1 })
      .limit(100)  // 限制返回数量
      .lean()

    return res.status(200).json({
      success: true,
      data: {
        total: projects.length,
        projects: projects
      }
    })

  } catch (error: any) {
    console.error('获取项目详情失败:', error)
    return res.status(500).json({
      success: false,
      error: error.message || '获取项目详情失败'
    })
  }
}

/* ------------------------------------------------------------------------------------------ */

export default authMiddleware(handleProjectDetails)