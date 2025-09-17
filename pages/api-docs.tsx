import React, { useEffect } from 'react'
import Head from 'next/head'

const ApiDocsPage: React.FC = () => {
  useEffect(() => {
    // 动态加载SwaggerUI
    const loadSwaggerUI = async () => {
      // 检查是否已经加载
      if (typeof window !== 'undefined' && !(window as any).SwaggerUIBundle) {
        // 动态加载SwaggerUI脚本
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js'
        script.async = true
        script.onload = () => {
          initializeSwaggerUI()
        }
        document.head.appendChild(script)

        // 加载CSS
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = 'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css'
        document.head.appendChild(link)
      } else {
        initializeSwaggerUI()
      }
    }

    const initializeSwaggerUI = () => {
      if (typeof window !== 'undefined' && (window as any).SwaggerUIBundle) {
        const SwaggerUIBundle = (window as any).SwaggerUIBundle
        
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
          layout: "StandaloneLayout",
          validatorUrl: null,
          tryItOutEnabled: true,
          supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
          onComplete: () => {
            console.log('SwaggerUI 加载完成')
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
          docExpansion: 'list', // 默认展开级别
          operationsSorter: 'alpha', // 按字母顺序排序
          tagsSorter: 'alpha', // 标签按字母顺序排序
          filter: true, // 启用筛选
          showExtensions: true,
          showCommonExtensions: true,
          defaultModelsExpandDepth: 2, // 模型展开深度
          defaultModelExpandDepth: 2,
          displayRequestDuration: true, // 显示请求耗时
        })
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
              
              {/* 快速导航 */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-500">快速导航：</span>
                <button 
                  onClick={() => {
                    const element = document.querySelector('[data-tag="用户认证"]')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  用户认证
                </button>
                <button 
                  onClick={() => {
                    const element = document.querySelector('[data-tag="用户管理"]')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  用户管理
                </button>
                <button 
                  onClick={() => {
                    const element = document.querySelector('[data-tag="总体项目管理"]')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  总体项目管理
                </button>
                <button 
                  onClick={() => {
                    const element = document.querySelector('[data-tag="院内制剂项目管理"]')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  院内制剂项目管理
                </button>
                <button 
                  onClick={() => {
                    const element = document.querySelector('[data-tag="附件管理"]')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  附件管理
                </button>
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
                <p className="text-sm text-blue-700">
                  <strong>使用提示：</strong> 大部分API需要JWT令牌认证。请先调用登录接口获取token，然后在右上角"Authorize"按钮中设置。
                  格式为：<code className="bg-blue-100 px-1 rounded">Bearer your_token_here</code>
                </p>
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
          display: none;
        }
        .swagger-ui-container :global(.swagger-ui .info) {
          margin: 20px 0;
        }
      `}</style>
    </>
  )
}

export default ApiDocsPage
