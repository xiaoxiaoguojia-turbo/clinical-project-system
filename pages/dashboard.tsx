import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { 
  ChartBarIcon,
  DocumentTextIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

// 动态导入DashboardLayout，避免SSR问题
const DashboardLayout = dynamic(() => import('@/layout/DashboardLayout'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center', color: '#6b7280' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p>正在加载系统...</p>
      </div>
    </div>
  )
})

const DashboardPage: NextPage = () => {
  /* ------------------------------------------------------------------------------------------ */
  // 状态和路由管理
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [projectType, setProjectType] = useState('all')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 数据状态管理
  const [dashboardData, setDashboardData] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalBudget: 0,
    departments: 0,
    researchers: 0
  })
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 生命周期函数 - 客户端认证检查
  useEffect(() => {
    const initAuth = async () => {
      setMounted(true)
      
      try {
        // 动态导入TokenManager避免SSR问题
        const { TokenManager } = await import('@/utils/auth')
        
        const authenticated = TokenManager.isAuthenticated()
        const user = TokenManager.getUser()
        
        setIsAuthenticated(authenticated)
        setCurrentUser(user)
        
        if (!authenticated) {
          router.replace('/login')
          return
        }
        
        // 认证通过，加载数据
        await loadDashboardData()
      } catch (error) {
        console.error('认证初始化失败:', error)
        router.replace('/login')
      }
    }

    initAuth()
  }, [router])

  // 当筛选条件变化时重新加载数据
  useEffect(() => {
    if (mounted && isAuthenticated) {
      loadDashboardData()
    }
  }, [timeRange, projectType, mounted, isAuthenticated])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟数据 - 根据时间范围和项目类型调整数据
      const baseData = {
        totalProjects: 12,
        activeProjects: 7,
        completedProjects: 5,
        totalBudget: 2850000,
        departments: 3,
        researchers: 15
      }
      
      // 根据筛选条件调整数据
      const multiplier = timeRange === 'year' ? 12 : timeRange === 'quarter' ? 3 : 1
      const typeMultiplier = projectType === 'all' ? 1 : 0.6
      
      setDashboardData({
        totalProjects: Math.round(baseData.totalProjects * multiplier * typeMultiplier),
        activeProjects: Math.round(baseData.activeProjects * multiplier * typeMultiplier),
        completedProjects: Math.round(baseData.completedProjects * multiplier * typeMultiplier),
        totalBudget: Math.round(baseData.totalBudget * multiplier * typeMultiplier),
        departments: baseData.departments,
        researchers: Math.round(baseData.researchers * typeMultiplier)
      })
      
      setLoading(false)
    } catch (error) {
      console.error('加载Dashboard数据失败:', error)
      setLoading(false)
    }
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 事件处理函数
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
  }

  const handleProjectTypeChange = (value: string) => {
    setProjectType(value)
  }

  const handleExportData = () => {
    // TODO: 实现数据导出功能
    console.log('导出数据功能待实现')
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 数据定义
  const timeRangeOptions = [
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'quarter', label: '本季度' },
    { value: 'year', label: '本年度' }
  ]

  const projectTypeOptions = [
    { value: 'all', label: '全部项目' },
    { value: 'hospital-preparation', label: '院内制剂' },
    { value: 'clinical-trial', label: '临床试验' },
    { value: 'research', label: '科研项目' }
  ]

  const statisticCards = [
    {
      title: '总项目数',
      value: dashboardData.totalProjects,
      unit: '个',
      icon: FolderIcon,
      color: 'blue',
      trend: '+12%',
      trendLabel: '较上月'
    },
    {
      title: '进行中项目',
      value: dashboardData.activeProjects,
      unit: '个', 
      icon: DocumentTextIcon,
      color: 'green',
      trend: '+8%',
      trendLabel: '较上月'
    },
    {
      title: '已完成项目',
      value: dashboardData.completedProjects,
      unit: '个',
      icon: ChartBarIcon,
      color: 'purple',
      trend: '+5%',
      trendLabel: '较上月'
    },
    {
      title: '总预算金额',
      value: (dashboardData.totalBudget / 10000).toFixed(1),
      unit: '万元',
      icon: CalendarIcon,
      color: 'orange',
      trend: '+15%',
      trendLabel: '较上月'
    },
    {
      title: '参与部门',
      value: dashboardData.departments,
      unit: '个',
      icon: UsersIcon,
      color: 'cyan',
      trend: '+2',
      trendLabel: '新增部门'
    },
    {
      title: '研究人员',
      value: dashboardData.researchers,
      unit: '人',
      icon: UsersIcon,
      color: 'pink',
      trend: '+23',
      trendLabel: '新增人员'
    }
  ]

  const getCardColorClasses = (color: string) => {
    const colorMap = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', trend: 'text-blue-600' },
      green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', trend: 'text-green-600' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', trend: 'text-purple-600' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600', trend: 'text-orange-600' },
      cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', icon: 'text-cyan-600', trend: 'text-cyan-600' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', icon: 'text-pink-600', trend: 'text-pink-600' }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }
  /* ------------------------------------------------------------------------------------------ */

  // 在组件挂载前显示加载状态
  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e5e7eb',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>初始化系统...</p>
        </div>
      </div>
    )
  }

  // 认证失败或正在重定向
  if (!isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout title="项目报表统计分析 - 临床创新项目管理系统">
      <div className="dashboard-page">
        {/* 页面标题和操作区域 */}
        <div className="page-header">
          <div className="title-section">
            <h1 className="page-title">项目报表统计分析</h1>
            <p className="page-subtitle">
              欢迎回来，{currentUser?.realName || currentUser?.username || '用户'}！这里是您的项目概览和数据统计。
            </p>
          </div>
          
          <div className="action-section">
            <button onClick={handleExportData} className="export-button">
              <DocumentTextIcon className="w-5 h-5" />
              <span>导出数据</span>
            </button>
          </div>
        </div>

        {/* 筛选器 */}
        <div className="filter-section">
          <div className="filter-item">
            <CalendarIcon className="w-5 h-5 filter-icon" />
            <span className="filter-label">时间范围:</span>
            <select 
              value={timeRange} 
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="filter-select"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-item">
            <FunnelIcon className="w-5 h-5 filter-icon" />
            <span className="filter-label">项目类型:</span>
            <select 
              value={projectType} 
              onChange={(e) => handleProjectTypeChange(e.target.value)}
              className="filter-select"
            >
              {projectTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="statistics-grid">
          {statisticCards.map((card, index) => {
            const colorClasses = getCardColorClasses(card.color)
            return (
              <div key={index} className={`statistic-card ${colorClasses.bg} ${colorClasses.border}`}>
                <div className="card-header">
                  <div className="card-icon-wrapper">
                    <card.icon className={`w-8 h-8 ${colorClasses.icon}`} />
                  </div>
                  <div className="card-trend">
                    <span className={`trend-value ${colorClasses.trend}`}>{card.trend}</span>
                    <span className="trend-label">{card.trendLabel}</span>
                  </div>
                </div>
                
                <div className="card-content">
                  <h3 className="card-title">{card.title}</h3>
                  <div className="card-value">
                    {loading ? (
                      <div className="loading-placeholder">--</div>
                    ) : (
                      <>
                        <span className="value-number">{card.value}</span>
                        <span className="value-unit">{card.unit}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 图表占位区域 */}
        <div className="charts-section">
          <div className="chart-placeholder">
            <ChartBarIcon className="w-16 h-16 text-gray-400" />
            <h3>图表数据展示</h3>
            <p>项目进度统计、预算分析图表等将在此处显示</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          padding: 0;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .title-section h1 {
          font-size: 28px;
          font-weight: bold;
          color: #1a202c;
          margin: 0 0 8px 0;
        }

        .title-section p {
          font-size: 16px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .action-section {
          display: flex;
          gap: 12px;
        }

        .export-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .export-button:hover {
          background: #2563eb;
        }

        .filter-section {
          display: flex;
          gap: 24px;
          margin-bottom: 32px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-icon {
          color: #64748b;
        }

        .filter-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          white-space: nowrap;
        }

        .filter-select {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          color: #374151;
          background: white;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }

        .statistics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .statistic-card {
          padding: 24px;
          border-radius: 16px;
          border: 2px solid;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .statistic-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .card-icon-wrapper {
          padding: 12px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
        }

        .card-trend {
          text-align: right;
        }

        .trend-value {
          display: block;
          font-size: 16px;
          font-weight: bold;
          line-height: 1;
        }

        .trend-label {
          font-size: 12px;
          color: #64748b;
          line-height: 1;
        }

        .card-content h3 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 12px 0;
        }

        .card-value {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .value-number {
          font-size: 32px;
          font-weight: bold;
          color: #1a202c;
          line-height: 1;
        }

        .value-unit {
          font-size: 16px;
          color: #64748b;
        }

        .loading-placeholder {
          font-size: 32px;
          font-weight: bold;
          color: #cbd5e1;
        }

        .charts-section {
          margin-top: 48px;
        }

        .chart-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 32px;
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          text-align: center;
        }

        .chart-placeholder h3 {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin: 16px 0 8px 0;
        }

        .chart-placeholder p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 16px;
          }

          .filter-section {
            flex-direction: column;
            gap: 16px;
          }

          .statistics-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        /* 加载动画 */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  )
}

export default DashboardPage
