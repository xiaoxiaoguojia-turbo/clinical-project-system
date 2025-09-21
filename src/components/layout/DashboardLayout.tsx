import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

// 动态导入导航组件，禁用SSR避免hydration问题
const TopNavigation = dynamic(() => import('@/layout/TopNavigation'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      height: '64px', 
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px'
    }}>
      <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
        临床创新项目管理系统
      </div>
    </div>
  )
})

const SideNavigation = dynamic(() => import('@/layout/SideNavigation'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      position: 'fixed', 
      top: '64px', 
      left: 0, 
      width: '280px', 
      height: 'calc(100vh - 64px)', 
      background: '#f8fafc',
      borderRight: '1px solid #e2e8f0',
      zIndex: 900
    }}></div>
  )
})

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
  return (
    <div className="dashboard-layout">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 顶部导航栏 - 动态导入，无SSR */}
      <TopNavigation />

      {/* 左侧导航菜单 - 动态导入，无SSR */}
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
