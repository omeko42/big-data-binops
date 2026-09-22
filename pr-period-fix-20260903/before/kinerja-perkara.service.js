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
var KinerjaPerkaraService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinerjaPerkaraService = exports.buildKinerjaRegionalScopePlan = exports.kinerjaScopeFunctionGroup = exports.appendKinerjaGroupWhere = exports.buildKinerjaGroupPlan = exports.kinerjaDirectFunctionGroup = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("typeorm");
const scope_util_1 = require("../common/scope.util");
const indeks_util_1 = require("./indeks.util");
const clearance_rate_util_1 = require("./clearance-rate.util");
const anev_service_1 = require("../anev/anev.service");
const cluster_instance_util_1 = require("../common/cluster-instance.util");
const DATE_EXPR = "(case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else lp.synced_at::date end)";
const CP_BREAKDOWN = [
    { key: 'lidik', code: 'PENYELIDIKAN' },
    { key: 'sidik', code: 'PENYIDIKAN' },
    { key: 'spdp', code: 'SPDP' },
    { key: 'thp1', code: 'TAHAP_I' },
    { key: 'p19', code: 'P19' },
    { key: 'p21', code: 'P21' }
];
const ALASAN_RJ_LIKE = '%restorat%';
const ALASAN_RJ_WORD_RE = '\\yrj\\y';
const CC_BREAKDOWN = [
    { key: 'sp2lid', cond: "status_code = 'SP2_LIDIK'" },
    { key: 'sp3', cond: "status_code = 'SP3'" },
    { key: 'tipiring', cond: "status_code = 'TIPIRING_PUTUSAN'" },
    { key: 'thp2', cond: "status_code = 'TAHAP_II'" }
];
const DEFAULT_TAXONOMY_FILTER = {
    functionDomain: 'INTERNAL_RESERSE',
    organizationDomain: 'INTERNAL_POLRI'
};
const uniquePositive = (values) => [...new Set((values || []).map(Number).filter((n) => Number.isInteger(n) && n > 0))];
const intersectCrimeSets = (sets) => {
    const active = sets.filter((v) => v !== undefined);
    if (!active.length)
        return undefined;
    if (active.some((v) => v.length === 0 || v.includes(-1)))
        return [-1];
    let result = uniquePositive(active[0]);
    for (let i = 1; i < active.length && result.length; i++) {
        const allowed = new Set(uniquePositive(active[i]));
        result = result.filter((id) => allowed.has(id));
    }
    return result.length ? result : [-1];
};
class KinerjaCrimeGroupResolver {
    ds;
    cache = null;
    constructor(ds) {
        this.ds = ds;
    }
    clearCache() { this.cache = null; }
    async state() {
        if (this.cache && Date.now() - this.cache.at < 60_000)
            return this.cache.value;
        const versions = await this.ds.query(`
            select id,version_code from bdb_kinerja_crime_group_mapping_version
            where active=true and status='APPROVED' and approved_by is not null and approved_at is not null
            order by approved_at desc,id desc limit 1
        `);
        const versionId = versions.length ? Number(versions[0].id) : null;
        const version = versions.length ? String(versions[0].version_code) : 'NONE_APPROVED';
        const usedRows = await this.ds.query(`select distinct jenis_kejahatan_id as id from bdb_kinerja_perkara_snapshot where jenis_kejahatan_id is not null`);
        const usedIds = uniquePositive(usedRows.map((r) => Number(r.id)));
        const approvedRows = versionId == null ? [] : await this.ds.query(`
            select jenis_kejahatan_id as id,kelompok from bdb_kinerja_crime_group_mapping
            where version_id=$1 and active=true and decision_status='APPROVED'
              and approved_by is not null and approved_at is not null
              and kelompok in ('KRIMUM','KRIMSUS','NARKOBA')
        `, [versionId]);
        const approvedByGroup = new Map([['KRIMUM', []], ['KRIMSUS', []], ['NARKOBA', []]]);
        const approvedAll = new Set();
        for (const row of approvedRows) {
            const id = Number(row.id), group = String(row.kelompok);
            if (!approvedByGroup.has(group) || !Number.isInteger(id) || id <= 0)
                continue;
            approvedByGroup.get(group).push(id);
            approvedAll.add(id);
        }
        const value = { versionId, version, usedIds, approvedByGroup, approvedAll, reviewCount: usedIds.filter((id) => !approvedAll.has(id)).length };
        this.cache = { value, at: Date.now() };
        return value;
    }
    async resolve(explicitIn, golonganIn, iccsIn, groupsIn = []) {
        const explicit = uniquePositive(explicitIn), golongan = uniquePositive(golonganIn), iccs = uniquePositive(iccsIn);
        const groups = [...new Set(groupsIn)];
        let master;
        if (golongan.length || iccs.length) {
            const params = [], where = [];
            if (golongan.length) {
                const regularGolongan = golongan.filter((id) => id !== 5);
                const golonganWhere = [];
                if (regularGolongan.length) {
                    params.push(regularGolongan);
                    golonganWhere.push(`ck."golonganKejahatanId"=any($${params.length})`);
                }
                if (golongan.includes(5)) {
                    golonganWhere.push(`exists (
                        select 1 from bdb_kinerja_ppappo_crime_mapping pm
                        where pm.jenis_kejahatan_id=ck.id and pm.active=true
                    )`);
                }
                where.push(`(${golonganWhere.join(' or ')})`);
            }
            if (iccs.length) {
                params.push(iccs);
                where.push(`"iccsKategoriId"=any($${params.length})`);
            }
            const rows = await this.ds.query(`select ck.id from cm_jenis_kejahatan ck where ${where.join(' and ')}`, params);
            master = uniquePositive(rows.map((r) => Number(r.id)));
        }
        const state = await this.state();
        const officialGroups = groups.filter((g) => g !== 'REVIEW');
        const officialGroupCrimeIds = uniquePositive(officialGroups.flatMap((g) => state.approvedByGroup.get(g) || []));
        const reviewSelected = groups.includes('REVIEW');
        return {
            baseIds: intersectCrimeSets([explicitIn === undefined ? undefined : explicit, master]),
            officialGroupCrimeIds,
            reviewCrimeIds: reviewSelected ? state.usedIds.filter((id) => !state.approvedAll.has(id)) : [],
            officialGroups, reviewSelected,
            appliedFilters: { jenisKejahatanIds: explicit, golonganIds: golongan, iccsKategoriIds: iccs, kelompokHitung: groups },
            mapping: { version: state.version, versionId: state.versionId, reviewCount: state.reviewCount }
        };
    }
}
const kinerjaDirectFunctionGroup = (nameIn) => {
    const compact = normalizedSatkerWords(nameIn).replace(/ /g, '');
    if (!compact.startsWith('DIT') && !compact.startsWith('SAT'))
        return null;
    if (compact.includes('NARKOBA'))
        return 'NARKOBA';
    if (compact.includes('KRIMSUS') ||
        compact.includes('SIBER') ||
        compact.includes('TIPIDEKSUS') ||
        compact.includes('TIPIDTER') ||
        compact.includes('TIPIDKOR'))
        return 'KRIMSUS';
    if (compact.includes('KRIMUM') ||
        compact.includes('TIPIDUM') ||
        compact.includes('PPAPPO') ||
        compact.includes('PPADANPPO') ||
        compact.includes('RESPPA') ||
        compact.includes('RESKRIM'))
        return 'KRIMUM';
    return null;
};
exports.kinerjaDirectFunctionGroup = kinerjaDirectFunctionGroup;
const buildKinerjaGroupPlan = (satkers, dimensions) => {
    const active = dimensions.officialGroups.length > 0 || dimensions.reviewSelected;
    if (!active) {
        return {
            active: false,
            functionMatchedSatkerIds: [],
            fallbackSatkerIds: [],
            officialCrimeIds: [],
            reviewCrimeIds: [],
            reviewSelected: false
        };
    }
    const byId = new Map(satkers.map((s) => [Number(s.id), s]));
    const memo = new Map();
    const visiting = new Set();
    const inheritedGroup = (id) => {
        if (memo.has(id))
            return memo.get(id);
        if (visiting.has(id))
            return null;
        visiting.add(id);
        const satker = byId.get(id);
        let group = satker ? (0, exports.kinerjaDirectFunctionGroup)(satker.deskripsi) : null;
        if (!group && satker?.parent_id != null)
            group = inheritedGroup(Number(satker.parent_id));
        visiting.delete(id);
        memo.set(id, group);
        return group;
    };
    const selected = new Set(dimensions.officialGroups);
    const functionMatchedSatkerIds = [];
    const fallbackSatkerIds = [];
    for (const satker of satkers) {
        const id = Number(satker.id);
        const group = inheritedGroup(id);
        if (group == null)
            fallbackSatkerIds.push(id);
        else if (selected.has(group))
            functionMatchedSatkerIds.push(id);
    }
    return {
        active,
        functionMatchedSatkerIds,
        fallbackSatkerIds,
        officialCrimeIds: [...dimensions.officialGroupCrimeIds],
        reviewCrimeIds: [...dimensions.reviewCrimeIds],
        reviewSelected: dimensions.reviewSelected
    };
};
exports.buildKinerjaGroupPlan = buildKinerjaGroupPlan;
const appendKinerjaGroupWhere = (where, params, plan) => {
    if (!plan.active)
        return where;
    const branches = [];
    if (plan.functionMatchedSatkerIds.length) {
        params.push(plan.functionMatchedSatkerIds);
        branches.push(`satker_id = any($${params.length})`);
    }
    if (plan.fallbackSatkerIds.length && plan.officialCrimeIds.length) {
        params.push(plan.fallbackSatkerIds);
        const satkerParam = params.length;
        params.push(plan.officialCrimeIds);
        branches.push(`(satker_id = any($${satkerParam}) and jenis_kejahatan_id = any($${params.length}))`);
    }
    if (plan.reviewSelected && plan.reviewCrimeIds.length) {
        params.push(plan.reviewCrimeIds);
        branches.push(`jenis_kejahatan_id = any($${params.length})`);
    }
    return `${where} and (${branches.length ? branches.join(' or ') : 'false'})`;
};
exports.appendKinerjaGroupWhere = appendKinerjaGroupWhere;
const normalizedSatkerWords = (value) => String(value ?? '')
    .normalize('NFKD')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
