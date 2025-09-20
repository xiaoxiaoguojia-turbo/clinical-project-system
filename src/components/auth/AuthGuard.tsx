import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { TokenManager, checkPermission } from '@/utils/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: 'admin' | 'user'
  fallback?: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true, 
  requiredRole,
  fallback 
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      // 如果不需要认证，直接通过
      if (!requireAuth) {
        setHasPermission(true)
        setIsLoading(false)
        return
      }

      // 检查是否已登录
      if (!TokenManager.isAuthenticated()) {
        // 未登录，重定向到登录页
        router.push('/login')
        return
      }

      // 检查权限
      if (!checkPermission(requiredRole)) {
        // 权限不足，重定向到无权限页面
        router.push('/unauthorized')
        return
      }

      setHasPermission(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, requireAuth, requiredRole])

  // 加载中状态
  if (isLoading) {
    return fallback || <LoadingScreen />
  }

  // 有权限才渲染子组件
  if (hasPermission) {
    return <>{children}</>
  }

  // 无权限时不渲染任何内容（因为会重定向）
  return null
}

// 默认加载屏幕组件
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">正在加载...</p>
    </div>
  </div>
)

export default AuthGuard
