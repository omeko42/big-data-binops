import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    OnModuleDestroy
} from '@nestjs/common';
import Redis from 'ioredis';
import { AuditService } from '../audit/audit.service';
import { CoserseChatTurn, CoserseQuotaSnapshot } from './dto/profile-query.dto';

const BYTES_PER_MB = 1024 * 1024;
const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export const COSERSE_DEFAULT_MEMORY_MB = 10;
export const COSERSE_MAX_MEMORY_MB = 50;
export const COSERSE_ADMIN_BINOPS_MEMORY_MB = 50;
export const COSERSE_DEFAULT_TTL_SECONDS = 12 * 60 * 60; // 12 hours
export const COSERSE_SLIDING_WINDOW_MAX_TURNS = 6; // 3 latest Q&A exchanges
export const COSERSE_DEFAULT_5H_TOKENS = 20_000;
export const COSERSE_DEFAULT_WEEKLY_TOKENS = 100_000;
export const COSERSE_ADMIN_BINOPS_5H_TOKENS = 60_000;
export const COSERSE_ADMIN_BINOPS_WEEKLY_TOKENS = 500_000;
export const COSERSE_MAX_WEEKLY_TOKENS = 500_000;

const OVERRIDE_ADMIN_ROLES = new Set(['superadmin', 'admin_binops']);

export interface RoleQuotaPolicy {
    role: string;
    tierLabel: string;
    isUnlimited: boolean;
    canTrainModel: boolean;
    modelReadonly: boolean;
    defaultMemoryLimitMb: number;
    fiveHourTokenLimit: number;
    weeklyTokenLimit: number;
}

interface StoredSessionPayload {
    userId: number;
    username: string;
    sessionId: string;
    turns: CoserseChatTurn[];
    updatedAt: number;
}

interface StoredTokenQuotaRecord {
    userId: number;
    fiveHourWindowStartMs: number;
    fiveHourUsed: number;
    weeklyCycleStartMs: number;
    weeklyUsed: number;
    boostTokens: number;
    memoryLimitMb: number;
    customMemoryConfigured?: boolean;
    lastBoostBy?: string;
    lastBoostReason?: string;
    lastBoostAt?: string;
}

interface MemoryStoreEntry {
    value: string;
    expiresAtMs: number;
}

export interface CoserseAiWorkerNode {
    id: 'fe' | 'be';
    label: string;
    endpoint: string;
    lockKey: 'coserse:worker:fe' | 'coserse:worker:be';
}

export interface CoserseWorkerLease {
    jobId: string;
    worker: CoserseAiWorkerNode;
    waitedMs: number;
    queuedEventsSent: number;
    release: () => Promise<void>;
}

@Injectable()
export class CoserseQuotaService implements OnModuleDestroy {
    private readonly logger = new Logger(CoserseQuotaService.name);
    private readonly memoryStore = new Map<string, MemoryStoreEntry>();
    private readonly memoryFifoQueue: Array<{ jobId: string; enqueuedAtMs: number }> = [];
    private workerRoundRobinIdx = 0;
    private redisClient: Redis | null = null;
    private backendMode: 'redis' | 'memory' = 'memory';

    constructor(private readonly audit: AuditService) {
        this.initStoreBackend();
    }

    async onModuleDestroy(): Promise<void> {
        if (this.redisClient) {
            try {
                await this.redisClient.quit();
            } catch {
                this.redisClient.disconnect();
            }
            this.redisClient = null;
        }
    }

    private initStoreBackend(): void {
        const redisEnabled =
            String(process.env.COSERSE_REDIS_ENABLED || process.env.REDIS_ENABLED || 'false').toLowerCase() === 'true';
        if (!redisEnabled) {
            this.backendMode = 'memory';
            return;
        }

        try {
            const host = process.env.COSERSE_REDIS_HOST || process.env.REDIS_HOST || '127.0.0.1';
            const port = Number(process.env.COSERSE_REDIS_PORT || process.env.REDIS_PORT || 6379);
            const password = process.env.COSERSE_REDIS_PASSWORD || process.env.REDIS_PASSWORD || undefined;
            const client = new Redis({
                host,
                port,
                password,
                lazyConnect: true,
                maxRetriesPerRequest: 1,
                enableOfflineQueue: false
            });
            client.on('error', (err) => {
                if (this.backendMode === 'redis') {
                    this.logger.warn(`Redis fallback ke RAM store lokal: ${err?.message || err}`);
                    this.backendMode = 'memory';
                }
            });
            client.on('ready', () => {
                this.backendMode = 'redis';
            });
            client
                .connect()
                .then(() => {
                    this.backendMode = 'redis';
                })
                .catch((err) => {
                    this.logger.warn(`Redis tidak aktif (${err?.message || err}); menggunakan RAM store lokal.`);
                    this.backendMode = 'memory';
                });
            this.redisClient = client;
        } catch (err: any) {
            this.logger.warn(`Gagal inisialisasi Redis; menggunakan RAM store lokal (${err?.message || err}).`);
            this.backendMode = 'memory';
        }
    }

    getStoreBackendMode(): 'redis' | 'memory' {
        return this.backendMode;
    }

    getTtlSeconds(): number {
        const parsed = Number(process.env.COSERSE_SESSION_TTL_SECONDS || COSERSE_DEFAULT_TTL_SECONDS);
        return Number.isFinite(parsed) && parsed >= 60 ? Math.floor(parsed) : COSERSE_DEFAULT_TTL_SECONDS;
    }

    getMaxSlidingTurns(): number {
        const parsed = Number(process.env.COSERSE_MAX_SLIDING_TURNS || COSERSE_SLIDING_WINDOW_MAX_TURNS);
        if (!Number.isFinite(parsed) || parsed < 2) return COSERSE_SLIDING_WINDOW_MAX_TURNS;
        return Math.min(Math.floor(parsed), COSERSE_SLIDING_WINDOW_MAX_TURNS);
    }

