import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '临床创新项目管理系统 API',
      version: '1.0.0',
      description: `
        上海临床创新转化研究院项目管理系统的API文档
        
        ## 功能特性
        - 用户认证与权限管理
        - 总体项目管理 
        - 院内制剂项目管理
        - 附件文件管理
        - 基于JWT的身份验证
        
        ## 认证说明
        大部分API需要在请求头中包含Bearer Token：
        \`Authorization: Bearer <your_jwt_token>\`
        
        管理员权限的API需要admin角色的用户才能访问。
      `,
      contact: {
        name: '技术支持',
        email: 'support@clinical-innovation.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000',
        description: '开发服务器',
      },
      {
        url: 'https://your-production-domain.com',
        description: '生产服务器',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT令牌认证',
        },
      },
      schemas: {
        // 通用响应结构
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: '请求是否成功',
            },
            data: {
              type: 'object',
              description: '响应数据',
            },
            message: {
              type: 'string',
              description: '响应消息',
            },
            error: {
              type: 'string',
              description: '错误信息（仅在失败时返回）',
            },
          },
          required: ['success'],
        },
        
        // 分页响应结构
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: '数据列表',
            },
            pagination: {
              type: 'object',
              properties: {
                current: {
                  type: 'integer',
                  description: '当前页码',
                },
                pageSize: {
                  type: 'integer',
                  description: '每页大小',
                },
                total: {
                  type: 'integer',
                  description: '总记录数',
                },
                totalPages: {
                  type: 'integer',
                  description: '总页数',
                },
              },
            },
          },
        },
        
        // 用户响应数据
        UserResponse: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: '用户ID',
            },
            username: {
              type: 'string',
              description: '用户名',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: '用户角色',
            },
            email: {
              type: 'string',
              format: 'email',
              description: '邮箱地址',
            },
            realName: {
              type: 'string',
              description: '真实姓名',
            },
            department: {
              type: 'string',
              description: '部门',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: '用户状态',
            },
            createTime: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
            updateTime: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: '最后登录时间',
            },
            createdBy: {
              type: 'string',
              description: '创建者ID',
            },
          },
          required: ['_id', 'username', 'role', 'status', 'createTime', 'updateTime'],
        },
        
        // 总体项目数据
        OverallProject: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: '项目ID',
            },
            department: {
              type: 'string',
              description: '部门',
            },
            type: {
              type: 'string',
              description: '项目类型',
            },
            source: {
              type: 'string',
              description: '项目来源',
            },
            name: {
              type: 'string',
              description: '项目名称',
            },
            leader: {
              type: 'string',
              description: '项目负责人',
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: '开始日期',
            },
            indication: {
              type: 'string',
              description: '适应症',
            },
            followUpWeeks: {
              type: 'integer',
              description: '随访周数',
            },
            importance: {
              type: 'string',
              enum: ['high', 'medium', 'low'],
              description: '重要性',
            },
            status: {
              type: 'string',
              enum: ['active', 'completed', 'paused'],
              description: '项目状态',
            },
            createTime: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
            updateTime: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
            },
            createdBy: {
              type: 'string',
              description: '创建者ID',
            },
          },
          required: ['_id', 'name', 'status', 'createTime', 'updateTime', 'createdBy'],
        },
        
        // 院内制剂项目数据
        InternalPreparationProject: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: '项目ID',
            },
            department: {
              type: 'string',
              description: '部门',
            },
            source: {
              type: 'string',
              description: '来源',
            },
            name: {
              type: 'string',
              description: '制剂名称',
            },
            composition: {
              type: 'string',
              description: '组方',
            },
            function: {
              type: 'string',
              description: '功能',
            },
            specification: {
              type: 'string',
              description: '规格',
            },
            duration: {
              type: 'string',
              description: '年限',
            },
            dosage: {
              type: 'string',
              description: '用量',
            },
            recordNumber: {
              type: 'string',
              description: '备案号',
            },
            patent: {
              type: 'string',
              description: '专利',
            },
            status: {
              type: 'string',
              enum: ['active', 'completed', 'paused'],
              description: '项目状态',
            },
            createTime: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
            updateTime: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
            },
            createdBy: {
              type: 'string',
              description: '创建者ID',
            },
          },
          required: ['_id', 'name', 'recordNumber', 'status', 'createTime', 'updateTime', 'createdBy'],
        },
        
        // 附件数据
        Attachment: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: '附件ID',
            },
            filename: {
              type: 'string',
              description: '文件名',
            },
            originalName: {
              type: 'string',
              description: '原始文件名',
            },
            mimeType: {
              type: 'string',
              description: 'MIME类型',
            },
            size: {
              type: 'integer',
              description: '文件大小（字节）',
            },
            storageType: {
              type: 'string',
              enum: ['filesystem', 'gridfs'],
              description: '存储类型',
            },
            projectType: {
              type: 'string',
              enum: ['overall', 'internal-preparation'],
              description: '关联项目类型',
            },
            projectId: {
              type: 'string',
              description: '关联项目ID',
            },
            description: {
              type: 'string',
              description: '文件描述',
            },
            uploadTime: {
              type: 'string',
              format: 'date-time',
              description: '上传时间',
            },
            uploadedBy: {
              type: 'string',
              description: '上传者ID',
            },
          },
          required: ['_id', 'filename', 'originalName', 'mimeType', 'size', 'projectType', 'projectId', 'uploadTime', 'uploadedBy'],
        },
        
        // 错误响应
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: '错误信息',
            },
          },
          required: ['success', 'error'],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './pages/api/**/*.ts', // 扫描所有API文件以查找JSDoc注释
  ],
}

const specs = swaggerJsdoc(options)

export default specs
