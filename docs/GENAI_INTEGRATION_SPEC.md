# SPESIFIKASI & PANDUAN TEKNIS API INTEGRASI CAS (BDB)
## Modul Eksternal Laporan Polisi &mdash; Integrasi CAS dengan Generative AI

> **Klasifikasi Dokumen**: Teknis / Terbatas (Untuk Tim Pengembang Mitra Resmi)  
> **Sistem Sumber**: **Big Data Binops (BDB) — Powered by CAS (Community Anggota Serse)** &mdash; Bareskrim Polri  
> **Versi Dokumen**: 1.2 (BDB 2026 Enhanced Spec)  
> **Tanggal Efektif**: 21 September 2026  
> **Protokol**: RESTful JSON over HTTPS  

---

## 1. Pendahuluan & Ringkasan Arsitektur

Dokumen ini merupakan spesifikasi teknis resmi *Portal Integrasi Keluar* CAS Bareskrim Polri yang diperuntukkan bagi tim teknis mitra pengembang dalam rangka proyek **Integrasi Aplikasi CAS dengan Generative AI**.

API ini bertindak sebagai gerbang terkelola (*Managed API Gateway*) yang mendistribusikan data resmi Laporan Polisi (LP) untuk kebutuhan analitik cerdas, seperti *Knowledge Base Retrieval (RAG)*, pemetaan modus operandi kejahatan, dan klasifikasi hukum otomatis.

### Spesifikasi Dasar Koneksi
| Parameter | Nilai / Spesifikasi |
|---|---|
| **Base URL Produksi** | `https://cas.bareskrim.polri.go.id/api/external/v1` |
| **Format Pertukaran Data** | `application/json; charset=utf-8` |
| **Metode Autentikasi** | HTTP Basic Authentication (`Authorization: Basic base64(username:password)`) |
| **Scope Data** | **Hanya data berstatus `OPERASIONAL`** yang diekspos. Data testing/simulasi diisolasi ketat. |
| **Token Enkripsi ID** | ID Laporan Polisi disajikan berupa AES token *opaque* untuk mencegah scraping sekuensial. |

---

## 2. Keamanan Jaringan & Autentikasi

### 2.1 Mekanisme Kredensial
Setiap pemanggilan API wajib menyertakan header HTTP Basic Auth:
```http
Authorization: Basic base64(<CLIENT_ID>:<CLIENT_SECRET>)
```

> ⚠️ **Catatan Penting Distribusi Kredensial:**  
> Pasangan `<CLIENT_ID>` dan `<CLIENT_SECRET>` **tidak disertakan** pada dokumen spesifikasi teknis ini. Kredensial produksi akan diserahkan secara resmi dan terpisah melalui jalur koordinasi kedinasan oleh pejabat Bareskrim Polri yang berwenang.

### 2.2 Proteksi IP Whitelist (Wajib)
Sistem menerapkan pengamanan jaringan berbasis *IP Whitelisting*:
- Tim teknis mitra wajib mendaftarkan alamat IP publik statis (*Static Public IP*) dari server backend / data ingestor mitra kepada pihak Bareskrim.
- Permintaan yang berasal dari IP yang tidak terdaftar akan langsung ditolak oleh gateway dengan kode status **`HTTP 403 Forbidden`**.

### 2.3 Pembatasan Laju Panggilan (Rate Limiting)
- Batas maksimal panggilan: **120 requests per menit** per client.
- Bila melampaui batas, sistem mengembalikan **`HTTP 429 Too Many Requests`**.
- Direkomendasikan mengimplementasikan antrian *asynchronous* dengan pola *exponential backoff* pada worker data ingestion.

---

## 3. Hak Akses Data (Granular Scope Architecture)

Portal Integrasi Keluar menerapkan kontrol akses granular berbasis *Scope*. Hanya field yang termasuk dalam scope yang telah disetujui yang akan disertakan dalam respons JSON. Field di luar hak akses tidak akan dimunculkan sama sekali.

Tersedia **9 kategori Scope data**:

