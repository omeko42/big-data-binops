import {
    CoserseEntityType,
    CoserseParsedEntities,
    NormalizedPhoneVariant,
    ProfilePersonRequestDto,
    SecurityAlertInfo
} from './dto/profile-query.dto';

const PROMPT_INJECTION_RULES: Array<{ label: string; regex: RegExp }> = [
    { label: 'system:', regex: /\bsystem\s*:/i },
    { label: '<|im_start|>', regex: /<\|im_start\|>/i },
    { label: '<|im_end|>', regex: /<\|im_end\|>/i },
    { label: 'ignore_instructions', regex: /\b(ignore|abaikan)\s+(all\s+|semua\s+)?(above|previous|prior|sebelumnya)\s+(instructions?|instruksi|rules?|aturan)\b/i },
    { label: 'eval(', regex: /\beval\s*\(/i },
    { label: '<script>', regex: /<\s*\/?\s*script\b/i },
    { label: 'javascript:', regex: /\bjavascript\s*:/i },
    { label: 'sql_injection_abuse', regex: /(?:;\s*(?:drop|delete|truncate|alter|update|insert)\s+(?:table|from|into)\b|\bunion\s+all\s+select\b)/i }
];

const NIK_REGEX = /\b\d{16}\b/g;
const PHONE_REGEX = /(?:\+?62|0)[\s.-]*8\d(?:[\s.-]*\d){6,11}/g;
const PLATE_REGEX = /\b[A-Z]{1,2}\s*\d{1,4}\s*[A-Z]{1,3}\b/gi;

const FILLER_PREFIX_REGEX = /^(?:tolong|mohon|izin|siap|coba|harap|cari(?:kan)?|cek|periksa|telusuri|profiling|profil|analisis|keterlibatan|riwayat|jejak|data|lp|laporan|siapa|identitas|atas\s+nama|dengan|pemilik|pengguna)\b[\s:,-]*/i;
const FILLER_PHRASE_REGEX = /\b(?:tolong|mohon|carikan|keterlibatan|riwayat|jejak|profiling|profil|terlibat|di\s+lp|laporan\s+polisi|nomor\s+hp|no\s*hp|no\s*telp|telepon|handphone|whatsapp|wa|nik|ktp|atas\s+nama|a\/n|yang\s+bernama|dengan\s+nama|bernama)\b/gi;

export function detectPromptInjection(rawText: string): SecurityAlertInfo {
    const text = String(rawText || '');
    if (!text) return { flagged: false };

    for (const rule of PROMPT_INJECTION_RULES) {
        if (rule.regex.test(text)) {
            return {
                flagged: true,
                code: 'SEC_PROMPT_INJECTION',
                redFlag: 'FLAGGED_PROMPT_INJECTION',
                matchedPattern: rule.label
            };
        }
    }
    return { flagged: false };
}

export function normalizePhoneNumber(rawPhone: string): NormalizedPhoneVariant | null {
    const cleaned = String(rawPhone || '')
        .trim()
        .replace(/[^\d+]/g, '');
    if (!cleaned) return null;

    let digits = cleaned.replace(/\+/g, '');
    if (digits.startsWith('620')) {
        digits = '62' + digits.slice(3);
    }

    let coreDigits = '';
    if (digits.startsWith('628')) {
        coreDigits = digits.slice(2);
    } else if (digits.startsWith('08')) {
        coreDigits = digits.slice(1);
    } else if (digits.startsWith('8')) {
        coreDigits = digits;
    } else {
        return null;
    }

    if (coreDigits.length < 8 || coreDigits.length > 13) {
        return null;
    }

    const local08 = `0${coreDigits}`;
    const intl62 = `62${coreDigits}`;
    const plus62 = `+62${coreDigits}`;
    const variants = Array.from(new Set([local08, intl62, plus62, cleaned]));

    return {
        raw: String(rawPhone).trim(),
        coreDigits,
        local08,
        intl62,
        plus62,
        variants
    };
}

function dedupeStrings(items: string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of items) {
        const val = String(raw || '').trim();
        if (!val) continue;
        const key = val.toUpperCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(val);
    }
    return out;
}

