import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { 
  CalendarIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon, 
  ChartBarIcon, 
  BeakerIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import { ApiResponse, PaginatedResponse } from '@/types'

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

interface InternalPreparationProject {
  _id: string
  department: string
  source: string
  name: string
  composition: string
  function: string
  specification: string
  duration: string
  dosage: string
  recordNumber?: string
  patent?: string
  remarks?: string
  status: 'active' | 'completed' | 'paused'
  createTime: string
  updateTime: string
  createdBy?: string
}

interface PreparationStats {
  totalPreparations: number
  activePreparations: number
  completedPreparations: number
  pausedPreparations: number
  sourceDepartments: number
  patentCount: number
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

export default function InternalPreparationsPage() {
  /* ------------------------------------------------------------------------------------------ */
  // 状态管理
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'statistics' | 'projects'>('statistics')
  const [timeRange, setTimeRange] = useState('本月')
  const [statusFilter, setStatusFilter] = useState('全部状态')
  
  const [preparationStats, setPreparationStats] = useState<PreparationStats>({
    totalPreparations: 0,
    activePreparations: 0,
    completedPreparations: 0,
    pausedPreparations: 0,
    sourceDepartments: 0,
    patentCount: 0
  })
  
  const [preparations, setPreparations] = useState<InternalPreparationProject[]>([])
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
        await loadPreparationData()
      } catch (error) {
        console.error('认证检查失败:', error)
        window.location.href = '/login'
      }
    }

    checkAuth()
  }, [])

  // 图表初始化
  useEffect(() => {
    if (!loading && typeof window !== 'undefined' && activeTab === 'statistics') {
      initializeCharts()
    }
  }, [loading, activeTab, preparationStats])

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

  const loadPreparationData = async () => {
    try {
      setLoading(true)
      
      const { ApiClient } = await import('@/utils/auth')
      
      // 获取所有院内制剂项目数据用于统计
      const response = await ApiClient.get<ApiResponse<PaginatedResponse<InternalPreparationProject>>>(`/internal-preparation-projects?pageSize=100`)
      
      if (response.success && response.data) {
        const projectsData = response.data.data || []
        setPreparations(projectsData)
        
        // 计算统计数据
        const stats = calculateStats(projectsData)
        setPreparationStats(stats)
      }
    } catch (error) {
      console.error('加载院内制剂数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (projects: InternalPreparationProject[]): PreparationStats => {
    const totalPreparations = projects.length
    const activePreparations = projects.filter(p => p.status === 'active').length
    const completedPreparations = projects.filter(p => p.status === 'completed').length
    const pausedPreparations = projects.filter(p => p.status === 'paused').length
    const sourceDepartments = new Set(projects.map(p => p.source)).size
    const patentCount = projects.filter(p => p.patent && p.patent !== '无').length

    return {
      totalPreparations,
      activePreparations,
      completedPreparations,
      pausedPreparations,
      sourceDepartments,
      patentCount
    }
  }
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
    // 计算图表数据
    const statusDistribution = [
      preparationStats.activePreparations,
      preparationStats.completedPreparations,
      preparationStats.pausedPreparations
    ]

    const sourceDeptData = preparations.reduce((acc, prep) => {
      acc[prep.source] = (acc[prep.source] || 0) + 1
      return acc
    }, {} as {[key: string]: number})

    const sourceLabels = Object.keys(sourceDeptData).slice(0, 6) // 显示前6个科室
    const sourceData = sourceLabels.map(label => sourceDeptData[label])

    return {
      statusChart: {
        type: 'doughnut' as const,
        data: {
          labels: ['进行中', '已完成', '已暂停'],
          datasets: [{
            data: statusDistribution,
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
      sourceDeptChart: {
        type: 'bar' as const,
        data: {
          labels: sourceLabels,
          datasets: [{
            label: '制剂数量',
            data: sourceData,
            backgroundColor: '#3b82f6',
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
      monthlyTrendChart: {
        type: 'line' as const,
        data: {
          labels: ['4月', '5月', '6月', '7月', '8月', '9月'],
          datasets: [{
            label: '新增制剂',
            data: [2, 3, 1, 4, 2, 3],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
              ticks: { stepSize: 1 }
            }
          }
        }
      },
      durationChart: {
        type: 'bar' as const,
        data: {
          labels: ['1-2年', '3-5年', '6-10年', '10年以上'],
          datasets: [{
            label: '制剂数量',
            data: [
              preparations.filter(p => parseInt(p.duration) <= 2).length,
              preparations.filter(p => parseInt(p.duration) >= 3 && parseInt(p.duration) <= 5).length,
              preparations.filter(p => parseInt(p.duration) >= 6 && parseInt(p.duration) <= 10).length,
              preparations.filter(p => parseInt(p.duration) > 10).length
            ],
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
  const handleTabChange = (tab: 'statistics' | 'projects') => {
    setActiveTab(tab)
    
    // 清理现有图表
    Object.values(charts).forEach((chart: any) => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy()
      }
    })
    setCharts({})
  }

  const handleExport = () => {
    console.log('导出院内制剂数据功能开发中...')
  }

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value)
  }

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleRefreshData = () => {
    loadPreparationData()
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 数据处理
  const statisticCards: StatCard[] = [
    {
      title: '总制剂数',
      value: preparationStats.totalPreparations,
      unit: '个',
      icon: BeakerIcon,
      color: 'blue',
      trend: '+2',
      trendLabel: '较上月'
    },
    {
      title: '进行中',
      value: preparationStats.activePreparations,
      unit: '个',
      icon: CheckCircleIcon,
      color: 'green',
      trend: '+1',
      trendLabel: '较上月'
    },
    {
      title: '已完成',
      value: preparationStats.completedPreparations,
      unit: '个',
      icon: ClipboardDocumentListIcon,
      color: 'purple',
      trend: '+1',
      trendLabel: '较上月'
    },
    {
      title: '已暂停',
      value: preparationStats.pausedPreparations,
      unit: '个',
      icon: PauseCircleIcon,
      color: 'yellow',
      trend: '0',
      trendLabel: '较上月'
    },
    {
      title: '来源科室',
      value: preparationStats.sourceDepartments,
      unit: '个',
      icon: BuildingOffice2Icon,
      color: 'indigo',
      trend: '+1',
      trendLabel: '较上月'
    },
    {
      title: '专利申请',
      value: preparationStats.patentCount,
      unit: '个',
      icon: ChartBarIcon,
      color: 'pink',
      trend: '+2',
      trendLabel: '较上月'
    }
  ]
  /* ------------------------------------------------------------------------------------------ */

  if (!mounted) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="preparations-page">
        {/* 页面头部 */}
        <div className="page-header">
          <div className="title-section">
            <h1>院内制剂管理</h1>
            <p>院内制剂项目的统计分析与项目管理</p>
          </div>
          <div className="action-section">
            <button className="export-button" onClick={handleExport}>
              <ArrowDownTrayIcon className="w-4 h-4" />
              导出数据
            </button>
          </div>
        </div>

        {/* 标签栏 */}
        <div className="tab-bar">
          <button 
            className={`tab-button ${activeTab === 'statistics' ? 'active' : ''}`}
            onClick={() => handleTabChange('statistics')}
          >
            <ChartBarIcon className="w-4 h-4" />
            统计报表
          </button>
          <button 
            className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => handleTabChange('projects')}
          >
            <ClipboardDocumentListIcon className="w-4 h-4" />
            项目列表
          </button>
        </div>

        {/* 统计报表内容 */}
        {activeTab === 'statistics' && (
          <>
            {/* 筛选控制栏 */}
            <div className="filter-bar">
              <div className="filter-controls">
                <div className="filter-item">
                  <CalendarIcon className="w-4 h-4 filter-icon" />
                  <select 
                    value={timeRange} 
                    onChange={handleTimeRangeChange}
                    className="filter-select"
                  >
                    <option>本月</option>
                    <option>最近3个月</option>
                    <option>本年度</option>
                    <option>全部</option>
                  </select>
                </div>
                <div className="filter-item">
                  <FunnelIcon className="w-4 h-4 filter-icon" />
                  <select 
                    value={statusFilter} 
                    onChange={handleStatusFilterChange}
                    className="filter-select"
                  >
                    <option>全部状态</option>
                    <option>进行中</option>
                    <option>已完成</option>
                    <option>已暂停</option>
                  </select>
                </div>
              </div>
              <button className="refresh-button" onClick={handleRefreshData}>
                刷新数据
              </button>
            </div>

            {/* 统计卡片 */}
            <div className="stats-grid">
              {loading ? (
                // 加载状态
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="stat-card loading">
                    <div className="loading-shimmer"></div>
                  </div>
                ))
              ) : (
                statisticCards.map((card, index) => (
                  <div key={index} className={`stat-card ${card.color}`}>
                    <div className="stat-content">
                      <div className="stat-main">
                        <div className="stat-info">
                          <h3>{card.title}</h3>
                          <div className="stat-value">
                            <span className="value">{card.value}</span>
                            <span className="unit">{card.unit}</span>
                          </div>
                        </div>
                        <div className="stat-icon">
                          <card.icon className="w-8 h-8" />
                        </div>
                      </div>
                      <div className="stat-trend">
                        <span className={`trend ${card.trend.startsWith('+') ? 'positive' : card.trend === '0' ? 'neutral' : 'negative'}`}>
                          {card.trend}
                        </span>
                        <span className="trend-label">{card.trendLabel}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 图表区域 */}
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>制剂状态分布</h3>
                  <button className="chart-menu" onClick={() => console.log('Chart menu')}>
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="chart-container">
                  <canvas id="statusChart"></canvas>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>来源科室分布</h3>
                  <button className="chart-menu" onClick={() => console.log('Chart menu')}>
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="chart-container">
                  <canvas id="sourceDeptChart"></canvas>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>制剂创建趋势</h3>
                  <button className="chart-menu" onClick={() => console.log('Chart menu')}>
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="chart-container">
                  <canvas id="monthlyTrendChart"></canvas>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>有效期分布</h3>
                  <button className="chart-menu" onClick={() => console.log('Chart menu')}>
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="chart-container">
                  <canvas id="durationChart"></canvas>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 项目列表内容 */}
        {activeTab === 'projects' && (
          <div className="projects-placeholder">
            <div className="placeholder-content">
              <ClipboardDocumentListIcon className="w-16 h-16 placeholder-icon" />
              <h3>项目列表</h3>
              <p>项目列表界面开发中，敬请期待...</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .preparations-page {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* 页面头部 */
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
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .title-section p {
          font-size: 16px;
          color: #64748b;
          margin: 0;
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

        /* 标签栏 */
        .tab-bar {
          display: flex;
          background: white;
          border-radius: 12px;
          padding: 6px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
          gap: 4px;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          justify-content: center;
        }

        .tab-button:hover {
          background: #f1f5f9;
          color: #334155;
        }

        .tab-button.active {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        /* 筛选控制栏 */
        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 20px 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .filter-controls {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-icon {
          color: #6b7280;
        }

        .filter-select {
          padding: 8px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          color: #374151;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .refresh-button {
          padding: 8px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-button:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        /* 统计卡片网格 */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
        }

        .stat-card.loading {
          background: #f8fafc;
        }

        .loading-shimmer {
          width: 100%;
          height: 80px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .stat-content {
          position: relative;
          z-index: 1;
        }

        .stat-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .stat-info h3 {
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          margin: 0 0 8px 0;
        }

        .stat-value {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .stat-value .value {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
        }

        .stat-value .unit {
          font-size: 14px;
          color: #64748b;
        }

        .stat-icon {
          padding: 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-card.blue .stat-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .stat-card.green .stat-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .stat-card.purple .stat-icon { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
        .stat-card.yellow .stat-icon { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .stat-card.indigo .stat-icon { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
        .stat-card.pink .stat-icon { background: rgba(236, 72, 153, 0.1); color: #ec4899; }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .trend {
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .trend.positive { background: #dcfce7; color: #16a34a; }
        .trend.neutral { background: #f1f5f9; color: #64748b; }
        .trend.negative { background: #fef2f2; color: #dc2626; }

        .trend-label {
          color: #64748b;
        }

        /* 图表网格 */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px 16px 24px;
          border-bottom: 1px solid #f1f5f9;
        }

        .chart-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .chart-menu {
          width: 28px;
          height: 28px;
          border: none;
          background: #f8fafc;
          color: #64748b;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chart-menu:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .chart-container {
          padding: 24px;
          height: 300px;
          position: relative;
        }

        /* 项目列表占位 */
        .projects-placeholder {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          padding: 80px 40px;
          text-align: center;
        }

        .placeholder-content {
          max-width: 400px;
          margin: 0 auto;
        }

        .placeholder-icon {
          color: #cbd5e1;
          margin: 0 auto 24px;
        }

        .placeholder-content h3 {
          font-size: 20px;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 12px 0;
        }

        .placeholder-content p {
          color: #94a3b8;
          margin: 0;
          line-height: 1.6;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .preparations-page {
            padding: 16px;
          }

          .page-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .filter-bar {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .filter-controls {
            justify-content: space-between;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .tab-button {
            font-size: 13px;
            padding: 10px 16px;
          }
        }

        /* 动画 */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  )
}
