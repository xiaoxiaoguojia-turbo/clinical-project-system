const mongoose = require('mongoose')
require('dotenv').config()

/* ------------------------------------------------------------------------------------------ */

// 中文到英文的映射表
const ENUM_MAPPING = {
  // 部门映射
  department: {
    '转移转化与投资一部': 'transfer-investment-dept-1',
    '转移转化与投资二部': 'transfer-investment-dept-2', 
    '转移转化与投资三部': 'transfer-investment-dept-3',
    '创新中心': 'innovation-center',
    '知识产权部': 'ip-dept'
  },
  
  // 项目类型映射
  projectType: {
    '院内制剂': 'internal-preparation',
    'AI医疗及系统研究': 'ai-medical-research',
    '检测诊断': 'diagnostic-detection', 
    '细胞治疗': 'cell-therapy',
    '药物': 'drug',
    '医疗器械': 'medical-device',
    '医用材料': 'medical-material',
    '其他': 'other'
  },
  
  // 重要程度映射
  importance: {
    '非常重要': 'very-important',
    '重要': 'important', 
    '一般': 'normal',
    '不重要': 'not-important'
  },
  
  // 项目状态映射
  status: {
    '早期': 'early-stage',
    '临床前': 'preclinical',
    '临床阶段': 'clinical-stage', 
    '上市产品': 'market-product'
  },
  
  // 转化需求映射
  transformRequirement: {
    '许可转让': 'license-transfer',
    '代价入股': 'equity-investment',
    '代持': 'trust-holding',
    '代持托管': 'trust-management', 
    '公司化运营': 'company-operation',
    '许可转让现金': 'license-transfer-cash',
    '待定': 'to-be-determined'
  }
}

/* ------------------------------------------------------------------------------------------ */

// 获取所有需要迁移的集合
const COLLECTIONS_TO_MIGRATE = [
  'unifiedprojects',
  'internalpreparationprojects', 
  'type2projects'
]

/* ------------------------------------------------------------------------------------------ */

async function migrateEnumValues() {
  try {
    console.log('🚀 开始枚举值标准化迁移...')
    
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    
    console.log('✅ 数据库连接成功')
    
    // 迁移每个集合
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      await migrateCollection(collectionName)
    }
    
    console.log('🎉 枚举值标准化迁移完成！')
    
  } catch (error) {
    console.error('❌ 迁移失败:', error)
  } finally {
    await mongoose.disconnect()
    console.log('📡 数据库连接已关闭')
  }
}

/* ------------------------------------------------------------------------------------------ */

async function migrateCollection(collectionName) {
  try {
    const collection = mongoose.connection.db.collection(collectionName)
    
    // 检查集合是否存在
    const exists = await collection.findOne({})
    if (!exists) {
      console.log(`⏭️  集合 ${collectionName} 不存在或为空，跳过`)
      return
    }
    
    console.log(`\n📋 开始迁移集合: ${collectionName}`)
    
    // 获取所有文档
    const documents = await collection.find({}).toArray()
    console.log(`📊 找到 ${documents.length} 条记录`)
    
    let updateCount = 0
    
    for (const doc of documents) {
      const updates = {}
      let hasUpdates = false
      
      // 检查每个需要映射的字段
      for (const [fieldName, mapping] of Object.entries(ENUM_MAPPING)) {
        if (doc[fieldName] && mapping[doc[fieldName]]) {
          updates[fieldName] = mapping[doc[fieldName]]
          hasUpdates = true
          console.log(`  🔄 ${doc._id}: ${fieldName} "${doc[fieldName]}" -> "${mapping[doc[fieldName]]}"`)
        }
      }
      
      // 更新文档
      if (hasUpdates) {
        updates.updateTime = new Date()
        
        await collection.updateOne(
          { _id: doc._id },
          { $set: updates }
        )
        updateCount++
      }
    }
    
    console.log(`✅ 集合 ${collectionName} 迁移完成，共更新 ${updateCount} 条记录`)
    
  } catch (error) {
    console.error(`❌ 迁移集合 ${collectionName} 失败:`, error)
  }
}

/* ------------------------------------------------------------------------------------------ */

// 验证迁移结果
async function validateMigration() {
  try {
    console.log('\n🔍 验证迁移结果...')
    
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      const collection = mongoose.connection.db.collection(collectionName)
      
      const docs = await collection.find({}).toArray()
      if (docs.length === 0) continue
      
      console.log(`\n📋 ${collectionName} 验证结果:`)
      
      for (const doc of docs.slice(0, 3)) { // 只显示前3条
        console.log(`  ID: ${doc._id}`)
        console.log(`    department: ${doc.department}`)
        console.log(`    projectType: ${doc.projectType}`) 
        console.log(`    importance: ${doc.importance}`)
        console.log(`    status: ${doc.status}`)
      }
    }
    
  } catch (error) {
    console.error('❌ 验证失败:', error)
  }
}

/* ------------------------------------------------------------------------------------------ */

// 主函数
async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')
  
  if (isDryRun) {
    console.log('🔍 DRY-RUN 模式：仅预览，不实际修改数据')
    // TODO: 实现dry-run逻辑
    return
  }
  
  await migrateEnumValues()
  await validateMigration()
}

// 执行迁移
if (require.main === module) {
  main()
}
