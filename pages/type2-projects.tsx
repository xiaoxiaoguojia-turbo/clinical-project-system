import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { 
  CalendarIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  BuildingOffice2Icon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  PaperClipIcon,
  SparklesIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  StarIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { 
  ApiResponse, 
  PaginatedResponse 
} from '@/types'
import { TokenManager } from '@/utils/auth'

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

/* ------------------------------------------------------------------------------------------ */

// 类型2项目接口定义
interface Type2Project {
  _id: string
  department: string
  source: string
  name: string
  category: string                           // 分类
  leader: string                            // 负责人
  startDate: string                         // 开始日期
  indication: string                        // 适应症/科室
  followUpWeeks: number                     // 跟进时间/周
  importance: 'very-important' | 'important' | 'normal'  // 重要程度
  status: 'initial-assessment' | 'project-approval' | 'implementation'  // 状态
  transformMethod: string                   // 转化方式/需求
  hospitalPI: string                        // 院端PI
  projectConclusion: string                 // 项目结论
  attachments: string[]
  createTime: string
  updateTime: string
  createdBy?: string
  aiReport?: {
    status: 'idle' | 'generating' | 'completed' | 'error'
    reportUrl?: string
    firstGeneratedAt?: string
    lastGeneratedAt?: string
  }
}

interface Type2Stats {
  totalCount: number
  statusCounts: {
    'initial-assessment': number
    'project-approval': number
    'implementation': number
  }
  importanceCounts: {
    'very-important': number
    'important': number
    'normal': number
  }
  departmentCounts: { [key: string]: number }
  categoryCounts: { [key: string]: number }
  leaderCounts: { [key: string]: number }
  monthlyStats: { month: string; count: number }[]
}

/* ------------------------------------------------------------------------------------------ */

const Type2ProjectsPage: React.FC = () => {
  // 基础状态
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'statistics' | 'projects'>('statistics')
  
  // 数据状态
  const [projects, setProjects] = useState<Type2Project[]>([])
  const [stats, setStats] = useState<Type2Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterImportance, setFilterImportance] = useState('')
  const [filterLeader, setFilterLeader] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // 模态框状态
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Type2Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Type2Project | null>(null)

  // 创建项目表单状态
  const [createFormData, setCreateFormData] = useState({
    source: '',
    name: '',
    category: '',
    leader: '',
    startDate: '',
    indication: '',
    followUpWeeks: 12,
    importance: 'normal' as 'very-important' | 'important' | 'normal',
    transformMethod: '',
    hospitalPI: '',
    projectConclusion: ''
  })
  const [createFormErrors, setCreateFormErrors] = useState<{[key: string]: string}>({})
  const [createFormLoading, setCreateFormLoading] = useState(false)

  // 编辑项目表单状态
  const [editFormData, setEditFormData] = useState({
    source: '',
    name: '',
    category: '',
    leader: '',
    startDate: '',
    indication: '',
    followUpWeeks: 12,
    importance: 'normal' as 'very-important' | 'important' | 'normal',
    status: 'initial-assessment' as 'initial-assessment' | 'project-approval' | 'implementation',
    transformMethod: '',
    hospitalPI: '',
    projectConclusion: ''
  })
  const [editFormErrors, setEditFormErrors] = useState<{[key: string]: string}>({})
  const [editFormLoading, setEditFormLoading] = useState(false)

  const router = useRouter()

  /* ------------------------------------------------------------------------------------------ */
  
  // 认证检查和数据加载
  useEffect(() => {
    setMounted(true)
    
    const checkAuth = async () => {
      try {
        if (!TokenManager.isAuthenticated()) {
          window.location.href = '/login'
          return
        }
        
        setIsAuthenticated(true)
        await loadProjectsData()
      } catch (error) {
        console.error('认证检查失败:', error)
        window.location.href = '/login'
      }
    }

    checkAuth()
  }, [])

  // 加载项目数据
  const loadProjectsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await Promise.all([
        loadProjectsList(),
        loadProjectsStats()
      ])
    } catch (error) {
      console.error('加载数据失败:', error)
      setError('加载数据失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 未完待续...后续将继续实现更多功能
  
  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="type2-projects-page">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title">
                <AcademicCapIcon className="w-8 h-8" />
                类型2项目管理
              </h1>
              <p className="page-subtitle">管理和监控类型2项目的进展情况</p>
            </div>
            <button 
              className="create-button"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusIcon className="w-5 h-5" />
              新建项目
            </button>
          </div>
        </div>

        {/* 标签栏 */}
        <div className="tab-bar">
          <button 
            className={`tab-button ${activeTab === 'statistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistics')}
          >
            <ChartBarIcon className="w-4 h-4" />
            统计报表
          </button>
          <button 
            className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <ClipboardDocumentListIcon className="w-4 h-4" />
            项目列表
          </button>
        </div>

        {/* 内容区域 */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>正在加载数据...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <ExclamationTriangleIcon className="w-12 h-12" />
            <p>{error}</p>
            <button onClick={loadProjectsData} className="retry-button">
              重试
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'statistics' && (
              <div className="statistics-content">
                <p>统计报表内容（待实现）</p>
              </div>
            )}
            
            {activeTab === 'projects' && (
              <div className="projects-content">
                <p>项目列表内容（待实现）</p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .type2-projects-page {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .title-section {
          flex: 1;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .create-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .create-button:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .tab-bar {
          display: flex;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }

        .tab-button:hover {
          color: #3b82f6;
          background: #f3f4f6;
        }

        .tab-button.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #ef4444;
        }

        .retry-button {
          margin-top: 16px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 10px 20px;
          cursor: pointer;
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

export default Type2ProjectsPage
