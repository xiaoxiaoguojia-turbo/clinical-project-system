import React, { useEffect } from 'react'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { 
  WrenchScrewdriverIcon,
  ClockIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'
import { 
  WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
  SparklesIcon
} from '@heroicons/react/24/solid'
import { TokenManager } from '@/utils/auth'

// 动态导入DashboardLayout组件
const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">加载中...</p>
      </div>
    </div>
  )
})

const UnderConstructionPage: NextPage = () => {
  const router = useRouter()
  const currentUser = TokenManager.getUser()

  // 确保用户已登录，否则跳转到登录页
  useEffect(() => {
    if (!TokenManager.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  // 开发进度数据
  const developmentProgress = [
    {
      id: 1,
      feature: '数据分析看板',
      description: '项目数据可视化分析与统计报表',
      status: 'planning',
      progress: 25,
      icon: RocketLaunchIcon,
      estimatedDate: '2025年4月'
    },
    {
      id: 2,
      feature: '智能推荐系统',
      description: '基于AI的项目匹配与推荐功能',
      status: 'development',
      progress: 60,
      icon: SparklesIcon,
      estimatedDate: '2025年5月'
    },
    {
      id: 3,
      feature: '协作工作流',
      description: '多部门协作与审批流程管理',
      status: 'planning',
      progress: 15,
      icon: ChatBubbleLeftRightIcon,
      estimatedDate: '2025年6月'
    }
  ]

  // 联系信息
  const contactInfo = {
    department: '转移转化与投资部门',
    email: 'innovation@clinical-research.cn',
    phone: '+86 021-1234-5678'
  }

  // 获取状态显示信息
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: '已完成', colorClass: 'text-green-600 bg-green-50 border-green-200' }
      case 'development':
        return { text: '开发中', colorClass: 'text-blue-600 bg-blue-50 border-blue-200' }
      case 'planning':
        return { text: '规划中', colorClass: 'text-orange-600 bg-orange-50 border-orange-200' }
      default:
        return { text: '未知', colorClass: 'text-gray-600 bg-gray-50 border-gray-200' }
    }
  }

  return (
    <DashboardLayout 
      title="功能建设中 - 临床创新项目管理系统"
      description="该功能正在积极开发中，敬请期待"
    >
      <div className="max-w-7xl mx-auto p-0 min-h-screen">
        {/* 页面头部 */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-24 translate-x-24"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="flex-shrink-0">
              <WrenchScrewdriverIconSolid className="w-16 h-16 animate-bounce" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 leading-tight">功能建设中</h1>
              <p className="text-lg opacity-90 leading-relaxed">
                我们正在为您打造更好的用户体验，该功能即将上线
              </p>
            </div>
          </div>
        </div>

        {/* 用户信息卡片 */}
        {currentUser && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <BuildingOffice2Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {currentUser.realName || currentUser.username}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {currentUser.role === 'admin' ? '系统管理员' : '普通用户'} | {currentUser.department || '转移转化与投资部门'}
                </p>
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>已登录系统</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 开发进度展示 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <ClockIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">开发进度</h2>
              <p className="text-gray-600">以下功能正在积极开发中，我们会持续更新进度</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {developmentProgress.map((item) => {
              const statusInfo = getStatusInfo(item.status)
              return (
                <div key={item.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.feature}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.colorClass}`}>
                        {statusInfo.text}
                      </div>
                      <span className="text-sm font-semibold text-blue-600">{item.progress}%</span>
                    </div>
                    
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300" 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-gray-500">预计完成：{item.estimatedDate}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 通知与反馈 */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <BellAlertIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">功能上线通知</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  当新功能开发完成时，我们会通过系统消息第一时间通知您
                </p>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 hover:-translate-y-0.5 transition-all duration-200">
                  <CheckCircleIcon className="w-4 h-4" />
                  已开启通知
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">意见反馈</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  如果您有功能建议或使用问题，欢迎随时联系我们
                </p>
                <button 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 hover:-translate-y-0.5 transition-all duration-200"
                  onClick={() => window.open(`mailto:${contactInfo.email}?subject=功能建议&body=您好，我有以下建议：`)}
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  发送反馈
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="bg-white rounded-xl p-8 mb-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <EnvelopeIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">联系我们</h2>
              <p className="text-gray-600">如需技术支持或功能咨询，请通过以下方式联系</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
              <BuildingOffice2Icon className="w-6 h-6 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">部门</p>
                <p className="text-gray-900 font-medium">{contactInfo.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
              <EnvelopeIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">邮箱</p>
                <a 
                  href={`mailto:${contactInfo.email}`} 
                  className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
              <PhoneIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">电话</p>
                <p className="text-gray-900 font-medium">{contactInfo.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mt-8">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            当前页面仅作为功能开发预览，具体功能以正式版本为准
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UnderConstructionPage
