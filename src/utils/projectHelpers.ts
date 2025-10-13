import { LeaderEnum, TransformProgressEnum, TransformRequirementEnum } from '@/models/UnifiedProject'
import { UnifiedProject, UnifiedProjectTypeEnum, UnifiedProjectImportanceEnum, UnifiedProjectStatusEnum, UnifiedProjectTransformRequirementEnum, UnifiedProjectDepartmentEnum, UnifiedProjectTransformProgressEnum, UnifiedProjectLeaderEnum } from '@/types'

/* ------------------------------------------------------------------------------------------ */

// 项目类型判断函数
export const isInternalPreparation = (projectType: string): boolean => {
  return projectType === UnifiedProjectTypeEnum.INTERNAL_PREPARATION
}

export const isInternalPreparationType = isInternalPreparation

export const requiresLeader = (projectType: string): boolean => {
  return true  // leader现在是通用必填字段，所有项目类型都需要
}

export const requiresStartDate = (projectType: string): boolean => {
  return !isInternalPreparation(projectType)
}

/* ------------------------------------------------------------------------------------------ */

// 显示名称转换函数
export const getDepartmentDisplayName = (department: string): string => {
  const departmentMap: Record<string, string> = {
    [UnifiedProjectDepartmentEnum.DEPT_ONE]: '转移转化与投资一部',
    [UnifiedProjectDepartmentEnum.DEPT_TWO]: '转移转化与投资二部',
    [UnifiedProjectDepartmentEnum.DEPT_THREE]: '转移转化与投资三部'
  }
  return departmentMap[department] || department
}

export const getProjectTypeDisplayName = (projectType: string): string => {
  const typeMap: Record<string, string> = {
    [UnifiedProjectTypeEnum.INTERNAL_PREPARATION]: '院内制剂',
    [UnifiedProjectTypeEnum.AI_MEDICAL_RESEARCH]: 'AI医疗及系统研究',
    [UnifiedProjectTypeEnum.DIAGNOSTIC_DETECTION]: '检测诊断',
    [UnifiedProjectTypeEnum.CELL_THERAPY]: '细胞治疗',
    [UnifiedProjectTypeEnum.DRUG]: '药物',
    [UnifiedProjectTypeEnum.MEDICAL_DEVICE]: '医疗器械',
    [UnifiedProjectTypeEnum.MEDICAL_MATERIAL]: '医用材料',
    [UnifiedProjectTypeEnum.OTHER]: '其他'
  }
  return typeMap[projectType] || projectType
}

export const getImportanceDisplayName = (importance: string): string => {
  const importanceMap: Record<string, string> = {
    [UnifiedProjectImportanceEnum.VERY_IMPORTANT]: '非常重要',
    [UnifiedProjectImportanceEnum.IMPORTANT]: '重要',
    [UnifiedProjectImportanceEnum.NORMAL]: '一般',
    [UnifiedProjectImportanceEnum.NOT_IMPORTANT]: '不重要'
  }
  return importanceMap[importance] || importance
}

export const getStatusDisplayName = (status: string): string => {
  const statusMap: Record<string, string> = {
    [UnifiedProjectStatusEnum.EARLY_STAGE]: '早期',
    [UnifiedProjectStatusEnum.PRECLINICAL]: '临床前',
    [UnifiedProjectStatusEnum.CLINICAL_STAGE]: '临床阶段',
    [UnifiedProjectStatusEnum.MARKET_PRODUCT]: '上市产品'
  }
  return statusMap[status] || status
}

export const getLeaderDisplayName = (leader: string): string => {
  const leaderMap: Record<string, string> = {
    [UnifiedProjectLeaderEnum.YANGFENG]: '杨锋',                                // 杨锋
    [UnifiedProjectLeaderEnum.QINQINGSONG]: '秦青松',                           // 秦青松
    [UnifiedProjectLeaderEnum.HAOJINGJING]: '郝菁菁',                           // 郝菁菁
    [UnifiedProjectLeaderEnum.CHENLONG]: '陈栊',                                // 陈栊
    [UnifiedProjectLeaderEnum.WANGLIYAN]: '王立言',                             // 王立言
    [UnifiedProjectLeaderEnum.MAOSHIWEI]: '毛世伟',                             // 毛世伟
    [UnifiedProjectLeaderEnum.XIAOLANCHUAN]: '肖蓝川',                          // 肖蓝川
    [UnifiedProjectLeaderEnum.TO_BE_DETERMINED]: '待定'                         // 待定
  }
  return leaderMap[leader] || leader
}

