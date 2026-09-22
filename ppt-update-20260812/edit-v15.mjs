import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const ROOT = "D:\\Prototype CAS\\EDIT MASTER MASAL";
const SOURCE = path.join(ROOT, "Paparan_Teknis_CAS_Programmer_v1.4_20260812.pptx");
const OUT = path.join(ROOT, "Paparan_Teknis_CAS_Programmer_v1.5_20260812.pptx");
const QA = path.join(ROOT, "ppt-update-20260812", "final-v1.5");
const HANDOVER = "Handover_Teknis_CAS_Programmer_v1.5_20260812_GoogleDocsReady.docx";

const edits = {
  1: {
    "Sinkronisasi patch produksi, kandidat stabilitas backend, dan Kinerja Perkara": "Sinkronisasi patch produksi, guard penempatan LP, audit nasional, dan Kinerja Perkara",
    "Paparan untuk programmer - detail teknis tetap pada handover v1.4": "Paparan untuk programmer - detail teknis tetap pada handover v1.5",
  },
  2: {
    "Empat patch aktif; satu kandidat backend siap diuji": "Guard LP aktif; koreksi targeted selesai; backlog lama terukur",
    "4+1": "5",
    "patch aktif +\nkandidat backend": "patch aktif +\naudit nasional",
    "Mapping Papua Tengah + koreksi LP salah arah": "Mapping Papua Tengah + koreksi LP DIT PPA Jateng",
    "Penempatan satker aktif; kandidat guard DDL V2 lulus build": "Guard placement V4.1 aktif; list/stats HTTP 200",
  },
  4: {
    "Penempatan + stabilitas": "Penempatan + guard LP",
    "Penempatan aktif; kandidat guard DDL V2 siap diuji terisolasi": "Guard V4.1 aktif; target unik dan pelimpahan terlindungi",
  },
  6: {
    "Hotfix backend mencegah DDL LP saling bertabrakan": "Guard V4.1 mencegah LP baru berhenti di satker parent",
    "KANDIDAT V2": "GUARD V4.1 AKTIF",
    "LIST / STATS / CRON": "UNIT TERBACA",
    "ensureTable() berjalan bersamaan\nDDL menyentuh objek yang sama": "LP berhenti di parent\nPolda / Polres / Polsek",
    "PostgreSQL: tuple concurrently updated": "Kamar penanganan kosong atau salah",
    "KOORDINASI DDL YANG AMAN": "TARGET LANGSUNG YANG AMAN",
    "Satu proses\nsingle-flight Promise": "Tepat satu\nanak langsung",
    "Lintas proses\npg_advisory_xact_lock": "Kamar existing &\npelimpahan dilindungi",
    "Satu QueryRunner + transaksi": "Polsek RESKRIM mulai ID 404912",
    "Error handler aman menjaga akar error terlihat. Kandidat V2 lulus test/build dan belum dideploy.": "Runtime aktif: ping, list, dan stats HTTP 200. Backlog lama tidak dipindahkan otomatis.",
  },
  7: {
    "Deploy kandidat harus berlapis dan tetap bisa di-rollback": "Audit nasional memisahkan backlog aman dari kasus yang perlu ditinjau",
    "Snapshot aktif": "96.709 LP",
    "Inspect container, tag rollback, dan salinan dist": "Backlog Polsek: kamar kosong + satu anak unik",
    "Verifikasi kandidat": "3 LP",
    "Cocokkan checksum dan bandingkan source/dist": "Salah kamar dengan satu target anak unik",
    "Smoke terisolasi": "2 LP selesai",
    "Ping, list, stats, dan request paralel": "DIT PPA Jawa Tengah dikoreksi + backup persisten",
    "Deploy tag baru": "13 master",
    "Jangan timpa tag operasional lebih dulu": "Identitas DORS duplikat; jangan auto-remap",
    "Pantau log": "0 pelimpahan",
    "Backend dan PostgreSQL harus tetap bersih": "SAFE_MOVE tervalidasi tidak punya riwayat pelimpahan",
    "Kriteria lulus: ping/list/stats normal dan uji paralel tidak memunculkan tuple concurrently updated.": "Backlog tidak boleh di-update dalam satu transaksi nasional.",
    "Retag sebagai operasional hanya setelah validasi; rollback memakai snapshot container aktif.": "Setiap batch wajib target unik, exclusion pelimpahan, backup persisten, expected row count, dan rollback.",
  },
  11: {
    "Integrasikan empat patch produksi ke repository resmi dan tambahkan regression test.": "Port seluruh hotfix aktif—termasuk guard placement V4.1 dan config mapping—ke repository resmi.",
    "Integrasikan guard konkurensi DDL dan error handler aman dari kandidat V2.": "Buat regression test: target unik, kamar existing, pelimpahan, cutoff Polsek, dan kasus ambigu.",
    "Uji kandidat terisolasi, siapkan snapshot/rollback, lalu deploy memakai tag baru.": "Siapkan runbook migrasi backlog per batch; jangan jalankan update nasional tunggal.",
    "Detail SQL, file, checksum, backup, pengujian, dan rollback: Handover Teknis CAS v1.4": "Detail teknis, checksum, backup, pengujian, dan rollback: Handover Teknis CAS v1.5",
  },
};

