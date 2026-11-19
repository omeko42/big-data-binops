import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    OnApplicationBootstrap,
    Optional
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuditService } from '../audit/audit.service';
import { CoserseDocParserService } from './coserse-doc-parser.service';
import { CoserseKnowledgeService } from './coserse-knowledge.service';
import { CoserseLlmService } from './coserse-llm.service';
import { CoserseQuotaService } from './coserse-quota.service';
import {
    CoserseChatRequestDto,
    CoserseChatResponse,
    CoserseDiscoveryGroup,
    CoserseExportFileCard,
    CoserseParsedEntities,
    CoserseQuotaSnapshot,
    CoserseTokenBoostRequestDto,
    CrossEntityMatchRecord,
    CrossEntityProfileResponse,
    CrossEntityProfileSummary,
    ProfilePersonRequestDto
} from './dto/profile-query.dto';
import {
    CoserseExportFormat,
    formatBytesReadable,
    formatLabelFor,
    generateCoserseExportBuffer,
    normalizeExportFormat
} from './coserse-export.util';
import { detectPromptInjection, extractEntities } from './entity-extractor';
import { MinioService } from '../kerma/minio.service';

export const COSERSE_DISCLAIMER =
    'Coserse dapat melakukan kesalahan. Hanya untuk internal dan tolong periksa ulang hasil pekerjaan.';

const BLOCKED_PROFILING_ROLES = new Set(['viewer', 'vendor_mitra', 'vendor', 'mitra', 'testing', 'sharese']);
const NATIONAL_PROFILING_ROLES = new Set(['superadmin', 'admin_binops', 'admin']);
const RATE_WINDOW_MS = 60_000;
const BRUTE_FORCE_THRESHOLD = 20;
const TARGET_LATENCY_MS = 1500;

interface ResolvedActor {
    userId: number | null;
    username: string;
    displayName: string;
    role: string;
    satkerId: number | null;
    isNational: boolean;
    isBlockedRole: boolean;
}

interface SessionSearchContextState {
    queryText: string;
    roleFilter: string | null;
    satkerKeyword: string | null;
    selectedGroup: string | null;
    selectedGroupKey?: string | null;
    sortBy: 'RELEVANCE' | 'NEWEST' | 'OLDEST';
    offset: number;
    updatedAt: number;
    lastSummary?: CrossEntityProfileSummary | null;
    lastGroups?: CoserseDiscoveryGroup[] | null;
    lastRecords?: CrossEntityMatchRecord[] | null;
}

@Injectable()
export class CoserseService implements OnApplicationBootstrap {
    private readonly logger = new Logger(CoserseService.name);
    private indexesReady = false;
    private chatTablesReady = false;
    private readonly rateTracker = new Map<string, Array<{ ts: number; targetKey: string }>>();

    constructor(
        private readonly dataSource: DataSource,
        private readonly audit: AuditService,
        @Optional() private readonly quotaService?: CoserseQuotaService,
        @Optional() private readonly llmService?: CoserseLlmService,
        @Optional() private readonly docParser?: CoserseDocParserService,
        @Optional() private readonly knowledgeService?: CoserseKnowledgeService,
        @Optional() private readonly minio?: MinioService
    ) {}

