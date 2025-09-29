import React, { useState, useEffect, useCallback, useMemo } from 'react'
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
  ClockIcon,
  BeakerIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
  CubeIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import { 
  ApiResponse, 
  PaginatedResponse,
  UnifiedProject 
} from '@/types'
import { TokenManager, ApiClient } from '@/utils/auth'

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

// 项目类型配置接口
interface ProjectTypeConfig {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

// 项目类型配置
const PROJECT_TYPES: ProjectTypeConfig[] = [
  {
    key: 'ai-medical-research',
    label: 'AI医疗及系统研究',
    icon: ComputerDesktopIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    key: 'diagnostic-detection',
    label: '检测诊断',
    icon: EyeIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    key: 'cell-therapy',
    label: '细胞治疗',
    icon: BeakerIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    key: 'drug',
    label: '药物研发',
    icon: CpuChipIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    key: 'medical-device',
    label: '医疗器械',
    icon: WrenchScrewdriverIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    key: 'medical-material',
    label: '医用材料',
    icon: CubeIcon,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  },
  {
    key: 'other',
    label: '其他项目',
    icon: SparklesIcon,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  }
]

/* ------------------------------------------------------------------------------------------ */

// 统计数据接口
interface ProjectStats {
  totalCount: number
  statusCounts: {
    'early-stage': number
    'preclinical': number
    'clinical-stage': number
    'market-product': number
  }
  importanceCounts: {
    'very-important': number
    'important': number
    'normal': number
    'not-important': number
  }
  departmentCounts: { [key: string]: number }
  leaderCounts: { [key: string]: number }
  monthlyStats: { month: string; count: number }[]
}

// 筛选条件接口
interface ProjectFilters {
  status: string
  importance: string
  leader: string
}

// 表单数据接口
interface ProjectFormData {
  department: string
  source: string
  name: string
  leader: string
  startDate: string
  indication: string
  followUpWeeks: string
  importance: 'very-important' | 'important' | 'normal' | 'not-important'
  status: 'early-stage' | 'preclinical' | 'clinical-stage' | 'market-product'
  transformRequirement: string
  hospitalDoctor: string
  conclusion: string
}

/* ------------------------------------------------------------------------------------------ */

const OtherProjectsPage: React.FC = () => {
    const router = useRouter()
    
    // 获取当前项目类型
    const currentProjectType = useMemo(() => {
      const type = router.query.type as string
      return PROJECT_TYPES.find(t => t.key === type) || PROJECT_TYPES[0]
    }, [router.query.type])
    
    // 基础状态
    const [mounted, setMounted] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [activeTab, setActiveTab] = useState<'statistics' | 'projects'>('statistics')
    
    // 数据状态
    const [projects, setProjects] = useState<UnifiedProject[]>([])
    const [stats, setStats] = useState<ProjectStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
  
    // 分页状态
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [totalPages, setTotalPages] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
  
    // 搜索和筛选状态
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [filters, setFilters] = useState<ProjectFilters>({
      status: '',
      importance: '',
      leader: ''
    })
  
    // 模态框状态
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editingProject, setEditingProject] = useState<UnifiedProject | null>(null)
    const [deletingProjectId, setDeletingProjectId] = useState<string>('')
    const [showViewModal, setShowViewModal] = useState(false)
    const [viewingProject, setViewingProject] = useState<UnifiedProject | null>(null)
  
    // 表单数据状态
    const [formData, setFormData] = useState<ProjectFormData>({
      department: 'transfer-investment-dept-1', // 使用正确的英文enum值，对应转移转化与投资一部
      source: '',
      name: '',
      leader: '',
      startDate: '',
      indication: '',
      followUpWeeks: '12',
      importance: 'normal',
      status: 'early-stage',
      transformRequirement: '',
      hospitalDoctor: '',
      conclusion: ''
    })

    // 部门选项数据定义
    const departmentOptions = [
      { value: 'transfer-investment-dept-1', label: '转移转化与投资一部' },
      { value: 'transfer-investment-dept-2', label: '转移转化与投资二部' },
      { value: 'transfer-investment-dept-3', label: '转移转化与投资三部' }
    ]

    /* ------------------------------------------------------------------------------------------ */
    
    // 认证检查和数据加载
    useEffect(() => {
      setMounted(true)
      
      const checkAuth = async () => {
        try {
          if (!TokenManager.isAuthenticated()) {
            router.push('/login')
            return
          }
          
          setIsAuthenticated(true)
          await loadProjectsData()
        } catch (error) {
          console.error('认证检查失败:', error)
          router.push('/login')
        }
      }
  
      checkAuth()
    }, [router])
  
    // 搜索和筛选变化时重新加载数据
    useEffect(() => {
      if (isAuthenticated) {
        const timeoutId = setTimeout(() => {
          setCurrentPage(1)
          loadProjectsList()
        }, 300)
        return () => clearTimeout(timeoutId)
      }
    }, [searchQuery, filters, isAuthenticated])
  
    // 分页变化时重新加载数据
    useEffect(() => {
      if (isAuthenticated) {
        loadProjectsList()
      }
    }, [currentPage, isAuthenticated])
  