function extractCleanCandidateName(textWithoutStructured: string): string | null {
    let candidate = textWithoutStructured
        .replace(FILLER_PHRASE_REGEX, ' ')
        .replace(/[^\p{L}\p{N}\s.'-]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // Strip repeated leading filler words
    let prev = '';
    while (candidate && candidate !== prev) {
        prev = candidate;
        candidate = candidate.replace(FILLER_PREFIX_REGEX, '').trim();
    }

    if (candidate.length < 3) return null;
    if (/^\d+$/.test(candidate)) return null;
    return candidate;
}

export function extractEntities(input: ProfilePersonRequestDto): CoserseParsedEntities {
    const combinedRaw = [input.query, input.keyword, input.nik, input.nama, input.no_hp]
        .filter((v) => v !== undefined && v !== null && String(v).trim() !== '')
        .map((v) => String(v).trim())
        .join(' ')
        .trim();

    const securityAlert = detectPromptInjection(combinedRaw);
    const sanitizedQuery = combinedRaw.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();

    if (securityAlert.flagged) {
        return {
            rawQuery: combinedRaw,
            sanitizedQuery,
            detectedType: 'UNKNOWN',
            niks: [],
            phones: [],
            names: [],
            plates: [],
            keywords: [],
            securityAlert
        };
    }

    const freeText = [input.query, input.keyword]
        .filter((v) => v !== undefined && v !== null && String(v).trim() !== '')
        .map((v) => String(v).trim())
        .join(' ')
        .trim();

    // 1. Extract NIKs
    const rawNiks: string[] = [];
    if (input.nik) {
        const cleanNik = String(input.nik).replace(/\D/g, '');
        if (/^\d{16}$/.test(cleanNik)) {
            rawNiks.push(cleanNik);
        }
    }
    for (const match of freeText.match(NIK_REGEX) || []) {
        rawNiks.push(match);
    }
    const niks = dedupeStrings(rawNiks);

    // 2. Extract Phones (after stripping 16-digit NIKs to avoid false mobile match inside NIK)
    let remaining = freeText;
    for (const nik of niks) {
        remaining = remaining.replace(new RegExp(nik, 'g'), ' ');
    }

    const phoneMap = new Map<string, NormalizedPhoneVariant>();
    const pushPhone = (candidate: string) => {
        const norm = normalizePhoneNumber(candidate);
        if (norm && !phoneMap.has(norm.local08)) {
            phoneMap.set(norm.local08, norm);
        }
    };

    if (input.no_hp) {
        pushPhone(String(input.no_hp));
    }
    for (const match of remaining.match(PHONE_REGEX) || []) {
        pushPhone(match);
        remaining = remaining.replace(match, ' ');
    }
    const phones = Array.from(phoneMap.values());

    // 3. Extract License Plates if present in free text
    const plates = dedupeStrings(
        (remaining.match(PLATE_REGEX) || [])
            .map((p) => p.toUpperCase().replace(/\s+/g, ' ').trim())
            .filter((p) => /\d/.test(p) && p.length >= 4)
    );

    // 4. Extract Name / General Keyword
    const namesRaw: string[] = [];
    if (input.nama && String(input.nama).trim().length >= 3) {
        namesRaw.push(String(input.nama).trim().replace(/\s+/g, ' '));
    }
    const extractedFromText = extractCleanCandidateName(remaining);
    if (extractedFromText) {
        namesRaw.push(extractedFromText);
    }
    const names = dedupeStrings(namesRaw);

    const keywords = dedupeStrings([...names, ...plates]);

    // 5. Determine entity type classification
    const presentKinds = [
        niks.length > 0 ? 'NIK' : null,
        phones.length > 0 ? 'NO_HP' : null,
        names.length > 0 ? 'NAMA' : null,
        plates.length > 0 && names.length === 0 ? 'PLAT' : null
    ].filter(Boolean) as CoserseEntityType[];

    let detectedType: CoserseEntityType = 'UNKNOWN';
    if (presentKinds.length > 1) {
        detectedType = 'MIXED';
    } else if (presentKinds.length === 1) {
        detectedType = presentKinds[0];
    }

    return {
        rawQuery: combinedRaw,
        sanitizedQuery,
        detectedType,
        niks,
        phones,
        names,
        plates,
        keywords,
        securityAlert
    };
}
