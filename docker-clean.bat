@echo off
chcp 65001 >nul
REM ============================================
REM Docker Cleanup Tool - Clinical Project System
REM ============================================

echo ==========================================
echo Docker Cleanup Tool
echo ==========================================
echo.

:MENU
echo Please select cleanup level:
echo.
echo [1] Light Cleanup - Build cache only (Fastest)
echo [2] Medium Cleanup - Containers + Images (Keep data)
echo [3] Heavy Cleanup - All Docker resources (Keep D: data)
echo [4] Full Cleanup - Everything including D: data (DANGER!)
echo [5] View Current Status
echo [0] Exit
echo.

set /p choice=Input (0-5): 

if "%choice%"=="1" goto LIGHT
if "%choice%"=="2" goto MEDIUM
if "%choice%"=="3" goto HEAVY
if "%choice%"=="4" goto FULL
if "%choice%"=="5" goto STATUS
if "%choice%"=="0" goto END

echo Invalid option, please try again
echo.
goto MENU

:LIGHT
echo.
echo ==========================================
echo Light Cleanup - Build Cache Only
echo ==========================================
echo.
echo This will clean:
echo - Docker build cache
echo - Dangling images
echo.
echo This will keep:
echo - All containers
echo - All images (mongo:7.0, etc.)
echo - All data in D:\Docker\clinical_data\
echo.
set /p confirm=Continue? (yes/no): 

if not "%confirm%"=="yes" (
    echo Operation cancelled
    echo.
    pause
    goto MENU
)

echo.
echo Cleaning build cache...
docker builder prune -f

echo.
echo Cleaning dangling images...
docker image prune -f

echo.
echo ==========================================
echo Light Cleanup Complete!
echo ==========================================
echo.
echo You can now retry: docker-start.bat
echo.
pause
goto MENU

:MEDIUM
echo.
echo ==========================================
echo Medium Cleanup - Containers + Images
echo ==========================================
echo.
echo This will clean:
echo - All containers
echo - All unused images
echo - Build cache
echo.
echo This will keep:
echo - Data in D:\Docker\clinical_data\
echo.
set /p confirm=Continue? (yes/no): 

if not "%confirm%"=="yes" (
    echo Operation cancelled
    echo.
    pause
    goto MENU
)

echo.
echo Stopping containers...
docker compose down

echo.
echo Cleaning unused images...
docker image prune -a -f

echo.
echo Cleaning build cache...
docker builder prune -f

echo.
echo ==========================================
echo Medium Cleanup Complete!
echo ==========================================
echo.
echo Next build will re-download images (slower)
echo But your data in D: drive is safe!
echo.
pause
goto MENU

:HEAVY
echo.
echo ==========================================
echo Heavy Cleanup - All Docker Resources
echo ==========================================
echo.
echo This will clean:
echo - All containers
echo - All images
echo - All networks
echo - All build cache
echo.
echo This will keep:
echo - Data in D:\Docker\clinical_data\
echo.
set /p confirm=Continue? (yes/no): 

if not "%confirm%"=="yes" (
    echo Operation cancelled
    echo.
    pause
    goto MENU
)

echo.
echo Stopping containers...
docker compose down

echo.
echo Cleaning all Docker resources...
docker system prune -a -f

echo.
echo Cleaning all build cache...
docker builder prune -a -f

echo.
echo ==========================================
echo Heavy Cleanup Complete!
echo ==========================================
echo.
echo Docker is now clean!
echo Your data in D:\Docker\clinical_data\ is safe!
echo.
pause
goto MENU

:FULL
echo.
echo ==========================================
echo WARNING: FULL CLEANUP - DANGER!
echo ==========================================
echo.
echo This will DELETE EVERYTHING:
echo - All containers
echo - All images
echo - All volumes
echo - All networks
echo - All build cache
echo - MongoDB data in D:\Docker\clinical_data\
echo - Uploaded files in D:\Docker\clinical_data\
echo.
echo THIS CANNOT BE UNDONE!
echo.
set /p confirm1=Type 'DELETE' to confirm: 

if not "%confirm1%"=="DELETE" (
    echo Operation cancelled
    echo.
    pause
    goto MENU
)

echo.
set /p confirm2=Are you ABSOLUTELY sure? (yes/no): 

if not "%confirm2%"=="yes" (
    echo Operation cancelled
    echo.
    pause
    goto MENU
)

echo.
echo Stopping and removing containers and volumes...
docker compose down -v

echo.
echo Cleaning all Docker resources...
docker system prune -a -f

echo.
echo Cleaning all build cache...
docker builder prune -a -f

echo.
echo Checking D: drive data...
if exist "D:\Docker\clinical_data\" (
    echo.
    echo D:\Docker\clinical_data\ still exists
    echo.
    set /p deleteD=Delete D:\Docker\clinical_data\? (yes/no): 
    
    if "!deleteD!"=="yes" (
        echo Deleting D:\Docker\clinical_data\...
        rmdir /s /q "D:\Docker\clinical_data\"
        echo D: drive data deleted!
    ) else (
        echo D: drive data kept
    )
)

echo.
echo ==========================================
echo Full Cleanup Complete!
echo ==========================================
echo.
echo Everything has been cleaned!
echo You can start fresh with: docker-start.bat
echo.
pause
goto MENU

:STATUS
echo.
echo ==========================================
echo Current Docker Status
echo ==========================================
echo.

echo [Containers]
docker ps -a

echo.
echo [Images]
docker images

echo.
echo [Volumes]
docker volume ls

echo.
echo [Build Cache]
docker builder du

echo.
echo [D: Drive Data]
if exist "D:\Docker\clinical_data\" (
    echo D:\Docker\clinical_data\ EXISTS
    dir "D:\Docker\clinical_data\" /s
) else (
    echo D:\Docker\clinical_data\ NOT FOUND
)

echo.
pause
goto MENU

:END
echo.
echo Goodbye!
exit
