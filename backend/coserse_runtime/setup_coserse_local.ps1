# Script Setup Runtime Lokal Ollama -> Model "coserse:1.0" (Windows Localhost Sandbox)
# Jalankan di PowerShell lokal setelah menginstal Ollama (https://ollama.com/download/windows).

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ModelfilePath = Join-Path $ScriptDir "Modelfile"

# 1. Paksa isolasi loopback (Zero External Egress / Loopback Only)
$env:OLLAMA_HOST = "127.0.0.1:11434"
$env:OLLAMA_ORIGINS = "http://127.0.0.1:*,http://localhost:*"
$env:OLLAMA_NUM_PARALLEL = "2"
$env:OMP_NUM_THREADS = "8"

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
    Write-Host "[INFO] Binary 'ollama' belum ditemukan di PATH Windows Anda." -ForegroundColor Yellow
    Write-Host "       Silakan install Ollama Windows atau jalankan Llama.cpp via llama_cpp_local.ps1."
    exit 1
}

# 2. Cek apakah Ollama daemon aktif di 127.0.0.1:11434
$portOpen = (Test-NetConnection -ComputerName 127.0.0.1 -Port 11434 -WarningAction SilentlyContinue).TcpTestSucceeded
if (-not $portOpen) {
    Write-Host "[STEP 1] Menyalakan Ollama server di loopback 127.0.0.1:11434..."
    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

# 3. Tarik base model Qwen 2.5 7B Instruct Q4_K_M (~4.7 GB) jika belum ada
$models = ollama list 2>$null
if ($models -notmatch "qwen2\.5:7b-instruct-q4_K_M") {
    Write-Host "[STEP 2] Mengunduh model dasar qwen2.5:7b-instruct-q4_K_M (Q4_K_M)..."
    ollama pull qwen2.5:7b-instruct-q4_K_M
} else {
    Write-Host "[STEP 2] Model dasar qwen2.5:7b-instruct-q4_K_M sudah tersedia."
}

# 4. Build Modelfile resmi lokal coserse:1.0
Write-Host "[STEP 3] Membangun model resmi lokal coserse:1.0 dari $ModelfilePath..."
ollama create coserse:1.0 -f $ModelfilePath

# 5. Verifikasi endpoint lokal /api/tags & smoke test chat
Write-Host "[STEP 4] Verifikasi endpoint http://127.0.0.1:11434/api/tags..."
$tags = Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/tags" -Method Get
$tags.models | Select-Object name, size | Format-Table -AutoSize
Write-Host "[DONE] Engine lokal Coserse 1.0 siap pada http://127.0.0.1:11434" -ForegroundColor Green
