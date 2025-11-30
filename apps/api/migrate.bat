@echo off
REM Solar Panel API - Database Migration Script (Windows)
REM This script helps manage database migrations safely

echo ===================================
echo   Solar Panel - DB Migrations
echo ===================================
echo.

REM Check if .env file exists
if not exist "..\..\env" (
    echo Error: .env file not found in root directory
    exit /b 1
)

echo Environment: Loaded .env file
echo.

:menu
echo Select an option:
echo 1) Generate migrations (from schema changes)
echo 2) Run migrations (apply to database)
echo 3) Seed database
echo 4) Reset database (WARNING: DANGEROUS)
echo 5) Open Drizzle Studio
echo 6) Exit
echo.

set /p choice="Enter choice [1-6]: "

if "%choice%"=="1" goto generate
if "%choice%"=="2" goto migrate
if "%choice%"=="3" goto seed
if "%choice%"=="4" goto reset
if "%choice%"=="5" goto studio
if "%choice%"=="6" goto exit
goto invalid

:generate
echo.
echo Generating migration files...
call npm run db:generate
echo.
echo Migration files generated!
echo Review the files in the drizzle/ folder
echo Then run: npm run db:migrate
goto done

:migrate
echo.
echo Running database migrations...
call npm run db:migrate
echo.
echo Migrations completed!
goto done

:seed
echo.
echo Seeding database...
call npm run db:seed
echo.
echo Database seeded!
goto done

:reset
echo.
echo WARNING: This will delete all data!
set /p confirm="Are you sure? (yes/no): "
if not "%confirm%"=="yes" (
    echo Reset cancelled
    goto done
)
echo.
echo Resetting database...
call npm run db:reset
echo.
echo Database reset completed!
goto done

:studio
echo.
echo Opening Drizzle Studio...
echo Studio will be available at: http://localhost:4983
call npm run db:studio
goto done

:invalid
echo.
echo Invalid option
goto done

:exit
echo.
echo Goodbye!
exit /b 0

:done
echo.
pause
goto menu
