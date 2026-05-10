@echo off
setlocal enabledelayedexpansion

REM ========================================================
REM FutureMatrix Ultimate Development Launcher
REM Fixes: UNKNOWN: unknown error, open (Error -4094)
REM ========================================================

echo.
echo [1/4] killing any rogue Node.js processes...
taskkill /f /im node.exe /t 2>nul
timeout /t 1 /nobreak >nul

echo [2/4] Setting environment variables for Windows/OneDrive stability...
set WATCHPACK_POLLING=true
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--max-old-space-size=4096

echo [3/4] Performing deep clean of build artifacts...
set "WEBPACK_CACHE=%TEMP%\next-webpack-cache-futurematrix"
set "NEXT_DEV_BUILD=node_modules\.next-build"

REM Clear local .next build folder if it exists (old artifacts)
if exist ".next" (
    echo [INFO] Removing old local .next folder...
    rmdir /s /q ".next" 2>nul
)

REM Clear the dev build folder inside node_modules
if exist "%NEXT_DEV_BUILD%" (
    echo [INFO] Cleaning dev build directory...
    rmdir /s /q "%NEXT_DEV_BUILD%" 2>nul
)

REM Clear the external webpack cache
if exist "%WEBPACK_CACHE%" (
    echo [INFO] Cleaning external webpack cache...
    rmdir /s /q "%WEBPACK_CACHE%" 2>nul
)

if exist "node_modules\.cache" (
    echo [INFO] Cleaning node_modules cache...
    rmdir /s /q "node_modules\.cache" 2>nul
)

echo [4/4] Starting FutureMatrix Development Server...
echo.
echo ============================================
echo URL: http://localhost:3000
echo ============================================
echo.

REM Verify dependencies
if not exist "node_modules" (
    echo [INFO] Installing missing dependencies...
    call npm install
)

REM Start Next.js
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Dev server crashed. 
    echo [TIP] If you see "UNKNOWN: unknown error", please PAUSE OneDrive sync.
    pause
)

endlocal
exit /b 0

