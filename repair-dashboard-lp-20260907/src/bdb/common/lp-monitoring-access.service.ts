import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { resolveScope } from './scope.util';

export type CrimeDomain = 'KRIMUM' | 'KRIMSUS' | 'NARKOBA' | 'PPA' | 'SIBER';

export type MonitoringPlan = {
    all: boolean;
    own: boolean;
    actorSatkerId: number | null;
    actorSatkerName: string | null;
    actorDomains: CrimeDomain[];
    targetSatkerId: number | null;
    targetSatkerName: string | null;
    ownerIds: number[];
    crimeIds: number[];
};

type SatkerRow = { id: number; deskripsi: string; parent_id: number | null; tipe_satker: string | null; depth: number | null };
type CrimeRow = { id: number; keterangan: string; golongan_id: number | null; golongan_nama: string | null; mapped_group: string | null; is_ppa: boolean };

/**
 * Kebijakan baca/bantu-update LP lintas hirarki.
 *
 * Penting: scope operasional lama tetap exact. Layanan ini hanya memberi akses tambahan
 * jika (1) target berada di bawah wilayah aktor, (2) fungsi aktor bertanggung jawab atas
 * domain kejahatan, dan (3) LP dimiliki unit fungsi yang semestinya pada target tersebut.
 * Semua kondisi diputuskan server-side dan dipakai ulang oleh list, detail, serta mutasi.
 */
@Injectable()
export class LpMonitoringAccessService {
    constructor(private readonly ds: DataSource) {}

    private satkerDomain(name: string): CrimeDomain | 'RESKRIM' | null {
        const n = String(name || '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ');
        if (/\b(NARKOBA|NARKOTIKA)\b/.test(n)) return 'NARKOBA';
        if (/\b(PPA|PPAPPO|PPO)\b/.test(n)) return 'PPA';
        if (/\b(SIBER|CYBER)\b/.test(n)) return 'SIBER';
        if (/\b(KRIMSUS|KRIM SUS|TIPIDEKSUS)\b/.test(n)) return 'KRIMSUS';
        if (/\b(KRIMUM|KRIM UM)\b/.test(n)) return 'KRIMUM';
        if (/\b(RESKRIM|RES KRIM)\b/.test(n)) return 'RESKRIM';
        return null;
    }

    private isTerritorial(row: SatkerRow): boolean {
        const t = String(row?.tipe_satker || '').toUpperCase();
        return t === 'MABES' || t === 'POLDA' || t === 'POLRES' || t === 'POLSEK';
    }

    private async satker(id: number): Promise<SatkerRow | null> {
        const rows = await this.ds.query(
            `select id::int, deskripsi, parent_id::int, tipe_satker, depth::int
             from bdb_satker where id=$1`, [id]
        );
        return rows[0] || null;
    }

    private async actorContext(actorSatkerId: number): Promise<{ actor: SatkerRow; territory: SatkerRow; domain: CrimeDomain | 'RESKRIM' | null; siblings: SatkerRow[] }> {
        const actor = await this.satker(actorSatkerId);
        if (!actor) throw new ForbiddenException('Satker akun tidak ditemukan.');
        const ancestors: SatkerRow[] = await this.ds.query(
            `with recursive p as (
                select id,deskripsi,parent_id,tipe_satker,depth from bdb_satker where id=$1
                union all
                select s.id,s.deskripsi,s.parent_id,s.tipe_satker,s.depth from bdb_satker s join p on p.parent_id=s.id
             ) select id::int,deskripsi,parent_id::int,tipe_satker,depth::int from p order by depth desc nulls last`,
            [actorSatkerId]
        );
        const territory = ancestors.find((x) => this.isTerritorial(x));
        if (!territory) throw new ForbiddenException('Wilayah induk akun tidak ditemukan.');
        const siblings: SatkerRow[] = await this.ds.query(
            `select id::int,deskripsi,parent_id::int,tipe_satker,depth::int from bdb_satker where parent_id=$1`,
            [territory.id]
        );
        return { actor, territory, domain: this.satkerDomain(actor.deskripsi), siblings };
    }