    getDefaultMemoryLimitMb(): number {
        const raw = Number(process.env.COSERSE_MEMORY_DEFAULT_MB || COSERSE_DEFAULT_MEMORY_MB);
        if (!Number.isFinite(raw)) return COSERSE_DEFAULT_MEMORY_MB;
        return Math.min(Math.max(raw, COSERSE_DEFAULT_MEMORY_MB), COSERSE_MAX_MEMORY_MB);
    }

    getFiveHourTokenLimit(): number {
        const raw = Number(process.env.COSERSE_QUOTA_5H_TOKENS || COSERSE_DEFAULT_5H_TOKENS);
        return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : COSERSE_DEFAULT_5H_TOKENS;
    }

    getWeeklyTokenLimit(): number {
        const raw = Number(process.env.COSERSE_QUOTA_WEEKLY_TOKENS || COSERSE_DEFAULT_WEEKLY_TOKENS);
        if (!Number.isFinite(raw) || raw <= 0) return COSERSE_DEFAULT_WEEKLY_TOKENS;
        return Math.min(Math.floor(raw), COSERSE_MAX_WEEKLY_TOKENS);
    }

    sanitizeSessionId(rawSessionId?: string): string {
        const cleaned = String(rawSessionId || 'default')
            .trim()
            .replace(/[^a-zA-Z0-9_-]/g, '')
            .slice(0, 64);
        return cleaned || 'default';
    }

    /**
     * Computes Monday 00:00:00 WIB (Asia/Jakarta, UTC+7) cycle start timestamp in UTC ms.
     */
    computeWeeklyCycleStartMs(nowMs = Date.now()): number {
        const wibNowMs = nowMs + WIB_OFFSET_MS;
        const wibDate = new Date(wibNowMs);
        const dayOfWeek = wibDate.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const daysSinceMonday = (dayOfWeek + 6) % 7;
        const startOfDayWibMs =
            Date.UTC(wibDate.getUTCFullYear(), wibDate.getUTCMonth(), wibDate.getUTCDate()) -
            daysSinceMonday * DAY_MS;
        return startOfDayWibMs - WIB_OFFSET_MS;
    }

    getTierMultiplier(tier?: string): number {
        const norm = String(tier || 'low').trim().toLowerCase();
        if (norm === 'high') return 2.0;
        if (norm === 'medium') return 1.5;
        return 1.0;
    }

    resolveRoleQuotaPolicy(role?: string, _username?: string): RoleQuotaPolicy {
        const norm = String(role || 'operator').trim().toLowerCase();
        const isSuper = norm === 'superadmin';
        if (isSuper) {
            return {
                role: 'superadmin',
                tierLabel: 'Superadmin',
                isUnlimited: true,
                canTrainModel: true,
                modelReadonly: false,
                defaultMemoryLimitMb: COSERSE_MAX_MEMORY_MB,
                fiveHourTokenLimit: 0,
                weeklyTokenLimit: 0
            };
        }
        if (norm === 'admin_binops') {
            return {
                role: 'admin_binops',
                tierLabel: 'Admin Binops',
                isUnlimited: false,
                canTrainModel: false,
                modelReadonly: true,
                defaultMemoryLimitMb: COSERSE_ADMIN_BINOPS_MEMORY_MB,
                fiveHourTokenLimit: COSERSE_ADMIN_BINOPS_5H_TOKENS,
                weeklyTokenLimit: COSERSE_ADMIN_BINOPS_WEEKLY_TOKENS
            };
        }
        return {
            role: norm || 'operator',
            tierLabel: norm === 'pimpinan' ? 'Pimpinan' : 'Operator',
            isUnlimited: false,
            canTrainModel: false,
            modelReadonly: true,
            defaultMemoryLimitMb: this.getDefaultMemoryLimitMb(),
            fiveHourTokenLimit: this.getFiveHourTokenLimit(),
            weeklyTokenLimit: this.getWeeklyTokenLimit()
        };
    }

    formatCountdownId(remainingMs: number, mode: '5h' | 'weekly'): string {
        const clamped = Math.max(0, remainingMs);
        if (mode === 'weekly') {
            const days = Math.floor(clamped / DAY_MS);
            if (days >= 1) {
                return `Reset dalam ${days} Hari lagi`;
            }
        }
        const totalMinutes = clamped <= 0 ? 0 : Math.max(1, Math.ceil(clamped / 60_000));
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        if (hours > 0 && mins > 0) {
            return `Reset dalam ${hours} Jam ${mins} Menit lagi`;
        }
        if (hours > 0) {
            return `Reset dalam ${hours} Jam lagi`;
        }
        return `Reset dalam ${mins} Menit lagi`;
    }