| No | Kode Scope | Kategori | Ringkasan Field yang Dikembalikan |
|:--:|---|---|---|
| 1 | `laporan_polisi.read` | **Wajib (Dasar)** | Identitas LP: `id` (token opaque), `dors_lp_id`, `no_laporan`, `tgl_laporan`, `model_lp`, `status`, `updated_at`. |
| 2 | `laporan_polisi.klasifikasi` | Tindak Pidana | Klasifikasi hukum: `golongan_kejahatan`, `jenis_kejahatan`, `tindak_pidana` (array kategori dan pasal pidana). |
| 3 | `laporan_polisi.status` | Status Perkara | Progres riil & Crime Clearance: `status_code`, `status_nama`, `status_kategori` (`CC`/`CT`), `is_selesai`, `tanggal_selesai`, `status_pelimpahan`, `keterangan_penghentian` (SP3 / RJ / Diversi / PERMA Tipiring). |
| 4 | `laporan_polisi.penanganan` | Penyidik | Kesatuan & Penyidik: `satker_penanganan`, `unit_penanganan` (subdit/unit), `personel_penanganan` (pembuat, penerima, mengetahui). |
| 5 | `laporan_polisi.tkp` | Spasial / TKP | Waktu & Lokasi: `waktu_kejadian`, `tempat_kejadian`, `kategori_lokasi`, wilayah: `tkp_provinsi`, `tkp_kabupaten`, `tkp_kecamatan`, `tkp_desa`, koordinat: `lat`, `lon`. |
| 6 | `laporan_polisi.kronologi` | Naratif / Korpus | Deskripsi peristiwa: `uraian_kejadian`, `apa_terjadi`, `bagaimana_terjadi` *(Sangat esensial untuk RAG / Semantic Search Gen AI)*. |
| 7 | `laporan_polisi.kerugian` | Kerugian | Nilai materiil: `kerugian` (nominal estimasi dampak kerugian korban). |
| 8 | `laporan_polisi.pihak_terlibat` | Subjek Hukum | Daftar pihak: `pihak_terlibat` (nama, NIK, peran keterlibatan: SAKSI / KORBAN / TERLAPOR). |
| 9 | `laporan_polisi.barang_bukti` | Barang Bukti | Bukti fisik: `barang_bukti` (jenis, jumlah, status barang bukti, keterangan sita). |

---

## 4. Spesifikasi Endpoint API

### 4.1 Pencarian & Daftar Laporan Polisi
- **Method**: `GET`
- **Path**: `/api/external/v1/laporan-polisi`

#### Parameter Query
| Parameter | Tipe | Default | Keterangan |
|---|---|---|---|
| `page` | Integer | `1` | Halaman yang diminta (mulai dari 1). |
| `limit` | Integer | `20` | Jumlah baris per halaman (maksimal 100). |
| `no_laporan` | String | - | Pencarian nomor LP spesifik (parsial, case-insensitive). Contoh: `LP/B/241/IX/2026`. |
| `status` | String | - | Filter tahapan perkara riil (`PENYELIDIKAN`, `PENYIDIKAN`, `SPDP`, `TAHAP_I`, `P21`, `TAHAP_II`, `SP3`, `SP2_LIDIK`, `PERMA`). |
| `status_kategori` | String | - | Filter Crime Clearance: `CC` (Tuntas/Clearance) atau `CT` (Masih Berproses). |
| `satker` | String | - | Filter nama Satker atau unit penanganan (contoh: `POLDA METRO JAYA`, `POLRES KAMPAR`, `DITRESKRIMUM`). |
| `updated_from` | String | - | Format `YYYY-MM-DD`. Hanya data yang diperbarui pada atau setelah tanggal ini. *(Kunci sinkronisasi incremental)*. |
| `updated_to` | String | - | Format `YYYY-MM-DD`. Hanya data yang diperbarui sebelum atau pada tanggal ini. |

