# 临床创新项目管理系统 - Docker 部署指南

## 📋 目录
- [系统要求](#系统要求)
- [部署架构](#部署架构)
- [Windows 本地测试](#windows-本地测试)
- [Ubuntu 生产部署](#ubuntu-生产部署)
- [常见问题](#常见问题)
- [维护指南](#维护指南)

---

## 🖥️ 系统要求

### **目标服务器配置：**
- **操作系统**: Ubuntu 24.04 LTS
- **架构**: x86_64 (AMD64)
- **网络**: 需要外网访问（Coze AI服务）
- **Docker**: 24.0.0+
- **Docker Compose**: 2.20.0+

### **最低硬件要求：**
- **CPU**: 2核心
- **内存**: 4GB RAM
- **磁盘**: 20GB 可用空间

---

## 🏗️ 部署架构

```
┌─────────────────────────────────────────────┐
│  Docker Compose 编排层                       │
│                                              │
│  ┌────────────────┐    ┌─────────────────┐ │
│  │ Next.js 应用    │    │ MongoDB 数据库   │ │
│  │ Port: 3000     │◄───┤ Port: 27017     │ │
│  │ Container:     │    │ Container:      │ │
│  │ clinical-nextjs│    │ clinical-mongodb│ │
│  └────────────────┘    └─────────────────┘ │
│         │                      │            │
│         ├─ /app/uploads (卷)  │            │
│         └─ /app/logs (卷)     └─ /data/db  │
└─────────────────────────────────────────────┘
```

---

## 💻 Windows 本地测试

### **Step 1: 安装 Docker Desktop**

1. 下载 Docker Desktop for Windows:
   ```
   https://www.docker.com/products/docker-desktop/
   ```

2. 安装并启动 Docker Desktop

3. 验证安装:
   ```powershell
   docker --version
   docker-compose --version
   ```

### **Step 2: 准备项目**

1. 克隆或复制项目到本地:
   ```powershell
   cd d:\VS Code\clinical-project-system
   ```

2. 创建环境变量文件:
   ```powershell
   # 复制模板文件
   copy .env.production.example .env.production
   
   # 使用文本编辑器修改 .env.production
   notepad .env.production
   ```

3. **重要配置修改:**
   ```bash
   # 生成强密码
   MONGO_ROOT_PASSWORD=YourStrongPassword123!
   
   # 生成JWT密钥（PowerShell）
   # [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([Guid]::NewGuid().ToString()))
   JWT_SECRET=生成的32位随机字符串
   
   # 配置Coze AI（可选）
   COZE_API_KEY=your-api-key
   COZE_BOT_ID=your-bot-id
   COZE_WORKFLOW_ID=your-workflow-id
   ```

### **Step 3: 构建和启动**

```powershell
# 构建Docker镜像
docker-compose build

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看运行状态
docker-compose ps
```

### **Step 4: 验证部署**

1. **访问应用**: http://localhost:3000
2. **健康检查**: http://localhost:3000/api/health
3. **查看MongoDB**: 
   ```powershell
   docker exec -it clinical-mongodb mongosh -u admin -p YourStrongPassword123!
   ```

### **Step 5: 测试功能**

- ✅ 用户登录
- ✅ 项目创建
- ✅ 文件上传
- ✅ 数据持久化

---

## 🐧 Ubuntu 生产部署

### **Step 1: 服务器准备**

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要工具
sudo apt install -y curl git vim

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo apt install -y docker-compose-plugin

# 添加当前用户到 docker 组
sudo usermod -aG docker $USER
newgrp docker

# 验证安装
docker --version
docker compose version
```

### **Step 2: 部署项目**

```bash
# 创建项目目录
sudo mkdir -p /opt/clinical-project-system
cd /opt/clinical-project-system

# 上传项目文件（方式1：Git）
git clone <your-repository-url> .

# 或者方式2：直接上传
# scp -r clinical-project-system/* user@server:/opt/clinical-project-system/
```

### **Step 3: 配置环境**

```bash
# 创建生产环境配置
cp .env.production.example .env.production

# 编辑配置（重要！）
vim .env.production

# 生成强密码和密钥
openssl rand -base64 32  # 用于JWT_SECRET
openssl rand -base64 24  # 用于MONGO_ROOT_PASSWORD
```

**生产环境必须修改的配置：**
```bash
MONGO_ROOT_PASSWORD=生成的强密码
JWT_SECRET=生成的32位密钥
COZE_API_KEY=实际的API密钥
API_BASE_URL=http://服务器IP:3000
```

### **Step 4: 启动服务**

```bash
# 构建镜像
docker compose build --no-cache

# 启动服务（后台运行）
docker compose up -d

# 查看启动日志
docker compose logs -f

# 查看服务状态
docker compose ps
```

### **Step 5: 验证部署**

```bash
# 1. 检查容器状态
docker ps

# 2. 测试应用健康
curl http://localhost:3000/api/health

# 3. 查看MongoDB
docker exec -it clinical-mongodb mongosh \
  -u admin \
  -p '你的密码' \
  --authenticationDatabase admin

# 4. 查看应用日志
docker logs clinical-nextjs --tail 100 -f
```

### **Step 6: 配置防火墙**

```bash
# 开放3000端口
sudo ufw allow 3000/tcp

# 查看防火墙状态
sudo ufw status
```

---

## 🔧 常见问题

### **Q1: MongoDB 连接失败**

```bash
# 检查MongoDB状态
docker logs clinical-mongodb

# 重启MongoDB
docker restart clinical-mongodb

# 验证网络连通性
docker exec -it clinical-nextjs ping mongodb
```

### **Q2: Next.js 应用无法启动**

```bash
# 查看详细日志
docker logs clinical-nextjs --tail 200

# 检查环境变量
docker exec -it clinical-nextjs env | grep MONGO

# 重新构建镜像
docker compose down
docker compose build --no-cache
docker compose up -d
```

### **Q3: 文件上传失败**

```bash
# 检查uploads卷
docker volume inspect clinical_uploads_data

# 查看容器内目录权限
docker exec -it clinical-nextjs ls -la /app/uploads
```

### **Q4: 端口冲突**

```bash
# 查看端口占用
sudo lsof -i :3000
sudo lsof -i :27017

# 修改docker-compose.yml中的端口映射
ports:
  - "3001:3000"  # 改为3001
```

---

## 🛠️ 维护指南

### **日常操作命令**

```bash
# 启动服务
docker compose up -d

# 停止服务
docker compose down

# 重启服务
docker compose restart

# 查看日志
docker compose logs -f nextjs-app
docker compose logs -f mongodb

# 更新应用（新代码）
git pull
docker compose build nextjs-app
docker compose up -d nextjs-app
```

### **数据备份**

```bash
# 备份MongoDB数据
docker exec clinical-mongodb mongodump \
  -u admin \
  -p '你的密码' \
  --authenticationDatabase admin \
  --out /data/backup

# 复制备份到主机
docker cp clinical-mongodb:/data/backup ./mongodb-backup-$(date +%Y%m%d)

# 备份上传文件
docker run --rm \
  -v clinical_uploads_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/uploads-backup-$(date +%Y%m%d).tar.gz /data
```

### **数据恢复**

```bash
# 恢复MongoDB数据
docker cp ./mongodb-backup clinical-mongodb:/data/restore
docker exec clinical-mongodb mongorestore \
  -u admin \
  -p '你的密码' \
  --authenticationDatabase admin \
  /data/restore
```

### **监控和日志**

```bash
# 查看资源使用
docker stats

# 查看容器详情
docker inspect clinical-nextjs

# 实时日志
docker logs -f clinical-nextjs

# 清理日志
docker compose down
docker system prune -a --volumes
```

---

## 🚀 性能优化

### **生产环境优化**

1. **配置资源限制**（docker-compose.yml）:
```yaml
nextjs-app:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
      reservations:
        memory: 1G
```

2. **启用日志轮转**:
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

3. **使用生产构建**:
```bash
NODE_ENV=production npm run build
```

---

## 📞 技术支持

- **问题反馈**: 联系系统管理员
- **日志位置**: `/opt/clinical-project-system/logs`
- **数据备份**: 每日自动备份到 `/backup/clinical-system`

---

## ✅ 部署检查清单

### Windows 测试环境
- [ ] Docker Desktop 已安装
- [ ] .env.production 已配置
- [ ] docker-compose build 成功
- [ ] docker-compose up 启动正常
- [ ] localhost:3000 可访问
- [ ] 登录功能正常
- [ ] 项目CRUD功能测试通过
- [ ] 文件上传功能正常

### Ubuntu 生产环境
- [ ] Docker 和 Docker Compose 已安装
- [ ] 项目文件已上传
- [ ] .env.production 配置完成（强密码）
- [ ] 防火墙规则已配置
- [ ] docker compose build 成功
- [ ] docker compose up 启动正常
- [ ] 外网IP:3000 可访问
- [ ] MongoDB 连接正常
- [ ] 数据持久化验证
- [ ] 备份策略已设置
- [ ] 日志监控已配置

---

**祝您部署顺利！🎉**
