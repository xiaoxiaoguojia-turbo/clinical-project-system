import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import TopNavigation from '@/layout/TopNavigation'
import SideNavigation from '@/layout/SideNavigation'
import { TokenManager } from '@/utils/auth'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = '临床创新项目管理系统',
  description = '上海临床创新转化研究院项目管理平台'
}) => {
  /* ------------------------------------------------------------------------------------------ */
  // 状态管理 - 修复hydration问题
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 生命周期函数 - 安全的认证检查
  useEffect(() => {
    // 标记组件已挂载
    setMounted(true)
    
    // 延迟检查认证状态，避免hydration不匹配
    const checkAuth = async () => {
      try {
        // 短暂延迟确保客户端完全初始化
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const authenticated = TokenManager.isAuthenticated()
        setIsAuthenticated(authenticated)
        
        // 如果未认证，重定向到登录页
        if (!authenticated) {
          router.replace('/login')
          return
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('认证检查失败:', error)
        setIsLoading(false)
        router.replace('/login')
      }
    }

    checkAuth()
  }, [router])
  /* ------------------------------------------------------------------------------------------ */

  // 在服务端渲染和客户端未挂载时，始终渲染相同的结构
  if (!mounted) {
    return (
      <div className="dashboard-layout">
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* 加载状态 - 保持DOM结构一致 */}
        <div className="loading-layout">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>正在加载系统...</p>
          </div>
        </div>

        <style jsx>{`
          .dashboard-layout {
            min-height: 100vh;
            background: #f8fafc;
          }

          .loading-layout {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
          }

          .loading-content {
            text-align: center;
            color: #6b7280;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }

          .loading-spinner::before {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // 客户端挂载后，如果正在加载认证状态
  if (isLoading) {
    return (
      <div className="dashboard-layout">
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="loading-layout">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>验证用户身份...</p>
          </div>
        </div>

        <style jsx>{`
          .dashboard-layout {
            min-height: 100vh;
            background: #f8fafc;
          }

          .loading-layout {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
          }

          .loading-content {
            text-align: center;
            color: #6b7280;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // 如果未认证，显示提示信息（不会渲染，因为会重定向）
  if (!isAuthenticated) {
    return (
      <div className="dashboard-layout">
        <Head>
          <title>重定向中 - {title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="loading-layout">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>正在跳转到登录页...</p>
          </div>
        </div>

        <style jsx>{`
          .dashboard-layout {
            min-height: 100vh;
            background: #f8fafc;
          }

          .loading-layout {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
          }

          .loading-content {
            text-align: center;
            color: #6b7280;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // 认证通过，渲染完整的Dashboard布局
  return (
    <div className="dashboard-layout">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 顶部导航栏 */}
      <TopNavigation />

      {/* 左侧导航菜单 */}
      <SideNavigation />

      {/* 主内容区域 */}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>

      <style jsx>{`
        .dashboard-layout {
          min-height: 100vh;
          background: #f8fafc;
        }

        .main-content {
          margin-top: 64px;
          margin-left: 280px;
          min-height: calc(100vh - 64px);
          background: #ffffff;
          transition: margin-left 0.3s ease;
        }

        .content-wrapper {
          padding: 24px;
          max-width: 100%;
          min-height: calc(100vh - 64px);
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .main-content {
            margin-left: 240px;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
          }

          .content-wrapper {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  )
}

export default DashboardLayout
