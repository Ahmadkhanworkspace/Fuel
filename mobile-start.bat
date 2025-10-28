@echo off
title ASMS Mobile App
color 0A

echo ================================================
echo   ASMS MOBILE APP - STARTING...
echo ================================================
echo.
echo Please wait while we start the Expo server...
echo.

cd /d "%~dp0mobile"

echo Checking npm...
where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found!
    echo.
    echo Please install Node.js from:
    echo https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo npm found! Starting Expo...
echo.
echo ================================================
echo IMPORTANT: Keep this window open!
echo ================================================
echo.
echo To use the app:
echo 1. Install "Expo Go" app on your phone
echo 2. Wait for QR code to appear below
echo 3. Scan QR code with Expo Go app
echo 4. App will load on your phone!
echo.
echo ================================================
echo.

call npm start

pause

