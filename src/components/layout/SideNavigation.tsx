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
          label: '总项目报表统计',
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
              id: 'internal-preparations',
              label: '院内制剂',
              icon: BeakerIcon,
              route: '/internal-preparations',
              level: 3
            },
            {
              id: 'type2',
              label: '类型2',
              icon: ChartBarIcon,
              route: '/type2-projects',
              level: 3
            },
            {
              id: 'type3',
              label: '类型3',
              icon: ChartBarIcon,
              route: '/underconstruction',
              level: 3
            },
            {
              id: 'type4',
              label: '类型4',
              icon: ChartBarIcon,
              route: '/underconstruction',
              level: 3
            },
            {
              id: 'type5',
              label: '类型5',
              icon: ChartBarIcon,
              route: '/underconstruction',
              level: 3
            },
            {
              id: 'type6',
              label: '类型6',
              icon: ChartBarIcon,
              route: '/underconstruction',
              level: 3
            },
            {
              id: 'type7',
              label: '类型7',
              icon: ChartBarIcon,
              route: '/underconstruction',
              level: 3
            },
            {
              id: 'type8',
              label: '类型8',
              icon: ChartBarIcon,
              route: '/underconstruction',
              level: 3
            },
            {
              id: 'type9',
              label: '类型9',
              icon: ChartBarIcon,
              route: '/underconstruction',
              level: 3
            },
            {
              id: 'type10',
              label: '类型10',
              icon: ChartBarIcon,
              route: '/underconstruction',
              level: 3
            }
          ]
        }
      ]
    }
  ]
  /* ------------------------------------------------------------------------------------------ */

  return (
    <aside className={`side-navigation ${className}`}>
      <div className="navigation-header">
        <h3 className="header-title">导航菜单</h3>
      </div>
      
      <div className="navigation-content">
        <ul className="menu-list">
          {menuItems.map((item) => {
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

                {/* 子菜单 - 递归渲染 */}
                {hasChildren && isExpanded && (
                  <ul className="submenu">
                    {item.children!.map((child) => {
                      const isChildExpanded = expandedItems.has(child.id)
                      const hasChildChildren = child.children && child.children.length > 0
                      const childActive = isParentActive(child)
                      const childDirectActive = isActive(child.route)

                      return (
                        <li key={child.id} className={`menu-item level-${child.level}`}>
                          <button
                            onClick={() => handleNavigation(child)}
                            className={`menu-button ${childActive ? 'active' : ''} ${childDirectActive ? 'direct-active' : ''}`}
                          >
                            <div className="button-content">
                              {/* 图标 */}
                              {child.icon && (
                                <child.icon className="w-5 h-5 menu-icon" />
                              )}
                              
                              {/* 标签 */}
                              <span className="menu-label">{child.label}</span>
                            </div>

                            {/* 展开/收起箭头 */}
                            {hasChildChildren && (
                              <div className="expand-icon">
                                {isChildExpanded ? (
                                  <ChevronDownIcon className="w-4 h-4" />
                                ) : (
                                  <ChevronRightIcon className="w-4 h-4" />
                                )}
                              </div>
                            )}
                          </button>

                          {/* 子菜单 - 递归渲染 */}
                          {hasChildChildren && isChildExpanded && (
                            <ul className="submenu">
                              {child.children!.map((grandchild) => {
                                const isGrandchildExpanded = expandedItems.has(grandchild.id)
                                const hasGrandchildChildren = grandchild.children && grandchild.children.length > 0
                                const grandchildActive = isParentActive(grandchild)
                                const grandchildDirectActive = isActive(grandchild.route)

                                return (
                                  <li key={grandchild.id} className={`menu-item level-${grandchild.level}`}>
                                    <button
                                      onClick={() => handleNavigation(grandchild)}
                                      className={`menu-button ${grandchildActive ? 'active' : ''} ${grandchildDirectActive ? 'direct-active' : ''}`}
                                    >
                                      <div className="button-content">
                                        {/* 图标 */}
                                        {grandchild.icon && (
                                          <grandchild.icon className="w-5 h-5 menu-icon" />
                                        )}
                                        
                                        {/* 标签 */}
                                        <span className="menu-label">{grandchild.label}</span>
                                      </div>
                                    </button>
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
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
          padding: 0;
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