    /**
     * Melampirkan URL foto pihak (jika tersedia di DB) ke setiap record hasil profiling.
     * Sumber foto: (1) bdb_lp_pihak_manual.lampiran_object_key bertipe image/* pada LP + nama yang sama,
     * (2) bdb_dpo.foto_dpo_url yang NIK-nya sama persis. Hanya object key berekstensi gambar yang dipakai,
     * lalu ditandatangani via MinIO presigned URL (relatif /bdb-attachments/...).
     */
    private async attachPartyPhotos(records: CrossEntityMatchRecord[]): Promise<void> {
        if (!Array.isArray(records) || records.length === 0) return;
        const IMG_RE = /\.(jpe?g|png|webp|gif)$/i;
        const SAFE_KEY_RE = /^[A-Za-z0-9][A-Za-z0-9/_.\-]{2,300}$/;
        const toPhotoUrl = async (raw: any): Promise<string | null> => {
            const key = String(raw || '').trim();
            if (!key || key.includes('..') || !IMG_RE.test(key.split('?')[0])) return null;
            if (/^https:\/\//i.test(key)) return key;
            if (!SAFE_KEY_RE.test(key) || !this.minio) return null;
            try {
                return await this.minio.presignedUrl(key, 3600);
            } catch {
                return null;
            }
        };
        try {
            const sample = records.slice(0, 40);
            const lpIds = Array.from(new Set(sample.map((r) => Number(r.lp_id)).filter((n) => n > 0)));
            const niks = Array.from(new Set(sample.map((r) => String(r.nik || '').trim()).filter((n) => /^\d{16}$/.test(n))));
            const manualMap = new Map<string, string>();
            if (lpIds.length) {
                const mRows = await this.dataSource.query(
                    `SELECT lp_id, upper(btrim(nama)) AS nama_up, lampiran_object_key
                       FROM bdb_lp_pihak_manual
                      WHERE deleted_at IS NULL AND lp_id = ANY($1::bigint[])
                        AND lampiran_object_key IS NOT NULL AND lampiran_content_type ILIKE 'image/%'
                      ORDER BY id DESC LIMIT 200`,
                    [lpIds]
                );
                for (const m of mRows || []) {
                    const k = `${m.lp_id}|${m.nama_up}`;
                    if (!manualMap.has(k)) manualMap.set(k, m.lampiran_object_key);
                }
            }
            const dpoMap = new Map<string, string>();
            if (niks.length) {
                const dRows = await this.dataSource.query(
                    `SELECT btrim(nomor_identitas) AS nik, foto_dpo_url
                       FROM bdb_dpo
                      WHERE btrim(nomor_identitas) = ANY($1::text[])
                        AND foto_dpo_url IS NOT NULL AND btrim(foto_dpo_url) <> ''
                      ORDER BY id DESC LIMIT 100`,
                    [niks]
                );
                for (const d of dRows || []) {
                    if (!dpoMap.has(d.nik)) dpoMap.set(d.nik, d.foto_dpo_url);
                }
            }
            if (!manualMap.size && !dpoMap.size) return;
            for (const r of sample) {
                const nameKey = `${r.lp_id}|${String(r.nama_tercatat || '').trim().toUpperCase()}`;
                const raw = manualMap.get(nameKey) || (r.nik ? dpoMap.get(String(r.nik).trim()) : undefined);
                if (!raw) continue;
                const url = await toPhotoUrl(raw);
                if (url) (r as any).foto_url = url;
            }
        } catch (err: any) {
            this.logger.warn(`attachPartyPhotos gagal: ${err?.message || err}`);
        }
    }

    async onApplicationBootstrap(): Promise<void> {
        await this.ensureChatPersistenceTables();
        await this.checkOrCreateSandboxIndexes();
    }

    async ensureChatPersistenceTables(): Promise<void> {
        if (this.chatTablesReady) return;
        try {
            await this.dataSource.query(`
                CREATE TABLE IF NOT EXISTS bdb_coserse_sessions (
                    id VARCHAR(80) PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    title VARCHAR(255) NOT NULL DEFAULT 'Obrolan Baru',
                    model_id VARCHAR(80) NOT NULL DEFAULT 'coserse:1.0',
                    tier_id VARCHAR(32) NOT NULL DEFAULT 'low',
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `);
            await this.dataSource.query(`
                ALTER TABLE bdb_coserse_sessions
                ADD COLUMN IF NOT EXISTS search_context_json JSONB DEFAULT NULL
            `);
            await this.dataSource.query(`
                CREATE INDEX IF NOT EXISTS idx_coserse_sessions_user_updated
                ON bdb_coserse_sessions (user_id, updated_at DESC)
            `);
            await this.dataSource.query(`
                CREATE TABLE IF NOT EXISTS bdb_coserse_messages (
                    id VARCHAR(80) PRIMARY KEY,
                    session_id VARCHAR(80) NOT NULL REFERENCES bdb_coserse_sessions(id) ON DELETE CASCADE,
                    user_id INTEGER NOT NULL,
                    role VARCHAR(24) NOT NULL,
                    content TEXT NOT NULL,
                    meta_json JSONB DEFAULT '{}'::jsonb,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `);
            await this.dataSource.query(`
                CREATE INDEX IF NOT EXISTS idx_coserse_messages_session_created
                ON bdb_coserse_messages (session_id, created_at ASC)
            `);
            this.chatTablesReady = true;
        } catch (err: any) {
            this.logger.warn(`Coserse chat persistence DDL check warning: ${err?.message || err}`);
        }
    }

    private buildSessionTitleFromMessage(rawMessage: string): string {
        const clean = String(rawMessage || '')
            .replace(/\s+/g, ' ')
            .trim();
        if (!clean) return 'Obrolan Baru';
        return clean.length > 48 ? `${clean.slice(0, 48)}...` : clean;
    }

    private async loadSlidingTurnsFallbackFromDb(
        userId: number,
        sessionId: string
    ): Promise<Array<{ role: 'user' | 'assistant'; content: string; timestamp: string; bytes: number }>> {
        try {
            await this.ensureChatPersistenceTables();
            const rows: Array<{ role: string; content: string; created_at?: string }> = await this.dataSource.query(
                `SELECT role, content, created_at
                 FROM bdb_coserse_messages
                 WHERE session_id = $1 AND user_id = $2
                 ORDER BY created_at DESC, id DESC
                 LIMIT 6`,
                [sessionId, userId]
            );
            return rows
                .slice()
                .reverse()
                .map((r) => {
                    const content = String(r.content || '');
                    return {
                        role: r.role === 'assistant' ? 'assistant' : 'user',
                        content,
                        timestamp: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
                        bytes: Buffer.byteLength(content, 'utf8')
                    };
                });
        } catch {
            return [];
        }
    }

    private async persistChatExchangeToDb(params: {
        sessionId: string;
        userId: number;
        userMessage: string;
        assistantMessage: string;
        assistantMessageId?: string;
        modelId?: string;
        tierId?: string;
        meta?: Record<string, any>;
    }): Promise<{ userMessageId: string; assistantMessageId: string; title: string }> {
        await this.ensureChatPersistenceTables();
        const now = Date.now();
        const rand = Math.random().toString(36).slice(2, 7);
        const userMsgId = `u-${now}-${rand}`;
        const assistantMsgId = params.assistantMessageId || `b-${now + 1}-${rand}`;
        const computedTitle = this.buildSessionTitleFromMessage(params.userMessage);
        const modelId = String(params.modelId || 'coserse:1.0').slice(0, 80);
        const tierId = String(params.tierId || 'low').slice(0, 32);

        try {
            const existing: Array<{ id: string; user_id: number; title: string }> = await this.dataSource.query(
                `SELECT id, user_id, title FROM bdb_coserse_sessions WHERE id = $1 LIMIT 1`,
                [params.sessionId]
            );
            let finalTitle = computedTitle;
            if (existing.length > 0) {
                const prevTitle = String(existing[0].title || '').trim();
                finalTitle = prevTitle && prevTitle !== 'Obrolan Baru' ? prevTitle : computedTitle;
                await this.dataSource.query(
                    `UPDATE bdb_coserse_sessions
                     SET title = $1, model_id = $2, tier_id = $3, updated_at = NOW()
                     WHERE id = $4 AND user_id = $5`,
                    [finalTitle, modelId, tierId, params.sessionId, params.userId]
                );
            } else {
                await this.dataSource.query(
                    `INSERT INTO bdb_coserse_sessions (id, user_id, title, model_id, tier_id, created_at, updated_at)
                     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
                    [params.sessionId, params.userId, finalTitle, modelId, tierId]
                );
            }

            await this.dataSource.query(
                `INSERT INTO bdb_coserse_messages (id, session_id, user_id, role, content, meta_json, created_at)
                 VALUES ($1, $2, $3, 'user', $4, $5::jsonb, $6)`,
                [
                    userMsgId,
                    params.sessionId,
                    params.userId,
                    params.userMessage,
                    JSON.stringify({ tier: tierId }),
                    new Date(now).toISOString()
                ]
            );

            await this.dataSource.query(
                `INSERT INTO bdb_coserse_messages (id, session_id, user_id, role, content, meta_json, created_at)
                 VALUES ($1, $2, $3, 'assistant', $4, $5::jsonb, $6)`,
                [
                    assistantMsgId,
                    params.sessionId,
                    params.userId,
                    params.assistantMessage,
                    JSON.stringify(params.meta || {}),
                    new Date(now + 1).toISOString()
                ]
            );

            return { userMessageId: userMsgId, assistantMessageId: assistantMsgId, title: finalTitle };
        } catch (err: any) {
            this.logger.warn(`Failed to persist Coserse exchange to PostgreSQL: ${err?.message || err}`);
            return { userMessageId: userMsgId, assistantMessageId: assistantMsgId, title: computedTitle };
        }
    }

    /**
     * Checks whether required Coserse indexes exist; automatically creates them on local/small
     * tables (< 250k estimated rows) while avoiding blocking DDL on multi-million-row tables.
     */
    async checkOrCreateSandboxIndexes(): Promise<boolean> {
        try {
            const idxRows: Array<{ indexname: string }> = await this.dataSource.query(
                `SELECT indexname FROM pg_indexes
                 WHERE schemaname = current_schema()
                   AND indexname IN (
                       'idx_coserse_terlibat_no_hp_norm',
                       'idx_coserse_terlibat_telphone_norm',
                       'idx_coserse_terlibat_nik_trim',
                       'idx_coserse_terlibat_nama_trgm',
                       'idx_coserse_bb_keterangan_trgm',
                       'idx_coserse_bb_pemilik_trgm'
                   )`
            );
            const existing = new Set(idxRows.map((r) => r.indexname));
            if (existing.size >= 6) {
                this.indexesReady = true;
                return true;
            }

            // Check pg_class reltuples safely before running non-CONCURRENTLY CREATE INDEX
            const statsRows: Array<{ relname: string; reltuples: number }> = await this.dataSource.query(
                `SELECT relname, coalesce(reltuples, 0)::bigint as reltuples
                 FROM pg_class
                 WHERE relname IN ('bdb_dors_lp_terlibat', 'bdb_dors_lp_barang_bukti')`
            );
            if (!statsRows.length) {
                this.indexesReady = false;
                return false;
            }
            const isLargeProdTable = statsRows.some((r) => Number(r.reltuples) >= 250_000);
            if (isLargeProdTable) {
                this.logger.warn(
                    'Coserse profiling indexes missing on large table (>=250k rows). Apply database/migrations/090_coserse_profiling_indexes.sql with CONCURRENTLY.'
                );
                this.indexesReady = existing.size > 0;
                return this.indexesReady;
            }

            await this.ensureIndexesSql();
            this.indexesReady = true;
            return true;
        } catch (err: any) {
            this.logger.warn(`Coserse index check skipped: ${err?.message || err}`);
            this.indexesReady = false;
            return false;
        }
    }

    private async ensureIndexesSql(): Promise<void> {
        try {
            await this.dataSource.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
        } catch {
            // pg_trgm may already exist or require superuser; B-tree indexes below still proceed
        }
        const btreeDdls = [
            `CREATE INDEX IF NOT EXISTS idx_coserse_terlibat_no_hp_norm
                ON bdb_dors_lp_terlibat (regexp_replace(coalesce(no_hp, ''), '\\D', '', 'g'))
                WHERE no_hp IS NOT NULL AND btrim(no_hp) <> ''`,
            `CREATE INDEX IF NOT EXISTS idx_coserse_terlibat_telphone_norm
                ON bdb_dors_lp_terlibat (regexp_replace(coalesce(telphone, ''), '\\D', '', 'g'))
                WHERE telphone IS NOT NULL AND btrim(telphone) <> ''`,
            `CREATE INDEX IF NOT EXISTS idx_coserse_terlibat_nik_trim
                ON bdb_dors_lp_terlibat (btrim(nik))
                WHERE nik IS NOT NULL AND btrim(nik) <> ''`,
            `CREATE INDEX IF NOT EXISTS idx_coserse_bb_ran_nopol_upper
                ON bdb_dors_lp_barang_bukti (upper(regexp_replace(coalesce(ran_no_registrasi, ''), '\\s+', '', 'g')))
                WHERE ran_no_registrasi IS NOT NULL AND btrim(ran_no_registrasi) <> ''`
        ];
        for (const ddl of btreeDdls) {
            await this.dataSource.query(ddl);
        }

        const trgmDdls = [
            `CREATE INDEX IF NOT EXISTS idx_coserse_terlibat_nama_trgm
                ON bdb_dors_lp_terlibat USING gin (upper(nama) gin_trgm_ops)
                WHERE nama IS NOT NULL AND btrim(nama) <> ''`,
            `CREATE INDEX IF NOT EXISTS idx_coserse_bb_keterangan_trgm
                ON bdb_dors_lp_barang_bukti USING gin (upper(keterangan) gin_trgm_ops)
                WHERE keterangan IS NOT NULL AND btrim(keterangan) <> ''`,
            `CREATE INDEX IF NOT EXISTS idx_coserse_bb_pemilik_trgm
                ON bdb_dors_lp_barang_bukti USING gin (upper(ran_nama_pemilik) gin_trgm_ops)
                WHERE ran_nama_pemilik IS NOT NULL AND btrim(ran_nama_pemilik) <> ''`
        ];
        for (const ddl of trgmDdls) {
            try {
                await this.dataSource.query(ddl);
            } catch (trgmErr: any) {
                this.logger.warn(`GIN pg_trgm index creation skipped: ${trgmErr?.message || trgmErr}`);
            }
        }
    }

    /**
     * Cross-Entity Profiling across bdb_dors_lp_terlibat & bdb_dors_lp_barang_bukti joined to bdb_laporan_polisi.
     */
    private readonly pendingBatchBySession = new Map<string, any>();

    private getSystemMiniRagChunks(): Array<{ doc_title: string; section_title: string; pasal_ref: string | null; content: string }> {
        return [
            {
                doc_title: 'SOP Status Dokumen LP CAS (Read-Only)',
                section_title: 'Alur Resmi CT & CC',
                pasal_ref: 'laporan-polisi.service.js',
                content:
                    'CT (Berjalan): LIDIK -> SIDIK -> SPDP -> TAHAP_I -> P19 -> P21. CC (Selesai): TAHAP_II, SP3 (wajib Alasan Penghentian sah), SP2_LID (wajib Alasan Penghentian sah), PERMA (wajib Kategori Perma: Tipiring / LHA PPATK). Dilarang memundurkan status dari CC ke CT.'
            },
            {
                doc_title: 'Panduan Gaya Bahasa Coserse (Read-Only)',
                section_title: 'Humanis & Konfirmasi Chat',
                pasal_ref: null,
                content:
                    'Sampaikan hasil baca file secara natural dan humanis tanpa tabel teknis kaku. Tunggu konfirmasi/koreksi user di chat sebelum eksekusi ke database. Aturan Mini RAG hanya dapat diubah oleh Superadmin.'
            }
        ];
    }

    private formatHumanisticBatchSummary(handle: string, batchCard: any): string {
        const items: any[] = Array.isArray(batchCard?.items) ? batchCard.items : [];
        const readyItems = items.filter((i) => i.action === 'UPDATE' && i.selected !== false);
        const skippedItems = items.filter((i) => i.action !== 'UPDATE' || i.selected === false);
        const byStatus = new Map<string, number>();
        for (const it of readyItems) {
            const st = String(it.status_baru || 'LAINNYA');
            byStatus.set(st, (byStatus.get(st) || 0) + 1);
        }
        const breakdown = Array.from(byStatus.entries())
            .map(([st, cnt]) => `${st} (${cnt})`)
            .join(', ');
        const lines: string[] = [
            `Siap ${handle}, setelah saya cek filenya (${items.length} baris), ada **${readyItems.length} LP siap diupdate**${breakdown ? ` (rincian: ${breakdown})` : ''}.`
        ];
        if (skippedItems.length > 0) {
            const skipList = skippedItems
                .slice(0, 12)
                .map((it) => `**${it.no_laporan_db || it.nomor_lp}** (${it.skip_reason || 'tidak ketemu di DB'})`)
                .join(', ');
            lines.push(
                `Selain itu ada **${skippedItems.length} LP yang saya lewatkan**, yaitu ${skipList}${skippedItems.length > 12 ? ', dan lainnya' : ''}.`
            );
        }
        lines.push('Mau langsung saya proses sekarang, atau ada LP yang statusnya mau disesuaikan dulu?');
        return lines.join('\n\n');
    }

    private async tryHandlePendingBatchConfirmation(
        authUser: any,
        handle: string,
        sessionId: string,
        rawMessage: string
    ): Promise<string | null> {
        const pending = this.pendingBatchBySession.get(sessionId);
        if (!pending) return null;
        const msg = String(rawMessage || '').trim();
        if (/\b(batal|tidak|cancel|jangan|tunda)\b/i.test(msg)) {
            this.pendingBatchBySession.delete(sessionId);
            return `Baik ${handle}, pembaruan massal (${pending.ready_count} LP) saya batalkan. Tidak ada data yang diubah di database.`;
        }
        if (!/\b(oke|ok|ya|iya|lanjut|jalan|proses|terapkan|eksekusi|setuju|simpan|ganti)\b/i.test(msg)) {
            return null;
        }
        const statusOverrideMatch = msg.match(/\bganti\s+(?:jadi|ke)\s+(LIDIK|SIDIK|SPDP|TAHAP_I|TAHAP_II|P19|P21|SP3|SP2_LID|PERMA)\b/i);
        if (statusOverrideMatch) {
            const newSt = statusOverrideMatch[1].toUpperCase();
            for (const it of pending.items || []) {
                const lpNo = String(it.no_laporan_db || it.nomor_lp || '').toUpperCase();
                if (lpNo && msg.toUpperCase().includes(lpNo)) {
                    it.status_baru = newSt;
                    it.selected = true;
                }
            }
        }
        const res = await this.docParser!.commitBatchUpdateLp(authUser, {
            batch_id: pending.batch_id,
            operator_confirmed: true,
            items: pending.items
        });
        this.pendingBatchBySession.delete(sessionId);
        return `Siap ${handle}, proses selesai: **${res.updated_count} LP berhasil diperbarui**${res.skipped_count ? `, ${res.skipped_count} LP dilewati` : ''}.`;
    }

    async profilePersonInvolvement(
        authUser: any,
        input: ProfilePersonRequestDto,
        clientIp?: string
    ): Promise<CrossEntityProfileResponse> {
        const startedAt = Date.now();
        const actor = await this.resolveActor(authUser);
        const parsed = extractEntities(input || {});
        const entityTargetId = this.resolveAuditEntityId(parsed);

        // 1. Prompt Injection / Unsafe Input Gate
        if (parsed.securityAlert.flagged) {
            await this.audit.log({
                userId: actor.userId ?? undefined,
                userName: actor.displayName,
                action: 'COSERSE_PROFILING',
                entity: 'PROMPT_INJECTION',
                entityId: entityTargetId,
                meta: {
                    red_flag: parsed.securityAlert.redFlag,
                    security_code: parsed.securityAlert.code,
                    matched_pattern: parsed.securityAlert.matchedPattern,
                    raw_query_preview: parsed.sanitizedQuery.slice(0, 160),
                    role: actor.role
                },
                ip: clientIp,
                outcome: 'FLAGGED_SECURITY'
            });
            throw new BadRequestException(
                'Kueri atau teks mengandung format tidak aman yang melanggar kebijakan keamanan sistem.'
            );
        }

        // 2. Role-Based Profiling Gate (Viewer & read-only/social roles cannot profile identities)
        if (actor.isBlockedRole) {
            await this.audit.log({
                userId: actor.userId ?? undefined,
                userName: actor.displayName,
                action: 'COSERSE_PROFILING',
                entity: parsed.detectedType,
                entityId: entityTargetId,
                meta: {
                    red_flag: 'UNAUTHORIZED_ROLE_ACCESS',
                    role: actor.role,
                    satker_id: actor.satkerId,
                    query: parsed.sanitizedQuery.slice(0, 160)
                },
                ip: clientIp,
                outcome: 'FLAGGED_SECURITY'
            });
            throw new ForbiddenException(
                `Waduh mohon izin nih @${actor.username}, untuk fitur Cross-Entity Profiling NIK/identitas orang itu akun kamu belum punya izin aksesnya. Coba minta tolong atau calling Admin Binops dulu biar dibukain pintunya ya! Ada hal lain yang mau kita cek bareng?`
            );
        }

        // 3. Validate extracted search criteria before rate check / querying 11.4M rows
        const hasValidTarget =
            parsed.niks.length > 0 ||
            parsed.phones.length > 0 ||
            parsed.names.length > 0 ||
            parsed.plates.length > 0;
        if (!hasValidTarget) {
            await this.audit.log({
                userId: actor.userId ?? undefined,
                userName: actor.displayName,
                action: 'COSERSE_PROFILING',
                entity: 'UNKNOWN',
                entityId: entityTargetId,
                meta: { error: 'EMPTY_OR_SHORT_QUERY', query: parsed.sanitizedQuery.slice(0, 160) },
                ip: clientIp,
                outcome: 'ERROR'
            });
            throw new BadRequestException(
                'Masukkan minimal 16 digit NIK, nomor handphone yang valid, atau minimal 3 karakter nama untuk memulai profiling.'
            );
        }

        // 4. Operator Satker Scope Verification
        let effectiveSatkerId = actor.satkerId;
        if (!actor.isNational) {
            if (!actor.satkerId || actor.satkerId <= 0) {
                await this.audit.log({
                    userId: actor.userId ?? undefined,
                    userName: actor.displayName,
                    action: 'COSERSE_PROFILING',
                    entity: parsed.detectedType,
                    entityId: entityTargetId,
                    meta: {
                        red_flag: 'UNAUTHORIZED_SATKER_ACCESS',
                        reason: 'MISSING_OPERATOR_SATKER_SCOPE',
                        role: actor.role
                    },
                    ip: clientIp,
                    outcome: 'FLAGGED_SECURITY'
                });
                throw new ForbiddenException(
                    `Waduh mohon izin nih @${actor.username}, akun kamu belum terhubung ke satker aktif untuk mengakses data perkara. Coba minta tolong Admin Binops dulu ya!`
                );
            }
            if (input?.satker_id !== undefined && input?.satker_id !== null && String(input.satker_id).trim() !== '') {
                const requestedSatker = Number(input.satker_id);
                const allowed = Number.isSafeInteger(requestedSatker) && requestedSatker > 0
                    ? await this.isSatkerInSubtree(actor.satkerId, requestedSatker)
                    : false;
                if (!allowed) {
                    await this.audit.log({
                        userId: actor.userId ?? undefined,
                        userName: actor.displayName,
                        action: 'COSERSE_PROFILING',
                        entity: parsed.detectedType,
                        entityId: entityTargetId,
                        meta: {
                            red_flag: 'UNAUTHORIZED_SATKER_ACCESS',
                            requested_satker_id: input.satker_id,
                            operator_satker_id: actor.satkerId,
                            role: actor.role
                        },
                        ip: clientIp,
                        outcome: 'FLAGGED_SECURITY'
                    });
                    throw new ForbiddenException(
                        `Waduh mohon izin nih @${actor.username}, untuk data perkara satker sebelah itu akun kamu belum punya izin aksesnya. Coba minta tolong atau calling Admin Binops dulu biar dibukain pintunya ya! Ada hal lain yang mau kita cek bareng?`
                    );
                }
                effectiveSatkerId = requestedSatker;
            }
        } else if (input?.satker_id !== undefined && input?.satker_id !== null && String(input.satker_id).trim() !== '') {
            const requestedSatker = Number(input.satker_id);
            if (Number.isSafeInteger(requestedSatker) && requestedSatker > 0) {
                effectiveSatkerId = requestedSatker;
            }
        }

        // 5. Brute-Force Profiling Anomaly Guard
        const bruteForceCheck = this.recordAndCheckRate(actor, entityTargetId);
        if (bruteForceCheck.flagged) {
            await this.audit.log({
                userId: actor.userId ?? undefined,
                userName: actor.displayName,
                action: 'COSERSE_PROFILING',
                entity: parsed.detectedType,
                entityId: entityTargetId,
                meta: {
                    red_flag: 'BRUTE_FORCE_PROFILING',
                    distinct_targets_60s: bruteForceCheck.distinctCount,
                    role: actor.role,
                    satker_id: actor.satkerId
                },
                ip: clientIp,
                outcome: 'FLAGGED_SECURITY'
            });
            throw new HttpException(
                'Aktivitas profiling beruntun melebihi batas kewajaran dan tercatat pada Log Audit keamanan. Silakan tunggu beberapa saat.',
                HttpStatus.TOO_MANY_REQUESTS
            );
        }

        // 6. Execute Fast Indexed Cross-Entity + Parallel Multi-Table Discovery SQL Queries
        const branchLimit = Math.max(1, Math.min(100, Number(input?.limit) || 20));
        const roleFilter = (input as any)?.role_filter ? String((input as any).role_filter).toUpperCase().trim() : null;
        const satkerKeyword = (input as any)?.satker_keyword ? String((input as any).satker_keyword).toUpperCase().trim() : null;
        const offset = Math.max(0, Number((input as any)?.offset) || 0);
        const sortByRaw = String((input as any)?.sort_by || 'RELEVANCE').toUpperCase().trim();
        const sortBy: 'RELEVANCE' | 'NEWEST' | 'OLDEST' =
            sortByRaw === 'NEWEST' || sortByRaw === 'OLDEST' ? sortByRaw : 'RELEVANCE';
        const selectedGroup = (input as any)?.selected_group ? String((input as any).selected_group).trim() : null;
        const selectedGroupKey = (input as any)?.selected_group_key
            ? String((input as any).selected_group_key).trim()
            : null;
        const skipDiscovery = Boolean((input as any)?.skip_discovery);

        const queryStartedAt = Date.now();
        let rows: any[] = [];
        let usedOrFallback = false;
        const sqlOpts = {
            isNational: actor.isNational && !effectiveSatkerId,
            satkerId: effectiveSatkerId,
            limit: branchLimit,
            roleFilter,
            satkerKeyword,
            offset,
            sortBy
        };
        try {
            const primary = this.buildCrossEntitySql(parsed, sqlOpts, false);
            rows = await this.dataSource.query(primary.sql, primary.params);

            // STRICT NAME MATCH: nama multi-kata WAJIB cocok seluruh token (AND).
            // Fallback OR (cukup 1 kata cocok, mis. "SHOLEH") DINONAKTIFKAN karena menarik ribuan
            // orang lain tanpa benang merah (kasus 7.624 data / 132 dtk). Jika tidak ada kecocokan penuh,
            // kembalikan 0 data secara jujur; relasi orang lain hanya boleh tampil via NIK/HP/LP yang sama.
            usedOrFallback = false;
        } catch (err: any) {
            await this.audit.log({
                userId: actor.userId ?? undefined,
                userName: actor.displayName,
                action: 'COSERSE_PROFILING',
                entity: parsed.detectedType,
                entityId: entityTargetId,
                meta: {
                    error: err?.message || String(err),
                    query: parsed.sanitizedQuery.slice(0, 160),
                    scope_satker_id: effectiveSatkerId
                },
                ip: clientIp,
                outcome: 'ERROR'
            });
            throw err;
        }
        const primaryRecords = this.mapAndDedupeRecords(rows);

        const [realAgg, discoveryRes] = await Promise.all([
            this.queryRealTerlibatAggregation(parsed, {
                isNational: actor.isNational && !effectiveSatkerId,
                satkerId: effectiveSatkerId,
                useOrFallback: usedOrFallback,
                roleFilter,
                satkerKeyword
            }),
            skipDiscovery
                ? Promise.resolve({ groups: [] as CoserseDiscoveryGroup[], bbRealCount: 0, extraRecords: [] as CrossEntityMatchRecord[] })
                : this.discoverExtraTableGroups(parsed, { ...sqlOpts, forceAndMode: true }, primaryRecords)
        ]);
        const queryMs = Date.now() - queryStartedAt;

        const assembled = this.assembleDiscoveryResult({
            primaryRecords,
            realAgg,
            extraGroups: discoveryRes.groups,
            bbRealCount: discoveryRes.bbRealCount,
            extraRecords: discoveryRes.extraRecords,
            limit: branchLimit,
            offset,
            sortBy,
            selectedGroup,
            selectedGroupKey
        });

        const records = assembled.records;
        const summary = assembled.summary;
        const discoveryGroups = assembled.discoveryGroups;
        const activeGroup = assembled.activeGroup;
        await this.attachPartyPhotos(records);
        const matchTier = usedOrFallback ? 'PARTIAL_OR' : 'EXACT_ALL_TOKENS';
        const matchTierLabel = usedOrFallback
            ? 'Kemiripan Sebagian (Partial Match)'
            : 'Kecocokan Penuh (All-Token Match)';
        let narrativeSummary = this.formatNarrativeSummary(parsed, summary, records);
        if (usedOrFallback && records.length > 0) {
            narrativeSummary = `Catatan: Menampilkan hasil **${matchTierLabel}** karena kecocokan penuh seluruh kata nama tidak ditemukan.\n\n${narrativeSummary}`;
        }

        // Relasi antar-entitas wajib berdasarkan benang merah nyata (LP yang sama), bukan kebetulan kata nama.
        let relatedEntities: Array<{ nama: string; peran: string; no_laporan: string; relation_reason: string }> = [];
        if (records.length > 0 && records.length <= 20) {
            try {
                const lpPairs = records.slice(0, 10).map((r) => ({
                    dors_lp_id: Number(r.dors_lp_id),
                    model_lp: String(r.model_lp || ''),
                    no_laporan: String(r.no_laporan || '')
                })).filter((p) => p.dors_lp_id > 0 && p.model_lp);
                if (lpPairs.length > 0) {
                    const relRows = await this.dataSource.query(
                        `SELECT DISTINCT ON (upper(trim(ter.nama)), lp.no_laporan)
                                ter.nama,
                                coalesce(nullif(btrim(ter.keterlibatan), ''), 'PIHAK TERLIBAT') AS peran,
                                lp.no_laporan
                         FROM bdb_laporan_polisi lp
                         JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                         JOIN bdb_dors_lp_terlibat ter ON ter.lp_id = d.id
                         WHERE lp.deleted_at IS NULL
                           AND (lp.dors_lp_id, lp.model_lp) IN (${lpPairs.map((_, i) => `($${i * 2 + 1}::bigint, $${i * 2 + 2}::text)`).join(', ')})
                           AND nullif(btrim(ter.nama), '') IS NOT NULL
                         LIMIT 25`,
                        lpPairs.flatMap((p) => [p.dors_lp_id, p.model_lp])
                    );
                    const primaryNames = new Set(records.map((r) => String((r as any).matched_name || (r as any).nama || '').trim().toUpperCase()).filter(Boolean));
                    relatedEntities = (relRows || [])
                        .filter((rr: any) => !primaryNames.has(String(rr.nama || '').trim().toUpperCase()))
                        .slice(0, 15)
                        .map((rr: any) => ({
                            nama: String(rr.nama || '').trim(),
                            peran: String(rr.peran || 'PIHAK TERLIBAT').trim(),
                            no_laporan: String(rr.no_laporan || '').trim(),
                            relation_reason: `Terkait via LP yang sama: ${String(rr.no_laporan || '').trim()}`
                        }));
                }
            } catch (_relErr) {
                relatedEntities = [];
            }
        }
        let aiEngineMeta: CrossEntityProfileResponse['ai_engine'] = undefined;

        const baseResponse: CrossEntityProfileResponse = {
            status: 1,
            query: {
                raw: parsed.sanitizedQuery,
                detected_type: parsed.detectedType,
                niks: parsed.niks,
                phones: parsed.phones,
                names: parsed.names,
                keywords: parsed.keywords,
                match_tier: matchTier,
                match_tier_label: matchTierLabel
            } as any,
            scope: {
                role: actor.role,
                mode: actor.isNational && !effectiveSatkerId ? 'NATIONAL' : 'SATKER_SUBTREE',
                satker_id: effectiveSatkerId
            },
            summary,
            records,
            ...(relatedEntities.length > 0 ? { related_entities: relatedEntities } : {}),
            discovery_groups: discoveryGroups,
            active_group: activeGroup,
            narrative_summary: narrativeSummary,
            performance: {
                elapsed_ms: Date.now() - startedAt,
                query_ms: queryMs,
                target_ms: TARGET_LATENCY_MS,
                within_target: Date.now() - startedAt < TARGET_LATENCY_MS,
                indexes_ready: this.indexesReady
            },
            disclaimer: COSERSE_DISCLAIMER
        };

        const wantsAiNarrative =
            input?.ai_narrative === true ||
            String(input?.ai_narrative || '').toLowerCase() === 'true' ||
            String(input?.ai_narrative || '') === '1';

        if (wantsAiNarrative && this.llmService && this.quotaService && actor.userId) {
            const sessionId = this.quotaService.sanitizeSessionId(input?.session_id || 'profiling');
            const prep = await this.quotaService.prepareInferenceContext(
                actor.userId,
                actor.username,
                sessionId,
                512,
                actor.role
            );
            const llmRes = await this.llmService.generateNarrative({
                actor: {
                    userId: actor.userId,
                    username: actor.username,
                    displayName: actor.displayName,
                    role: actor.role,
                    satkerId: effectiveSatkerId,
                    scopeMode: baseResponse.scope.mode
                },
                userMessage: `Jawab langsung permintaan penelusuran entitas "${parsed.sanitizedQuery}" secara ringkas, jelas, dan faktual berdasarkan data bukti.`,
                slidingTurns: prep.slidingTurns,
                profilingContext: baseResponse
            });
            await this.quotaService.recordConversationExchange({
                userId: actor.userId,
                username: actor.username,
                sessionId,
                userMessage: `[PROFILE] ${parsed.sanitizedQuery}`,
                assistantMessage: llmRes.reply,
                promptTokens: llmRes.promptTokens,
                completionTokens: llmRes.completionTokens,
                role: actor.role
            });
            narrativeSummary = llmRes.reply;
            aiEngineMeta = {
                used: true,
                provider: llmRes.provider,
                model: llmRes.model,
                tokens_used: llmRes.totalTokens,
                warning: llmRes.offlineNotice
            };
        }

        const elapsedMs = Date.now() - startedAt;

        // 7. Audit Log Recording (SUCCESS)
        await this.audit.log({
            userId: actor.userId ?? undefined,
            userName: actor.displayName,
            action: 'COSERSE_PROFILING',
            entity: parsed.detectedType,
            entityId: entityTargetId,
            meta: {
                detected_type: parsed.detectedType,
                total_lp: summary.total_lp,
                total_terlibat_matches: summary.total_terlibat_matches,
                total_barang_bukti_matches: summary.total_barang_bukti_matches,
                scope_mode: baseResponse.scope.mode,
                satker_id: effectiveSatkerId,
                ai_narrative_used: Boolean(aiEngineMeta?.used),
                elapsed_ms: elapsedMs,
                query_ms: queryMs
            },
            ip: clientIp,
            outcome: 'SUCCESS'
        });

        return {
            ...baseResponse,
            narrative_summary: narrativeSummary,
            performance: {
                elapsed_ms: elapsedMs,
                query_ms: queryMs,
                target_ms: TARGET_LATENCY_MS,
                within_target: elapsedMs < TARGET_LATENCY_MS,
                indexes_ready: this.indexesReady
            },
            ...(aiEngineMeta ? { ai_engine: aiEngineMeta } : {})
        };
    }

    async healthStatus() {
        const ready = await this.checkOrCreateSandboxIndexes();
        const runtime = this.llmService ? await this.llmService.probeRuntimeHealth() : null;
        return {
            status: 1,
            module: 'coserse',
            stage: 'tahap-2-local-llm-and-quota',
            indexes_ready: ready,
            target_latency_ms: TARGET_LATENCY_MS,
            runtime,
            quota_defaults: this.quotaService
                ? {
                      store_backend: this.quotaService.getStoreBackendMode(),
                      memory_default_mb: this.quotaService.getDefaultMemoryLimitMb(),
                      sliding_window_max_turns: this.quotaService.getMaxSlidingTurns(),
                      ttl_seconds: this.quotaService.getTtlSeconds(),
                      five_hour_token_limit: this.quotaService.getFiveHourTokenLimit(),
                      weekly_token_limit: this.quotaService.getWeeklyTokenLimit(),
                      is_free_tier: true
                  }
                : null,
            disclaimer: COSERSE_DISCLAIMER
        };
    }

    /**
     * Tahap 2: Conversational & Cross-Entity Intelligence Synthesis via Local Coserse 1.0 Runtime.
     */
    private assertNotTestingReadOnly(actor: ResolvedActor, actionLabel: string): void {
        if (actor.role === 'testing') {
            throw new ForbiddenException(
                `Akses akun Testing bersifat Read-Only (Hanya Lihat). Anda tidak diizinkan ${actionLabel}.`
            );
        }
    }

    private assertFeatureAccess(actor: ResolvedActor, allowTestingReadOnly = false): void {
        const rolloutMode = String(process.env.COSERSE_ROLLOUT_MODE || '').trim().toLowerCase();
        if (rolloutMode === 'restricted_superadmin') {
            const isAllowed =
                actor.role === 'superadmin' || (allowTestingReadOnly && actor.role === 'testing');
            if (!isAllowed) {
                throw new ForbiddenException(
                    `Fitur Coserse 1.0 saat ini sedang dalam tahap uji coba terbatas khusus Superadmin. Akses untuk peran Anda (${actor.role}) akan dibuka segera setelah pengujian selesai.`
                );
            }
        }
    }

    async askCoserse(
        authUser: any,
        input: CoserseChatRequestDto,
        clientIp?: string
    ): Promise<CoserseChatResponse> {
        if (!this.quotaService || !this.llmService) {
            throw new BadRequestException('CoserseQuotaService / CoserseLlmService belum terpasang pada modul.');
        }

        const actor = await this.resolveActor(authUser);
        if (!actor.userId) {
            throw new ForbiddenException('Identitas pengguna tidak valid untuk mengakses Coserse.');
        }
        this.assertNotTestingReadOnly(actor, 'mengirim pertanyaan atau menghasilkan respons AI');
        this.assertFeatureAccess(actor);
        const handle = this.llmService.normalizeHandle(actor.username);
        const rawMessage = String(input?.message || '').trim();
        if (!rawMessage) {
            throw new BadRequestException(`Halo ${handle}, pesan tidak boleh kosong.`);
        }

        // 1. Prompt Injection / Unsafe Input Gate on conversational prompt
        const injectionCheck = detectPromptInjection(rawMessage);
        if (injectionCheck.flagged) {
            await this.audit.log({
                userId: actor.userId,
                userName: handle,
                action: 'COSERSE_CHAT',
                entity: 'PROMPT_INJECTION',
                entityId: 'chat',
                meta: {
                    red_flag: injectionCheck.redFlag,
                    security_code: injectionCheck.code,
                    matched_pattern: injectionCheck.matchedPattern,
                    preview: rawMessage.slice(0, 160),
                    role: actor.role
                },
                ip: clientIp,
                outcome: 'FLAGGED_SECURITY'
            });
            throw new BadRequestException(
                `Maaf ${handle}, pesan mengandung pola perintah tidak aman yang diblokir kebijakan keamanan Coserse.`
            );
        }

        const sessionId = this.quotaService.sanitizeSessionId(input?.session_id);

        if (actor.role !== 'superadmin' && this.isProgrammingOrCodingRequest(rawMessage)) {
            const denyMsg = 'Maaf, fitur bantuan pemrograman/coding hanya tersedia untuk role Superadmin.';
            return {
                status: 1,
                reply: denyMsg,
                addressed_to: handle,
                session_id: sessionId,
                capability_denied: 'PROGRAMMING'
            } as any;
        }

        if (this.docParser) {
            const pendingReply = await this.tryHandlePendingBatchConfirmation(authUser, handle, sessionId, rawMessage);
            if (pendingReply) {
                const persisted = await this.persistChatExchangeToDb({
                    sessionId,
                    userId: actor.userId,
                    userMessage: rawMessage,
                    assistantMessage: pendingReply,
                    assistantMessageId: `b-${Date.now()}`,
                    modelId: 'coserse-batch-commit',
                    tierId: input?.tier
                });
                return {
                    status: 1,
                    title: persisted.title,
                    reply: pendingReply,
                    addressed_to: handle,
                    session_id: sessionId,
                    disclaimer: COSERSE_DISCLAIMER
                } as any;
            }
            const batchCard = await this.docParser.proposeBatchFromText(authUser, rawMessage);
            if (batchCard) {
                this.pendingBatchBySession.set(sessionId, batchCard);
                const replyText = this.formatHumanisticBatchSummary(handle, batchCard);
                const persisted = await this.persistChatExchangeToDb({
                    sessionId,
                    userId: actor.userId,
                    userMessage: rawMessage,
                    assistantMessage: replyText,
                    assistantMessageId: `b-${Date.now()}`,
                    modelId: 'coserse-batch-parser',
                    tierId: input?.tier,
                    meta: { batch_id: batchCard.batch_id, ready_count: batchCard.ready_count, skip_count: batchCard.skip_count }
                });
                return {
                    status: 1,
                    title: persisted.title,
                    reply: replyText,
                    addressed_to: handle,
                    session_id: sessionId,
                    disclaimer: COSERSE_DISCLAIMER
                } as any;
            }
        }

        const savedInstrEarly = await this.tryHandleSuperadminInstructionCommand(actor, rawMessage);
        if (savedInstrEarly) {
            return {
                status: 1,
                session_id: sessionId,
                mode: 'COSERSE_INSTRUCTION',
                reply: savedInstrEarly,
                profiling: null,
                review_card: null,
                quota: null
            } as any;
        }

        const lpUpdateGuardEarly = this.tryHandleLpUpdateWithoutNumberGuard(handle, rawMessage);
        if (lpUpdateGuardEarly) {
            return {
                status: 1,
                session_id: sessionId,
                mode: 'LP_UPDATE_NEED_NUMBER',
                reply: lpUpdateGuardEarly,
                addressed_to: handle,
                profiling: null,
                review_card: null,
                quota: null
            } as any;
        }

        const batchChatReplyEarly = await this.tryHandlePendingBatchChatCommand(actor, authUser, handle, rawMessage, clientIp);
        if (batchChatReplyEarly) {
            return {
                status: 1,
                session_id: sessionId,
                mode: 'BATCH_CHAT_CONFIRMATION',
                reply: batchChatReplyEarly,
                addressed_to: handle,
                profiling: null,
                review_card: null,
                quota: null
            } as any;
        }

        // 2. Decide whether Cross-Entity + Multi-Table Discovery should supply grounded evidence or handle chained export
        const mods = this.resolveFollowUpModifiers(rawMessage);
        const searchExec = await this.resolveSessionSearchExecution({
            actor,
            authUser,
            input,
            sessionId,
            rawMessage,
            mods,
            clientIp
        });
        const profilingResult = searchExec.profilingResult;
        const activeCtx = searchExec.activeCtx;
        const exportCard = searchExec.exportCard;

        // 3. Enforce RAM quota, 5h & weekly free token quota, and fetch latest 6 sliding turns
        const { slidingTurns: rawSlidingTurns } = await this.quotaService.prepareInferenceContext(
            actor.userId,
            actor.username,
            sessionId,
            this.llmService.estimateTokens(rawMessage) + (profilingResult ? 450 : 120),
            actor.role
        );
        const slidingTurns =
            rawSlidingTurns.length > 0
                ? rawSlidingTurns
                : await this.loadSlidingTurnsFallbackFromDb(actor.userId, sessionId);

        if (searchExec.directExportReply) {
            const { snapshot, quotaWarning } = await this.quotaService.recordConversationExchange({
                userId: actor.userId,
                username: actor.username,
                sessionId,
                userMessage: rawMessage,
                assistantMessage: searchExec.directExportReply,
                promptTokens: this.llmService.estimateTokens(rawMessage),
                completionTokens: this.llmService.estimateTokens(searchExec.directExportReply),
                role: actor.role,
                tier: input?.tier
            });
            const persistedExport = await this.persistChatExchangeToDb({
                sessionId,
                userId: actor.userId,
                userMessage: rawMessage,
                assistantMessage: searchExec.directExportReply,
                modelId: 'coserse-export-engine',
                tierId: input?.tier,
                meta: { exportFileCard: exportCard || undefined }
            });
            const exportFollowUps = this.buildFollowUpActions(actor, profilingResult, activeCtx);
            return {
                status: 1,
                title: persistedExport.title,
                reply: searchExec.directExportReply,
                addressed_to: handle,
                session_id: sessionId,
                ...(exportCard ? { exportFileCard: exportCard, export_file_card: exportCard } : {}),
                ...(exportFollowUps.length ? { followUpActions: exportFollowUps } : {}),
                engine: {
                    provider: 'deterministic_fallback',
                    model: 'coserse-export-engine',
                    latency_ms: 15,
                    prompt_tokens: this.llmService.estimateTokens(rawMessage),
                    completion_tokens: this.llmService.estimateTokens(searchExec.directExportReply),
                    total_tokens: this.llmService.estimateTokens(rawMessage) + this.llmService.estimateTokens(searchExec.directExportReply),
                    sliding_turns_used: slidingTurns.length,
                    xml_evidence_isolated: Boolean(profilingResult),
                    offline_notice: null
                },
                profiling: profilingResult
                    ? {
                          executed: true,
                          detected_type: profilingResult.query.detected_type,
                          total_lp: profilingResult.summary.total_lp,
                          total_records: profilingResult.summary.total_records,
                          records_preview: profilingResult.records.slice(0, 15)
                      }
                    : {
                          executed: false,
                          detected_type: 'UNKNOWN',
                          total_lp: 0,
                          total_records: 0,
                          records_preview: []
                      },
                quota: snapshot,
                quota_warning: quotaWarning,
                disclaimer: COSERSE_DISCLAIMER
            } as any;
        }

        const scopeMode: 'NATIONAL' | 'SATKER_SUBTREE' =
            profilingResult?.scope.mode ?? (actor.isNational ? 'NATIONAL' : 'SATKER_SUBTREE');

        const shouldFetchKnowledge =
            !profilingResult ||
            profilingResult.records.length === 0 ||
            /\b(pasal|kuhp|kuhap|uu|undang|perkap|perpol|perma|sop|mindik|syarat|aturan|hukum)\b/i.test(rawMessage);
        const knowledgeChunks =
            this.knowledgeService && shouldFetchKnowledge
                ? await this.knowledgeService.retrieveRelevantChunks(rawMessage, 3)
                : [];
        const activeInstr = await this.getActiveInstructionsText();
        if (activeInstr) {
            knowledgeChunks.unshift({
                id: 0,
                source_doc: 'SUPERADMIN_INSTRUCTIONS',
                heading: 'Instruksi & Kerangka Jawaban Aktif',
                content: activeInstr,
                similarity: 1
            } as any);
        }

        // 4. Acquire atomic worker lease (worker:fe or worker:be) via Redis coordinator
        const lease = await this.quotaService.acquireAiWorkerLease({
            defaultEndpoint: this.llmService.getEndpointUrl()
        });

        let llmRes;
        try {
            llmRes = await this.llmService.generateNarrative({
                actor: {
                    userId: actor.userId,
                    username: actor.username,
                    displayName: actor.displayName,
                    role: actor.role,
                    satkerId: profilingResult?.scope.satker_id ?? actor.satkerId,
                    scopeMode
                },
                userMessage: rawMessage,
                slidingTurns,
                profilingContext: profilingResult,
                knowledgeChunks,
                endpointOverride: lease.worker.endpoint,
                tier: input?.tier,
                responseStyle: (input as any)?.response_style || (input as any)?.responseStyle,
                executionMode: (input as any)?.execution_mode || (input as any)?.executionMode || 'request_review'
            });
        } finally {
            await lease.release();
        }

        if (actor.role !== 'superadmin' && (this.isProgrammingOrCodingRequest(rawMessage) || this.containsCodeBlock(llmRes.reply))) {
            llmRes.reply = this.buildProgrammingDeniedReply(handle);
        }

        // 5. Persist exchange in Redis/memory store (12h TTL) & deduct free token counters
        const { snapshot, quotaWarning } = await this.quotaService.recordConversationExchange({
            userId: actor.userId,
            username: actor.username,
            sessionId,
            userMessage: rawMessage,
            assistantMessage: llmRes.reply,
            promptTokens: llmRes.promptTokens,
            completionTokens: llmRes.completionTokens,
            role: actor.role,
            tier: input?.tier
        });

        const reviewCard = this.buildReviewCardFromCommand(
            actor,
            rawMessage,
            profilingResult?.records ?? []
        );
        const followUpActions = this.buildFollowUpActions(actor, profilingResult, activeCtx);

        await this.persistChatExchangeToDb({
            sessionId,
            userId: actor.userId,
            userMessage: rawMessage,
            assistantMessage: llmRes.reply,
            modelId: llmRes.model,
            tierId: input?.tier,
            meta: {
                provider: llmRes.provider,
                model: llmRes.model,
                prompt_tokens: llmRes.promptTokens,
                completion_tokens: llmRes.completionTokens,
                total_tokens: llmRes.totalTokens,
                latency_ms: llmRes.latencyMs,
                ...(exportCard ? { exportFileCard: exportCard } : {}),
                ...(followUpActions.length ? { followUpActions } : {})
            }
        });

        // 6. Write COSERSE_CHAT Audit Log
        await this.audit.log({
            userId: actor.userId,
            userName: handle,
            action: 'COSERSE_CHAT',
            entity: profilingResult ? profilingResult.query.detected_type : 'GENERAL_CHAT',
            entityId: sessionId,
            meta: {
                provider: llmRes.provider,
                model: llmRes.model,
                prompt_tokens: llmRes.promptTokens,
                completion_tokens: llmRes.completionTokens,
                total_tokens: llmRes.totalTokens,
                sliding_turns_used: slidingTurns.length,
                profiling_lp_count: profilingResult?.summary.total_lp ?? 0,
                latency_ms: llmRes.latencyMs
            },
            ip: clientIp,
            outcome: 'SUCCESS'
        });

        return {
            status: 1,
            reply: llmRes.reply,
            addressed_to: handle,
            session_id: sessionId,
            ...(reviewCard ? { review_card: reviewCard } : {}),
            ...(exportCard ? { exportFileCard: exportCard, export_file_card: exportCard } : {}),
            ...(followUpActions.length ? { followUpActions } : {}),
            engine: {
                provider: llmRes.provider,
                model: llmRes.model,
                latency_ms: llmRes.latencyMs,
                prompt_tokens: llmRes.promptTokens,
                completion_tokens: llmRes.completionTokens,
                total_tokens: llmRes.totalTokens,
                sliding_turns_used: slidingTurns.length,
                xml_evidence_isolated: llmRes.xmlEvidenceIsolated,
                offline_notice: llmRes.offlineNotice
            },
            ...(profilingResult
                ? {
                      profiling: {
                          executed: true,
                          detected_type: profilingResult.query.detected_type,
                          total_lp: profilingResult.summary.total_lp,
                          total_records: profilingResult.summary.total_records,
                          records_preview: profilingResult.records.slice(0, 15)
                      }
                  }
                : {
                      profiling: {
                          executed: false,
                          detected_type: 'UNKNOWN',
                          total_lp: 0,
                          total_records: 0,
                          records_preview: []
                      }
                  }),
            quota: snapshot,
            quota_warning: quotaWarning,
            disclaimer: COSERSE_DISCLAIMER
        };
    }

    async askCoserseStream(
        authUser: any,
        input: CoserseChatRequestDto,
        res: any,
        clientIp?: string
    ): Promise<void> {
        if (!this.quotaService || !this.llmService) {
            throw new BadRequestException('CoserseQuotaService / CoserseLlmService belum terpasang pada modul.');
        }

        const actor = await this.resolveActor(authUser);
        if (!actor.userId) {
            throw new ForbiddenException('Identitas pengguna tidak valid untuk mengakses Coserse.');
        }
        this.assertNotTestingReadOnly(actor, 'mengirim pertanyaan atau menghasilkan respons AI');
        this.assertFeatureAccess(actor);
        const handle = this.llmService.normalizeHandle(actor.username);
        const rawMessage = String(input?.message || '').trim();
        if (!rawMessage) {
            throw new BadRequestException(`Halo ${handle}, pesan tidak boleh kosong.`);
        }

        const injectionCheck = detectPromptInjection(rawMessage);
        if (injectionCheck.flagged) {
            await this.audit.log({
                userId: actor.userId,
                userName: handle,
                action: 'COSERSE_CHAT',
                entity: 'PROMPT_INJECTION',
                entityId: 'chat',
                meta: {
                    red_flag: injectionCheck.redFlag,
                    security_code: injectionCheck.code,
                    matched_pattern: injectionCheck.matchedPattern,
                    preview: rawMessage.slice(0, 160),
                    role: actor.role
                },
                ip: clientIp,
                outcome: 'FLAGGED_SECURITY'
            });
            throw new BadRequestException(
                `Maaf ${handle}, pesan mengandung pola perintah tidak aman yang diblokir kebijakan keamanan Coserse.`
            );
        }

        const sessionId = this.quotaService.sanitizeSessionId(input?.session_id);

        const includeProfilingFlag = input?.include_profiling;
        const disableProfiling =
            includeProfilingFlag === false || String(includeProfilingFlag || '').toLowerCase() === 'false';
        const parsedStreamProbe = extractEntities({ query: String(input?.profile_query || rawMessage).trim() });
        const streamMods = this.resolveFollowUpModifiers(rawMessage);
        const estimatedHasSearch =
            !disableProfiling &&
            (parsedStreamProbe.niks.length > 0 ||
                parsedStreamProbe.phones.length > 0 ||
                parsedStreamProbe.plates.length > 0 ||
                parsedStreamProbe.names.length > 0 ||
                streamMods.isFollowUpRef ||
                Boolean(input?.profile_query?.trim()));

        if (estimatedHasSearch && actor.isBlockedRole) {
            throw new ForbiddenException(
                `Maaf ${handle}, role "${actor.role}" tidak memiliki izin melakukan penelusuran/profiling entitas perkara.`
            );
        }

        const { slidingTurns: rawSlidingTurns } = await this.quotaService.prepareInferenceContext(
            actor.userId,
            actor.username,
            sessionId,
            this.llmService.estimateTokens(rawMessage) + (estimatedHasSearch ? 450 : 120),
            actor.role
        );
        const slidingTurns =
            rawSlidingTurns.length > 0
                ? rawSlidingTurns
                : await this.loadSlidingTurnsFallbackFromDb(actor.userId, sessionId);

        // Open SSE stream after all 400/403/429 synchronous & quota validations pass
        res.status(200);
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        if (typeof res.flushHeaders === 'function') {
            res.flushHeaders();
        }

        const writeRawSse = (chunk: string) => {
            if (!res.writableEnded) {
                res.write(chunk);
                if (typeof res.flush === 'function') {
                    res.flush();
                }
            }
        };

        const sendEvent = (event: string, data: any) => {
            writeRawSse(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };

        if (actor.role !== 'superadmin' && this.isProgrammingOrCodingRequest(rawMessage)) {
            const denyMsg = 'Maaf, fitur bantuan pemrograman/coding hanya tersedia untuk role Superadmin.';
            const messageId = `b-${Date.now()}`;
            sendEvent('token', { token: denyMsg });
            sendEvent('done', {
                status: 1,
                message_id: messageId,
                reply: denyMsg,
                addressed_to: handle,
                session_id: sessionId,
                capability_denied: 'PROGRAMMING'
            });
            res.end();
            return;
        }

        if (this.docParser) {
            const pendingReply = await this.tryHandlePendingBatchConfirmation(authUser, handle, sessionId, rawMessage);
            if (pendingReply) {
                const messageId = `b-${Date.now()}`;
                const persisted = await this.persistChatExchangeToDb({
                    sessionId,
                    userId: actor.userId,
                    userMessage: rawMessage,
                    assistantMessage: pendingReply,
                    assistantMessageId: messageId,
                    modelId: 'coserse-batch-commit',
                    tierId: input?.tier,
                    meta: { stream: true }
                });
                sendEvent('done', {
                    status: 1,
                    message_id: messageId,
                    title: persisted.title,
                    reply: pendingReply,
                    addressed_to: handle,
                    session_id: sessionId,
                    disclaimer: COSERSE_DISCLAIMER
                });
                res.end();
                return;
            }
            const batchCard = await this.docParser.proposeBatchFromText(authUser, rawMessage);
            if (batchCard) {
                this.pendingBatchBySession.set(sessionId, batchCard);
                const replyText = this.formatHumanisticBatchSummary(handle, batchCard);
                const messageId = `b-${Date.now()}`;
                const persisted = await this.persistChatExchangeToDb({
                    sessionId,
                    userId: actor.userId,
                    userMessage: rawMessage,
                    assistantMessage: replyText,
                    assistantMessageId: messageId,
                    modelId: 'coserse-batch-parser',
                    tierId: input?.tier,
                    meta: { batch_id: batchCard.batch_id, ready_count: batchCard.ready_count, skip_count: batchCard.skip_count, stream: true }
                });
                sendEvent('batch_review_card', batchCard);
                sendEvent('done', {
                    status: 1,
                    message_id: messageId,
                    title: persisted.title,
                    reply: replyText,
                    addressed_to: handle,
                    session_id: sessionId,
                    batch_review_card: batchCard,
                    disclaimer: COSERSE_DISCLAIMER
                });
                res.end();
                return;
            }
        }

        // Initial heartbeat so proxy/browser receives bytes immediately
        writeRawSse(': ping\n\n');

        let firstTokenSent = false;
        let clientAborted = false;
        const heartbeatTimer = setInterval(() => {
            if (!firstTokenSent && !res.writableEnded) {
                writeRawSse(': ping\n\n');
            }
        }, 4000);

        let activeLease: { release: () => Promise<void>; worker?: { id: string; label: string; endpoint: string }; jobId?: string; waitedMs?: number } | null = null;
        if (typeof res.on === 'function') {
            res.on('close', () => {
                clientAborted = true;
                clearInterval(heartbeatTimer);
                if (activeLease) {
                    void activeLease.release();
                }
            });
        }

        try {
            const savedInstrReply = await this.tryHandleSuperadminInstructionCommand(actor, rawMessage);
            if (savedInstrReply) {
                clearInterval(heartbeatTimer);
                sendEvent('token', { token: savedInstrReply });
                sendEvent('done', { session_id: sessionId, mode: 'COSERSE_INSTRUCTION', reply: savedInstrReply });
                res.end();
                return;
            }

            const lpUpdateGuardReply = this.tryHandleLpUpdateWithoutNumberGuard(handle, rawMessage);
            if (lpUpdateGuardReply) {
                clearInterval(heartbeatTimer);
                sendEvent('token', { token: lpUpdateGuardReply });
                sendEvent('done', {
                    status: 1,
                    session_id: sessionId,
                    mode: 'LP_UPDATE_NEED_NUMBER',
                    reply: lpUpdateGuardReply,
                    addressed_to: handle
                });
                if (!res.writableEnded) {
                    res.end();
                }
                return;
            }

            const batchChatReply = await this.tryHandlePendingBatchChatCommand(actor, authUser, handle, rawMessage, clientIp);
            if (batchChatReply) {
                clearInterval(heartbeatTimer);
                sendEvent('token', { token: batchChatReply });
                sendEvent('done', {
                    status: 1,
                    session_id: sessionId,
                    mode: 'BATCH_CHAT_CONFIRMATION',
                    reply: batchChatReply,
                    addressed_to: handle
                });
                if (!res.writableEnded) {
                    res.end();
                }
                return;
            }

            const searchExec = await this.resolveSessionSearchExecution({
                actor,
                authUser,
                input,
                sessionId,
                rawMessage,
                mods: streamMods,
                clientIp
            });
            const profilingResult = searchExec.profilingResult;
            const activeStreamCtx = searchExec.activeCtx;
            const exportCard = searchExec.exportCard;

            if (searchExec.directExportReply) {
                clearInterval(heartbeatTimer);
                const messageId = `b-${Date.now()}`;
                const { snapshot, quotaWarning } = await this.quotaService.recordConversationExchange({
                    userId: actor.userId,
                    username: actor.username,
                    sessionId,
                    userMessage: rawMessage,
                    assistantMessage: searchExec.directExportReply,
                    promptTokens: this.llmService.estimateTokens(rawMessage),
                    completionTokens: this.llmService.estimateTokens(searchExec.directExportReply),
                    role: actor.role,
                    tier: input?.tier
                });
                const persistedExp = await this.persistChatExchangeToDb({
                    sessionId,
                    userId: actor.userId,
                    userMessage: rawMessage,
                    assistantMessage: searchExec.directExportReply,
                    assistantMessageId: messageId,
                    modelId: 'coserse-export-engine',
                    tierId: input?.tier,
                    meta: { stream: true, exportFileCard: exportCard || undefined }
                });
                const followUps = this.buildFollowUpActions(actor, profilingResult, activeStreamCtx);
                sendEvent('token', { token: searchExec.directExportReply });
                if (exportCard) {
                    sendEvent('export_file_card', exportCard);
                }
                sendEvent('done', {
                    status: 1,
                    message_id: messageId,
                    title: persistedExp.title,
                    reply: searchExec.directExportReply,
                    addressed_to: handle,
                    session_id: sessionId,
                    latency_ms: 15,
                    ...(exportCard ? { exportFileCard: exportCard, export_file_card: exportCard } : {}),
                    ...(followUps.length ? { followUpActions: followUps } : {}),
                    profiling: profilingResult
                        ? {
                              executed: true,
                              detected_type: profilingResult.query.detected_type,
                              total_lp: profilingResult.summary.total_lp,
                              total_records: profilingResult.summary.total_records,
                              records_preview: profilingResult.records.slice(0, 15)
                          }
                        : {
                              executed: false,
                              detected_type: 'UNKNOWN',
                              total_lp: 0,
                              total_records: 0,
                              records_preview: []
                          },
                    quota: snapshot,
                    quota_warning: quotaWarning,
                    disclaimer: COSERSE_DISCLAIMER
                });
                if (!res.writableEnded) {
                    res.end();
                }
                return;
            }

            const scopeMode: 'NATIONAL' | 'SATKER_SUBTREE' =
                profilingResult?.scope.mode ?? (actor.isNational ? 'NATIONAL' : 'SATKER_SUBTREE');

            const shouldFetchKnowledge =
                !profilingResult ||
                profilingResult.records.length === 0 ||
                /\b(pasal|kuhp|kuhap|uu|undang|perkap|perpol|perma|sop|mindik|syarat|aturan|hukum)\b/i.test(rawMessage);
            const knowledgeChunks =
                this.knowledgeService && shouldFetchKnowledge
                    ? await this.knowledgeService.retrieveRelevantChunks(rawMessage, 3)
                    : [];
            const activeInstr = await this.getActiveInstructionsText();
            if (activeInstr) {
                knowledgeChunks.unshift({
                    id: 0,
                    source_doc: 'SUPERADMIN_INSTRUCTIONS',
                    heading: 'Instruksi & Kerangka Jawaban Aktif',
                    content: activeInstr,
                    similarity: 1
                } as any);
            }

            const lease = await this.quotaService.acquireAiWorkerLease({
                defaultEndpoint: this.llmService.getEndpointUrl(),
                isAborted: () => clientAborted || Boolean(res.writableEnded),
                onQueueWait: ({ jobId, position, estimatedWaitSec }) => {
                    sendEvent('queue', {
                        job_id: jobId,
                        position,
                        estimated_wait_sec: estimatedWaitSec,
                        message: `Menunggu giliran antrean ke-${position}...`
                    });
                }
            });
            activeLease = lease;

            sendEvent('status', {
                phase: 'analyzing',
                worker: lease.worker.label,
                job_id: lease.jobId,
                waited_ms: lease.waitedMs
            });

            let llmRes;
            try {
                llmRes = await this.llmService.generateNarrativeStream({
                    actor: {
                        userId: actor.userId,
                        username: actor.username,
                        displayName: actor.displayName,
                        role: actor.role,
                        satkerId: profilingResult?.scope.satker_id ?? actor.satkerId,
                        scopeMode
                    },
                    userMessage: rawMessage,
                    slidingTurns: slidingTurns.slice(-6),
                    profilingContext: profilingResult,
                    knowledgeChunks,
                    endpointOverride: lease.worker.endpoint,
                    tier: input?.tier,
                    responseStyle: (input as any)?.response_style || (input as any)?.responseStyle,
                    executionMode: (input as any)?.execution_mode || (input as any)?.executionMode || 'request_review',
                    onToken: (delta: string) => {
                        firstTokenSent = true;
                        sendEvent('token', { token: delta });
                    }
                });
            } finally {
                await lease.release();
            }

            clearInterval(heartbeatTimer);

            if (actor.role !== 'superadmin' && (this.isProgrammingOrCodingRequest(rawMessage) || this.containsCodeBlock(llmRes.reply))) {
                llmRes.reply = this.buildProgrammingDeniedReply(handle);
            }

            const { snapshot, quotaWarning } = await this.quotaService.recordConversationExchange({
                userId: actor.userId,
                username: actor.username,
                sessionId,
                userMessage: rawMessage,
                assistantMessage: llmRes.reply,
                promptTokens: llmRes.promptTokens,
                completionTokens: llmRes.completionTokens,
                role: actor.role,
                tier: input?.tier
            });

            await this.audit.log({
                userId: actor.userId,
                userName: handle,
                action: 'COSERSE_CHAT',
                entity: profilingResult ? profilingResult.query.detected_type : 'GENERAL_CHAT',
                entityId: sessionId,
                meta: {
                    provider: llmRes.provider,
                    model: llmRes.model,
                    prompt_tokens: llmRes.promptTokens,
                    completion_tokens: llmRes.completionTokens,
                    total_tokens: llmRes.totalTokens,
                    sliding_turns_used: Math.min(slidingTurns.length, 6),
                    profiling_lp_count: profilingResult?.summary.total_lp ?? 0,
                    latency_ms: llmRes.latencyMs,
                    stream: true
                },
                ip: clientIp,
                outcome: 'SUCCESS'
            });

            const reviewCard = this.buildReviewCardFromCommand(
                actor,
                rawMessage,
                profilingResult?.records ?? []
            );
            const followUpActions = this.buildFollowUpActions(actor, profilingResult, activeStreamCtx);

            const messageId = `b-${Date.now()}`;
            const persisted = await this.persistChatExchangeToDb({
                sessionId,
                userId: actor.userId,
                userMessage: rawMessage,
                assistantMessage: llmRes.reply,
                assistantMessageId: messageId,
                modelId: llmRes.model,
                tierId: input?.tier,
                meta: {
                    provider: llmRes.provider,
                    model: llmRes.model,
                    prompt_tokens: llmRes.promptTokens,
                    completion_tokens: llmRes.completionTokens,
                    total_tokens: llmRes.totalTokens,
                    latency_ms: llmRes.latencyMs,
                    stream: true,
                    ...(exportCard ? { exportFileCard: exportCard } : {}),
                    ...(followUpActions.length ? { followUpActions } : {})
                }
            });

            if (reviewCard) {
                sendEvent('review_card', reviewCard);
            }
            if (exportCard) {
                sendEvent('export_file_card', exportCard);
            }

            sendEvent('done', {
                status: 1,
                message_id: messageId,
                title: persisted.title,
                reply: llmRes.reply,
                addressed_to: handle,
                session_id: sessionId,
                latency_ms: llmRes.latencyMs,
                ...(reviewCard ? { review_card: reviewCard } : {}),
                ...(exportCard ? { exportFileCard: exportCard, export_file_card: exportCard } : {}),
                ...(followUpActions.length ? { followUpActions } : {}),
                engine: {
                    provider: llmRes.provider,
                    model: llmRes.model,
                    worker: lease.worker.label,
                    job_id: lease.jobId,
                    queue_waited_ms: lease.waitedMs,
                    latency_ms: llmRes.latencyMs,
                    prompt_tokens: llmRes.promptTokens,
                    completion_tokens: llmRes.completionTokens,
                    total_tokens: llmRes.totalTokens,
                    sliding_turns_used: Math.min(slidingTurns.length, 6),
                    xml_evidence_isolated: llmRes.xmlEvidenceIsolated,
                    offline_notice: llmRes.offlineNotice
                },
                profiling: profilingResult
                    ? {
                          executed: true,
                          detected_type: profilingResult.query.detected_type,
                          total_lp: profilingResult.summary.total_lp,
                          total_records: profilingResult.summary.total_records,
                          records_preview: profilingResult.records.slice(0, 15)
                      }
                    : {
                          executed: false,
                          detected_type: 'UNKNOWN',
                          total_lp: 0,
                          total_records: 0,
                          records_preview: []
                      },
                quota: snapshot,
                quota_warning: quotaWarning,
                disclaimer: COSERSE_DISCLAIMER
            });
            if (!res.writableEnded) {
                res.end();
            }
        } catch (err: any) {
            clearInterval(heartbeatTimer);
            const errMessage =
                err?.response?.message ||
                err?.message ||
                `Maaf ${handle}, terjadi gangguan saat memproses streaming jawaban Coserse.`;
            sendEvent('error', {
                status: 0,
                message: errMessage
            });
            if (!res.writableEnded) {
                res.end();
            }
        }
    }

    async getQuotaStatus(authUser: any, sessionId = 'default'): Promise<{ status: 1; quota: CoserseQuotaSnapshot }> {
        if (!this.quotaService) {
            throw new BadRequestException('CoserseQuotaService belum aktif.');
        }
        const actor = await this.resolveActor(authUser);
        if (!actor.userId) {
            throw new ForbiddenException('User tidak terautentikasi.');
        }
        this.assertFeatureAccess(actor, true);
        const quota = await this.quotaService.getQuotaSnapshot(actor.userId, actor.username, sessionId, actor.role);
        return { status: 1, quota };
    }

    async listUserSessions(authUser: any) {
        const actor = await this.resolveActor(authUser);
        if (!actor.userId) {
            throw new ForbiddenException('User tidak terautentikasi.');
        }
        this.assertFeatureAccess(actor, true);
        await this.ensureChatPersistenceTables();
        const rows = await this.dataSource.query(
            `SELECT id, user_id, title, model_id, tier_id, created_at, updated_at
             FROM bdb_coserse_sessions
             WHERE user_id = $1
             ORDER BY updated_at DESC
             LIMIT 100`,
            [actor.userId]
        );
        return {
            status: 1,
            sessions: rows
        };
    }

    async getSessionMessages(authUser: any, sessionIdInput: string) {
        const actor = await this.resolveActor(authUser);
        if (!actor.userId) {
            throw new ForbiddenException('User tidak terautentikasi.');
        }
        this.assertFeatureAccess(actor, true);
        const sessionId = this.quotaService
            ? this.quotaService.sanitizeSessionId(sessionIdInput)
            : String(sessionIdInput || 'default').trim();
        await this.ensureChatPersistenceTables();

        const sessRows: Array<{ id: string; user_id: number; title: string; model_id: string; tier_id: string }> =
            await this.dataSource.query(
                `SELECT id, user_id, title, model_id, tier_id, created_at, updated_at
                 FROM bdb_coserse_sessions
                 WHERE id = $1
                 LIMIT 1`,
                [sessionId]
            );
        if (sessRows.length > 0 && Number(sessRows[0].user_id) !== Number(actor.userId)) {
            throw new ForbiddenException('Anda tidak memiliki hak akses pada sesi percakapan ini.');
        }

        const msgRows = await this.dataSource.query(
            `SELECT id, session_id, user_id, role, content, meta_json, created_at
             FROM bdb_coserse_messages
             WHERE session_id = $1 AND user_id = $2
             ORDER BY created_at ASC, id ASC`,
            [sessionId, actor.userId]
        );

        return {
            status: 1,
            session_id: sessionId,
            session: sessRows[0] || null,
            messages: msgRows
        };
    }

    async purgeUserSession(authUser: any, sessionId = 'default', clientIp?: string) {
        if (!this.quotaService) {
            throw new BadRequestException('CoserseQuotaService belum aktif.');
        }
        const actor = await this.resolveActor(authUser);
        if (!actor.userId) {
            throw new ForbiddenException('User tidak terautentikasi.');
        }
        this.assertNotTestingReadOnly(actor, 'menghapus sesi percakapan');
        this.assertFeatureAccess(actor);

        if (sessionId === '*') {
            return this.purgeAllUserSessions(authUser, clientIp);
        }

        const cleanSession = this.quotaService.sanitizeSessionId(sessionId);
        await this.ensureChatPersistenceTables();
        await this.dataSource.query(
            `DELETE FROM bdb_coserse_messages WHERE session_id = $1 AND user_id = $2`,
            [cleanSession, actor.userId]
        );
        await this.dataSource.query(
            `DELETE FROM bdb_coserse_sessions WHERE id = $1 AND user_id = $2`,
            [cleanSession, actor.userId]
        );

        const res = await this.quotaService.purgeSession(actor.userId, actor.username, cleanSession, clientIp, actor.role);
        return {
            ...res,
            deleted_session_id: cleanSession,
            hard_deleted_db: true
        };
    }

    async purgeAllUserSessions(authUser: any, clientIp?: string) {
        if (!this.quotaService) {
            throw new BadRequestException('CoserseQuotaService belum aktif.');
        }
        const actor = await this.resolveActor(authUser);
        if (!actor.userId) {
            throw new ForbiddenException('User tidak terautentikasi.');
        }
        this.assertNotTestingReadOnly(actor, 'menghapus seluruh riwayat percakapan');
        this.assertFeatureAccess(actor);

        await this.ensureChatPersistenceTables();
        await this.dataSource.query(`DELETE FROM bdb_coserse_messages WHERE user_id = $1`, [actor.userId]);
        await this.dataSource.query(`DELETE FROM bdb_coserse_sessions WHERE user_id = $1`, [actor.userId]);

        const res = await this.quotaService.purgeSession(actor.userId, actor.username, '*', clientIp, actor.role);
        return {
            ...res,
            hard_deleted_db: true
        };
    }

    async grantEmergencyBoost(authUser: any, input: CoserseTokenBoostRequestDto, clientIp?: string) {
        if (!this.quotaService) {
            throw new BadRequestException('CoserseQuotaService belum aktif.');
        }
        const actor = await this.resolveActor(authUser);
        if (!actor.userId) {
            throw new ForbiddenException('User tidak terautentikasi.');
        }
        this.assertNotTestingReadOnly(actor, 'mengubah kuota token');
        return this.quotaService.grantEmergencyBoost(
            { userId: actor.userId, username: actor.username, role: actor.role },
            input?.target_user_id,
            input?.bonus_tokens,
            input?.reason,
            clientIp
        );
    }

    async recordMessageFeedback(
        authUser: any,
        input: { session_id?: string; message_id?: string; rating?: string },
        clientIp?: string
    ) {
        const actor = await this.resolveActor(authUser);
        if (!actor.userId) {
            throw new ForbiddenException('User tidak terautentikasi.');
        }
        this.assertNotTestingReadOnly(actor, 'mengirim evaluasi jawaban');
        const rawRating = String(input?.rating || 'clear').toLowerCase();
        const rating = rawRating === 'up' || rawRating === 'down' ? rawRating : 'clear';
        const sessionId = String(input?.session_id || 'default').slice(0, 80);
        const messageId = String(input?.message_id || '').slice(0, 80);

        await this.audit.log({
            userId: actor.userId,
            userName: `@${actor.username.replace(/^@+/, '')}`,
            action: 'COSERSE_FEEDBACK',
            entity: 'MESSAGE_RATING',
            entityId: sessionId,
            meta: {
                message_id: messageId,
                rating
            },
            ip: clientIp,
            outcome: 'SUCCESS'
        });

        return { status: 1, recorded: true, rating };
    }

    private async resolveActor(authUser: any): Promise<ResolvedActor> {
        const rawUserId =
            authUser?.userId ??
            authUser?.user_id ??
            authUser?.user?.id ??
            authUser?.id ??
            null;
        const userId = rawUserId !== null && rawUserId !== undefined ? Number(rawUserId) : null;

        let dbUser: any = null;
        if (userId && Number.isSafeInteger(userId) && userId > 0) {
            try {
                const rows = await this.dataSource.query(
                    `SELECT id, username, name, role_bdb, role_name, scope_satker_id
                     FROM auth_users
                     WHERE id = $1
                     LIMIT 1`,
                    [userId]
                );
                dbUser = rows[0] || null;
            } catch {
                dbUser = null;
            }
        }

        const role = String(
            dbUser?.role_bdb ||
                dbUser?.role_name ||
                authUser?.role_bdb ||
                authUser?.user?.role_bdb ||
                authUser?.role_name ||
                authUser?.user?.role_name ||
                'viewer'
        )
            .trim()
            .toLowerCase();

        const rawUsername =
            dbUser?.username ||
            authUser?.username ||
            authUser?.user?.username ||
            dbUser?.name ||
            authUser?.name ||
            authUser?.user?.name ||
            'rekan';
        const username = String(rawUsername).replace(/^@+/, '').trim() || 'rekan';
        const displayName = String(dbUser?.name || authUser?.name || authUser?.user?.name || username).trim();

        const rawSatker = dbUser?.scope_satker_id ?? authUser?.scope_satker_id ?? authUser?.user?.scope_satker_id;
        const satkerId = rawSatker !== null && rawSatker !== undefined && rawSatker !== '' ? Number(rawSatker) : null;

        const isBlockedRole = BLOCKED_PROFILING_ROLES.has(role);
        const isNational = !isBlockedRole && (NATIONAL_PROFILING_ROLES.has(role) || role.includes('super'));

        return {
            userId: userId && Number.isSafeInteger(userId) ? userId : null,
            username,
            displayName,
            role,
            satkerId: satkerId && Number.isSafeInteger(satkerId) ? satkerId : null,
            isNational,
            isBlockedRole
        };
    }

    private async isSatkerInSubtree(operatorSatkerId: number, targetSatkerId: number): Promise<boolean> {
        if (operatorSatkerId === targetSatkerId) return true;
        try {
            const rows = await this.dataSource.query(
                `WITH RECURSIVE scope_tree AS (
                    SELECT id FROM bdb_satker WHERE id = $1
                    UNION
                    SELECT s.id FROM bdb_satker s JOIN scope_tree t ON s.parent_id = t.id
                )
                SELECT 1 FROM scope_tree WHERE id = $2 LIMIT 1`,
                [operatorSatkerId, targetSatkerId]
            );
            return rows.length > 0;
        } catch {
            return false;
        }
    }

    private recordAndCheckRate(
        actor: ResolvedActor,
        targetKey: string
    ): { flagged: boolean; distinctCount: number } {
        const key = actor.userId ? `u:${actor.userId}` : `n:${actor.username}`;
        const now = Date.now();
        const prev = (this.rateTracker.get(key) || []).filter((item) => now - item.ts <= RATE_WINDOW_MS);
        prev.push({ ts: now, targetKey });
        this.rateTracker.set(key, prev);

        const distinctCount = new Set(prev.map((item) => item.targetKey)).size;
        return {
            flagged: distinctCount > BRUTE_FORCE_THRESHOLD,
            distinctCount
        };
    }

    private resolveAuditEntityId(parsed: CoserseParsedEntities): string {
        if (parsed.niks.length > 0) return parsed.niks[0];
        if (parsed.phones.length > 0) return parsed.phones[0].local08;
        if (parsed.names.length > 0) return parsed.names[0].slice(0, 80);
        if (parsed.plates.length > 0) return parsed.plates[0];
        return parsed.sanitizedQuery.slice(0, 80) || 'EMPTY';
    }

    /**
     * Builds a parameterized PostgreSQL UNION ALL query across indexed branches so the planner
     * uses B-Tree and GIN trigram indexes instead of sequential OR scans across 17M+ rows.
     */
    buildCrossEntitySql(
        parsed: CoserseParsedEntities,
        opts: {
            isNational: boolean;
            satkerId: number | null;
            limit: number;
            roleFilter?: string | null;
            satkerKeyword?: string | null;
            offset?: number;
            sortBy?: 'RELEVANCE' | 'NEWEST' | 'OLDEST';
            forceAndMode?: boolean;
        },
        fallbackOrMode = false
    ): { sql: string; params: any[] } {
        const params: any[] = [];
        const addParam = (val: any): string => {
            params.push(val);
            return `$${params.length}`;
        };

        const ctes: string[] = [];
        let scopePredicate = '1=1';

        if (!opts.isNational) {
            if (!opts.satkerId || opts.satkerId <= 0) {
                scopePredicate = '1=0';
            } else {
                const satkerParam = addParam(opts.satkerId);
                ctes.push(`scope_ids AS (
                    WITH RECURSIVE scope_tree AS (
                        SELECT id FROM bdb_satker WHERE id = ${satkerParam}
                        UNION
                        SELECT s.id FROM bdb_satker s JOIN scope_tree t ON s.parent_id = t.id
                    )
                    SELECT id FROM scope_tree
                )`);
                scopePredicate = 'coalesce(lp.unit_satker_id, lp.satker_id) IN (SELECT id FROM scope_ids)';
            }
        }

        const limitCap = opts.sortBy && opts.sortBy !== 'RELEVANCE' ? Math.max(opts.limit + Math.max(0, Number(opts.offset) || 0), 120) : opts.limit + Math.max(0, Number(opts.offset) || 0);
        const limitParam = addParam(limitCap);
        const rolePredicate = opts.roleFilter
            ? `AND upper(coalesce(nullif(btrim(ter.keterlibatan), ''), 'PIHAK TERLIBAT')) = ${addParam(opts.roleFilter)}`
            : '';
        let satkerKeywordPredicate = '';
        if (opts.satkerKeyword) {
            const pSatKw = addParam(`%${opts.satkerKeyword}%`);
            satkerKeywordPredicate = `AND (upper(coalesce(lp.unit_satker_nama, '')) LIKE ${pSatKw} OR upper(coalesce(lp.satker_nama, '')) LIKE ${pSatKw} OR upper(coalesce(lp.no_laporan, '')) LIKE ${pSatKw})`;
        }
        const offsetClause = opts.offset && opts.offset > 0 ? `\n            OFFSET ${addParam(opts.offset)}` : '';
        const branches: string[] = [];

        const lpJoinSql = `
            JOIN bdb_dors_lp d ON d.id = src_lp_id_placeholder
            JOIN bdb_laporan_polisi lp
              ON lp.dors_lp_id = d.dors_lp_id
             AND lp.model_lp = d.model_lp
             AND lp.deleted_at IS NULL
            LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
            LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
        `;

        const selectTerlibat = (whereSql: string, scoreSql = '1') => `
            SELECT
                lp.id::bigint AS lp_id,
                lp.dors_lp_id::bigint AS dors_lp_id,
                lp.model_lp,
                coalesce(nullif(btrim(lp.no_laporan), ''), nullif(btrim(d.no_laporan), ''), 'LP Tanpa Nomor') AS no_laporan,
                coalesce(nullif(btrim(lp.tgl_laporan), ''), nullif(btrim(d.tgl_laporan), ''), to_char(lp.synced_at, 'DD-MM-YYYY')) AS tgl_laporan,
                coalesce(nullif(btrim(sm.nama), ''), nullif(btrim(lp.status), ''), 'PROSES') AS status_perkara,
                sm.code AS kode_status,
                coalesce(lp.unit_satker_id, lp.satker_id)::bigint AS satker_id,
                coalesce(nullif(btrim(lp.unit_satker_nama), ''), nullif(btrim(lp.satker_nama), ''), 'POLRI') AS satker_nama,
                coalesce(nullif(btrim(lp.kategori), ''), nullif(btrim(jk.keterangan), ''), nullif(btrim(d.apa_terjadi), ''), '-') AS kategori_kejahatan,
                upper(coalesce(nullif(btrim(ter.keterlibatan), ''), 'PIHAK TERLIBAT')) AS peran_entitas,
                'bdb_dors_lp_terlibat'::text AS sumber_tabel,
                concat_ws(' | ',
                    nullif(btrim(ter.nama), ''),
                    CASE WHEN nullif(btrim(ter.nik), '') IS NOT NULL THEN 'NIK: ' || btrim(ter.nik) END,
                    CASE WHEN coalesce(nullif(btrim(ter.no_hp), ''), nullif(btrim(ter.telphone), '')) IS NOT NULL
                         THEN 'HP: ' || coalesce(nullif(btrim(ter.no_hp), ''), nullif(btrim(ter.telphone), '')) END
                ) AS detail_konteks,
                nullif(btrim(ter.nama), '') AS nama_tercatat,
                nullif(btrim(ter.nik), '') AS nik,
                coalesce(nullif(btrim(ter.no_hp), ''), nullif(btrim(ter.telphone), '')) AS no_hp,
                nullif(btrim(ter.alamat), '') AS alamat,
                parse_tgl_laporan(coalesce(lp.tgl_laporan, d.tgl_laporan)) AS sort_tgl,
                (${scoreSql})::int AS matched_token_count
            FROM bdb_dors_lp_terlibat ter
            ${lpJoinSql.replace('src_lp_id_placeholder', 'ter.lp_id')}
            WHERE (${whereSql})
              AND ${scopePredicate}
              ${rolePredicate}
              ${satkerKeywordPredicate}
            LIMIT ${limitParam}
        `;

        const selectBarangBukti = (whereSql: string, scoreSql = '1') => `
            SELECT
                lp.id::bigint AS lp_id,
                lp.dors_lp_id::bigint AS dors_lp_id,
                lp.model_lp,
                coalesce(nullif(btrim(lp.no_laporan), ''), nullif(btrim(d.no_laporan), ''), 'LP Tanpa Nomor') AS no_laporan,
                coalesce(nullif(btrim(lp.tgl_laporan), ''), nullif(btrim(d.tgl_laporan), ''), to_char(lp.synced_at, 'DD-MM-YYYY')) AS tgl_laporan,
                coalesce(nullif(btrim(sm.nama), ''), nullif(btrim(lp.status), ''), 'PROSES') AS status_perkara,
                sm.code AS kode_status,
                coalesce(lp.unit_satker_id, lp.satker_id)::bigint AS satker_id,
                coalesce(nullif(btrim(lp.unit_satker_nama), ''), nullif(btrim(lp.satker_nama), ''), 'POLRI') AS satker_nama,
                coalesce(nullif(btrim(lp.kategori), ''), nullif(btrim(jk.keterangan), ''), nullif(btrim(d.apa_terjadi), ''), '-') AS kategori_kejahatan,
                'TERKAIT BARANG BUKTI'::text AS peran_entitas,
                'bdb_dors_lp_barang_bukti'::text AS sumber_tabel,
                concat_ws(' | ',
                    coalesce(nullif(btrim(bb.jenis_bb), ''), 'Barang Bukti'),
                    nullif(btrim(bb.keterangan), ''),
                    CASE WHEN nullif(btrim(bb.ran_nama_pemilik), '') IS NOT NULL THEN 'Pemilik: ' || btrim(bb.ran_nama_pemilik) END,
                    CASE WHEN nullif(btrim(bb.ran_no_registrasi), '') IS NOT NULL THEN 'Nopol: ' || btrim(bb.ran_no_registrasi) END
                ) AS detail_konteks,
                nullif(btrim(bb.ran_nama_pemilik), '') AS nama_tercatat,
                NULL::text AS nik,
                NULL::text AS no_hp,
                nullif(btrim(bb.ran_alamat), '') AS alamat,
                parse_tgl_laporan(coalesce(lp.tgl_laporan, d.tgl_laporan)) AS sort_tgl,
                (${scoreSql})::int AS matched_token_count
            FROM bdb_dors_lp_barang_bukti bb
            ${lpJoinSql.replace('src_lp_id_placeholder', 'bb.lp_id')}
            WHERE (${whereSql})
              AND ${scopePredicate}
              ${satkerKeywordPredicate}
            LIMIT ${limitParam}
        `;

        // Branch 1: NIK exact match (uses btree index on btrim(nik))
        if (parsed.niks.length > 0) {
            const pNik = addParam(parsed.niks);
            branches.push(
                `(${selectTerlibat(`ter.nik IS NOT NULL AND btrim(ter.nik) <> '' AND btrim(ter.nik) = ANY(${pNik}::text[])`)})`
            );
            // Cross-check NIK if recorded in evidence narrative (uses GIN trigram index on upper(keterangan))
            const nikLikes = parsed.niks.map((nik) => `upper(bb.keterangan) LIKE ${addParam(`%${nik}%`)}`).join(' OR ');
            branches.push(
                `(${selectBarangBukti(`bb.keterangan IS NOT NULL AND btrim(bb.keterangan) <> '' AND (${nikLikes})`)})`
            );
        }

        // Branch 2: Normalized Phone search across no_hp, telphone, and barang_bukti.keterangan
        if (parsed.phones.length > 0) {
            const digitVariants = Array.from(
                new Set(parsed.phones.flatMap((p) => [p.local08, p.intl62]))
            );
            const pPhoneDigits = addParam(digitVariants);

            branches.push(
                `(${selectTerlibat(
                    `ter.no_hp IS NOT NULL AND btrim(ter.no_hp) <> '' AND regexp_replace(coalesce(ter.no_hp, ''), '\\D', '', 'g') = ANY(${pPhoneDigits}::text[])`
                )})`
            );
            branches.push(
                `(${selectTerlibat(
                    `ter.telphone IS NOT NULL AND btrim(ter.telphone) <> '' AND regexp_replace(coalesce(ter.telphone, ''), '\\D', '', 'g') = ANY(${pPhoneDigits}::text[])`
                )})`
            );

            const bbPhoneConds: string[] = [];
            for (const ph of parsed.phones) {
                // coreDigits (e.g. '81234567890') matches '081234567890', '6281234567890', and '+6281234567890' via pg_trgm
                bbPhoneConds.push(`upper(bb.keterangan) LIKE ${addParam(`%${ph.coreDigits}%`)}`);
                // Also support dashed or spaced formatting inside free-text keterangan
                const p3 = ph.local08.slice(0, 4);
                const rest = ph.local08.slice(4);
                if (rest.length >= 6) {
                    const mid = rest.slice(0, 4);
                    const tail = rest.slice(4);
                    bbPhoneConds.push(`upper(bb.keterangan) LIKE ${addParam(`%${p3}-${mid}-${tail}%`)}`);
                    bbPhoneConds.push(`upper(bb.keterangan) LIKE ${addParam(`%${p3} ${mid} ${tail}%`)}`);
                }
            }
            branches.push(
                `(${selectBarangBukti(`bb.keterangan IS NOT NULL AND btrim(bb.keterangan) <> '' AND (${bbPhoneConds.join(' OR ')})`)})`
            );
        }

        // Branch 3: Person Name search (per-token ILIKE, with AND -> OR ranking fallback)
        if (parsed.names.length > 0) {
            const minTokenLen = fallbackOrMode ? 3 : 2;
            const buildTokenCondAndScore = (colExpr: string, name: string): { cond: string; score: string } => {
                const tokens = name
                    .toUpperCase()
                    .split(/\s+/)
                    .map((t) => t.replace(/[^A-Z0-9.'-]/g, ''))
                    .filter((t) => t.length >= minTokenLen);
                if (tokens.length === 0) {
                    const p = addParam(`%${name.toUpperCase()}%`);
                    return { cond: `${colExpr} LIKE ${p}`, score: '1' };
                }
                const likeParams = tokens.map((t) => addParam(`%${t}%`));
                if (!fallbackOrMode) {
                    return {
                        cond: `(${likeParams.map((p) => `${colExpr} LIKE ${p}`).join(' AND ')})`,
                        score: String(tokens.length)
                    };
                }
                return {
                    cond: `(${likeParams.map((p) => `${colExpr} LIKE ${p}`).join(' OR ')})`,
                    score: `(${likeParams.map((p) => `(CASE WHEN ${colExpr} LIKE ${p} THEN 1 ELSE 0 END)`).join(' + ')})`
                };
            };

            const upperNames = parsed.names.map((n) => n.toUpperCase());
            const nameBuilt = upperNames.map((n) => buildTokenCondAndScore('upper(ter.nama)', n));
            branches.push(
                `(${selectTerlibat(
                    `ter.nama IS NOT NULL AND btrim(ter.nama) <> '' AND (${nameBuilt.map((b) => b.cond).join(' OR ')})`,
                    nameBuilt.map((b) => b.score).join(' + ')
                )})`
            );

            if (!opts.roleFilter) {
                const bbKetBuilt = upperNames.map((n) => buildTokenCondAndScore('upper(bb.keterangan)', n));
                branches.push(
                    `(${selectBarangBukti(
                        `bb.keterangan IS NOT NULL AND btrim(bb.keterangan) <> '' AND (${bbKetBuilt.map((b) => b.cond).join(' OR ')})`,
                        bbKetBuilt.map((b) => b.score).join(' + ')
                    )})`
                );

                const bbOwnerBuilt = upperNames.map((n) => buildTokenCondAndScore('upper(bb.ran_nama_pemilik)', n));
                branches.push(
                    `(${selectBarangBukti(
                        `bb.ran_nama_pemilik IS NOT NULL AND btrim(bb.ran_nama_pemilik) <> '' AND (${bbOwnerBuilt.map((b) => b.cond).join(' OR ')})`,
                        bbOwnerBuilt.map((b) => b.score).join(' + ')
                    )})`
                );
            }
        }

        // Branch 4: Vehicle Registration Plate search on bdb_dors_lp_barang_bukti.ran_no_registrasi
        if (parsed.plates.length > 0) {
            const compactPlates = parsed.plates.map((pl) => pl.replace(/\s+/g, '').toUpperCase());
            const pPlates = addParam(compactPlates);
            branches.push(
                `(${selectBarangBukti(
                    `bb.ran_no_registrasi IS NOT NULL AND btrim(bb.ran_no_registrasi) <> '' AND upper(regexp_replace(coalesce(bb.ran_no_registrasi, ''), '\\s+', '', 'g')) = ANY(${pPlates}::text[])`
                )})`
            );
        }

        const ctePrefix = ctes.length ? `WITH ${ctes.join(',\n')}\n` : '';
        const unionBody = branches.join('\nUNION ALL\n');
        const orderExpr =
            opts.sortBy === 'NEWEST'
                ? 'sort_tgl DESC NULLS LAST, lp_id DESC'
                : opts.sortBy === 'OLDEST'
                ? 'sort_tgl ASC NULLS LAST, lp_id ASC'
                : 'matched_token_count DESC NULLS LAST, sort_tgl DESC NULLS LAST, lp_id DESC';
        const sql = `
            ${ctePrefix}
            SELECT *
            FROM (
                ${unionBody}
            ) combined_matches
            ORDER BY ${orderExpr}${offsetClause}
        `;

        return { sql, params };
    }

    private async queryRealTerlibatAggregation(
        parsed: CoserseParsedEntities,
        opts: {
            isNational: boolean;
            satkerId: number | null;
            useOrFallback: boolean;
            roleFilter?: string | null;
            satkerKeyword?: string | null;
        }
    ): Promise<{ totalTerlibat: number; rolesBreakdown: Record<string, number> } | null> {
        const params: any[] = [];
        const addParam = (val: any): string => {
            params.push(val);
            return `$${params.length}`;
        };

        const condParts: string[] = [];
        if (parsed.niks.length > 0) {
            condParts.push(`(ter.nik IS NOT NULL AND btrim(ter.nik) <> '' AND btrim(ter.nik) = ANY(${addParam(parsed.niks)}::text[]))`);
        }
        if (parsed.phones.length > 0) {
            const digits = Array.from(new Set(parsed.phones.flatMap((p) => [p.local08, p.intl62])));
            const pDigits = addParam(digits);
            condParts.push(`(regexp_replace(coalesce(ter.no_hp, ''), '\\D', '', 'g') = ANY(${pDigits}::text[]) OR regexp_replace(coalesce(ter.telphone, ''), '\\D', '', 'g') = ANY(${pDigits}::text[]))`);
        }
        if (parsed.names.length > 0) {
            const minLen = opts.useOrFallback ? 3 : 2;
            const nameConds = parsed.names.map((n) => {
                const tokens = n
                    .toUpperCase()
                    .split(/\s+/)
                    .map((t) => t.replace(/[^A-Z0-9.'-]/g, ''))
                    .filter((t) => t.length >= minLen);
                if (tokens.length === 0) return `upper(ter.nama) LIKE ${addParam(`%${n.toUpperCase()}%`)}`;
                const joiner = opts.useOrFallback ? ' OR ' : ' AND ';
                return `(${tokens.map((t) => `upper(ter.nama) LIKE ${addParam(`%${t}%`)}`).join(joiner)})`;
            });
            condParts.push(`(ter.nama IS NOT NULL AND btrim(ter.nama) <> '' AND (${nameConds.join(' OR ')}))`);
        }

        if (condParts.length === 0) return null;
        const whereCond = condParts.join(' OR ');
        const roleCond = opts.roleFilter
            ? `AND upper(coalesce(nullif(btrim(ter.keterlibatan), ''), 'PIHAK TERLIBAT')) = ${addParam(opts.roleFilter)}`
            : '';
        let satKwCond = '';
        if (opts.satkerKeyword) {
            const pSat = addParam(`%${opts.satkerKeyword}%`);
            satKwCond = `AND (upper(coalesce(lp.unit_satker_nama, '')) LIKE ${pSat} OR upper(coalesce(lp.satker_nama, '')) LIKE ${pSat} OR upper(coalesce(lp.no_laporan, '')) LIKE ${pSat})`;
        }

        try {
            let sql = '';
            if (opts.isNational && !opts.satkerKeyword) {
                sql = `
                    SELECT
                        upper(coalesce(nullif(btrim(ter.keterlibatan), ''), 'PIHAK TERLIBAT')) AS peran,
                        count(*)::int AS cnt
                    FROM bdb_dors_lp_terlibat ter
                    WHERE (${whereCond})
                      ${roleCond}
                    GROUP BY 1
                `;
            } else if (opts.isNational && opts.satkerKeyword) {
                sql = `
                    SELECT
                        upper(coalesce(nullif(btrim(ter.keterlibatan), ''), 'PIHAK TERLIBAT')) AS peran,
                        count(*)::int AS cnt
                    FROM bdb_dors_lp_terlibat ter
                    JOIN bdb_dors_lp d ON d.id = ter.lp_id
                    JOIN bdb_laporan_polisi lp
                      ON lp.dors_lp_id = d.dors_lp_id
                     AND lp.model_lp = d.model_lp
                     AND lp.deleted_at IS NULL
                    WHERE (${whereCond})
                      ${roleCond}
                      ${satKwCond}
                    GROUP BY 1
                `;
            } else if (opts.satkerId && opts.satkerId > 0) {
                const satkerParam = addParam(opts.satkerId);
                sql = `
                    WITH scope_ids AS (
                        WITH RECURSIVE scope_tree AS (
                            SELECT id FROM bdb_satker WHERE id = ${satkerParam}
                            UNION
                            SELECT s.id FROM bdb_satker s JOIN scope_tree t ON s.parent_id = t.id
                        )
                        SELECT id FROM scope_tree
                    )
                    SELECT
                        upper(coalesce(nullif(btrim(ter.keterlibatan), ''), 'PIHAK TERLIBAT')) AS peran,
                        count(*)::int AS cnt
                    FROM bdb_dors_lp_terlibat ter
                    JOIN bdb_dors_lp d ON d.id = ter.lp_id
                    JOIN bdb_laporan_polisi lp
                      ON lp.dors_lp_id = d.dors_lp_id
                     AND lp.model_lp = d.model_lp
                     AND lp.deleted_at IS NULL
                    WHERE (${whereCond})
                      AND coalesce(lp.unit_satker_id, lp.satker_id) IN (SELECT id FROM scope_ids)
                      ${roleCond}
                      ${satKwCond}
                    GROUP BY 1
                `;
            } else {
                return null;
            }

            const rows: Array<{ peran: string; cnt: number }> = await this.dataSource.query(sql, params);
            const rolesBreakdown: Record<string, number> = {};
            let totalTerlibat = 0;
            for (const r of rows) {
                const cnt = Number(r.cnt || 0);
                rolesBreakdown[r.peran] = cnt;
                totalTerlibat += cnt;
            }
            return { totalTerlibat, rolesBreakdown };
        } catch {
            return null;
        }
    }

    private mapAndDedupeRecords(rows: any[]): CrossEntityMatchRecord[] {
        const seen = new Set<string>();
        const out: CrossEntityMatchRecord[] = [];

        for (const r of rows) {
            const lpId = Number(r.lp_id);
            const sumber = r.sumber_tabel as CrossEntityMatchRecord['sumber_tabel'];
            const peran = String(r.peran_entitas || 'TERLIBAT');
            const detail = String(r.detail_konteks || '').trim();
            const dedupeKey = `${lpId}|${sumber}|${peran}|${detail.toUpperCase()}`;
            if (seen.has(dedupeKey)) continue;
            seen.add(dedupeKey);

            out.push({
                lp_id: lpId,
                dors_lp_id: r.dors_lp_id !== null && r.dors_lp_id !== undefined ? Number(r.dors_lp_id) : null,
                model_lp: r.model_lp || null,
                no_laporan: String(r.no_laporan || 'LP Tanpa Nomor'),
                tgl_laporan: String(r.tgl_laporan || '-'),
                status_perkara: String(r.status_perkara || 'PROSES'),
                kode_status: r.kode_status || null,
                satker_id: r.satker_id !== null && r.satker_id !== undefined ? Number(r.satker_id) : null,
                satker_nama: String(r.satker_nama || 'POLRI'),
                kategori_kejahatan: String(r.kategori_kejahatan || '-'),
                peran_entitas: peran,
                sumber_tabel: sumber,
                detail_konteks: detail || '-',
                nama_tercatat: r.nama_tercatat || null,
                nik: r.nik || null,
                no_hp: r.no_hp || null,
                alamat: r.alamat || null
            });
        }
        return out;
    }

    private buildSummary(records: CrossEntityMatchRecord[]): CrossEntityProfileSummary {
        const uniqueLpIds = new Set<number>();
        const rolesBreakdown: Record<string, number> = {};
        const statusBreakdown: Record<string, number> = {};
        const satkerSet = new Set<string>();
        let terlibatMatches = 0;
        let barangBuktiMatches = 0;

        for (const rec of records) {
            uniqueLpIds.add(rec.lp_id);
            rolesBreakdown[rec.peran_entitas] = (rolesBreakdown[rec.peran_entitas] || 0) + 1;
            statusBreakdown[rec.status_perkara] = (statusBreakdown[rec.status_perkara] || 0) + 1;
            if (rec.satker_nama) satkerSet.add(rec.satker_nama);
            if (rec.sumber_tabel === 'bdb_dors_lp_terlibat') terlibatMatches++;
            else barangBuktiMatches++;
        }

        return {
            total_lp: uniqueLpIds.size,
            total_records: records.length,
            total_terlibat_matches: terlibatMatches,
            total_barang_bukti_matches: barangBuktiMatches,
            roles_breakdown: rolesBreakdown,
            status_breakdown: statusBreakdown,
            satkers_involved: Array.from(satkerSet)
        };
    }

    private formatNarrativeSummary(
        parsed: CoserseParsedEntities,
        summary: CrossEntityProfileSummary,
        records: CrossEntityMatchRecord[]
    ): string {
        const label =
            parsed.niks[0] ||
            parsed.phones[0]?.local08 ||
            parsed.names[0] ||
            parsed.plates[0] ||
            parsed.sanitizedQuery;

        if (!records.length) {
            return `Tidak ditemukan keterlibatan entitas "${label}" pada data Pihak Terlibat maupun Barang Bukti sesuai cakupan akses Anda.`;
        }

        const lines: string[] = [
            `🔍 **Profil Entitas**: ${label} (${parsed.detectedType})`,
            `📊 **Ringkasan Keterlibatan**: Teridentifikasi dalam **${summary.total_lp} Laporan Polisi** (${summary.total_terlibat_matches} temuan di Pihak Terlibat, ${summary.total_barang_bukti_matches} temuan di Barang Bukti).`,
            ''
        ];

        records.slice(0, 10).forEach((rec, i) => {
            lines.push(
                `${i + 1}. **${rec.no_laporan}** (Tgl: ${rec.tgl_laporan}) — Peran: **${rec.peran_entitas}** | Status: ${rec.status_perkara} | Satker: ${rec.satker_nama} | Sumber: \`${rec.sumber_tabel}\` (${rec.detail_konteks})`
            );
        });

        if (records.length > 10) {
            lines.push(`...dan ${records.length - 10} catatan keterlibatan lainnya.`);
        }

        return lines.join('\n');
    }

    private isProgrammingOrCodingRequest(rawMessage: string): boolean {
        const msg = String(rawMessage || '').trim();
        if (!msg) return false;
        const hasSqlOrCodePattern =
            /\b(select\s+.+\s+from|create\s+table|insert\s+into|update\s+\w+\s+set|delete\s+from|alter\s+table|function\s+\w+\s*\(|const\s+\w+\s*=|let\s+\w+\s*=|def\s+\w+\s*\(|import\s+\w+\s+from|console\.log\(|<\?php)\b/i.test(
                msg
            );
        if (hasSqlOrCodePattern) return true;
        const hasProgKeyword =
            /\b(coding|ngoding|programming|pemrograman|source\s*code|script|skrip|query\s+sql|\bsql\b|debug(?:ging)?|bugfix|refactor|regex|typescript|javascript|python|node\.?js|golang|nestjs|react|bash|powershell|html|css)\b/i.test(
                msg
            );
        return hasProgKeyword;
    }

    /**
     * Read-only lookup for explicit LP numbers (LP/A/... or LP/B/...) or RJ (Restorative Justice)
     * aggregations/samples scoped strictly to the actor's Satker authority.
     */
    private async lookupAnalyticalCaseEvidence(
        actor: ResolvedActor,
        rawMessage: string
    ): Promise<CrossEntityProfileResponse | null> {
        if (actor.isBlockedRole) return null;
        const msg = String(rawMessage || '').trim();
        if (!msg) return null;

        const lpMatch = msg.match(/\bLP\s*\/\s*[AB]\s*\/[^\s,;)]+/i);
        const isRjQuery = /\b(rj|restorative\s+justice)\b/i.test(msg);
        if (!lpMatch && !isRjQuery) return null;

        const t0 = Date.now();
        const params: any[] = [];
        const addParam = (val: any): string => {
            params.push(val);
            return `$${params.length}`;
        };

        let cteSql = '';
        let scopePredicate = '1=1';
        if (!actor.isNational) {
            if (!actor.satkerId || actor.satkerId <= 0) {
                scopePredicate = '1=0';
            } else {
                const satkerParam = addParam(actor.satkerId);
                cteSql = `WITH scope_ids AS (
                    WITH RECURSIVE scope_tree AS (
                        SELECT id FROM bdb_satker WHERE id = ${satkerParam}
                        UNION
                        SELECT s.id FROM bdb_satker s JOIN scope_tree t ON s.parent_id = t.id
                    )
                    SELECT id FROM scope_tree
                )`;
                scopePredicate = 'coalesce(lp.unit_satker_id, lp.satker_id) IN (SELECT id FROM scope_ids)';
            }
        }

        const scopeInfo = {
            role: actor.role,
            mode: (actor.isNational ? 'NATIONAL' : 'SATKER_SUBTREE') as 'NATIONAL' | 'SATKER_SUBTREE',
            satker_id: actor.satkerId
        };

        if (lpMatch) {
            const lpNo = lpMatch[0]
                .replace(/\s*\/\s*/g, '/')
                .replace(/\(RJ\)$/i, '')
                .trim();
            const pExact = addParam(lpNo.toUpperCase());
            const pLike = addParam(`${lpNo.toUpperCase()}%`);
            const sql = `
                ${cteSql}
                SELECT
                    lp.id::bigint AS lp_id,
                    lp.dors_lp_id::bigint AS dors_lp_id,
                    lp.model_lp,
                    coalesce(nullif(btrim(lp.no_laporan), ''), 'LP Tanpa Nomor') AS no_laporan,
                    coalesce(nullif(btrim(lp.tgl_laporan), ''), to_char(lp.synced_at, 'DD-MM-YYYY')) AS tgl_laporan,
                    coalesce(nullif(btrim(sm.nama), ''), nullif(btrim(lp.status), ''), 'PROSES') AS status_perkara,
                    sm.code AS kode_status,
                    coalesce(lp.unit_satker_id, lp.satker_id)::bigint AS satker_id,
                    coalesce(nullif(btrim(lp.unit_satker_nama), ''), nullif(btrim(lp.satker_nama), ''), 'POLRI') AS satker_nama,
                    coalesce(nullif(btrim(lp.kategori), ''), nullif(btrim(jk.keterangan), ''), '-') AS kategori_kejahatan
                FROM bdb_laporan_polisi lp
                LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                WHERE lp.deleted_at IS NULL
                  AND ${scopePredicate}
                  AND (upper(btrim(lp.no_laporan)) = ${pExact} OR upper(btrim(lp.no_laporan)) LIKE ${pLike})
                ORDER BY lp.id DESC
                LIMIT 10
            `;
            const rows: any[] = await this.dataSource.query(sql, params);
            const records: CrossEntityMatchRecord[] = rows.map((r) => ({
                lp_id: Number(r.lp_id),
                dors_lp_id: Number(r.dors_lp_id || 0),
                model_lp: String(r.model_lp || ''),
                no_laporan: String(r.no_laporan || ''),
                tgl_laporan: String(r.tgl_laporan || ''),
                status_perkara: String(r.status_perkara || 'PROSES'),
                kode_status: r.kode_status || null,
                satker_id: Number(r.satker_id || 0),
                satker_nama: String(r.satker_nama || 'POLRI'),
                kategori_kejahatan: String(r.kategori_kejahatan || '-'),
                peran_entitas: 'PERKARA_LP',
                sumber_tabel: 'bdb_laporan_polisi' as any,
                detail_konteks: `Lookup LP ${r.no_laporan} (${r.status_perkara})`,
                nama_tercatat: null,
                nik: null,
                no_hp: null,
                alamat: null
            }));
            const statusBreakdown: Record<string, number> = {};
            const satkers = new Set<string>();
            for (const rec of records) {
                statusBreakdown[rec.status_perkara] = (statusBreakdown[rec.status_perkara] || 0) + 1;
                satkers.add(rec.satker_nama);
            }
            return {
                status: 1,
                query: { raw: lpNo, detected_type: 'MIXED' as any, niks: [], phones: [], names: [], keywords: [lpNo] },
                scope: scopeInfo,
                summary: {
                    total_lp: records.length,
                    total_records: records.length,
                    total_terlibat_matches: 0,
                    total_barang_bukti_matches: 0,
                    roles_breakdown: { PERKARA_LP: records.length },
                    status_breakdown: statusBreakdown,
                    satkers_involved: Array.from(satkers)
                },
                records,
                discovery_groups: records.length
                    ? [
                          {
                              group_id: 'Data A',
                              group_key: 'PERKARA_LP',
                              label: 'Laporan Polisi (Pencarian Nomor LP)',
                              source_table: 'bdb_laporan_polisi',
                              total_count: records.length,
                              breakdown: statusBreakdown,
                              records
                          }
                      ]
                    : [],
                active_group: null,
                narrative_summary: '',
                disclaimer: COSERSE_DISCLAIMER,
                performance: { elapsed_ms: Date.now() - t0, query_ms: Date.now() - t0, target_ms: TARGET_LATENCY_MS, within_target: true, indexes_ready: true }
            };
        }

        // RJ / Restorative Justice read-only aggregation + up to 10 sample records
        const rjCond = `(
            upper(coalesce(sm.code, '')) IN ('SP3', 'SP2_LID')
            OR upper(coalesce(sm.nama, lp.status, '')) ~ '(RESTORATIVE|\\mRJ\\M)'
        )`;
        const countSql = `
            ${cteSql}
            SELECT count(*)::int AS total_rj
            FROM bdb_laporan_polisi lp
            LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
            WHERE lp.deleted_at IS NULL AND ${scopePredicate} AND ${rjCond}
        `;
        const sampleSql = `
            ${cteSql}
            SELECT
                lp.id::bigint AS lp_id,
                lp.dors_lp_id::bigint AS dors_lp_id,
                lp.model_lp,
                coalesce(nullif(btrim(lp.no_laporan), ''), 'LP Tanpa Nomor') AS no_laporan,
                coalesce(nullif(btrim(lp.tgl_laporan), ''), to_char(lp.synced_at, 'DD-MM-YYYY')) AS tgl_laporan,
                coalesce(nullif(btrim(sm.nama), ''), nullif(btrim(lp.status), ''), 'RJ') AS status_perkara,
                sm.code AS kode_status,
                coalesce(lp.unit_satker_id, lp.satker_id)::bigint AS satker_id,
                coalesce(nullif(btrim(lp.unit_satker_nama), ''), nullif(btrim(lp.satker_nama), ''), 'POLRI') AS satker_nama,
                coalesce(nullif(btrim(lp.kategori), ''), nullif(btrim(jk.keterangan), ''), '-') AS kategori_kejahatan
            FROM bdb_laporan_polisi lp
            LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
            LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
            WHERE lp.deleted_at IS NULL AND ${scopePredicate} AND ${rjCond}
            ORDER BY lp.id DESC
            LIMIT 10
        `;
        const [countRows, sampleRows]: [any[], any[]] = await Promise.all([
            this.dataSource.query(countSql, params),
            this.dataSource.query(sampleSql, params)
        ]);
        const totalRj = Number(countRows?.[0]?.total_rj || 0);
        const records: CrossEntityMatchRecord[] = sampleRows.map((r) => ({
            lp_id: Number(r.lp_id),
            dors_lp_id: Number(r.dors_lp_id || 0),
            model_lp: String(r.model_lp || ''),
            no_laporan: String(r.no_laporan || ''),
            tgl_laporan: String(r.tgl_laporan || ''),
            status_perkara: String(r.status_perkara || 'RJ'),
            kode_status: r.kode_status || null,
            satker_id: Number(r.satker_id || 0),
            satker_nama: String(r.satker_nama || 'POLRI'),
            kategori_kejahatan: String(r.kategori_kejahatan || '-'),
            peran_entitas: 'RESTORATIVE_JUSTICE',
            sumber_tabel: 'bdb_laporan_polisi' as any,
            detail_konteks: `Total RJ Scope: ${totalRj} LP | Status: ${r.status_perkara}`,
            nama_tercatat: null,
                nik: null,
                no_hp: null,
                alamat: null
            }));
        const statusBreakdown: Record<string, number> = {};
        const satkers = new Set<string>();
        for (const rec of records) {
            statusBreakdown[rec.status_perkara] = (statusBreakdown[rec.status_perkara] || 0) + 1;
            satkers.add(rec.satker_nama);
        }
        return {
            status: 1,
            query: { raw: msg, detected_type: 'MIXED' as any, niks: [], phones: [], names: [], keywords: ['RJ', 'Restorative Justice'] },
            scope: scopeInfo,
            summary: {
                total_lp: totalRj,
                total_records: records.length,
                total_terlibat_matches: 0,
                total_barang_bukti_matches: 0,
                roles_breakdown: { RESTORATIVE_JUSTICE_TOTAL: totalRj },
                status_breakdown: statusBreakdown,
                satkers_involved: Array.from(satkers)
            },
            records,
            discovery_groups:
                totalRj > 0 || records.length > 0
                    ? [
                          {
                              group_id: 'Data A',
                              group_key: 'PERKARA_LP',
                              label: 'Laporan Polisi Penyelesaian RJ / SP3 / SP2 Lidik',
                              source_table: 'bdb_laporan_polisi',
                              total_count: totalRj,
                              breakdown: statusBreakdown,
                              records
                          }
                      ]
                    : [],
            active_group: null,
            narrative_summary: '',
            disclaimer: COSERSE_DISCLAIMER,
            performance: { elapsed_ms: Date.now() - t0, query_ms: Date.now() - t0, target_ms: TARGET_LATENCY_MS, within_target: true, indexes_ready: true }
        };
    }

    /**
     * Emits a Human-in-the-Loop review_card payload when an authorized user sends
     * an LP status update command referencing a valid LP in scope.
     */
    private buildReviewCardFromCommand(
        actor: ResolvedActor,
        rawMessage: string,
        records: CrossEntityMatchRecord[]
    ): Record<string, any> | null {
        if (actor.isBlockedRole || actor.role === 'testing' || !records.length) {
            return null;
        }
        const msg = String(rawMessage || '').trim();
        const hasUpdateVerb = /\b(ubah|update|ganti|set|naikkan|turunkan|proses|ajukan|hentikan|ubah status)\b/i.test(msg);
        const TARGET_PATTERNS: Array<{
            regex: RegExp;
            targetStatusCode: string;
            docTypeCode: string;
            docTypeNama: string;
            isRj?: boolean;
        }> = [
            {
                regex: /\b(SP2[\s_-]*LID(?:IK)?|HENTI\s*LIDIK)\b/i,
                targetStatusCode: 'SP2_LID',
                docTypeCode: 'SP2_LIDIK',
                docTypeNama: 'Surat Perintah Penghentian Penyelidikan (SP2 Lidik)'
            },
            {
                regex: /\b(TAHAP[\s_-]*(?:II|2))\b/i,
                targetStatusCode: 'TAHAP_II',
                docTypeCode: 'TAHAP_2',
                docTypeNama: 'Pelimpahan Tersangka & Barang Bukti (Tahap II)'
            },
            {
                regex: /\b(TAHAP[\s_-]*(?:I|1))\b/i,
                targetStatusCode: 'TAHAP_I',
                docTypeCode: 'TAHAP_1',
                docTypeNama: 'Surat Pengantar Berkas Perkara Tahap I'
            },
            {
                regex: /\b(P[\s-]*19)\b/i,
                targetStatusCode: 'P19',
                docTypeCode: 'P19',
                docTypeNama: 'Pengembalian Berkas untuk Dilengkapi (P-19)'
            },
            {
                regex: /\b(P[\s-]*21)\b/i,
                targetStatusCode: 'P21',
                docTypeCode: 'P21',
                docTypeNama: 'Pemberitahuan Berkas Lengkap (P-21)'
            },
            {
                regex: /\b(SPDP)\b/i,
                targetStatusCode: 'SPDP',
                docTypeCode: 'SPDP',
                docTypeNama: 'Surat Pemberitahuan Dimulainya Penyidikan (SPDP)'
            },
            {
                regex: /\b(PERMA)\b/i,
                targetStatusCode: 'PERMA',
                docTypeCode: 'PERMA',
                docTypeNama: 'Penetapan / Putusan PERMA (Perma)'
            },
            {
                regex: /\b(RESTORATIVE\s+JUSTICE|RJ)\b/i,
                targetStatusCode: 'SP3',
                docTypeCode: 'SP3',
                docTypeNama: 'Surat Perintah Penghentian Penyidikan (SP3 / RJ)',
                isRj: true
            },
            {
                regex: /\b(SP3)\b/i,
                targetStatusCode: 'SP3',
                docTypeCode: 'SP3',
                docTypeNama: 'Surat Perintah Penghentian Penyidikan (SP3)'
            },
            {
                regex: /\b(PENYIDIKAN|SIDIK)\b/i,
                targetStatusCode: 'PENYIDIKAN',
                docTypeCode: 'SP_SIDIK',
                docTypeNama: 'Surat Perintah Penyidikan (Sprin Sidik)'
            },
            {
                regex: /\b(PENYELIDIKAN|LIDIK)\b/i,
                targetStatusCode: 'PENYELIDIKAN',
                docTypeCode: 'SP_LIDIK',
                docTypeNama: 'Surat Perintah Penyelidikan (Sprin Lidik)'
            }
        ];

        const matched = TARGET_PATTERNS.find((entry) => entry.regex.test(msg));
        if (!hasUpdateVerb || !matched) {
            return null;
        }

        const { targetStatusCode, docTypeCode, docTypeNama } = matched;

        const rec = records[0];
        const now = new Date();
        let isoDate = now.toISOString().slice(0, 10);
        let ddMmYyyy = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
        const isoMatch = msg.match(/\b(20\d{2})-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])\b/);
        const dmyDashMatch = msg.match(/\b(0?[1-9]|[12]\d|3[01])-(0?[1-9]|1[0-2])-(20\d{2})\b/);
        const slashDateMatch = msg.match(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/);
        if (isoMatch) {
            const [, y, m, d] = isoMatch;
            isoDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
            ddMmYyyy = `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
        } else if (dmyDashMatch) {
            const [, d, m, y] = dmyDashMatch;
            isoDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
            ddMmYyyy = `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
        } else if (slashDateMatch) {
            const [, aStr, bStr, y] = slashDateMatch;
            const a = Number(aStr);
            const b = Number(bStr);
            const [dNum, mNum] = a > 12 ? [a, b] : b > 12 ? [b, a] : [a, b];
            isoDate = `${y}-${String(mNum).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
            ddMmYyyy = `${String(dNum).padStart(2, '0')}-${String(mNum).padStart(2, '0')}-${y}`;
        }
        const nomorDocMatch = msg.match(/\b(?:Nomor|No\.?)\s*[:=]?\s*([A-Z0-9./-]{5,})/i);

        return {
            draft_id: `rc-${Date.now()}`,
            lp_id: rec.lp_id,
            nomor_lp: rec.no_laporan,
            doc_type_code: docTypeCode,
            doc_type_nama: docTypeNama,
            target_status_code: targetStatusCode,
            current_status: rec.status_perkara,
            nomor_dokumen: nomorDocMatch ? nomorDocMatch[1] : `SP/${now.getFullYear()}/COSERSE`,
            tanggal_dokumen: ddMmYyyy,
            tanggal_dokumen_iso: isoDate,
            tersangka: rec.nama_tercatat || '',
            kejaksaan_tujuan: '',
            alasan_penghentian: matched.isRj ? 'Restorative Justice' : '',
            source_filename: 'coserse-chat-command',
            satker_nama: rec.satker_nama,
            cardStatus: 'PENDING'
        };
    }

    private containsCodeBlock(text: string): boolean {
        return /```[\s\S]*?```/.test(String(text || ''));
    }

    private buildProgrammingDeniedReply(handle: string): string {
        return `Maaf ${handle}, fitur bantuan pemrograman/coding dan query SQL hanya tersedia untuk role Superadmin. Silakan ajukan permintaan rekapitulasi data, tabel Markdown, hitung-hitungan dasar, atau analisis perkara.`;
    }

    private instructionsCache: { expiresAt: number; text: string } | null = null;
    private readonly satkerSubtreeCache = new Map<
        number,
        { expiresAt: number; ids: number[]; nameKeywords: string[] }
    >();
    private readonly sessionSearchContext = new Map<string, SessionSearchContextState>();

    private parseDateSortKey(rawDate?: string | null): number {
        const s = String(rawDate || '').trim();
        if (!s || s === '-') return 0;
        const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (iso) return new Date(`${iso[1]}-${iso[2]}-${iso[3]}T00:00:00Z`).getTime() || 0;
        const dmy = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
        if (dmy) {
            return (
                new Date(
                    `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}T00:00:00Z`
                ).getTime() || 0
            );
        }
        const t = Date.parse(s);
        return Number.isFinite(t) ? t : 0;
    }

    private sortMatchRecords(
        records: CrossEntityMatchRecord[],
        sortBy?: 'RELEVANCE' | 'NEWEST' | 'OLDEST' | null
    ): CrossEntityMatchRecord[] {
        const list = records.slice();
        if (sortBy === 'NEWEST') {
            list.sort(
                (a, b) =>
                    this.parseDateSortKey(b.tgl_laporan) - this.parseDateSortKey(a.tgl_laporan) ||
                    b.lp_id - a.lp_id
            );
        } else if (sortBy === 'OLDEST') {
            list.sort((a, b) => {
                const ka = this.parseDateSortKey(a.tgl_laporan) || Number.MAX_SAFE_INTEGER;
                const kb = this.parseDateSortKey(b.tgl_laporan) || Number.MAX_SAFE_INTEGER;
                return ka - kb || a.lp_id - b.lp_id;
            });
        }
        return list;
    }

    private async resolveSatkerSubtreeInfo(
        satkerId: number
    ): Promise<{ ids: number[]; nameKeywords: string[] }> {
        const cached = this.satkerSubtreeCache.get(satkerId);
        if (cached && cached.expiresAt > Date.now()) {
            return { ids: cached.ids, nameKeywords: cached.nameKeywords };
        }
        try {
            const rows: Array<{ id: number; ns: string; dk: string }> = await this.dataSource.query(
                `WITH RECURSIVE scope_tree AS (
                    SELECT id, upper(coalesce(nama_singkat,'')) AS ns, upper(coalesce(deskripsi,'')) AS dk
                    FROM bdb_satker WHERE id = $1
                    UNION
                    SELECT s.id, upper(coalesce(s.nama_singkat,'')), upper(coalesce(s.deskripsi,''))
                    FROM bdb_satker s JOIN scope_tree t ON s.parent_id = t.id
                )
                SELECT id::int AS id, ns, dk FROM scope_tree`,
                [satkerId]
            );
            const ids = rows.map((r) => Number(r.id)).filter((n) => Number.isSafeInteger(n) && n > 0);
            const kws = new Set<string>();
            for (const r of rows.slice(0, 12)) {
                const dk = String(r.dk || '').trim();
                const ns = String(r.ns || '').trim();
                if (dk.length >= 4) kws.add(dk);
                if (ns.length >= 4) kws.add(ns);
            }
            const out = { ids: ids.length ? ids : [satkerId], nameKeywords: Array.from(kws) };
            this.satkerSubtreeCache.set(satkerId, { ...out, expiresAt: Date.now() + 300_000 });
            return out;
        } catch {
            return { ids: [satkerId], nameKeywords: [] };
        }
    }

    private extractSearchTokens(parsed: CoserseParsedEntities): string[] {
        const pool: string[] = [];
        for (const n of parsed.names || []) {
            for (const part of String(n).toUpperCase().split(/\s+/)) {
                const cleaned = part.replace(/[^A-Z0-9.'/-]/g, '').trim();
                if (cleaned.length >= 3) pool.push(cleaned);
            }
        }
        for (const p of parsed.plates || []) {
            pool.push(String(p).replace(/\s+/g, '').toUpperCase());
        }
        for (const nik of parsed.niks || []) {
            pool.push(String(nik).trim());
        }
        for (const ph of parsed.phones || []) {
            if (ph?.coreDigits) pool.push(String(ph.coreDigits));
        }
        return Array.from(new Set(pool)).slice(0, 4);
    }

    private buildMultiTokenWhere(
        exprSql: string,
        tokens: string[],
        addParam: (val: any) => string,
        joinMode: 'AND' | 'OR' = 'AND'
    ): string {
        if (!tokens.length) return '1=0';
        const parts = tokens.map((t) => `${exprSql} LIKE ${addParam(`%${t}%`)}`);
        return `(${parts.join(` ${joinMode} `)})`;
    }

    private mapGenericDiscoveryRow(r: any, defaultSumber: string, defaultPeran: string): CrossEntityMatchRecord {
        return {
            lp_id: Number(r.lp_id || 0),
            dors_lp_id: r.dors_lp_id !== null && r.dors_lp_id !== undefined ? Number(r.dors_lp_id) : null,
            model_lp: r.model_lp || null,
            no_laporan: String(r.no_laporan || '-'),
            tgl_laporan: String(r.tgl_laporan || '-'),
            status_perkara: String(r.status_perkara || 'PROSES'),
            kode_status: r.kode_status || null,
            satker_id: r.satker_id !== null && r.satker_id !== undefined ? Number(r.satker_id) : null,
            satker_nama: String(r.satker_nama || 'POLRI'),
            kategori_kejahatan: String(r.kategori_kejahatan || '-'),
            peran_entitas: String(r.peran_entitas || defaultPeran),
            sumber_tabel: String(r.sumber_tabel || defaultSumber),
            detail_konteks: String(r.detail_konteks || '-').trim() || '-',
            nama_tercatat: r.nama_tercatat || null,
            nik: r.nik || null,
            no_hp: r.no_hp || null,
            alamat: r.alamat || null
        };
    }

    private async discoverExtraTableGroups(
        parsed: CoserseParsedEntities,
        opts: {
            isNational: boolean;
            satkerId: number | null;
            limit: number;
            roleFilter?: string | null;
            satkerKeyword?: string | null;
            offset?: number;
            sortBy?: 'RELEVANCE' | 'NEWEST' | 'OLDEST';
            forceAndMode?: boolean;
        },
        primaryRecords: CrossEntityMatchRecord[]
    ): Promise<{
        groups: CoserseDiscoveryGroup[];
        bbRealCount: number;
        extraRecords: CrossEntityMatchRecord[];
    }> {
        const tokens = this.extractSearchTokens(parsed);
        if (!tokens.length) {
            return { groups: [], bbRealCount: 0, extraRecords: [] };
        }

        const scopeInfo =
            !opts.isNational && opts.satkerId && opts.satkerId > 0
                ? await this.resolveSatkerSubtreeInfo(opts.satkerId)
                : opts.satkerId && opts.satkerId > 0
                ? await this.resolveSatkerSubtreeInfo(opts.satkerId)
                : null;
        const scopedIds = scopeInfo ? scopeInfo.ids : null;
        const joinMode: 'AND' | 'OR' = opts.forceAndMode ? 'AND' : (tokens.length > 2 ? 'OR' : 'AND');
        const sampleCap = Math.max(15, Math.min(30, Number(opts.limit) || 20));
        const sortOrderLp =
            opts.sortBy === 'OLDEST'
                ? 'parse_tgl_laporan(lp.tgl_laporan) ASC NULLS LAST, lp.id ASC'
                : 'parse_tgl_laporan(lp.tgl_laporan) DESC NULLS LAST, lp.id DESC';

        const makeScopeHelpers = () => {
            const params: any[] = [];
            const addParam = (val: any): string => {
                params.push(val);
                return `$${params.length}`;
            };
            const lpScope = scopedIds
                ? `coalesce(lp.unit_satker_id, lp.satker_id) = ANY(${addParam(scopedIds)}::bigint[])`
                : '1=1';
            const satKw = opts.satkerKeyword
                ? `AND (upper(coalesce(lp.unit_satker_nama,'')) LIKE ${addParam(`%${opts.satkerKeyword}%`)} OR upper(coalesce(lp.satker_nama,'')) LIKE ${addParam(`%${opts.satkerKeyword}%`)} OR upper(coalesce(lp.no_laporan,'')) LIKE ${addParam(`%${opts.satkerKeyword}%`)})`
                : '';
            return { params, addParam, lpScope, satKw };
        };

        const maxRow =
            (
                await this.dataSource
                    .query(
                        `SELECT
                            (SELECT coalesce(max(id), 1)::bigint FROM bdb_laporan_polisi) AS lp,
                            (SELECT coalesce(max(id), 1)::bigint FROM bdb_dors_lp_barang_bukti) AS bb,
                            (SELECT coalesce(max(id), 1)::bigint FROM bdb_dors_lp_terlibat) AS ter,
                            (SELECT coalesce(max(id), 1)::bigint FROM bdb_dors_lp_tindak_pidana) AS tp`
                    )
                    .catch(() => null)
            )?.[0] || { lp: 1, bb: 1, ter: 1, tp: 1 };
        const minLpId = Math.max(1, Number(maxRow.lp || 1) - 20000);
        const minBbId = Math.max(1, Number(maxRow.bb || 1) - 20000);
        const minTerId = Math.max(1, Number(maxRow.ter || 1) - 25000);
        const minTpId = Math.max(1, Number(maxRow.tp || 1) - 20000);

        const sortOrderId = opts.sortBy === 'OLDEST' ? 'ASC' : 'DESC';

        // Branch 1: Pihak Terlibat Manual (bdb_lp_pihak_manual)
        const queryManualTerlibat = async (): Promise<CrossEntityMatchRecord[]> => {
            const { params, addParam, lpScope, satKw } = makeScopeHelpers();
            const expr = `upper(concat_ws(' ', m.nama, m.nik, m.pekerjaan, m.alamat, m.no_hp, m.tempat_lahir, m.keterlibatan, m.keterangan))`;
            const whereTokens = this.buildMultiTokenWhere(expr, tokens, addParam, 'AND');
            const rolePred = opts.roleFilter
                ? `AND upper(coalesce(nullif(btrim(m.keterlibatan),''),'PIHAK MANUAL')) = ${addParam(opts.roleFilter)}`
                : '';
            const sql = `
                SELECT
                    lp.id::bigint AS lp_id, lp.dors_lp_id::bigint AS dors_lp_id, lp.model_lp,
                    coalesce(nullif(btrim(lp.no_laporan),''), 'LP Tanpa Nomor') AS no_laporan,
                    coalesce(nullif(btrim(lp.tgl_laporan),''), to_char(lp.synced_at,'DD-MM-YYYY')) AS tgl_laporan,
                    coalesce(nullif(btrim(sm.nama),''), nullif(btrim(lp.status),''), 'PROSES') AS status_perkara,
                    sm.code AS kode_status,
                    coalesce(lp.unit_satker_id, lp.satker_id)::bigint AS satker_id,
                    coalesce(nullif(btrim(lp.unit_satker_nama),''), nullif(btrim(lp.satker_nama),''), 'POLRI') AS satker_nama,
                    coalesce(nullif(btrim(lp.kategori),''), nullif(btrim(jk.keterangan),''), '-') AS kategori_kejahatan,
                    upper(coalesce(nullif(btrim(m.keterlibatan),''), 'PIHAK TERLIBAT')) AS peran_entitas,
                    'bdb_lp_pihak_manual'::text AS sumber_tabel,
                    concat_ws(' | ', nullif(btrim(m.nama),''), nullif(btrim(m.nik),''), nullif(btrim(m.pekerjaan),''), nullif(btrim(m.alamat),'')) AS detail_konteks,
                    nullif(btrim(m.nama),'') AS nama_tercatat, nullif(btrim(m.nik),'') AS nik,
                    nullif(btrim(m.no_hp),'') AS no_hp, nullif(btrim(m.alamat),'') AS alamat
                FROM bdb_lp_pihak_manual m
                JOIN bdb_laporan_polisi lp ON lp.id = m.lp_id AND lp.deleted_at IS NULL
                LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                WHERE m.deleted_at IS NULL AND ${whereTokens} AND ${lpScope} ${satKw} ${rolePred}
                ORDER BY ${sortOrderLp}
                LIMIT ${sampleCap}
            `;
            const rows = await this.dataSource.query(sql, params);
            return rows.map((r: any) => this.mapGenericDiscoveryRow(r, 'bdb_lp_pihak_manual', 'PIHAK TERLIBAT'));
        };

        // Skip non-terlibat branches only when an explicit person roleFilter (TERSANGKA/TERLAPOR/etc.) is active
        if (opts.roleFilter) {
            const manualRows = await queryManualTerlibat().catch(() => []);
            return { groups: [], bbRealCount: 0, extraRecords: manualRows };
        }

        // Branch 2: Real Barang Bukti Count + Extended + Manual
        const queryBarangBuktiGroup = async (): Promise<{ count: number; records: CrossEntityMatchRecord[] } | null> => {
            const { params, addParam, lpScope, satKw } = makeScopeHelpers();
            const ketCond = `(bb.keterangan IS NOT NULL AND btrim(bb.keterangan) <> '' AND ${this.buildMultiTokenWhere('upper(bb.keterangan)', tokens, addParam, 'AND')})`;
            const ownerCond = `(bb.ran_nama_pemilik IS NOT NULL AND btrim(bb.ran_nama_pemilik) <> '' AND ${this.buildMultiTokenWhere('upper(bb.ran_nama_pemilik)', tokens, addParam, 'AND')})`;
            const bbWhereIdx = `(${ketCond} OR ${ownerCond})`;

            const countSql =
                !scopedIds && !opts.satkerKeyword
                    ? `SELECT count(*)::int AS cnt FROM bdb_dors_lp_barang_bukti bb WHERE ${bbWhereIdx}`
                    : `SELECT count(*)::int AS cnt FROM bdb_dors_lp_barang_bukti bb JOIN bdb_dors_lp d ON d.id = bb.lp_id JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = d.dors_lp_id AND lp.model_lp = d.model_lp AND lp.deleted_at IS NULL WHERE ${bbWhereIdx} AND ${lpScope} ${satKw}`;

            const { params: mParams, addParam: mAdd, lpScope: mScope, satKw: mSat } = makeScopeHelpers();
            const manualWhere = this.buildMultiTokenWhere(
                `upper(concat_ws(' ', bm.jenis, bm.keterangan, bm.kepemilikan, bm.nomor_register))`,
                tokens,
                mAdd,
                joinMode
            );
            const manualSql = `
                SELECT
                    lp.id::bigint AS lp_id, lp.dors_lp_id::bigint AS dors_lp_id, lp.model_lp,
                    coalesce(nullif(btrim(lp.no_laporan),''), 'LP Tanpa Nomor') AS no_laporan,
                    coalesce(nullif(btrim(lp.tgl_laporan),''), to_char(lp.synced_at,'DD-MM-YYYY')) AS tgl_laporan,
                    coalesce(nullif(btrim(sm.nama),''), nullif(btrim(lp.status),''), 'PROSES') AS status_perkara,
                    sm.code AS kode_status,
                    coalesce(lp.unit_satker_id, lp.satker_id)::bigint AS satker_id,
                    coalesce(nullif(btrim(lp.unit_satker_nama),''), nullif(btrim(lp.satker_nama),''), 'POLRI') AS satker_nama,
                    coalesce(nullif(btrim(lp.kategori),''), '-') AS kategori_kejahatan,
                    'TERKAIT BARANG BUKTI'::text AS peran_entitas,
                    'bdb_lp_barang_bukti_manual'::text AS sumber_tabel,
                    concat_ws(' | ', nullif(btrim(bm.jenis),''), nullif(btrim(bm.keterangan),''), CASE WHEN nullif(btrim(bm.kepemilikan),'') IS NOT NULL THEN 'Pemilik: ' || btrim(bm.kepemilikan) END) AS detail_konteks,
                    nullif(btrim(bm.kepemilikan),'') AS nama_tercatat, NULL::text AS nik, NULL::text AS no_hp, NULL::text AS alamat
                FROM bdb_lp_barang_bukti_manual bm
                JOIN bdb_laporan_polisi lp ON lp.id = bm.lp_id AND lp.deleted_at IS NULL
                LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
                WHERE bm.deleted_at IS NULL AND ${manualWhere} AND ${mScope} ${mSat}
                ORDER BY ${sortOrderLp}
                LIMIT 15
            `;

            const { params: bParams, addParam: bAdd, lpScope: bScope, satKw: bSat } = makeScopeHelpers();
            const extExpr = `upper(concat_ws(' ', bb.jenis_bb, bb.ran_merk, bb.ran_model, bb.ran_no_rangka, bb.ran_no_registrasi, bb.keterangan, bb.ran_nama_pemilik))`;
            const extWhere = this.buildMultiTokenWhere(extExpr, tokens, bAdd, joinMode);
            const minBbParam = bAdd(minBbId);
            const boundedExtSql = `
                SELECT
                    lp.id::bigint AS lp_id, lp.dors_lp_id::bigint AS dors_lp_id, lp.model_lp,
                    coalesce(nullif(btrim(lp.no_laporan),''), nullif(btrim(d.no_laporan),''), 'LP Tanpa Nomor') AS no_laporan,
                    coalesce(nullif(btrim(lp.tgl_laporan),''), nullif(btrim(d.tgl_laporan),''), to_char(lp.synced_at,'DD-MM-YYYY')) AS tgl_laporan,
                    coalesce(nullif(btrim(sm.nama),''), nullif(btrim(lp.status),''), 'PROSES') AS status_perkara,
                    sm.code AS kode_status,
                    coalesce(lp.unit_satker_id, lp.satker_id)::bigint AS satker_id,
                    coalesce(nullif(btrim(lp.unit_satker_nama),''), nullif(btrim(lp.satker_nama),''), 'POLRI') AS satker_nama,
                    coalesce(nullif(btrim(lp.kategori),''), nullif(btrim(jk.keterangan),''), '-') AS kategori_kejahatan,
                    'TERKAIT BARANG BUKTI'::text AS peran_entitas,
                    'bdb_dors_lp_barang_bukti'::text AS sumber_tabel,
                    concat_ws(' | ', nullif(btrim(bb.jenis_bb),''), nullif(btrim(bb.ran_merk),''), nullif(btrim(bb.keterangan),''), CASE WHEN nullif(btrim(bb.ran_nama_pemilik),'') IS NOT NULL THEN 'Pemilik: ' || btrim(bb.ran_nama_pemilik) END, CASE WHEN nullif(btrim(bb.ran_no_registrasi),'') IS NOT NULL THEN 'Nopol: ' || btrim(bb.ran_no_registrasi) END) AS detail_konteks,
                    nullif(btrim(bb.ran_nama_pemilik),'') AS nama_tercatat, NULL::text AS nik, NULL::text AS no_hp, nullif(btrim(bb.ran_alamat),'') AS alamat
                FROM bdb_dors_lp_barang_bukti bb
                JOIN bdb_dors_lp d ON d.id = bb.lp_id
                JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = d.dors_lp_id AND lp.model_lp = d.model_lp AND lp.deleted_at IS NULL
                LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                WHERE bb.id >= ${minBbParam}::bigint AND ${extWhere} AND ${bScope} ${bSat}
                ORDER BY bb.id ${sortOrderId}
                LIMIT ${sampleCap}
            `;

            const [cntRes, manRes, extRes] = await Promise.all([
                this.dataSource.query(countSql, params).catch(() => [{ cnt: 0 }]),
                this.dataSource.query(manualSql, mParams).catch(() => []),
                this.dataSource.query(boundedExtSql, bParams).catch(() => [])
            ]);

            const bbFromPrimary = primaryRecords.filter((r) => r.sumber_tabel === 'bdb_dors_lp_barang_bukti');
            const seen = new Set<string>();
            const merged: CrossEntityMatchRecord[] = [];
            const pushUniq = (rec: CrossEntityMatchRecord) => {
                const key = `${rec.lp_id}|${rec.detail_konteks.toUpperCase()}`;
                if (seen.has(key)) return;
                seen.add(key);
                merged.push(rec);
            };
            bbFromPrimary.forEach(pushUniq);
            manRes.map((r: any) => this.mapGenericDiscoveryRow(r, 'bdb_lp_barang_bukti_manual', 'TERKAIT BARANG BUKTI')).forEach(pushUniq);
            extRes.map((r: any) => this.mapGenericDiscoveryRow(r, 'bdb_dors_lp_barang_bukti', 'TERKAIT BARANG BUKTI')).forEach(pushUniq);

            const idxCount = Number(cntRes?.[0]?.cnt || 0);
            const totalCount = Math.max(idxCount + manRes.length, merged.length);
            if (totalCount === 0) return null;
            return { count: totalCount, records: merged.slice(0, sampleCap) };
        };

        // Branch 3: Laporan Polisi & Uraian Perkara / TKP / Modus / Pasal (fast constant-bound 20k scan + GIN no_laporan + TP scan)
        const queryPerkaraLpGroup = async (): Promise<{ count: number; records: CrossEntityMatchRecord[] } | null> => {
            const { params, addParam, lpScope, satKw } = makeScopeHelpers();
            const lpExpr = `upper(concat_ws(' ', lp.no_laporan, lp.kategori, lp.tempat_kejadian, lp.uraian_singkat, lp.satker_nama, lp.unit_satker_nama, lp.status, d.uraian_kejadian, d.apa_terjadi, d.bagaimana_terjadi, jk.keterangan, sm.nama))`;
            const whereCore = this.buildMultiTokenWhere(lpExpr, tokens, addParam, 'AND');
            const hasLpSlash = tokens.some((t) => t.includes('/'));
            const boundsWhere = hasLpSlash ? '' : `lp.id >= ${addParam(minLpId)}::bigint AND`;

            const baseFrom = `
                FROM bdb_laporan_polisi lp
                LEFT JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                WHERE ${boundsWhere} lp.deleted_at IS NULL AND ${lpScope} ${satKw} AND ${whereCore}
            `;

            const sampleSql = `
                SELECT
                    lp.id::bigint AS lp_id, lp.dors_lp_id::bigint AS dors_lp_id, lp.model_lp,
                    coalesce(nullif(btrim(lp.no_laporan),''), 'LP Tanpa Nomor') AS no_laporan,
                    coalesce(nullif(btrim(lp.tgl_laporan),''), to_char(lp.synced_at,'DD-MM-YYYY')) AS tgl_laporan,
                    coalesce(nullif(btrim(sm.nama),''), nullif(btrim(lp.status),''), 'PROSES') AS status_perkara,
                    sm.code AS kode_status,
                    coalesce(lp.unit_satker_id, lp.satker_id)::bigint AS satker_id,
                    coalesce(nullif(btrim(lp.unit_satker_nama),''), nullif(btrim(lp.satker_nama),''), 'POLRI') AS satker_nama,
                    coalesce(nullif(btrim(lp.kategori),''), nullif(btrim(jk.keterangan),''), nullif(btrim(d.apa_terjadi),''), '-') AS kategori_kejahatan,
                    'PERKARA_LP'::text AS peran_entitas,
                    'bdb_laporan_polisi'::text AS sumber_tabel,
                    concat_ws(' | ', nullif(btrim(coalesce(lp.tempat_kejadian, d.tempat_kejadian)),''), left(coalesce(nullif(btrim(lp.uraian_singkat),''), nullif(btrim(d.uraian_singkat_kejadian),''), nullif(btrim(d.uraian_kejadian),'')), 150)) AS detail_konteks,
                    NULL::text AS nama_tercatat, NULL::text AS nik, NULL::text AS no_hp, nullif(btrim(coalesce(lp.tempat_kejadian, d.tempat_kejadian)),'') AS alamat
                ${baseFrom}
                ORDER BY lp.id ${sortOrderId}
                LIMIT ${sampleCap}
            `;
            const countSql = `SELECT count(*)::int AS cnt ${baseFrom}`;

            const { params: tpParams, addParam: tpAdd, lpScope: tpScope, satKw: tpSat } = makeScopeHelpers();
            const tpExpr = `upper(concat_ws(' ', tp.nama_kategori_kejahatan, tp.nama_uu, tp.pasal, tp.pasal_mapping))`;
            const whereTp = this.buildMultiTokenWhere(tpExpr, tokens, tpAdd, 'AND');
            const minTpParam = tpAdd(minTpId);
            const tpSql = `
                SELECT
                    lp.id::bigint AS lp_id, lp.dors_lp_id::bigint AS dors_lp_id, lp.model_lp,
                    coalesce(nullif(btrim(lp.no_laporan),''), 'LP Tanpa Nomor') AS no_laporan,
                    coalesce(nullif(btrim(lp.tgl_laporan),''), to_char(lp.synced_at,'DD-MM-YYYY')) AS tgl_laporan,
                    coalesce(nullif(btrim(sm.nama),''), nullif(btrim(lp.status),''), 'PROSES') AS status_perkara,
                    sm.code AS kode_status,
                    coalesce(lp.unit_satker_id, lp.satker_id)::bigint AS satker_id,
                    coalesce(nullif(btrim(lp.unit_satker_nama),''), nullif(btrim(lp.satker_nama),''), 'POLRI') AS satker_nama,
                    coalesce(nullif(btrim(tp.nama_kategori_kejahatan),''), nullif(btrim(lp.kategori),''), '-') AS kategori_kejahatan,
                    'PERKARA_LP'::text AS peran_entitas,
                    'bdb_laporan_polisi'::text AS sumber_tabel,
                    concat_ws(' | ', nullif(btrim(tp.nama_uu),''), nullif(btrim(tp.pasal_mapping),''), nullif(btrim(tp.pasal),''), nullif(btrim(lp.tempat_kejadian),'')) AS detail_konteks,
                    NULL::text AS nama_tercatat, NULL::text AS nik, NULL::text AS no_hp, nullif(btrim(lp.tempat_kejadian),'') AS alamat
                FROM bdb_dors_lp_tindak_pidana tp
                JOIN bdb_dors_lp d ON d.id = tp.lp_id
                JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = d.dors_lp_id AND lp.model_lp = d.model_lp AND lp.deleted_at IS NULL
                LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
                WHERE tp.id >= ${minTpParam}::bigint AND ${whereTp} AND ${tpScope} ${tpSat}
                ORDER BY tp.id ${sortOrderId}
                LIMIT 10
            `;

            const [sRows, cRows, tpRows] = await Promise.all([
                this.dataSource.query(sampleSql, params),
                this.dataSource.query(countSql, params).catch(() => [{ cnt: 0 }]),
                this.dataSource.query(tpSql, tpParams).catch(() => [])
            ]);
            const seenLp = new Set<number>();
            const recs: CrossEntityMatchRecord[] = [];
            for (const raw of [...sRows, ...tpRows]) {
                const mapped = this.mapGenericDiscoveryRow(raw, 'bdb_laporan_polisi', 'PERKARA_LP');
                if (seenLp.has(mapped.lp_id)) continue;
                seenLp.add(mapped.lp_id);
                recs.push(mapped);
            }
            const totalCount = Math.max(Number(cRows?.[0]?.cnt || 0), recs.length);
            if (!totalCount) return null;
            return { count: totalCount, records: recs.slice(0, sampleCap) };
        };

        // Branch 4: Pihak Terlibat Atribut (pekerjaan, alamat, tempat_lahir, jenis_identitas)
        const queryTerlibatAtribut = async (): Promise<{ count: number; records: CrossEntityMatchRecord[] } | null> => {
            const { params, addParam, lpScope, satKw } = makeScopeHelpers();
            const attrExpr = `upper(concat_ws(' ', ter.pekerjaan, ter.alamat, ter.tempat_lahir, ter.jenis_identitas, ter.keterlibatan))`;
            const whereAttr = this.buildMultiTokenWhere(attrExpr, tokens, addParam, 'AND');
            const minTerParam = addParam(minTerId);
            const sql = `
                SELECT
                    lp.id::bigint AS lp_id, lp.dors_lp_id::bigint AS dors_lp_id, lp.model_lp,
                    coalesce(nullif(btrim(lp.no_laporan),''), 'LP Tanpa Nomor') AS no_laporan,
                    coalesce(nullif(btrim(lp.tgl_laporan),''), to_char(lp.synced_at,'DD-MM-YYYY')) AS tgl_laporan,
                    coalesce(nullif(btrim(sm.nama),''), nullif(btrim(lp.status),''), 'PROSES') AS status_perkara,
                    sm.code AS kode_status,
                    coalesce(lp.unit_satker_id, lp.satker_id)::bigint AS satker_id,
                    coalesce(nullif(btrim(lp.unit_satker_nama),''), nullif(btrim(lp.satker_nama),''), 'POLRI') AS satker_nama,
                    coalesce(nullif(btrim(lp.kategori),''), nullif(btrim(jk.keterangan),''), '-') AS kategori_kejahatan,
                    upper(coalesce(nullif(btrim(ter.keterlibatan),''), 'PIHAK TERLIBAT')) AS peran_entitas,
                    'bdb_dors_lp_terlibat'::text AS sumber_tabel,
                    concat_ws(' | ', nullif(btrim(ter.nama),''), nullif(btrim(ter.pekerjaan),''), nullif(btrim(ter.tempat_lahir),''), nullif(btrim(ter.alamat),'')) AS detail_konteks,
                    nullif(btrim(ter.nama),'') AS nama_tercatat, nullif(btrim(ter.nik),'') AS nik,
                    coalesce(nullif(btrim(ter.no_hp),''), nullif(btrim(ter.telphone),'')) AS no_hp, nullif(btrim(ter.alamat),'') AS alamat
                FROM bdb_dors_lp_terlibat ter
                JOIN bdb_dors_lp d ON d.id = ter.lp_id
                JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = d.dors_lp_id AND lp.model_lp = d.model_lp AND lp.deleted_at IS NULL
                LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                WHERE ter.id >= ${minTerParam}::bigint AND ${whereAttr} AND ${lpScope} ${satKw}
                ORDER BY ter.id ${sortOrderId}
                LIMIT ${sampleCap}
            `;
            const rows = await this.dataSource.query(sql, params);
            const primKeys = new Set(primaryRecords.map((r) => `${r.lp_id}|${(r.nama_tercatat || '').toUpperCase()}`));
            const uniqueRecs = rows
                .map((r: any) => this.mapGenericDiscoveryRow(r, 'bdb_dors_lp_terlibat', 'PIHAK TERLIBAT'))
                .filter((r: CrossEntityMatchRecord) => !primKeys.has(`${r.lp_id}|${(r.nama_tercatat || '').toUpperCase()}`));
            if (!uniqueRecs.length) return null;
            return { count: uniqueRecs.length, records: uniqueRecs };
        };

        // Branch 5: Kasus Menonjol (full table ~709 rows)
        const queryKasusMenonjol = async (): Promise<{ count: number; records: CrossEntityMatchRecord[] } | null> => {
            const params: any[] = [];
            const addParam = (val: any): string => {
                params.push(val);
                return `$${params.length}`;
            };
            const kmScope = scopedIds ? `km.satker_id = ANY(${addParam(scopedIds)}::bigint[])` : '1=1';
            const expr = `upper(concat_ws(' ', km.judul, km.keterangan, km.nomor_lp, km.tindak_pidana, km.pasal, km.tempat_kejadian, km.kronologis, km.pelapor::text, km.daftar_tersangka::text, km.daftar_bb::text, km.modus_operandi, km.motif_pelaku, km.kategori, s.deskripsi, s.nama_singkat))`;
            const whereTokens = this.buildMultiTokenWhere(expr, tokens, addParam, 'AND');
            const satKwKm = opts.satkerKeyword
                ? `AND (upper(coalesce(s.deskripsi,'')) LIKE ${addParam(`%${opts.satkerKeyword}%`)} OR upper(coalesce(km.nomor_lp,'')) LIKE ${addParam(`%${opts.satkerKeyword}%`)})`
                : '';
            const sql = `
                SELECT
                    km.id::bigint AS lp_id,
                    coalesce(nullif(btrim(km.nomor_lp),''), 'KM-' || km.id) AS no_laporan,
                    coalesce(to_char(km.tanggal_rilis,'DD-MM-YYYY'), nullif(btrim(km.tgl_lp::text),''), to_char(km.created_at,'DD-MM-YYYY')) AS tgl_laporan,
                    coalesce(upper(nullif(btrim(km.skala_viral),'')), 'KASUS MENONJOL') AS status_perkara,
                    km.satker_id::bigint AS satker_id,
                    coalesce(nullif(btrim(s.deskripsi),''), nullif(btrim(s.nama_singkat),''), 'POLRI') AS satker_nama,
                    coalesce(nullif(btrim(km.kategori),''), nullif(btrim(km.tindak_pidana),''), '-') AS kategori_kejahatan,
                    'KASUS_MENONJOL'::text AS peran_entitas,
                    'bdb_kasus_menonjol'::text AS sumber_tabel,
                    concat_ws(' | ', nullif(btrim(km.judul),''), nullif(btrim(km.tindak_pidana),''), nullif(btrim(km.tempat_kejadian),''), left(nullif(btrim(km.daftar_tersangka::text),''), 100)) AS detail_konteks,
                    nullif(btrim(km.judul),'') AS nama_tercatat,
                    NULL::text AS nik, NULL::text AS no_hp, nullif(btrim(km.tempat_kejadian),'') AS alamat
                FROM bdb_kasus_menonjol km
                LEFT JOIN bdb_satker s ON s.id = km.satker_id
                WHERE km.deleted_at IS NULL AND ${whereTokens} AND ${kmScope} ${satKwKm}
                ORDER BY km.id DESC
                LIMIT ${sampleCap}
            `;
            const rows = await this.dataSource.query(sql, params);
            if (!rows.length) return null;
            return {
                count: rows.length,
                records: rows.map((r: any) => this.mapGenericDiscoveryRow(r, 'bdb_kasus_menonjol', 'KASUS_MENONJOL'))
            };
        };

        // Branch 6: Arsip Pelimpahan LP (~2.5k rows)
        const queryPelimpahan = async (): Promise<{ count: number; records: CrossEntityMatchRecord[] } | null> => {
            const { params, addParam } = makeScopeHelpers();
            const pelScope = scopedIds
                ? `(pel.satker_asal_id = ANY(${addParam(scopedIds)}::bigint[]) OR pel.satker_tujuan_id = ANY(${addParam(scopedIds)}::bigint[]) OR coalesce(lp.unit_satker_id, lp.satker_id) = ANY(${addParam(scopedIds)}::bigint[]))`
                : '1=1';
            const expr = `upper(concat_ws(' ', pel.satker_asal_nama, pel.satker_tujuan_nama, pel.satker_eksternal_nama, pel.keterangan, pel.dilimpahkan_oleh_nama, pel.nomor_dokumen, lp.no_laporan))`;
            const whereTokens = this.buildMultiTokenWhere(expr, tokens, addParam, 'AND');
            const satKwPel = opts.satkerKeyword
                ? `AND (upper(coalesce(pel.satker_asal_nama,'')) LIKE ${addParam(`%${opts.satkerKeyword}%`)} OR upper(coalesce(pel.satker_tujuan_nama,'')) LIKE ${addParam(`%${opts.satkerKeyword}%`)})`
                : '';
            const sql = `
                SELECT
                    coalesce(pel.lp_id, pel.id)::bigint AS lp_id,
                    coalesce(nullif(btrim(lp.no_laporan),''), nullif(btrim(pel.nomor_dokumen),''), 'PELIMPAHAN-' || pel.id) AS no_laporan,
                    coalesce(to_char(pel.tanggal_dokumen,'DD-MM-YYYY'), to_char(pel.created_at,'DD-MM-YYYY')) AS tgl_laporan,
                    'DILIMPAHKAN'::text AS status_perkara,
                    coalesce(pel.satker_asal_id, lp.unit_satker_id, lp.satker_id)::bigint AS satker_id,
                    coalesce(nullif(btrim(pel.satker_asal_nama),''), nullif(btrim(lp.unit_satker_nama),''), 'POLRI') AS satker_nama,
                    coalesce(nullif(btrim(lp.kategori),''), 'PELIMPAHAN LP') AS kategori_kejahatan,
                    'PELIMPAHAN'::text AS peran_entitas,
                    'bdb_lp_pelimpahan'::text AS sumber_tabel,
                    concat_ws(' | ', 'Asal: ' || coalesce(pel.satker_asal_nama,'-'), 'Tujuan: ' || coalesce(pel.satker_tujuan_nama, pel.satker_eksternal_nama,'-'), nullif(btrim(pel.nomor_dokumen),''), left(nullif(btrim(pel.keterangan),''), 100)) AS detail_konteks,
                    nullif(btrim(pel.dilimpahkan_oleh_nama),'') AS nama_tercatat,
                    NULL::text AS nik, NULL::text AS no_hp, NULL::text AS alamat
                FROM bdb_lp_pelimpahan pel
                LEFT JOIN bdb_laporan_polisi lp ON lp.id = pel.lp_id AND lp.deleted_at IS NULL
                WHERE ${whereTokens} AND ${pelScope} ${satKwPel}
                ORDER BY pel.id DESC
                LIMIT ${sampleCap}
            `;
            const rows = await this.dataSource.query(sql, params);
            if (!rows.length) return null;
            return {
                count: rows.length,
                records: rows.map((r: any) => this.mapGenericDiscoveryRow(r, 'bdb_lp_pelimpahan', 'PELIMPAHAN'))
            };
        };

        // Branch 7: Operasi & Satgas (small table)
        const queryOperasiSatgas = async (): Promise<{ count: number; records: CrossEntityMatchRecord[] } | null> => {
            const params: any[] = [];
            const addParam = (val: any): string => {
                params.push(val);
                return `$${params.length}`;
            };
            let opScope = '1=1';
            if (scopedIds && scopeInfo) {
                const pIds = addParam(scopedIds);
                const kwCond = scopeInfo.nameKeywords.length
                    ? scopeInfo.nameKeywords
                          .slice(0, 8)
                          .map((kw) => `upper(coalesce(op.satker_penyelenggara,'')) LIKE ${addParam(`%${kw}%`)}`)
                          .join(' OR ')
                    : '1=0';
                opScope = `(op.id IN (SELECT DISTINCT lp.operasi_satgas_id FROM bdb_laporan_polisi lp WHERE lp.operasi_satgas_id IS NOT NULL AND coalesce(lp.unit_satker_id, lp.satker_id) = ANY(${pIds}::bigint[])) OR (${kwCond}))`;
            }
            const expr = `upper(concat_ws(' ', op.nama, op.jenis, op.jenis_kategori, op.nomor_dasar, op.satker_penyelenggara, op.pimpinan, op.deskripsi))`;
            const whereTokens = this.buildMultiTokenWhere(expr, tokens, addParam, 'AND');
            const sql = `
                SELECT
                    op.id::bigint AS lp_id,
                    coalesce(nullif(btrim(op.nomor_dasar),''), 'OPS-' || op.id) AS no_laporan,
                    coalesce(to_char(op.tanggal_mulai,'DD-MM-YYYY'), to_char(op.tanggal_dibentuk,'DD-MM-YYYY'), to_char(op.created_at,'DD-MM-YYYY')) AS tgl_laporan,
                    CASE WHEN op.is_aktif THEN 'AKTIF' ELSE 'NONAKTIF' END AS status_perkara,
                    NULL::bigint AS satker_id,
                    coalesce(nullif(btrim(op.satker_penyelenggara),''), 'POLRI') AS satker_nama,
                    coalesce(nullif(btrim(op.jenis_kategori),''), nullif(btrim(op.jenis),''), 'OPERASI/SATGAS') AS kategori_kejahatan,
                    'OPERASI_SATGAS'::text AS peran_entitas,
                    'bdb_operasi_satgas'::text AS sumber_tabel,
                    concat_ws(' | ', nullif(btrim(op.nama),''), nullif(btrim(op.pimpinan),''), left(nullif(btrim(op.deskripsi),''), 140)) AS detail_konteks,
                    nullif(btrim(op.nama),'') AS nama_tercatat,
                    NULL::text AS nik, NULL::text AS no_hp, NULL::text AS alamat
                FROM bdb_operasi_satgas op
                WHERE op.deleted_at IS NULL AND ${whereTokens} AND ${opScope}
                ORDER BY op.id DESC
                LIMIT ${sampleCap}
            `;
            const rows = await this.dataSource.query(sql, params);
            if (!rows.length) return null;
            return {
                count: rows.length,
                records: rows.map((r: any) => this.mapGenericDiscoveryRow(r, 'bdb_operasi_satgas', 'OPERASI_SATGAS'))
            };
        };

        // Branch 8: Kerma Master (small table)
        const queryKerma = async (): Promise<{ count: number; records: CrossEntityMatchRecord[] } | null> => {
            const params: any[] = [];
            const addParam = (val: any): string => {
                params.push(val);
                return `$${params.length}`;
            };
            let kermaScope = '1=1';
            if (scopedIds && scopeInfo) {
                kermaScope = scopeInfo.nameKeywords.length
                    ? `(${scopeInfo.nameKeywords
                          .slice(0, 8)
                          .map((kw) => `upper(concat_ws(' ', km.satker_terkait, km.sub_satker_terkait)) LIKE ${addParam(`%${kw}%`)}`)
                          .join(' OR ')})`
                    : '1=0';
            }
            const expr = `upper(concat_ws(' ', km.institusi, km.nomor_dokumen_mitra, km.nomor_dokumen_polri, km.jenis_naskah, km.tentang, km.satker_terkait, km.sub_satker_terkait, km.catatan))`;
            const whereTokens = this.buildMultiTokenWhere(expr, tokens, addParam, 'AND');
            const sql = `
                SELECT
                    km.id::bigint AS lp_id,
                    coalesce(nullif(btrim(km.nomor_dokumen_polri),''), nullif(btrim(km.nomor_dokumen_mitra),''), 'KERMA-' || km.id) AS no_laporan,
                    coalesce(to_char(km.tanggal_mulai,'DD-MM-YYYY'), km.tahun_data::text, to_char(km.created_at,'DD-MM-YYYY')) AS tgl_laporan,
                    coalesce(nullif(btrim(km.status),''), 'AKTIF') AS status_perkara,
                    NULL::bigint AS satker_id,
                    coalesce(nullif(btrim(km.satker_terkait),''), 'BARESKRIM/POLRI') AS satker_nama,
                    coalesce(nullif(btrim(km.jenis_naskah),''), 'KERMA / MoU') AS kategori_kejahatan,
                    'KERMA'::text AS peran_entitas,
                    'bdb_kerma_master'::text AS sumber_tabel,
                    concat_ws(' | ', nullif(btrim(km.institusi),''), left(nullif(btrim(km.tentang),''), 140)) AS detail_konteks,
                    nullif(btrim(km.institusi),'') AS nama_tercatat,
                    NULL::text AS nik, NULL::text AS no_hp, NULL::text AS alamat
                FROM bdb_kerma_master km
                WHERE km.deleted_at IS NULL AND ${whereTokens} AND ${kermaScope}
                ORDER BY km.id DESC
                LIMIT ${sampleCap}
            `;
            const rows = await this.dataSource.query(sql, params);
            if (!rows.length) return null;
            return {
                count: rows.length,
                records: rows.map((r: any) => this.mapGenericDiscoveryRow(r, 'bdb_kerma_master', 'KERMA'))
            };
        };

        const [manualRes, bbRes, lpRes, attrRes, kmRes, pelRes, opRes, kermaRes] = await Promise.all([
            queryManualTerlibat().catch(() => []),
            queryBarangBuktiGroup().catch(() => null),
            queryPerkaraLpGroup().catch(() => null),
            queryTerlibatAtribut().catch(() => null),
            queryKasusMenonjol().catch(() => null),
            queryPelimpahan().catch(() => null),
            queryOperasiSatgas().catch(() => null),
            queryKerma().catch(() => null)
        ]);

        const candidateGroups: Array<Omit<CoserseDiscoveryGroup, 'group_id'>> = [];
        if (lpRes && lpRes.records.length > 0) {
            candidateGroups.push({
                group_key: 'PERKARA_LP',
                label: 'Laporan Polisi & Uraian Perkara (TKP / Modus / Pasal)',
                source_table: 'bdb_laporan_polisi',
                total_count: lpRes.count,
                records: lpRes.records
            });
        }
        if (bbRes && bbRes.records.length > 0) {
            candidateGroups.push({
                group_key: 'BARANG_BUKTI',
                label: 'Barang Bukti & Kendaraan',
                source_table: 'bdb_dors_lp_barang_bukti',
                total_count: bbRes.count,
                records: bbRes.records
            });
        }
        if (attrRes && attrRes.records.length > 0) {
            candidateGroups.push({
                group_key: 'PIHAK_TERLIBAT_ATRIBUT',
                label: 'Atribut Pihak Terlibat (Pekerjaan / Alamat / Tempat Lahir)',
                source_table: 'bdb_dors_lp_terlibat',
                total_count: attrRes.count,
                records: attrRes.records
            });
        }
        if (kmRes && kmRes.records.length > 0) {
            candidateGroups.push({
                group_key: 'KASUS_MENONJOL',
                label: 'Kasus Menonjol',
                source_table: 'bdb_kasus_menonjol',
                total_count: kmRes.count,
                records: kmRes.records
            });
        }
        if (pelRes && pelRes.records.length > 0) {
            candidateGroups.push({
                group_key: 'PELIMPAHAN',
                label: 'Arsip Pelimpahan LP',
                source_table: 'bdb_lp_pelimpahan',
                total_count: pelRes.count,
                records: pelRes.records
            });
        }
        if (opRes && opRes.records.length > 0) {
            candidateGroups.push({
                group_key: 'OPERASI_SATGAS',
                label: 'Operasi & Satgas',
                source_table: 'bdb_operasi_satgas',
                total_count: opRes.count,
                records: opRes.records
            });
        }
        if (kermaRes && kermaRes.records.length > 0) {
            candidateGroups.push({
                group_key: 'KERMA',
                label: 'Kerja Sama (Kerma / MoU)',
                source_table: 'bdb_kerma_master',
                total_count: kermaRes.count,
                records: kermaRes.records
            });
        }

        const groups: CoserseDiscoveryGroup[] = candidateGroups.map((g, idx) => ({
            group_id: `Data ${String.fromCharCode(65 + idx)}`,
            ...g
        }));

        return {
            groups,
            bbRealCount: bbRes?.count || 0,
            extraRecords: manualRes
        };
    }

    private assembleDiscoveryResult(params: {
        primaryRecords: CrossEntityMatchRecord[];
        realAgg: { totalTerlibat: number; rolesBreakdown: Record<string, number> } | null;
        extraGroups: CoserseDiscoveryGroup[];
        bbRealCount: number;
        extraRecords: CrossEntityMatchRecord[];
        limit: number;
        offset: number;
        sortBy: 'RELEVANCE' | 'NEWEST' | 'OLDEST';
        selectedGroup?: string | null;
        selectedGroupKey?: string | null;
    }): {
        records: CrossEntityMatchRecord[];
        summary: CrossEntityProfileSummary;
        discoveryGroups: CoserseDiscoveryGroup[];
        activeGroup: string | null;
    } {
        const terlibatFromPrimary = [
            ...params.primaryRecords.filter((r) => r.sumber_tabel === 'bdb_dors_lp_terlibat'),
            ...params.extraRecords
        ];
        const bbFromPrimary = params.primaryRecords.filter((r) => r.sumber_tabel === 'bdb_dors_lp_barang_bukti');

        const baseSummary = this.buildSummary(params.primaryRecords);
        const manualExtraCount = params.extraRecords.length;
        const terlibatRealTotal =
            params.realAgg && params.realAgg.totalTerlibat > 0
                ? params.realAgg.totalTerlibat + manualExtraCount
                : terlibatFromPrimary.length;
        const bbRealTotal = Math.max(params.bbRealCount, bbFromPrimary.length);

        const rawGroups: Array<Omit<CoserseDiscoveryGroup, 'group_id'>> = [];
        if (terlibatFromPrimary.length > 0 || terlibatRealTotal > 0) {
            rawGroups.push({
                group_key: 'PIHAK_TERLIBAT',
                label: 'Pihak Terlibat (Nama / NIK / Kontak)',
                source_table: 'bdb_dors_lp_terlibat',
                total_count: Math.max(terlibatRealTotal, terlibatFromPrimary.length),
                breakdown: params.realAgg?.rolesBreakdown || baseSummary.roles_breakdown,
                records: this.sortMatchRecords(terlibatFromPrimary, params.sortBy)
            });
        }

        // Preserve order for extra groups (PERKARA_LP, BARANG_BUKTI, PIHAK_TERLIBAT_ATRIBUT, KASUS_MENONJOL, etc.)
        for (const g of params.extraGroups) {
            rawGroups.push({
                group_key: g.group_key,
                label: g.label,
                source_table: g.source_table,
                total_count: g.total_count,
                breakdown: g.breakdown,
                records: this.sortMatchRecords(g.records, params.sortBy)
            });
        }

        // Fallback if BARANG_BUKTI matched in primary but wasn't in extraGroups
        if (bbFromPrimary.length > 0 && !rawGroups.some((g) => g.group_key === 'BARANG_BUKTI')) {
            rawGroups.push({
                group_key: 'BARANG_BUKTI',
                label: 'Barang Bukti & Kendaraan',
                source_table: 'bdb_dors_lp_barang_bukti',
                total_count: bbRealTotal,
                records: this.sortMatchRecords(bbFromPrimary, params.sortBy)
            });
        }

        const discoveryGroups: CoserseDiscoveryGroup[] = rawGroups.map((g, idx) => ({
            group_id: `Data ${String.fromCharCode(65 + idx)}`,
            ...g
        }));

        const rolesBreakdown: Record<string, number> = {
            ...baseSummary.roles_breakdown,
            ...(params.realAgg?.rolesBreakdown || {})
        };
        const statusBreakdown: Record<string, number> = { ...baseSummary.status_breakdown };
        const satkerSet = new Set<string>(baseSummary.satkers_involved);
        for (const g of discoveryGroups) {
            if (g.group_key !== 'PIHAK_TERLIBAT') {
                rolesBreakdown[g.group_key] = g.total_count;
            }
            for (const r of g.records) {
                if (r.satker_nama) satkerSet.add(r.satker_nama);
                if (r.status_perkara && !statusBreakdown[r.status_perkara]) {
                    statusBreakdown[r.status_perkara] = 1;
                }
            }
        }

        const totalAcrossGroups = discoveryGroups.reduce((sum, g) => sum + Number(g.total_count || 0), 0);

        let matchedGroup: CoserseDiscoveryGroup | undefined;
        if (params.selectedGroupKey) {
            matchedGroup = discoveryGroups.find((g) => g.group_key === params.selectedGroupKey);
        }
        if (!matchedGroup && params.selectedGroup) {
            const wantUpper = params.selectedGroup.toUpperCase();
            matchedGroup = discoveryGroups.find(
                (g) => g.group_id.toUpperCase() === wantUpper || `KEY:${g.group_key}` === wantUpper
            );
        }

        let finalRecords: CrossEntityMatchRecord[];
        let activeGroup: string | null = null;
        let displayTotalRecords = Math.max(totalAcrossGroups, baseSummary.total_records);

        if (matchedGroup) {
            activeGroup = `${matchedGroup.group_id} (${matchedGroup.label})`;
            displayTotalRecords = matchedGroup.total_count;
            finalRecords = this.sortMatchRecords(matchedGroup.records, params.sortBy).slice(
                0,
                params.limit
            );
        } else {
            const mergedPool: CrossEntityMatchRecord[] = [...params.primaryRecords];
            const seenKeys = new Set(
                mergedPool.map((r) => `${r.lp_id}|${r.sumber_tabel}|${r.peran_entitas}|${r.detail_konteks.toUpperCase()}`)
            );
            for (const g of discoveryGroups) {
                for (const rec of g.records.slice(0, 6)) {
                    const k = `${rec.lp_id}|${rec.sumber_tabel}|${rec.peran_entitas}|${rec.detail_konteks.toUpperCase()}`;
                    if (!seenKeys.has(k)) {
                        seenKeys.add(k);
                        mergedPool.push(rec);
                    }
                }
            }
            finalRecords = this.sortMatchRecords(mergedPool, params.sortBy).slice(0, Math.max(params.limit, 25));
        }

        const summary: CrossEntityProfileSummary = {
            total_lp: Math.max(baseSummary.total_lp, terlibatRealTotal, ...discoveryGroups.map((g) => g.total_count), 0),
            total_records: displayTotalRecords,
            total_terlibat_matches: Math.max(baseSummary.total_terlibat_matches, terlibatRealTotal),
            total_barang_bukti_matches: Math.max(baseSummary.total_barang_bukti_matches, bbRealTotal),
            roles_breakdown: rolesBreakdown,
            status_breakdown: statusBreakdown,
            satkers_involved: Array.from(satkerSet)
        };

        return { records: finalRecords, summary, discoveryGroups, activeGroup };
    }

    private resolveFollowUpModifiers(rawMessage: string): {
        roleFilter: string | null;
        satkerKeyword: string | null;
        selectedGroup: string | null;
        sortBy: 'RELEVANCE' | 'NEWEST' | 'OLDEST' | null;
        exportFormat: CoserseExportFormat | null;
        isNextPage: boolean;
        isFollowUpRef: boolean;
    } {
        const msg = String(rawMessage || '').trim();

        let selectedGroup: string | null = null;
        const explicitGroupMatch = msg.match(/\b(?:data|grup|kelompok)\s+([a-z])\b/i);
        if (explicitGroupMatch && explicitGroupMatch[1]) {
            selectedGroup = `Data ${explicitGroupMatch[1].toUpperCase()}`;
        } else if (/\b(semua\s+(?:data|grup|kelompok)|tampilkan\s+semua(?:\s+konteks)?)\b/i.test(msg)) {
            selectedGroup = 'ALL';
        } else if (/\b(fokus|khusus|hanya|tampilkan|pilih|yang)\b/i.test(msg)) {
            if (/\bbarang\s+bukti\b/i.test(msg)) selectedGroup = 'KEY:BARANG_BUKTI';
            else if (/\bkasus\s+menonjol\b/i.test(msg)) selectedGroup = 'KEY:KASUS_MENONJOL';
            else if (/\bpelimpahan\b/i.test(msg)) selectedGroup = 'KEY:PELIMPAHAN';
            else if (/\b(operasi|satgas)\b/i.test(msg)) selectedGroup = 'KEY:OPERASI_SATGAS';
            else if (/\b(kerma|mou)\b/i.test(msg)) selectedGroup = 'KEY:KERMA';
            else if (/\bpihak\s+terlibat\b/i.test(msg)) selectedGroup = 'KEY:PIHAK_TERLIBAT';
        }

        let roleFilter: string | null = null;
        const roleMatch = msg.match(/\b(tersangka|terlapor|saksi|korban|pelapor|dpo)\b/i);
        if (
            roleMatch &&
            /\b(khusus|saja|aja|hanya|filter|peran|yang\s+(?:tersangka|terlapor|saksi|korban|pelapor|dpo)|tampilkan)\b/i.test(
                msg
            )
        ) {
            roleFilter = roleMatch[1].toUpperCase();
        }

        let satkerKeyword: string | null = null;
        const satMatch = msg.match(
            /\b(?:di\s+|wilayah\s+|satker\s+)?((?:polda|polres|polresta|polrestabes|polsek|bareskrim|dittipid\w+|ditres\w+|satreskrim|satlantas|satnarkoba)\s+[a-z0-9\s.]{2,35})/i
        );
        if (satMatch && satMatch[1]) {
            const rawSat = satMatch[1]
                .replace(/\b(untuk|pencarian|ini|saja|aja|doang|ya|bro|pak|tadi|urutkan|ekspor)\b.*$/i, '')
                .trim();
            const stripped = rawSat
                .replace(/^(?:polda|polres|polresta|polrestabes|polsek)\s+/i, '')
                .trim()
                .toUpperCase();
            if (stripped && !/^(SATKER|WILAYAH|DAERAH)$/i.test(stripped) && stripped.length >= 3) {
                satkerKeyword = stripped;
            }
        }

        let sortBy: 'RELEVANCE' | 'NEWEST' | 'OLDEST' | null = null;
        if (
            /\b(urut(?:kan)?(?:\s+dari)?(?:\s+yang)?\s+terbaru|dari\s+yang\s+terbaru|paling\s+baru)\b/i.test(msg)
        ) {
            sortBy = 'NEWEST';
        } else if (
            /\b(urut(?:kan)?(?:\s+dari)?(?:\s+yang)?\s+terlama|dari\s+yang\s+terlama|paling\s+lama|paling\s+awal)\b/i.test(
                msg
            )
        ) {
            sortBy = 'OLDEST';
        }

        let exportFormat: CoserseExportFormat | null = null;
        const hasExportVerb = /\b(ekspor|export|unduh|download|cetak|print|buatkan|bikin|bikinkan|jadikan|konversi|format|file|filenya|kirimkan)\b/i.test(
            msg
        );
        if (hasExportVerb || msg.length <= 50) {
            if (/\bpdf\b/i.test(msg)) exportFormat = 'pdf';
            else if (/\b(word|docx|doc)\b/i.test(msg)) exportFormat = 'docx';
            else if (/\b(ppt|pptx|power\s*point|powerpoint|presentasi|slide)\b/i.test(msg)) exportFormat = 'pptx';
            else if (/\b(excel|xlsx|xls|spreadsheet)\b/i.test(msg)) exportFormat = 'xlsx';
            else if (/\b(ekspor|export|unduh|download)\b/i.test(msg)) exportFormat = 'pdf';
        }

        const isNextPage = /\b(\d+\s+lp\s+berikutnya|lp\s+berikutnya|berikutnya|selanjutnya|halaman\s+berikutnya|lanjut(?:kan)?)\b/i.test(
            msg
        );
        const isFollowUpRef = Boolean(
            selectedGroup ||
                roleFilter ||
                satkerKeyword ||
                sortBy ||
                exportFormat ||
                isNextPage ||
                /\b(pencarian\s+ini|entitas\s+ini|orang\s+ini|data\s+tadi|data\s+ini|yang\s+tadi|dari\s+tadi|sebelumnya|barusan|sebaran\s+lp|rekap\s+sebaran|per\s+polda|per\s+satker)\b/i.test(
                    msg
                )
        );
        return { roleFilter, satkerKeyword, selectedGroup, sortBy, exportFormat, isNextPage, isFollowUpRef };
    }

    private async saveSessionSearchContext(
        ctxKey: string,
        userId: number | null,
        sessionId: string,
        state: SessionSearchContextState
    ): Promise<void> {
        const trimmedGroups = Array.isArray(state.lastGroups)
            ? state.lastGroups.map((g) => ({
                  ...g,
                  records: Array.isArray(g.records) ? g.records.slice(0, 15) : []
              }))
            : null;
        const persistedState: SessionSearchContextState = {
            ...state,
            lastGroups: trimmedGroups,
            lastRecords: Array.isArray(state.lastRecords) ? state.lastRecords.slice(0, 80) : null
        };
        this.sessionSearchContext.set(ctxKey, persistedState);

        if (!userId) return;
        try {
            await this.ensureChatPersistenceTables();
            await this.dataSource.query(
                `INSERT INTO bdb_coserse_sessions (id, user_id, title, search_context_json, created_at, updated_at)
                 VALUES ($1, $2, $3, $4::jsonb, NOW(), NOW())
                 ON CONFLICT (id) DO UPDATE
                 SET search_context_json = EXCLUDED.search_context_json,
                     updated_at = NOW()`,
                [
                    sessionId,
                    userId,
                    this.buildSessionTitleFromMessage(state.queryText || 'Obrolan Baru'),
                    JSON.stringify(persistedState)
                ]
            );
        } catch (err: any) {
            this.logger.warn(`Gagal persist search_context_json sesi ${sessionId}: ${err?.message || err}`);
        }
    }

    private async loadSessionSearchContext(
        ctxKey: string,
        userId: number | null,
        sessionId: string
    ): Promise<SessionSearchContextState | null> {
        const mem = this.sessionSearchContext.get(ctxKey);
        if (!userId) return mem && mem.queryText ? mem : null;
        try {
            await this.ensureChatPersistenceTables();
            const rows: Array<{ search_context_json: any }> = await this.dataSource.query(
                `SELECT search_context_json
                 FROM bdb_coserse_sessions
                 WHERE id = $1 AND user_id = $2
                 LIMIT 1`,
                [sessionId, userId]
            );
            const raw = rows?.[0]?.search_context_json;
            if (raw && typeof raw === 'object' && raw.queryText) {
                const dbState: SessionSearchContextState = raw;
                if (!mem || !mem.queryText || Number(dbState.updatedAt || 0) >= Number(mem.updatedAt || 0)) {
                    this.sessionSearchContext.set(ctxKey, dbState);
                    return dbState;
                }
                return mem;
            }
        } catch {
            // fallback to in-memory cache
        }
        return mem && mem.queryText ? mem : null;
    }

    private async buildExportFileCard(params: {
        format: CoserseExportFormat;
        sessionId: string;
        queryText: string;
        groupLabel: string;
        scopeMode: string;
        actor: ResolvedActor;
        summary: CrossEntityProfileSummary;
        discoveryGroups: CoserseDiscoveryGroup[];
        records: CrossEntityMatchRecord[];
        selectedGroup?: string | null;
    }): Promise<CoserseExportFileCard> {
        const generated = await generateCoserseExportBuffer({
            format: params.format,
            queryText: params.queryText,
            groupLabel: params.groupLabel,
            scopeMode: params.scopeMode,
            actorHandle: `@${params.actor.username.replace(/^@+/, '')}`,
            actorRole: params.actor.role,
            summary: params.summary,
            discoveryGroups: params.discoveryGroups,
            records: params.records
        });
        const qsParts = [
            `session_id=${encodeURIComponent(params.sessionId)}`,
            `format=${encodeURIComponent(params.format)}`
        ];
        if (params.selectedGroup) qsParts.push(`group=${encodeURIComponent(params.selectedGroup)}`);
        if (params.queryText) qsParts.push(`query=${encodeURIComponent(params.queryText)}`);
        return {
            export_id: `exp-${Date.now().toString(36)}`,
            filename: generated.filename,
            format: params.format,
            format_label: generated.formatLabel,
            mime_type: generated.mimeType,
            size_bytes: generated.buffer.length,
            size_text: formatBytesReadable(generated.buffer.length),
            total_records: params.summary?.total_records || params.records.length,
            group_label: params.groupLabel || 'Semua Kelompok Data',
            download_url: `/api/bdb/coserse/export?${qsParts.join('&')}`,
            created_at: new Date().toISOString()
        };
    }

    private async resolveSessionSearchExecution(params: {
        actor: ResolvedActor;
        authUser: any;
        input: CoserseChatRequestDto;
        sessionId: string;
        rawMessage: string;
        mods: ReturnType<CoserseService['resolveFollowUpModifiers']>;
        clientIp?: string;
    }): Promise<{
        profilingResult: CrossEntityProfileResponse | null;
        activeCtx: SessionSearchContextState | null;
        exportCard: CoserseExportFileCard | null;
        directExportReply: string | null;
    }> {
        const { actor, authUser, input, sessionId, rawMessage, mods, clientIp } = params;
        const disableProfiling =
            input?.include_profiling === false || String(input?.include_profiling || '').toLowerCase() === 'false';
        if (disableProfiling) {
            return { profilingResult: null, activeCtx: null, exportCard: null, directExportReply: null };
        }

        const forceProfiling =
            input?.include_profiling === true || String(input?.include_profiling || '').toLowerCase() === 'true';
        const ctxKey = `${actor.userId || actor.username}:${sessionId}`;
        const prevCtx = await this.loadSessionSearchContext(ctxKey, actor.userId, sessionId);

        let candidateText = String(input?.profile_query || rawMessage).trim();
        const parsedProbe = extractEntities({ query: candidateText });
        const hasExplicitProfilingCue =
            /\b(profil|profiling|lacak|telusuri|keterlibatan|riwayat|terlibat|cek\s+(?:orang|nama|subjek)|cari\s+(?:orang|nama|subjek|tersangka|terlapor|pelaku|saksi|kasus|perkara|data)|ada\s+berapa\s+lp|berapa\s+lp|memuat\s+informasi\s+terkait|terkait\s+(?:nama|saudara|sdr)?|atas\s+nama)\b/i.test(
                rawMessage
            );
        const isPureGreeting = /^(?:halo|hai|hi|hey|selamat\s+(?:pagi|siang|sore|malam)|terima\s*kasih|makasih|ok|oke|siap)[\s!?.]*$/i.test(
            rawMessage.trim()
        );
        const hasFreshTarget =
            parsedProbe.niks.length > 0 ||
            parsedProbe.phones.length > 0 ||
            parsedProbe.plates.length > 0 ||
            (parsedProbe.names.length > 0 && (hasExplicitProfilingCue || !isPureGreeting)) ||
            forceProfiling ||
            Boolean(input?.profile_query?.trim());

        const onlySatkerName = Boolean(
            mods.isFollowUpRef &&
                prevCtx &&
                mods.satkerKeyword &&
                parsedProbe.names.join(' ').toUpperCase() === mods.satkerKeyword
        );
        const isPureFollowUp = (!hasFreshTarget || onlySatkerName) && mods.isFollowUpRef && Boolean(prevCtx);

        // Handle export request when session has no active search context yet
        if (mods.exportFormat && !hasFreshTarget && !prevCtx) {
            const handle = `@${actor.username.replace(/^@+/, '')}`;
            return {
                profilingResult: null,
                activeCtx: null,
                exportCard: null,
                directExportReply: `Siap ${handle}, belum ada hasil penelusuran data pada sesi ini untuk diekspor. Silakan lakukan pencarian terlebih dahulu (misal nama, NIK, nomor LP, atau kata kunci perkara), lalu klik atau ketik perintah ekspor **PDF / Word / PPT / Excel**.`
            };
        }

        let activeCtx: SessionSearchContextState | null = null;
        if (isPureFollowUp && prevCtx) {
            candidateText = prevCtx.queryText;
            let nextSelectedGroup = prevCtx.selectedGroup || null;
            let nextSelectedGroupKey = prevCtx.selectedGroupKey || null;
            if (mods.selectedGroup === 'ALL') {
                nextSelectedGroup = null;
                nextSelectedGroupKey = null;
            } else if (mods.selectedGroup) {
                const want = mods.selectedGroup.toUpperCase();
                const matchedPrev = prevCtx.lastGroups?.find(
                    (g) => g.group_id.toUpperCase() === want || `KEY:${g.group_key}` === want
                );
                nextSelectedGroup = matchedPrev ? matchedPrev.group_id : mods.selectedGroup;
                nextSelectedGroupKey = matchedPrev
                    ? matchedPrev.group_key
                    : mods.selectedGroup.startsWith('KEY:')
                    ? mods.selectedGroup.slice(4)
                    : null;
            } else if (mods.roleFilter && nextSelectedGroupKey && nextSelectedGroupKey !== 'PIHAK_TERLIBAT') {
                nextSelectedGroup = null;
                nextSelectedGroupKey = null;
            }

            const switchedToNonTerlibat = Boolean(
                mods.selectedGroup && nextSelectedGroupKey && nextSelectedGroupKey !== 'PIHAK_TERLIBAT'
            );
            activeCtx = {
                queryText: prevCtx.queryText,
                roleFilter:
                    mods.roleFilter !== null
                        ? mods.roleFilter
                        : switchedToNonTerlibat
                        ? null
                        : prevCtx.roleFilter || null,
                satkerKeyword: mods.satkerKeyword !== null ? mods.satkerKeyword : prevCtx.satkerKeyword || null,
                selectedGroup: nextSelectedGroup,
                selectedGroupKey: nextSelectedGroupKey,
                sortBy: mods.sortBy || prevCtx.sortBy || 'RELEVANCE',
                offset: mods.isNextPage ? (prevCtx.offset || 0) + 15 : mods.selectedGroup && !mods.isNextPage ? 0 : 0,
                updatedAt: Date.now()
            };
        } else if (hasFreshTarget) {
            activeCtx = {
                queryText: candidateText,
                roleFilter: mods.roleFilter,
                satkerKeyword: mods.satkerKeyword,
                selectedGroup: mods.selectedGroup === 'ALL' ? null : mods.selectedGroup,
                selectedGroupKey:
                    mods.selectedGroup && mods.selectedGroup.startsWith('KEY:') ? mods.selectedGroup.slice(4) : null,
                sortBy: mods.sortBy || 'RELEVANCE',
                offset: mods.isNextPage ? (prevCtx?.offset || 0) + 15 : 0,
                updatedAt: Date.now()
            };
        }

        let profilingResult: CrossEntityProfileResponse | null = null;
        const wantsRichExport = Boolean(mods.exportFormat);
        const queryLimit = wantsRichExport ? 100 : input?.limit !== undefined ? Math.min(Math.max(Number(input.limit) || 20, 1), 50) : 20;

        if (activeCtx) {
            if (actor.isBlockedRole) {
                throw new ForbiddenException(
                    `Maaf @${actor.username.replace(/^@+/, '')}, role "${actor.role}" tidak memiliki izin melakukan penelusuran/profiling entitas perkara.`
                );
            }

            // Fast export reuse when user purely says "ekspor PDF dari data tadi" with no filter change
            const hasFilterChange = Boolean(
                mods.selectedGroup || mods.roleFilter || mods.satkerKeyword || mods.sortBy || mods.isNextPage
            );
            if (
                isPureFollowUp &&
                wantsRichExport &&
                !hasFilterChange &&
                prevCtx?.lastSummary &&
                Array.isArray(prevCtx.lastRecords) &&
                prevCtx.lastRecords.length > 0
            ) {
                const scopeModeStr: 'NATIONAL' | 'SATKER_SUBTREE' = actor.isNational ? 'NATIONAL' : 'SATKER_SUBTREE';
                const focusedGroup =
                    activeCtx.selectedGroupKey && prevCtx.lastGroups
                        ? prevCtx.lastGroups.find((g) => g.group_key === activeCtx!.selectedGroupKey)
                        : activeCtx.selectedGroup && prevCtx.lastGroups
                        ? prevCtx.lastGroups.find((g) => g.group_id.toUpperCase() === activeCtx!.selectedGroup!.toUpperCase())
                        : null;
                const exportRecords = focusedGroup ? focusedGroup.records : prevCtx.lastRecords;
                const exportLabel = focusedGroup
                    ? `${focusedGroup.group_id} (${focusedGroup.label})`
                    : activeCtx.selectedGroup || 'Semua Kelompok Data';
                const card = await this.buildExportFileCard({
                    format: mods.exportFormat!,
                    sessionId,
                    queryText: activeCtx.queryText,
                    groupLabel: exportLabel,
                    scopeMode: scopeModeStr,
                    actor,
                    summary: prevCtx.lastSummary,
                    discoveryGroups: prevCtx.lastGroups || [],
                    records: exportRecords,
                    selectedGroup: activeCtx.selectedGroup
                });
                const handle = `@${actor.username.replace(/^@+/, '')}`;
                const fakeProf: CrossEntityProfileResponse = {
                    status: 1,
                    query: { raw: activeCtx.queryText, detected_type: 'MIXED', niks: [], phones: [], names: [activeCtx.queryText], keywords: [activeCtx.queryText] },
                    scope: { role: actor.role, mode: scopeModeStr, satker_id: actor.satkerId },
                    summary: prevCtx.lastSummary,
                    records: exportRecords,
                    discovery_groups: prevCtx.lastGroups || [],
                    active_group: focusedGroup ? exportLabel : null,
                    narrative_summary: '',
                    performance: { elapsed_ms: 1, query_ms: 0, target_ms: TARGET_LATENCY_MS, within_target: true, indexes_ready: true },
                    disclaimer: COSERSE_DISCLAIMER
                };
                return {
                    profilingResult: fakeProf,
                    activeCtx,
                    exportCard: card,
                    directExportReply: `Siap ${handle}, file **${card.format_label} (.${card.format})** untuk pencarian *"${activeCtx.queryText}"* (${exportLabel}, **${card.total_records.toLocaleString('id-ID')}** total temuan DB / ${exportRecords.length} baris sampel terlampir, ukuran **${card.size_text}**) sudah selesai dibuat.\n\nSilakan klik tombol **Download File ${card.format_label}** di bawah ini.`
                };
            }

            if (extractEntities({ query: activeCtx.queryText }).names.length > 0 || extractEntities({ query: activeCtx.queryText }).niks.length > 0 || extractEntities({ query: activeCtx.queryText }).phones.length > 0 || extractEntities({ query: activeCtx.queryText }).plates.length > 0) {
                profilingResult = await this.profilePersonInvolvement(
                    authUser,
                    {
                        query: activeCtx.queryText,
                        satker_id: input?.satker_id,
                        limit: queryLimit,
                        ai_narrative: false,
                        role_filter: activeCtx.roleFilter,
                        satker_keyword: activeCtx.satkerKeyword,
                        selected_group: activeCtx.selectedGroup,
                        selected_group_key: activeCtx.selectedGroupKey,
                        sort_by: activeCtx.sortBy,
                        offset: activeCtx.offset
                    } as any,
                    clientIp
                );
            }
        }

        if (!profilingResult || profilingResult.records.length === 0 || /\bLP\s*\/\s*[AB]\s*\//i.test(rawMessage)) {
            const lpEvidence = await this.lookupAnalyticalCaseEvidence(actor, activeCtx?.queryText || rawMessage);
            if (lpEvidence && (lpEvidence.records.length > 0 || !profilingResult)) {
                profilingResult = lpEvidence;
            }
        }

        if (profilingResult) {
            const nextState: SessionSearchContextState = {
                queryText: activeCtx?.queryText || profilingResult.query.raw || rawMessage,
                roleFilter: activeCtx?.roleFilter || null,
                satkerKeyword: activeCtx?.satkerKeyword || null,
                selectedGroup: activeCtx?.selectedGroup || null,
                selectedGroupKey:
                    activeCtx?.selectedGroupKey ||
                    (profilingResult.active_group && profilingResult.discovery_groups?.find((g) => profilingResult!.active_group!.startsWith(g.group_id))?.group_key) ||
                    null,
                sortBy: activeCtx?.sortBy || 'RELEVANCE',
                offset: activeCtx?.offset || 0,
                updatedAt: Date.now(),
                lastSummary: profilingResult.summary,
                lastGroups: profilingResult.discovery_groups || [],
                lastRecords: profilingResult.records
            };
            activeCtx = nextState;
            await this.saveSessionSearchContext(ctxKey, actor.userId, sessionId, nextState);
        }

        let exportCard: CoserseExportFileCard | null = null;
        let directExportReply: string | null = null;
        if (mods.exportFormat && profilingResult) {
            exportCard = await this.buildExportFileCard({
                format: mods.exportFormat,
                sessionId,
                queryText: activeCtx?.queryText || profilingResult.query.raw || rawMessage,
                groupLabel: profilingResult.active_group || 'Semua Kelompok Data',
                scopeMode: profilingResult.scope.mode,
                actor,
                summary: profilingResult.summary,
                discoveryGroups: profilingResult.discovery_groups || [],
                records: profilingResult.records,
                selectedGroup: activeCtx?.selectedGroup
            });
            if (isPureFollowUp) {
                const handle = `@${actor.username.replace(/^@+/, '')}`;
                directExportReply = `Siap ${handle}, file **${exportCard.format_label} (.${exportCard.format})** untuk pencarian *"${activeCtx?.queryText || profilingResult.query.raw}"* (${exportCard.group_label}, **${exportCard.total_records.toLocaleString('id-ID')}** total data DB / ${profilingResult.records.length} baris terlampir, ukuran **${exportCard.size_text}**) berhasil dibuat.\n\nSilakan klik tombol **Download File ${exportCard.format_label}** di bawah ini.`;
            }
        }

        return { profilingResult, activeCtx, exportCard, directExportReply };
    }

    private buildFollowUpActions(
        actor: ResolvedActor,
        profilingResult: CrossEntityProfileResponse | null,
        activeCtx?: {
            roleFilter?: string | null;
            satkerKeyword?: string | null;
            selectedGroup?: string | null;
            sortBy?: string | null;
            offset?: number;
        } | null
    ): Array<{ id: string; label: string; prompt: string }> {
        if (!profilingResult || actor.isBlockedRole || actor.role === 'testing') {
            return [];
        }
        const groups = Array.isArray(profilingResult.discovery_groups) ? profilingResult.discovery_groups : [];
        if (profilingResult.summary.total_records <= 0 && groups.length === 0) {
            return [];
        }

        const actions: Array<{ id: string; label: string; prompt: string }> = [];

        if (groups.length >= 2 && !activeCtx?.selectedGroup) {
            groups.slice(0, 3).forEach((g) => {
                actions.push({
                    id: `focus-${g.group_id.toLowerCase().replace(/\s+/g, '-')}`,
                    label: `📂 Fokus ${g.group_id} (${Number(g.total_count || 0).toLocaleString('id-ID')})`,
                    prompt: `Tampilkan yang ${g.group_id} saja`
                });
            });
        } else if (activeCtx?.selectedGroup && groups.length >= 2) {
            actions.push({
                id: 'focus-all',
                label: '📚 Semua Kelompok Data',
                prompt: 'Tampilkan semua kelompok data untuk pencarian ini'
            });
        }

        if (activeCtx?.roleFilter !== 'TERSANGKA' && (Number(profilingResult.summary.roles_breakdown?.TERSANGKA || 0) > 0 || profilingResult.summary.total_terlibat_matches > 0)) {
            actions.push({
                id: 'filter-tersangka',
                label: '🔍 Filter Khusus Tersangka',
                prompt: 'Tampilkan khusus peran Tersangka untuk pencarian ini'
            });
        }
        if (activeCtx?.roleFilter !== 'TERLAPOR' && Number(profilingResult.summary.roles_breakdown?.TERLAPOR || 0) > 0) {
            actions.push({
                id: 'filter-terlapor',
                label: '🔍 Filter Khusus Terlapor',
                prompt: 'Tampilkan khusus peran Terlapor untuk pencarian ini'
            });
        }
        if (activeCtx?.sortBy !== 'NEWEST') {
            actions.push({
                id: 'sort-newest',
                label: '🕒 Urutkan Terbaru',
                prompt: 'Urutkan dari yang terbaru untuk pencarian ini'
            });
        }
        actions.push({
            id: 'export-pdf',
            label: '⬇️ Ekspor PDF',
            prompt: 'Ekspor ke file PDF dari data tadi'
        });
        actions.push({
            id: 'export-excel',
            label: '📊 Ekspor Excel',
            prompt: 'Ekspor ke file Excel dari data tadi'
        });

        const shownUntil = (activeCtx?.offset || 0) + 15;
        if (profilingResult.summary.total_records > shownUntil && actions.length < 6) {
            actions.push({
                id: 'next-15',
                label: '➡️ 15 Data Berikutnya',
                prompt: 'Tampilkan 15 LP berikutnya untuk pencarian ini'
            });
        }
        return actions.slice(0, 6);
    }

    async exportSessionSearchResults(authUser: any, rawParams: any, res: any, clientIp?: string) {
        const actor = await this.resolveActor(authUser);
        if (!actor.userId) {
            throw new ForbiddenException('Identitas pengguna tidak valid untuk mengekspor data.');
        }
        this.assertNotTestingReadOnly(actor, 'mengekspor data pencarian Coserse ke file');
        this.assertFeatureAccess(actor);
        if (actor.isBlockedRole) {
            throw new ForbiddenException(`Role "${actor.role}" tidak diizinkan mengekspor data perkara.`);
        }

        const format = normalizeExportFormat(rawParams?.format);
        const sessionId = this.quotaService
            ? this.quotaService.sanitizeSessionId(rawParams?.session_id)
            : String(rawParams?.session_id || 'default').trim() || 'default';
        const ctxKey = `${actor.userId || actor.username}:${sessionId}`;
        const prevCtx = await this.loadSessionSearchContext(ctxKey, actor.userId, sessionId);

        const explicitQuery = String(rawParams?.query || '').trim();
        const targetQuery = explicitQuery || prevCtx?.queryText || '';
        if (!targetQuery) {
            throw new BadRequestException('Tidak ada konteks pencarian aktif untuk diekspor.');
        }

        const requestedGroup = rawParams?.group ? String(rawParams.group).trim() : prevCtx?.selectedGroup || null;
        const requestedGroupKey = requestedGroup && prevCtx?.lastGroups
            ? prevCtx.lastGroups.find(
                  (g) => g.group_id.toUpperCase() === requestedGroup.toUpperCase() || `KEY:${g.group_key}` === requestedGroup.toUpperCase()
              )?.group_key || prevCtx.selectedGroupKey || null
            : prevCtx?.selectedGroupKey || null;

        let summary: CrossEntityProfileSummary | null = null;
        let discoveryGroups: CoserseDiscoveryGroup[] = [];
        let records: CrossEntityMatchRecord[] = [];
        let scopeMode: 'NATIONAL' | 'SATKER_SUBTREE' = actor.isNational ? 'NATIONAL' : 'SATKER_SUBTREE';
        let activeGroupLabel = requestedGroup || 'Semua Kelompok Data';

        const parsedCheck = extractEntities({ query: targetQuery });
        if (parsedCheck.names.length > 0 || parsedCheck.niks.length > 0 || parsedCheck.phones.length > 0 || parsedCheck.plates.length > 0) {
            const prof = await this.profilePersonInvolvement(
                authUser,
                {
                    query: targetQuery,
                    limit: 100,
                    ai_narrative: false,
                    role_filter: rawParams?.role_filter || prevCtx?.roleFilter || null,
                    satker_keyword: rawParams?.satker_keyword || prevCtx?.satkerKeyword || null,
                    selected_group: requestedGroup,
                    selected_group_key: requestedGroupKey,
                    sort_by: rawParams?.sort_by || prevCtx?.sortBy || 'RELEVANCE',
                    offset: 0
                } as any,
                clientIp
            );
            summary = prof.summary;
            discoveryGroups = prof.discovery_groups || [];
            records = prof.records;
            scopeMode = prof.scope.mode;
            activeGroupLabel = prof.active_group || activeGroupLabel;
        } else if (prevCtx?.lastRecords?.length) {
            summary = prevCtx.lastSummary || this.buildSummary(prevCtx.lastRecords);
            discoveryGroups = prevCtx.lastGroups || [];
            records = prevCtx.lastRecords;
        } else {
            const lpEv = await this.lookupAnalyticalCaseEvidence(actor, targetQuery);
            if (!lpEv) {
                throw new BadRequestException('Data hasil pencarian tidak ditemukan untuk diekspor.');
            }
            summary = lpEv.summary;
            discoveryGroups = lpEv.discovery_groups || [];
            records = lpEv.records;
            scopeMode = lpEv.scope.mode;
        }

        const generated = await generateCoserseExportBuffer({
            format,
            queryText: targetQuery,
            groupLabel: activeGroupLabel,
            scopeMode,
            actorHandle: `@${actor.username.replace(/^@+/, '')}`,
            actorRole: actor.role,
            summary: summary || this.buildSummary(records),
            discoveryGroups,
            records
        });

        await this.audit.log({
            userId: actor.userId,
            userName: `@${actor.username.replace(/^@+/, '')}`,
            action: 'COSERSE_EXPORT',
            entity: format.toUpperCase(),
            entityId: sessionId,
            meta: {
                filename: generated.filename,
                format,
                size_bytes: generated.buffer.length,
                total_records: summary?.total_records || records.length,
                exported_rows: records.length,
                group_label: activeGroupLabel,
                query: targetQuery.slice(0, 120)
            },
            ip: clientIp,
            outcome: 'SUCCESS'
        });

        res.setHeader('Content-Type', generated.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${generated.filename}"`);
        res.setHeader('Content-Length', String(generated.buffer.length));
        res.setHeader('Cache-Control', 'no-store');
        res.send(generated.buffer);
    }

