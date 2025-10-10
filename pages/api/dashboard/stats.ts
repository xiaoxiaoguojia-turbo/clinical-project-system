import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '@/lib/mongodb'
import UnifiedProject from '@/models/UnifiedProject'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import { 
  DashboardStats, 
  ProjectOverviewStats, 
  StatItem,
  DEPARTMENT_LABELS,
  PROJECT_TYPE_LABELS,
  IMPORTANCE_LABELS,
  STATUS_LABELS,
  TRANSFORM_REQUIREMENT_LABELS,
  TRANSFORM_PROGRESS_LABELS
} from '@/types/dashboard'

/* ------------------------------------------------------------------------------------------ */

async function handleDashboardStats(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: '方法不被允许'
    })
  }

  try {
    // 连接数据库
    await connectDB()

    // 获取筛选参数
    const { projectTypes, departments } = req.query

    // 构建查询条件
    const matchConditions: any = {}
    
    // 项目类型筛选
    if (projectTypes && typeof projectTypes === 'string') {
      matchConditions.projectType = { $in: projectTypes.split(',') }
    }

    // 部门筛选
    if (departments && typeof departments === 'string') {
      matchConditions.department = { $in: departments.split(',') }
    }

    // 聚合管道获取完整统计
    const statsResults = await UnifiedProject.aggregate([
      { $match: matchConditions },
      {
        $facet: {
          // 总数统计
          totalCount: [{ $count: 'count' }],
          
          // 院内制剂数量
          internalPreparationCount: [
            { $match: { projectType: 'internal-preparation' } },
            { $count: 'count' }
          ],
          
          // 签约完成数量
          contractCompletedCount: [
            { $match: { transformProgress: 'contract-completed' } },
            { $count: 'count' }
          ],
          
          // 签约未完成数量
          contractIncompleteCount: [
            { $match: { transformProgress: 'contract-incomplete' } },
            { $count: 'count' }
          ],
          
          // 按项目类型分组
          byProjectType: [
            { $group: { _id: '$projectType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          // 按部门分组
          byDepartment: [
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          // 按重要程度分组
          byImportance: [
            { $group: { _id: '$importance', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          // 按项目状态分组
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          // 按医院来源分组
          bySource: [
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          // 按适应症/科室分组（过滤空值）
          byIndication: [
            { $match: { indication: { $exists: true, $ne: null, $ne: '' } } },
            { $group: { _id: '$indication', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          // 按转化需求分组（过滤空值）
          byTransformRequirement: [
            { $match: { transformRequirement: { $exists: true, $ne: null, $ne: '' } } },
            { $group: { _id: '$transformRequirement', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          // 按转化推进状态分组（过滤空值）
          byTransformProgress: [
            { $match: { transformProgress: { $exists: true, $ne: null, $ne: '' } } },
            { $group: { _id: '$transformProgress', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ]
        }
      }
    ])

    const stats = statsResults[0]
    const totalProjects = stats.totalCount[0]?.count || 0
    const internalPreparationCount = stats.internalPreparationCount[0]?.count || 0
    const contractCompletedCount = stats.contractCompletedCount[0]?.count || 0
    const contractIncompleteCount = stats.contractIncompleteCount[0]?.count || 0

    // 构建响应数据
    const overview: ProjectOverviewStats = {
      totalProjects,
      internalPreparationCount,
      contractCompletedCount,
      contractIncompleteCount,
      byProjectType: formatStatItems(stats.byProjectType, PROJECT_TYPE_LABELS, totalProjects),
      byDepartment: formatStatItems(stats.byDepartment, DEPARTMENT_LABELS, totalProjects),
      byImportance: formatStatItems(stats.byImportance, IMPORTANCE_LABELS, totalProjects),
      byStatus: formatStatItems(stats.byStatus, STATUS_LABELS, totalProjects),
      bySource: formatStatItems(stats.bySource, {}, totalProjects),
      byIndication: formatStatItems(stats.byIndication, {}, totalProjects),
      byTransformRequirement: formatStatItems(stats.byTransformRequirement, TRANSFORM_REQUIREMENT_LABELS, totalProjects),
      byTransformProgress: formatStatItems(stats.byTransformProgress, TRANSFORM_PROGRESS_LABELS, totalProjects)
    }

    const dashboardStats: DashboardStats = {
      overview,
      lastUpdated: new Date().toISOString()
    }

    res.status(200).json({
      success: true,
      data: dashboardStats
    })

  } catch (error) {
    console.error('Dashboard统计API错误:', error)
    res.status(500).json({
      success: false,
      error: '获取统计数据失败'
    })
  }
}

// 使用认证中间件包装处理函数
export default authMiddleware(handleDashboardStats)

/* ------------------------------------------------------------------------------------------ */

// 格式化统计项数据
function formatStatItems(
  aggregateResults: Array<{_id: string, count: number}>, 
  labelMap: Record<string, string>,
  total: number
): StatItem[] {
  return aggregateResults.map(item => ({
    label: labelMap[item._id] || item._id || '未分类',
    value: item.count,
    percentage: total > 0 ? Math.round((item.count / total) * 100 * 10) / 10 : 0
  }))
}

/* ------------------------------------------------------------------------------------------ */
