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
        cssLink.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css'
        cssLink.onload = () => {
          console.log('✅ Swagger CSS loaded')
        }
        document.head.appendChild(cssLink)

        // 等待一下让CSS加载
        await new Promise(resolve => setTimeout(resolve, 100))

        // 动态加载SwaggerUI
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js'
        script.onload = () => {
          console.log('✅ Swagger JS loaded')
          // 再等待一下确保脚本完全初始化
          setTimeout(() => {
            if (mounted) {
              initializeSwaggerUI()
            }
          }, 200)
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
          filter: true,
          displayRequestDuration: true,
          defaultModelsExpandDepth: 1,
          defaultModelExpandDepth: 1,
          docExpansion: 'list',
          operationsSorter: 'alpha',
          tagsSorter: 'alpha',
          supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
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
              setError('SwaggerUI初始化失败')
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
        // 添加自定义样式
        const style = document.createElement('style')
        style.textContent = `
          .swagger-ui .topbar { display: none; }
          .swagger-ui .info { margin: 20px 0; }
          .swagger-ui .info .title { color: #3b82f6; font-size: 2rem; }
          .swagger-ui .scheme-container { margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px; }
          .swagger-ui .opblock { margin-bottom: 10px; border-radius: 8px; }
          .swagger-ui .opblock.opblock-get { border-color: #10b981; }
          .swagger-ui .opblock.opblock-post { border-color: #3b82f6; }
          .swagger-ui .opblock.opblock-put { border-color: #f59e0b; }
          .swagger-ui .opblock.opblock-delete { border-color: #ef4444; }
          .swagger-ui .opblock-summary { padding: 15px; }
          .api-stats { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 20px; 
            border-radius: 10px; 
            margin-bottom: 20px;
            text-align: center;
          }
          .api-stats h3 { margin: 0 0 10px 0; font-size: 1.5rem; }
          .api-stats .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
            gap: 15px; 
            margin-top: 15px;
          }
          .api-stats .stat-item { 
            background: rgba(255,255,255,0.2); 
            padding: 10px; 
            border-radius: 8px; 
            backdrop-filter: blur(10px);
          }
          .api-stats .stat-number { font-size: 1.5rem; font-weight: bold; }
          .api-stats .stat-label { font-size: 0.9rem; opacity: 0.9; }
        `
        document.head.appendChild(style)
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
                onClick={() => window.location.reload()}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer'
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
              display: loading ? 'none' : 'block'
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
              <p>🔐 需要认证的接口请在右上角Authorize按钮中添加JWT Token</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ApiDocsPage