    private assertSuperadmin(actor: { role?: string }): void {
        if (String(actor?.role || '').toLowerCase() !== 'superadmin') {
            throw new ForbiddenException('Hanya role Superadmin yang diizinkan mengelola instruksi & kerangka jawaban Coserse.');
        }
    }

    async listInstructions(authUser: any) {
        const actor = await this.resolveActor(authUser);
        this.assertSuperadmin(actor);
        const rows = await this.dataSource.query(
            `SELECT id, title, category, content, created_by_user_id, is_active, created_at, updated_at
             FROM bdb_coserse_instructions
             ORDER BY is_active DESC, id DESC`
        );
        return { status: 1, data: rows };
    }

    async createInstruction(authUser: any, body: any) {
        const actor = await this.resolveActor(authUser);
        this.assertSuperadmin(actor);
        const content = String(body?.content || '').trim();
        if (!content) throw new BadRequestException('Konten instruksi tidak boleh kosong.');
        const category = ['rule', 'template', 'knowledge'].includes(String(body?.category || '').toLowerCase())
            ? String(body.category).toLowerCase()
            : 'rule';
        const title = String(body?.title || content.slice(0, 60)).trim();
        const isActive = body?.is_active !== undefined ? Boolean(body.is_active) : true;
        const rows = await this.dataSource.query(
            `INSERT INTO bdb_coserse_instructions (title, category, content, created_by_user_id, is_active)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, title, category, content, created_by_user_id, is_active, created_at, updated_at`,
            [title, category, content, actor.userId || null, isActive]
        );
        this.instructionsCache = null;
        return { status: 1, data: rows[0] };
    }

