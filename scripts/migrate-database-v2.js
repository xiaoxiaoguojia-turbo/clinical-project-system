/**
 * 数据库迁移脚本 V2
 * 
 * 主要变更：
 * 1. projectType: internal-preparation → chinese-medicine-modernization
 * 2. importance: 删除 not-important 选项（映射为 normal）
 * 3. status: 根据 projectType 重新映射
 * 4. transformRequirement + transformProgress → transformRequirements 数组（简化版）
 * 5. 删除字段: marketSize, competitorStatus
 * 6. 新增字段: dockingCompany, transformAmount
 * 7. 简化转化需求结构：只保留 type 和 currentProgress
 */

const mongoose = require('mongoose');

// MongoDB连接配置
const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb://localhost:27017/clinical_project_system';
  // 'mongodb://admin:Clinical_2025_admin_hhzn@localhost:27017/clinical_project_system?authSource=admin';

// 字段映射配置
const FIELD_MAPPINGS = {
  // projectType 映射
  projectType: {
    'internal-preparation': 'chinese-medicine-modernization'
  },
  
  // importance 映射
  importance: {
    'not-important': 'normal'  // 不重要 → 一般
  },
  
  // status 映射（基于 projectType）
  status: {
    'chinese-medicine-modernization': {
      'early-stage': 'hospital-preparation',      // 早期 → 院内制剂
      'preclinical': 'experience-formula',        // 临床前 → 经验方
      'clinical-stage': 'protocol-formula',       // 临床阶段 → 协定方
      'market-product': 'early-research'          // 上市产品 → 早期研究
    },
    'medical-device': {
      'early-stage': 'early-stage',
      'preclinical': 'sample-design',
      'clinical-stage': 'clinical-stage',
      'market-product': 'market-product'
    },
    'other': {
      'early-stage': 'early-stage',
      'preclinical': 'preclinical',
      'clinical-stage': 'clinical-stage',
      'market-product': 'market-product'
    }
  },
  
  // transformRequirement 类型映射
  transformRequirement: {
    'license': 'license-transfer',
    'transfer': 'license-transfer',
    'company-operation': 'company-operation',
    'license-transfer': 'license-transfer',
    'other': 'pending'
  }
};

// 进展节点映射
const PROGRESS_NODES_MAP = {
  'investment': ['入库', '初筛', '立项', '尽调', '投决', '投资协议签署', '交割', '投后管理', '退出'],
  'company-operation': ['合同签署', '注册完成', '拟签约已过董事会或总裁会', '待过医院院办', '实质性合同与医院讨论', '潜在待推进'],
  'license-transfer': ['已完成', '院端已过会', '医企实质性谈判', '潜在待推进'],
  'pending': []  // 待推进项目无节点
};

/* ------------------------------------------------------------------------------------------ */

/**
 * 转换转化需求为新格式（简化版）
 * 只包含 type 和 currentProgress 两个字段
 */
function convertTransformRequirement(oldRequirement, oldProgress) {
  if (!oldRequirement) {
    // 如果旧数据没有转化需求，返回一个默认的"待推进"
    return [{
      type: 'pending',
      currentProgress: ''
    }];
  }
  
  // 映射转化需求类型
  const type = FIELD_MAPPINGS.transformRequirement[oldRequirement] || 'pending';
  
  // 确定当前进展节点
  let currentProgress = '';
  
  if (type === 'investment') {
    // 投资项目：默认设置为第一个节点"入库"
    currentProgress = '入库';
  } else if (type === 'company-operation') {
    // 公司化运营：默认设置为第一个节点"合同签署"
    currentProgress = '合同签署';
  } else if (type === 'license-transfer') {
    // 许可转让：根据旧的 transformProgress 判断
    if (oldProgress === 'contract-completed') {
      currentProgress = '已完成';
    } else {
      currentProgress = '潜在待推进';
    }
  } else if (type === 'pending') {
    // 待推进项目：无进展节点（空字符串）
    currentProgress = '';
  }
  
  // 返回简化版的转化需求数组
  return [{
    type: type,
    currentProgress: currentProgress
  }];
}

