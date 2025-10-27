# ============================================
# 临床创新项目管理系统 - Docker镜像
# 基于 Next.js 14 + Node.js 20
# 支持 x86/Ubuntu 24.04 生产环境
# ============================================

# ===== 阶段1: 依赖安装 =====
FROM node:20-alpine AS deps

# 设置工作目录
WORKDIR /app

# 安装必要的系统依赖（Alpine需要）
RUN apk add --no-cache libc6-compat

# 复制package文件
COPY package.json package-lock.json ./

# 安装生产依赖
RUN npm ci --only=production && \
    npm cache clean --force

# ===== 阶段2: 构建应用 =====
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置构建时环境变量
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# 构建Next.js应用
RUN npm run build

# ===== 阶段3: 生产运行 =====
FROM node:20-alpine AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 创建非root用户（安全最佳实践）
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 创建必要的目录
RUN mkdir -p /app/uploads && \
    mkdir -p /app/.next && \
    chown -R nextjs:nodejs /app

# 复制必要文件（Standalone模式）
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

# ===== 🔥 新增：复制所有源代码文件 =====
# 1. 复制页面和API源代码（包含JSDoc注释）
COPY --from=builder /app/pages ./pages

# 2. 复制src目录（完整的源代码结构）
COPY --from=builder /app/src ./src

# 3. 复制样式文件
COPY --from=builder /app/styles ./styles

# 4. 复制脚本文件（数据库迁移、初始化等）
COPY --from=builder /app/scripts ./scripts

# 5. 复制配置文件
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/next-env.d.ts ./next-env.d.ts
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/tailwind.config.js ./tailwind.config.js
COPY --from=builder /app/postcss.config.js ./postcss.config.js

# 复制启动脚本
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动命令
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
