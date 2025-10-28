@echo off
echo ========================================
echo   DEPLOY TO VERCEL
echo ========================================
echo.
echo Installing Vercel CLI...
call npm install -g vercel
echo.
echo ========================================
echo Please follow these steps:
echo ========================================
echo.
echo 1. Login to Vercel
echo    Type: vercel login
echo.
echo 2. Deploy to production
echo    Type: vercel --prod
echo.
echo 3. When prompted, enter your environment variables
echo.
echo ========================================
echo Starting Vercel login...
echo ========================================
echo.

vercel login

if %errorlevel% equ 0 (
    echo.
    echo Login successful!
    echo.
    echo Now deploying to Vercel...
    vercel --prod
) else (
    echo.
    echo Login failed. Please try again.
    pause
)

pause


