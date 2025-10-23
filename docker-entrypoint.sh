#!/bin/sh
# ============================================
# 临床创新项目管理系统 - Docker 启动脚本
# ============================================

set -e

echo "=========================================="
echo "临床创新项目管理系统启动中..."
echo "=========================================="

# 显示环境信息
echo "📦 Node.js 版本: $(node --version)"
echo "🌍 环境模式: ${NODE_ENV:-development}"
echo "🗄️  数据库: ${MONGODB_URI:-未配置}"
echo ""

# 等待MongoDB就绪（最多等待30秒）
if [ -n "$MONGODB_URI" ]; then
  echo "⏳ 等待MongoDB数据库连接..."
  timeout=30
  counter=0
  
  while [ $counter -lt $timeout ]; do
    if node -e "
      const mongoose = require('mongoose');
      mongoose.connect('$MONGODB_URI', { 
        serverSelectionTimeoutMS: 5000 
      })
      .then(() => {
        console.log('✅ MongoDB连接成功');
        process.exit(0);
      })
      .catch(() => {
        process.exit(1);
      });
    " 2>/dev/null; then
      break
    fi
    
    counter=$((counter + 1))
    if [ $counter -lt $timeout ]; then
      echo "   重试 $counter/$timeout..."
      sleep 1
    fi
  done
  
  if [ $counter -eq $timeout ]; then
    echo "❌ MongoDB连接超时，但继续启动应用..."
  fi
else
  echo "⚠️  未配置MongoDB连接字符串"
fi

echo ""
echo "=========================================="
echo "🚀 启动Next.js应用服务..."
echo "=========================================="

# 执行传入的命令
exec "$@"
