import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';

export interface CoserseKnowledgeChunk {
    id: number;
    source_doc: string;
    doc_title: string;
    section_title: string;
    pasal_ref: string | null;
    content: string;
    score?: number;
}

@Injectable()
export class CoserseKnowledgeService implements OnModuleInit {
    private readonly logger = new Logger(CoserseKnowledgeService.name);
    private indexReady = false;

    constructor(private readonly dataSource: DataSource) {}

    async onModuleInit(): Promise<void> {
        await this.ensureKnowledgeIndex();
    }

    private resolveKnowledgeDir(): string | null {
        const candidates = [
            path.join(process.cwd(), 'docs', 'coserse_knowledge'),
            path.resolve(__dirname, '../../../../docs/coserse_knowledge'),
            path.resolve(__dirname, '../../../docs/coserse_knowledge'),
            '/usr/src/app/docs/coserse_knowledge'
        ];
        for (const dir of candidates) {
            try {
                if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
                    return dir;
                }
            } catch {
                // ignore
            }
        }
        return null;
    }

    async ensureKnowledgeIndex(): Promise<void> {
        if (this.indexReady) return;
        try {
            await this.dataSource.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
            await this.dataSource.query(`
                CREATE TABLE IF NOT EXISTS bdb_coserse_knowledge_chunks (
                    id SERIAL PRIMARY KEY,
                    source_doc VARCHAR(120) NOT NULL,
                    doc_title VARCHAR(255) NOT NULL,
                    section_title VARCHAR(255) NOT NULL,
                    pasal_ref VARCHAR(120),
                    content TEXT NOT NULL,
                    search_text TEXT NOT NULL,
                    content_hash VARCHAR(64) NOT NULL,
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `);
            await this.dataSource.query(`
                CREATE INDEX IF NOT EXISTS idx_coserse_knowledge_trgm
                ON bdb_coserse_knowledge_chunks
                USING gin (search_text gin_trgm_ops)
            `);
            await this.dataSource.query(`
                CREATE INDEX IF NOT EXISTS idx_coserse_knowledge_source
                ON bdb_coserse_knowledge_chunks (source_doc)
            `);

            const dir = this.resolveKnowledgeDir();
            if (dir) {
                await this.syncDirectoryToDb(dir);
            } else {
                this.logger.warn('[MiniRAG] Direktori docs/coserse_knowledge tidak ditemukan; memakai indeks DB yang ada.');
            }
            this.indexReady = true;
        } catch (err: any) {
            this.logger.warn(`[MiniRAG] Gagal inisialisasi indeks pg_trgm: ${err?.message || err}`);
        }
    }

    private parseMarkdownChunks(sourceDoc: string, rawMd: string) {
        const lines = String(rawMd || '').split(/\r?\n/);
        let docTitle = sourceDoc;
        const sections: Array<{ sectionTitle: string; pasalRef: string | null; content: string }> = [];
        let currentTitle = '';
        let buf: string[] = [];

        const flush = () => {
            const content = buf.join('\n').trim();
            if (!currentTitle || !content) return;
            const pasalMatch = currentTitle.match(/Pasal\s+[0-9]+(?:\s*[–-]\s*[0-9]+)?(?:\s+Angka\s+[0-9]+(?:\s*&\s*Angka\s+[0-9]+)?)?/i);
            sections.push({
                sectionTitle: currentTitle.slice(0, 240),
                pasalRef: pasalMatch ? pasalMatch[0] : null,
                content: content.slice(0, 1400)
            });
        };

        for (const line of lines) {
            if (line.startsWith('# ')) {
                docTitle = line.slice(2).trim().slice(0, 240);
            } else if (line.startsWith('## ')) {
                flush();
                currentTitle = line.slice(3).trim();
                buf = [];
            } else if (currentTitle) {
                buf.push(line);
            }
        }
        flush();

        return sections.map((sec) => {
            const searchText = `${docTitle}\n${sec.sectionTitle}\n${sec.content}`.trim();
            const contentHash = crypto.createHash('sha256').update(searchText).digest('hex');
            return {
                sourceDoc,
                docTitle,
                sectionTitle: sec.sectionTitle,
                pasalRef: sec.pasalRef,
                content: sec.content,
                searchText,
                contentHash
            };
        });
    }

    private async syncDirectoryToDb(dir: string): Promise<void> {
        const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
        let syncedCount = 0;
        for (const file of files) {
            const sourceDoc = file.replace(/\.md$/i, '');
            const raw = fs.readFileSync(path.join(dir, file), 'utf8');
            const fileHash = crypto.createHash('sha256').update(raw).digest('hex');

            const existing: any[] = await this.dataSource.query(
                `SELECT content_hash FROM bdb_coserse_knowledge_chunks WHERE source_doc = $1 LIMIT 1`,
                [sourceDoc]
            );
            const markerHash = `file:${fileHash.slice(0, 48)}`;
            if (existing?.[0]?.content_hash === markerHash) {
                continue;
            }

            const chunks = this.parseMarkdownChunks(sourceDoc, raw);
            await this.dataSource.query(`DELETE FROM bdb_coserse_knowledge_chunks WHERE source_doc = $1`, [sourceDoc]);
            for (let i = 0; i < chunks.length; i++) {
                const c = chunks[i];
                await this.dataSource.query(
                    `INSERT INTO bdb_coserse_knowledge_chunks
                        (source_doc, doc_title, section_title, pasal_ref, content, search_text, content_hash)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        c.sourceDoc,
                        c.docTitle,
                        c.sectionTitle,
                        c.pasalRef,
                        c.content,
                        c.searchText,
                        i === 0 ? markerHash : c.contentHash
                    ]
                );
                syncedCount++;
            }
        }
        if (syncedCount > 0) {
            this.logger.log(`[MiniRAG] Indeks pg_trgm disinkronkan: ${syncedCount} pasal/SOP dari ${files.length} dokumen.`);
        }
    }

    shouldRetrieveKnowledge(query: string): boolean {
        const q = String(query || '').trim();
        if (!q || q.length < 4) return false;
        return /\b(pasal|kuhp|kuhap|perkap|perpol|perkabareskrim|perma|uu\s*1\s*\/\s*2023|uu\s*8\s*\/\s*1981|sop|syarat|mindik|spdp|sp2hp|sp2[\s_-]?lid|sp3|p[\s-]?19|p[\s-]?21|tahap\s*(?:1|2|i|ii)|penangkapan|penahanan|penggeledahan|penyitaan|praperadilan|gelar\s+perkara|tersangka|alat\s+bukti|restorative|keadilan\s+restoratif|\brj\b|penipuan|penggelapan|pencurian|pemalsuan|penganiayaan|pembunuhan|penadahan|batas\s+waktu|penyidikan|penyelidikan|sttlp|sprin|wass?idik|lha|ppatk|pemblokiran|rekening|tipiring|korporasi|barang\s+bukti|register\s+bb|tahti|perpol\s*4\s*\/\s*2025|ite|tppu|tipikor|tpks|sppa|pkdrt|tppo|minerba|migas|184|109|110|138|492|486|476|391|3\/2013|2\/2012|1\/2024|10\/2010|8\/2014|4\/2025)\b/i.test(
            q
        );
    }

    async retrieveRelevantChunks(query: string, limit = 3): Promise<CoserseKnowledgeChunk[]> {
        if (!this.shouldRetrieveKnowledge(query)) {
            return [];
        }
        await this.ensureKnowledgeIndex();

        const cleanQuery = String(query || '').replace(/\s+/g, ' ').trim().slice(0, 300);
        const safeLimit = Math.min(Math.max(Number(limit) || 3, 1), 3);

        // Extract specific tokens like "492", "spdp", "perpol", "8/2021", "6/2019", "1/2022" for exact boost
        const tokens = Array.from(
            new Set(
                (cleanQuery.toLowerCase().match(/\b(?:pasal\s*\d+|\d+\/\d{4}|\d{2,3}|spdp|sp2hp|sp2lid|sp2-lid|sp3|p19|p21|p-19|p-21|perkap|perpol|perkabareskrim|perma|kuhp|kuhap|restorative|mindik|praperadilan|penangkapan|penahanan|penggeledahan|penyitaan|gelar|tersangka|penipuan|penggelapan|pencurian|pemalsuan|penganiayaan|pembunuhan|lha|ppatk|pemblokiran|rekening|tipiring|korporasi|barang\s+bukti|register\s+bb|tahti|wass?idik|ite|tppu|tipikor|tpks|sppa|pkdrt|tppo|minerba|migas)\b/gi) || [])
                    .map((t) => t.trim())
            )
        ).slice(0, 6);

        try {
            const params: any[] = [cleanQuery, safeLimit];
            let boostSql = '0';
            if (tokens.length > 0) {
                const boostParts = tokens.map((tok) => {
                    params.push(`%${tok}%`);
                    return `CASE WHEN search_text ILIKE $${params.length} THEN 0.35 ELSE 0 END`;
                });
                boostSql = `(${boostParts.join(' + ')})`;
            }

            const rows: any[] = await this.dataSource.query(
                `SELECT
                    id,
                    source_doc,
                    doc_title,
                    section_title,
                    pasal_ref,
                    left(content, 380) AS content,
                    (
                        coalesce(word_similarity($1, search_text), 0) * 1.6
                        + coalesce(similarity($1, search_text), 0)
                        + ${boostSql}
                    ) AS score
                 FROM bdb_coserse_knowledge_chunks
                 WHERE search_text % $1
                    OR word_similarity($1, search_text) > 0.18
                    ${tokens.length > 0 ? `OR ${tokens.map((_, idx) => `search_text ILIKE $${idx + 3}`).join(' OR ')}` : ''}
                 ORDER BY score DESC, id ASC
                 LIMIT $2`,
                params
            );

            return (rows || []).map((r) => ({
                id: Number(r.id),
                source_doc: String(r.source_doc),
                doc_title: String(r.doc_title),
                section_title: String(r.section_title),
                pasal_ref: r.pasal_ref ? String(r.pasal_ref) : null,
                content: String(r.content || '').trim(),
                score: Number(r.score || 0)
            }));
        } catch (err: any) {
            this.logger.warn(`[MiniRAG] Query pg_trgm gagal: ${err?.message || err}`);
            return [];
        }
    }
}