    formatWibTimestamp(ms: number): string {
        const d = new Date(ms + WIB_OFFSET_MS);
        const yyyy = d.getUTCFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const hh = String(d.getUTCHours()).padStart(2, '0');
        const mi = String(d.getUTCMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${mi} WIB`;
    }

    private sessionKey(userId: number, sessionId: string): string {
        return `coserse:session:${userId}:${this.sanitizeSessionId(sessionId)}`;
    }

    private quotaKey(userId: number): string {
        return `coserse:quota:${userId}`;
    }

    private async storeGet(key: string): Promise<string | null> {
        if (this.backendMode === 'redis' && this.redisClient) {
            try {
                const val = await this.redisClient.get(key);
                if (val !== null) return val;
            } catch {
                this.backendMode = 'memory';
            }
        }
        const entry = this.memoryStore.get(key);
        if (!entry) return null;
        if (Date.now() >= entry.expiresAtMs) {
            this.memoryStore.delete(key);
            return null;
        }
        return entry.value;
    }

    private async storeSet(key: string, value: string, ttlSeconds: number): Promise<void> {
        const expiresAtMs = Date.now() + ttlSeconds * 1000;
        this.memoryStore.set(key, { value, expiresAtMs });

        if (this.backendMode === 'redis' && this.redisClient) {
            try {
                await this.redisClient.set(key, value, 'EX', ttlSeconds);
            } catch {
                this.backendMode = 'memory';
            }
        }
    }

    private async storeDelete(key: string): Promise<void> {
        this.memoryStore.delete(key);
        if (this.backendMode === 'redis' && this.redisClient) {
            try {
                await this.redisClient.del(key);
            } catch {
                this.backendMode = 'memory';
            }
        }
    }

    private async storeDeleteByPrefix(prefix: string): Promise<number> {
        let deleted = 0;
        for (const k of Array.from(this.memoryStore.keys())) {
            if (k.startsWith(prefix)) {
                this.memoryStore.delete(k);
                deleted++;
            }
        }
        if (this.backendMode === 'redis' && this.redisClient) {
            try {
                const keys = await this.redisClient.keys(`${prefix}*`);
                if (keys.length) {
                    deleted = Math.max(deleted, await this.redisClient.del(...keys));
                }
            } catch {
                this.backendMode = 'memory';
            }
        }
        return deleted;
    }

    private async loadQuotaRecord(
        userId: number,
        nowMs = Date.now(),
        role?: string,
        username?: string
    ): Promise<StoredTokenQuotaRecord> {
        const raw = await this.storeGet(this.quotaKey(userId));
        const currentWeekStart = this.computeWeeklyCycleStartMs(nowMs);
        const policy = this.resolveRoleQuotaPolicy(role, username);
        const defaultLimitMb = policy.defaultMemoryLimitMb;

        if (!raw) {
            return {
                userId,
                fiveHourWindowStartMs: nowMs,
                fiveHourUsed: 0,
                weeklyCycleStartMs: currentWeekStart,
                weeklyUsed: 0,
                boostTokens: 0,
                memoryLimitMb: defaultLimitMb
            };
        }

        const parsed: StoredTokenQuotaRecord = JSON.parse(raw);
        let changed = false;

        if (!parsed.fiveHourWindowStartMs || nowMs >= parsed.fiveHourWindowStartMs + FIVE_HOURS_MS) {
            parsed.fiveHourWindowStartMs = nowMs;
            parsed.fiveHourUsed = 0;
            changed = true;
        }
        if (!parsed.weeklyCycleStartMs || parsed.weeklyCycleStartMs < currentWeekStart) {
            parsed.weeklyCycleStartMs = currentWeekStart;
            parsed.weeklyUsed = 0;
            parsed.boostTokens = 0;
            changed = true;
        }
        if (!parsed.memoryLimitMb || parsed.memoryLimitMb < COSERSE_DEFAULT_MEMORY_MB) {
            parsed.memoryLimitMb = defaultLimitMb;
        }
        if (!parsed.customMemoryConfigured && policy.role === 'admin_binops' && parsed.memoryLimitMb < 30) {
            parsed.memoryLimitMb = defaultLimitMb;
            changed = true;
        }
        parsed.memoryLimitMb = Math.min(parsed.memoryLimitMb, COSERSE_MAX_MEMORY_MB);

        if (changed) {
            await this.saveQuotaRecord(parsed);
        }
        return parsed;
    }

    private async saveQuotaRecord(record: StoredTokenQuotaRecord): Promise<void> {
        // Retain weekly quota record for 8 days (691200s)
        await this.storeSet(this.quotaKey(record.userId), JSON.stringify(record), 8 * 24 * 60 * 60);
    }

    private async loadSession(userId: number, username: string, sessionId: string): Promise<{
        payload: StoredSessionPayload;
        bytes: number;
    }> {
        const cleanSession = this.sanitizeSessionId(sessionId);
        const raw = await this.storeGet(this.sessionKey(userId, cleanSession));
        if (!raw) {
            return {
                payload: {
                    userId,
                    username,
                    sessionId: cleanSession,
                    turns: [],
                    updatedAt: Date.now()
                },
                bytes: 0
            };
        }
        const parsed = JSON.parse(raw) as StoredSessionPayload;
        return {
            payload: parsed,
            bytes: Buffer.byteLength(raw, 'utf8')
        };
    }

    private async sumAllSessionBytes(userId: number, currentSessionId: string, currentSessionBytes: number): Promise<number> {
        const prefix = `coserse:session:${userId}:`;
        const currentKey = this.sessionKey(userId, currentSessionId);
        let total = currentSessionBytes;
        const now = Date.now();

        if (this.backendMode === 'redis' && this.redisClient) {
            try {
                const keys = await this.redisClient.keys(`${prefix}*`);
                for (const key of keys) {
                    if (key === currentKey) continue;
                    const val = await this.redisClient.get(key);
                    if (val) total += Buffer.byteLength(val, 'utf8');
                }
                return total;
            } catch {
                this.backendMode = 'memory';
            }
        }

        for (const [key, entry] of this.memoryStore.entries()) {
            if (!key.startsWith(prefix) || key === currentKey) continue;
            if (now >= entry.expiresAtMs) {
                this.memoryStore.delete(key);
                continue;
            }
            total += Buffer.byteLength(entry.value, 'utf8');
        }
        return total;
    }

    private buildSnapshot(
        quota: StoredTokenQuotaRecord,
        session: StoredSessionPayload,
        totalBytes: number,
        role?: string,
        nowMs = Date.now(),
        username?: string
    ): CoserseQuotaSnapshot {
        const policy = this.resolveRoleQuotaPolicy(role, username || session.username);
        const fiveHourBase = policy.fiveHourTokenLimit;
        const weeklyBase = policy.weeklyTokenLimit;
        const boost = policy.isUnlimited ? 0 : Math.max(0, quota.boostTokens || 0);
        const fiveHourEffective = policy.isUnlimited ? 0 : fiveHourBase + boost;
        const weeklyEffective = policy.isUnlimited ? 0 : weeklyBase + boost;

        const effectiveMemoryLimitMb = policy.isUnlimited ? COSERSE_MAX_MEMORY_MB : quota.memoryLimitMb;
        const limitBytes = effectiveMemoryLimitMb * BYTES_PER_MB;
        const usagePercent = policy.isUnlimited
            ? 0
            : limitBytes > 0
              ? Number(((totalBytes / limitBytes) * 100).toFixed(2))
              : 0;
        const slidingMax = this.getMaxSlidingTurns();

        const fiveHourResetAtMs = quota.fiveHourWindowStartMs + FIVE_HOURS_MS;
        const weeklyResetAtMs = quota.weeklyCycleStartMs + 7 * DAY_MS;

        return {
            store_backend: this.backendMode,
            user_id: quota.userId,
            username: session.username,
            role: policy.role,
            tier_label: policy.tierLabel,
            is_unlimited: policy.isUnlimited,
            can_train_model: policy.canTrainModel,
            model_readonly: policy.modelReadonly,
            session_id: session.sessionId,
            ttl_seconds: this.getTtlSeconds(),
            memory: {
                used_bytes: totalBytes,
                used_mb: Number((totalBytes / BYTES_PER_MB).toFixed(4)),
                limit_mb: effectiveMemoryLimitMb,
                max_configurable_mb: COSERSE_MAX_MEMORY_MB,
                usage_percent: usagePercent,
                near_limit_warning: !policy.isUnlimited && usagePercent >= 90,
                exhausted: !policy.isUnlimited && totalBytes >= limitBytes,
                turns_stored: session.turns.length,
                sliding_window_max: slidingMax,
                sliding_window_active: Math.min(session.turns.length, slidingMax)
            },
            tokens: {
                five_hour_used: quota.fiveHourUsed,
                five_hour_limit: fiveHourBase,
                five_hour_effective_limit: fiveHourEffective,
                five_hour_remaining: policy.isUnlimited ? 0 : Math.max(0, fiveHourEffective - quota.fiveHourUsed),
                five_hour_reset_at: policy.isUnlimited
                    ? 'Tanpa Batas'
                    : this.formatWibTimestamp(fiveHourResetAtMs),
                five_hour_reset_in_text: policy.isUnlimited
                    ? 'Akses Superadmin • Kuota Tanpa Batas'
                    : this.formatCountdownId(fiveHourResetAtMs - nowMs, '5h'),
                weekly_used: quota.weeklyUsed,
                weekly_limit: weeklyBase,
                weekly_effective_limit: weeklyEffective,
                weekly_remaining: policy.isUnlimited ? 0 : Math.max(0, weeklyEffective - quota.weeklyUsed),
                weekly_reset_at: policy.isUnlimited
                    ? 'Tanpa Batas'
                    : this.formatWibTimestamp(weeklyResetAtMs),
                weekly_reset_in_text: policy.isUnlimited
                    ? 'Akses Superadmin • Kuota Tanpa Batas'
                    : this.formatCountdownId(weeklyResetAtMs - nowMs, 'weekly'),
                boost_tokens: boost,
                is_free_tier: true
            }
        };
    }

    async getQuotaSnapshot(
        userId: number,
        username: string,
        sessionId = 'default',
        role?: string
    ): Promise<CoserseQuotaSnapshot> {
        const cleanSession = this.sanitizeSessionId(sessionId);
        const nowMs = Date.now();
        const quota = await this.loadQuotaRecord(userId, nowMs, role, username);
        const { payload, bytes } = await this.loadSession(userId, username, cleanSession);
        const totalBytes = await this.sumAllSessionBytes(userId, cleanSession, bytes);
        return this.buildSnapshot(quota, payload, totalBytes, role, nowMs, username);
    }

    /**
     * Validates memory quota & 5h/weekly token quotas before LLM inference, and returns
     * strictly the latest max 6 turns for sliding context injection.
     */
    async prepareInferenceContext(
        userId: number,
        username: string,
        sessionId = 'default',
        estimatedPromptTokens = 256,
        role?: string
    ): Promise<{
        slidingTurns: CoserseChatTurn[];
        snapshot: CoserseQuotaSnapshot;
        quotaWarning: string | null;
    }> {
        const cleanSession = this.sanitizeSessionId(sessionId);
        const nowMs = Date.now();
        const quota = await this.loadQuotaRecord(userId, nowMs, role, username);
        const { payload, bytes } = await this.loadSession(userId, username, cleanSession);
        const totalBytes = await this.sumAllSessionBytes(userId, cleanSession, bytes);
        const snapshot = this.buildSnapshot(quota, payload, totalBytes, role, nowMs, username);
        const handle = `@${username.replace(/^@+/, '')}`;

        if (!snapshot.is_unlimited) {
            if (snapshot.memory.exhausted) {
                throw new HttpException(
                    {
                        status: 0,
                        code: 'COSERSE_MEMORY_FULL',
                        message: `${handle}, penyimpanan memori sesi Anda sudah penuh (${snapshot.memory.used_mb} MB / ${snapshot.memory.limit_mb} MB). Silakan klik tombol [Hapus Memori] di Settings atau panggil DELETE /api/bdb/coserse/session untuk mereset kembali ke 0 MB.`,
                        quota: snapshot
                    },
                    HttpStatus.PAYLOAD_TOO_LARGE
                );
            }

            if (snapshot.tokens.five_hour_used >= snapshot.tokens.five_hour_effective_limit) {
                throw new HttpException(
                    {
                        status: 0,
                        code: 'COSERSE_QUOTA_5H_EXCEEDED',
                        message: `${handle}, Anda telah mencapai batas penggunaan analisis cerdas untuk sesi 5 jam ini (${snapshot.tokens.five_hour_used.toLocaleString('id-ID')} / ${snapshot.tokens.five_hour_effective_limit.toLocaleString('id-ID')} token). ${snapshot.tokens.five_hour_reset_in_text || `Silakan tunggu hingga ${snapshot.tokens.five_hour_reset_at}`}.`,
                        quota: snapshot
                    },
                    HttpStatus.TOO_MANY_REQUESTS
                );
            }

            if (snapshot.tokens.weekly_used >= snapshot.tokens.weekly_effective_limit) {
                throw new HttpException(
                    {
                        status: 0,
                        code: 'COSERSE_QUOTA_WEEKLY_EXCEEDED',
                        message: `${handle}, batas kuota token mingguan Anda telah habis (${snapshot.tokens.weekly_used.toLocaleString('id-ID')} / ${snapshot.tokens.weekly_effective_limit.toLocaleString('id-ID')} token). ${snapshot.tokens.weekly_reset_in_text || `Reset otomatis pada ${snapshot.tokens.weekly_reset_at}`}.`,
                        quota: snapshot
                    },
                    HttpStatus.TOO_MANY_REQUESTS
                );
            }
        }

        // Guard against near-limit estimated overrun on tiny remaining balance only when strictly 0 left above;
        // if positive tokens remain we still let the turn run cleanly and account actual usage afterward.
        void estimatedPromptTokens;

        const maxSliding = this.getMaxSlidingTurns();
        const slidingTurns = payload.turns.slice(-maxSliding);
        const quotaWarning = snapshot.memory.near_limit_warning
            ? `Peringatan untuk ${handle}: Penyimpanan memori sesi Anda hampir penuh (${snapshot.memory.usage_percent}% dari batas ${snapshot.memory.limit_mb} MB). Gunakan [Hapus Memori] di Settings bila ingin mereset ke 0 MB.`
            : null;

        return { slidingTurns, snapshot, quotaWarning };
    }

    /**
     * Records completed user + assistant turns into Redis/memory store with 12h TTL,
     * applies sliding storage trimming if session grows unusually large, and deducts token usage.
     */
    async recordConversationExchange(params: {
        userId: number;
        username: string;
        sessionId: string;
        userMessage: string;
        assistantMessage: string;
        promptTokens: number;
        completionTokens: number;
        role?: string;
        tier?: 'low' | 'medium' | 'high' | string;
    }): Promise<{ snapshot: CoserseQuotaSnapshot; quotaWarning: string | null }> {
        const cleanSession = this.sanitizeSessionId(params.sessionId);
        const nowMs = Date.now();
        const policy = this.resolveRoleQuotaPolicy(params.role, params.username);
        const quota = await this.loadQuotaRecord(params.userId, nowMs, params.role, params.username);
        const { payload } = await this.loadSession(params.userId, params.username, cleanSession);

        const nowIso = new Date().toISOString();
        const userTurn: CoserseChatTurn = {
            role: 'user',
            content: params.userMessage,
            timestamp: nowIso,
            bytes: Buffer.byteLength(params.userMessage, 'utf8'),
            tokens: params.promptTokens
        };
        const assistantTurn: CoserseChatTurn = {
            role: 'assistant',
            content: params.assistantMessage,
            timestamp: nowIso,
            bytes: Buffer.byteLength(params.assistantMessage, 'utf8'),
            tokens: params.completionTokens
        };

        payload.turns.push(userTurn, assistantTurn);
        payload.updatedAt = Date.now();

        const serialized = JSON.stringify(payload);
        const sessionBytes = Buffer.byteLength(serialized, 'utf8');
        const otherBytes = await this.sumAllSessionBytes(params.userId, cleanSession, 0);
        const projectedTotalBytes = otherBytes + sessionBytes;
        const limitBytes = quota.memoryLimitMb * BYTES_PER_MB;

        if (!policy.isUnlimited && projectedTotalBytes > limitBytes) {
            const handle = `@${params.username.replace(/^@+/, '')}`;
            const snapshotBefore = await this.getQuotaSnapshot(params.userId, params.username, cleanSession, params.role);
            throw new HttpException(
                {
                    status: 0,
                    code: 'COSERSE_MEMORY_LIMIT_EXCEEDED',
                    message: `${handle}, penyimpanan sesi melebihi batas kuota ${quota.memoryLimitMb} MB (${(projectedTotalBytes / BYTES_PER_MB).toFixed(2)} MB). Buka Settings untuk [Hapus Memori].`,
                    quota: snapshotBefore
                },
                HttpStatus.PAYLOAD_TOO_LARGE
            );
        }

        await this.storeSet(this.sessionKey(params.userId, cleanSession), serialized, this.getTtlSeconds());

        const baseTokens = Math.max(0, Math.floor(params.promptTokens + params.completionTokens));
        const multiplier = policy.isUnlimited ? 1.0 : this.getTierMultiplier(params.tier);
        const totalTokens = Math.ceil(baseTokens * multiplier);
        quota.fiveHourUsed += totalTokens;
        quota.weeklyUsed += totalTokens;
        await this.saveQuotaRecord(quota);

        const snapshot = this.buildSnapshot(quota, payload, projectedTotalBytes, params.role, nowMs, params.username);
        const handle = `@${params.username.replace(/^@+/, '')}`;
        const quotaWarning = snapshot.memory.near_limit_warning
            ? `Peringatan untuk ${handle}: Memori sesi terpakai ${snapshot.memory.usage_percent}% (${snapshot.memory.used_mb} MB / ${snapshot.memory.limit_mb} MB).`
            : null;

        return { snapshot, quotaWarning };
    }

    /**
     * User-initiated immediate purge ("Hapus Memori"). Deletes session store key and resets MB usage to 0.
     */
    async purgeSession(
        userId: number,
        username: string,
        sessionId = 'default',
        clientIp?: string,
        role?: string
    ): Promise<{
        status: 1;
        message: string;
        cleared_keys: number;
        quota: CoserseQuotaSnapshot;
    }> {
        const cleanSession = sessionId === '*' ? '*' : this.sanitizeSessionId(sessionId);
        let cleared = 0;

        if (cleanSession === '*') {
            cleared = await this.storeDeleteByPrefix(`coserse:session:${userId}:`);
        } else {
            await this.storeDelete(this.sessionKey(userId, cleanSession));
            cleared = 1;
        }

        const snapshot = await this.getQuotaSnapshot(
            userId,
            username,
            cleanSession === '*' ? 'default' : cleanSession,
            role
        );
        const handle = `@${username.replace(/^@+/, '')}`;

        await this.audit.log({
            userId,
            userName: handle,
            action: 'COSERSE_SESSION_PURGE',
            entity: 'coserse_session',
            entityId: cleanSession,
            meta: {
                cleared_keys: cleared,
                used_mb_after: snapshot.memory.used_mb
            },
            ip: clientIp,
            outcome: 'SUCCESS'
        });

        return {
            status: 1,
            message: `Siap ${handle}, seluruh riwayat percakapan pada memori lokal telah dibersihkan (0 MB). Kita bisa memulai sesi analisis yang baru.`,
            cleared_keys: cleared,
            quota: snapshot
        };
    }

    /**
     * Emergency token override (Superadmin & Admin Binops only) for urgent crime-analysis operations.
     */
    async grantEmergencyBoost(
        actor: { userId: number; username: string; role: string },
        targetUserIdInput: number | string,
        bonusTokensInput: number | string,
        reason?: string,
        clientIp?: string
    ): Promise<{
        status: 1;
        message: string;
        target_user_id: number;
        boost_tokens: number;
        effective_5h_limit: number;
        effective_weekly_limit: number;
    }> {
        if (!OVERRIDE_ADMIN_ROLES.has(String(actor.role || '').toLowerCase())) {
            throw new ForbiddenException(
                `Maaf @${actor.username.replace(/^@+/, '')}, Emergency Token Override hanya diizinkan untuk Superadmin atau Admin Binops.`
            );
        }

        const targetUserId = Number(targetUserIdInput);
        const bonusTokens = Number(bonusTokensInput);
        if (!Number.isSafeInteger(targetUserId) || targetUserId <= 0) {
            throw new BadRequestException('target_user_id tidak valid.');
        }
        if (!Number.isFinite(bonusTokens) || bonusTokens <= 0 || bonusTokens > 500_000) {
            throw new BadRequestException('bonus_tokens harus bernilai antara 1 hingga 500.000 token.');
        }

        const quota = await this.loadQuotaRecord(targetUserId);
        quota.boostTokens = (quota.boostTokens || 0) + Math.floor(bonusTokens);
        quota.lastBoostBy = `@${actor.username.replace(/^@+/, '')}`;
        quota.lastBoostReason = String(reason || 'Urgensi operasional penyelidikan').slice(0, 240);
        quota.lastBoostAt = new Date().toISOString();
        await this.saveQuotaRecord(quota);

        await this.audit.log({
            userId: actor.userId,
            userName: `@${actor.username.replace(/^@+/, '')}`,
            action: 'COSERSE_TOKEN_BOOST',
            entity: 'coserse_quota',
            entityId: String(targetUserId),
            meta: {
                target_user_id: targetUserId,
                bonus_tokens: Math.floor(bonusTokens),
                total_boost_tokens: quota.boostTokens,
                reason: quota.lastBoostReason
            },
            ip: clientIp,
            outcome: 'SUCCESS'
        });

        const effective5h = this.getFiveHourTokenLimit() + quota.boostTokens;
        const effectiveWeekly = this.getWeeklyTokenLimit() + quota.boostTokens;

        return {
            status: 1,
            message: `Siap @${actor.username.replace(/^@+/, '')}, Emergency Token Override sebesar +${Math.floor(bonusTokens).toLocaleString('id-ID')} token telah diberikan untuk user #${targetUserId}.`,
            target_user_id: targetUserId,
            boost_tokens: quota.boostTokens,
            effective_5h_limit: effective5h,
            effective_weekly_limit: effectiveWeekly
        };
    }

