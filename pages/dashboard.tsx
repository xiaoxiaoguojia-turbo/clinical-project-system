import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { CalendarIcon, FunnelIcon, ArrowDownTrayIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'

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

interface DashboardData {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  projectTypeCount: number
  chargePersonCount: number
}

interface StatCard {
  title: string
  value: string | number
  unit: string
  icon: React.ComponentType<any>
  color: string
  trend: string
  trendLabel: string
}

export default function Dashboard() {
  /* ------------------------------------------------------------------------------------------ */
  // 状态管理
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('本月')
  const [projectType, setProjectType] = useState('全部项目')
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    projectTypeCount: 0,
    chargePersonCount: 0
  })
  const [charts, setCharts] = useState<{[key: string]: any}>({})
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 认证检查和数据加载
  useEffect(() => {
    setMounted(true)
    
    const checkAuth = async () => {
      try {
        const { TokenManager } = await import('@/utils/auth')
        
        if (!TokenManager.isAuthenticated()) {
          window.location.href = '/login'
          return
        }
        
        setIsAuthenticated(true)
        
        // 模拟数据加载延迟
        setTimeout(() => {
          setDashboardData({
            totalProjects: 8,
            activeProjects: 5,
            completedProjects: 1,
            projectTypeCount: 3,
            chargePersonCount: 4
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('认证检查失败:', error)
        window.location.href = '/login'
      }
    }

    checkAuth()
  }, [])

  // 图表初始化
  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      initializeCharts()
    }
  }, [loading])

  // 清理图表
  useEffect(() => {
    return () => {
      Object.values(charts).forEach((chart: any) => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy()
        }
      })
    }
  }, [charts])
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 图表初始化函数
  const initializeCharts = async () => {
    try {
      // 动态导入 Chart.js
      const Chart = (await import('chart.js/auto')).default
      
      const chartConfigs = getChartConfigs()
      const newCharts: {[key: string]: any} = {}

      // 添加延迟确保DOM元素已渲染
      setTimeout(() => {
        Object.entries(chartConfigs).forEach(([key, config]) => {
          const canvas = document.getElementById(key) as HTMLCanvasElement
          if (canvas) {
            const ctx = canvas.getContext('2d')
            if (ctx) {
              newCharts[key] = new Chart(ctx, config as any)
            }
          }
        })
        setCharts(newCharts)
      }, 100)
    } catch (error) {
      console.error('图表初始化失败:', error)
    }
  }

  const getChartConfigs = () => {
    return {
      projectStatusChart: {
        type: 'doughnut' as const,
        data: {
          labels: ['进行中', '已完成', '已暂停'],
          datasets: [{
            data: [5, 1, 2],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
            borderWidth: 0,
            cutout: '60%'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom' as const,
              labels: { padding: 20, usePointStyle: true }
            }
          }
        }
      },
      completionTrendChart: {
        type: 'line' as const,
        data: {
          labels: ['4月', '5月', '6月', '7月', '8月', '9月'],
          datasets: [{
            label: '完成率',
            data: [65, 72, 68, 96, 82, 78],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { callback: (value: any) => value + '%' }
            }
          }
        }
      },
      typeProjectsChart: {
        type: 'bar' as const,
        data: {
          labels: ['院内制剂', '类型2（示例）', '类型3（示例）'],
          datasets: [{
            label: '项目数量',
            data: [6, 2, 0],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
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
      sourceProjectsChart: {
        type: 'bar' as const,
        data: {
          labels: ['123', '岳阳医院', '中医科', '曙光医院', '上海皮肤病医院'],
          datasets: [{
            label: '项目数量',
            data: [1, 2, 1, 2, 2],
            backgroundColor: '#8b5cf6',
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }
      }
    }
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 事件处理函数
  const handleExport = () => {
    console.log('导出数据功能开发中...')
  }

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value)
  }

  const handleProjectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectType(e.target.value)
  }

  const handleChartAction = (chartId: string) => {
    console.log(`图表操作: ${chartId}`)
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 数据处理
  const statisticCards: StatCard[] = [
    {
      title: '总项目数',
      value: dashboardData.totalProjects,
      unit: '个',
      icon: ChartBarIcon,
      color: 'blue',
      trend: '+3',
      trendLabel: '较上月'
    },
    {
      title: '进行中项目',
      value: dashboardData.activeProjects,
      unit: '个',
      icon: ChartBarIcon,
      color: 'green',
      trend: '+2',
      trendLabel: '较上月'
    },
    {
      title: '已完成项目',
      value: dashboardData.completedProjects,
      unit: '个',
      icon: CalendarIcon,
      color: 'orange',
      trend: '+2',
      trendLabel: '较上月'
    },
    {
      title: '项目类型数量',
      value: dashboardData.projectTypeCount,
      unit: '类',
      icon: UsersIcon,
      color: 'cyan',
      trend: '+0',
      trendLabel: '较上月'
    },
    {
      title: '负责人员',
      value: dashboardData.chargePersonCount,
      unit: '人',
      icon: UsersIcon,
      color: 'pink',
      trend: '+3',
      trendLabel: '较上月'
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
    <DashboardLayout title="总项目报表统计 - 临床创新项目管理系统">
      <div className="dashboard-page">
        {/* 页面标题和操作区域 */}
        <div className="page-header">
          <div className="title-section">
            <h1>总项目报表统计</h1>
            <p>欢迎回来，系统管理员！这里是您的总体项目数据统计。</p>
          </div>
          <div className="action-section">
            <button className="export-button" onClick={handleExport}>
              <ArrowDownTrayIcon className="w-4 h-4" />
              导出报告
            </button>
          </div>
        </div>

        {/* 筛选区域 */}
        <div className="filter-section">
          <div className="filter-item">
            <CalendarIcon className="w-5 h-5 filter-icon" />
            <span className="filter-label">时间范围:</span>
            <select 
              className="filter-select"
              value={timeRange}
              onChange={handleTimeRangeChange}
            >
              <option value="本月">本月</option>
              <option value="本季度">本季度</option>
              <option value="本年">本年</option>
              <option value="自定义">自定义</option>
            </select>
          </div>
          <div className="filter-item">
            <FunnelIcon className="w-5 h-5 filter-icon" />
            <span className="filter-label">项目类型:</span>
            <select 
              className="filter-select"
              value={projectType}
              onChange={handleProjectTypeChange}
            >
              <option value="全部项目">全部项目</option>
              <option value="院内制剂">院内制剂</option>
              <option value="临床试验">临床试验</option>
              <option value="创新项目">创新项目</option>
            </select>
          </div>
        </div>

        {/* 统计卡片区域 */}
        <div className="stats-grid">
          {statisticCards.map((card, index) => {
            const colors = getCardColorClasses(card.color)
            const IconComponent = card.icon
            
            return (
              <div key={index} className={`stat-card ${colors.bg} ${colors.border}`}>
                <div className="card-header">
                  <div className="card-title">{card.title}</div>
                  <div className={`card-icon ${colors.icon}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
                <div className="card-body">
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

        {/* 图表展示区域 */}
        <div className="charts-section">
          {/* 第一行图表 */}
          <div className="charts-container">
            <div className="chart-box">
              <div className="chart-header">
                <h3>项目状态分布</h3>
                <div className="chart-actions">
                  <button onClick={() => handleChartAction('projectStatusChart')}>
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="chart-container">
                <canvas id="projectStatusChart"></canvas>
              </div>
            </div>
            <div className="chart-box">
              <div className="chart-header">
                <h3>项目完成率趋势</h3>
                <div className="chart-actions">
                  <button onClick={() => handleChartAction('completionTrendChart')}>
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="chart-container">
                <canvas id="completionTrendChart"></canvas>
              </div>
            </div>
          </div>

          {/* 第二行图表 */}
          <div className="charts-container">
            <div className="chart-box">
              <div className="chart-header">
                <h3>各分类型项目数量</h3>
                <div className="chart-actions">
                  <button onClick={() => handleChartAction('typeProjectsChart')}>
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="chart-container">
                <canvas id="typeProjectsChart"></canvas>
              </div>
            </div>
            <div className="chart-box">
              <div className="chart-header">
                <h3>项目来源分布</h3>
                <div className="chart-actions">
                  <button onClick={() => handleChartAction('sourceProjectsChart')}>
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="chart-container">
                <canvas id="sourceProjectsChart"></canvas>
              </div>
            </div>
          </div>
        </div>
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
          margin-bottom: 24px;
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
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
          margin-top: 20px;
        }

        .export-button {
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

        .export-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
        }

        .filter-section {
          display: flex;
          gap: 24px;
          background: white;
          padding: 20px 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          margin-bottom: 42px;
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
          margin-bottom: 32px;
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

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .card-title {
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          line-height: 1.2;
        }

        .card-icon {
          padding: 8px;
          border-radius: 8px;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .card-body {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
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
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .loading-placeholder {
          font-size: 32px;
          font-weight: bold;
          color: #cbd5e1;
          line-height: 1;
        }

        .charts-section {
          margin-top: 40px;
        }

        .charts-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .chart-box {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .chart-box:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .chart-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
        }

        .chart-actions button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chart-actions button:hover {
          background: #f1f5f9;
          color: #374151;
        }

        .chart-container {
          padding: 16px 24px 24px;
          height: 300px;
          position: relative;
        }

        .chart-container canvas {
          width: 100% !important;
          height: 100% !important;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .filter-section {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .charts-container {
            grid-template-columns: 1fr;
          }

          .chart-container {
            height: 250px;
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
