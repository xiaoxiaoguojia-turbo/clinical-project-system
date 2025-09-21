import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { 
  ChartBarIcon,
  DocumentTextIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/layout/DashboardLayout'
import { TokenManager } from '@/utils/auth'

const DashboardPage: NextPage = () => {
  /* ------------------------------------------------------------------------------------------ */
  // 状态和路由管理
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [projectType, setProjectType] = useState('all')
  const currentUser = TokenManager.getUser()
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
  // 生命周期函数
  useEffect(() => {
    // 检查认证状态
    if (!TokenManager.isAuthenticated()) {
      router.push('/login')
      return
    }

    // 加载dashboard数据
    loadDashboardData()
  }, [router, timeRange, projectType])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // 这里将来会调用真实的API
      // const response = await ApiClient.get('/api/dashboard/statistics', { timeRange, projectType })
      
      // 模拟数据
      setTimeout(() => {
        setDashboardData({
          totalProjects: 12,
          activeProjects: 7,
          completedProjects: 5,
          totalBudget: 256000,
          departments: 8,
          researchers: 15
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('加载dashboard数据失败:', error)
      setLoading(false)
    }
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 事件处理函数
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
  }

  const handleProjectTypeChange = (type: string) => {
    setProjectType(type)
  }

  const handleExportData = () => {
    // 导出数据功能
    console.log('导出数据')
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 统计卡片数据
  const statisticsCards = [
    {
      title: '总项目数',
      value: dashboardData.totalProjects,
      icon: FolderIcon,
      color: 'blue',
      trend: '+12%',
      description: '相比上月'
    },
    {
      title: '进行中项目',
      value: dashboardData.activeProjects,
      icon: ChartBarIcon,
      color: 'green',
      trend: '+8%',
      description: '相比上月'
    },
    {
      title: '已完成项目',
      value: dashboardData.completedProjects,
      icon: DocumentTextIcon,
      color: 'purple',
      trend: '+5%',
      description: '相比上月'
    },
    {
      title: '总预算金额',
      value: `¥${(dashboardData.totalBudget / 10000).toFixed(0)}万`,
      icon: CalendarIcon,
      color: 'yellow',
      trend: '+15%',
      description: '相比上月'
    },
    {
      title: '参与部门',
      value: dashboardData.departments,
      icon: UsersIcon,
      color: 'indigo',
      trend: '+2',
      description: '新增部门'
    },
    {
      title: '研究人员',
      value: dashboardData.researchers,
      icon: UsersIcon,
      color: 'pink',
      trend: '+23',
      description: '新增人员'
    }
  ]

  // 时间范围选项
  const timeRangeOptions = [
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'quarter', label: '本季度' },
    { value: 'year', label: '本年度' }
  ]

  // 项目类型选项
  const projectTypeOptions = [
    { value: 'all', label: '全部项目' },
    { value: 'hospital-preparation', label: '院内制剂' },
    { value: 'clinical-trial', label: '临床试验' },
    { value: 'research', label: '科研项目' }
  ]
  /* ------------------------------------------------------------------------------------------ */

  if (!TokenManager.isAuthenticated()) {
    return null
  }

  return (
    <DashboardLayout title="项目报表统计分析 - 临床创新项目管理系统">
      <div className="dashboard-page">
        {/* 页面标题和操作区域 */}
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">项目报表统计分析</h1>
            <p className="page-description">
              欢迎回来，{currentUser?.realName || currentUser?.username}！
              这里是您的项目概览和数据分析。
            </p>
          </div>
          
          <div className="header-actions">
            <button onClick={handleExportData} className="export-button">
              <DocumentTextIcon className="w-5 h-5" />
              导出报表
            </button>
          </div>
        </div>

        {/* 过滤器区域 */}
        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">
              <CalendarIcon className="w-4 h-4" />
              时间范围：
            </label>
            <select 
              value={timeRange} 
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="filter-select"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <FunnelIcon className="w-4 h-4" />
              项目类型：
            </label>
            <select 
              value={projectType} 
              onChange={(e) => handleProjectTypeChange(e.target.value)}
              className="filter-select"
            >
              {projectTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 统计卡片区域 */}
        <div className="statistics-grid">
          {statisticsCards.map((card, index) => (
            <div key={index} className={`stat-card ${card.color}`}>
              <div className="card-header">
                <div className="card-icon">
                  <card.icon className="w-6 h-6" />
                </div>
                <div className="card-trend">
                  <span className="trend-value">{card.trend}</span>
                  <span className="trend-desc">{card.description}</span>
                </div>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <div className="card-value">
                  {loading ? (
                    <div className="loading-skeleton"></div>
                  ) : (
                    <span>{card.value}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 图表区域占位 */}
        <div className="charts-section">
          <div className="chart-placeholder">
            <ChartBarIcon className="w-16 h-16" />
            <h3>图表区域</h3>
            <p>这里将显示详细的数据图表和分析</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-left {
          flex: 1;
        }

        .page-title {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .page-description {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .header-actions {
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
          transition: all 0.2s ease;
        }

        .export-button:hover {
          background: #1d4ed8;
        }

        .filter-section {
          display: flex;
          gap: 24px;
          margin-bottom: 32px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          white-space: nowrap;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          color: #374151;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .statistics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease;
          border-left: 4px solid;
        }

        .stat-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .stat-card.blue { border-left-color: #3b82f6; }
        .stat-card.green { border-left-color: #10b981; }
        .stat-card.purple { border-left-color: #8b5cf6; }
        .stat-card.yellow { border-left-color: #f59e0b; }
        .stat-card.indigo { border-left-color: #6366f1; }
        .stat-card.pink { border-left-color: #ec4899; }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          color: #6b7280;
        }

        .blue .card-icon { background: #dbeafe; color: #3b82f6; }
        .green .card-icon { background: #d1fae5; color: #10b981; }
        .purple .card-icon { background: #ede9fe; color: #8b5cf6; }
        .yellow .card-icon { background: #fef3c7; color: #f59e0b; }
        .indigo .card-icon { background: #e0e7ff; color: #6366f1; }
        .pink .card-icon { background: #fce7f3; color: #ec4899; }

        .card-trend {
          text-align: right;
        }

        .trend-value {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #10b981;
          margin-bottom: 2px;
        }

        .trend-desc {
          display: block;
          font-size: 12px;
          color: #6b7280;
        }

        .card-content {
          margin-bottom: 0;
        }

        .card-title {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 8px 0;
          font-weight: 500;
        }

        .card-value {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }

        .loading-skeleton {
          height: 32px;
          background: #f3f4f6;
          border-radius: 6px;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .charts-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .chart-placeholder {
          text-align: center;
          padding: 80px 20px;
          color: #9ca3af;
        }

        .chart-placeholder h3 {
          font-size: 20px;
          margin: 16px 0 8px 0;
        }

        .chart-placeholder p {
          font-size: 14px;
          margin: 0;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .filter-section {
            flex-direction: column;
            gap: 16px;
          }

          .statistics-grid {
            grid-template-columns: 1fr;
          }

          .page-title {
            font-size: 24px;
          }
        }
      `}</style>
    </DashboardLayout>
  )
}

export default DashboardPage
