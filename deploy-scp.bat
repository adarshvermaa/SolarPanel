@echo off
echo ====================================
echo Deploying to EC2 Server (SCP)...
echo ====================================

set SSH_KEY=pk.pem
set SERVER=ubuntu@ec2-13-232-231-175.ap-south-1.compute.amazonaws.com
set REMOTE_PATH=/home/ubuntu/SolarPanel

REM Change to parent directory to get the pk.pem
cd /d "%~dp0\.."

echo Creating temporary archive...
cd "%~dp0"

REM Create a temporary tar file excluding gitignore patterns
tar --exclude="node_modules" ^
    --exclude=".git" ^
    --exclude="dist" ^
    --exclude=".next" ^
    --exclude=".turbo" ^
    --exclude="*.log" ^
    --exclude=".env.local" ^
    -czf temp-deploy.tar.gz .

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to create archive
    pause
    exit /b 1
)

echo Transferring to server...
cd /d "%~dp0\.."
scp -i %SSH_KEY% "%~dp0temp-deploy.tar.gz" %SERVER%:/home/ubuntu/

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to transfer files
    del "%~dp0temp-deploy.tar.gz"
    pause
    exit /b 1
)

echo Extracting on server...
ssh -i %SSH_KEY% %SERVER% "cd /home/ubuntu && rm -rf SolarPanel.backup && mv SolarPanel SolarPanel.backup 2>/dev/null; mkdir -p SolarPanel && tar -xzf temp-deploy.tar.gz -C SolarPanel && rm temp-deploy.tar.gz"

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to extract files on server
    del "%~dp0temp-deploy.tar.gz"
    pause
    exit /b 1
)

REM Clean up local temp file
del "%~dp0temp-deploy.tar.gz"

echo.
echo ====================================
echo Deployment completed successfully!
echo ====================================
echo.
echo Run the following commands on server:
echo   cd /home/ubuntu/SolarPanel
echo   npm install
echo   npm run build
echo   pm2 restart all
echo.
pause
