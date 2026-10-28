import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { resolveScope } from './scope.util';

export type CrimeDomain =
    | 'TIPIDUM'
    | 'TIPIDPPAPPO'
    | 'TIPIDEKSUS'
    | 'TIPIDKOR'
    | 'TIPIDTER'
    | 'TIPIDSIBER'
    | 'TIPIDNARKOBA';

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
 * Aturan:
 * 1. Default akun: melihat LP satkernya sendiri tanpa filter.
 * 2. Hirarki: HANYA berlaku top-down (Mabes -> Polda/Polres/Polsek; Polda -> Polres/Polsek; Polres -> Polsek).
 *    Akses hirarki ke atas dan lintas wilayah dilarang keras (403).
 * 3. Satker atas yang membuka satker bawahan dibatasi ketat ke jenis kejahatan fungsi kewenangannya (TIPID).
 * 4. Akses ke satker bawahan mewajibkan pengisian pernyataan impersonate supervisi (tercatat di audit log).
 * 5. Mutasi data LP milik bawahan mewajibkan lembar pernyataan tindakan kedinasan.
 */
@Injectable()
export class LpMonitoringAccessService {
    constructor(private readonly ds: DataSource) {}

    private satkerDomain(name: string): CrimeDomain | 'KRIMSUS' | 'KRIMUM' | 'RESKRIM' | 'MABES_ALL' | null {
        const n = String(name || '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ');
        if (/\b(TIPIDTER|TINDAK PIDANA TERTENTU)\b/.test(n)) return 'TIPIDTER';
        if (/\b(TIPIDEKSUS|EKONOMI KHUSUS)\b/.test(n)) return 'TIPIDEKSUS';
        if (/\b(TIPIDKOR|KORTAS|KORUPSI)\b/.test(n)) return 'TIPIDKOR';
        if (/\b(TIPIDSIBER|SIBER|CYBER)\b|SATRESSIBER/.test(n)) return 'TIPIDSIBER';
        if (/\b(TIPIDNARKOBA|NARKOBA|NARKOTIKA)\b|SATRESNARKOBA/.test(n)) return 'TIPIDNARKOBA';
        if (/PPAPPO|PPA PPO|PPA DAN PPO|\b(PPA|PPO)\b|SATRESPPADANPPO/.test(n)) return 'TIPIDPPAPPO';
        if (/\b(TIPIDUM|KRIMINAL UMUM|PIDANA UMUM)\b/.test(n)) return 'TIPIDUM';
        if (/\b(KRIMSUS|KRIM SUS|KRIMINAL KHUSUS)\b/.test(n)) return 'KRIMSUS';
        if (/\b(KRIMUM|KRIM UM)\b/.test(n)) return 'KRIMUM';
        if (/\b(RESKRIM|RES KRIM)\b|SATRESKRIM/.test(n)) return 'RESKRIM';
        if (/\b(BARESKRIM|MABES)\b/.test(n)) return 'MABES_ALL';
        return null;
    }