    private responsibilities(ctx: { domain: CrimeDomain | 'RESKRIM' | null; siblings: SatkerRow[] }): CrimeDomain[] {
        const formed = new Set(ctx.siblings.map((x) => this.satkerDomain(x.deskripsi)).filter(Boolean));
        switch (ctx.domain) {
            case 'NARKOBA': return ['NARKOBA'];
            case 'PPA': return ['PPA'];
            case 'SIBER': return ['SIBER'];
            case 'KRIMUM': return formed.has('PPA') ? ['KRIMUM'] : ['KRIMUM', 'PPA'];
            case 'KRIMSUS': return formed.has('SIBER') ? ['KRIMSUS'] : ['KRIMSUS', 'SIBER'];
            case 'RESKRIM': {
                const out: CrimeDomain[] = ['KRIMUM', 'KRIMSUS'];
                if (!formed.has('PPA')) out.push('PPA');
                if (!formed.has('SIBER')) out.push('SIBER');
                return out;
            }
            default: return [];
        }
    }

    private classifyCrime(row: CrimeRow): CrimeDomain | null {
        if (row.is_ppa) return 'PPA';
        const n = String(row.keterangan || '').toUpperCase();
        if (/NARKOT|NARKOBA|PSIKOTROP|PREKURSOR/.test(n) || row.mapped_group === 'NARKOBA') return 'NARKOBA';
        if (/SIBER|CYBER|DUNIA MAYA|PERLINDUNGAN DATA PRIBADI|\bITE\b/.test(n)) return 'SIBER';
        if (row.mapped_group === 'KRIMSUS') return 'KRIMSUS';
        if (row.mapped_group === 'KRIMUM') return 'KRIMUM';
        return null; // fail closed untuk pemetaan yang belum disetujui/dikenali
    }

    private async crimes(): Promise<Array<CrimeRow & { domain: CrimeDomain | null }>> {
        const rows: CrimeRow[] = await this.ds.query(`
            with latest_version as (
                select id from bdb_kinerja_crime_group_mapping_version
                where active=true and status='APPROVED' and approved_by is not null and approved_at is not null
                order by approved_at desc,id desc limit 1
            ), mapping as (
                select distinct on (m.jenis_kejahatan_id) m.jenis_kejahatan_id,m.kelompok
                from bdb_kinerja_crime_group_mapping m join latest_version v on v.id=m.version_id
                where m.active=true and m.decision_status='APPROVED' and m.approved_by is not null and m.approved_at is not null
                order by m.jenis_kejahatan_id,m.id desc
            )
            select jk.id::int,jk.keterangan,
                   jk."golonganKejahatanId"::int as golongan_id,
                   gk.name as golongan_nama,m.kelompok as mapped_group,
                   exists(select 1 from bdb_kinerja_ppappo_crime_mapping pm where pm.jenis_kejahatan_id=jk.id and pm.active=true) as is_ppa
            from cm_jenis_kejahatan jk
            left join cm_golongan_kejahatan gk on gk.id=jk."golonganKejahatanId"
            left join mapping m on m.jenis_kejahatan_id=jk.id
            where coalesce(jk.status_aktif,true)=true and jk.deleted_at is null
            order by jk.keterangan,jk.id`);
        return rows.map((x) => ({ ...x, domain: this.classifyCrime(x) }));
    }

    private async isStrictDescendant(targetId: number, ancestorId: number): Promise<boolean> {
        if (targetId === ancestorId) return false;
        const rows = await this.ds.query(
            `with recursive p as (
                select id,parent_id from bdb_satker where id=$1
                union all select s.id,s.parent_id from bdb_satker s join p on p.parent_id=s.id
             ) select 1 from p where id=$2 limit 1`, [targetId, ancestorId]
        );
        return rows.length > 0;
    }

