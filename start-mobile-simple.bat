@echo off
title ASMS Mobile
color 0A

cd /d "%~dp0mobile"

echo Starting Expo on port 8082...
echo.

REM Add Node.js to PATH
set "PATH=%PATH%;C:\Program Files\nodejs"

REM Start Expo
call npx expo start --port 8082

pause

