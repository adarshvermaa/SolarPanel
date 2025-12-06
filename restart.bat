@echo off
echo ========================================
echo   Solar Panel Platform - Restart Script
echo ========================================
echo.

REM Stop all node processes running Next.js and NestJS
echo [1/3] Stopping frontend and backend processes...
echo.

REM Kill all node processes (this will stop both frontend and backend)
taskkill /F /IM node.exe /T 2>nul
if %errorlevel% equ 0 (
    echo ✓ Processes stopped successfully
) else (
    echo ℹ No running processes found or already stopped
)

echo.
echo [2/3] Waiting for processes to fully terminate...
timeout /t 3 /nobreak >nul
echo.

REM Start both frontend and backend
echo [3/3] Starting frontend and backend...
echo.
echo Starting development servers...
start "SolarPanel Dev" cmd /k "npm run dev"

echo.
echo ========================================
echo ✓ Restart Complete!
echo ========================================
echo.
echo The development servers are starting...
echo - Frontend (Next.js) will run on http://localhost:3000
echo - Backend (NestJS) will run on http://localhost:3001
echo.
echo Check the new terminal window for logs.
echo ========================================
pause
