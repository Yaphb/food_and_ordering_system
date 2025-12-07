@echo off
setlocal enabledelayedexpansion
title Food Ordering System
color 0A
mode con: cols=80 lines=30

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
echo.
echo [ERROR] Invalid choice! Please enter 1-6.
timeout /t 2 >nul
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
echo.
echo [ERROR] Invalid choice! Please enter 1-3.
timeout /t 2 >nul
goto SETUP

:SETUP_XAMPP
cls
echo Setting up with XAMPP...
echo.

REM Detect XAMPP installation path
set XAMPP_PATH=
if exist "C:\xampp\mysql\bin\mysql.exe" set XAMPP_PATH=C:\xampp
if exist "D:\xampp\mysql\bin\mysql.exe" set XAMPP_PATH=D:\xampp
if exist "E:\xampp\mysql\bin\mysql.exe" set XAMPP_PATH=E:\xampp
if exist "F:\xampp\mysql\bin\mysql.exe" set XAMPP_PATH=F:\xampp

if "%XAMPP_PATH%"=="" (
    echo [ERROR] XAMPP not found on C:, D:, E:, or F: drives!
    echo.
    echo Please install XAMPP from: https://www.apachefriends.org
    echo Or enter your XAMPP path manually:
    echo.
    set /p XAMPP_PATH="XAMPP Path (e.g., C:\xampp): "
    if not exist "!XAMPP_PATH!\mysql\bin\mysql.exe" (
        echo [ERROR] Invalid XAMPP path!
        pause
        goto MENU
    )
)

echo [OK] XAMPP found at: %XAMPP_PATH%
echo.

echo [1/9] Opening XAMPP Control Panel...
if exist "%XAMPP_PATH%\xampp-control.exe" (
    start "" "%XAMPP_PATH%\xampp-control.exe"
    timeout /t 2 >nul
    echo [OK] XAMPP Control Panel opened
) else (
    echo [WARNING] XAMPP Control Panel not found
)

echo [2/9] Starting Apache...
tasklist /FI "IMAGENAME eq httpd.exe" 2>nul | find /I "httpd.exe" >nul 2>&1
if errorlevel 1 (
    echo Starting Apache service...
    if exist "%XAMPP_PATH%\apache\bin\httpd.exe" (
        start /B "" "%XAMPP_PATH%\apache\bin\httpd.exe"
        timeout /t 3 >nul
        tasklist /FI "IMAGENAME eq httpd.exe" 2>nul | find /I "httpd.exe" >nul 2>&1
        if errorlevel 1 (
            echo [WARNING] Failed to start Apache automatically
            echo [INFO] Please start it manually from XAMPP Control Panel
        ) else (
            echo [OK] Apache started
        )
    ) else (
        echo [WARNING] Apache not found at %XAMPP_PATH%\apache\bin\httpd.exe
        echo [INFO] Please start it manually from XAMPP Control Panel
    )
) else (
    echo [OK] Apache already running
)

echo [3/9] Starting MySQL...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul 2>&1
if errorlevel 1 (
    echo Starting MySQL service...
    if exist "%XAMPP_PATH%\mysql\bin\mysqld.exe" (
        start /B "" "%XAMPP_PATH%\mysql\bin\mysqld.exe" --defaults-file="%XAMPP_PATH%\mysql\bin\my.ini" --standalone
        timeout /t 5 >nul
        tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul 2>&1
        if errorlevel 1 (
            echo [WARNING] Failed to start MySQL automatically
            echo [INFO] Please start it manually from XAMPP Control Panel
            echo.
            echo Press any key after starting MySQL...
            pause >nul
        ) else (
            echo [OK] MySQL started
        )
    ) else (
        echo [WARNING] MySQL not found at %XAMPP_PATH%\mysql\bin\mysqld.exe
        echo [INFO] Please start it manually from XAMPP Control Panel
        echo.
        echo Press any key after starting MySQL...
        pause >nul
    )
) else (
    echo [OK] MySQL already running
)
echo.

echo [4/9] Creating database...
"%XAMPP_PATH%\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS food_ordering;" 2>nul
if errorlevel 1 (
    echo [ERROR] Failed to create database. Check MySQL is running.
    echo [INFO] Try starting MySQL from XAMPP Control Panel first.
    pause
    goto MENU
) else (
    echo [OK] Database created
)

echo [5/9] Importing schema...
if not exist "backend\database\schema.sql" (
    echo [ERROR] Schema file not found: backend\database\schema.sql
    pause
    goto MENU
)
"%XAMPP_PATH%\mysql\bin\mysql.exe" -u root < backend\database\schema.sql
if errorlevel 1 (
    echo [ERROR] Failed to import schema
    echo [INFO] Check if MySQL is running
    pause
    goto MENU
) else (
    echo [OK] Schema imported
)