const satkerTokens = (value) => {
    const words = normalizedSatkerWords(value);
    return words ? words.split(' ') : [];
};
const startsWithSatkerTokens = (value, expected) => {
    const tokens = satkerTokens(value);
    return expected.every((token, index) => tokens[index] === token);
};
const hasSatkerToken = (value, token) => satkerTokens(value).includes(token);
const compactSatkerName = (value) => satkerTokens(value).join('');
const isPolresSatkerType = (value) => ['POLRES', 'POLRESTA', 'POLRESTABES'].includes(normalizedSatkerWords(value));
const POLDA_BUSINESS_ORDER = [
    'POLDA ACEH',
    'POLDA SUMATERA UTARA',
    'POLDA RIAU',
    'POLDA KEPULAUAN RIAU',
    'POLDA JAMBI',
    'POLDA BENGKULU',
    'POLDA SUMATERA BARAT',
    'POLDA SUMATERA SELATAN',
    'POLDA KEPULAUAN BANGKA BELITUNG',
    'POLDA LAMPUNG',
    'POLDA BANTEN',
    'POLDA METRO JAYA',
    'POLDA JAWA BARAT',
    'POLDA JAWA TENGAH',
    'POLDA DAERAH ISTIMEWA YOGYAKARTA',
    'POLDA JAWA TIMUR',
    'POLDA BALI',
    'POLDA NUSA TENGGARA BARAT',
    'POLDA NUSA TENGGARA TIMUR',
    'POLDA KALIMANTAN TIMUR',
    'POLDA KALIMANTAN BARAT',
    'POLDA KALIMANTAN TENGAH',
    'POLDA KALIMANTAN SELATAN',
    'POLDA KALIMANTAN UTARA',
    'POLDA SULAWESI SELATAN',
    'POLDA SULAWESI UTARA',
    'POLDA SULAWESI TENGAH',
    'POLDA SULAWESI TENGGARA',
    'POLDA SULAWESI BARAT',
    'POLDA GORONTALO',
    'POLDA MALUKU',
    'POLDA MALUKU UTARA',
    'POLDA PAPUA',
    'POLDA PAPUA BARAT',
    'POLDA PAPUA BARAT DAYA',
    'POLDA PAPUA TENGAH',
    'POLDA PAPUA PEGUNUNGAN',
    'POLDA PAPUA SELATAN'
];
const poldaBusinessRank = new Map(POLDA_BUSINESS_ORDER.map((name, index) => [normalizedSatkerWords(name), index + 1]));
const polriChildRank = (childName) => {
    if (startsWithSatkerTokens(childName, ['BARESKRIM']))
        return 10;
    if (startsWithSatkerTokens(childName, ['KORTAS']))
        return 20;
    const poldaRank = poldaBusinessRank.get(normalizedSatkerWords(childName));
    if (poldaRank != null)
        return 100 + poldaRank;
    if (startsWithSatkerTokens(childName, ['POLDA']))
        return 900;
    return 50;
};
const hasPpaPpoFunctionMarker = (value) => {
    const tokens = satkerTokens(value);
    if (tokens.includes('PPAPPO'))
        return true;
    if (tokens.includes('PPA') && tokens.includes('PPO'))
        return true;
    const compact = tokens.join('');
    return [
        'DITTIPIDPPADANPPO', 'DITTIPIDPPAPPO', 'DITPPADANPPO', 'DITPPAPPO',
        'SATRESPPADANPPO', 'SATRESPPAPPO', 'SATPPADANPPO', 'SATPPAPPO'
    ].some((prefix) => compact.startsWith(prefix));
};
const hasSiberFunctionMarker = (value) => {
    const tokens = satkerTokens(value);
    if (tokens.includes('SIBER') || tokens.includes('TIPIDSIBER'))
        return true;
    const compact = tokens.join('');
    return compact.startsWith('DITTIPIDSIBER') || compact.startsWith('DITRESSIBER');
};
const bareskrimChildRank = (childName) => {
    const tokens = satkerTokens(childName);
    const compact = tokens.join('');
    if (tokens.includes('TIPIDUM') || compact.startsWith('DITTIPIDUM'))
        return 10;
    if (tokens.includes('TIPIDEKSUS') || compact.startsWith('DITTIPIDEKSUS'))
        return 20;
    if (tokens.includes('TIPIDNARKOBA') || compact.startsWith('DITTIPIDNARKOBA'))
        return 30;
    if (tokens.includes('TIPIDTER') || compact.startsWith('DITTIPIDTER'))
        return 40;
    if (tokens.includes('TIPIDSIBER') || compact.startsWith('DITTIPIDSIBER'))
        return 50;
    if (hasPpaPpoFunctionMarker(childName))
        return 60;
    return 90;
};
const poldaChildRank = (parentName, childName, childType) => {
    if (!isPolresSatkerType(childType)) {
        if (hasSatkerToken(childName, 'KRIMUM'))
            return 10;
        if (hasSatkerToken(childName, 'KRIMSUS'))
            return 20;
        if (hasSatkerToken(childName, 'NARKOBA') || hasSatkerToken(childName, 'TIPIDNARKOBA'))
            return 30;
        if (hasSiberFunctionMarker(childName))
            return 40;
        if (hasPpaPpoFunctionMarker(childName))
            return 50;
        return 55;
    }
    if (normalizedSatkerWords(parentName) === 'POLDA METRO JAYA' && startsWithSatkerTokens(childName, ['POLRES', 'METRO']))
        return 60;
    if (startsWithSatkerTokens(childName, ['POLRESTABES']))
        return 70;
    if (startsWithSatkerTokens(childName, ['POLRESTA']))
        return 80;
    return 90;
};
const polresChildRank = (childName, childType) => {
    if (normalizedSatkerWords(childType) === 'POLSEK')
        return startsWithSatkerTokens(childName, ['POLSEKTA']) ? 50 : 60;
    const compact = compactSatkerName(childName);
    if (compact.startsWith('SATRESKRIM') || startsWithSatkerTokens(childName, ['SAT', 'RESKRIM']) || startsWithSatkerTokens(childName, ['RESKRIM']))
        return 10;
    if (compact.startsWith('SATRESNARKOBA') || compact.startsWith('SATNARKOBA') || startsWithSatkerTokens(childName, ['SAT', 'RES', 'NARKOBA']))
        return 20;
    if (hasPpaPpoFunctionMarker(childName))
        return 30;
    return 40;
};
const satkerStructuralRank = (parent, child, parentType, childType) => {
    if (!parent)
        return 0;
    if (startsWithSatkerTokens(parent.nama, ['POLRI']))
        return polriChildRank(child.nama);
    if (startsWithSatkerTokens(parent.nama, ['BARESKRIM']))
        return bareskrimChildRank(child.nama);
    const normalizedParentType = normalizedSatkerWords(parentType);
    if (normalizedParentType === 'POLDA')
        return poldaChildRank(parent.nama, child.nama, childType);
    if (isPolresSatkerType(normalizedParentType))
        return polresChildRank(child.nama, childType);
    if (normalizedParentType === 'POLSEK') {
        const compact = compactSatkerName(child.nama);
        return compact.startsWith('UNITRESKRIM') || startsWithSatkerTokens(child.nama, ['RESKRIM']) ? 10 : 20;
    }
    return 0;
};
const kinerjaScopeFunctionGroup = (nameIn) => {
    const direct = (0, exports.kinerjaDirectFunctionGroup)(nameIn);
    if (direct)
        return direct;
    const compact = compactSatkerName(nameIn);
    if (compact.includes('NARKOBA') || compact.includes('NARKOTIKA'))
        return 'NARKOBA';
    if (compact.includes('KRIMSUS') ||
        compact.includes('SIBER') ||
        compact.includes('TIPIDEKSUS') ||
        compact.includes('TIPIDTER') ||
        compact.includes('TIPIDKOR'))
        return 'KRIMSUS';
    if (compact.includes('KRIMUM') ||
        compact.includes('RESKRIM') ||
        compact.includes('TIPIDUM') ||
        compact.includes('PIDUM') ||
        compact.includes('JATANRAS') ||
        compact.includes('PPAPPO') ||
        compact.includes('PPADANPPO'))
        return 'KRIMUM';
    return null;
};
exports.kinerjaScopeFunctionGroup = kinerjaScopeFunctionGroup;
const buildKinerjaRegionalScopePlan = (satkers, scopeSatkerId, requestedScopeSatkerId) => {
    const byId = new Map(satkers.map((s) => [Number(s.id), s]));
    const scopeNode = byId.get(Number(scopeSatkerId));
    if (!scopeNode)
        return null;
    let root = scopeNode;
    let cursor = scopeNode;
    let nearestPolsek = null;
    let nearestPolres = null;
    let nearestPolda = null;
    const ancestorGuard = new Set();
    while (cursor && !ancestorGuard.has(Number(cursor.id))) {
        const id = Number(cursor.id);
        ancestorGuard.add(id);
        const tipe = normalizedSatkerWords(cursor.tipe_satker);
        if (!nearestPolsek && tipe === 'POLSEK')
            nearestPolsek = cursor;
        if (!nearestPolres && isPolresSatkerType(tipe))
            nearestPolres = cursor;
        if (tipe === 'POLDA') {
            nearestPolda = cursor;
            break;
        }
        cursor = cursor.parent_id == null ? undefined : byId.get(Number(cursor.parent_id));
    }
    const scopeType = normalizedSatkerWords(scopeNode.tipe_satker);
    if (scopeType === 'POLDA')
        root = scopeNode;
    else if (isPolresSatkerType(scopeType))
        root = scopeNode;
    else if (scopeType === 'POLSEK')
        root = scopeNode;
    else if (scopeType === 'FUNGSI')
        root = nearestPolsek || nearestPolres || nearestPolda || scopeNode;
    else
        root = nearestPolsek || nearestPolres || nearestPolda || scopeNode;
    const accountRootId = Number(root.id);
    const functionGroup = (0, exports.kinerjaScopeFunctionGroup)(scopeNode.deskripsi);
    const isDescendantOf = (satker, ancestorId) => {
        let current = satker;
        const guard = new Set();
        while (current && !guard.has(Number(current.id))) {
            const id = Number(current.id);
            if (id === ancestorId)
                return true;
            guard.add(id);
            current = current.parent_id == null ? undefined : byId.get(Number(current.parent_id));
        }
        return false;
    };
    if (requestedScopeSatkerId != null) {
        const requestedNode = byId.get(Number(requestedScopeSatkerId));
        if (!requestedNode || !isDescendantOf(requestedNode, accountRootId))
            return null;
        const requestedType = normalizedSatkerWords(requestedNode.tipe_satker);
        if (requestedType !== 'POLDA' && !isPolresSatkerType(requestedType) && requestedType !== 'POLSEK')
            return null;
        root = requestedNode;
    }
    const rootId = Number(root.id);
    const isInRoot = (satker) => isDescendantOf(satker, rootId);
    const inheritedFunctionGroup = (satker) => {
        let current = satker;
        const guard = new Set();
        while (current && !guard.has(Number(current.id))) {
            const id = Number(current.id);
            guard.add(id);
            const group = (0, exports.kinerjaScopeFunctionGroup)(current.deskripsi);
            if (group)
                return group;
            if (id === rootId)
                break;
            current = current.parent_id == null ? undefined : byId.get(Number(current.parent_id));
        }
        return null;
    };
    const allowedIds = satkers
        .filter(isInRoot)
        .filter((satker) => {
        if (!functionGroup)
            return true;
        if (normalizedSatkerWords(satker.tipe_satker) !== 'FUNGSI')
            return true;
        return inheritedFunctionGroup(satker) === functionGroup;
    })
        .map((satker) => Number(satker.id));
    return {
        rootId,
        rootNama: root.deskripsi,
        functionGroup,
        allowedIds,
        visibleIds: new Set(allowedIds)
    };
};
exports.buildKinerjaRegionalScopePlan = buildKinerjaRegionalScopePlan;
let KinerjaPerkaraService = class KinerjaPerkaraService {
    static { KinerjaPerkaraService_1 = this; }
    ds;
    anev;
    logger = new common_1.Logger(KinerjaPerkaraService_1.name);
    satkerCache = null;
    static SATKER_CACHE_TTL_MS = 10 * 60 * 1000;
    crimeGroupResolver;
    constructor(ds, anev) {
        this.ds = ds;
        this.anev = anev;
        this.crimeGroupResolver = new KinerjaCrimeGroupResolver(ds);
    }
    clearCache() {
        this.satkerCache = null;
        this.excludedSatkerCache = null;
        this.crimeGroupResolver.clearCache();
    }
    async getSatkerTree() {
        if (this.satkerCache && Date.now() - this.satkerCache.at < KinerjaPerkaraService_1.SATKER_CACHE_TTL_MS) {
            return this.satkerCache.rows;
        }
        const rawRows = await this.ds.query(`
            select s.id, s.kode, s.deskripsi, s.parent_id, s.depth, s.jumlah_penduduk,
                   s.tipe_satker, s.urutan,
                   t.function_domain as function_domain_resolved,
                   t.organization_domain as organization_domain_resolved,
                   t.counting_eligible
            from public.bdb_satker s
            inner join public.bdb_satker_taxonomy_r11 t
                    on t.source_table = 'BDB_SATKER'
                   and t.entity_id = s.id
        `);
        const rows = rawRows.map((row) => ({
            ...row,
            id: Number(row.id),
            parent_id: row.parent_id == null ? null : Number(row.parent_id),
            depth: Number(row.depth || 0),
            urutan: row.urutan == null ? null : Number(row.urutan),
            counting_eligible: row.counting_eligible === true
        }));
        this.satkerCache = { rows, at: Date.now() };
        return rows;
    }
    async scopeOptions(userId) {
        const scope = await (0, scope_util_1.resolveScope)(this.ds, userId);
        const satkers = await this.getSatkerTree();
        const byId = new Map(satkers.map((s) => [Number(s.id), s]));
        const isDescendantOf = (satker, ancestorId) => {
            let current = satker;
            const guard = new Set();
            while (current && !guard.has(Number(current.id))) {
                const id = Number(current.id);
                if (id === ancestorId)
                    return true;
                guard.add(id);
                current = current.parent_id == null ? undefined : byId.get(Number(current.parent_id));
            }
            return false;
        };
        const optionType = (s) => {
            const tipe = normalizedSatkerWords(s.tipe_satker);
            if (tipe === 'POLDA')
                return 'POLDA';
            if (isPolresSatkerType(tipe))
                return 'POLRES';
            if (tipe === 'POLSEK')
                return 'POLSEK';
            return null;
        };
        let defaultRegionId = null;
        let allowedTypes = new Set(['POLDA']);
        let candidates = satkers;
        if (!scope.all) {
            if (!scope.satkerId) {
                return {
                    status: 1,
                    data: { defaultVisibility: 'scoped', defaultRegionId, options: [] }
                };
            }
            const accountPlan = (0, exports.buildKinerjaRegionalScopePlan)(satkers, scope.satkerId);
            if (!accountPlan) {
                return {
                    status: 1,
                    data: { defaultVisibility: 'scoped', defaultRegionId, options: [] }
                };
            }
            defaultRegionId = accountPlan.rootId;
            const root = byId.get(accountPlan.rootId);
            const rootType = optionType(root);
            allowedTypes = rootType === 'POLDA'
                ? new Set(['POLDA', 'POLRES'])
                : rootType === 'POLRES'
                    ? new Set(['POLRES', 'POLSEK'])
                    : new Set(['POLSEK']);
            candidates = satkers.filter((s) => isDescendantOf(s, accountPlan.rootId));
        }
        const options = candidates
            .map((s) => ({ satker: s, tipe: optionType(s) }))
            .filter((entry) => entry.tipe != null && allowedTypes.has(entry.tipe))
            .sort((a, b) => {
            const typeRank = { POLDA: 1, POLRES: 2, POLSEK: 3 };
            return typeRank[a.tipe] - typeRank[b.tipe]
                || (a.satker.urutan ?? 999999) - (b.satker.urutan ?? 999999)
                || a.satker.deskripsi.localeCompare(b.satker.deskripsi, 'id');
        })
            .map(({ satker, tipe }) => ({
            label: satker.deskripsi,
            value: Number(satker.id),
            tipe
        }));
        return {
            status: 1,
            data: {
                defaultVisibility: scope.all ? 'national' : 'scoped',
                defaultRegionId,
                options
            }
        };
    }
    excludedSatkerCache = null;
    async getExcludedSatkerIds() {
        if (this.excludedSatkerCache && Date.now() - this.excludedSatkerCache.at < KinerjaPerkaraService_1.SATKER_CACHE_TTL_MS) {
            return this.excludedSatkerCache.ids;
        }
        const rows = await this.ds.query('select id from bdb_satker where kinerja_aktif = false');
        const ids = rows.map((r) => Number(r.id));
        this.excludedSatkerCache = { ids, at: Date.now() };
        return ids;
    }
    computePopulationById(satkers) {
        const childrenOf = new Map();
        const byId = new Map();
        for (const s of satkers) {
            byId.set(s.id, s);
            if (s.parent_id != null) {
                const arr = childrenOf.get(s.parent_id) || [];
                arr.push(s.id);
                childrenOf.set(s.parent_id, arr);
            }
        }
        const memo = new Map();
        const sumFrom = (id) => {
            if (memo.has(id))
                return memo.get(id);
            const kids = childrenOf.get(id) || [];
            const childrenSum = kids.reduce((a, k) => a + sumFrom(k), 0);
            let result = childrenSum;
            if (childrenSum === 0) {
                const s = byId.get(id);
                if (s && s.tipe_satker !== 'FUNGSI') {
                    const v = s.jumlah_penduduk != null ? Number(s.jumlah_penduduk) : NaN;
                    result = Number.isFinite(v) ? v : 0;
                }
            }
            memo.set(id, result);
            return result;
        };
        for (const s of satkers)
            sumFrom(s.id);
        return memo;
    }
    sumLeafPopulation(satkers, startIds) {
        const memo = this.computePopulationById(satkers);
        const roots = startIds && startIds.length ? startIds : satkers.filter((s) => s.parent_id == null).map((s) => s.id);
        return roots.reduce((a, id) => a + (memo.get(id) ?? 0), 0);
    }
    formatCrimeClock(totalSeconds) {
        const rounded = Math.max(0, Math.round(totalSeconds));
        const hari = Math.floor(rounded / 86400);
        const sisaJam = rounded % 86400;
        const jam = Math.floor(sisaJam / 3600);
        const sisaMenit = sisaJam % 3600;
        const menit = Math.floor(sisaMenit / 60);
        const detik = sisaMenit % 60;
        const parts = [];
        if (hari)
            parts.push(`${hari} Hari`);
        if (jam)
            parts.push(`${jam} Jam`);
        if (menit)
            parts.push(`${menit} Menit`);
        if (detik || !parts.length)
            parts.push(`${detik} Detik`);
        return { hari, jam, menit, detik, label: `Selang ${parts.join(' ')}` };
    }
    async onModuleInit() {
        try {
            await this.ensureTable();
            if (!(0, cluster_instance_util_1.isPrimaryClusterInstance)())
                return;
            await this.refreshSnapshot();
        }
        catch (e) {
            this.logger.warn('refresh snapshot awal gagal: ' + (e?.message || e));
        }
    }
    async scheduledRefresh() {
        if (!(0, cluster_instance_util_1.isPrimaryClusterInstance)())
            return;
        try {
            await this.refreshSnapshot();
            this.logger.log('Snapshot kinerja perkara diperbarui (jadwal 30 menit).');
        }
        catch (e) {
            this.logger.error('refresh snapshot terjadwal gagal: ' + (e?.message || e));
        }
    }
    async ensureTable() {
        await this.ds.query(`
            create table if not exists bdb_kinerja_perkara_snapshot (
                lp_id bigint primary key,
                satker_id bigint,
                tanggal_mulai_penanganan date,
                tanggal_selesai date,
                tingkat_kesulitan text,
                kesulitan_belum_dipilih boolean not null default false,
                batas_hari integer not null default 30,
                tanggal_jatuh_tempo date,
                status_code text,
                jenis_kejahatan_id bigint,
                refreshed_at timestamptz not null default now()
            );
        `);
        await this.ds.query(`alter table bdb_kinerja_perkara_snapshot add column if not exists status_code text;`);
        await this.ds.query(`alter table bdb_kinerja_perkara_snapshot add column if not exists jenis_kejahatan_id bigint;`);
        await this.ds.query(`alter table bdb_kinerja_perkara_snapshot add column if not exists model_lp text;`);
        await this.ds.query(`alter table bdb_kinerja_perkara_snapshot add column if not exists is_rj boolean not null default false;`);
    }
    async refreshSnapshot() {
        await this.ensureTable();
        await this.ds.query('delete from bdb_kinerja_perkara_snapshot');
        await this.ds.query(`
            insert into bdb_kinerja_perkara_snapshot
                (lp_id, satker_id, tanggal_mulai_penanganan, tanggal_selesai, tingkat_kesulitan, kesulitan_belum_dipilih, batas_hari, tanggal_jatuh_tempo, status_code, jenis_kejahatan_id, model_lp, is_rj, refreshed_at)
            select
                lp.id,
                -- Pakai unit_satker_id (anak satker yg lebih spesifik, mis. SATRESKRIM di bawah
                -- POLRES) kalau sudah teridentifikasi remapDeeper() -- BUKAN cuma satker_id
                -- (Polres/Polda-nya saja). buildTree() di bawah roll-up angka dari satker_id snapshot
                -- ini ke SEMUA leluhurnya (while-loop jalan ke atas), jadi kalau satker_id yg dicatat
                -- di sini cuma level Polres, angka SELAMANYA nempel di baris Polres & tak pernah
                -- turun ke baris SATRESKRIM/SATNARKOBA dst di bawahnya (baris itu tetap 0 selamanya).
                -- Level Mabes tidak kena masalah ini krn mapMabesByUnit() sudah langsung isi
                -- satker_id ke anak yg tepat (unit_satker_id di situ selalu null).
                coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                coalesce(pel.received_at, ${DATE_EXPR}) as tanggal_mulai_penanganan,
                lp.tanggal_selesai,
                lp.tingkat_kesulitan,
                (lp.tingkat_kesulitan is null) as kesulitan_belum_dipilih,
                case lp.tingkat_kesulitan
                    when 'Mudah' then 30
                    when 'Sedang' then 60
                    when 'Sulit' then 90
                    when 'Sangat Sulit' then 120
                    else 30
                end as batas_hari,
                (coalesce(pel.received_at, ${DATE_EXPR}) + (
                    case lp.tingkat_kesulitan
                        when 'Mudah' then 30 when 'Sedang' then 60 when 'Sulit' then 90 when 'Sangat Sulit' then 120 else 30
                    end || ' days')::interval)::date as tanggal_jatuh_tempo,
                st.code as status_code,
                lp.jenis_kejahatan_id,
                lp.model_lp,
                coalesce(dok.alasan_penghentian ilike $1 or dok.alasan_penghentian ~* $2, false) as is_rj,
                now()
            from bdb_laporan_polisi lp
            left join bdb_status_master st on st.id = lp.status_id
            left join lateral (
                select p.created_at::date as received_at
                from bdb_lp_pelimpahan p where p.lp_id = lp.id order by p.created_at desc limit 1
            ) pel on true
            -- Dokumen "penutup" LP -- SP2_LIDIK/SP3 yg jenisnya cocok dgn status LP saat ini
            -- (kalau ada >1 versi/koreksi, ambil yg terbaru). alasan_penghentian dari form_schema
            -- dinamis bdb_document_type_master (field select "Alasan Dihentikan").
            left join lateral (
                select d.data->>'alasan_penghentian' as alasan_penghentian
                from bdb_dokumen d
                join bdb_document_type_master dt on dt.id = d.document_type_id
                where d.lp_id = lp.id and dt.code = st.code
                order by d.created_at desc
                limit 1
            ) dok on true
            where lp.deleted_at is null
        `, [ALASAN_RJ_LIKE, ALASAN_RJ_WORD_RE]);
        this.crimeGroupResolver.clearCache();
        return this.lastRefreshedAt();
    }
    async lastRefreshedAt() {
        await this.ensureTable();
        const r = await this.ds.query('select max(refreshed_at) as t from bdb_kinerja_perkara_snapshot');
        return r[0]?.t ? new Date(r[0].t).toISOString() : null;
    }
    normPeriod(from, to) {
        const now = new Date();
        const defaultFrom = `${now.getFullYear()}-01-01`;
        const defaultTo = now.toISOString().slice(0, 10);
        return { from: from || defaultFrom, to: to || defaultTo };
    }
    countExprs(mode, bucketMode = 'age') {
        const openActual = bucketMode === 'difficulty'
            ? 'tanggal_jatuh_tempo >= $2::date'
            : "tanggal_mulai_penanganan + interval '1 year' >= $2::date";
        const openBacklog = bucketMode === 'difficulty'
            ? 'tanggal_jatuh_tempo < $2::date'
            : "tanggal_mulai_penanganan + interval '1 year' < $2::date";
        const closedActual = bucketMode === 'difficulty'
            ? 'tanggal_selesai <= tanggal_jatuh_tempo'
            : "tanggal_selesai <= tanggal_mulai_penanganan + interval '1 year'";
        const closedBacklog = bucketMode === 'difficulty'
            ? 'tanggal_selesai > tanggal_jatuh_tempo'
            : "tanggal_selesai > tanggal_mulai_penanganan + interval '1 year'";
        if (mode === 'mulai') {
            return {
                ct: '(tanggal_mulai_penanganan between $1 and $2)',
                cp_berjalan: `(tanggal_mulai_penanganan between $1 and $2 and tanggal_selesai is null and ${openActual})`,
                cp_tunggakan: `(tanggal_mulai_penanganan between $1 and $2 and tanggal_selesai is null and ${openBacklog})`,
                cc_aktual: `(tanggal_mulai_penanganan between $1 and $2 and tanggal_selesai is not null and ${closedActual})`,
                cc_tunggakan: `(tanggal_mulai_penanganan between $1 and $2 and tanggal_selesai is not null and ${closedBacklog})`,
                belum_kesulitan: '(kesulitan_belum_dipilih and tanggal_mulai_penanganan between $1 and $2)'
            };
        }
        if (mode === 'selesai') {
            return {
                ct: '(tanggal_selesai between $1 and $2)',
                cp_berjalan: 'false',
                cp_tunggakan: 'false',
                cc_aktual: `(tanggal_selesai between $1 and $2 and ${closedActual})`,
                cc_tunggakan: `(tanggal_selesai between $1 and $2 and ${closedBacklog})`,
                belum_kesulitan: '(kesulitan_belum_dipilih and tanggal_selesai between $1 and $2)'
            };
        }
        return {
            ct: '(tanggal_mulai_penanganan between $1 and $2)',
            cp_berjalan: `(tanggal_mulai_penanganan between $1 and $2 and tanggal_selesai is null and ${openActual})`,
            cp_tunggakan: `(tanggal_mulai_penanganan between $1 and $2 and tanggal_selesai is null and ${openBacklog})`,
            cc_aktual: `(tanggal_selesai between $1 and $2 and ${closedActual} and (tanggal_mulai_penanganan between $1 and $2))`,
            cc_tunggakan: `(tanggal_selesai between $1 and $2 and (${closedBacklog} or (${closedActual} and (tanggal_mulai_penanganan between $1 and $2) is not true)))`,
            belum_kesulitan: '(kesulitan_belum_dipilih and tanggal_mulai_penanganan between $1 and $2)'
        };
    }
    async resolveJenisKejahatanIds(explicit, golonganIds, iccsKategoriIds) {
        if (!golonganIds?.length && !iccsKategoriIds?.length)
            return explicit;
        const conds = [];
        const params = [];
        if (golonganIds?.length) {
            const regularGolongan = golonganIds.filter((id) => id !== 5);
            const golonganConds = [];
            if (regularGolongan.length) {
                params.push(regularGolongan);
                golonganConds.push(`ck."golonganKejahatanId" = any($${params.length})`);
            }
            if (golonganIds.includes(5)) {
                golonganConds.push(`exists (
                    select 1 from bdb_kinerja_ppappo_crime_mapping pm
                    where pm.jenis_kejahatan_id=ck.id and pm.active=true
                )`);
            }
            conds.push(`(${golonganConds.join(' or ')})`);
        }
        if (iccsKategoriIds?.length) {
            params.push(iccsKategoriIds);
            conds.push(`"iccsKategoriId" = any($${params.length})`);
        }
        const rows = await this.ds.query(`select ck.id from cm_jenis_kejahatan ck where ${conds.join(' and ')}`, params);
        const resolved = rows.map((r) => Number(r.id));
        if (explicit?.length) {
            const set = new Set(resolved);
            const intersected = explicit.filter((id) => set.has(id));
            return intersected.length ? intersected : [-1];
        }
        return resolved.length ? resolved : [-1];
    }
    async buildTree(userId, fromIn, toIn, modeIn, jenisKejahatanIdsIn, golonganIds, iccsKategoriIds, visibility = 'scoped', taxonomy = DEFAULT_TAXONOMY_FILTER, modelFilter, closureReason, bucketMode = 'age', kelompokHitung = [], scopeSatkerId) {
        const { from, to } = this.normPeriod(fromIn, toIn);
        const mode = modeIn === 'mulai' || modeIn === 'selesai' ? modeIn : 'both';
        const scope = await (0, scope_util_1.resolveScope)(this.ds, userId);
        const satkers = await this.getSatkerTree();
        const nationalRead = visibility === 'national';
        let allowed = null;
        let scopeVisibleIds = null;
        let scopeRootId = null;
        const accountPlan = !scope.all && scope.satkerId
            ? (0, exports.buildKinerjaRegionalScopePlan)(satkers, scope.satkerId)
            : null;
        const regionalPlan = nationalRead
            ? null
            : scope.all
                ? scopeSatkerId
                    ? (0, exports.buildKinerjaRegionalScopePlan)(satkers, scopeSatkerId, scopeSatkerId)
                    : null
                : scope.satkerId
                    ? (0, exports.buildKinerjaRegionalScopePlan)(satkers, scope.satkerId, scopeSatkerId)
                    : null;
        const effectiveKelompokHitung = accountPlan?.functionGroup
            ? [accountPlan.functionGroup]
            : kelompokHitung.length
                ? kelompokHitung
                : [];
        const crime = await this.crimeGroupResolver.resolve(jenisKejahatanIdsIn, golonganIds, iccsKategoriIds, effectiveKelompokHitung);
        const jenisKejahatanIds = crime.baseIds;
        if (!nationalRead) {
            if ((!scope.all && !scope.satkerId) || (scope.all && !scopeSatkerId))
                return {
                    roots: [],
                    byKode: new Map(),
                    totals: this.emptyTotals(),
                    columns: [],
                    from,
                    to,
                    mode,
                    scoped: true,
                    jumlahPenduduk: 0,
                    anevTotals: { ct: 0, cc: 0, total: 0 },
                    applied_filters: crime.appliedFilters,
                    mapping_version: crime.mapping.version,
                    mapping_review_count: crime.mapping.reviewCount
                };
            if (!regionalPlan)
                return {
                    roots: [],
                    byKode: new Map(),
                    totals: this.emptyTotals(),
                    columns: [],
                    from,
                    to,
                    mode,
                    scoped: true,
                    jumlahPenduduk: 0,
                    anevTotals: { ct: 0, cc: 0, total: 0 },
                    applied_filters: crime.appliedFilters,
                    mapping_version: crime.mapping.version,
                    mapping_review_count: crime.mapping.reviewCount
                };
            allowed = regionalPlan.allowedIds;
            scopeVisibleIds = regionalPlan.visibleIds;
            scopeRootId = regionalPlan.rootId;
        }
        const groupPlan = (0, exports.buildKinerjaGroupPlan)(satkers, crime);
        const manuallyExcludedSatkerIds = await this.getExcludedSatkerIds();
        const taxonomyMatchedIds = new Set(satkers
            .filter((s) => s.function_domain_resolved === taxonomy.functionDomain &&
            s.organization_domain_resolved === taxonomy.organizationDomain)
            .map((s) => Number(s.id)));
        const includeStructuralOwnerFallback = taxonomy.functionDomain === 'INTERNAL_RESERSE' &&
            taxonomy.organizationDomain === 'INTERNAL_POLRI';
        const taxonomyAggregateIds = new Set(taxonomyMatchedIds);
        if (includeStructuralOwnerFallback) {
            for (const s of satkers) {
                if (s.function_domain_resolved === 'STRUCTURAL' &&
                    s.organization_domain_resolved === 'INTERNAL_POLRI') {
                    taxonomyAggregateIds.add(Number(s.id));
                }
            }
        }
        const taxonomyExcludedSatkerIds = satkers
            .map((s) => Number(s.id))
            .filter((id) => !taxonomyAggregateIds.has(id));
        const excludedSatkerIds = [
            ...new Set([...manuallyExcludedSatkerIds, ...taxonomyExcludedSatkerIds])
        ];
        const params = [from, to];
        let where = 'where satker_id is not null';
        if (allowed) {
            params.push(allowed);
            where += ` and satker_id = any($${params.length})`;
        }
        if (jenisKejahatanIds !== undefined) {
            params.push(jenisKejahatanIds);
            where += ` and jenis_kejahatan_id = any($${params.length})`;
        }
        if (modelFilter) {
            params.push(modelFilter);
            where += ` and model_lp = $${params.length}`;
        }
        if (excludedSatkerIds.length) {
            params.push(excludedSatkerIds);
            where += ` and satker_id <> all($${params.length})`;
        }
        where = (0, exports.appendKinerjaGroupWhere)(where, params, groupPlan);
        const ex = this.countExprs(mode, bucketMode);
        const belumUpdateStatus = "coalesce(status_code,'LP') not in ('PENYELIDIKAN','PENYIDIKAN','SPDP','TAHAP_I','P19','P21')";
        const belumUpdateAktual = `(tanggal_mulai_penanganan between $1 and $2 and tanggal_selesai is null and ${belumUpdateStatus})`;
        const belumUpdateTunggakan = `(tanggal_mulai_penanganan < $1 and tanggal_selesai is null and ${belumUpdateStatus})`;
        const cpBreakdownSql = CP_BREAKDOWN.map((b) => `count(*) filter (where ${ex.cp_berjalan} and status_code = '${b.code}')::int as cp_berjalan_${b.key},\n                count(*) filter (where ${ex.cp_tunggakan} and status_code = '${b.code}')::int as cp_tunggakan_${b.key}`).join(',\n                ');
        const closureBreakdownCondition = closureReason
            ? ` and is_rj = ${closureReason === 'RJ' ? 'true' : 'false'}`
            : '';
        const ccBreakdownSql = CC_BREAKDOWN.map((b) => {
            const closureCondition = b.key === 'sp2lid' || b.key === 'sp3'
                ? closureBreakdownCondition
                : '';
            return `count(*) filter (where ${ex.cc_aktual} and ${b.cond}${closureCondition})::int as cc_aktual_${b.key},\n                count(*) filter (where ${ex.cc_tunggakan} and ${b.cond}${closureCondition})::int as cc_tunggakan_${b.key}`;
        }).join(',\n                ');
        const counts = await this.ds.query(`select
                satker_id as sid,
                count(*) filter (where ${ex.ct})::int as ct,
                count(*) filter (where ${ex.cp_berjalan})::int as cp_berjalan,
                count(*) filter (where ${ex.cp_tunggakan})::int as cp_tunggakan,
                count(*) filter (where ${belumUpdateAktual})::int as belum_update_aktual,
                count(*) filter (where ${belumUpdateTunggakan})::int as belum_update_tunggakan,
                count(*) filter (where ${ex.cc_aktual})::int as cc_aktual,
                count(*) filter (where ${ex.cc_tunggakan})::int as cc_tunggakan,
                count(*) filter (where ${ex.belum_kesulitan})::int as belum_kesulitan,
                ${cpBreakdownSql},
                ${ccBreakdownSql}
             from bdb_kinerja_perkara_snapshot
             ${where}
             group by satker_id`, params);
        const statusParams = [];
        let statusWhere = 'where satker_id is not null';
        if (allowed) {
            statusParams.push(allowed);
            statusWhere += ` and satker_id = any($${statusParams.length})`;
        }
        if (jenisKejahatanIds !== undefined) {
            statusParams.push(jenisKejahatanIds);
            statusWhere += ` and jenis_kejahatan_id = any($${statusParams.length})`;
        }
        if (modelFilter) {
            statusParams.push(modelFilter);
            statusWhere += ` and model_lp = $${statusParams.length}`;
        }
        if (excludedSatkerIds.length) {
            statusParams.push(excludedSatkerIds);
            statusWhere += ` and satker_id <> all($${statusParams.length})`;
        }
        statusWhere = (0, exports.appendKinerjaGroupWhere)(statusWhere, statusParams, groupPlan);
        const statusCounts = await this.ds.query(`select satker_id as sid, coalesce(status_code,'TANPA_STATUS') as code, count(*)::int as jml
             from bdb_kinerja_perkara_snapshot ${statusWhere} group by satker_id, status_code`, statusParams);
        const node = new Map();
        const parentOf = new Map();
        for (const s of satkers) {
            node.set(s.id, {
                id: s.id,
                kode: s.kode,
                nama: s.deskripsi,
                parent_id: s.parent_id,
                depth: s.depth,
                urutan: s.urutan,
                ct: 0,
                cp_berjalan: 0,
                cp_tunggakan: 0,
                belum_update_aktual: 0,
                belum_update_tunggakan: 0,
                cc_aktual: 0,
                cc_tunggakan: 0,
                belum_kesulitan: 0,
                jumlah_penduduk: 0,
                status: {},
                cp_berjalan_rincian: {},
                cp_tunggakan_rincian: {},
                cc_aktual_rincian: {},
                cc_tunggakan_rincian: {}
            });
            parentOf.set(s.id, s.parent_id);
        }
        const popById = this.computePopulationById(satkers);
        for (const [id, n] of node)
            n.jumlah_penduduk = popById.get(id) ?? 0;
        for (const c of counts) {
            let cur = Number(c.sid);
            const guard = new Set();
            while (cur != null && node.has(cur) && !guard.has(cur)) {
                guard.add(cur);
                const n = node.get(cur);
                n.ct += c.ct;
                n.cp_berjalan += c.cp_berjalan;
                n.cp_tunggakan += c.cp_tunggakan;
                n.belum_update_aktual += c.belum_update_aktual;
                n.belum_update_tunggakan += c.belum_update_tunggakan;
                n.cc_aktual += c.cc_aktual;
                n.cc_tunggakan += c.cc_tunggakan;
                n.belum_kesulitan += c.belum_kesulitan;
                for (const b of CP_BREAKDOWN) {
                    n.cp_berjalan_rincian[b.key] = (n.cp_berjalan_rincian[b.key] || 0) + c[`cp_berjalan_${b.key}`];
                    n.cp_tunggakan_rincian[b.key] = (n.cp_tunggakan_rincian[b.key] || 0) + c[`cp_tunggakan_${b.key}`];
                }
                for (const b of CC_BREAKDOWN) {
                    n.cc_aktual_rincian[b.key] = (n.cc_aktual_rincian[b.key] || 0) + c[`cc_aktual_${b.key}`];
                    n.cc_tunggakan_rincian[b.key] = (n.cc_tunggakan_rincian[b.key] || 0) + c[`cc_tunggakan_${b.key}`];
                }
                cur = parentOf.get(cur) ?? null;
            }
        }
        for (const c of statusCounts) {
            let cur = Number(c.sid);
            const guard = new Set();
            while (cur != null && node.has(cur) && !guard.has(cur)) {
                guard.add(cur);
                const n = node.get(cur);
                n.status[c.code] = (n.status[c.code] || 0) + c.jml;
                cur = parentOf.get(cur) ?? null;
            }
        }
        const diffDays = Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1;
        const totalDetikPeriode = Math.max(0, diffDays) * 86400;
        const withMetrics = (n) => {
            const { cr, crLama } = (0, clearance_rate_util_1.clearanceMetrics)(n);
            const crimeRate = n.jumlah_penduduk > 0 ? (n.ct / n.jumlah_penduduk) * 100000 : null;
            const crimeClockDetik = n.ct > 0 ? totalDetikPeriode / n.ct : null;
            const cpBerjalanRinci = CP_BREAKDOWN.reduce((total, b) => total + (n.cp_berjalan_rincian[b.key] || 0), 0);
            const cpTunggakanRinci = CP_BREAKDOWN.reduce((total, b) => total + (n.cp_tunggakan_rincian[b.key] || 0), 0);
            const cpBerjalanBelumUpdate = n.belum_update_aktual;
            const cpTunggakanBelumUpdate = n.belum_update_tunggakan;
            const cpTotal = cpBerjalanRinci + cpTunggakanRinci;
            const denomPr = n.ct + cpTunggakanRinci;
            const pr = denomPr > 0 ? (cpTotal / denomPr) * 100 : 0;
            const denomPrLama = n.ct;
            const prLama = denomPrLama > 0 ? (cpTotal / denomPrLama) * 100 : 0;
            return {
                cr: (0, indeks_util_1.round2)(cr),
                cr_lama: (0, indeks_util_1.round2)(crLama),
                pr: (0, indeks_util_1.round2)(pr),
                pr_lama: (0, indeks_util_1.round2)(prLama),
                cp_berjalan: cpBerjalanRinci,
                cp_tunggakan: cpTunggakanRinci,
                cp_berjalan_belum_update: cpBerjalanBelumUpdate,
                cp_tunggakan_belum_update: cpTunggakanBelumUpdate,
                level: (0, indeks_util_1.levelOf)(Math.min(cr, 100)),
                indeks: (0, indeks_util_1.round2)((0, indeks_util_1.computeIndeks)(cr)),
                crime_rate: crimeRate != null ? Math.round(crimeRate) : null,
                crime_clock: crimeClockDetik != null ? this.formatCrimeClock(crimeClockDetik) : null,
                crime_clock_detik: crimeClockDetik
            };
        };
        const manuallyExcludedSet = new Set(manuallyExcludedSatkerIds.map((id) => String(id)));
        const tipeById = new Map();
        for (const s of satkers)
            tipeById.set(s.id, s.tipe_satker);
        const taxonomyVisibleSet = new Set(taxonomyMatchedIds);
        for (const matchedId of taxonomyMatchedIds) {
            let cur = parentOf.get(matchedId) ?? null;
            const guard = new Set();
            while (cur != null && !guard.has(cur)) {
                guard.add(cur);
                taxonomyVisibleSet.add(Number(cur));
                cur = parentOf.get(cur) ?? null;
            }
        }
        if (scopeVisibleIds) {
            for (const visibleId of scopeVisibleIds) {
                const visibleType = normalizedSatkerWords(tipeById.get(Number(visibleId)) || '');
                if (visibleType !== 'FUNGSI')
                    taxonomyVisibleSet.add(Number(visibleId));
            }
        }
        const underManualExclusionMemo = new Map();
        const isUnderManualExclusion = (id) => {
            if (underManualExclusionMemo.has(id))
                return underManualExclusionMemo.get(id);
            underManualExclusionMemo.set(id, false);
            const parentId = parentOf.get(id);
            const result = parentId != null &&
                (manuallyExcludedSet.has(String(parentId)) || isUnderManualExclusion(parentId));
            underManualExclusionMemo.set(id, result);
            return result;
        };
        const byId = new Map();
        for (const n of node.values()) {
            if (manuallyExcludedSet.has(String(n.id)))
                continue;
            if (isUnderManualExclusion(n.id))
                continue;
            if (scopeVisibleIds && !scopeVisibleIds.has(Number(n.id)))
                continue;
            if (!taxonomyVisibleSet.has(Number(n.id)))
                continue;
            byId.set(n.id, { ...n, ...withMetrics(n), nomor: '', children: [] });
        }
        const roots = [];
        for (const n of byId.values()) {
            if (n.parent_id == null || (scopeRootId != null && n.id === scopeRootId)) {
                roots.push(n);
                continue;
            }
            const parent = byId.get(n.parent_id);
            if (parent)
                parent.children.push(n);
        }
        const sortRec = (arr, parent = null) => {
            arr.sort((a, b) => satkerStructuralRank(parent, a, parent ? tipeById.get(parent.id) || '' : '', tipeById.get(a.id) || '') -
                satkerStructuralRank(parent, b, parent ? tipeById.get(parent.id) || '' : '', tipeById.get(b.id) || '') ||
                (a.urutan ?? Number.MAX_SAFE_INTEGER) - (b.urutan ?? Number.MAX_SAFE_INTEGER) ||
                String(a.kode).localeCompare(String(b.kode)) ||
                normalizedSatkerWords(a.nama).localeCompare(normalizedSatkerWords(b.nama)) ||
                a.id - b.id);
            arr.forEach((x) => sortRec(x.children, x));
        };
        sortRec(roots);
        const numberRec = (arr, prefix = '') => {
            arr.forEach((n, index) => {
                n.nomor = `${prefix}${index + 1}.`;
                numberRec(n.children, n.nomor);
            });
        };
        numberRec(roots);
        const byKode = new Map();
        const indexRec = (arr) => arr.forEach((n) => { byKode.set(n.kode, n); indexRec(n.children); });
        indexRec(roots);
        const mergeRincian = (a, b) => {
            const out = { ...a };
            for (const k of Object.keys(b))
                out[k] = (out[k] || 0) + b[k];
            return out;
        };
        const totals = roots.reduce((a, n) => ({
            ct: a.ct + n.ct,
            cp_berjalan: a.cp_berjalan + n.cp_berjalan,
            cp_tunggakan: a.cp_tunggakan + n.cp_tunggakan,
            cp_berjalan_belum_update: a.cp_berjalan_belum_update + n.cp_berjalan_belum_update,
            cp_tunggakan_belum_update: a.cp_tunggakan_belum_update + n.cp_tunggakan_belum_update,
            cc_aktual: a.cc_aktual + n.cc_aktual,
            cc_tunggakan: a.cc_tunggakan + n.cc_tunggakan,
            belum_kesulitan: a.belum_kesulitan + n.belum_kesulitan,
            cp_berjalan_rincian: mergeRincian(a.cp_berjalan_rincian, n.cp_berjalan_rincian),
            cp_tunggakan_rincian: mergeRincian(a.cp_tunggakan_rincian, n.cp_tunggakan_rincian),
            cc_aktual_rincian: mergeRincian(a.cc_aktual_rincian, n.cc_aktual_rincian),
            cc_tunggakan_rincian: mergeRincian(a.cc_tunggakan_rincian, n.cc_tunggakan_rincian)
        }), this.emptyTotals());
        const allStatuses = await this.ds.query("select code, nama, coalesce(kategori,'CT') as kategori, urutan from bdb_status_master order by urutan, id");
        const columns = allStatuses.map((s) => ({ code: s.code, nama: s.nama, kategori: s.kategori }));
        const jumlahPenduduk = roots.reduce((total, root) => total + (root.jumlah_penduduk || 0), 0);
        return {
            roots,
            byKode,
            totals,
            columns,
            from,
            to,
            mode,
            scoped: !nationalRead,
            jumlahPenduduk,
            taxonomy,
            modelFilter: modelFilter || null,
            closureReason: closureReason || null,
            bucketMode,
            applied_filters: crime.appliedFilters,
            mapping_version: crime.mapping.version,
            mapping_review_count: crime.mapping.reviewCount
        };
    }
    async exportRows(userId, from, to, mode, jenisKejahatanIds, golonganIds, iccsKategoriIds, visibility = 'scoped', taxonomy = DEFAULT_TAXONOMY_FILTER, modelFilter, closureReason, bucketMode = 'age', kelompokHitung = [], scopeSatkerId) {
        const { roots, columns, from: f, to: t, mode: m, applied_filters, mapping_version, mapping_review_count } = await this.buildTree(userId, from, to, mode, jenisKejahatanIds, golonganIds, iccsKategoriIds, visibility, taxonomy, modelFilter, closureReason, bucketMode, kelompokHitung, scopeSatkerId);
        const rows = [];
        const walk = (nodes, level) => {
            for (const n of nodes) {
                const row = { no: n.nomor, kode: n.kode, satker: `${'   '.repeat(level)}${n.nama}` };
                for (const c of columns)
                    row[c.code] = n.status[c.code] || 0;
                row.ct = n.ct;
                row.cp_berjalan = n.cp_berjalan;
                row.cp_tunggakan = n.cp_tunggakan;
                row.cp_berjalan_belum_update = n.cp_berjalan_belum_update;
                row.cp_tunggakan_belum_update = n.cp_tunggakan_belum_update;
                for (const b of CP_BREAKDOWN) {
                    row[`cp_berjalan_${b.key}`] = n.cp_berjalan_rincian[b.key] || 0;
                    row[`cp_tunggakan_${b.key}`] = n.cp_tunggakan_rincian[b.key] || 0;
                }
                row.cc_aktual = n.cc_aktual;
                row.cc_tunggakan = n.cc_tunggakan;
                for (const b of CC_BREAKDOWN) {
                    row[`cc_aktual_${b.key}`] = n.cc_aktual_rincian[b.key] || 0;
                    row[`cc_tunggakan_${b.key}`] = n.cc_tunggakan_rincian[b.key] || 0;
                }
                row.cr = n.cr;
                row.cr_lama = n.cr_lama;
                row.pr = n.pr;
                row.pr_lama = n.pr_lama;
                row.level = n.level;
                row.indeks = n.indeks;
                row.jumlah_penduduk = n.jumlah_penduduk || null;
                row.crime_rate = n.crime_rate;
                row.crime_clock = n.crime_clock?.label || '';
                rows.push(row);
                if (n.children.length)
                    walk(n.children, level + 1);
            }
        };
        walk(roots, 0);
        return {
            columns,
            rows,
            from: f,
            to: t,
            mode: m,
            taxonomy,
            modelFilter: modelFilter || null,
            closureReason: closureReason || null,
            bucketMode,
            applied_filters,
            mapping_version,
            mapping_review_count
        };
    }
    emptyTotals() {
        return {
            ct: 0,
            cp_berjalan: 0,
            cp_tunggakan: 0,
            cp_berjalan_belum_update: 0,
            cp_tunggakan_belum_update: 0,
            cc_aktual: 0,
            cc_tunggakan: 0,
            belum_kesulitan: 0,
            cp_berjalan_rincian: {},
            cp_tunggakan_rincian: {},
            cc_aktual_rincian: {},
            cc_tunggakan_rincian: {}
        };
    }
    lite(n) {
        const { children, ...rest } = n;
        return { ...rest, has_children: !!children.length };
    }
    paginateNodes(nodes, pageIn, limitIn) {
        const total = nodes.length;
        const paginated = pageIn != null || limitIn != null;
        if (!paginated) {
            return {
                nodes,
                pagination: {
                    page: 1,
                    limit: total,
                    total,
                    total_pages: total ? 1 : 0,
                    paginated: false
                }
            };
        }
        const limit = Math.max(1, Math.min(200, Math.trunc(Number(limitIn) || 25)));
        const totalPages = total ? Math.ceil(total / limit) : 0;
        const page = Math.max(1, Math.min(Math.trunc(Number(pageIn) || 1), totalPages || 1));
        const offset = (page - 1) * limit;
        return {
            nodes: nodes.slice(offset, offset + limit),
            pagination: { page, limit, total, total_pages: totalPages, paginated: true }
        };
    }
    async rekap(userId, from, to, parent, mode, jenisKejahatanIds, golonganIds, iccsKategoriIds, visibility = 'scoped', taxonomy = DEFAULT_TAXONOMY_FILTER, page, limit, modelFilter, closureReason, bucketMode = 'age', kelompokHitung = [], scopeSatkerId) {
        const { roots, byKode, totals, columns, scoped, applied_filters, mapping_version, mapping_review_count } = await this.buildTree(userId, from, to, mode, jenisKejahatanIds, golonganIds, iccsKategoriIds, visibility, taxonomy, modelFilter, closureReason, bucketMode, kelompokHitung, scopeSatkerId);
        if (parent) {
            const node = byKode.get(parent);
            const sliced = this.paginateNodes(node?.children || [], page, limit);
            return {
                status: 1,
                data: {
                    nodes: sliced.nodes.map((n) => this.lite(n)),
                    pagination: sliced.pagination,
                    taxonomy,
                    applied_filters,
                    mapping_version,
                    mapping_review_count
                }
            };
        }
        const sliced = this.paginateNodes(roots, page, limit);
        return {
            status: 1,
            data: {
                nodes: sliced.nodes.map((n) => this.lite(n)),
                totals,
                columns,
                scoped,
                pagination: sliced.pagination,
                taxonomy,
                applied_filters,
                mapping_version,
                mapping_review_count
            }
        };
    }
    async summary(userId, from, to, mode, jenisKejahatanIds, golonganIds, iccsKategoriIds, visibility = 'scoped', taxonomy = DEFAULT_TAXONOMY_FILTER, modelFilter, closureReason, bucketMode = 'age', kelompokHitung = [], scopeSatkerId) {
        const { totals, from: f, to: t, scoped, jumlahPenduduk, applied_filters, mapping_version, mapping_review_count } = await this.buildTree(userId, from, to, mode, jenisKejahatanIds, golonganIds, iccsKategoriIds, visibility, taxonomy, modelFilter, closureReason, bucketMode, kelompokHitung, scopeSatkerId);
        const { cr, crLama } = (0, clearance_rate_util_1.clearanceMetrics)(totals);
        const denomPr = totals.ct + totals.cp_tunggakan;
        const pr = denomPr > 0 ? ((totals.cp_berjalan + totals.cp_tunggakan) / denomPr) * 100 : 0;
        const cpTotal = totals.cp_berjalan + totals.cp_tunggakan;
        const denomPrLama = totals.ct;
        const prLama = denomPrLama > 0 ? (cpTotal / denomPrLama) * 100 : 0;
        const lastRefreshed = await this.lastRefreshedAt();
        const crimeRate = jumlahPenduduk > 0 ? (totals.ct / jumlahPenduduk) * 100000 : null;
        const diffDays = Math.round((new Date(t).getTime() - new Date(f).getTime()) / 86400000) + 1;
        const totalDetikPeriode = Math.max(0, diffDays) * 86400;
        const crimeClockDetik = totals.ct > 0 ? totalDetikPeriode / totals.ct : null;
        const crimeClock = crimeClockDetik != null ? this.formatCrimeClock(crimeClockDetik) : null;
        return {
            status: 1,
            data: {
                ...totals,
                cr: (0, indeks_util_1.round2)(cr),
                cr_raw: cr,
                cr_lama: (0, indeks_util_1.round2)(crLama),
                pr: (0, indeks_util_1.round2)(pr),
                pr_lama: (0, indeks_util_1.round2)(prLama),
                level: (0, indeks_util_1.levelOf)(Math.min(cr, 100)),
                indeks: (0, indeks_util_1.round2)((0, indeks_util_1.computeIndeks)(cr)),
                jumlah_penduduk: jumlahPenduduk > 0 ? jumlahPenduduk : null,
                crime_rate: crimeRate != null ? Math.round(crimeRate) : null,
                crime_rate_raw: crimeRate,
                crime_clock_detik: crimeClockDetik,
                crime_clock: crimeClock,
                periode_hari_inklusif: diffDays,
                from: f,
                to: t,
                scoped,
                taxonomy,
                model_filter: modelFilter || null,
                closure_reason: closureReason || null,
                bucket_mode: bucketMode,
                applied_filters,
                mapping_version,
                mapping_review_count,
                last_refreshed_at: lastRefreshed
            }
        };
    }
    async jenisKejahatanOptions() {
        const rows = await this.ds.query(`
            select distinct ck.id,
                   ck.keterangan,
                   ck."golonganKejahatanId" as golongan_id,
                   ck."iccsKategoriId" as iccs_kategori_id,
                   gm.kelompok,
                   exists (
                       select 1
                       from bdb_kinerja_ppappo_crime_mapping pm
                       where pm.jenis_kejahatan_id = ck.id
                         and pm.active = true
                   ) as is_ppappo
            from bdb_laporan_polisi lp
            join cm_jenis_kejahatan ck on ck.id = lp.jenis_kejahatan_id
            left join lateral (
                select m.kelompok
                from bdb_kinerja_crime_group_mapping_version v
                join bdb_kinerja_crime_group_mapping m on m.version_id = v.id
                where v.active = true
                  and v.status = 'APPROVED'
                  and v.approved_by is not null
                  and v.approved_at is not null
                  and m.jenis_kejahatan_id = ck.id
                  and m.active = true
                  and m.decision_status = 'APPROVED'
                  and m.approved_by is not null
                  and m.approved_at is not null
                order by v.approved_at desc, v.id desc
                limit 1
            ) gm on true
            where lp.deleted_at is null
            order by ck.keterangan
        `);
        return { status: 1, data: rows };
    }
};
exports.KinerjaPerkaraService = KinerjaPerkaraService;
__decorate([
    (0, schedule_1.Interval)(30 * 60 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KinerjaPerkaraService.prototype, "scheduledRefresh", null);
exports.KinerjaPerkaraService = KinerjaPerkaraService = KinerjaPerkaraService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        anev_service_1.AnevService])
], KinerjaPerkaraService);
//# sourceMappingURL=kinerja-perkara.service.js.map
