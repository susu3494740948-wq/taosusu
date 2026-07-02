@echo off
setlocal EnableExtensions
set "JDK=C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "JAVA_HOME=%JDK%"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"

cd /d "%~dp0.."
call npm run build
if errorlevel 1 exit /b 1
call npx cap sync android
if errorlevel 1 exit /b 1
cd android
call gradlew.bat assembleDebug
if errorlevel 1 exit /b 1

set "APK=app\build\outputs\apk\debug\app-debug.apk"
if not exist "%APK%" (
  echo APK not found
  exit /b 1
)

copy /Y "%APK%" "%USERPROFILE%\Desktop\PomodoroTimer.apk" >nul
echo.
echo APK: %USERPROFILE%\Desktop\PomodoroTimer.apk
