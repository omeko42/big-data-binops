import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException
} from '@nestjs/common';
import * as crypto from 'crypto';
import { spawn } from 'child_process';
import * as zlib from 'zlib';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSZip = require('jszip');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ExcelJS = require('exceljs');
import { DataSource } from 'typeorm';
import { AuditService } from '../audit/audit.service';
import { COSERSE_MANDATORY_DISCLAIMER, CoserseLlmService } from './coserse-llm.service';
import {
    CommitMindikDraftRequestDto,
    MindikDocTypeCode,
    MindikExtractedDraft,
    ParseMindikDocumentResponse
} from './dto/profile-query.dto';
import { detectPromptInjection } from './entity-extractor';

const BLOCKED_WRITE_ROLES = new Set(['viewer', 'vendor_mitra', 'vendor', 'mitra', 'testing', 'sharese']);
const NATIONAL_ROLES = new Set(['superadmin', 'admin_binops', 'admin']);

export const MINDIK_DOC_CATALOG: Record<
    Exclude<MindikDocTypeCode, 'UNKNOWN'>,
    { nama: string; statusCode: string; statusId: number; isCC: boolean }
> = {
    SP_LIDIK: {
        nama: 'Surat Perintah Penyelidikan (Sprin Lidik)',
        statusCode: 'LIDIK',
        statusId: 2,
        isCC: false
    },
    SPDP: {
        nama: 'Surat Pemberitahuan Dimulainya Penyidikan (SPDP)',
        statusCode: 'SPDP',
        statusId: 9,
        isCC: false
    },
    SP_SIDIK: {
        nama: 'Surat Perintah Penyidikan (Sprin Sidik)',
        statusCode: 'SIDIK',
        statusId: 3,
        isCC: false
    },
    TAHAP_1: {
        nama: 'Surat Pengantar Berkas Perkara Tahap I',
        statusCode: 'TAHAP_I',
        statusId: 5,
        isCC: false
    },
    P21: {
        nama: 'Pemberitahuan Berkas Lengkap (P-21)',
        statusCode: 'P21',
        statusId: 11,
        isCC: false
    },
    TAHAP_2: {
        nama: 'Pelimpahan Tersangka & Barang Bukti (Tahap II)',
        statusCode: 'TAHAP_II',
        statusId: 6,
        isCC: true
    },
    SP3: {
        nama: 'Surat Perintah Penghentian Penyidikan (SP3)',
        statusCode: 'SP3',
        statusId: 4,
        isCC: true
    },
    SP2_LIDIK: {
        nama: 'Surat Perintah Penghentian Penyelidikan (SP2 Lidik)',
        statusCode: 'SP2_LID',
        statusId: 7,
        isCC: true
    }
};

const ID_MONTHS: Record<string, string> = {
    januari: '01',
    jan: '01',
    februari: '02',
    feb: '02',
    pebruari: '02',
    maret: '03',
    mar: '03',
    april: '04',
    apr: '04',
    mei: '05',
    juni: '06',
    jun: '06',
    juli: '07',
    jul: '07',
    agustus: '08',
    agt: '08',
    agu: '08',
    september: '09',
    sep: '09',
    sept: '09',
    oktober: '10',
    okt: '10',
    november: '11',
    nov: '11',
    nopember: '11',
    desember: '12',
    des: '12'
};

interface MagicDetectionResult {
    kind: 'docx' | 'pdf' | 'image' | 'text' | 'xlsx' | 'csv';
    signature: string;
    safeMime: string;
}

export interface BatchLpProposalItem {
    row_index: number;
    raw_nomor_lp: string;
    nomor_lp: string;
    unit?: string | null;
    subdit?: string | null;
    raw_status: string;
    status_baru: string;
    status_baru_label: string;
    tanggal_selra: string | null;
    alasan: string | null;
    matched: boolean;
    action: 'UPDATE' | 'SKIP';
    skip_reason: string | null;
    lp_id: number | null;
    no_laporan_db: string | null;
    satker_nama: string | null;
    status_lama: string | null;
    tgl_laporan_db: string | null;
    selected: boolean;
}

export interface BatchLpReviewCard {
    batch_id: string;
    source: string;
    total_rows: number;
    ready_count: number;
    skip_count: number;
    items: BatchLpProposalItem[];
}

@Injectable()
export class CoserseDocParserService {
    private readonly logger = new Logger(CoserseDocParserService.name);
    private readonly pendingBatchByUser = new Map<number, { card: BatchLpReviewCard; createdAt: number }>();

    getPendingBatchForUser(userId: number | null): BatchLpReviewCard | null {
        if (!userId) return null;
        const entry = this.pendingBatchByUser.get(userId);
        if (!entry) return null;
        if (Date.now() - entry.createdAt > 30 * 60 * 1000) {
            this.pendingBatchByUser.delete(userId);
            return null;
        }
        return entry.card;
    }

    clearPendingBatchForUser(userId: number | null): void {
        if (userId) this.pendingBatchByUser.delete(userId);
    }

    constructor(
        private readonly dataSource: DataSource,
        private readonly audit: AuditService,
        private readonly llmService: CoserseLlmService
    ) {}

    /**
     * Validates binary magic bytes strictly in RAM to prevent extension spoofing or executable uploads.
     */
    detectMagicBytes(buffer: Buffer, filename = '', declaredMime = ''): MagicDetectionResult {
        if (!buffer || buffer.length < 4) {
            throw new BadRequestException('Berkas kosong atau terlalu kecil untuk diproses.');
        }

        const hex4 = buffer.subarray(0, 4).toString('hex').toUpperCase();
        const ascii4 = buffer.subarray(0, 4).toString('latin1');
        const ext = String(filename || '').toLowerCase().split('.').pop() || '';

        // Reject Windows PE / Linux ELF executables & HTML/scripts immediately
        if (buffer[0] === 0x4d && buffer[1] === 0x5a) {
            throw new BadRequestException('Berkas executable (MZ) ditolak oleh kebijakan keamanan Coserse.');
        }
        if (hex4 === '7F454C46') {
            throw new BadRequestException('Berkas binary ELF ditolak oleh kebijakan keamanan Coserse.');
        }

        // PDF: %PDF-
        if (ascii4 === '%PDF') {
            return { kind: 'pdf', signature: 'PDF (%PDF-)', safeMime: 'application/pdf' };
        }

        // DOCX / XLSX (ZIP PK\x03\x04)
        if (hex4 === '504B0304') {
            if (ext === 'xlsx' || declaredMime.includes('spreadsheetml')) {
                return {
                    kind: 'xlsx',
                    signature: 'ZIP/XLSX (PK 03 04)',
                    safeMime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                };
            }
            return {
                kind: 'docx',
                signature: 'ZIP/DOCX (PK 03 04)',
                safeMime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            };
        }

        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (
            buffer.length >= 8 &&
            buffer.subarray(0, 8).toString('hex').toUpperCase() === '89504E470D0A1A0A'
        ) {
            return { kind: 'image', signature: 'PNG (89 50 4E 47)', safeMime: 'image/png' };
        }

        // JPEG: FF D8 FF
        if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
            return { kind: 'image', signature: 'JPEG (FF D8 FF)', safeMime: 'image/jpeg' };
        }

        // WEBP: RIFF....WEBP
        if (
            buffer.length >= 12 &&
            buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
            buffer.subarray(8, 12).toString('ascii') === 'WEBP'
        ) {
            return { kind: 'image', signature: 'WEBP (RIFF..WEBP)', safeMime: 'image/webp' };
        }

        // CSV / TSV / UTF-8 plain text
        if (ext === 'csv' || ext === 'tsv' || declaredMime.includes('csv') || declaredMime.includes('tab-separated')) {
            return { kind: 'csv', signature: 'CSV/UTF-8', safeMime: 'text/csv' };
        }
        if (ext === 'txt' || declaredMime.startsWith('text/plain')) {
            return { kind: 'text', signature: 'TEXT/UTF-8', safeMime: 'text/plain' };
        }

