import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'

// 定义 Swagger 规范的基础类型
export interface SwaggerSpec {
  openapi?: string
  swagger?: string
  info?: any
  paths?: Record<string, any>
  components?: any
  [key: string]: any
}

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
              example: true,
            },
            data: {
              description: '响应数据',
            },
            message: {
              type: 'string',
              description: '响应消息',
              example: '操作成功',
            },
          },
          required: ['success'],
        },
        // 错误响应结构
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: '请求是否成功',
              example: false,
            },
            error: {
              type: 'string',
              description: '错误信息',
              example: '参数验证失败',
            },
          },
          required: ['success', 'error'],
        },
        // 分页响应结构
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              description: '数据列表',
              items: {},
            },
            pagination: {
              type: 'object',
              properties: {
                current: {
                  type: 'integer',
                  description: '当前页码',
                  example: 1,
                },
                pageSize: {
                  type: 'integer',
                  description: '每页大小',
                  example: 10,
                },
                total: {
                  type: 'integer',
                  description: '总记录数',
                  example: 100,
                },
                totalPages: {
                  type: 'integer',
                  description: '总页数',
                  example: 10,
                },
              },
              required: ['current', 'pageSize', 'total', 'totalPages'],
            },
          },
          required: ['data', 'pagination'],
        },
        // 用户响应模型
        UserResponse: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: '用户ID',
              example: '64f123456789abcd12345678',
            },
            username: {
              type: 'string',
              description: '用户名',
              example: 'zhangsan',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: '用户角色',
              example: 'user',
            },
            email: {
              type: 'string',
              description: '邮箱',
              example: 'zhangsan@example.com',
            },
            realName: {
              type: 'string',
              description: '真实姓名',
              example: '张三',
            },
            department: {
              type: 'string',
              description: '部门',
              example: '转移转化与投资部门',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: '用户状态',
              example: 'active',
            },
            createTime: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
              example: '2024-01-15T08:30:00.000Z',
            },
            updateTime: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
              example: '2024-01-15T08:30:00.000Z',
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: '最后登录时间',
              example: '2024-01-15T08:30:00.000Z',
            },
          },
        },
        // 总体项目模型
        OverallProject: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: '项目ID',
              example: '64f123456789abcd12345678',
            },
            department: {
              type: 'string',
              description: '部门名称',
              example: '转移转化与投资部门',
            },
            projectName: {
              type: 'string',
              description: '项目名称',
              example: '智能诊断辅助系统',
            },
            researchTeam: {
              type: 'string',
              description: '研发团队',
              example: '上海交通大学AI实验室',
            },
            technologyField: {
              type: 'string',
              description: '技术领域',
              example: '人工智能',
            },
            cooperationMode: {
              type: 'string',
              description: '合作方式',
              example: '技术开发',
            },
            projectDescription: {
              type: 'string',
              description: '项目描述',
              example: '基于深度学习的医学影像智能诊断系统',
            },
            technologyDescription: {
              type: 'string',
              description: '技术描述',
              example: '采用卷积神经网络和注意力机制进行医学影像分析',
            },
            expectedResults: {
              type: 'string',
              description: '预期成果',
              example: '提高诊断准确率至95%以上',
            },
            riskAssessment: {
              type: 'string',
              description: '风险评估',
              example: '技术风险：中等；市场风险：低',
            },
            budget: {
              type: 'string',
              description: '预算',
              example: '500万元',
            },
            timeline: {
              type: 'string',
              description: '时间节点',
              example: '24个月',
            },
            milestones: {
              type: 'string',
              description: '里程碑',
              example: '需求分析、原型开发、临床试验、产品化',
            },
            remarks: {
              type: 'string',
              description: '备注',
              example: '与上海市第一人民医院合作进行临床试验',
            },
            status: {
              type: 'string',
              enum: ['active', 'completed', 'paused'],
              description: '项目状态',
              example: 'active',
            },
            createTime: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
              example: '2024-01-15T08:30:00.000Z',
            },
            updateTime: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
              example: '2024-01-15T08:30:00.000Z',
            },
            createdBy: {
              type: 'string',
              description: '创建者ID',
              example: '64f123456789abcd12345677',
            },
          },
        },
        // 院内制剂项目模型
        InternalPreparationProject: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: '项目ID',
              example: '64f123456789abcd12345678',
            },
            department: {
              type: 'string',
              description: '部门名称',
              example: '转移转化与投资部门',
            },
            source: {
              type: 'string',
              description: '制剂来源',
              example: '中医科',
            },
            name: {
              type: 'string',
              description: '制剂名称',
              example: '清热解毒颗粒',
            },
            composition: {
              type: 'string',
              description: '组方成分',
              example: '金银花15g、连翘12g、板蓝根10g',
            },
            function: {
              type: 'string',
              description: '功能主治',
              example: '清热解毒，抗病毒感染',
            },
            specification: {
              type: 'string',
              description: '规格',
              example: '10g/袋',
            },
            duration: {
              type: 'string',
              description: '有效期',
              example: '3年',
            },
            dosage: {
              type: 'string',
              description: '用法用量',
              example: '每次1袋，每日3次，温水冲服',
            },
            recordNumber: {
              type: 'string',
              description: '备案号',
              example: 'ZZ-2024-001',
            },
            patent: {
              type: 'string',
              description: '专利信息',
              example: '已申请发明专利ZL202410001234.5',
            },
            remarks: {
              type: 'string',
              description: '备注信息',
              example: '临床试验阶段，疗效显著',
            },
            status: {
              type: 'string',
              enum: ['active', 'completed', 'paused'],
              description: '项目状态',
              example: 'active',
            },
            createTime: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
              example: '2024-01-15T08:30:00.000Z',
            },
            updateTime: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
              example: '2024-01-15T08:30:00.000Z',
            },
            createdBy: {
              type: 'string',
              description: '创建者ID',
              example: '64f123456789abcd12345677',
            },
          },
        },
        // 附件模型
        Attachment: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: '附件ID',
              example: '64f123456789abcd12345679',
            },
            filename: {
              type: 'string',
              description: '文件名',
              example: '项目申报书.pdf',
            },
            originalname: {
              type: 'string',
              description: '原始文件名',
              example: '项目申报书_最终版.pdf',
            },
            mimetype: {
              type: 'string',
              description: '文件类型',
              example: 'application/pdf',
            },
            size: {
              type: 'integer',
              description: '文件大小（字节）',
              example: 2048576,
            },
            path: {
              type: 'string',
              description: '文件路径',
              example: 'uploads/2024/01/64f123456789abcd12345679_项目申报书.pdf',
            },
            projectId: {
              type: 'string',
              description: '关联项目ID',
              example: '64f123456789abcd12345678',
            },
            projectType: {
              type: 'string',
              enum: ['overall', 'internal-preparation'],
              description: '项目类型',
              example: 'overall',
            },
            uploadedBy: {
              type: 'string',
              description: '上传者ID',
              example: '64f123456789abcd12345677',
            },
            description: {
              type: 'string',
              description: '文件描述',
              example: '项目申报书最终版本',
            },
            downloadCount: {
              type: 'integer',
              description: '下载次数',
              example: 5,
            },
            createTime: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
              example: '2024-01-15T10:30:00.000Z',
            },
            updateTime: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
              example: '2024-01-15T10:30:00.000Z',
            },
          },
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
    // 使用绝对路径，确保能正确找到API文件
    path.join(process.cwd(), 'pages', 'api', '**', '*.ts'),
    path.join(process.cwd(), 'pages', 'api', '*.ts'),
  ],
}

// 生成swagger规范并指定类型
const specs = swaggerJsdoc(options) as SwaggerSpec

// 添加调试信息（修复后的版本）
if (process.env.NODE_ENV === 'development') {
  console.log('Swagger API paths:', options.apis)
  console.log('Generated swagger spec keys:', Object.keys(specs))
  console.log('Generated paths count:', specs.paths ? Object.keys(specs.paths).length : 0)
}

export default specs
