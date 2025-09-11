/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false, // 使用传统的pages目录结构
  },
  // 环境变量配置
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
  // API路由配置
  api: {
    bodyParser: {
      sizeLimit: '10mb', // 文件上传限制
    },
  },
  // 静态文件配置
  staticPageGenerationTimeout: 120,
  // 图片优化配置
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
