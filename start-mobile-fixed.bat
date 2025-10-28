@echo off
title ASMS Mobile App
color 0A

echo ================================================
echo   ASMS MOBILE APP - STARTING...
echo ================================================
echo.

REM Set PATH to include Node.js
set PATH=%PATH%;C:\Program Files\nodejs

REM Change to mobile directory
cd /d "%~dp0mobile"

echo Checking node...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found in PATH!
    echo.
    echo Please install Node.js from:
    echo https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo Node.js found!
echo.

REM Check if node_modules exists, if not install
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo ================================================
echo   STARTING EXPO SERVER
echo ================================================
echo.
echo IMPORTANT: Keep this window open!
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