    // 搜索防抖处理
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setDebouncedSearchQuery(searchQuery)
      }, 300)
      return () => clearTimeout(timeoutId)
    }, [searchQuery])

    // 项目类型切换时重置和重新加载数据
    useEffect(() => {
      if (isAuthenticated && currentProjectType && mounted) {
        setCurrentPage(1)
        setSearchQuery('')
        setDebouncedSearchQuery('')
        setFilters({ status: '', importance: '', leader: '' })
        setProjects([])
        setStats(null)
        loadProjectsData()
      }
    }, [currentProjectType.key, isAuthenticated, mounted])

    // 搜索和筛选变化时重新加载数据
    useEffect(() => {
      if (isAuthenticated && mounted) {
        setCurrentPage(1)
        loadProjectsList()
      }
    }, [debouncedSearchQuery, filters, isAuthenticated, mounted])
  
    /* ------------------------------------------------------------------------------------------ */

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

    // 加载项目列表
    const loadProjectsList = async () => {
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: pageSize.toString(),
                projectType: currentProjectType.key
            })

            // 添加搜索和筛选参数
            if (debouncedSearchQuery.trim()) {
              params.append('search', debouncedSearchQuery.trim())
            }
            if (filters.status) {
              params.append('status', filters.status)
            }
            if (filters.importance) {
              params.append('importance', filters.importance)
            }
            if (filters.leader) {
              params.append('leader', filters.leader)
            }

            const response: ApiResponse<PaginatedResponse<UnifiedProject>> = await ApiClient.get<ApiResponse<PaginatedResponse<UnifiedProject>>>(`/projects?${params}`)

            if (response.success && response.data) {
                setProjects(response.data.data)
                setTotalCount(response.data.pagination.total)
                setTotalPages(response.data.pagination.totalPages)
                setError(null)
            } else {
                throw new Error(response.error || `获取${currentProjectType.label}列表失败`)
            }
        } catch (error) {
            console.error('加载项目列表失败:', error)
            const errorMessage = error instanceof Error ? error.message : `获取${currentProjectType.label}列表失败`
            setError(errorMessage)
            setProjects([])
            setTotalCount(0)
            setTotalPages(0)
        }
    }

    // 加载统计数据
    const loadProjectsStats = async () => {
        try {
            const params = new URLSearchParams({
                projectType: currentProjectType.key,
                limit: '1000'
            })

            const response: ApiResponse<PaginatedResponse<UnifiedProject>> = await ApiClient.get<ApiResponse<PaginatedResponse<UnifiedProject>>>(`/projects?${params}`)

            if (response.success && response.data) {
                const allProjects = response.data.data

                // 计算统计数据
                const stats: ProjectStats = {
                    totalCount: allProjects.length,
                    statusCounts: {
                        'early-stage': 0,
                        'preclinical': 0,
                        'clinical-stage': 0,
                        'market-product': 0
                    },
                    importanceCounts: {
                        'very-important': 0,
                        'important': 0,
                        'normal': 0,
                        'not-important': 0
                    },
                    departmentCounts: {},
                    leaderCounts: {},
                    monthlyStats: []
                }

                allProjects.forEach((project: UnifiedProject) => {
                    // 状态统计
                    if (project.status && stats.statusCounts[project.status] !== undefined) {
                        stats.statusCounts[project.status]++
                    }

                    // 重要程度统计  
                    if (project.importance && stats.importanceCounts[project.importance] !== undefined) {
                        stats.importanceCounts[project.importance]++
                    }

                    // 部门统计
                    if (project.department) {
                        stats.departmentCounts[project.department] = (stats.departmentCounts[project.department] || 0) + 1
                    }

                    // 负责人统计
                    if (project.leader) {
                        stats.leaderCounts[project.leader] = (stats.leaderCounts[project.leader] || 0) + 1
                    }
                })

                // 月度统计 - 更安全的日期处理
                const monthlyMap: { [key: string]: number } = {}
                allProjects.forEach((project: UnifiedProject) => {
                    try {
                        const createDate = new Date(project.createTime)
                        if (!isNaN(createDate.getTime())) {
                            const month = createDate.toLocaleDateString('zh-CN', { 
                                year: 'numeric', 
                                month: '2-digit' 
                            })
                            monthlyMap[month] = (monthlyMap[month] || 0) + 1
                        }
                    } catch (e) {
                        console.warn('无效的创建时间格式:', project.createTime)
                    }
                })

                stats.monthlyStats = Object.entries(monthlyMap)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .slice(-12)
                  .map(([month, count]) => ({ month, count }))

                setStats(stats)
                setError(null)
            } else {
                throw new Error(response.error || `获取${currentProjectType.label}统计数据失败`)
            }
        } catch (error) {
            console.error('加载统计数据失败:', error)
            const errorMessage = error instanceof Error ? error.message : `获取${currentProjectType.label}统计数据失败`
            setError(errorMessage)
        }
    }

    /* ------------------------------------------------------------------------------------------ */

    // 分页处理
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
      }, [])
    
      // 获取分页页码
      const getPaginationPages = useCallback(() => {
        const pages: number[] = []
        const maxVisible = 5
        
        if (totalPages <= maxVisible) {
          for (let i = 1; i <= totalPages; i++) {
            pages.push(i)
          }
        } else {
          const start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
          const end = Math.min(totalPages, start + maxVisible - 1)
          
          for (let i = start; i <= end; i++) {
            pages.push(i)
          }
        }
        
        return pages
      }, [currentPage, totalPages])
    
      // 重置表单
      const resetForm = useCallback(() => {
        setFormData({
          department: 'transfer-investment-dept-1', // 使用正确的英文enum值
          source: '',
          name: '',
          leader: '',
          startDate: '',
          indication: '',
          followUpWeeks: '12',
          importance: 'normal',
          status: 'early-stage',
          transformRequirement: '',
          hospitalDoctor: '',
          conclusion: ''
        })
      }, [])
    
      // 处理创建项目
      const handleCreateProject = useCallback(() => {
        resetForm()
        setShowCreateModal(true)
      }, [resetForm])
    
      // 处理编辑项目
      const handleEditProject = useCallback((project: UnifiedProject) => {
        setFormData({
          department: project.department || 'transfer-investment-dept-1', // 使用正确的英文enum值
          source: project.source || '',
          name: project.name || '',
          leader: project.leader || '',
          startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
          indication: project.indication || '',
          followUpWeeks: project.followUpWeeks?.toString() || '12',
          importance: project.importance || 'normal',
          status: project.status || 'early-stage',
          transformRequirement: project.transformRequirement || '',
          hospitalDoctor: project.hospitalDoctor || '',
          conclusion: project.conclusion || ''
        })
        setEditingProject(project)
        setShowEditModal(true)
      }, [])
    
      // 处理删除项目
      const handleDeleteProject = useCallback((projectId: string) => {
        setDeletingProjectId(projectId)
        setShowDeleteModal(true)
      }, [])
    
      // 处理查看项目详情
      const handleViewProject = useCallback((project: UnifiedProject) => {
        setViewingProject(project)
        setShowViewModal(true)
      }, [])
    
      // 处理附件管理
      const handleAttachments = useCallback((projectId: string) => {
        router.push(`/attachments?projectId=${projectId}&projectType=${currentProjectType.key}`)
      }, [router, currentProjectType.key])
    
      // 处理AI报告生成（暂时禁用）
      const handleGenerateReport = useCallback((projectId: string) => {
        alert('AI报告功能暂未开放，敬请期待！')
      }, [])
    
      // 处理查看AI报告（暂时禁用）
      const handleViewReport = useCallback((projectId: string) => {
        alert('AI报告功能暂未开放，敬请期待！')
      }, [])
    
    /* ------------------------------------------------------------------------------------------ */

    // 表单提交处理
    const handleSubmitProject = async (e: React.FormEvent) => {
        e.preventDefault()
    
        if (showCreateModal) {
          await handleCreateSubmit()
        } else if (showEditModal) {
          await handleEditSubmit()
        }
    }

    // 数据验证函数
    const validateFormData = (data: ProjectFormData): string | null => {
      if (!data.name.trim()) return '项目名称不能为空'
      // 移除部门验证，因为有默认值和下拉选择
      if (!data.source.trim()) return '项目来源不能为空'
      
      // 非院内制剂项目的特殊验证
      if (currentProjectType.key !== 'internal-preparation') {
        if (!data.leader.trim()) return '负责人不能为空'
        if (!data.startDate.trim()) return '开始日期不能为空'
        if (!data.transformRequirement.trim()) return '转化需求不能为空'
      }
      
      return null
    }

    // 创建项目提交
    const handleCreateSubmit = async () => {
      try {
        setLoading(true)

        // 数据验证
        const validationError = validateFormData(formData)
        if (validationError) {
          alert(validationError)
          return
        }

        const submitData = {
          ...formData,
          followUpWeeks: parseInt(formData.followUpWeeks) || 12,
          projectType: currentProjectType.key
        }

        const response = await ApiClient.post<ApiResponse<UnifiedProject>>('/projects', submitData)

        if (response.success) {
          setShowCreateModal(false)
          resetForm()
          await loadProjectsData()
          alert(`${currentProjectType.label}创建成功！`)
        } else {
          throw new Error(response.error || `创建${currentProjectType.label}失败`)
        }
      } catch (error) {
        console.error('创建项目失败:', error)
        const errorMessage = error instanceof Error ? error.message : `创建${currentProjectType.label}失败，请重试`
        alert(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    // 编辑项目提交
    const handleEditSubmit = async () => {
      if (!editingProject) return

      try {
        setLoading(true)

        // 数据验证
        const validationError = validateFormData(formData)
        if (validationError) {
          alert(validationError)
          return
        }

        const submitData = {
          ...formData,
          followUpWeeks: parseInt(formData.followUpWeeks) || 12,
          projectType: currentProjectType.key
        }

        const response = await ApiClient.put<ApiResponse<UnifiedProject>>(`/projects/${editingProject._id}`, submitData)

        if (response.success) {
          setShowEditModal(false)
          setEditingProject(null)
          resetForm()
          await loadProjectsData()
          alert(`${currentProjectType.label}更新成功！`)
        } else {
          throw new Error(response.error || `更新${currentProjectType.label}失败`)
        }
      } catch (error) {
        console.error('更新项目失败:', error)
        const errorMessage = error instanceof Error ? error.message : `更新${currentProjectType.label}失败，请重试`
        alert(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    // 确认删除项目
    const confirmDeleteProject = async () => {
      if (!deletingProjectId) return

      try {
        setLoading(true)

        const response = await ApiClient.delete<ApiResponse<void>>(`/projects/${deletingProjectId}`)

        if (response.success) {
          setShowDeleteModal(false)
          setDeletingProjectId('')
          await loadProjectsData()
          alert(`${currentProjectType.label}删除成功！`)
        } else {
          throw new Error(response.error || `删除${currentProjectType.label}失败`)
        }
      } catch (error) {
        console.error('删除项目失败:', error)
        const errorMessage = error instanceof Error ? error.message : `删除${currentProjectType.label}失败，请重试`
        alert(errorMessage)
      } finally {
        setLoading(false)
      }
    }

  /* ------------------------------------------------------------------------------------------ */

  // 计算可用的筛选选项
  const availableLeaders = useMemo(() => {
    const leaders = new Set<string>()
    projects.forEach(project => {
      if (project.leader) {
        leaders.add(project.leader)
      }
    })
    return Array.from(leaders).sort()
  }, [projects])

  /* ------------------------------------------------------------------------------------------ */

  // 组件挂载检查
  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="other-projects-page">
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <h1>{currentProjectType.label}</h1>
              <p>管理和监控{currentProjectType.label}的进展情况</p>
            </div>
            <button 
              className="create-button"
              onClick={handleCreateProject}
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
            <ChartBarIcon className="w-5 h-5" />
            统计报表
          </button>
          <button 
            className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <ClipboardDocumentListIcon className="w-5 h-5" />
            项目列表
          </button>
        </div>

        {/* 内容区域 */}
        <div className="main-content">
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
              {/* 统计报表内容 */}
              {activeTab === 'statistics' && (
                <div className="statistics-content">
                  {stats ? (
                    <>
                      {/* 关键指标卡片 */}
                      <div className="metrics-grid">
                        <div className="metric-card">
                          <div className="metric-icon">
                            <ChartBarIcon className="w-8 h-8" />
                          </div>
                          <div className="metric-content">
                            <h3 className="metric-value">{stats.totalCount}</h3>
                            <p className="metric-label">总项目数</p>
                          </div>
                        </div>

                        <div className="metric-card">
                          <div className="metric-icon progress">
                            <PlayCircleIcon className="w-8 h-8" />
                          </div>
                          <div className="metric-content">
                            <h3 className="metric-value">{stats.statusCounts['early-stage']}</h3>
                            <p className="metric-label">早期</p>
                          </div>
                        </div>

                        <div className="metric-card">
                          <div className="metric-icon success">
                            <CheckCircleIcon className="w-8 h-8" />
                          </div>
                          <div className="metric-content">
                            <h3 className="metric-value">{stats.statusCounts['clinical-stage']}</h3>
                            <p className="metric-label">临床阶段</p>
                          </div>
                        </div>

                        <div className="metric-card">
                          <div className="metric-icon important">
                            <StarIcon className="w-8 h-8" />
                          </div>
                          <div className="metric-content">
                            <h3 className="metric-value">{stats.importanceCounts['very-important']}</h3>
                            <p className="metric-label">非常重要项目</p>
                          </div>
                        </div>
                      </div>

                      {/* 图表区域 */}
                      <div className="charts-grid">
                        {/* 项目状态分布 */}
                        <div className="chart-card">
                          <div className="chart-header">
                            <h3 className="chart-title">项目状态分布</h3>
                            <ChartBarIcon className="w-5 h-5" />
                          </div>
                          <div className="chart-content">
                            <div className="status-chart">
                              <div className="status-item">
                                <div className="status-bar">
                                  <div 
                                    className="status-fill early-stage"
                                    style={{ 
                                      width: `${stats.totalCount > 0 ? (stats.statusCounts['early-stage'] / stats.totalCount * 100) : 0}%` 
                                    }}
                                  ></div>
                                </div>
                                <div className="status-info">
                                  <span className="status-label">早期</span>
                                  <span className="status-count">{stats.statusCounts['early-stage']}</span>
                                </div>
                              </div>

                              <div className="status-item">
                                <div className="status-bar">
                                  <div 
                                    className="status-fill preclinical"
                                    style={{ 
                                      width: `${stats.totalCount > 0 ? (stats.statusCounts.preclinical / stats.totalCount * 100) : 0}%` 
                                    }}
                                  ></div>
                                </div>
                                <div className="status-info">
                                  <span className="status-label">临床前</span>
                                  <span className="status-count">{stats.statusCounts.preclinical}</span>
                                </div>
                              </div>

                              <div className="status-item">
                                <div className="status-bar">
                                  <div 
                                    className="status-fill clinical-stage"
                                    style={{ 
                                      width: `${stats.totalCount > 0 ? (stats.statusCounts['clinical-stage'] / stats.totalCount * 100) : 0}%` 
                                    }}
                                  ></div>
                                </div>
                                <div className="status-info">
                                  <span className="status-label">临床阶段</span>
                                  <span className="status-count">{stats.statusCounts['clinical-stage']}</span>
                                </div>
                              </div>

                              <div className="status-item">
                                <div className="status-bar">
                                  <div 
                                    className="status-fill market-product"
                                    style={{ 
                                      width: `${stats.totalCount > 0 ? (stats.statusCounts['market-product'] / stats.totalCount * 100) : 0}%` 
                                    }}
                                  ></div>
                                </div>
                                <div className="status-info">
                                  <span className="status-label">上市产品</span>
                                  <span className="status-count">{stats.statusCounts['market-product']}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 重要程度分布 */}
                        <div className="chart-card">
                          <div className="chart-header">
                            <h3 className="chart-title">重要程度分布</h3>
                            <StarIcon className="w-5 h-5" />
                          </div>
                          <div className="chart-content">
                            <div className="importance-chart">
                              <div className="importance-item very-important">
                                <div className="importance-dot"></div>
                                <span className="importance-label">非常重要</span>
                                <span className="importance-count">{stats.importanceCounts['very-important']}</span>
                              </div>
                              <div className="importance-item important">
                                <div className="importance-dot"></div>
                                <span className="importance-label">重要</span>
                                <span className="importance-count">{stats.importanceCounts.important}</span>
                              </div>
                              <div className="importance-item normal">
                                <div className="importance-dot"></div>
                                <span className="importance-label">一般</span>
                                <span className="importance-count">{stats.importanceCounts.normal}</span>
                              </div>
                              <div className="importance-item not-important">
                                <div className="importance-dot"></div>
                                <span className="importance-label">不重要</span>
                                <span className="importance-count">{stats.importanceCounts['not-important']}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 负责人工作量 */}
                        <div className="chart-card">
                          <div className="chart-header">
                            <h3 className="chart-title">负责人工作量</h3>
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <div className="chart-content">
                            <div className="leader-list">
                              {Object.entries(stats.leaderCounts)
                                .sort(([,a], [,b]) => b - a)
                                .slice(0, 10)
                                .map(([leader, count]) => (
                                  <div key={leader} className="leader-item">
                                    <span className="leader-name">{leader}</span>
                                    <div className="leader-bar">
                                      <div 
                                        className="leader-fill"
                                        style={{ 
                                          width: `${Math.max(count / Math.max(...Object.values(stats.leaderCounts)) * 100, 5)}%` 
                                        }}
                                      ></div>
                                    </div>
                                    <span className="leader-count">{count}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 月度趋势 */}
                      {stats.monthlyStats.length > 0 && (
                        <div className="trend-section">
                          <div className="chart-card full-width">
                            <div className="chart-header">
                              <h3 className="chart-title">项目创建趋势</h3>
                              <CalendarIcon className="w-5 h-5" />
                            </div>
                            <div className="chart-content">
                              <div className="monthly-chart">
                                {stats.monthlyStats.map(({ month, count }) => (
                                  <div key={month} className="month-item">
                                    <div className="month-bar">
                                      <div 
                                        className="month-fill"
                                        style={{ 
                                          height: `${Math.max(count / Math.max(...stats.monthlyStats.map(s => s.count)) * 100, 10)}%` 
                                        }}
                                      ></div>
                                    </div>
                                    <span className="month-label">{month}</span>
                                    <span className="month-count">{count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="stats-loading">
                      <div className="loading-spinner"></div>
                      <p>正在加载统计数据...</p>
                    </div>
                  )}
                </div>
              )}

              {/* 项目列表内容 */}
              {activeTab === 'projects' && (
                <div className="projects-content">
                  {/* 搜索和筛选栏 */}
                  <div className="filter-section">
                    <div className="filter-row">
                      {/* 搜索框 */}
                      <div className="search-box">
                        <MagnifyingGlassIcon className="w-5 h-5" />
                        <input
                          type="text"
                          placeholder="搜索项目名称、负责人、院端PI..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="search-input"
                        />
                      </div>

                      {/* 状态筛选 */}
                      <div className="filter-group">
                        <FunnelIcon className="w-4 h-4" />
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                          className="filter-select"
                        >
                          <option value="">全部状态</option>
                          <option value="early-stage">早期</option>
                          <option value="preclinical">临床前</option>
                          <option value="clinical-stage">临床阶段</option>
                          <option value="market-product">上市产品</option>
                        </select>
                      </div>

                      {/* 重要程度筛选 */}
                      <div className="filter-group">
                        <StarIcon className="w-4 h-4" />
                        <select
                          value={filters.importance}
                          onChange={(e) => setFilters(prev => ({ ...prev, importance: e.target.value }))}
                          className="filter-select"
                        >
                          <option value="">全部重要程度</option>
                          <option value="very-important">非常重要</option>
                          <option value="important">重要</option>
                          <option value="normal">一般</option>
                          <option value="not-important">不重要</option>
                        </select>
                      </div>

                      {/* 负责人筛选 */}
                      <div className="filter-group">
                        <UserIcon className="w-4 h-4" />
                        <select
                          value={filters.leader}
                          onChange={(e) => setFilters(prev => ({ ...prev, leader: e.target.value }))}
                          className="filter-select"
                        >
                          <option value="">全部负责人</option>
                          {availableLeaders.map(leader => (
                            <option key={leader} value={leader}>{leader}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 项目列表 */}
                  {projects.length > 0 ? (
                    <div className="projects-table-container">
                      <table className="projects-table">
                        <thead>
                          <tr>
                            <th>项目名称</th>
                            <th>负责人</th>
                            <th>状态</th>
                            <th>重要程度</th>
                            <th>开始日期</th>
                            <th>跟进周期</th>
                            <th>院端医生</th>
                            <th>操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map((project) => (
                            <tr key={project._id} className="project-row">
                              <td className="project-name">
                                <div className="name-content">
                                  <h4>{project.name}</h4>
                                  {project.department && (
                                    <span className="department">{project.department}</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="leader-info">
                                  <UserIcon className="w-4 h-4" />
                                  <span>{project.leader}</span>
                                </div>
                              </td>
                              <td>
                                <span className={`status-badge ${project.status}`}>
                                  {project.status === 'early-stage' && '早期'}
                                  {project.status === 'preclinical' && '临床前'}
                                  {project.status === 'clinical-stage' && '临床阶段'}
                                  {project.status === 'market-product' && '上市产品'}
                                </span>
                              </td>
                              <td>
                                <span className={`importance-badge ${project.importance}`}>
                                  {project.importance === 'very-important' && (
                                    <>
                                      <StarIcon className="w-4 h-4" />
                                      非常重要
                                    </>
                                  )}
                                  {project.importance === 'important' && (
                                    <>
                                      <StarIcon className="w-4 h-4" />
                                      重要
                                    </>
                                  )}
                                  {project.importance === 'normal' && '一般'}
                                  {project.importance === 'not-important' && '不重要'}
                                </span>
                              </td>
                              <td>
                                {project.startDate ? new Date(project.startDate).toLocaleDateString('zh-CN') : '-'}
                              </td>
                              <td>
                                <span className="follow-up-weeks">
                                  {project.followUpWeeks || 0}周
                                </span>
                              </td>
                              <td>
                                {project.hospitalDoctor || '-'}
                              </td>
                              <td className="actions-cell">
                                <div className="action-buttons-group">
                                  <button
                                    onClick={() => handleViewProject(project)}
                                    className="action-btn view"
                                    title="查看详情"
                                  >
                                    <EyeIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditProject(project)}
                                    className="action-btn edit"
                                    title="编辑项目"
                                    disabled={!project._id}
                                  >
                                    <PencilIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => project._id && handleAttachments(project._id)}
                                    className="action-btn attachments"
                                    title="附件管理"
                                    disabled={!project._id}
                                  >
                                    <PaperClipIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => project._id && handleGenerateReport(project._id)}
                                    className="action-btn report"
                                    title="AI报告(暂未开放)"
                                    disabled
                                  >
                                    <DocumentTextIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => project._id && handleDeleteProject(project._id)}
                                    className="action-btn delete"
                                    title="删除项目"
                                    disabled={!project._id}
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <DocumentTextIcon className="w-16 h-16" />
                      <h3>暂无{currentProjectType.label}</h3>
                      <p>开始创建您的第一个{currentProjectType.label}吧</p>
                      <button
                        onClick={handleCreateProject}
                        className="empty-create-button"
                      >
                        <PlusIcon className="w-4 h-4" />
                        新建项目
                      </button>
                    </div>
                  )}

                  {/* 分页控件 */}
                  {projects.length > 0 && totalPages > 1 && (
                    <div className="pagination-section">
                      <div className="pagination-info">
                        共 {totalCount} 个项目，第 {currentPage} / {totalPages} 页
                      </div>
                      <div className="pagination-controls">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage <= 1}
                          className="page-button prev"
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                          上一页
                        </button>
                        
                        <div className="page-numbers">
                          {getPaginationPages().map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`page-number ${pageNum === currentPage ? 'active' : ''}`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                          className="page-button next"
                        >
                          下一页
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* 创建/编辑项目模态框 */}
        {(showCreateModal || showEditModal) && (
          <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false)
              setShowEditModal(false)
            }
          }}>
            <div className="modal-content">
              <div className="modal-header">
                <h2>{showCreateModal ? '新建' + currentProjectType.label : '编辑项目'}</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                  }}
                  className="modal-close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitProject} className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>项目名称 *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="请输入项目名称"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>部门 *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      required
                    >
                      {departmentOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>来源</label>
                    <input
                      type="text"
                      value={formData.source}
                      onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                      placeholder="请输入项目来源"
                    />
                  </div>

                  <div className="form-group">
                    <label>负责人 *</label>
                    <input
                      type="text"
                      value={formData.leader}
                      onChange={(e) => setFormData(prev => ({ ...prev, leader: e.target.value }))}
                      placeholder="请输入负责人"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>开始日期</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>适应症/科室</label>
                    <input
                      type="text"
                      value={formData.indication}
                      onChange={(e) => setFormData(prev => ({ ...prev, indication: e.target.value }))}
                      placeholder="请输入适应症/科室"
                    />
                  </div>

                  <div className="form-group">
                    <label>跟进时间(周)</label>
                    <input
                      type="number"
                      value={formData.followUpWeeks}
                      onChange={(e) => setFormData(prev => ({ ...prev, followUpWeeks: e.target.value }))}
                      placeholder="请输入跟进周数"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>重要程度 *</label>
                    <select
                      value={formData.importance}
                      onChange={(e) => setFormData(prev => ({ ...prev, importance: e.target.value as any }))}
                      required
                    >
                      <option value="">请选择重要程度</option>
                      <option value="very-important">非常重要</option>
                      <option value="important">重要</option>
                      <option value="normal">一般</option>
                      <option value="not-important">不重要</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>项目状态</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    >
                      <option value="early-stage">早期</option>
                      <option value="preclinical">临床前</option>
                      <option value="clinical-stage">临床阶段</option>
                      <option value="market-product">上市产品</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>转化需求</label>
                    <select
                      value={formData.transformRequirement}
                      onChange={(e) => setFormData(prev => ({ ...prev, transformRequirement: e.target.value }))}
                    >
                      <option value="">请选择转化需求</option>
                      <option value="license-transfer">许可转让</option>
                      <option value="equity-investment">代价入股</option>
                      <option value="trust-holding">代持</option>
                      <option value="trust-management">代持托管</option>
                      <option value="company-operation">公司化运营</option>
                      <option value="license-transfer-cash">许可转让现金</option>
                      <option value="to-be-determined">待定</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>院端医生</label>
                    <input
                      type="text"
                      value={formData.hospitalDoctor}
                      onChange={(e) => setFormData(prev => ({ ...prev, hospitalDoctor: e.target.value }))}
                      placeholder="请输入院端医生"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>项目结论</label>
                    <textarea
                      value={formData.conclusion}
                      onChange={(e) => setFormData(prev => ({ ...prev, conclusion: e.target.value }))}
                      placeholder="请输入项目结论"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false)
                      setShowEditModal(false)
                    }}
                  >
                    取消
                  </button>
                  <button className="btn-primary" disabled={loading}>
                    {loading ? '处理中...' : (showCreateModal ? '创建项目' : '保存修改')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 查看项目详情模态框 */}
        {showViewModal && viewingProject && (
          <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowViewModal(false)
            }
          }}>
            <div className="modal-content">
              <div className="modal-header">
                <h2>查看项目详情</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="modal-close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>项目名称</label>
                    <div className="readonly-field">{viewingProject.name || '-'}</div>
                  </div>

                  <div className="form-group">
                    <label>部门</label>
                    <div className="readonly-field">
                      {departmentOptions.find(opt => opt.value === viewingProject.department)?.label || viewingProject.department || '-'}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>来源</label>
                    <div className="readonly-field">{viewingProject.source || '-'}</div>
                  </div>

                  <div className="form-group">
                    <label>负责人</label>
                    <div className="readonly-field">{viewingProject.leader || '-'}</div>
                  </div>

                  <div className="form-group">
                    <label>开始日期</label>
                    <div className="readonly-field">
                      {viewingProject.startDate ? new Date(viewingProject.startDate).toLocaleDateString('zh-CN') : '-'}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>适应症/科室</label>
                    <div className="readonly-field">{viewingProject.indication || '-'}</div>
                  </div>

                  <div className="form-group">
                    <label>跟进时间(周)</label>
                    <div className="readonly-field">{viewingProject.followUpWeeks || '-'}</div>
                  </div>

                  <div className="form-group">
                    <label>重要程度</label>
                    <div className="readonly-field">
                      {viewingProject.importance === 'very-important' ? '非常重要' :
                       viewingProject.importance === 'important' ? '重要' :
                       viewingProject.importance === 'normal' ? '一般' :
                       viewingProject.importance === 'not-important' ? '不重要' : '-'}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>项目状态</label>
                    <div className="readonly-field">
                      {viewingProject.status === 'early-stage' ? '早期' :
                       viewingProject.status === 'preclinical' ? '临床前' :
                       viewingProject.status === 'clinical-stage' ? '临床阶段' :
                       viewingProject.status === 'market-product' ? '上市产品' : '-'}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>转化需求</label>
                    <div className="readonly-field">
                      {viewingProject.transformRequirement === 'license-transfer' ? '许可转让' :
                       viewingProject.transformRequirement === 'equity-investment' ? '代价入股' :
                       viewingProject.transformRequirement === 'trust-holding' ? '代持' :
                       viewingProject.transformRequirement === 'trust-management' ? '代持托管' :
                       viewingProject.transformRequirement === 'company-operation' ? '公司化运营' :
                       viewingProject.transformRequirement === 'license-transfer-cash' ? '许可转让现金' :
                       viewingProject.transformRequirement === 'to-be-determined' ? '待定' : '-'}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>院端医生</label>
                    <div className="readonly-field">{viewingProject.hospitalDoctor || '-'}</div>
                  </div>

                  <div className="form-group full-width">
                    <label>项目结论</label>
                    <div className="readonly-field readonly-textarea">
                      {viewingProject.conclusion || '-'}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>创建时间</label>
                    <div className="readonly-field">
                      {viewingProject.createTime ? new Date(viewingProject.createTime).toLocaleString('zh-CN') : '-'}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>更新时间</label>
                    <div className="readonly-field">
                      {viewingProject.updateTime ? new Date(viewingProject.updateTime).toLocaleString('zh-CN') : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 删除确认对话框 */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content small">
              <div className="modal-header">
                <h3>确认删除</h3>
                <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="modal-body">
                <div className="warning-content">
                  <ExclamationTriangleIcon className="w-12 h-12 warning-icon" />
                  <h3>确认删除项目</h3>
                  <p>您确定要删除这个项目吗？此操作无法撤销。</p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="cancel-btn"
                >
                  取消
                </button>
                <button
                  onClick={confirmDeleteProject}
                  className="danger-btn"
                  disabled={loading}
                >
                  <TrashIcon className="w-4 h-4" />
                  {loading ? '删除中...' : '确定删除'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .other-projects-page {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* ------------------------------------------------------------------------------------------ */
        /* 页面头部样式 */
        .page-header {
          margin-bottom: 32px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .title-section {
          flex: 1;
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
          margin-top: 20px;
        }

        .create-button:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        /* ------------------------------------------------------------------------------------------ */
        /* 标签栏样式 */
        .tab-bar {
          display: flex;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 32px;
          background: white;
          border-radius: 8px 8px 0 0;
          padding: 0 16px;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          padding: 16px 24px;
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

        /* ------------------------------------------------------------------------------------------ */
        /* 主要内容区域 */
        .main-content {
          background: white;
          border-radius: 0 0 8px 8px;
          min-height: 600px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
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

        /* ------------------------------------------------------------------------------------------ */
        /* 统计报表样式 */
        .statistics-content {
          padding: 24px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .metric-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s;
        }

        .metric-card:hover {
          transform: translateY(-2px);
        }

        .metric-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0f2fe;
          color: #0288d1;
        }

        .metric-icon.progress {
          background: #fff3e0;
          color: #f57c00;
        }

        .metric-icon.success {
          background: #e8f5e8;
          color: #388e3c;
        }

        .metric-icon.important {
          background: #fef7cd;
          color: #f59e0b;
        }

        .metric-content {
          flex: 1;
        }

        .metric-value {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .metric-label {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .chart-card.full-width {
          grid-column: 1 / -1;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .chart-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .chart-content {
          min-height: 200px;
        }

        /* 状态图表 */
        .status-chart {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .status-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .status-fill.early-stage {
          background: #f59e0b;
        }

        .status-fill.preclinical {
          background: #3b82f6;
        }

        .status-fill.clinical-stage {
          background: #10b981;
        }

        .status-fill.market-product {
          background: #8b5cf6;
        }

        .status-info {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;
        }

        .status-label {
          font-size: 14px;
          color: #374151;
        }

        .status-count {
          font-weight: 600;
          color: #1f2937;
        }

        /* 重要程度图表 */
        .importance-chart {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .importance-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .importance-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .importance-item.very-important .importance-dot {
          background: #ef4444;
        }

        .importance-item.important .importance-dot {
          background: #f59e0b;
        }

        .importance-item.normal .importance-dot {
          background: #6b7280;
        }

        .importance-item.not-important .importance-dot {
          background: #a3a3a3;
        }

        .importance-label {
          flex: 1;
          font-size: 14px;
          color: #374151;
        }

        .importance-count {
          font-weight: 600;
          color: #1f2937;
        }

        /* 负责人列表 */
        .leader-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .leader-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .leader-name {
          font-size: 14px;
          color: #374151;
        }

        .leader-count {
          font-weight: 600;
          color: #1f2937;
        }

        .leader-item {
          display: grid;
          grid-template-columns: 1fr 2fr auto;
          gap: 12px;
          align-items: center;
        }

        .leader-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .leader-fill {
          height: 100%;
          background: #3b82f6;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        /* 月度趋势图 */
        .trend-section {
          margin-top: 32px;
        }

        .monthly-chart {
          display: flex;
          align-items: end;
          gap: 12px;
          height: 200px;
          overflow-x: auto;
          padding: 20px 0;
        }

        .month-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          min-width: 60px;
        }

        .month-bar {
          width: 24px;
          height: 120px;
          background: #e5e7eb;
          border-radius: 4px;
          display: flex;
          align-items: end;
          overflow: hidden;
        }

        .month-fill {
          width: 100%;
          background: #3b82f6;
          border-radius: 4px 4px 0 0;
          transition: height 0.3s ease;
        }

        .month-label {
          font-size: 12px;
          color: #6b7280;
        }

        .month-count {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        /* ------------------------------------------------------------------------------------------ */
        /* 项目列表样式 */
        .projects-content {
          padding: 24px;
        }

        .filter-section {
          margin-bottom: 24px;
        }

        .filter-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 8px 12px;
          min-width: 300px;
          flex: 1;
        }

        .search-input {
          flex: 1;
          background: white;
          border: none;
          outline: none;
          font-size: 14px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 6px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 8px 12px;
        }

        .filter-select {
          border: none;
          outline: none;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        /* 项目表格 */
        .projects-table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .projects-table {
          width: 100%;
          border-collapse: collapse;
        }

        .projects-table th,
        .projects-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .projects-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .project-row:hover {
          background: #f9fafb;
        }

        .project-name {
          min-width: 200px;
        }

        .name-content h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .department {
          font-size: 12px;
          color: #6b7280;
        }

        .leader-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #374151;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.early-stage {
          background: #fef3c7;
          color: #d97706;
        }

        .status-badge.preclinical {
          background: #dbeafe;
          color: #2563eb;
        }

        .status-badge.clinical-stage {
          background: #d1fae5;
          color: #059669;
        }

        .status-badge.market-product {
          background: #ede9fe;
          color: #7c3aed;
        }

        .importance-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .importance-badge.very-important {
          color: #dc2626;
        }

        .importance-badge.important {
          color: #d97706;
        }

        .importance-badge.normal {
          color: #6b7280;
        }

        .importance-badge.not-important {
          color: #a3a3a3;
        }

        .follow-up-weeks {
          font-size: 14px;
          color: #374151;
        }

        .actions-cell {
          min-width: 180px;
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.view {
          background: #e0f2fe;
          color: #0288d1;
        }

        .action-btn.view:hover {
          background: #b3e5fc;
        }

        .action-btn.edit {
          background: #fff3e0;
          color: #f57c00;
        }

        .action-btn.edit:hover {
          background: #ffe0b2;
        }

        .action-btn.attachments {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .action-btn.attachments:hover {
          background: #e9d5ff;
        }

        .action-btn.report {
          background: #ecfdf5;
          color: #059669;
        }

        .action-btn.report:hover:not(:disabled) {
          background: #d1fae5;
        }

        .action-btn.report:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-btn.delete {
          background: #fef2f2;
          color: #dc2626;
        }

        .action-btn.delete:hover {
          background: #fee2e2;
        }

        /* 空状态 */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          color: #6b7280;
        }

        .empty-state h3 {
          margin: 16px 0 8px 0;
          font-size: 18px;
          color: #374151;
        }

        .empty-state p {
          margin: 0 0 24px 0;
          font-size: 14px;
        }

        .empty-create-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 14px;
          cursor: pointer;
        }

        /* 分页 */
        .pagination-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 24px;
          padding: 16px 0;
        }

        .pagination-info {
          font-size: 14px;
          color: #6b7280;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-button {
          display: flex;
          align-items: center;
          gap: 4px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 14px;
          cursor: pointer;
        }

        .page-button:hover:not(:disabled) {
          background: #f9fafb;
        }

        .page-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-numbers {
          display: flex;
          gap: 4px;
        }

        .page-number {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .page-number.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .page-number:hover:not(.active) {
          background: #f9fafb;
        }

        /* ------------------------------------------------------------------------------------------ */
        /* 模态框样式 */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-content.small {
          max-width: 420px;
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .modal-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f1f5f9;
          color: #64748b;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #e2e8f0;
          color: #475569;
        }

        .modal-close {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .modal-close:hover {
          background: #f3f4f6;
        }

        .modal-body {
          padding: 24px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem 2rem;
          padding: 1.5rem 0;
          max-width: 100%;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background-color: #ffffff;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #9ca3af;
        }

        .form-group select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1rem;
          padding-right: 2.5rem;
          appearance: none;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 6rem;
        }

        /* 响应式优化 */
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem 0;
          }
          
          .form-group input,
          .form-group select,
          .form-group textarea {
            padding: 0.625rem 0.875rem;
            font-size: 1rem;
          }
        }

        /* ------------------------------------------------------------------------------------------ */
        /* 响应式设计 */
        @media (max-width: 768px) {
          .other-projects-page {
            padding: 12px;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .filter-row {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }

          .projects-table-container {
            overflow-x: auto;
          }

          .projects-table {
            min-width: 800px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            margin: 20px;
            max-width: none;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* 模态框底部按钮样式 */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding: 24px 32px;
          border-top: 1px solid #f1f5f9;
          background: #fafbfc;
        }

        .btn-secondary {
          padding: 14px 28px;
          border: 2px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #475569;
        }

        .btn-primary {
          padding: 14px 28px;
          border: none;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
          min-width: 120px;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 10px -1px rgba(59, 130, 246, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .cancel-button {
          background: #ffffff;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cancel-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
          transform: translateY(-1px);
        }

        .submit-button {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
        }

        .delete-button {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
        }

        .delete-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
        }

        .delete-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 2px 4px rgba(220, 38, 38, 0.1);
        }

        /* 删除确认弹窗优化 */
        .modal-content.small {
          max-width: 420px;
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .delete-warning {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #fef2f2 0%, #fdf2f8 100%);
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
        }

        .warning-icon {
          flex-shrink: 0;
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        /* 警告内容 */
        .warning-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }

        .warning-icon {
          color: #f59e0b;
        }

        .warning-content h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #dc2626;
          margin: 0 0 0.5rem 0;
        }

        .warning-content p {
          margin: 0;
          color: #374151;
          line-height: 1.6;
        }

        .warning-text {
          font-size: 14px;
          color: #6b7280;
        }

        /* 只读字段样式 */
        .readonly-field {
          padding: 0.75rem 1rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          color: #374151;
          font-size: 0.875rem;
          line-height: 1.5;
          min-height: 2.75rem;
          display: flex;
          align-items: center;
        }

        .readonly-textarea {
          min-height: 6rem;
          align-items: flex-start;
          padding-top: 0.75rem;
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>
    </DashboardLayout>
  )
}

export default OtherProjectsPage
