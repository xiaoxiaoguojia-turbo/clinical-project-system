# 临床创新项目管理系统 - 详细开发规划

## 项目概述

**项目名称**：临床创新项目管理系统  
**开发单位**：上海临床创新转化研究院 - 转移转化与投资部门  
**开发周期**：14天  
**技术栈**：Next.js + React + Node.js + MongoDB  
**部署环境**：Ubuntu 24 私有服务器  

## 核心功能规划

### 1. 用户权限系统
- 管理员：完整的增删改查权限
- 普通用户：查看和统计报表权限
- 基于JWT的身份认证
- 会话管理和安全退出

### 2. 项目管理模块
- **总体项目统计分析**：数据概览、趋势分析、导出功能
- **院内制剂项目管理**：完整的CRUD操作
- **附件管理**：支持PDF、DOC、DOCX、TXT、MD等格式
- **数据可视化**：图表展示项目统计信息

### 3. 系统架构设计

#### 技术架构
```
前端层：React + Next.js + Tailwind CSS + Ant Design
业务层：Next.js API Routes + 简单权限中间件
数据层：MongoDB + Mongoose ODM
文件存储：GridFS + 文件系统混合方案
```

#### 安全架构（简化版）
- JWT Token + 刷新令牌机制
- 基础权限控制（管理员/普通用户）
- 数据传输HTTPS加密（生产环境）

## 数据库设计

### 用户表 (users)
```javascript
{
  _id: ObjectId, // 用户ID
  username: String, // 唯一用户名
  password: String, // 明文存储（开发阶段）
  role: String, // 'admin' | 'user'
  email: String, // 电子邮箱
  realName: String, // 真实姓名
  department: String, // 所属部门
  status: String, // 'active' | 'inactive'
  createTime: Date, // 创建时间
  updateTime: Date, // 更新时间
  lastLogin: Date, // 最后登录时间
  createdBy: ObjectId // 创建者ID
}
```

### 总体项目表 (overall_projects)
```javascript
{
  _id: ObjectId, // 项目ID
  department: String, // 转移转化与投资部门
  type: String, // 项目类型
  source: String, // 来源
  name: String, // 项目名称
  leader: String, // 负责人
  startDate: Date, // 开始日期
  indication: String, // 适应症/科室
  followUpWeeks: Number, // 跟进时间/周
  importance: String, // 重要程度
  stageOne: String, // 阶段一
  stageTwo: String, // 阶段二  
  stageThree: String, // 阶段三
  transformMethod: String, // 转化方式/需求
  hospitalPI: String, // 院端PI
  projectOverview: String, // 项目概况（项目结论）
  attachments: [ObjectId], // 附件ID数组
  status: String, // 'active' | 'completed' | 'paused'
  createTime: Date, // 创建时间
  updateTime: Date, // 更新时间
  createdBy: ObjectId // 创建者ID
}
```

### 院内制剂项目表 (internal_preparation_projects)
```javascript
{
  _id: ObjectId, // 项目ID
  department: String, // 转移转化与投资部门
  source: String, // 来源
  name: String, // 名称
  composition: String, // 组方
  function: String, // 功能
  specification: String, // 规格
  duration: String, // 年限
  dosage: String, // 用量
  recordNumber: String, // 备案号
  patent: String, // 专利（情况）
  remarks: String, // 备注
  attachments: [ObjectId], // 附件ID数组
  status: String, // 'active' | 'completed' | 'paused'
  createTime: Date, // 创建时间
  updateTime: Date, // 更新时间
  createdBy: ObjectId // 创建者ID
}
```

### 附件表 (attachments)
```javascript
{
  _id: ObjectId, // 附件ID
  filename: String, // 存储文件名
  originalName: String, // 原始文件名
  mimeType: String, // MIME类型
  size: Number, // 文件大小
  storageType: String, // 'gridfs' | 'filesystem'
  filePath: String, // 文件系统路径
  gridfsId: ObjectId, // GridFS文件ID
  projectId: ObjectId, // 关联项目ID
  projectType: String, // 'overall' | 'internal_preparation'
  uploadTime: Date, // 上传时间
  uploadedBy: ObjectId // 上传者ID
}
```

