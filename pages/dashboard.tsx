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
  ArrowPathIcon,
  CheckCircleIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  DocumentTextIcon
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

import { TokenManager, authenticatedFetch } from '@/utils/auth'
import { 
  DashboardStats, 
  DashboardFilters, 
  StatCard as StatCardType,
  CHART_COLORS,
  TRANSFORM_REQUIREMENT_LABELS,
  DEPARTMENT_LABELS
} from '@/types/dashboard'

/* ------------------------------------------------------------------------------------------ */

interface StatCard {
  title: string
  value: string | number
  unit: string
  icon: React.ComponentType<any>
  color: string
}

/* ------------------------------------------------------------------------------------------ */

// 转化需求中文映射
const getTransformRequirementLabel = (value: string): string => {
  const labelMap: {[key: string]: string} = {
    'license': '许可',
    'transfer': '转让',
    'company-operation': '公司化运营',
    'license-transfer': '许可转让',
    'other': '其他'
  }
  return labelMap[value] || value
}

// 转化推进状态中文映射
const getTransformProgressLabel = (value: string): string => {
  const labelMap: {[key: string]: string} = {
    'contract-completed': '签约已完成',
    'contract-incomplete': '未完成'
  }
  return labelMap[value] || value
}

export default function Dashboard() {
  // 基础状态
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // 数据状态
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [unfilteredData, setUnfilteredData] = useState<DashboardStats | null>(null) // 保存未筛选的数据（用于5个小卡片）
  
  // 筛选状态
  const [selectedTransformTypes, setSelectedTransformTypes] = useState<string[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [allSources, setAllSources] = useState<string[]>([]) // 所有医院来源列表

  /* ------------------------------------------------------------------------------------------ */

  // 认证检查
  useEffect(() => {
    setMounted(true)
    
    const checkAuth = async () => {
      try {
        if (!TokenManager.isAuthenticated()) {
          console.log('未检测到认证令牌，跳转到登录页面...')
          window.location.href = '/login'
          return
        }
        
        console.log('认证检查通过')
        setIsAuthenticated(true)
        await loadDashboardData()
      } catch (error) {
        console.error('认证检查失败:', error)
        window.location.href = '/login'
      }
    }
    
    checkAuth()
  }, [])

  /* ------------------------------------------------------------------------------------------ */

  // 加载Dashboard数据
  const loadDashboardData = async (applyFilters = false) => {
    try {
      console.log('开始加载Dashboard数据...')
      setLoading(true)

      // 构建查询参数
      const queryParams = new URLSearchParams()
      
      // 如果需要应用筛选
      if (applyFilters) {
        if (selectedTransformTypes.length > 0) {
          queryParams.append('transformRequirementTypes', selectedTransformTypes.join(','))
        }
        if (selectedDepartments.length > 0) {
          queryParams.append('departments', selectedDepartments.join(','))
        }
        if (selectedSources.length > 0) {
          queryParams.append('sources', selectedSources.join(','))
        }
      }

      const url = `/api/dashboard/stats${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const result = await authenticatedFetch(url, {
        method: 'GET'
      })
      
      if (result.success) {
        console.log('Dashboard数据加载成功:', result.data)
        
        if (applyFilters) {
          // 筛选后的数据只更新dashboardData（用于图表）
          setDashboardData(result.data)
        } else {
          // 未筛选的数据同时更新两个状态
          setDashboardData(result.data)
          setUnfilteredData(result.data)
          
          // 提取所有医院来源
          const sources = result.data.overview.bySource.map((item: any) => item.label)
          setAllSources(sources)
        }
      } else {
        console.error('Dashboard数据加载失败:', result.error)
        alert('加载统计数据失败: ' + result.error)
      }
    } catch (error) {
      console.error('Dashboard数据加载异常:', error)
      if (error instanceof Error && (
        error.message === '认证令牌已过期' || 
        error.message === '未找到认证令牌'
      )) {
        return
      }
      alert('加载统计数据失败，请重试')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData(false)
  }

  // 应用筛选
  const applyFilters = async () => {
    await loadDashboardData(true)
  }

  // 重置筛选
  const resetFilters = async () => {
    setSelectedTransformTypes([])
    setSelectedDepartments([])
    setSelectedSources([])
    await loadDashboardData(false)
  }

  // 筛选器变化处理
  const handleTransformTypeChange = (type: string) => {
    setSelectedTransformTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartments(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    )
  }

  const handleSourceChange = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    )
  }

  /* ------------------------------------------------------------------------------------------ */

  // 生成统计卡片数据（始终使用未筛选的数据）
  const getStatCards = (): StatCard[] => {
    if (!unfilteredData) return []

    const { overview } = unfilteredData

    return [
      {
        title: '项目总数',
        value: overview.totalProjects,
        unit: '个',
        icon: CubeIcon,
        color: 'blue'
      },
      {
        title: '投资项目',
        value: overview.investmentCount,
        unit: '个',
        icon: BanknotesIcon,
        color: 'green'
      },
      {
        title: '公司化运营项目',
        value: overview.companyOperationCount,
        unit: '个',
        icon: BuildingOffice2Icon,
        color: 'purple'
      },
      {
        title: '许可转让项目',
        value: overview.licenseTransferCount,
        unit: '个',
        icon: DocumentTextIcon,
        color: 'emerald'
      },
      {
        title: '待推进项目',
        value: overview.pendingCount,
        unit: '个',
        icon: ClockIcon,
        color: 'amber'
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
      animation: false as const,
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
      // 1. 部门分布 - 环形图
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

      // 2. 项目类型分布 - 柱状图
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

      // 3. 来源分布 - 柱状图
      sources: {
        data: {
          labels: overview.bySource.map(item => item.label),
          datasets: [{
            label: '项目数量',
            data: overview.bySource.map(item => item.value),
            backgroundColor: CHART_COLORS.source.slice(0, overview.bySource.length),
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

      // 4. 转化金额分布 - 柱状图
      transformAmount: {
        data: {
          labels: overview.transformAmountDistribution.map(item => item.label),
          datasets: [{
            label: '项目数量',
            data: overview.transformAmountDistribution.map(item => item.value),
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
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
      
      // 5. 转化需求进度分布 - 柱状图（仅单选时）
      transformProgress: overview.byTransformProgress ? {
        data: {
          labels: overview.byTransformProgress.map(item => item.label),
          datasets: [{
            label: '项目数量',
            data: overview.byTransformProgress.map(item => item.value),
            backgroundColor: '#10B981',
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
      } : null
    }
  }, [dashboardData])

  /* ------------------------------------------------------------------------------------------ */

  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout title="数据统计 - 临床创新项目管理系统">
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
            <button
              className="refresh-button"
              onClick={handleRefresh}
              disabled={loading || refreshing}             
            >
              <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? '刷新中' : '刷新数据'}
            </button>
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
                  </div>
                </div>
              ))}
            </div>

            {/* 筛选器区域 */}
            <div className="filters-section">
              <div className="filters-header">
                <div className="filters-title">
                  <FunnelIcon className="w-5 h-5" />
                  <h2>数据筛选</h2>
                </div>
                <div className="filters-actions">
                  <button
                    className="filter-btn apply-btn"
                    onClick={applyFilters}
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    应用筛选
                  </button>
                  <button
                    className="filter-btn reset-btn"
                    onClick={resetFilters}
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    重置
                  </button>
                </div>
              </div>

              <div className="filters-content">
                {/* 转化需求类型筛选 */}
                <div className="filter-group">
                  <label className="filter-label">转化需求类型</label>
                  <div className="filter-options">
                    {Object.entries(TRANSFORM_REQUIREMENT_LABELS).map(
                      ([key, label]) => (
                        <label key={key} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedTransformTypes.includes(key)}
                            onChange={() => handleTransformTypeChange(key)}
                            className="checkbox-input"
                          />
                          <span className="checkbox-text">{label}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* 归属部门筛选 */}
                <div className="filter-group">
                  <label className="filter-label">归属部门</label>
                  <div className="filter-options">
                    {Object.entries(DEPARTMENT_LABELS).map(([key, label]) => (
                      <label key={key} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(key)}
                          onChange={() => handleDepartmentChange(key)}
                          className="checkbox-input"
                        />
                        <span className="checkbox-text">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 医院来源筛选 */}
                <div className="filter-group">
                  <label className="filter-label">医院来源</label>
                  <div className="filter-options">
                    {allSources.map((source) => (
                      <label key={source} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedSources.includes(source)}
                          onChange={() => handleSourceChange(source)}
                          className="checkbox-input"
                        />
                        <span className="checkbox-text">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 图表容器 */}
            <div className="charts-container">
              {getChartConfigs && (
                <>
                  {/* 转化需求进度分布（仅单选转化需求类型时显示） */}
                  {getChartConfigs.transformProgress && (
                    <div className="chart-item chart-item-full" style={{ height: '350px', gridColumn: '1 / -1' }}>
                      <h3 className="chart-title">
                        转化需求进度分布 
                        <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280', marginLeft: '10px' }}>
                          (
                          {selectedTransformTypes.length === 1 && 
                            TRANSFORM_REQUIREMENT_LABELS[selectedTransformTypes[0] as keyof typeof TRANSFORM_REQUIREMENT_LABELS]
                          }
                          )
                        </span>
                      </h3>
                      <Bar data={getChartConfigs.transformProgress.data} options={getChartConfigs.transformProgress.options} />
                    </div>
                  )}
                  
                  <div className="chart-item" style={{ height: '350px' }}>
                    <h3 className="chart-title">部门分布</h3>
                    <Doughnut data={getChartConfigs.departments.data} options={getChartConfigs.departments.options} />
                  </div>
                  <div className="chart-item" style={{ height: '350px' }}>
                    <h3 className="chart-title">项目类型分布</h3>
                    <Bar data={getChartConfigs.projectTypes.data} options={getChartConfigs.projectTypes.options} />
                  </div>
                  <div className="chart-item" style={{ height: '350px' }}>
                    <h3 className="chart-title">来源分布</h3>
                    <Bar data={getChartConfigs.sources.data} options={getChartConfigs.sources.options} />
                  </div>
                  
                  {/* 转化金额统计卡片 */}
                  <div className="chart-item transform-amount-card" style={{ height: '350px' }}>
                    <h3 className="chart-title">转化金额统计</h3>
                    <div className="amount-summary">
                      <div className="amount-item">
                        <div className="amount-label">总计</div>
                        <div className="amount-value">{dashboardData?.overview.totalTransformAmount.toLocaleString()}<span className="amount-unit">万元</span></div>
                      </div>
                      <div className="amount-item">
                        <div className="amount-label">平均</div>
                        <div className="amount-value">{dashboardData?.overview.averageTransformAmount.toLocaleString()}<span className="amount-unit">万元</span></div>
                      </div>
                    </div>
                    <div style={{ height: '220px', marginTop: '20px' }}>
                      <Bar data={getChartConfigs.transformAmount.data} options={getChartConfigs.transformAmount.options} />
                    </div>
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

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #3b82f6;
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

        .refresh-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 24px;
          margin-bottom: 28px;
        }

        /* 筛选器区域 */
        .filters-section {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          margin-bottom: 28px;
          overflow: hidden;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 2px solid #e5e7eb;
        }

        .filters-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filters-title :global(svg) {
          color: #f59e0b;
        }

        .filters-title h2 {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .filters-actions {
          display: flex;
          gap: 12px;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .apply-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }

        .apply-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
        }

        .reset-btn {
          background: #f1f5f9;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .reset-btn:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        .filters-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          padding: 24px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filter-label {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          margin: 0;
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .checkbox-label:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .checkbox-input {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #f59e0b;
        }

        .checkbox-text {
          font-size: 14px;
          color: #334155;
          font-weight: 500;
        }

        .checkbox-label:has(.checkbox-input:checked) {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-color: #f59e0b;
        }

        .checkbox-label:has(.checkbox-input:checked) .checkbox-text {
          color: #92400e;
          font-weight: 600;
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

        .charts-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .chart-item {
          padding: 24px 24px 60px 24px;
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
          background: linear-gradient(135deg, #f7d2c4 0%, #f2c4b7 100%);
          border: 2px solid #f7a5a5;
        }

        .stat-card.purple .card-title {
          color: #7c3aed;
        }

        .stat-card.purple .card-header svg {
          color: #7c3aed;
        }

        .stat-card.purple .value {
          color: #7c3aed;
        }

        .stat-card.emerald {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-color: #6ee7b7;
        }

        .stat-card.emerald .card-icon {
          color: #10b981;
        }

        .stat-card.amber {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border-color: #fcd34d;
        }

        .stat-card.amber .card-icon {
          color: #f59e0b;
        }

        /* 转化金额统计卡片样式 */
        .transform-amount-card {
          display: flex;
          flex-direction: column;
        }

        .amount-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          border: 2px solid #e2e8f0;
        }

        .amount-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .amount-label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .amount-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .amount-unit {
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .stats-grid {
            gap: 16px;
          }

          .stat-card {
            padding: 18px;
          }

          .card-title {
            font-size: 13px;
          }

          .value {
            font-size: 28px;
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

          .stats-grid {
            gap: 12px;
          }

          .stat-card {
            padding: 12px;
          }

          .card-header {
            margin-bottom: 6px;
          }

          .card-header svg {
            width: 20px;
            height: 20px;
          }

          .card-title {
            font-size: 12px;
          }

          .value {
            font-size: 20px;
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
