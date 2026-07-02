@echo off
setlocal
cd /d "%~dp0.."

if "%GITHUB_USER%"=="" (
  set /p GITHUB_USER=Enter your GitHub username:
)

if "%GITHUB_USER%"=="" (
  echo GitHub username is required.
  pause
  exit /b 1
)

set REPO_NAME=taosusu
set REMOTE=https://github.com/%GITHUB_USER%/%REPO_NAME%.git

echo.
echo 1. Create an empty public repo named "%REPO_NAME%" at:
echo    https://github.com/new?name=%REPO_NAME%
echo 2. Do NOT add README, license, or .gitignore.
echo.
pause

git remote remove origin >nul 2>&1
git remote add origin %REMOTE%

echo Pushing to %REMOTE% ...
git push -u origin main
if errorlevel 1 (
  echo.
  echo Push failed. Sign in when Git asks for credentials, then run this script again.
  pause
  exit /b 1
)

echo.
echo Push succeeded.
echo Next: open https://github.com/%GITHUB_USER%/%REPO_NAME%/settings/pages
echo Set "Build and deployment" to "GitHub Actions".
echo Your site will be live at:
echo https://%GITHUB_USER%.github.io/%REPO_NAME%/
echo.
pause