## API接口设计

### 认证模块 (/api/auth)
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出  
- `GET /api/auth/profile` - 获取用户信息
- `POST /api/auth/refresh` - 刷新令牌

### 用户管理 (/api/users)
- `GET /api/users` - 获取用户列表（分页）
- `POST /api/users` - 创建用户（管理员）
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户
- `PUT /api/users/:id/password` - 修改密码

### 总体项目管理 (/api/overall-projects)
- `GET /api/overall-projects` - 获取项目列表（支持筛选、排序、分页）
- `POST /api/overall-projects` - 创建项目
- `GET /api/overall-projects/:id` - 获取项目详情
- `PUT /api/overall-projects/:id` - 更新项目
- `DELETE /api/overall-projects/:id` - 删除项目

### 院内制剂项目 (/api/internal-preparation-projects)
- `GET /api/internal-preparation-projects` - 获取项目列表
- `POST /api/internal-preparation-projects` - 创建项目
- `GET /api/internal-preparation-projects/:id` - 获取项目详情
- `PUT /api/internal-preparation-projects/:id` - 更新项目
- `DELETE /api/internal-preparation-projects/:id` - 删除项目

### 附件管理 (/api/attachments)
- `POST /api/attachments/upload` - 上传附件
- `GET /api/attachments/:id/download` - 下载附件
- `DELETE /api/attachments/:id` - 删除附件
- `GET /api/projects/:projectId/attachments` - 获取项目附件列表

### 统计报表 (/api/statistics)
- `GET /api/statistics/overview` - 总体统计数据
- `GET /api/statistics/overall-projects` - 总体项目统计
- `GET /api/statistics/internal-preparation` - 院内制剂统计
- `POST /api/statistics/export` - 导出统计报表

## 开发时间规划

### 第一周：基础架构与核心功能

#### Day 1-2：项目搭建与基础配置
**目标**：完成开发环境和基础架构
- [ ] 创建Next.js项目，配置TypeScript
- [ ] 安装核心依赖包（mongoose, jsonwebtoken等）
- [ ] 配置ESLint、Prettier代码规范
- [ ] 搭建MongoDB数据库环境
- [ ] 创建Mongoose数据模型
- [ ] 配置环境变量和数据库连接

#### Day 3-4：用户认证系统
**目标**：完成用户登录和基础权限控制
- [ ] 实现简单JWT认证机制
- [ ] 创建登录/登出API
- [ ] 开发基础权限中间件
- [ ] 设计登录页面UI
- [ ] 实现用户状态管理
- [ ] 用户管理CRUD接口（管理员功能）

#### Day 5-7：项目管理核心功能
**目标**：完成两大项目类型的基础管理
- [ ] 总体项目CRUD API开发
- [ ] 院内制剂项目CRUD API开发
- [ ] 项目列表页面开发
- [ ] 项目详情页面开发
- [ ] 基础的数据筛选和分页功能
- [ ] 简单统计数据查询接口

### 第二周：高级功能与系统完善

#### Day 8-10：附件管理与统计功能
**目标**：完成基础文件处理和数据分析功能
- [ ] 文件上传下载API开发
- [ ] GridFS文件存储集成
- [ ] 基础文件类型验证
- [ ] 前端文件上传组件
- [ ] 统计报表数据聚合
- [ ] 基础图表组件集成
- [ ] 简单数据导出功能

#### Day 11-12：界面优化与系统集成
**目标**：完善用户体验和系统稳定性
- [ ] 响应式设计调整
- [ ] 交互动效优化
- [ ] 错误处理和加载状态
- [ ] 表单验证增强
- [ ] 系统功能集成测试
- [ ] 性能优化和代码重构

