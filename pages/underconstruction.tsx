import React, { useEffect } from 'react'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { 
  WrenchScrewdriverIcon,
  ClockIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'
import { 
  WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
  SparklesIcon
} from '@heroicons/react/24/solid'
import { TokenManager } from '@/utils/auth'

/* ------------------------------------------------------------------------------------------ */

// 动态导入DashboardLayout组件
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
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #e5e7eb', 
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>加载中...</p>
      </div>
    </div>
  )
})

/* ------------------------------------------------------------------------------------------ */

const UnderConstructionPage: NextPage = () => {
  const router = useRouter()
  const currentUser = TokenManager.getUser()

  // 确保用户已登录，否则跳转到登录页
  useEffect(() => {
    if (!TokenManager.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  /* ------------------------------------------------------------------------------------------ */

  // 开发进度数据
  const developmentProgress = [
    {
      id: 1,
      feature: '数据分析看板',
      description: '项目数据可视化分析与统计报表',
      status: 'completed',
      progress: 100,
      icon: RocketLaunchIcon,
      estimatedDate: '2025年9月'
    },
    {
      id: 2,
      feature: '智能推荐系统',
      description: '基于AI的项目匹配与推荐功能',
      status: 'development',
      progress: 60,
      icon: SparklesIcon,
      estimatedDate: '2025年10月'
    },
    {
      id: 3,
      feature: '协作工作流',
      description: '多部门协作与审批流程管理',
      status: 'planning',
      progress: 25,
      icon: ChatBubbleLeftRightIcon,
      estimatedDate: '2025年11月'
    }
  ]

  // 联系信息
  const contactInfo = {
    department: '转移转化与投资部门',
    email: 'innovation@clinical-research.cn',
    phone: '+86 19921276213'
  }

  // 获取状态显示信息
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: '已完成', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
      case 'development':
        return { text: '开发中', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' }
      case 'planning':
        return { text: '规划中', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' }
      default:
        return { text: '未知', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' }
    }
  }

  /* ------------------------------------------------------------------------------------------ */

  return (
    <DashboardLayout 
      title="功能建设中 - 临床创新项目管理系统"
      description="该功能正在积极开发中，敬请期待"
    >
      <div className="construction-content">
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-content">
            <div className="icon-container">
              <WrenchScrewdriverIconSolid className="w-16 h-16 animate-bounce" />
            </div>
            <div className="header-text">
              <h1 className="page-title">功能建设中</h1>
              <p className="page-subtitle">
                我们正在为您打造更好的用户体验，该功能即将上线
              </p>
            </div>
          </div>
        </div>

        {/* 用户信息卡片 */}
        {currentUser && (
          <div className="user-info-card">
            <div className="user-details">
              <div className="user-avatar">
                <BuildingOffice2Icon className="w-7 h-7 text-white" />
              </div>
              <div className="user-content">
                <h3 className="user-name">{currentUser.realName || currentUser.username}</h3>
                <p className="user-role">
                  {currentUser.role === 'admin' ? '系统管理员' : '普通用户'} | {currentUser.department || '转移转化与投资部门'}
                </p>
                <div className="user-status">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>已登录系统</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 开发进度展示 */}
        <div className="development-section">
          <div className="section-header">
            <ClockIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <div>
              <h2 className="section-title">开发进度</h2>
              <p className="section-description">以下功能正在积极开发中，我们会持续更新进度</p>
            </div>
          </div>

          <div className="progress-grid">
            {developmentProgress.map((item) => {
              const statusInfo = getStatusInfo(item.status)
              return (
                <div key={item.id} className="progress-card">
                  <div className="card-header">
                    <div className="feature-icon">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="feature-info">
                      <h3 className="feature-name">{item.feature}</h3>
                      <p className="feature-description">{item.description}</p>
                    </div>
                  </div>

                  <div className="progress-section">
                    <div className="progress-info">
                      <div className={`status-badge ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                        <span className={statusInfo.color}>{statusInfo.text}</span>
                      </div>
                      <span className="progress-text">{item.progress}%</span>
                    </div>
                    
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    
                    <p className="estimated-date">预计完成：{item.estimatedDate}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 通知与反馈 */}
        <div className="notification-section">
          <div className="notification-grid">
            <div className="notification-card">
              <div className="card-icon">
                <BellAlertIcon className="w-8 h-8 text-white" />
              </div>
              <div className="card-content">
                <h3 className="card-title">功能上线通知</h3>
                <p className="card-description">
                  当新功能开发完成时，我们会通过系统消息第一时间通知您
                </p>
                <button className="notification-btn">
                  <CheckCircleIcon className="w-4 h-4" />
                  已开启通知
                </button>
              </div>
            </div>

            <div className="feedback-card">
              <div className="card-icon">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
              </div>
              <div className="card-content">
                <h3 className="card-title">意见反馈</h3>
                <p className="card-description">
                  如果您有功能建议或使用问题，欢迎随时联系我们
                </p>
                <button 
                  className="feedback-btn"
                  onClick={() => window.open(`mailto:${contactInfo.email}?subject=功能建议&body=您好，我有以下建议：`)}
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  发送反馈
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="contact-section">
          <div className="section-header">
            <EnvelopeIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <div>
              <h2 className="section-title">联系我们</h2>
              <p className="section-description">如需技术支持或功能咨询，请通过以下方式联系</p>
            </div>
          </div>

          <div className="contact-info">
            <div className="contact-item">
              <BuildingOffice2Icon className="w-6 h-6 text-blue-500 flex-shrink-0" />
              <div>
                <p className="contact-label">部门</p>
                <p className="contact-value">{contactInfo.department}</p>
              </div>
            </div>

            <div className="contact-item">
              <EnvelopeIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
              <div>
                <p className="contact-label">邮箱</p>
                <a href={`mailto:${contactInfo.email}`} className="contact-link">
                  {contactInfo.email}
                </a>
              </div>
            </div>

            <div className="contact-item">
              <PhoneIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
              <div>
                <p className="contact-label">电话</p>
                <p className="contact-value">{contactInfo.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="footer-notice">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="notice-text">
            当前页面仅作为功能开发预览，具体功能以正式版本为准
          </p>
        </div>
      </div>

      <style jsx>{`
        .construction-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          background: #f8fafc;
          min-height: calc(100vh - 112px);
        }

        .page-header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 32px;
          color: white;
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .page-header:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .page-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 24px;
          position: relative;
          z-index: 1;
        }

        .icon-container {
          flex-shrink: 0;
        }

        .header-text {
          flex: 1;
        }

        .page-title {
          font-size: 36px;
          font-weight: 700;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .page-subtitle {
          font-size: 18px;
          margin: 0;
          opacity: 0.9;
          line-height: 1.5;
        }

        .user-info-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
        }

        .user-info-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .user-details {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-avatar {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-content {
          flex: 1;
        }

        .user-name {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #111827;
        }

        .user-role {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 8px 0;
        }

        .user-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #059669;
        }

        .development-section {
          margin-bottom: 32px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #111827;
        }

        .section-description {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .progress-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .progress-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .progress-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-info {
          flex: 1;
        }

        .feature-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 6px 0;
          color: #111827;
        }

        .feature-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .progress-section {
          margin-top: 16px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid;
        }

        .progress-text {
          font-size: 14px;
          font-weight: 600;
          color: #3b82f6;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .estimated-date {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }

        .notification-section {
          margin-bottom: 32px;
        }

        .notification-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .notification-card,
        .feedback-card {
          background: white;
          border-radius: 12px;
          padding: 32px 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.2s ease;
        }

        .notification-card:hover,
        .feedback-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .card-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feedback-card .card-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .card-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #111827;
        }

        .card-description {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .notification-btn,
        .feedback-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notification-btn {
          background: #10b981;
          color: white;
        }

        .notification-btn:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .feedback-btn {
          background: #8b5cf6;
          color: white;
        }

        .feedback-btn:hover {
          background: #7c3aed;
          transform: translateY(-1px);
        }

        .contact-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 32px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .contact-section:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .contact-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .contact-label {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 4px 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .contact-value {
          font-size: 16px;
          color: #111827;
          margin: 0;
          font-weight: 500;
        }

        .contact-link {
          font-size: 16px;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .contact-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .footer-notice {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          margin-top: 32px;
        }

        .notice-text {
          font-size: 14px;
          color: #92400e;
          margin: 0;
        }

        @media (max-width: 768px) {
          .construction-content {
            padding: 16px;
          }

          .page-header {
            padding: 24px;
            margin-bottom: 24px;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .page-title {
            font-size: 28px;
          }

          .page-subtitle {
            font-size: 16px;
          }

          .progress-grid,
          .notification-grid {
            grid-template-columns: 1fr;
          }

          .contact-info {
            grid-template-columns: 1fr;
          }

          .user-details {
            flex-direction: column;
            text-align: center;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  )
}

export default UnderConstructionPage
