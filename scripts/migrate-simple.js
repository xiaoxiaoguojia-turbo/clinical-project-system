const mongoose = require('mongoose')

// 简化的迁移配置
const MIGRATION_CONFIG = {
  DRY_RUN: false,
  LOG_ENABLED: true
}

// 日志函数
const log = (message, type = 'info') => {
  if (!MIGRATION_CONFIG.LOG_ENABLED) return
  
  const timestamp = new Date().toISOString()
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m', 
    warning: '\x1b[33m',
    error: '\x1b[31m'
  }
  
  console.log(`${colors[type]}[${timestamp}] ${message}\x1b[0m`)
}

// 数据库连接
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinical_project_system'
    console.log('MongoDB URI:', process.env.MONGODB_URI)
    console.log('MongoDB URI:', mongoURI)
    await mongoose.connect(mongoURI)
    log('✅ 数据库连接成功')
  } catch (error) {
    log(`❌ 数据库连接失败: ${error.message}`, 'error')
    throw error
  }
}

// 定义原始Schema（用于读取现有数据）
const createOriginalSchemas = () => {
  // 院内制剂项目Schema
  if (!mongoose.models.InternalPreparationProject) {
    const internalPrepSchema = new mongoose.Schema({
      department: String,
      source: String,
      name: String,
      composition: String,
      function: String,
      specification: String,
      duration: String,
      dosage: String,
      recordNumber: String,
      remarks: String,
      patent: String,
      status: String,
      attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
      createTime: Date,
      updateTime: Date,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      aiReport: {
        reportUrl: String,
        status: String,
        firstGeneratedAt: Date,
        lastGeneratedAt: Date
      }
    })
    mongoose.model('InternalPreparationProject', internalPrepSchema)
  }

  // 类型2项目Schema
  if (!mongoose.models.Type2Project) {
    const type2Schema = new mongoose.Schema({
      department: String,
      source: String,
      name: String,
      category: String,
      leader: String,
      startDate: Date,
      indication: String,
      followUpWeeks: Number,
      hospitalPI: String,
      conclusion: String,
      importance: String,
      status: String,
      attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
      createTime: Date,
      updateTime: Date,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    })
    mongoose.model('Type2Project', type2Schema)
  }

  // 统一项目Schema
  if (!mongoose.models.UnifiedProject) {
    const unifiedSchema = new mongoose.Schema({
      department: String,
      name: { type: String, required: true },
      projectType: { type: String, required: true },
      source: { type: String, required: true },
      importance: String,
      status: String,
      
      // 院内制剂特有字段
      composition: String,
      function: String,
      specification: String,
      duration: String,
      dosage: String,
      recordNumber: String,
      remarks: String,
      
      // 其他类型特有字段
      leader: String,
      startDate: Date,
      indication: String,
      followUpWeeks: Number,
      transformRequirement: String,
      hospitalDoctor: String,
      conclusion: String,
      
      // 通用字段
      patent: String,
      attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
      createTime: { type: Date, default: Date.now },
      updateTime: { type: Date, default: Date.now },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      aiReport: {
        reportUrl: String,
        status: { type: String, default: 'idle' },
        firstGeneratedAt: Date,
        lastGeneratedAt: Date
      }
    })
    mongoose.model('UnifiedProject', unifiedSchema)
  }
}

// 数据映射函数
const mapInternalPrepToUnified = (item) => ({
  department: item.department || 'transfer-investment-dept-1',
  name: item.name,
  projectType: 'internal-preparation',
  source: item.source,
  importance: 'very-important',
  status: item.status === 'completed' ? 'market-product' : 'early-stage',
  
  // 院内制剂特有字段
  composition: item.composition,
  function: item.function,
  specification: item.specification,
  duration: item.duration,
  dosage: item.dosage,
  recordNumber: item.recordNumber,
  remarks: item.remarks,
  
  // 通用字段
  patent: item.patent,
  attachments: item.attachments || [],
  createTime: item.createTime,
  updateTime: item.updateTime,
  createdBy: item.createdBy,
  aiReport: item.aiReport
})

