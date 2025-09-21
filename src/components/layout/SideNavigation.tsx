import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { 
  ChevronDownIcon,
  ChevronRightIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import { useHydrationSafe } from '@/hooks/useHydrationSafe'

interface SideNavigationProps {
  className?: string
}

interface MenuItem {
  id: string
  label: string
  icon?: React.ComponentType<any>
  children?: MenuItem[]
  route?: string
  level: number
}

const SideNavigation: React.FC<SideNavigationProps> = ({ className = '' }) => {
  /* ------------------------------------------------------------------------------------------ */
  // 状态和路由管理 - 使用Hydration安全的Hook
  const router = useRouter()
  const isHydrated = useHydrationSafe()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['dept-main', 'project-types']))
  const currentPath = router.pathname
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 事件处理函数
  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const handleNavigation = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route)
    } else if (item.children) {
      toggleExpanded(item.id)
    }
  }

  const isActive = (route?: string) => {
    if (!route) return false
    return currentPath === route
  }

  const isParentActive = (item: MenuItem): boolean => {
    if (item.route && isActive(item.route)) return true
    if (item.children) {
      return item.children.some(child => isParentActive(child))
    }
    return false
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 菜单数据结构
  const menuItems: MenuItem[] = [
    {
      id: 'dept-main',
      label: '转移转化与投资部门',
      icon: ChartBarIcon,
      level: 1,
      children: [
        {
          id: 'project-reports',
          label: '项目报表统计分析',
          icon: ChartBarIcon,
          route: '/dashboard',
          level: 2
        },
        {
          id: 'project-types',
          label: '项目分类型',
          icon: DocumentTextIcon,
          level: 2,
          children: [
            {
              id: 'hospital-preparations',
              label: '院内制剂',
              icon: BeakerIcon,
              route: '/hospital-preparations',
              level: 3
            }
          ]
        }
      ]
    }
  ]
  /* ------------------------------------------------------------------------------------------ */

  const renderMenuItem = (item: MenuItem) => {
    const isExpanded = expandedItems.has(item.id)
    const hasChildren = item.children && item.children.length > 0
    const active = isParentActive(item)
    const directActive = isActive(item.route)

    return (
      <li key={item.id} className={`menu-item level-${item.level}`}>
        <button
          onClick={() => handleNavigation(item)}
          className={`menu-button ${active ? 'active' : ''} ${directActive ? 'direct-active' : ''}`}
        >
          <div className="button-content">
            {/* 图标 */}
            {item.icon && (
              <item.icon className="w-5 h-5 menu-icon" />
            )}
            
            {/* 标签 */}
            <span className="menu-label">{item.label}</span>
          </div>

          {/* 展开/收起箭头 */}
          {hasChildren && (
            <div className="expand-icon">
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </div>
          )}
        </button>

        {/* 子菜单 */}
        {hasChildren && isExpanded && (
          <ul className="submenu">
            {item.children!.map(child => renderMenuItem(child))}
          </ul>
        )}
      </li>
    )
  }

  // 在hydration完成之前，返回样式化的占位符
  if (!isHydrated) {
    return (
      <aside className="side-navigation-placeholder">
        <div className="placeholder-content">
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
          </div>
        </div>
        
        <style jsx>{`
          .side-navigation-placeholder {
            position: fixed;
            top: 64px;
            left: 0;
            width: 280px;
            height: calc(100vh - 64px);
            background: #f8fafc;
            border-right: 1px solid #e2e8f0;
            z-index: 900;
          }

          .placeholder-content {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 200px;
          }

          .loading-indicator {
            text-align: center;
            color: #64748b;
          }

          .loading-spinner {
            width: 24px;
            height: 24px;
            border: 2px solid #e2e8f0;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </aside>
    )
  }

  return (
    <aside className={`side-navigation ${className}`}>
      <div className="navigation-header">
        <h3 className="header-title">导航菜单</h3>
      </div>
      
      <div className="navigation-content">
        <ul className="menu-list">
          {menuItems.map(item => renderMenuItem(item))}
        </ul>
      </div>

      <style jsx>{`
        .side-navigation {
          position: fixed;
          top: 64px;
          left: 0;
          width: 280px;
          height: calc(100vh - 64px);
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          z-index: 900;
        }

        .navigation-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f1f5f9;
          background: #fafbfc;
        }

        .header-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .navigation-content {
          padding: 8px 0;
        }

        .menu-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .menu-item {
          margin: 0;
        }

        .menu-item.level-1 {
          margin-bottom: 4px;
        }

        .menu-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #64748b;
          position: relative;
        }

        /* 一级菜单样式 */
        .level-1 .menu-button {
          padding: 16px 24px;
          background: #f8fafc;
          font-weight: 600;
          color: #1e293b;
          border-left: 4px solid transparent;
          margin-bottom: 2px;
        }

        .level-1 .menu-button:hover {
          background: #f1f5f9;
          border-left-color: #3b82f6;
        }

        .level-1 .menu-button.active {
          background: #eff6ff;
          color: #1d4ed8;
          border-left-color: #3b82f6;
        }

        /* 二级菜单样式 */
        .level-2 .menu-button {
          padding: 12px 24px 12px 48px;
          font-weight: 500;
          color: #475569;
          border-left: 3px solid transparent;
        }

        .level-2 .menu-button:hover {
          background: #f8fafc;
          color: #334155;
          border-left-color: #cbd5e1;
        }

        .level-2 .menu-button.active {
          background: #f0f9ff;
          color: #0369a1;
          border-left-color: #0ea5e9;
        }

        .level-2 .menu-button.direct-active {
          background: #3b82f6;
          color: white;
          border-left-color: #1d4ed8;
        }

        /* 三级菜单样式 */
        .level-3 .menu-button {
          padding: 10px 24px 10px 72px;
          font-size: 13px;
          color: #64748b;
          border-left: 2px solid transparent;
        }

        .level-3 .menu-button:hover {
          background: #f8fafc;
          color: #475569;
          border-left-color: #e2e8f0;
        }

        .level-3 .menu-button.active {
          background: #f0f9ff;
          color: #0369a1;
          border-left-color: #38bdf8;
        }

        .level-3 .menu-button.direct-active {
          background: #0ea5e9;
          color: white;
          border-left-color: #0284c7;
        }

        .button-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .menu-icon {
          flex-shrink: 0;
          opacity: 0.8;
        }

        .level-1 .menu-icon {
          opacity: 1;
        }

        .menu-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .expand-icon {
          display: flex;
          align-items: center;
          margin-left: 8px;
          transition: transform 0.2s ease;
          opacity: 0.6;
        }

        .menu-button:hover .expand-icon {
          opacity: 1;
        }

        .submenu {
          list-style: none;
          margin: 0;
          padding: 0;
          background: #fafbfc;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
          }
        }

        /* 滚动条样式 */
        .side-navigation::-webkit-scrollbar {
          width: 6px;
        }

        .side-navigation::-webkit-scrollbar-track {
          background: #f8fafc;
        }

        .side-navigation::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .side-navigation::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .side-navigation {
            width: 240px;
          }

          .navigation-header {
            padding: 16px 20px 12px;
          }

          .level-1 .menu-button {
            padding: 14px 20px;
          }

          .level-2 .menu-button {
            padding: 10px 20px 10px 40px;
          }

          .level-3 .menu-button {
            padding: 8px 20px 8px 60px;
          }
        }

        @media (max-width: 768px) {
          .side-navigation {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .side-navigation.mobile-open {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  )
}

export default SideNavigation
