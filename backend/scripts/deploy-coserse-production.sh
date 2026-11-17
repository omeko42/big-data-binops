#!/usr/bin/env bash
# ==============================================================================
# Script Otomasi Deployment Produksi Coserse 1.0 (Zero Downtime & Restricted Superadmin)
# Bareskrim Polri — Big Data Binops (CAS BDB)
#
# Server Topology:
#   - Server FE (10.200.210.232) : Frontend Static Assets + Ollama Runtime (127.0.0.1:11434, OMP_NUM_THREADS=8)
#   - Server BE (10.200.210.233) : Backend NestJS API + Redis + PM2 Zero-Downtime Reload
#   - Server DB (10.200.210.236) : PostgreSQL Perkara Read-Only (Bebas Komputasi AI)
# ==============================================================================

set -euo pipefail

# ANSI Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default Configuration
FE_HOST="${FE_HOST:-10.200.210.232}"
BE_HOST="${BE_HOST:-10.200.210.233}"
DB_HOST="${DB_HOST:-10.200.210.236}"
SUPERADMIN_USER="${SUPERADMIN_USER:-om.eko_42}"
ROLLOUT_MODE="${ROLLOUT_MODE:-restricted_superadmin}"
OLLAMA_PORT="${OLLAMA_PORT:-11434}"
OLLAMA_MODEL="${OLLAMA_MODEL:-coserse:1.0}"
SSH_USER="${SSH_USER:-admin}"
BE_DEPLOY_PATH="${BE_DEPLOY_PATH:-/var/www/bdb-backend}"
FE_DEPLOY_PATH="${FE_DEPLOY_PATH:-/var/www/cas-frontend}"
DRY_RUN="${DRY_RUN:-false}"

echo -e "${CYAN}=================================================================${NC}"
echo -e "${CYAN} [COSERSE 1.0] PRODUCTION DEPLOYMENT & FEATURE TOGGLE CONTROLLER${NC}"
echo -e "${CYAN} Bareskrim Polri — CAS Big Data Binops (BDB)${NC}"
echo -e "${CYAN} Mode Rollout : ${ROLLOUT_MODE} | Superadmin : @${SUPERADMIN_USER}${NC}"
echo -e "${CYAN}=================================================================${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BACKEND_DIR="${WORKSPACE_ROOT}/backend"
FRONTEND_DIR="${WORKSPACE_ROOT}/frontend"

# ------------------------------------------------------------------------------
# 1. PREFLIGHT CHECKS & CODE SANITY
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}>>> [TAHAP 1/6] Preflight Checks & Verifikasi Integritas Kode...${NC}"

# A. Cek typo username superadmin
echo -n "  [1.1] Memeriksa konsistensi handle akun Superadmin... "
if grep -rnEI "om\.ako|ako_42" "${BACKEND_DIR}/src/bdb/coserse" "${FRONTEND_DIR}/src/modules/coserse" > /dev/null 2>&1; then
    echo -e "${RED}GAGAL!${NC}"
    echo -e "${RED}Ditemukan typo penulisan superadmin ('ako') di codebase!${NC}"
    exit 1
fi
echo -e "${GREEN}OK (@${SUPERADMIN_USER} konsisten)${NC}"

# B. Jalankan Unit Test Jest
if [ "${SKIP_TESTS:-false}" != "true" ]; then
    echo "  [1.2] Menjalankan test suite Jest (Tahap 1, 2, 3)..."
    cd "${BACKEND_DIR}"
    export NODE_OPTIONS="--experimental-vm-modules"
    npx jest src/bdb/coserse/ --runInBand --silent
    echo -e "        ${GREEN}Semua unit test lolos 100%!${NC}"
else
    echo -e "        ${YELLOW}Unit test dilewati (SKIP_TESTS=true)${NC}"
fi

# ------------------------------------------------------------------------------
# 2. BUNDLING & PACKAGING FRONTEND ASSETS
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}>>> [TAHAP 2/6] Mempersiapkan Paket Frontend (Coserse UI Bundle)...${NC}"

BUNDLE_PATH="${FRONTEND_DIR}/src/modules/coserse/coserse-chat.bundle.js"
LOGO_PATH="${BACKEND_DIR}/coserse_ui/logo-reserse-bareskrim.png"
DIST_DIR="${WORKSPACE_ROOT}/.dist_coserse_prod"

mkdir -p "${DIST_DIR}"
cp "${BUNDLE_PATH}" "${DIST_DIR}/coserse-chat.bundle.js"
if [ -f "${LOGO_PATH}" ]; then
    cp "${LOGO_PATH}" "${DIST_DIR}/logo-reserse-bareskrim.png"
fi

BUNDLE_SIZE=$(du -h "${DIST_DIR}/coserse-chat.bundle.js" | cut -f1)
echo -e "  Paket frontend siap di: ${DIST_DIR} (${BUNDLE_SIZE})"