    private isTerritorial(row: SatkerRow): boolean {
        if (Number(row?.id) === 1 || Number(row?.id) === 13) return true;
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

    private allowedSubordinateLevels(territoryLevel?: string): string[] {
        const lvl = String(territoryLevel || '').toUpperCase();
        if (lvl === 'MABES') return ['POLDA', 'POLRES', 'POLSEK'];
        if (lvl === 'POLDA') return ['POLRES', 'POLSEK'];
        if (lvl === 'POLRES') return ['POLSEK'];
        return [];
    }

    private async actorContext(actorSatkerId: number): Promise<{
        actor: SatkerRow;
        territory: SatkerRow;
        ancestors: SatkerRow[];
        domain: CrimeDomain | 'KRIMSUS' | 'KRIMUM' | 'RESKRIM' | 'MABES_ALL' | null;
        siblings: SatkerRow[];
    }> {
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

        // Cari territory terdekat (POLSEK, POLRES, POLDA, MABES) dari hirarki terdekat (depth tertinggi)
        const terr = ancestors.find((x) =>
            ['POLSEK', 'POLRES', 'POLDA', 'MABES'].includes(String(x.tipe_satker || '').toUpperCase())
        );
        // Jika akun berada di Mabes/Bareskrim tanpa simpul Polda/Polres, wilayahnya adalah MABES POLRI (1)
        const territory: SatkerRow | undefined = terr || ancestors.find((x) => x.id === 1) || (await this.satker(1))!;
        if (!territory) throw new ForbiddenException('Wilayah induk akun tidak ditemukan.');

        const siblings: SatkerRow[] = await this.ds.query(
            `select id::int,deskripsi,parent_id::int,tipe_satker,depth::int from bdb_satker where parent_id=$1`,
            [actor.parent_id || territory.id]
        );
        return { actor, territory, ancestors, domain: this.satkerDomain(actor.deskripsi), siblings };
    }

    private responsibilities(ctx: {
        domain: CrimeDomain | 'KRIMSUS' | 'KRIMUM' | 'RESKRIM' | 'MABES_ALL' | null;
        siblings: SatkerRow[];
    }): CrimeDomain[] {
        const formed = new Set(ctx.siblings.map((x) => this.satkerDomain(x.deskripsi)).filter(Boolean));
        switch (ctx.domain) {
            case 'TIPIDUM': return ['TIPIDUM'];
            case 'TIPIDPPAPPO': return ['TIPIDPPAPPO'];
            case 'TIPIDEKSUS': return ['TIPIDEKSUS'];
            case 'TIPIDKOR': return ['TIPIDKOR'];
            case 'TIPIDTER': return ['TIPIDTER'];
            case 'TIPIDSIBER': return ['TIPIDSIBER'];
            case 'TIPIDNARKOBA': return ['TIPIDNARKOBA'];
            case 'KRIMSUS': {
                const out: CrimeDomain[] = ['TIPIDEKSUS', 'TIPIDKOR', 'TIPIDTER'];
                if (!formed.has('TIPIDSIBER')) out.push('TIPIDSIBER');
                return out;
            }
            case 'KRIMUM': {
                const out: CrimeDomain[] = ['TIPIDUM'];
                if (!formed.has('TIPIDPPAPPO')) out.push('TIPIDPPAPPO');
                return out;
            }
            case 'RESKRIM': {
                const out: CrimeDomain[] = ['TIPIDUM', 'TIPIDEKSUS', 'TIPIDKOR', 'TIPIDTER'];
                if (!formed.has('TIPIDPPAPPO')) out.push('TIPIDPPAPPO');
                if (!formed.has('TIPIDSIBER')) out.push('TIPIDSIBER');
                return out;
            }
            case 'MABES_ALL': {
                return ['TIPIDUM', 'TIPIDPPAPPO', 'TIPIDEKSUS', 'TIPIDKOR', 'TIPIDTER', 'TIPIDSIBER', 'TIPIDNARKOBA'];
            }
            default: return [];
        }
    }

    private classifyCrime(row: CrimeRow): CrimeDomain | null {
        if (row.is_ppa || row.mapped_group === 'TIPIDPPAPPO') return 'TIPIDPPAPPO';
        if (row.mapped_group === 'TIPIDNARKOBA' || row.mapped_group === 'NARKOBA') return 'TIPIDNARKOBA';
        if (row.mapped_group === 'TIPIDSIBER') return 'TIPIDSIBER';
        if (row.mapped_group === 'TIPIDTER') return 'TIPIDTER';
        if (row.mapped_group === 'TIPIDEKSUS') return 'TIPIDEKSUS';
        if (row.mapped_group === 'TIPIDKOR') return 'TIPIDKOR';
        if (row.mapped_group === 'TIPIDUM' || row.mapped_group === 'KRIMUM') return 'TIPIDUM';
        if (row.mapped_group === 'KRIMSUS') return 'TIPIDEKSUS'; // fallback
        const n = String(row.keterangan || '').toUpperCase();
        if (/NARKOT|NARKOBA|PSIKOTROP|PREKURSOR/.test(n)) return 'TIPIDNARKOBA';
        if (/SIBER|CYBER|DUNIA MAYA|PERLINDUNGAN DATA PRIBADI|\bITE\b/.test(n)) return 'TIPIDSIBER';
        return null;
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

    /** Unit pemilik yang sah untuk domain-domain wewenang di dalam satker target. */
    private async targetOwners(target: SatkerRow, domains: CrimeDomain[]): Promise<number[]> {
        const nodes: SatkerRow[] = await this.ds.query(`
            with recursive t as (
                select id,deskripsi,parent_id,tipe_satker,depth from bdb_satker where id=$1
                union all
                select s.id,s.deskripsi,s.parent_id,s.tipe_satker,s.depth
                from bdb_satker s join t on s.parent_id=t.id
            ) select id::int,deskripsi,parent_id::int,tipe_satker,depth::int from t`, [target.id]);

        const allowedOwnerIds = new Set<number>();
        allowedOwnerIds.add(Number(target.id));

        for (const node of nodes) {
            const d = this.satkerDomain(node.deskripsi);
            const tipe = String(node.tipe_satker || '').toUpperCase();
            if (tipe === 'POLSEK') {
                allowedOwnerIds.add(Number(node.id));
                continue;
            }
            if (!d) continue;
            if (domains.includes(d as any)) {
                allowedOwnerIds.add(Number(node.id));
            } else if (d === 'KRIMSUS' && domains.some((x) => ['TIPIDEKSUS', 'TIPIDKOR', 'TIPIDTER', 'TIPIDSIBER'].includes(x))) {
                allowedOwnerIds.add(Number(node.id));
            } else if (d === 'KRIMUM' && domains.some((x) => ['TIPIDUM', 'TIPIDPPAPPO'].includes(x))) {
                allowedOwnerIds.add(Number(node.id));
            } else if (d === 'RESKRIM' && domains.some((x) => x !== 'TIPIDNARKOBA')) {
                allowedOwnerIds.add(Number(node.id));
            }
        }
        return Array.from(allowedOwnerIds);
    }

    async plan(userId?: number, targetSatkerId?: number | null): Promise<MonitoringPlan> {
        const scope = await resolveScope(this.ds, userId);
        if (scope.all) return { all: true, own: !targetSatkerId, actorSatkerId: null, actorSatkerName: null, actorDomains: [], targetSatkerId: targetSatkerId || null, targetSatkerName: null, ownerIds: [], crimeIds: [] };
        if (!scope.satkerId) return { all: false, own: true, actorSatkerId: null, actorSatkerName: null, actorDomains: [], targetSatkerId: null, targetSatkerName: null, ownerIds: [], crimeIds: [] };
        
        // Default/own scope: tetap exact, tidak dibatasi fungsi/kejahatan
        if (!targetSatkerId || Number(targetSatkerId) === scope.satkerId) {
            const actor = await this.satker(scope.satkerId);
            return {
                all: false,
                own: true,
                actorSatkerId: scope.satkerId,
                actorSatkerName: actor?.deskripsi || null,
                actorDomains: [],
                targetSatkerId: null,
                targetSatkerName: null,
                ownerIds: [scope.satkerId],
                crimeIds: []
            };
        }

        // Akses satker lain (subordinate monitoring)
        const ctx = await this.actorContext(scope.satkerId);
        const domains = this.responsibilities(ctx);
        const target = await this.satker(Number(targetSatkerId));
        if (!target || domains.length === 0) {
            throw new ForbiddenException('Satker tujuan tidak ditemukan atau fungsi akun Anda tidak memiliki wewenang monitoring.');
        }

        // Strict top-down hierarchy verification (Zero bottom-up, Zero lateral):
        // 1. Target tidak boleh ancestor dari akun aktor (Zero bottom-up)
        const ancestorIds = ctx.ancestors.slice(1).map((x) => x.id);
        if (ancestorIds.includes(target.id) || target.id === ctx.territory.id) {
            throw new ForbiddenException('Satker tujuan tidak dapat diakses (satker induk/ancestor tidak boleh diakses oleh bawahan).');
        }

        // 2. Target wajib berada di bawah wilayah teritorial aktor
        const isTargetUnderTerritory = await this.isStrictDescendant(target.id, ctx.territory.id);
        if (!isTargetUnderTerritory) {
            throw new ForbiddenException('Satker tujuan tidak termasuk wilayah regional akun Anda.');
        }

        // 3. Tingkat teritorial target harus strictly subordinat (Zero lateral!)
        const targetTerrRows = await this.ds.query(
            `with recursive p as (
                select id, parent_id, tipe_satker, depth from bdb_satker where id = $1
                union all
                select s.id, s.parent_id, s.tipe_satker, s.depth from bdb_satker s join p on p.parent_id = s.id
             ) select upper(tipe_satker) as tipe from p
               where upper(tipe_satker) in ('POLSEK', 'POLRES', 'POLDA', 'MABES')
               order by depth desc nulls last limit 1`,
            [target.id]
        );
        const targetTerrLevel = targetTerrRows[0]?.tipe;
        const allowedLevels = this.allowedSubordinateLevels(ctx.territory.tipe_satker);
        if (!targetTerrLevel || !allowedLevels.includes(targetTerrLevel)) {
            throw new ForbiddenException('Satker tujuan tidak termasuk kewenangan monitoring (tidak boleh mengakses satker sejajar/lateral).');
        }

        const crimeRows = await this.crimes();
        const crimeIds = crimeRows.filter((x) => x.domain && domains.includes(x.domain)).map((x) => x.id);
        
        let ownerIds: number[];
        if (this.isTerritorial(target)) {
            ownerIds = await this.targetOwners(target, domains);
        } else {
            const subNodes = await this.ds.query(`
                with recursive t as (
                    select id from bdb_satker where id=$1
                    union all
                    select s.id from bdb_satker s join t on s.parent_id=t.id
                ) select id::int from t`, [target.id]);

            // Bila target adalah unit fungsional di bawah Polres (misal SAT RESKRIM / SAT NARKOBA):
            // Sertakan juga parent_id (POLRES) dan seluruh alias/sibling functional sejenis
            // karena di bdb_laporan_polisi LP dapat tercatat dengan satker_id Polres induk maupun unit_satker_id.
            const additionalIds: number[] = [];
            const parentRow = target.parent_id ? await this.satker(target.parent_id) : null;
            if (parentRow && String(parentRow.tipe_satker || '').toUpperCase() === 'POLRES') {
                additionalIds.push(Number(target.parent_id));
                const isNarkoba = /NARKOBA/.test(String(target.deskripsi || '').toUpperCase());
                const siblingRows = await this.ds.query(
                    `select id::int from bdb_satker
                     where parent_id = $1 and ${isNarkoba ? "(deskripsi ~* 'SAT\\s*NARKOBA|SATRESNARKOBA')" : (domains.includes('TIPIDPPAPPO') ? "(deskripsi ~* 'SAT\\s*RESKRIM|SATRESKRIM|PPA|PPO|RENAKTA')" : "(deskripsi ~* 'SAT\\s*RESKRIM|SATRESKRIM')")}`,
                    [target.parent_id]
                );
                siblingRows.forEach((r: any) => additionalIds.push(Number(r.id)));
            }

            ownerIds = Array.from(new Set([Number(target.id), ...subNodes.map((x: any) => Number(x.id)), ...additionalIds]));
        }
        return {
            all: false,
            own: false,
            actorSatkerId: scope.satkerId,
            actorSatkerName: ctx.actor.deskripsi,
            actorDomains: domains,
            targetSatkerId: target.id,
            targetSatkerName: target.deskripsi,
            ownerIds,
            crimeIds
        };
    }

    private domainToKelompok(domain?: string | null): string {
        const d = String(domain || '').toUpperCase();
        if (d === 'TIPIDUM' || d === 'TIPIDPPAPPO') return 'KRIMUM';
        if (d === 'TIPIDEKSUS' || d === 'TIPIDKOR' || d === 'TIPIDTER' || d === 'TIPIDSIBER') return 'KRIMSUS';
        if (d === 'TIPIDNARKOBA') return 'NARKOBA';
        return 'LAINNYA';
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
            primary_domain: null,
            actor_kelompok: 'ALL',
            crimes: crimeRows.map((x) => ({
                id: x.id,
                nama: x.keterangan,
                golongan_id: x.golongan_id,
                domain: x.domain,
                kelompok: this.domainToKelompok(x.domain),
                allowed: true
            })),
            golongan
        };
        if (!scope.satkerId) return { all: false, own_satker: null, targets: [], domains: [], primary_domain: null, actor_kelompok: 'ALL', crimes: [], golongan: [] };
        const ctx = await this.actorContext(scope.satkerId);
        const domains = this.responsibilities(ctx);
        const allowedLevels = this.allowedSubordinateLevels(ctx.territory.tipe_satker);
        const isActorNarkoba = ctx.domain === 'TIPIDNARKOBA';

        const targets: SatkerRow[] = (domains.length && allowedLevels.length > 0) ? await this.ds.query(`
            with recursive sub as (
                select s.id, s.deskripsi, s.parent_id, s.tipe_satker, s.depth, s.kode_canonical,
                       case when upper(s.tipe_satker) in ('POLDA','POLRES','POLSEK') then upper(s.tipe_satker) else null end as terr_lvl
                from bdb_satker s
                where s.parent_id = $1 and (s.deskripsi !~* 'DUPLIKAT\s*NONAKTIF' and not (coalesce(s.kinerja_aktif, true) = false and coalesce(s.dors_mapping_aktif, true) = false))
                union all
                select s.id, s.deskripsi, s.parent_id, s.tipe_satker, s.depth, s.kode_canonical,
                       coalesce(case when upper(s.tipe_satker) in ('POLDA','POLRES','POLSEK') then upper(s.tipe_satker) else null end, sub.terr_lvl) as terr_lvl
                from bdb_satker s
                join sub on s.parent_id = sub.id where (s.deskripsi !~* 'DUPLIKAT\s*NONAKTIF' and not (coalesce(s.kinerja_aktif, true) = false and coalesce(s.dors_mapping_aktif, true) = false))
            ),
            polda_units as (
                select s.id::int, s.deskripsi, s.parent_id::int, s.tipe_satker, s.depth::int, s.kode_canonical
                from sub s where upper(s.tipe_satker) = 'POLDA'
            ),
            polres_units as (
                select s.* from sub s where upper(s.tipe_satker) = 'POLRES'
            ),
            polres_targets as (
                select distinct on (p.id)
                       coalesce(fn.id, p.id)::int as id,
                       coalesce(fn.deskripsi, p.deskripsi) as deskripsi,
                       p.id::int as parent_id,
                       'POLRES' as tipe_satker,
                       coalesce(fn.depth, p.depth)::int as depth,
                       coalesce(fn.kode_canonical, p.kode_canonical) as kode_canonical
                from polres_units p
                left join sub fn on fn.parent_id = p.id and (
                    ${isActorNarkoba ? "(fn.deskripsi ~* 'SAT\\s*NARKOBA|SATRESNARKOBA')" : "(fn.deskripsi ~* 'SAT\\s*RESKRIM|SATRESKRIM')"}
                )
                order by p.id, fn.id desc
            ),
            polsek_units as (
                select s.id::int, s.deskripsi, s.parent_id::int, s.tipe_satker, s.depth::int, s.kode_canonical
                from sub s where upper(s.tipe_satker) = 'POLSEK'
            ),
            all_targets as (
                select * from polda_units where 'POLDA' = any($2::text[])
                union all
                select * from polres_targets where 'POLRES' = any($2::text[])
                union all
                select * from polsek_units where 'POLSEK' = any($2::text[])
            )
            select id, deskripsi, parent_id, tipe_satker, depth
            from all_targets
            order by depth, kode_canonical`, [ctx.territory.id, allowedLevels]) : [];
        const crimes = crimeRows.map((x) => ({
            id: x.id,
            nama: x.keterangan,
            golongan_id: x.golongan_id,
            domain: x.domain,
            kelompok: this.domainToKelompok(x.domain),
            allowed: !!x.domain && domains.includes(x.domain)
        }));

        let actorKelompok = 'ALL';
        const dStr = String(ctx.domain || '').toUpperCase();
        if (dStr === 'TIPIDSIBER' || dStr === 'KRIMSUS' || dStr === 'TIPIDEKSUS' || dStr === 'TIPIDKOR' || dStr === 'TIPIDTER') {
            actorKelompok = 'KRIMSUS';
        } else if (dStr === 'TIPIDNARKOBA') {
            actorKelompok = 'NARKOBA';
        } else if (dStr === 'TIPIDUM' || dStr === 'TIPIDPPAPPO' || dStr === 'KRIMUM' || dStr === 'RESKRIM') {
            actorKelompok = 'KRIMUM';
        }

        return {
            all: false,
            own_satker: { id: ctx.actor.id, nama: ctx.actor.deskripsi },
            targets: targets.map((x) => ({ id: x.id, nama: x.deskripsi, tipe: x.tipe_satker, depth: x.depth })),
            domains,
            primary_domain: ctx.domain,
            actor_kelompok: actorKelompok,
            crimes,
            golongan
        };
    }

    async canAccessLp(userId: number | undefined, lp: { satker_id?: number | null; unit_satker_id?: number | null; jenis_kejahatan_id?: number | null; deleted_at?: any; dilimpahkan_eksternal?: boolean }): Promise<{ allowed: boolean; monitoring: boolean; canEdit: boolean; plan: MonitoringPlan | null }> {
        const scope = await resolveScope(this.ds, userId);
        if (scope.all) return { allowed: true, monitoring: false, canEdit: true, plan: null };
        const ownerId = Number(lp.unit_satker_id ?? lp.satker_id ?? 0);
        if (!scope.satkerId || !ownerId || lp.deleted_at || lp.dilimpahkan_eksternal) return { allowed: false, monitoring: false, canEdit: false, plan: null };
        if (ownerId === Number(scope.satkerId)) return { allowed: true, monitoring: false, canEdit: true, plan: null };
        const owner = await this.satker(ownerId);
        if (!owner) return { allowed: false, monitoring: false, canEdit: false, plan: null };
        const ancestors: SatkerRow[] = await this.ds.query(
            `with recursive p as (select id,deskripsi,parent_id,tipe_satker,depth from bdb_satker where id=$1 union all select s.id,s.deskripsi,s.parent_id,s.tipe_satker,s.depth from bdb_satker s join p on p.parent_id=s.id)
             select id::int,deskripsi,parent_id::int,tipe_satker,depth::int from p order by depth desc nulls last`, [ownerId]);
        const target = ancestors.find((x) => this.isTerritorial(x));
        if (!target) return { allowed: true, monitoring: true, canEdit: false, plan: null };
        try {
            const plan = await this.plan(userId, target.id);
            const allowed = plan.ownerIds.includes(ownerId) && !!lp.jenis_kejahatan_id && plan.crimeIds.includes(Number(lp.jenis_kejahatan_id));
            return { allowed: true, monitoring: true, canEdit: false, plan: allowed ? plan : null };
        } catch {
            return { allowed: true, monitoring: true, canEdit: false, plan: null };
        }
    }

        async assertNotViewer(userId: number | undefined, authUser?: any) {
        let role = String(authUser?.role_bdb || authUser?.role_name || '').trim().toLowerCase();
        if (!role && userId) {
            const uRows = await this.ds.query('select role_bdb, role_name from auth_users where id=$1 and deleted_at is null', [userId]);
            role = String(uRows[0]?.role_bdb || uRows[0]?.role_name || '').trim().toLowerCase();
        }
        if (role === 'viewer') {
            throw new ForbiddenException('Role viewer hanya memiliki hak akses lihat (read-only). Aksi tidak diizinkan.');
        }
    }

    async assertCanMutateLp(userId: number | undefined, lpId: number, authUser?: any) {
        await this.assertNotViewer(userId, authUser);
        const access = await this.assertCanAccessLp(userId, lpId);
        const scope = await resolveScope(this.ds, userId);
        if (!scope.all) {
            const ownerId = Number(access.lp?.unit_satker_id ?? access.lp?.satker_id ?? 0);
            if (!scope.satkerId || ownerId !== Number(scope.satkerId)) {
                throw new ForbiddenException('Mode Baca Saja: Akun operator hanya dapat memperbarui LP milik satkernya sendiri.');
            }
        }
        return access;
    }

    async assertCanAccessLp(userId: number | undefined, lpId: number) {
        const rows = await this.ds.query(`select id,satker_id,unit_satker_id,jenis_kejahatan_id,deleted_at,dilimpahkan_eksternal from bdb_laporan_polisi where id=$1`, [lpId]);
        if (!rows.length) throw new ForbiddenException('LP tidak dapat diakses.');
        const access = await this.canAccessLp(userId, rows[0]);
        if (!access.allowed) throw new ForbiddenException('LP tidak dapat diakses oleh akun Anda.');
        return { ...access, lp: rows[0] };
    }

    /** Catat lembar pernyataan akses impersonate masuk ke satker bawahan. */
    async recordSatkerAccessStatement(opts: {
        userId: number;
        targetSatkerId: number;
        pernyataan: string;
        alasan?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{ status: number; message: string }> {
        const plan = await this.plan(opts.userId, opts.targetSatkerId);
        if (plan.own) {
            throw new BadRequestException('Pernyataan akses hanya berlaku untuk satker bawahan.');
        }
        const cleanPernyataan = String(opts.pernyataan || '').trim();
        if (cleanPernyataan.length < 5) {
            throw new BadRequestException('Pernyataan kesediaan akses monitoring wajib diisi.');
        }

        const userRows = await this.ds.query(`select id, name, username from auth_users where id=$1`, [opts.userId]);
        const userName = userRows[0]?.name || userRows[0]?.username || `User #${opts.userId}`;

        await this.ds.query(
            `insert into bdb_lp_monitoring_access_log
             (user_id, user_nama, actor_satker_id, actor_satker_nama, actor_function, target_satker_id, target_satker_nama, pernyataan, alasan, ip_address, user_agent)
             values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
                opts.userId,
                userName,
                plan.actorSatkerId,
                plan.actorSatkerName,
                plan.actorDomains.join(', '),
                plan.targetSatkerId,
                plan.targetSatkerName,
                cleanPernyataan,
                opts.alasan ? String(opts.alasan).trim() : null,
                opts.ipAddress || null,
                opts.userAgent || null,
            ]
        );

        return {
            status: 1,
            message: `Pernyataan akses monitoring satker ${plan.targetSatkerName} berhasil dicatat.`
        };
    }
}
