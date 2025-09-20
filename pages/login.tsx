import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import Head from 'next/head'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  LockClosedIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline'
import { TokenManager, ApiClient, LoginCredentials } from '@/utils/auth'

interface LoginForm {
  username: string
  password: string
  remember: boolean
}

const LoginPage: NextPage = () => {
  /* ------------------------------------------------------------------------------------------ */
  // 路由和状态管理
  const router = useRouter()
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
    remember: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 生命周期和副作用
  // 检查是否已登录
  useEffect(() => {
    if (TokenManager.isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])

  // 加载记住的用户名
  useEffect(() => {
    const rememberedUsername = TokenManager.getRememberedUsername()
    if (rememberedUsername) {
      setForm(prev => ({ 
        ...prev, 
        username: rememberedUsername, 
        remember: true 
      }))
    }
  }, [])

  // 如果有错误，触发抖动
  useEffect(() => {
    if (error) {
      shakeForm()
    }
  }, [error])
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 事件处理函数
  // 处理表单输入
  const handleInputChange = (field: keyof LoginForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // 清除错误信息
  }

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.username.trim() || !form.password.trim()) {
      setError('⚠️ 用户名和密码不能为空！')
      return
    }

    setLoading(true)
    setError('')

    try {
      const credentials: LoginCredentials = {
        username: form.username,
        password: form.password,
      }

      const result = await ApiClient.login(credentials)

      if (result.success && result.data) {
        // 保存登录状态
        TokenManager.saveAuth(
          result.data.token, 
          result.data.user, 
          form.remember ? form.username : undefined
        )

        // 跳转到仪表板
        router.push('/dashboard')
      } else {
        setError(result.error || '⚠️ 登录失败，请检查用户名和密码！')
      }
    } catch (err: any) {
      setError(err.message || '⚠️ 网络错误，请稍后重试！')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  // 表单抖动动画
  const shakeForm = () => {
    const form = document.querySelector('.login-form-container')
    form?.classList.add('shake')
    setTimeout(() => form?.classList.remove('shake'), 600)
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 功能特色数据
  const features = [
    {
      icon: ChartBarIcon,
      title: '项目进度实时监控'
    },
    {
      icon: DocumentTextIcon,
      title: '院内制剂数据管理'
    },
    {
      icon: ChartPieIcon,
      title: '数据统计与分析'
    }
  ]
  /* ------------------------------------------------------------------------------------------ */

  return (
    <div className="login-page">
      <Head>
        <title>临床创新项目管理系统 - 登录</title>
        <meta name="description" content="上海临床创新转化研究院项目管理系统" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page-container">
        <div className="login-card">
          {/* 左侧品牌展示区 */}
          <div className="brand-section">
            {/* Logo和标题 */}
            <div className="brand-header">
              <div className="logo-container">
                <span className="logo-text">LOGO</span>
              </div>
              <div className="title-section">
                <h2 className="main-title">临床创新项目管理系统</h2>
                <p className="subtitle">转移转化与投资部门专用管理平台</p>
              </div>
            </div>

            {/* 功能特色展示 */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <ChartBarIcon className="w-8 h-8" />
                <span className="text-lg">项目进度实时监控</span>
              </div>
              <div className="flex items-center space-x-4">
                <DocumentTextIcon className="w-8 h-8" />
                <span className="text-lg">院内制剂数据管理</span>
              </div>
              <div className="flex items-center space-x-4">
                <ChartPieIcon className="w-8 h-8" />
                <span className="text-lg">数据统计与分析</span>
              </div>
            </div>
          </div>

          {/* 右侧登录表单区 */}
          <div className="form-section">
            <div className="login-form-container">
              <div className="form-header">
                <h3 className="form-title">系统登录</h3>
                <p className="form-description">欢迎使用临床创新项目管理系统</p>
              </div>

              <form onSubmit={handleLogin} className="login-form">
                {/* 用户名输入 */}
                <div className="input-group">
                  <label className="input-label">用户名</label>
                  <div className="input-wrapper">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="form-input"
                      placeholder="请输入用户名"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* 密码输入 */}
                <div className="input-group">
                  <label className="input-label">密码</label>
                  <div className="input-wrapper">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="form-input password-input"
                      placeholder="请输入密码"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-2 flex items-center border-none bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 错误信息 */}
                {error && <div className="error-message">{error}</div>}

                {/* 记住我和忘记密码 */}
                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={form.remember}
                      onChange={(e) => handleInputChange('remember', e.target.checked)}
                      className="checkbox"
                      disabled={loading}
                    />
                    <span className="checkbox-label">记住我</span>
                  </label>
                  <a href="#" className="forgot-password">忘记密码?</a>
                </div>

                {/* 登录按钮 */}
                <button
                  type="submit"
                  disabled={loading}
                  className="login-button"
                >
                  {loading ? (
                    <div className="loading-content">
                      <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      登录中...
                    </div>
                  ) : (
                    '登 录'
                  )}
                </button>
              </form>

              {/* 版权信息 */}
              <div className="copyright">
                <p>© 2025 上海临床创新转化研究院 版权所有</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .page-container {
          width: 100%;
          max-width: 1200px;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          min-height: 600px;
          display: flex;
        }

        .brand-section {
          flex: 1;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .brand-header {
          margin-bottom: 64px;
        }

        .logo-container {
          width: 128px;
          height: 64px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .logo-text {
          font-size: 24px;
          font-weight: bold;
        }

        .title-section {
          margin-bottom: 64px;
        }

        .main-title {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 12px;
          margin: 0;
        }

        .subtitle {
          color: #bfdbfe;
          font-size: 18px;
          margin: 0;
        }

        .features-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* 修复图标尺寸问题 - 使用更强的选择器 */
        .feature-item svg.feature-icon {
          width: 32px !important;
          height: 32px !important;
          flex-shrink: 0;
        }

        .feature-title {
          font-size: 18px;
        }

        .form-section {
          flex: 1;
          padding: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-form-container {
          width: 100%;
          max-width: 384px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .form-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 8px;
          margin: 0;
        }

        .form-description {
          color: #6b7280;
          margin: 0;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
          width: 100%;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          z-index: 1;
        }

        /* 修复图标尺寸问题 - 使用更强的选择器 */
        .input-icon svg.icon {
          width: 20px !important;
          height: 20px !important;
          color: #9ca3af;
          flex-shrink: 0;
        }

        /* 修复输入框宽度问题 - 统一box-sizing */
        .form-input {
          display: block;
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s ease;
          background: white;
          box-sizing: border-box; /* 关键修复 */
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .password-input {
          padding-right: 40px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1;
        }

        /* 修复密码切换按钮中的图标 */
        .password-toggle svg.icon {
          width: 20px !important;
          height: 20px !important;
          color: #9ca3af;
          flex-shrink: 0;
        }

        /* 修复错误信息宽度问题 - 统一box-sizing */
        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          box-sizing: border-box; /* 关键修复 */
          width: 100%;
        }

        .form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .remember-me {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .checkbox {
          width: 16px;
          height: 16px;
          color: #3b82f6;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          margin-right: 8px;
        }

        .checkbox:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .checkbox-label {
          font-size: 14px;
          color: #6b7280;
        }

        .forgot-password {
          font-size: 14px;
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password:hover {
          color: #1d4ed8;
        }

        /* 修复登录按钮宽度问题 - 统一box-sizing */
        .login-button {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 12px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box; /* 关键修复 */
        }

        .login-button:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .login-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }

        .login-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          flex-shrink: 0;
        }

        .spinner-track {
          opacity: 0.25;
        }

        .spinner-path {
          opacity: 0.75;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .copyright {
          margin-top: 32px;
          text-align: center;
        }

        .copyright p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        /* 抖动动画 */
        .shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .login-card {
            flex-direction: column;
            max-width: 600px;
            margin: 0 auto;
          }

          .brand-section {
            padding: 32px;
          }

          .form-section {
            padding: 32px;
          }
        }

        @media (max-width: 640px) {
          .login-page {
            padding: 8px;
          }

          .brand-section {
            padding: 24px;
          }

          .form-section {
            padding: 24px;
          }

          .main-title {
            font-size: 24px;
          }

          .subtitle {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  )
}

export default LoginPage
