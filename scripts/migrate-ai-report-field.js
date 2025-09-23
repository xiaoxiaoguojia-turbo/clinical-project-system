/**
 * 数据迁移脚本：为院内制剂项目添加 aiReport 字段
 * 
 * 目的：为现有的 InternalPreparationProject 记录添加 aiReport 字段
 * 运行方式：node scripts/migrate-ai-report-field.js
 */

const mongoose = require('mongoose')

/* ------------------------------------------------------------------------------------------ */
// 数据库连接配置
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinical-project-system'

// AI报告字段默认值
const DEFAULT_AI_REPORT = {
  reportUrl: null,
  status: 'idle',
  firstGeneratedAt: null,
  lastGeneratedAt: null
}

/* ------------------------------------------------------------------------------------------ */

/**
 * 连接数据库
 */
async function connectDB() {
  try {
    await mongoose.connect(DB_URI)
    console.log('✅ 数据库连接成功')
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    process.exit(1)
  }
}

/**
 * 执行数据迁移
 */
async function migrateAIReportField() {
  try {
    console.log('🚀 开始执行数据迁移...')
    
    // 获取数据库中的院内制剂项目集合
    const db = mongoose.connection.db
    const collection = db.collection('internalpreparationprojects')
    
    // 步骤1：检查现有数据
    const totalCount = await collection.countDocuments()
    console.log(`📊 数据库中共有 ${totalCount} 条院内制剂项目记录`)
    
    // 步骤2：查找没有 aiReport 字段的记录
    const recordsWithoutAIReport = await collection.countDocuments({
      aiReport: { $exists: false }
    })
    console.log(`🔍 需要迁移的记录数量: ${recordsWithoutAIReport}`)
    
    if (recordsWithoutAIReport === 0) {
      console.log('✅ 所有记录都已包含 aiReport 字段，无需迁移')
      return
    }
    
    // 步骤3：执行批量更新
    console.log('🔄 开始批量更新记录...')
    
    const updateResult = await collection.updateMany(
      { aiReport: { $exists: false } }, // 查询条件：没有 aiReport 字段的记录
      { $set: { aiReport: DEFAULT_AI_REPORT } } // 更新操作：添加默认的 aiReport 字段
    )
    
    // 步骤4：验证迁移结果
    console.log(`✅ 迁移完成！`)
    console.log(`   - 匹配的记录数: ${updateResult.matchedCount}`)
    console.log(`   - 实际更新的记录数: ${updateResult.modifiedCount}`)
    
    // 步骤5：最终验证
    const finalCount = await collection.countDocuments({
      aiReport: { $exists: true }
    })
    console.log(`✅ 验证结果: ${finalCount} 条记录现在包含 aiReport 字段`)
    
    // 步骤6：显示示例记录
    console.log('\n📋 迁移后的示例记录:')
    const sampleRecord = await collection.findOne(
      { aiReport: { $exists: true } },
      { name: 1, aiReport: 1 }
    )
    
    if (sampleRecord) {
      console.log(JSON.stringify(sampleRecord, null, 2))
    }
    
  } catch (error) {
    console.error('❌ 数据迁移执行失败:', error.message)
    console.error('详细错误信息:', error)
    throw error
  }
}

/**
 * 关闭数据库连接
 */
async function closeDB() {
  try {
    await mongoose.connection.close()
    console.log('✅ 数据库连接已关闭')
  } catch (error) {
    console.error('❌ 关闭数据库连接失败:', error.message)
  }
}

/* ------------------------------------------------------------------------------------------ */

/**
 * 主执行函数
 */
async function main() {
  console.log('=' .repeat(60))
  console.log('🏥 院内制剂项目 AI报告字段迁移脚本')
  console.log('=' .repeat(60))
  
  try {
    // 连接数据库
    await connectDB()
    
    // 执行迁移
    await migrateAIReportField()
    
    console.log('\n🎉 数据迁移成功完成！')
    
  } catch (error) {
    console.error('\n💥 数据迁移失败!')
    console.error('错误信息:', error.message)
    process.exit(1)
  } finally {
    // 关闭数据库连接
    await closeDB()
  }
}

// 如果直接运行此脚本，则执行主函数
if (require.main === module) {
  main()
}

module.exports = {
  migrateAIReportField,
  DEFAULT_AI_REPORT
}
