@echo off
REM ============================================
REM 临床创新项目管理系统 - Windows 快速启动脚本
REM ============================================

echo ==========================================
echo 临床创新项目管理系统 Docker 管理工具
echo ==========================================
echo.

:MENU
echo 请选择操作：
echo [1] 首次部署（构建并启动）
echo [2] 启动服务
echo [3] 停止服务
echo [4] 重启服务
echo [5] 查看日志
echo [6] 查看状态
echo [7] 清理所有数据（危险！）
echo [0] 退出
echo.

set /p choice=请输入选项 (0-7): 

if "%choice%"=="1" goto FIRST_DEPLOY
if "%choice%"=="2" goto START
if "%choice%"=="3" goto STOP
if "%choice%"=="4" goto RESTART
if "%choice%"=="5" goto LOGS
if "%choice%"=="6" goto STATUS
if "%choice%"=="7" goto CLEAN
if "%choice%"=="0" goto END

echo 无效选项，请重新选择
echo.
goto MENU

:FIRST_DEPLOY
echo.
echo [步骤1/4] 检查环境变量配置...
if not exist .env.production (
    echo 警告：.env.production 文件不存在！
    echo 正在从模板创建...
    copy .env.production.example .env.production
    echo.
    echo 请先编辑 .env.production 文件，配置数据库密码和JWT密钥！
    echo 按任意键打开配置文件...
    pause >nul
    notepad .env.production
    echo.
    echo 配置完成后按任意键继续...
    pause >nul
)

echo.
echo [步骤2/4] 构建Docker镜像...
docker-compose build

echo.
echo [步骤3/4] 启动服务...
docker-compose up -d

echo.
echo [步骤4/4] 等待服务就绪...
timeout /t 10 /nobreak >nul

echo.
echo ==========================================
echo 部署完成！
echo ==========================================
echo 访问地址: http://localhost:3000
echo 健康检查: http://localhost:3000/api/health
echo ==========================================
echo.
pause
goto MENU

:START
echo.
echo 正在启动服务...
docker-compose up -d
echo 服务启动完成！
echo 访问地址: http://localhost:3000
echo.
pause
goto MENU

:STOP
echo.
echo 正在停止服务...
docker-compose down
echo 服务已停止！
echo.
pause
goto MENU

:RESTART
echo.
echo 正在重启服务...
docker-compose restart
echo 服务重启完成！
echo.
pause
goto MENU

:LOGS
echo.
echo 查看日志（按 Ctrl+C 退出）...
echo.
docker-compose logs -f
goto MENU

:STATUS
echo.
echo ==========================================
echo 服务状态
echo ==========================================
docker-compose ps
echo.
echo ==========================================
echo 容器资源使用
echo ==========================================
docker stats --no-stream
echo.
pause
goto MENU

:CLEAN
echo.
echo ==========================================
echo 警告：此操作将删除所有数据！
echo ==========================================
echo 包括：
echo - Docker容器
echo - Docker镜像
echo - 数据库数据
echo - 上传的文件
echo.
set /p confirm=确认删除？(yes/no): 

if not "%confirm%"=="yes" (
    echo 操作已取消
    echo.
    pause
    goto MENU
)

echo.
echo 正在清理...
docker-compose down -v
docker system prune -a -f
echo 清理完成！
echo.
pause
goto MENU

:END
echo.
echo 再见！
exit
