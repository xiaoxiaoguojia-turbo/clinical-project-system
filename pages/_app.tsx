import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

// 全局应用配置
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* 全局meta标签 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="description" content="上海临床创新转化研究院项目管理系统" />
        
        {/* 预加载字体 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 默认图标 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* PWA相关 */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* SEO优化 */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="author" content="上海临床创新转化研究院" />
        <meta name="keywords" content="临床创新,项目管理,院内制剂,转移转化" />
      </Head>
      
      {/* 渲染当前页面组件 */}
      <Component {...pageProps} />
      
      {/* 全局错误边界可以在这里添加 */}
      {/* 全局loading状态可以在这里添加 */}
    </>
  )
}
