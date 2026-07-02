@echo off
setlocal
cd /d "%~dp0.."

echo [1/4] Running tests...
call npm test
if errorlevel 1 (
  echo Tests failed. Fix errors before deploying.
  exit /b 1
)

echo.
echo [2/4] Building site...
call npm run build
if errorlevel 1 (
  echo Build failed.
  exit /b 1
)

echo.
echo [3/4] Checking git changes...
git status -sb
git diff --quiet
if errorlevel 1 (
  set /p COMMIT_MSG=Enter commit message (or press Enter for default): 
  if "!COMMIT_MSG!"=="" set COMMIT_MSG=Update taosusu storefront for live site.
  git add -A
  git commit -m "!COMMIT_MSG!"
)

echo.
echo [4/4] Pushing to GitHub (triggers Pages deploy)...
git push origin main
if errorlevel 1 (
  echo.
  echo Push failed. Try VPN, then run: scripts\deploy-live.bat
  exit /b 1
)

echo.
echo Done. Live site updates in 1-3 minutes:
echo https://susu3494740948-wq.github.io/taosusu/
start "" "https://susu3494740948-wq.github.io/taosusu/"
exit /b 0
