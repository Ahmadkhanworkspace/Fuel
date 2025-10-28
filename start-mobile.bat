@echo off
echo ====================================
echo Starting ASMS Mobile App
echo ====================================
echo.
echo Make sure you have installed:
echo 1. Node.js (https://nodejs.org)
echo 2. Expo Go app on your phone
echo.
echo ====================================
echo.

cd mobile

echo Installing dependencies...
call npm install

echo.
echo Starting Expo...
echo.
echo To open the app:
echo 1. Install Expo Go on your phone
echo 2. Scan the QR code below
echo 3. App will load on your phone!
echo.
echo ====================================

call npm start

pause

