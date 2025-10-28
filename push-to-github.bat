@echo off
echo ========================================
echo   PUSH TO GITHUB
echo ========================================
echo.
echo This will push your project to GitHub
echo Repository: https://github.com/Ahmadkhanworkspace/Fuel.git
echo.
pause

echo.
echo Step 1: Initializing Git...
git init

echo.
echo Step 2: Adding all files...
git add .

echo.
echo Step 3: Creating initial commit...
git commit -m "Initial commit: ASMS Vehicle Management System - Complete dashboard and mobile app with Supabase integration"

echo.
echo Step 4: Adding remote repository...
git remote add origin https://github.com/Ahmadkhanworkspace/Fuel.git

echo.
echo Step 5: Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Your project is now on GitHub:
echo https://github.com/Ahmadkhanworkspace/Fuel
echo.

pause


