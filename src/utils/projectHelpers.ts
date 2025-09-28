import { UnifiedProject, UnifiedProjectTypeEnum, UnifiedProjectImportanceEnum, UnifiedProjectStatusEnum, UnifiedProjectTransformRequirementEnum, UnifiedProjectDepartmentEnum } from '@/types'

/* ------------------------------------------------------------------------------------------ */

// 项目类型判断函数
export const isInternalPreparation = (projectType: string): boolean => {
  return projectType === UnifiedProjectTypeEnum.INTERNAL_PREPARATION
}

export const requiresLeader = (projectType: string): boolean => {
  return !isInternalPreparation(projectType)
}

export const requiresStartDate = (projectType: string): boolean => {
  return !isInternalPreparation(projectType)
}

export const requiresFollowUpWeeks = (projectType: string): boolean => {
  return !isInternalPreparation(projectType)
}

export const requiresTransformRequirement = (projectType: string): boolean => {
  return !isInternalPreparation(projectType)
}

/* ------------------------------------------------------------------------------------------ */

// 显示名称转换函数
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

export const getTransformRequirementDisplayName = (requirement: string): string => {
  const requirementMap: Record<string, string> = {
    [UnifiedProjectTransformRequirementEnum.LICENSE_TRANSFER]: '许可转让',
    [UnifiedProjectTransformRequirementEnum.EQUITY_INVESTMENT]: '代价入股',
    [UnifiedProjectTransformRequirementEnum.TRUST_HOLDING]: '代持',
    [UnifiedProjectTransformRequirementEnum.TRUST_MANAGEMENT]: '代持托管',
    [UnifiedProjectTransformRequirementEnum.COMPANY_OPERATION]: '公司化运营',
    [UnifiedProjectTransformRequirementEnum.LICENSE_TRANSFER_CASH]: '许可转让现金',
    [UnifiedProjectTransformRequirementEnum.TO_BE_DETERMINED]: '待定'
  }
  return requirementMap[requirement] || requirement
}

