{
  "openapi": "3.0.0",
  "info": {
    "title": "临床创新项目管理系统 API",
    "version": "1.0.0",
    "description": "\n        上海临床创新转化研究院项目管理系统的API文档\n        \n        ## 功能特性\n        - 用户认证与权限管理\n        - 总体项目管理 \n        - 院内制剂项目管理\n        - 附件文件管理\n        - 基于JWT的身份验证\n        \n        ## 认证说明\n        大部分API需要在请求头中包含Bearer Token：\n        `Authorization: Bearer \u003Cyour_jwt_token\u003E`\n        \n        管理员权限的API需要admin角色的用户才能访问。\n      ",
    "contact": {
      "name": "技术支持",
      "email": "support@clinical-innovation.com"
    },
    "license": {
      "name": "MIT",
      "url": "https://opensource.org/licenses/MIT"
    }
  },
  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "开发服务器"
    },
    {
      "url": "https://your-production-domain.com",
      "description": "生产服务器"
    }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "JWT令牌认证"
      }
    },
    "schemas": {
      "ApiResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "description": "请求是否成功",
            "example": true
          },
          "data": {
            "description": "响应数据"
          },
          "message": {
            "type": "string",
            "description": "响应消息",
            "example": "操作成功"
          }
        },
        "required": [
          "success"
        ]
      },
      "ErrorResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "description": "请求是否成功",
            "example": false
          },
          "error": {
            "type": "string",
            "description": "错误信息",
            "example": "参数验证失败"
          }
        },
        "required": [
          "success",
          "error"
        ]
      },
      "PaginatedResponse": {
        "type": "object",
        "properties": {
          "data": {
            "type": "array",
            "description": "数据列表",
            "items": {

            }
          },
          "pagination": {
            "type": "object",
            "properties": {
              "current": {
                "type": "integer",
                "description": "当前页码",
                "example": 1
              },
              "pageSize": {
                "type": "integer",
                "description": "每页大小",
                "example": 10
              },
              "total": {
                "type": "integer",
                "description": "总记录数",
                "example": 100
              },
              "totalPages": {
                "type": "integer",
                "description": "总页数",
                "example": 10
              }
            },
            "required": [
              "current",
              "pageSize",
              "total",
              "totalPages"
            ]
          }
        },
        "required": [
          "data",
          "pagination"
        ]
      },
      "UserResponse": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string",
            "description": "用户ID",
            "example": "64f123456789abcd12345678"
          },
          "username": {
            "type": "string",
            "description": "用户名",
            "example": "zhangsan"
          },
          "role": {
            "type": "string",
            "enum": [
              "admin",
              "user"
            ],
            "description": "用户角色",
            "example": "user"
          },
          "email": {
            "type": "string",
            "description": "邮箱",
            "example": "zhangsan@example.com"
          },
          "realName": {
            "type": "string",
            "description": "真实姓名",
            "example": "张三"
          },
          "department": {
            "type": "string",
            "description": "部门",
            "example": "转移转化与投资部门"
          },
          "status": {
            "type": "string",
            "enum": [
              "active",
              "inactive"
            ],
            "description": "用户状态",
            "example": "active"
          },
          "createTime": {
            "type": "string",
            "format": "date-time",
            "description": "创建时间",
            "example": "2024-01-15T08:30:00.000Z"
          },
          "updateTime": {
            "type": "string",
            "format": "date-time",
            "description": "更新时间",
            "example": "2024-01-15T08:30:00.000Z"
          },
          "lastLogin": {
            "type": "string",
            "format": "date-time",
            "description": "最后登录时间",
            "example": "2024-01-15T08:30:00.000Z"
          }
        }
      },
      "OverallProject": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string",
            "description": "项目ID",
            "example": "64f123456789abcd12345678"
          },
          "department": {
            "type": "string",
            "description": "部门名称",
            "example": "转移转化与投资部门"
          },
          "projectName": {
            "type": "string",
            "description": "项目名称",
            "example": "智能诊断辅助系统"
          },
          "researchTeam": {
            "type": "string",
            "description": "研发团队",
            "example": "上海交通大学AI实验室"
          },
          "technologyField": {
            "type": "string",
            "description": "技术领域",
            "example": "人工智能"
          },
          "cooperationMode": {
            "type": "string",
            "description": "合作方式",
            "example": "技术开发"
          },
          "projectDescription": {
            "type": "string",
            "description": "项目描述",
            "example": "基于深度学习的医学影像智能诊断系统"
          },
          "technologyDescription": {
            "type": "string",
            "description": "技术描述",
            "example": "采用卷积神经网络和注意力机制进行医学影像分析"
          },
          "expectedResults": {
            "type": "string",
            "description": "预期成果",
            "example": "提高诊断准确率至95%以上"
          },
          "riskAssessment": {
            "type": "string",
            "description": "风险评估",
            "example": "技术风险：中等；市场风险：低"
          },
          "budget": {
            "type": "string",
            "description": "预算",
            "example": "500万元"
          },
          "timeline": {
            "type": "string",
            "description": "时间节点",
            "example": "24个月"
          },
          "milestones": {
            "type": "string",
            "description": "里程碑",
            "example": "需求分析、原型开发、临床试验、产品化"
          },
          "remarks": {
            "type": "string",
            "description": "备注",
            "example": "与上海市第一人民医院合作进行临床试验"
          },
          "status": {
            "type": "string",
            "enum": [
              "active",
              "completed",
              "paused"
            ],
            "description": "项目状态",
            "example": "active"
          },
          "createTime": {
            "type": "string",
            "format": "date-time",
            "description": "创建时间",
            "example": "2024-01-15T08:30:00.000Z"
          },
          "updateTime": {
            "type": "string",
            "format": "date-time",
            "description": "更新时间",
            "example": "2024-01-15T08:30:00.000Z"
          },
          "createdBy": {
            "type": "string",
            "description": "创建者ID",
            "example": "64f123456789abcd12345677"
          }
        }
      },
      "InternalPreparationProject": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string",
            "description": "项目ID",
            "example": "64f123456789abcd12345678"
          },
          "department": {
            "type": "string",
            "description": "部门名称",
            "example": "转移转化与投资部门"
          },
          "source": {
            "type": "string",
            "description": "制剂来源",
            "example": "中医科"
          },
          "name": {
            "type": "string",
            "description": "制剂名称",
            "example": "清热解毒颗粒"
          },
          "composition": {
            "type": "string",
            "description": "组方成分",
            "example": "金银花15g、连翘12g、板蓝根10g"
          },
          "function": {
            "type": "string",
            "description": "功能主治",
            "example": "清热解毒，抗病毒感染"
          },
          "specification": {
            "type": "string",
            "description": "规格",
            "example": "10g/袋"
          },
          "duration": {
            "type": "string",
            "description": "有效期",
            "example": "3年"
          },
          "dosage": {
            "type": "string",
            "description": "用法用量",
            "example": "每次1袋，每日3次，温水冲服"
          },
          "recordNumber": {
            "type": "string",
            "description": "备案号",
            "example": "ZZ-2024-001"
          },
          "patent": {
            "type": "string",
            "description": "专利信息",
            "example": "已申请发明专利ZL202410001234.5"
          },
          "remarks": {
            "type": "string",
            "description": "备注信息",
            "example": "临床试验阶段，疗效显著"
          },
          "status": {
            "type": "string",
            "enum": [
              "active",
              "completed",
              "paused"
            ],
            "description": "项目状态",
            "example": "active"
          },
          "createTime": {
            "type": "string",
            "format": "date-time",
            "description": "创建时间",
            "example": "2024-01-15T08:30:00.000Z"
          },
          "updateTime": {
            "type": "string",
            "format": "date-time",
            "description": "更新时间",
            "example": "2024-01-15T08:30:00.000Z"
          },
          "createdBy": {
            "type": "string",
            "description": "创建者ID",
            "example": "64f123456789abcd12345677"
          }
        }
      },
      "Attachment": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string",
            "description": "附件ID",
            "example": "64f123456789abcd12345679"
          },
          "filename": {
            "type": "string",
            "description": "文件名",
            "example": "项目申报书.pdf"
          },
          "originalname": {
            "type": "string",
            "description": "原始文件名",
            "example": "项目申报书_最终版.pdf"
          },
          "mimetype": {
            "type": "string",
            "description": "文件类型",
            "example": "application/pdf"
          },
          "size": {
            "type": "integer",
            "description": "文件大小（字节）",
            "example": 2048576
          },
          "path": {
            "type": "string",
            "description": "文件路径",
            "example": "uploads/2024/01/64f123456789abcd12345679_项目申报书.pdf"
          },
          "projectId": {
            "type": "string",
            "description": "关联项目ID",
            "example": "64f123456789abcd12345678"
          },
          "projectType": {
            "type": "string",
            "enum": [
              "overall",
              "internal-preparation"
            ],
            "description": "项目类型",
            "example": "overall"
          },
          "uploadedBy": {
            "type": "string",
            "description": "上传者ID",
            "example": "64f123456789abcd12345677"
          },
          "description": {
            "type": "string",
            "description": "文件描述",
            "example": "项目申报书最终版本"
          },
          "downloadCount": {
            "type": "integer",
            "description": "下载次数",
            "example": 5
          },
          "createTime": {
            "type": "string",
            "format": "date-time",
            "description": "创建时间",
            "example": "2024-01-15T10:30:00.000Z"
          },
          "updateTime": {
            "type": "string",
            "format": "date-time",
            "description": "更新时间",
            "example": "2024-01-15T10:30:00.000Z"
          }
        }
      }
    }
  },
  "security": [
    {
      "bearerAuth": []
    }
  ],
  "paths": {
    "/api/attachments/{id}/download": {
      "get": {
        "tags": [
          "附件管理"
        ],
        "summary": "下载附件文件",
        "description": "下载指定ID的附件文件，支持流式下载，自动更新下载计数。\n\n**功能特性：**\n- 权限验证：确保用户有访问权限\n- 流式下载：支持大文件下载\n- 下载统计：自动记录下载次数\n- 安全检查：防止路径遍历攻击\n\n**权限要求：**\n- 管理员：可下载任何附件\n- 普通用户：可下载自己上传的附件或有权限访问的项目附件\n",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string",
              "pattern": "^[0-9a-fA-F]{24}$"
            },
            "description": "附件ID（MongoDB ObjectId）",
            "example": "64f123456789abcd12345679"
          }
        ],
        "responses": {
          "200": {
            "description": "文件下载成功",
            "headers": {
              "Content-Disposition": {
                "description": "文件下载disposition header",
                "schema": {
                  "type": "string",
                  "example": "attachment; filename=\"项目申报书.pdf\""
                }
              },
              "Content-Type": {
                "description": "文件MIME类型",
                "schema": {
                  "type": "string",
                  "example": "application/pdf"
                }
              },
              "Content-Length": {
                "description": "文件大小（字节）",
                "schema": {
                  "type": "integer",
                  "example": 2048576
                }
              }
            },
            "content": {
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary",
                  "description": "文件二进制内容"
                }
              },
              "application/pdf": {
                "schema": {
                  "type": "string",
                  "format": "binary",
                  "description": "PDF文件内容"
                }
              },
              "image/*": {
                "schema": {
                  "type": "string",
                  "format": "binary",
                  "description": "图片文件内容"
                }
              },
              "text/plain": {
                "schema": {
                  "type": "string",
                  "description": "文本文件内容"
                }
              }
            }
          },
          "400": {
            "description": "请求错误",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "invalid_id": {
                    "summary": "无效的附件ID",
                    "value": {
                      "success": false,
                      "error": "无效的附件ID格式"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "未授权访问",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "权限不足",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "permission_denied": {
                    "summary": "权限不足",
                    "value": {
                      "success": false,
                      "error": "权限不足：无法访问此附件"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "附件不存在或文件不存在",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "attachment_not_found": {
                    "summary": "附件记录不存在",
                    "value": {
                      "success": false,
                      "error": "附件不存在"
                    }
                  },
                  "file_not_found": {
                    "summary": "物理文件不存在",
                    "value": {
                      "success": false,
                      "error": "文件不存在"
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "服务器内部错误",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "server_error": {
                    "summary": "服务器错误",
                    "value": {
                      "success": false,
                      "error": "服务器内部错误"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/attachments": {
      "get": {
        "tags": [
          "附件管理"
        ],
        "summary": "获取附件列表",
        "description": "分页获取附件列表，支持多种筛选条件。\n\n**筛选功能：**\n- 按项目ID筛选\n- 按项目类型筛选\n- 按文件名搜索\n- 按上传者筛选\n- 按文件类型筛选\n",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "query",
            "name": "page",
            "schema": {
              "type": "integer",
              "default": 1,
              "minimum": 1
            },
            "description": "页码",
            "example": 1
          },
          {
            "in": "query",
            "name": "pageSize",
            "schema": {
              "type": "integer",
              "default": 10,
              "minimum": 1,
              "maximum": 100
            },
            "description": "每页大小",
            "example": 10
          },
          {
            "in": "query",
            "name": "projectId",
            "schema": {
              "type": "string",
              "pattern": "^[0-9a-fA-F]{24}$"
            },
            "description": "项目ID筛选",
            "example": "64f123456789abcd12345678"
          },
          {
            "in": "query",
            "name": "projectType",
            "schema": {
              "type": "string",
              "enum": [
                "overall",
                "internal-preparation"
              ]
            },
            "description": "项目类型筛选",
            "example": "overall"
          },
          {
            "in": "query",
            "name": "search",
            "schema": {
              "type": "string"
            },
            "description": "文件名搜索关键词",
            "example": "申报书"
          },
          {
            "in": "query",
            "name": "uploadedBy",
            "schema": {
              "type": "string",
              "pattern": "^[0-9a-fA-F]{24}$"
            },
            "description": "上传者ID筛选",
            "example": "64f123456789abcd12345677"
          },
          {
            "in": "query",
            "name": "mimetype",
            "schema": {
              "type": "string"
            },
            "description": "文件类型筛选（MIME类型）",
            "example": "application/pdf"
          }
        ],
        "responses": {
          "200": {
            "description": "获取附件列表成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "allOf": [
                            {
                              "$ref": "#/components/schemas/PaginatedResponse"
                            },
                            {
                              "type": "object",
                              "properties": {
                                "data": {
                                  "type": "array",
                                  "items": {
                                    "$ref": "#/components/schemas/Attachment"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                },
                "examples": {
                  "success": {
                    "summary": "成功响应示例",
                    "value": {
                      "success": true,
                      "data": {
                        "data": [
                          {
                            "_id": "64f123456789abcd12345679",
                            "filename": "项目申报书.pdf",
                            "originalname": "项目申报书_最终版.pdf",
                            "mimetype": "application/pdf",
                            "size": 2048576,
                            "path": "uploads/2024/01/64f123456789abcd12345679_项目申报书.pdf",
                            "projectId": "64f123456789abcd12345678",
                            "projectType": "overall",
                            "uploadedBy": "64f123456789abcd12345677",
                            "description": "项目申报书最终版本",
                            "downloadCount": 5,
                            "createTime": "2024-01-15T10:30:00.000Z",
                            "updateTime": "2024-01-15T10:30:00.000Z"
                          },
                          {
                            "_id": "64f123456789abcd1234567a",
                            "filename": "预算表.xlsx",
                            "originalname": "项目预算明细表.xlsx",
                            "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "size": 1024000,
                            "path": "uploads/2024/01/64f123456789abcd1234567a_预算表.xlsx",
                            "projectId": "64f123456789abcd12345678",
                            "projectType": "overall",
                            "uploadedBy": "64f123456789abcd12345677",
                            "description": "项目预算明细",
                            "downloadCount": 2,
                            "createTime": "2024-01-16T09:15:00.000Z",
                            "updateTime": "2024-01-16T09:15:00.000Z"
                          }
                        ],
                        "pagination": {
                          "current": 1,
                          "pageSize": 10,
                          "total": 15,
                          "totalPages": 2
                        }
                      },
                      "message": "获取附件列表成功"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "未授权访问",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "服务器内部错误",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "附件管理"
        ],
        "summary": "批量删除附件",
        "description": "批量删除指定的附件文件，同时删除数据库记录和文件系统中的文件。\n\n**权限要求：**\n- 管理员：可删除任何附件\n- 普通用户：只能删除自己上传的附件\n",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "ids"
                ],
                "properties": {
                  "ids": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "pattern": "^[0-9a-fA-F]{24}$"
                    },
                    "minItems": 1,
                    "maxItems": 50,
                    "description": "要删除的附件ID数组（最多50个）",
                    "example": [
                      "64f123456789abcd12345679",
                      "64f123456789abcd1234567a"
                    ]
                  }
                }
              },
              "examples": {
                "batch_delete": {
                  "summary": "批量删除示例",
                  "value": {
                    "ids": [
                      "64f123456789abcd12345679",
                      "64f123456789abcd1234567a",
                      "64f123456789abcd1234567b"
                    ]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "批量删除成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "type": "object",
                          "properties": {
                            "deletedCount": {
                              "type": "integer",
                              "description": "成功删除的附件数量",
                              "example": 2
                            },
                            "failedCount": {
                              "type": "integer",
                              "description": "删除失败的附件数量",
                              "example": 0
                            },
                            "failedItems": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "id": {
                                    "type": "string",
                                    "description": "失败的附件ID"
                                  },
                                  "error": {
                                    "type": "string",
                                    "description": "失败原因"
                                  }
                                }
                              },
                              "description": "删除失败的条目详情",
                              "example": []
                            }
                          }
                        }
                      }
                    }
                  ]
                },
                "examples": {
                  "success": {
                    "summary": "批量删除成功响应",
                    "value": {
                      "success": true,
                      "data": {
                        "deletedCount": 3,
                        "failedCount": 0,
                        "failedItems": []
                      },
                      "message": "批量删除附件成功"
                    }
                  },
                  "partial_success": {
                    "summary": "部分成功响应",
                    "value": {
                      "success": true,
                      "data": {
                        "deletedCount": 2,
                        "failedCount": 1,
                        "failedItems": [
                          {
                            "id": "64f123456789abcd1234567b",
                            "error": "权限不足：只能删除自己上传的附件"
                          }
                        ]
                      },
                      "message": "批量删除附件完成（部分失败）"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "请求参数错误",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "empty_ids": {
                    "summary": "ID数组为空",
                    "value": {
                      "success": false,
                      "error": "请提供要删除的附件ID数组"
                    }
                  },
                  "too_many_ids": {
                    "summary": "ID数量超限",
                    "value": {
                      "success": false,
                      "error": "一次最多删除50个附件"
                    }
                  },
                  "invalid_ids": {
                    "summary": "无效的ID格式",
                    "value": {
                      "success": false,
                      "error": "附件ID格式无效"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "未授权访问"
          },
          "500": {
            "description": "服务器内部错误"
          }
        }
      }
    },
    "/api/attachments/upload": {
      "post": {
        "tags": [
          "附件管理"
        ],
        "summary": "上传附件文件",
        "description": "上传附件文件到服务器，支持多种文件类型。\n\n**支持的文件类型：**\n- 文档：pdf, doc, docx, xls, xlsx, ppt, pptx, txt\n- 图片：jpg, jpeg, png, gif, bmp, webp\n- 其他：zip, rar, 7z\n\n**文件大小限制：** 10MB\n\n**使用步骤：**\n1. 选择要上传的文件\n2. 设置关联的项目ID和项目类型\n3. 调用此接口上传\n",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "required": [
                  "file",
                  "projectId",
                  "projectType"
                ],
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary",
                    "description": "要上传的文件"
                  },
                  "projectId": {
                    "type": "string",
                    "pattern": "^[0-9a-fA-F]{24}$",
                    "description": "关联项目ID（MongoDB ObjectId）",
                    "example": "64f123456789abcd12345678"
                  },
                  "projectType": {
                    "type": "string",
                    "enum": [
                      "overall",
                      "internal-preparation"
                    ],
                    "description": "项目类型",
                    "example": "overall"
                  },
                  "description": {
                    "type": "string",
                    "maxLength": 200,
                    "description": "文件描述（可选）",
                    "example": "项目申报书最终版本"
                  }
                }
              },
              "encoding": {
                "file": {
                  "contentType": "application/*"
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "文件上传成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "$ref": "#/components/schemas/Attachment"
                        }
                      }
                    }
                  ]
                },
                "examples": {
                  "success": {
                    "summary": "上传成功响应",
                    "value": {
                      "success": true,
                      "data": {
                        "_id": "64f123456789abcd12345679",
                        "filename": "项目申报书.pdf",
                        "originalname": "项目申报书_最终版.pdf",
                        "mimetype": "application/pdf",
                        "size": 2048576,
                        "path": "uploads/2024/01/64f123456789abcd12345679_项目申报书.pdf",
                        "projectId": "64f123456789abcd12345678",
                        "projectType": "overall",
                        "uploadedBy": "64f123456789abcd12345677",
                        "description": "项目申报书最终版本",
                        "downloadCount": 0,
                        "createTime": "2024-01-15T10:30:00.000Z",
                        "updateTime": "2024-01-15T10:30:00.000Z"
                      },
                      "message": "文件上传成功"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "请求错误",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "no_file": {
                    "summary": "未选择文件",
                    "value": {
                      "success": false,
                      "error": "请选择要上传的文件"
                    }
                  },
                  "invalid_type": {
                    "summary": "文件类型不支持",
                    "value": {
                      "success": false,
                      "error": "不支持的文件类型"
                    }
                  },
                  "file_too_large": {
                    "summary": "文件过大",
                    "value": {
                      "success": false,
                      "error": "文件大小超过限制（10MB）"
                    }
                  },
                  "missing_params": {
                    "summary": "缺少必需参数",
                    "value": {
                      "success": false,
                      "error": "缺少必需参数：projectId 和 projectType"
                    }
                  },
                  "invalid_project": {
                    "summary": "项目不存在",
                    "value": {
                      "success": false,
                      "error": "关联的项目不存在"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "未授权访问",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "413": {
            "description": "文件过大",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "payload_too_large": {
                    "summary": "请求体过大",
                    "value": {
                      "success": false,
                      "error": "文件大小超过限制"
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "服务器内部错误",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/login": {
      "post": {
        "tags": [
          "用户认证"
        ],
        "summary": "用户登录",
        "description": "用户使用用户名和密码进行登录，成功后返回JWT访问令牌和刷新令牌",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "username",
                  "password"
                ],
                "properties": {
                  "username": {
                    "type": "string",
                    "description": "用户名",
                    "example": "admin"
                  },
                  "password": {
                    "type": "string",
                    "description": "密码",
                    "example": "123456"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "登录成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "type": "object",
                          "properties": {
                            "user": {
                              "$ref": "#/components/schemas/UserResponse"
                            },
                            "accessToken": {
                              "type": "string",
                              "description": "JWT访问令牌"
                            },
                            "refreshToken": {
                              "type": "string",
                              "description": "JWT刷新令牌"
                            }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "description": "请求参数错误或登录失败",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "服务器内部错误",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/internal-preparation-projects/{id}": {
      "get": {
        "tags": [
          "院内制剂项目管理"
        ],
        "summary": "获取院内制剂项目详情",
        "description": "根据项目ID获取院内制剂项目的详细信息",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string",
              "pattern": "^[0-9a-fA-F]{24}$"
            },
            "description": "院内制剂项目ID（MongoDB ObjectId）",
            "example": "64f123456789abcd12345678"
          }
        ],
        "responses": {
          "200": {
            "description": "获取制剂项目详情成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "$ref": "#/components/schemas/InternalPreparationProject"
                        }
                      }
                    }
                  ]
                },
                "examples": {
                  "success": {
                    "summary": "成功获取项目详情",
                    "value": {
                      "success": true,
                      "data": {
                        "_id": "64f123456789abcd12345678",
                        "department": "转移转化与投资部门",
                        "source": "中医科",
                        "name": "清热解毒颗粒",
                        "composition": "金银花15g、连翘12g、板蓝根10g、甘草6g",
                        "function": "清热解毒，抗病毒感染，增强免疫力",
                        "specification": "10g/袋，每盒30袋",
                        "duration": "3年",
                        "dosage": "每次1袋，每日3次，温水冲服",
                        "recordNumber": "ZZ-2024-001",
                        "patent": "已申请发明专利ZL202410001234.5",
                        "remarks": "临床试验阶段，疗效显著",
                        "status": "active",
                        "createTime": "2024-01-15T08:30:00.000Z",
                        "updateTime": "2024-01-15T08:30:00.000Z",
                        "createdBy": "64f123456789abcd12345677"
                      },
                      "message": "获取院内制剂项目详情成功"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "项目ID格式无效",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "invalid_id": {
                    "summary": "无效的项目ID",
                    "value": {
                      "success": false,
                      "error": "无效的项目ID格式"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "未授权访问"
          },
          "404": {
            "description": "项目不存在",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "not_found": {
                    "summary": "项目不存在",
                    "value": {
                      "success": false,
                      "error": "项目不存在"
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "服务器内部错误"
          }
        }
      },
      "put": {
        "tags": [
          "院内制剂项目管理"
        ],
        "summary": "更新院内制剂项目",
        "description": "更新指定ID的院内制剂项目信息",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string",
              "pattern": "^[0-9a-fA-F]{24}$"
            },
            "description": "院内制剂项目ID（MongoDB ObjectId）",
            "example": "64f123456789abcd12345678"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "department": {
                    "type": "string",
                    "description": "部门名称",
                    "example": "转移转化与投资部门"
                  },
                  "source": {
                    "type": "string",
                    "description": "制剂来源",
                    "example": "中医科"
                  },
                  "name": {
                    "type": "string",
                    "description": "制剂名称",
                    "example": "清热解毒颗粒"
                  },
                  "composition": {
                    "type": "string",
                    "description": "组方成分",
                    "example": "金银花15g、连翘12g、板蓝根10g、甘草6g"
                  },
                  "function": {
                    "type": "string",
                    "description": "功能主治",
                    "example": "清热解毒，抗病毒感染，增强免疫力"
                  },
                  "specification": {
                    "type": "string",
                    "description": "规格",
                    "example": "10g/袋，每盒30袋"
                  },
                  "duration": {
                    "type": "string",
                    "description": "有效期",
                    "example": "3年"
                  },
                  "dosage": {
                    "type": "string",
                    "description": "用法用量",
                    "example": "每次1袋，每日3次，温水冲服"
                  },
                  "recordNumber": {
                    "type": "string",
                    "description": "备案号（唯一）",
                    "example": "ZZ-2024-001"
                  },
                  "patent": {
                    "type": "string",
                    "description": "专利信息",
                    "example": "已申请发明专利ZL202410001234.5"
                  },
                  "remarks": {
                    "type": "string",
                    "description": "备注信息",
                    "example": "临床试验阶段，疗效显著"
                  },
                  "status": {
                    "type": "string",
                    "enum": [
                      "active",
                      "completed",
                      "paused"
                    ],
                    "description": "项目状态",
                    "example": "active"
                  }
                }
              },
              "examples": {
                "update_example": {
                  "summary": "更新制剂项目示例",
                  "value": {
                    "name": "清热解毒颗粒（改良版）",
                    "composition": "金银花15g、连翘12g、板蓝根10g、甘草6g、薄荷3g",
                    "function": "清热解毒，抗病毒感染，增强免疫力，清咽利喉",
                    "specification": "12g/袋，每盒25袋",
                    "remarks": "临床试验完成，准备申请上市许可",
                    "status": "completed"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "更新制剂项目成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "$ref": "#/components/schemas/InternalPreparationProject"
                        }
                      }
                    }
                  ]
                },
                "examples": {
                  "success": {
                    "summary": "更新成功响应",
                    "value": {
                      "success": true,
                      "data": {
                        "_id": "64f123456789abcd12345678",
                        "department": "转移转化与投资部门",
                        "source": "中医科",
                        "name": "清热解毒颗粒（改良版）",
                        "composition": "金银花15g、连翘12g、板蓝根10g、甘草6g、薄荷3g",
                        "function": "清热解毒，抗病毒感染，增强免疫力，清咽利喉",
                        "specification": "12g/袋，每盒25袋",
                        "duration": "3年",
                        "dosage": "每次1袋，每日3次，温水冲服",
                        "recordNumber": "ZZ-2024-001",
                        "patent": "已申请发明专利ZL202410001234.5",
                        "remarks": "临床试验完成，准备申请上市许可",
                        "status": "completed",
                        "createTime": "2024-01-15T08:30:00.000Z",
                        "updateTime": "2024-01-20T14:25:00.000Z",
                        "createdBy": "64f123456789abcd12345677"
                      },
                      "message": "更新院内制剂项目成功"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "请求参数错误或备案号重复",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "未授权访问"
          },
          "403": {
            "description": "权限不足（非创建者且非管理员）",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "permission_denied": {
                    "summary": "权限不足",
                    "value": {
                      "success": false,
                      "error": "权限不足：只有项目创建者或管理员可以修改项目"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "项目不存在"
          },
          "500": {
            "description": "服务器内部错误"
          }
        }
      },
      "delete": {
        "tags": [
          "院内制剂项目管理"
        ],
        "summary": "删除院内制剂项目",
        "description": "软删除指定ID的院内制剂项目（将状态设为inactive）",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string",
              "pattern": "^[0-9a-fA-F]{24}$"
            },
            "description": "院内制剂项目ID（MongoDB ObjectId）",
            "example": "64f123456789abcd12345678"
          }
        ],
        "responses": {
          "200": {
            "description": "删除制剂项目成功",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponse"
                },
                "examples": {
                  "success": {
                    "summary": "删除成功响应",
                    "value": {
                      "success": true,
                      "data": null,
                      "message": "删除院内制剂项目成功"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "项目ID格式无效"
          },
          "401": {
            "description": "未授权访问"
          },
          "403": {
            "description": "权限不足（非创建者且非管理员）",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "permission_denied": {
                    "summary": "权限不足",
                    "value": {
                      "success": false,
                      "error": "权限不足：只有项目创建者或管理员可以删除项目"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "项目不存在"
          },
          "500": {
            "description": "服务器内部错误"
          }
        }
      }
    },
    "/api/internal-preparation-projects": {
      "get": {
        "tags": [
          "院内制剂项目管理"
        ],
        "summary": "获取院内制剂项目列表",
        "description": "分页获取院内制剂项目列表，支持搜索和筛选",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "query",
            "name": "page",
            "schema": {
              "type": "integer",
              "default": 1,
              "minimum": 1
            },
            "description": "页码",
            "example": 1
          },
          {
            "in": "query",
            "name": "pageSize",
            "schema": {
              "type": "integer",
              "default": 10,
              "minimum": 1,
              "maximum": 100
            },
            "description": "每页大小",
            "example": 10
          },
          {
            "in": "query",
            "name": "search",
            "schema": {
              "type": "string"
            },
            "description": "搜索关键词（制剂名称、组方、功能、备案号）",
            "example": "感冒灵"
          },
          {
            "in": "query",
            "name": "status",
            "schema": {
              "type": "string",
              "enum": [
                "active",
                "completed",
                "paused"
              ]
            },
            "description": "项目状态筛选",
            "example": "active"
          },
          {
            "in": "query",
            "name": "source",
            "schema": {
              "type": "string"
            },
            "description": "来源筛选",
            "example": "中医科"
          }
        ],
        "responses": {
          "200": {
            "description": "获取制剂项目列表成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "allOf": [
                            {
                              "$ref": "#/components/schemas/PaginatedResponse"
                            },
                            {
                              "type": "object",
                              "properties": {
                                "data": {
                                  "type": "array",
                                  "items": {
                                    "$ref": "#/components/schemas/InternalPreparationProject"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                },
                "examples": {
                  "success": {
                    "summary": "成功响应示例",
                    "value": {
                      "success": true,
                      "data": {
                        "data": [
                          {
                            "_id": "64f123456789abcd12345678",
                            "department": "转移转化与投资部门",
                            "source": "中医科",
                            "name": "清热解毒颗粒",
                            "composition": "金银花、连翘、板蓝根",
                            "function": "清热解毒，抗病毒",
                            "specification": "10g/袋",
                            "duration": "3年",
                            "dosage": "每次1袋，每日3次",
                            "recordNumber": "ZZ-2024-001",
                            "patent": "已申请发明专利",
                            "status": "active",
                            "createTime": "2024-01-15T08:30:00.000Z",
                            "updateTime": "2024-01-15T08:30:00.000Z"
                          }
                        ],
                        "pagination": {
                          "current": 1,
                          "pageSize": 10,
                          "total": 25,
                          "totalPages": 3
                        }
                      },
                      "message": "获取院内制剂项目列表成功"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "未授权访问",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "服务器内部错误",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "院内制剂项目管理"
        ],
        "summary": "创建院内制剂项目",
        "description": "创建新的院内制剂项目记录",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "source",
                  "name",
                  "composition",
                  "function",
                  "specification",
                  "duration",
                  "dosage",
                  "recordNumber"
                ],
                "properties": {
                  "department": {
                    "type": "string",
                    "default": "转移转化与投资部门",
                    "description": "部门名称"
                  },
                  "source": {
                    "type": "string",
                    "description": "制剂来源",
                    "example": "中医科"
                  },
                  "name": {
                    "type": "string",
                    "description": "制剂名称",
                    "example": "清热解毒颗粒"
                  },
                  "composition": {
                    "type": "string",
                    "description": "组方成分",
                    "example": "金银花15g、连翘12g、板蓝根10g"
                  },
                  "function": {
                    "type": "string",
                    "description": "功能主治",
                    "example": "清热解毒，抗病毒感染"
                  },
                  "specification": {
                    "type": "string",
                    "description": "规格",
                    "example": "10g/袋"
                  },
                  "duration": {
                    "type": "string",
                    "description": "有效期",
                    "example": "3年"
                  },
                  "dosage": {
                    "type": "string",
                    "description": "用法用量",
                    "example": "每次1袋，每日3次，温水冲服"
                  },
                  "recordNumber": {
                    "type": "string",
                    "description": "备案号（唯一）",
                    "example": "ZZ-2024-001"
                  },
                  "patent": {
                    "type": "string",
                    "description": "专利信息",
                    "example": "已申请发明专利ZL202410001234.5"
                  },
                  "remarks": {
                    "type": "string",
                    "description": "备注信息",
                    "example": "临床试验阶段，效果良好"
                  }
                }
              },
              "examples": {
                "example1": {
                  "summary": "创建制剂项目示例",
                  "value": {
                    "source": "中医科",
                    "name": "清热解毒颗粒",
                    "composition": "金银花15g、连翘12g、板蓝根10g、甘草6g",
                    "function": "清热解毒，抗病毒感染，增强免疫力",
                    "specification": "10g/袋，每盒30袋",
                    "duration": "3年",
                    "dosage": "每次1袋，每日3次，温水冲服",
                    "recordNumber": "ZZ-2024-001",
                    "patent": "已申请发明专利ZL202410001234.5",
                    "remarks": "临床试验阶段，疗效显著"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "创建制剂项目成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "$ref": "#/components/schemas/InternalPreparationProject"
                        }
                      }
                    }
                  ]
                },
                "examples": {
                  "success": {
                    "summary": "创建成功响应",
                    "value": {
                      "success": true,
                      "data": {
                        "_id": "64f123456789abcd12345678",
                        "department": "转移转化与投资部门",
                        "source": "中医科",
                        "name": "清热解毒颗粒",
                        "composition": "金银花15g、连翘12g、板蓝根10g、甘草6g",
                        "function": "清热解毒，抗病毒感染，增强免疫力",
                        "specification": "10g/袋，每盒30袋",
                        "duration": "3年",
                        "dosage": "每次1袋，每日3次，温水冲服",
                        "recordNumber": "ZZ-2024-001",
                        "patent": "已申请发明专利ZL202410001234.5",
                        "remarks": "临床试验阶段，疗效显著",
                        "status": "active",
                        "createTime": "2024-01-15T08:30:00.000Z",
                        "updateTime": "2024-01-15T08:30:00.000Z",
                        "createdBy": "64f123456789abcd12345677"
                      },
                      "message": "创建院内制剂项目成功"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "请求参数错误或备案号已存在",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "validation_error": {
                    "summary": "参数验证错误",
                    "value": {
                      "success": false,
                      "error": "请填写所有必填字段（来源、名称、组方、功能、规格、年限、用量、备案号）"
                    }
                  },
                  "duplicate_error": {
                    "summary": "备案号重复",
                    "value": {
                      "success": false,
                      "error": "备案号已存在"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "未授权访问"
          },
          "500": {
            "description": "服务器内部错误"
          }
        }
      }
    },
    "/api/overall-projects/{id}": {
      "get": {
        "tags": [
          "总体项目管理"
        ],
        "summary": "获取总体项目详情",
        "description": "根据项目ID获取总体项目的详细信息，包含完整的项目数据和关联信息。\n\n**返回信息包含：**\n- 项目基本信息\n- 创建者信息\n- 关联附件列表\n- 项目状态和时间戳\n",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string",
              "pattern": "^[0-9a-fA-F]{24}$"
            },
            "description": "总体项目ID（MongoDB ObjectId）",
            "example": "64f123456789abcd12345678"
          }
        ],
        "responses": {
          "200": {
            "description": "获取项目详情成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "$ref": "#/components/schemas/OverallProject"
                        }
                      }
                    }
                  ]
                },
                "examples": {
                  "success": {
                    "summary": "成功获取项目详情",
                    "value": {
                      "success": true,
                      "data": {
                        "_id": "64f123456789abcd12345678",
                        "department": "转移转化与投资部门",
                        "projectName": "智能诊断辅助系统",
                        "researchTeam": "上海交通大学AI实验室",
                        "technologyField": "人工智能",
                        "cooperationMode": "技术开发",
                        "projectDescription": "基于深度学习的医学影像智能诊断系统",
                        "technologyDescription": "采用卷积神经网络和注意力机制进行医学影像分析",
                        "expectedResults": "提高诊断准确率至95%以上",
                        "riskAssessment": "技术风险：中等；市场风险：低；监管风险：低",
                        "budget": "500万元",
                        "timeline": "24个月",
                        "milestones": "需求分析、原型开发、临床试验、产品化",
                        "remarks": "与上海市第一人民医院合作进行临床试验",
                        "status": "active",
                        "createTime": "2024-01-15T08:30:00.000Z",
                        "updateTime": "2024-01-15T08:30:00.000Z",
                        "createdBy": {
                          "_id": "64f123456789abcd12345677",
                          "username": "zhangsan",
                          "realName": "张三"
                        }
                      },
                      "message": "获取总体项目详情成功"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "项目ID格式无效",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "invalid_id": {
                    "summary": "无效的项目ID",
                    "value": {
                      "success": false,
                      "error": "无效的项目ID"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "未授权访问"
          },
          "404": {
            "description": "项目不存在",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "not_found": {
                    "summary": "项目不存在",
                    "value": {
                      "success": false,
                      "error": "项目不存在"
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "服务器内部错误"
          }
        }
      },
      "put": {
        "tags": [
          "总体项目管理"
        ],
        "summary": "更新总体项目",
        "description": "更新指定ID的总体项目信息。\n\n**权限要求：**\n- 管理员：可更新任何项目\n- 普通用户：只能更新自己创建的项目\n\n**可更新字段：**\n- 项目基本信息（名称、团队、领域等）\n- 技术信息（描述、预期成果等）\n- 管理信息（预算、时间、状态等）\n",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string",
              "pattern": "^[0-9a-fA-F]{24}$"
            },
            "description": "总体项目ID（MongoDB ObjectId）",
            "example": "64f123456789abcd12345678"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "department": {
                    "type": "string",
                    "description": "部门名称",
                    "example": "转移转化与投资部门"
                  },
                  "projectName": {
                    "type": "string",
                    "maxLength": 200,
                    "description": "项目名称",
                    "example": "智能诊断辅助系统（升级版）"
                  },
                  "researchTeam": {
                    "type": "string",
                    "maxLength": 200,
                    "description": "研发团队",
                    "example": "上海交通大学AI实验室"
                  },
                  "technologyField": {
                    "type": "string",
                    "maxLength": 100,
                    "description": "技术领域",
                    "example": "人工智能"
                  },
                  "cooperationMode": {
                    "type": "string",
                    "maxLength": 100,
                    "description": "合作方式",
                    "example": "技术开发"
                  },
                  "projectDescription": {
                    "type": "string",
                    "description": "项目描述",
                    "example": "基于深度学习的医学影像智能诊断系统，升级版增加多模态融合"
                  },
                  "technologyDescription": {
                    "type": "string",
                    "description": "技术描述",
                    "example": "采用Transformer架构和多模态融合技术"
                  },
                  "expectedResults": {
                    "type": "string",
                    "description": "预期成果",
                    "example": "提高诊断准确率至98%以上"
                  },
                  "riskAssessment": {
                    "type": "string",
                    "description": "风险评估",
                    "example": "技术风险：低；市场风险：低；监管风险：中等"
                  },
                  "budget": {
                    "type": "string",
                    "description": "预算",
                    "example": "800万元"
                  },
                  "timeline": {
                    "type": "string",
                    "description": "时间节点",
                    "example": "30个月"
                  },
                  "milestones": {
                    "type": "string",
                    "description": "里程碑",
                    "example": "算法优化、临床验证、产品升级、市场推广"
                  },
                  "remarks": {
                    "type": "string",
                    "description": "备注",
                    "example": "升级现有系统，增加多模态诊断能力"
                  },
                  "status": {
                    "type": "string",
                    "enum": [
                      "active",
                      "completed",
                      "paused"
                    ],
                    "description": "项目状态",
                    "example": "active"
                  }
                }
              },
              "examples": {
                "update_example": {
                  "summary": "更新项目示例",
                  "value": {
                    "projectName": "智能诊断辅助系统（升级版）",
                    "projectDescription": "基于深度学习的医学影像智能诊断系统，升级版增加多模态融合功能",
                    "technologyDescription": "采用最新的Transformer架构和多模态融合技术，提升诊断性能",
                    "expectedResults": "提高诊断准确率至98%以上，支持更多病种诊断",
                    "budget": "800万元",
                    "timeline": "30个月",
                    "status": "active"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "更新项目成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "$ref": "#/components/schemas/OverallProject"
                        }
                      }
                    }
                  ]
                },
                "examples": {
                  "success": {
                    "summary": "更新成功响应",
                    "value": {
                      "success": true,
                      "data": {
                        "_id": "64f123456789abcd12345678",
                        "department": "转移转化与投资部门",
                        "projectName": "智能诊断辅助系统（升级版）",
                        "researchTeam": "上海交通大学AI实验室",
                        "technologyField": "人工智能",
                        "cooperationMode": "技术开发",
                        "projectDescription": "基于深度学习的医学影像智能诊断系统，升级版增加多模态融合功能",
                        "technologyDescription": "采用最新的Transformer架构和多模态融合技术",
                        "expectedResults": "提高诊断准确率至98%以上",
                        "budget": "800万元",
                        "timeline": "30个月",
                        "status": "active",
                        "createTime": "2024-01-15T08:30:00.000Z",
                        "updateTime": "2024-01-25T14:20:00.000Z",
                        "createdBy": "64f123456789abcd12345677"
                      },
                      "message": "更新总体项目成功"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "请求参数错误",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "未授权访问"
          },
          "403": {
            "description": "权限不足（非创建者且非管理员）",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "permission_denied": {
                    "summary": "权限不足",
                    "value": {
                      "success": false,
                      "error": "权限不足：只有项目创建者或管理员可以修改项目"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "项目不存在"
          },
          "500": {
            "description": "服务器内部错误"
          }
        }
      },
      "delete": {
        "tags": [
          "总体项目管理"
        ],
        "summary": "删除总体项目",
        "description": "软删除指定ID的总体项目（将状态设为inactive）。\n\n**权限要求：**\n- 管理员：可删除任何项目\n- 普通用户：只能删除自己创建的项目\n\n**注意事项：**\n- 删除操作为软删除，不会物理删除数据\n- 关联的附件不会被自动删除\n- 删除后项目状态变为inactive\n",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string",
              "pattern": "^[0-9a-fA-F]{24}$"
            },
            "description": "总体项目ID（MongoDB ObjectId）",
            "example": "64f123456789abcd12345678"
          }
        ],
        "responses": {
          "200": {
            "description": "删除项目成功",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponse"
                },
                "examples": {
                  "success": {
                    "summary": "删除成功响应",
                    "value": {
                      "success": true,
                      "data": null,
                      "message": "删除总体项目成功"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "项目ID格式无效"
          },
          "401": {
            "description": "未授权访问"
          },
          "403": {
            "description": "权限不足（非创建者且非管理员）",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "permission_denied": {
                    "summary": "权限不足",
                    "value": {
                      "success": false,
                      "error": "权限不足：只有项目创建者或管理员可以删除项目"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "项目不存在"
          },
          "500": {
            "description": "服务器内部错误"
          }
        }
      }
    },
    "/api/overall-projects": {
      "get": {
        "tags": [
          "总体项目管理"
        ],
        "summary": "获取总体项目列表",
        "description": "分页获取总体项目列表，支持多种搜索和筛选条件。\n\n**搜索功能：**\n- 按项目名称搜索\n- 按研发团队搜索\n- 按技术领域搜索\n- 按合作方式搜索\n\n**筛选功能：**\n- 按项目状态筛选\n- 按技术领域筛选\n- 按合作方式筛选\n- 按创建者筛选\n",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "query",
            "name": "page",
            "schema": {
              "type": "integer",
              "default": 1,
              "minimum": 1
            },
            "description": "页码",
            "example": 1
          },
          {
            "in": "query",
            "name": "pageSize",
            "schema": {
              "type": "integer",
              "default": 10,
              "minimum": 1,
              "maximum": 100
            },
            "description": "每页大小",
            "example": 10
          },
          {
            "in": "query",
            "name": "search",
            "schema": {
              "type": "string"
            },
            "description": "搜索关键词（项目名称、研发团队、技术领域、合作方式）",
            "example": "人工智能"
          },
          {
            "in": "query",
            "name": "status",
            "schema": {
              "type": "string",
              "enum": [
                "active",
                "completed",
                "paused"
              ]
            },
            "description": "项目状态筛选",
            "example": "active"
          },
          {
            "in": "query",
            "name": "technologyField",
            "schema": {
              "type": "string"
            },
            "description": "技术领域筛选",
            "example": "人工智能"
          },
          {
            "in": "query",
            "name": "cooperationMode",
            "schema": {
              "type": "string"
            },
            "description": "合作方式筛选",
            "example": "技术开发"
          },
          {
            "in": "query",
            "name": "createdBy",
            "schema": {
              "type": "string",
              "pattern": "^[0-9a-fA-F]{24}$"
            },
            "description": "创建者ID筛选",
            "example": "64f123456789abcd12345677"
          }
        ],
        "responses": {
          "200": {
            "description": "获取项目列表成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "allOf": [
                            {
                              "$ref": "#/components/schemas/PaginatedResponse"
                            },
                            {
                              "type": "object",
                              "properties": {
                                "data": {
                                  "type": "array",
                                  "items": {
                                    "$ref": "#/components/schemas/OverallProject"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                },
                "examples": {
                  "success": {
                    "summary": "成功响应示例",
                    "value": {
                      "success": true,
                      "data": {
                        "data": [
                          {
                            "_id": "64f123456789abcd12345678",
                            "department": "转移转化与投资部门",
                            "projectName": "智能诊断辅助系统",
                            "researchTeam": "上海交通大学AI实验室",
                            "technologyField": "人工智能",
                            "cooperationMode": "技术开发",
                            "projectDescription": "基于深度学习的医学影像智能诊断系统",
                            "technologyDescription": "采用卷积神经网络和注意力机制进行医学影像分析",
                            "expectedResults": "提高诊断准确率至95%以上",
                            "riskAssessment": "技术风险：中等；市场风险：低；监管风险：低",
                            "budget": "500万元",
                            "timeline": "24个月",
                            "milestones": "需求分析（3个月）、原型开发（8个月）、临床试验（10个月）、产品化（3个月）",
                            "status": "active",
                            "createTime": "2024-01-15T08:30:00.000Z",
                            "updateTime": "2024-01-15T08:30:00.000Z",
                            "createdBy": "64f123456789abcd12345677"
                          }
                        ],
                        "pagination": {
                          "current": 1,
                          "pageSize": 10,
                          "total": 45,
                          "totalPages": 5
                        }
                      },
                      "message": "获取总体项目列表成功"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "未授权访问",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "服务器内部错误",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "总体项目管理"
        ],
        "summary": "创建总体项目",
        "description": "创建新的总体项目记录。\n\n**必填字段：**\n- 项目名称\n- 研发团队\n- 技术领域\n- 合作方式\n- 项目描述\n- 技术描述\n- 预期成果\n\n**可选字段：**\n- 风险评估\n- 预算\n- 时间节点\n- 里程碑\n- 备注\n",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "projectName",
                  "researchTeam",
                  "technologyField",
                  "cooperationMode",
                  "projectDescription",
                  "technologyDescription",
                  "expectedResults"
                ],
                "properties": {
                  "department": {
                    "type": "string",
                    "default": "转移转化与投资部门",
                    "description": "部门名称"
                  },
                  "projectName": {
                    "type": "string",
                    "maxLength": 200,
                    "description": "项目名称",
                    "example": "智能诊断辅助系统"
                  },
                  "researchTeam": {
                    "type": "string",
                    "maxLength": 200,
                    "description": "研发团队",
                    "example": "上海交通大学AI实验室"
                  },
                  "technologyField": {
                    "type": "string",
                    "maxLength": 100,
                    "description": "技术领域",
                    "example": "人工智能"
                  },
                  "cooperationMode": {
                    "type": "string",
                    "maxLength": 100,
                    "description": "合作方式",
                    "example": "技术开发"
                  },
                  "projectDescription": {
                    "type": "string",
                    "description": "项目描述",
                    "example": "基于深度学习的医学影像智能诊断系统，能够辅助医生进行疾病诊断"
                  },
                  "technologyDescription": {
                    "type": "string",
                    "description": "技术描述",
                    "example": "采用卷积神经网络和注意力机制进行医学影像分析"
                  },
                  "expectedResults": {
                    "type": "string",
                    "description": "预期成果",
                    "example": "提高诊断准确率至95%以上，减少误诊率30%"
                  },
                  "riskAssessment": {
                    "type": "string",
                    "description": "风险评估",
                    "example": "技术风险：中等；市场风险：低；监管风险：低"
                  },
                  "budget": {
                    "type": "string",
                    "description": "预算",
                    "example": "500万元"
                  },
                  "timeline": {
                    "type": "string",
                    "description": "时间节点",
                    "example": "24个月"
                  },
                  "milestones": {
                    "type": "string",
                    "description": "里程碑",
                    "example": "需求分析（3个月）、原型开发（8个月）、临床试验（10个月）、产品化（3个月）"
                  },
                  "remarks": {
                    "type": "string",
                    "description": "备注",
                    "example": "与上海市第一人民医院合作进行临床试验"
                  }
                }
              },
              "examples": {
                "ai_diagnosis": {
                  "summary": "AI诊断系统项目",
                  "value": {
                    "projectName": "智能诊断辅助系统",
                    "researchTeam": "上海交通大学AI实验室",
                    "technologyField": "人工智能",
                    "cooperationMode": "技术开发",
                    "projectDescription": "基于深度学习的医学影像智能诊断系统，能够辅助医生进行疾病诊断，提高诊断效率和准确性",
                    "technologyDescription": "采用卷积神经网络和注意力机制进行医学影像分析，结合多模态数据融合技术",
                    "expectedResults": "提高诊断准确率至95%以上，减少误诊率30%，提升诊断效率50%",
                    "riskAssessment": "技术风险：中等（深度学习模型复杂性）；市场风险：低（医疗需求大）；监管风险：低",
                    "budget": "500万元",
                    "timeline": "24个月",
                    "milestones": "需求分析（3个月）、原型开发（8个月）、临床试验（10个月）、产品化（3个月）",
                    "remarks": "与上海市第一人民医院合作进行临床试验验证"
                  }
                },
                "drug_discovery": {
                  "summary": "药物发现项目",
                  "value": {
                    "projectName": "AI驱动的新药发现平台",
                    "researchTeam": "复旦大学药学院",
                    "technologyField": "生物技术",
                    "cooperationMode": "联合研发",
                    "projectDescription": "利用人工智能技术加速新药发现和开发过程",
                    "technologyDescription": "分子对接、QSAR建模、深度生成模型",
                    "expectedResults": "缩短药物发现周期40%，提高命中率20%",
                    "budget": "800万元",
                    "timeline": "36个月"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "创建项目成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "$ref": "#/components/schemas/OverallProject"
                        }
                      }
                    }
                  ]
                },
                "examples": {
                  "success": {
                    "summary": "创建成功响应",
                    "value": {
                      "success": true,
                      "data": {
                        "_id": "64f123456789abcd12345678",
                        "department": "转移转化与投资部门",
                        "projectName": "智能诊断辅助系统",
                        "researchTeam": "上海交通大学AI实验室",
                        "technologyField": "人工智能",
                        "cooperationMode": "技术开发",
                        "projectDescription": "基于深度学习的医学影像智能诊断系统",
                        "technologyDescription": "采用卷积神经网络和注意力机制进行医学影像分析",
                        "expectedResults": "提高诊断准确率至95%以上",
                        "riskAssessment": "技术风险：中等；市场风险：低；监管风险：低",
                        "budget": "500万元",
                        "timeline": "24个月",
                        "milestones": "需求分析（3个月）、原型开发（8个月）、临床试验（10个月）、产品化（3个月）",
                        "remarks": "与上海市第一人民医院合作进行临床试验",
                        "status": "active",
                        "createTime": "2024-01-15T08:30:00.000Z",
                        "updateTime": "2024-01-15T08:30:00.000Z",
                        "createdBy": "64f123456789abcd12345677"
                      },
                      "message": "创建总体项目成功"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "请求参数错误",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "examples": {
                  "validation_error": {
                    "summary": "参数验证错误",
                    "value": {
                      "success": false,
                      "error": "请填写所有必填字段"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "未授权访问"
          },
          "500": {
            "description": "服务器内部错误"
          }
        }
      }
    },
    "/api/test-swagger": {
      "get": {
        "tags": [
          "系统测试"
        ],
        "summary": "测试Swagger文档生成",
        "description": "用于测试swagger-jsdoc是否能正确扫描和生成API文档",
        "responses": {
          "200": {
            "description": "测试成功",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "example": true
                    },
                    "message": {
                      "type": "string",
                      "example": "Swagger测试成功"
                    },
                    "debug": {
                      "type": "object",
                      "properties": {
                        "scanPaths": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "扫描的文件路径"
                        },
                        "foundPaths": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "发现的API路径"
                        },
                        "pathsCount": {
                          "type": "integer",
                          "description": "API路径数量"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/users": {
      "get": {
        "tags": [
          "用户管理"
        ],
        "summary": "获取用户列表",
        "description": "分页获取用户列表，支持搜索和筛选。需要管理员权限。",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "query",
            "name": "page",
            "schema": {
              "type": "integer",
              "default": 1
            },
            "description": "页码"
          },
          {
            "in": "query",
            "name": "pageSize",
            "schema": {
              "type": "integer",
              "default": 10
            },
            "description": "每页大小"
          },
          {
            "in": "query",
            "name": "search",
            "schema": {
              "type": "string"
            },
            "description": "搜索关键词（用户名、真实姓名、邮箱）"
          },
          {
            "in": "query",
            "name": "status",
            "schema": {
              "type": "string",
              "enum": [
                "active",
                "inactive"
              ]
            },
            "description": "用户状态筛选"
          },
          {
            "in": "query",
            "name": "role",
            "schema": {
              "type": "string",
              "enum": [
                "admin",
                "user"
              ]
            },
            "description": "用户角色筛选"
          }
        ],
        "responses": {
          "200": {
            "description": "获取用户列表成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "allOf": [
                            {
                              "$ref": "#/components/schemas/PaginatedResponse"
                            },
                            {
                              "type": "object",
                              "properties": {
                                "data": {
                                  "type": "array",
                                  "items": {
                                    "$ref": "#/components/schemas/UserResponse"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "description": "未授权访问"
          },
          "403": {
            "description": "权限不足（需要管理员权限）"
          },
          "500": {
            "description": "服务器内部错误"
          }
        }
      },
      "post": {
        "tags": [
          "用户管理"
        ],
        "summary": "创建新用户",
        "description": "创建新用户账号。需要管理员权限。",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "username",
                  "password"
                ],
                "properties": {
                  "username": {
                    "type": "string",
                    "description": "用户名",
                    "example": "newuser"
                  },
                  "password": {
                    "type": "string",
                    "description": "密码",
                    "example": "123456"
                  },
                  "role": {
                    "type": "string",
                    "enum": [
                      "admin",
                      "user"
                    ],
                    "default": "user",
                    "description": "用户角色"
                  },
                  "email": {
                    "type": "string",
                    "format": "email",
                    "description": "邮箱地址"
                  },
                  "realName": {
                    "type": "string",
                    "description": "真实姓名"
                  },
                  "department": {
                    "type": "string",
                    "description": "部门"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "创建用户成功",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/ApiResponse"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "$ref": "#/components/schemas/UserResponse"
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "description": "请求参数错误或用户名已存在"
          },
          "401": {
            "description": "未授权访问"
          },
          "403": {
            "description": "权限不足（需要管理员权限）"
          },
          "500": {
            "description": "服务器内部错误"
          }
        }
      }
    }
  },
  "tags": []
}