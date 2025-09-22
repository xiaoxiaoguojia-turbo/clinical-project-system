import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import TopNavigation from '@/components/layout/TopNavigation'
import SideNavigation from '@/components/layout/SideNavigation'
import { ApiClient } from '@/utils/auth'
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

export default function InternalPreparationAttachments() {
  /* ------------------------------------------------------------------------------------------ */
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

    // 权限检查
    const token = localStorage.getItem('authToken')
    console.log('🔐 权限检查:')
    console.log('- authToken存在:', !!token)
    console.log('- token长度:', token ? token.length : 0)
    
    if (!token) {
      console.log('❌ 无权限令牌，跳转到登录页')
      router.replace('/login')
      return
    }

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

      const apiUrl = `/attachments?${params.toString()}`
      console.log('API调用URL:', apiUrl)

      const response = await ApiClient.get(apiUrl)
      console.log('API响应:', response)
      
      const result = response as { success: boolean; data: PaginatedResponse<IAttachment> }
      
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

      const response = await fetch('/api/attachments/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        alert('文件上传成功')
        setUploadModalOpen(false)
        setSelectedFile(null)
        setUploadDescription('')
        // 刷新列表
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
      const response = await fetch(`/api/attachments/${attachment._id}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
      
      const response = await ApiClient.delete(`/attachments/${attachmentId}`)
      const result = response as { success: boolean }
      
      if (result.success) {
        alert('附件删除成功')
        // 刷新列表
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

  // 获取文件图标
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <PhotoIcon className="h-8 w-8 text-green-500" />
    } else if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
      return <DocumentIcon className="h-8 w-8 text-red-500" />
    } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) {
      return <ArchiveBoxIcon className="h-8 w-8 text-yellow-500" />
    } else {
      return <PaperClipIcon className="h-8 w-8 text-gray-500" />
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

  // 如果页面未就绪，显示加载状态
  if (!pageReady || !projectInfo) {
    return (
      <>
        <Head>
          <title>附件管理 - 院内制剂</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">正在加载...</p>
          </div>
        </div>
      </>
    )
  }
  /* ------------------------------------------------------------------------------------------ */

  return (
    <>
      <Head>
        <title>附件管理 - {projectInfo.name} - 院内制剂</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <div className="flex">
          <SideNavigation />
          <main className="flex-1 ml-64 p-8">
            {/* 页面标题和面包屑 */}
            <div className="mb-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link href="/dashboard" className="hover:text-blue-600">首页</Link>
                <span className="mx-2">/</span>
                <Link href="/internal-preparations" className="hover:text-blue-600">院内制剂</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">附件管理</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">附件管理</h1>
                  <div className="flex items-center text-gray-600">
                    <InformationCircleIcon className="h-5 w-5 mr-2" />
                    <span>项目：{projectInfo.name}</span>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => router.push('/internal-preparations')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    返回项目列表
                  </button>
                  
                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                    上传附件
                  </button>
                </div>
              </div>
            </div>

            {/* 搜索和筛选区域 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索文件名或描述..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={fileTypeFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">所有类型</option>
                    <option value="image">图片</option>
                    <option value="document">文档</option>
                    <option value="archive">压缩包</option>
                  </select>
                  
                  <button
                    onClick={handleSearch}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    搜索
                  </button>
                </div>
              </div>
            </div>

            {/* 附件列表 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-500">加载中...</p>
                </div>
              ) : attachments.length === 0 ? (
                <div className="p-12 text-center">
                  <PaperClipIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无附件</h3>
                  <p className="text-gray-500 mb-6">
                    项目"{projectInfo.name}"还没有上传任何附件，点击上传按钮开始添加。
                  </p>
                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                    上传第一个附件
                  </button>
                </div>
              ) : (
                <>
                  {/* 表格头部 */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        附件列表 ({totalAttachments} 个文件)
                      </h3>
                    </div>
                  </div>

                  {/* 附件列表 */}
                  <div className="divide-y divide-gray-200">
                    {attachments.map((attachment) => (
                      <div key={attachment._id} className="p-6 hover:bg-gray-50 file-list-item">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="flex-shrink-0 mr-4">
                              {getFileIcon(attachment.mimeType)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {attachment.originalName}
                              </h4>
                              <div className="mt-1 text-sm text-gray-500">
                                <span>{formatFileSize(attachment.size)}</span>
                                <span className="mx-2">•</span>
                                <span>{formatDate(attachment.uploadTime)}</span>
                              </div>
                              {attachment.description && (
                                <p className="mt-1 text-sm text-gray-600 truncate">
                                  {attachment.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleFileDownload(attachment)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <CloudArrowDownIcon className="h-4 w-4 mr-1" />
                              下载
                            </button>
                            
                            <button
                              onClick={() => handleFileDelete(attachment._id)}
                              disabled={deleteLoading === attachment._id}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                            >
                              {deleteLoading === attachment._id ? (
                                <div className="h-4 w-4 mr-1 animate-spin rounded-full border-b-2 border-red-600"></div>
                              ) : (
                                <TrashIcon className="h-4 w-4 mr-1" />
                              )}
                              删除
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 分页 */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          显示第 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalAttachments)} 条，
                          共 {totalAttachments} 条记录
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                className={`px-3 py-1 border rounded-md text-sm ${
                                  page === currentPage
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          })}
                          
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            下一页
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* 上传附件模态框 */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 upload-modal">
            <h3 className="text-lg font-medium text-gray-900 mb-4">上传附件</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目名称
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
                  {projectInfo.name}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择文件
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp,.zip,.rar,.7z"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  支持：文档、图片、压缩包等格式，最大10MB
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  文件描述（可选）
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="请输入文件描述..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setUploadModalOpen(false)
                  setSelectedFile(null)
                  setUploadDescription('')
                }}
                disabled={uploadLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                取消
              </button>
              
              <button
                onClick={handleFileUpload}
                disabled={uploadLoading || !selectedFile}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {uploadLoading ? (
                  <>
                    <div className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-b-2 border-white"></div>
                    上传中...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                    上传
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .file-list-item {
          transition: all 0.2s ease-in-out;
        }
        
        .file-list-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .upload-modal {
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .loading-spinner {
          border-top-color: transparent;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}
