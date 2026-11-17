/**
 * Localhost Browser Sandbox Launcher for Coserse 1.0 (Tahap 1 + 2 + 3).
 * Serves UI Dashboard at http://localhost:3850/cms/dashboard/coserse
 * Serves NestJS APIs at http://localhost:3850/api/bdb/coserse/*
 * ZERO production touches — runs strictly on 127.0.0.1 with in-memory PGlite DB.
 */
const fs = require('fs');
const http = require('http');
const path = require('path');

const backendRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(backendRoot, '..');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'coserse-localhost-sandbox-secret';
process.env.REDIS_ENABLED = process.env.REDIS_ENABLED || 'false';
process.env.COSERSE_RUNTIME_PROVIDER = process.env.COSERSE_RUNTIME_PROVIDER || 'ollama';
process.env.COSERSE_MODEL_NAME = process.env.COSERSE_MODEL_NAME || 'coserse:1.0';
process.env.COSERSE_OFFLINE_DETERMINISTIC_FALLBACK = process.env.COSERSE_OFFLINE_DETERMINISTIC_FALLBACK || 'true';

require(path.join(backendRoot, 'node_modules/ts-node/register'));
require(path.join(backendRoot, 'node_modules/tsconfig-paths')).register({
    baseUrl: backendRoot,
    paths: {
        '@nestjs/*': ['node_modules/@nestjs/*'],
        '@app_core/*': ['src/app_core/*'],
        '@bareskrim/*': ['src/bareskrim/*'],
        '@storage/*': ['storage/*']
    }
});

const express = require(path.join(backendRoot, 'node_modules/express'));
const { Test } = require(path.join(backendRoot, 'node_modules/@nestjs/testing'));
const { ExpressAdapter } = require(path.join(backendRoot, 'node_modules/@nestjs/platform-express'));
const { DataSource } = require(path.join(backendRoot, 'node_modules/typeorm'));
const { PGlite } = require('@electric-sql/pglite');
const { pg_trgm } = require('@electric-sql/pglite/contrib/pg_trgm');

const { AuthGuard } = require('@app_core/auth/auth.guard');
const { CurrentUserInterceptor } = require('@app_core/helper/interceptor/current-user.interceptor');
const { AuditService } = require(path.join(backendRoot, 'src/bdb/audit/audit.service.ts'));
const { CoserseController } = require(path.join(backendRoot, 'src/bdb/coserse/coserse.controller.ts'));
const { CoserseService } = require(path.join(backendRoot, 'src/bdb/coserse/coserse.service.ts'));
const { CoserseQuotaService } = require(path.join(backendRoot, 'src/bdb/coserse/coserse-quota.service.ts'));
const { CoserseLlmService } = require(path.join(backendRoot, 'src/bdb/coserse/coserse-llm.service.ts'));
const { CoserseDocParserService } = require(path.join(backendRoot, 'src/bdb/coserse/coserse-doc-parser.service.ts'));

