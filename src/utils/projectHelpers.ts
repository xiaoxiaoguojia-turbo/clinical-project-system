import { LeaderEnum } from '@/models/UnifiedProject'
import { 
  UnifiedProject, 
  UnifiedProjectTypeEnum, 
  UnifiedProjectImportanceEnum, 
  UnifiedProjectStatusEnum,
  UnifiedProjectDepartmentEnum,
  UnifiedProjectLeaderEnum,
  TransformRequirementTypeEnum,
  TransformRequirementProgressNodesMap,
  TransformRequirement
} from '@/types'

/* ------------------------------------------------------------------------------------------ */

// 项目类型判断函数
export const isChineseMedicineModernization = (projectType: string): boolean => {
  return projectType === UnifiedProjectTypeEnum.CHINESE_MEDICINE_MODERNIZATION
}

// 向后兼容的别名（保留一段时间）
export const isInternalPreparation = isChineseMedicineModernization
export const isInternalPreparationType = isChineseMedicineModernization

export const requiresLeader = (projectType: string): boolean => {
  return true  // leader现在是通用必填字段，所有项目类型都需要
}

export const requiresStartDate = (projectType: string): boolean => {
  // 中药现代化和医疗器械不需要 startDate
  return !isChineseMedicineModernization(projectType) && projectType !== 'medical-device'
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
    [UnifiedProjectTypeEnum.CHINESE_MEDICINE_MODERNIZATION]: '中药现代化',
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
    [UnifiedProjectImportanceEnum.NORMAL]: '一般'
    // 删除了 NOT_IMPORTANT
  }
  return importanceMap[importance] || importance
}

// 根据项目类型获取状态显示名称
export const getStatusDisplayName = (status: string, projectType?: string): string => {
  const statusMap: Record<string, string> = {
    // 中药现代化状态
    'hospital-preparation': '院内制剂',
    'experience-formula': '经验方',
    'protocol-formula': '协定方',
    'early-research': '早期研究',
    // 医疗器械状态
    'sample-design': '样品设计',
    'type-inspection': '型检',
    // 通用状态
    'early-stage': '早期',
    'preclinical': '临床前',
    'clinical-stage': '临床阶段',
    'market-product': '上市产品'
  }
  return statusMap[status] || status
}

// 根据项目类型获取有效的状态选项
export const getValidStatusOptions = (projectType: string): string[] => {
  if (projectType === UnifiedProjectTypeEnum.CHINESE_MEDICINE_MODERNIZATION) {
    return Object.values(UnifiedProjectStatusEnum.CHINESE_MEDICINE)
  } else if (projectType === 'medical-device') {
    return Object.values(UnifiedProjectStatusEnum.MEDICAL_DEVICE)
  } else {
    return Object.values(UnifiedProjectStatusEnum.OTHER)
  }
}

export const getLeaderDisplayName = (leader: string): string => {
  const leaderMap: Record<string, string> = {
    [UnifiedProjectLeaderEnum.YANGFENG]: '杨锋',
    [UnifiedProjectLeaderEnum.QINQINGSONG]: '秦青松',
    [UnifiedProjectLeaderEnum.HAOJINGJING]: '郝菁菁',
    [UnifiedProjectLeaderEnum.CHENLONG]: '陈栊',
    [UnifiedProjectLeaderEnum.WANGLIYAN]: '王立言',
    [UnifiedProjectLeaderEnum.MAOSHIWEI]: '毛世伟',
    [UnifiedProjectLeaderEnum.XIAOLANCHUAN]: '肖蓝川',
    [UnifiedProjectLeaderEnum.TO_BE_DETERMINED]: '待定'
  }
  return leaderMap[leader] || leader
}

// 转化需求类型显示名称
export const getTransformRequirementTypeDisplayName = (type: string): string => {
  const typeMap: Record<string, string> = {
    [TransformRequirementTypeEnum.INVESTMENT]: '投资',
    [TransformRequirementTypeEnum.COMPANY_OPERATION]: '公司化运营',
    [TransformRequirementTypeEnum.LICENSE_TRANSFER]: '许可转让',
    [TransformRequirementTypeEnum.PENDING]: '待推进'
  }
  return typeMap[type] || type
}

// 根据转化需求类型获取进展节点选项
export const getProgressNodesForRequirementType = (type: string): readonly string[] => {
  return TransformRequirementProgressNodesMap[type as keyof typeof TransformRequirementProgressNodesMap] || []
}

