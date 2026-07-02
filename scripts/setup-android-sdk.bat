@echo off
setlocal
set "JDK=C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "JAVA_HOME=%JDK%"
set "PATH=%JDK%\bin;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools;%PATH%"

if not exist "%ANDROID_HOME%\licenses" mkdir "%ANDROID_HOME%\licenses"
echo 24333f8a63b6825ea9c5514f83c2829b004d1fee> "%ANDROID_HOME%\licenses\android-sdk-license"
echo 84831b9409646a918e30573bab059c0d49464f1028ea74b> "%ANDROID_HOME%\licenses\android-sdk-preview-license"
echo 504667f4c0de797af6263f0643752d9d98ea4889> "%ANDROID_HOME%\licenses\android-googletv-license"
echo 601085b94cd77f0b157c2e241a7f11d1070c5e1660f7753f93cb8d0a5abd8f> "%ANDROID_HOME%\licenses\android-sdk-arm-dbt-license"
echo 33b6a2b64607f11b759f320ef9dff4ae5c47d5a> "%ANDROID_HOME%\licenses\google-gdk-license"
echo d975f751698a77b662f1254ddbeac3904e829da> "%ANDROID_HOME%\licenses\intel-android-extra-license"
echo e9acfe5bc0f81433216990977adfb0d2e2a2852> "%ANDROID_HOME%\licenses\mips-android-sysimage-license"

echo Installing Android SDK packages...
call sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"
if errorlevel 1 exit /b 1
echo SDK ready.