const SANDBOX_SCHEMA = `
CREATE OR REPLACE FUNCTION parse_tgl_laporan(val text) RETURNS date LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN IF val IS NULL OR val = '' THEN RETURN NULL; END IF; RETURN to_date(substring(val from 1 for 10), 'DD-MM-YYYY'); EXCEPTION WHEN OTHERS THEN RETURN NULL; END; $$;
CREATE TABLE auth_users (id bigserial PRIMARY KEY, username text, name text, role_bdb text, role_name text, scope_satker_id bigint);
CREATE TABLE bdb_satker (id bigint PRIMARY KEY, parent_id bigint, kode text, deskripsi text);
CREATE TABLE bdb_status_master (id bigint PRIMARY KEY, code text, nama text, kategori text);
CREATE TABLE bdb_document_type_master (id bigint PRIMARY KEY, code text, nama text, status_target_id bigint, aktif boolean DEFAULT true);
CREATE TABLE cm_jenis_kejahatan (id bigint PRIMARY KEY, keterangan text);
CREATE TABLE bdb_dors_lp (id bigserial PRIMARY KEY, dors_lp_id bigint NOT NULL, model_lp text NOT NULL, no_laporan text, tgl_laporan text, apa_terjadi text, synced_at timestamp default now());
CREATE TABLE bdb_laporan_polisi (
    id bigserial PRIMARY KEY, dors_lp_id bigint NOT NULL, model_lp text NOT NULL, no_laporan text, tgl_laporan text,
    kategori text, satker_id bigint, satker_nama text, unit_satker_id bigint, unit_satker_nama text,
    status text DEFAULT 'BARU', status_id bigint, jenis_kejahatan_id bigint,
    tanggal_selesai date, synced_at timestamp default now(), updated_at timestamp default now(), deleted_at timestamp
);
CREATE TABLE bdb_dors_lp_terlibat (id bigserial PRIMARY KEY, lp_id bigint NOT NULL REFERENCES bdb_dors_lp(id) ON DELETE CASCADE, dors_lp_id bigint, model_lp text, nama text, nik text, no_hp text, telphone text, alamat text, keterlibatan text);
CREATE TABLE bdb_dors_lp_barang_bukti (id bigserial PRIMARY KEY, lp_id bigint NOT NULL REFERENCES bdb_dors_lp(id) ON DELETE CASCADE, dors_lp_id bigint, model_lp text, jenis_bb text, keterangan text, ran_no_registrasi text, ran_nama_pemilik text, ran_alamat text);
CREATE TABLE bdb_dokumen (id bigserial PRIMARY KEY, lp_id bigint NOT NULL, document_type_id bigint, nomor_dokumen text, tanggal_dokumen date, data jsonb, lampiran jsonb DEFAULT '[]'::jsonb, created_by bigint, created_at timestamp with time zone DEFAULT now());
CREATE TABLE bdb_audit_log (id bigserial PRIMARY KEY, user_id bigint, user_nama text, action text NOT NULL, entity text, entity_id text, meta jsonb, ip text, outcome text, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE bdb_social_notifications (id bigserial PRIMARY KEY, recipient_id bigint, sender_id bigint, category text, type text, post_id bigint, title text, message text, link text, is_read boolean DEFAULT false, created_at timestamp with time zone DEFAULT now());
`;

