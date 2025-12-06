@echo off
title Food Ordering System
color 0A

:MENU
cls
echo ========================================
echo   FOOD ORDERING SYSTEM
echo ========================================
echo.
echo   1. Setup (First Time)
echo   2. Start
echo   3. Stop
echo   4. Info
echo   5. Reset Database
echo   6. Exit
echo.
set /p choice="Choose (1-6): "

if "%choice%"=="1" goto SETUP
if "%choice%"=="2" goto START
if "%choice%"=="3" goto STOP
if "%choice%"=="4" goto INFO
if "%choice%"=="5" goto RESET
if "%choice%"=="6" goto EXIT
goto MENU

:SETUP
cls
echo ========================================
echo   SETUP
echo ========================================
echo.
echo Choose database:
echo   1. XAMPP (Local)
echo   2. AWS RDS (Cloud)
echo   3. Back
echo.
set /p db="Choose (1-3): "

if "%db%"=="1" goto SETUP_XAMPP
if "%db%"=="2" goto SETUP_AWS
if "%db%"=="3" goto MENU
goto SETUP

:SETUP_XAMPP
cls
echo Setting up with XAMPP...
echo.

if not exist "C:\xampp\mysql\bin\mysql.exe" (
    echo [ERROR] XAMPP not found!
    echo Install from: https://www.apachefriends.org
    pause
    goto MENU
)

echo [1/9] Starting XAMPP...
start "" "C:\xampp\xampp-control.exe"
timeout /t 3 >nul

echo [2/9] Creating database...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS food_ordering;"

echo [3/9] Importing schema...
"C:\xampp\mysql\bin\mysql.exe" -u root food_ordering < backend\database\schema.sql

echo [4/9] Importing data...
"C:\xampp\mysql\bin\mysql.exe" -u root food_ordering < backend\database\seed.sql

echo [5/9] Installing backend...
cd backend
if not exist "node_modules" call npm install
cd ..

echo [6/9] Creating backend .env...
if not exist "backend\.env" (
    (
        echo PORT=5000
        echo DB_TYPE=mysql
        echo DB_HOST=localhost
        echo DB_NAME=food_ordering
        echo DB_USER=root
        echo DB_PASSWORD=
        echo JWT_SECRET=change_this_secret
        echo FRONTEND_URL=http://localhost:3000
    ) > backend\.env
)

echo [7/9] Installing frontend...
cd frontend
if not exist "node_modules" call npm install
cd ..

echo [8/9] Creating frontend .env...
if not exist "frontend\.env" (
    echo REACT_APP_API_URL=http://localhost:5000 > frontend\.env
)

echo [9/9] Done!
echo.
echo ========================================
echo   SETUP COMPLETE
echo ========================================
echo.
echo Login: admin@foodorder.com / admin123
echo.
pause
goto MENU

:SETUP_AWS
cls
echo Setting up with AWS RDS...
echo.
set /p host="RDS Endpoint: "
set /p user="Username (admin): "
if "%user%"=="" set user=admin
set /p pass="Password: "

echo.
echo [1/5] Installing backend...
cd backend
if not exist "node_modules" call npm install
cd ..

echo [2/5] Creating backend .env...
(
    echo PORT=5000
    echo DB_TYPE=mysql
    echo DB_HOST=%host%
    echo DB_NAME=food_ordering
    echo DB_USER=%user%
    echo DB_PASSWORD=%pass%
    echo JWT_SECRET=change_this_secret
    echo FRONTEND_URL=http://localhost:3000
) > backend\.env

echo [3/5] Installing frontend...
cd frontend
if not exist "node_modules" call npm install
cd ..

echo [4/5] Creating frontend .env...
echo REACT_APP_API_URL=http://localhost:5000 > frontend\.env

echo [5/5] Done!
echo.
echo NOTE: Import database manually:
echo   - backend\database\schema.sql
echo   - backend\database\seed.sql
echo.
pause
goto MENU

:START
cls
echo ========================================
echo   STARTING
echo ========================================
echo.

if not exist "backend\.env" (
    echo [ERROR] Not configured! Run Setup first.
    pause
    goto MENU
)

echo Starting backend...
start "Backend" cmd /k "cd backend && npm start"
timeout /t 2 >nul

echo Starting frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo   STARTED
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
goto MENU

:STOP
cls
echo ========================================
echo   STOPPING
echo ========================================
echo.
taskkill /F /IM node.exe >nul 2>&1
if errorlevel 1 (
    echo No processes found
) else (
    echo Stopped successfully
)
echo.
pause
goto MENU

:INFO
cls
echo ========================================
echo   SYSTEM INFO
echo ========================================
echo.

echo Node.js:
where node >nul 2>nul
if errorlevel 1 (
    echo   [ERROR] Not installed
) else (
    node --version
)

echo.
echo npm:
where npm >nul 2>nul
if errorlevel 1 (
    echo   [ERROR] Not installed
) else (
    npm --version
)

echo.
echo XAMPP:
if exist "C:\xampp\mysql\bin\mysql.exe" (
    echo   [OK] Found
) else (
    echo   [INFO] Not found
)

echo.
echo Backend:
if exist "backend\.env" (
    echo   [OK] Configured
) else (
    echo   [ERROR] Not configured
)

echo.
echo Frontend:
if exist "frontend\node_modules" (
    echo   [OK] Configured
) else (
    echo   [ERROR] Not configured
)

echo.
echo Running:
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I "node.exe" >nul
if errorlevel 1 (
    echo   No processes
) else (
    echo   Node.js running
)

echo.
echo ========================================
echo   LOGIN CREDENTIALS
echo ========================================
echo.
echo Admin:    admin@gmail.com / 123456
echo Staff:    staff@gmail.com / 123456
echo Customer: johndoe@gmail.com / 123456
echo.
pause
goto MENU

:RESET
cls
echo ========================================
echo   RESET DATABASE
echo ========================================
echo.
echo WARNING: All data will be deleted!
echo.
set /p confirm="Continue? (yes/no): "
if not "%confirm%"=="yes" goto MENU

if not exist "backend\.env" (
    echo [ERROR] Not configured!
    pause
    goto MENU
)

findstr /C:"DB_HOST=localhost" backend\.env >nul
if errorlevel 1 (
    echo [INFO] Remote database - reset manually
    pause
    goto MENU
)

echo.
echo Resetting...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "DROP DATABASE IF EXISTS food_ordering; CREATE DATABASE food_ordering;"
"C:\xampp\mysql\bin\mysql.exe" -u root food_ordering < backend\database\schema.sql
"C:\xampp\mysql\bin\mysql.exe" -u root food_ordering < backend\database\seed.sql

echo.
echo Database reset complete!
pause
goto MENU

:EXIT
cls
echo.
echo Stopping processes...
taskkill /F /IM node.exe >nul 2>&1
echo.
echo Goodbye!
timeout /t 2 >nul
exit