const mapType2ToUnified = (item) => ({
  department: item.department || 'transfer-investment-dept-1',
  name: item.name,
  projectType: 'other',
  source: item.source,
  importance: item.importance || 'normal',
  status: item.status === 'implementation' ? 'clinical-stage' : 'early-stage',
  
  // 其他类型特有字段
  leader: item.leader,
  startDate: item.startDate,
  indication: item.indication,
  followUpWeeks: item.followUpWeeks,
  transformRequirement: 'to-be-determined',
  hospitalDoctor: item.hospitalPI,
  conclusion: item.conclusion,
  
  // 通用字段
  attachments: item.attachments || [],
  createTime: item.createTime,
  updateTime: item.updateTime,
  createdBy: item.createdBy
})

// 主迁移函数
const runMigration = async () => {
  const startTime = Date.now()
  
  try {
    log('🚀 开始数据库重构迁移任务')
    log(`配置: 模拟运行=${MIGRATION_CONFIG.DRY_RUN}`)
    
    // 连接数据库
    await connectDB()
    
    // 创建Schema定义
    createOriginalSchemas()
    
    // 获取模型
    const InternalPreparationProject = mongoose.model('InternalPreparationProject')
    const Type2Project = mongoose.model('Type2Project')
    const UnifiedProject = mongoose.model('UnifiedProject')
    
    // 检查现有数据
    const internalPrepData = await InternalPreparationProject.find({}).lean()
    const type2Data = await Type2Project.find({}).lean()
    
    log(`找到院内制剂数据: ${internalPrepData.length} 条`)
    log(`找到类型2项目数据: ${type2Data.length} 条`)
    
    if (internalPrepData.length === 0 && type2Data.length === 0) {
      log('⚠️ 没有数据需要迁移', 'warning')
      return { success: 0, failed: 0 }
    }
    
    let totalSuccess = 0
    let totalFailed = 0
    
    // 迁移院内制剂数据
    for (const item of internalPrepData) {
      try {
        const unifiedData = mapInternalPrepToUnified(item)
        
        if (!MIGRATION_CONFIG.DRY_RUN) {
          const unifiedProject = new UnifiedProject(unifiedData)
          await unifiedProject.save()
        }
        
        log(`✅ 院内制剂迁移成功: ${unifiedData.name}`, 'success')
        totalSuccess++
        
      } catch (error) {
        log(`❌ 院内制剂迁移失败: ${item.name} - ${error.message}`, 'error')
        totalFailed++
      }
    }
    
    // 迁移类型2项目数据
    for (const item of type2Data) {
      try {
        const unifiedData = mapType2ToUnified(item)
        
        if (!MIGRATION_CONFIG.DRY_RUN) {
          const unifiedProject = new UnifiedProject(unifiedData)
          await unifiedProject.save()
        }
        
        log(`✅ 类型2项目迁移成功: ${unifiedData.name}`, 'success')
        totalSuccess++
        
      } catch (error) {
        log(`❌ 类型2项目迁移失败: ${item.name} - ${error.message}`, 'error')
        totalFailed++
      }
    }
    
    // 迁移总结
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2)
    
    log('📋 迁移完成总结:')
    log(`  ✅ 成功迁移: ${totalSuccess} 条`)
    log(`  ❌ 失败数量: ${totalFailed} 条`)
    log(`  ⏱️ 总耗时: ${totalTime} 秒`)
    
    if (MIGRATION_CONFIG.DRY_RUN) {
      log('🔍 这是模拟运行，实际数据未被修改', 'warning')
    } else {
      log('🎉 数据迁移任务完成！', 'success')
    }
    
    return { success: totalSuccess, failed: totalFailed, time: totalTime }
    
  } catch (error) {
    log(`💥 迁移任务失败: ${error.message}`, 'error')
    throw error
  } finally {
    await mongoose.connection.close()
    log('📤 数据库连接已关闭')
  }
}

// 执行迁移
if (require.main === module) {
  runMigration()
    .then(result => {
      console.log('\n迁移结果:', result)
      process.exit(0)
    })
    .catch(error => {
      console.error('\n迁移失败:', error)
      process.exit(1)
    })
}

module.exports = { runMigration }
