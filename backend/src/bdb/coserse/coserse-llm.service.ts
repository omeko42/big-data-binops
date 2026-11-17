import {
    ForbiddenException,
    Injectable,
    Logger,
    ServiceUnavailableException
} from '@nestjs/common';
import axios from 'axios';
import {
    CoserseChatTurn,
    CrossEntityMatchRecord,
    CrossEntityProfileResponse,
    CrossEntityProfileSummary
} from './dto/profile-query.dto';

export const COSERSE_MANDATORY_DISCLAIMER =
    'Coserse dapat melakukan kesalahan. Hanya untuk internal dan tolong periksa ulang hasil pekerjaan.';

const LOOPBACK_HOSTS = new Set([
    '127.0.0.1',
    'localhost',
    '::1',
    '[::1]',
    '172.19.0.1'
]);

export interface CoserseActorContext {
    userId: number;
    username: string;
    displayName: string;
    role: string;
    satkerId: number | null;
    scopeMode: 'NATIONAL' | 'SATKER_SUBTREE';
}

export interface CoserseLlmGenerationResult {
    reply: string;
    provider: 'ollama' | 'llamacpp' | 'deterministic_fallback';
    model: string;
    latencyMs: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    xmlEvidenceIsolated: boolean;
    offlineNotice: string | null;
}

export interface CoserseRuntimeHealth {
    provider: 'ollama' | 'llamacpp';
    endpoint: string;
    model: string;
    loopback_enforced: boolean;
    engine_reachable: boolean;
    coserse_model_ready: boolean;
    available_models: string[];
    offline_fallback_enabled: boolean;
    error?: string;
}

@Injectable()
export class CoserseLlmService {
    private readonly logger = new Logger(CoserseLlmService.name);

    getRuntimeProvider(): 'ollama' | 'llamacpp' {
        const p = String(process.env.COSERSE_RUNTIME_PROVIDER || 'ollama').toLowerCase();
        return p === 'llamacpp' ? 'llamacpp' : 'ollama';
    }

    getModelName(): string {
        return String(process.env.COSERSE_MODEL_NAME || 'coserse:1.0').trim() || 'coserse:1.0';
    }

    getEndpointUrl(): string {
        const provider = this.getRuntimeProvider();
        const raw =
            provider === 'llamacpp'
                ? process.env.COSERSE_LLAMA_CPP_URL || 'http://127.0.0.1:8080/v1/chat/completions'
                : process.env.COSERSE_OLLAMA_URL || 'http://127.0.0.1:11434/api/chat';
        return this.assertLoopbackUrl(raw);
    }

    getTagsEndpointUrl(): string {
        const chatUrl = this.getEndpointUrl();
        const custom = process.env.COSERSE_OLLAMA_TAGS_URL;
        if (custom) return this.assertLoopbackUrl(custom);
        const parsed = new URL(chatUrl);
        if (this.getRuntimeProvider() === 'llamacpp') {
            return `${parsed.protocol}//${parsed.host}/v1/models`;
        }
        return `${parsed.protocol}//${parsed.host}/api/tags`;
    }

    isOfflineFallbackEnabled(): boolean {
        return String(process.env.COSERSE_OFFLINE_DETERMINISTIC_FALLBACK || 'false').toLowerCase() === 'true';
    }

    /**
     * Strictly enforces Zero-Data-Leakage loopback boundary: refuses any non-loopback endpoint URL.
     */
    assertLoopbackUrl(rawUrl: string): string {
        let parsed: URL;
        try {
            parsed = new URL(rawUrl);
        } catch {
            throw new ForbiddenException(`URL runtime Coserse tidak valid: ${rawUrl}`);
        }
        const host = parsed.hostname.toLowerCase();
        if (!LOOPBACK_HOSTS.has(host)) {
            throw new ForbiddenException(
                `Ditolak oleh Zero-Data-Leakage Guard: engine Coserse 1.0 hanya boleh mengakses loopback (127.0.0.1 / localhost), bukan "${host}".`
            );
        }
        return parsed.toString();
    }

