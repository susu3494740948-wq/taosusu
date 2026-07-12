@echo off
rem Start the live-site auto sync watcher.
rem Keep this window open; every saved change is pushed to GitHub
rem and the live site redeploys automatically.
cd /d "%~dp0.."
title taosusu live sync
node scripts\sync-live.mjs
pause
