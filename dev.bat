@echo off
setlocal enabledelayedexpansion

REM Master startup script - run from parent directory
REM Automatically navigates to miniproject and starts dev server

echo.
echo ============================================
echo FutureMatrix Platform - Master Launcher
echo ============================================
echo.

REM Get the script's directory
set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR%miniproject"

REM Verify miniproject folder exists
if not exist "%PROJECT_DIR%" (
    echo [ERROR] miniproject folder not found!
    echo Expected at: %PROJECT_DIR%
    pause
    exit /b 1
)

echo Navigating to: %PROJECT_DIR%
cd /d "%PROJECT_DIR%"

REM Force kill any stuck node processes to prevent file locks
taskkill /f /im node.exe /t 2>nul
timeout /t 1 /nobreak >nul

REM Verify package.json exists
if not exist "%PROJECT_DIR%\package.json" (
    echo [ERROR] package.json not found in miniproject!
    pause
    exit /b 1
)

echo [OK] Found package.json
echo.

REM Run the dev.bat script in miniproject directory
echo Starting development server...
echo.

call dev.bat

set exit_code=%errorlevel%

endlocal
exit /b %exit_code%
