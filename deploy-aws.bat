@echo off
echo ========================================
echo    AWS Deployment Helper Script
echo ========================================
echo.

:menu
echo Choose deployment step:
echo 1. Build Frontend for Production
echo 2. Create Deployment Package
echo 3. Show AWS Commands
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto build_frontend
if "%choice%"=="2" goto create_package
if "%choice%"=="3" goto show_commands
if "%choice%"=="4" goto exit
goto menu

:build_frontend
echo Building frontend for production...
cd frontend
copy .env.production .env
npm run build
echo Frontend built successfully!
cd ..
pause
goto menu

:create_package
echo Creating deployment package...
if not exist "aws-deploy" mkdir aws-deploy
xcopy backend aws-deploy\backend /E /I /Y
xcopy frontend\build aws-deploy\frontend /E /I /Y
echo Deployment package created in 'aws-deploy' folder
pause
goto menu

:show_commands
echo.
echo ========================================
echo    AWS CLI Commands Reference
echo ========================================
echo.
echo 1. Upload to EC2 (after creating instance):
echo    scp -i "your-key.pem" -r aws-deploy ubuntu@your-ec2-ip:~/
echo.
echo 2. Connect to EC2:
echo    ssh -i "your-key.pem" ubuntu@your-ec2-ip
echo.
echo 3. Setup on EC2:
echo    cd aws-deploy/backend
echo    npm install --production
echo    pm2 start index.js --name api
echo.
echo 4. Setup frontend on EC2:
echo    sudo npm install -g serve
echo    pm2 start "serve -s ../frontend -l 3000" --name frontend
echo.
pause
goto menu

:exit
echo Goodbye!
exit