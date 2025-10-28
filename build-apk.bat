@echo off
echo ========================================
echo   BUILD ANDROID APK
echo ========================================
echo.
cd mobile

echo Installing EAS CLI...
call npm install -g eas-cli

echo.
echo ========================================
echo If you haven't logged in yet:
echo ========================================
echo Run: eas login
echo.
echo Then run this script again to build APK
echo.
pause

echo.
echo Building Android APK...
echo This will take 10-15 minutes
echo.

eas build --platform android --profile preview

echo.
echo ========================================
echo BUILD COMPLETE!
echo ========================================
echo.
echo Check your email for download link
echo.

pause


