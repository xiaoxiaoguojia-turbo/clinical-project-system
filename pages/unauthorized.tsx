import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import { TokenManager } from '@/utils/auth'
import { getRoleLabel } from '@/utils/permissions'

const UnauthorizedPage: NextPage = () => {
  /* ------------------------------------------------------------------------------------------ */
  // 路由和状态管理
  const router = useRouter()
  const currentUser = TokenManager.getUser()
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 事件处理函数
  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    // 根据用户角色跳转到不同页面
    if (TokenManager.isAuthenticated()) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 联系信息数据
  const contactInfo = {
    email: 'guojiaxu@moinai.com',
    department: '转移转化与投资部门',
    systemName: '临床创新项目管理系统'
  }

  // 操作按钮数据
  const actionButtons = [
    {
      label: '返回上页',
      icon: ArrowLeftIcon,
      onClick: handleGoBack,
      variant: 'secondary'
    },
    {
      label: '返回首页',
      icon: HomeIcon,
      onClick: handleGoHome,
      variant: 'primary'
    }
  ]
  /* ------------------------------------------------------------------------------------------ */

  return (
    <div className="unauthorized-page">
      <Head>
        <title>无权限访问 - 临床创新项目管理系统</title>
        <meta name="description" content="您没有权限访问该页面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page-container">
        <div className="content-wrapper">
          <div className="error-card">
            {/* 警告图标 */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>

            {/* 标题和描述 */}
            <div className="error-content">
              <h2 className="error-title">无权限访问</h2>
              <p className="error-description">
                抱歉，您没有权限访问该页面。请联系系统管理员获取相应权限。
              </p>
            </div>

            {/* 用户信息 */}
            {currentUser && (
              <div className="user-info">
                <div className="user-details">
                  <p className="user-item">
                    <span className="user-label">当前用户：</span>
                    <span className="user-value">{currentUser.realName || currentUser.username}</span>
                  </p>
                  <p className="user-item">
                    <span className="user-label">用户角色：</span>
                    <span className="user-value">
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGoBack}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                返回上页
              </button>

              <button
                onClick={handleGoHome}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                返回首页
              </button>
            </div>

            {/* 联系信息 */}
            <div className="contact-section">
              <p className="contact-description">
                如需帮助，请联系系统管理员或发送邮件至：
              </p>
              <a 
                href={`mailto:${contactInfo.email}`}
                className="contact-email"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="footer">
          <p className="copyright">
            2025 上海临床创新转化研究院 版权所有
          </p>
        </div>
      </div>

      <style jsx>{`
        .unauthorized-page {
          min-height: 100vh;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 24px;
        }

        .page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
        }

        .content-wrapper {
          width: 100%;
          margin-bottom: 32px;
        }

        .error-card {
          background: white;
          padding: 32px 40px;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #fef2f2;
          margin: 0 auto 24px;
        }

        .warning-icon {
          width: 32px;
          height: 32px;
          color: #dc2626;
        }

        .error-content {
          margin-bottom: 24px;
        }

        .error-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .error-description {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
          line-height: 1.6;
        }

        .user-info {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .user-details {
          text-align: left;
        }

        .user-item {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 8px 0;
        }

        .user-item:last-child {
          margin-bottom: 0;
        }

        .user-label {
          font-weight: 500;
          color: #374151;
        }

        .user-value {
          color: #1f2937;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .action-button.secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .action-button.secondary:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .action-button.primary {
          background: #3b82f6;
          color: white;
          border: 1px solid transparent;
        }

        .action-button.primary:hover {
          background: #1d4ed8;
        }

        .action-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* 修复按钮图标尺寸问题 - 使用更强的选择器 */
        .action-button svg.button-icon {
          width: 16px !important;
          height: 16px !important;
          flex-shrink: 0;
        }

        .button-icon {
          width: 16px;
          height: 16px;
        }

        .contact-section {
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .contact-description {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 8px 0;
        }

        .contact-email {
          font-size: 12px;
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-email:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .footer {
          text-align: center;
        }

        .copyright {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        /* 响应式设计 */
        @media (min-width: 640px) {
          .action-buttons {
            flex-direction: row;
            justify-content: center;
          }

          .action-button {
            flex: 1;
            max-width: 160px;
          }
        }

        @media (max-width: 480px) {
          .unauthorized-page {
            padding: 24px 16px;
          }

          .error-card {
            padding: 24px 20px;
          }

          .error-title {
            font-size: 20px;
          }

          .error-description {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}

export default UnauthorizedPage
