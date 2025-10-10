// Dashboard统计相关类型定义

/* ------------------------------------------------------------------------------------------ */

// 基础统计项接口
export interface StatItem {
  label: string
  value: number
  percentage?: number
  color?: string
}

// 项目总体统计
export interface ProjectOverviewStats {
  totalProjects: number
  internalPreparationCount: number        // 院内制剂数量
  contractCompletedCount: number          // 签约已完成数量
  contractIncompleteCount: number         // 签约未完成数量
  byDepartment: StatItem[]                // 归属部门分布
  byProjectType: StatItem[]               // 项目分类型分布
  bySource: StatItem[]                    // 医院来源分布
  byImportance: StatItem[]                // 重要程度分布
  byStatus: StatItem[]                    // 项目进展状态分布
  byIndication: StatItem[]                // 适应症/科室分布
  byTransformRequirement: StatItem[]      // 转化需求分布
  byTransformProgress: StatItem[]         // 转化推进状态分布
}

// 完整的Dashboard数据接口
export interface DashboardStats {
  overview: ProjectOverviewStats
  lastUpdated: string
}

// API响应接口
export interface DashboardStatsResponse {
  success: boolean
  data: DashboardStats
  message?: string
}

// 筛选参数接口
export interface DashboardFilters {
  projectTypes?: string[]
  departments?: string[]
}

/* ------------------------------------------------------------------------------------------ */

// 图表数据接口
export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

// 卡片统计数据接口
export interface StatCard {
  title: string
  value: number | string
  unit?: string
  icon: string
  color: string
  description?: string
}

/* ------------------------------------------------------------------------------------------ */

// 枚举映射（用于图表显示）
export const DEPARTMENT_LABELS: Record<string, string> = {
  'transfer-investment-dept-1': '转移转化与投资一部',
  'transfer-investment-dept-2': '转移转化与投资二部',
  'transfer-investment-dept-3': '转移转化与投资三部'
}

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  'internal-preparation': '院内制剂',
  'ai-medical-research': 'AI医疗及系统研究',
  'diagnostic-detection': '检测诊断',
  'cell-therapy': '细胞治疗',
  'drug': '药物',
  'medical-device': '医疗器械',
  'medical-material': '医用材料',
  'other': '其他'
}

export const IMPORTANCE_LABELS: Record<string, string> = {
  'very-important': '非常重要',
  'important': '重要',
  'normal': '一般',
  'not-important': '不重要'
}

export const STATUS_LABELS: Record<string, string> = {
  'early-stage': '早期',
  'preclinical': '临床前',
  'clinical-stage': '临床阶段',
  'market-product': '上市产品'
}

export const TRANSFORM_REQUIREMENT_LABELS: Record<string, string> = {
  'license': '许可',
  'transfer': '转让',
  'company-operation': '公司化运营',
  'other': '其他'
}

export const TRANSFORM_PROGRESS_LABELS: Record<string, string> = {
  'contract-completed': '签约已完成',
  'contract-incomplete': '未完成'
}

export const LEADER_LABELS: Record<string, string> = {
  'yangfeng': '杨锋',
  'qinqingsong': '秦青松',
  'haojingjing': '郝菁菁',
  'chenlong': '陈栊',
  'wangliyan': '王立言',
  'maoshiwei': '毛世伟',
  'xiaolanchuan': '肖蓝川',
  'to-be-determined': '待定'
}

/* ------------------------------------------------------------------------------------------ */

// 图表颜色配置
export const CHART_COLORS = {
  primary: ['#3B82F6', '#1E40AF', '#1D4ED8'],
  department: ['#EF4444', '#F97316', '#EAB308'],
  projectType: [
    '#3B82F6', // 蓝色 - 院内制剂
    '#10B981', // 绿色 - AI医疗
    '#F59E0B', // 黄色 - 检测诊断
    '#EF4444', // 红色 - 细胞治疗
    '#8B5CF6', // 紫色 - 药物
    '#06B6D4', // 青色 - 医疗器械
    '#F97316', // 橙色 - 医用材料
    '#6B7280'  // 灰色 - 其他
  ],
  importance: ['#DC2626', '#EA580C', '#059669', '#6B7280'],
  status: ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'],
  transform: [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#6B7280'
  ]
}
