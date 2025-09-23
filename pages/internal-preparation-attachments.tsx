import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { 
  PaperClipIcon, 
  CloudArrowUpIcon, 
  CloudArrowDownIcon,
  TrashIcon,
  DocumentIcon,
  PhotoIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import TopNavigation from '@/components/layout/TopNavigation'
import SideNavigation from '@/components/layout/SideNavigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ApiClient, TokenManager } from '@/utils/auth'

/* ------------------------------------------------------------------------------------------ */

interface IAttachment {
  _id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  storageType: string
  filePath: string
  gridFSFileId?: string
  projectType: string
  projectId: string
  description?: string
  uploadTime: string
  uploadedBy: string
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface User {
  _id: string
  username: string
  realName: string
}

interface ProjectInfo {
  id: string
  name: string
  type: string
}

/* ------------------------------------------------------------------------------------------ */

export default function InternalPreparationAttachments() {
  const router = useRouter()

  // 获取路由参数
  const { projectId, projectName, projectType } = router.query

  // 项目信息状态
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null)
  const [pageReady, setPageReady] = useState(false)

  // 状态管理
  const [loading, setLoading] = useState(true)
  const [attachments, setAttachments] = useState<IAttachment[]>([])
  const [totalAttachments, setTotalAttachments] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('')
  const [fileTypeFilter, setFileTypeFilter] = useState('')
  
  // 上传状态
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadDescription, setUploadDescription] = useState('')
  
  // 删除状态
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  /* ------------------------------------------------------------------------------------------ */

  // 初始化页面参数
  useEffect(() => {
    console.log('=== 附件管理页面初始化调试信息 ===')
    console.log('router.isReady:', router.isReady)
    console.log('router.asPath:', router.asPath)
    console.log('router.pathname:', router.pathname)
    console.log('完整的router.query:', router.query)
    console.log('解构出的参数:')
    console.log('- projectId:', projectId)
    console.log('- projectName:', projectName) 
    console.log('- projectType:', projectType)
    
    // 等待路由器完全加载
    if (!router.isReady) {
      console.log('⏳ 路由器未就绪，等待中...')
      return
    }

    console.log('✅ 路由器已就绪，开始参数验证')

    // 权限检查 - 使用TokenManager
    const isAuthenticated = TokenManager.isAuthenticated()
    const token = TokenManager.getToken()
    const user = TokenManager.getUser()
    
    console.log('🔐 权限检查:')
    console.log('- TokenManager.isAuthenticated():', isAuthenticated)
    console.log('- token存在:', !!token)
    console.log('- token长度:', token ? token.length : 0)
    console.log('- 用户信息:', user)
    
    if (!isAuthenticated) {
      console.log('❌ 用户未认证，跳转到登录页')
      router.replace('/login')
      return
    }

    console.log('✅ 权限验证通过')

    // 参数验证 - 使用更宽松的检查
    console.log('📋 参数验证详情:')
    console.log('- projectId类型:', typeof projectId, '值:', projectId)
    console.log('- projectName类型:', typeof projectName, '值:', projectName)
    console.log('- projectType类型:', typeof projectType, '值:', projectType)
    
    // 检查必要参数是否存在
    const hasProjectId = projectId && String(projectId).trim() !== ''
    const hasProjectName = projectName && String(projectName).trim() !== ''
    const hasProjectType = projectType && String(projectType).trim() !== ''
    
    console.log('参数存在性检查:')
    console.log('- hasProjectId:', hasProjectId)
    console.log('- hasProjectName:', hasProjectName) 
    console.log('- hasProjectType:', hasProjectType)
    
    if (!hasProjectId || !hasProjectName || !hasProjectType) {
      console.log('❌ 缺少必要的项目参数')
      console.log('缺少的参数详情:', {
        projectId: hasProjectId ? '✓' : '❌ 缺少或为空',
        projectName: hasProjectName ? '✓' : '❌ 缺少或为空', 
        projectType: hasProjectType ? '✓' : '❌ 缺少或为空'
      })
      
      // 延迟跳转，确保用户能看到错误信息
      setTimeout(() => {
        alert('缺少必要的项目参数，将返回项目列表')
        router.replace('/internal-preparations')
      }, 100)
      return
    }

    console.log('✅ 所有参数验证通过')
    
    // 设置项目信息
    const info = {
      id: String(projectId),
      name: String(projectName),
      type: String(projectType)
    }
    console.log('📝 设置项目信息:', info)
    setProjectInfo(info)

    console.log('🎯 页面初始化完成，设置pageReady = true')
    setPageReady(true)
    
  }, [router.isReady, router.asPath, projectId, projectName, projectType])

  // 页面就绪后加载数据
  useEffect(() => {
    console.log('=== 数据加载检查 ===')
    console.log('pageReady:', pageReady)
    console.log('projectInfo:', projectInfo)
    
    if (pageReady && projectInfo) {
      console.log('🚀 开始加载附件数据')
      loadAttachments()
    } else {
      console.log('⏳ 等待页面就绪或项目信息设置完成')
    }
  }, [pageReady, projectInfo])

  /* ------------------------------------------------------------------------------------------ */

    /* ------------------------------------------------------------------------------------------ */

  // 加载附件列表
  const loadAttachments = async (page = 1, search = '', fileType = '') => {
    if (!projectInfo) {
      console.log('❌ 项目信息不存在，无法加载附件')
      return
    }

    try {
      console.log('=== 开始加载附件列表 ===')
      console.log('加载参数:', { page, search, fileType, projectInfo })
      
      setLoading(true)
      
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        projectType: projectInfo.type,
        projectId: projectInfo.id
      })
      
      if (search.trim()) {
        params.append('search', search.trim())
      }
      
      if (fileType) {
        params.append('fileType', fileType)
      }

      const apiUrl = `/api/attachments?${params.toString()}`
      console.log('API调用URL:', apiUrl)

      const token = TokenManager.getToken()
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ 附件列表加载成功:', result.data)
        setAttachments(result.data.data)
        setTotalAttachments(result.data.total)
        setCurrentPage(result.data.page)
        setTotalPages(result.data.totalPages)
      } else {
        console.log('❌ 加载附件列表失败:', result)
      }
    } catch (error) {
      console.error('❌ 加载附件列表异常:', error)
      alert('加载附件列表失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 处理文件上传
  const handleFileUpload = async () => {
    if (!selectedFile || !projectInfo) {
      alert('请选择要上传的文件')
      return
    }

    try {
      setUploadLoading(true)
      
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('projectId', projectInfo.id)
      formData.append('projectType', projectInfo.type)
      
      if (uploadDescription.trim()) {
        formData.append('description', uploadDescription.trim())
      }

      const token = TokenManager.getToken()
      const response = await fetch('/api/attachments/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        alert('文件上传成功')
        setUploadModalOpen(false)
        setSelectedFile(null)
        setUploadDescription('')
        loadAttachments(currentPage, searchTerm, fileTypeFilter)
      } else {
        alert(result.error || '文件上传失败')
      }
    } catch (error) {
      console.error('文件上传失败:', error)
      alert('文件上传失败，请重试')
    } finally {
      setUploadLoading(false)
    }
  }

  // 处理文件下载
  const handleFileDownload = async (attachment: IAttachment) => {
    try {
      const token = TokenManager.getToken()
      const response = await fetch(`/api/attachments/${attachment._id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = attachment.originalName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('文件下载失败')
      }
    } catch (error) {
      console.error('文件下载失败:', error)
      alert('文件下载失败，请重试')
    }
  }

  // 处理文件删除
  const handleFileDelete = async (attachmentId: string) => {
    if (!confirm('确定要删除此附件吗？此操作不可恢复。')) {
      return
    }

    try {
      setDeleteLoading(attachmentId)
      
      const token = TokenManager.getToken()
      const response = await fetch('/api/attachments', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: [attachmentId] })
      })
      const result = await response.json()
      
      if (result.success) {
        alert('附件删除成功')
        loadAttachments(currentPage, searchTerm, fileTypeFilter)
      } else {
        alert('附件删除失败')
      }
    } catch (error) {
      console.error('附件删除失败:', error)
      alert('附件删除失败，请重试')
    } finally {
      setDeleteLoading(null)
    }
  }

  // 处理搜索
  const handleSearch = () => {
    setCurrentPage(1)
    loadAttachments(1, searchTerm, fileTypeFilter)
  }

  // 处理筛选
  const handleFilterChange = (newFileType: string) => {
    setFileTypeFilter(newFileType)
    setCurrentPage(1)
    loadAttachments(1, searchTerm, newFileType)
  }

  // 处理分页
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    loadAttachments(newPage, searchTerm, fileTypeFilter)
  }

  /* ------------------------------------------------------------------------------------------ */

  // 获取文件图标
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <PhotoIcon className="w-8 h-8 text-green-500" />
    } else if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
      return <DocumentIcon className="w-8 h-8 text-red-500" />
    } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) {
      return <ArchiveBoxIcon className="w-8 h-8 text-yellow-500" />
    } else {
      return <PaperClipIcon className="w-8 h-8 text-gray-500" />
    }
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN')
  }

  /* ------------------------------------------------------------------------------------------ */

  // 如果页面未就绪，显示加载状态
  if (!pageReady || !projectInfo) {
    return (
      <>
        <Head>
          <title>附件管理 - 院内制剂</title>
        </Head>
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-text">正在加载...</p>
          </div>
        </div>
      </>
    )
  }

  /* ------------------------------------------------------------------------------------------ */

  return (
    <DashboardLayout title={`附件管理 - ${projectInfo.name} - 院内制剂`}>
      <div className="attachment-page">
        {/* 页面标题和操作按钮 */}
        <div className="page-header">
          <div className="header-info">
            <h1 className="page-title">附件管理</h1>
            <div className="project-info">
              <InformationCircleIcon className="w-5 h-5 text-blue-500" />
              <span>项目：{projectInfo.name}</span>
            </div>
          </div>
          
          <div className="header-actions">
            <button
              onClick={() => router.push('/internal-preparations')}
              className="back-button"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              返回院内制剂
            </button>
                
            <button
              onClick={() => setUploadModalOpen(true)}
              className="upload-button"
            >
              <CloudArrowUpIcon className="w-4 h-4" />
              上传附件
            </button>
          </div>
        </div>

        {/* 筛选控制栏 */}
        <div className="filter-bar">
          <div className="filter-controls">
            <div className="search-section">
              <div className="search-wrapper">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="搜索文件名或描述..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="search-input"
                />
              </div>
            </div>
          
            <div className="filter-item">
              <FunnelIcon className="w-4 h-4 text-gray-400" />
              <select
                value={fileTypeFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="filter-select"
              >
                <option value="">所有类型</option>
                <option value="image">图片</option>
                <option value="document">文档</option>
                <option value="archive">压缩包</option>
              </select>
            </div>
          </div>
          
          <button 
            onClick={handleSearch}
            className="search-button"
          >
            搜索筛选
          </button>
        </div>

        {/* 附件列表容器 */}
        <div className="attachment-list-container">
          {loading ? (
            <div className="empty-state">
              <div className="loading-spinner"></div>
              <p className="empty-text">加载中...</p>
            </div>
          ) : attachments.length === 0 ? (
            <div className="empty-state">
              <PaperClipIcon className="w-12 h-12 text-gray-400" />
              <h3 className="empty-title">暂无附件</h3>
              <p className="empty-description">
                项目"{projectInfo.name}"还没有上传任何附件，点击上传按钮开始添加。
              </p>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="upload-first-button"
              >
                <CloudArrowUpIcon className="w-4 h-4" />
                上传第一个附件
              </button>
            </div>
          ) : (
            <>
              {/* 列表标题 */}
              <div className="list-header">
                <div className="list-title-section">
                  <h3 className="list-title">
                    附件列表 ({totalAttachments} 个文件)
                  </h3>
                </div>
              </div>

              {/* 附件列表 */}
              <div className="attachment-list">
                {attachments.map((attachment) => (
                  <div key={attachment._id} className="attachment-item">
                    <div className="item-content">
                      <div className="file-info">
                        <div className="file-icon">
                          {getFileIcon(attachment.mimeType)}
                        </div>
                        
                        <div className="file-details">
                          <h4 className="file-name">
                            {attachment.originalName}
                          </h4>
                          <div className="file-meta">
                            <span>{formatFileSize(attachment.size)}</span>
                            <span className="meta-separator">•</span>
                            <span>{formatDate(attachment.uploadTime)}</span>
                          </div>
                          {attachment.description && (
                            <p className="file-description">
                              {attachment.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="item-actions">
                        <button
                          onClick={() => handleFileDownload(attachment)}
                          className="download-button"
                        >
                          <CloudArrowDownIcon className="w-4 h-4" />
                          下载
                        </button>
                        
                        <button
                          onClick={() => handleFileDelete(attachment._id)}
                          disabled={deleteLoading === attachment._id}
                          className="delete-button"
                        >
                          {deleteLoading === attachment._id ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-red-600"></div>
                          ) : (
                            <TrashIcon className="w-4 h-4" />
                          )}
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 分页控件 */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    显示第 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalAttachments)} 条，
                    共 {totalAttachments} 条记录
                  </div>
                      
                  <div className="pagination-controls">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      上一页
                    </button>
                        
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + Math.max(1, currentPage - 2)
                      if (page > totalPages) return null
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                        >
                          {page}
                        </button>
                      )
                    })}
                        
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      下一页
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 上传附件模态框 */}
        {uploadModalOpen && (
          <div className="modal-overlay">
            <div className="upload-modal">
              <h3 className="modal-title">上传附件</h3>
                  
              <div className="modal-content">
                <div className="form-group">
                  <label className="form-label">
                    院内制剂名称
                  </label>
                  <div className="project-display">
                    {projectInfo.name}
                  </div>
                </div>
                    
                <div className="form-group">
                  <label className="form-label">
                    选择上传文件
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp,.zip,.rar,.7z"
                    className="file-input"
                  />
                  <p className="input-hint">
                    支持：文档、图片、压缩包等格式，最大10MB
                  </p>
                </div>
                    
                <div className="form-group">
                  <label className="form-label">
                    文件描述（可选）
                  </label>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="请输入文件描述..."
                    rows={3}
                    className="description-textarea"
                  />
                </div>
              </div>
            
              <div className="modal-actions">
                <button
                  onClick={() => {
                    setUploadModalOpen(false)
                    setSelectedFile(null)
                    setUploadDescription('')
                  }}
                  disabled={uploadLoading}
                  className="cancel-button"
                >
                  取消
                </button>
              
                <button
                  onClick={handleFileUpload}
                  disabled={uploadLoading || !selectedFile}
                  className="confirm-button"
                >
                  {uploadLoading ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-white"></div>
                      上传中...
                    </>
                  ) : (
                    <>
                      <CloudArrowUpIcon className="w-4 h-4" />
                      上传
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .attachment-page {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* 加载状态样式 */
        .loading-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }

        .loading-content {
          text-align: center;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        .loading-text {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }

        /* 页面头部样式 */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .header-info {
          flex: 1;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .project-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 16px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          border-color: #d1d5db;
          background: #f9fafb;
          transform: translateY(-1px);
        }

        .upload-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        .upload-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
        }

        /* 筛选控制栏样式 */
        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 20px 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .filter-controls {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .search-section {
          flex: 1;
          max-width: 400px;
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .search-input {
          flex: 1;
          width: 100%;
          padding: 12px 12px 12px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          color: #374151;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .search-wrapper svg {
          position: absolute;
          left: 12px;
          z-index: 10;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
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

        .search-button {
          padding: 8px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .search-button:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        /* 附件列表容器样式 */
        .attachment-list-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        /* 空状态样式 */
        .empty-state {
          padding: 48px 24px;
          text-align: center;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 16px 0 8px 0;
        }

        .empty-description {
          color: #6b7280;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .empty-text {
          color: #6b7280;
          margin: 16px 0 0 0;
          font-size: 14px;
        }

        .upload-first-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        .upload-first-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
        }

        /* 列表标题样式 */
        .list-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .list-title-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .list-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        /* 附件列表样式 */
        .attachment-list {
          divide-y: 1px solid #e5e7eb;
        }

        .attachment-item {
          padding: 24px;
          transition: all 0.2s ease;
        }

        .attachment-item:hover {
          background: #f9fafb;
          transform: translateY(-1px);
        }

        .item-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .file-info {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
        }

        .file-icon {
          flex-shrink: 0;
          margin-right: 16px;
        }

        .file-details {
          flex: 1;
          min-width: 0;
        }

        .file-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-meta {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 4px 0;
        }

        .meta-separator {
          margin: 0 8px;
        }

        .file-description {
          font-size: 14px;
          color: #4b5563;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 16px;
          flex-shrink: 0;
        }

        .download-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .download-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .delete-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid #fecaca;
          border-radius: 6px;
          background: white;
          color: #dc2626;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .delete-button:hover {
          background: #fef2f2;
          border-color: #f87171;
        }

        .delete-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* 分页样式 */
        .pagination-container {
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pagination-info {
          font-size: 14px;
          color: #6b7280;
        }

        .pagination-controls {
          display: flex;
          gap: 8px;
        }

        .pagination-button {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #374151;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f9fafb;
        }

        .pagination-button.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .pagination-button.active:hover {
          background: #2563eb;
          border-color: #2563eb;
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

        .upload-modal {
          background: white;
          border-radius: 12px;
          padding: 24px;
          width: 100%;
          max-width: 480px;
          margin: 16px;
          animation: slideIn 0.3s ease-out;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 20px 0;
        }

        .modal-content {
          space-y: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .project-display {
          padding: 12px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          color: #4b5563;
        }

        .file-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .file-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .input-hint {
          margin-top: 4px;
          font-size: 12px;
          color: #6b7280;
        }

        .description-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          resize: vertical;
          transition: border-color 0.2s ease;
        }

        .description-textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .cancel-button {
          padding: 10px 20px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .cancel-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .confirm-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        .confirm-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
        }

        .confirm-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        /* 动画效果 */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .attachment-page {
            padding: 16px;
          }

          .page-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .header-actions {
            margin-top: 0;
            justify-content: stretch;
          }

          .back-button,
          .upload-button {
            flex: 1;
            justify-content: center;
          }

          .filter-bar {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .filter-controls {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .search-section {
            max-width: none;
          }

          .attachment-item {
            padding: 16px;
          }

          .item-content {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .item-actions {
            margin-left: 0;
            justify-content: stretch;
          }

          .download-button,
          .delete-button {
            flex: 1;
            justify-content: center;
          }

          .pagination-container {
            flex-direction: column;
            gap: 16px;
            align-items: center;
            text-align: center;
          }

          .upload-modal {
            margin: 8px;
          }
        }
      `}</style>
    </DashboardLayout>
  )
}
