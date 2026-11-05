# SPESIFIKASI & PANDUAN TEKNIS API INTEGRASI CAS (BDB)
## Modul Eksternal Laporan Polisi &mdash; Integrasi dengan Generative AI (RAG & Analitik)

> **Klasifikasi Dokumen**: Teknis / Terbatas (Untuk Tim Pengembang Mitra Resmi)  
> **Sistem Sumber**: **Big Data Binops (BDB) — Powered by CAS (Community Anggota Serse)** &mdash; Bareskrim Polri  
> **Versi Dokumen**: 2.6 (BDB 2026 Enhanced Spec)  
> **Tanggal Efektif**: November 2026  
> **Protokol**: RESTful JSON over HTTPS  

---

## 1. Pendahuluan & Ringkasan Arsitektur

Dokumen ini merupakan spesifikasi teknis resmi *Portal Integrasi Keluar* **Big Data Binops (BDB)** yang diperuntukkan bagi tim teknis mitra pengembang dalam rangka integrasi dengan sistem analitik cerdas dan **Generative AI (Coserse / RAG Pipeline)**.

API ini bertindak sebagai gerbang terkelola (*Managed API Gateway*) yang mendistribusikan data resmi Laporan Polisi (LP) untuk kebutuhan analitik cerdas, seperti *Knowledge Base Retrieval (RAG)*, pemetaan modus operandi kejahatan, dan klasifikasi hukum otomatis.

### Spesifikasi Dasar Koneksi
| Parameter | Nilai / Spesifikasi |
|---|---|
| **Base URL Produksi** | `https://api.example.go.id/api/external/v1` |
| **Format Pertukaran Data** | `application/json; charset=utf-8` |
| **Metode Autentikasi** | HTTP Basic Authentication (`Authorization: Basic base64(username:password)`) |
| **Scope Data** | **Hanya data berstatus `OPERASIONAL`** yang diekspos. Data testing/simulasi diisolasi ketat. |
| **Token Enkripsi ID** | ID Laporan Polisi disajikan berupa AES token *opaque* untuk mencegah scraping sekuensial. |

---

## 2. Keamanan Jaringan & Autentikasi

1. **HTTP Basic Auth**: `Authorization: Basic base64(<CLIENT_ID>:<CLIENT_SECRET>)`
2. **Proteksi IP Whitelist**: Hanya alamat IP statis yang terdaftar pada *Portal Integrasi Keluar* yang diizinkan mengakses endpoint.
3. **Pembatasan Laju Panggilan (Rate Limiting)**: Maksimal **120 requests per menit** per klien.

---

## 3. Panduan Implementasi untuk Sistem Generative AI (RAG & ETL)

### 3.1 Pola Sinkronisasi Ingestion Data (Incremental Sync)
Untuk membangun Vector Database / RAG Corpus yang selalu mutakhir tanpa membebani sistem:
1. **Initial Hydration (Data Awal)**:
   - Ambil data secara bertahap menggunakan paginasi (`limit=100`, iterasi `page=1..N`) dengan jeda minimum `500 ms` antar-request.
2. **Incremental Ingestion (Sinkronisasi Berkala)**:
   - Simpan timestamp sinkronisasi sukses terakhir (misal: `2026-11-01`).
   - Eksekusi worker berkala dengan parameter `GET /laporan-polisi?updated_from=2026-11-01`.
   - Data yang mengalami perubahan status perkara akan ter-update otomatis dalam korpus AI melalui mekanisme `upsert`.

### 3.2 Struktur Chunking Dokumen untuk Embedding Semantik
Agar model LLM dapat mengenali konteks kasus secara utuh saat pengguna melakukan *similarity search*, gabungkan metadata dan narasi:

```text
[DOKUMEN KASUS POLRI]
Nomor LP: {no_laporan}
Tanggal: {tgl_laporan}
Satker Penangan: {satker_penanganan}
Klasifikasi: {golongan_kejahatan} > {jenis_kejahatan}
Pasal: {tindak_pidana.pasal}
Status Penanganan: {status_nama} ({status_kategori})
Lokasi Kejadian: {tempat_kejadian}, {tkp_kecamatan}, {tkp_kabupaten}, {tkp_provinsi}

[URAIAN PERISTIWA & MODUS OPERANDI]
Apa Yang Terjadi: {apa_terjadi}
Bagaimana Modus Terjadi: {bagaimana_terjadi}
Uraian Fakta Lengkap: {uraian_kejadian}
```

### 3.3 Kepatuhan Privasi Data & UU PDP
- Pastikan modul sanitasi data (*Data Anonymization / PII Redaction*) dijalankan untuk menyamarkan NIK dan identitas personal sebelum prompt dikirimkan ke model AI eksternal, sesuai **UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi**.
- Sangat direkomendasikan menggunakan arsitektur LLM *Private On-Premise* untuk menjaga kerahasiaan data penyelidikan Polri.

---

## 4. Contoh Kode Pemanggilan

### 4.1 cURL
```bash
curl -X GET "https://api.example.go.id/api/external/v1/laporan-polisi?limit=50&page=1&status_kategori=CC&updated_from=2026-09-01" \
  -u "<CLIENT_ID>:<CLIENT_SECRET>" \
  -H "Accept: application/json"
```

### 4.2 Python (Worker / ETL Ingestion Pipeline)
```python
import requests
import time
from requests.auth import HTTPBasicAuth

BASE_URL = "https://api.example.go.id/api/external/v1"
CLIENT_ID = "<CLIENT_ID>"
CLIENT_SECRET = "<CLIENT_SECRET>"

auth = HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)

def fetch_laporan_polisi(updated_from=None, page=1, limit=50):
    params = {"page": page, "limit": limit}
    if updated_from:
        params["updated_from"] = updated_from

    response = requests.get(
        f"{BASE_URL}/laporan-polisi",
        params=params,
        auth=auth,
        headers={"Accept": "application/json"},
        timeout=15
    )

    if response.status_code == 200:
        return response.json()
    elif response.status_code == 429:
        time.sleep(5)
        return fetch_laporan_polisi(updated_from, page, limit)
    else:
        raise Exception(f"HTTP Error {response.status_code}: {response.text}")
```

### 4.3 Node.js / TypeScript (Axios)
```typescript
import axios from 'axios';

const BASE_URL = 'https://api.example.go.id/api/external/v1';
const CLIENT_ID = '<CLIENT_ID>';
const CLIENT_SECRET = '<CLIENT_SECRET>';

async function syncLaporanPolisi(page = 1, limit = 50, updatedFrom?: string) {
  const authHeader = 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await axios.get(`${BASE_URL}/laporan-polisi`, {
    params: { page, limit, updated_from: updatedFrom },
    headers: { 'Authorization': authHeader, 'Accept': 'application/json' },
    timeout: 10000
  });
  return response.data;
}
```
