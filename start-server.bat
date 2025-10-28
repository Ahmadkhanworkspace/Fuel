@echo off
echo ========================================
echo   SVFMS Dashboard - Starting Server
echo ========================================
echo.

cd /d "%~dp0"

REM Refresh PATH to include Node.js
set "PATH=%PATH%;C:\Program Files\nodejs"

echo Checking Node.js installation...
node --version
npm --version

if errorlevel 1 (
    echo.
    echo ERROR: Node.js not found in PATH
    echo Please close this window and reopen it, or restart your computer
    pause
    exit /b 1
)

echo.
echo Installing dependencies (if needed)...
call npm install

echo.
echo ========================================
echo   Starting Next.js Development Server
echo ========================================
echo.
echo Server will start at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause

