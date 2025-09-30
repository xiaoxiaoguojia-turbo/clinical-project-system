import React, { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { 
  CalendarIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon, 
  ChartBarIcon, 
  UsersIcon,
  BuildingOfficeIcon,
  CubeIcon,
  StarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

/* ------------------------------------------------------------------------------------------ */

// 动态导入组件，禁用SSR
const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), {
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
        <p>加载中...</p>
      </div>
    </div>
  )
})

// Chart.js动态导入 - 修复导入方式
const Bar = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Bar })), { ssr: false })
const Doughnut = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Doughnut })), { ssr: false })
const Pie = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Pie })), { ssr: false })

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

/* ------------------------------------------------------------------------------------------ */

import { TokenManager } from '@/utils/auth'
import { 
  DashboardStats, 
  DashboardFilters, 
  StatCard as StatCardType,
  CHART_COLORS 
} from '@/types/dashboard'

/* ------------------------------------------------------------------------------------------ */

interface StatCard {
  title: string
  value: string | number
  unit: string
  icon: React.ComponentType<any>
  color: string
  trend?: {
    value: number
    isPositive: boolean
    label: string
  }
}

/* ------------------------------------------------------------------------------------------ */

export default function Dashboard() {
  // 基础状态
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // 数据状态
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  
  // 筛选状态  
  const [filters, setFilters] = useState<DashboardFilters>({
    timeRange: 'all',
    projectTypes: [],
    departments: []
  })

  /* ------------------------------------------------------------------------------------------ */

  // 认证检查
  useEffect(() => {
    setMounted(true)
    
    const checkAuth = async () => {
      try {
        if (!TokenManager.isAuthenticated()) {
          window.location.href = '/login'
          return
        }
        
        setIsAuthenticated(true)
        await loadDashboardData()
      } catch (error) {
        console.error('认证检查失败:', error)
        window.location.href = '/login'
      }
    }

    checkAuth()
  }, [])

  // 筛选变化时重新加载数据
  useEffect(() => {
    if (isAuthenticated && mounted) {
      loadDashboardData()
    }
  }, [filters, isAuthenticated, mounted])

  /* ------------------------------------------------------------------------------------------ */

  // 加载Dashboard数据
  const loadDashboardData = async () => {
    try {
      console.log('🔄 开始加载Dashboard数据...')
      setLoading(true)
      
      const params = new URLSearchParams()
      params.append('timeRange', filters.timeRange)
      
      if (filters.projectTypes && filters.projectTypes.length > 0) {
        params.append('projectTypes', filters.projectTypes.join(','))
      }
      
      if (filters.departments && filters.departments.length > 0) {
        params.append('departments', filters.departments.join(','))
      }

      const token = TokenManager.getToken()
      const response = await fetch(`/api/dashboard/stats?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Dashboard数据加载成功:', result.data)
        setDashboardData(result.data)
      } else {
        console.error('❌ Dashboard数据加载失败:', result.error)
        alert('加载统计数据失败: ' + result.error)
      }
    } catch (error) {
      console.error('❌ Dashboard数据加载异常:', error)
      alert('加载统计数据失败，请重试')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
  }

  // 处理筛选变化
  const handleFilterChange = (newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  /* ------------------------------------------------------------------------------------------ */

  // 生成统计卡片数据
  const getStatCards = (): StatCard[] => {
    if (!dashboardData) return []

    const { overview, otherProjects, trends } = dashboardData

    return [
      {
        title: '项目总数',
        value: overview.totalProjects,
        unit: '个',
        icon: CubeIcon,
        color: 'blue',
        trend: {
          value: trends.growth.totalGrowth,
          isPositive: trends.growth.totalGrowth >= 0,
          label: '年度增长'
        }
      },
      {
        title: '院内制剂',
        value: overview.byProjectType.find(item => item.label === '院内制剂')?.value || 0,
        unit: '个',
        icon: BuildingOfficeIcon,
        color: 'green'
      },
      {
        title: '其他项目',
        value: otherProjects.totalOtherProjects,
        unit: '个',
        icon: ChartBarIcon,
        color: 'purple'
      },
      {
        title: '平均跟进',
        value: otherProjects.averageFollowUpWeeks || 0,
        unit: '周',
        icon: ClockIcon,
        color: 'orange'
      }
    ]
  }

  // 生成图表配置数据
  const getChartConfigs = useMemo(() => {
    if (!dashboardData) return null

    const { overview } = dashboardData

    // 简化的图表配置
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const, // 修复类型：使用字面值类型
      plugins: {
        legend: {
          display: true,
          position: 'bottom' as const,
          labels: {
            padding: 15,
            usePointStyle: true,
            font: { size: 11 }
          }
        }
      }
    }

    return {
      // 项目类型分布 - 柱状图
      projectTypes: {
        data: {
          labels: overview.byProjectType.map(item => item.label),
          datasets: [{
            label: '项目数量',
            data: overview.byProjectType.map(item => item.value),
            backgroundColor: CHART_COLORS.projectType.slice(0, overview.byProjectType.length),
            borderWidth: 1,
            borderRadius: 4,
          }]
        },
        options: {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }
      },

      // 部门分布 - 环形图
      departments: {
        data: {
          labels: overview.byDepartment.map(item => item.label),
          datasets: [{
            data: overview.byDepartment.map(item => item.value),
            backgroundColor: CHART_COLORS.department.slice(0, overview.byDepartment.length),
            borderColor: '#ffffff',
            borderWidth: 2,
          }]
        },
        options: {
          ...baseOptions,
          cutout: '50%'
        }
      },

      // 项目状态分布 - 柱状图
      status: {
        data: {
          labels: overview.byStatus.map(item => item.label),
          datasets: [{
            label: '项目数量',
            data: overview.byStatus.map(item => item.value),
            backgroundColor: CHART_COLORS.status.slice(0, overview.byStatus.length),
            borderWidth: 1,
            borderRadius: 4,
          }]
        },
        options: {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }
      },

      // 重要程度分布 - 饼图
      importance: {
        data: {
          labels: overview.byImportance.map(item => item.label),
          datasets: [{
            data: overview.byImportance.map(item => item.value),
            backgroundColor: CHART_COLORS.importance.slice(0, overview.byImportance.length),
            borderColor: '#ffffff',
            borderWidth: 2,
          }]
        },
        options: baseOptions
      }
    }
  }, [dashboardData])

  /* ------------------------------------------------------------------------------------------ */

  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout title="数据统计">
      <div className="dashboard-page">
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title">数据统计</h1>
              <p className="page-subtitle">
                项目管理系统统计分析 {dashboardData && `· 更新于 ${new Date(dashboardData.lastUpdated).toLocaleString('zh-CN')}`}
              </p>
            </div>
            
            <div className="header-actions">
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="refresh-button"
              >
                <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? '刷新中' : '刷新数据'}
              </button>
            </div>
          </div>
        </div>

        {/* 筛选控制栏 */}
        <div className="filter-bar">
          <div className="filter-section">
            <div className="filter-item">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <select
                value={filters.timeRange}
                onChange={(e) => handleFilterChange({ timeRange: e.target.value as any })}
                className="filter-select"
              >
                <option value="all">全部时间</option>
                <option value="thisYear">今年</option>
                <option value="thisMonth">本月</option>
                <option value="lastMonth">上月</option>
              </select>
            </div>

            <div className="filter-item">
              <FunnelIcon className="w-4 h-4 text-gray-400" />
              <span className="filter-label">筛选条件</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p className="loading-text">正在加载统计数据...</p>
            </div>
          </div>
        ) : dashboardData ? (
          <>
            {/* 统计卡片网格 */}
            <div className="stats-grid">
              {getStatCards().map((card, index) => (
                <div key={index} className={`stat-card ${card.color}`}>
                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="card-title">{card.title}</h3>
                      <div className="card-icon">
                        <card.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="card-value">
                      <span className="value">{card.value}</span>
                      <span className="unit">{card.unit}</span>
                    </div>
                    {/* {card.trend && (
                      <div className={`card-trend ${card.trend.isPositive ? 'positive' : 'negative'}`}>
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                        <span>{card.trend.value}% {card.trend.label}</span>
                      </div>
                    )} */}
                  </div>
                </div>
              ))}
            </div>

            {/* 图表容器 */}
            <div className="charts-container">
              {getChartConfigs && (
                <>
                  <div className="chart-item" style={{ height: '350px' }}>
                    <h3 className="chart-title">项目类型分布</h3>
                    <Bar data={getChartConfigs.projectTypes.data} options={getChartConfigs.projectTypes.options} />
                  </div>
                  <div className="chart-item" style={{ height: '350px' }}>
                    <h3 className="chart-title">部门分布</h3>
                    <Doughnut data={getChartConfigs.departments.data} options={getChartConfigs.departments.options} />
                  </div>
                  <div className="chart-item" style={{ height: '350px' }}>
                    <h3 className="chart-title">项目状态分布</h3>
                    <Bar data={getChartConfigs.status.data} options={getChartConfigs.status.options} />
                  </div>
                  <div className="chart-item" style={{ height: '350px' }}>
                    <h3 className="chart-title">重要程度分布</h3>
                    <Pie data={getChartConfigs.importance.data} options={getChartConfigs.importance.options} />
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="error-container">
            <div className="error-content">
              <h3>数据加载失败</h3>
              <p>无法获取统计数据，请重试</p>
              <button onClick={handleRefresh} className="retry-button">
                重新加载
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-page {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .title-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .page-title {
          font-size: 28px;
          font-weight: bold;
          color: #1a202c;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          font-size: 16px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }

        .refresh-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
        }

        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          background: white;
          padding: 20px 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .filter-section {
          display: flex;
          gap: 24px;
          align-items: center;
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
          background: white;
          cursor: pointer;
          min-width: 120px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 28px;
        }

        .stat-card {
          padding: 24px;
          border-radius: 12px;
          border: 1px solid;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card-icon {
          margin-left: 8px;
        }

        .card-title {
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          line-height: 1.2;
          white-space: nowrap;
          margin-bottom: 18px;
        }

        .card-value {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .value {
          font-size: 32px;
          font-weight: bold;
          color: #1a202c;
          line-height: 1;
        }

        .unit {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .card-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
        }

        .card-trend.positive {
          color: #10b981;
        }

        .card-trend.negative {
          color: #ef4444;
        }

        .charts-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .chart-item {
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          background: white;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .chart-title {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 16px 0;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          background: white;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        .loading-text {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .error-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          background: white;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .error-content h3 {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .error-content p {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 24px 0;
        }

        .retry-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }

        .retry-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
        }

        /* 统计卡片颜色主题 */
        .stat-card.blue {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 2px solid #bfdbfe;
        }

        .stat-card.blue .card-title {
          color: #1e40af;
        }

        .stat-card.blue .card-header svg {
          color: #3b82f6;
        }

        .stat-card.blue .value {
          color: #1e3a8a;
        }

        .stat-card.green {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 2px solid #a7f3d0;
        }

        .stat-card.green .card-title {
          color: #065f46;
        }

        .stat-card.green .card-header svg {
          color: #10b981;
        }

        .stat-card.green .value {
          color: #064e3b;
        }

        .stat-card.purple {
          background: linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%);
          border: 2px solid #c4b5fd;
        }

        .stat-card.purple .card-title {
          color: #6b21a8;
        }

        .stat-card.purple .card-header svg {
          color: #8b5cf6;
        }

        .stat-card.purple .value {
          color: #581c87;
        }

        .stat-card.orange {
          background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
          border: 2px solid #fdba74;
        }

        .stat-card.orange .card-title {
          color: #c2410c;
        }

        .stat-card.orange .card-header svg {
          color: #f97316;
        }

        .stat-card.orange .value {
          color: #9a3412;
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-page {
            padding: 16px;
          }

          .page-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .header-actions {
            margin-top: 0;
            justify-content: center;
          }

          .filter-bar {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .filter-section {
            justify-content: center;
            flex-wrap: wrap;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .stat-card {
            padding: 20px;
          }

          .card-header {
            margin-bottom: 12px;
          }

          .card-title {
            font-size: 16px;
          }

          .value {
            font-size: 28px;
          }

          .unit {
            font-size: 12px;
          }

          .charts-container {
            grid-template-columns: 1fr;
          }

          .loading-container,
          .error-container {
            height: 300px;
          }

          .loading-content,
          .error-content {
            padding: 24px;
          }
        }

        @media (max-width: 480px) {
          .dashboard-page {
            padding: 12px;
          }

          .page-header {
            padding: 16px;
          }

          .page-title {
            font-size: 24px;
          }

          .page-subtitle {
            font-size: 14px;
          }

          .filter-bar {
            padding: 16px;
          }

          .filter-item {
            flex-direction: column;
            gap: 8px;
            align-items: center;
          }

          .filter-select {
            width: 100%;
            min-width: 120px;
          }

          .stat-card {
            padding: 16px;
          }

          .card-header {
            margin-bottom: 8px;
          }

          .card-title {
            font-size: 14px;
          }

          .value {
            font-size: 24px;
          }

          .card-trend {
            font-size: 12px;
          }

          .refresh-button,
          .retry-button {
            padding: 10px 20px;
            font-size: 13px;
          }

          .chart-item {
            padding: 20px;
          }

          .chart-title {
            font-size: 16px;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </DashboardLayout>
  )
}
