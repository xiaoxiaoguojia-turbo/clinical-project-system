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

const UnauthorizedPage: NextPage = () => {
  const router = useRouter()

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

  const currentUser = TokenManager.getUser()

  return (
    <>
      <Head>
        <title>无权限访问 - 临床创新项目管理系统</title>
        <meta name="description" content="您没有权限访问该页面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
            <div className="text-center">
              {/* 警告图标 */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>

              {/* 标题 */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                无权限访问
              </h2>

              {/* 描述 */}
              <p className="text-sm text-gray-600 mb-6">
                抱歉，您没有权限访问该页面。请联系系统管理员获取相应权限。
              </p>

              {/* 用户信息 */}
              {currentUser && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">当前用户：</span>{currentUser.realName || currentUser.username}</p>
                    <p><span className="font-medium">用户角色：</span>
                      {currentUser.role === 'admin' ? '管理员' : '普通用户'}
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
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  如需帮助，请联系系统管理员或发送邮件至：
                </p>
                <a 
                  href="mailto:admin@clinical-innovation.com" 
                  className="text-xs text-blue-600 hover:text-blue-500"
                >
                  admin@clinical-innovation.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2025 上海临床创新转化研究院 版权所有
          </p>
        </div>
      </div>
    </>
  )
}

export default UnauthorizedPage