#### Contoh Respon Berhasil (HTTP 200 OK)
```json
{
  "status": 1,
  "data": [
    {
      "id": "e3b0c44298fc1c149afbf4c8996fb924",
      "dors_lp_id": "7849201",
      "no_laporan": "LP/B/241/IX/2026/SPKT/POLDA METRO JAYA",
      "tgl_laporan": "15-09-2026 14:30:00",
      "model_lp": "lp_model_a",
      "status": "PROSES",
      "updated_at": "2026-09-20T10:15:30.000Z",
      "golongan_kejahatan": "Kejahatan Konvensional",
      "jenis_kejahatan": "Pencurian Dengan Pemberatan",
      "tindak_pidana": [
        {
          "kategori": "Curat",
          "pasal": "Pasal 363 KUHPidana"
        }
      ],
      "status_code": "PENYIDIKAN",
      "status_nama": "Penyidikan (Sidik)",
      "status_kategori": "CT",
      "is_selesai": false,
      "tanggal_selesai": null,
      "status_pelimpahan": "TIDAK",
      "keterangan_penghentian": null,
      "satker_penanganan": "DITRESKRIMUM POLDA METRO JAYA",
      "unit_penanganan": "Unit 3 Subdit Resmob",
      "personel_penanganan": [
        { "peran": "Pembuat", "nama": "AIPDA BUDI SANTOSO", "nrp": "84050123", "pangkat": "AIPDA" },
        { "peran": "Penerima", "nama": "KOMPOL ARIS WIJAYA", "nrp": "78100456", "pangkat": "KOMPOL" },
        { "peran": "Mengetahui", "nama": "KOMBES POL HENDRO", "nrp": "72030789", "pangkat": "KOMBES POL" }
      ],
      "waktu_kejadian": "2026-09-14 02:30:00",
      "tempat_kejadian": "JL. GATOT SUBROTO KAV. 52, JAKARTA SELATAN",
      "kategori_lokasi": "Perkantoran / Ruko",
      "tkp_provinsi": "DKI JAKARTA",
      "tkp_kabupaten": "KOTA ADM. JAKARTA SELATAN",
      "tkp_kecamatan": "MAMPANG PRAPATAN",
      "tkp_desa": "KUNINGAN BARAT",
      "lat": "-6.238450",
      "lon": "106.822310",
      "uraian_kejadian": "Telah terjadi tindak pidana pencurian dengan pemberatan di kantor PT Teknologi Maju Bersama. Pelaku membobol pintu belakang gedung...",
      "apa_terjadi": "Pencurian 12 Unit Komputer Server dan Dokumen Keuangan",
      "bagaimana_terjadi": "Pelaku merusak gembok pintu belakang menggunakan linggis kemudian memutus kabel CCTV lokal...",
      "kerugian": "Rp 450.000.000,-",
      "pihak_terlibat": [
        { "nama": "RUDI HERMAWAN", "nik": null, "keterlibatan": "PELAPOR / SAKSI" },
        { "nama": "DALAM PENYELIDIKAN (LIDIK)", "nik": null, "keterlibatan": "TERLAPOR" }
      ],
      "barang_bukti": [
        { "jenis": "1 Buah Linggis Besi 60cm", "jumlah": "1", "status": "DISITA", "keterangan": "Ditemukan di dekat pintu darurat" },
        { "jenis": "Rekaman DVR Eksternal Cloud", "jumlah": "1", "status": "DIAMANKAN", "keterangan": "Bukti digital aktivitas pelaku" }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 14205
  }
}
```

---

### 4.2 Detail Tunggal Laporan Polisi
- **Method**: `GET`
- **Path**: `/api/external/v1/laporan-polisi/:id`

Mengambil 1 objek Laporan Polisi secara utuh menggunakan `id` token opaque yang didapat dari query daftar.

#### Contoh Respon (HTTP 200 OK)
```json
{
  "status": 1,
  "data": {
    "id": "e3b0c44298fc1c149afbf4c8996fb924",
    "dors_lp_id": "7849201",
    "no_laporan": "LP/B/241/IX/2026/SPKT/POLDA METRO JAYA",
    "tgl_laporan": "15-09-2026 14:30:00",
    "model_lp": "lp_model_a",
    "status": "PROSES",
    "updated_at": "2026-09-20T10:15:30.000Z",
    "golongan_kejahatan": "Kejahatan Konvensional",
    "jenis_kejahatan": "Pencurian Dengan Pemberatan",
    "status_code": "PENYIDIKAN",
    "status_nama": "Penyidikan (Sidik)",
    "status_kategori": "CT",
    "is_selesai": false
  }
}
```

---

## 5. Standar Data Crime Clearance (CC) & Penghentian Perkara