echo [6/9] Importing data...
if not exist "backend\database\seed.sql" (
    echo [ERROR] Seed file not found: backend\database\seed.sql
    pause
    goto MENU
)
"%XAMPP_PATH%\mysql\bin\mysql.exe" -u root < backend\database\seed.sql
if errorlevel 1 (
    echo [ERROR] Failed to import data
    echo [INFO] Check error messages above
    pause
    goto MENU
) else (
    echo [OK] Data imported
)

echo [7/9] Installing backend...
if not exist "backend\node_modules" (
    echo Installing dependencies ^(this may take a while^)...
    cd backend
    call npm install >nul 2^>^&1
    set INSTALL_ERROR=!errorlevel!
    cd ..
    if !INSTALL_ERROR! neq 0 (
        echo [ERROR] Backend installation failed
        pause
        goto MENU
    )
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend already installed
)

echo [8/9] Creating backend .env...
if not exist "backend\.env" (
    echo PORT=5000 > backend\.env
    echo DB_TYPE=mysql >> backend\.env
    echo DB_HOST=localhost >> backend\.env
    echo DB_NAME=food_ordering >> backend\.env
    echo DB_USER=root >> backend\.env
    echo DB_PASSWORD= >> backend\.env
    echo JWT_SECRET=change_this_secret >> backend\.env
    echo FRONTEND_URL=http://localhost:3000 >> backend\.env
    echo [OK] Backend .env created
) else (
    echo [OK] Backend .env already exists
)

echo [9/9] Installing frontend...
if not exist "frontend\node_modules" (
    echo Installing dependencies ^(this may take a while^)...
    cd frontend
    call npm install >nul 2^>^&1
    set INSTALL_ERROR=!errorlevel!
    cd ..
    if !INSTALL_ERROR! neq 0 (
        echo [ERROR] Frontend installation failed
        pause
        goto MENU
    )
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend already installed
)

echo [10/10] Creating frontend .env...
if not exist "frontend\.env" (
    echo REACT_APP_API_URL=http://localhost:5000 > frontend\.env
    echo [OK] Frontend .env created
) else (
    echo [OK] Frontend .env already exists
)

echo [11/11] Done!
echo.
echo ========================================
echo   SETUP COMPLETE
echo ========================================
echo.
echo Default Login Credentials:
echo   Admin:    admin@gmail.com / 123456
echo   Staff:    staff@gmail.com / 123456
echo   Customer: johndoe@gmail.com / 123456
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
if not exist "backend\node_modules" (
    echo Installing dependencies ^(this may take a while^)...
    cd backend
    call npm install >nul 2^>^&1
    set INSTALL_ERROR=!errorlevel!
    cd ..
    if !INSTALL_ERROR! neq 0 (
        echo [ERROR] Backend installation failed
        pause
        goto MENU
    )
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend already installed
)

echo [2/5] Creating backend .env...
echo PORT=5000 > backend\.env
echo DB_TYPE=mysql >> backend\.env
echo DB_HOST=%host% >> backend\.env
echo DB_NAME=food_ordering >> backend\.env
echo DB_USER=%user% >> backend\.env
echo DB_PASSWORD=%pass% >> backend\.env
echo JWT_SECRET=change_this_secret >> backend\.env
echo FRONTEND_URL=http://localhost:3000 >> backend\.env
echo [OK] Backend .env created

echo [3/5] Installing frontend...
if not exist "frontend\node_modules" (
    echo Installing dependencies ^(this may take a while^)...
    cd frontend
    call npm install >nul 2^>^&1
    set INSTALL_ERROR=!errorlevel!
    cd ..
    if !INSTALL_ERROR! neq 0 (
        echo [ERROR] Frontend installation failed
        pause
        goto MENU
    )
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend already installed
)

echo [4/5] Creating frontend .env...
echo REACT_APP_API_URL=http://localhost:5000 > frontend\.env
echo [OK] Frontend .env created

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
echo Closing Backend and Frontend windows...
powershell -Command "Get-Process | Where-Object {$_.MainWindowTitle -eq 'Backend' -or $_.MainWindowTitle -eq 'Frontend'} | ForEach-Object { Stop-Process -Id $_.Id -Force }" 2>nul

echo Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo Closing cmd windows...
for /f "tokens=2 delims=," %%a in ('tasklist /V /FO CSV ^| findstr /I "Backend Frontend"') do (
    taskkill /F /PID %%~a >nul 2>&1
)

