import { useState, useEffect } from 'react'

/**
 * 通用的hydration安全Hook
 * 确保组件只在客户端hydration完成后才渲染完整内容
 */
export const useHydrationSafe = (): boolean => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * 认证状态的hydration安全Hook
 * 动态导入TokenManager避免SSR问题，确保认证状态在客户端正确获取
 */
export const useAuthHydrationSafe = () => {
  const [isHydrated, setIsHydrated] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 动态导入TokenManager避免SSR问题
        const { TokenManager } = await import('@/utils/auth')
        
        const authenticated = TokenManager.isAuthenticated()
        const user = TokenManager.getUser()
        
        setIsAuthenticated(authenticated)
        setCurrentUser(user)
      } catch (error) {
        console.error('Auth initialization error:', error)
        setIsAuthenticated(false)
        setCurrentUser(null)
      } finally {
        setIsHydrated(true)
      }
    }

    initAuth()
  }, [])

  return {
    isHydrated,
    isAuthenticated,
    currentUser,
    isAdmin: currentUser?.role === 'admin'
  }
}