    /** Unit pemilik yang sah untuk satu domain di dalam satker target (tanpa masuk wilayah anak). */
    private async targetOwners(target: SatkerRow, domain: CrimeDomain): Promise<number[]> {
        const nodes: SatkerRow[] = await this.ds.query(`
            with recursive t as (
                select id,deskripsi,parent_id,tipe_satker,depth from bdb_satker where id=$1
                union all
                select s.id,s.deskripsi,s.parent_id,s.tipe_satker,s.depth
                from bdb_satker s join t on s.parent_id=t.id
                where not (s.id<>$1 and upper(coalesce(s.tipe_satker,'')) in ('MABES','POLDA','POLRES','POLSEK'))
            ) select id::int,deskripsi,parent_id::int,tipe_satker,depth::int from t where id<>$1`, [target.id]);
        const by = (d: CrimeDomain | 'RESKRIM') => nodes.filter((x) => this.satkerDomain(x.deskripsi) === d).map((x) => Number(x.id));
        if (domain === 'NARKOBA') return by('NARKOBA').length ? by('NARKOBA') : (String(target.tipe_satker).toUpperCase() === 'POLSEK' ? by('RESKRIM') : []);
        if (domain === 'PPA') return by('PPA').length ? by('PPA') : by('RESKRIM');
        if (domain === 'SIBER') return by('SIBER').length ? by('SIBER') : (by('KRIMSUS').length ? by('KRIMSUS') : by('RESKRIM'));
        if (domain === 'KRIMSUS') return by('KRIMSUS').length ? by('KRIMSUS') : by('RESKRIM');
        return by('KRIMUM').length ? by('KRIMUM') : by('RESKRIM');
    }

    async plan(userId?: number, targetSatkerId?: number | null): Promise<MonitoringPlan> {
        const scope = await resolveScope(this.ds, userId);
        if (scope.all) return { all: true, own: !targetSatkerId, actorSatkerId: null, actorSatkerName: null, actorDomains: [], targetSatkerId: targetSatkerId || null, targetSatkerName: null, ownerIds: [], crimeIds: [] };
        if (!scope.satkerId) return { all: false, own: true, actorSatkerId: null, actorSatkerName: null, actorDomains: [], targetSatkerId: null, targetSatkerName: null, ownerIds: [], crimeIds: [] };
        const ctx = await this.actorContext(scope.satkerId);
        const domains = this.responsibilities(ctx);
        if (!targetSatkerId || Number(targetSatkerId) === scope.satkerId) {
            return { all: false, own: true, actorSatkerId: scope.satkerId, actorSatkerName: ctx.actor.deskripsi, actorDomains: domains, targetSatkerId: null, targetSatkerName: null, ownerIds: [scope.satkerId], crimeIds: [] };
        }
        const target = await this.satker(Number(targetSatkerId));
        if (!target || !this.isTerritorial(target) || !(await this.isStrictDescendant(target.id, ctx.territory.id)) || domains.length === 0) {
            throw new ForbiddenException('Satker tujuan tidak termasuk kewenangan monitoring akun Anda.');
        }
        const crimeRows = await this.crimes();
        const crimeIds = crimeRows.filter((x) => x.domain && domains.includes(x.domain)).map((x) => x.id);
        const ownerIds = Array.from(new Set((await Promise.all(domains.map((d) => this.targetOwners(target, d)))).flat()));
        return { all: false, own: false, actorSatkerId: scope.satkerId, actorSatkerName: ctx.actor.deskripsi, actorDomains: domains, targetSatkerId: target.id, targetSatkerName: target.deskripsi, ownerIds, crimeIds };
    }

