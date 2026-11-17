export type CoserseEntityType = 'NIK' | 'NO_HP' | 'NAMA' | 'PLAT' | 'MIXED' | 'UNKNOWN';

export interface ProfilePersonRequestDto {
    /** Natural-language or structured search string (e.g. NIK, name, phone number, or mixed query). */
    query?: string;
    /** Explicit keyword alias matching spec/REST consumers. */
    keyword?: string;
    /** Explicit 16-digit NIK filter. */
    nik?: string;
    /** Explicit person/entity name filter. */
    nama?: string;
    /** Explicit phone number filter (08..., 628..., +628...). */
    no_hp?: string;
    /** Optional satker_id target filter; validated against operator satker scope. */
    satker_id?: number | string;
    /** Maximum rows per source branch (1..100, default 25). */
    limit?: number | string;
    /** Include query execution diagnostics when true (admin/superadmin only). */
    explain?: boolean | string;
    /** Synthesize narrative via local Coserse 1.0 LLM runtime when true. */
    ai_narrative?: boolean | string;
    /** Optional session identifier for sliding window & memory tracking. */
    session_id?: string;
}

export interface NormalizedPhoneVariant {
    raw: string;
    coreDigits: string;
    local08: string;
    intl62: string;
    plus62: string;
    variants: string[];
}

export interface SecurityAlertInfo {
    flagged: boolean;
    code?: 'SEC_PROMPT_INJECTION';
    redFlag?: 'FLAGGED_PROMPT_INJECTION';
    matchedPattern?: string;
}

export interface CoserseParsedEntities {
    rawQuery: string;
    sanitizedQuery: string;
    detectedType: CoserseEntityType;
    niks: string[];
    phones: NormalizedPhoneVariant[];
    names: string[];
    plates: string[];
    keywords: string[];
    securityAlert: SecurityAlertInfo;
}

export interface CrossEntityMatchRecord {
    lp_id: number;
    dors_lp_id: number | null;
    model_lp: string | null;
    no_laporan: string;
    tgl_laporan: string;
    status_perkara: string;
    kode_status: string | null;
    satker_id: number | null;
    satker_nama: string;
    kategori_kejahatan: string;
    peran_entitas: string;
    sumber_tabel: 'bdb_dors_lp_terlibat' | 'bdb_dors_lp_barang_bukti';
    detail_konteks: string;
    nama_tercatat: string | null;
    nik: string | null;
    no_hp: string | null;
    alamat: string | null;
}

export interface CrossEntityProfileSummary {
    total_lp: number;
    total_records: number;
    total_terlibat_matches: number;
    total_barang_bukti_matches: number;
    roles_breakdown: Record<string, number>;
    status_breakdown: Record<string, number>;
    satkers_involved: string[];
}

export interface CrossEntityProfileResponse {
    status: 1;
    query: {
        raw: string;
        detected_type: CoserseEntityType;
        niks: string[];
        phones: NormalizedPhoneVariant[];
        names: string[];
        keywords: string[];
    };
    scope: {
        role: string;
        mode: 'NATIONAL' | 'SATKER_SUBTREE';
        satker_id: number | null;
    };
    summary: CrossEntityProfileSummary;
    records: CrossEntityMatchRecord[];
    narrative_summary: string;
    performance: {
        elapsed_ms: number;
        query_ms: number;
        target_ms: number;
        within_target: boolean;
        indexes_ready: boolean;
    };
    ai_engine?: {
        used: boolean;
        provider: 'ollama' | 'llamacpp' | 'deterministic_fallback' | 'none';
        model: string;
        tokens_used: number;
        warning?: string | null;
    };
    disclaimer: string;
}

export interface CoserseChatRequestDto {
    /** User message or @cosersebot command prompt. */
    message: string;
    /** Optional session ID (defaults to 'default'). */
    session_id?: string;
    /** Optional AI tier ('low' = 1x, 'medium' = 1.5x, 'high' = 2x multiplier). */
    tier?: 'low' | 'medium' | 'high' | string;
    /** Optional model identifier (e.g. 'coserse:1.0'). */
    model?: string;
    /** Optional explicit entity profiling query; auto-detected from message if omitted. */
    profile_query?: string;
    /** Optional satker_id filter for operator/admin scoping. */
    satker_id?: number | string;
    /** Maximum records per branch sent to context (default 15, max 50). */
    limit?: number | string;
    /** Force running cross-entity profiling before generation (default auto). */
    include_profiling?: boolean | string;
}