async function bootstrap() {
    const db = new PGlite({ extensions: { pg_trgm } });
    await db.exec('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
    await db.exec(SANDBOX_SCHEMA);

    await db.exec(`
        INSERT INTO bdb_satker (id, parent_id, kode, deskripsi) VALUES
            (1, NULL, 'MABES', 'BARESKRIM POLRI'),
            (10, 1, 'PMJ', 'POLDA METRO JAYA'),
            (101, 10, 'RESJAK', 'POLRES METRO JAKARTA SELATAN'),
            (20, 1, 'JABAR', 'POLDA JAWA BARAT');
        INSERT INTO bdb_status_master (id, code, nama, kategori) VALUES
            (2, 'LIDIK', 'Penyelidikan', 'CT'),
            (3, 'SIDIK', 'Penyidikan', 'CT'),
            (4, 'SP3', 'Penghentian Penyidikan (SP3)', 'CC'),
            (5, 'TAHAP_I', 'Penyerahan Berkas Tahap I', 'CT'),
            (6, 'TAHAP_II', 'Pelimpahan Tahap II (Crime Clearance)', 'CC'),
            (7, 'SP2_LID', 'Penghentian Penyelidikan', 'CC'),
            (9, 'SPDP', 'SPDP Terkirim', 'CT'),
            (11, 'P21', 'Berkas Lengkap P-21', 'CT');
        INSERT INTO bdb_document_type_master (id, code, nama, status_target_id, aktif) VALUES
            (1, 'SP_LIDIK', 'Surat Perintah Penyelidikan', 2, true),
            (2, 'SPDP', 'SPDP', 9, true),
            (3, 'SP_SIDIK', 'Surat Perintah Penyidikan', 3, true),
            (4, 'TAHAP_1', 'Pengantar Berkas Tahap I', 5, true),
            (5, 'P21', 'Pemberitahuan P-21', 11, true),
            (6, 'TAHAP_2', 'Penyerahan Tersangka & Barang Bukti (Tahap II)', 6, true),
            (7, 'SP3', 'Surat Perintah Penghentian Penyidikan (SP3)', 4, true),
            (8, 'SP2_LIDIK', 'Penghentian Penyelidikan', 7, true);
        INSERT INTO cm_jenis_kejahatan (id, keterangan) VALUES
            (1, 'Narkotika'),
            (2, 'Penipuan / Penggelapan'),
            (3, 'Kejahatan Siber');
        INSERT INTO auth_users (id, username, name, role_bdb, role_name, scope_satker_id) VALUES
            (1, 'superadmin.bareskrim', 'Karobinops Bareskrim', 'superadmin', 'Superadmin', NULL),
            (42, 'om.eko_42', 'AKBP Eko', 'superadmin', 'Superadmin Binops', NULL),
            (77, 'bripda.nina', 'Bripda Nina', 'operator', 'Operator Polres Jaksel', 101),
            (3, 'viewer.tamu', 'Viewer Tamu', 'viewer', 'Viewer', 10);
        INSERT INTO bdb_dors_lp (id, dors_lp_id, model_lp, no_laporan, tgl_laporan) VALUES
            (1001, 9001, 'A', 'LP/A/101/IX/2025/SPKT/BARESKRIM', '14-09-2025'),
            (1002, 9002, 'B', 'LP/B/222/X/2025/PMJ', '03-10-2025'),
            (1003, 9003, 'B', 'LP/B/892/X/2026/SPKT/POLDA JABAR', '20-10-2026');
        INSERT INTO bdb_laporan_polisi (id, dors_lp_id, model_lp, no_laporan, tgl_laporan, status_id, status, satker_id, satker_nama, jenis_kejahatan_id) VALUES
            (1001, 9001, 'A', 'LP/A/101/IX/2025/SPKT/BARESKRIM', '14-09-2025', 3, 'SIDIK', 101, 'POLRES METRO JAKARTA SELATAN', 1),
            (1002, 9002, 'B', 'LP/B/222/X/2025/PMJ', '03-10-2025', 2, 'LIDIK', 10, 'POLDA METRO JAYA', 2),
            (1003, 9003, 'B', 'LP/B/892/X/2026/SPKT/POLDA JABAR', '20-10-2026', 5, 'TAHAP_I', 20, 'POLDA JAWA BARAT', 3);
        INSERT INTO bdb_dors_lp_terlibat (lp_id, dors_lp_id, model_lp, keterlibatan, nama, nik, no_hp, telphone, alamat) VALUES
            (1001, 9001, 'A', 'TERLAPOR', 'HENDRI SETIAWAN', '3171012345670001', '+6281299887766', NULL, 'Jakarta Selatan'),
            (1002, 9002, 'B', 'SAKSI', 'HENDRI SETIAWAN', '3171012345670001', '081299887766', NULL, 'Tebet');
        INSERT INTO bdb_dors_lp_barang_bukti (lp_id, dors_lp_id, model_lp, jenis_bb, keterangan, ran_nama_pemilik, ran_no_registrasi) VALUES
            (1002, 9002, 'B', 'Handphone & Rekening', 'Unit bukti terkait 081299887766 atas nama Hendri Setiawan', 'HENDRI SETIAWAN', 'B1234XYZ');
    `);

    const dsMock = {
        query: async (sql, params = []) => (await db.query(sql, params)).rows,
        createQueryRunner: () => ({
            connect: async () => {},
            startTransaction: async () => {},
            commitTransaction: async () => {},
            rollbackTransaction: async () => {},
            release: async () => {},
            query: async (sql, params = []) => (await db.query(sql, params)).rows
        })
    };

    const expressApp = express();
    expressApp.use(express.json());
    const uiHtmlPath = path.join(backendRoot, 'coserse_ui/coserse-dashboard.html');
    const obrolanHtmlPath = path.join(backendRoot, 'coserse_ui/sharese-obrolan-sandbox.html');
    const logoResersePath = path.join(backendRoot, 'coserse_ui/logo-reserse-bareskrim.png');
    const bundleJsPath = path.join(repoRoot, 'frontend/src/modules/coserse/coserse-chat.bundle.js');

    expressApp.get('/', (_req, res) => res.redirect('/cms/dashboard/coserse'));
    expressApp.get('/cms/dashboard/coserse', (_req, res) => res.sendFile(uiHtmlPath));
    expressApp.get('/cms/sharese-obrolan', (_req, res) => res.sendFile(obrolanHtmlPath));
    expressApp.get('/coserse-assets/coserse-chat.bundle.js', (_req, res) => res.sendFile(bundleJsPath));
    expressApp.get('/coserse-assets/logo-reserse-bareskrim.png', (_req, res) => res.sendFile(logoResersePath));

    expressApp.post('/api/bdb/jukrah/messages/send', (req, res) => {
        const content = String(req.body?.content || '').trim();
        const q = content.toLowerCase();
        const isComplex = /\b\d{16}\b/.test(q) || /(?:\+62|62|0)8\d{7,11}/.test(q.replace(/[\s-]/g, '')) ||
            ['profiling', 'telusur', 'jaringan', 'upload', 'unggah', 'spdp', 'tahap', 'mindik', 'nyasar'].some((k) => q.includes(k));
        if (isComplex) {
            const taskRef = `obrolan-${Date.now().toString(36)}`;
            const targetUrl = `/cms/dashboard/coserse?task_ref=${encodeURIComponent(taskRef)}&task_prompt=${encodeURIComponent(content)}`;
            return res.json({
                status: 1,
                ai_reply: {
                    id: Date.now(),
                    sender_id: -1,
                    content:
                        `Siap @om.eko_42, penelusuran perkara mendalam ini membutuhkan Workspace Analitik Coserse 1.0 agar data dapat ditelaah komprehensif.\n[[COSERSE_HANDOVER|task_ref=${taskRef}|task_prompt=${encodeURIComponent(content)}]]`,
                    handover: {
                        task_ref: taskRef,
                        task_prompt: content,
                        target_url: targetUrl,
                        summary: content.slice(0, 120)
                    }
                }
            });
        }
        return res.json({
            status: 1,
            ai_reply: {
                id: Date.now(),
                sender_id: -1,
                content: `Siap @om.eko_42! Pertanyaan cepat "${content}" telah dijawab di Obrolan Cepat.`,
                handover: null
            }
        });
    });

    // Sandbox header user identity injection (localhost only)
    expressApp.use('/api/bdb/coserse', (req, _res, next) => {
        const uid = Number(req.headers['x-sandbox-user-id'] || 42);
        const roleHeader = String(req.headers['x-sandbox-role'] || '').toLowerCase();
        const presets = {
            1: { id: 1, username: 'superadmin.bareskrim', name: 'Karobinops Bareskrim', role_bdb: 'superadmin' },
            42: { id: 42, username: 'om.eko_42', name: 'AKBP Eko', role_bdb: 'superadmin' },
            77: { id: 77, username: 'bripda.nina', name: 'Bripda Nina', role_bdb: 'operator', scope_satker_id: 101 },
            3: { id: 3, username: 'viewer.tamu', name: 'Viewer Tamu', role_bdb: 'viewer', scope_satker_id: 10 }
        };
        if (roleHeader === 'superadmin') {
            req.user = presets[42] || presets[1];
        } else if (roleHeader === 'operator') {
            req.user = presets[77];
        } else {
            req.user = presets[uid] || presets[42];
        }
        next();
    });

    const moduleRef = await Test.createTestingModule({
        controllers: [CoserseController],
        providers: [
            CoserseService,
            CoserseQuotaService,
            CoserseLlmService,
            CoserseDocParserService,
            AuditService,
            { provide: DataSource, useValue: dsMock }
        ]
    })
        .overrideGuard(AuthGuard)
        .useValue({ canActivate: () => true })
        .overrideInterceptor(CurrentUserInterceptor)
        .useValue({ intercept: (_c, n) => n.handle() })
        .compile();

    const app = moduleRef.createNestApplication(new ExpressAdapter(expressApp));
    app.setGlobalPrefix('api');
    await app.init();

    const port = Number(process.env.COSERSE_SANDBOX_PORT || 3850);
    await app.listen(port, '127.0.0.1');
    console.log(`COSERSE_SANDBOX_READY=http://127.0.0.1:${port}/cms/dashboard/coserse`);
}

bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