    /**
     * Allows Superadmin / Admin Binops to tune a user's RAM storage quota between 10 MB and 50 MB.
     */
    async configureUserMemoryLimit(
        actor: { userId: number; username: string; role: string },
        targetUserId: number,
        limitMb: number
    ): Promise<{ status: 1; user_id: number; memory_limit_mb: number }> {
        if (!OVERRIDE_ADMIN_ROLES.has(String(actor.role || '').toLowerCase())) {
            throw new ForbiddenException('Hanya Superadmin atau Admin Binops yang dapat mengubah batas kuota memori.');
        }
        if (!Number.isFinite(limitMb) || limitMb < COSERSE_DEFAULT_MEMORY_MB || limitMb > COSERSE_MAX_MEMORY_MB) {
            throw new BadRequestException(
                `Batas memori harus berada di rentang ${COSERSE_DEFAULT_MEMORY_MB} MB hingga ${COSERSE_MAX_MEMORY_MB} MB.`
            );
        }
        const quota = await this.loadQuotaRecord(targetUserId);
        quota.memoryLimitMb = Math.floor(limitMb);
        quota.customMemoryConfigured = true;
        await this.saveQuotaRecord(quota);
        return {
            status: 1,
            user_id: targetUserId,
            memory_limit_mb: quota.memoryLimitMb
        };
    }

