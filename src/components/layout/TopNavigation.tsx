import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  UsersIcon,
  ChevronDownIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { TokenManager } from '@/utils/auth'

interface TopNavigationProps {
  className?: string
}

const TopNavigation: React.FC<TopNavigationProps> = ({ className = '' }) => {
  /* ------------------------------------------------------------------------------------------ */
  // 状态和路由管理
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 生命周期函数 - 客户端初始化
  useEffect(() => {
    try {
      const authenticated = TokenManager.isAuthenticated()
      const user = TokenManager.getUser()
      
      setIsAuthenticated(authenticated)
      setCurrentUser(user)
      setIsAdmin(user?.role === 'admin')
      
      // 如果未认证，重定向到登录页
      if (!authenticated) {
        router.replace('/login')
      }
    } catch (error) {
      console.error('初始化认证状态失败:', error)
      router.replace('/login')
    }
  }, [router])
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 事件处理函数
  const handlePersonnelManagement = () => {
    if (isAdmin) {
      router.push('/users')
    } else {
      router.push('/unauthorized')
    }
  }

  const handleLogout = async () => {
    try {
      // 动态导入TokenManager避免潜在的SSR问题
      const { TokenManager } = await import('@/utils/auth')
      TokenManager.logout()
      router.push('/login')
    } catch (error) {
      console.error('登出失败:', error)
      router.push('/login')
    }
  }

  const handleProfile = () => {
    router.push('/profile')
  }

  const handleSettings = () => {
    if (isAdmin) {
      router.push('/settings')
    } else {
      router.push('/unauthorized')
    }
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 用户下拉菜单数据
  const userMenuItems = [
    {
      label: '个人信息',
      icon: UserIcon,
      onClick: handleProfile,
      requiresAuth: true
    },
    {
      label: '系统设置',
      icon: CogIcon,
      onClick: handleSettings,
      requiresAuth: true,
      adminOnly: true
    },
    {
      label: '退出登录',
      icon: ArrowRightOnRectangleIcon,
      onClick: handleLogout,
      requiresAuth: true,
      isDanger: true
    }
  ]

  // 显示的用户名
  const displayName = currentUser?.realName || currentUser?.username || '用户'
  /* ------------------------------------------------------------------------------------------ */

  // 如果未认证，不显示组件
  if (!isAuthenticated) {
    return null
  }

  return (
    <header className={`top-navigation ${className}`}>
      {/* Logo区域 */}
      <div className="logo-section">
        <div className="logo-container">
          <img src="/images/logo-1.png" alt="上海临床创新转化研究院" className="logo-image" />
        </div>
        <h1 className="system-title">临床创新项目管理系统</h1>
      </div>

      {/* 主导航菜单 */}
      <nav className="main-navigation">
        <ul className="nav-list">
          <li className="nav-item">
            <button
              onClick={handlePersonnelManagement}
              className="nav-button"
              title={isAdmin ? '人员管理' : '需要管理员权限'}
            >
              <UsersIcon className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-base">人员管理</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* 用户信息区域 */}
      <div className="user-section">
        <span className="user-name">{displayName}</span>
        
        <div className="user-avatar">
          <img 
            src="/images/avatar.png" 
            alt="用户头像" 
            className="avatar-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff&size=40`
            }}
          />
        </div>

        <div className="user-dropdown">
          <button className="dropdown-trigger">
            <ChevronDownIcon className="w-4 h-4 text-white" />
          </button>
          
          <div className="dropdown-menu">
            {userMenuItems.map((item, index) => {
              // 检查权限显示
              if (item.adminOnly && !isAdmin) return null
              if (item.requiresAuth && !isAuthenticated) return null

              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`dropdown-item ${item.isDanger ? 'danger' : ''}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .top-navigation {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 1000;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-container {
          width: 86.6px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-image {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .system-title {
          font-size: 18px;
          font-weight: bold;
          color: white;
          margin: 0;
          white-space: nowrap;
        }

        .main-navigation {
          flex: 1;
          display: flex;
          justify-content: center;
          max-width: 600px;
        }

        .nav-list {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 32px;
        }

        .nav-item {
          position: relative;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 6px;
        }

        .nav-button:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .nav-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: white;
          white-space: nowrap;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #e5e7eb;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-dropdown {
          position: relative;
        }

        .dropdown-trigger {
          display: flex;
          align-items: center;
          padding: 4px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          transition: color 0.2s ease;
          border-radius: 4px;
        }

        .dropdown-trigger:hover {
          color: #374151;
          background: rgba(255, 255, 255, 0.1);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 4px;
          min-width: 180px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
          padding: 8px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease;
        }

        .user-dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          background: none;
          border: none;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 6px;
          text-align: left;
        }

        .dropdown-item:hover {
          background: #f3f4f6;
        }

        .dropdown-item.danger {
          color: #dc2626;
        }

        .dropdown-item.danger:hover {
          background: #fef2f2;
          color: #b91c1c;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .top-navigation {
            padding: 0 16px;
          }

          .system-title {
            font-size: 16px;
          }

          .nav-list {
            gap: 16px;
          }

          .user-name {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .logo-section {
            gap: 8px;
          }

          .system-title {
            font-size: 14px;
          }

          .main-navigation {
            max-width: 200px;
          }
        }
      `}</style>
    </header>
  )
}

export default TopNavigation
