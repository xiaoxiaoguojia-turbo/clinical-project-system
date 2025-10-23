# 项目理解与全面规划

## 项目理解

您要开发的是一个**临床创新项目管理系统**，服务于上海临床创新转化研究院的转移转化与投资部门。这是一个典型的企业内部项目管理系统，具有以下核心特征：

### 业务逻辑理解
1. **双层项目管理结构**：总体项目统计 + 分类型项目管理
2. **用户权限分级**：管理员（完整权限）+ 普通用户（查看权限）
3. **文档附件管理**：需要处理PDF、DOC等多种格式文件
4. **统计报表功能**：数据可视化和分析需求

### 技术架构合理性
您选择的技术栈（Next.js + React + Node.js + MongoDB）非常适合此项目：
- **Next.js**：提供全栈开发能力，SSR优化用户体验
- **MongoDB**：文档型数据库，适合存储结构灵活的项目数据和附件元数据
- **两周开发周期**：对于功能范围来说时间紧张但可行

---

## 数据库设计规划

### 存储策略建议

**对于附件存储**，我建议采用**混合存储方案**：
- **小文件（<16MB）**：直接存储在MongoDB的GridFS中
- **大文件（>=16MB）**：存储在服务器文件系统，数据库存储文件路径和元数据
- **优点**：简化部署，无需额外文件存储服务，适合私有部署

### 数据库表设计评估

您的表设计基本合理，但建议优化：

#### 1. 用户表 (users)
```
- _id: ObjectId
- username: String (唯一)
- password: String (bcrypt加密)
- role: String (enum: 'admin', 'user')
- email: String (可选)
- createTime: Date
- lastLogin: Date
- status: String (active/inactive)
```

#### 2. 总体项目表 (overall_projects)
您的字段设计很完整，建议增加：
```
- _id: ObjectId
- 您列出的所有字段 +
- createTime: Date
- updateTime: Date
- createdBy: ObjectId (关联用户)
- status: String (进行中/已完成/暂停)
- attachments: Array[ObjectId] (关联附件)
```

#### 3. 院内制剂项目表 (internal_preparation_projects)
建议结构：
```
- _id: ObjectId
- 您列出的所有字段 +
- createTime: Date
- updateTime: Date
- createdBy: ObjectId
- attachments: Array[ObjectId]
- relatedOverallProject: ObjectId (可选，关联总体项目)
```

#### 4. 附件表 (attachments)
```
- _id: ObjectId
- filename: String
- originalName: String
- mimeType: String
- size: Number
- uploadTime: Date
- uploadedBy: ObjectId
- storageType: String (gridfs/filesystem)
- filePath: String (文件系统路径)
- gridfsId: ObjectId (GridFS文件ID)
- projectId: ObjectId (关联项目)
- projectType: String (overall/internal-preparation)
```

### 设计评估
您的表设计逻辑清晰，**建议优化**：
1. **增加审计字段**：创建时间、更新时间、操作人
2. **添加状态管理**：项目状态、用户状态
3. **优化关联关系**：明确项目间的关联
4. **考虑扩展性**：为未来7个项目类型预留结构

---

## 后端API设计规划

### API架构设计
采用RESTful API设计，按功能模块划分：

#### 1. 认证模块 (/api/auth)
```
POST /api/auth/login - 用户登录
POST /api/auth/logout - 用户登出
GET /api/auth/profile - 获取用户信息
PUT /api/auth/profile - 更新用户信息
```

#### 2. 用户管理模块 (/api/users) - 仅管理员
```
GET /api/users - 获取用户列表
POST /api/users - 创建用户
PUT /api/users/:id - 更新用户
DELETE /api/users/:id - 删除用户
PUT /api/users/:id/status - 更新用户状态
```

#### 3. 总体项目模块 (/api/overall-projects)
```
GET /api/overall-projects - 获取项目列表（支持分页、筛选）
POST /api/overall-projects - 创建项目
GET /api/overall-projects/:id - 获取项目详情
PUT /api/overall-projects/:id - 更新项目
DELETE /api/overall-projects/:id - 删除项目
GET /api/overall-projects/statistics - 获取统计数据
```

#### 4. 院内制剂项目模块 (/api/internal-preparation-projects)
```
GET /api/internal-preparation-projects - 获取项目列表
POST /api/internal-preparation-projects - 创建项目
GET /api/internal-preparation-projects/:id - 获取项目详情
PUT /api/internal-preparation-projects/:id - 更新项目
DELETE /api/internal-preparation-projects/:id - 删除项目
GET /api/internal-preparation-projects/statistics - 获取统计数据
```