export interface CoserseTokenBoostRequestDto {
    /** Target user ID receiving emergency bonus tokens. */
    target_user_id: number | string;
    /** Bonus token amount (e.g. 20000). */
    bonus_tokens: number | string;
    /** Operational justification logged to bdb_audit_log. */
    reason?: string;
}

export interface CoserseChatTurn {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    bytes: number;
    tokens?: number;
}

export interface CoserseQuotaSnapshot {
    store_backend: 'redis' | 'memory';
    user_id: number;
    username: string;
    role?: string;
    tier_label?: string;
    is_unlimited?: boolean;
    can_train_model?: boolean;
    model_readonly?: boolean;
    session_id: string;
    ttl_seconds: number;
    memory: {
        used_bytes: number;
        used_mb: number;
        limit_mb: number;
        max_configurable_mb: number;
        usage_percent: number;
        near_limit_warning: boolean;
        exhausted: boolean;
        turns_stored: number;
        sliding_window_max: number;
        sliding_window_active: number;
    };
    tokens: {
        five_hour_used: number;
        five_hour_limit: number;
        five_hour_effective_limit: number;
        five_hour_remaining: number;
        five_hour_reset_at: string;
        five_hour_reset_in_text?: string;
        weekly_used: number;
        weekly_limit: number;
        weekly_effective_limit: number;
        weekly_remaining: number;
        weekly_reset_at: string;
        weekly_reset_in_text?: string;
        boost_tokens: number;
        is_free_tier: true;
    };
}

export interface CoserseChatResponse {
    status: 1;
    reply: string;
    addressed_to: string;
    session_id: string;
    engine: {
        provider: 'ollama' | 'llamacpp' | 'deterministic_fallback';
        model: string;
        latency_ms: number;
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        sliding_turns_used: number;
        xml_evidence_isolated: boolean;
        offline_notice?: string | null;
    };
    profiling?: {
        executed: boolean;
        detected_type: CoserseEntityType;
        total_lp: number;
        total_records: number;
        records_preview: CrossEntityMatchRecord[];
    };
    quota: CoserseQuotaSnapshot;
    quota_warning?: string | null;
    disclaimer: string;
}

export type MindikDocTypeCode =
    | 'SP_LIDIK'
    | 'SPDP'
    | 'SP_SIDIK'
    | 'TAHAP_1'
    | 'P21'
    | 'TAHAP_2'
    | 'SP3'
    | 'SP2_LIDIK'
    | 'UNKNOWN';

export interface MindikExtractedDraft {
    draft_id: string;
    source_filename: string;
    mime_type: string;
    file_size_bytes: number;
    file_kind: 'docx' | 'pdf' | 'image' | 'text';
    doc_type_code: MindikDocTypeCode;
    doc_type_nama: string;
    target_status_code: string;
    target_status_id: number;
    is_crime_clearance: boolean;
    lp_id: number | null;
    nomor_lp: string;
    current_status_code: string;
    satker_nama: string;
    nomor_dokumen: string;
    tanggal_dokumen: string;
    tanggal_dokumen_iso: string | null;
    tersangka: string[];
    kejaksaan_tujuan: string;
    alasan_penghentian: string;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    needs_manual_review: boolean;
    extracted_text_preview: string;
    extraction_notes: string[];
}

export interface ParseMindikDocumentResponse {
    status: 1;
    addressed_to: string;
    assistant_message: string;
    ram_sandbox: {
        processed_in_memory: true;
        disk_writes: 0;
        raw_buffer_wiped: true;
        magic_byte_verified: string;
        image_preview_data_url?: string | null;
    };
    review_card: MindikExtractedDraft;
    requires_human_approval: true;
    ai_write_permission: 'FORBIDDEN_WITHOUT_CLICK';
    disclaimer: string;
}

export interface CommitMindikDraftRequestDto {
    draft_id?: string;
    lp_id?: number | null;
    nomor_lp: string;
    doc_type_code: MindikDocTypeCode;
    target_status_code?: string;
    nomor_dokumen: string;
    tanggal_dokumen: string;
    tanggal_dokumen_iso?: string | null;
    tersangka?: string[] | string;
    kejaksaan_tujuan?: string;
    alasan_penghentian?: string;
    source_filename?: string;
    operator_confirmed: boolean;
}
