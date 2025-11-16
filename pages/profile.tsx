import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { 
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  KeyIcon,
  ClockIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { TokenManager, ApiClient } from '@/utils/auth'

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

/* ------------------------------------------------------------------------------------------ */

// 用户信息接口
interface UserProfile {
  _id: string
  username: string
  email?: string
  realName?: string
  department?: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  createTime: string
  updateTime: string
  lastLogin?: string
}

// 编辑表单接口
interface ProfileFormData {
  email: string
  realName: string
  department: string
}

// 修改密码表单接口
interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/* ------------------------------------------------------------------------------------------ */

const ProfilePage: React.FC = () => {
  /* ------------------------------------------------------------------------------------------ */
  // 状态管理
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  
  // 编辑状态
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  
  // 表单数据
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    email: '',
    realName: '',
    department: ''
  })
  
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // 密码可见性
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [successMessage, setSuccessMessage] = useState('')
  
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
        await loadUserProfile()
      } catch (error) {
        console.error('认证检查失败:', error)
        window.location.href = '/login'
      }
    }

    checkAuth()
  }, [])
  
  /* ------------------------------------------------------------------------------------------ */
  
  // 加载用户信息
  const loadUserProfile = async () => {
    try {
      setLoading(true)
      
      const response = await ApiClient.get<{
        success: boolean
        data: UserProfile
      }>('/auth/profile')
      
      if (response.success && response.data) {
        setUserProfile(response.data)
        setProfileForm({
          email: response.data.email || '',
          realName: response.data.realName || '',
          department: response.data.department || ''
        })
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    } finally {
      setLoading(false)
    }
  }
  
  /* ------------------------------------------------------------------------------------------ */
  
  // 处理个人信息编辑
  const handleEditProfile = () => {
    setIsEditingProfile(true)
    setErrors({})
    setSuccessMessage('')
  }
  
  const handleCancelEdit = () => {
    setIsEditingProfile(false)
    setErrors({})
    setSuccessMessage('')
    // 恢复原始数据
    if (userProfile) {
      setProfileForm({
        email: userProfile.email || '',
        realName: userProfile.realName || '',
        department: userProfile.department || ''
      })
    }
  }
  
  const validateProfileForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}
    
    // 邮箱验证
    if (profileForm.email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      if (!emailRegex.test(profileForm.email)) {
        newErrors.email = '请输入有效的邮箱地址'
      }
    }
    
    // 真实姓名验证
    if (profileForm.realName && profileForm.realName.length > 50) {
      newErrors.realName = '真实姓名不能超过50个字符'
    }
    
    // 部门验证
    if (profileForm.department && profileForm.department.length > 100) {
      newErrors.department = '部门名称不能超过100个字符'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      return
    }
    
    try {
      setIsSubmitting(true)
      setErrors({})
      setSuccessMessage('')
      
      const response = await ApiClient.put<{
        success: boolean
        data: UserProfile
        message: string
      }>('/auth/profile', profileForm)
      
      if (response.success && response.data) {
        setUserProfile(response.data)
        setIsEditingProfile(false)
        setSuccessMessage('个人信息更新成功！')
        
        // 3秒后清除成功消息
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error: any) {
      console.error('更新个人信息失败:', error)
      setErrors({ submit: error.message || '更新失败，请稍后重试' })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  /* ------------------------------------------------------------------------------------------ */
  
  // 处理密码修改
  const handleEditPassword = () => {
    setIsEditingPassword(true)
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors({})
    setSuccessMessage('')
  }
  
  const handleCancelPasswordEdit = () => {
    setIsEditingPassword(false)
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors({})
    setSuccessMessage('')
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }
  
  const validatePasswordForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}
    
    // 当前密码验证
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = '请输入当前密码'
    }
    
    // 新密码验证
    if (!passwordForm.newPassword) {
      newErrors.newPassword = '请输入新密码'
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = '新密码不能少于6个字符'
    }
    
    // 确认密码验证
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = '请确认新密码'
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }
    
    // 检查新旧密码是否相同
    if (passwordForm.currentPassword && passwordForm.newPassword && 
        passwordForm.currentPassword === passwordForm.newPassword) {
      newErrors.newPassword = '新密码不能与当前密码相同'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSavePassword = async () => {
    if (!validatePasswordForm()) {
      return
    }
    
    try {
      setIsSubmitting(true)
      setErrors({})
      setSuccessMessage('')
      
      const response = await ApiClient.put<{
        success: boolean
        message: string
      }>('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      
      if (response.success) {
        setIsEditingPassword(false)
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setSuccessMessage('密码修改成功！')
        setShowCurrentPassword(false)
        setShowNewPassword(false)
        setShowConfirmPassword(false)
        
        // 3秒后清除成功消息
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error: any) {
      console.error('修改密码失败:', error)
      setErrors({ submit: error.message || '修改失败，请检查当前密码是否正确' })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  /* ------------------------------------------------------------------------------------------ */
  
  // 工具函数
  const getRoleLabel = (role: string): string => {
    const roleLabels: {[key: string]: string} = {
      'admin': '系统管理员',
      'user': '普通用户'
    }
    return roleLabels[role] || role
  }
  
  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <span className="status-badge active">正常</span>
    }
    return <span className="status-badge inactive">停用</span>
  }
  
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '从未登录'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return '无效日期'
    }
  }
  
  /* ------------------------------------------------------------------------------------------ */

    // 渲染加载状态
  if (!mounted || !isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <DashboardLayout title="个人信息 - 临床创新项目管理系统">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!userProfile) {
    return (
      <DashboardLayout title="个人信息 - 临床创新项目管理系统">
        <div className="error-container">
          <p>无法加载用户信息</p>
        </div>
      </DashboardLayout>
    )
  }

  /* ------------------------------------------------------------------------------------------ */

  return (
    <DashboardLayout title="个人信息 - 临床创新项目管理系统">
      <div className="profile-page">
        {/* 页面标题 */}
        <div className="page-header">
          <div className="header-content">
            <div className="user-avatar">
              <UserIcon className="w-16 h-16" />
            </div>
            <div className="user-info">
              <h1 className="user-name">{userProfile.realName || userProfile.username}</h1>
              <p className="user-role">{getRoleLabel(userProfile.role)}</p>
            </div>
          </div>
        </div>

        {/* 成功消息提示 */}
        {successMessage && (
          <div className="success-message">
            <CheckIcon className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 错误消息提示 */}
        {errors.submit && (
          <div className="error-message">
            <XMarkIcon className="w-5 h-5" />
            <span>{errors.submit}</span>
          </div>
        )}

        {/* 卡片容器 */}
        <div className="cards-container">
          {/* 基本信息卡片 */}
          <div className="info-card">
            <div className="card-header">
              <h2 className="card-title">
                <UserIcon className="w-5 h-5" />
                基本信息
              </h2>
              {!isEditingProfile && (
                <button 
                  className="edit-btn"
                  onClick={handleEditProfile}
                >
                  <PencilIcon className="w-4 h-4" />
                  编辑
                </button>
              )}
            </div>

            <div className="card-content">
              {/* 用户名（不可编辑） */}
              <div className="info-item">
                <label className="info-label">
                  <UserIcon className="w-4 h-4" />
                  用户名
                </label>
                <div className="info-value readonly">
                  {userProfile.username}
                  <span className="readonly-badge">不可修改</span>
                </div>
              </div>

              {/* 真实姓名 */}
              <div className="info-item">
                <label className="info-label">
                  <UserIcon className="w-4 h-4" />
                  真实姓名
                </label>
                {isEditingProfile ? (
                  <div className="input-wrapper">
                    <input
                      type="text"
                      className={`info-input ${errors.realName ? 'error' : ''}`}
                      value={profileForm.realName}
                      onChange={(e) => setProfileForm({...profileForm, realName: e.target.value})}
                      placeholder="请输入真实姓名"
                    />
                    {errors.realName && <span className="error-text">{errors.realName}</span>}
                  </div>
                ) : (
                  <div className="info-value">
                    {userProfile.realName || '未设置'}
                  </div>
                )}
              </div>

              {/* 邮箱 */}
              <div className="info-item">
                <label className="info-label">
                  <EnvelopeIcon className="w-4 h-4" />
                  邮箱地址
                </label>
                {isEditingProfile ? (
                  <div className="input-wrapper">
                    <input
                      type="email"
                      className={`info-input ${errors.email ? 'error' : ''}`}
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      placeholder="请输入邮箱地址"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                ) : (
                  <div className="info-value">
                    {userProfile.email || '未设置'}
                  </div>
                )}
              </div>

              {/* 部门 */}
              <div className="info-item">
                <label className="info-label">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  所属部门
                </label>
                {isEditingProfile ? (
                  <div className="input-wrapper">
                    <input
                      type="text"
                      className={`info-input ${errors.department ? 'error' : ''}`}
                      value={profileForm.department}
                      onChange={(e) => setProfileForm({...profileForm, department: e.target.value})}
                      placeholder="请输入所属部门"
                    />
                    {errors.department && <span className="error-text">{errors.department}</span>}
                  </div>
                ) : (
                  <div className="info-value">
                    {userProfile.department || '未设置'}
                  </div>
                )}
              </div>

              {/* 编辑按钮组 */}
              {isEditingProfile && (
                <div className="button-group">
                  <button 
                    className="btn btn-cancel"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    <XMarkIcon className="w-4 h-4" />
                    取消
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleSaveProfile}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="btn-spinner"></div>
                        保存中...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        保存
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 账户安全卡片 */}
          <div className="info-card">
            <div className="card-header">
              <h2 className="card-title">
                <KeyIcon className="w-5 h-5" />
                账户安全
              </h2>
              {!isEditingPassword && (
                <button 
                  className="edit-btn"
                  onClick={handleEditPassword}
                >
                  <PencilIcon className="w-4 h-4" />
                  修改密码
                </button>
              )}
            </div>

            <div className="card-content">
              {!isEditingPassword ? (
                <div className="password-info">
                  <ShieldCheckIcon className="w-12 h-12" />
                  <p className="password-text">为了您的账户安全，建议定期修改密码</p>
                  <p className="password-hint">密码长度至少6个字符</p>
                </div>
              ) : (
                <>
                  {/* 当前密码 */}
                  <div className="info-item">
                    <label className="info-label">
                      <KeyIcon className="w-4 h-4" />
                      当前密码
                    </label>
                    <div className="input-wrapper">
                      <div className="password-input-wrapper">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          className={`info-input ${errors.currentPassword ? 'error' : ''}`}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          placeholder="请输入当前密码"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeSlashIcon className="w-4 h-4" />
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
                    </div>
                  </div>

                  {/* 新密码 */}
                  <div className="info-item">
                    <label className="info-label">
                      <KeyIcon className="w-4 h-4" />
                      新密码
                    </label>
                    <div className="input-wrapper">
                      <div className="password-input-wrapper">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className={`info-input ${errors.newPassword ? 'error' : ''}`}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          placeholder="请输入新密码（至少6个字符）"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeSlashIcon className="w-4 h-4" />
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                    </div>
                  </div>

                  {/* 确认新密码 */}
                  <div className="info-item">
                    <label className="info-label">
                      <KeyIcon className="w-4 h-4" />
                      确认新密码
                    </label>
                    <div className="input-wrapper">
                      <div className="password-input-wrapper">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className={`info-input ${errors.confirmPassword ? 'error' : ''}`}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          placeholder="请再次输入新密码"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="w-4 h-4" />
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>
                  </div>

                  {/* 按钮组 */}
                  <div className="button-group">
                    <button 
                      className="btn btn-cancel"
                      onClick={handleCancelPasswordEdit}
                      disabled={isSubmitting}
                    >
                      <XMarkIcon className="w-4 h-4" />
                      取消
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={handleSavePassword}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="btn-spinner"></div>
                          保存中...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          确认修改
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 账户统计卡片 */}
          <div className="info-card">
            <div className="card-header">
              <h2 className="card-title">
                <CalendarIcon className="w-5 h-5" />
                账户统计
              </h2>
            </div>

            <div className="card-content">
              <div className="stat-item">
                <div className="stat-icon">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <div className="stat-info">
                  <p className="stat-label">账户角色</p>
                  <p className="stat-value">{getRoleLabel(userProfile.role)}</p>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <CheckIcon className="w-6 h-6" />
                </div>
                <div className="stat-info">
                  <p className="stat-label">账户状态</p>
                  <p className="stat-value">{getStatusBadge(userProfile.status)}</p>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div className="stat-info">
                  <p className="stat-label">创建时间</p>
                  <p className="stat-value">{formatDate(userProfile.createTime)}</p>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div className="stat-info">
                  <p className="stat-label">最后登录</p>
                  <p className="stat-value">{formatDate(userProfile.lastLogin)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* 页面标题 */
        .page-header {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .user-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin: 0 0 8px 0;
        }

        .user-role {
          font-size: 16px;
          color: #f59e0b;
          margin: 0;
          font-weight: 500;
        }

        /* 消息提示 */
        .success-message,
        .error-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
          animation: slideIn 0.3s ease;
        }

        .success-message {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 2px solid #10b981;
          color: #065f46;
        }

        .error-message {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 2px solid #ef4444;
          color: #991b1b;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 卡片容器 */
        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        /* 信息卡片 */
        .info-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 2px solid #e2e8f0;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .card-title :global(svg) {
          color: #f59e0b;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .card-content {
          padding: 24px;
        }

        /* 信息项 */
        .info-item {
          margin-bottom: 24px;
        }

        .info-item:last-child {
          margin-bottom: 0;
        }

        .info-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 8px;
        }

        .info-label :global(svg) {
          color: #94a3b8;
        }

        .info-value {
          font-size: 16px;
          color: #1e293b;
          font-weight: 500;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
        }

        .info-value.readonly {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .readonly-badge {
          font-size: 12px;
          padding: 4px 12px;
          background: #64748b;
          color: white;
          border-radius: 6px;
          font-weight: 600;
        }

        /* 输入框 */
        .input-wrapper {
          width: 93%;
          position: relative;
        }

        .info-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          color: #1e293b;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .info-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .info-input.error {
          border-color: #ef4444;
        }

        .info-input.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .error-text {
          display: block;
          margin-top: 6px;
          font-size: 13px;
          color: #ef4444;
          font-weight: 500;
        }

        /* 密码输入框 */
        .password-input-wrapper {
          width: 93%;
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: -12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: #f59e0b;
        }

        /* 密码信息展示 */
        .password-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
        }

        .password-info :global(svg) {
          color: #10b981;
          margin-bottom: 16px;
        }

        .password-text {
          font-size: 16px;
          color: #1e293b;
          font-weight: 500;
          margin: 0 0 8px 0;
        }

        .password-hint {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        /* 按钮组 */
        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 2px solid #e2e8f0;
        }

        .btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        .btn-primary {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* 统计项 */
        .stat-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 16px;
          transition: all 0.2s ease;
        }

        .stat-item:last-child {
          margin-bottom: 0;
        }

        .stat-item:hover {
          background: #f1f5f9;
          transform: translateX(4px);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .stat-info {
          flex: 1;
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
          margin: 0 0 4px 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 16px;
          color: #1e293b;
          font-weight: 600;
          margin: 0;
        }

        /* 状态徽章 */
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-badge.active {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        }

        .status-badge.inactive {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
        }

        /* 加载和错误状态 */
        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #64748b;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top-color: #f59e0b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .cards-container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .profile-page {
            padding: 16px;
          }

          .page-header {
            padding: 24px;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .user-name {
            font-size: 24px;
          }

          .card-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .edit-btn {
            width: 100%;
            justify-content: center;
          }

          .button-group {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </DashboardLayout>
  )
}
    
export default ProfilePage
    
/* ------------------------------------------------------------------------------------------ */
