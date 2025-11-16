import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '@/lib/mongodb'
import UnifiedProject from '@/models/UnifiedProject'
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import {
  DEPARTMENT_LABELS
} from '@/types/dashboard'

/* ------------------------------------------------------------------------------------------ */

// 中药现代化项目统计接口
async function handleChineseMedicineStats(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: '方法不被允许'
    })
  }

  try {
    // 连接数据库
    await connectDB()

    // 查询中药现代化项目
    const matchConditions: any = {
      projectType: 'chinese-medicine-modernization'
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
          
          // 按项目进展状态分组
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          // 按重要程度分组
          byImportance: [
            { $group: { _id: '$importance', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
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

    // 状态标签映射（中药现代化专用）
    const STATUS_LABELS: Record<string, string> = {
      'hospital-preparation': '院内制剂',
      'experience-formula': '经验方',
      'protocol-formula': '协定方',
      'early-research': '早期研究'
    }

    // 重要程度标签映射
    const IMPORTANCE_LABELS: Record<string, string> = {
      'very-important': '非常重要',
      'important': '重要',
      'normal': '一般'
    }

    // 构建响应数据
    const overview = {
      totalProjects,
      investmentCount,
      companyOperationCount,
      licenseTransferCount,
      pendingCount,
      byDepartment: formatStatItems(stats.byDepartment, DEPARTMENT_LABELS, totalProjects),
      bySource: formatStatItems(stats.bySource, {}, totalProjects),
      byStatus: formatStatItems(stats.byStatus, STATUS_LABELS, totalProjects),
      byImportance: formatStatItems(stats.byImportance, IMPORTANCE_LABELS, totalProjects)
    }

    const statsData = {
      overview,
      lastUpdated: new Date().toISOString()
    }

    res.status(200).json({
      success: true,
      data: statsData
    })

  } catch (error) {
    console.error('中药现代化统计API错误:', error)
    res.status(500).json({
      success: false,
      error: '获取统计数据失败'
    })
  }
}

// 使用认证中间件包装处理函数
export default authMiddleware(handleChineseMedicineStats)

/* ------------------------------------------------------------------------------------------ */

// 格式化统计项数据
function formatStatItems(
  aggregateResults: Array<{_id: string, count: number}>, 
  labelMap: Record<string, string>,
  total: number
): Array<{label: string, value: number, percentage: number}> {
  return aggregateResults.map(item => ({
    label: labelMap[item._id] || item._id || '未分类',
    value: item.count,
    percentage: total > 0 ? Math.round((item.count / total) * 100 * 10) / 10 : 0
  }))
}

/* ------------------------------------------------------------------------------------------ */