    /**
     * Returns configured AI worker endpoints (FE .232 and BE .233).
     * When only a single endpoint is configured (e.g. unit test stub), exposes that endpoint on worker:fe.
     */
    getConfiguredAiWorkers(defaultEndpoint: string): CoserseAiWorkerNode[] {
        const feUrl = String(process.env.COSERSE_WORKER_FE_URL || defaultEndpoint).trim();
        const beUrl = String(
            process.env.COSERSE_WORKER_BE_URL ||
                (String(process.env.COSERSE_DUAL_WORKER_ENABLED || '').toLowerCase() === 'true'
                    ? 'http://172.19.0.1:11435/api/chat'
                    : '')
        ).trim();

        const workers: CoserseAiWorkerNode[] = [
            {
                id: 'fe',
                label: 'worker:fe',
                endpoint: feUrl,
                lockKey: 'coserse:worker:fe'
            }
        ];

        if (beUrl) {
            workers.push({
                id: 'be',
                label: 'worker:be',
                endpoint: beUrl,
                lockKey: 'coserse:worker:be'
            });
        }

        return workers;
    }

    private async atomicSetNx(key: string, value: string, ttlSeconds: number): Promise<boolean> {
        const now = Date.now();
        if (this.backendMode === 'redis' && this.redisClient) {
            try {
                const res = await this.redisClient.set(key, value, 'EX', ttlSeconds, 'NX');
                return res === 'OK';
            } catch {
                this.backendMode = 'memory';
            }
        }
        const existing = this.memoryStore.get(key);
        if (existing && now < existing.expiresAtMs) {
            return false;
        }
        this.memoryStore.set(key, {
            value,
            expiresAtMs: now + ttlSeconds * 1000
        });
        return true;
    }

