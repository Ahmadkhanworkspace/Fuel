@echo off
echo.
echo ========================================
echo  SVFMS Dashboard - Starting Server
echo ========================================
echo.

cd /d "%~dp0"

echo Installing dependencies (if needed)...
call npm install

echo.
echo Starting development server...
echo.
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