#### 5. 附件管理模块 (/api/attachments)
```
POST /api/attachments/upload - 上传附件
GET /api/attachments/:id - 下载附件
DELETE /api/attachments/:id - 删除附件
GET /api/attachments/project/:projectId - 获取项目附件列表
```

#### 6. 统计报表模块 (/api/statistics)
```
GET /api/statistics/overview - 总体统计
GET /api/statistics/projects - 项目统计
GET /api/statistics/trends - 趋势分析
```

### 数据库连接配置
使用MongoDB连接池，配置建议：
- 使用`mongoose`作为ODM
- 连接池大小：10-20
- 超时配置：连接超时30s，查询超时15s
- 错误处理和重连机制

---

## 开发实施步骤规划

### 第一周：基础架构 + 核心功能

#### Day 1-2：项目初始化
1. **环境搭建**
   - 创建Next.js项目
   - 配置TypeScript（强烈推荐）
   - 安装核心依赖（mongoose、bcryptjs、jsonwebtoken等）
   - 配置ESLint、Prettier

2. **数据库设计**
   - 搭建MongoDB环境
   - 创建数据模型（Mongoose Schema）
   - 编写种子数据脚本

#### Day 3-4：认证系统
1. **用户认证**
   - JWT token生成和验证
   - 登录/登出API
   - 权限中间件
   - 基础的登录页面

2. **用户管理**
   - 管理员用户管理功能
   - 用户CRUD操作API

#### Day 5-7：项目管理核心
1. **总体项目管理**
   - 项目CRUD API
   - 基础的项目列表和详情页面
   - 简单的数据统计

2. **院内制剂项目**
   - 院内制剂CRUD API  
   - 基础的项目管理界面

### 第二周：完善功能 + 部署

#### Day 8-10：高级功能
1. **附件管理系统**
   - 文件上传/下载API
   - GridFS集成
   - 前端文件上传组件

2. **统计报表**
   - 数据聚合查询
   - 基础图表展示
   - 导出功能

#### Day 11-12：界面优化
1. **前端界面完善**
   - 响应式设计调整
   - 交互体验优化
   - 错误处理和加载状态

2. **系统集成测试**
   - 功能测试
   - 权限测试
   - 性能优化

#### Day 13-14：部署和交付
1. **生产环境部署**
   - Ubuntu服务器环境配置
   - MongoDB生产配置
   - Nginx反向代理
   - PM2进程管理

2. **系统上线**
   - 数据迁移
   - 用户培训文档
   - 系统监控配置

---

## 部署环境规划

### Ubuntu服务器配置建议

#### 1. 基础环境安装
```bash
# Node.js (推荐LTS版本)
# MongoDB Community Edition
# Nginx (作为反向代理)
# PM2 (Node.js进程管理)
```

#### 2. 目录结构建议
```
/opt/clinical-project-system/
├── app/                 # 应用代码
├── uploads/            # 文件上传目录
├── logs/               # 日志文件
├── backup/             # 数据库备份
└── config/             # 配置文件
```

#### 3. 安全配置
- 防火墙配置（只开放必要端口）
- MongoDB访问控制
- HTTPS证书配置
- 定期数据备份策略

---

## 技术风险与建议

### 主要风险点
1. **时间压力**：两周时间较紧，建议MVP优先
2. **文件存储**：大文件处理需要优化策略
3. **数据安全**：医疗相关数据需要特别注意安全性
4. **扩展性**：后续7个项目类型的架构预留

### 优化建议
1. **使用TypeScript**：提高代码质量和开发效率
2. **组件库选择**：推荐Ant Design（成熟、中文友好）
3. **状态管理**：考虑使用Zustand（轻量级）
4. **数据验证**：使用Joi或Yup进行数据校验

### 成功关键因素
1. **需求确认**：尽快确认具体的字段和业务流程
2. **迭代开发**：按功能模块逐步交付
3. **及时沟通**：与用户保持密切沟通，确保需求理解准确
4. **测试充分**：重点测试权限控制和数据完整性

---

这个规划为您提供了一个完整的开发路线图。建议您先搭建基础架构，然后按优先级逐步实现功能。如果您对任何部分有疑问或需要更详细的技术说明，请随时告知！