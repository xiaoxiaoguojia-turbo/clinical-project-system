import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: '不支持的请求方法'
    })
  }

  try {
    // 由于我们使用的是无状态JWT，登出主要在前端处理
    // 这里主要用于记录登出日志或执行清理操作
    
    res.status(200).json({
      success: true,
      message: '登出成功'
    })
  } catch (error) {
    console.error('登出错误:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
}
