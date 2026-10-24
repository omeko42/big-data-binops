"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LpMonitoringAccessService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const scope_util_1 = require("./scope.util");
let LpMonitoringAccessService = class LpMonitoringAccessService {
    ds;
    constructor(ds) {
        this.ds = ds;
    }
    satkerDomain(name) {
        const n = String(name || '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ');
        if (/\b(TIPIDTER|TINDAK PIDANA TERTENTU)\b/.test(n))
            return 'TIPIDTER';
        if (/\b(TIPIDEKSUS|EKONOMI KHUSUS)\b/.test(n))
            return 'TIPIDEKSUS';
        if (/\b(TIPIDKOR|KORTAS|KORUPSI)\b/.test(n))
            return 'TIPIDKOR';
        if (/\b(TIPIDSIBER|SIBER|CYBER)\b|SATRESSIBER/.test(n))
            return 'TIPIDSIBER';
        if (/\b(TIPIDNARKOBA|NARKOBA|NARKOTIKA)\b|SATRESNARKOBA/.test(n))
            return 'TIPIDNARKOBA';
        if (/PPAPPO|PPA PPO|PPA DAN PPO|\b(PPA|PPO)\b|SATRESPPADANPPO/.test(n))
            return 'TIPIDPPAPPO';
        if (/\b(TIPIDUM|KRIMINAL UMUM|PIDANA UMUM)\b/.test(n))
            return 'TIPIDUM';
        if (/\b(KRIMSUS|KRIM SUS|KRIMINAL KHUSUS)\b/.test(n))
            return 'KRIMSUS';
        if (/\b(KRIMUM|KRIM UM)\b/.test(n))
            return 'KRIMUM';
        if (/\b(RESKRIM|RES KRIM)\b|SATRESKRIM/.test(n))
            return 'RESKRIM';
        if (/\b(BARESKRIM|MABES)\b/.test(n))
            return 'MABES_ALL';
        return null;
    }
    isTerritorial(row) {
        if (Number(row?.id) === 1 || Number(row?.id) === 13)
            return true;
        const t = String(row?.tipe_satker || '').toUpperCase();
        return t === 'MABES' || t === 'POLDA' || t === 'POLRES' || t === 'POLSEK';
    }
    async satker(id) {
        const rows = await this.ds.query(`select id::int, deskripsi, parent_id::int, tipe_satker, depth::int
             from bdb_satker where id=$1`, [id]);
        return rows[0] || null;
    }
    async resolveOwnPolsekIds(satkerId) {
        if (!satkerId)
            return [];
        const actor = await this.satker(satkerId);
        if (!actor)
            return [Number(satkerId)];
        let polsekId = null;
        if (String(actor.tipe_satker || '').toUpperCase() === 'POLSEK') {
            polsekId = Number(actor.id);
        }
        else if (actor.parent_id) {
            const parent = await this.satker(actor.parent_id);
            if (parent && String(parent.tipe_satker || '').toUpperCase() === 'POLSEK') {
                polsekId = Number(parent.id);
            }
        }
        if (!polsekId)
            return [Number(satkerId)];
        const children = await this.ds.query(`select id::int from bdb_satker where parent_id=$1`, [polsekId]);
        return Array.from(new Set([Number(satkerId), polsekId, ...children.map((r) => Number(r.id))]));
    }
    allowedSubordinateLevels(territoryLevel) {
        const lvl = String(territoryLevel || '').toUpperCase();
        if (lvl === 'MABES')
            return ['POLDA', 'POLRES', 'POLSEK'];
        if (lvl === 'POLDA')
            return ['POLRES', 'POLSEK'];
        if (lvl === 'POLRES')
            return ['POLSEK'];
        return [];
    }
    async actorContext(actorSatkerId) {
        const actor = await this.satker(actorSatkerId);
        if (!actor)
            throw new common_1.ForbiddenException('Satker akun tidak ditemukan.');
        const ancestors = await this.ds.query(`with recursive p as (
                select id,deskripsi,parent_id,tipe_satker,depth from bdb_satker where id=$1
                union all
                select s.id,s.deskripsi,s.parent_id,s.tipe_satker,s.depth from bdb_satker s join p on p.parent_id=s.id
             ) select id::int,deskripsi,parent_id::int,tipe_satker,depth::int from p order by depth desc nulls last`, [actorSatkerId]);
        const terr = ancestors.find((x) => ['POLSEK', 'POLRES', 'POLDA', 'MABES'].includes(String(x.tipe_satker || '').toUpperCase()));
        const territory = terr || ancestors.find((x) => x.id === 1) || (await this.satker(1));
        if (!territory)
            throw new common_1.ForbiddenException('Wilayah induk akun tidak ditemukan.');
        const siblings = await this.ds.query(`select id::int,deskripsi,parent_id::int,tipe_satker,depth::int from bdb_satker where parent_id=$1`, [actor.parent_id || territory.id]);
        return { actor, territory, ancestors, domain: this.satkerDomain(actor.deskripsi), siblings };
    }
    responsibilities(ctx) {
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
                const out = ['TIPIDEKSUS', 'TIPIDKOR', 'TIPIDTER'];
                if (!formed.has('TIPIDSIBER'))
                    out.push('TIPIDSIBER');
                return out;
            }
            case 'KRIMUM': {
                const out = ['TIPIDUM'];
                if (!formed.has('TIPIDPPAPPO'))
                    out.push('TIPIDPPAPPO');
                return out;
            }
            case 'RESKRIM': {
                const out = ['TIPIDUM', 'TIPIDEKSUS', 'TIPIDKOR', 'TIPIDTER'];
                if (!formed.has('TIPIDPPAPPO'))
                    out.push('TIPIDPPAPPO');
                if (!formed.has('TIPIDSIBER'))
                    out.push('TIPIDSIBER');
                return out;
            }
            case 'MABES_ALL': {
                return ['TIPIDUM', 'TIPIDPPAPPO', 'TIPIDEKSUS', 'TIPIDKOR', 'TIPIDTER', 'TIPIDSIBER', 'TIPIDNARKOBA'];
            }
            default: return [];
        }
    }
    classifyCrime(row) {
        if (row.is_ppa || row.mapped_group === 'TIPIDPPAPPO')
            return 'TIPIDPPAPPO';
        if (row.mapped_group === 'TIPIDNARKOBA' || row.mapped_group === 'NARKOBA')
            return 'TIPIDNARKOBA';
        if (row.mapped_group === 'TIPIDSIBER')
            return 'TIPIDSIBER';
        if (row.mapped_group === 'TIPIDTER')
            return 'TIPIDTER';
        if (row.mapped_group === 'TIPIDEKSUS')
            return 'TIPIDEKSUS';
        if (row.mapped_group === 'TIPIDKOR')
            return 'TIPIDKOR';
        if (row.mapped_group === 'TIPIDUM' || row.mapped_group === 'KRIMUM')
            return 'TIPIDUM';
        if (row.mapped_group === 'KRIMSUS')
            return 'TIPIDEKSUS';
        const n = String(row.keterangan || '').toUpperCase();
        if (/NARKOT|NARKOBA|PSIKOTROP|PREKURSOR/.test(n))
            return 'TIPIDNARKOBA';
        if (/SIBER|CYBER|DUNIA MAYA|PERLINDUNGAN DATA PRIBADI|\bITE\b/.test(n))
            return 'TIPIDSIBER';
        return null;
    }
    async crimes() {
        const rows = await this.ds.query(`
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
    async isStrictDescendant(targetId, ancestorId) {
        if (targetId === ancestorId)
            return false;
        const rows = await this.ds.query(`with recursive p as (
                select id,parent_id from bdb_satker where id=$1
                union all select s.id,s.parent_id from bdb_satker s join p on p.parent_id=s.id
             ) select 1 from p where id=$2 limit 1`, [targetId, ancestorId]);
        return rows.length > 0;
    }
    async targetOwners(target, domains) {
        const nodes = await this.ds.query(`
            with recursive t as (
                select id,deskripsi,parent_id,tipe_satker,depth from bdb_satker where id=$1
                union all
                select s.id,s.deskripsi,s.parent_id,s.tipe_satker,s.depth
                from bdb_satker s join t on s.parent_id=t.id
            ) select id::int,deskripsi,parent_id::int,tipe_satker,depth::int from t`, [target.id]);
        const allowedOwnerIds = new Set();
        allowedOwnerIds.add(Number(target.id));
        for (const node of nodes) {
            const d = this.satkerDomain(node.deskripsi);
            const tipe = String(node.tipe_satker || '').toUpperCase();
            if (tipe === 'POLSEK') {
                allowedOwnerIds.add(Number(node.id));
                continue;
            }
            if (!d)
                continue;
            if (domains.includes(d)) {
                allowedOwnerIds.add(Number(node.id));
            }
            else if (d === 'KRIMSUS' && domains.some((x) => ['TIPIDEKSUS', 'TIPIDKOR', 'TIPIDTER', 'TIPIDSIBER'].includes(x))) {
                allowedOwnerIds.add(Number(node.id));
            }
            else if (d === 'KRIMUM' && domains.some((x) => ['TIPIDUM', 'TIPIDPPAPPO'].includes(x))) {
                allowedOwnerIds.add(Number(node.id));
            }
            else if (d === 'RESKRIM' && domains.some((x) => x !== 'TIPIDNARKOBA')) {
                allowedOwnerIds.add(Number(node.id));
            }
        }
        return Array.from(allowedOwnerIds);
    }
    async plan(userId, targetSatkerId) {
        const scope = await (0, scope_util_1.resolveScope)(this.ds, userId);
        if (scope.all)
            return { all: true, own: !targetSatkerId, actorSatkerId: null, actorSatkerName: null, actorDomains: [], targetSatkerId: targetSatkerId || null, targetSatkerName: null, ownerIds: [], crimeIds: [] };
        if (!scope.satkerId)
            return { all: false, own: true, actorSatkerId: null, actorSatkerName: null, actorDomains: [], targetSatkerId: null, targetSatkerName: null, ownerIds: [], crimeIds: [] };
        const ownPolsekIds = await this.resolveOwnPolsekIds(scope.satkerId);
        if (!targetSatkerId || Number(targetSatkerId) === scope.satkerId || ownPolsekIds.includes(Number(targetSatkerId))) {
            const actor = await this.satker(scope.satkerId);
            return {
                all: false,
                own: true,
                actorSatkerId: scope.satkerId,
                actorSatkerName: actor?.deskripsi || null,
                actorDomains: [],
                targetSatkerId: null,
                targetSatkerName: null,
                ownerIds: ownPolsekIds.length ? ownPolsekIds : [scope.satkerId],
                crimeIds: []
            };
        }
        const ctx = await this.actorContext(scope.satkerId);
        const domains = this.responsibilities(ctx);
        const target = await this.satker(Number(targetSatkerId));
        if (!target || domains.length === 0) {
            throw new common_1.ForbiddenException('Satker tujuan tidak ditemukan atau fungsi akun Anda tidak memiliki wewenang monitoring.');
        }
        const ancestorIds = ctx.ancestors.slice(1).map((x) => x.id);
        if (ancestorIds.includes(target.id) || target.id === ctx.territory.id) {
            throw new common_1.ForbiddenException('Satker tujuan tidak dapat diakses (satker induk/ancestor tidak boleh diakses oleh bawahan).');
        }
        const isTargetUnderTerritory = await this.isStrictDescendant(target.id, ctx.territory.id);
        if (!isTargetUnderTerritory) {
            throw new common_1.ForbiddenException('Satker tujuan tidak termasuk wilayah regional akun Anda.');
        }
        const targetTerrRows = await this.ds.query(`with recursive p as (
                select id, parent_id, tipe_satker, depth from bdb_satker where id = $1
                union all
                select s.id, s.parent_id, s.tipe_satker, s.depth from bdb_satker s join p on p.parent_id = s.id
             ) select upper(tipe_satker) as tipe from p
               where upper(tipe_satker) in ('POLSEK', 'POLRES', 'POLDA', 'MABES')
               order by depth desc nulls last limit 1`, [target.id]);
        const targetTerrLevel = targetTerrRows[0]?.tipe;
        const allowedLevels = this.allowedSubordinateLevels(ctx.territory.tipe_satker);
        if (!targetTerrLevel || !allowedLevels.includes(targetTerrLevel)) {
            throw new common_1.ForbiddenException('Satker tujuan tidak termasuk kewenangan monitoring (tidak boleh mengakses satker sejajar/lateral).');
        }
        const crimeRows = await this.crimes();
        const crimeIds = crimeRows.filter((x) => x.domain && domains.includes(x.domain)).map((x) => x.id);
        let ownerIds;
        if (this.isTerritorial(target)) {
            ownerIds = await this.targetOwners(target, domains);
        }
        else {
            const subNodes = await this.ds.query(`
                with recursive t as (
                    select id from bdb_satker where id=$1
                    union all
                    select s.id from bdb_satker s join t on s.parent_id=t.id
                ) select id::int from t`, [target.id]);
            const additionalIds = [];
            const parentRow = target.parent_id ? await this.satker(target.parent_id) : null;
            if (parentRow && String(parentRow.tipe_satker || '').toUpperCase() === 'POLRES') {
                additionalIds.push(Number(target.parent_id));
                const isNarkoba = /NARKOBA/.test(String(target.deskripsi || '').toUpperCase());
                const siblingRows = await this.ds.query(`select id::int from bdb_satker
                     where parent_id = $1 and ${isNarkoba ? "(deskripsi ~* 'SAT\\s*NARKOBA|SATRESNARKOBA')" : (domains.includes('TIPIDPPAPPO') ? "(deskripsi ~* 'SAT\\s*RESKRIM|SATRESKRIM|PPA|PPO|RENAKTA')" : "(deskripsi ~* 'SAT\\s*RESKRIM|SATRESKRIM')")}`, [target.parent_id]);
                siblingRows.forEach((r) => additionalIds.push(Number(r.id)));
            }
            else if (parentRow && String(parentRow.tipe_satker || '').toUpperCase() === 'POLSEK') {
                additionalIds.push(Number(target.parent_id));
            }
            ownerIds = Array.from(new Set([Number(target.id), ...subNodes.map((x) => Number(x.id)), ...additionalIds]));
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
    domainToKelompok(domain) {
        const d = String(domain || '').toUpperCase();
        if (d === 'TIPIDUM' || d === 'TIPIDPPAPPO')
            return 'KRIMUM';
        if (d === 'TIPIDEKSUS' || d === 'TIPIDKOR' || d === 'TIPIDTER' || d === 'TIPIDSIBER')
            return 'KRIMSUS';
        if (d === 'TIPIDNARKOBA')
            return 'NARKOBA';
        return 'LAINNYA';
    }
    async metadata(userId) {
        const scope = await (0, scope_util_1.resolveScope)(this.ds, userId);
        const crimeRows = await this.crimes();
        const golonganMap = new Map();
        crimeRows.forEach((x) => { if (x.golongan_id && x.golongan_nama)
            golonganMap.set(x.golongan_id, x.golongan_nama); });
        const golongan = Array.from(golonganMap, ([id, nama]) => ({ id, nama })).sort((a, b) => a.nama.localeCompare(b.nama));
        if (scope.all)
            return {
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
        if (!scope.satkerId)
            return { all: false, own_satker: null, targets: [], domains: [], primary_domain: null, actor_kelompok: 'ALL', crimes: [], golongan: [] };
        const ctx = await this.actorContext(scope.satkerId);
        const domains = this.responsibilities(ctx);
        const allowedLevels = this.allowedSubordinateLevels(ctx.territory.tipe_satker);
        const isActorNarkoba = ctx.domain === 'TIPIDNARKOBA';
        const targets = (domains.length && allowedLevels.length > 0) ? await this.ds.query(`
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
        }
        else if (dStr === 'TIPIDNARKOBA') {
            actorKelompok = 'NARKOBA';
        }
        else if (dStr === 'TIPIDUM' || dStr === 'TIPIDPPAPPO' || dStr === 'KRIMUM' || dStr === 'RESKRIM') {
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
    async canAccessLp(userId, lp) {
        const scope = await (0, scope_util_1.resolveScope)(this.ds, userId);
        if (scope.all)
            return { allowed: true, monitoring: false, plan: null };
        const ownerId = Number(lp.unit_satker_id ?? lp.satker_id ?? 0);
        if (!scope.satkerId || !ownerId || lp.deleted_at || lp.dilimpahkan_eksternal)
            return { allowed: false, monitoring: false, plan: null };
        const ownPolsekIds = await this.resolveOwnPolsekIds(scope.satkerId);
        if (ownerId === scope.satkerId || ownPolsekIds.includes(ownerId) || (lp.satker_id && ownPolsekIds.includes(Number(lp.satker_id))))
            return { allowed: true, monitoring: false, plan: null };
        const owner = await this.satker(ownerId);
        if (!owner)
            return { allowed: false, monitoring: false, plan: null };
        const ancestors = await this.ds.query(`with recursive p as (select id,deskripsi,parent_id,tipe_satker,depth from bdb_satker where id=$1 union all select s.id,s.deskripsi,s.parent_id,s.tipe_satker,s.depth from bdb_satker s join p on p.parent_id=s.id)
             select id::int,deskripsi,parent_id::int,tipe_satker,depth::int from p order by depth desc nulls last`, [ownerId]);
        const target = ancestors.find((x) => this.isTerritorial(x));
        if (!target)
            return { allowed: false, monitoring: false, plan: null };
        try {
            const plan = await this.plan(userId, target.id);
            const allowed = plan.ownerIds.includes(ownerId) && !!lp.jenis_kejahatan_id && plan.crimeIds.includes(Number(lp.jenis_kejahatan_id));
            return { allowed, monitoring: allowed, plan };
        }
        catch {
            return { allowed: false, monitoring: false, plan: null };
        }
    }
    async assertNotViewer(userId, authUser) {
        let role = String(authUser?.role_bdb || authUser?.role_name || '').trim().toLowerCase();
        if (!role && userId) {
            const uRows = await this.ds.query('select role_bdb, role_name from auth_users where id=$1 and deleted_at is null', [userId]);
            role = String(uRows[0]?.role_bdb || uRows[0]?.role_name || '').trim().toLowerCase();
        }
        if (role === 'viewer') {
            throw new common_1.ForbiddenException('Role viewer hanya memiliki hak akses lihat (read-only). Aksi tidak diizinkan.');
        }
    }
    async assertCanMutateLp(userId, lpId, authUser) {
        await this.assertNotViewer(userId, authUser);
        return this.assertCanAccessLp(userId, lpId);
    }
    async assertCanAccessLp(userId, lpId) {
        const rows = await this.ds.query(`select id,satker_id,unit_satker_id,jenis_kejahatan_id,deleted_at,dilimpahkan_eksternal from bdb_laporan_polisi where id=$1`, [lpId]);
        if (!rows.length)
            throw new common_1.ForbiddenException('LP tidak dapat diakses.');
        const access = await this.canAccessLp(userId, rows[0]);
        if (!access.allowed)
            throw new common_1.ForbiddenException('LP tidak dapat diakses oleh akun Anda.');
        return { ...access, lp: rows[0] };
    }
    async recordSatkerAccessStatement(opts) {
        const plan = await this.plan(opts.userId, opts.targetSatkerId);
        if (plan.own) {
            throw new common_1.BadRequestException('Pernyataan akses hanya berlaku untuk satker bawahan.');
        }
        const cleanPernyataan = String(opts.pernyataan || '').trim();
        if (cleanPernyataan.length < 5) {
            throw new common_1.BadRequestException('Pernyataan kesediaan akses monitoring wajib diisi.');
        }
        const userRows = await this.ds.query(`select id, name, username from auth_users where id=$1`, [opts.userId]);
        const userName = userRows[0]?.name || userRows[0]?.username || `User #${opts.userId}`;
        await this.ds.query(`insert into bdb_lp_monitoring_access_log
             (user_id, user_nama, actor_satker_id, actor_satker_nama, actor_function, target_satker_id, target_satker_nama, pernyataan, alasan, ip_address, user_agent)
             values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [
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
        ]);
        return {
            status: 1,
            message: `Pernyataan akses monitoring satker ${plan.targetSatkerName} berhasil dicatat.`
        };
    }
};
exports.LpMonitoringAccessService = LpMonitoringAccessService;
exports.LpMonitoringAccessService = LpMonitoringAccessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], LpMonitoringAccessService);
//# sourceMappingURL=lp-monitoring-access.service.js.map