import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
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
  // 状态管理 - 处理hydration问题
  const [isClient, setIsClient] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setIsAuthenticated(TokenManager.isAuthenticated())
  }, [])
  /* ------------------------------------------------------------------------------------------ */

  // 如果还在服务端渲染，显示基础布局但不显示认证相关组件
  if (!isClient) {
    return (
      <div className="dashboard-layout">
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* 加载状态 */}
        <div className="loading-layout">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>正在加载...</p>
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
          }

          .loading-content {
            text-align: center;
            color: #6b7280;
          }

          .loading-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #e5e7eb;
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
