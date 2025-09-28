const { exec } = require('child_process')
const path = require('path')

// 迁移脚本路径
const migrationScriptPath = path.join(__dirname, 'migrate-to-unified-projects.ts')

// 执行迁移
console.log('🚀 启动数据库重构迁移任务...')
console.log('📍 脚本位置:', migrationScriptPath)

const child = exec(`npx ts-node "${migrationScriptPath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ 迁移执行失败:', error)
    process.exit(1)
  }
  
  if (stderr) {
    console.error('⚠️ 迁移警告:', stderr)
  }
  
  console.log('📤 迁移输出:', stdout)
  console.log('✅ 迁移脚本执行完成')
})

// 实时输出日志
child.stdout.on('data', (data) => {
  process.stdout.write(data)
})

child.stderr.on('data', (data) => {
  process.stderr.write(data)
})
