# ============================================
# 临床创新项目管理系统 - 系统初始化脚本
# 用于Docker部署后的首次初始化
# ============================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  临床创新项目管理系统 - 系统初始化" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 配置参数
$BASE_URL = "http://localhost:3000"
$ADMIN_USERNAME = "admin"
$ADMIN_PASSWORD = "admin123456"
$ADMIN_EMAIL = "admin@clinical-innovation.com"
$ADMIN_REALNAME = "系统管理员"
$ADMIN_DEPARTMENT = "转移转化与投资部门"

# ===== 步骤1: 检查Docker容器状态 =====
Write-Host "📋 步骤1: 检查Docker容器状态..." -ForegroundColor Yellow
Write-Host ""

$containers = docker ps --filter "name=clinical" --format "{{.Names}}: {{.Status}}"
if ($containers) {
    Write-Host "✅ Docker容器运行状态:" -ForegroundColor Green
    $containers | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
} else {
    Write-Host "❌ 未找到运行中的Docker容器！" -ForegroundColor Red
    Write-Host "   请先运行: docker-start.bat" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# ===== 步骤2: 等待服务启动 =====
Write-Host "📋 步骤2: 等待服务完全启动..." -ForegroundColor Yellow
Write-Host ""

$maxRetries = 30
$retryCount = 0
$serviceReady = $false

while ($retryCount -lt $maxRetries -and -not $serviceReady) {
    try {
        $response = Invoke-WebRequest -Uri "$BASE_URL/api/health" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $serviceReady = $true
            Write-Host "✅ 服务已就绪！" -ForegroundColor Green
        }
    } catch {
        $retryCount++
        Write-Host "   等待中... ($retryCount/$maxRetries)" -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if (-not $serviceReady) {
    Write-Host "❌ 服务启动超时！请检查Docker日志。" -ForegroundColor Red
    Write-Host "   运行: docker compose logs -f nextjs-app" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# ===== 步骤3: 检查Swagger API文档 =====
Write-Host "📋 步骤3: 检查API文档状态..." -ForegroundColor Yellow
Write-Host ""

try {
    $swaggerResponse = Invoke-RestMethod -Uri "$BASE_URL/api/docs" -Method GET
    $apiCount = if ($swaggerResponse.paths) { $swaggerResponse.paths.PSObject.Properties.Count } else { 0 }
    $schemaCount = if ($swaggerResponse.components.schemas) { $swaggerResponse.components.schemas.PSObject.Properties.Count } else { 0 }
    
    Write-Host "📊 API文档状态:" -ForegroundColor White
    Write-Host "   - API接口数量: $apiCount" -ForegroundColor $(if ($apiCount -gt 0) { "Green" } else { "Red" })
    Write-Host "   - 数据模型数量: $schemaCount" -ForegroundColor $(if ($schemaCount -gt 0) { "Green" } else { "Red" })
    Write-Host "   - 访问地址: $BASE_URL/api-docs" -ForegroundColor Cyan
    
    if ($apiCount -eq 0) {
        Write-Host ""
        Write-Host "⚠️  警告: 未找到API接口！" -ForegroundColor Yellow
        Write-Host "   请检查Docker日志中的Swagger调试信息:" -ForegroundColor Yellow
        Write-Host "   docker compose logs nextjs-app | Select-String -Pattern 'Swagger'" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ 无法访问API文档: $_" -ForegroundColor Red
}
Write-Host ""

# ===== 步骤4: 创建管理员账号 =====
Write-Host "📋 步骤4: 创建管理员账号..." -ForegroundColor Yellow
Write-Host ""

$initData = @{
    username = $ADMIN_USERNAME
    password = $ADMIN_PASSWORD
    email = $ADMIN_EMAIL
    realName = $ADMIN_REALNAME
    department = $ADMIN_DEPARTMENT
} | ConvertTo-Json

try {
    $initResponse = Invoke-RestMethod -Uri "$BASE_URL/api/system/init" `
        -Method POST `
        -ContentType "application/json" `
        -Body $initData
    
    if ($initResponse.success) {
        Write-Host "✅ 管理员账号创建成功！" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 管理员信息:" -ForegroundColor White
        Write-Host "   - 用户名: $ADMIN_USERNAME" -ForegroundColor Cyan
        Write-Host "   - 密码: $ADMIN_PASSWORD" -ForegroundColor Cyan
        Write-Host "   - 邮箱: $ADMIN_EMAIL" -ForegroundColor Cyan
        Write-Host "   - 姓名: $ADMIN_REALNAME" -ForegroundColor Cyan
        Write-Host "   - 部门: $ADMIN_DEPARTMENT" -ForegroundColor Cyan
    } else {
        Write-Host "❌ 创建失败: $($initResponse.error)" -ForegroundColor Red
    }
} catch {
    $errorMessage = $_.Exception.Message
    if ($errorMessage -like "*系统已经初始化*" -or $errorMessage -like "*already initialized*") {
        Write-Host "ℹ️  系统已经初始化，管理员账号已存在。" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 默认管理员信息:" -ForegroundColor White
        Write-Host "   - 用户名: $ADMIN_USERNAME" -ForegroundColor Cyan
        Write-Host "   - 密码: $ADMIN_PASSWORD" -ForegroundColor Cyan
    } else {
        Write-Host "❌ 初始化失败: $errorMessage" -ForegroundColor Red
    }
}
Write-Host ""

# ===== 步骤5: 测试登录 =====
Write-Host "📋 步骤5: 测试管理员登录..." -ForegroundColor Yellow
Write-Host ""

$loginData = @{
    username = $ADMIN_USERNAME
    password = $ADMIN_PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginData
    
    if ($loginResponse.success) {
        Write-Host "✅ 登录测试成功！" -ForegroundColor Green
        Write-Host "   Token: $($loginResponse.data.token.Substring(0, 50))..." -ForegroundColor Gray
    } else {
        Write-Host "❌ 登录失败: $($loginResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 登录测试失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# ===== 完成 =====
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  🎉 系统初始化完成！" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 快速访问链接:" -ForegroundColor White
Write-Host "   - 登录页面: $BASE_URL/login" -ForegroundColor Cyan
Write-Host "   - API文档: $BASE_URL/api-docs" -ForegroundColor Cyan
Write-Host "   - 控制台: $BASE_URL/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 提示:" -ForegroundColor Yellow
Write-Host "   1. 首次登录后请立即修改管理员密码" -ForegroundColor Gray
Write-Host "   2. 可以在用户管理页面创建更多用户" -ForegroundColor Gray
Write-Host "   3. 查看日志: docker compose logs -f nextjs-app" -ForegroundColor Gray
Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