    estimateTokens(text: string): number {
        if (!text) return 0;
        return Math.max(1, Math.ceil(text.length / 3.5));
    }

    normalizeHandle(username: string): string {
        const clean = String(username || 'personel')
            .trim()
            .replace(/^@+/, '');
        return `@${clean || 'personel'}`;
    }

    /**
     * Escapes closing evidence tags so untrusted DB rows can never break out of <untrusted_case_evidence>.
     */
    sanitizeEvidenceText(raw: string): string {
        return String(raw || '').replace(/<\/?untrusted_case_evidence>/gi, '[evidence-tag-escaped]');
    }

    buildSystemPrompt(actor: CoserseActorContext): string {
        const handle = this.normalizeHandle(actor.username);
        const isSuperadmin = String(actor.role || '').toLowerCase().trim() === 'superadmin';
        const progCapability = isSuperadmin
            ? '[CAPABILITY: PROGRAMMING=ALLOWED]'
            : '[CAPABILITY: PROGRAMMING=FORBIDDEN]';
        return [
            `Pengguna Aktif: ${handle} (${actor.displayName}, Role: ${actor.role}, Scope: ${actor.scopeMode}${actor.satkerId ? `, Satker ID: ${actor.satkerId}` : ''}).`,
            progCapability,
            `Sapa ${handle} secara kolegial, gunakan hanya fakta di <untrusted_case_evidence>, jangan mengarang data, dan JANGAN menambahkan footer/kalimat disclaimer di akhir jawaban.`
        ].join('\n');
    }

    /**
     * Wraps Tahap 1 Cross-Entity Profiling output in strict <untrusted_case_evidence> XML isolation tags.
     */
    buildEvidenceXmlBlock(profile: Pick<CrossEntityProfileResponse, 'query' | 'scope' | 'summary' | 'records'>): string {
        const compactRecords = profile.records.slice(0, 15).map((r) => ({
            no_laporan: r.no_laporan,
            tgl_laporan: r.tgl_laporan,
            status_perkara: r.status_perkara,
            satker_nama: r.satker_nama,
            kategori_kejahatan: r.kategori_kejahatan,
            peran_entitas: r.peran_entitas,
            sumber_tabel: r.sumber_tabel,
            detail_konteks: r.detail_konteks,
            nama_tercatat: r.nama_tercatat,
            nik: r.nik,
            no_hp: r.no_hp
        }));

        const payload = {
            query: profile.query,
            scope: profile.scope,
            summary: profile.summary,
            records: compactRecords
        };

        const sanitizedJson = this.sanitizeEvidenceText(JSON.stringify(payload, null, 2));
        return `<untrusted_case_evidence>\n${sanitizedJson}\n</untrusted_case_evidence>`;
    }

    buildCasEvidenceXmlBlock(
        chunks?: Array<{ doc_title: string; section_title: string; pasal_ref: string | null; content: string }> | null
    ): string {
        if (!Array.isArray(chunks) || chunks.length === 0) return '';
        const items = chunks.slice(0, 2).map((c) => ({
            regulasi: c.doc_title,
            bagian: c.section_title,
            pasal: c.pasal_ref,
            isi: c.content
        }));
        return `<cas_evidence>\n${this.sanitizeEvidenceText(JSON.stringify(items))}\n</cas_evidence>`;
    }

