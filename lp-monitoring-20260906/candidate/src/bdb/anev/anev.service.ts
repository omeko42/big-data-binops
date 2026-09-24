import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

// tgl_laporan = teks 'DD-MM-YYYY HH:MM:SS'; fallback ke synced_at bila format tak sesuai.
const DATE_EXPR = "coalesce(parse_tgl_laporan(lp.tgl_laporan), lp.synced_at::date)";

type Filter = {
    year?: any;
    month?: any;
    date_from?: string;
    date_to?: string;
    status?: string;
    functionDomain?: string;
    organizationDomain?: string;
};

export type AnevNode = { id: number; kode: string; nama: string; parent_id: number | null; depth: number; status: Record<string, number>; ct: number; cc: number; total: number; children?: AnevNode[] };

@Injectable()
export class AnevService {
    private dashCache = new Map<string, { at: number; res: any }>();
    async refreshRekapSnapshot() {
        await this.ds.query(`
            INSERT INTO bdb_anev_rekap_snapshot (satker_id, status_code, kategori, tanggal, total_lp, refreshed_at)
            SELECT 
                lp.satker_id,
                coalesce(st.code, 'LP') as status_code,
                coalesce(st.kategori, 'CT') as kategori,
                coalesce(parse_tgl_laporan(lp.tgl_laporan), lp.synced_at::date) as tanggal,
                count(*)::int as total_lp,
                now() as refreshed_at
            FROM bdb_laporan_polisi lp
            LEFT JOIN bdb_status_master st ON st.id = lp.status_id
            WHERE lp.deleted_at IS NULL
              AND coalesce(lp.dilimpahkan_eksternal, false) = false
              AND lp.satker_id IS NOT NULL
              AND coalesce(parse_tgl_laporan(lp.tgl_laporan), lp.synced_at::date) >= '2025-01-01'::date
            GROUP BY lp.satker_id, st.code, st.kategori, 4
            ON CONFLICT (satker_id, status_code, tanggal) 
            DO UPDATE SET 
                total_lp = EXCLUDED.total_lp,
                kategori = EXCLUDED.kategori,
                refreshed_at = now();
        `);
    }


    constructor(private readonly ds: DataSource) {}

    /**
     * Filter klasifikasi satker untuk dashboard. Internal Reserse mempertahankan owner lama yang
     * masih menempel langsung ke POLDA/POLRES/POLSEK (STRUCTURAL), sama dengan fallback Kinerja
     * Perkara. Domain lain tetap exact. Semua nilai masuk sebagai parameter SQL.
     */
    private appendTaxonomyFilter(f: Filter, params: any[], wh: string[], lpAlias = 'lp') {
        const functionDomain = String(f.functionDomain || '').toUpperCase();
        const organizationDomain = String(f.organizationDomain || '').toUpperCase();
        const validFunctions = new Set(['INTERNAL_RESERSE', 'EKSTERNAL_RESERSE', 'STRUCTURAL', 'NOT_APPLICABLE']);
        const validOrganizations = new Set(['INTERNAL_POLRI', 'EKSTERNAL_POLRI', 'NOT_APPLICABLE']);
        if (!validFunctions.has(functionDomain) || !validOrganizations.has(organizationDomain)) return;

        params.push(organizationDomain);
        const organizationParam = `$${params.length}`;
        if (functionDomain === 'INTERNAL_RESERSE' && organizationDomain === 'INTERNAL_POLRI') {
            params.push(['INTERNAL_RESERSE', 'STRUCTURAL']);
        } else {
            params.push([functionDomain]);
        }
        const functionParam = `$${params.length}`;
        wh.push(`exists (
            select 1 from bdb_satker_taxonomy_r11 tx
             where tx.source_table='BDB_SATKER'
               and tx.entity_id=coalesce(${lpAlias}.unit_satker_id, ${lpAlias}.satker_id)
               and tx.organization_domain=${organizationParam}
               and tx.function_domain=any(${functionParam})
        )`);
        wh.push(`${lpAlias}.deleted_at is null`);
        wh.push(`coalesce(${lpAlias}.dilimpahkan_eksternal,false)=false`);
    }

    private buildWhere(f: Filter) {
        const params: any[] = [];
        const wh: string[] = [];
        if (f.date_from) {
            params.push(f.date_from);
            wh.push(`${DATE_EXPR} >= $${params.length}`);
        }
        if (f.date_to) {
            params.push(f.date_to);
            wh.push(`${DATE_EXPR} <= $${params.length}`);
        }
        if (f.year) {
            params.push(Number(f.year));
            wh.push(`extract(year from ${DATE_EXPR})=$${params.length}`);
        }
        if (f.month) {
            params.push(Number(f.month));
            wh.push(`extract(month from ${DATE_EXPR})=$${params.length}`);
        }
        if (f.status) {
            const arr = String(f.status)
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            if (arr.length) {
                params.push(arr);
                wh.push(`st.code = any($${params.length})`);
            }
        }
        this.appendTaxonomyFilter(f, params, wh);
        return { where: wh.length ? 'where ' + wh.join(' and ') : '', params };
    }

    async allStatuses() {
        return this.ds.query("select code, nama, coalesce(kategori,'CT') as kategori, urutan from bdb_status_master order by urutan, id");
    }

    async meta() {
        const years = await this.ds.query(`select distinct extract(year from ${DATE_EXPR})::int as year from bdb_laporan_polisi lp where lp.tgl_laporan is not null and extract(year from ${DATE_EXPR})::int >= 2000 and extract(year from ${DATE_EXPR})::int <= extract(year from now())::int order by 1 desc`);
        const statuses = await this.allStatuses();
        return { status: 1, data: { years: years.map((y: any) => y.year).filter((y: any) => y), statuses } };
    }

    private lite(n: AnevNode) {
        return { kode: n.kode, nama: n.nama, ct: n.ct, cc: n.cc, total: n.total, status: n.status, has_children: !!(n.children && n.children.length) };
    }

    /**
     * CT/CC per-kode satker (+ total keseluruhan scope) -- dipakai modul LAIN (Kinerja Perkara) yg
     * butuh angka "CT/CC lama" (rekap status LP saat ini, formula CC/(CT+CC)) tanpa menduplikasi
     * logika rollup pohon di atas. `allowed` = null berarti semua satker (superadmin).
     */
    async ctCcByKode(f: Filter, allowed?: number[] | null, excludeIds?: number[]): Promise<{ byKode: Map<string, { ct: number; cc: number }>; totals: { ct: number; cc: number; total: number } }> {
        const { byKode, totals } = await this.buildTree(f, allowed, excludeIds);
        const map = new Map<string, { ct: number; cc: number }>();
        for (const [kode, n] of byKode) map.set(kode, { ct: n.ct, cc: n.cc });
        return { byKode: map, totals };
    }