        throw new BadRequestException(
            `Format berkas "${filename || declaredMime}" tidak valid atau magic byte (${hex4}) tidak dikenali. Hanya mendukung .docx, .pdf, .csv, .xlsx, atau screenshot PNG/JPG/WEBP.`
        );
    }

    /**
     * Parses a Mindik file purely in RAM (zero disk writes) and wipes raw buffer immediately in `finally`.
     */
    async parseDocumentInRam(params: {
        authUser: any;
        fileBuffer: Buffer;
        originalName: string;
        mimeType: string;
        hintText?: string;
        clientIp?: string;
    }): Promise<ParseMindikDocumentResponse> {
        const actor = await this.resolveActor(params.authUser);
        const handle = this.llmService.normalizeHandle(actor.username);
        const fileSize = params.fileBuffer?.length || 0;
        let imagePreviewDataUrl: string | null = null;
        let magic: MagicDetectionResult;
        let extractedText = '';
        const notes: string[] = [];

        try {
            magic = this.detectMagicBytes(params.fileBuffer, params.originalName, params.mimeType);

            if (magic.kind === 'docx') {
                extractedText = await this.extractDocxTextInRam(params.fileBuffer);
                if (!extractedText.trim()) {
                    notes.push('Isi teks XML DOCX kosong; mohon lengkapi manual pada kartu review.');
                }
            } else if (magic.kind === 'xlsx') {
                extractedText = await this.extractXlsxTextInRam(params.fileBuffer);
                if (!extractedText.trim()) {
                    notes.push('Isi worksheet Excel kosong.');
                }
            } else if (magic.kind === 'csv') {
                extractedText = params.fileBuffer.toString('utf8');
            } else if (magic.kind === 'pdf') {
                extractedText = this.extractPdfTextInRam(params.fileBuffer);
                if (extractedText.trim().length < 25) {
                    notes.push(
                        'PDF kemungkinan berupa hasil scan gambar tanpa lapisan teks; silakan koreksi/lengkapi kolom pada Kartu Draf sebelum menekan Setujui.'
                    );
                }
            } else if (magic.kind === 'image') {
                // Keep small base64 preview only in response payload for operator visual confirmation in UI
                if (fileSize <= 2 * 1024 * 1024) {
                    imagePreviewDataUrl = `data:${magic.safeMime};base64,${params.fileBuffer.toString('base64')}`;
                }
                extractedText = await this.extractImageOcrInRam(params.fileBuffer);
                if (!extractedText.trim()) {
                    notes.push(
                        'Gambar screenshot diterima di RAM sandbox. Silakan tinjau gambar & verifikasi/edit kolom draf dokumen secara manual sebelum disimpan.'
                    );
                }
            } else {
                extractedText = params.fileBuffer.toString('utf8');
            }

            const combinedText = [extractedText, params.hintText || ''].filter(Boolean).join('\n').trim();

            // Security check against prompt injection embedded inside documents
            const inj = detectPromptInjection(combinedText);
            if (inj.flagged) {
                await this.audit.log({
                    userId: actor.userId ?? undefined,
                    userName: handle,
                    action: 'COSERSE_DOC_PARSE',
                    entity: 'PROMPT_INJECTION',
                    entityId: params.originalName,
                    meta: {
                        red_flag: inj.redFlag,
                        matched_pattern: inj.matchedPattern,
                        file_kind: magic.kind,
                        file_size_bytes: fileSize
                    },
                    ip: params.clientIp,
                    outcome: 'FLAGGED_SECURITY'
                });
                throw new BadRequestException(
                    `Maaf ${handle}, isi dokumen mengandung instruksi tidak aman (${inj.matchedPattern}) dan diblokir di RAM sandbox.`
                );
            }

            const batchRows = this.extractBatchRowsFromText(combinedText);
            const shouldUseBatch =
                (magic.kind === 'csv' || magic.kind === 'xlsx')
                    ? batchRows.length >= 1
                    : batchRows.length >= 2;

            if (shouldUseBatch) {
                const batchCard = await this.proposeBatchUpdateLp(actor, batchRows, params.originalName);
                await this.audit.log({
                    userId: actor.userId ?? undefined,
                    userName: handle,
                    action: 'COSERSE_DOC_PARSE',
                    entity: 'BATCH_LP_UPDATE',
                    entityId: params.originalName,
                    meta: {
                        batch_id: batchCard.batch_id,
                        file_kind: magic.kind,
                        total_rows: batchCard.total_rows,
                        ready_count: batchCard.ready_count,
                        skip_count: batchCard.skip_count,
                        disk_writes: 0,
                        raw_buffer_wiped: true
                    },
                    ip: params.clientIp,
                    outcome: 'SUCCESS'
                });

                if (actor.userId) {
                    this.pendingBatchByUser.set(actor.userId, { card: batchCard, createdAt: Date.now() });
                }
                const readyItems = batchCard.items.filter((i) => i.action === 'UPDATE' && i.selected !== false);
                const skippedItems = batchCard.items.filter((i) => i.action !== 'UPDATE' || i.selected === false);
                const stageCounts = new Map<string, number>();
                for (const it of readyItems) {
                    const lbl = it.status_baru_label || it.status_baru;
                    stageCounts.set(lbl, (stageCounts.get(lbl) || 0) + 1);
                }
                const stageBreakdown = Array.from(stageCounts.entries())
                    .map(([lbl, cnt]) => `${lbl} ${cnt} LP`)
                    .join(', ');
                const skippedList = skippedItems
                    .slice(0, 8)
                    .map((it) => `${it.no_laporan_db || it.nomor_lp} (${it.skip_reason || 'dilewati'})`)
                    .join('; ');
                const moreSkipped = skippedItems.length > 8 ? ` (+${skippedItems.length - 8} lainnya)` : '';

                const summaryParts = [
                    `Siap ${handle}, setelah saya cek berkas **${params.originalName}** (${batchCard.total_rows} baris), ada **${batchCard.ready_count} LP siap diupdate**${stageBreakdown ? ` (${stageBreakdown})` : ''}.`
                ];
                if (skippedItems.length > 0) {
                    summaryParts.push(
                        `Sementara **${skippedItems.length} LP saya lewatkan**: ${skippedList}${moreSkipped}.`
                    );
                }
                summaryParts.push(
                    `Mau langsung saya proses sekarang, atau ada LP yang statusnya mau disesuaikan dulu? (Balas di chat, misal *"oke jalan"* atau *"oke jalan, tapi LP ... ganti jadi P21"*).`,
                    COSERSE_MANDATORY_DISCLAIMER
                );
                const batchSummaryMsg = summaryParts.join('\n\n');

                return {
                    status: 1,
                    addressed_to: handle,
                    assistant_message: batchSummaryMsg,
                    ram_sandbox: {
                        processed_in_memory: true,
                        disk_writes: 0,
                        raw_buffer_wiped: true,
                        magic_byte_verified: magic.signature,
                        image_preview_data_url: imagePreviewDataUrl
                    },
                    batch_review_card: batchCard,
                    requires_human_approval: true,
                    ai_write_permission: 'FORBIDDEN_WITHOUT_CLICK',
                    disclaimer: COSERSE_MANDATORY_DISCLAIMER
                } as any;
            }

            const draft = await this.extractStructuredDraft({
                actor,
                text: combinedText,
                filename: params.originalName,
                mimeType: magic.safeMime,
                fileSizeBytes: fileSize,
                fileKind: magic.kind === 'xlsx' || magic.kind === 'csv' ? 'text' : magic.kind,
                notes
            });

            await this.audit.log({
                userId: actor.userId ?? undefined,
                userName: handle,
                action: 'COSERSE_DOC_PARSE',
                entity: draft.doc_type_code,
                entityId: draft.nomor_lp || params.originalName,
                meta: {
                    draft_id: draft.draft_id,
                    file_kind: magic.kind,
                    magic_signature: magic.signature,
                    file_size_bytes: fileSize,
                    lp_id: draft.lp_id,
                    target_status_code: draft.target_status_code,
                    disk_writes: 0,
                    raw_buffer_wiped: true
                },
                ip: params.clientIp,
                outcome: 'SUCCESS'
            });

            const statusShiftMsg =
                draft.lp_id && draft.current_status_code
                    ? `Perubahan status yang terdeteksi: **${draft.current_status_code} → ${draft.target_status_code}**`
                    : `Usulan status target: **${draft.target_status_code}**`;

            const assistantMessage = [
                `Siap ${handle}, berkas **${params.originalName}** (${(fileSize / 1024).toFixed(1)} KB, terverifikasi \`${magic.signature}\`) sudah saya baca di RAM sandbox dan file biner mentahnya langsung dimusnahkan.`,
                `Ditemukan draf **${draft.doc_type_nama}**${draft.nomor_lp ? ` untuk **${draft.nomor_lp}**` : ''}. ${statusShiftMsg}.`,
                `Saya tidak memiliki akses tulis otomatis ke database — silakan periksa kolom pada **Kartu Konfirmasi Draf** di bawah ini lalu klik **[Setujui & Simpan ke Database]** bila sudah sesuai.`,
                '',
                COSERSE_MANDATORY_DISCLAIMER
            ].join('\n\n');

            return {
                status: 1,
                addressed_to: handle,
                assistant_message: assistantMessage,
                ram_sandbox: {
                    processed_in_memory: true,
                    disk_writes: 0,
                    raw_buffer_wiped: true,
                    magic_byte_verified: magic.signature,
                    image_preview_data_url: imagePreviewDataUrl
                },
                review_card: draft,
                requires_human_approval: true,
                ai_write_permission: 'FORBIDDEN_WITHOUT_CLICK',
                disclaimer: COSERSE_MANDATORY_DISCLAIMER
            };
        } finally {
            // Immediate zeroization of raw upload bytes in RAM (zero disk/memory residue)
            if (Buffer.isBuffer(params.fileBuffer)) {
                params.fileBuffer.fill(0);
            }
        }
    }

    /**
     * Human-in-the-Loop Commit: writes to bdb_dokumen + updates bdb_laporan_polisi + notifies bell + logs audit.
     */
    async commitDocumentDraft(
        authUser: any,
        dto: CommitMindikDraftRequestDto,
        clientIp?: string
    ) {
        const actor = await this.resolveActor(authUser);
        const handle = this.llmService.normalizeHandle(actor.username);

        if (!dto || dto.operator_confirmed !== true) {
            throw new ForbiddenException(
                `Ditolak: AI dilarang menyimpan langsung tanpa klik konfirmasi fisik operator (${handle}).`
            );
        }

        if (actor.isBlockedRole) {
            throw new ForbiddenException(
                `Maaf ${handle}, role "${actor.role}" bersifat baca-saja dan tidak berwenang menyimpan dokumen penyidikan.`
            );
        }

        const docSpec =
            dto.doc_type_code && dto.doc_type_code !== 'UNKNOWN' && MINDIK_DOC_CATALOG[dto.doc_type_code]
                ? MINDIK_DOC_CATALOG[dto.doc_type_code]
                : null;

        const targetStatusCode = String(dto.target_status_code || docSpec?.statusCode || '').trim().toUpperCase();
        const nomorLp = String(dto.nomor_lp || '').trim();
        const nomorDokumen = String(dto.nomor_dokumen || '').trim();

        if (!nomorLp && !dto.lp_id) {
            throw new BadRequestException(`Siap ${handle}, Nomor LP atau ID LP wajib diisi sebelum menyimpan draf.`);
        }
        if (!nomorDokumen) {
            throw new BadRequestException(`Siap ${handle}, Nomor Surat/Dokumen Mindik wajib diisi.`);
        }

        // Resolve target LP inside user satker scope
        const lpRow = await this.findTargetLpInScope(actor, dto.lp_id || null, nomorLp);
        if (!lpRow) {
            throw new NotFoundException(
                `Laporan Polisi "${nomorLp || dto.lp_id}" tidak ditemukan dalam cakupan Satker Anda (${actor.role}).`
            );
        }

        const tglIso = this.normalizeDateToIso(dto.tanggal_dokumen_iso || dto.tanggal_dokumen);
        const tersangkaArr = Array.isArray(dto.tersangka)
            ? dto.tersangka.map((x) => String(x || '').trim()).filter(Boolean)
            : String(dto.tersangka || '')
                  .split(/[;\n,]+/)
                  .map((x) => x.trim())
                  .filter(Boolean);

        // Resolve status_id & document_type_id dynamically from DB masters
        const statusRow = await this.resolveTargetStatusRow(targetStatusCode, docSpec?.statusId);
        const docTypeRow = await this.resolveDocumentTypeRow(dto.doc_type_code, statusRow?.id || docSpec?.statusId || null);

        const prevStatus = lpRow.current_status_code || lpRow.status || 'BARU';
        const nextStatusCode = statusRow?.code || targetStatusCode || prevStatus;
        const nextStatusId = statusRow?.id || docSpec?.statusId || lpRow.status_id || 2;
        const isCC = Boolean(docSpec?.isCC || String(statusRow?.kategori || '').toUpperCase() === 'CC');

        const docMetadata = {
            draft_id: dto.draft_id || null,
            source: 'COSERSE_MINDIK_HITL',
            source_filename: dto.source_filename || null,
            tersangka: tersangkaArr,
            kejaksaan_tujuan: dto.kejaksaan_tujuan || null,
            alasan_penghentian: dto.alasan_penghentian || null,
            approved_by_handle: handle,
            approved_at: new Date().toISOString(),
            previous_status: prevStatus,
            next_status: nextStatusCode
        };

        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();

        let createdDocId: number | null = null;
        try {
            const insertDocRes = await runner.query(
                `INSERT INTO bdb_dokumen (lp_id, document_type_id, nomor_dokumen, tanggal_dokumen, data, lampiran, created_by)
                 VALUES ($1, $2, $3, $4::date, $5::jsonb, '[]'::jsonb, $6)
                 RETURNING id`,
                [
                    lpRow.id,
                    docTypeRow?.id || 1,
                    nomorDokumen,
                    tglIso,
                    JSON.stringify(docMetadata),
                    actor.userId || null
                ]
            );
            createdDocId = Number(insertDocRes?.[0]?.id || 0) || null;

            await this.updateLaporanPolisiStatusSafe(runner, lpRow.id, nextStatusId, nextStatusCode, isCC, tglIso);
            await runner.commitTransaction();
        } catch (err: any) {
            await runner.rollbackTransaction();
            this.logger.error(`Gagal commit draf Mindik: ${err?.message || err}`);
            throw new BadRequestException(`Gagal menyimpan draf ke database: ${err?.message || err}`);
        } finally {
            await runner.release();
        }

        // Audit Log: AI_DOC_INPUT_APPROVED
        await this.audit.log({
            userId: actor.userId ?? undefined,
            userName: handle,
            action: 'AI_DOC_INPUT_APPROVED',
            entity: 'bdb_dokumen',
            entityId: String(createdDocId || lpRow.id),
            meta: {
                draft_id: dto.draft_id || null,
                lp_id: lpRow.id,
                no_laporan: lpRow.no_laporan,
                doc_type_code: dto.doc_type_code,
                nomor_dokumen: nomorDokumen,
                previous_status: prevStatus,
                new_status: nextStatusCode,
                operator_confirmed: true
            },
            ip: clientIp,
            outcome: 'SUCCESS'
        });

        // Bell notification to operator (best-effort if bdb_social_notifications exists)
        await this.emitCoserseNotification(
            actor.userId,
            `Perubahan Status LP via @cosersebot`,
            `Berkas LP nomor ${lpRow.no_laporan} berhasil diperbarui ke status ${nextStatusCode} (No. Dok: ${nomorDokumen}).`,
            `/cms/laporan-polisi/${lpRow.id}`
        );

        return {
            status: 1,
            dokumen_id: createdDocId,
            lp_id: lpRow.id,
            no_laporan: lpRow.no_laporan,
            previous_status: prevStatus,
            new_status: nextStatusCode,
            message: `Siap ${handle}, draf **${docSpec?.nama || dto.doc_type_code}** untuk **${lpRow.no_laporan}** berhasil disetujui & disimpan (${prevStatus} → ${nextStatusCode}).`,
            audit_action: 'AI_DOC_INPUT_APPROVED',
            disclaimer: COSERSE_MANDATORY_DISCLAIMER
        };
    }

    private async extractDocxTextInRam(buffer: Buffer): Promise<string> {
        const zip = await JSZip.loadAsync(buffer);
        const xmlFiles = Object.keys(zip.files)
            .filter((name) => /^word\/(document|header\d*|footer\d*)\.xml$/i.test(name))
            .sort((a, b) => (a === 'word/document.xml' ? -1 : b === 'word/document.xml' ? 1 : a.localeCompare(b)));

        if (!xmlFiles.length) {
            throw new BadRequestException('Berkas ZIP bukan dokumen .docx yang valid (word/document.xml tidak ditemukan).');
        }

        const chunks: string[] = [];
        for (const entryName of xmlFiles) {
            const xml = await zip.files[entryName].async('string');
            const text = xml
                .replace(/<w:br[^>]*\/>/gi, '\n')
                .replace(/<w:tab[^>]*\/>/gi, ' ')
                .replace(/<\/w:(p|tr|tc)>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'")
                .replace(/[ \t]+/g, ' ')
                .replace(/\n{3,}/g, '\n\n')
                .trim();
            if (text) chunks.push(text);
        }
        return chunks.join('\n');
    }

    /**
     * Pure-RAM PDF text extractor (supports both literal streams and FlateDecode compressed streams).
     */
    private extractPdfTextInRam(buffer: Buffer): string {
        const latin = buffer.toString('latin1');
        const extractedParts: string[] = [];

        // Collect decompressed /FlateDecode streams first
        const streamRegex = /<<([\s\S]*?)>>\s*stream\r?\n([\s\S]*?)\r?\n?endstream/g;
        let match: RegExpExecArray | null;
        while ((match = streamRegex.exec(latin)) !== null) {
            const dict = match[1];
            const streamSlice = buffer.subarray(
                match.index + match[0].indexOf('stream') + 6,
                match.index + match[0].lastIndexOf('endstream')
            );
            let trimmed = streamSlice;
            if (trimmed[0] === 0x0d) trimmed = trimmed.subarray(1);
            if (trimmed[0] === 0x0a) trimmed = trimmed.subarray(1);

            let content = '';
            if (/\/FlateDecode/i.test(dict)) {
                try {
                    content = zlib.inflateSync(trimmed).toString('latin1');
                } catch {
                    try {
                        content = zlib.inflateRawSync(trimmed).toString('latin1');
                    } catch {
                        content = '';
                    }
                }
            } else {
                content = trimmed.toString('latin1');
            }

            if (content) {
                const textInStream = this.extractPdfOperatorsText(content);
                if (textInStream) extractedParts.push(textInStream);
            }
        }

        // Fallback scan for uncompressed top-level text operators
        if (!extractedParts.length) {
            const direct = this.extractPdfOperatorsText(latin);
            if (direct) extractedParts.push(direct);
        }

        return extractedParts.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    }

    private extractPdfOperatorsText(streamText: string): string {
        const lines: string[] = [];
        const btEtRegex = /BT([\s\S]*?)ET/g;
        let m: RegExpExecArray | null;

        while ((m = btEtRegex.exec(streamText)) !== null) {
            const block = m[1];
            const opRegex =
                /\(([^()\\]*(?:\\.[^()\\]*)*)\)\s*(?:Tj|'|")|\[((?:[^[\]]|\((?:[^()\\]|\\.)*\))*)\]\s*TJ|(?:\s|^)(T\*|Td|TD)(?=\s|$)/g;
            let lm: RegExpExecArray | null;
            let currentLine = '';

            while ((lm = opRegex.exec(block)) !== null) {
                if (lm[1] !== undefined) {
                    currentLine += (currentLine ? ' ' : '') + this.unescapePdfString(lm[1]);
                } else if (lm[2] !== undefined) {
                    const innerRegex = /\(([^()\\]*(?:\\.[^()\\]*)*)\)/g;
                    let im: RegExpExecArray | null;
                    let buf = '';
                    while ((im = innerRegex.exec(lm[2])) !== null) {
                        buf += this.unescapePdfString(im[1]);
                    }
                    if (buf) currentLine += (currentLine ? ' ' : '') + buf;
                } else if (lm[3]) {
                    const flushed = currentLine.replace(/\s+/g, ' ').trim();
                    if (flushed) lines.push(flushed);
                    currentLine = '';
                }
            }

            const trailing = currentLine.replace(/\s+/g, ' ').trim();
            if (trailing) lines.push(trailing);
        }

        return lines.join('\n');
    }

    private unescapePdfString(raw: string): string {
        return raw
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '')
            .replace(/\\t/g, ' ')
            .replace(/\\\(/g, '(')
            .replace(/\\\)/g, ')')
            .replace(/\\\\/g, '\\');
    }

    private async extractStructuredDraft(params: {
        actor: any;
        text: string;
        filename: string;
        mimeType: string;
        fileSizeBytes: number;
        fileKind: 'docx' | 'pdf' | 'image' | 'text';
        notes: string[];
    }): Promise<MindikExtractedDraft> {
        const rawText = params.text || '';
        const combinedSearch = `${params.filename}\n${rawText}`;

        // 1. Classify Mindik Document Type (Perkap No. 6 Tahun 2019)
        const docTypeCode = this.classifyMindikDocType(combinedSearch);
        const docMeta =
            docTypeCode !== 'UNKNOWN'
                ? MINDIK_DOC_CATALOG[docTypeCode]
                : {
                      nama: 'Dokumen Mindik Umum (Pilih Jenis Dokumen)',
                      statusCode: 'SIDIK',
                      statusId: 3,
                      isCC: false
                  };

        // 2. Extract Nomor LP
        const lpMatch =
            combinedSearch.match(
                /LP\s*\/\s*[AB]\s*\/\s*\d{1,6}\s*\/\s*[IVXLCDM]+\s*\/\s*\d{4}(?:\s*\/\s*[A-Z0-9.\-_\/]+)?/i
            ) || combinedSearch.match(/Nomor\s+LP\s*[:=]\s*([^\r\n]+)/i);
        const nomorLp = lpMatch ? (lpMatch[1] || lpMatch[0]).replace(/\s+/g, '').replace(/\/+/g, '/').trim() : '';

        // 3. Extract Nomor Dokumen / Surat
        const docNumMatch =
            rawText.match(
                /(?:Nomor\s+(?:Surat|Dokumen|SPDP|SP3|Sprin|Berita\s+Acara)|No\.\s*Surat)\s*[:=]\s*([^\r\n]+)/i
            ) ||
            combinedSearch.match(
                /\b(?:B|SPDP|SP3|SPRIN(?:\.|\s)*(?:LIDIK|SIDIK)|BA(?:\.|\s)*TAHAP\s*II)\s*\/\s*[0-9A-Z.\-\/]+\/\d{4}(?:\/[A-Z0-9.\-_\/]+)?/i
            );
        const nomorDokumen = docNumMatch ? (docNumMatch[1] || docNumMatch[0]).trim() : '';

        // 4. Extract Tanggal Dokumen
        const dateExtract = this.extractDateFromText(rawText);

        // 5. Extract Tersangka
        const tersangka = this.extractSuspects(rawText);

        // 6. Extract Kejaksaan Tujuan
        const kejaksaanMatch = rawText.match(
            /(?:Kejaksaan\s+(?:Tinggi|Negeri|Agung)\s+[A-Za-z.\-\s]{2,50}|Kepada\s+Yth\.?\s*(?:Kepala\s+)?Kejaksaan[^\r\n]+)/i
        );
        const kejaksaanTujuan = kejaksaanMatch
            ? kejaksaanMatch[0].replace(/^Kepada\s+Yth\.?\s*/i, '').trim()
            : '';

        // 7. Extract Alasan Penghentian (SP3 / SP2 Lidik)
        const alasanMatch = rawText.match(/(?:Alasan\s+(?:Penghentian|SP3|SP2)\s*[:=]\s*)([^\r\n]+)/i);
        const alasanPenghentian = alasanMatch ? alasanMatch[1].trim() : '';

        // 8. Lookup current LP status in PostgreSQL / PGlite (read-only)
        let matchedLp: any = null;
        if (nomorLp) {
            matchedLp = await this.findTargetLpInScope(params.actor, null, nomorLp);
        }

        const hasCoreFields = Boolean(nomorLp && nomorDokumen && docTypeCode !== 'UNKNOWN');
        const confidence: MindikExtractedDraft['confidence'] =
            params.fileKind === 'image' && !rawText.trim()
                ? 'LOW'
                : hasCoreFields
                  ? 'HIGH'
                  : nomorLp || nomorDokumen || docTypeCode !== 'UNKNOWN'
                    ? 'MEDIUM'
                    : 'LOW';

        return {
            draft_id: `DRF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            source_filename: params.filename,
            mime_type: params.mimeType,
            file_size_bytes: params.fileSizeBytes,
            file_kind: params.fileKind,
            doc_type_code: docTypeCode,
            doc_type_nama: docMeta.nama,
            target_status_code: docMeta.statusCode,
            target_status_id: docMeta.statusId,
            is_crime_clearance: docMeta.isCC,
            lp_id: matchedLp ? Number(matchedLp.id) : null,
            nomor_lp: matchedLp?.no_laporan || nomorLp,
            current_status_code: matchedLp?.current_status_code || matchedLp?.status || (nomorLp ? 'BELUM_TERHUBUNG' : '-'),
            satker_nama: matchedLp?.satker_nama || '-',
            nomor_dokumen: nomorDokumen,
            tanggal_dokumen: dateExtract.display,
            tanggal_dokumen_iso: dateExtract.iso,
            tersangka,
            kejaksaan_tujuan: kejaksaanTujuan,
            alasan_penghentian: alasanPenghentian,
            confidence,
            needs_manual_review: confidence !== 'HIGH' || !matchedLp,
            extracted_text_preview: rawText.slice(0, 600),
            extraction_notes: params.notes
        };
    }

    private classifyMindikDocType(text: string): MindikDocTypeCode {
        if (/penyerahan\s+tersangka\s*(?:&|dan)\s*barang\s*bukti|tahap\s*(?:ii|2)\b|pelimpahan\s+tahap\s*(?:ii|2)/i.test(text)) {
            return 'TAHAP_2';
        }
        if (/pemberitahuan\s+hasil\s+penyidikan.*lengkap|berkas\s+(?:perkara\s+)?lengkap|\bp[\s-]*21\b/i.test(text)) {
            return 'P21';
        }
        if (/pengantar\s+berkas\s+perkara|\btahap\s*(?:i|1)\b|pelimpahan\s+tahap\s*(?:i|1)/i.test(text)) {
            return 'TAHAP_1';
        }
        if (/penghentian\s+penyidikan|\bsp[\s.-]*3\b/i.test(text)) {
            return 'SP3';
        }
        if (/penghentian\s+penyelidikan|\bsp[\s.-]*2\s*lidik\b|\bsp2lid\b/i.test(text)) {
            return 'SP2_LIDIK';
        }
        if (/dimulainya\s+penyidikan|\bspdp\b/i.test(text)) {
            return 'SPDP';
        }
        if (/surat\s+perintah\s+penyidikan|sprin[\s.-]*sidik/i.test(text)) {
            return 'SP_SIDIK';
        }
        if (/surat\s+perintah\s+penyelidikan|sprin[\s.-]*lidik/i.test(text)) {
            return 'SP_LIDIK';
        }
        return 'UNKNOWN';
    }

    private extractDateFromText(text: string): { display: string; iso: string | null } {
        const idRegex =
            /\b(\d{1,2})\s+(Januari|Februari|Pebruari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Nopember|Desember)\s+(\d{4})\b/i;
        const mId = text.match(idRegex);
        if (mId) {
            const dd = mId[1].padStart(2, '0');
            const mm = ID_MONTHS[mId[2].toLowerCase()] || '01';
            const yyyy = mId[3];
            return { display: `${Number(dd)} ${mId[2]} ${yyyy}`, iso: `${yyyy}-${mm}-${dd}` };
        }

        const numMatch = text.match(/\b(\d{2})[-\/](\d{2})[-\/](\d{4})\b/);
        if (numMatch) {
            const [, dd, mm, yyyy] = numMatch;
            return { display: `${dd}-${mm}-${yyyy}`, iso: `${yyyy}-${mm}-${dd}` };
        }

        const isoMatch = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
        if (isoMatch) {
            const [, yyyy, mm, dd] = isoMatch;
            return { display: `${dd}-${mm}-${yyyy}`, iso: `${yyyy}-${mm}-${dd}` };
        }

        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = String(today.getFullYear());
        return { display: `${dd}-${mm}-${yyyy}`, iso: `${yyyy}-${mm}-${dd}` };
    }

    private normalizeDateToIso(raw?: string | null): string {
        const s = String(raw || '').trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
        const parsed = this.extractDateFromText(s);
        if (parsed.iso) return parsed.iso;
        return new Date().toISOString().slice(0, 10);
    }

    private extractSuspects(text: string): string[] {
        const out: string[] = [];
        const lines = text.split(/\r?\n/);
        for (const line of lines) {
            const m = line.match(/(?:Tersangka|Terlapor)\s*(?:\d+)?\s*[:=]\s*(.+)$/i);
            if (m && m[1]) {
                const cleaned = m[1].trim();
                if (cleaned && !out.includes(cleaned)) out.push(cleaned);
            }
        }
        return out.slice(0, 8);
    }

    private async findTargetLpInScope(actor: any, lpId: number | null, nomorLp: string) {
        try {
            const conditions: string[] = ['lp.deleted_at IS NULL'];
            const params: any[] = [];

            if (lpId && lpId > 0) {
                params.push(lpId);
                conditions.push(`lp.id = $${params.length}`);
            } else if (nomorLp) {
                params.push(`%${nomorLp.replace(/\s+/g, '')}%`);
                conditions.push(`upper(replace(coalesce(lp.no_laporan, ''), ' ', '')) LIKE upper($${params.length})`);
            } else {
                return null;
            }

            if (!actor.isNational && actor.satkerId) {
                params.push(actor.satkerId);
                const idx = params.length;
                conditions.push(
                    `coalesce(lp.unit_satker_id, lp.satker_id) IN (
                        WITH RECURSIVE tree AS (
                            SELECT id FROM bdb_satker WHERE id = $${idx}
                            UNION ALL
                            SELECT c.id FROM bdb_satker c INNER JOIN tree t ON c.parent_id = t.id
                        )
                        SELECT id FROM tree
                    )`
                );
            }

            const rows = await this.dataSource.query(
                `SELECT lp.id, lp.no_laporan, lp.tgl_laporan, lp.status_id, lp.status, lp.satker_nama,
                        coalesce(sm.code, lp.status, 'BARU') AS current_status_code
                 FROM bdb_laporan_polisi lp
                 LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
                 WHERE ${conditions.join(' AND ')}
                 ORDER BY lp.id DESC
                 LIMIT 1`,
                params
            );
            return rows?.[0] || null;
        } catch {
            return null;
        }
    }

    private async resolveTargetStatusRow(statusCode: string, fallbackId?: number | null) {
        try {
            if (statusCode) {
                const rows = await this.dataSource.query(
                    `SELECT id, code, nama FROM bdb_status_master WHERE upper(code) = upper($1) LIMIT 1`,
                    [statusCode]
                );
                if (rows?.[0]) return rows[0];
            }
            if (fallbackId) {
                const rows = await this.dataSource.query(
                    `SELECT id, code, nama FROM bdb_status_master WHERE id = $1 LIMIT 1`,
                    [fallbackId]
                );
                if (rows?.[0]) return rows[0];
            }
        } catch {
            // fallback
        }
        return null;
    }

    private async resolveDocumentTypeRow(docCode: string, statusTargetId: number | null) {
        try {
            if (docCode && docCode !== 'UNKNOWN') {
                const byCode = await this.dataSource.query(
                    `SELECT id, code, nama FROM bdb_document_type_master WHERE upper(code) = upper($1) LIMIT 1`,
                    [docCode]
                );
                if (byCode?.[0]) return byCode[0];
            }
            if (statusTargetId) {
                const byStatus = await this.dataSource.query(
                    `SELECT id, code, nama FROM bdb_document_type_master WHERE status_target_id = $1 LIMIT 1`,
                    [statusTargetId]
                );
                if (byStatus?.[0]) return byStatus[0];
            }
        } catch {
            // ignore if master table empty/absent in sandbox
        }
        return null;
    }

    private async updateLaporanPolisiStatusSafe(
        runner: any,
        lpId: number,
        statusId: number,
        statusCode: string,
        isCC: boolean,
        tglIso: string
    ) {
        try {
            await runner.query(
                `UPDATE bdb_laporan_polisi
                 SET status_id = $2,
                     status = $3,
                     tanggal_selesai = ${isCC ? 'coalesce($4::date, current_date)' : 'NULL'},
                     updated_at = now()
                 WHERE id = $1`,
                isCC ? [lpId, statusId, statusCode, tglIso] : [lpId, statusId, statusCode]
            );
        } catch {
            // Sandbox minimal schema compatibility (status_id + status)
            await runner.query(
                `UPDATE bdb_laporan_polisi SET status_id = $2, status = $3 WHERE id = $1`,
                [lpId, statusId, statusCode]
            );
        }
    }

    private async emitCoserseNotification(recipientId: number | null, title: string, message: string, link: string) {
        if (!recipientId) return;
        try {
            await this.dataSource.query(
                `INSERT INTO bdb_social_notifications (recipient_id, sender_id, category, type, title, message, link)
                 VALUES ($1, $2, 'COSERSE', 'AI_DOC_APPROVED', $3, $4, $5)`,
                [recipientId, -1, title, message, link]
            );
        } catch {
            // Best-effort if table absent in minimal test fixture
        }
    }

    private async resolveActor(authUser: any) {
        const rawUserId = authUser?.id ?? authUser?.user?.id ?? null;
        const userId = rawUserId !== null && rawUserId !== undefined ? Number(rawUserId) : null;
        let dbUser: any = null;
        if (userId && Number.isSafeInteger(userId) && userId > 0) {
            try {
                const rows = await this.dataSource.query(
                    `SELECT id, username, name, role_bdb, role_name, scope_satker_id FROM auth_users WHERE id = $1 LIMIT 1`,
                    [userId]
                );
                dbUser = rows?.[0] || null;
            } catch {
                dbUser = null;
            }
        }
        const role = String(dbUser?.role_bdb || dbUser?.role_name || authUser?.role_bdb || authUser?.role || 'viewer')
            .toLowerCase()
            .trim();
        const username = String(dbUser?.username || authUser?.username || 'personel').trim();
        const satkerRaw = dbUser?.scope_satker_id ?? authUser?.scope_satker_id ?? null;
        const satkerId = satkerRaw !== null && satkerRaw !== undefined && Number(satkerRaw) > 0 ? Number(satkerRaw) : null;
        return {
            userId,
            username,
            role,
            satkerId,
            isNational: NATIONAL_ROLES.has(role),
            isBlockedRole: BLOCKED_WRITE_ROLES.has(role)
        };
    }

    // =========================================================================
    // BATCH LP UPDATE: CSV / XLSX / PASTE TABEL / SCREENSHOT OCR (HITL)
    // =========================================================================

    private async extractXlsxTextInRam(buffer: Buffer): Promise<string> {
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buffer);
        const ws = wb.worksheets?.[0];
        if (!ws) return '';
        const lines: string[] = [];
        ws.eachRow((row: any) => {
            const vals = (row.values || []).slice(1).map((v: any) => {
                if (v === null || v === undefined) return '';
                if (v instanceof Date) return v.toISOString().slice(0, 10);
                if (typeof v === 'object') {
                    if (v.result !== undefined) return String(v.result);
                    if (v.text !== undefined) return String(v.text);
                    if (Array.isArray(v.richText)) return v.richText.map((r: any) => r.text).join('');
                }
                return String(v).replace(/[\r\n]+/g, ' ').trim();
            });
            if (vals.some((c: string) => c.length > 0)) {
                lines.push(vals.map((c: string) => (c.includes(',') ? `"${c.replace(/"/g, '""')}"` : c)).join(','));
            }
        });
        return lines.join('\n');
    }

    private extractImageOcrInRam(buffer: Buffer): Promise<string> {
        return new Promise((resolve) => {
            try {
                const fs = require('fs');
                const useShm = fs.existsSync('/dev/shm');
                const tmpPath = useShm ? `/dev/shm/coserse_ocr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.png` : null;
                if (tmpPath) {
                    fs.writeFileSync(tmpPath, buffer);
                }
                const cleanup = () => {
                    if (tmpPath) {
                        try { fs.unlinkSync(tmpPath); } catch {}
                    }
                };
                const proc = spawn('tesseract', [tmpPath || '-', 'stdout', '-l', 'eng', '--psm', '4'], {
                    stdio: [tmpPath ? 'ignore' : 'pipe', 'pipe', 'pipe']
                });
                let stdout = '';
                const timer = setTimeout(() => {
                    try { proc.kill('SIGKILL'); } catch {}
                    cleanup();
                    resolve(stdout);
                }, 15000);
                proc.stdout.on('data', (d: Buffer) => { stdout += d.toString('utf8'); });
                proc.on('error', () => { clearTimeout(timer); cleanup(); resolve(''); });
                proc.on('close', () => { clearTimeout(timer); cleanup(); resolve(stdout); });
                if (!tmpPath && proc.stdin) {
                    proc.stdin.write(buffer);
                    proc.stdin.end();
                }
            } catch {
                resolve('');
            }
        });
    }

    private normalizeBatchLpNumber(raw: string): { cleanLp: string; originalLp: string; isRj: boolean; isNonLp: boolean; alasan: string | null } {
        const originalLp = String(raw || '').trim();
        const isRj = /\(\s*RJ\s*\)|RESTORATIVE\s+JUSTICE/i.test(originalLp);
        const flat = originalLp
            .replace(/\r?\n+/g, ' ')
            .replace(/\(\s*RJ\s*\)/gi, ' ')
            .replace(/\b(?:TANGGAL|TGL|SUBDIT|UNIT)\b.*$/i, ' ')
            .replace(/^["']+|["']+$/g, '')
            .replace(/\bLP\s*\.\s*([AB])\s*\//gi, 'LP/$1/')
            .replace(/\bLP([AB])\s*\//gi, 'LP/$1/')
            .replace(/\s*\/\s*/g, '/')
            .replace(/\/{2,}/g, '/')
            .replace(/\s+/g, ' ')
            .trim();
        const isNonLp = /^(?:R\/)?LI\//i.test(flat) || /\b(?:R\/)?LI\/[0-9A-Z./-]+/i.test(flat);
        let clean = flat;
        // Extract core LP/[AB]/... token if surrounded by extra text
        const m = clean.match(/LP\/[AB]\/[A-Z0-9./-]+(?:\s+[A-Z0-9./-]+)*/i);
        if (m) {
            clean = m[0].replace(/\s*\/\s*/g, '/').replace(/\/{2,}/g, '/').trim();
        }
        return {
            cleanLp: clean,
            originalLp,
            isRj,
            isNonLp,
            alasan: isRj ? 'Penyelesaian luar proses peradilan / Restorative Justice' : null
        };
    }

    private normalizeBatchDate(raw: string): string | null {
        const s = String(raw || '').trim();
        if (!s) return null;
        // YYYY-MM-DD or YYYY/MM/DD
        const isoMatch = s.match(/\b(20\d{2}|19\d{2})[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12]\d|3[01])\b/);
        if (isoMatch) {
            return `${isoMatch[1]}-${String(isoMatch[2]).padStart(2, '0')}-${String(isoMatch[3]).padStart(2, '0')}`;
        }
        // M/D/YYYY or DD/MM/YYYY or DD-MM-YYYY
        const slashMatch = s.match(/\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2}|19\d{2})\b/);
        if (slashMatch) {
            const p1 = Number(slashMatch[1]);
            const p2 = Number(slashMatch[2]);
            const yr = slashMatch[3];
            let month = p1;
            let day = p2;
            // If first part > 12, it's DD/MM/YYYY; otherwise M/D/YYYY (Excel/US CSV style like 3/16/2026)
            if (p1 > 12) {
                day = p1;
                month = p2;
            }
            if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                return `${yr}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            }
        }
        return null;
    }

    private mapBatchStatusCode(rawStatus: string): { code: string; label: string; isCC: boolean } | null {
        const up = String(rawStatus || '').toUpperCase().replace(/\s+/g, ' ').trim();
        if (!up) return null;
        if (/\bLIMPAH\b/.test(up)) return { code: 'LIMPAH', label: 'Limpah (Perlu Konfirmasi)', isCC: false };
        if (/SP[\s.-]*3\s*LIDIK|HENTI\s*LIDIK|SP\.?\s*HENTI\s*LIDIK|SP2[\s_.-]*LID|H\.?\s*LIDIK|SPP\.?\s*LIDIK/.test(up)) {
            return { code: 'SP2_LID', label: 'Henti Lidik / SP2Lid', isCC: true };
        }
        if (/\bSP[\s.-]*3\b|HENTI\s*SIDIK/.test(up)) return { code: 'SP3', label: 'Henti Sidik / SP3', isCC: true };
        if (/P[\s.-]*21\b/.test(up)) return { code: 'P21', label: 'P21', isCC: false };
        if (/\bPERMA\b/.test(up)) return { code: 'PERMA', label: 'Perma', isCC: true };
        if (/(?:TAHAP|HAP)[\s_.-]*(II|2)\b/.test(up)) return { code: 'TAHAP_II', label: 'Tahap II', isCC: true };
        if (/TAHAP[\s_.-]*(I|1)\b/.test(up)) return { code: 'TAHAP_I', label: 'Tahap I', isCC: false };
        if (/P[\s.-]*19\b/.test(up)) return { code: 'P19', label: 'P19', isCC: false };
        if (/\bSPDP\b/.test(up)) return { code: 'SPDP', label: 'Kirim SPDP', isCC: false };
        if (/\bSIDIK\b|PENYIDIKAN/.test(up)) return { code: 'PENYIDIKAN', label: 'Sidik', isCC: false };
        if (/\bLIDIK\b|PENYELIDIKAN/.test(up)) return { code: 'PENYELIDIKAN', label: 'Lidik', isCC: false };
        return null;
    }

    private splitCsvLine(line: string, delim: string): string[] {
        if (delim !== ',') {
            return line.split(delim).map((c) => c.replace(/^["']|["']$/g, '').trim());
        }
        const cells: string[] = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    cur += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (ch === ',' && !inQuotes) {
                cells.push(cur.trim());
                cur = '';
            } else {
                cur += ch;
            }
        }
        cells.push(cur.trim());
        return cells;
    }

    extractBatchRowsFromText(text: string): Array<{
        rawNomorLp: string;
        cleanLp: string;
        alasan: string | null;
        unit: string | null;
        subdit: string | null;
        rawStatus: string;
        statusBaru: string;
        statusLabel: string;
        tanggalSelra: string | null;
    }> {
        const lines = String(text || '')
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);
        if (!lines.length) return [];

        // Detect header line & delimiter
        let headerIdx = -1;
        let delim = ',';
        let colMap = { lp: -1, status: -1, tanggal: -1, unit: -1, subdit: -1 };

        for (let i = 0; i < Math.min(lines.length, 8); i++) {
            const l = lines[i];
            const candDelim = l.includes('\t') ? '\t' : l.includes(';') ? ';' : l.includes('|') ? '|' : ',';
            const cols = this.splitCsvLine(l, candDelim).map((c) => c.toUpperCase());
            const lpCol = cols.findIndex((c) => /NOMOR\s*LP|NO\.?\s*LP|\bLP\b/.test(c));
            const stCol = cols.findIndex((c) => /KATEGORI\s*SELRA|STATUS|SELRA/.test(c));
            if (lpCol >= 0 && (stCol >= 0 || cols.length >= 3)) {
                headerIdx = i;
                delim = candDelim;
                colMap = {
                    lp: lpCol,
                    status: stCol,
                    tanggal: cols.findIndex((c) => /TANGGAL|TGL/.test(c)),
                    unit: cols.findIndex((c) => /\bUNIT\b/.test(c)),
                    subdit: cols.findIndex((c) => /\bSUBDIT\b/.test(c))
                };
                break;
            }
        }

        const results: Array<{
            rawNomorLp: string;
            cleanLp: string;
            alasan: string | null;
            unit: string | null;
            subdit: string | null;
            rawStatus: string;
            statusBaru: string;
            statusLabel: string;
            tanggalSelra: string | null;
        }> = [];

        const startIdx = headerIdx >= 0 ? headerIdx + 1 : 0;
        for (let i = startIdx; i < lines.length; i++) {
            const line = lines[i];
            if (/^[-|=\s]+$/.test(line)) continue;
            // Skip duplicate header lines
            if (/NOMOR\s*LP/i.test(line) && /KATEGORI|STATUS/i.test(line)) continue;

            if (headerIdx >= 0 && colMap.lp >= 0) {
                const cells = this.splitCsvLine(line, delim);
                const rawLpCell = cells[colMap.lp] || '';
                if (!/LP\s*\/\s*[AB]\s*\//i.test(rawLpCell)) continue;
                const normLp = this.normalizeBatchLpNumber(rawLpCell);
                const rawStatusCell = colMap.status >= 0 ? cells[colMap.status] || '' : '';
                const rawDateCell = colMap.tanggal >= 0 ? cells[colMap.tanggal] || '' : '';
                const mapped = this.mapBatchStatusCode(rawStatusCell) || this.mapBatchStatusCode(line);
                if (!mapped) continue;
                results.push({
                    rawNomorLp: rawLpCell,
                    cleanLp: normLp.cleanLp,
                    alasan: normLp.alasan,
                    unit: colMap.unit >= 0 ? cells[colMap.unit] || null : null,
                    subdit: colMap.subdit >= 0 ? cells[colMap.subdit] || null : null,
                    rawStatus: rawStatusCell || mapped.label,
                    statusBaru: mapped.code,
                    statusLabel: mapped.label,
                    tanggalSelra: this.normalizeBatchDate(rawDateCell) || this.normalizeBatchDate(line)
                });
            } else {
                // Free-text / OCR screenshot line fallback
                const lpMatch = line.match(/LP\s*\/\s*[AB]\s*\/[^\t,;|]+/i);
                if (!lpMatch) continue;
                const rawLpBeforeStatus = lpMatch[0]
                    .replace(/\b(SP3|P[\s-]*21|PERMA|HENTI\s*LIDIK|SP2[\s_-]*LID|TAHAP[\s_-]*(?:II|2|I|1)|P[\s-]*19|SPDP)\b.*$/i, '')
                    .replace(/\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b.*$/, '')
                    .replace(/\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b.*$/, '')
                    .trim();
                const normLp = this.normalizeBatchLpNumber(rawLpBeforeStatus);
                const mapped = this.mapBatchStatusCode(line);
                if (!mapped) continue;
                results.push({
                    rawNomorLp: lpMatch[0].trim(),
                    cleanLp: normLp.cleanLp,
                    alasan: normLp.alasan,
                    unit: null,
                    subdit: null,
                    rawStatus: mapped.label,
                    statusBaru: mapped.code,
                    statusLabel: mapped.label,
                    tanggalSelra: this.normalizeBatchDate(line)
                });
            }
        }
        return results;
    }

    async proposeBatchFromText(authUser: any, rawText: string): Promise<BatchLpReviewCard | null> {
        const rows = this.extractBatchRowsFromText(rawText);
        if (rows.length < 2 && !(/\b(update|ubah|batch|csv|tabel|data ini)\b/i.test(rawText) && rows.length >= 1)) {
            return null;
        }
        const actor = await this.resolveActor(authUser);
        return this.proposeBatchUpdateLp(actor, rows, 'paste-tabel-chat');
    }

    async proposeBatchUpdateLp(
        actor: { userId: number | null; username: string; role: string; satkerId: number | null; isNational: boolean; isBlockedRole: boolean },
        parsedRows: ReturnType<CoserseDocParserService['extractBatchRowsFromText']>,
        sourceLabel: string
    ): Promise<BatchLpReviewCard> {
        const handle = this.llmService.normalizeHandle(actor.username);
        if (actor.isBlockedRole) {
            throw new ForbiddenException(
                `Maaf ${handle}, role "${actor.role}" bersifat baca-saja dan tidak berwenang melakukan batch update LP.`
            );
        }

        const cleanKeys = Array.from(new Set(parsedRows.map((r) => r.cleanLp.replace(/\s+/g, '').toUpperCase()).filter(Boolean)));
        const dbByCompactNo = new Map<string, any>();

        if (cleanKeys.length > 0) {
            const params: any[] = [cleanKeys];
            let scopeClause = '1=1';
            if (!actor.isNational) {
                if (!actor.satkerId || actor.satkerId <= 0) {
                    scopeClause = '1=0';
                } else {
                    params.push(actor.satkerId);
                    scopeClause = `coalesce(lp.unit_satker_id, lp.satker_id) IN (
                        WITH RECURSIVE tree AS (
                            SELECT id FROM bdb_satker WHERE id = $2
                            UNION ALL
                            SELECT c.id FROM bdb_satker c INNER JOIN tree t ON c.parent_id = t.id
                        )
                        SELECT id FROM tree
                    )`;
                }
            }
            const dbRows: any[] = await this.dataSource.query(
                `SELECT lp.id, lp.no_laporan, lp.tgl_laporan, lp.status_id, lp.status, lp.satker_nama,
                        coalesce(sm.code, lp.status, 'BARU') AS current_status_code,
                        upper(replace(coalesce(lp.no_laporan, ''), ' ', '')) AS compact_no
                 FROM bdb_laporan_polisi lp
                 LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
                 WHERE lp.deleted_at IS NULL
                   AND ${scopeClause}
                   AND upper(replace(coalesce(lp.no_laporan, ''), ' ', '')) = ANY($1::text[])
                 ORDER BY lp.id DESC`,
                params
            );
            for (const row of dbRows) {
                if (!dbByCompactNo.has(row.compact_no)) {
                    dbByCompactNo.set(row.compact_no, row);
                }
            }
        }

        const items: BatchLpProposalItem[] = parsedRows.map((row, idx) => {
            const key = row.cleanLp.replace(/\s+/g, '').toUpperCase();
            const found = dbByCompactNo.get(key) || null;
            if (!found) {
                return {
                    row_index: idx + 1,
                    raw_nomor_lp: row.rawNomorLp,
                    nomor_lp: row.cleanLp,
                    unit: row.unit,
                    subdit: row.subdit,
                    raw_status: row.rawStatus,
                    status_baru: row.statusBaru,
                    status_baru_label: row.statusLabel,
                    tanggal_selra: row.tanggalSelra,
                    alasan: row.alasan,
                    matched: false,
                    action: 'SKIP',
                    skip_reason: 'Tidak ditemukan di DB',
                    lp_id: null,
                    no_laporan_db: null,
                    satker_nama: null,
                    status_lama: null,
                    tgl_laporan_db: null,
                    selected: false
                };
            }
            const statusLama = String(found.current_status_code || found.status || 'BARU').toUpperCase();
            const ccStatuses = new Set(['TAHAP_II', 'SP3', 'SP2_LID', 'PERMA']);
            const ctStatuses = new Set(['LIDIK', 'SIDIK', 'SPDP', 'TAHAP_I', 'P19', 'P21']);
            const missingStopReason =
                (row.statusBaru === 'SP2_LID' || row.statusBaru === 'SP3') &&
                !String(row.alasan || '').trim();
            const missingPermaKategori =
                row.statusBaru === 'PERMA' &&
                !/(tipiring|lha\s*ppatk|ppatk)/i.test(`${row.alasan || ''} ${row.rawStatus || ''} ${row.subdit || ''} ${row.unit || ''}`);
            const isCcRegression = ccStatuses.has(statusLama) && ctStatuses.has(row.statusBaru);
            const isLimpah = row.statusBaru === 'LIMPAH';
            const isSp3WithLidikHint = row.statusBaru === 'SP3' && /\b(LIDIK|H\.?\s*LIDIK|SPP\.?\s*LIDIK)\b/i.test(`${row.rawStatus || ''} ${row.alasan || ''}`);
            const skipReasons: string[] = [];
            if ((row as any).isNonLp) skipReasons.push('Bukan LP (Laporan Informasi / LI)');
            if (isLimpah) skipReasons.push('Status LIMPAH perlu konfirmasi manual via chat');
            if (isSp3WithLidikHint) skipReasons.push('Tertulis SP3 namun keterangan mengandung LIDIK (verifikasi SP3 vs SP2_LID)');
            if (missingStopReason) skipReasons.push(`${row.statusBaru} tanpa alasan penghentian`);
            if (missingPermaKategori) skipReasons.push('PERMA tanpa kategori (Tipiring / LHA PPATK)');
            if (isCcRegression) skipReasons.push(`Status mundur dari CC (${statusLama} -> ${row.statusBaru})`);
            return {
                row_index: idx + 1,
                raw_nomor_lp: row.rawNomorLp,
                nomor_lp: row.cleanLp,
                unit: row.unit,
                subdit: row.subdit,
                raw_status: row.rawStatus,
                status_baru: row.statusBaru,
                status_baru_label: row.statusLabel,
                tanggal_selra: row.tanggalSelra,
                alasan: row.alasan,
                matched: true,
                action: 'UPDATE',
                skip_reason: skipReasons.length ? skipReasons.join('; ') : null,
                lp_id: Number(found.id),
                no_laporan_db: String(found.no_laporan || row.cleanLp),
                satker_nama: String(found.satker_nama || 'POLRI'),
                status_lama: statusLama,
                tgl_laporan_db: found.tgl_laporan ? String(found.tgl_laporan) : null,
                selected: skipReasons.length === 0
            };
        });

        const readyCount = items.filter((i) => i.action === 'UPDATE' && i.selected !== false).length;
        const notFoundCount = items.filter((i) => !i.matched).length;
        const missingReasonCount = items.filter((i) => i.matched && i.selected === false).length;
        const skipCount = items.length - readyCount;
        return {
            batch_id: `batch-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
            source: sourceLabel,
            total_rows: items.length,
            ready_count: readyCount,
            not_found_count: notFoundCount,
            missing_reason_count: missingReasonCount,
            skip_count: skipCount,
            items
        } as any;
    }

    async commitBatchUpdateLp(
        authUser: any,
        dto: {
            batch_id?: string;
            operator_confirmed?: boolean;
            items?: Array<{
                lp_id: number;
                nomor_lp: string;
                status_baru: string;
                tanggal_selra?: string | null;
                alasan?: string | null;
            }>;
        },
        clientIp?: string
    ) {
        const actor = await this.resolveActor(authUser);
        const handle = this.llmService.normalizeHandle(actor.username);

        if (!dto || dto.operator_confirmed !== true) {
            throw new ForbiddenException(
                `Ditolak: batch update membutuhkan konfirmasi klik operator (${handle}).`
            );
        }
        if (actor.isBlockedRole) {
            throw new ForbiddenException(
                `Maaf ${handle}, role "${actor.role}" bersifat baca-saja dan tidak berwenang memperbarui status LP.`
            );
        }

        const rawItems = Array.isArray(dto.items) ? dto.items.filter((i) => Number(i?.lp_id) > 0) : [];
        if (!rawItems.length) {
            throw new BadRequestException(`Tidak ada baris LP valid yang dipilih untuk diperbarui.`);
        }

        const statusRows: any[] = await this.dataSource.query(
            `SELECT id, code, nama, kategori FROM bdb_status_master`
        );
        const statusByCode = new Map<string, any>();
        for (const sr of statusRows) {
            statusByCode.set(String(sr.code || '').toUpperCase(), sr);
        }

        const dirtyPartitions = new Map<string, { tahun: number; bulan: number }>();
        const addDirtyFromDate = (dateStr?: string | null) => {
            const iso = this.normalizeBatchDate(dateStr || '');
            if (!iso) return;
            const [y, m] = iso.split('-').map(Number);
            if (y >= 2000 && y <= 2100 && m >= 1 && m <= 12) {
                dirtyPartitions.set(`${y}-${String(m).padStart(2, '0')}`, { tahun: y, bulan: m });
            }
        };

        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();

        let updatedCount = 0;
        const skippedIds: number[] = [];
        const updatedLps: Array<{ lp_id: number; no_laporan: string; status_lama: string; status_baru: string }> = [];

        try {
            for (const item of rawItems) {
                const lpRow = await this.findTargetLpInScope(actor, Number(item.lp_id), item.nomor_lp || '');
                if (!lpRow) {
                    skippedIds.push(Number(item.lp_id));
                    continue;
                }
                const targetCode = String(item.status_baru || '').trim().toUpperCase();
                const statusRow = statusByCode.get(targetCode) || (await this.resolveTargetStatusRow(targetCode, null));
                const nextStatusId = Number(statusRow?.id || lpRow.status_id || 2);
                const nextStatusCode = String(statusRow?.code || targetCode || lpRow.current_status_code);
                const isCC = String(statusRow?.kategori || '').toUpperCase() === 'CC' || ['SP3', 'SP2_LID', 'PERMA', 'TAHAP_II'].includes(nextStatusCode);
                const tglIso = this.normalizeBatchDate(item.tanggal_selra || '') || new Date().toISOString().slice(0, 10);

                await this.updateLaporanPolisiStatusSafe(runner, lpRow.id, nextStatusId, nextStatusCode, isCC, tglIso);

                const docMeta = {
                    batch_id: dto.batch_id || null,
                    source: 'COSERSE_BATCH_LP_UPDATE',
                    alasan: item.alasan || null,
                    approved_by_handle: handle,
                    approved_at: new Date().toISOString(),
                    previous_status: lpRow.current_status_code,
                    next_status: nextStatusCode
                };
                try {
                    const docTypeRow = await this.resolveDocumentTypeRow(nextStatusCode === 'SP2_LID' ? 'SP2LID' : nextStatusCode, nextStatusId);
                    await runner.query(
                        `INSERT INTO bdb_dokumen (lp_id, document_type_id, nomor_dokumen, tanggal_dokumen, data, lampiran, created_by)
                         VALUES ($1, $2, $3, $4::date, $5::jsonb, '[]'::jsonb, $6)`,
                        [
                            lpRow.id,
                            docTypeRow?.id || 1,
                            `BATCH-${dto.batch_id || Date.now()}`,
                            tglIso,
                            JSON.stringify(docMeta),
                            actor.userId || null
                        ]
                    );
                } catch {
                    // best-effort document log
                }

                addDirtyFromDate(tglIso);
                if (lpRow.tgl_laporan) addDirtyFromDate(String(lpRow.tgl_laporan));

                updatedCount++;
                updatedLps.push({
                    lp_id: Number(lpRow.id),
                    no_laporan: String(lpRow.no_laporan || item.nomor_lp),
                    status_lama: String(lpRow.current_status_code || ''),
                    status_baru: nextStatusCode
                });
            }
            await runner.commitTransaction();
        } catch (err: any) {
            await runner.rollbackTransaction();
            this.logger.error(`Gagal commit batch LP update: ${err?.message || err}`);
            throw new BadRequestException(`Gagal menyimpan batch update ke database: ${err?.message || err}`);
        } finally {
            await runner.release();
        }

        // Mark affected (tahun, bulan) partitions as dirty
        for (const [pKey, part] of dirtyPartitions.entries()) {
            try {
                await this.dataSource.query(
                    `INSERT INTO bdb_snapshot_partition_state (partition_key, tahun, bulan, is_dirty, last_dirty_at, dirty_reason)
                     VALUES ($1, $2, $3, true, NOW(), 'coserse_batch_lp_update')
                     ON CONFLICT (partition_key) DO UPDATE
                     SET is_dirty = true, last_dirty_at = NOW(), dirty_reason = EXCLUDED.dirty_reason`,
                    [pKey, part.tahun, part.bulan]
                );
            } catch {
                // ignore if partition table absent
            }
        }

        await this.audit.log({
            userId: actor.userId ?? undefined,
            userName: handle,
            action: 'AI_BATCH_LP_UPDATE_APPROVED',
            entity: 'bdb_laporan_polisi',
            entityId: dto.batch_id || `batch-${Date.now()}`,
            meta: {
                batch_id: dto.batch_id || null,
                updated_count: updatedCount,
                skipped_count: skippedIds.length,
                dirty_partitions: Array.from(dirtyPartitions.keys())
            },
            ip: clientIp,
            outcome: 'SUCCESS'
        });

        return {
            status: 1,
            batch_id: dto.batch_id || null,
            updated_count: updatedCount,
            skipped_count: skippedIds.length,
            dirty_partitions: Array.from(dirtyPartitions.keys()),
            updated_lps: updatedLps,
            message: `Siap ${handle}, berhasil memperbarui ${updatedCount} Laporan Polisi secara resmi dalam satu transaksi database.`,
            disclaimer: COSERSE_MANDATORY_DISCLAIMER
        };
    }
}