/**
 * 映射 status 值
 */
function mapStatus(projectType, oldStatus) {
  const statusMap = FIELD_MAPPINGS.status[projectType];
  if (statusMap && statusMap[oldStatus]) {
    return statusMap[oldStatus];
  }
  return oldStatus;  // 保持原值
}

/* ------------------------------------------------------------------------------------------ */

/**
 * 主迁移函数
 */
async function migrate() {
  console.log('========================================');
  console.log('🚀 开始数据库迁移 V2（简化版）');
  console.log('========================================\n');
  
  try {
    // 连接数据库
    console.log('📡 连接数据库...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ 数据库连接成功\n');
    
    const db = mongoose.connection.db;
    const collection = db.collection('unifiedprojects');
    
    // 统计信息
    const totalCount = await collection.countDocuments();
    console.log(`📊 找到 ${totalCount} 个项目需要迁移\n`);
    
    if (totalCount === 0) {
      console.log('⚠️  没有需要迁移的项目');
      return;
    }
    
    // 获取所有项目
    const projects = await collection.find({}).toArray();
    
    let successCount = 0;
    let errorCount = 0;
    let skipCount = 0;
    const errors = [];
    
    console.log('开始逐个迁移...\n');
    
    // 逐个迁移
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      try {
        console.log(`\n[${i + 1}/${totalCount}] 🔄 迁移项目: ${project.name} (ID: ${project._id})`);
        
        const updates = {};
        const unsets = {};
        let hasChanges = false;
        
        // 1. 迁移 projectType
        if (project.projectType === 'internal-preparation') {
          updates.projectType = 'chinese-medicine-modernization';
          hasChanges = true;
          console.log('  ✓ projectType: internal-preparation → chinese-medicine-modernization');
        }
        
        // 2. 迁移 importance
        if (project.importance === 'not-important') {
          updates.importance = 'normal';
          hasChanges = true;
          console.log('  ✓ importance: not-important → normal');
        }
        
        // 3. 迁移 status
        const newProjectType = updates.projectType || project.projectType;
        const mappedStatus = mapStatus(newProjectType, project.status);
        if (mappedStatus !== project.status) {
          updates.status = mappedStatus;
          hasChanges = true;
          console.log(`  ✓ status: ${project.status} → ${mappedStatus}`);
        }
        
        // 4. 迁移转化需求（简化版）
        if (project.transformRequirement !== undefined || project.transformProgress !== undefined) {
          const newRequirements = convertTransformRequirement(
            project.transformRequirement,
            project.transformProgress
          );
          updates.transformRequirements = newRequirements;
          
          // 标记旧字段为删除
          if (project.transformRequirement !== undefined) {
            unsets.transformRequirement = '';
          }
          if (project.transformProgress !== undefined) {
            unsets.transformProgress = '';
          }
          
          hasChanges = true;
          console.log(`  ✓ 转化需求已转换为新格式（${newRequirements.length} 条）`);
          console.log(`    类型: ${newRequirements[0].type}, 节点: ${newRequirements[0].currentProgress || '无'}`);
        } else if (!project.transformRequirements || project.transformRequirements.length === 0) {
          // 如果既没有旧字段，也没有新字段，添加默认的"待推进"
          updates.transformRequirements = [{
            type: 'pending',
            currentProgress: ''
          }];
          hasChanges = true;
          console.log('  ✓ 添加默认转化需求：待推进');
        }
        
        // 5. 删除废弃字段
        if (project.marketSize !== undefined) {
          unsets.marketSize = '';
          hasChanges = true;
          console.log('  ✓ 删除字段: marketSize');
        }
        if (project.competitorStatus !== undefined) {
          unsets.competitorStatus = '';
          hasChanges = true;
          console.log('  ✓ 删除字段: competitorStatus');
        }
        
        // 6. 初始化新字段（如果不存在）
        if (project.dockingCompany === undefined) {
          updates.dockingCompany = '';
        }
        if (project.transformAmount === undefined) {
          updates.transformAmount = 0;
        }
        
        // 执行更新
        if (hasChanges) {
          const updateDoc = {};
          if (Object.keys(updates).length > 0) {
            updateDoc.$set = updates;
          }
          if (Object.keys(unsets).length > 0) {
            updateDoc.$unset = unsets;
          }
          
          await collection.updateOne(
            { _id: project._id },
            updateDoc
          );
          successCount++;
          console.log('  ✅ 迁移成功');
        } else {
          skipCount++;
          console.log('  ⏭️  无需迁移');
        }
        
      } catch (error) {
        errorCount++;
        const errorMsg = `项目 ${project.name} (${project._id}) 迁移失败: ${error.message}`;
        errors.push(errorMsg);
        console.error(`  ❌ ${errorMsg}`);
      }
    }
    
    // 输出统计
    console.log('\n========================================');
    console.log('📊 迁移完成统计');
    console.log('========================================');
    console.log(`总项目数: ${totalCount}`);
    console.log(`✅ 成功迁移: ${successCount}`);
    console.log(`⏭️  无需迁移: ${skipCount}`);
    console.log(`❌ 失败: ${errorCount}`);
    
    if (errors.length > 0) {
      console.log('\n❌ 错误详情:');
      errors.forEach((err, idx) => {
        console.log(`${idx + 1}. ${err}`);
      });
    }
    
    console.log('\n========================================');
    console.log('✅ 迁移完成！');
    console.log('========================================\n');
    
    // 验证迁移结果
    console.log('🔍 验证迁移结果...\n');
    
    const oldProjectTypeCount = await collection.countDocuments({ projectType: 'internal-preparation' });
    const newProjectTypeCount = await collection.countDocuments({ projectType: 'chinese-medicine-modernization' });
    const notImportantCount = await collection.countDocuments({ importance: 'not-important' });
    const oldFieldsCount = await collection.countDocuments({ 
      $or: [
        { marketSize: { $exists: true } },
        { competitorStatus: { $exists: true } },
        { transformRequirement: { $exists: true } },
        { transformProgress: { $exists: true } }
      ]
    });
    const noTransformRequirements = await collection.countDocuments({
      $or: [
        { transformRequirements: { $exists: false } },
        { transformRequirements: { $size: 0 } }
      ]
    });
    
    console.log('验证结果：');
    console.log(`  旧项目类型 (internal-preparation): ${oldProjectTypeCount} ${oldProjectTypeCount === 0 ? '✅' : '❌'}`);
    console.log(`  新项目类型 (chinese-medicine-modernization): ${newProjectTypeCount}`);
    console.log(`  旧重要程度 (not-important): ${notImportantCount} ${notImportantCount === 0 ? '✅' : '❌'}`);
    console.log(`  废弃字段残留: ${oldFieldsCount} ${oldFieldsCount === 0 ? '✅' : '❌'}`);
    console.log(`  缺少转化需求的项目: ${noTransformRequirements} ${noTransformRequirements === 0 ? '✅' : '❌'}`);
    
    if (oldProjectTypeCount === 0 && notImportantCount === 0 && oldFieldsCount === 0 && noTransformRequirements === 0) {
      console.log('\n🎉 数据验证通过！所有数据已正确迁移。');
    } else {
      console.log('\n⚠️  数据验证发现问题，请检查上述统计信息。');
    }
    
  } catch (error) {
    console.error('\n💥 迁移失败:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 数据库连接已关闭');
  }
}

/* ------------------------------------------------------------------------------------------ */

// 执行迁移
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('\n🎉 迁移脚本执行完毕');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 迁移脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { migrate };
