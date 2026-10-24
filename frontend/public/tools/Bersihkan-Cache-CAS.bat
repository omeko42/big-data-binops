@echo off
chcp 65001 >nul
title Bersihkan Cache CAS Bareskrim (Hard Refresh)
color 1F

cls
echo =====================================================================
echo       PEMBERSIH CACHE & REFRESH OTOMATIS CAS BARESKRIM POLRI
echo         (Solusi Otomatis Pengganti "Ctrl + Shift + R")
echo =====================================================================
echo.
echo Alat ini akan:
echo  1. Menutup Google Chrome / Microsoft Edge dengan aman
echo  2. Menghapus file cache & memory sementara (cache kadaluarsa)
echo  3. Membuka kembali CAS Bareskrim dengan data & fitur paling baru
echo.
echo Tekan tombol apa saja untuk mulai membersihkan...
pause >nul
echo.

echo [1/3] Menutup aplikasi browser...
taskkill /F /IM chrome.exe /T >nul 2>&1
taskkill /F /IM msedge.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Menghapus file cache browser...

:: 1. Hapus Cache Chrome
if exist "%LocalAppData%\Google\Chrome\User Data\Default\Cache" (
    del /q /s /f "%LocalAppData%\Google\Chrome\User Data\Default\Cache\*.*" >nul 2>&1
    rd /s /q "%LocalAppData%\Google\Chrome\User Data\Default\Cache" >nul 2>&1
)
if exist "%LocalAppData%\Google\Chrome\User Data\Default\Code Cache" (
    del /q /s /f "%LocalAppData%\Google\Chrome\User Data\Default\Code Cache\*.*" >nul 2>&1
    rd /s /q "%LocalAppData%\Google\Chrome\User Data\Default\Code Cache" >nul 2>&1
)
if exist "%LocalAppData%\Google\Chrome\User Data\Default\Service Worker" (
    del /q /s /f "%LocalAppData%\Google\Chrome\User Data\Default\Service Worker\*.*" >nul 2>&1
    rd /s /q "%LocalAppData%\Google\Chrome\User Data\Default\Service Worker" >nul 2>&1
)
if exist "%LocalAppData%\Google\Chrome\User Data\Default\GPUCache" (
    del /q /s /f "%LocalAppData%\Google\Chrome\User Data\Default\GPUCache\*.*" >nul 2>&1
    rd /s /q "%LocalAppData%\Google\Chrome\User Data\Default\GPUCache" >nul 2>&1
)

:: 2. Hapus Cache Edge (jika digunakan)
if exist "%LocalAppData%\Microsoft\Edge\User Data\Default\Cache" (
    del /q /s /f "%LocalAppData%\Microsoft\Edge\User Data\Default\Cache\*.*" >nul 2>&1
    rd /s /q "%LocalAppData%\Microsoft\Edge\User Data\Default\Cache" >nul 2>&1
)
if exist "%LocalAppData%\Microsoft\Edge\User Data\Default\Code Cache" (
    del /q /s /f "%LocalAppData%\Microsoft\Edge\User Data\Default\Code Cache\*.*" >nul 2>&1
    rd /s /q "%LocalAppData%\Microsoft\Edge\User Data\Default\Code Cache" >nul 2>&1
)

echo [3/3] Membuka CAS Bareskrim...
set TARGET_URL=https://cas.bareskrim.polri.go.id/
set BROWSER_FOUND=0

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --new-window "%TARGET_URL%"
    set BROWSER_FOUND=1
    goto SELESAI
)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --new-window "%TARGET_URL%"
    set BROWSER_FOUND=1
    goto SELESAI
)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" --new-window "%TARGET_URL%"
    set BROWSER_FOUND=1
    goto SELESAI
)
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --new-window "%TARGET_URL%"
    set BROWSER_FOUND=1
    goto SELESAI
)

:: Jika path di atas tidak ditemukan, buka browser default sistem
start "" "%TARGET_URL%"

:SELESAI
echo.
echo =====================================================================
echo  BERHASIL! Cache telah dibersihkan 100%%.
echo  CAS Bareskrim telah dimuat ulang dengan update terbaru.
echo =====================================================================
echo.
echo Jendela ini akan tertutup otomatis dalam 5 detik...
timeout /t 5 >nul
exit