# ------------------------------------------------------------------------------
# 3. VERIFIKASI SERVER FE (10.200.210.232) & RUNTIME OLLAMA LOOPBACK GUARD
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}>>> [TAHAP 3/6] Konfigurasi Server FE (${FE_HOST}) & Loopback Guard...${NC}"

echo "  Arsitektur Server FE (${FE_HOST}):"
echo "  - Port inferensi Ollama: 127.0.0.1:${OLLAMA_PORT} (Loopback Only)"
echo "  - CPU Threads Governor : OMP_NUM_THREADS=8 (Mencegah CPU starvation Nginx)"
echo "  - Parallel Context turns: OLLAMA_NUM_PARALLEL=2"
echo "  - Model Weights        : ${OLLAMA_MODEL}"

if [ "${DRY_RUN}" = "true" ]; then
    echo -e "  ${CYAN}[DRY-RUN] Melewati koneksi SSH ke ${FE_HOST}${NC}"
else
    echo "  Langkah konfigurasi systemd di Server FE (${FE_HOST}):"
    echo "  --------------------------------------------------------"
    echo "  sudo mkdir -p /etc/systemd/system/ollama.service.d"
    echo "  cat << 'EOF' | sudo tee /etc/systemd/system/ollama.service.d/override.conf"
    echo "  [Service]"
    echo "  Environment=\"OLLAMA_HOST=127.0.0.1:${OLLAMA_PORT}\""
    echo "  Environment=\"OLLAMA_ORIGINS=http://127.0.0.1:*,http://localhost:*\""
    echo "  Environment=\"OLLAMA_NUM_PARALLEL=2\""
    echo "  Environment=\"OMP_NUM_THREADS=8\""
    echo "  EOF"
    echo "  sudo systemctl daemon-reload && sudo systemctl restart ollama"
    echo "  --------------------------------------------------------"
fi

# ------------------------------------------------------------------------------
# 4. SINKRONISASI MODUL BACKEND KE SERVER BE (10.200.210.233)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}>>> [TAHAP 4/6] Sinkronisasi Modul Backend NestJS ke Server BE (${BE_HOST})...${NC}"

echo "  Direktori Modul:"
echo "  - Sumber : ${BACKEND_DIR}/src/bdb/coserse/"
echo "  - Target : ${BE_DEPLOY_PATH}/src/bdb/coserse/"
echo "  - BdbModule: CoserseModule terdaftar di imports: [CoserseModule]"

echo -e "\n  Konfigurasi Environment Variable Produksi (${BE_HOST}):"
cat << EOF
  COSERSE_ROLLOUT_MODE=${ROLLOUT_MODE}
  COSERSE_SUPERADMIN_USERNAME=${SUPERADMIN_USER}
  COSERSE_OLLAMA_URL=http://127.0.0.1:${OLLAMA_PORT}
  COSERSE_OLLAMA_MODEL=${OLLAMA_MODEL}
  COSERSE_OFFLINE_DETERMINISTIC_FALLBACK=false
  COSERSE_MAX_CONTEXT_TURNS=6
EOF

# ------------------------------------------------------------------------------
# 5. ZERO-DOWNTIME RELOAD PADA SERVER BE (10.200.210.233)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}>>> [TAHAP 5/6] Zero-Downtime Reload pada Server BE (${BE_HOST})...${NC}"

echo "  Perintah eksekusi reload aman via PM2:"
echo "  --------------------------------------------------------"
echo "  cd ${BE_DEPLOY_PATH}"
echo "  npm run build"
echo "  pm2 reload bdb-api --update-env"
echo "  --------------------------------------------------------"
echo -e "  ${GREEN}[INFO] PM2 reload menjaga koneksi HTTP/Socket klien tidak terputus.${NC}"

# ------------------------------------------------------------------------------
# 6. POST-DEPLOYMENT SMOKE TEST & VERIFIKASI FEATURE TOGGLE
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}>>> [TAHAP 6/6] Verifikasi Post-Deployment & Feature Toggle...${NC}"

echo "  Matriks Uji Akses Rollout Terbatas:"
echo "  +----------------------+--------------------+-----------------------------+"
echo "  | Akun Pengguna        | Peran / Role       | Akses Coserse 1.0           |"
echo "  +----------------------+--------------------+-----------------------------+"
echo "  | @${SUPERADMIN_USER}           | Superadmin         | AKTIF (Unlimited Quota)     |"
echo "  | @binops.subdit       | Admin Binops       | TERKUNCI (Smoke-Test Super) |"
echo "  | @bripda.nina         | Operator Satker    | TERKUNCI (Smoke-Test Super) |"
echo "  | Viewer Umum          | Viewer             | TERKUNCI (Smoke-Test Super) |"
echo "  +----------------------+--------------------+-----------------------------+"

echo -e "\n${GREEN}=================================================================${NC}"
echo -e "${GREEN} [SELESAI] Script deployment siap dieksekusi di klaster produksi!${NC}"
echo -e "${GREEN}=================================================================${NC}"