    /** Rekap per-level (lazy): tanpa parent -> root; dengan parent -> anak langsungnya. */
    async rekap(f: Filter, parent?: string) {
        const { roots, columns, statuses, totals, byKode } = await this.buildTree(f);
        if (parent) {
            const node = byKode.get(parent);
            return { status: 1, data: { nodes: (node?.children || []).map((n) => this.lite(n)) } };
        }
        return { status: 1, data: { columns, allStatuses: statuses, totals, nodes: roots.map((n) => this.lite(n)) } };
    }

    private async buildTree(f: Filter, allowed?: number[] | null, excludeIds?: number[]) {
        const { where, params } = this.buildWhere(f);
        let scoped = where;
        if (allowed) {
            params.push(allowed);
            scoped = (scoped ? scoped + ' and ' : 'where ') + `(lp.satker_id = any($${params.length}) or lp.unit_satker_id = any($${params.length}))`;
        }
        if (excludeIds?.length) {
            params.push(excludeIds);
            scoped = (scoped ? scoped + ' and ' : 'where ') + `lp.satker_id <> all($${params.length})`;
        }
        let counts: any[];
        if (!f.functionDomain && !f.organizationDomain && !f.status && !allowed && !excludeIds) {
            try {
                const sParams: any[] = [];
                const sWhere: string[] = ['1=1'];
                if (f.date_from) {
                    sParams.push(f.date_from);
                    sWhere.push(`tanggal >= ${sParams.length}::date`);
                }
                if (f.date_to) {
                    sParams.push(f.date_to);
                    sWhere.push(`tanggal <= ${sParams.length}::date`);
                }
                if (f.year) {
                    sParams.push(Number(f.year));
                    sWhere.push(`extract(year from tanggal) = ${sParams.length}`);
                }
                if (f.month) {
                    sParams.push(Number(f.month));
                    sWhere.push(`extract(month from tanggal) = ${sParams.length}`);
                }
                counts = await this.ds.query(
                    `select satker_id as sid, status_code, coalesce(kategori, 'CT') as kategori, sum(total_lp)::int as jml
                     from bdb_anev_rekap_snapshot
                     where ${sWhere.join(' and ')}
                     group by satker_id, status_code, kategori`,
                    sParams
                );
            } catch (e: any) {
                counts = await this.ds.query(
                    `select lp.satker_id as sid, st.code as status_code, coalesce(st.kategori,'CT') as kategori, count(*)::int as jml
                     from bdb_laporan_polisi lp
                     join bdb_satker s on s.id=lp.satker_id
                     left join bdb_status_master st on st.id=lp.status_id
                     ${scoped}
                     group by lp.satker_id, st.code, st.kategori`,
                    params
                );
            }
        } else {
            counts = await this.ds.query(
                `select lp.satker_id as sid, st.code as status_code, coalesce(st.kategori,'CT') as kategori, count(*)::int as jml
                 from bdb_laporan_polisi lp
                 join bdb_satker s on s.id=lp.satker_id
                 left join bdb_status_master st on st.id=lp.status_id
                 ${scoped}
                 group by lp.satker_id, st.code, st.kategori`,
                params
            );
        }
        const satkers = await this.ds.query('select id, kode, deskripsi, parent_id, depth from bdb_satker');
        const statuses = await this.allStatuses();

        const node = new Map<number, AnevNode>();
        const parentOf = new Map<number, number | null>();
        for (const s of satkers) {
            node.set(s.id, { id: s.id, kode: s.kode, nama: s.deskripsi, parent_id: s.parent_id, depth: s.depth, status: {}, ct: 0, cc: 0, total: 0 });
            parentOf.set(s.id, s.parent_id);
        }

        // hitung langsung per satker + kumpulan status yang muncul
        const direct = new Map<number, { status: Record<string, number>; ct: number; cc: number; total: number }>();
        const present = new Set<string>();
        for (const c of counts) {
            if (c.status_code) present.add(c.status_code);
            let d = direct.get(c.sid);
            if (!d) {
                d = { status: {}, ct: 0, cc: 0, total: 0 };
                direct.set(c.sid, d);
            }
            const code = c.status_code || 'TANPA_STATUS';
            d.status[code] = (d.status[code] || 0) + c.jml;
            if (c.kategori === 'CC') d.cc += c.jml;
            else d.ct += c.jml;
            d.total += c.jml;
        }

        // rollup: tambahkan hitungan langsung tiap satker ke dirinya + seluruh leluhur (subtree)
        for (const [sid, d] of direct) {
            let cur: number | null | undefined = sid;
            const guard = new Set<number>();
            while (cur != null && node.has(cur) && !guard.has(cur)) {
                guard.add(cur);
                const n = node.get(cur)!;
                for (const [code, v] of Object.entries(d.status)) n.status[code] = (n.status[code] || 0) + v;
                n.ct += d.ct;
                n.cc += d.cc;
                n.total += d.total;
                cur = parentOf.get(cur) ?? null;
            }
        }

        // sertakan SEMUA satker (termasuk yang datanya 0), bangun pohon bersarang
        const byId = new Map<number, AnevNode>();
        for (const n of node.values()) byId.set(n.id, { ...n, children: [] });
        const roots: AnevNode[] = [];
        for (const n of byId.values()) {
            const p = n.parent_id != null ? byId.get(n.parent_id) : null;
            if (p) p.children!.push(n);
            else roots.push(n);
        }
        const sortRec = (arr: AnevNode[]) => {
            arr.sort((a, b) => String(a.kode).localeCompare(String(b.kode)));
            arr.forEach((x) => x.children && sortRec(x.children));
        };
        sortRec(roots);

        const columns = statuses.filter((s: any) => present.has(s.code)).map((s: any) => ({ code: s.code, nama: s.nama, kategori: s.kategori }));
        const totals = roots.reduce((a, n) => ({ ct: a.ct + n.ct, cc: a.cc + n.cc, total: a.total + n.total }), { ct: 0, cc: 0, total: 0 });
        // index by kode untuk lazy-load per parent
        const byKode = new Map<string, AnevNode>();
        const indexRec = (arr: AnevNode[]) => arr.forEach((n) => { byKode.set(n.kode, n); if (n.children) indexRec(n.children); });
        indexRec(roots);
        return { roots, columns, statuses, totals, byKode };
    }

    /** Ratakan pohon untuk CSV (nama ter-indent per level). Kolom = semua status, grup CT lalu CC. */
    async exportRows(f: Filter) {
        const { roots: tree, statuses } = await this.buildTree(f);
        const columns = [...statuses.filter((s: any) => s.kategori === 'CT'), ...statuses.filter((s: any) => s.kategori === 'CC')].map((s: any) => ({ code: s.code, nama: s.nama, kategori: s.kategori }));
        const rows: any[] = [];
        const walk = (nodes: AnevNode[], level: number) => {
            for (const n of nodes) {
                const row: any = { kode: n.kode, satker: `${'   '.repeat(level)}${n.nama}` };
                for (const c of columns) row[c.code] = n.status[c.code] || 0;
                row.CT = n.ct;
                row.CC = n.cc;
                row.TOTAL = n.total;
                rows.push(row);
                if (n.children?.length) walk(n.children, level + 1);
            }
        };
        walk(tree, 0);
        return { columns, rows };
    }

