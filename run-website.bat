@echo off
setlocal
title HIZARC Website
rem Double-click this file to start the HIZARC website on this computer.

rem Always run from the folder this file is in
cd /d "%~dp0"

echo.
echo  ==============================================
echo    HIZARC website
echo  ==============================================
echo.

rem 1. Node.js is needed to run the site
where node >nul 2>nul
if errorlevel 1 (
  echo  Node.js is not installed on this computer.
  echo.
  echo  1. Download the "LTS" version from https://nodejs.org
  echo  2. Install it with the default options
  echo  3. Double-click this file again
  echo.
  pause
  exit /b 1
)

rem 2. First run only: download the packages the site uses
if not exist "node_modules\" (
  echo  First run - installing packages. This can take a minute or two...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo  Installing packages failed. Check your internet connection and try again.
    echo.
    pause
    exit /b 1
  )
  echo.
)

rem 3. Start the site and open it in the browser
echo  Starting the website - it will open in your browser in a few seconds.
echo.
echo   - On this computer : the "Local" address below
echo   - On your phone    : the "Network" address marked Wi-Fi (phone on the same Wi-Fi)
echo   - To stop the site : close this window, or press Ctrl+C
echo.
call npm run dev -- --open

echo.
echo  The website has stopped.
pause
