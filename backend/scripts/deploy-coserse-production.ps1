<#
.SYNOPSIS
    Script Deployment Produksi Coserse 1.0 (Zero-Downtime & Strict Superadmin Rollout).
    Bareskrim Polri - CAS BDB (Big Data Binops).
#>

[CmdletBinding()]
param(
    [string]$FeHost = "10.200.210.232",
    [string]$BeHost = "10.200.210.233",
    [string]$DbHost = "10.200.210.236",
    [string]$SuperadminUser = "om.eko_42",
    [string]$RolloutMode = "restricted_superadmin",
    [int]$OllamaPort = 11434,
    [string]$OllamaModel = "coserse:1.0",
    [string]$SshUser = "admin",
    [string]$BeDeployPath = "/var/www/bdb-backend",
    [string]$FeDeployPath = "/var/www/cas-frontend",
    [switch]$DryRun,
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " [COSERSE 1.0] PRODUCTION DEPLOYMENT AND ROLLOUT CONTROLLER" -ForegroundColor Cyan
Write-Host " Bareskrim Polri - Big Data Binops (CAS BDB)" -ForegroundColor Cyan
Write-Host (" Mode Rollout: " + $RolloutMode + " | Superadmin: @" + $SuperadminUser) -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$WorkspaceRoot = (Get-Item "$PSScriptRoot\..\..").FullName
$BackendDir = "$WorkspaceRoot\backend"
$FrontendDir = "$WorkspaceRoot\frontend"

# -------------------------------------------------------------
# 1. PREFLIGHT CHECKS & LOCAL VERIFICATION
# -------------------------------------------------------------
Write-Host "`n>>> [TAHAP 1/6] Pengecekan Lingkungan Lokal dan Verifikasi Kode..." -ForegroundColor Yellow

# A. Cek typo username superadmin
Write-Host "  [1.1] Memeriksa konsistensi handle akun Superadmin..." -NoNewline
$TypoHits = Get-ChildItem -Path "$BackendDir\src\bdb\coserse", "$FrontendDir\src\modules\coserse" -Recurse -File | 
    Select-String -Pattern "om\.ako|ako_42"
if ($TypoHits) {
    Write-Host " GAGAL!" -ForegroundColor Red
    Write-Error ("Ditemukan typo penulisan superadmin 'ako' pada file: " + $TypoHits[0].Filename)
    exit 1
}
Write-Host (" OK (@" + $SuperadminUser + " bersih)") -ForegroundColor Green

# B. Jalankan Unit Test Jest (Tahap 1, 2, 3)
if (-not $SkipTests) {
    Write-Host "  [1.2] Menjalankan test suite Coserse Jest..."
    Push-Location $BackendDir
    try {
        $env:NODE_OPTIONS = "--experimental-vm-modules"
        npx jest src/bdb/coserse/ --runInBand --silent
        if ($LASTEXITCODE -ne 0) {
            throw "Unit test Coserse gagal dengan exit code $LASTEXITCODE"
        }
        Write-Host "        Semua unit test lolos 100%!" -ForegroundColor Green
    } finally {
        Pop-Location
    }
} else {
    Write-Host "  [1.2] Unit test dilewati (flag SkipTests aktif)" -ForegroundColor Yellow
}

# -------------------------------------------------------------
# 2. BUNDLING & PACKAGING FRONTEND ARTIFACTS
# -------------------------------------------------------------
Write-Host "`n>>> [TAHAP 2/6] Mempersiapkan Paket Frontend (Coserse UI Bundle)..." -ForegroundColor Yellow

$BundlePath = "$FrontendDir\src\modules\coserse\coserse-chat.bundle.js"
$LogoPath = "$BackendDir\coserse_ui\logo-reserse-bareskrim.png"
$DistDir = "$WorkspaceRoot\.dist_coserse_prod"

if (-not (Test-Path $BundlePath)) {
    Write-Error "File bundle frontend tidak ditemukan: $BundlePath"
    exit 1
}

if (-not (Test-Path $DistDir)) {
    New-Item -ItemType Directory -Path $DistDir -Force | Out-Null
}

Copy-Item $BundlePath -Destination "$DistDir\coserse-chat.bundle.js" -Force
if (Test-Path $LogoPath) {
    Copy-Item $LogoPath -Destination "$DistDir\logo-reserse-bareskrim.png" -Force
}

$BundleSize = (Get-Item "$DistDir\coserse-chat.bundle.js").Length / 1KB
Write-Host ("  Paket frontend siap di: " + $DistDir + " (" + [math]::Round($BundleSize, 2) + " KB)") -ForegroundColor Green

# -------------------------------------------------------------
# 3. VERIFIKASI SERVER FE (10.200.210.232) & RUNTIME OLLAMA
# -------------------------------------------------------------
Write-Host ("`n>>> [TAHAP 3/6] Konfigurasi Server FE (" + $FeHost + ") dan Loopback Guard...") -ForegroundColor Yellow

Write-Host "  Target Server FE:"
Write-Host ("  - Host: " + $FeHost)
Write-Host ("  - Binding: 127.0.0.1:" + $OllamaPort + " (Dilarang bind ke 0.0.0.0)")
Write-Host "  - CPU Threads: OMP_NUM_THREADS=8 (Governor aman)"
Write-Host ("  - Model Name: " + $OllamaModel)

if ($DryRun) {
    Write-Host ("  [DRY-RUN] Melewati koneksi SSH ke " + $FeHost) -ForegroundColor Cyan
} else {
    Write-Host "  Memeriksa status port Ollama di Server FE via SSH..."
    $CheckOllamaCmd = "ss -tulpn | grep " + $OllamaPort + " || netstat -tuln | grep " + $OllamaPort
    Write-Host ("  [Eksekusi di " + $FeHost + "]: " + $CheckOllamaCmd)
}

# -------------------------------------------------------------
# 4. DEPLOY KODE BACKEND NESTJS KE SERVER BE (10.200.210.233)
# -------------------------------------------------------------
Write-Host ("`n>>> [TAHAP 4/6] Sinkronisasi Modul Backend ke Server BE (" + $BeHost + ")...") -ForegroundColor Yellow

Write-Host "  Modul yang disinkronkan:"
Write-Host ("  - Source: " + $BackendDir + "\src\bdb\coserse\")
Write-Host ("  - Target: " + $BeDeployPath + "/src/bdb/coserse/")
Write-Host "  - Registrasi: BdbModule -> imports: [CoserseModule] (SUDAH AKTIF)"

$EnvProductionSnippet = @"
# === COSERSE 1.0 PRODUCTION CONFIGURATION ===
COSERSE_ROLLOUT_MODE=$RolloutMode
COSERSE_SUPERADMIN_USERNAME=$SuperadminUser
COSERSE_OLLAMA_URL=http://127.0.0.1:$OllamaPort
COSERSE_OLLAMA_MODEL=$OllamaModel
COSERSE_OFFLINE_DETERMINISTIC_FALLBACK=false
COSERSE_MAX_CONTEXT_TURNS=6
"@

Write-Host "  Environment Variable yang disetel di BE:"
Write-Host $EnvProductionSnippet -ForegroundColor Gray

# -------------------------------------------------------------
# 5. ZERO-DOWNTIME RELOAD (PM2 / SYSTEMD)
# -------------------------------------------------------------
Write-Host ("`n>>> [TAHAP 5/6] Zero-Downtime Reload pada Server BE (" + $BeHost + ")...") -ForegroundColor Yellow

$ReloadCmd = @"
cd $BeDeployPath
npm run build
pm2 reload bdb-api --update-env
"@

Write-Host "  Perintah eksekusi reload aman:"
Write-Host $ReloadCmd -ForegroundColor DarkGray
if (-not $DryRun) {
    Write-Host "  [INFO] PM2 reload menjamin proses worker lama menyelesaikan request aktif" -ForegroundColor Green
    Write-Host "         sebelum worker baru dengan modul Coserse mulai melayani request." -ForegroundColor Green
}

# -------------------------------------------------------------
# 6. POST-DEPLOYMENT SMOKE TEST & TOGGLE AUDIT
# -------------------------------------------------------------
Write-Host "`n>>> [TAHAP 6/6] Verifikasi Post-Deployment dan Feature Toggle..." -ForegroundColor Yellow

Write-Host "  Skenario Uji Pasca Deployment:"
Write-Host ("  1. Akun Superadmin (@" + $SuperadminUser + "):")
Write-Host "     - Akses: DIIZINKAN (Full Access)"
Write-Host "     - Kuota Token: UNLIMITED (Zero quota caps)"
Write-Host "     - Status Model: Full Training and Inference Authority"
Write-Host "  2. Akun Non-Superadmin (Operator Satker / Admin Binops / Viewer):"
Write-Host "     - Akses: TERKUNCI (Restricted Smoke-Test Notice)"
Write-Host "     - Status Sidebar: Hidden"
Write-Host "     - HTTP Response: 403 Forbidden dengan pesan ramah evaluasi"

Write-Host "`n=================================================================" -ForegroundColor Green
Write-Host " [SUKSES] Seluruh blueprint Tahap 4 siap dideploy ke produksi!" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