// 验证转化需求数据
export const validateTransformRequirements = (requirements: TransformRequirement[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!requirements || requirements.length === 0) {
    errors.push('转化需求列表不能为空')
    return { isValid: false, errors }
  }
  
  requirements.forEach((req, index) => {
    if (!req.type) {
      errors.push(`转化需求 ${index + 1}: 缺少类型`)
    }
    
    // 待推进类型可以没有进展节点
    if (req.type !== 'pending' && !req.currentProgress) {
      errors.push(`转化需求 ${index + 1}: 缺少当前进展节点`)
    }
    
    // 验证进展节点是否有效
    if (req.type && req.currentProgress) {
      const validNodes = getProgressNodesForRequirementType(req.type)
      if (validNodes.length > 0 && !validNodes.includes(req.currentProgress)) {
        errors.push(`转化需求 ${index + 1}: 进展节点 "${req.currentProgress}" 不是有效选项`)
      }
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/* ------------------------------------------------------------------------------------------ */

// 项目数据验证函数
export const validateProjectData = (project: Partial<UnifiedProject>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // 通用必填字段
  if (!project.department) errors.push('归属部门为必填项')
  if (!project.name) errors.push('项目名称为必填项')
  if (!project.projectType) errors.push('项目分类型为必填项')
  if (!project.source) errors.push('医院来源为必填项')
  if (!project.importance) errors.push('重要程度为必填项')
  if (!project.status) errors.push('项目进展状态为必填项')
  if (!project.leader) errors.push('负责人为必填项')
  
  // 验证转化需求列表（必填）
  if (!project.transformRequirements || project.transformRequirements.length === 0) {
    errors.push('转化需求列表为必填项')
  } else {
    const reqValidation = validateTransformRequirements(project.transformRequirements)
    if (!reqValidation.isValid) {
      errors.push(...reqValidation.errors)
    }
  }

  // 中药现代化特有必填字段
  if (isChineseMedicineModernization(project.projectType || '')) {
    if (!project.composition) errors.push('中药现代化项目的组方为必填项')
    if (!project.function) errors.push('中药现代化项目的功能为必填项')
  }

  // 其他类型必填字段
  if (requiresStartDate(project.projectType || '')) {
    if (!project.startDate) errors.push('该项目类型的开始日期为必填项')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// 报告生成数据验证函数
export const validateProjectDataForReport = (project: Partial<UnifiedProject>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // 基础必填字段验证
  if (!project.department?.trim()) errors.push('部门信息不能为空')
  if (!project.source?.trim()) errors.push('来源信息不能为空')
  if (!project.name?.trim()) errors.push('药方名称不能为空')
  
  // 中药现代化特有字段验证
  if (!project.composition?.trim()) errors.push('组方信息不能为空')
  if (!project.function?.trim()) errors.push('功能信息不能为空')
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const getRequiredFieldsForType = (projectType: string): string[] => {
  if (isChineseMedicineModernization(projectType)) {
    return ['composition', 'function']
  } else {
    return ['startDate']
  }
}

/* ------------------------------------------------------------------------------------------ */

// 状态映射函数
export const mapInternalPrepStatus = (oldStatus: string): string => {
  const statusMap: Record<string, string> = {
    'early-stage': 'hospital-preparation',
    'preclinical': 'experience-formula',
    'clinical-stage': 'protocol-formula',
    'market-product': 'early-research'
  }
  return statusMap[oldStatus] || 'hospital-preparation'
}

export const mapTransformMethod = (oldMethod: string): string => {
  const methodMap: Record<string, string> = {
    'license': 'license-transfer',
    'transfer': 'license-transfer',
    'company-operation': 'company-operation',
    'licensing': 'license-transfer',
    'other': 'pending'
  }
  return methodMap[oldMethod] || 'pending'
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
  transformRequirementType?: string
}) => {
  const query: any = {}

  // 搜索关键词（支持项目名称、组方、功能等字段）
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { composition: { $regex: filters.search, $options: 'i' } },
      { function: { $regex: filters.search, $options: 'i' } },
      { source: { $regex: filters.search, $options: 'i' } },
      { indication: { $regex: filters.search, $options: 'i' } }
    ]
  }

  // 精确匹配筛选
  if (filters.department) query.department = filters.department
  if (filters.projectType) query.projectType = filters.projectType
  if (filters.source) query.source = { $regex: filters.source, $options: 'i' }
  if (filters.importance) query.importance = filters.importance
  if (filters.status) query.status = filters.status
  if (filters.leader) query.leader = filters.leader
  
  // 转化需求类型筛选
  if (filters.transformRequirementType) {
    query['transformRequirements.type'] = filters.transformRequirementType
  }

  return query
}

export const buildSearchQuery = buildProjectSearchQuery

/* ------------------------------------------------------------------------------------------ */

// 统计数据计算函数
export const calculateProjectStatistics = (projects: UnifiedProject[]) => {
  return {
    total: projects.length,
    byProjectType: calculateByField(projects, 'projectType'),
    byDepartment: calculateByField(projects, 'department'),
    byImportance: calculateByField(projects, 'importance'),
    byStatus: calculateByField(projects, 'status'),
    byLeader: calculateByField(projects, 'leader'),
    byTransformRequirementType: calculateTransformRequirementTypeStats(projects)
  }
}

const calculateByField = (projects: UnifiedProject[], field: keyof UnifiedProject) => {
  const counts: Record<string, number> = {}
  projects.forEach(project => {
    const value = project[field] as string
    if (value) {
      counts[value] = (counts[value] || 0) + 1
    }
  })
  return Object.entries(counts).map(([key, value]) => ({
    label: key,
    value
  }))
}

const calculateTransformRequirementTypeStats = (projects: UnifiedProject[]) => {
  const counts: Record<string, number> = {}
  projects.forEach(project => {
    if (project.transformRequirements) {
      project.transformRequirements.forEach(req => {
        counts[req.type] = (counts[req.type] || 0) + 1
      })
    }
  })
  return Object.entries(counts).map(([key, value]) => ({
    label: key,
    value
  }))
}