    private async atomicRenewIfOwner(key: string, expectedValue: string, ttlSeconds: number): Promise<boolean> {
        const now = Date.now();
        if (this.backendMode === 'redis' && this.redisClient) {
            try {
                const current = await this.redisClient.get(key);
                if (current === expectedValue) {
                    await this.redisClient.expire(key, ttlSeconds);
                    return true;
                }
                return false;
            } catch {
                this.backendMode = 'memory';
            }
        }
        const existing = this.memoryStore.get(key);
        if (existing && now < existing.expiresAtMs && existing.value === expectedValue) {
            existing.expiresAtMs = now + ttlSeconds * 1000;
            return true;
        }
        return false;
    }

    private async atomicDeleteIfOwner(key: string, expectedValue: string): Promise<boolean> {
        if (this.backendMode === 'redis' && this.redisClient) {
            try {
                const current = await this.redisClient.get(key);
                if (current === expectedValue) {
                    await this.redisClient.del(key);
                    return true;
                }
                return false;
            } catch {
                this.backendMode = 'memory';
            }
        }
        const existing = this.memoryStore.get(key);
        if (existing && existing.value === expectedValue) {
            this.memoryStore.delete(key);
            return true;
        }
        return false;
    }

    private async fifoEnqueue(jobId: string, nowMs = Date.now()): Promise<void> {
        const queueKey = 'coserse:queue:fifo';
        if (this.backendMode === 'redis' && this.redisClient) {
            try {
                await this.redisClient.zadd(queueKey, 'NX', nowMs, jobId);
                await this.redisClient.expire(queueKey, 600);
                return;
            } catch {
                this.backendMode = 'memory';
            }
        }
        if (!this.memoryFifoQueue.some((e) => e.jobId === jobId)) {
            this.memoryFifoQueue.push({ jobId, enqueuedAtMs: nowMs });
        }
    }

