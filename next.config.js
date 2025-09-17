/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 环境变量配置 - 移除NODE_ENV（Next.js自动管理）
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
    UPLOAD_DIR: process.env.UPLOAD_DIR,
    API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  },
  
  // 静态文件配置
  staticPageGenerationTimeout: 120,
  
  // 图片优化配置
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // webpack配置（用于API body size限制）
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 服务器端配置
      config.externals = config.externals || []
    }
    return config
  },
  
  // Next.js 14+ 使用 serverComponentsExternalPackages 替代某些配置
  experimental: {
    // 移除已过时的 appDir 配置
    serverComponentsExternalPackages: ['mongoose'],
  },
}

module.exports = nextConfig