await fs.mkdir(QA, { recursive: true });
const deck = await PresentationFile.importPptx(await FileBlob.load(SOURCE));

function replaceText(slide, oldText, newText) {
  const matches = slide.shapes.items.filter((shape) => shape.text?.toString() === oldText);
  if (matches.length !== 1) throw new Error(`Expected exactly one match on slide ${slide.slideNumber}: ${JSON.stringify(oldText)}; got ${matches.length}`);
  matches[0].text.set(newText);
}

for (const [slideNumber, mapping] of Object.entries(edits)) {
  const slide = deck.slides.items[Number(slideNumber) - 1];
  for (const [oldText, newText] of Object.entries(mapping)) {
    if (oldText === newText) continue;
    replaceText(slide, oldText, newText);
  }
}

for (const slide of deck.slides.items) {
  const current = slide.speakerNotes.text || "";
  let updated = current
    .replaceAll("Handover Teknis CAS v1.4", "Handover Teknis CAS v1.5")
    .replaceAll("handover v1.4", "handover v1.5")
    .replaceAll("Handover_Teknis_CAS_Programmer_v1.4_20260812_GoogleDocsReady.docx", HANDOVER);
  if (slide.slideNumber === 6) {
    updated = "Guard placement V4.1 aktif di produksi. Guard memilih tepat satu anak langsung, melindungi kamar existing dan pelimpahan, serta menerapkan cutoff Polsek mulai LP ID 404912.\n[Sources]\n- Handover Teknis CAS v1.5 (local versioned artifact): " + HANDOVER + "\n- Production evidence and requirements supplied directly by the CAS operator, 11-12 August 2026.\n[/Sources]";
  }
  if (slide.slideNumber === 7) {
    updated = "Audit nasional bersifat read-only dan memisahkan backlog aman dari kasus ambigu. Dua LP DIT PPA Jawa Tengah telah dikoreksi secara targeted dengan backup persisten.\n[Sources]\n- Handover Teknis CAS v1.5 (local versioned artifact): " + HANDOVER + "\n- Production evidence and requirements supplied directly by the CAS operator, 11-12 August 2026.\n[/Sources]";
  }
  slide.speakerNotes.setText(updated);
}

const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(OUT);

const snapshot = await deck.inspect({
  kind: "slide,textbox,shape,image,table,chart,notes,layout",
  maxChars: 250000,
});
await fs.writeFile(path.join(QA, "inspect.ndjson"), snapshot.ndjson, "utf8");

for (const [index, slide] of deck.slides.items.entries()) {
  const n = String(index + 1).padStart(2, "0");
  const png = await deck.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(QA, `slide-${n}.png`), new Uint8Array(await png.arrayBuffer()));
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(path.join(QA, `slide-${n}.layout.json`), await layout.text(), "utf8");
}

const montage = await deck.export({ format: "webp", montage: true, scale: 1 });
await fs.writeFile(path.join(QA, "montage.webp"), new Uint8Array(await montage.arrayBuffer()));

console.log(JSON.stringify({ out: OUT, qa: QA, slides: deck.slides.items.length }));
