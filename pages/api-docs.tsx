import React, { useEffect, useState } from 'react'
import Head from 'next/head'

const ApiDocsPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiStats, setApiStats] = useState<any>(null)

  useEffect(() => {
    let mounted = true

    const loadApiStats = async () => {
      try {
        const response = await fetch('/api/docs')
        if (response.ok) {
          const data = await response.json()
          if (mounted) {
            setApiStats({
              pathsCount: data.paths ? Object.keys(data.paths).length : 0,
              schemasCount: data.components?.schemas ? Object.keys(data.components.schemas).length : 0,
              version: data.info?.version || '1.0.0'
            })
          }
        }
      } catch (err) {
        console.error('Failed to load API stats:', err)
      }
    }

    const loadSwaggerUI = async () => {
      try {
        // 预加载CSS
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = 'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css'
        cssLink.onload = () => {
          console.log('✅ Swagger CSS loaded')
        }
        document.head.appendChild(cssLink)

        // 等待一下让CSS加载
        await new Promise(resolve => setTimeout(resolve, 200))

        // 动态加载SwaggerUI - 使用更稳定的版本
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js'
        script.onload = () => {
          console.log('✅ Swagger JS loaded')
          // 再等待一下确保脚本完全初始化
          setTimeout(() => {
            if (mounted) {
              initializeSwaggerUI()
            }
          }, 300)
        }
        script.onerror = () => {
          console.error('❌ Failed to load SwaggerUI script')
          if (mounted) {
            setError('无法加载SwaggerUI脚本，请检查网络连接')
            setLoading(false)
          }
        }
        document.head.appendChild(script)
      } catch (err) {
        console.error('❌ Error loading SwaggerUI:', err)
        if (mounted) {
          setError('加载SwaggerUI时出错')
          setLoading(false)
        }
      }
    }

    const initializeSwaggerUI = () => {
      try {
        console.log('🔧 Initializing SwaggerUI...')
        
        if (!(window as any).SwaggerUIBundle) {
          throw new Error('SwaggerUIBundle not available')
        }

        const container = document.getElementById('swagger-ui')
        if (!container) {
          throw new Error('Swagger container not found')
        }

        // 清空容器
        container.innerHTML = ''

        const SwaggerUIBundle = (window as any).SwaggerUIBundle

        // 修复后的配置
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
          layout: "BaseLayout", // 修复：使用 BaseLayout 而不是 StandaloneLayout
          validatorUrl: null,
          tryItOutEnabled: true,
          filter: true,
          displayRequestDuration: true,
          defaultModelsExpandDepth: 1,
          defaultModelExpandDepth: 1,
          docExpansion: 'list',
          operationsSorter: 'alpha',
          tagsSorter: 'alpha',
          supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
          requestInterceptor: (request: any) => {
            // 可以在这里添加请求拦截器
            console.log('Request:', request)
            return request
          },
          responseInterceptor: (response: any) => {
            // 可以在这里添加响应拦截器
            console.log('Response:', response)
            return response
          },
          onComplete: () => {
            console.log('✅ SwaggerUI initialized successfully')
            if (mounted) {
              setLoading(false)
              customizeUI()
            }
          },
          onFailure: (err: any) => {
            console.error('❌ SwaggerUI initialization failed:', err)
            if (mounted) {
              setError('SwaggerUI初始化失败: ' + (err?.message || '未知错误'))
              setLoading(false)
            }
          }
        })
      } catch (err) {
        console.error('❌ SwaggerUI initialization error:', err)
        if (mounted) {
          setError('SwaggerUI初始化错误: ' + (err as Error).message)
          setLoading(false)
        }
      }
    }

    const customizeUI = () => {
      try {
        // 等待DOM渲染完成后再应用样式
        setTimeout(() => {
          // 隐藏顶部栏（如果存在）
          const topbar = document.querySelector('.swagger-ui .topbar') as HTMLElement
          if (topbar) {
            topbar.style.display = 'none'
          }

          // 添加自定义样式
          const style = document.createElement('style')
          style.textContent = `
            .swagger-ui .topbar { display: none !important; }
            .swagger-ui .info { margin: 20px 0; }
            .swagger-ui .info .title { color: #3b82f6; font-size: 2rem; }
            .swagger-ui .scheme-container { 
              margin: 20px 0; 
              padding: 15px; 
              background: #f8fafc; 
              border-radius: 8px; 
            }
            .swagger-ui .opblock { 
              margin-bottom: 10px; 
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .swagger-ui .opblock.opblock-get { 
              border-color: #10b981; 
            }
            .swagger-ui .opblock.opblock-get .opblock-summary {
              background: rgba(16, 185, 129, 0.1);
              border-color: #10b981;
            }
            .swagger-ui .opblock.opblock-post { 
              border-color: #3b82f6; 
            }
            .swagger-ui .opblock.opblock-post .opblock-summary {
              background: rgba(59, 130, 246, 0.1);
              border-color: #3b82f6;
            }
            .swagger-ui .opblock.opblock-put { 
              border-color: #f59e0b; 
            }
            .swagger-ui .opblock.opblock-put .opblock-summary {
              background: rgba(245, 158, 11, 0.1);
              border-color: #f59e0b;
            }
            .swagger-ui .opblock.opblock-delete { 
              border-color: #ef4444; 
            }
            .swagger-ui .opblock.opblock-delete .opblock-summary {
              background: rgba(239, 68, 68, 0.1);
              border-color: #ef4444;
            }
            .swagger-ui .opblock-summary { 
              padding: 15px; 
            }
            .swagger-ui .authorization__btn {
              background: #3b82f6;
              color: white;
              border-radius: 6px;
            }
            .swagger-ui .btn.authorize {
              background: #10b981;
              color: white;
            }
            .api-stats { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 20px; 
              border-radius: 10px; 
              margin-bottom: 20px;
              text-align: center;
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            }
            .api-stats h3 { 
              margin: 0 0 10px 0; 
              font-size: 1.5rem; 
              font-weight: 600;
            }
            .api-stats .stats-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
              gap: 15px; 
              margin-top: 15px;
            }
            .api-stats .stat-item { 
              background: rgba(255,255,255,0.2); 
              padding: 15px; 
              border-radius: 8px; 
              backdrop-filter: blur(10px);
              transition: transform 0.2s ease;
            }
            .api-stats .stat-item:hover {
              transform: translateY(-2px);
            }
            .api-stats .stat-number { 
              font-size: 1.8rem; 
              font-weight: bold; 
              margin-bottom: 4px;
            }
            .api-stats .stat-label { 
              font-size: 0.9rem; 
              opacity: 0.9; 
            }
            .swagger-ui .wrapper {
              padding: 20px;
            }
          `
          document.head.appendChild(style)

          console.log('✅ Custom styles applied')
        }, 1000)
      } catch (err) {
        console.error('Failed to apply custom styles:', err)
      }
    }

    loadApiStats()
    loadSwaggerUI()

    return () => {
      mounted = false
    }
  }, [])

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    window.location.reload()
  }

  return (
    <>
      <Head>
        <title>API文档 - 临床创新项目管理系统</title>
        <meta name="description" content="临床创新项目管理系统的API接口文档" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          
          {/* API统计信息 */}
          {apiStats && !loading && (
            <div className="api-stats">
              <h3>📋 临床创新项目管理系统 API 文档</h3>
              <p>上海临床创新转化研究院项目管理系统接口文档</p>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{apiStats.pathsCount}</div>
                  <div className="stat-label">API接口</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{apiStats.schemasCount}</div>
                  <div className="stat-label">数据模型</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">v{apiStats.version}</div>
                  <div className="stat-label">版本号</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">JWT</div>
                  <div className="stat-label">认证方式</div>
                </div>
              </div>
            </div>
          )}

          {/* 加载状态 */}
          {loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              background: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ 
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '16px'
              }}></div>
              <h3 style={{ color: '#6b7280', margin: '0 0 8px 0' }}>加载API文档中...</h3>
              <p style={{ color: '#9ca3af', margin: 0 }}>正在初始化SwaggerUI界面</p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* 错误状态 */}
          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>❌ 加载失败</h3>
              <p style={{ color: '#7f1d1d', margin: '0 0 15px 0' }}>{error}</p>
              <button 
                onClick={handleRetry}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                重新加载
              </button>
            </div>
          )}

          {/* SwaggerUI容器 */}
          <div 
            id="swagger-ui" 
            style={{ 
              background: 'white',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              display: loading || error ? 'none' : 'block'
            }}
          ></div>
          
          {/* 底部信息 */}
          {!loading && !error && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <p>💡 提示：点击接口可以展开详细信息和测试功能</p>
              <p>🔐 需要认证的接口请在右上角Authorize按钮中添加 JWT Token</p>
              <p>🚀 开发环境：{process.env.NODE_ENV} | API基础URL：{process.env.API_BASE_URL || 'http://localhost:3000'}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ApiDocsPage