export const getTransformRequirementDisplayName = (requirement: string): string => {
  const requirementMap: Record<string, string> = {
    [UnifiedProjectTransformRequirementEnum.LICENSE]: '许可',
    [UnifiedProjectTransformRequirementEnum.TRANSFER]: '转让',
    [UnifiedProjectTransformRequirementEnum.COMPANY_OPERATION]: '公司化运营',
    [UnifiedProjectTransformRequirementEnum.OTHER]: '其他'
  }
  return requirementMap[requirement] || requirement
}

export const getTransformProgressDisplayName = (progress: string): string => {
  const progressMap: Record<string, string> = {
    [UnifiedProjectTransformProgressEnum.CONTRACT_COMPLETED]: '签约已完成',
    [UnifiedProjectTransformProgressEnum.CONTRACT_INCOMPLETE]: '未完成'
  }
  return progressMap[progress] || progress
}

/* ------------------------------------------------------------------------------------------ */

// 字段验证函数
export const validateProjectData = (project: Partial<UnifiedProject>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // 通用必填字段验证
  if (!project.name?.trim()) {
    errors.push('项目名称为必填项')
  }
  if (!project.projectType) {
    errors.push('项目类型为必填项')
  }
  if (!project.source?.trim()) {
    errors.push('项目来源为必填项')
  }
  if (!project.department) {
    errors.push('部门为必填项')
  }
  if (!project.importance) {
    errors.push('重要程度为必填项')
  }
  if (!project.status) {
    errors.push('项目状态为必填项')
  }
  if (!project.leader?.trim()) {
    errors.push('负责人为必填项')
  }
  
  // 院内制剂特有字段验证
  if (project.projectType === UnifiedProjectTypeEnum.INTERNAL_PREPARATION) {
    if (!project.composition?.trim()) {
      errors.push('院内制剂项目的组方为必填项')
    }
    if (!project.function?.trim()) {
      errors.push('院内制剂项目的功能为必填项')
    }
  }
  
  // 其他类型特有字段验证
  if (project.projectType && project.projectType !== UnifiedProjectTypeEnum.INTERNAL_PREPARATION) {
    if (!project.startDate) {
      errors.push('该项目类型的开始日期为必填项')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// 报告生成数据验证函数
export const validateProjectDataForReport = (project: Partial<UnifiedProject>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // 基础字段验证
  if (!project) {
    errors.push('项目数据不能为空')
    return { isValid: false, errors }
  }
  if (!project.department) {
    errors.push('部门不能为空')
    return { isValid: false, errors }
  }
  if (!project.name?.trim()) {
    errors.push('项目名称不能为空')
    return { isValid: false, errors }
  }
  if (!project.projectType) {
    errors.push('项目类型不能为空')
    return { isValid: false, errors }
  }
  if (!project.source?.trim()) {
    errors.push('项目来源不能为空')
    return { isValid: false, errors }
  }
  
  // 院内制剂特有的报告生成验证（添加类型保护）
  if (project.projectType && isInternalPreparation(project.projectType)) {
    if (!project.composition?.trim()) {
      errors.push('组方不能为空，报告生成需要此信息')
    }
    if (!project.function?.trim()) {
      errors.push('功能主治不能为空，报告生成需要此信息')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const getRequiredFieldsForType = (projectType: string): string[] => {
  if (isInternalPreparation(projectType)) {
    // 院内制剂必填字段（移除了dosage）
    return ['composition', 'function']
  } else {
    // 其他类型项目必填字段（移除了followUpWeeks）
    return ['startDate']
  }
}

/* ------------------------------------------------------------------------------------------ */

// 数据迁移辅助函数
export const convertInternalPreparationToUnified = (internalPrep: any): Partial<UnifiedProject> => {
  return {
    // ID
    // _id: internalPrep._id,

    // 通用必填字段
    department: internalPrep.department || UnifiedProjectDepartmentEnum.DEPT_ONE,
    name: internalPrep.name,
    projectType: UnifiedProjectTypeEnum.INTERNAL_PREPARATION,
    source: internalPrep.source,
    importance: UnifiedProjectImportanceEnum.VERY_IMPORTANT, // 默认值
    status: mapInternalPrepStatus(internalPrep.status),
    leader: LeaderEnum.TO_BE_DETERMINED,

    // 通用选填字段
    indication: internalPrep.indication || '',
    transformRequirement: internalPrep.transformRequirement || TransformRequirementEnum.OTHER,
    transformProgress: internalPrep.transformProgress || TransformProgressEnum.CONTRACT_INCOMPLETE,
    hospitalDoctor: internalPrep.hospitalDoctor || '',
    patent: internalPrep.patent || '',
    clinicalData: internalPrep.clinicalData || '',
    marketSize: internalPrep.dosage || '',
    competitorStatus: internalPrep.competitorStatus || '',
    conclusion: internalPrep.remarks || '',
    
    // 院内制剂特有字段

    // 院内制剂必填字段
    composition: internalPrep.composition,
    function: internalPrep.function,

    // 院内制剂选填字段
    specification: internalPrep.specification,
    duration: internalPrep.duration,
    recordNumber: internalPrep.recordNumber,
    
    // 系统字段
    attachments: internalPrep.attachments || [],
    createTime: internalPrep.createTime,
    updateTime: internalPrep.updateTime,
    createdBy: internalPrep.createdBy,

    // AI报告
    aiReport: internalPrep.aiReport
  }
}

export const convertType2ToUnified = (type2Project: any): Partial<UnifiedProject> => {
  return {
    // ID
    // _id: type2Project._id,

    // 通用必填字段
    department: type2Project.department || UnifiedProjectDepartmentEnum.DEPT_ONE,
    name: type2Project.name,
    projectType: UnifiedProjectTypeEnum.OTHER, // 可根据实际分类调整
    source: type2Project.source,
    importance: mapType2Importance(type2Project.importance),
    status: mapType2Status(type2Project.status),
    leader: LeaderEnum.TO_BE_DETERMINED,

    // 通用选填字段
    indication: type2Project.indication || '',
    transformRequirement: mapTransformMethod(type2Project.transformMethod),
    transformProgress: type2Project.transformProgress || TransformProgressEnum.CONTRACT_INCOMPLETE,
    hospitalDoctor: type2Project.hospitalPI || '',
    patent: type2Project.patent || '',
    clinicalData: type2Project.clinicalData || '',
    marketSize: type2Project.marketSize || '',
    competitorStatus: type2Project.competitorStatus || '',
    conclusion: type2Project.projectConclusion || '',
    
    // 其他类型特有字段

    // 其他类型必填字段
    startDate: type2Project.startDate,
    
    // 系统字段
    attachments: type2Project.attachments || [],
    createTime: type2Project.createTime,
    updateTime: type2Project.updateTime,
    createdBy: type2Project.createdBy,

    // AI报告
    aiReport: type2Project.aiReport
  }
}

/* ------------------------------------------------------------------------------------------ */

// 状态映射函数
const mapInternalPrepStatus = (oldStatus: string): 'early-stage' | 'preclinical' | 'clinical-stage' | 'market-product' => {
  const statusMap: Record<string, 'early-stage' | 'preclinical' | 'clinical-stage' | 'market-product'> = {
    'active': 'early-stage',
    'completed': 'market-product',
    'paused': 'early-stage'
  }
  return statusMap[oldStatus] || 'early-stage'
}

const mapType2Status = (oldStatus: string): 'early-stage' | 'preclinical' | 'clinical-stage' | 'market-product' => {
  const statusMap: Record<string, 'early-stage' | 'preclinical' | 'clinical-stage' | 'market-product'> = {
    'initial-assessment': 'early-stage',
    'project-approval': 'preclinical',
    'implementation': 'clinical-stage'
  }
  return statusMap[oldStatus] || 'early-stage'
}

const mapType2Importance = (oldImportance: string): 'very-important' | 'important' | 'normal' | 'not-important' => {
  const importanceMap: Record<string, 'very-important' | 'important' | 'normal' | 'not-important'> = {
    'very-important': 'very-important',
    'important': 'important',
    'normal': 'normal'
  }
  return importanceMap[oldImportance] || 'normal'
}

const mapTransformMethod = (oldMethod: string): 'license' | 'transfer' | 'company-operation' | 'other' => {
  // 旧值到新值的映射
  if (oldMethod === 'license-transfer' || oldMethod === '许可转让') return 'license'
  if (oldMethod === 'equity-investment' || oldMethod === 'trust-holding' || 
      oldMethod === 'trust-management' || oldMethod === 'license-transfer-cash' || 
      oldMethod === '代价入股' || oldMethod === '代持' || 
      oldMethod === '代持托管' || oldMethod === '许可转让现金') return 'transfer'
  if (oldMethod === 'company-operation' || oldMethod === '公司化运营') return 'company-operation'
  return 'other'  // to-be-determined 和其他未知值都映射为 other
}

/* ------------------------------------------------------------------------------------------ */

// 数据迁移相关函数
export const migrateInternalPreparationData = async (internalPrepData: any[]): Promise<Partial<UnifiedProject>[]> => {
  return internalPrepData.map(item => ({
    // ID
    // _id: item._id,
    
    // 通用必填字段
    department: item.department || UnifiedProjectDepartmentEnum.DEPT_ONE,
    name: item.name || '未命名院内制剂项目',
    projectType: UnifiedProjectTypeEnum.INTERNAL_PREPARATION,
    source: item.source || '未知来源',
    importance: UnifiedProjectImportanceEnum.VERY_IMPORTANT, // 默认值
    status: mapInternalPrepStatus(item.status || 'active'),
    leader: item.leader || LeaderEnum.TO_BE_DETERMINED,

    // 通用选填字段
    indication: item.indication || '',
    transformRequirement: item.transformRequirement || TransformRequirementEnum.OTHER,
    transformProgress: item.transformProgress || TransformProgressEnum.CONTRACT_INCOMPLETE,
    hospitalDoctor: item.hospitalDoctor || '',
    patent: item.patent || '',
    clinicalData: item.clinicalData || '',
    marketSize: item.dosage || '',
    competitorStatus: item.competitorStatus || '',
    conclusion: item.remarks || '',
    
    // 院内制剂特有字段

    // 院内制剂必填字段
    composition: item.composition || '',
    function: item.function || '',

    // 院内制剂选填字段
    specification: item.specification,
    duration: item.duration,
    recordNumber: item.recordNumber,
    
    // 系统字段
    attachments: item.attachments || [],
    createTime: item.createTime || new Date().toISOString(),
    updateTime: item.updateTime || new Date().toISOString(),
    createdBy: item.createdBy || '',

    // AI报告
    aiReport: item.aiReport
  }))
}

export const migrateType2ProjectData = async (type2Data: any[]): Promise<Partial<UnifiedProject>[]> => {
  return type2Data.map(item => ({
    // ID
    // _id: item._id,
    
    // 通用必填字段
    department: item.department || UnifiedProjectDepartmentEnum.DEPT_ONE,
    name: item.name || '未命名其他项目（除院内制剂）',
    projectType: UnifiedProjectTypeEnum.OTHER, // 可根据实际分类调整
    source: item.source || '未知来源',
    importance: mapType2Importance(item.importance || 'normal'),
    status: mapType2Status(item.status || 'initial-assessment'),
    leader: item.leader || LeaderEnum.TO_BE_DETERMINED,

    // 通用选填字段
    indication: item.indication || '',
    transformRequirement: mapTransformMethod(item.transformMethod),
    transformProgress: item.transformProgress || TransformProgressEnum.CONTRACT_INCOMPLETE,
    hospitalDoctor: item.hospitalPI || '',
    patent: item.patent || '',
    clinicalData: item.clinicalData || '',
    marketSize: item.marketSize || '',
    competitorStatus: item.competitorStatus || '',
    conclusion: item.projectConclusion || '',
    
    // 其他类型特有字段

    // 其他类型必填字段
    startDate: item.startDate || new Date().toISOString(),
    
    // 系统字段
    attachments: item.attachments || [],
    createTime: item.createTime || new Date().toISOString(),
    updateTime: item.updateTime || new Date().toISOString(),
    createdBy: item.createdBy || '',

    // AI报告
    aiReport: item.aiReport
  }))
}

/* ------------------------------------------------------------------------------------------ */

// 搜索和筛选辅助函数
export const buildProjectSearchQuery = (filters: {
  search?: string
  department?: string
  projectType?: string
  source?: string
  importance?: string
  status?: string
  leader?: string
}) => {
  const query: any = {}
  
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { source: { $regex: filters.search, $options: 'i' } },
      { leader: { $regex: filters.search, $options: 'i' } },
      { composition: { $regex: filters.search, $options: 'i' } },
      { function: { $regex: filters.search, $options: 'i' } }
    ]
  }
  
  if (filters.department) {
    query.department = filters.department
  }
  
  if (filters.projectType) {
    query.projectType = filters.projectType
  }

  if (filters.source) {
    query.source = { $regex: filters.source, $options: 'i' }
  }

  if (filters.importance) {
    query.importance = filters.importance
  }
  
  if (filters.status) {
    query.status = filters.status
  }
  
  if (filters.leader) {
    query.leader = { $regex: filters.leader, $options: 'i' }
  }
  
  return query
}

export const buildSearchQuery = buildProjectSearchQuery

/* ------------------------------------------------------------------------------------------ */

// 统计数据计算函数
export const calculateProjectStatistics = (projects: UnifiedProject[]) => {
  const stats = {
    total: projects.length,
    byDepartment: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    byImportance: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    recentCreated: 0
  }
  
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  
  projects.forEach(project => {
    // 按部门统计
    stats.byDepartment[project.department] = (stats.byDepartment[project.department] || 0) + 1
    
    // 按类型统计
    stats.byType[project.projectType] = (stats.byType[project.projectType] || 0) + 1
    
    // 按重要程度统计
    stats.byImportance[project.importance] = (stats.byImportance[project.importance] || 0) + 1
    
    // 按状态统计
    stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1
    
    // 近期创建统计
    if (new Date(project.createTime) > oneMonthAgo) {
      stats.recentCreated++
    }
  })
  
  return stats
}