    ensureMandatoryDisclaimer(rawReply: string, username: string): string {
        const handle = this.normalizeHandle(username);
        let text = String(rawReply || '').trim();

        // Ensure @username is naturally present if an LLM slipped into generic reply
        if (text && !text.toLowerCase().includes(handle.toLowerCase())) {
            text = `Siap ${handle}, ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
        }

        // Strip any disclaimer lines baked into Modelfile output (UI already renders 1 static disclaimer below composer)
        const escapedDisclaimer = COSERSE_MANDATORY_DISCLAIMER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const tailPattern = new RegExp(`(?:\\n|>|\\s|_|-)*${escapedDisclaimer}(?:\\s|_)*$`, 'gi');
        text = text.replace(tailPattern, '').trim();

        return text;
    }

    private resolveNumPredict(tier?: string): number {
        const t = String(tier || 'low').toLowerCase().trim();
        if (t === 'high' || t === 'pro' || t === 'deep') {
            return Math.max(2048, Number(process.env.COSERSE_NUM_PREDICT_HIGH || 2048));
        }
        return Math.max(800, Number(process.env.COSERSE_NUM_PREDICT_LOW || 1024));
    }

    async probeRuntimeHealth(): Promise<CoserseRuntimeHealth> {
        const provider = this.getRuntimeProvider();
        const endpoint = this.getEndpointUrl();
        const tagsUrl = this.getTagsEndpointUrl();
        const model = this.getModelName();

        try {
            const resp = await axios.get(tagsUrl, { timeout: 2500 });
            const modelsRaw =
                provider === 'llamacpp'
                    ? resp.data?.data || []
                    : resp.data?.models || [];
            const availableModels: string[] = Array.isArray(modelsRaw)
                ? modelsRaw.map((m: any) => String(m?.name || m?.id || '')).filter(Boolean)
                : [];
            const coserseReady = availableModels.some(
                (name) => name === model || name.startsWith(`${model}:`)
            );

            return {
                provider,
                endpoint,
                model,
                loopback_enforced: true,
                engine_reachable: true,
                coserse_model_ready: coserseReady,
                available_models: availableModels,
                offline_fallback_enabled: this.isOfflineFallbackEnabled()
            };
        } catch (err: any) {
            return {
                provider,
                endpoint,
                model,
                loopback_enforced: true,
                engine_reachable: false,
                coserse_model_ready: false,
                available_models: [],
                offline_fallback_enabled: this.isOfflineFallbackEnabled(),
                error: err?.code || err?.message || 'UNREACHABLE'
            };
        }
    }

    async generateNarrative(params: {
        actor: CoserseActorContext;
        userMessage: string;
        slidingTurns: CoserseChatTurn[];
        profilingContext?: CrossEntityProfileResponse | null;
        knowledgeChunks?: Array<{ doc_title: string; section_title: string; pasal_ref: string | null; content: string }> | null;
        endpointOverride?: string;
        tier?: string;
    }): Promise<CoserseLlmGenerationResult> {
        const provider = this.getRuntimeProvider();
        const endpoint = params.endpointOverride
            ? this.assertLoopbackUrl(params.endpointOverride)
            : this.getEndpointUrl();
        const model = this.getModelName();
        const timeoutMs = Number(process.env.COSERSE_LLM_TIMEOUT_MS || 150_000);
        const numCtx = Number(process.env.COSERSE_NUM_CTX || 4096);
        const temperature = Number(process.env.COSERSE_TEMPERATURE ?? 0.1);
        const numThread = Number(process.env.COSERSE_NUM_THREAD || 6);
        const numPredict = this.resolveNumPredict(params.tier);
        const handle = this.normalizeHandle(params.actor.username);

        const systemPrompt = this.buildSystemPrompt(params.actor);
        const evidenceXml = params.profilingContext
            ? this.buildEvidenceXmlBlock(params.profilingContext)
            : '';
        const casKnowledgeXml = this.buildCasEvidenceXmlBlock(params.knowledgeChunks);

        const parts: string[] = [`Permintaan ${handle}: ${params.userMessage}`];
        if (evidenceXml) {
            parts.push(
                '',
                `Rangkum temuan di bawah ini menjadi narasi intelijen perkara yang luwes, akurat, dan terstruktur untuk ${handle}:`,
                evidenceXml
            );
        }
        if (casKnowledgeXml) {
            parts.push(
                '',
                `Gunakan referensi pasal/SOP resmi dalam <cas_evidence> berikut sebagai dasar hukum jawaban Anda:`,
                casKnowledgeXml
            );
        }
        const userTurnContent = parts.join('\n');

        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
            { role: 'system', content: systemPrompt },
            ...params.slidingTurns.slice(-6).map((t) => ({
                role: t.role,
                content: t.content
            })),
            { role: 'user', content: userTurnContent }
        ];

        const startedAt = Date.now();

        try {
            if (provider === 'llamacpp') {
                const resp = await axios.post(
                    endpoint,
                    {
                        model,
                        messages,
                        temperature,
                        max_tokens: 1024,
                        stream: false
                    },
                    { timeout: timeoutMs }
                );
                const rawReply = String(resp.data?.choices?.[0]?.message?.content || '').trim();
                const reply = this.ensureMandatoryDisclaimer(rawReply, params.actor.username);
                const promptTokens = Number(
                    resp.data?.usage?.prompt_tokens || this.estimateMessagesTokens(messages)
                );
                const completionTokens = Number(
                    resp.data?.usage?.completion_tokens || this.estimateTokens(reply)
                );

                return {
                    reply,
                    provider: 'llamacpp',
                    model,
                    latencyMs: Date.now() - startedAt,
                    promptTokens,
                    completionTokens,
                    totalTokens: promptTokens + completionTokens,
                    xmlEvidenceIsolated: Boolean(evidenceXml),
                    offlineNotice: null
                };
            }

            // Default: Ollama /api/chat (Modelfile: coserse:1.0)
            const resp = await axios.post(
                endpoint,
                {
                    model,
                    messages,
                    stream: false,
                    keep_alive: -1,
                    options: {
                        temperature,
                        num_ctx: numCtx,
                        num_thread: numThread,
                        num_predict: numPredict
                    }
                },
                { timeout: timeoutMs }
            );

            const rawReply = String(resp.data?.message?.content || '').trim();
            const reply = this.ensureMandatoryDisclaimer(rawReply, params.actor.username);
            const promptTokens = Number(
                resp.data?.prompt_eval_count || this.estimateMessagesTokens(messages)
            );
            const completionTokens = Number(
                resp.data?.eval_count || this.estimateTokens(reply)
            );

            return {
                reply,
                provider: 'ollama',
                model: String(resp.data?.model || model),
                latencyMs: Date.now() - startedAt,
                promptTokens,
                completionTokens,
                totalTokens: promptTokens + completionTokens,
                xmlEvidenceIsolated: Boolean(evidenceXml),
                offlineNotice: null
            };
        } catch (err: any) {
            const errCode = err?.code || err?.cause?.code || '';
            const errMsg = err?.response?.data?.error || err?.message || 'Koneksi engine lokal gagal';
            const isConnectionError =
                errCode === 'ECONNREFUSED' ||
                errCode === 'ETIMEDOUT' ||
                errCode === 'ECONNRESET' ||
                errCode === 'ENOTFOUND' ||
                String(errMsg).includes('ECONNREFUSED') ||
                String(errMsg).includes('timeout');

            if (isConnectionError && this.isOfflineFallbackEnabled()) {
                this.logger.warn(
                    `Engine lokal ${endpoint} belum aktif (${errCode || errMsg}); menjalankan fallback deterministik sandbox.`
                );
                const fallbackText = this.buildDeterministicHumanNarrative(
                    params.actor,
                    params.userMessage,
                    params.profilingContext
                );
                const reply = this.ensureMandatoryDisclaimer(fallbackText, params.actor.username);
                const promptTokens = this.estimateMessagesTokens(messages);
                const completionTokens = this.estimateTokens(reply);

                return {
                    reply,
                    provider: 'deterministic_fallback',
                    model: `${model} (offline-fallback)`,
                    latencyMs: Date.now() - startedAt,
                    promptTokens,
                    completionTokens,
                    totalTokens: promptTokens + completionTokens,
                    xmlEvidenceIsolated: Boolean(evidenceXml),
                    offlineNotice: `Engine lokal ${endpoint} sedang tidak aktif (${errCode || errMsg}). Ringkasan disusun langsung dari data terindeks BDB tanpa inferensi Qwen 2.5.`
                };
            }

            if (err instanceof ForbiddenException) {
                throw err;
            }

            throw new ServiceUnavailableException({
                status: 0,
                code: 'COSERSE_LOCAL_ENGINE_UNREACHABLE',
                message: `Siap ${handle}, engine AI lokal Coserse 1.0 di ${endpoint} belum merespons (${errCode || errMsg}). Pastikan Ollama / Llama.cpp lokal aktif dengan model "${model}" (jalankan backend/coserse_runtime/setup_coserse_local.ps1).`,
                endpoint,
                model
            });
        }
    }

    async generateNarrativeStream(params: {
        actor: CoserseActorContext;
        userMessage: string;
        slidingTurns: CoserseChatTurn[];
        profilingContext?: CrossEntityProfileResponse | null;
        knowledgeChunks?: Array<{ doc_title: string; section_title: string; pasal_ref: string | null; content: string }> | null;
        endpointOverride?: string;
        tier?: string;
        onToken?: (delta: string) => void;
    }): Promise<CoserseLlmGenerationResult> {
        const provider = this.getRuntimeProvider();
        const endpoint = params.endpointOverride
            ? this.assertLoopbackUrl(params.endpointOverride)
            : this.getEndpointUrl();
        const model = this.getModelName();
        const timeoutMs = Number(process.env.COSERSE_LLM_TIMEOUT_MS || 150_000);
        const numCtx = Number(process.env.COSERSE_NUM_CTX || 4096);
        const temperature = Number(process.env.COSERSE_TEMPERATURE ?? 0.1);
        const numThread = Number(process.env.COSERSE_NUM_THREAD || 6);
        const numPredict = this.resolveNumPredict(params.tier);
        const handle = this.normalizeHandle(params.actor.username);

        const systemPrompt = this.buildSystemPrompt(params.actor);
        const evidenceXml = params.profilingContext
            ? this.buildEvidenceXmlBlock(params.profilingContext)
            : '';
        const casKnowledgeXml = this.buildCasEvidenceXmlBlock(params.knowledgeChunks);

        const parts: string[] = [`Permintaan ${handle}: ${params.userMessage}`];
        if (evidenceXml) {
            parts.push(
                '',
                `Rangkum temuan di bawah ini menjadi narasi intelijen perkara yang luwes, akurat, dan terstruktur untuk ${handle}:`,
                evidenceXml
            );
        }
        if (casKnowledgeXml) {
            parts.push(
                '',
                `Gunakan referensi pasal/SOP resmi dalam <cas_evidence> berikut sebagai dasar hukum jawaban Anda:`,
                casKnowledgeXml
            );
        }
        const userTurnContent = parts.join('\n');

        const recentTurns = (params.slidingTurns || []).slice(-6).map((t) => ({
            role: t.role,
            content: String(t.content || '').slice(0, 1800)
        }));

        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
            { role: 'system', content: systemPrompt },
            ...recentTurns,
            { role: 'user', content: userTurnContent }
        ];

        const startedAt = Date.now();

        if (provider === 'llamacpp') {
            const res = await this.generateNarrative(params);
            if (params.onToken && res.reply) {
                params.onToken(res.reply);
            }
            return res;
        }

        try {
            const resp = await axios.post(
                endpoint,
                {
                    model,
                    messages,
                    stream: true,
                    keep_alive: -1,
                    options: {
                        temperature,
                        num_ctx: numCtx,
                        num_thread: numThread,
                        num_predict: numPredict
                    }
                },
                {
                    timeout: timeoutMs,
                    responseType: 'stream'
                }
            );

            let rawReply = '';
            let resolvedModel = model;
            let promptEvalCount = 0;
            let evalCount = 0;

            const stream = resp.data;
            if (stream && typeof stream.on === 'function') {
                await new Promise<void>((resolve, reject) => {
                    let buffer = '';
                    stream.on('data', (chunk: Buffer | string) => {
                        buffer += chunk.toString('utf8');
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || '';
                        for (const line of lines) {
                            const trimmed = line.trim();
                            if (!trimmed) continue;
                            try {
                                const parsed = JSON.parse(trimmed);
                                if (parsed?.model) {
                                    resolvedModel = String(parsed.model);
                                }
                                const delta = parsed?.message?.content;
                                if (typeof delta === 'string' && delta.length > 0) {
                                    rawReply += delta;
                                    if (params.onToken) {
                                        params.onToken(delta);
                                    }
                                }
                                if (parsed?.done) {
                                    if (parsed?.prompt_eval_count) {
                                        promptEvalCount = Number(parsed.prompt_eval_count);
                                    }
                                    if (parsed?.eval_count) {
                                        evalCount = Number(parsed.eval_count);
                                    }
                                }
                            } catch {
                                // Ignore incomplete/non-JSON line fragments
                            }
                        }
                    });
                    stream.on('end', () => {
                        const trimmed = buffer.trim();
                        if (trimmed) {
                            try {
                                const parsed = JSON.parse(trimmed);
                                const delta = parsed?.message?.content;
                                if (typeof delta === 'string' && delta.length > 0) {
                                    rawReply += delta;
                                    if (params.onToken) {
                                        params.onToken(delta);
                                    }
                                }
                                if (parsed?.prompt_eval_count) {
                                    promptEvalCount = Number(parsed.prompt_eval_count);
                                }
                                if (parsed?.eval_count) {
                                    evalCount = Number(parsed.eval_count);
                                }
                            } catch {
                                // ignore
                            }
                        }
                        resolve();
                    });
                    stream.on('error', (err: any) => reject(err));
                });
            } else if (resp.data?.message?.content) {
                rawReply = String(resp.data.message.content || '').trim();
                if (params.onToken && rawReply) {
                    params.onToken(rawReply);
                }
                promptEvalCount = Number(resp.data?.prompt_eval_count || 0);
                evalCount = Number(resp.data?.eval_count || 0);
            }

            const reply = this.ensureMandatoryDisclaimer(rawReply, params.actor.username);
            const promptTokens = promptEvalCount || this.estimateMessagesTokens(messages);
            const completionTokens = evalCount || this.estimateTokens(reply);

            return {
                reply,
                provider: 'ollama',
                model: resolvedModel,
                latencyMs: Date.now() - startedAt,
                promptTokens,
                completionTokens,
                totalTokens: promptTokens + completionTokens,
                xmlEvidenceIsolated: Boolean(evidenceXml),
                offlineNotice: null
            };
        } catch (err: any) {
            const errCode = err?.code || err?.cause?.code || '';
            const errMsg = err?.response?.data?.error || err?.message || 'Koneksi engine lokal gagal';
            const isConnectionError =
                errCode === 'ECONNREFUSED' ||
                errCode === 'ETIMEDOUT' ||
                errCode === 'ECONNRESET' ||
                errCode === 'ENOTFOUND' ||
                String(errMsg).includes('ECONNREFUSED') ||
                String(errMsg).includes('timeout');

            if (isConnectionError && this.isOfflineFallbackEnabled()) {
                this.logger.warn(
                    `Engine lokal ${endpoint} belum aktif (${errCode || errMsg}); menjalankan fallback deterministik sandbox.`
                );
                const fallbackText = this.buildDeterministicHumanNarrative(
                    params.actor,
                    params.userMessage,
                    params.profilingContext
                );
                const reply = this.ensureMandatoryDisclaimer(fallbackText, params.actor.username);
                if (params.onToken) {
                    params.onToken(reply);
                }
                const promptTokens = this.estimateMessagesTokens(messages);
                const completionTokens = this.estimateTokens(reply);

                return {
                    reply,
                    provider: 'deterministic_fallback',
                    model: `${model} (offline-fallback)`,
                    latencyMs: Date.now() - startedAt,
                    promptTokens,
                    completionTokens,
                    totalTokens: promptTokens + completionTokens,
                    xmlEvidenceIsolated: Boolean(evidenceXml),
                    offlineNotice: `Engine lokal ${endpoint} sedang tidak aktif (${errCode || errMsg}). Ringkasan disusun langsung dari data terindeks BDB tanpa inferensi Qwen 2.5.`
                };
            }

            if (err instanceof ForbiddenException) {
                throw err;
            }

            throw new ServiceUnavailableException({
                status: 0,
                code: 'COSERSE_LOCAL_ENGINE_UNREACHABLE',
                message: `Siap ${handle}, engine AI lokal Coserse 1.0 di ${endpoint} belum merespons (${errCode || errMsg}). Pastikan Ollama / Llama.cpp lokal aktif dengan model "${model}" (jalankan backend/coserse_runtime/setup_coserse_local.ps1).`,
                endpoint,
                model
            });
        }
    }

    private estimateMessagesTokens(messages: Array<{ content: string }>): number {
        return messages.reduce((sum, m) => sum + this.estimateTokens(m.content), 0);
    }

    private buildDeterministicHumanNarrative(
        actor: CoserseActorContext,
        _userMessage: string,
        profiling?: CrossEntityProfileResponse | null
    ): string {
        const handle = this.normalizeHandle(actor.username);

        if (!profiling) {
            return [
                `Halo ${handle}, ada yang bisa saya bantu hari ini? Anda bisa menanyakan riwayat keterlibatan perkara (**NIK**, **Nomor HP**, atau **Nama**), mengunggah berkas mindik untuk diperiksa, atau berkonsultasi seputar aturan penyidikan.`
            ].join('\n\n');
        }

        const summary: CrossEntityProfileSummary = profiling.summary;
        const records: CrossEntityMatchRecord[] = profiling.records || [];
        const label =
            profiling.query.niks[0] ||
            profiling.query.phones[0]?.local08 ||
            profiling.query.names[0] ||
            profiling.query.raw;

        if (!records.length) {
            return `Siap ${handle}, saya sudah menelusuri register Pihak Terlibat dan Barang Bukti untuk **${label}** sesuai cakupan akses Anda (${profiling.scope.mode}), dan sejauh ini **belum ditemukan catatan keterlibatan LP** yang cocok.`;
        }

        const topRoles = Object.entries(summary.roles_breakdown)
            .map(([role, count]) => `${role} (${count}x)`)
            .join(', ');
        const lines: string[] = [
            `Siap ${handle}, berikut rangkuman intelijen penelusuran lintas perkara untuk **${label}**:`,
            `Subjek terdeteksi terhubung pada **${summary.total_lp} Laporan Polisi** (${summary.total_terlibat_matches} catatan di Pihak Terlibat dan ${summary.total_barang_bukti_matches} di Barang Bukti), dengan komposisi peran: ${topRoles || 'TERLIBAT'}.`,
            ``,
            `**Rincian LP Terkait:**`
        ];

        records.slice(0, 8).forEach((r, idx) => {
            lines.push(
                `${idx + 1}. **${r.no_laporan}** (Tanggal ${r.tgl_laporan}) — Satker **${r.satker_nama}**, Kategori *${r.kategori_kejahatan}*, Status **${r.status_perkara}**. Tercatat sebagai **${r.peran_entitas}** pada \`${r.sumber_tabel}\` (${r.detail_konteks}).`
            );
        });

        if (records.length > 8) {
            lines.push(`...dan ${records.length - 8} catatan LP tambahan lainnya dalam jangkauan Anda.`);
        }

        return lines.join('\n');
    }
}
