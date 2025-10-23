@echo off
chcp 65001 >nul
REM ============================================
REM Clinical Project System - Docker Manager
REM ============================================

echo ==========================================
echo Clinical Project System - Docker Tool
echo ==========================================
echo.

:MENU
echo Please select:
echo [1] First Deploy (Build and Start)
echo [2] Start Service
echo [3] Stop Service
echo [4] Restart Service
echo [5] View Logs
echo [6] View Status
echo [7] Clean All Data (DANGER!)
echo [0] Exit
echo.

set /p choice=Input (0-7): 

if "%choice%"=="1" goto FIRST_DEPLOY
if "%choice%"=="2" goto START
if "%choice%"=="3" goto STOP
if "%choice%"=="4" goto RESTART
if "%choice%"=="5" goto LOGS
if "%choice%"=="6" goto STATUS
if "%choice%"=="7" goto CLEAN
if "%choice%"=="0" goto END

echo Invalid option, please try again
echo.
goto MENU

:FIRST_DEPLOY
echo.
echo [Step 1/4] Checking environment config...
if not exist .env.production (
    echo WARNING: .env.production not found!
    echo Creating from template...
    copy .env.production.example .env.production
    echo.
    echo Please edit .env.production file first!
    echo Press any key to open config file...
    pause >nul
    notepad .env.production
    echo.
    echo Press any key after configuration...
    pause >nul
)

echo.
echo [Step 2/4] Building Docker images...
docker compose build

echo.
echo [Step 3/4] Starting services...
docker compose up -d

echo.
echo [Step 4/4] Waiting for services...
timeout /t 10 /nobreak >nul

echo.
echo ==========================================
echo Deployment Complete!
echo ==========================================
echo Access: http://localhost:3000
echo Health: http://localhost:3000/api/health
echo ==========================================
echo.
pause
goto MENU

:START
echo.
echo Starting services...
docker compose up -d
echo Service started!
echo Access: http://localhost:3000
echo.
pause
goto MENU

:STOP
echo.
echo Stopping services...
docker compose down
echo Service stopped!
echo.
pause
goto MENU

:RESTART
echo.
echo Restarting services...
docker compose restart
echo Service restarted!
echo.
pause
goto MENU

:LOGS
echo.
echo Viewing logs (Press Ctrl+C to exit)...
echo.
docker compose logs -f
goto MENU

:STATUS
echo.
echo ==========================================
echo Service Status
echo ==========================================
docker compose ps
echo.
echo ==========================================
echo Container Resources
echo ==========================================
docker stats --no-stream
echo.
pause
goto MENU

:CLEAN
echo.
echo ==========================================
echo WARNING: This will DELETE ALL DATA!
echo ==========================================
echo Including:
echo - Docker containers
echo - Docker images
echo - Database data
echo - Uploaded files
echo.
set /p confirm=Confirm delete? (yes/no): 

if not "%confirm%"=="yes" (
    echo Operation cancelled
    echo.
    pause
    goto MENU
)

echo.
echo Cleaning...
docker compose down -v
docker system prune -a -f
echo Clean complete!
echo.
pause
goto MENU

:END
echo.
echo Goodbye!
exit
