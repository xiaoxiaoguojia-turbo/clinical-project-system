import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { 
  CalendarIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon, 
  ChartBarIcon, 
  BeakerIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  PauseCircleIcon,
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
  ArrowPathIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { 
  ApiResponse, 
  PaginatedResponse,
  UnifiedProject
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

interface PreparationStats {
  totalPreparations: number
  veryImportantCount: number
  marketProductCount: number
  contractCompletedCount: number
  contractIncompleteCount: number
}

interface StatCard {
  title: string
  value: string | number
  unit: string
  icon: React.ComponentType<any>
  color: string
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
    veryImportantCount: 0,
    marketProductCount: 0,
    contractCompletedCount: 0,
    contractIncompleteCount: 0
  })
  
  const [preparations, setPreparations] = useState<UnifiedProject[]>([])
  const [charts, setCharts] = useState<{[key: string]: any}>({})

  // 项目列表相关状态
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projects, setProjects] = useState<UnifiedProject[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [projectStatusFilter, setProjectStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalProjects, setTotalProjects] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<UnifiedProject | null>(null)
  const [sourceDepartments, setSourceDepartments] = useState<string[]>([])

  // 创建项目表单状态
  const [createFormData, setCreateFormData] = useState({
    department: 'transfer-investment-dept-1',
    projectType: 'internal-preparation',
    name: '',
    source: '',
    importance: 'very-important',
    status: 'early-stage',
    leader: 'to-be-determined',
    indication: '',
    transformRequirement: 'other',
    transformProgress: 'contract-incomplete',
    hospitalDoctor: '',
    patent: '',
    clinicalData: '',
    marketSize: '',
    competitorStatus: '',
    conclusion: '',
    composition: '',
    function: '',
    specification: '',
    duration: '',
    recordNumber: ''
  })
  const [createFormErrors, setCreateFormErrors] = useState<{[key: string]: string}>({})
  const [createFormLoading, setCreateFormLoading] = useState(false)

  // 编辑项目表单状态
  const [editFormData, setEditFormData] = useState({
    department: 'transfer-investment-dept-1',
    projectType: 'internal-preparation',
    name: '',
    source: '',
    importance: 'very-important',
    status: 'early-stage',
    leader: 'to-be-determined',
    indication: '',
    transformRequirement: 'other',
    transformProgress: 'contract-incomplete',
    hospitalDoctor: '',
    patent: '',
    clinicalData: '',
    marketSize: '',
    competitorStatus: '',
    conclusion: '',
    composition: '',
    function: '',
    specification: '',
    duration: '',
    recordNumber: ''
  })
  const [editFormErrors, setEditFormErrors] = useState<{[key: string]: string}>({})
  const [editFormLoading, setEditFormLoading] = useState(false)

  const router = useRouter()
  /* ------------------------------------------------------------------------------------------ */

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

  // 项目列表数据加载
  useEffect(() => {
    if (activeTab === 'projects' && isAuthenticated) {
      loadProjectsList()
    }
  }, [activeTab, isAuthenticated, currentPage, pageSize, searchTerm, projectStatusFilter, sourceFilter])

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
      
      // 获取所有院内制剂项目数据用于统计
      const response = await fetch('/api/projects?projectType=internal-preparation&pageSize=100', {
        headers: {
          'Authorization': `Bearer ${TokenManager.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json() as ApiResponse<PaginatedResponse<UnifiedProject>>
      
      if (data.success && data.data) {
        const projectsData = data.data.data || []
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

  const calculateStats = (projects: UnifiedProject[]): PreparationStats => {
    const totalPreparations = projects.length
    const veryImportantCount = projects.filter(p => p.importance === 'very-important').length
    const marketProductCount = projects.filter(p => p.status === 'market-product').length
    const contractCompletedCount = projects.filter(p => p.transformProgress === 'contract-completed').length
    const contractIncompleteCount = projects.filter(p => p.transformProgress === 'contract-incomplete').length

    return {
      totalPreparations,
      veryImportantCount,
      marketProductCount,
      contractCompletedCount,
      contractIncompleteCount
    }
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 图表初始化函数
  const initializeCharts = async () => {
    try {
      // 动态导入 Chart.js
      const Chart = (await import('chart.js/auto')).default
      
      // 先清理所有现有的图表实例
      const chartIds = ['departmentChart', 'sourceChart', 'importanceChart', 'statusChart', 'transformRequirementChart', 'transformProgressChart']
      chartIds.forEach(chartId => {
        const existingChart = Chart.getChart(chartId)
        if (existingChart) {
          existingChart.destroy()
        }
      })
      
      const chartConfigs = getChartConfigs()
      const newCharts: {[key: string]: any} = {}

      // 添加延迟确保DOM元素已渲染和旧图表已清理
      setTimeout(() => {
        Object.entries(chartConfigs).forEach(([key, config]) => {
          const canvas = document.getElementById(key) as HTMLCanvasElement
          if (canvas) {
            // 再次检查是否有现有图表实例
            const existingChart = Chart.getChart(canvas)
            if (existingChart) {
              existingChart.destroy()
            }
            
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
    // 1. 归属部门统计
    const departmentData = preparations.reduce((acc, prep) => {
      acc[prep.department] = (acc[prep.department] || 0) + 1
      return acc
    }, {} as {[key: string]: number})
    
    const departmentLabels = Object.keys(departmentData).map(key => {
      const labels: {[key: string]: string} = {
        'transfer-investment-dept-1': '转移转化与投资一部',
        'transfer-investment-dept-2': '转移转化与投资二部',
        'transfer-investment-dept-3': '转移转化与投资三部'
      }
      return labels[key] || key
    })
    const departmentValues = Object.values(departmentData)

    // 2. 医院来源统计
    const sourceData = preparations.reduce((acc, prep) => {
      acc[prep.source] = (acc[prep.source] || 0) + 1
      return acc
    }, {} as {[key: string]: number})
    
    const sourceLabels = Object.keys(sourceData).slice(0, 10)
    const sourceValues = sourceLabels.map(label => sourceData[label])

    // 3. 重要程度统计
    const importanceData = preparations.reduce((acc, prep) => {
      acc[prep.importance] = (acc[prep.importance] || 0) + 1
      return acc
    }, {} as {[key: string]: number})
    
    const importanceLabels = Object.keys(importanceData).map(key => {
      const labels: {[key: string]: string} = {
        'very-important': '非常重要',
        'important': '重要',
        'normal': '一般',
        'not-important': '不重要'
      }
      return labels[key] || key
    })
    const importanceValues = Object.values(importanceData)

    // 4. 项目进展状态统计
    const statusData = preparations.reduce((acc, prep) => {
      acc[prep.status] = (acc[prep.status] || 0) + 1
      return acc
    }, {} as {[key: string]: number})
    
    const statusLabels = Object.keys(statusData).map(key => {
      const labels: {[key: string]: string} = {
        'early-stage': '早期',
        'preclinical': '临床前',
        'clinical-stage': '临床阶段',
        'market-product': '上市产品'
      }
      return labels[key] || key
    })
    const statusValues = Object.values(statusData)

    // 5. 转化需求统计
    const transformReqData = preparations.reduce((acc, prep) => {
      const key = prep.transformRequirement || 'other'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as {[key: string]: number})
    
    const transformReqLabels = Object.keys(transformReqData).map(key => {
      const labels: {[key: string]: string} = {
        'license': '许可',
        'transfer': '转让',
        'company-operation': '公司化运营',
        'other': '其他'
      }
      return labels[key] || key
    })
    const transformReqValues = Object.values(transformReqData)

    // 6. 转化推进状态统计
    const transformProgressData = preparations.reduce((acc, prep) => {
      const key = prep.transformProgress || 'contract-incomplete'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as {[key: string]: number})
    
    const transformProgressLabels = Object.keys(transformProgressData).map(key => {
      const labels: {[key: string]: string} = {
        'contract-completed': '签约已完成',
        'contract-incomplete': '未完成'
      }
      return labels[key] || key
    })
    const transformProgressValues = Object.values(transformProgressData)

    return {
      // 1. 归属部门 - 柱状图
      departmentChart: {
        type: 'bar' as const,
        data: {
          labels: departmentLabels,
          datasets: [{
            label: '项目数量',
            data: departmentValues,
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

      // 2. 医院来源 - 柱状图
      sourceChart: {
        type: 'bar' as const,
        data: {
          labels: sourceLabels,
          datasets: [{
            label: '项目数量',
            data: sourceValues,
            backgroundColor: '#10b981',
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

      // 3. 重要程度 - 饼图
      importanceChart: {
        type: 'pie' as const,
        data: {
          labels: importanceLabels,
          datasets: [{
            data: importanceValues,
            backgroundColor: ['#dc2626', '#ea580c', '#059669', '#6b7280'],
            borderColor: '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom' as const,
              labels: { padding: 15, usePointStyle: true }
            }
          }
        }
      },

      // 4. 项目进展状态 - 环形图
      statusChart: {
        type: 'doughnut' as const,
        data: {
          labels: statusLabels,
          datasets: [{
            data: statusValues,
            backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'],
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
              labels: { padding: 15, usePointStyle: true }
            }
          }
        }
      },

      // 5. 转化需求 - 饼图
      transformRequirementChart: {
        type: 'pie' as const,
        data: {
          labels: transformReqLabels,
          datasets: [{
            data: transformReqValues,
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6b7280'],
            borderColor: '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom' as const,
              labels: { padding: 15, usePointStyle: true }
            }
          }
        }
      },

      // 6. 转化推进状态 - 环形图
      transformProgressChart: {
        type: 'doughnut' as const,
        data: {
          labels: transformProgressLabels,
          datasets: [{
            data: transformProgressValues,
            backgroundColor: ['#10b981', '#f59e0b'],
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
              labels: { padding: 15, usePointStyle: true }
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
    
    // 清理现有图表 - 使用Chart.js的标准方法
    const destroyCharts = async () => {
      try {
        const Chart = (await import('chart.js/auto')).default
        const chartIds = ['departmentChart', 'sourceChart', 'importanceChart', 'statusChart', 'transformRequirementChart', 'transformProgressChart']
        
        chartIds.forEach(chartId => {
          const existingChart = Chart.getChart(chartId)
          if (existingChart) {
            existingChart.destroy()
          }
        })
      } catch (error) {
        console.error('清理图表失败:', error)
      }
    }
    
    destroyCharts()
    setCharts({})
  }

  const handleRefreshData = () => {
    if (activeTab === 'statistics') {
      loadPreparationData()
    } else {
      loadProjectsList()
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // 重置到第一页
  }

  const handleProjectStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectStatusFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleSourceFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSourceFilter(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewProject = (project: UnifiedProject) => {
    setSelectedProject(project)
    setShowDetailModal(true)
  }

  const handleEditProject = (project: UnifiedProject) => {
    setSelectedProject(project)
    // 预填充编辑表单数据
    setEditFormData({
      department: project.department,
      projectType: 'internal-preparation',
      name: project.name,
      source: project.source,
      importance: project.importance,
      status: project.status,
      leader: project.leader,
      indication: project.indication || '',
      transformRequirement: project.transformRequirement || '',
      transformProgress: project.transformProgress || '',
      hospitalDoctor: project.hospitalDoctor || '',
      patent: project.patent || '',
      clinicalData: project.clinicalData || '',
      marketSize: project.marketSize || '',
      competitorStatus: project.competitorStatus || '',
      conclusion: project.conclusion || '',
      composition: project.composition || '',
      function: project.function || '',
      specification: project.specification || '',
      duration: project.duration || '',
      recordNumber: project.recordNumber || ''
    })
    setEditFormErrors({})
    setShowEditModal(true)
  }

  const handleDeleteProject = async (project: UnifiedProject) => {
    if (!window.confirm(`确定要删除项目"${project.name}"吗？`)) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TokenManager.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json() as ApiResponse<any>
      
      if (data.success) {
        await loadProjectsList() // 重新加载列表
      } else {
        alert('删除失败：' + (data.error || '未知错误'))
      }
    } catch (error) {
      console.error('删除项目失败:', error)
      alert('删除失败，请稍后重试')
    }
  }

  const handleCreateProject = () => {
    setSelectedProject(null)
    setCreateFormData({
      department: 'transfer-investment-dept-1',
      projectType: 'internal-preparation',
      name: '',
      source: '',
      importance: 'very-important',
      status: 'early-stage',
      leader: 'to-be-determined',
      indication: '',
      transformRequirement: 'other',
      transformProgress: 'contract-incomplete',
      hospitalDoctor: '',
      patent: '',
      clinicalData: '',
      marketSize: '',
      competitorStatus: '',
      conclusion: '',
      composition: '',
      function: '',
      specification: '',
      duration: '',
      recordNumber: ''
    })
    setCreateFormErrors({})
    setShowCreateModal(true)
  }

  const handleCreateFormChange = (field: string, value: string) => {
    setCreateFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 清除当前字段的错误
    if (createFormErrors[field]) {
      setCreateFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateCreateForm = () => {
    const errors: {[key: string]: string} = {}
    
    // 通用必填字段
    if (!createFormData.department.trim()) errors.department = '归属部门为必填项'
    if (!createFormData.name.trim()) errors.name = '项目名称为必填项'
    if (!createFormData.source.trim()) errors.source = '医院来源为必填项'
    if (!createFormData.importance.trim()) errors.importance = '重要程度为必填项'
    if (!createFormData.status.trim()) errors.status = '项目进展状态为必填项'
    if (!createFormData.leader.trim()) errors.leader = '负责人为必填项'

    // 院内制剂必填字段
    if (!createFormData.composition.trim()) errors.composition = '组方为必填项'
    if (!createFormData.function.trim()) errors.function = '功能为必填项'
    
    setCreateFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateSubmit = async () => {
    if (!validateCreateForm()) {
      return
    }

    try {
      setCreateFormLoading(true)
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TokenManager.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createFormData)
      })
      
      const data = await response.json() as ApiResponse<UnifiedProject>
      
      if (data.success) {
        setShowCreateModal(false)
        await loadProjectsList() // 重新加载列表
        alert('项目创建成功！')
      } else {
        alert('创建失败：' + (data.error || '未知错误'))
      }
    } catch (error) {
      console.error('创建项目失败:', error)
      alert('创建失败，请稍后重试')
    } finally {
      setCreateFormLoading(false)
    }
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
    setCreateFormData({
      department: 'transfer-investment-dept-1',
      projectType: 'internal-preparation',
      name: '',
      source: '',
      importance: 'very-important',
      status: 'early-stage',
      leader: 'to-be-determined',
      indication: '',
      transformRequirement: 'other',
      transformProgress: 'contract-incomplete',
      hospitalDoctor: '',
      patent: '',
      clinicalData: '',
      marketSize: '',
      competitorStatus: '',
      conclusion: '',
      composition: '',
      function: '',
      specification: '',
      duration: '',
      recordNumber: ''
    })
    setCreateFormErrors({})
  }

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 清除该字段的错误信息
    if (editFormErrors[field]) {
      setEditFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateEditForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!editFormData.department.trim()) {
      errors.department = '归属部门不能为空'
    }
    if (!editFormData.name.trim()) {
      errors.name = '项目名称不能为空'
    }
    if (!editFormData.source.trim()) {
      errors.source = '医院来源不能为空'
    }
    if (!editFormData.importance.trim()) {
      errors.importance = '重要程度不能为空'
    }
    if (!editFormData.status.trim()) {
      errors.status = '项目进展状态不能为空'
    }
    if (!editFormData.leader.trim()) {
      errors.leader = '负责人不能为空'
    }

    // 院内制剂必填字段
    if (!editFormData.composition.trim()) {
      errors.composition = '组方不能为空'
    }
    if (!editFormData.function.trim()) {
      errors.function = '功能不能为空'
    }
    
    setEditFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleEditSubmit = async () => {
    if (!validateEditForm() || !selectedProject) {
      return
    }

    setEditFormLoading(true)
    
    try {
      const updateData = {
        department: editFormData.department,
        projectType: 'internal-preparation',
        name: editFormData.name.trim(),
        source: editFormData.source.trim(),
        importance: editFormData.importance.trim(),
        status: editFormData.status.trim(),
        leader: editFormData.leader.trim(),
        indication: editFormData.indication.trim(),
        transformRequirement: editFormData.transformRequirement.trim(),
        transformProgress: editFormData.transformProgress.trim(),
        hospitalDoctor: editFormData.hospitalDoctor.trim(),
        patent: editFormData.patent.trim(),
        clinicalData: editFormData.clinicalData.trim(),
        marketSize: editFormData.marketSize.trim(),
        competitorStatus: editFormData.competitorStatus.trim(),
        conclusion: editFormData.conclusion.trim(),
        composition: editFormData.composition.trim(),
        function: editFormData.function.trim(),
        specification: editFormData.specification.trim(),
        duration: editFormData.duration.trim(),
        recordNumber: editFormData.recordNumber.trim()
      }

      const response = await fetch(`/api/projects/${selectedProject._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${TokenManager.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      
      const data = await response.json() as ApiResponse<UnifiedProject>
      
      if (data.success) {
        setShowEditModal(false)
        setSelectedProject(null)
        setEditFormData({
          department: 'transfer-investment-dept-1',
          projectType: 'internal-preparation',
          name: '',
          source: '',
          importance: 'very-important',
          status: 'early-stage',
          leader: 'to-be-determined',
          indication: '',
          transformRequirement: 'other',
          transformProgress: 'contract-incomplete',
          hospitalDoctor: '',
          patent: '',
          clinicalData: '',
          marketSize: '',
          competitorStatus: '',
          conclusion: '',
          composition: '',
          function: '',
          specification: '',
          duration: '',
          recordNumber: ''
        })
        await loadProjectsList()
      } else {
        alert('更新失败：' + (data.error || '未知错误'))
      }
    } catch (error) {
      console.error('更新项目失败:', error)
      alert('更新失败，请稍后重试')
    } finally {
      setEditFormLoading(false)
    }
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedProject(null)
    setEditFormData({
      department: 'transfer-investment-dept-1',
      projectType: 'internal-preparation',
      source: '',
      name: '',
      importance: 'very-important',
      status: 'early-stage',
      leader: 'to-be-determined',
      indication: '',
      transformRequirement: 'other',
      transformProgress: 'contract-incomplete',
      hospitalDoctor: '',
      patent: '',
      clinicalData: '',
      marketSize: '',
      competitorStatus: '',
      conclusion: '',
      composition: '',
      function: '',
      specification: '',
      duration: '',
      recordNumber: ''
    })
    setEditFormErrors({})
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedProject(null)
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'early-stage': return '早期'
      case 'preclinical': return '临床前'
      case 'clinical-stage': return '临床阶段'
      case 'market-product': return '上市产品'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'early-stage': return 'yellow'
      case 'preclinical': return 'blue'
      case 'clinical-stage': return 'green'
      case 'market-product': return 'purple'
      default: return 'gray'
    }
  }

  const getLeaderText = (leader: string) => {
    switch (leader) {
      case 'yangfeng': return '杨锋'
      case 'qinqingsong': return '秦青松'
      case 'haojingjing': return '郝菁菁'
      case 'chenlong': return '陈栊'
      case 'wangliyan': return '王立言'
      case 'maoshiwei': return '毛世伟'
      case 'xiaolanchuan': return '肖蓝川'
      case 'to-be-determined': return '待定'
      default: return leader
    }
  }

  const getCreatedByText = (createdBy: any) => {
    // 处理createdBy可能是对象或字符串的情况
    if (!createdBy) return '-'
    
    // 如果是对象（populated），尝试获取用户名或email
    if (typeof createdBy === 'object') {
      return createdBy.name || createdBy.realName || createdBy.username || createdBy.email || createdBy._id || '-'
    }
    
    // 如果是字符串，直接返回
    return createdBy
  }

  const handleAttachmentManagement = (project: UnifiedProject) => {
    console.log('=== 附件管理按钮点击调试信息 ===')
    console.log('点击的项目:', project)
    console.log('项目ID:', project._id)
    console.log('项目名称:', project.name)
    
    // 构建跳转参数
    const targetPath = '/internal-preparation-attachments'
    const queryParams = {
      projectId: project._id,
      projectName: project.name,
      projectType: 'internal-preparation'
    }
    
    console.log('跳转路径:', targetPath)
    console.log('查询参数:', queryParams)
    
    // 跳转到附件管理页面，传递项目ID和相关信息
    try {
      router.push({
        pathname: targetPath,
        query: queryParams
      })
      console.log('✅ 路由跳转已执行')
    } catch (error) {
      console.error('❌ 路由跳转失败:', error)
      alert('页面跳转失败，请重试')
    }
  }

  const handleGenerateAIReport = async (project: UnifiedProject) => {
    try {
      console.log('开始生成AI报告，项目:', project.name)
      
      // 获取认证令牌
      const token = TokenManager.getToken()
      if (!token) {
        throw new Error('未找到认证令牌，请重新登录')
      }

      // 调用后端API生成报告
      const response = await fetch(`/api/projects/${project._id}/generate-report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('AI报告生成成功:', result.data.reportUrl)
        
        // 显示成功消息
        alert(`AI报告生成成功！\n\n项目: ${project.name}\n报告已生成，点击"查看AI报告"按钮可以查看。`)
        
        // 重新加载项目列表以获取最新状态
        await loadProjectsList()
        
      } else {
        console.error('AI报告生成失败:', result.error)
        alert(`AI报告生成失败：${result.error || '未知错误'}`)
        
        // 重新加载项目列表以获取最新状态
        await loadProjectsList()
      }

    } catch (error) {
      console.error('生成AI报告时发生错误:', error)
      alert('网络错误，请检查网络连接后重试')
      
      // 重新加载项目列表以获取最新状态
      await loadProjectsList()
    }
  }

  const handleViewAIReport = (project: UnifiedProject) => {
    // 直接使用项目的aiReport字段
    const reportUrl = project.aiReport?.reportUrl
    
    if (!reportUrl || project.aiReport?.status !== 'completed') {
      alert('该项目还没有生成AI报告，请先点击"生成AI报告"按钮')
      return
    }

    try {
      // 在新窗口打开报告链接
      console.log('打开AI报告:', reportUrl)
      window.open(reportUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('打开AI报告失败:', error)
      alert('无法打开报告链接，请手动复制以下链接到浏览器中查看：\n\n' + reportUrl)
    }
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
      color: 'blue'
    },
    {
      title: '非常重要',
      value: preparationStats.veryImportantCount,
      unit: '个',
      icon: StarIcon,
      color: 'red'
    },
    {
      title: '上市产品',
      value: preparationStats.marketProductCount,
      unit: '个',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      title: '签约已完成',
      value: preparationStats.contractCompletedCount,
      unit: '个',
      icon: ClipboardDocumentListIcon,
      color: 'emerald'
    },
    {
      title: '签约未完成',
      value: preparationStats.contractIncompleteCount,
      unit: '个',
      icon: ClockIcon,
      color: 'amber'
    }
  ]
  
  const loadProjectsList = async () => {
    try {
      setProjectsLoading(true)
      
      // 构建查询参数
      const params = new URLSearchParams({
        projectType: 'internal-preparation',
        page: currentPage.toString(),
        pageSize: pageSize.toString()
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (projectStatusFilter) params.append('status', projectStatusFilter)
      if (sourceFilter) params.append('source', sourceFilter)
      
      const response = await fetch(`/api/projects?${params}`, {
        headers: {
          'Authorization': `Bearer ${TokenManager.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json() as ApiResponse<PaginatedResponse<UnifiedProject>>
      
      if (data.success && data.data) {
        setProjects(data.data.data || [])
        setTotalProjects(data.data.pagination.total)
        setTotalPages(data.data.pagination.totalPages)
        
        // 提取科室列表
        const departments = new Set(data.data.data.map(p => p.source))
        setSourceDepartments(Array.from(departments))
      }
    } catch (error) {
      console.error('加载项目列表失败:', error)
    } finally {
      setProjectsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <DashboardLayout title="院内制剂 - 临床创新项目管理系统">
      <div className="preparations-page">
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <h1>院内制剂管理</h1>
              <p>院内制剂项目的统计分析与项目管理</p>
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
            onClick={() => handleTabChange('statistics')}
          >
            <ChartBarIcon className="w-5 h-5" />
            统计报表
          </button>
          <button 
            className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => handleTabChange('projects')}
          >
            <ClipboardDocumentListIcon className="w-5 h-5" />
            项目列表
          </button>
        </div>

        {/* 统计报表内容 */}
        {activeTab === 'statistics' && (
          <>
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
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 图表区域 */}
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>归属部门分布</h3>
                  <button className="chart-menu" onClick={() => console.log('Chart menu')}>
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="chart-container">
                  <canvas id="departmentChart"></canvas>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>医院来源分布</h3>
                  <button className="chart-menu" onClick={() => console.log('Chart menu')}>
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="chart-container">
                  <canvas id="sourceChart"></canvas>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>重要程度分布</h3>
                  <button className="chart-menu" onClick={() => console.log('Chart menu')}>
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="chart-container">
                  <canvas id="importanceChart"></canvas>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>项目进展状态</h3>
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
                  <h3>转化需求分布</h3>
                  <button className="chart-menu" onClick={() => console.log('Chart menu')}>
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="chart-container">
                  <canvas id="transformRequirementChart"></canvas>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>转化推进状态</h3>
                  <button className="chart-menu" onClick={() => console.log('Chart menu')}>
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="chart-container">
                  <canvas id="transformProgressChart"></canvas>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 项目列表内容 */}
        {activeTab === 'projects' && (
          <div className="projects-section">
            {/* 筛选控制栏 */}
            <div className="filter-bar">
              <div className="search-section">
                <div className="search-input-wrapper">
                  <MagnifyingGlassIcon className="w-5 h-5 search-icon" />
                  <input 
                    type="search" 
                    value={searchTerm} 
                    onChange={handleSearchChange}
                    placeholder="搜索项目名称、组方、功能或备案号" 
                    className="search-input"
                  />
                </div>
              </div>
              <div className="filter-controls">
                <div className="filter-item">
                  <FunnelIcon className="w-5 h-5 filter-icon" />
                  <select 
                    value={projectStatusFilter} 
                    onChange={handleProjectStatusFilterChange}
                    className="filter-select"
                  >
                    <option value="">全部状态</option>
                    <option value="early-stage">早期</option>
                    <option value="preclinical">临床前</option>
                    <option value="clinical-stage">临床阶段</option>
                    <option value="market-product">上市产品</option>
                  </select>
                </div>
                <div className="filter-item">
                  <BuildingOffice2Icon className="w-5 h-5 filter-icon" />
                  <select 
                    value={sourceFilter} 
                    onChange={handleSourceFilterChange}
                    className="filter-select"
                  >
                    <option value="">全部科室</option>
                    {sourceDepartments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                className="refresh-button" 
                onClick={handleRefreshData}
                disabled={projectsLoading}
              >
                <ArrowPathIcon className="w-4 h-4" />
                刷新数据
              </button>
            </div>

            {/* 项目表格 */}
            <div className="project-table-container">
              <table className="project-table">
                <thead>
                  <tr>
                    <th>项目名称</th>
                    <th>来源科室</th>
                    <th>备案号</th>
                    <th>状态</th>
                    <th>有效期</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsLoading ? (
                    // 加载状态
                    Array.from({ length: pageSize }).map((_, index) => (
                      <tr key={index} className="loading-row">
                        <td colSpan={7}>
                          <div className="loading-shimmer"></div>
                        </td>
                      </tr>
                    ))
                  ) : projects.length > 0 ? (
                    projects.map((project) => (
                      <tr key={project._id} className="project-row">
                        <td className="project-name">{project.name}</td>
                        <td className="project-source">{project.source}</td>
                        <td className="project-record">{project.recordNumber}</td>
                        <td>
                          <span className={`status-badge ${getStatusColor(project.status)}`}>
                            {getStatusText(project.status)}
                          </span>
                        </td>
                        <td className="project-duration">{project.duration}年</td>
                        <td className="project-date">
                          {new Date(project.createTime).toLocaleDateString('zh-CN')}
                        </td>
                        <td className="actions-cell">
                          <div className="action-buttons">
                            <div className="action-group primary-actions">
                              <button
                                onClick={() => handleViewProject(project)}
                                className="action-btn view-btn"
                                title="查看详情"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditProject(project)}
                                className="action-btn edit-btn"
                                title="编辑项目"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project)}
                                className="action-btn delete-btn"
                                title="删除项目"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="action-group extended-actions">
                              <button
                                onClick={() => handleAttachmentManagement(project)}
                                className="action-btn attachment-btn"
                                title="附件管理"
                              >
                                <PaperClipIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleGenerateAIReport(project)}
                                className={`action-btn ai-generate-btn ${
                                  project.aiReport?.status === 'generating' ? 'loading' : ''
                                } ${
                                  project.aiReport?.status === 'error' ? 'error' : ''
                                }`}
                                title={
                                  project.aiReport?.status === 'generating' 
                                    ? '正在生成AI报告，请耐心等待...' 
                                    : project.aiReport?.status === 'completed'
                                    ? '重新生成AI报告'
                                    : project.aiReport?.status === 'error'
                                    ? `生成失败：${project.aiReport?.status || '未知错误'} - 点击重试`
                                    : '生成AI报告'
                                }
                                disabled={project.aiReport?.status === 'generating'}
                              >
                                {project.aiReport?.status === 'generating' ? (
                                  <>
                                    <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-current"></div>
                                    <span className="ml-1 text-xs">生成中</span>
                                  </>
                                ) : project.aiReport?.status === 'error' ? (
                                  <>
                                    <ExclamationTriangleIcon className="w-4 h-4" />
                                    <span className="ml-1 text-xs">重试</span>
                                  </>
                                ) : (
                                  <SparklesIcon className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleViewAIReport(project)}
                                className={`action-btn ai-view-btn ${
                                  project.aiReport?.status === 'completed' ? 'has-report' : ''
                                }`}
                                title={
                                  project.aiReport?.status === 'completed'
                                    ? '查看AI报告'
                                    : '该项目还没有生成AI报告'
                                }
                                disabled={project.aiReport?.status !== 'completed'}
                              >
                                <DocumentTextIcon className="w-4 h-4" />
                                {project.aiReport?.status === 'completed' && (
                                  <span className="ml-1 text-xs">查看</span>
                                )}
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="no-data">
                        <div className="no-data-content">
                          <BeakerIcon className="w-12 h-12 no-data-icon" />
                          <p>暂无项目数据</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页控制 */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  共 {totalProjects} 条记录，第 {currentPage} / {totalPages} 页
                </div>
                <div className="pagination-controls">
                  <button 
                    className="page-btn"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    首页
                  </button>
                  <button 
                    className="page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <span className="page-numbers">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                      return pageNum <= totalPages ? (
                        <button
                          key={pageNum}
                          className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ) : null
                    })}
                  </span>
                  <button 
                    className="page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                  <button 
                    className="page-btn"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    末页
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 创建项目模态框 */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={handleCloseCreateModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>新建院内制剂项目</h2>
                <button className="modal-close" onClick={handleCloseCreateModal}>
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>归属部门 *</label>
                    <select
                      value={createFormData.department}
                      onChange={(e) => handleCreateFormChange('department', e.target.value)}
                      className={`form-input ${createFormErrors.department ? 'error' : ''}`}
                    >
                      <option value="transfer-investment-dept-1">转移转化与投资一部</option>
                      <option value="transfer-investment-dept-2">转移转化与投资二部</option>
                      <option value="transfer-investment-dept-3">转移转化与投资三部</option>
                    </select>
                    {createFormErrors.department && <span className="error-text">{createFormErrors.department}</span>}
                  </div>

                  <div className="form-group">
                    <label>项目名称 *</label>
                    <input
                      type="text"
                      value={createFormData.name}
                      onChange={(e) => handleCreateFormChange('name', e.target.value)}
                      className={`form-input ${createFormErrors.name ? 'error' : ''}`}
                      placeholder="请输入项目名称"
                    />
                    {createFormErrors.name && <span className="error-text">{createFormErrors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label>医院来源 *</label>
                    <input
                      type="text"
                      value={createFormData.source}
                      onChange={(e) => handleCreateFormChange('source', e.target.value)}
                      className={`form-input ${createFormErrors.source ? 'error' : ''}`}
                      placeholder="请输入医院来源"
                    />
                    {createFormErrors.source && <span className="error-text">{createFormErrors.source}</span>}
                  </div>

                  <div className="form-group">
                    <label>负责人 *</label>
                    <select
                      value={createFormData.leader}
                      onChange={(e) => handleCreateFormChange('leader', e.target.value)}
                      className={`form-input ${createFormErrors.leader ? 'error' : ''}`}
                    >
                      <option value="yangfeng">杨锋</option>
                      <option value="qinqingsong">秦青松</option>
                      <option value="haojingjing">郝菁菁</option>
                      <option value="chenlong">陈栊</option>
                      <option value="wangliyan">王立言</option>
                      <option value="maoshiwei">毛世伟</option>
                      <option value="xiaolanchuan">肖蓝川</option>
                      <option value="to-be-determined">待定</option>
                    </select>
                    {createFormErrors.leader && <span className="error-text">{createFormErrors.leader}</span>}
                  </div>

                  <div className="form-group">
                    <label>重要程度 *</label>
                    <select
                      value={createFormData.importance}
                      onChange={(e) => handleCreateFormChange('importance', e.target.value)}
                      className={`form-input ${createFormErrors.importance ? 'error' : ''}`}
                    >
                      <option value="very-important">非常重要</option>
                      <option value="important">重要</option>
                      <option value="normal">一般</option>
                      <option value="not-important">不重要</option>
                    </select>
                    {createFormErrors.importance && <span className="error-text">{createFormErrors.importance}</span>}
                  </div>

                  <div className="form-group">
                    <label>项目进展状态 *</label>
                    <select
                      value={createFormData.status}
                      onChange={(e) => handleCreateFormChange('status', e.target.value)}
                      className={`form-input ${createFormErrors.status ? 'error' : ''}`}
                    >
                      <option value="early-stage">早期</option>
                      <option value="preclinical">临床前</option>
                      <option value="clinical-stage">临床阶段</option>
                      <option value="market-product">上市产品</option>
                    </select>
                    {createFormErrors.status && <span className="error-text">{createFormErrors.status}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>组方 *</label>
                    <textarea
                      value={createFormData.composition}
                      onChange={(e) => handleCreateFormChange('composition', e.target.value)}
                      className={`form-textarea ${createFormErrors.composition ? 'error' : ''}`}
                      placeholder="请输入组方"
                      rows={3}
                    />
                    {createFormErrors.composition && <span className="error-text">{createFormErrors.composition}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>功能 *</label>
                    <textarea
                      value={createFormData.function}
                      onChange={(e) => handleCreateFormChange('function', e.target.value)}
                      className={`form-textarea ${createFormErrors.function ? 'error' : ''}`}
                      placeholder="请输入功能"
                      rows={3}
                    />
                    {createFormErrors.function && <span className="error-text">{createFormErrors.function}</span>}
                  </div>

                  <div className="form-group">
                    <label>制剂规格</label>
                    <input
                      type="text"
                      value={createFormData.specification}
                      onChange={(e) => handleCreateFormChange('specification', e.target.value)}
                      className={`form-input ${createFormErrors.specification ? 'error' : ''}`}
                      placeholder="请输入制剂规格（可选）"
                    />
                    {createFormErrors.specification && <span className="error-text">{createFormErrors.specification}</span>}
                  </div>

                  <div className="form-group">
                    <label>使用年限（年）</label>
                    <input
                      type="number"
                      value={createFormData.duration}
                      onChange={(e) => handleCreateFormChange('duration', e.target.value)}
                      className={`form-input ${createFormErrors.duration ? 'error' : ''}`}
                      placeholder="请输入使用年限（可选）"
                      min="1"
                    />
                    {createFormErrors.duration && <span className="error-text">{createFormErrors.duration}</span>}
                  </div>

                  <div className="form-group">
                    <label>备案号</label>
                    <input
                      type="text"
                      value={createFormData.recordNumber}
                      onChange={(e) => handleCreateFormChange('recordNumber', e.target.value)}
                      className={`form-input ${createFormErrors.recordNumber ? 'error' : ''}`}
                      placeholder="请输入备案号（可选）"
                    />
                    {createFormErrors.recordNumber && <span className="error-text">{createFormErrors.recordNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label>适应症/科室</label>
                    <input
                      type="text"
                      value={createFormData.indication}
                      onChange={(e) => handleCreateFormChange('indication', e.target.value)}
                      className="form-input"
                      placeholder="请输入适应症/科室（可选）"
                    />
                  </div>

                  <div className="form-group">
                    <label>转化需求</label>
                    <select
                      value={createFormData.transformRequirement}
                      onChange={(e) => handleCreateFormChange('transformRequirement', e.target.value)}
                      className="form-input"
                    >
                      <option value="">请选择</option>
                      <option value="license">许可</option>
                      <option value="transfer">转让</option>
                      <option value="company-operation">公司化运营</option>
                      <option value="other">其他</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>转化推进状态</label>
                    <select
                      value={createFormData.transformProgress}
                      onChange={(e) => handleCreateFormChange('transformProgress', e.target.value)}
                      className="form-input"
                    >
                      <option value="">请选择</option>
                      <option value="contract-completed">签约已完成</option>
                      <option value="contract-incomplete">签约未完成</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>院端医生</label>
                    <input
                      type="text"
                      value={createFormData.hospitalDoctor}
                      onChange={(e) => handleCreateFormChange('hospitalDoctor', e.target.value)}
                      className="form-input"
                      placeholder="请输入院端医生（可选）"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>临床数据</label>
                    <textarea
                      value={createFormData.clinicalData}
                      onChange={(e) => handleCreateFormChange('clinicalData', e.target.value)}
                      className="form-textarea"
                      placeholder="请输入临床数据（可选）"
                      rows={3}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>市场规模</label>
                    <textarea
                      value={createFormData.marketSize}
                      onChange={(e) => handleCreateFormChange('marketSize', e.target.value)}
                      className="form-textarea"
                      placeholder="请输入市场规模（可选）"
                      rows={3}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>竞品状态</label>
                    <textarea
                      value={createFormData.competitorStatus}
                      onChange={(e) => handleCreateFormChange('competitorStatus', e.target.value)}
                      className="form-textarea"
                      placeholder="请输入竞品状态（可选）"
                      rows={3}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>项目结论</label>
                    <textarea
                      value={createFormData.conclusion}
                      onChange={(e) => handleCreateFormChange('conclusion', e.target.value)}
                      className="form-textarea"
                      placeholder="请输入项目结论（可选）"
                      rows={3}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>专利情况</label>
                    <textarea
                      value={createFormData.patent}
                      onChange={(e) => handleCreateFormChange('patent', e.target.value)}
                      className="form-textarea"
                      placeholder="请输入专利情况（可选）"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={handleCloseCreateModal}>
                  取消
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleCreateSubmit}
                  disabled={createFormLoading}
                >
                  {createFormLoading ? '创建中...' : '创建项目'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 编辑项目模态框 */}
        {showEditModal && selectedProject && (
          <div className="modal-overlay" onClick={handleCloseEditModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>编辑项目</h2>
                <button
                  onClick={handleCloseEditModal}
                  className="modal-close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>归属部门 *</label>
                    <select
                      value={editFormData.department}
                      onChange={(e) => handleEditFormChange('department', e.target.value)}
                      className={`form-input ${editFormErrors.department ? 'error' : ''}`}
                    >
                      <option value="transfer-investment-dept-1">转移转化与投资一部</option>
                      <option value="transfer-investment-dept-2">转移转化与投资二部</option>
                      <option value="transfer-investment-dept-3">转移转化与投资三部</option>
                    </select>
                    {editFormErrors.department && <div className="error-text">{editFormErrors.department}</div>}
                  </div>

                  <div className="form-group">
                    <label>项目名称 *</label>
                    <input
                      type="text"
                      className={`form-input ${editFormErrors.name ? 'error' : ''}`}
                      placeholder="请输入项目名称"
                      value={editFormData.name}
                      onChange={(e) => handleEditFormChange('name', e.target.value)}
                    />
                    {editFormErrors.name && <div className="error-text">{editFormErrors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label>医院来源 *</label>
                    <input
                      type="text"
                      className={`form-input ${editFormErrors.source ? 'error' : ''}`}
                      placeholder="请输入医院来源"
                      value={editFormData.source}
                      onChange={(e) => handleEditFormChange('source', e.target.value)}
                    />
                    {editFormErrors.source && <div className="error-text">{editFormErrors.source}</div>}
                  </div>

                  <div className="form-group">
                    <label>负责人 *</label>
                    <select
                      value={editFormData.leader}
                      onChange={(e) => handleEditFormChange('leader', e.target.value)}
                      className={`form-input ${editFormErrors.leader ? 'error' : ''}`}
                    >
                      <option value="yangfeng">杨锋</option>
                      <option value="qinqingsong">秦青松</option>
                      <option value="haojingjing">郝菁菁</option>
                      <option value="chenlong">陈栊</option>
                      <option value="wangliyan">王立言</option>
                      <option value="maoshiwei">毛世伟</option>
                      <option value="xiaolanchuan">肖蓝川</option>
                      <option value="to-be-determined">待定</option>
                    </select>
                    {editFormErrors.leader && <div className="error-text">{editFormErrors.leader}</div>}
                  </div>

                  <div className="form-group">
                    <label>重要程度 *</label>
                    <select
                      value={editFormData.importance}
                      onChange={(e) => handleEditFormChange('importance', e.target.value)}
                      className={`form-input ${editFormErrors.importance ? 'error' : ''}`}
                    >
                      <option value="very-important">非常重要</option>
                      <option value="important">重要</option>
                      <option value="normal">一般</option>
                      <option value="not-important">不重要</option>
                    </select>
                    {editFormErrors.importance && <div className="error-text">{editFormErrors.importance}</div>}
                  </div>

                  <div className="form-group">
                    <label>项目进展状态 *</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => handleEditFormChange('status', e.target.value)}
                      className={`form-input ${editFormErrors.status ? 'error' : ''}`}
                    >
                      <option value="early-stage">早期</option>
                      <option value="preclinical">临床前</option>
                      <option value="clinical-stage">临床阶段</option>
                      <option value="market-product">上市产品</option>
                    </select>
                    {editFormErrors.status && <div className="error-text">{editFormErrors.status}</div>}
                  </div>

                  <div className="form-group full-width">
                    <label>组方 *</label>
                    <textarea
                      className={`form-textarea ${editFormErrors.composition ? 'error' : ''}`}
                      placeholder="请输入组方"
                      value={editFormData.composition}
                      onChange={(e) => handleEditFormChange('composition', e.target.value)}
                    />
                    {editFormErrors.composition && <div className="error-text">{editFormErrors.composition}</div>}
                  </div>

                  <div className="form-group full-width">
                    <label>功能 *</label>
                    <textarea
                      className={`form-textarea ${editFormErrors.function ? 'error' : ''}`}
                      placeholder="请输入功能"
                      value={editFormData.function}
                      onChange={(e) => handleEditFormChange('function', e.target.value)}
                    />
                    {editFormErrors.function && <div className="error-text">{editFormErrors.function}</div>}
                  </div>

                  <div className="form-group">
                    <label>制剂规格</label>
                    <input
                      type="text"
                      className={`form-input ${editFormErrors.specification ? 'error' : ''}`}
                      placeholder="请输入制剂规格（可选）"
                      value={editFormData.specification}
                      onChange={(e) => handleEditFormChange('specification', e.target.value)}
                    />
                    {editFormErrors.specification && <div className="error-text">{editFormErrors.specification}</div>}
                  </div>

                  <div className="form-group">
                    <label>使用年限（年）</label>
                    <input
                      type="text"
                      className={`form-input ${editFormErrors.duration ? 'error' : ''}`}
                      placeholder="请输入使用年限（可选）"
                      value={editFormData.duration}
                      onChange={(e) => handleEditFormChange('duration', e.target.value)}
                    />
                    {editFormErrors.duration && <div className="error-text">{editFormErrors.duration}</div>}
                  </div>

                  <div className="form-group">
                    <label>备案号</label>
                    <input
                      type="text"
                      className={`form-input ${editFormErrors.recordNumber ? 'error' : ''}`}
                      placeholder="请输入备案号（可选）"
                      value={editFormData.recordNumber}
                      onChange={(e) => handleEditFormChange('recordNumber', e.target.value)}
                    />
                    {editFormErrors.recordNumber && <div className="error-text">{editFormErrors.recordNumber}</div>}
                  </div>

                  <div className="form-group">
                    <label>适应症/科室</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="请输入适应症/科室（可选）"
                      value={editFormData.indication}
                      onChange={(e) => handleEditFormChange('indication', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>转化需求</label>
                    <select
                      value={editFormData.transformRequirement}
                      onChange={(e) => handleEditFormChange('transformRequirement', e.target.value)}
                      className="form-input"
                    >
                      <option value="">请选择</option>
                      <option value="license">许可</option>
                      <option value="transfer">转让</option>
                      <option value="company-operation">公司化运营</option>
                      <option value="other">其他</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>转化推进状态</label>
                    <select
                      value={editFormData.transformProgress}
                      onChange={(e) => handleEditFormChange('transformProgress', e.target.value)}
                      className="form-input"
                    >
                      <option value="">请选择</option>
                      <option value="contract-completed">签约已完成</option>
                      <option value="contract-incomplete">签约未完成</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>院端医生</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="请输入院端医生（可选）"
                      value={editFormData.hospitalDoctor}
                      onChange={(e) => handleEditFormChange('hospitalDoctor', e.target.value)}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>临床数据</label>
                    <textarea
                      className="form-textarea"
                      placeholder="请输入临床数据（可选）"
                      value={editFormData.clinicalData}
                      onChange={(e) => handleEditFormChange('clinicalData', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>市场规模</label>
                    <textarea
                      className="form-textarea"
                      placeholder="请输入市场规模（可选）"
                      value={editFormData.marketSize}
                      onChange={(e) => handleEditFormChange('marketSize', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>竞品状态</label>
                    <textarea
                      className="form-textarea"
                      placeholder="请输入竞品状态（可选）"
                      value={editFormData.competitorStatus}
                      onChange={(e) => handleEditFormChange('competitorStatus', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>项目结论</label>
                    <textarea
                      className="form-textarea"
                      placeholder="请输入项目结论（可选）"
                      value={editFormData.conclusion}
                      onChange={(e) => handleEditFormChange('conclusion', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>专利情况</label>
                    <textarea
                      className="form-textarea"
                      placeholder="请输入专利情况（可选）"
                      value={editFormData.patent}
                      onChange={(e) => handleEditFormChange('patent', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  disabled={editFormLoading}
                  className="btn-primary"
                >
                  {editFormLoading ? '更新中...' : '更新项目'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 查看项目详情模态框 */}
        {showDetailModal && selectedProject && (
          <div className="modal-overlay" onClick={handleCloseDetailModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>项目详情</h2>
                <button
                  onClick={handleCloseDetailModal}
                  className="modal-close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="detail-grid">
                  <div className="detail-section">
                    <h3 className="detail-section-title">项目管理信息</h3>
                    <div className="detail-group">
                      <div className="detail-item">
                        <label className="detail-label">归属部门</label>
                        <div className="detail-value">
                          {selectedProject.department === 'transfer-investment-dept-1' ? '转移转化与投资一部' :
                           selectedProject.department === 'transfer-investment-dept-2' ? '转移转化与投资二部' :
                           selectedProject.department === 'transfer-investment-dept-3' ? '转移转化与投资三部' :
                           selectedProject.department}
                        </div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">项目名称</label>
                        <div className="detail-value">{selectedProject.name}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">医院来源</label>
                        <div className="detail-value">{selectedProject.source}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">负责人</label>
                        <div className="detail-value">{getLeaderText(selectedProject.leader)}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">重要程度</label>
                        <div className="detail-value">
                          {selectedProject.importance === 'very-important' ? '非常重要' :
                           selectedProject.importance === 'important' ? '重要' :
                           selectedProject.importance === 'normal' ? '一般' :
                           selectedProject.importance === 'not-important' ? '不重要' :
                           selectedProject.importance}
                        </div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">项目进展状态</label>
                        <div className="detail-value">
                          <span className={`status-badge ${getStatusColor(selectedProject.status)}`}>
                            {getStatusText(selectedProject.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3 className="detail-section-title">制剂信息</h3>
                    <div className="detail-group">
                      <div className="detail-item full-width">
                        <label className="detail-label">组方</label>
                        <div className="detail-value detail-text">{selectedProject.composition}</div>
                      </div>
                      <div className="detail-item full-width">
                        <label className="detail-label">功能</label>
                        <div className="detail-value detail-text">{selectedProject.function}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">制剂规格</label>
                        <div className="detail-value">{selectedProject.specification || '-'}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">使用年限</label>
                        <div className="detail-value">{selectedProject.duration ? `${selectedProject.duration} 年` : '-'}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">备案号</label>
                        <div className="detail-value">{selectedProject.recordNumber || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3 className="detail-section-title">转化信息</h3>
                    <div className="detail-group">
                      <div className="detail-item">
                        <label className="detail-label">适应症/科室</label>
                        <div className="detail-value">{selectedProject.indication || '-'}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">转化需求</label>
                        <div className="detail-value">
                          {selectedProject.transformRequirement === 'license' ? '许可' :
                           selectedProject.transformRequirement === 'transfer' ? '转让' :
                           selectedProject.transformRequirement === 'company-operation' ? '公司化运营' :
                           selectedProject.transformRequirement === 'other' ? '其他' :
                           selectedProject.transformRequirement || '-'}
                        </div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">转化推进状态</label>
                        <div className="detail-value">
                          {selectedProject.transformProgress === 'contract-completed' ? '签约已完成' :
                           selectedProject.transformProgress === 'contract-incomplete' ? '签约未完成' :
                           selectedProject.transformProgress || '-'}
                        </div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">院端医生</label>
                        <div className="detail-value">{selectedProject.hospitalDoctor || '-'}</div>
                      </div>
                    </div>
                  </div>

                  {(selectedProject.clinicalData || selectedProject.marketSize || selectedProject.competitorStatus || selectedProject.conclusion || selectedProject.patent) && (
                    <div className="detail-section">
                      <h3 className="detail-section-title">数据分析</h3>
                      <div className="detail-group">
                        {selectedProject.clinicalData && (
                          <div className="detail-item full-width">
                            <label className="detail-label">临床数据</label>
                            <div className="detail-value detail-text">{selectedProject.clinicalData}</div>
                          </div>
                        )}
                        {selectedProject.marketSize && (
                          <div className="detail-item full-width">
                            <label className="detail-label">市场规模</label>
                            <div className="detail-value detail-text">{selectedProject.marketSize}</div>
                          </div>
                        )}
                        {selectedProject.competitorStatus && (
                          <div className="detail-item full-width">
                            <label className="detail-label">竞品状态</label>
                            <div className="detail-value detail-text">{selectedProject.competitorStatus}</div>
                          </div>
                        )}
                        {selectedProject.conclusion && (
                          <div className="detail-item full-width">
                            <label className="detail-label">项目结论</label>
                            <div className="detail-value detail-text">{selectedProject.conclusion}</div>
                          </div>
                        )}
                        {selectedProject.patent && (
                          <div className="detail-item full-width">
                            <label className="detail-label">专利情况</label>
                            <div className="detail-value detail-text">{selectedProject.patent}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="detail-section">
                    <h3 className="detail-section-title">记录信息</h3>
                    <div className="detail-group">
                      <div className="detail-item">
                        <label className="detail-label">创建时间</label>
                        <div className="detail-value">{new Date(selectedProject.createTime).toLocaleDateString()}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">更新时间</label>
                        <div className="detail-value">{new Date(selectedProject.updateTime).toLocaleDateString()}</div>
                      </div>
                      {selectedProject.createdBy && (
                        <div className="detail-item">
                          <label className="detail-label">创建人</label>
                          <div className="detail-value">{getCreatedByText(selectedProject.createdBy)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleCloseDetailModal}
                  className="btn-secondary"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseDetailModal()
                    handleEditProject(selectedProject)
                  }}
                  className="btn-primary"
                >
                  编辑项目
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .preparations-page {
            padding: 24px;
            background: #f8fafc;
            min-height: 100vh;
          }

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
          
          .action-section-2 {
            display: flex;
            gap: 12px;
            margin-top: 0px;
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
            margin-top: 17px;
          }

          .export-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
          }

          .create-button {
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
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
            margin-top: 17px;
          }

          .create-button:hover {
            background: #2563eb;
            transform: translateY(-1px);
          }

          /* 标签栏 */
          .tab-bar {
            display: flex;
            padding: 0 16px;
            background: white;
            border-radius: 8px 8px 0 0;
            border-bottom: 2px solid #e5e7eb;
            margin-bottom: 32px;
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
            transition: all 0.2s ease;
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

          .search-section {
            flex: 1;
            max-width: 500px;
          }

          .search-input-wrapper {
            position: relative;
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .search-icon {
            position: absolute;
            left: 14px;
            color: #9ca3af;
            pointer-events: none;
          }

          .search-input {
            width: 100%;
            padding: 10px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            transition: all 0.2s ease;
          }

          .search-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .search-input::placeholder {
            color: #9ca3af;
          }

          /* 筛选控制栏 */
          .filter-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            padding: 20px 24px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            margin-bottom: 40px;
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
            display: flex;
            max-width: 120px;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: #3b82f6;
            border: 1px solid #e2e8f0;
            color: white;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
          }

          .refresh-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
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
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

          .chart-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px 16px 24px;
            border-bottom: 1px solid #f1f5f9;
            background: #fafbfc;
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

          /* 项目表格 */
          .projects-table {
            width: 100%;
            border-collapse: collapse;
          }

          .projects-table thead {
            background: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
          }

          .projects-table th {
            padding: 16px 20px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .projects-table tbody tr {
            border-bottom: 1px solid #f1f5f9;
            transition: background-color 0.2s ease;
          }

          .projects-table tbody tr:hover {
            background-color: #f8fafc;
          }

          .projects-table td {
            padding: 16px 20px;
            font-size: 14px;
            color: #1e293b;
            vertical-align: middle;
          }

          .project-name {
            font-weight: 600;
            color: #1e293b;
          }

          .project-text {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          /* 状态徽章颜色 */
          .status-badge.yellow {
            background: #fef3c7;
            color: #92400e;
          }

          .status-badge.blue {
            background: #dbeafe;
            color: #1e40af;
          }

          .status-badge.green {
            background: #d1fae5;
            color: #065f46;
          }

          .status-badge.purple {
            background: #e9d5ff;
            color: #6b21a8;
          }

          .status-badge.gray {
            background: #f1f5f9;
            color: #475569;
          }

          /* 操作按钮样式 */
          .action-btn.view-btn:hover {
            background: #dbeafe;
            color: #2563eb;
          }

          .action-btn.edit-btn:hover {
            background: #fef3c7;
            color: #d97706;
          }

          .action-btn.delete-btn:hover {
            background: #fee2e2;
            color: #dc2626;
          }

          .action-btn.attach-btn:hover {
            background: #f3e8ff;
            color: #9333ea;
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

          @media (max-width: 480px) {
            .detail-grid {
              gap: 24px;
            }
            
            .detail-section {
              padding: 16px;
            }
            
            .detail-group {
              gap: 12px;
            }
            
            .detail-value {
              padding: 10px 12px;
            }
          }

          .actions-cell {
            padding: 16px 20px;
            text-align: center;
            background: white;
            border-bottom: 1px solid #f1f5f9;
          }

          .action-buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 16px;
          }

          .action-group {
            display: flex;
            gap: 6px;
            padding: 4px;
            border-radius: 8px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
          }

          .primary-actions {
            background: #f8fafc;
            border-color: #e2e8f0;
          }

          .extended-actions {
            background: #fef7ff;
            border-color: #e9d5ff;
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
            transition: all 0.2s ease;
            background: transparent;
          }

          .action-btn.ai-generate-btn {
            color: #f59e0b;
            position: relative;
          }

          .action-btn.ai-generate-btn:hover {
            background: #fef3c7;
            color: #d97706;
          }

          .action-btn.ai-generate-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
          }

          .action-btn.ai-generate-btn.loading {
            color: #d97706;
            background: #fef3c7;
          }

          .action-btn.ai-view-btn {
            color: #06b6d4;
            position: relative;
          }

          .action-btn.ai-view-btn:hover {
            background: #cffafe;
            color: #0891b2;
          }

          .action-btn.ai-view-btn.has-report {
            color: #f59e0b;
          }

          .action-btn.ai-view-btn.has-report:hover {
            background: #d1fae5;
            color: #047857;
          }

          .loading-spinner {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 8px;
            height: 8px;
            border: 1px solid #d97706;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }

          .loading-row td {
            padding: 20px;
          }

          .no-data {
            text-align: center;
            padding: 60px 20px;
          }

          .no-data-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            color: #9ca3b8;
          }

          .no-data-icon {
            opacity: 0.5;
          }

          .pagination-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-top: 1px solid #f1f5f9;
            background: #fafbfc;
          }

          .pagination-info {
            font-size: 14px;
            color: #64748b;
          }

          .pagination-controls {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .page-btn {
            padding: 8px 12px;
            border: 1px solid #e2e8f0;
            background: white;
            color: #64748b;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .page-btn:not(:disabled):hover {
            background: #f8fafc;
            border-color: #cbd5e1;
          }

          .page-numbers {
            display: flex;
            gap: 2px;
            margin: 0 8px;
          }

          .page-number {
            width: 36px;
            height: 36px;
            border: 1px solid #e2e8f0;
            background: white;
            color: #64748b;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .page-number.active {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }

          .page-number:not(.active):hover {
            background: #f8fafc;
            border-color: #cbd5e1;
          }

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

          .modal-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 32px;
            border-bottom: 1px solid #f1f5f9;
            background: #fafbfc;
          }

          .modal-header h2 {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
          }

          .modal-close {
            width: 36px;
            height: 36px;
            border: none;
            background: #f8fafc;
            color: #64748b;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .modal-close:hover {
            background: #f1f5f9;
            color: #475569;
          }

          .modal-body {
            flex: 1;
            overflow-y: auto;
            padding: 32px;
          }

          .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px 28px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .form-group.full-width {
            grid-column: 1 / -1;
          }

          .form-group label {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 2px;
          }

          .form-input, .form-textarea {
            padding: 14px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            color: #374151;
            transition: all 0.2s ease;
            width: 100%;
            box-sizing: border-box;
          }

          .form-input:focus, .form-textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .form-input.error, .form-textarea.error {
            border-color: #dc2626;
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
          }

          .form-textarea {
            resize: vertical;
            min-height: 100px;
            font-family: inherit;
          }

          .error-text {
            font-size: 12px;
            color: #dc2626;
            margin-top: 4px;
            font-weight: 500;
          }

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
          }

          /* 响应式设计 */
          @media (max-width: 768px) {
            .modal-container {
              max-width: 95vw;
              margin: 10px;
            }
            
            .modal-header {
              padding: 20px 24px;
            }
            
            .modal-body {
              padding: 24px;
            }
            
            .form-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
            
            .form-group.full-width {
              grid-column: 1;
            }
            
            .modal-footer {
              padding: 20px 24px;
              flex-direction: column;
            }
            
            .btn-secondary, .btn-primary {
              width: 100%;
              justify-content: center;
            }
          }

          @media (max-width: 480px) {
            .modal-overlay {
              padding: 10px;
            }
            
            .modal-container {
              max-height: 95vh;
            }
            
            .modal-body {
              padding: 20px;
            }
            
            .form-grid {
              gap: 16px;
            }
            
            .form-input, .form-textarea {
              padding: 10px 12px;
            }
          }

          /* 查看详情模态框样式 */
          .detail-grid {
            display: flex;
            flex-direction: column;
            gap: 32px;
          }

          .detail-section {
            border: 1px solid #f1f5f9;
            border-radius: 12px;
            padding: 24px;
            background: #fafbfc;
          }

          .detail-section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 20px 0;
            padding-bottom: 12px;
            border-bottom: 2px solid #e2e8f0;
          }

          .detail-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px 24px;
          }

          .detail-item {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .detail-item.full-width {
            grid-column: 1 / -1;
          }

          .detail-label {
            font-size: 13px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
          }

          .detail-value {
            font-size: 14px;
            color: #1e293b;
            font-weight: 500;
            background: white;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            min-height: 20px;
          }

          .detail-text {
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
          }

          .status-badge.active {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
          }

          .status-badge.completed {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
          }

          .status-badge.paused {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
          }

          /* 响应式设计 - 查看详情 */
          @media (max-width: 768px) {
            .detail-group {
              grid-template-columns: 1fr;
              gap: 16px;
            }
            
            .detail-item.full-width {
              grid-column: 1;
            }
            
            .detail-section {
              padding: 20px;
            }
            
            .detail-group {
              gap: 12px;
            }
            
            .detail-value {
              padding: 10px 12px;
            }
          }

          @media (max-width: 480px) {
            .detail-grid {
              gap: 24px;
            }
            
            .detail-section {
              padding: 16px;
            }
            
            .detail-group {
              gap: 12px;
            }
            
            .detail-value {
              padding: 10px 12px;
            }
          }

          .actions-cell {
            padding: 16px 20px;
            text-align: center;
            background: white;
            border-bottom: 1px solid #f1f5f9;
          }

          .action-buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 16px;
          }

          .action-group {
            display: flex;
            gap: 6px;
            padding: 4px;
            border-radius: 8px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
          }

          .primary-actions {
            background: #f8fafc;
            border-color: #e2e8f0;
          }

          .extended-actions {
            background: #fef7ff;
            border-color: #e9d5ff;
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
            transition: all 0.2s ease;
            background: transparent;
          }

          .action-btn.ai-generate-btn {
            color: #f59e0b;
            position: relative;
          }

          .action-btn.ai-generate-btn:hover {
            background: #fef3c7;
            color: #d97706;
          }

          .action-btn.ai-generate-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
          }

          .action-btn.ai-generate-btn.loading {
            color: #d97706;
            background: #fef3c7;
          }

          .action-btn.ai-view-btn {
            color: #06b6d4;
            position: relative;
          }

          .action-btn.ai-view-btn:hover {
            background: #cffafe;
            color: #0891b2;
          }

          .action-btn.ai-view-btn.has-report {
            color: #f59e0b;
          }

          .action-btn.ai-view-btn.has-report:hover {
            background: #d1fae5;
            color: #047857;
          }

          .loading-spinner {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 8px;
            height: 8px;
            border: 1px solid #d97706;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          /* AI报告按钮样式 */
          .ai-generate-btn {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
            border: none;
            transition: all 0.2s ease;
            position: relative;
            min-width: 60px;
          }

          .ai-generate-btn:hover:not(:disabled) {
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          }

          .ai-generate-btn.loading {
            background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
            cursor: not-allowed;
          }

          .ai-generate-btn.error {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          }

          .ai-generate-btn.error:hover:not(:disabled) {
            background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          }

          .ai-view-btn {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            color: #64748b;
            transition: all 0.2s ease;
          }

          .ai-view-btn:hover:not(:disabled) {
            background: #f1f5f9;
            border-color: #cbd5e1;
          }

          .ai-view-btn.has-report {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border-color: #059669;
          }

          .ai-view-btn.has-report:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          }

          .ai-view-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </DashboardLayout>
  )
}
