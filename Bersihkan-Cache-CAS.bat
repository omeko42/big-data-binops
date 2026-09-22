@echo off
chcp 65001 >nul
title Bersihkan Cache CAS Bareskrim (Hard Refresh Semua Akun/Profile)
color 1F

cls
echo =====================================================================
echo       PEMBERSIH CACHE & REFRESH OTOMATIS CAS BARESKRIM POLRI
echo         (Solusi Otomatis Pengganti "Ctrl + Shift + R")
echo =====================================================================
echo.
echo Masalah yang diatasi:
echo  - Tampilan antar akun Chrome berbeda (misal: "TANGGAL STATUS" vs "DITARIK")
echo  - Fitur terbaru belum muncul di laptop/PC lama (Windows 7 / 10)
echo  - Tampilan web macet atau masih memuat kode versi lama
echo.
echo Alat ini akan:
echo  1. Menutup browser Google Chrome / Microsoft Edge
echo  2. Menghapus seluruh cache di SEMUA AKUN / PROFIL Chrome
echo  3. Membuka kembali CAS Bareskrim dengan data & kode paling mutakhir
echo.
echo Tekan tombol apa saja untuk mulai membersihkan...
pause >nul
echo.

echo [1/3] Menutup aplikasi browser...
taskkill /F /IM chrome.exe /T >nul 2>&1
taskkill /F /IM msedge.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Menghapus file cache browser di semua profil...

:: 1. Hapus Cache Chrome di SEMUA PROFIL (Default, Profile 1, Profile 2, dst)
for /d %%P in ("%LocalAppData%\Google\Chrome\User Data\Default" "%LocalAppData%\Google\Chrome\User Data\Profile *") do (
    if exist "%%~P\Cache" (
        del /q /s /f "%%~P\Cache\*.*" >nul 2>&1
        rd /s /q "%%~P\Cache" >nul 2>&1
    )
    if exist "%%~P\Code Cache" (
        del /q /s /f "%%~P\Code Cache\*.*" >nul 2>&1
        rd /s /q "%%~P\Code Cache" >nul 2>&1
    )
    if exist "%%~P\Service Worker" (
        del /q /s /f "%%~P\Service Worker\*.*" >nul 2>&1
        rd /s /q "%%~P\Service Worker" >nul 2>&1
    )
    if exist "%%~P\GPUCache" (
        del /q /s /f "%%~P\GPUCache\*.*" >nul 2>&1
        rd /s /q "%%~P\GPUCache" >nul 2>&1
    )
)

:: 2. Hapus Cache Edge di semua profil (jika digunakan)
for /d %%P in ("%LocalAppData%\Microsoft\Edge\User Data\Default" "%LocalAppData%\Microsoft\Edge\User Data\Profile *") do (
    if exist "%%~P\Cache" (
        del /q /s /f "%%~P\Cache\*.*" >nul 2>&1
        rd /s /q "%%~P\Cache" >nul 2>&1
    )
    if exist "%%~P\Code Cache" (
        del /q /s /f "%%~P\Code Cache\*.*" >nul 2>&1
        rd /s /q "%%~P\Code Cache" >nul 2>&1
    )
)

echo [3/3] Membuka CAS Bareskrim...
set TARGET_URL=https://cas.bareskrim.polri.go.id/

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --new-window "%TARGET_URL%"
    goto SELESAI
)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --new-window "%TARGET_URL%"
    goto SELESAI
)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" --new-window "%TARGET_URL%"
    goto SELESAI
)
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --new-window "%TARGET_URL%"
    goto SELESAI
)

:: Jika path di atas tidak ditemukan, buka browser default sistem
start "" "%TARGET_URL%"

:SELESAI
echo.
echo =====================================================================
echo  BERHASIL! Cache di SEMUA AKUN / PROFIL telah dibersihkan 100%%.
echo  CAS Bareskrim telah dimuat ulang dengan update terbaru.
echo =====================================================================
echo.
echo Jendela ini akan tertutup otomatis dalam 5 detik...
timeout /t 5 >nul
exit
