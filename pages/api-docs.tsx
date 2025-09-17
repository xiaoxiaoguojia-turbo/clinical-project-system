import React, { useEffect } from 'react'
import Head from 'next/head'

const ApiDocsPage: React.FC = () => {
  useEffect(() => {
    // 动态加载SwaggerUI
    const loadSwaggerUI = async () => {
      // 检查是否已经加载
      if (typeof window !== 'undefined' && !(window as any).SwaggerUIBundle) {
        // 加载CSS（先加载CSS）
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = 'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css'
        document.head.appendChild(link)

        // 动态加载SwaggerUI脚本
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js'
        script.async = false // 改为同步加载
        
        script.onload = () => {
          // 延迟初始化，确保DOM和CSS都已准备好
          setTimeout(() => {
            initializeSwaggerUI()
          }, 100)
        }
        
        script.onerror = () => {
          console.error('SwaggerUI 脚本加载失败')
          showErrorMessage()
        }
        
        document.head.appendChild(script)
      } else {
        initializeSwaggerUI()
      }
    }

    const initializeSwaggerUI = () => {
      try {
        if (typeof window !== 'undefined' && (window as any).SwaggerUIBundle) {
          const SwaggerUIBundle = (window as any).SwaggerUIBundle
          
          // 清除加载提示
          const container = document.getElementById('swagger-ui')
          if (container) {
            container.innerHTML = ''
          }
          
          SwaggerUIBundle({
            url: '/api/docs',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.presets.standalone
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout", // 确保布局正确
            validatorUrl: null,
            tryItOutEnabled: true,
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
            onComplete: () => {
              console.log('SwaggerUI 加载完成')
              customizeSwaggerUI()
            },
            requestInterceptor: (request: any) => {
              // 为请求添加默认的Content-Type
              if (request.method !== 'GET' && !request.headers['Content-Type']) {
                request.headers['Content-Type'] = 'application/json'
              }
              return request
            },
            responseInterceptor: (response: any) => {
              return response
            },
            docExpansion: 'list',
            operationsSorter: 'alpha',
            tagsSorter: 'alpha',
            filter: true,
            showExtensions: true,
            showCommonExtensions: true,
            defaultModelsExpandDepth: 2,
            defaultModelExpandDepth: 2,
            displayRequestDuration: true,
          })
        } else {
          console.error('SwaggerUIBundle 未定义')
          showErrorMessage()
        }
      } catch (error) {
        console.error('SwaggerUI 初始化错误:', error)
        showErrorMessage()
      }
    }

    const customizeSwaggerUI = () => {
      // 自定义SwaggerUI样式和行为
      const style = document.createElement('style')
      style.innerHTML = `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info { margin: 20px 0; }
        .swagger-ui .scheme-container { background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .swagger-ui .auth-wrapper { margin: 20px 0; }
        .swagger-ui .btn.authorize { background-color: #1890ff; border-color: #1890ff; }
        .swagger-ui .btn.authorize:hover { background-color: #40a9ff; border-color: #40a9ff; }
      `
      document.head.appendChild(style)
    }

    const showErrorMessage = () => {
      const container = document.getElementById('swagger-ui')
      if (container) {
        container.innerHTML = `
          <div class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">API文档加载失败</h3>
              <p class="text-sm text-gray-500 mb-4">请检查网络连接或稍后再试</p>
              <button 
                onclick="window.location.reload()" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                重新加载
              </button>
            </div>
          </div>
        `
      }
    }

    loadSwaggerUI()
  }, [])

  return (
    <>
      <Head>
        <title>API文档 - 临床创新项目管理系统</title>
        <meta name="description" content="临床创新项目管理系统API接口文档" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* 页面头部 */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    临床创新项目管理系统 API文档
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    上海临床创新转化研究院 - 转移转化与投资部门
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    版本 v1.0.0 | 基于 OpenAPI 3.0 规范
                  </p>
                </div>
                <div className="flex space-x-4">
                  <a
                    href="/api/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    下载 OpenAPI JSON
                  </a>
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    返回首页
                  </a>
                </div>
              </div>
              
              {/* API统计信息 */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">认证接口</div>
                  <div className="text-2xl font-bold text-blue-600">3</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-green-900">用户管理</div>
                  <div className="text-2xl font-bold text-green-600">6</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-purple-900">项目管理</div>
                  <div className="text-2xl font-bold text-purple-600">8</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-orange-900">附件管理</div>
                  <div className="text-2xl font-bold text-orange-600">4</div>
                </div>
              </div>
              
              {/* 快速导航 */}
              <div className="mt-6 flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-500">快速导航：</span>
                {[
                  { name: '用户认证', color: 'blue' },
                  { name: '用户管理', color: 'green' },
                  { name: '总体项目管理', color: 'purple' },
                  { name: '院内制剂项目管理', color: 'indigo' },
                  { name: '附件管理', color: 'orange' }
                ].map((item) => (
                  <button 
                    key={item.name}
                    onClick={() => {
                      const element = document.querySelector(`[data-tag="${item.name}"]`)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className={`text-sm px-3 py-1 rounded-full border hover:shadow-sm transition-all duration-200 
                      text-${item.color}-600 border-${item.color}-300 hover:bg-${item.color}-50`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">使用指南</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>先调用 <strong>/api/auth/login</strong> 接口获取访问令牌</li>
                    <li>点击右上角 <strong>"Authorize"</strong> 按钮设置认证</li>
                    <li>格式：<code className="bg-blue-100 px-1 rounded">Bearer your_token_here</code></li>
                    <li>现在可以测试需要认证的接口了</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Swagger UI 容器 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-lg shadow">
            <div id="swagger-ui" className="swagger-ui-container">
              {/* SwaggerUI 将在这里渲染 */}
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-sm text-gray-500">正在加载API文档...</p>
                  <p className="mt-2 text-xs text-gray-400">首次加载可能需要几秒钟</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .swagger-ui-container :global(.swagger-ui) {
          font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        }
        .swagger-ui-container :global(.swagger-ui .topbar) {
          display: none !important;
        }
        .swagger-ui-container :global(.swagger-ui .info) {
          margin: 20px 0;
        }
        .swagger-ui-container :global(.swagger-ui .scheme-container) {
          background: #f8f9fa;
          padding: 15px;
          margin: 15px 0;
          border-radius: 8px;
          border-left: 4px solid #1890ff;
        }
      `}</style>
    </>
  )
}

export default ApiDocsPage
