# PANDUAN DEPLOYMENT, REPOSITORI AMAN & LANGKAH EKSEKUSI TEKNIS
## Modul Coserse (AI Agent Bareskrim Polri)

> **File**: `docs/coserse_blueprint/05_DEPLOYMENT_AND_REPOS_REFERENCE.md`  
> **Klasifikasi**: PANDUAN DEPLOYMENT TEKNIS / AUTOMATION SCRIPT  
> **Target OS**: Linux x86_64 (Enterprise Linux / Ubuntu) On-Premise  
> **Tanggal**: November 2026  

---

## 1. Kurasi Repositori Open-Source Resmi & Aman (Vetted & Clean Repos)
Seluruh komponen perangkat lunak yang direkomendasikan adalah proyek sumber terbuka bereputasi internasional, bebas dari malware/telemetri berbahaya, dan dapat berjalan secara luring (*offline/air-gapped*):

| Kategori Komponen | Nama Proyek / Repositori Resmi | Lisensi | Kegunaan dalam Coserse |
| :--- | :--- | :--- | :--- |
| **Inference Engine** | `ollama/ollama` (GitHub) atau `ggerganov/llama.cpp` | MIT / Apache-2.0 | Engine inferensi model GGUF pada CPU multi-threading. Sangat ringan, cepat, dan tidak mengirim data ke luar. |
| **Model Weights** | `Qwen/Qwen2.5-7B-Instruct-GGUF` (HuggingFace resmi Alibaba Cloud) | Apache-2.0 | Bobot model terlatih AI resmi. Varian file: `qwen2.5-7b-instruct-q4_k_m.gguf`. |
| **Doc Parser (.docx)**| `mwilliamson/mammoth.js` (GitHub/NPM) | BSD-2-Clause | Parser Word DOCX murni tanpa memicu makro, mengekstrak paragraf teks bersih langsung di RAM. |
| **PDF Text Extractor**| `mozilla/pdf.js` via `pdf-parse` (NPM) | Apache-2.0 | Engine PDF standar industri resmi dari Mozilla, aman dari eksekusi exploit biner Acrobat. |
| **Vector Indexing (Opsional)** | `pgvector/pgvector` (GitHub) | PostgreSQL License | Ekstensi resmi PostgreSQL untuk pencarian kesamaan semantik narasi LP dan pasal hukum. |

---

## 2. Panduan Langkah-demi-Langkah Deployment (Step-by-Step)

### Langkah 1: Instalasi & Konfigurasi Ollama Local Service
Di server backend BDB (`127.0.0.1`):

```bash
# 1. Download binary resmi Ollama untuk Linux x86_64
curl -fsSL https://ollama.com/install.sh | sh

# 2. Konfigurasi environment binding HANYA ke Localhost (Kunci keamanan)
sudo mkdir -p /etc/systemd/system/ollama.service.d
cat << 'EOF' | sudo tee /etc/systemd/system/ollama.service.d/override.conf
[Service]
Environment="OLLAMA_HOST=127.0.0.1:11434"
Environment="OLLAMA_ORIGINS=http://127.0.0.1:*,http://localhost:*"
Environment="OLLAMA_NUM_PARALLEL=2"
Environment="OMP_NUM_THREADS=8"
EOF

# 3. Reload daemon dan jalankan service
sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl restart ollama
```

### Langkah 2: Pemasangan & Penamaan Resmi Model Coserse 1.0
Buat file definisi model `Modelfile` lokal untuk melabeli model secara resmi menjadi **Coserse 1.0**:

```bash
# 1. Unduh bobot dasar Qwen 2.5 7B Q4
ollama pull qwen2.5:7b-instruct-q4_K_M

# 2. Buat Modelfile Coserse 1.0
cat << 'EOF' > Modelfile
FROM qwen2.5:7b-instruct-q4_K_M

PARAMETER temperature 0.1
PARAMETER num_ctx 4096
PARAMETER stop "<|im_end|>"

SYSTEM """
Identitas: Anda adalah Coserse 1.0 (dipanggil akrab 'Cosersebot'), mitra kerja cerdas dan rekan sesama reserse di Bareskrim Polri.
Gaya Bahasa:
1. Luwes, taktis, bersahabat, dan manusiawi layaknya senior/rekan reserse yang berpengalaman (JANGAN KAKU SEPERTI ROBOT/MESIN).
2. PANGGILAN PERSONAL: Selalu sebut nama atau handle akun pengguna secara dinamis (contoh: '@om.eko_42', '@budi_satreskrim') agar interaksi terasa hidup, akrab, dan tidak garing. Hindari panggilan generik kaku.
3. Hindari kalimat template birokratis yang kaku seperti 'Sistem mendeteksi...' atau 'Sebagai program AI...'.
4. Jika ada data yang tidak bisa dibuka karena batasan role, tolak dengan santai dan beri solusi:
   'Waduh mohon izin nih @username, akun kamu belum ada akses ke data perkara satker sebelah. Coba calling Admin Binops dulu biar dibukain izinnya ya! Mau cek data yang lain dulu?'
5. Tetap akurat, faktual, dan tidak berhalusinasi dalam hal pasal hukum serta nomor LP.
6. Selalu ingat bahwa pengguna Anda adalah Staf Pembinaan Operasional (Binops) yang mengelola administrasi & manajerial perkara (bukan penyidik pro-justitia).
7. Di setiap akhir respon, cantumkan catatan kaki baku:
   "Coserse dapat melakukan kesalahan. Hanya untuk internal dan tolong periksa ulang hasil pekerjaan."
"""
EOF

# 3. Build model lokal dengan nama resmi Coserse 1.0
ollama create coserse:1.0 -f Modelfile

# 4. Verifikasi Coserse 1.0 sudah aktif
curl http://127.0.0.1:11434/api/tags
# Output akan menampilkan: "name": "coserse:1.0"
```