    // ===== Dashboard Ringkasan (CT/CC) + scope per role =====

    /** WHERE hanya untuk tanggal/tahun/bulan + scope satker (tanpa join status). Alias tabel = lp. */
    private buildWhereLp(f: Filter, allowed?: number[] | null) {
        const params: any[] = [];
        const wh: string[] = [];
        if (f.date_from) { params.push(f.date_from); wh.push(`${DATE_EXPR} >= $${params.length}`); }
        if (f.date_to) { params.push(f.date_to); wh.push(`${DATE_EXPR} <= $${params.length}`); }
        if (f.year) { params.push(Number(f.year)); wh.push(`extract(year from ${DATE_EXPR})=$${params.length}`); }
        if (f.month) { params.push(Number(f.month)); wh.push(`extract(month from ${DATE_EXPR})=$${params.length}`); }
        if (allowed) { params.push(allowed); wh.push(`(lp.satker_id = any($${params.length}) or lp.unit_satker_id = any($${params.length}))`); }
        this.appendTaxonomyFilter(f, params, wh);
        return { where: wh.length ? 'where ' + wh.join(' and ') : '', params };
    }

    /** id satker + seluruh turunannya (subtree) via parent_id. */
    private async descendantIds(rootId: number): Promise<number[]> {
        const rows = await this.ds.query('select id, parent_id from bdb_satker');
        const children = new Map<number, number[]>();
        for (const r of rows) {
            if (r.parent_id != null) {
                const p = Number(r.parent_id);
                if (!children.has(p)) children.set(p, []);
                children.get(p)!.push(Number(r.id));
            }
        }
        const out: number[] = [];
        const stack = [Number(rootId)];
        const seen = new Set<number>();
        while (stack.length) {
            const x = stack.pop()!;
            if (seen.has(x)) continue;
            seen.add(x);
            out.push(x);
            const cs = children.get(x);
            if (cs) stack.push(...cs);
        }
        return out;
    }

    /**
     * Scope operasional satker:
     * 1. Mabes/Bareskrim: seluruh satker nasional
     * 2. Sat Reskrim tingkat Polres: Sat Reskrim + Polsek & Unit Reskrim di bawah Polres yang sama
     * 3. Polda, Polres, Polsek, atau satker lainnya: seluruh satker turunan (subtree) secara rekursif
     */
    private async operationalReadIds(rootId: number): Promise<number[]> {
        const sRows = await this.ds.query('select id, deskripsi, tipe_satker, parent_id from bdb_satker where id=$1', [rootId]);
        if (!sRows.length) return [rootId];
        const s = sRows[0];
        const deskripsi = String(s.deskripsi || '').trim().toUpperCase();
        const tipe = String(s.tipe_satker || '').trim().toUpperCase();

        const isApex = rootId === 1 || rootId === 13 || deskripsi === 'BARESKRIM POLRI' || deskripsi === 'MABES POLRI';
        if (isApex) {
            const all = await this.ds.query('select id from bdb_satker');
            return all.map((r: any) => Number(r.id)).filter(Number.isFinite);
        }

        if (deskripsi.startsWith('SAT RESKRIM') && s.parent_id) {
            const pRows = await this.ds.query('select id, deskripsi, tipe_satker from bdb_satker where id=$1', [s.parent_id]);
            const p = pRows[0];
            const pTipe = String(p?.tipe_satker || '').trim().toUpperCase();
            const pDesk = String(p?.deskripsi || '').trim().toUpperCase();
            const isPolres = ['POLRES', 'POLRESTA', 'POLRESTABES', 'POLRES METRO'].includes(pTipe) || pDesk.startsWith('POLRES');
            if (isPolres) {
                const polresChildren = await this.descendantIds(Number(s.parent_id));
                const satkers = await this.ds.query('select id, deskripsi, tipe_satker, parent_id from bdb_satker where id = any($1)', [polresChildren]);
                const satkerMap = new Map<number, any>();
                for (const row of satkers) satkerMap.set(Number(row.id), row);

                const allowed = new Set<number>([Number(rootId)]);
                for (const cid of polresChildren) {
                    const cs = satkerMap.get(cid);
                    if (!cs) continue;
                    const cTipe = String(cs.tipe_satker || '').trim().toUpperCase();
                    const cDesk = String(cs.deskripsi || '').trim().toUpperCase();
                    if (cTipe === 'POLSEK' || cDesk.startsWith('POLSEK')) {
                        allowed.add(cid);
                    } else if (cs.parent_id) {
                        const cp = satkerMap.get(Number(cs.parent_id));
                        const cpTipe = String(cp?.tipe_satker || '').trim().toUpperCase();
                        const cpDesk = String(cp?.deskripsi || '').trim().toUpperCase();
                        if ((cpTipe === 'POLSEK' || cpDesk.startsWith('POLSEK')) && (cDesk.startsWith('UNIT RESKRIM') || cDesk.startsWith('RESKRIM POLSEK'))) {
                            allowed.add(cid);
                        }
                    }
                }
                return Array.from(allowed);
            }
        }

        return this.descendantIds(rootId);
    }

    /** Tentukan scope data dari user: superadmin/admin_binops/viewer Bareskrim -> semua; viewer/operator lokal -> subtree satkernya. */
    private async resolveScope(userId?: number) {
        if (!userId) return { all: false, isSuper: false, satkerId: null as number | null };
        const rows = await this.ds.query(
            `select u.role_bdb, u.role_name, u.scope_satker_id, s.deskripsi as satker_deskripsi, s.tipe_satker as satker_tipe
             from auth_users u
             left join bdb_satker s on s.id = u.scope_satker_id
             where u.id = $1`,
            [userId]
        );
        const u = rows[0];
        const roleBdb = String(u?.role_bdb || '').toLowerCase();
        const roleName = String(u?.role_name || '').toLowerCase();
        const isSuper = roleBdb === 'superadmin' || roleName.includes('super');
        const isAdmin = roleBdb === 'admin_binops';
        if (isSuper || isAdmin) return { all: true, isSuper, satkerId: null as number | null };

        const isViewer = roleBdb === 'viewer' || roleName.includes('viewer');
        if (isViewer) {
            const sId = u?.scope_satker_id != null ? Number(u.scope_satker_id) : null;
            const sTipe = String(u?.satker_tipe || '').toUpperCase();
            const sDesk = String(u?.satker_deskripsi || '').toUpperCase();
            const isApexMabes = !sId || sId === 1 || sId === 13 || sDesk === 'BARESKRIM POLRI' || sDesk === 'MABES POLRI';
            if (isApexMabes) {
                return { all: true, isSuper: false, satkerId: sId || 13 };
            }
        }

        return { all: false, isSuper: false, satkerId: u?.scope_satker_id != null ? Number(u.scope_satker_id) : null };
    }