export const getDepartmentDisplayName = (department: string): string => {
  const departmentMap: Record<string, string> = {
    [UnifiedProjectDepartmentEnum.DEPT_ONE]: '转移转化与投资一部',
    [UnifiedProjectDepartmentEnum.DEPT_TWO]: '转移转化与投资二部',
    [UnifiedProjectDepartmentEnum.DEPT_THREE]: '转移转化与投资三部'
  }
  return departmentMap[department] || department
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
    if (!project.leader?.trim()) {
      errors.push('该项目类型的负责人为必填项')
    }
    if (!project.startDate) {
      errors.push('该项目类型的开始日期为必填项')
    }
    if (!project.followUpWeeks || project.followUpWeeks <= 0) {
      errors.push('该项目类型的跟进时间为必填项且必须大于0')
    }
    if (!project.transformRequirement) {
      errors.push('该项目类型的转化需求为必填项')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/* ------------------------------------------------------------------------------------------ */

// 数据迁移辅助函数
export const convertInternalPreparationToUnified = (internalPrep: any): Partial<UnifiedProject> => {
  return {
    department: internalPrep.department || UnifiedProjectDepartmentEnum.DEPT_ONE,
    name: internalPrep.name,
    projectType: UnifiedProjectTypeEnum.INTERNAL_PREPARATION,
    source: internalPrep.source,
    importance: UnifiedProjectImportanceEnum.VERY_IMPORTANT, // 默认值
    status: mapInternalPrepStatus(internalPrep.status),
    
    // 院内制剂特有字段
    composition: internalPrep.composition,
    function: internalPrep.function,
    specification: internalPrep.specification,
    duration: internalPrep.duration,
    dosage: internalPrep.dosage,
    recordNumber: internalPrep.recordNumber,
    remarks: internalPrep.remarks,
    
    // 通用字段
    patent: internalPrep.patent,
    attachments: internalPrep.attachments || [],
    createTime: internalPrep.createTime,
    updateTime: internalPrep.updateTime,
    createdBy: internalPrep.createdBy,
    aiReport: internalPrep.aiReport
  }
}

export const convertType2ToUnified = (type2Project: any): Partial<UnifiedProject> => {
  return {
    department: type2Project.department || UnifiedProjectDepartmentEnum.DEPT_ONE,
    name: type2Project.name,
    projectType: UnifiedProjectTypeEnum.OTHER, // 可根据实际分类调整
    source: type2Project.source,
    importance: mapType2Importance(type2Project.importance),
    status: mapType2Status(type2Project.status),
    
    // 其他类型特有字段
    leader: type2Project.leader,
    startDate: type2Project.startDate,
    indication: type2Project.indication,
    followUpWeeks: type2Project.followUpWeeks,
    transformRequirement: mapTransformMethod(type2Project.transformMethod),
    hospitalDoctor: type2Project.hospitalPI,
    conclusion: type2Project.conclusion,
    
    // 通用字段
    attachments: type2Project.attachments || [],
    createTime: type2Project.createTime,
    updateTime: type2Project.updateTime,
    createdBy: type2Project.createdBy
  }
}

/* ------------------------------------------------------------------------------------------ */

// 状态映射函数
const mapInternalPrepStatus = (oldStatus: string): string => {
  const statusMap: Record<string, string> = {
    'active': UnifiedProjectStatusEnum.EARLY_STAGE,
    'completed': UnifiedProjectStatusEnum.MARKET_PRODUCT,
    'paused': UnifiedProjectStatusEnum.EARLY_STAGE
  }
  return statusMap[oldStatus] || UnifiedProjectStatusEnum.EARLY_STAGE
}

const mapType2Status = (oldStatus: string): string => {
  const statusMap: Record<string, string> = {
    'initial-assessment': UnifiedProjectStatusEnum.EARLY_STAGE,
    'project-approval': UnifiedProjectStatusEnum.PRECLINICAL,
    'implementation': UnifiedProjectStatusEnum.CLINICAL_STAGE
  }
  return statusMap[oldStatus] || UnifiedProjectStatusEnum.EARLY_STAGE
}

const mapType2Importance = (oldImportance: string): string => {
  const importanceMap: Record<string, string> = {
    'very-important': UnifiedProjectImportanceEnum.VERY_IMPORTANT,
    'important': UnifiedProjectImportanceEnum.IMPORTANT,
    'normal': UnifiedProjectImportanceEnum.NORMAL
  }
  return importanceMap[oldImportance] || UnifiedProjectImportanceEnum.NORMAL
}

const mapTransformMethod = (oldMethod: string): string => {
  // 根据实际业务逻辑映射转化方式
  return UnifiedProjectTransformRequirementEnum.TO_BE_DETERMINED
}

/* ------------------------------------------------------------------------------------------ */

// 搜索和筛选辅助函数
export const buildProjectSearchQuery = (filters: {
  search?: string
  projectType?: string
  department?: string
  importance?: string
  status?: string
  leader?: string
}) => {
  const query: any = {}
  
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { source: { $regex: filters.search, $options: 'i' } },
      { leader: { $regex: filters.search, $options: 'i' } }
    ]
  }
  
  if (filters.projectType) {
    query.projectType = filters.projectType
  }
  
  if (filters.department) {
    query.department = filters.department
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

/* ------------------------------------------------------------------------------------------ */

// 统计数据计算函数
export const calculateProjectStatistics = (projects: UnifiedProject[]) => {
  const stats = {
    total: projects.length,
    byType: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    byImportance: {} as Record<string, number>,
    byDepartment: {} as Record<string, number>,
    recentCreated: 0
  }
  
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  
  projects.forEach(project => {
    // 按类型统计
    stats.byType[project.projectType] = (stats.byType[project.projectType] || 0) + 1
    
    // 按状态统计
    stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1
    
    // 按重要程度统计
    stats.byImportance[project.importance] = (stats.byImportance[project.importance] || 0) + 1
    
    // 按部门统计
    stats.byDepartment[project.department] = (stats.byDepartment[project.department] || 0) + 1
    
    // 近期创建统计
    if (new Date(project.createTime) > oneMonthAgo) {
      stats.recentCreated++
    }
  })
  
  return stats
}
