@echo off
setlocal
cd /d "%~dp0.."
echo Building taosusu store...
call npm run build
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b 1
)
echo.
echo Opening Netlify Drop and dist folder...
start "" "https://app.netlify.com/drop"
start "" explorer "%CD%\dist"
echo.
echo Drag the dist folder into the Netlify page to publish for free.
echo After upload, rename the site to taosusu in Netlify settings if available.
pause