    private async fifoRemove(jobId: string): Promise<void> {
        const queueKey = 'coserse:queue:fifo';
        const idx = this.memoryFifoQueue.findIndex((e) => e.jobId === jobId);
        if (idx >= 0) this.memoryFifoQueue.splice(idx, 1);
        if (this.backendMode === 'redis' && this.redisClient) {
            try {
                await this.redisClient.zrem(queueKey, jobId);
            } catch {
                this.backendMode = 'memory';
            }
        }
    }

    private async fifoGetRankAndPrune(jobId: string, maxAgeMs = 240_000): Promise<number> {
        const now = Date.now();
        const cutoff = now - maxAgeMs;
        const queueKey = 'coserse:queue:fifo';
        if (this.backendMode === 'redis' && this.redisClient) {
            try {
                await this.redisClient.zremrangebyscore(queueKey, '-inf', cutoff);
                const rank = await this.redisClient.zrank(queueKey, jobId);
                if (rank === null || rank === undefined) {
                    await this.redisClient.zadd(queueKey, 'NX', now, jobId);
                    const retryRank = await this.redisClient.zrank(queueKey, jobId);
                    return retryRank ?? 0;
                }
                return rank;
            } catch {
                this.backendMode = 'memory';
            }
        }
        for (let i = this.memoryFifoQueue.length - 1; i >= 0; i--) {
            if (this.memoryFifoQueue[i].enqueuedAtMs < cutoff) {
                this.memoryFifoQueue.splice(i, 1);
            }
        }
        let idx = this.memoryFifoQueue.findIndex((e) => e.jobId === jobId);
        if (idx < 0) {
            this.memoryFifoQueue.push({ jobId, enqueuedAtMs: now });
            idx = this.memoryFifoQueue.length - 1;
        }
        return idx;
    }