Untuk kebutuhan analitik AI mengenai rasio penyelesaian perkara (*Crime Clearance Rate*), perhatikan pemetaan status berikut:
1. `status_kategori = "CT"`: Perkara masih dalam tahap penyelidikan / penyidikan aktif.
2. `status_kategori = "CC"`: Perkara dinyatakan selesai (`is_selesai = true`).

### Contoh Struktur Data Penghentian Perkara (Restorative Justice / SP3):
Jika perkara dihentikan melalui kesepakatan perdamaian atau SP3, objek `keterangan_penghentian` akan terisi:
```json
{
  "status_code": "SP3",
  "status_nama": "Henti Sidik / SP3",
  "status_kategori": "CC",
  "is_selesai": true,
  "tanggal_selesai": "2026-09-18",
  "status_pelimpahan": "TIDAK",
  "keterangan_penghentian": {
    "jenis_dokumen": "SP3",
    "nomor_dokumen": "SP3/45/IX/RES.1.8/2026/Reskrim",
    "tanggal_dokumen": "2026-09-18",
    "alasan_penghentian": "Penyelesaian luar proses peradilan / Restorative Justice",
    "alasan_demi_hukum": null,
    "keterangan": "Perkara diselesaikan melalui mekanisme keadilan restoratif berdasarkan perdamaian para pihak dan ganti rugi."
  }
}
```

### Contoh Struktur Kasus Sidang Tindak Pidana Ringan (PERMA Tipiring):
```json
{
  "status_code": "PERMA",
  "status_nama": "Perma (Tipiring)",
  "status_kategori": "CC",
  "is_selesai": true,
  "tanggal_selesai": "2026-09-19",
  "status_pelimpahan": "TIDAK",
  "keterangan_penghentian": {
    "jenis_dokumen": "PERMA",
    "nomor_dokumen": "14/Pid.C/2026/PN Jkt.Sel",
    "tanggal_dokumen": "2026-09-19",
    "kategori_perma": "Tipiring",
    "pengadilan": "PENGADILAN NEGERI JAKARTA SELATAN",
    "amar_ringkas": "Menyatakan Terdakwa terbukti secara sah dan meyakinkan bersalah melakukan tipiring dan dijatuhi denda pidana."
  }
}
```

---

## 6. Kode Status & Format Penanganan Error

API mengembalikan kode HTTP standar dengan struktur JSON error yang konsisten:

| Kode HTTP | Arti | Skenario Penyebab | Contoh Format Respons |
|:--:|---|---|---|
| **200** | OK | Request berhasil diproses. | `{"status": 1, "data": ...}` |
| **400** | Bad Request | Parameter tidak valid (mis. tanggal bukan `YYYY-MM-DD`). | `{"status": 0, "statusCode": 400, "message": "updated_from harus format YYYY-MM-DD."}` |
| **401** | Unauthorized | Header Basic Auth kosong atau password salah. | `{"status": 0, "statusCode": 401, "message": "Kredensial tidak dikenali."}` |
| **403** | Forbidden | IP belum di-whitelist atau akun dinonaktifkan. | `{"status": 0, "statusCode": 403, "message": "Akses ditolak: IP Anda tidak terdaftar dalam IP whitelist klien ini."}` |
| **404** | Not Found | Token ID Laporan Polisi tidak ditemukan. | `{"status": 0, "statusCode": 404, "message": "Laporan Polisi tidak ditemukan."}` |
| **429** | Too Many Requests | Melebihi kuota 120 req/menit. | `{"status": 0, "statusCode": 429, "message": "Terlalu banyak permintaan (rate limit terlampaui). Batas maksimal 120 request per menit."}` |

---

## 7. Panduan Implementasi Khusus untuk Sistem Generative AI (RAG & ETL)

### 7.1 Pola Sinkronisasi Ingestion Data (Incremental Sync)
Untuk membangun Vector Database / RAG Corpus yang selalu mutakhir tanpa membebani sistem:
1. **Initial Hydration (Data Awal)**:
   - Ambil data secara bertahap menggunakan paginasi (`limit=100`, iterasi `page=1..N`).
   - Berikan jeda minimum `500 ms` antar-request agar aman dari limit 120 req/menit.
