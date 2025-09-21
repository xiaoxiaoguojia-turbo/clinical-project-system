import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { 
  ChevronDownIcon,
  ChevronRightIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

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
  // 状态和路由管理
  const router = useRouter()
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

  return (
    <aside className={`side-navigation ${className}`}>
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
          background: #f8fafc;
          border-right: 1px solid #e2e8f0;
          overflow-y: auto;
          z-index: 900;
        }

        .navigation-content {
          padding: 16px 0;
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
          margin-bottom: 8px;
        }

        .menu-item.level-2 {
          margin-left: 0;
        }

        .menu-item.level-3 {
          margin-left: 0;
        }

        .menu-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
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
          background: #e2e8f0;
          font-weight: 600;
          color: #334155;
          padding: 16px 20px;
          border-bottom: 1px solid #cbd5e1;
        }

        .level-1 .menu-button:hover {
          background: #cbd5e1;
        }

        .level-1 .menu-button.active {
          background: #3b82f6;
          color: white;
        }

        /* 二级菜单样式 */
        .level-2 .menu-button {
          padding: 12px 20px 12px 40px;
          font-weight: 500;
          color: #475569;
        }

        .level-2 .menu-button:hover {
          background: #f1f5f9;
          color: #334155;
        }

        .level-2 .menu-button.active {
          background: #dbeafe;
          color: #2563eb;
          border-right: 3px solid #3b82f6;
        }

        .level-2 .menu-button.direct-active {
          background: #3b82f6;
          color: white;
        }

        /* 三级菜单样式 */
        .level-3 .menu-button {
          padding: 10px 20px 10px 60px;
          font-size: 13px;
          color: #64748b;
        }

        .level-3 .menu-button:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .level-3 .menu-button.active {
          background: #dbeafe;
          color: #2563eb;
          border-right: 3px solid #3b82f6;
        }

        .level-3 .menu-button.direct-active {
          background: #2563eb;
          color: white;
        }

        .button-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .menu-icon {
          flex-shrink: 0;
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
        }

        .submenu {
          list-style: none;
          margin: 0;
          padding: 0;
          background: white;
          border-left: 2px solid #e2e8f0;
          margin-left: 20px;
        }

        .level-1 .submenu {
          background: #f8fafc;
          border-left: none;
          margin-left: 0;
        }

        .level-2 .submenu {
          background: white;
          border-left: 2px solid #dbeafe;
          margin-left: 40px;
        }

        /* 滚动条样式 */
        .side-navigation::-webkit-scrollbar {
          width: 6px;
        }

        .side-navigation::-webkit-scrollbar-track {
          background: #f1f5f9;
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

          .menu-button {
            padding: 10px 16px;
          }

          .level-1 .menu-button {
            padding: 14px 16px;
          }

          .level-2 .menu-button {
            padding: 10px 16px 10px 32px;
          }

          .level-3 .menu-button {
            padding: 8px 16px 8px 48px;
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