### 3. Integrasi Cosersebot Obrolan (Connecting to Existing @cosersebot)

Di dalam `jukrah.service.ts` eksisting, handler obrolan AI `receiver_id === -1` (`Cosersebot`) yang sebelumnya memakai respons teks statis kini disambungkan ke engine **Coserse 1.0**:

```typescript
// Cuplikan integrasi di jukrah.service.ts / coserse-chat.handler.ts
async handleCosersebotMessage(user: any, content: string) {
  const role = user?.role_bdb || 'viewer';
  const scopeSatker = user?.scope_satker_name || 'Umum';

  // 1. Guard Role: Batasi lingkup pertanyaan berdasarkan role
  const roleGuardPrompt = `
    Konteks Pengguna:
    - Nama: ${user?.name}
    - Role: ${role}
    - Satker: ${scopeSatker}
    
    Aturan Ketat Wewenang:
    - Jika role 'viewer', tolak pertanyaan terkait profiling data pribadi orang/tersangka.
    - Jika role 'operator', batasi jawaban seputar lingkup satker pengguna saja (${scopeSatker}).
    - Jawab dengan santun kedinasan menggunakan sapaan: "Siap Rekan Personil!"
  `;

  // 2. Alirkan pesan ke engine lokal Coserse 1.0
  const reply = await this.coserseService.askCoserse(content, roleGuardPrompt);
  return reply;
}
```

---

## 3. Template Service Integrasi NestJS (Backend BDB)

Di dalam project NestJS BDB, buat modul `coserse`:

```typescript
// coserse.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class CoserseService {
  private readonly OLLAMA_URL = 'http://127.0.0.1:11434/api/chat';
  private readonly SANDBOX_DIR = '/dev/shm/coserse_sandbox';

  /**
   * Eksekusi prompt ke model lokal dengan isolasi sistem
   */
  async askCoserse(userPrompt: string, history: Array<{ role: string; content: string }> = []) {
    const systemPrompt = `
      Anda adalah Coserse, asisten reserse cerdas Bareskrim Polri.
      Tugas utama Anda:
      1. Membantu profiling keterlibatan orang (NIK, Nama, No HP, Rekening) berdasarkan fakta LP.
      2. Membantu ekstraksi data dokumen mindik kepolisian.
      3. Dilarang mengarang data (halusinasi). Jika data tidak ditemukan di database, katakan tidak ditemukan.
      4. Gunakan bahasa Indonesia kedinasan yang ringkas, presisi, dan sopan.
    `;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6), // Batasan 6 turn konteks memori
      { role: 'user', content: userPrompt }
    ];

    try {
      const response = await axios.post(this.OLLAMA_URL, {
        model: 'qwen2.5:7b-instruct-q4_K_M',
        messages: messages,
        stream: false,
        options: {
          temperature: 0.1, // Suhu rendah agar konsisten dan faktual
          num_ctx: 4096
        }
      }, { timeout: 30000 });

      return response.data.message.content;
    } catch (err) {
      throw new BadRequestException('Layanan Coserse internal sedang sibuk atau tidak merespon.');
    }
  }

  /**
   * Proses file dokumen sementara di RAM disk lalu musnahkan seketika
   */
  async processTemporaryDocument(fileBuffer: Buffer, fileName: string): Promise<string> {
    const tempFilePath = path.join(this.SANDBOX_DIR, `temp_${Date.now()}_${path.basename(fileName)}`);
    try {
      // 1. Tulis murni ke RAM disk
      await fs.writeFile(tempFilePath, fileBuffer);

      // 2. Ekstrak teks murni (contoh docx / text)
      // Gunakan parser mammoth atau pdf-parse di sini
      const extractedText = "Hasil ekstraksi teks dari dokumen...";

      return extractedText;
    } finally {
      // 3. ZERO RESIDUE: Pastikan file fisik di RAM disk langsung dimusnahkan seketika
      try {
        await fs.unlink(tempFilePath);
      } catch (e) {
        // Abaikan jika sudah terhapus
      }
    }
  }
}
```

---

## 4. Checklist Kesiapan Uji Coba Deployment (Go-Live Checklist)

- [ ] **Koneksi Jaringan Tertutup**: Port `11434` dipastikan hanya merespon IP `127.0.0.1` (`netstat -tuln | grep 11434`).
- [ ] **RAM & Thread Aligned**: Beban CPU thread dibatasi maksimal 8 core agar tidak menekan alokasi query PostgreSQL BDB.
- [ ] **Sandbox Permissions**: Direktori `/dev/shm/coserse_sandbox` berizin `700` dan dimiliki oleh user service aplikasi.
- [ ] **Magic Byte Guard Aktif**: Modul unggah file menolak otomatis file executable (`.exe`, `.sh`, `.bat`, `.vbs`, makro `.docm`).
- [ ] **Human-in-the-Loop Dialog**: Tampilan konfirmasi kartu perubahan status LP berfungsi di antarmuka frontend sebelum query SQL insert dijalankan.
- [ ] **Audit Trail Ready**: Setiap aktivitas tanya jawab dan persetujuan dokumen tercatat ke tabel `bdb_audit_log`.
