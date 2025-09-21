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
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { 
  ApiResponse, 
  PaginatedResponse 
} from '@/types'

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

  // 项目列表相关状态
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projects, setProjects] = useState<InternalPreparationProject[]>([])
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
  const [selectedProject, setSelectedProject] = useState<InternalPreparationProject | null>(null)
  const [sourceDepartments, setSourceDepartments] = useState<string[]>([])

  // 创建项目表单状态
  const [createFormData, setCreateFormData] = useState({
    source: '',
    name: '',
    composition: '',
    function: '',
    specification: '',
    duration: '',
    dosage: '',
    recordNumber: '',
    patent: '',
    remarks: ''
  })
  const [createFormErrors, setCreateFormErrors] = useState<{[key: string]: string}>({})
  const [createFormLoading, setCreateFormLoading] = useState(false)

  // 编辑项目表单状态
  const [editFormData, setEditFormData] = useState({
    source: '',
    name: '',
    composition: '',
    function: '',
    specification: '',
    duration: '',
    dosage: '',
    recordNumber: '',
    patent: '',
    remarks: ''
  })
  const [editFormErrors, setEditFormErrors] = useState<{[key: string]: string}>({})
  const [editFormLoading, setEditFormLoading] = useState(false)

  // AI报告相关状态
  const [aiReportStatus, setAiReportStatus] = useState<{[key: string]: 'idle' | 'generating' | 'completed' | 'error'}>({})
  const [aiReportUrls, setAiReportUrls] = useState<{[key: string]: string}>({})
  const [currentGeneratingProject, setCurrentGeneratingProject] = useState<string | null>(null)

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
      
      // 先清理所有现有的图表实例
      const chartIds = ['statusChart', 'sourceDeptChart', 'monthlyTrendChart', 'durationChart']
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
            data: [2, 3, 1, 4, 2, 4],
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
    
    // 清理现有图表 - 使用Chart.js的标准方法
    const destroyCharts = async () => {
      try {
        const Chart = (await import('chart.js/auto')).default
        const chartIds = ['statusChart', 'sourceDeptChart', 'monthlyTrendChart', 'durationChart']
        
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

  const handleViewProject = (project: InternalPreparationProject) => {
    setSelectedProject(project)
    setShowDetailModal(true)
  }

  const handleEditProject = (project: InternalPreparationProject) => {
    setSelectedProject(project)
    // 预填充编辑表单数据
    setEditFormData({
      source: project.source,
      name: project.name,
      composition: project.composition,
      function: project.function,
      specification: project.specification,
      duration: project.duration,
      dosage: project.dosage,
      recordNumber: project.recordNumber || '',
      patent: project.patent || '',
      remarks: project.remarks || ''
    })
    setEditFormErrors({})
    setShowEditModal(true)
  }

  const handleDeleteProject = async (project: InternalPreparationProject) => {
    if (!window.confirm(`确定要删除项目"${project.name}"吗？`)) {
      return
    }

    try {
      const { ApiClient } = await import('@/utils/auth')
      const response = await ApiClient.delete(`/internal-preparation-projects/${project._id}`) as unknown as ApiResponse<any>
      
      if (response.success) {
        await loadProjectsList() // 重新加载列表
      } else {
        alert('删除失败：' + (response.error || '未知错误'))
      }
    } catch (error) {
      console.error('删除项目失败:', error)
      alert('删除失败，请稍后重试')
    }
  }

  const handleCreateProject = () => {
    setSelectedProject(null)
    setCreateFormData({
      source: '',
      name: '',
      composition: '',
      function: '',
      specification: '',
      duration: '',
      dosage: '',
      recordNumber: '',
      patent: '',
      remarks: ''
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
    
    if (!createFormData.source.trim()) errors.source = '来源科室为必填项'
    if (!createFormData.name.trim()) errors.name = '项目名称为必填项'
    if (!createFormData.composition.trim()) errors.composition = '组方为必填项'
    if (!createFormData.function.trim()) errors.function = '功能为必填项'
    if (!createFormData.specification.trim()) errors.specification = '规格为必填项'
    if (!createFormData.duration.trim()) errors.duration = '年限为必填项'
    if (!createFormData.dosage.trim()) errors.dosage = '用量为必填项'
    if (!createFormData.recordNumber.trim()) errors.recordNumber = '备案号为必填项'
    
    // 验证年限是否为数字
    if (createFormData.duration && isNaN(Number(createFormData.duration))) {
      errors.duration = '年限必须为数字'
    }
    
    setCreateFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateSubmit = async () => {
    if (!validateCreateForm()) {
      return
    }

    try {
      setCreateFormLoading(true)
      const { ApiClient } = await import('@/utils/auth')
      
      const response = await ApiClient.post('/internal-preparation-projects', createFormData) as unknown as ApiResponse<InternalPreparationProject>
      
      if (response.success) {
        setShowCreateModal(false)
        await loadProjectsList() // 重新加载列表
        alert('项目创建成功！')
      } else {
        alert('创建失败：' + (response.error || '未知错误'))
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
      source: '',
      name: '',
      composition: '',
      function: '',
      specification: '',
      duration: '',
      dosage: '',
      recordNumber: '',
      patent: '',
      remarks: ''
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
    
    if (!editFormData.source.trim()) {
      errors.source = '来源科室不能为空'
    }
    if (!editFormData.name.trim()) {
      errors.name = '项目名称不能为空'
    }
    if (!editFormData.composition.trim()) {
      errors.composition = '组方不能为空'
    }
    if (!editFormData.function.trim()) {
      errors.function = '功能不能为空'
    }
    if (!editFormData.specification.trim()) {
      errors.specification = '规格不能为空'
    }
    if (!editFormData.duration.trim()) {
      errors.duration = '有效期不能为空'
    } else if (isNaN(Number(editFormData.duration))) {
      errors.duration = '有效期必须为数字'
    }
    if (!editFormData.dosage.trim()) {
      errors.dosage = '用量不能为空'
    }
    if (!editFormData.recordNumber.trim()) {
      errors.recordNumber = '备案号不能为空'
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
      const { ApiClient } = await import('@/utils/auth')
      
      const updateData = {
        source: editFormData.source.trim(),
        name: editFormData.name.trim(),
        composition: editFormData.composition.trim(),
        function: editFormData.function.trim(),
        specification: editFormData.specification.trim(),
        duration: editFormData.duration.trim(),
        dosage: editFormData.dosage.trim(),
        recordNumber: editFormData.recordNumber.trim(),
        patent: editFormData.patent.trim(),
        remarks: editFormData.remarks.trim()
      }

      const response = await ApiClient.put(`/internal-preparation-projects/${selectedProject._id}`, updateData) as ApiResponse<InternalPreparationProject>
      
      if (response.success) {
        setShowEditModal(false)
        setSelectedProject(null)
        setEditFormData({
          source: '',
          name: '',
          composition: '',
          function: '',
          specification: '',
          duration: '',
          dosage: '',
          recordNumber: '',
          patent: '',
          remarks: ''
        })
        await loadProjectsList()
      } else {
        alert('更新失败：' + (response.error || '未知错误'))
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
      source: '',
      name: '',
      composition: '',
      function: '',
      specification: '',
      duration: '',
      dosage: '',
      recordNumber: '',
      patent: '',
      remarks: ''
    })
    setEditFormErrors({})
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedProject(null)
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '进行中'
      case 'completed': return '已完成'
      case 'paused': return '已暂停'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green'
      case 'completed': return 'blue'
      case 'paused': return 'yellow'
      default: return 'gray'
    }
  }

  const handleAttachmentManagement = (project: InternalPreparationProject) => {
    console.log('跳转到附件管理页面:', project.name)
    // TODO: 实现跳转到附件管理页面的逻辑
  }

  const handleGenerateAIReport = async (project: InternalPreparationProject) => {
    // 检查是否已经在生成中
    if (aiReportStatus[project._id] === 'generating') {
      alert('该项目的AI报告正在生成中，请耐心等待...')
      return
    }

    // 检查是否已经生成完成
    if (aiReportStatus[project._id] === 'completed') {
      const confirmed = confirm('该项目已有AI报告，是否重新生成？重新生成将覆盖原有报告。')
      if (!confirmed) return
    }

    // 确认生成AI报告
    const confirmed = confirm(
      `确定要为项目"${project.name}"生成AI报告吗？\n\n将会发送以下数据：\n` +
      `• 项目名称: ${project.name}\n` +
      `• 来源科室: ${project.source}\n` +
      `• 组方: ${project.composition}\n` +
      `• 功能: ${project.function}\n` +
      `• 规格: ${project.specification}\n` +
      `• 用量: ${project.dosage}\n` +
      `• 有效期: ${project.duration}年\n` +
      `• 备案号: ${project.recordNumber || '无'}\n\n` +
      `生成过程大约需要60秒，请耐心等待...`
    )
    
    if (!confirmed) return

    try {
      // 设置生成状态
      setAiReportStatus(prev => ({
        ...prev,
        [project._id]: 'generating'
      }))
      setCurrentGeneratingProject(project._id)

      console.log('开始生成AI报告:', {
        projectId: project._id,
        projectName: project.name,
        projectData: {
          source: project.source,
          name: project.name,
          composition: project.composition,
          function: project.function,
          specification: project.specification,
          duration: project.duration,
          dosage: project.dosage,
          recordNumber: project.recordNumber,
          patent: project.patent,
          remarks: project.remarks
        }
      })

      // 模拟API调用 - 60秒延迟
      await new Promise(resolve => setTimeout(resolve, 60000))

      // 模拟成功生成报告，返回外部链接
      const mockReportUrl = 'https://jd4omasmev.feishu.cn/docx/UtnMdLqkVo0dNyxPgt9cVTbTnMg'
      
      setAiReportStatus(prev => ({
        ...prev,
        [project._id]: 'completed'
      }))
      setAiReportUrls(prev => ({
        ...prev,
        [project._id]: mockReportUrl
      }))
      setCurrentGeneratingProject(null)

      alert(`AI报告生成成功！\n项目"${project.name}"的智能分析报告已完成。\n\n您可以点击"查看AI报告"按钮查看详细内容。`)

    } catch (error) {
      console.error('AI报告生成失败:', error)
      setAiReportStatus(prev => ({
        ...prev,
        [project._id]: 'error'
      }))
      setCurrentGeneratingProject(null)
      alert('AI报告生成失败，请稍后重试。')
    }
  }

  const handleViewAIReport = (project: InternalPreparationProject) => {
    const reportStatus = aiReportStatus[project._id]
    const reportUrl = aiReportUrls[project._id]

    // 检查报告状态
    if (reportStatus === 'generating') {
      const progress = currentGeneratingProject === project._id ? '生成中...' : '排队中...'
      alert(`项目"${project.name}"的AI报告正在${progress}\n\n请耐心等待生成完成后再查看。`)
      return
    }

    if (reportStatus !== 'completed' || !reportUrl) {
      const shouldGenerate = confirm(
        `项目"${project.name}"尚未生成AI报告。\n\n是否现在开始生成？`
      )
      if (shouldGenerate) {
        handleGenerateAIReport(project)
      }
      return
    }

    // 确认跳转到外部链接
    const confirmed = confirm(
      `即将跳转到外部链接查看AI报告：\n\n` +
      `项目名称: ${project.name}\n` +
      `报告链接: ${reportUrl}\n\n` +
      `确定要在新窗口中打开该报告吗？`
    )

    if (confirmed) {
      console.log('跳转到AI报告:', {
        projectId: project._id,
        projectName: project.name,
        reportUrl: reportUrl
      })
      
      // 在新窗口中打开外部链接
      window.open(reportUrl, '_blank')
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

  const loadProjectsList = async () => {
    try {
      setProjectsLoading(true)
      
      const { ApiClient } = await import('@/utils/auth')
      
      // 构建查询参数
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString()
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (projectStatusFilter) params.append('status', projectStatusFilter)
      if (sourceFilter) params.append('source', sourceFilter)
      
      const response = await ApiClient.get<ApiResponse<PaginatedResponse<InternalPreparationProject>>>(`/internal-preparation-projects?${params}`)
      
      if (response.success && response.data) {
        setProjects(response.data.data || [])
        setTotalProjects(response.data.pagination.total)
        setTotalPages(response.data.pagination.totalPages)
        
        // 提取科室列表
        const departments = new Set(response.data.data.map(p => p.source))
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
          <div className="projects-section">
            {/* 顶部操作栏 */}
            <div className="project-header">
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
              <div className="action-section-2">
                <button className="create-button" onClick={handleCreateProject}>
                  <PlusIcon className="w-4 h-4" />
                  新建项目
                </button>
              </div>
            </div>

            {/* 筛选控制栏 */}
            <div className="filter-bar">
              <div className="filter-controls">
                <div className="filter-item">
                  <FunnelIcon className="w-4 h-4 filter-icon" />
                  <select 
                    value={projectStatusFilter} 
                    onChange={handleProjectStatusFilterChange}
                    className="filter-select"
                  >
                    <option value="">全部状态</option>
                    <option value="active">进行中</option>
                    <option value="completed">已完成</option>
                    <option value="paused">已暂停</option>
                  </select>
                </div>
                <div className="filter-item">
                  <BuildingOffice2Icon className="w-4 h-4 filter-icon" />
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
              <button className="refresh-button" onClick={handleRefreshData}>
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
                                  aiReportStatus[project._id] === 'generating' ? 'loading' : ''
                                }`}
                                title={
                                  aiReportStatus[project._id] === 'generating' 
                                    ? '正在生成AI报告...' 
                                    : aiReportStatus[project._id] === 'completed'
                                    ? '重新生成AI报告'
                                    : '生成AI报告'
                                }
                                disabled={aiReportStatus[project._id] === 'generating'}
                              >
                                <SparklesIcon className="w-4 h-4" />
                                {aiReportStatus[project._id] === 'generating' && (
                                  <div className="loading-spinner"></div>
                                )}
                              </button>
                              <button
                                onClick={() => handleViewAIReport(project)}
                                className={`action-btn ai-view-btn ${
                                  aiReportStatus[project._id] === 'completed' ? 'has-report' : ''
                                }`}
                                title={
                                  aiReportStatus[project._id] === 'completed'
                                    ? '查看AI报告'
                                    : aiReportStatus[project._id] === 'generating'
                                    ? '报告生成中...'
                                    : '尚未生成报告'
                                }
                              >
                                <DocumentTextIcon className="w-4 h-4" />
                                {aiReportStatus[project._id] === 'completed' && (
                                  <div className="report-indicator"></div>
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
                    <label>来源科室 *</label>
                    <input
                      type="text"
                      value={createFormData.source}
                      onChange={(e) => handleCreateFormChange('source', e.target.value)}
                      className={`form-input ${createFormErrors.source ? 'error' : ''}`}
                      placeholder="请输入来源科室"
                    />
                    {createFormErrors.source && <span className="error-text">{createFormErrors.source}</span>}
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
                    <label>规格 *</label>
                    <input
                      type="text"
                      value={createFormData.specification}
                      onChange={(e) => handleCreateFormChange('specification', e.target.value)}
                      className={`form-input ${createFormErrors.specification ? 'error' : ''}`}
                      placeholder="请输入规格"
                    />
                    {createFormErrors.specification && <span className="error-text">{createFormErrors.specification}</span>}
                  </div>

                  <div className="form-group">
                    <label>有效期（年） *</label>
                    <input
                      type="number"
                      value={createFormData.duration}
                      onChange={(e) => handleCreateFormChange('duration', e.target.value)}
                      className={`form-input ${createFormErrors.duration ? 'error' : ''}`}
                      placeholder="请输入有效期"
                      min="1"
                    />
                    {createFormErrors.duration && <span className="error-text">{createFormErrors.duration}</span>}
                  </div>

                  <div className="form-group">
                    <label>用量 *</label>
                    <input
                      type="text"
                      value={createFormData.dosage}
                      onChange={(e) => handleCreateFormChange('dosage', e.target.value)}
                      className={`form-input ${createFormErrors.dosage ? 'error' : ''}`}
                      placeholder="请输入用量"
                    />
                    {createFormErrors.dosage && <span className="error-text">{createFormErrors.dosage}</span>}
                  </div>

                  <div className="form-group">
                    <label>备案号 *</label>
                    <input
                      type="text"
                      value={createFormData.recordNumber}
                      onChange={(e) => handleCreateFormChange('recordNumber', e.target.value)}
                      className={`form-input ${createFormErrors.recordNumber ? 'error' : ''}`}
                      placeholder="请输入备案号"
                    />
                    {createFormErrors.recordNumber && <span className="error-text">{createFormErrors.recordNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label>专利情况</label>
                    <input
                      type="text"
                      value={createFormData.patent}
                      onChange={(e) => handleCreateFormChange('patent', e.target.value)}
                      className="form-input"
                      placeholder="请输入专利情况（可选）"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>备注</label>
                    <textarea
                      value={createFormData.remarks}
                      onChange={(e) => handleCreateFormChange('remarks', e.target.value)}
                      className="form-textarea"
                      placeholder="请输入备注（可选）"
                      rows={3}
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
                    <label>来源科室 *</label>
                    <input
                      type="text"
                      className={`form-input ${editFormErrors.source ? 'error' : ''}`}
                      placeholder="请输入来源科室"
                      value={editFormData.source}
                      onChange={(e) => handleEditFormChange('source', e.target.value)}
                    />
                    {editFormErrors.source && <div className="error-text">{editFormErrors.source}</div>}
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
                    <label>规格 *</label>
                    <input
                      type="text"
                      className={`form-input ${editFormErrors.specification ? 'error' : ''}`}
                      placeholder="请输入规格"
                      value={editFormData.specification}
                      onChange={(e) => handleEditFormChange('specification', e.target.value)}
                    />
                    {editFormErrors.specification && <div className="error-text">{editFormErrors.specification}</div>}
                  </div>

                  <div className="form-group">
                    <label>有效期（年）*</label>
                    <input
                      type="text"
                      className={`form-input ${editFormErrors.duration ? 'error' : ''}`}
                      placeholder="请输入有效期"
                      value={editFormData.duration}
                      onChange={(e) => handleEditFormChange('duration', e.target.value)}
                    />
                    {editFormErrors.duration && <div className="error-text">{editFormErrors.duration}</div>}
                  </div>

                  <div className="form-group">
                    <label>用量 *</label>
                    <input
                      type="text"
                      className={`form-input ${editFormErrors.dosage ? 'error' : ''}`}
                      placeholder="请输入用量"
                      value={editFormData.dosage}
                      onChange={(e) => handleEditFormChange('dosage', e.target.value)}
                    />
                    {editFormErrors.dosage && <div className="error-text">{editFormErrors.dosage}</div>}
                  </div>

                  <div className="form-group">
                    <label>备案号 *</label>
                    <input
                      type="text"
                      className={`form-input ${editFormErrors.recordNumber ? 'error' : ''}`}
                      placeholder="请输入备案号"
                      value={editFormData.recordNumber}
                      onChange={(e) => handleEditFormChange('recordNumber', e.target.value)}
                    />
                    {editFormErrors.recordNumber && <div className="error-text">{editFormErrors.recordNumber}</div>}
                  </div>

                  <div className="form-group full-width">
                    <label>专利情况</label>
                    <textarea
                      className="form-textarea"
                      placeholder="请输入专利情况（可选）"
                      value={editFormData.patent}
                      onChange={(e) => handleEditFormChange('patent', e.target.value)}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>备注</label>
                    <textarea
                      className="form-textarea"
                      placeholder="请输入备注（可选）"
                      value={editFormData.remarks}
                      onChange={(e) => handleEditFormChange('remarks', e.target.value)}
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
                    <h3 className="detail-section-title">基本信息</h3>
                    <div className="detail-group">
                      <div className="detail-item">
                        <label className="detail-label">项目名称</label>
                        <div className="detail-value">{selectedProject.name}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">来源科室</label>
                        <div className="detail-value">{selectedProject.source}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">备案号</label>
                        <div className="detail-value">{selectedProject.recordNumber || '-'}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">项目状态</label>
                        <div className="detail-value">
                          <span className={`status-badge ${selectedProject.status}`}>
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
                        <label className="detail-label">规格</label>
                        <div className="detail-value">{selectedProject.specification}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">用量</label>
                        <div className="detail-value">{selectedProject.dosage}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">有效期</label>
                        <div className="detail-value">{selectedProject.duration} 年</div>
                      </div>
                    </div>
                  </div>

                  {(selectedProject.patent || selectedProject.remarks) && (
                    <div className="detail-section">
                      <h3 className="detail-section-title">其他信息</h3>
                      <div className="detail-group">
                        {selectedProject.patent && (
                          <div className="detail-item full-width">
                            <label className="detail-label">专利情况</label>
                            <div className="detail-value detail-text">{selectedProject.patent}</div>
                          </div>
                        )}
                        {selectedProject.remarks && (
                          <div className="detail-item full-width">
                            <label className="detail-label">备注</label>
                            <div className="detail-value detail-text">{selectedProject.remarks}</div>
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
                        <div className="detail-value">{new Date(selectedProject.createTime).toLocaleString()}</div>
                      </div>
                      <div className="detail-item">
                        <label className="detail-label">更新时间</label>
                        <div className="detail-value">{new Date(selectedProject.updateTime).toLocaleString()}</div>
                      </div>
                      {selectedProject.createdBy && (
                        <div className="detail-item">
                          <label className="detail-label">创建人</label>
                          <div className="detail-value">{selectedProject.createdBy}</div>
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

          .action-section {
            display: flex;
            gap: 12px;
            margin-top: 20px;
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
            margin-bottom: 42px;
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

          /* 项目列表样式 */
          .projects-section {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .project-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 1px solid #f1f5f9;
          }

          .search-section {
            flex: 1;
            max-width: 400px;
          }

          .search-input-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            position: relative;
          }

          .search-icon {
            color: #6b7280;
          }

          .search-input {
            width: 100%;
            padding: 12px 12px 12px 20px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            transition: border-color 0.2s ease;
          }

          .search-input:focus {
            outline: none;
            border-color: #3b82f6;
          }

          .create-button {
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
          }

          .create-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
          }

          .project-table-container {
            overflow-x: auto;
          }

          .project-table {
            width: 100%;
            border-collapse: collapse;
          }

          .project-table th {
            background: #f8fafc;
            padding: 16px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
          }

          .project-table td {
            padding: 16px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
          }

          .project-row:hover {
            background: #f8fafc;
          }

          .project-name {
            font-weight: 600;
            color: #1e293b;
          }

          .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }

          .status-badge.green {
            background: #dcfce7;
            color: #16a34a;
          }

          .status-badge.blue {
            background: #dbeafe;
            color: #2563eb;
          }

          .status-badge.yellow {
            background: #fef3c7;
            color: #d97706;
          }

          .status-badge.gray {
            background: #f1f5f9;
            color: #64748b;
          }

          .action-buttons {
            display: flex;
            gap: 8px;
          }

          .action-btn {
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .action-btn.view-btn {
            color: #3b82f6;
          }

          .action-btn.view-btn:hover {
            background: #dbeafe;
            color: #1d4ed8;
          }

          .action-btn.edit-btn {
            color: #10b981;
          }

          .action-btn.edit-btn:hover {
            background: #d1fae5;
            color: #047857;
          }

          .action-btn.delete-btn {
            color: #ef4444;
          }

          .action-btn.delete-btn:hover {
            background: #fee2e2;
            color: #dc2626;
          }

          .action-btn.attachment-btn {
            color: #8b5cf6;
          }

          .action-btn.attachment-btn:hover {
            background: #ede9fe;
            color: #7c3aed;
          }

          .action-btn.ai-generate-btn {
            color: #f59e0b;
          }

          .action-btn.ai-generate-btn:hover {
            background: #fef3c7;
            color: #d97706;
          }

          .action-btn.ai-view-btn {
            color: #06b6d4;
          }

          .action-btn.ai-view-btn:hover {
            background: #cffafe;
            color: #0891b2;
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
            transform: none;
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
            color: #10b981;
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

          .report-indicator {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 6px;
            height: 6px;
            background: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 0 1px white;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </DashboardLayout>
  )
}