#### Day 13-14：部署与上线
**目标**：完成生产环境部署
- [ ] Ubuntu服务器环境配置
- [ ] MongoDB生产环境优化
- [ ] Nginx反向代理配置
- [ ] PM2进程管理配置
- [ ] HTTPS证书配置
- [ ] 数据备份策略
- [ ] 系统监控和日志
- [ ] 用户培训和文档

## 前端UI规划

### 设计原则
- **现代化风格**：采用简洁的Material Design理念
- **中文本土化**：符合国内用户使用习惯
- **响应式设计**：支持桌面和平板设备

### 布局结构
```
┌─────────────────────────────────────────────────┐
│                 顶部导航栏                        │
│   Logo + 系统标题 + 用户信息 + 退出               │
├─────────┬───────────────────────────────────────┤
│         │                                       │
│  左侧   │            主内容区                    │
│  导航   │                                       │
│  菜单   │         (可滚动区域)                   │
│         │                                       │
│ (固定)  │                                       │
└─────────┴───────────────────────────────────────┘
```

### 组件库选择
- **UI框架**：Ant Design（成熟稳定，中文友好）
- **图标**：Ant Design Icons + Heroicons
- **图表**：ECharts（功能强大，中文文档完善）
- **样式**：Tailwind CSS + CSS Modules

## 部署方案

### 服务器环境要求
```bash
# 基础软件
- Ubuntu 24.04 LTS
- Node.js 18+ (LTS)
- MongoDB 7.0+
- Nginx 1.22+
- PM2 (进程管理)
```

### 目录结构
```
/opt/clinical-project-system/
├── app/                    # 应用代码
│   ├── .next/             # Next.js构建产物
│   ├── pages/             # 页面文件
│   ├── api/               # API路由
│   └── components/        # 组件
├── uploads/               # 文件上传目录
├── logs/                  # 应用日志
├── backup/                # 数据库备份
├── config/                # 配置文件
│   ├── nginx.conf         # Nginx配置
│   ├── ecosystem.config.js # PM2配置
│   └── mongodb.conf       # MongoDB配置
└── scripts/               # 部署脚本
    ├── deploy.sh          # 部署脚本
    ├── backup.sh          # 备份脚本
    └── monitor.sh         # 监控脚本
```

## 质量保证（简化版）

### 代码质量
- **TypeScript**：类型安全，减少运行时错误
- **ESLint + Prettier**：代码规范和格式化
- **基础测试**：核心API接口测试

### 性能优化
- **数据库索引**：基本查询索引
- **代码分割**：按路由懒加载

### 安全措施（基础版）
- **输入验证**：基本用户输入校验
- **参数化查询**：使用Mongoose避免注入
- **文件上传限制**：基本文件类型和大小限制

## 风险控制

### 主要风险点
1. **时间风险**：14天周期紧张，需严格控制需求变更
2. **技术风险**：文件存储和大数据量查询性能
3. **安全风险**：医疗数据敏感性高，安全要求严格
4. **部署风险**：生产环境一次性部署，需充分测试

### 应对策略
1. **MVP策略**：核心功能优先，次要功能后期迭代
2. **并行开发**：前后端同时进行，接口定义先行
3. **增量交付**：每日构建，及时发现问题
4. **充分测试**：功能测试、安全测试、性能测试并重

## 后续扩展规划

### 短期扩展（1-3个月）
- 完善其余7个项目类型的管理功能
- 增加高级统计分析和数据可视化
- 移动端适配和小程序版本
- 消息通知和工作流审批功能

### 中期扩展（3-12个月）
- 与其他医院系统集成对接
- 大数据分析和AI辅助决策
- 多租户架构支持
- 微服务架构重构

### 长期规划（1-3年）
- 云原生架构升级
- 国际化多语言支持
- 开放API生态建设
- 行业标准化输出

---

**文档版本**：v1.0  
**最后更新**：2025-09-11  
**负责人**：开发团队（xiaoxiaoguojia）
**审核状态**：审核通过