    private getCrimeFunctionDomain(satkerId?: number | null, deskripsi?: string): string[] | null {
        const id = Number(satkerId || 0);
        const desk = String(deskripsi || '').toUpperCase();
        if (id === 20675 || desk === 'DITTIPIDPPADANPPO BARESKRIM POLRI' || desk.includes('PPAPPO') || (desk.includes('PPA') && desk.includes('BARESKRIM'))) {
            return ['TIPIDPPAPPO'];
        }
        if (id === 18 || desk === 'DITTIPIDUM BARESKRIM POLRI' || (desk.includes('TIPIDUM') && desk.includes('BARESKRIM'))) {
            return ['TIPIDUM'];
        }
        if (id === 19 || desk === 'DITTIPIDEKSUS BARESKRIM POLRI' || (desk.includes('TIPIDEKSUS') && desk.includes('BARESKRIM'))) {
            return ['TIPIDEKSUS'];
        }
        if (id === 20 || desk === 'DITTIPIDKOR BARESKRIM POLRI' || (desk.includes('TIPIDKOR') && desk.includes('BARESKRIM'))) {
            return ['TIPIDKOR'];
        }
        if (id === 21 || desk === 'DITTIPIDNARKOBA BARESKRIM POLRI' || (desk.includes('TIPIDNARKOBA') && desk.includes('BARESKRIM'))) {
            return ['TIPIDNARKOBA'];
        }
        if (id === 22 || desk === 'DITTIPIDTER BARESKRIM POLRI' || (desk.includes('TIPIDTER') && desk.includes('BARESKRIM'))) {
            return ['TIPIDTER'];
        }
        if (id === 23 || desk === 'DITTIPIDSIBER BARESKRIM POLRI' || (desk.includes('TIPIDSIBER') && desk.includes('BARESKRIM'))) {
            return ['TIPIDSIBER'];
        }
        if (desk.includes('PPA') || desk.includes('PPO')) {
            return ['TIPIDPPAPPO'];
        }
        if (desk.includes('TIPIDUM') || desk.includes('KRIDUM')) {
            return ['TIPIDUM'];
        }
        if (desk.includes('TIPIDEKSUS') || desk.includes('EKSUS')) {
            return ['TIPIDEKSUS'];
        }
        if (desk.includes('TIPIDKOR') || desk.includes('KORUPSI')) {
            return ['TIPIDKOR'];
        }
        if (desk.includes('TIPIDNARKOBA') || desk.includes('NARKOBA')) {
            return ['TIPIDNARKOBA'];
        }
        if (desk.includes('TIPIDTER')) {
            return ['TIPIDTER'];
        }
        if (desk.includes('TIPIDSIBER') || desk.includes('SIBER')) {
            return ['TIPIDSIBER'];
        }
        if (desk.includes('KRIMSUS')) {
            return ['TIPIDEKSUS', 'TIPIDTER', 'TIPIDSIBER', 'TIPIDKOR'];
        }
        if (desk.includes('KRIMUM')) {
            return ['TIPIDUM', 'TIPIDPPAPPO'];
        }
        return null;
    }