    async updateInstruction(authUser: any, id: number, body: any) {
        const actor = await this.resolveActor(authUser);
        this.assertSuperadmin(actor);
        if (!Number.isFinite(id) || id <= 0) throw new BadRequestException('ID instruksi tidak valid.');
        const fields: string[] = [];
        const params: any[] = [];
        if (body?.title !== undefined) {
            params.push(String(body.title).trim());
            fields.push(`title = $${params.length}`);
        }
        if (body?.category !== undefined && ['rule', 'template', 'knowledge'].includes(String(body.category).toLowerCase())) {
            params.push(String(body.category).toLowerCase());
            fields.push(`category = $${params.length}`);
        }
        if (body?.content !== undefined) {
            params.push(String(body.content).trim());
            fields.push(`content = $${params.length}`);
        }
        if (body?.is_active !== undefined) {
            params.push(Boolean(body.is_active));
            fields.push(`is_active = $${params.length}`);
        }
        if (!fields.length) throw new BadRequestException('Tidak ada field yang diperbarui.');
        fields.push(`updated_at = NOW()`);
        params.push(id);
        const rows = await this.dataSource.query(
            `UPDATE bdb_coserse_instructions SET ${fields.join(', ')} WHERE id = $${params.length}
             RETURNING id, title, category, content, created_by_user_id, is_active, created_at, updated_at`,
            params
        );
        this.instructionsCache = null;
        return { status: 1, data: rows[0] || null };
    }

