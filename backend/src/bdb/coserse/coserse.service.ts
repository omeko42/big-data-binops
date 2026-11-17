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
    CoserseParsedEntities,
    CoserseQuotaSnapshot,
    CoserseTokenBoostRequestDto,
    CrossEntityMatchRecord,
    CrossEntityProfileResponse,
    CrossEntityProfileSummary,
    ProfilePersonRequestDto
} from './dto/profile-query.dto';
import { detectPromptInjection, extractEntities } from './entity-extractor';

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
        @Optional() private readonly knowledgeService?: CoserseKnowledgeService
    ) {}

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

        // 6. Execute Fast Indexed Cross-Entity SQL Query
        const branchLimit = Math.max(1, Math.min(100, Number(input?.limit) || 25));
        const queryStartedAt = Date.now();
        let rows: any[] = [];
        try {
            const { sql, params } = this.buildCrossEntitySql(parsed, {
                isNational: actor.isNational && !effectiveSatkerId,
                satkerId: effectiveSatkerId,
                limit: branchLimit
            });
            rows = await this.dataSource.query(sql, params);
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
        const queryMs = Date.now() - queryStartedAt;

        const records = this.mapAndDedupeRecords(rows);
        const summary = this.buildSummary(records);
        let narrativeSummary = this.formatNarrativeSummary(parsed, summary, records);
        let aiEngineMeta: CrossEntityProfileResponse['ai_engine'] = undefined;

        const baseResponse: CrossEntityProfileResponse = {
            status: 1,
            query: {
                raw: parsed.sanitizedQuery,
                detected_type: parsed.detectedType,
                niks: parsed.niks,
                phones: parsed.phones,
                names: parsed.names,
                keywords: parsed.keywords
            },
            scope: {
                role: actor.role,
                mode: actor.isNational && !effectiveSatkerId ? 'NATIONAL' : 'SATKER_SUBTREE',
                satker_id: effectiveSatkerId
            },
            summary,
            records,
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
                userMessage: `Rangkum temuan profiling entitas "${parsed.sanitizedQuery}" menjadi narasi intelijen singkat.`,
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
            const batchCard = await this.docParser.proposeBatchFromText(authUser, rawMessage);
            if (batchCard) {
                const replyText = [
                    `Siap ${handle}, data tabel (${batchCard.total_rows} baris) berhasil dianalisis.`,
                    `Hasil pencocokan database: **${batchCard.ready_count} LP Siap Diupdate · ${batchCard.skip_count} LP Dilewati (Tidak Ditemukan)**.`,
                    `Silakan tinjau baris pada **Batch Review Card** di bawah ini lalu klik **[Terapkan Update Massal (${batchCard.ready_count} LP)]** untuk menyimpan perubahan.`
                ].join('\n\n');
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
                    batch_review_card: batchCard,
                    disclaimer: COSERSE_DISCLAIMER
                } as any;
            }
        }

        // 2. Decide whether Cross-Entity Profiling (Tahap 1) should supply grounded evidence
        const includeProfilingFlag = input?.include_profiling;
        const disableProfiling =
            includeProfilingFlag === false || String(includeProfilingFlag || '').toLowerCase() === 'false';
        const forceProfiling =
            includeProfilingFlag === true || String(includeProfilingFlag || '').toLowerCase() === 'true';

        let profilingResult: CrossEntityProfileResponse | null = null;
        if (!disableProfiling) {
            const candidateText = String(input?.profile_query || rawMessage).trim();
            const parsedProbe = extractEntities({ query: candidateText });
            const hasExplicitProfilingCue =
                /\b(profil|profiling|lacak|telusuri|keterlibatan|riwayat|terlibat|cek\s+(?:orang|nama|subjek)|cari\s+(?:orang|nama|subjek|tersangka|terlapor|pelaku|saksi))\b/i.test(
                    rawMessage
                );
            const hasStrongEntity =
                parsedProbe.niks.length > 0 ||
                parsedProbe.phones.length > 0 ||
                parsedProbe.plates.length > 0 ||
                (hasExplicitProfilingCue && parsedProbe.names.length > 0) ||
                forceProfiling ||
                Boolean(input?.profile_query?.trim());

            if (hasStrongEntity) {
                if (actor.isBlockedRole) {
                    throw new ForbiddenException(
                        `Maaf ${handle}, role "${actor.role}" tidak memiliki izin melakukan penelusuran/profiling entitas perkara.`
                    );
                }
                const limitRaw = input?.limit !== undefined ? Number(input.limit) : 15;
                profilingResult = await this.profilePersonInvolvement(
                    authUser,
                    {
                        query: candidateText,
                        satker_id: input?.satker_id,
                        limit: Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 15,
                        ai_narrative: false
                    },
                    clientIp
                );
            }
            if (!profilingResult) {
                profilingResult = await this.lookupAnalyticalCaseEvidence(actor, rawMessage);
            }
        }

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

        const scopeMode: 'NATIONAL' | 'SATKER_SUBTREE' =
            profilingResult?.scope.mode ?? (actor.isNational ? 'NATIONAL' : 'SATKER_SUBTREE');

        const knowledgeChunks = this.knowledgeService
            ? await this.knowledgeService.retrieveRelevantChunks(rawMessage, 3)
            : [];

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
                tier: input?.tier
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
                latency_ms: llmRes.latencyMs
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
                          records_preview: profilingResult.records.slice(0, 10)
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
        const forceProfiling =
            includeProfilingFlag === true || String(includeProfilingFlag || '').toLowerCase() === 'true';

        let shouldRunProfiling = false;
        let candidateText = '';
        if (!disableProfiling) {
            candidateText = String(input?.profile_query || rawMessage).trim();
            const parsedProbe = extractEntities({ query: candidateText });
            const hasExplicitProfilingCue =
                /\b(profil|profiling|lacak|telusuri|keterlibatan|riwayat|terlibat|cek\s+(?:orang|nama|subjek)|cari\s+(?:orang|nama|subjek|tersangka|terlapor|pelaku|saksi))\b/i.test(
                    rawMessage
                );
            shouldRunProfiling =
                parsedProbe.niks.length > 0 ||
                parsedProbe.phones.length > 0 ||
                parsedProbe.plates.length > 0 ||
                (hasExplicitProfilingCue && parsedProbe.names.length > 0) ||
                forceProfiling ||
                Boolean(input?.profile_query?.trim());

            if (shouldRunProfiling && actor.isBlockedRole) {
                throw new ForbiddenException(
                    `Maaf ${handle}, role "${actor.role}" tidak memiliki izin melakukan penelusuran/profiling entitas perkara.`
                );
            }
        }

        const { slidingTurns: rawSlidingTurns } = await this.quotaService.prepareInferenceContext(
            actor.userId,
            actor.username,
            sessionId,
            this.llmService.estimateTokens(rawMessage) + (shouldRunProfiling ? 450 : 120),
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
            const batchCard = await this.docParser.proposeBatchFromText(authUser, rawMessage);
            if (batchCard) {
                const replyText = [
                    `Siap ${handle}, data tabel (${batchCard.total_rows} baris) berhasil dianalisis.`,
                    `Hasil pencocokan database: **${batchCard.ready_count} LP Siap Diupdate · ${batchCard.skip_count} LP Dilewati (Tidak Ditemukan)**.`,
                    `Silakan tinjau baris pada **Batch Review Card** di bawah ini lalu klik **[Terapkan Update Massal (${batchCard.ready_count} LP)]** untuk menyimpan perubahan.`
                ].join('\n\n');
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
            let profilingResult: CrossEntityProfileResponse | null = null;
            if (shouldRunProfiling) {
                const limitRaw = input?.limit !== undefined ? Number(input.limit) : 15;
                profilingResult = await this.profilePersonInvolvement(
                    authUser,
                    {
                        query: candidateText,
                        satker_id: input?.satker_id,
                        limit: Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 15,
                        ai_narrative: false
                    },
                    clientIp
                );
            }
            if (!profilingResult) {
                profilingResult = await this.lookupAnalyticalCaseEvidence(actor, rawMessage);
            }

            const scopeMode: 'NATIONAL' | 'SATKER_SUBTREE' =
                profilingResult?.scope.mode ?? (actor.isNational ? 'NATIONAL' : 'SATKER_SUBTREE');

            const knowledgeChunks = this.knowledgeService
                ? await this.knowledgeService.retrieveRelevantChunks(rawMessage, 3)
                : [];

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
                    stream: true
                }
            });

            const reviewCard = this.buildReviewCardFromCommand(
                actor,
                rawMessage,
                profilingResult?.records ?? []
            );
            if (reviewCard) {
                sendEvent('review_card', reviewCard);
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
                          records_preview: profilingResult.records.slice(0, 10)
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
        opts: { isNational: boolean; satkerId: number | null; limit: number }
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

        const limitParam = addParam(opts.limit);
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

        const selectTerlibat = (whereSql: string) => `
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
                parse_tgl_laporan(coalesce(lp.tgl_laporan, d.tgl_laporan)) AS sort_tgl
            FROM bdb_dors_lp_terlibat ter
            ${lpJoinSql.replace('src_lp_id_placeholder', 'ter.lp_id')}
            WHERE (${whereSql})
              AND ${scopePredicate}
            LIMIT ${limitParam}
        `;

        const selectBarangBukti = (whereSql: string) => `
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
                parse_tgl_laporan(coalesce(lp.tgl_laporan, d.tgl_laporan)) AS sort_tgl
            FROM bdb_dors_lp_barang_bukti bb
            ${lpJoinSql.replace('src_lp_id_placeholder', 'bb.lp_id')}
            WHERE (${whereSql})
              AND ${scopePredicate}
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

        // Branch 3: Person Name search across terlibat.nama & barang_bukti (keterangan / ran_nama_pemilik)
        if (parsed.names.length > 0) {
            const upperNames = parsed.names.map((n) => n.toUpperCase());
            const nameConds = upperNames.map((n) => `upper(ter.nama) LIKE ${addParam(`%${n}%`)}`).join(' OR ');
            branches.push(
                `(${selectTerlibat(`ter.nama IS NOT NULL AND btrim(ter.nama) <> '' AND (${nameConds})`)})`
            );

            const bbKetConds = upperNames.map((n) => `upper(bb.keterangan) LIKE ${addParam(`%${n}%`)}`).join(' OR ');
            branches.push(
                `(${selectBarangBukti(`bb.keterangan IS NOT NULL AND btrim(bb.keterangan) <> '' AND (${bbKetConds})`)})`
            );

            const bbOwnerConds = upperNames
                .map((n) => `upper(bb.ran_nama_pemilik) LIKE ${addParam(`%${n}%`)}`)
                .join(' OR ');
            branches.push(
                `(${selectBarangBukti(
                    `bb.ran_nama_pemilik IS NOT NULL AND btrim(bb.ran_nama_pemilik) <> '' AND (${bbOwnerConds})`
                )})`
            );
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
        const sql = `
            ${ctePrefix}
            SELECT *
            FROM (
                ${unionBody}
            ) combined_matches
            ORDER BY sort_tgl DESC NULLS LAST, lp_id DESC
        `;

        return { sql, params };
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

        const lpMatch = msg.match(/\bLP\/[AB]\/[^\s,;)]+/i);
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
            const lpNo = lpMatch[0].trim();
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
        const statusMatch = msg.match(/\b(SP3|SP2[\s_-]?LID|P21|SIDIK|LIDIK|RJ|RESTORATIVE\s+JUSTICE)\b/i);
        if (!hasUpdateVerb || !statusMatch) {
            return null;
        }

        const rawTarget = statusMatch[1].toUpperCase().replace(/[\s-]+/g, '_');
        const targetStatusCode = rawTarget === 'RESTORATIVE_JUSTICE' ? 'SP3' : rawTarget;
        const docTypeCode = targetStatusCode === 'SP2_LID' ? 'SP2LID' : targetStatusCode === 'SP3' ? 'SP3' : 'SP2HP';
        const docTypeNama =
            targetStatusCode === 'SP3'
                ? 'Surat Perintah Penghentian Penyidikan (SP3 / RJ)'
                : targetStatusCode === 'SP2_LID'
                  ? 'Surat Perintah Penghentian Penyelidikan (SP2-Lid)'
                  : `Pembaruan Status Perkara (${targetStatusCode})`;

        const rec = records[0];
        const now = new Date();
        const isoDate = now.toISOString().slice(0, 10);
        const ddMmYyyy = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
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
            alasan_penghentian: rawTarget.includes('RJ') || rawTarget.includes('RESTORATIVE') ? 'Restorative Justice' : '',
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
}
