@echo off
echo ====================================
echo Deploying to EC2 Server...
echo ====================================

set SSH_KEY=pk.pem
set SERVER=ubuntu@ec2-13-232-231-175.ap-south-1.compute.amazonaws.com
set REMOTE_PATH=/home/ubuntu/SolarPanel

REM Change to parent directory to get the pk.pem
cd /d "%~dp0\.."

REM Use rsync (requires WSL or Git Bash with rsync installed)
echo Syncing files (excluding .gitignore patterns)...

wsl rsync -avz --progress ^
  --exclude-from="%~dp0.gitignore" ^
  --exclude="node_modules/" ^
  --exclude=".git/" ^
  --exclude="dist/" ^
  --exclude=".next/" ^
  --exclude=".turbo/" ^
  --exclude="*.log" ^
  --exclude=".env.local" ^
  -e "ssh -i %SSH_KEY%" ^
  "%~dp0" ^
  %SERVER%:%REMOTE_PATH%

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ====================================
    echo Error: Deployment failed!
    echo ====================================
    echo.
    echo If you don't have WSL/rsync, use deploy-scp.bat instead
    pause
    exit /b 1
)

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