    async deleteInstruction(authUser: any, id: number) {
        const actor = await this.resolveActor(authUser);
        this.assertSuperadmin(actor);
        if (!Number.isFinite(id) || id <= 0) throw new BadRequestException('ID instruksi tidak valid.');
        await this.dataSource.query(`DELETE FROM bdb_coserse_instructions WHERE id = $1`, [id]);
        this.instructionsCache = null;
        return { status: 1, deleted: true, id };
    }

    async getActiveInstructionsText(): Promise<string> {
        if (this.instructionsCache && this.instructionsCache.expiresAt > Date.now()) {
            return this.instructionsCache.text;
        }
        try {
            const rows = await this.dataSource.query(
                `SELECT id, category, title, content FROM bdb_coserse_instructions WHERE is_active = TRUE ORDER BY id DESC LIMIT 20`
            );
            const text = rows.length
                ? rows.map((r: any, idx: number) => `${idx + 1}. [${String(r.category || 'rule').toUpperCase()}] ${r.content}`).join('\n')
                : '';
            this.instructionsCache = { expiresAt: Date.now() + 30_000, text };
            return text;
        } catch {
            return '';
        }
    }

    private async tryHandlePendingBatchChatCommand(
        actor: ResolvedActor,
        authUser: any,
        handle: string,
        rawMessage: string,
        clientIp?: string
    ): Promise<string | null> {
        if (!this.docParser || !actor.userId) return null;
        const pending = this.docParser.getPendingBatchForUser(actor.userId);
        if (!pending) return null;

        const text = String(rawMessage || '').trim();
        if (!text) return null;

        if (/\b(batal|cancel|tidak\s*jadi|ga\s*jadi|gak\s*jadi)\b/i.test(text)) {
            this.docParser.clearPendingBatchForUser(actor.userId);
            return `Siap ${handle}, rencana update massal (**${pending.items.length} baris**) sudah saya batalkan. Tidak ada perubahan yang disimpan ke database.`;
        }

        const isConfirm = /\b(oke|ok|jalan|lanjut|proses|eksekusi|terapkan|gas|setuju|ya)\b/i.test(text);
        if (!isConfirm) return null;

        // Parse inline correction: "LP/... ganti jadi P21"
        const corrMatch = text.match(/(LP\s*\/\s*[AB]\s*\/[^\s,;)]+)\s+(?:ganti|ubah|set)\s+(?:jadi|ke)\s+([A-Za-z0-9_\-\s]+)/i);
        if (corrMatch) {
            const targetLpCompact = corrMatch[1].replace(/\s+/g, '').toUpperCase();
            const rawSt = corrMatch[2].toUpperCase().replace(/[^A-Z0-9]/g, '');
            const mapSt: Record<string, string> = {
                TAHAP2: 'TAHAP_II', TAHAPII: 'TAHAP_II', TAHAP1: 'TAHAP_I', TAHAPI: 'TAHAP_I',
                P21: 'P21', P19: 'P19', SPDP: 'SPDP', SIDIK: 'SIDIK', LIDIK: 'LIDIK',
                SP3: 'SP3', SP2LID: 'SP2_LID', PERMA: 'PERMA'
            };
            const mapped = mapSt[rawSt];
            if (mapped) {
                for (const it of pending.items) {
                    const key = String(it.no_laporan_db || it.nomor_lp || '').replace(/\s+/g, '').toUpperCase();
                    if (key === targetLpCompact && it.lp_id) {
                        it.status_baru = mapped;
                        it.selected = true;
                        it.skip_reason = null;
                    }
                }
            }
        }

