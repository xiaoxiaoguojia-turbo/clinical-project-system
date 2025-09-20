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
  const router = useRouter()
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
    remember: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  // 如果有错误，触发抖动
  useEffect(() => {
    if (error) {
      shakeForm()
    }
  }, [error])

  return (
    <>
      <Head>
        <title>临床创新项目管理系统 - 登录</title>
        <meta name="description" content="上海临床创新转化研究院项目管理系统" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl fade-in">
          <div className="bg-white rounded-2xl shadow-custom overflow-hidden min-h-[600px] flex">
            {/* 左侧品牌展示区 */}
            <div className="flex-1 gradient-blue text-white p-12 flex flex-col justify-between">
              {/* Logo和标题 */}
              <div>
                <div className="mb-6">
                  <div className="w-32 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold">LOGO</span>
                  </div>
                </div>
                <div className="mb-16">
                  <h2 className="text-3xl font-bold mb-3">
                    临床创新项目管理系统
                  </h2>
                  <p className="text-blue-100 text-lg">
                    转移转化与投资部门专用管理平台
                  </p>
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
            <div className="flex-1 p-12 flex items-center justify-center">
              <div className="w-full max-w-md login-form-container">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">系统登录</h3>
                  <p className="text-gray-600">欢迎使用临床创新项目管理系统</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  {/* 用户名输入 */}
                  <div>
                    <label className="form-label">
                      用户名
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={form.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="form-input block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="请输入用户名"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* 密码输入 */}
                  <div>
                    <label className="form-label">
                      密码
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="form-input block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="请输入密码"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
                  {error && <div className="alert alert-error">{error}</div>}

                  {/* 记住我和忘记密码 */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.remember}
                        onChange={(e) => handleInputChange('remember', e.target.checked)}
                        className="checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <span className="ml-2 text-sm text-gray-600">记住我</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                      忘记密码?
                    </a>
                  </div>

                  {/* 登录按钮 */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex justify-center py-3 px-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        登录中...
                      </div>
                    ) : (
                      '登 录'
                    )}
                  </button>
                </form>

                {/* 版权信息 */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    © 2025 上海临床创新转化研究院 版权所有
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
