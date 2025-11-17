import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '@/lib/mongodb'
import UnifiedProject from '@/models/UnifiedProject'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import { 
  DashboardStats, 
  ProjectOverviewStats, 
  StatItem,
  DEPARTMENT_LABELS,
  PROJECT_TYPE_LABELS
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
    const { transformRequirementTypes, departments, sources } = req.query

    // 构建查询条件
    const matchConditions: any = {}
    
    // 转化需求类型筛选（查询transformRequirements数组）
    if (transformRequirementTypes && typeof transformRequirementTypes === 'string') {
      const types = transformRequirementTypes.split(',')
      matchConditions['transformRequirements.type'] = { $in: types }
    }

    // 部门筛选
    if (departments && typeof departments === 'string') {
      matchConditions.department = { $in: departments.split(',') }
    }

    // 医院来源筛选
    if (sources && typeof sources === 'string') {
      matchConditions.source = { $in: sources.split(',') }
    }

    // 聚合管道获取完整统计
    const statsResults = await UnifiedProject.aggregate([
      { $match: matchConditions },
      {
        $facet: {
          // 总数统计
          totalCount: [{ $count: 'count' }],
          
          // 转化需求为投资的项目数量
          investmentCount: [
            { $match: { 'transformRequirements.type': 'investment' } },
            { $count: 'count' }
          ],
          
          // 转化需求为公司化运营的项目数量
          companyOperationCount: [
            { $match: { 'transformRequirements.type': 'company-operation' } },
            { $count: 'count' }
          ],
          
          // 转化需求为许可转让的项目数量
          licenseTransferCount: [
            { $match: { 'transformRequirements.type': 'license-transfer' } },
            { $count: 'count' }
          ],
          
          // 转化需求为待推进的项目数量
          pendingCount: [
            { $match: { 'transformRequirements.type': 'pending' } },
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
          
          // 按医院来源分组
          bySource: [
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          // 转化金额统计
          transformAmountStats: [
            { $match: { transformAmount: { $exists: true, $ne: null, $gt: 0 } } },
            {
              $group: {
                _id: null,
                total: { $sum: '$transformAmount' },
                average: { $avg: '$transformAmount' },
                count: { $sum: 1 }
              }
            }
          ],
          
          // 转化金额分布（按区间）
          transformAmountDistribution: [
            { $match: { transformAmount: { $exists: true, $ne: null, $gt: 0 } } },
            {
              $bucket: {
                groupBy: '$transformAmount',
                boundaries: [0, 100, 500, 1000, 100000],
                default: 'other',
                output: {
                  count: { $sum: 1 }
                }
              }
            }
          ],
          
          // 转化需求进度分布（用于单一类型筛选时展示）
          byTransformProgress: [
            { $unwind: '$transformRequirements' },
            {
              $group: {
                _id: {
                  type: '$transformRequirements.type',
                  progress: '$transformRequirements.currentProgress'
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.type': 1, count: -1 } }
          ]
        }
      }
    ])

    const stats = statsResults[0]
    const totalProjects = stats.totalCount[0]?.count || 0
    const investmentCount = stats.investmentCount[0]?.count || 0
    const companyOperationCount = stats.companyOperationCount[0]?.count || 0
    const licenseTransferCount = stats.licenseTransferCount[0]?.count || 0
    const pendingCount = stats.pendingCount[0]?.count || 0
    
    // 转化金额统计
    const transformAmountStats = stats.transformAmountStats[0] || { total: 0, average: 0, count: 0 }
    const totalTransformAmount = Math.round(transformAmountStats.total || 0)
    const averageTransformAmount = Math.round(transformAmountStats.average || 0)
    
    // 格式化转化金额分布
    const transformAmountDistribution: StatItem[] = (stats.transformAmountDistribution || []).map((item: any) => {
      let label = ''
      if (item._id === 0) label = '0-100万'
      else if (item._id === 100) label = '100-500万'
      else if (item._id === 500) label = '500-1000万'
      else if (item._id === 1000) label = '1000万以上'
      else label = '其他'
      
      return {
        label,
        value: item.count,
        percentage: totalProjects > 0 ? Math.round((item.count / totalProjects) * 100) : 0
      }
    })
    
    // 处理转化需求进度分布（仅当单选转化需求类型时）
    let byTransformProgress: StatItem[] | undefined = undefined
    const selectedTypes = transformRequirementTypes && typeof transformRequirementTypes === 'string' 
      ? transformRequirementTypes.split(',') 
      : []
    
    // 只有当选择了单一转化需求类型时，才返回进度分布
    if (selectedTypes.length === 1) {
      const selectedType = selectedTypes[0]
      const progressData = (stats.byTransformProgress || [])
        .filter((item: any) => item._id.type === selectedType)
        .map((item: any) => ({
          label: item._id.progress || '未分类',
          value: item.count,
          percentage: totalProjects > 0 ? Math.round((item.count / totalProjects) * 100 * 10) / 10 : 0
        }))
      
      if (progressData.length > 0) {
        byTransformProgress = progressData
      }
    }

    // 构建响应数据
    const overview: ProjectOverviewStats = {
      totalProjects,
      investmentCount,
      companyOperationCount,
      licenseTransferCount,
      pendingCount,
      byProjectType: formatStatItems(stats.byProjectType, PROJECT_TYPE_LABELS, totalProjects),
      byDepartment: formatStatItems(stats.byDepartment, DEPARTMENT_LABELS, totalProjects),
      bySource: formatStatItems(stats.bySource, {}, totalProjects),
      totalTransformAmount,
      averageTransformAmount,
      transformAmountDistribution,
      byTransformProgress  // 添加进度分布数据
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
