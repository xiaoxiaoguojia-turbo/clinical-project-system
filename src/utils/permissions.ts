/**
 * 权限管理工具
 * 用于控制不同角色的页面访问权限
 */

export type UserRole = 'admin' | 'user' | 'guest'

// 定义所有可访问的路由
export const ROUTES = {
  // 公共路由（所有角色都可访问）
  LOGIN: '/login',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  
  // 需要权限的路由
  CHINESE_MEDICINE: '/chinese-medicine-modernization',
  OTHER_PROJECTS: '/other-projects',
  USERS: '/users',
  // 可以继续添加其他路由
} as const

// 游客可访问的路由列表
const GUEST_ALLOWED_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.PROFILE,
  ROUTES.DASHBOARD,
]

// 普通用户可访问的路由列表
const USER_ALLOWED_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.PROFILE,
  ROUTES.DASHBOARD,
  ROUTES.CHINESE_MEDICINE,
  ROUTES.OTHER_PROJECTS,
]

// 管理员可访问所有路由
const ADMIN_ALLOWED_ROUTES = Object.values(ROUTES)

/**
 * 检查用户角色是否可以访问指定路由
 * @param role 用户角色
 * @param path 路由路径
 * @returns 是否有权限访问
 */
export function canAccessRoute(role: UserRole, path: string): boolean {
  // 移除查询参数，只保留路径
  const cleanPath = path.split('?')[0]
  
  switch (role) {
    case 'admin':
      return true // 管理员可以访问所有页面
    case 'user':
      return USER_ALLOWED_ROUTES.some(route => cleanPath.startsWith(route))
    case 'guest':
      return GUEST_ALLOWED_ROUTES.some(route => cleanPath.startsWith(route))
    default:
      return false
  }
}

/**
 * 获取角色的中文标签
 * @param role 用户角色
 * @returns 中文标签
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    'admin': '系统管理员',
    'user': '普通用户',
    'guest': '游客'
  }
  return labels[role] || role
}

/**
 * 获取角色描述
 * @param role 用户角色
 * @returns 角色描述
 */
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    'admin': '拥有系统所有权限',
    'user': '可访问项目管理相关功能',
    'guest': '仅可查看统计数据和个人信息'
  }
  return descriptions[role] || ''
}

/**
 * 检查用户是否为管理员
 * @param role 用户角色
 * @returns 是否为管理员
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'admin'
}

/**
 * 检查用户是否为游客
 * @param role 用户角色
 * @returns 是否为游客
 */
export function isGuest(role: UserRole): boolean {
  return role === 'guest'
}

/**
 * 获取用户可访问的路由列表
 * @param role 用户角色
 * @returns 可访问的路由列表
 */
export function getAllowedRoutes(role: UserRole): string[] {
  switch (role) {
    case 'admin':
      return ADMIN_ALLOWED_ROUTES
    case 'user':
      return USER_ALLOWED_ROUTES
    case 'guest':
      return GUEST_ALLOWED_ROUTES
    default:
      return []
  }
}