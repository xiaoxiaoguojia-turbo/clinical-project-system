import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '@/lib/mongodb'
import UnifiedProject from '@/models/UnifiedProject'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import { 
  DashboardStats, 
  ProjectOverviewStats, 
  OtherProjectsStats, 
  TrendStats,
  StatItem,
  DEPARTMENT_LABELS,
  PROJECT_TYPE_LABELS,
  IMPORTANCE_LABELS,
  STATUS_LABELS,
  TRANSFORM_REQUIREMENT_LABELS
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
    const { timeRange = 'all', projectTypes, departments } = req.query

    // 构建查询条件
    const matchConditions: any = {}
    
    // 时间范围筛选
    if (timeRange !== 'all') {
      const now = new Date()
      let startDate: Date = new Date(now.getFullYear(), 0, 1) // 默认值：今年开始

      switch (timeRange) {
        case 'thisYear':
          startDate = new Date(now.getFullYear(), 0, 1)
          matchConditions.createTime = { $gte: startDate }
          break
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          matchConditions.createTime = { $gte: startDate }
          break
        case 'lastMonth':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
          matchConditions.createTime = { $gte: lastMonth, $lte: lastMonthEnd }
          break
        default:
          startDate = new Date(now.getFullYear(), 0, 1)
          matchConditions.createTime = { $gte: startDate }
      }
    }

    // 项目类型筛选
    if (projectTypes && typeof projectTypes === 'string') {
      matchConditions.projectType = { $in: projectTypes.split(',') }
    }

    // 部门筛选
    if (departments && typeof departments === 'string') {
      matchConditions.department = { $in: departments.split(',') }
    }

    // 聚合管道获取基础统计
    const basicStatsResults = await UnifiedProject.aggregate([
      { $match: matchConditions },
      {
        $facet: {
          totalCount: [{ $count: 'count' }],
          byProjectType: [
            { $group: { _id: '$projectType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          byDepartment: [
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          byImportance: [
            { $group: { _id: '$importance', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          bySource: [
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ]
        }
      }
    ])

    const basicStats = basicStatsResults[0]
    const totalProjects = basicStats.totalCount[0]?.count || 0

    // 获取其他项目（非院内制剂）的统计
    const otherProjectsConditions = { 
      ...matchConditions, 
      projectType: { $ne: 'internal-preparation' } 
    }

    const otherProjectsResults = await UnifiedProject.aggregate([
      { $match: otherProjectsConditions },
      {
        $facet: {
          totalCount: [{ $count: 'count' }],
          byTransformRequirement: [
            { $group: { _id: '$transformRequirement', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          byIndication: [
            { $group: { _id: '$indication', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          followUpWeeks: [
            {
              $group: {
                _id: null,
                avgFollowUpWeeks: { $avg: '$followUpWeeks' },
                totalFollowUpWeeks: { $sum: '$followUpWeeks' }
              }
            }
          ]
        }
      }
    ])

    const otherProjectsStats = otherProjectsResults[0]
    const totalOtherProjects = otherProjectsStats.totalCount[0]?.count || 0
    const avgFollowUpWeeks = otherProjectsStats.followUpWeeks[0]?.avgFollowUpWeeks || 0

    // 获取趋势统计（最近12个月）
    const trendsConditions = { ...matchConditions }
    delete trendsConditions.createTime // 移除时间限制，获取趋势数据

    const trendsResults = await UnifiedProject.aggregate([
      { $match: trendsConditions },
      {
        $group: {
          _id: {
            year: { $year: '$createTime' },
            month: { $month: '$createTime' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ])

    // 计算增长率（简化计算）
    const currentYearProjects = await UnifiedProject.countDocuments({
      ...trendsConditions,
      createTime: { 
        $gte: new Date(new Date().getFullYear(), 0, 1),
        $lt: new Date(new Date().getFullYear() + 1, 0, 1)
      }
    })

    const lastYearProjects = await UnifiedProject.countDocuments({
      ...trendsConditions,
      createTime: { 
        $gte: new Date(new Date().getFullYear() - 1, 0, 1),
        $lt: new Date(new Date().getFullYear(), 0, 1)
      }
    })

    const totalGrowth = lastYearProjects > 0 
      ? Math.round(((currentYearProjects - lastYearProjects) / lastYearProjects) * 100)
      : 0

    // 构建响应数据
    const overview: ProjectOverviewStats = {
      totalProjects,
      byProjectType: formatStatItems(basicStats.byProjectType, PROJECT_TYPE_LABELS, totalProjects),
      byDepartment: formatStatItems(basicStats.byDepartment, DEPARTMENT_LABELS, totalProjects),
      byImportance: formatStatItems(basicStats.byImportance, IMPORTANCE_LABELS, totalProjects),
      byStatus: formatStatItems(basicStats.byStatus, STATUS_LABELS, totalProjects),
      bySource: formatStatItems(basicStats.bySource, {}, totalProjects)
    }

    const otherProjects: OtherProjectsStats = {
      totalOtherProjects,
      byTransformRequirement: formatStatItems(
        otherProjectsStats.byTransformRequirement, 
        TRANSFORM_REQUIREMENT_LABELS, 
        totalOtherProjects
      ),
      byIndication: formatStatItems(otherProjectsStats.byIndication, {}, totalOtherProjects),
      averageFollowUpWeeks: Math.round(avgFollowUpWeeks * 10) / 10
    }

    const trends: TrendStats = {
      monthly: trendsResults.map(item => ({
        period: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        count: item.count
      })),
      growth: {
        totalGrowth,
        monthlyGrowth: 0 // 可根据需要计算月度增长率
      }
    }

    const dashboardStats: DashboardStats = {
      overview,
      otherProjects,
      trends,
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
  return aggregateResults
    .filter(item => item._id) // 过滤空值
    .map(item => ({
      label: labelMap[item._id] || item._id || '未知',
      value: item.count,
      percentage: total > 0 ? Math.round((item.count / total) * 100 * 10) / 10 : 0
    }))
}