    async metadata(userId?: number) {
        const scope = await resolveScope(this.ds, userId);
        const crimeRows = await this.crimes();
        const golonganMap = new Map<number, string>();
        crimeRows.forEach((x) => { if (x.golongan_id && x.golongan_nama) golonganMap.set(x.golongan_id, x.golongan_nama); });
        const golongan = Array.from(golonganMap, ([id, nama]) => ({ id, nama })).sort((a, b) => a.nama.localeCompare(b.nama));
        if (scope.all) return {
            all: true,
            own_satker: null,
            targets: [],
            domains: [],
            crimes: crimeRows.map((x) => ({ id: x.id, nama: x.keterangan, golongan_id: x.golongan_id, domain: x.domain, allowed: true })),
            golongan
        };
        if (!scope.satkerId) return { all: false, own_satker: null, targets: [], domains: [], crimes: [], golongan: [] };
        const ctx = await this.actorContext(scope.satkerId);
        const domains = this.responsibilities(ctx);
        const targets: SatkerRow[] = domains.length ? await this.ds.query(`
            with recursive d as (
                select id,deskripsi,parent_id,tipe_satker,depth from bdb_satker where id=$1
                union all select s.id,s.deskripsi,s.parent_id,s.tipe_satker,s.depth from bdb_satker s join d on s.parent_id=d.id
            ) select id::int,deskripsi,parent_id::int,tipe_satker,depth::int from d
              where id<>$1 and upper(coalesce(tipe_satker,'')) in ('POLDA','POLRES','POLSEK')
              order by depth,deskripsi`, [ctx.territory.id]) : [];
        const crimes = crimeRows.map((x) => ({ id: x.id, nama: x.keterangan, golongan_id: x.golongan_id, domain: x.domain, allowed: !!x.domain && domains.includes(x.domain) }));
        return {
            all: false,
            own_satker: { id: ctx.actor.id, nama: ctx.actor.deskripsi },
            targets: targets.map((x) => ({ id: x.id, nama: x.deskripsi, tipe: x.tipe_satker, depth: x.depth })),
            domains,
            crimes,
            golongan
        };
    }

    async canAccessLp(userId: number | undefined, lp: { satker_id?: number | null; unit_satker_id?: number | null; jenis_kejahatan_id?: number | null; deleted_at?: any; dilimpahkan_eksternal?: boolean }): Promise<{ allowed: boolean; monitoring: boolean; plan: MonitoringPlan | null }> {
        const scope = await resolveScope(this.ds, userId);
        if (scope.all) return { allowed: true, monitoring: false, plan: null };
        const ownerId = Number(lp.unit_satker_id ?? lp.satker_id ?? 0);
        if (!scope.satkerId || !ownerId || lp.deleted_at || lp.dilimpahkan_eksternal) return { allowed: false, monitoring: false, plan: null };
        if (ownerId === scope.satkerId) return { allowed: true, monitoring: false, plan: null };
        const owner = await this.satker(ownerId);
        if (!owner) return { allowed: false, monitoring: false, plan: null };
        const ancestors: SatkerRow[] = await this.ds.query(
            `with recursive p as (select id,deskripsi,parent_id,tipe_satker,depth from bdb_satker where id=$1 union all select s.id,s.deskripsi,s.parent_id,s.tipe_satker,s.depth from bdb_satker s join p on p.parent_id=s.id)
             select id::int,deskripsi,parent_id::int,tipe_satker,depth::int from p order by depth desc nulls last`, [ownerId]);
        const target = ancestors.find((x) => this.isTerritorial(x));
        if (!target) return { allowed: false, monitoring: false, plan: null };
        try {
            const plan = await this.plan(userId, target.id);
            const allowed = plan.ownerIds.includes(ownerId) && !!lp.jenis_kejahatan_id && plan.crimeIds.includes(Number(lp.jenis_kejahatan_id));
            return { allowed, monitoring: allowed, plan };
        } catch {
            return { allowed: false, monitoring: false, plan: null };
        }
    }

    async assertCanAccessLp(userId: number | undefined, lpId: number) {
        const rows = await this.ds.query(`select id,satker_id,unit_satker_id,jenis_kejahatan_id,deleted_at,dilimpahkan_eksternal from bdb_laporan_polisi where id=$1`, [lpId]);
        if (!rows.length) throw new ForbiddenException('LP tidak dapat diakses.');
        const access = await this.canAccessLp(userId, rows[0]);
        if (!access.allowed) throw new ForbiddenException('LP tidak dapat diakses oleh akun Anda.');
        return { ...access, lp: rows[0] };
    }
}