echo Stopping XAMPP services...
tasklist /FI "IMAGENAME eq httpd.exe" 2>nul | find /I "httpd.exe" >nul 2>&1
if not errorlevel 1 (
    echo Stopping Apache...
    taskkill /F /IM httpd.exe >nul 2>&1
    echo [OK] Apache stopped
)

tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul 2>&1
if not errorlevel 1 (
    echo Stopping MySQL...
    taskkill /F /IM mysqld.exe >nul 2>&1
    echo [OK] MySQL stopped
)

echo Closing XAMPP Control Panel...
tasklist /FI "IMAGENAME eq xampp-control.exe" 2>nul | find /I "xampp-control.exe" >nul 2>&1
if not errorlevel 1 (
    taskkill /F /IM xampp-control.exe >nul 2>&1
    echo [OK] XAMPP Control Panel closed
)

timeout /t 1 >nul
echo.
echo [OK] All services stopped
echo.
echo Closing in 2 seconds...
timeout /t 2 >nul
exit

:INFO
cls
echo ========================================
echo   SYSTEM INFO
echo ========================================
echo.

echo Node.js:
where node >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Not installed
) else (
    for /f "delims=" %%i in ('node --version 2^>nul') do echo   %%i
)

echo.
echo npm:
where npm >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Not installed
) else (
    for /f "delims=" %%i in ('npm --version 2^>nul') do echo   %%i
)

echo.
echo XAMPP:
set XAMPP_FOUND=
if exist "C:\xampp\mysql\bin\mysql.exe" set XAMPP_FOUND=C:\xampp
if exist "D:\xampp\mysql\bin\mysql.exe" set XAMPP_FOUND=D:\xampp
if exist "E:\xampp\mysql\bin\mysql.exe" set XAMPP_FOUND=E:\xampp
if exist "F:\xampp\mysql\bin\mysql.exe" set XAMPP_FOUND=F:\xampp
if defined XAMPP_FOUND (
    echo   [OK] Found at %XAMPP_FOUND%
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
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I "node.exe" >nul 2>&1
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
echo Admin:     admin@gmail.com / 123456
echo Staff:     staff@gmail.com / 123456
echo Customer1: johndoe@gmail.com / 123456
echo Customer2: janesmith@gmail.com / 123456
echo.
echo Note: All passwords are "123456" (bcrypt hashed)
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

REM Detect XAMPP installation path
set XAMPP_RESET_PATH=
if exist "C:\xampp\mysql\bin\mysql.exe" set XAMPP_RESET_PATH=C:\xampp
if exist "D:\xampp\mysql\bin\mysql.exe" set XAMPP_RESET_PATH=D:\xampp
if exist "E:\xampp\mysql\bin\mysql.exe" set XAMPP_RESET_PATH=E:\xampp
if exist "F:\xampp\mysql\bin\mysql.exe" set XAMPP_RESET_PATH=F:\xampp

if "%XAMPP_RESET_PATH%"=="" (
    echo [ERROR] XAMPP not found!
    pause
    goto MENU
)

echo.
echo Resetting database using XAMPP at %XAMPP_RESET_PATH%...
"%XAMPP_RESET_PATH%\mysql\bin\mysql.exe" -u root -e "DROP DATABASE IF EXISTS food_ordering; CREATE DATABASE food_ordering;"
if errorlevel 1 (
    echo [ERROR] Failed to reset database. Check MySQL is running.
    echo [INFO] Start MySQL from XAMPP Control Panel and try again.
    pause
    goto MENU
)

"%XAMPP_RESET_PATH%\mysql\bin\mysql.exe" -u root < backend\database\schema.sql
if errorlevel 1 (
    echo [ERROR] Failed to import schema
    pause
    goto MENU
)

"%XAMPP_RESET_PATH%\mysql\bin\mysql.exe" -u root < backend\database\seed.sql
if errorlevel 1 (
    echo [ERROR] Failed to import data
    pause
    goto MENU
)

echo.
echo [OK] Database reset complete!
pause
goto MENU

:EXIT
cls
echo ========================================
echo   SHUTTING DOWN
echo ========================================
echo.
echo Stopping Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo Stopping XAMPP services...
tasklist /FI "IMAGENAME eq httpd.exe" 2>nul | find /I "httpd.exe" >nul 2>&1
if not errorlevel 1 (
    echo Stopping Apache...
    taskkill /F /IM httpd.exe >nul 2>&1
)

tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul 2>&1
if not errorlevel 1 (
    echo Stopping MySQL...
    taskkill /F /IM mysqld.exe >nul 2>&1
)

echo Closing XAMPP Control Panel...
taskkill /F /IM xampp-control.exe >nul 2>&1

echo.
echo [OK] All services stopped
echo.
echo Goodbye!
timeout /t 2 >nul
exit
