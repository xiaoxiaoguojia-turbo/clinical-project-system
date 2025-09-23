/**
 * 数据迁移验证脚本：检查 aiReport 字段迁移结果
 * 
 * 运行方式：node scripts/verify-migration.js
 */

const mongoose = require('mongoose')

/* ------------------------------------------------------------------------------------------ */
// 数据库连接配置
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinical_project_system'

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
 * 验证迁移结果
 */
async function verifyMigration() {
  try {
    const db = mongoose.connection.db
    const collection = db.collection('internalpreparationprojects')
    
    console.log('🔍 开始验证数据迁移结果...')
    
    // 统计总记录数
    const totalCount = await collection.countDocuments()
    console.log(`📊 总记录数: ${totalCount}`)
    
    // 统计有 aiReport 字段的记录
    const recordsWithAIReport = await collection.countDocuments({
      aiReport: { $exists: true }
    })
    console.log(`✅ 包含 aiReport 字段的记录: ${recordsWithAIReport}`)
    
    // 统计没有 aiReport 字段的记录
    const recordsWithoutAIReport = totalCount - recordsWithAIReport
    console.log(`❌ 缺少 aiReport 字段的记录: ${recordsWithoutAIReport}`)
    
    // 按状态统计
    const statusStats = await collection.aggregate([
      { $match: { aiReport: { $exists: true } } },
      { $group: { _id: '$aiReport.status', count: { $sum: 1 } } }
    ]).toArray()
    
    console.log('\n📋 AI报告状态分布:')
    statusStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} 条记录`)
    })
    
    // 显示详细示例
    console.log('\n📄 示例记录详情:')
    const samples = await collection.find(
      { aiReport: { $exists: true } },
      { name: 1, source: 1, aiReport: 1 }
    ).limit(3).toArray()
    
    samples.forEach((record, index) => {
      console.log(`\n示例 ${index + 1}:`)
      console.log(`   项目名称: ${record.name}`)
      console.log(`   来源科室: ${record.source}`)
      console.log(`   AI报告状态: ${record.aiReport.status}`)
      console.log(`   报告URL: ${record.aiReport.reportUrl || '无'}`)
    })
    
    // 验证结果判断
    if (recordsWithoutAIReport === 0) {
      console.log('\n🎉 验证成功！所有记录都已包含 aiReport 字段')
      return true
    } else {
      console.log(`\n⚠️  验证发现问题：还有 ${recordsWithoutAIReport} 条记录缺少 aiReport 字段`)
      return false
    }
    
  } catch (error) {
    console.error('❌ 验证过程失败:', error.message)
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
  console.log('🔍 数据迁移验证脚本')
  console.log('=' .repeat(60))
  
  try {
    await connectDB()
    const success = await verifyMigration()
    
    if (success) {
      console.log('\n✅ 数据迁移验证通过！可以继续下一步操作。')
    } else {
      console.log('\n❌ 数据迁移验证失败！请重新运行迁移脚本。')
      process.exit(1)
    }
    
  } catch (error) {
    console.error('\n💥 验证过程失败!')
    console.error('错误信息:', error.message)
    process.exit(1)
  } finally {
    await closeDB()
  }
}

// 如果直接运行此脚本，则执行主函数
if (require.main === module) {
  main()
}

module.exports = {
  verifyMigration
}
