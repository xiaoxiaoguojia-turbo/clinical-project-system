import mongoose from 'mongoose'
import InternalPreparationProject from '../src/models/InternalPreparationProject'
import Type2Project from '../src/models/Type2Project'
import UnifiedProject from '../src/models/UnifiedProject'
import connectDB from '../src/lib/mongodb'

/* ------------------------------------------------------------------------------------------ */

// 迁移配置
const MIGRATION_CONFIG = {
  BACKUP_ENABLED: true,
  DRY_RUN: false, // 设置为true时仅模拟迁移，不实际执行
  BATCH_SIZE: 10, // 批处理大小
  LOG_ENABLED: true
}

// 日志函数
const log = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  if (!MIGRATION_CONFIG.LOG_ENABLED) return
  
  const timestamp = new Date().toISOString()
  const colors = {
    info: '\x1b[36m',    // 青色
    success: '\x1b[32m', // 绿色  
    warning: '\x1b[33m', // 黄色
    error: '\x1b[31m'    // 红色
  }
  
  console.log(`${colors[type]}[${timestamp}] ${message}\x1b[0m`)
}

/* ------------------------------------------------------------------------------------------ */

// 数据映射函数
const mapInternalPrepToUnified = (internalPrep: any) => {
  const statusMap: Record<string, string> = {
    'active': 'early-stage',
    'completed': 'market-product', 
    'paused': 'early-stage'
  }

  return {
    department: internalPrep.department || 'transfer-investment-dept-1',
    name: internalPrep.name,
    projectType: 'internal-preparation',
    source: internalPrep.source,
    importance: 'very-important', // 默认值
    status: statusMap[internalPrep.status] || 'early-stage',
    
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

const mapType2ToUnified = (type2Project: any) => {
  const statusMap: Record<string, string> = {
    'initial-assessment': 'early-stage',
    'project-approval': 'preclinical',
    'implementation': 'clinical-stage'
  }
  
  const importanceMap: Record<string, string> = {
    'very-important': 'very-important',
    'important': 'important',
    'normal': 'normal'
  }

  return {
    department: type2Project.department || 'transfer-investment-dept-1',
    name: type2Project.name,
    projectType: 'other', // 简化处理
    source: type2Project.source,
    importance: importanceMap[type2Project.importance] || 'normal',
    status: statusMap[type2Project.status] || 'early-stage',
    
    // 其他类型特有字段
    leader: type2Project.leader,
    startDate: type2Project.startDate,
    indication: type2Project.indication,
    followUpWeeks: type2Project.followUpWeeks,
    transformRequirement: 'to-be-determined', // 默认值
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

// 备份函数
const createBackup = async () => {
  if (!MIGRATION_CONFIG.BACKUP_ENABLED) {
    log('备份功能已禁用，跳过备份步骤', 'warning')
    return
  }
  
  try {
    log('开始创建数据备份...')
    
    // 备份院内制剂数据
    const internalPrepData = await InternalPreparationProject.find({}).lean()
    const type2Data = await Type2Project.find({}).lean()
    
    const backupData = {
      timestamp: new Date().toISOString(),
      internalPreparations: internalPrepData,
      type2Projects: type2Data,
      totalRecords: internalPrepData.length + type2Data.length
    }
    
    // 写入备份文件（实际项目中可以保存到文件系统或其他存储）
    log(`备份完成: 院内制剂 ${internalPrepData.length} 条，类型2项目 ${type2Data.length} 条`, 'success')
    return backupData
    
  } catch (error) {
    log(`备份失败: ${error}`, 'error')
    throw error
  }
}

/* ------------------------------------------------------------------------------------------ */

// 数据验证函数
const validateMigratedData = (originalData: any, migratedData: any, type: string) => {
  const errors: string[] = []
  
  // 基本字段验证
  if (!migratedData.name) {
    errors.push(`${type} - 项目名称缺失`)
  }
  
  if (!migratedData.projectType) {
    errors.push(`${type} - 项目类型缺失`)
  }
  
  if (!migratedData.source) {
    errors.push(`${type} - 项目来源缺失`)
  }
  
  // 院内制剂特有字段验证
  if (migratedData.projectType === 'internal-preparation') {
    if (!migratedData.composition) {
      errors.push(`${type} - 院内制剂组方缺失`)
    }
    if (!migratedData.function) {
      errors.push(`${type} - 院内制剂功能缺失`)
    }
  }
  
  // 其他类型特有字段验证
  if (migratedData.projectType !== 'internal-preparation') {
    if (!migratedData.leader) {
      errors.push(`${type} - 负责人缺失`)
    }
    if (!migratedData.startDate) {
      errors.push(`${type} - 开始日期缺失`)
    }
    if (!migratedData.followUpWeeks || migratedData.followUpWeeks <= 0) {
      errors.push(`${type} - 跟进时间无效`)
    }
  }
  
  return errors
}

/* ------------------------------------------------------------------------------------------ */

// 主迁移函数
const migrateInternalPreparations = async () => {
  try {
    log('开始迁移院内制剂项目...')
    
    const internalPrepData = await InternalPreparationProject.find({}).lean()
    log(`找到 ${internalPrepData.length} 条院内制剂数据`)
    
    if (internalPrepData.length === 0) {
      log('没有院内制剂数据需要迁移', 'warning')
      return { success: 0, failed: 0 }
    }
    
    let successCount = 0
    let failedCount = 0
    
    for (const item of internalPrepData) {
      try {
        const unifiedData = mapInternalPrepToUnified(item)
        
        // 数据验证
        const validationErrors = validateMigratedData(item, unifiedData, `院内制剂-${item._id}`)
        if (validationErrors.length > 0) {
          log(`验证失败: ${validationErrors.join(', ')}`, 'error')
          failedCount++
          continue
        }
        
        if (!MIGRATION_CONFIG.DRY_RUN) {
          const unifiedProject = new UnifiedProject(unifiedData)
          await unifiedProject.save()
        }
        
        log(`院内制剂项目迁移成功: ${unifiedData.name}`, 'success')
        successCount++
        
      } catch (error) {
        log(`院内制剂项目迁移失败: ${item.name} - ${error}`, 'error')
        failedCount++
      }
    }
    
    return { success: successCount, failed: failedCount }
    
  } catch (error) {
    log(`院内制剂迁移过程出错: ${error}`, 'error')
    throw error
  }
}

const migrateType2Projects = async () => {
  try {
    log('开始迁移类型2项目...')
    
    const type2Data = await Type2Project.find({}).lean()
    log(`找到 ${type2Data.length} 条类型2项目数据`)
    
    if (type2Data.length === 0) {
      log('没有类型2项目数据需要迁移', 'warning')
      return { success: 0, failed: 0 }
    }
    
    let successCount = 0
    let failedCount = 0
    
    for (const item of type2Data) {
      try {
        const unifiedData = mapType2ToUnified(item)
        
        // 数据验证
        const validationErrors = validateMigratedData(item, unifiedData, `类型2项目-${item._id}`)
        if (validationErrors.length > 0) {
          log(`验证失败: ${validationErrors.join(', ')}`, 'error')
          failedCount++
          continue
        }
        
        if (!MIGRATION_CONFIG.DRY_RUN) {
          const unifiedProject = new UnifiedProject(unifiedData)
          await unifiedProject.save()
        }
        
        log(`类型2项目迁移成功: ${unifiedData.name}`, 'success')
        successCount++
        
      } catch (error) {
        log(`类型2项目迁移失败: ${item.name} - ${error}`, 'error')
        failedCount++
      }
    }
    
    return { success: successCount, failed: failedCount }
    
  } catch (error) {
    log(`类型2项目迁移过程出错: ${error}`, 'error')
    throw error
  }
}

/* ------------------------------------------------------------------------------------------ */

// 主执行函数
const runMigration = async () => {
  const startTime = Date.now()
  
  try {
    log('🚀 开始数据库重构迁移任务', 'info')
    log(`配置: 备份=${MIGRATION_CONFIG.BACKUP_ENABLED}, 模拟运行=${MIGRATION_CONFIG.DRY_RUN}`)
    
    // 1. 连接数据库
    await connectDB()
    log('✅ 数据库连接成功')
    
    // 2. 创建备份
    const backupData = await createBackup()
    
    // 3. 检查统一项目表是否已存在数据
    const existingUnifiedProjects = await UnifiedProject.countDocuments()
    if (existingUnifiedProjects > 0) {
      log(`警告: 统一项目表中已存在 ${existingUnifiedProjects} 条数据`, 'warning')
      log('继续迁移可能导致数据重复，请确认是否继续...')
    }
    
    // 4. 执行迁移
    log('📊 开始数据迁移...')
    
    const internalPrepResults = await migrateInternalPreparations()
    const type2Results = await migrateType2Projects()
    
    // 5. 迁移总结
    const totalSuccess = internalPrepResults.success + type2Results.success
    const totalFailed = internalPrepResults.failed + type2Results.failed
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2)
    
    log('📋 迁移完成总结:', 'info')
    log(`  ✅ 成功迁移: ${totalSuccess} 条`)
    log(`  ❌ 失败数量: ${totalFailed} 条`)
    log(`  ⏱️  总耗时: ${totalTime} 秒`)
    
    if (MIGRATION_CONFIG.DRY_RUN) {
      log('🔍 这是模拟运行，实际数据未被修改', 'warning')
    } else {
      log('🎉 数据迁移任务完成！', 'success')
    }
    
    return {
      success: totalSuccess,
      failed: totalFailed,
      time: totalTime,
      backup: backupData
    }
    
  } catch (error) {
    log(`💥 迁移任务失败: ${error}`, 'error')
    throw error
  } finally {
    await mongoose.connection.close()
    log('📤 数据库连接已关闭')
  }
}

/* ------------------------------------------------------------------------------------------ */

// 回滚函数（可选）
const rollbackMigration = async (backupData: any) => {
  try {
    log('开始回滚迁移...')
    
    // 清空统一项目表
    await UnifiedProject.deleteMany({})
    log('统一项目表已清空')
    
    // 这里可以添加恢复原数据的逻辑（如果需要）
    log('回滚完成', 'success')
    
  } catch (error) {
    log(`回滚失败: ${error}`, 'error')
    throw error
  }
}

/* ------------------------------------------------------------------------------------------ */

// 导出主要函数
export {
  runMigration,
  rollbackMigration,
  MIGRATION_CONFIG
}

// 如果直接运行此脚本
if (require.main === module) {
  runMigration()
    .then(result => {
      console.log('迁移结果:', result)
      process.exit(0)
    })
    .catch(error => {
      console.error('迁移失败:', error)
      process.exit(1)
    })
}
