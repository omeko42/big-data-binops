import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

// tgl_laporan = teks 'DD-MM-YYYY HH:MM:SS'; fallback ke synced_at bila format tak sesuai.
const DATE_EXPR = "(case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else lp.synced_at::date end)";

type Filter = { year?: any; month?: any; date_from?: string; date_to?: string; status?: string };

export type AnevNode = { id: number; kode: string; nama: string; parent_id: number | null; depth: number; status: Record<string, number>; ct: number; cc: number; total: number; children?: AnevNode[] };

@Injectable()
export class AnevService {
    constructor(private readonly ds: DataSource) {}

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
        return { where: wh.length ? 'where ' + wh.join(' and ') : '', params };
    }

    async allStatuses() {
        return this.ds.query("select code, nama, coalesce(kategori,'CT') as kategori, urutan from bdb_status_master order by urutan, id");
    }

    async meta() {
        const years = await this.ds.query(`select distinct extract(year from ${DATE_EXPR})::int as year from bdb_laporan_polisi lp where lp.tgl_laporan is not null order by 1 desc`);
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
            scoped = (scoped ? scoped + ' and ' : 'where ') + `lp.satker_id = any($${params.length})`;
        }
        if (excludeIds?.length) {
            params.push(excludeIds);
            scoped = (scoped ? scoped + ' and ' : 'where ') + `lp.satker_id <> all($${params.length})`;
        }
        const counts = await this.ds.query(
            `select lp.satker_id as sid, st.code as status_code, coalesce(st.kategori,'CT') as kategori, count(*)::int as jml
             from bdb_laporan_polisi lp
             join bdb_satker s on s.id=lp.satker_id
             left join bdb_status_master st on st.id=lp.status_id
             ${scoped}
             group by lp.satker_id, st.code, st.kategori`,
            params
        );
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
        if (allowed) { params.push(allowed); wh.push(`lp.satker_id = any($${params.length})`); }
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

    /** Tentukan scope data dari user: superadmin/admin_binops -> semua; operator -> subtree satkernya. */
    private async resolveScope(userId?: number) {
        if (!userId) return { all: false, satkerId: null as number | null };
        const rows = await this.ds.query('select role_bdb, role_name, scope_satker_id from auth_users where id=$1', [userId]);
        const u = rows[0];
        const roleBdb = String(u?.role_bdb || '').toLowerCase();
        const roleName = String(u?.role_name || '').toLowerCase();
        const isSuper = roleBdb === 'superadmin' || roleName.includes('super');
        const isAdmin = roleBdb === 'admin_binops';
        if (isSuper || isAdmin) return { all: true, isSuper, satkerId: null as number | null };
        return { all: false, isSuper: false, satkerId: u?.scope_satker_id != null ? Number(u.scope_satker_id) : null };
    }

    /** Ringkasan dashboard: CT, CC, %CC, 5 kejahatan tertinggi, 10 satker CT & CC tertinggi, CT:CC per Polda. */
    async dashboard(f: Filter, userId?: number) {
        const scope = await this.resolveScope(userId);
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
            allowed = [scope.satkerId]; // isolasi EXACT ke satker sendiri (tidak hirarki)
        }

        const { where, params } = this.buildWhereLp(f, allowed);

        // Per satker (langsung) + total CT/CC
        const perSat = await this.ds.query(
            `select lp.satker_id as sid, s.deskripsi as nama, coalesce(st.kategori,'CT') as kat, count(*)::int as jml
             from bdb_laporan_polisi lp
             join bdb_satker s on s.id=lp.satker_id
             left join bdb_status_master st on st.id=lp.status_id
             ${where}
             group by lp.satker_id, s.deskripsi, st.kategori`,
            params
        );
        const sat = new Map<number, { nama: string; ct: number; cc: number }>();
        let ct = 0, cc = 0;
        for (const r of perSat) {
            let e = sat.get(r.sid);
            if (!e) { e = { nama: r.nama, ct: 0, cc: 0 }; sat.set(r.sid, e); }
            if (r.kat === 'CC') { e.cc += r.jml; cc += r.jml; } else { e.ct += r.jml; ct += r.jml; }
        }
        const arr = [...sat.values()];
        const top_satker_ct = arr.filter((x) => x.ct > 0).sort((a, b) => b.ct - a.ct).slice(0, 10).map((x) => ({ nama: x.nama, ct: x.ct, cc: x.cc }));
        const top_satker_cc = arr.filter((x) => x.cc > 0).sort((a, b) => b.cc - a.cc).slice(0, 10).map((x) => ({ nama: x.nama, ct: x.ct, cc: x.cc }));

        // 10 kejahatan tertinggi (dari tabel ternormalisasi bdb_lp_tindak_pidana_dors, bukan unnest
        // jsonb_array_elements langsung -- yg terakhir ini 9x lebih lambat krn overhead pemanggilan
        // fungsi per-baris di Postgres untuk puluhan ribu baris; tabelnya sudah cermin persis payload.
        const kej = await this.ds.query(
            `select kat as nama, count(*)::int as jml from (
                select coalesce(nullif(tp.nama_kategori_kejahatan,''),'(Tanpa kategori)') as kat
                from bdb_lp_tindak_pidana_dors tp
                join bdb_laporan_polisi lp on lp.id = tp.laporan_polisi_id
                ${where}
             ) x group by kat order by jml desc limit 10`,
            params
        );

        // Rincian per status LP — SEMUA status dari master (0 tetap tampil). Syarat tanggal/scope
        // WAJIB masuk ke ON, bukan WHERE -- LEFT JOIN ini sengaja dipertahankan supaya status yg
        // sedang 0 (blm ada LP cocok filter) tetap tampil barisnya; taruh di WHERE akan
        // menghilangkan baris itu sepenuhnya (efeknya jadi INNER JOIN).
        const psParams: any[] = [];
        let psJoin = '';
        if (allowed) { psParams.push(allowed); psJoin += ` and lp.satker_id = any($${psParams.length})`; }
        if (f.date_from) { psParams.push(f.date_from); psJoin += ` and ${DATE_EXPR} >= $${psParams.length}`; }
        if (f.date_to) { psParams.push(f.date_to); psJoin += ` and ${DATE_EXPR} <= $${psParams.length}`; }
        if (f.year) { psParams.push(Number(f.year)); psJoin += ` and extract(year from ${DATE_EXPR})=$${psParams.length}`; }
        if (f.month) { psParams.push(Number(f.month)); psJoin += ` and extract(month from ${DATE_EXPR})=$${psParams.length}`; }
        const per_status = await this.ds.query(
            `select s.code, s.nama, coalesce(s.kategori,'CT') as kategori, s.urutan, count(lp.id)::int as jumlah
             from bdb_status_master s
             left join bdb_laporan_polisi lp on lp.status_id = s.id ${psJoin}
             group by s.code, s.nama, s.kategori, s.urutan, s.id
             order by s.urutan nulls last, s.id`,
            psParams
        );

        // CT/CC hari ini (tgl_laporan = hari ini)
        const tParams: any[] = [];
        let tWhere = `where ${DATE_EXPR} = current_date`;
        if (allowed) { tParams.push(allowed); tWhere += ` and lp.satker_id = any($${tParams.length})`; }
        const todayRows = await this.ds.query(
            `select coalesce(st.kategori,'CT') as kat, count(*)::int as jml
             from bdb_laporan_polisi lp left join bdb_status_master st on st.id=lp.status_id
             ${tWhere} group by st.kategori`,
            tParams
        );
        let ct_today = 0, cc_today = 0;
        for (const r of todayRows) { if (r.kat === 'CC') cc_today += r.jml; else ct_today += r.jml; }

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
        const polda = [...byKode.values()]
            .filter((n) => n.depth === 1 && /^POLDA/i.test(n.nama) && n.total > 0)
            .sort((a, b) => b.ct - a.ct)
            .slice(0, 20)
            .map((n) => ({ nama: n.nama.replace(/^POLDA\s+/i, ''), ct: n.ct, cc: n.cc }));

        return {
            status: 1,
            data: {
                ct, cc,
                pct: ct + cc ? Math.round((cc / (ct + cc)) * 1000) / 10 : 0,
                ct_today, cc_today, per_status,
                top_kejahatan: kej.map((k: any) => ({ nama: k.nama, jml: k.jml })),
                top_satker_ct, top_satker_cc, polda, integrasi,
                scoped: !scope.all, scope_ada_data: arr.length > 0, scope_satker: scopeSatker
            }
        };
    }
}
