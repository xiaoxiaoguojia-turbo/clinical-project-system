import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { 
  UsersIcon, 
  MagnifyingGlassIcon, 
  PlusIcon, 
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { ApiResponse, PaginatedResponse, UserResponse } from '@/types'

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

// 使用后端的UserResponse类型，重新定义日期字段为字符串
type User = Omit<UserResponse, 'createTime' | 'updateTime' | 'lastLogin'> & {
  createTime: string
  updateTime: string
  lastLogin?: string
}

interface NewUser {
  username: string
  email: string
  realName: string
  role: 'admin' | 'user'
  department: string
  password: string
}

export default function UsersPage() {
  /* ------------------------------------------------------------------------------------------ */
  // 状态管理
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetail, setShowUserDetail] = useState(false)
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  })
  const [newUser, setNewUser] = useState<NewUser>({
    username: '',
    email: '',
    realName: '',
    role: 'user',
    department: '',
    password: ''
  })
  const [editUser, setEditUser] = useState<Omit<NewUser, 'password'>>({
    username: '',
    email: '',
    realName: '',
    role: 'user',
    department: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
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
        
        const currentUser = TokenManager.getUser()
        if (currentUser?.role !== 'admin') {
          window.location.href = '/unauthorized'
          return
        }
        
        setIsAuthenticated(true)
        await loadUsers()
      } catch (error) {
        console.error('认证检查失败:', error)
        window.location.href = '/login'
      }
    }

    checkAuth()
  }, [])

  // 搜索和筛选变化时重新加载用户列表
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        loadUsers(1) // 重置到第一页
      }, 300) // 300ms防抖

      return () => clearTimeout(timer)
    }
  }, [searchTerm, roleFilter, statusFilter, isAuthenticated])

  const loadUsers = async (page: number = pagination.current) => {
    try {
      setLoading(true)
      
      const { ApiClient } = await import('@/utils/auth')
      
      // 构建查询参数
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pagination.pageSize.toString()
      })
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim())
      }
      
      if (roleFilter !== 'all') {
        params.append('role', roleFilter)
      }
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      
      const response = await ApiClient.get<ApiResponse<PaginatedResponse<UserResponse>>>(`/users?${params.toString()}`)
      
      if (response.success && response.data) {
        // API返回的JSON数据中日期已经是字符串格式，使用unknown进行安全转换
        const users = response.data.data || []
        setUsers(users as unknown as User[])
        setPagination({
          current: response.data.pagination?.current || page,
          pageSize: response.data.pagination?.pageSize || 20,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0
        })
      } else {
        console.error('获取用户列表失败:', response.error)
        setUsers([])
        setPagination({
          current: 1,
          pageSize: 20,
          total: 0,
          totalPages: 0
        })
      }
      
    } catch (error) {
      console.error('加载用户数据失败:', error)
      setUsers([])
      setPagination({
        current: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
      })
    } finally {
      setLoading(false)
    }
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 事件处理函数
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value as 'all' | 'admin' | 'user')
  }

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowUserDetail(true)
  }

  const handleEditUser = (user: User) => {
    setUserToEdit(user)
    setEditUser({
      username: user.username,
      email: user.email || '',
      realName: user.realName || '',
      role: user.role,
      department: user.department || ''
    })
    setErrors({})
    setShowEditUserModal(true)
  }

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return
    
    try {
      const { ApiClient } = await import('@/utils/auth')
      
      const response = await ApiClient.delete<ApiResponse<any>>(`/users/${userToDelete._id}`)
      
      if (response.success) {
        // 重新加载当前页数据
        await loadUsers()
        setShowDeleteModal(false)
        setUserToDelete(null)
        alert('用户删除成功！')
      } else {
        console.error('删除用户失败:', response.error)
        alert(`删除用户失败：${response.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('删除用户失败:', error)
      alert('删除用户失败，请重试')
    }
  }

  const handleCreateUser = async () => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      setErrors({})

      // 表单验证
      const newErrors: {[key: string]: string} = {}
      if (!newUser.realName.trim()) newErrors.realName = '请输入真实姓名'
      if (!newUser.username.trim()) newErrors.username = '请输入用户名'
      if (!newUser.email.trim()) newErrors.email = '请输入邮箱地址'
      if (!newUser.password.trim()) newErrors.password = '请输入密码'
      if (!newUser.department.trim()) newErrors.department = '请选择部门'
      
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newUser.email)) {
        newErrors.email = '请输入有效的邮箱地址'
      }
      
      if (newUser.password.length < 6) {
        newErrors.password = '密码长度不能少于6个字符'
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      const { ApiClient } = await import('@/utils/auth')
      
      const response = await ApiClient.post<ApiResponse<UserResponse>>('/users', newUser)
      
      if (response.success) {
        // 重新加载用户列表
        await loadUsers(1) // 回到第一页显示新创建的用户
        setShowNewUserModal(false)
        setNewUser({
          username: '',
          email: '',
          realName: '',
          role: 'user',
          department: '',
          password: ''
        })
        setErrors({})
        alert('用户创建成功！')
      } else {
        console.error('创建用户失败:', response.error)
        alert(`创建用户失败：${response.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('创建用户失败:', error)
      alert('创建用户失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateUser = async () => {
    if (isSubmitting || !userToEdit) return

    try {
      setIsSubmitting(true)
      setErrors({})

      // 表单验证
      const newErrors: {[key: string]: string} = {}
      if (!editUser.realName.trim()) newErrors.realName = '请输入真实姓名'
      if (!editUser.username.trim()) newErrors.username = '请输入用户名'
      if (!editUser.email.trim()) newErrors.email = '请输入邮箱地址'
      if (!editUser.department.trim()) newErrors.department = '请选择部门'
      
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(editUser.email)) {
        newErrors.email = '请输入有效的邮箱地址'
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      const { ApiClient } = await import('@/utils/auth')
      
      const response = await ApiClient.put<ApiResponse<UserResponse>>(`/users/${userToEdit._id}`, editUser)
      
      if (response.success) {
        // 重新加载当前页数据
        await loadUsers()
        setShowEditUserModal(false)
        setUserToEdit(null)
        setEditUser({
          username: '',
          email: '',
          realName: '',
          role: 'user',
          department: ''
        })
        setErrors({})
        alert('用户更新成功！')
      } else {
        console.error('更新用户失败:', response.error)
        alert(`更新用户失败：${response.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('更新用户失败:', error)
      alert('更新用户失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewUserInputChange = (field: keyof NewUser, value: string) => {
    setNewUser({ ...newUser, [field]: value })
    // 清除相应字段的错误
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const handleEditUserInputChange = (field: keyof typeof editUser, value: string) => {
    setEditUser({ ...editUser, [field]: value })
    // 清除相应字段的错误
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages && page !== pagination.current) {
      loadUsers(page)
    }
  }

  const handleCloseModals = () => {
    setShowNewUserModal(false)
    setShowEditUserModal(false)
    setShowUserDetail(false)
    setShowDeleteModal(false)
    setUserToDelete(null)
    setUserToEdit(null)
    setErrors({})
    setIsSubmitting(false)
  }

  const handleRefresh = () => {
    loadUsers(pagination.current)
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 数据处理和过滤（现在主要在后端完成）
  const displayUsers = users // 直接使用从后端获取的用户列表

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? 
      <span className="role-badge admin">管理员</span> : 
      <span className="role-badge user">普通用户</span>
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 
      <span className="status-badge active">活跃</span> : 
      <span className="status-badge inactive">禁用</span>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const departments = ['转移转化与投资部门', '临床研究部', '创新实验室']
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
    <DashboardLayout title="人员管理 - 临床创新项目管理系统">
      <div className="users-page">
        {/* 页面标题和操作区域 */}
        <div className="page-header">
          <div className="title-section">
            <h1>人员管理</h1>
            <p>管理系统用户账号，包括管理员和普通用户的信息维护。</p>
          </div>
          <div className="action-section">
            <button className="create-button" onClick={() => setShowNewUserModal(true)}>
              <PlusIcon className="w-5 h-5" />
              新增用户
            </button>
          </div>
        </div>

        {/* 搜索和筛选区域 */}
        <div className="filter-section">
          <div className="search-box">
            <MagnifyingGlassIcon className="w-5 h-5 search-icon" />
            <input
              type="text"
              placeholder="搜索用户名、姓名或邮箱..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <div className="filter-item">
              <FunnelIcon className="w-5 h-5" />
              <select value={roleFilter} onChange={handleRoleFilterChange} className="filter-select">
                <option value="all">全部角色</option>
                <option value="admin">管理员</option>
                <option value="user">普通用户</option>
              </select>
            </div>
            <div className="filter-item">
              <select value={statusFilter} onChange={handleStatusFilterChange} className="filter-select">
                <option value="all">全部状态</option>
                <option value="active">活跃</option>
                <option value="inactive">禁用</option>
              </select>
            </div>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="users-table-section">
          <div className="table-wrapper">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>加载用户数据中...</p>
              </div>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>用户信息</th>
                    <th>角色</th>
                    <th>所属部门</th>
                    <th>状态</th>
                    <th>最后登录</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {displayUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.realName?.charAt(0)}
                          </div>
                          <div className="user-details">
                            <div className="user-name">{user.realName}</div>
                            <div className="user-meta">{user.username} • {user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{user.department}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>{user.lastLogin ? formatDate(user.lastLogin) : '从未登录'}</td>
                      <td>{formatDate(user.createTime)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view" 
                            onClick={() => handleViewUser(user)}
                            title="查看详情"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button 
                            className="action-btn edit" 
                            onClick={() => handleEditUser(user)}
                            title="编辑用户"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button 
                            className="action-btn delete" 
                            onClick={() => handleDeleteUser(user)}
                            title="删除用户"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && displayUsers.length === 0 && (
              <div className="empty-state">
                <UsersIcon className="w-16 h-16 empty-icon" />
                <h3>暂无用户数据</h3>
                <p>没有找到符合条件的用户，请调整搜索条件或添加新用户。</p>
              </div>
            )}
          </div>

          {/* 分页控件 */}
          {pagination.totalPages > 1 && (
            <div className="pagination-section">
              <div className="pagination-info">
                <span>共 {pagination.total} 条记录，第 {pagination.current} 页，共 {pagination.totalPages} 页</span>
              </div>
              <div className="pagination-controls">
                <button 
                  className="page-btn prev" 
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.current === 1}
                  title="首页"
                >
                  首页
                </button>
                <button 
                  className="page-btn prev" 
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={pagination.current === 1}
                  title="上一页"
                >
                  上一页
                </button>
                <div className="page-numbers">
                  {(() => {
                    const pages = []
                    const totalPages = pagination.totalPages
                    const current = pagination.current
                    
                    // 计算显示页码范围
                    let startPage = Math.max(1, current - 2)
                    let endPage = Math.min(totalPages, current + 2)
                    
                    // 确保显示5个页码（如果总页数足够）
                    if (endPage - startPage < 4) {
                      if (startPage === 1) {
                        endPage = Math.min(totalPages, startPage + 4)
                      } else {
                        startPage = Math.max(1, endPage - 4)
                      }
                    }
                    
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          className={`page-btn ${i === current ? 'active' : ''}`}
                          onClick={() => handlePageChange(i)}
                        >
                          {i}
                        </button>
                      )
                    }
                    
                    return pages
                  })()}
                </div>
                <button 
                  className="page-btn next" 
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={pagination.current === pagination.totalPages}
                  title="下一页"
                >
                  下一页
                </button>
                <button 
                  className="page-btn next" 
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.current === pagination.totalPages}
                  title="末页"
                >
                  末页
                </button>
                <button 
                  className="page-btn refresh" 
                  onClick={handleRefresh}
                  title="刷新"
                >
                  刷新
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 用户详情模态框 */}
        {showUserDetail && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowUserDetail(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>用户详情</h3>
                <button className="close-btn" onClick={() => setShowUserDetail(false)}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="modal-body">
                <div className="user-detail-card">
                  <div className="user-avatar-large">
                    {selectedUser.realName?.charAt(0)}
                  </div>
                  <div className="user-info-grid">
                    <div className="info-item">
                      <label>真实姓名</label>
                      <span>{selectedUser.realName}</span>
                    </div>
                    <div className="info-item">
                      <label>用户名</label>
                      <span>{selectedUser.username}</span>
                    </div>
                    <div className="info-item">
                      <label>邮箱地址</label>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="info-item">
                      <label>用户角色</label>
                      {getRoleBadge(selectedUser.role)}
                    </div>
                    <div className="info-item">
                      <label>所属部门</label>
                      <span>{selectedUser.department}</span>
                    </div>
                    <div className="info-item">
                      <label>账号状态</label>
                      {getStatusBadge(selectedUser.status)}
                    </div>
                    <div className="info-item">
                      <label>创建时间</label>
                      <span>{formatDate(selectedUser.createTime)}</span>
                    </div>
                    <div className="info-item">
                      <label>最后更新</label>
                      <span>{formatDate(selectedUser.updateTime)}</span>
                    </div>
                    <div className="info-item">
                      <label>最后登录</label>
                      <span>{selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : '从未登录'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 编辑用户模态框 */}
        {showEditUserModal && userToEdit && (
          <div className="modal-overlay" onClick={handleCloseModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>编辑用户</h3>
                <button className="close-btn" onClick={handleCloseModals}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-item">
                    <label>真实姓名 *</label>
                    <input
                      type="text"
                      value={editUser.realName}
                      onChange={(e) => handleEditUserInputChange('realName', e.target.value)}
                      placeholder="请输入真实姓名"
                      className={errors.realName ? 'error' : ''}
                    />
                    {errors.realName && <span className="error-text">{errors.realName}</span>}
                  </div>
                  <div className="form-item">
                    <label>用户名 *</label>
                    <input
                      type="text"
                      value={editUser.username}
                      onChange={(e) => handleEditUserInputChange('username', e.target.value)}
                      placeholder="请输入用户名"
                      className={errors.username ? 'error' : ''}
                    />
                    {errors.username && <span className="error-text">{errors.username}</span>}
                  </div>
                  <div className="form-item">
                    <label>邮箱地址 *</label>
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={(e) => handleEditUserInputChange('email', e.target.value)}
                      placeholder="请输入邮箱地址"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  <div className="form-item">
                    <label>用户角色 *</label>
                    <select
                      value={editUser.role}
                      onChange={(e) => handleEditUserInputChange('role', e.target.value as 'admin' | 'user')}
                      className={errors.role ? 'error' : ''}
                    >
                      <option value="user">普通用户</option>
                      <option value="admin">管理员</option>
                    </select>
                    {errors.role && <span className="error-text">{errors.role}</span>}
                  </div>
                  <div className="form-item">
                    <label>所属部门 *</label>
                    <select
                      value={editUser.department}
                      onChange={(e) => handleEditUserInputChange('department', e.target.value)}
                      className={errors.department ? 'error' : ''}
                    >
                      <option value="">请选择部门</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && <span className="error-text">{errors.department}</span>}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="cancel-btn" 
                  onClick={handleCloseModals}
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button 
                  className="confirm-btn" 
                  onClick={handleUpdateUser}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      更新中...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      更新用户
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 新增用户模态框 */}
        {showNewUserModal && (
          <div className="modal-overlay" onClick={handleCloseModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>新增用户</h3>
                <button className="close-btn" onClick={handleCloseModals}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-item">
                    <label>真实姓名 *</label>
                    <input
                      type="text"
                      value={newUser.realName}
                      onChange={(e) => handleNewUserInputChange('realName', e.target.value)}
                      placeholder="请输入真实姓名"
                      className={errors.realName ? 'error' : ''}
                    />
                    {errors.realName && <span className="error-text">{errors.realName}</span>}
                  </div>
                  <div className="form-item">
                    <label>用户名 *</label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => handleNewUserInputChange('username', e.target.value)}
                      placeholder="请输入用户名"
                      className={errors.username ? 'error' : ''}
                    />
                    {errors.username && <span className="error-text">{errors.username}</span>}
                  </div>
                  <div className="form-item">
                    <label>邮箱地址 *</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => handleNewUserInputChange('email', e.target.value)}
                      placeholder="请输入邮箱地址"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  <div className="form-item">
                    <label>初始密码 *</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => handleNewUserInputChange('password', e.target.value)}
                      placeholder="请输入初始密码（至少6位）"
                      className={errors.password ? 'error' : ''}
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>
                  <div className="form-item">
                    <label>用户角色 *</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => handleNewUserInputChange('role', e.target.value as 'admin' | 'user')}
                      className={errors.role ? 'error' : ''}
                    >
                      <option value="user">普通用户</option>
                      <option value="admin">管理员</option>
                    </select>
                    {errors.role && <span className="error-text">{errors.role}</span>}
                  </div>
                  <div className="form-item">
                    <label>所属部门 *</label>
                    <select
                      value={newUser.department}
                      onChange={(e) => handleNewUserInputChange('department', e.target.value)}
                      className={errors.department ? 'error' : ''}
                    >
                      <option value="">请选择部门</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && <span className="error-text">{errors.department}</span>}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="cancel-btn" 
                  onClick={handleCloseModals}
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button 
                  className="confirm-btn" 
                  onClick={handleCreateUser}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      创建中...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      创建用户
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 删除确认模态框 */}
        {showDeleteModal && userToDelete && (
          <div className="modal-overlay" onClick={handleCloseModals}>
            <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>确认删除</h3>
                <button className="close-btn" onClick={handleCloseModals}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="modal-body">
                <div className="warning-content">
                  <ExclamationTriangleIcon className="w-12 h-12 warning-icon" />
                  <p>您确定要删除用户 <strong>{userToDelete.realName}</strong> 吗？</p>
                  <p className="warning-text">此操作不可恢复，请谨慎操作。</p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="cancel-btn" 
                  onClick={handleCloseModals}
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button 
                  className="danger-btn" 
                  onClick={confirmDeleteUser}
                  disabled={isSubmitting}
                >
                  <TrashIcon className="w-4 h-4" />
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .users-page {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* 页面标题区域 */
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
          margin-top: 17px;
        }

        .create-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
        }

        /* 搜索筛选区域 */
        .filter-section {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 520px;
          height: auto;
          flex-shrink: 0;
        }

        .search-icon {
          color: #9ca3af;
          pointer-events: none;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          height: 40px;
          padding: 0 16px 0 20px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: #f9fafb;
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-controls {
          display: flex;
          gap: 16px;
          align-items: center;
          flex: 1;
          justify-content: flex-end;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
        }

        .filter-select {
          height: 40px;
          padding: 0 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          color: #374151;
          cursor: pointer;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
          min-width: 120px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
        }

        /* 用户表格区域 */
        .users-table-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th {
          background: #f8fafc;
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
          font-size: 14px;
        }

        .users-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .users-table tbody tr:hover {
          background: #f8fafc;
          transition: background-color 0.2s ease;
        }

        /* 用户信息展示 */
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .user-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 14px;
        }

        .user-meta {
          font-size: 12px;
          color: #64748b;
        }

        /* 角色和状态标识 */
        .role-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .role-badge.admin {
          background: #fef3c7;
          color: #d97706;
        }

        .role-badge.user {
          background: #dbeafe;
          color: #2563eb;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #16a34a;
        }

        .status-badge.inactive {
          background: #fee2e2;
          color: #dc2626;
        }

        /* 操作按钮 */
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

        .action-btn.view {
          background: #f0f9ff;
          color: #0369a1;
        }

        .action-btn.view:hover {
          background: #e0f2fe;
          transform: translateY(-1px);
        }

        .action-btn.edit {
          background: #fef7e0;
          color: #d97706;
        }

        .action-btn.edit:hover {
          background: #fef3c7;
          transform: translateY(-1px);
        }

        .action-btn.delete {
          background: #fef2f2;
          color: #dc2626;
        }

        .action-btn.delete:hover {
          background: #fee2e2;
          transform: translateY(-1px);
        }

        /* 加载状态 */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #6b7280;
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

        /* 空状态 */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #6b7280;
        }

        .empty-icon {
          color: #d1d5db;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          margin: 0;
          color: #6b7280;
        }

        /* 模态框样式 */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          animation: modalSlide 0.3s ease-out;
        }

        .modal-content.small {
          max-width: 400px;
        }

        .modal-header {
          padding: 24px 24px 16px 24px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .modal-body {
          padding: 24px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .modal-footer {
          padding: 16px 24px 24px 24px;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        /* 用户详情卡片 */
        .user-detail-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .user-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 32px;
          margin-bottom: 24px;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .user-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          width: 100%;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .info-item label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item span {
          font-size: 14px;
          color: #1e293b;
          font-weight: 500;
        }

        /* 表单样式 */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .form-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-item label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .form-item input,
        .form-item select {
          height: 44px;
          padding: 0 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: #f9fafb;
          box-sizing: border-box;
          width: 100%;
        }

        .form-item input:focus,
        .form-item select:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* 按钮样式 */
        .cancel-btn {
          padding: 10px 20px;
          border: 2px solid #e5e7eb;
          background: white;
          color: #64748b;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .confirm-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .confirm-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
        }

        .danger-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .danger-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
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

        .warning-content p {
          margin: 0;
          color: #374151;
          line-height: 1.6;
        }

        .warning-text {
          font-size: 14px;
          color: #6b7280;
        }

        /* 动画 */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes modalSlide {
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
          .users-page {
            padding: 16px;
          }

          .page-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .filter-section {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .search-box {
            min-width: auto;
          }

          .filter-controls {
            justify-content: space-between;
          }

          .users-table th,
          .users-table td {
            padding: 12px 16px;
            font-size: 13px;
          }

          .user-info {
            gap: 8px;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .modal-content {
            margin: 10px;
            max-height: 95vh;
          }

          .user-info-grid,
          .form-grid {
            grid-template-columns: 1fr;
          }

          .modal-footer {
            flex-direction: column-reverse;
          }

          .modal-footer button {
            width: 100%;
          }
        }

        /* 平板适配 */
        @media (max-width: 1024px) {
          .page-header {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .action-section {
            align-self: stretch;
          }

          .create-button {
            width: 100%;
            justify-content: center;
          }
        }

        /* 分页组件样式 */
        .pagination-section {
          padding: 20px 24px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          background: linear-gradient(to right, #fafbfc, #f8fafc);
        }

        .pagination-info {
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-numbers {
          display: flex;
          gap: 4px;
          margin: 0 8px;
        }

        .page-btn {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 40px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .page-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          color: #3b82f6;
          background: #f8fafc;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
        }

        .page-btn.active {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border-color: #3b82f6;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .page-btn.refresh {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-color: #10b981;
          margin-left: 8px;
        }

        .page-btn.refresh:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
        }

        /* 响应式分页 */
        @media (max-width: 768px) {
          .pagination-section {
            flex-direction: column;
            gap: 12px;
          }

          .pagination-controls {
            flex-wrap: wrap;
            justify-content: center;
          }

          .page-btn {
            padding: 6px 10px;
            font-size: 13px;
            min-width: 36px;
            height: 32px;
          }

          .page-numbers {
            margin: 0 4px;
          }
        }

        /* 优化按钮禁用状态 */
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .confirm-btn:disabled,
        .danger-btn:disabled {
          opacity: 0.7;
          transform: none;
          box-shadow: none;
        }

        /* 表单错误样式 */
        .form-item input.error,
        .form-item select.error {
          border-color: #ef4444;
          background-color: #fef2f2;
        }

        .form-item input.error:focus,
        .form-item select.error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .error-text {
          font-size: 12px;
          color: #ef4444;
          margin-top: 4px;
          display: block;
        }

        /* 加载动画 */
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </DashboardLayout>
  )
}
