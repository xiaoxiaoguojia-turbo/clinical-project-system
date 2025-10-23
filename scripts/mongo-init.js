// ============================================
// MongoDB 数据库初始化脚本
// 在Docker容器首次启动时自动执行
// ============================================

// 切换到目标数据库
db = db.getSiblingDB('clinical_project_system');

print('========================================');
print('开始初始化临床创新项目管理系统数据库...');
print('========================================');

// 创建应用用户（只读/读写权限）
try {
  db.createUser({
    user: 'clinical_app',
    pwd: 'changeme456',  // 生产环境请修改
    roles: [
      { role: 'readWrite', db: 'clinical_project_system' }
    ]
  });
  print('✅ 创建应用用户成功');
} catch (e) {
  print('⚠️  应用用户可能已存在: ' + e);
}

// 创建集合索引（提升查询性能）
print('创建数据库索引...');

// users 集合索引
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ status: 1 });
db.users.createIndex({ createTime: -1 });
print('✅ users 集合索引创建完成');

// unifiedprojects 集合索引
db.unifiedprojects.createIndex({ projectType: 1 });
db.unifiedprojects.createIndex({ department: 1 });
db.unifiedprojects.createIndex({ status: 1 });
db.unifiedprojects.createIndex({ importance: 1 });
db.unifiedprojects.createIndex({ name: 'text' });  // 全文搜索
db.unifiedprojects.createIndex({ createTime: -1 });
db.unifiedprojects.createIndex({ recordNumber: 1 }, { sparse: true });  // 备案号（稀疏索引）
print('✅ unifiedprojects 集合索引创建完成');

// attachments 集合索引
db.attachments.createIndex({ projectId: 1 });
db.attachments.createIndex({ projectType: 1 });
db.attachments.createIndex({ uploadTime: -1 });
print('✅ attachments 集合索引创建完成');

print('========================================');
print('数据库初始化完成！');
print('========================================');
