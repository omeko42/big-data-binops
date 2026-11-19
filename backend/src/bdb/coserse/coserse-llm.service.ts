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
            `Sapa ${handle} secara kolegial, gunakan hanya fakta di <untrusted_case_evidence>, jangan mengarang data, dan JANGAN menambahkan footer/kalimat disclaimer di akhir jawaban.`,
            `LARANGAN KLAIM UPDATE DB: DILARANG KERAS mengatakan "telah diperbarui", "berhasil diubah", "sudah diupdate", atau mengklaim status LP di database sudah berubah jika tidak ada bukti hasil commit sukses di <cas_evidence>. Jika user meminta update status LP tanpa bukti commit sukses, wajib arahkan ke kartu konfirmasi (reviewCard) Human-in-the-Loop terlebih dahulu sebelum status berubah.`
        ].join('\n');
    }

    /**
     * Wraps Tahap 1 Cross-Entity Profiling output in strict <untrusted_case_evidence> XML isolation tags.
     */
    buildEvidenceXmlBlock(
        profile: Pick<
            CrossEntityProfileResponse,
            'query' | 'scope' | 'summary' | 'records' | 'discovery_groups' | 'active_group'
        >
    ): string {
        const toCompactRow = (r: CrossEntityMatchRecord): Record<string, any> => {
            const item: Record<string, any> = {
                sumber: r.sumber_tabel,
                no_lp: r.no_laporan,
                tgl: r.tgl_laporan,
                status: r.status_perkara,
                satker: r.satker_nama,
                peran: r.peran_entitas
            };
            if (r.nama_tercatat) item.nama = String(r.nama_tercatat).slice(0, 50);
            if (r.nik) item.nik = r.nik;
            if (r.no_hp) item.hp = r.no_hp;
            if (r.detail_konteks && r.detail_konteks !== '-') {
                item.detail = r.detail_konteks.slice(0, 65);
            }
            return item;
        };

        const groups = Array.isArray(profile.discovery_groups) ? profile.discovery_groups : [];
        const hasMultipleGroups = groups.length >= 2 && !profile.active_group;

        const kelompokTemuan = groups.slice(0, 6).map((g) => ({
            group_id: g.group_id,
            label: g.label,
            source_table: g.source_table,
            total_count: g.total_count,
            ...(g.breakdown && Object.keys(g.breakdown).length ? { breakdown: g.breakdown } : {}),
            ...(hasMultipleGroups
                ? { sample_rows: (g.records || []).slice(0, 2).map(toCompactRow) }
                : {})
        }));

        let compactRecords: Array<Record<string, any>> = [];
        if (!hasMultipleGroups) {
            const terlibatRecs = profile.records.filter((r) => r.sumber_tabel === 'bdb_dors_lp_terlibat');
            const otherRecs = profile.records.filter((r) => r.sumber_tabel !== 'bdb_dors_lp_terlibat');
            const prioritized = [...terlibatRecs.slice(0, 5), ...otherRecs.slice(0, 3)];
            if (prioritized.length < 6) {
                const used = new Set(prioritized);
                for (const r of profile.records) {
                    if (!used.has(r)) {
                        prioritized.push(r);
                        if (prioritized.length >= 6) break;
                    }
                }
            }
            compactRecords = prioritized.slice(0, 6).map(toCompactRow);
        }

        const satkers = Array.isArray(profile.summary?.satkers_involved) ? profile.summary.satkers_involved : [];
        const totalTerlibat = Number(profile.summary?.total_terlibat_matches || 0);
        const totalBb = Number(profile.summary?.total_barang_bukti_matches || 0);
        const totalRiil = Number(profile.summary?.total_records || totalTerlibat + totalBb);

        const payload: Record<string, any> = {
            query: profile.query?.raw || profile.query,
            scope: profile.scope?.mode || 'NATIONAL',
            FOKUS_GRUP_AKTIF: profile.active_group || null,
            TOTAL_RIIL_DI_DATABASE: totalRiil,
            TOTAL_PIHAK_TERLIBAT_RIIL: totalTerlibat,
            TOTAL_BARANG_BUKTI_RIIL: totalBb,
            RINCIAN_PERAN_RIIL: profile.summary?.roles_breakdown || {},
            SATKER_SAMPEL: satkers.slice(0, 8),
            KELOMPOK_TEMUAN_DATABASE: kelompokTemuan,
            CATATAN: `Gunakan angka total_count di KELOMPOK_TEMUAN_DATABASE / TOTAL_RIIL_DI_DATABASE (JANGAN menghitung dari panjang sample_rows).`,
            SAMPEL_TERBARU: compactRecords
        };

        const sanitizedJson = this.sanitizeEvidenceText(JSON.stringify(payload));
        return `<untrusted_case_evidence>\n${sanitizedJson}\n</untrusted_case_evidence>`;
    }

    private buildUserTurnPromptContent(params: {
        handle: string;
        userMessage: string;
        profilingContext?: CrossEntityProfileResponse | null;
        knowledgeChunks?: Array<{ doc_title: string; section_title: string; pasal_ref: string | null; content: string }> | null;
    }): { userTurnContent: string; hasEvidence: boolean } {
        const evidenceXml = params.profilingContext ? this.buildEvidenceXmlBlock(params.profilingContext) : '';
        const casKnowledgeXml = this.buildCasEvidenceXmlBlock(params.knowledgeChunks);
        const groups = Array.isArray(params.profilingContext?.discovery_groups)
            ? params.profilingContext!.discovery_groups!
            : [];
        const hasMultiGroups = groups.length >= 2 && !params.profilingContext?.active_group;

        const hasUpdateIntent =
            /\b(ubah|update|ganti|set|naikkan|turunkan|proses|ajukan|hentikan)\b/i.test(params.userMessage) &&
            /\b(status|tahap|spdp|p19|p21|sp3|sp2|lidik|sidik|perma|rj|restorative)\b/i.test(params.userMessage);

        const parts: string[] = [`Permintaan ${params.handle}: ${params.userMessage}`];
        const rawStyle = String((params as any).responseStyle || 'ringkas').toLowerCase().trim();
        const isDetailMode = rawStyle === 'detail' || rawStyle === 'detailed';
        const rawExecMode = String((params as any).executionMode || 'request_review').toLowerCase().trim();
        const execModeLabel =
            rawExecMode === 'turbo'
                ? 'TURBO'
                : rawExecMode === 'auto'
                ? 'AUTO'
                : rawExecMode === 'default'
                ? 'DEFAULT'
                : 'REQUEST_REVIEW';
        parts.push(
            '',
            `[MODE_EKSEKUSI: ${execModeLabel} — DILARANG KERAS mengarang data dummy/fiktif (seperti POLRES DUMMY, LP/B/001/DUMMY, atau nama/nomor LP karangan) apabila pengguna baru bertanya kemampuan atau belum menyebutkan Nomor LP nyata. Jika butuh Nomor LP/dokumen, minta langsung ke pengguna secara ringkas.]`,
            isDetailMode
                ? '[MODE_JAWABAN: LENGKAP_DAN_DETAIL — Uraikan secara komprehensif: ringkasan eksekutif, tabel lengkap seluruh temuan, detail modus/uraian perkara, dasar hukum/pasal terkait, relasi entitas, serta saran tindak lanjut penyidik.]'
                : '[MODE_JAWABAN: RINGKAS_DAN_PADAT — Jawab langsung ke inti dalam 3–5 poin singkat atau 1 tabel ringkas tanpa basa-basi/paragraf panjang.]'
        );
        if (hasUpdateIntent) {
            parts.push(
                '',
                `PERINGATAN KERAS ANTI-HALUSINASI: Permintaan pengguna ini adalah usulan perubahan status LP. Database BELUM diubah dan TIDAK ada bukti commit sukses di <cas_evidence>. DILARANG KERAS mengatakan status LP "telah diperbarui", "sudah berubah", atau "berhasil diubah". Wajib nyatakan bahwa status di database BELUM berubah dan arahkan operator untuk meninjau lalu mengklik [Setujui & Simpan] pada Kartu Konfirmasi Draf (reviewCard).`
            );
        }
        if (evidenceXml) {
            parts.push(
                '',
                hasMultiGroups
                    ? `Jawab langsung pertanyaan pengguna secara ringkas, jelas, dan faktual berdasarkan <untrusted_case_evidence> tanpa kalimat pembuka template. WAJIB rangkum seluruh kelompok temuan pada KELOMPOK_TEMUAN_DATABASE (Data A, Data B, Data C, dst.) beserta angka total_count riil masing-masing dan sampel tabel Markdown ringkasnya, lalu tanyakan balik kepada pengguna konteks mana yang ingin difokuskan (mis. pilih Data A/B/C, filter peran, urutkan terbaru/terlama, atau ekspor PDF/Word/PPT/Excel):`
                    : `Jawab langsung pertanyaan pengguna secara ringkas, jelas, dan faktual berdasarkan data bukti berikut (tanpa kalimat pembuka template). WAJIB kutip angka TOTAL_RIIL_DI_DATABASE dan seluruh angka di RINCIAN_PERAN_RIIL secara persis (JANGAN menghitung dari panjang array sample_rows/SAMPEL_TERBARU), lalu tampilkan tabel Markdown SAMPEL_TERBARU:`,
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
        return { userTurnContent: parts.join('\n'), hasEvidence: Boolean(evidenceXml) };
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
            if (/^\s*\|/.test(text) || /^#{1,4}\s/.test(text) || /^[-*•]\s/.test(text)) {
                text = `Siap ${handle},\n\n${text}`;
            } else {
                text = `Siap ${handle}, ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
            }
        }

        // Strip any disclaimer lines baked into Modelfile output (UI already renders 1 static disclaimer below composer)
        const escapedDisclaimer = COSERSE_MANDATORY_DISCLAIMER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const tailPattern = new RegExp(`(?:\\n|>|\\s|_|-)*${escapedDisclaimer}(?:\\s|_)*$`, 'gi');
        text = text.replace(tailPattern, '').trim();

        return this.repairInlineMarkdownTables(text);
    }

    /**
     * Memperbaiki tabel Markdown yang "menyatu dalam 1 baris" (mis. `| No | Nama | |---|---| | 1 | A |`)
     * menjadi baris-baris terpisah, serta menyisipkan baris kosong sebelum tabel yang menempel pada paragraf.
     */
    repairInlineMarkdownTables(input: string): string {
        const SEP_CELL = /^\s*:?-{3,}:?\s*$/;
        const SEP_LINE = /^\s*\|(?:\s*:?-{1,}:?\s*\|)+\s*$/;
        const rawLines = String(input || '').split(/\r?\n/);
        const lines: string[] = [];
        for (const rl of rawLines) {
            if (/^\s*\|/.test(rl) || (/\|\s*:?-{3,}:?\s*\|/.test(rl) && (rl.match(/\|/g) || []).length >= 6)) {
                lines.push(rl.replace(/<br\s*\/?>/gi, '; '));
            } else if (/<br\s*\/?>/i.test(rl)) {
                for (const part of rl.replace(/<br\s*\/?>/gi, '\n').split('\n')) {
                    lines.push(part);
                }
            } else {
                lines.push(rl);
            }
        }
        const out: string[] = [];
        for (let idx = 0; idx < lines.length; idx++) {
            const line = lines[idx];
            const firstPipe = line.indexOf('|');
            const looksMerged = firstPipe >= 0 && /\|\s*:?-{3,}:?\s*\|/.test(line) && (line.match(/\|/g) || []).length >= 6;
            if (!looksMerged) {
                // Jika kalimat pembuka menempel di baris header tabel ("Siap @user, | No | ... |")
                // sementara baris berikutnya adalah separator tabel ("|---|---|"), pisahkan dengan \n\n.
                if (firstPipe > 0 && idx + 1 < lines.length && SEP_LINE.test(lines[idx + 1])) {
                    const pref = line.slice(0, firstPipe).trim();
                    const tblHdr = line.slice(firstPipe).trim();
                    if (pref) out.push(pref, '');
                    out.push(tblHdr);
                    continue;
                }
                if (
                    /^\s*\|/.test(line) &&
                    idx + 1 < lines.length &&
                    SEP_LINE.test(lines[idx + 1]) &&
                    out.length > 0 &&
                    out[out.length - 1].trim() &&
                    !out[out.length - 1].trim().startsWith('|')
                ) {
                    out.push('');
                }
                out.push(line);
                continue;
            }
            const prefix = line.slice(0, firstPipe).trim();
            const cells = line.slice(firstPipe).trim().replace(/^\|/, '').replace(/\|$/, '').split('|');
            const sepStart = cells.findIndex((c) => SEP_CELL.test(c));
            if (sepStart <= 0) {
                out.push(line);
                continue;
            }
            let sepLen = 0;
            while (sepStart + sepLen < cells.length && SEP_CELL.test(cells[sepStart + sepLen])) sepLen++;
            let header = cells.slice(0, sepStart);
            if (header.length === sepLen + 1 && !header[header.length - 1].trim()) header = header.slice(0, -1);
            if (header.length !== sepLen) {
                out.push(line);
                continue;
            }
            const n = sepLen;
            const rest = cells.slice(sepStart + n);
            const rows: string[][] = [];
            let ok = true;
            if (rest.length % (n + 1) === 0) {
                // Pola gabungan: setiap baris diawali sel pemisah kosong ("| |" atau "||").
                for (let i = 0; i < rest.length; i += n + 1) {
                    if (rest[i].trim()) {
                        ok = false;
                        break;
                    }
                    rows.push(rest.slice(i + 1, i + 1 + n));
                }
            } else if (rest.length % n === 0) {
                for (let i = 0; i < rest.length; i += n) rows.push(rest.slice(i, i + n));
            } else {
                ok = false;
            }
            if (!ok) {
                out.push(line);
                continue;
            }
            if (prefix) out.push(prefix, '');
            else if (out.length && out[out.length - 1].trim() && !out[out.length - 1].trim().startsWith('|')) out.push('');
            out.push(`| ${header.map((c) => c.trim()).join(' | ')} |`);
            out.push(`|${cells.slice(sepStart, sepStart + n).map((c) => c.trim()).join('|')}|`);
            for (const r of rows) out.push(`| ${r.map((c) => c.trim()).join(' | ')} |`);
        }
        return out.join('\n');
    }

    guardUncommittedStatusClaim(rawReply: string, userMessage: string, hasReviewCard: boolean): string {
        const msg = String(userMessage || '');
        const hasUpdateIntent =
            /\b(ubah|update|ganti|set|naikkan|turunkan|proses|ajukan|hentikan)\b/i.test(msg) &&
            /\b(status|tahap|spdp|p19|p21|sp3|sp2|lidik|sidik|perma|rj|restorative)\b/i.test(msg);
        if (!hasUpdateIntent) return rawReply;

        const falseSuccessPattern =
            /\b(?:telah|sudah|berhasil)\s+(?:diperbarui|diubah|dirubah|berubah|dinaikkan|disimpan)(?:\s+(?:menjadi|ke))?\b|\b(?:berhasil|telah|sudah)\s+(?:memperbarui|mengubah|menaikkan|menyimpan)\s+(?:status|tahap|lp)\b/i;
        if (!falseSuccessPattern.test(rawReply)) {
            return rawReply;
        }
        const cleaned = rawReply
            .replace(
                /(?:status(?:\s+lp)?[^\n]{0,120}?)\b(?:telah|sudah|berhasil)\s+(?:diperbarui|diubah|dirubah|berubah|dinaikkan|disimpan)(?:\s+(?:menjadi|ke)\s+[^\n]+)?/gi,
                'usulan pembaruan status LP **belum tersimpan di database** (menunggu konfirmasi Human-in-the-Loop)'
            )
            .replace(
                /\b(?:telah|sudah|berhasil)\s+(?:diperbarui|diubah|dirubah|berubah|dinaikkan|disimpan)(?:\s+(?:menjadi|ke)\s+[^\n]+)?/gi,
                '**belum tersimpan di database** (menunggu konfirmasi Human-in-the-Loop)'
            )
            .replace(
                /\b(?:berhasil|telah|sudah)\s+(?:memperbarui|mengubah|menaikkan|menyimpan)\s+(?:status|tahap|lp)\b/gi,
                'menyiapkan usulan pembaruan status (belum tersimpan di database)'
            );
        const note = hasReviewCard
            ? '\n\n> **Catatan Sistem (Human-in-the-Loop):** Status LP di database **BELUM berubah**. Silakan periksa **Kartu Konfirmasi Draf (`reviewCard`)** di bawah ini lalu klik **[Setujui & Simpan]** untuk menyimpan perubahan secara resmi.'
            : '\n\n> **Catatan Sistem (Human-in-the-Loop):** Status LP di database **BELUM berubah**. Silakan unggah dokumen Mindik pendukung (`.docx`/`.pdf`/gambar) agar **Kartu Konfirmasi Draf** terbentuk untuk persetujuan.';
        return cleaned.includes('BELUM berubah') ? cleaned : `${cleaned}${note}`;
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
        responseStyle?: string;
        executionMode?: string;
    }): Promise<CoserseLlmGenerationResult> {
        const provider = this.getRuntimeProvider();
        const endpoint = params.endpointOverride
            ? this.assertLoopbackUrl(params.endpointOverride)
            : this.getEndpointUrl();
        const model = this.getModelName();
        const timeoutMs = Number(process.env.COSERSE_LLM_TIMEOUT_MS || 240_000);
        const numCtx = Number(process.env.COSERSE_NUM_CTX || 4096);
        const temperature = Number(process.env.COSERSE_TEMPERATURE ?? 0.1);
        const numThread = Number(process.env.COSERSE_NUM_THREAD || 6);
        const numPredict = this.resolveNumPredict(params.tier);
        const handle = this.normalizeHandle(params.actor.username);

        const systemPrompt = this.buildSystemPrompt(params.actor);
        const { userTurnContent, hasEvidence: evidenceXml } = this.buildUserTurnPromptContent({
            handle,
            userMessage: params.userMessage,
            profilingContext: params.profilingContext,
            knowledgeChunks: params.knowledgeChunks,
            responseStyle: params.responseStyle,
            executionMode: params.executionMode
        } as any);

        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
            { role: 'system', content: systemPrompt },
            ...params.slidingTurns.slice(-4).map((t) => ({
                role: t.role,
                content: String(t.content || '').slice(0, 600)
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
                const guardedStreamReply = this.guardUncommittedStatusClaim(
                rawReply,
                params.userMessage,
                Boolean(params.profilingContext?.records?.length)
            );
            const reply = this.ensureMandatoryDisclaimer(guardedStreamReply, params.actor.username);
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
            const safeMessages = (Array.isArray(messages) ? messages : [])
                .filter((m) => m && m.role && String(m.content || '').trim().length > 0)
                .map((m) => ({
                    role: ['system', 'user', 'assistant'].includes(String(m.role)) ? m.role : 'user',
                    content: String(m.content)
                }));
            if (safeMessages.length === 0) {
                safeMessages.push({ role: 'user', content: String(params.userMessage || 'Halo') });
            }
            const safeOptions: Record<string, number> = {};
            if (Number.isFinite(temperature)) safeOptions.temperature = temperature;
            if (Number.isFinite(numCtx) && numCtx > 0) safeOptions.num_ctx = Math.trunc(numCtx);
            if (Number.isFinite(numThread) && numThread > 0) safeOptions.num_thread = Math.trunc(numThread);
            if (Number.isFinite(numPredict) && numPredict > 0) safeOptions.num_predict = Math.trunc(numPredict);

            const resp = await axios.post(
                endpoint,
                {
                    model: model || 'coserse:1.0',
                    messages: safeMessages,
                    stream: false,
                    keep_alive: -1,
                    options: safeOptions
                },
                { timeout: timeoutMs }
            );

            const rawReply = String(resp.data?.message?.content || '').trim();
            const guardedStreamReply = this.guardUncommittedStatusClaim(
                rawReply,
                params.userMessage,
                Boolean(params.profilingContext?.records?.length)
            );
            const reply = this.ensureMandatoryDisclaimer(guardedStreamReply, params.actor.username);
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
            let errMsg = err?.response?.data?.error || err?.message || 'Koneksi engine lokal gagal';
            if (err?.response?.data && typeof err.response.data.on === 'function') {
                try {
                    const chunks: Buffer[] = [];
                    for await (const c of err.response.data) {
                        chunks.push(Buffer.from(c));
                    }
                    const rawBody = Buffer.concat(chunks).toString('utf8').trim();
                    if (rawBody) {
                        try {
                            const j = JSON.parse(rawBody);
                            errMsg = j?.error || rawBody.slice(0, 300);
                        } catch {
                            errMsg = rawBody.slice(0, 300);
                        }
                    }
                } catch {}
            }
            this.logger.error(
                `[CoserseLlm] Stream error endpoint=${endpoint} status=${err?.response?.status || '-'} code=${errCode} msg=${errMsg}`
            );
            const isTimeoutError =
                errCode === 'ECONNABORTED' ||
                errCode === 'ETIMEDOUT' ||
                String(errMsg).toLowerCase().includes('timeout');
            const isContextOverflowError =
                err?.response?.status === 400 && /context size|num_ctx|tokens/i.test(String(errMsg));
            const isConnectionError =
                errCode === 'ECONNREFUSED' ||
                errCode === 'ECONNRESET' ||
                errCode === 'ENOTFOUND' ||
                isTimeoutError ||
                isContextOverflowError ||
                String(errMsg).includes('ECONNREFUSED');

            if (
                isConnectionError &&
                (this.isOfflineFallbackEnabled() || ((isTimeoutError || isContextOverflowError) && Boolean(params.profilingContext)))
            ) {
                this.logger.warn(
                    `Engine lokal ${endpoint} belum aktif/timeout (${errCode || errMsg}); menjalankan fallback deterministik sandbox.`
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
                    offlineNotice: `Engine lokal ${endpoint} tidak merespons (${errCode || errMsg}). Ringkasan disusun langsung dari data terindeks database CAS.`
                };
            }

            if (err instanceof ForbiddenException) {
                throw err;
            }

            throw new ServiceUnavailableException({
                status: 0,
                code: 'COSERSE_LOCAL_ENGINE_UNREACHABLE',
                message: `Siap ${handle}, engine AI lokal Coserse 1.0 di ${endpoint} belum merespons (${errCode || errMsg}${errMsg && errMsg !== errCode ? `: ${errMsg}` : ''}). Pastikan Ollama / Llama.cpp lokal aktif dengan model "${model}" (jalankan backend/coserse_runtime/setup_coserse_local.ps1).`,
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
        responseStyle?: string;
        executionMode?: string;
        onToken?: (delta: string) => void;
    }): Promise<CoserseLlmGenerationResult> {
        const provider = this.getRuntimeProvider();
        const endpoint = params.endpointOverride
            ? this.assertLoopbackUrl(params.endpointOverride)
            : this.getEndpointUrl();
        const model = this.getModelName();
        const timeoutMs = Number(process.env.COSERSE_LLM_TIMEOUT_MS || 240_000);
        const numCtx = Number(process.env.COSERSE_NUM_CTX || 4096);
        const temperature = Number(process.env.COSERSE_TEMPERATURE ?? 0.1);
        const numThread = Number(process.env.COSERSE_NUM_THREAD || 6);
        const numPredict = this.resolveNumPredict(params.tier);
        const handle = this.normalizeHandle(params.actor.username);

        const systemPrompt = this.buildSystemPrompt(params.actor);
        const { userTurnContent, hasEvidence: evidenceXml } = this.buildUserTurnPromptContent({
            handle,
            userMessage: params.userMessage,
            profilingContext: params.profilingContext,
            knowledgeChunks: params.knowledgeChunks,
            responseStyle: params.responseStyle,
            executionMode: params.executionMode
        } as any);

        const recentTurns = (params.slidingTurns || []).slice(-4).map((t) => ({
            role: t.role,
            content: String(t.content || '').slice(0, 600)
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
            const safeMessagesStream = (Array.isArray(messages) ? messages : [])
                .filter((m) => m && m.role && String(m.content || '').trim().length > 0)
                .map((m) => ({
                    role: ['system', 'user', 'assistant'].includes(String(m.role)) ? m.role : 'user',
                    content: String(m.content)
                }));
            if (safeMessagesStream.length === 0) {
                safeMessagesStream.push({ role: 'user', content: String(params.userMessage || 'Halo') });
            }
            const safeOptionsStream: Record<string, number> = {};
            if (Number.isFinite(temperature)) safeOptionsStream.temperature = temperature;
            if (Number.isFinite(numCtx) && numCtx > 0) safeOptionsStream.num_ctx = Math.trunc(numCtx);
            if (Number.isFinite(numThread) && numThread > 0) safeOptionsStream.num_thread = Math.trunc(numThread);
            if (Number.isFinite(numPredict) && numPredict > 0) safeOptionsStream.num_predict = Math.trunc(numPredict);

            const resp = await axios.post(
                endpoint,
                {
                    model: model || 'coserse:1.0',
                    messages: safeMessagesStream,
                    stream: true,
                    keep_alive: -1,
                    options: safeOptionsStream
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

            const guardedStreamReply = this.guardUncommittedStatusClaim(
                rawReply,
                params.userMessage,
                Boolean(params.profilingContext?.records?.length)
            );
            const reply = this.ensureMandatoryDisclaimer(guardedStreamReply, params.actor.username);
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
            let errMsg = err?.response?.data?.error || err?.message || 'Koneksi engine lokal gagal';
            if (err?.response?.data && typeof err.response.data.on === 'function') {
                try {
                    const chunks: Buffer[] = [];
                    for await (const c of err.response.data) {
                        chunks.push(Buffer.from(c));
                    }
                    const rawBody = Buffer.concat(chunks).toString('utf8').trim();
                    if (rawBody) {
                        try {
                            const j = JSON.parse(rawBody);
                            errMsg = j?.error || rawBody.slice(0, 300);
                        } catch {
                            errMsg = rawBody.slice(0, 300);
                        }
                    }
                } catch {}
            }
            this.logger.error(
                `[CoserseLlm] Stream error endpoint=${endpoint} status=${err?.response?.status || '-'} code=${errCode} msg=${errMsg}`
            );
            const isTimeoutError =
                errCode === 'ECONNABORTED' ||
                errCode === 'ETIMEDOUT' ||
                String(errMsg).toLowerCase().includes('timeout');
            const isContextOverflowError =
                err?.response?.status === 400 && /context size|num_ctx|tokens/i.test(String(errMsg));
            const isConnectionError =
                errCode === 'ECONNREFUSED' ||
                errCode === 'ECONNRESET' ||
                errCode === 'ENOTFOUND' ||
                isTimeoutError ||
                isContextOverflowError ||
                String(errMsg).includes('ECONNREFUSED');

            if (
                isConnectionError &&
                (this.isOfflineFallbackEnabled() || ((isTimeoutError || isContextOverflowError) && Boolean(params.profilingContext)))
            ) {
                this.logger.warn(
                    `Engine lokal ${endpoint} belum aktif/timeout (${errCode || errMsg}); menjalankan fallback deterministik sandbox.`
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
                    offlineNotice: `Engine lokal ${endpoint} tidak merespons (${errCode || errMsg}). Ringkasan disusun langsung dari data terindeks database CAS.`
                };
            }

            if (err instanceof ForbiddenException) {
                throw err;
            }

            throw new ServiceUnavailableException({
                status: 0,
                code: 'COSERSE_LOCAL_ENGINE_UNREACHABLE',
                message: `Siap ${handle}, engine AI lokal Coserse 1.0 di ${endpoint} belum merespons (${errCode || errMsg}${errMsg && errMsg !== errCode ? `: ${errMsg}` : ''}). Pastikan Ollama / Llama.cpp lokal aktif dengan model "${model}" (jalankan backend/coserse_runtime/setup_coserse_local.ps1).`,
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
        const groups = Array.isArray(profiling.discovery_groups) ? profiling.discovery_groups : [];
        const label =
            profiling.query.niks[0] ||
            profiling.query.phones[0]?.local08 ||
            profiling.query.names[0] ||
            profiling.query.raw;

        if (!records.length && !groups.length) {
            return `Siap ${handle}, saya sudah menelusuri lintas tabel CAS untuk **${label}** sesuai cakupan akses Anda (${profiling.scope.mode}), dan sejauh ini **belum ditemukan catatan data** yang cocok.`;
        }

        const lines: string[] = [];
        if (groups.length >= 2 && !profiling.active_group) {
            lines.push(
                `Siap ${handle}, ditemukan **${groups.length} kelompok data** di database CAS untuk kata kunci **${label}** (${profiling.scope.mode}):`,
                ''
            );
            for (const g of groups) {
                const bdText =
                    g.breakdown && Object.keys(g.breakdown).length
                        ? ' — ' +
                          Object.entries(g.breakdown)
                              .map(([k, v]) => `${k}: ${Number(v).toLocaleString('id-ID')}`)
                              .join(', ')
                        : '';
                lines.push(
                    `### ${g.group_id}: ${g.label} (**${Number(g.total_count || 0).toLocaleString('id-ID')}** temuan di \`${g.source_table}\`${bdText})`
                );
                if (g.records && g.records.length > 0) {
                    lines.push('| Nomor LP / Ref | Tanggal | Satker | Subjek / Nama | Peran | Status |');
                    lines.push('|---|---|---|---|---|---|');
                    for (const r of g.records.slice(0, 4)) {
                        lines.push(
                            `| ${String(r.no_laporan || '-').replace(/\|/g, '/')} | ${r.tgl_laporan || '-'} | ${String(r.satker_nama || '-').replace(/\|/g, '/')} | ${String(r.nama_tercatat || r.detail_konteks || '-').slice(0, 50).replace(/\|/g, '/')} | ${r.peran_entitas} | ${r.status_perkara} |`
                        );
                    }
                    lines.push('');
                }
            }
            lines.push(
                `Mau difokuskan ke kelompok mana (${groups.map((g) => `**${g.group_id}**`).join(' / ')}), difilter peran (mis. **Tersangka**/**Terlapor**), diurutkan (**terbaru**/**terlama**), atau langsung diekspor ke **PDF / Word / PPT / Excel**?`
            );
            return lines.join('\n');
        }

        const topRoles = Object.entries(summary.roles_breakdown)
            .map(([role, count]) => `${role}: ${Number(count).toLocaleString('id-ID')}`)
            .join(', ');
        lines.push(
            `Siap ${handle}, hasil penelusuran untuk **${label}**${profiling.active_group ? ` (Fokus: **${profiling.active_group}**)` : ''}:`,
            `- **Total Riil Database**: **${Number(summary.total_records || records.length).toLocaleString('id-ID')}** temuan (${topRoles || 'TERCATAT'}).`,
            '',
            `| No | Nomor LP / Ref | Tanggal | Satker | Nama / Subjek | Peran | Status |`,
            `|---|---|---|---|---|---|---|`
        );

        records.slice(0, 12).forEach((r, idx) => {
            lines.push(
                `| ${idx + 1} | ${String(r.no_laporan || '-').replace(/\|/g, '/')} | ${r.tgl_laporan || '-'} | ${String(r.satker_nama || '-').replace(/\|/g, '/')} | ${String(r.nama_tercatat || r.detail_konteks || '-').slice(0, 60).replace(/\|/g, '/')} | ${r.peran_entitas} | ${r.status_perkara} |`
            );
        });

        if (summary.total_records > 12) {
            lines.push(``, `Menampilkan 12 dari **${Number(summary.total_records).toLocaleString('id-ID')}** temuan. Anda dapat memilih fokus kelompok, filter peran/satker, urutkan terbaru/terlama, atau ekspor ke **PDF / Word / PPT / Excel**.`);
        }

        return lines.join('\n');
    }
}