    async getAiQueueStatus(defaultEndpoint = 'http://127.0.0.1:11434/api/chat') {
        const workers = this.getConfiguredAiWorkers(defaultEndpoint);
        const workerStates: Record<string, string | null> = {};
        for (const w of workers) {
            workerStates[w.id] = await this.storeGet(w.lockKey);
        }
        let queueLength = this.memoryFifoQueue.length;
        if (this.backendMode === 'redis' && this.redisClient) {
            try {
                queueLength = await this.redisClient.zcard('coserse:queue:fifo');
            } catch {
                // fallback
            }
        }
        return {
            store_backend: this.backendMode,
            workers: workers.map((w) => ({
                id: w.id,
                label: w.label,
                endpoint: w.endpoint,
                busy: Boolean(workerStates[w.id]),
                active_job_id: workerStates[w.id] || null
            })),
            queue_length: queueLength
        };
    }

    /**
     * Central Redis Dual-Worker Coordinator:
     * - Enqueues job in FIFO queue (`coserse:queue:fifo`)
     * - Acquires atomic lock on exactly 1 idle worker (`coserse:worker:fe` or `coserse:worker:be`) + per-job lock (`coserse:job:<id>`)
     * - Self-healing TTL (240s) renewed every 15s while active
     * - Emits periodic queue position callbacks while waiting (never rejects due to busy workers)
     */
    async acquireAiWorkerLease(options: {
        defaultEndpoint: string;
        lockTtlSeconds?: number;
        maxWaitMs?: number;
        pollIntervalMs?: number;
        isAborted?: () => boolean;
        onQueueWait?: (info: {
            jobId: string;
            position: number;
            estimatedWaitSec: number;
            waitedMs: number;
        }) => void;
    }): Promise<CoserseWorkerLease> {
        const ttlSec = options.lockTtlSeconds || 240;
        const maxWaitMs = options.maxWaitMs || 300_000;
        const pollMs = options.pollIntervalMs || 500;
        const startedAt = Date.now();
        const jobId = `job-${startedAt}-${Math.random().toString(36).slice(2, 8)}`;
        const jobLockKey = `coserse:job:${jobId}`;
        const workers = this.getConfiguredAiWorkers(options.defaultEndpoint);

        await this.fifoEnqueue(jobId, startedAt);

        let lastQueueNotifyAt = 0;
        let queuedEventsSent = 0;

        try {
            while (Date.now() - startedAt < maxWaitMs) {
                if (options.isAborted && options.isAborted()) {
                    await this.fifoRemove(jobId);
                    throw new Error('Request dibatalkan oleh klien sebelum giliran worker AI tiba.');
                }

                const rank = await this.fifoGetRankAndPrune(jobId, ttlSec * 1000);

                if (rank === 0) {
                    const startIdx = this.workerRoundRobinIdx % workers.length;
                    for (let i = 0; i < workers.length; i++) {
                        const candidate = workers[(startIdx + i) % workers.length];
                        const lockedWorker = await this.atomicSetNx(candidate.lockKey, jobId, ttlSec);
                        if (lockedWorker) {
                            this.workerRoundRobinIdx = (startIdx + i + 1) % workers.length;
                            const lockedJob = await this.atomicSetNx(jobLockKey, candidate.id, ttlSec);
                            if (!lockedJob) {
                                await this.atomicDeleteIfOwner(candidate.lockKey, jobId);
                                continue;
                            }
                            await this.fifoRemove(jobId);

                            this.logger.log(
                                `[CoserseQueue] Job ${jobId} dialokasikan ke ${candidate.label} (${candidate.endpoint}) setelah antre ${Date.now() - startedAt}ms.`
                            );

                            let released = false;
                            const heartbeat = setInterval(() => {
                                if (!released) {
                                    void this.atomicRenewIfOwner(candidate.lockKey, jobId, ttlSec);
                                    void this.atomicRenewIfOwner(jobLockKey, candidate.id, ttlSec);
                                }
                            }, 15_000);
                            if (typeof (heartbeat as any).unref === 'function') {
                                (heartbeat as any).unref();
                            }

                            const release = async () => {
                                if (released) return;
                                released = true;
                                clearInterval(heartbeat);
                                await this.fifoRemove(jobId);
                                await this.atomicDeleteIfOwner(candidate.lockKey, jobId);
                                await this.atomicDeleteIfOwner(jobLockKey, candidate.id);
                                this.logger.log(
                                    `[CoserseQueue] Lock ${candidate.label} untuk job ${jobId} dilepas (idle).`
                                );
                            };

                            return {
                                jobId,
                                worker: candidate,
                                waitedMs: Date.now() - startedAt,
                                queuedEventsSent,
                                release
                            };
                        }
                    }
                }

                // Both workers are busy or this job is behind an earlier job in FIFO queue
                const now = Date.now();
                if (options.onQueueWait && now - lastQueueNotifyAt >= 2000) {
                    lastQueueNotifyAt = now;
                    queuedEventsSent++;
                    const position = rank + 1;
                    options.onQueueWait({
                        jobId,
                        position,
                        estimatedWaitSec: Math.max(8, position * 12),
                        waitedMs: now - startedAt
                    });
                }

                await new Promise((r) => setTimeout(r, pollMs));
            }

            await this.fifoRemove(jobId);
            throw new Error('Waktu tunggu antrean AI melebihi batas maksimum.');
        } catch (err) {
            await this.fifoRemove(jobId);
            throw err;
        }
    }
}