    /** Ringkasan dashboard: CT, CC, %CC, 5 kejahatan tertinggi, 10 satker CT & CC tertinggi, CT:CC per Polda. */
    async dashboard(f: Filter, userId?: number) {
        const scope = await this.resolveScope(userId);
        const cacheKey = [
            scope.all ? 'ALL' : (scope.satkerId || 'NONE'),
            f.date_from || '',
            f.date_to || '',
            f.year || '',
            f.month || '',
            f.functionDomain || '',
            f.organizationDomain || ''
        ].join(':');

        const force = String((f as any).force || (f as any).refresh || '') === '1';
        if (!force) {
            const hit = this.dashCache.get(cacheKey);
            if (hit && Date.now() - hit.at < 1800000) {
                return hit.res;
            }
        }

        // 13 Partisi Snapshot Lookup (Bulan 1 s/d 12 + Tahun Penuh)
        const scopeKey = scope.all ? 'ALL' : String(scope.satkerId || 'NONE');
        const functionDomain = f.functionDomain || 'INTERNAL_RESERSE';
        const organizationDomain = f.organizationDomain || 'INTERNAL_POLRI';

        let targetTahun: number | null = null;
        let targetBulan: number | null = null;
        if (f.year) targetTahun = Number(f.year);
        if (f.month) targetBulan = Number(f.month);
        if (f.date_from && f.date_to) {
            const mFrom = String(f.date_from).match(/^(\d{4})-(\d{2})-01$/);
            const mTo = String(f.date_to).match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (mFrom && mTo && mFrom[1] === mTo[1] && mFrom[2] === mTo[2]) {
                targetTahun = Number(mFrom[1]);
                targetBulan = Number(mFrom[2]);
            } else if (f.date_from === `${targetTahun || 2026}-01-01` && f.date_to === `${targetTahun || 2026}-12-31`) {
                targetTahun = targetTahun || 2026;
                targetBulan = null;
            }
        }

        // Sesuai aturan: jika saat ini bulan September 2026, bulan Oktober-Desember (10, 11, 12)
        // tahun 2026 belum terjadi sehingga acuan komparasi tahunan menggunakan data Tahun 2025.
        if (targetTahun === 2026 && targetBulan !== null && targetBulan > 9) {
            targetTahun = 2025;
        }

        if (!force && targetTahun !== null) {
            try {
                const snapSql = targetBulan !== null
                    ? 'SELECT data FROM bdb_anev_dashboard_snapshot WHERE tahun = $1 AND bulan = $2 AND scope_key = $3 AND function_domain = $4 AND organization_domain = $5 ORDER BY refreshed_at DESC LIMIT 1'
                    : 'SELECT data FROM bdb_anev_dashboard_snapshot WHERE tahun = $1 AND bulan IS NULL AND scope_key = $2 AND function_domain = $3 AND organization_domain = $4 ORDER BY refreshed_at DESC LIMIT 1';
                const snapParams = targetBulan !== null
                    ? [targetTahun, targetBulan, scopeKey, functionDomain, organizationDomain]
                    : [targetTahun, scopeKey, functionDomain, organizationDomain];
                const snapRows = await this.ds.query(snapSql, snapParams);
                if (snapRows.length > 0 && snapRows[0].data) {
                    const resData = snapRows[0].data;
                    resData.scoped = !scope.all;
                    if (!scope.all && scope.satkerId) {
                        const r = await this.ds.query('select deskripsi from bdb_satker where id=$1', [scope.satkerId]);
                        resData.scope_satker = r[0]?.deskripsi || null;
                    }
                    const isBareskrimDirektorat = !scope.all && !!(
                        (scope.satkerId && [18, 19, 20, 21, 22, 23, 20675].includes(Number(scope.satkerId))) ||
                        (resData.scope_satker && resData.scope_satker.toUpperCase().includes('BARESKRIM') && !resData.scope_satker.toUpperCase().includes('POLDA'))
                    );
                    resData.is_nasional = isBareskrimDirektorat;
                    resData.label_kejahatan = isBareskrimDirektorat ? '10 Kejahatan Nasional · Tertinggi' : (!scope.all ? '10 Kejahatan Regional · Tertinggi' : '10 Kejahatan Tertinggi');
                    resData.label_satker_ct = isBareskrimDirektorat ? '10 Satker · CT Tertinggi' : (!scope.all ? '10 Satker Regional · CT Tertinggi' : '10 Satker · CT Tertinggi');
                    resData.label_satker_cc = isBareskrimDirektorat ? '10 Satker · CC Tertinggi' : (!scope.all ? '10 Satker Regional · CC Tertinggi' : '10 Satker · CC Tertinggi');
                    this.dashCache.set(cacheKey, { at: Date.now(), res: { status: 1, data: resData } });
                    return { status: 1, data: resData };
                }
            } catch (snapErr: any) {
                // fallback ke live query bila ada kendala pada snapshot
            }
        }
        // nama satker lingkup (untuk header profil operator)
        let scopeSatker: string | null = null;
        if (!scope.all && scope.satkerId) {
            const r = await this.ds.query('select deskripsi from bdb_satker where id=$1', [scope.satkerId]);
            scopeSatker = r[0]?.deskripsi || null;
        }
        const empty = { ct: 0, cc: 0, pct: 0, ct_today: 0, cc_today: 0, per_status: [], top_kejahatan: [], top_satker_ct: [], top_satker_cc: [], polda: [], integrasi: null, scoped: !scope.all, scope_ada_data: false, scope_satker: scopeSatker };
        let allowed: number[] | null = null;
        if (!scope.all) {
            if (!scope.satkerId) return { status: 1, data: empty };
            allowed = await this.operationalReadIds(scope.satkerId);
        }

        const { where, params } = this.buildWhereLp(f, allowed);

        // Peringkat default memakai satker teritorial (lp.satker_id). Child fungsional
        // (unit_satker_id) hanya layak dipakai jika dashboard sedang difilter jenis kejahatan;
        // dashboard saat ini belum menyediakan filter tersebut.
        const satkerField = (!scope.all && scope.satkerId) ? 'coalesce(lp.unit_satker_id, lp.satker_id)' : 'lp.satker_id';
        const perSat = await this.ds.query(
            `select ${satkerField} as sid, s.deskripsi as nama, coalesce(st.kategori,'CT') as kat, count(*)::int as jml
             from bdb_laporan_polisi lp
             join bdb_satker s on s.id=${satkerField}
             left join bdb_status_master st on st.id=lp.status_id
             ${where}
             group by ${satkerField}, s.deskripsi, st.kategori`,
            params
        );
        const sat = new Map<number, { nama: string; ct: number; cc: number }>();
        let ct = 0, cc = 0;
        for (const r of perSat) {
            let e = sat.get(r.sid);
            if (!e) { e = { nama: r.nama, ct: 0, cc: 0 }; sat.set(r.sid, e); }
            // CT pada Dashboard berarti Crime Total / seluruh LP dalam periode,
            // bukan hanya LP yang status aktifnya masih berkategori CT.
            e.ct += r.jml;
            ct += r.jml;
            if (r.kat === 'CC') { e.cc += r.jml; cc += r.jml; }
        }
        const arr = [...sat.values()];
        let top_satker_ct = arr.filter((x) => x.ct > 0).sort((a, b) => b.ct - a.ct).slice(0, 10).map((x) => ({ nama: x.nama, ct: x.ct, cc: x.cc }));
        let top_satker_cc = arr.filter((x) => x.cc > 0).sort((a, b) => b.cc - a.cc).slice(0, 10).map((x) => ({ nama: x.nama, ct: x.ct, cc: x.cc }));
        let top_kejahatan_regional: { nama: string; jml: number }[] = [];
        let regional_nama: string | null = null;
        let regional_ct: number = 0;

        // 10 kejahatan tertinggi (dari tabel ternormalisasi bdb_lp_tindak_pidana_dors, bukan unnest
        // jsonb_array_elements langsung -- yg terakhir ini 9x lebih lambat krn overhead pemanggilan
        // fungsi per-baris di Postgres untuk puluhan ribu baris; tabelnya sudah cermin persis payload.
        const kej = await this.ds.query(
            `select kat as nama, count(*)::int as jml from (
                select tp.nama_kategori_kejahatan as kat
                from bdb_lp_tindak_pidana_dors tp
                join bdb_laporan_polisi lp on lp.id = tp.laporan_polisi_id
                ${where ? where + ' and ' : 'where '}
                  nullif(tp.nama_kategori_kejahatan, '') is not null
                  and tp.nama_kategori_kejahatan not in ('(Tanpa kategori)', '-')
                  and tp.nama_kategori_kejahatan not ilike '%lalu lintas%'
                  and tp.nama_kategori_kejahatan not ilike '%kecelakaan%'
                  and tp.nama_kategori_kejahatan not ilike '%laka lantas%'
             ) x group by kat order by jml desc limit 10`,
            params
        );

        // Rincian per status LP — SEMUA status dari master (0 tetap tampil). Syarat tanggal/scope
        // WAJIB masuk ke ON, bukan WHERE -- LEFT JOIN ini sengaja dipertahankan supaya status yg
        // sedang 0 (blm ada LP cocok filter) tetap tampil barisnya; taruh di WHERE akan
        // menghilangkan baris itu sepenuhnya (efeknya jadi INNER JOIN).
        const psParams: any[] = [];
        let psJoin = '';
        if (allowed) { psParams.push(allowed); psJoin += ` and (lp.satker_id = any($${psParams.length}) or lp.unit_satker_id = any($${psParams.length}))`; }
        if (f.date_from) { psParams.push(f.date_from); psJoin += ` and ${DATE_EXPR} >= $${psParams.length}`; }
        if (f.date_to) { psParams.push(f.date_to); psJoin += ` and ${DATE_EXPR} <= $${psParams.length}`; }
        if (f.year) { psParams.push(Number(f.year)); psJoin += ` and extract(year from ${DATE_EXPR})=$${psParams.length}`; }
        if (f.month) { psParams.push(Number(f.month)); psJoin += ` and extract(month from ${DATE_EXPR})=$${psParams.length}`; }
        const psTaxonomy: string[] = [];
        this.appendTaxonomyFilter(f, psParams, psTaxonomy);
        if (psTaxonomy.length) psJoin += ` and ${psTaxonomy.join(' and ')}`;
        const per_status = await this.ds.query(
            `select s.code, s.nama, coalesce(s.kategori,'CT') as kategori, s.urutan, count(lp.id)::int as jumlah
             from bdb_status_master s
             left join bdb_laporan_polisi lp on lp.status_id = s.id ${psJoin}
             group by s.code, s.nama, s.kategori, s.urutan, s.id
             order by s.urutan nulls last, s.id`,
            psParams
        );

        // Aktivitas hari ini memakai dua tanggal yang berbeda:
        // - CT = tanggal LP masuk;
        // - CC = tanggal penyelesaian kanonik dari snapshot Kinerja Perkara.
        // Rumus lama mengelompokkan status CC dengan tanggal LP dan membuat CC Hari Ini salah.
        const tParams: any[] = [];
        const tWhere: string[] = [`${DATE_EXPR}=current_date`];
        if (allowed) { tParams.push(allowed); tWhere.push(`(lp.satker_id=any($${tParams.length}) or lp.unit_satker_id=any($${tParams.length}))`); }
        this.appendTaxonomyFilter(f, tParams, tWhere);
        const ctTodayRows = await this.ds.query(
            `select count(*)::int as jml from bdb_laporan_polisi lp where ${tWhere.join(' and ')}`,
            tParams
        );
        const ct_today = Number(ctTodayRows[0]?.jml || 0);

        const cParams: any[] = [];
        const cWhere: string[] = ['ks.tanggal_selesai=current_date'];
        if (allowed) { cParams.push(allowed); cWhere.push(`(lp.satker_id=any($${cParams.length}) or lp.unit_satker_id=any($${cParams.length}))`); }
        this.appendTaxonomyFilter(f, cParams, cWhere);
        const ccTodayRows = await this.ds.query(
            `select count(*)::int as jml
               from bdb_kinerja_perkara_snapshot ks
               join bdb_laporan_polisi lp on lp.id=ks.lp_id
              where ${cWhere.join(' and ')}`,
            cParams
        );
        const cc_today = Number(ccTodayRows[0]?.jml || 0);

        // Informasi integrasi DORS (khusus superadmin)
        let integrasi: any = null;
        if (scope.isSuper) {
            const tot = await this.ds.query('select count(*)::int as total, max(synced_at) as terakhir from bdb_dors_raw_lp');
            const perModel = await this.ds.query('select model_lp, count(*)::int as jumlah from bdb_dors_raw_lp group by model_lp order by model_lp');
            const mapped = await this.ds.query('select count(*)::int as c from bdb_laporan_polisi');
            integrasi = {
                total_ditarik: tot[0]?.total || 0,
                total_termapping: mapped[0]?.c || 0,
                terakhir_sync: tot[0]?.terakhir || null,
                per_model: perModel.map((r: any) => ({ model_lp: r.model_lp, label: r.model_lp === 'lp_model_a' ? 'Model A' : r.model_lp === 'lp_model_b' ? 'Model B' : r.model_lp, jumlah: r.jumlah }))
            };
        }

        // CT:CC per Polda (node depth=1 yang bernama POLDA, sudah rollup subtree)
        const { byKode } = await this.buildTree(f, allowed);
        let polda = [...byKode.values()]
            .filter((n) => n.depth === 1 && /^POLDA/i.test(n.nama) && n.total > 0)
            .sort((a, b) => b.total - a.total)
            .slice(0, 20)
            .map((n) => ({ nama: n.nama.replace(/^POLDA\s+/i, ''), ct: n.total, cc: n.cc }));

        if (!scope.all && scope.satkerId) {
            try {
                const satkerRows = await this.ds.query('select id, deskripsi, parent_id, tipe_satker from bdb_satker');
                const satkerMap = new Map<number, { id: number; deskripsi: string; parent_id: number | null; tipe_satker: string }>();
                for (const r of satkerRows) {
                    satkerMap.set(Number(r.id), { id: Number(r.id), deskripsi: r.deskripsi, parent_id: r.parent_id ? Number(r.parent_id) : null, tipe_satker: r.tipe_satker });
                }

                let cur: number | null = scope.satkerId;
                let regionalRoot: { id: number; deskripsi: string; parent_id: number | null; tipe_satker: string } | null = null;
                while (cur) {
                    const s = satkerMap.get(cur);
                    if (!s) break;
                    if ((s.tipe_satker && s.tipe_satker.toUpperCase() === 'POLDA') || /^POLDA\b/i.test(s.deskripsi)) {
                        regionalRoot = s;
                        break;
                    }
                    cur = s.parent_id;
                }

                if (regionalRoot) {
                    regional_nama = regionalRoot.deskripsi;
                    const allRegIds: number[] = [];
                    for (const [id] of satkerMap.entries()) {
                        let p: number | null = id;
                        while (p) {
                            if (p === regionalRoot.id) {
                                allRegIds.push(id);
                                break;
                            }
                            const parentNode = satkerMap.get(p);
                            p = parentNode ? parentNode.parent_id : null;
                        }
                    }

                    if (allRegIds.length > 0) {
                        const { where: regWhere, params: regParams } = this.buildWhereLp(f, allRegIds);
                        const regPerSat = await this.ds.query(
                            `select coalesce(lp.satker_id, lp.unit_satker_id) as sid,
                                    coalesce(st.kategori,'CT') as kat,
                                    count(*)::int as jml
                             from bdb_laporan_polisi lp
                             left join bdb_status_master st on st.id = lp.status_id
                             ${regWhere}
                               and coalesce(lp.satker_id, lp.unit_satker_id) is not null
                             group by coalesce(lp.satker_id, lp.unit_satker_id), st.kategori`,
                            regParams
                        );

                        const getUnit = (sid: number) => {
                            let p: number | null = sid;
                            while (p && p !== regionalRoot!.id) {
                                const s = satkerMap.get(p);
                                if (!s) break;
                                if (s.parent_id === regionalRoot!.id) return s;
                                p = s.parent_id;
                            }
                            return satkerMap.get(sid) || { id: sid, deskripsi: 'UNKNOWN' };
                        };

                        const unitMap = new Map<number, { id: number; nama: string; ct: number; cc: number }>();
                        for (const r of regPerSat) {
                            const u = getUnit(Number(r.sid));
                            if (u.id === 0 || u.deskripsi === 'UNKNOWN') continue;
                            let item = unitMap.get(u.id);
                            if (!item) {
                                item = { id: u.id, nama: u.deskripsi, ct: 0, cc: 0 };
                                unitMap.set(u.id, item);
                            }
                            item.ct += Number(r.jml);
                            regional_ct += Number(r.jml);
                            if (r.kat === 'CC') item.cc += Number(r.jml);
                        }

                        const regTopCT = [...unitMap.values()].filter(x => x.ct > 0).sort((a, b) => b.ct - a.ct).slice(0, 10);
                        const regTopCC = [...unitMap.values()].filter(x => x.cc > 0).sort((a, b) => b.cc - a.cc).slice(0, 10);

                        if (regTopCT.length > 0) top_satker_ct = regTopCT.map(x => ({ nama: x.nama, ct: x.ct, cc: x.cc }));
                        if (regTopCC.length > 0) top_satker_cc = regTopCC.map(x => ({ nama: x.nama, ct: x.ct, cc: x.cc }));

                        // Jika user adalah fungsi spesifik di Polda (Krimum, Krimsus, Narkoba, dll.), ambil kejahatan murni domain fungsi tersebut
                        const userNode = satkerMap.get(scope.satkerId);
                        const poldaFuncDomain = this.getCrimeFunctionDomain(userNode?.id, userNode?.deskripsi);
                        if (poldaFuncDomain) {
                            const fParams = [...regParams, poldaFuncDomain];
                            const funcKej = await this.ds.query(
                                `select kat as nama, count(*)::int as jml from (
                                    select tp.nama_kategori_kejahatan as kat
                                    from bdb_lp_tindak_pidana_dors tp
                                    join bdb_kinerja_crime_group_mapping m on m.jenis_kejahatan_id = tp.jenis_kejahatan_id and m.active = true and m.decision_status = 'APPROVED'
                                    join bdb_laporan_polisi lp on lp.id = tp.laporan_polisi_id
                                    ${regWhere}
                                      and m.kelompok = ANY($${fParams.length})
                                      and nullif(tp.nama_kategori_kejahatan, '') is not null
                                      and tp.nama_kategori_kejahatan not in ('(Tanpa kategori)', '-')
                                      and tp.nama_kategori_kejahatan not ilike '%lalu lintas%'
                                      and tp.nama_kategori_kejahatan not ilike '%kecelakaan%'
                                      and tp.nama_kategori_kejahatan not ilike '%laka lantas%'
                                 ) x group by kat order by jml desc limit 10`,
                                fParams
                            );
                            top_kejahatan_regional = funcKej.map((k: any) => ({ nama: k.nama, jml: Number(k.jml) }));
                        } else {
                            const regKej = await this.ds.query(
                                `select kat as nama, count(*)::int as jml from (
                                    select tp.nama_kategori_kejahatan as kat
                                    from bdb_lp_tindak_pidana_dors tp
                                    join bdb_laporan_polisi lp on lp.id = tp.laporan_polisi_id
                                    ${regWhere}
                                      and nullif(tp.nama_kategori_kejahatan, '') is not null
                                      and tp.nama_kategori_kejahatan not in ('(Tanpa kategori)', '-')
                                      and tp.nama_kategori_kejahatan not ilike '%lalu lintas%'
                                      and tp.nama_kategori_kejahatan not ilike '%kecelakaan%'
                                      and tp.nama_kategori_kejahatan not ilike '%laka lantas%'
                                 ) x group by kat order by jml desc limit 10`,
                                regParams
                            );
                            top_kejahatan_regional = regKej.map((k: any) => ({ nama: k.nama, jml: Number(k.jml) }));
                        }
                    }
                } else {
                    // Satker Mabes / Direktorat Bareskrim: Tampilkan 10 kejahatan nasional domain fungsi & ranking 10 Polda se-Indonesia
                    const userNode = satkerMap.get(scope.satkerId);
                    const bareskrimDomain = this.getCrimeFunctionDomain(userNode?.id, userNode?.deskripsi);
                    if (bareskrimDomain) {
                        const bParams: any[] = [bareskrimDomain];
                        const bWhere: string[] = [
                            `m.kelompok = ANY($1)`,
                            `lp.deleted_at IS NULL`,
                            `coalesce(lp.dilimpahkan_eksternal, false) = false`,
                            `nullif(tp.nama_kategori_kejahatan, '') is not null`,
                            `tp.nama_kategori_kejahatan not in ('(Tanpa kategori)', '-')`,
                            `tp.nama_kategori_kejahatan not ilike '%lalu lintas%'`,
                            `tp.nama_kategori_kejahatan not ilike '%kecelakaan%'`,
                            `tp.nama_kategori_kejahatan not ilike '%laka lantas%'`
                        ];
                        if (f.date_from) { bParams.push(f.date_from); bWhere.push(`${DATE_EXPR} >= $${bParams.length}`); }
                        if (f.date_to) { bParams.push(f.date_to); bWhere.push(`${DATE_EXPR} <= $${bParams.length}`); }
                        if (f.year) { bParams.push(Number(f.year)); bWhere.push(`extract(year from ${DATE_EXPR})=$${bParams.length}`); }
                        if (f.month) { bParams.push(Number(f.month)); bWhere.push(`extract(month from ${DATE_EXPR})=$${bParams.length}`); }
                        this.appendTaxonomyFilter(f, bParams, bWhere);

                        const natKej = await this.ds.query(
                            `select kat as nama, count(*)::int as jml from (
                                select tp.nama_kategori_kejahatan as kat
                                from bdb_lp_tindak_pidana_dors tp
                                join bdb_kinerja_crime_group_mapping m on m.jenis_kejahatan_id = tp.jenis_kejahatan_id and m.active = true and m.decision_status = 'APPROVED'
                                join bdb_laporan_polisi lp on lp.id = tp.laporan_polisi_id
                                where ${bWhere.join(' and ')}
                             ) x group by kat order by jml desc limit 10`,
                            bParams
                        );
                        top_kejahatan_regional = natKej.map((k: any) => ({ nama: k.nama, jml: Number(k.jml) }));

                        const bPerSat = await this.ds.query(
                            `select coalesce(lp.satker_id, lp.unit_satker_id) as sid,
                                    coalesce(st.kategori, 'CT') as kat,
                                    count(distinct lp.id)::int as jml
                             from bdb_lp_tindak_pidana_dors tp
                             join bdb_kinerja_crime_group_mapping m on m.jenis_kejahatan_id = tp.jenis_kejahatan_id and m.active = true and m.decision_status = 'APPROVED'
                             join bdb_laporan_polisi lp on lp.id = tp.laporan_polisi_id
                             left join bdb_status_master st on st.id = lp.status_id
                             where ${bWhere.join(' and ')}
                               and coalesce(lp.satker_id, lp.unit_satker_id) is not null
                             group by coalesce(lp.satker_id, lp.unit_satker_id), st.kategori`,
                            bParams
                        );

                        const getPolda = (sid: number) => {
                            let p: number | null = sid;
                            while (p) {
                                const s = satkerMap.get(p);
                                if (!s) break;
                                if ((s.tipe_satker && s.tipe_satker.toUpperCase() === 'POLDA') || /^POLDA\b/i.test(s.deskripsi)) return s;
                                p = s.parent_id;
                            }
                            return null;
                        };

                        const poldaMap = new Map<number, { id: number; nama: string; ct: number; cc: number }>();
                        for (const r of bPerSat) {
                            const pol = getPolda(Number(r.sid));
                            if (!pol) continue;
                            let entry = poldaMap.get(pol.id);
                            if (!entry) {
                                entry = { id: pol.id, nama: pol.deskripsi, ct: 0, cc: 0 };
                                poldaMap.set(pol.id, entry);
                            }
                            const count = Number(r.jml);
                            entry.ct += count;
                            regional_ct += count;
                            if (r.kat === 'CC') entry.cc += count;
                        }

                        const poldaArr = [...poldaMap.values()];
                        if (poldaArr.length > 0) {
                            top_satker_ct = poldaArr.filter(x => x.ct > 0).sort((a, b) => b.ct - a.ct).slice(0, 10).map(x => ({ nama: x.nama, ct: x.ct, cc: x.cc }));
                            top_satker_cc = poldaArr.filter(x => x.cc > 0).sort((a, b) => b.cc - a.cc).slice(0, 10).map(x => ({ nama: x.nama, ct: x.ct, cc: x.cc }));
                            polda = poldaArr.filter(x => x.ct > 0).sort((a, b) => b.ct - a.ct).slice(0, 20).map(x => ({ nama: x.nama.replace(/^POLDA\s+/i, ''), ct: x.ct, cc: x.cc }));
                            regional_nama = `${scopeSatker || 'Direktorat'} (Nasional)`;
                        }
                    }
                }
            } catch (err) {
                console.error('Gagal hitung ranking regional dashboard: ' + String(err));
            }
        }

        const isBareskrimDirektorat = !scope.all && !!(
            (scope.satkerId && [18, 19, 20, 21, 22, 23, 20675].includes(Number(scope.satkerId))) ||
            (scopeSatker && scopeSatker.toUpperCase().includes('BARESKRIM') && !scopeSatker.toUpperCase().includes('POLDA'))
        );

        const finalResult = {
            status: 1,
            data: {
                ct, cc,
                pct: ct ? Math.round((cc / ct) * 1000) / 10 : 0,
                ct_today, cc_today, per_status,
                top_kejahatan: (!scope.all && top_kejahatan_regional.length > 0) ? top_kejahatan_regional : kej.map((k: any) => ({ nama: k.nama, jml: k.jml })),
                top_kejahatan_regional,
                regional_nama,
                regional_ct,
                is_nasional: isBareskrimDirektorat,
                label_kejahatan: isBareskrimDirektorat ? '10 Kejahatan Nasional · Tertinggi' : (!scope.all ? '10 Kejahatan Regional · Tertinggi' : '10 Kejahatan Tertinggi'),
                label_satker_ct: isBareskrimDirektorat ? '10 Satker · CT Tertinggi' : (!scope.all ? '10 Satker Regional · CT Tertinggi' : '10 Satker · CT Tertinggi'),
                label_satker_cc: isBareskrimDirektorat ? '10 Satker · CC Tertinggi' : (!scope.all ? '10 Satker Regional · CC Tertinggi' : '10 Satker · CC Tertinggi'),
                top_satker_ct, top_satker_cc, polda, integrasi,
                scoped: !scope.all, scope_ada_data: arr.length > 0, scope_satker: scopeSatker
            }
        };
        this.dashCache.set(cacheKey, { at: Date.now(), res: finalResult });

        if (targetTahun !== null) {
            try {
                await this.ds.query(
                    `INSERT INTO bdb_anev_dashboard_snapshot (
                        tahun, bulan, scope_key, function_domain, organization_domain, data, refreshed_at
                     ) VALUES ($1, $2, $3, $4, $5, $6, now())
                     ON CONFLICT (tahun, bulan, scope_key, function_domain, organization_domain)
                     DO UPDATE SET data = EXCLUDED.data, refreshed_at = now()`,
                    [targetTahun, targetBulan, scopeKey, functionDomain, organizationDomain, JSON.stringify(finalResult.data)]
                );
            } catch (saveErr: any) {
                // Background save error non-fatal
            }
        }

        return finalResult;
    }