        const toCommit = pending.items
            .filter((i) => i.action === 'UPDATE' && i.selected !== false && i.lp_id)
            .map((i) => ({
                lp_id: Number(i.lp_id),
                nomor_lp: String(i.no_laporan_db || i.nomor_lp),
                status_baru: i.status_baru,
                tanggal_selra: i.tanggal_selra,
                alasan: i.alasan
            }));

        if (toCommit.length === 0) {
            return `Siap ${handle}, tidak ada LP yang memenuhi syarat untuk dieksekusi pada batch ini.`;
        }

        const res = await this.docParser.commitBatchUpdateLp(
            authUser,
            { batch_id: pending.batch_id, operator_confirmed: true, items: toCommit },
            clientIp
        );
        this.docParser.clearPendingBatchForUser(actor.userId);
        return res?.assistant_message || `Siap ${handle}, **${toCommit.length} LP** berhasil diperbarui ke database.`;
    }

    /**
     * Guard wajib sebelum memanggil tool DB / LLM untuk permintaan atau pertanyaan update status LP
     * yang TIDAK menyebutkan Nomor LP spesifik. Mencegah halusinasi nomor LP dummy (POLDA A / POLRES DUMMY)
     * maupun pemanggilan tool DB yang tidak perlu.
     */
    private tryHandleLpUpdateWithoutNumberGuard(handle: string, rawMessage: string): string | null {
        const text = String(rawMessage || '').trim();
        if (!text) return null;
        if (/\bLP\s*\/?\s*[AB]\s*\//i.test(text) || /\bLP\/\d+/i.test(text)) return null;
        const mentionsUpdateAction = /\b(update|ubah|ganti|naikkan|turunkan|perbarui|rubah|set)\b/i.test(text);
        const mentionsLpOrStatus = /\b(status\s+lp|status\s+perkara|lp|laporan\s+polisi)\b/i.test(text);
        if (!mentionsUpdateAction || !mentionsLpOrStatus) return null;
        const isCapabilityQuestion =
            /\b(bisa|dapat|mampu|gimana|bagaimana|cara|apakah|boleh|gak|ga|nggak|tidak)\b/i.test(text) ||
            text.endsWith('?');
        if (isCapabilityQuestion) {
            return (
                `Bisa ${handle}! Saya bisa membantu memperbarui status Laporan Polisi (Lidik, Sidik, SPDP, Tahap I, P-19, P-21, Tahap II, hingga SP3/RJ).\n\n` +
                `Silakan sebutkan **Nomor LP** dan **status targetnya** (atau unggah dokumen mindik \`.docx\`/\`.pdf\`/gambar). Sebelum tersimpan ke database, sistem akan menampilkan kartu konfirmasi interaktif untuk Anda setujui terlebih dahulu.`
            );
        }
        return (
            `Siap ${handle}, untuk memproses pembaruan status, saya belum melihat **Nomor LP** yang dimaksud.\n\n` +
            `Mohon sebutkan **Nomor LP lengkap** beserta **status targetnya** (atau unggah dokumen mindik \`.docx\`/\`.pdf\`/gambar) agar saya dapat menyiapkan kartu konfirmasi sebelum disimpan ke database.`
        );
    }

    async tryHandleSuperadminInstructionCommand(actor: { role?: string; userId?: number | null }, rawMessage: string): Promise<string | null> {
        if (String(actor?.role || '').toLowerCase() !== 'superadmin') return null;
        const msg = String(rawMessage || '').trim();
        const m = msg.match(
            /^(?:tolong\s+|mohon\s+|harap\s+)?(?:simpan\s+(?:aturan|kerangka(?:\s+jawaban)?|instruksi|template)|ingat\s+(?:aturan|kerangka(?:\s+jawaban)?(?:\s+ini)?|instruksi)|latih|ajarkan)\s*[:\-]?\s*(.+)$/is
        );
        if (!m || !m[1] || m[1].trim().length < 5) return null;
        const content = m[1].trim();
        const category = /kerangka|template/i.test(msg) ? 'template' : 'rule';
        const title = content.slice(0, 60);
        const rows = await this.dataSource.query(
            `INSERT INTO bdb_coserse_instructions (title, category, content, created_by_user_id, is_active)
             VALUES ($1, $2, $3, $4, TRUE)
             RETURNING id, category, title`,
            [title, category, content, actor.userId || null]
        );
        this.instructionsCache = null;
        const saved = rows[0];
        return `Siap, aturan/kerangka (${saved?.category || category}) #${saved?.id || ''} sudah tersimpan dan aktif untuk seluruh sesi Coserse:\n\n> ${content}`;
    }
}