2. **Incremental Ingestion (Sinkronisasi Berkala)**:
   - Simpan timestamp sinkronisasi sukses terakhir (misal: `2026-09-21`).
   - Eksekusi worker berkala (misal tiap 15 menit) dengan parameter:
     `GET /laporan-polisi?updated_from=2026-09-21`
   - Data yang mengalami perubahan status perkara (misal naik dari Sidik ke Tahap II atau SP3) akan ter-update otomatis dalam korpus AI Anda via `upsert`.

### 7.2 Struktur Chunking Dokumen untuk Embedding Semantik
Agar model LLM dapat mengenali konteks kasus secara utuh saat pengguna melakukan *similarity search* (misal: mencari modus operandi pencurian server di perkantoran), gabungkan metadata dan narasi:

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

### 7.3 Kepatuhan Privasi Data & UU PDP
- Data Laporan Polisi memuat informasi subjek hukum.
- Pastikan modul sanitasi data (*Data Anonymization / PII Redaction*) dijalankan untuk menyamarkan NIK dan identitas personal sebelum prompt dikirimkan ke model AI eksternal, sesuai **UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi**.
- Sangat direkomendasikan menggunakan arsitektur LLM *Private On-Premise* untuk menjaga kerahasiaan data penyelidikan Polri.

---

## 8. Contoh Kode Pemanggilan

### 8.1 cURL
```bash
curl -X GET "https://cas.bareskrim.polri.go.id/api/external/v1/laporan-polisi?limit=50&page=1&status_kategori=CC&updated_from=2026-09-01" \
  -u "<CLIENT_ID>:<CLIENT_SECRET>" \
  -H "Accept: application/json"
```

### 8.2 Python (Worker / ETL Ingestion Pipeline)
```python
import requests
import time
from requests.auth import HTTPBasicAuth

BASE_URL = "https://cas.bareskrim.polri.go.id/api/external/v1"
CLIENT_ID = "<CLIENT_ID>"          # Diterbitkan resmi oleh Bareskrim
CLIENT_SECRET = "<CLIENT_SECRET>"  # Diterbitkan resmi oleh Bareskrim

auth = HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)

def fetch_laporan_polisi(updated_from=None, page=1, limit=50):
    params = {
        "page": page,
        "limit": limit
    }
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
        print("Rate limit 120 req/menit terlampaui. Menunggu jeda...")
        time.sleep(5)
        return fetch_laporan_polisi(updated_from, page, limit)
    else:
        raise Exception(f"HTTP Error {response.status_code}: {response.text}")

if __name__ == "__main__":
    res = fetch_laporan_polisi(updated_from="2026-09-01")
    print(f"Total data: {res['meta']['total']}")
    for lp in res["data"]:
        print(f"[{lp['no_laporan']}] {lp.get('status_nama')} - {lp.get('jenis_kejahatan')}")
```

### 8.3 Node.js / TypeScript (Axios)
```typescript
import axios from 'axios';

const BASE_URL = 'https://cas.bareskrim.polri.go.id/api/external/v1';
const CLIENT_ID = '<CLIENT_ID>';
const CLIENT_SECRET = '<CLIENT_SECRET>';

async function syncLaporanPolisi(page = 1, limit = 50, updatedFrom?: string) {
  const authHeader = 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
  const response = await axios.get(`${BASE_URL}/laporan-polisi`, {
    params: { page, limit, updated_from: updatedFrom },
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json'
    },
    timeout: 10000
  });

  return response.data;
}
```

---

## 9. Penutup & Prosedur Koordinasi Teknis

Untuk kelancaran uji coba integrasi:
1. **Pendaftaran IP Whitelist**: Tim teknis mitra dipersilakan menginventarisasi dan mengajukan daftar IP publik server pengembangan/staging kepada tim teknis Bareskrim Polri.
2. **Penetapan Hak Akses (Scope)**: Scope data akan disesuaikan dengan kebutuhan modul AI yang disepakati dalam dokumen kerjasama.
3. **Pemberian Kredensial**: Pasangan Client ID & Secret Password akan diserahkan secara resmi oleh pejabat berwenang setelah administrasi teknis terpenuhi.