    /** Memperbarui seluruh snapshot 13 partisi Dashboard Anev */
    async refreshDashboardSnapshots(onlyActivePeriod: boolean = false) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
        const pad = (n: number) => String(n).padStart(2, '0');

        const activePartitions = [
            { tahun: currentYear, bulan: currentMonth, from: `${currentYear}-${pad(currentMonth)}-01`, to: `${currentYear}-${pad(currentMonth)}-${pad(lastDayOfMonth)}` },
            { tahun: currentYear, bulan: null, from: `${currentYear}-01-01`, to: `${currentYear}-12-31` }
        ];
        const allPartitions = [
            { tahun: 2026, bulan: 1, from: '2026-01-01', to: '2026-01-31' },
            { tahun: 2026, bulan: 2, from: '2026-02-01', to: '2026-02-28' },
            { tahun: 2026, bulan: 3, from: '2026-03-01', to: '2026-03-31' },
            { tahun: 2026, bulan: 4, from: '2026-04-01', to: '2026-04-30' },
            { tahun: 2026, bulan: 5, from: '2026-05-01', to: '2026-05-31' },
            { tahun: 2026, bulan: 6, from: '2026-06-01', to: '2026-06-30' },
            { tahun: 2026, bulan: 7, from: '2026-07-01', to: '2026-07-31' },
            { tahun: 2026, bulan: 8, from: '2026-08-01', to: '2026-08-31' },
            { tahun: 2026, bulan: 9, from: '2026-09-01', to: '2026-09-30' },
            { tahun: 2025, bulan: 10, from: '2025-10-01', to: '2025-10-31' },
            { tahun: 2025, bulan: 11, from: '2025-11-01', to: '2025-11-30' },
            { tahun: 2025, bulan: 12, from: '2025-12-01', to: '2025-12-31' },
            { tahun: 2026, bulan: null, from: '2026-01-01', to: '2026-12-31' }
        ];

        const partitions = onlyActivePeriod ? activePartitions : allPartitions;
        for (const p of partitions) {
            try {
                await this.dashboard({
                    date_from: p.from,
                    date_to: p.to,
                    year: p.tahun,
                    month: p.bulan,
                    functionDomain: 'INTERNAL_RESERSE',
                    organizationDomain: 'INTERNAL_POLRI',
                    force: '1'
                } as any, 1);
            } catch (e: any) {
                console.error(`Gagal refresh dashboard snapshot partition ${p.tahun}-${p.bulan}: ` + e?.message);
            }
        }
        this.dashCache.clear();
    }
}

