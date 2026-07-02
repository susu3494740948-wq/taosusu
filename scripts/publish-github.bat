@echo off
setlocal
cd /d "%~dp0.."

set REPO_NAME=taosusu
set GITHUB_USER=%~1

if "%GITHUB_USER%"=="" (
  set /p GITHUB_USER=GitHub username:
)

if "%GITHUB_USER%"=="" (
  echo Missing GitHub username.
  exit /b 1
)

set REMOTE=https://github.com/%GITHUB_USER%/%REPO_NAME%.git

echo Checking GitHub repo...
git ls-remote %REMOTE% >nul 2>&1
if errorlevel 1 (
  echo.
  echo Repo not found yet. Create an empty public repo first:
  echo https://github.com/new?name=%REPO_NAME%
  echo Do NOT add README, license, or .gitignore.
  echo.
  start "" "https://github.com/new?name=%REPO_NAME^&description=Taosusu+demo+store^&visibility=public"
  pause
)

git remote remove origin >nul 2>&1
git remote add origin %REMOTE%

echo Pushing to %REMOTE% ...
git push -u origin main
if errorlevel 1 (
  echo Push failed. Complete GitHub login in the browser popup, then run:
  echo   scripts\publish-github.bat %GITHUB_USER%
  exit /b 1
)

echo.
echo Done. Enable GitHub Pages:
start "" "https://github.com/%GITHUB_USER%/%REPO_NAME%/settings/pages"
echo Site URL: https://%GITHUB_USER%.github.io/%REPO_NAME%/
exit /b 0
