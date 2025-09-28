const mongoose = require('mongoose')

// 数据库连接
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinical_project_system'
    console.log(`🔗 连接数据库: ${mongoURI}`)
    await mongoose.connect(mongoURI)
    console.log('✅ 数据库连接成功')
  } catch (error) {
    console.log(`❌ 数据库连接失败: ${error.message}`)
    throw error
  }
}

// 诊断数据库状态
const diagnosisDatabase = async () => {
  try {
    await connectDB()
    
    console.log('\n🔍 ===================数据库诊断报告===================')
    
    // 1. 检查所有集合
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('\n📋 数据库中的所有集合:')
    collections.forEach((col, index) => {
      console.log(`  ${index + 1}. ${col.name}`)
    })
    
    if (collections.length === 0) {
      console.log('⚠️ 数据库中没有任何集合！')
      return
    }
    
    // 2. 检查可能的项目相关集合
    const projectCollections = collections.filter(col => 
      col.name.toLowerCase().includes('project') || 
      col.name.toLowerCase().includes('preparation') ||
      col.name.toLowerCase().includes('type')
    )
    
    console.log('\n🎯 项目相关集合:')
    if (projectCollections.length === 0) {
      console.log('⚠️ 没有找到项目相关的集合')
    } else {
      projectCollections.forEach((col, index) => {
        console.log(`  ${index + 1}. ${col.name}`)
      })
    }
    
    // 3. 检查每个相关集合的数据量
    console.log('\n📊 各集合数据统计:')
    for (const col of projectCollections) {
      try {
        const count = await mongoose.connection.db.collection(col.name).countDocuments()
        console.log(`  📦 ${col.name}: ${count} 条数据`)
        
        // 如果有数据，显示一个样本
        if (count > 0) {
          const sample = await mongoose.connection.db.collection(col.name).findOne()
          console.log(`    样本字段: ${Object.keys(sample).join(', ')}`)
        }
      } catch (error) {
        console.log(`  ❌ ${col.name}: 查询失败 - ${error.message}`)
      }
    }
    
    // 4. 检查常见的集合名称变体
    console.log('\n🔍 检查常见集合名称变体:')
    const possibleNames = [
      'internalpreparationprojects',
      'internal-preparation-projects', 
      'InternalPreparationProjects',
      'internalPreparationProjects',
      'type2projects',
      'type-2-projects',
      'Type2Projects',
      'type2Projects'
    ]
    
    for (const name of possibleNames) {
      try {
        const count = await mongoose.connection.db.collection(name).countDocuments()
        if (count > 0) {
          console.log(`  ✅ ${name}: ${count} 条数据`)
        }
      } catch (error) {
        // 忽略不存在的集合
      }
    }
    
    console.log('\n🎯 ===================诊断完成===================')
    
  } catch (error) {
    console.error('💥 诊断失败:', error)
  } finally {
    await mongoose.connection.close()
    console.log('📤 数据库连接已关闭')
  }
}

// 执行诊断
if (require.main === module) {
  diagnosisDatabase()
    .then(() => {
      console.log('\n✅ 诊断完成')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ 诊断失败:', error)
      process.exit(1)
    })
}

module.exports = { diagnosisDatabase }
