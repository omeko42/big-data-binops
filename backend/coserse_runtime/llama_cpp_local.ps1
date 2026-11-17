# Alternatif Engine Lokal Berbasis Llama.cpp (llama-server) untuk Qwen 2.5 7B Instruct Q4_K_M GGUF
# Gunakan script ini jika memilih menjalankan file GGUF langsung tanpa Ollama daemon.

param(
    [string]$ModelPath = "$PSScriptRoot\models\qwen2.5-7b-instruct-q4_k_m.gguf",
    [int]$Threads = 8,
    [int]$CtxSize = 4096,
    [int]$Port = 8080
)

if (-not (Get-Command llama-server -ErrorAction SilentlyContinue)) {
    Write-Host "[INFO] Binary 'llama-server' (llama.cpp) belum ditemukan di PATH Windows." -ForegroundColor Yellow
    Write-Host "       Set env COSERSE_RUNTIME_PROVIDER=llamacpp dan COSERSE_LLAMA_CPP_URL=http://127.0.0.1:$Port/v1/chat/completions setelah binary tersedia."
    exit 1
}

if (-not (Test-Path $ModelPath)) {
    Write-Host "[ERROR] File GGUF tidak ditemukan di: $ModelPath" -ForegroundColor Red
    exit 1
}

Write-Host "[START] Menjalankan llama-server Coserse 1.0 (Loopback 127.0.0.1:$Port, Ctx=$CtxSize, Threads=$Threads)..."
& llama-server `
    --model $ModelPath `
    --alias "coserse:1.0" `
    --host "127.0.0.1" `
    --port $Port `
    --ctx-size $CtxSize `
    --threads $Threads `
    --temp 0.1 `
    --parallel 2
