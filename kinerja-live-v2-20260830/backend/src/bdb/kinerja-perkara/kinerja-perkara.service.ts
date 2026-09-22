import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { resolveScope } from '../common/scope.util';
import { computeIndeks, levelOf, round2 } from './indeks.util';
import { AnevService } from '../anev/anev.service';
import { isPrimaryClusterInstance } from '../common/cluster-instance.util';

// tgl_laporan = teks 'DD-MM-YYYY HH:MM:SS'; fallback ke synced_at bila format tak sesuai.
// Sama persis dgn DATE_EXPR di anev.service.ts, supaya konsisten dgn laporan lain.
const DATE_EXPR = "(case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else lp.synced_at::date end)";

// Rincian status di dalam bucket CP (LP masih diproses) -- "Format Tabel Kinerja" resmi: tiap
// bucket (Aktual/Tunggakan) dipecah lagi per status penanganan saat ini.
const CP_BREAKDOWN: { key: string; code: string }[] = [
    { key: 'lidik', code: 'PENYELIDIKAN' },
    { key: 'sidik', code: 'PENYIDIKAN' },
    { key: 'spdp', code: 'SPDP' },
    { key: 'thp1', code: 'TAHAP_I' },
    { key: 'p19', code: 'P19' },
    { key: 'p21', code: 'P21' }
];
// Rincian status di dalam bucket CC (LP sudah selesai). RJ (Restorative Justice) BUKAN kolom
// tersendiri pada kontrak tabel canonical; ia menjadi filter alasan penghentian untuk SP2LID/SP3.
// Match via ILIKE substring, BUKAN persamaan persis -- form_schema-nya bisa diedit superadmin
// lewat menu Alur Dokumen (mis. ganti kata "Penyelesaian luar proses peradilan / " di depannya),
// jadi cocokkan kata intinya. DUA kondisi (OR): "restorat" (cakup ejaan Inggris "Restorative" &
// Indonesia "Restoratif") ATAU singkatan "RJ" berdiri sendiri sbg KATA UTUH (\y = word boundary
// di regex Postgres) -- bukan substring polos, krn "rj" polos nyangkut di banyak kata Indonesia
// biasa (keRJa, beRJalan, teRJadi, dst), jadi \yrj\y wajib supaya "RJ"/"(RJ)" match tapi
// "kerja"/"berjalan" TIDAK.
const ALASAN_RJ_LIKE = '%restorat%';
const ALASAN_RJ_WORD_RE = '\\yrj\\y';
const CC_BREAKDOWN: { key: string; cond: string }[] = [
    { key: 'sp2lid', cond: "status_code = 'SP2_LIDIK'" },
    { key: 'sp3', cond: "status_code = 'SP3'" },
    { key: 'tipiring', cond: "status_code = 'TIPIRING_PUTUSAN'" },
    { key: 'thp2', cond: "status_code = 'TAHAP_II'" }
];

type Node = {
    id: number;
    kode: string;
    nama: string;
    parent_id: number | null;
    depth: number;
    urutan: number | null;
    ct: number;
    cp_berjalan: number;
    cp_tunggakan: number;
    belum_update_aktual: number;
    belum_update_tunggakan: number;
    cc_aktual: number;
    cc_tunggakan: number;
    belum_kesulitan: number;
    jumlah_penduduk: number;
    status: Record<string, number>;
    cp_berjalan_rincian: Record<string, number>;
    cp_tunggakan_rincian: Record<string, number>;
    cc_aktual_rincian: Record<string, number>;
    cc_tunggakan_rincian: Record<string, number>;
};
type CrimeClockOut = { hari: number; jam: number; menit: number; detik: number; label: string };
type Metrics = {
    cr: number;
    cr_lama: number;
    pr: number;
    pr_lama: number;
    // Node menyimpan seluruh LP terbuka selama agregasi. Pada kontrak keluaran,
    // dua field CP ini dioverride menjadi jumlah status proses LIDIK s.d. P21.
    cp_berjalan: number;
    cp_tunggakan: number;
    cp_berjalan_belum_update: number;
    cp_tunggakan_belum_update: number;
    level: number;
    indeks: number;
    crime_rate: number | null;
    crime_clock: CrimeClockOut | null;
    crime_clock_detik: number | null;
};
type TreeNode = Node & Metrics & { nomor: string; children: TreeNode[] };
type LiteNode = Node & Metrics & { has_children: boolean };
export type KinerjaReadVisibility = 'scoped' | 'national';
export type KinerjaModelFilter = 'lp_model_a' | 'lp_model_b';
export type KinerjaClosureReasonFilter = 'RJ' | 'NON_RJ';
export type KinerjaBucketMode = 'age' | 'difficulty';
export type KinerjaCountingGroup = 'KRIMUM' | 'KRIMSUS' | 'NARKOBA' | 'REVIEW';
export type KinerjaFunctionDomain = 'INTERNAL_RESERSE' | 'EKSTERNAL_RESERSE' | 'STRUCTURAL' | 'NOT_APPLICABLE';
export type KinerjaOrganizationDomain = 'INTERNAL_POLRI' | 'EKSTERNAL_POLRI' | 'NOT_APPLICABLE';
export type KinerjaTaxonomyFilter = {
    functionDomain: KinerjaFunctionDomain;
    organizationDomain: KinerjaOrganizationDomain;
};

const DEFAULT_TAXONOMY_FILTER: KinerjaTaxonomyFilter = {
    functionDomain: 'INTERNAL_RESERSE',
    organizationDomain: 'INTERNAL_POLRI'
};

type KinerjaGroupMeta = { version: string; versionId: number | null; reviewCount: number };
type KinerjaGroupDimensions = {
    baseIds: number[] | undefined;
    officialGroupCrimeIds: number[];
    reviewCrimeIds: number[];
    officialGroups: Array<Exclude<KinerjaCountingGroup, 'REVIEW'>>;
    reviewSelected: boolean;
    appliedFilters: {
        jenisKejahatanIds: number[];
        golonganIds: number[];
        iccsKategoriIds: number[];
        kelompokHitung: KinerjaCountingGroup[];
    };
    mapping: KinerjaGroupMeta;
};
type KinerjaGroupPlan = {
    active: boolean;
    functionMatchedSatkerIds: number[];
    fallbackSatkerIds: number[];
    officialCrimeIds: number[];
    reviewCrimeIds: number[];
    reviewSelected: boolean;
};

const uniquePositive = (values?: number[]): number[] =>
    [...new Set((values || []).map(Number).filter((n) => Number.isInteger(n) && n > 0))];

const intersectCrimeSets = (sets: Array<number[] | undefined>): number[] | undefined => {
    const active = sets.filter((v): v is number[] => v !== undefined);
    if (!active.length) return undefined;
    if (active.some((v) => v.length === 0 || v.includes(-1))) return [-1];
    let result = uniquePositive(active[0]);
    for (let i = 1; i < active.length && result.length; i++) {
        const allowed = new Set(uniquePositive(active[i]));
        result = result.filter((id) => allowed.has(id));
    }
    return result.length ? result : [-1];
};

class KinerjaCrimeGroupResolver {
    private cache: { value: any; at: number } | null = null;
    constructor(private readonly ds: DataSource) {}
    clearCache(): void { this.cache = null; }

    private async state() {
        if (this.cache && Date.now() - this.cache.at < 60_000) return this.cache.value;
        const versions = await this.ds.query(`
            select id,version_code from bdb_kinerja_crime_group_mapping_version
            where active=true and status='APPROVED' and approved_by is not null and approved_at is not null
            order by approved_at desc,id desc limit 1
        `);
        const versionId = versions.length ? Number(versions[0].id) : null;
        const version = versions.length ? String(versions[0].version_code) : 'NONE_APPROVED';
        const usedRows = await this.ds.query(`select distinct jenis_kejahatan_id as id from bdb_kinerja_perkara_snapshot where jenis_kejahatan_id is not null`);
        const usedIds = uniquePositive(usedRows.map((r: any) => Number(r.id)));
        const approvedRows = versionId == null ? [] : await this.ds.query(`
            select jenis_kejahatan_id as id,kelompok from bdb_kinerja_crime_group_mapping
            where version_id=$1 and active=true and decision_status='APPROVED'
              and approved_by is not null and approved_at is not null
              and kelompok in ('KRIMUM','KRIMSUS','NARKOBA')
        `,[versionId]);
        const approvedByGroup = new Map<string,number[]>([['KRIMUM',[]],['KRIMSUS',[]],['NARKOBA',[]]]);
        const approvedAll = new Set<number>();
        for (const row of approvedRows) {
            const id=Number(row.id), group=String(row.kelompok);
            if (!approvedByGroup.has(group) || !Number.isInteger(id) || id<=0) continue;
            approvedByGroup.get(group)!.push(id); approvedAll.add(id);
        }
        const value={versionId,version,usedIds,approvedByGroup,approvedAll,reviewCount:usedIds.filter((id)=>!approvedAll.has(id)).length};
        this.cache={value,at:Date.now()}; return value;
    }

    async resolve(explicitIn?: number[], golonganIn?: number[], iccsIn?: number[], groupsIn: KinerjaCountingGroup[] = []): Promise<KinerjaGroupDimensions> {
        const explicit=uniquePositive(explicitIn), golongan=uniquePositive(golonganIn), iccs=uniquePositive(iccsIn);
        const groups=[...new Set(groupsIn)];
        let master: number[] | undefined;
        if (golongan.length || iccs.length) {
            const params:any[]=[], where:string[]=[];
            if(golongan.length){
                const regularGolongan=golongan.filter((id)=>id!==5);
                const golonganWhere:string[]=[];
                if(regularGolongan.length){params.push(regularGolongan);golonganWhere.push(`ck."golonganKejahatanId"=any($${params.length})`);}
                if(golongan.includes(5)){
                    golonganWhere.push(`exists (
                        select 1 from bdb_kinerja_ppappo_crime_mapping pm
                        where pm.jenis_kejahatan_id=ck.id and pm.active=true
                    )`);
                }
                where.push(`(${golonganWhere.join(' or ')})`);
            }
            if(iccs.length){params.push(iccs);where.push(`"iccsKategoriId"=any($${params.length})`);}
            const rows=await this.ds.query(`select ck.id from cm_jenis_kejahatan ck where ${where.join(' and ')}`,params);
            master=uniquePositive(rows.map((r:any)=>Number(r.id)));
        }
        const state=await this.state();
        const officialGroups=groups.filter((g): g is Exclude<KinerjaCountingGroup,'REVIEW'>=>g!=='REVIEW');
        const officialGroupCrimeIds=uniquePositive(officialGroups.flatMap((g)=>state.approvedByGroup.get(g)||[]));
        const reviewSelected=groups.includes('REVIEW');
        return {
            baseIds: intersectCrimeSets([explicitIn===undefined?undefined:explicit,master]),
            officialGroupCrimeIds,
            reviewCrimeIds: reviewSelected?state.usedIds.filter((id:number)=>!state.approvedAll.has(id)):[],
            officialGroups,reviewSelected,
            appliedFilters:{jenisKejahatanIds:explicit,golonganIds:golongan,iccsKategoriIds:iccs,kelompokHitung:groups},
            mapping:{version:state.version,versionId:state.versionId,reviewCount:state.reviewCount}
        };
    }
}

type KinerjaOfficialGroup = Exclude<KinerjaCountingGroup, 'REVIEW'>;

export const kinerjaDirectFunctionGroup = (nameIn: unknown): KinerjaOfficialGroup | null => {
    const compact = normalizedSatkerWords(nameIn).replace(/ /g, '');
    // Hanya DIT/SAT yang authoritative dari nama. UNIT RESKRIM POLSEK dan owner struktural
    // wajib memakai mapping jenis kejahatan agar tidak otomatis dianggap KRIMUM.
    if (!compact.startsWith('DIT') && !compact.startsWith('SAT')) return null;
    if (compact.includes('NARKOBA')) return 'NARKOBA';
    if (
        compact.includes('KRIMSUS') ||
        compact.includes('SIBER') ||
        compact.includes('TIPIDEKSUS') ||
        compact.includes('TIPIDTER') ||
        compact.includes('TIPIDKOR')
    ) return 'KRIMSUS';
    if (
        compact.includes('KRIMUM') ||
        compact.includes('TIPIDUM') ||
        compact.includes('PPAPPO') ||
        compact.includes('PPADANPPO') ||
        compact.includes('RESPPA') ||
        compact.includes('RESKRIM')
    ) return 'KRIMUM';
    return null;
};

export const buildKinerjaGroupPlan = (satkers: SatkerRow[], dimensions: KinerjaGroupDimensions): KinerjaGroupPlan => {
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
    const memo = new Map<number, KinerjaOfficialGroup | null>();
    const visiting = new Set<number>();
    const inheritedGroup = (id: number): KinerjaOfficialGroup | null => {
        if (memo.has(id)) return memo.get(id)!;
        if (visiting.has(id)) return null;
        visiting.add(id);
        const satker = byId.get(id);
        let group = satker ? kinerjaDirectFunctionGroup(satker.deskripsi) : null;
        if (!group && satker?.parent_id != null) group = inheritedGroup(Number(satker.parent_id));
        visiting.delete(id);
        memo.set(id, group);
        return group;
    };
    const selected = new Set<KinerjaOfficialGroup>(dimensions.officialGroups);
    const functionMatchedSatkerIds: number[] = [];
    const fallbackSatkerIds: number[] = [];
    for (const satker of satkers) {
        const id = Number(satker.id);
        const group = inheritedGroup(id);
        if (group == null) fallbackSatkerIds.push(id);
        else if (selected.has(group)) functionMatchedSatkerIds.push(id);
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

export const appendKinerjaGroupWhere = (where: string, params: any[], plan: KinerjaGroupPlan): string => {
    if (!plan.active) return where;
    const branches: string[] = [];
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

const normalizedSatkerWords = (value: unknown): string => String(value ?? '')
    .normalize('NFKD')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const satkerTokens = (value: unknown): string[] => {
    const words = normalizedSatkerWords(value);
    return words ? words.split(' ') : [];
};

const startsWithSatkerTokens = (value: unknown, expected: string[]): boolean => {
    const tokens = satkerTokens(value);
    return expected.every((token, index) => tokens[index] === token);
};

const hasSatkerToken = (value: unknown, token: string): boolean => satkerTokens(value).includes(token);
const compactSatkerName = (value: unknown): string => satkerTokens(value).join('');
const isPolresSatkerType = (value: unknown): boolean => ['POLRES', 'POLRESTA', 'POLRESTABES'].includes(normalizedSatkerWords(value));

// Urutan Polda pada laporan mengikuti urutan bisnis yang diberikan pemilik proses dalam
// workbook "urutan tampil satker dan pengelompokan untuk filter.xlsx". Urutan ini sengaja
// dipisahkan dari bdb_satker.urutan: master tetap authoritative untuk struktur parent-child,
// sedangkan laporan mempunyai kebutuhan presentasi tersendiri. Dua Polda Papua yang belum ada
// di workbook ditempatkan setelah Papua Tengah agar tetap deterministik ketika node-nya tersedia.
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
] as const;

const poldaBusinessRank = new Map<string, number>(
    POLDA_BUSINESS_ORDER.map((name, index) => [normalizedSatkerWords(name), index + 1])
);

const polriChildRank = (childName: string): number => {
    if (startsWithSatkerTokens(childName, ['BARESKRIM'])) return 10;
    if (startsWithSatkerTokens(childName, ['KORTAS'])) return 20;
    const poldaRank = poldaBusinessRank.get(normalizedSatkerWords(childName));
    if (poldaRank != null) return 100 + poldaRank;
    // Polda baru/tidak dikenal tetap sesudah daftar bisnis, bukan terselip karena id master.
    if (startsWithSatkerTokens(childName, ['POLDA'])) return 900;
    return 50;
};

const hasPpaPpoFunctionMarker = (value: unknown): boolean => {
    const tokens = satkerTokens(value);
    if (tokens.includes('PPAPPO')) return true;
    if (tokens.includes('PPA') && tokens.includes('PPO')) return true;
    const compact = tokens.join('');
    return [
        'DITTIPIDPPADANPPO', 'DITTIPIDPPAPPO', 'DITPPADANPPO', 'DITPPAPPO',
        'SATRESPPADANPPO', 'SATRESPPAPPO', 'SATPPADANPPO', 'SATPPAPPO'
    ].some((prefix) => compact.startsWith(prefix));
};

const hasSiberFunctionMarker = (value: unknown): boolean => {
    const tokens = satkerTokens(value);
    if (tokens.includes('SIBER') || tokens.includes('TIPIDSIBER')) return true;
    const compact = tokens.join('');
    return compact.startsWith('DITTIPIDSIBER') || compact.startsWith('DITRESSIBER');
};

const bareskrimChildRank = (childName: string): number => {
    const tokens = satkerTokens(childName);
    const compact = tokens.join('');
    if (tokens.includes('TIPIDUM') || compact.startsWith('DITTIPIDUM')) return 10;
    if (tokens.includes('TIPIDEKSUS') || compact.startsWith('DITTIPIDEKSUS')) return 20;
    if (tokens.includes('TIPIDNARKOBA') || compact.startsWith('DITTIPIDNARKOBA')) return 30;
    if (tokens.includes('TIPIDTER') || compact.startsWith('DITTIPIDTER')) return 40;
    if (tokens.includes('TIPIDSIBER') || compact.startsWith('DITTIPIDSIBER')) return 50;
    if (hasPpaPpoFunctionMarker(childName)) return 60;
    return 90;
};

const poldaChildRank = (parentName: string, childName: string, childType: string): number => {
    if (!isPolresSatkerType(childType)) {
        if (hasSatkerToken(childName, 'KRIMUM')) return 10;
        if (hasSatkerToken(childName, 'KRIMSUS')) return 20;
        if (hasSatkerToken(childName, 'NARKOBA') || hasSatkerToken(childName, 'TIPIDNARKOBA')) return 30;
        if (hasSiberFunctionMarker(childName)) return 40;
        if (hasPpaPpoFunctionMarker(childName)) return 50;
        return 55;
    }
    if (normalizedSatkerWords(parentName) === 'POLDA METRO JAYA' && startsWithSatkerTokens(childName, ['POLRES', 'METRO'])) return 60;
    if (startsWithSatkerTokens(childName, ['POLRESTABES'])) return 70;
    if (startsWithSatkerTokens(childName, ['POLRESTA'])) return 80;
    return 90;
};

const polresChildRank = (childName: string, childType: string): number => {
    if (normalizedSatkerWords(childType) === 'POLSEK') return startsWithSatkerTokens(childName, ['POLSEKTA']) ? 50 : 60;
    const compact = compactSatkerName(childName);
    if (compact.startsWith('SATRESKRIM') || startsWithSatkerTokens(childName, ['SAT', 'RESKRIM']) || startsWithSatkerTokens(childName, ['RESKRIM'])) return 10;
    if (compact.startsWith('SATRESNARKOBA') || compact.startsWith('SATNARKOBA') || startsWithSatkerTokens(childName, ['SAT', 'RES', 'NARKOBA'])) return 20;
    if (hasPpaPpoFunctionMarker(childName)) return 30;
    return 40;
};

const satkerStructuralRank = (parent: TreeNode | null, child: TreeNode, parentType: string, childType: string): number => {
    if (!parent) return 0;
    if (startsWithSatkerTokens(parent.nama, ['POLRI'])) return polriChildRank(child.nama);
    if (startsWithSatkerTokens(parent.nama, ['BARESKRIM'])) return bareskrimChildRank(child.nama);
    const normalizedParentType = normalizedSatkerWords(parentType);
    if (normalizedParentType === 'POLDA') return poldaChildRank(parent.nama, child.nama, childType);
    if (isPolresSatkerType(normalizedParentType)) return polresChildRank(child.nama, childType);
    if (normalizedParentType === 'POLSEK') {
        const compact = compactSatkerName(child.nama);
        return compact.startsWith('UNITRESKRIM') || startsWithSatkerTokens(child.nama, ['RESKRIM']) ? 10 : 20;
    }
    return 0;
};

type SatkerRow = {
    id: number;
    kode: string;
    deskripsi: string;
    parent_id: number | null;
    depth: number;
    jumlah_penduduk: string | null;
    tipe_satker: string;
    urutan: number | null;
    function_domain_resolved: KinerjaFunctionDomain;
    organization_domain_resolved: KinerjaOrganizationDomain;
    counting_eligible: boolean;
};

export type KinerjaRegionalScopePlan = {
    rootId: number;
    rootNama: string;
    functionGroup: KinerjaOfficialGroup | null;
    allowedIds: number[];
    visibleIds: Set<number>;
};

// Scope akun fungsi perlu mengenali juga variasi nama UNIT RESKRIM. Resolver kelompok hitung
// yang sudah ada sengaja lebih ketat (hanya DIT/SAT) karena ia mengatur klasifikasi perkara;
// fungsi ini hanya mengatur cabang organisasi mana yang boleh dimuat untuk akun regional.
export const kinerjaScopeFunctionGroup = (nameIn: unknown): KinerjaOfficialGroup | null => {
    const direct = kinerjaDirectFunctionGroup(nameIn);
    if (direct) return direct;
    const compact = compactSatkerName(nameIn);
    if (compact.includes('NARKOBA') || compact.includes('NARKOTIKA')) return 'NARKOBA';
    if (
        compact.includes('KRIMSUS') ||
        compact.includes('SIBER') ||
        compact.includes('TIPIDEKSUS') ||
        compact.includes('TIPIDTER') ||
        compact.includes('TIPIDKOR')
    ) return 'KRIMSUS';
    if (
        compact.includes('KRIMUM') ||
        compact.includes('RESKRIM') ||
        compact.includes('TIPIDUM') ||
        compact.includes('PIDUM') ||
        compact.includes('JATANRAS') ||
        compact.includes('PPAPPO') ||
        compact.includes('PPADANPPO')
    ) return 'KRIMUM';
    return null;
};

/**
 * Superadmin tetap memakai grup nasional. Akun regional dinaikkan ke Polda terdekat agar
 * struktur wilayah Polda -> Polres -> Polsek tetap utuh, tetapi node fungsi dibatasi ke
 * kelompok akun (mis. akun DIT KRIMUM tidak memuat KRIMSUS/NARKOBA).
 */
export const buildKinerjaRegionalScopePlan = (
    satkers: SatkerRow[],
    scopeSatkerId: number
): KinerjaRegionalScopePlan | null => {
    const byId = new Map(satkers.map((s) => [Number(s.id), s]));
    const scopeNode = byId.get(Number(scopeSatkerId));
    if (!scopeNode) return null;

    let root = scopeNode;
    let cursor: SatkerRow | undefined = scopeNode;
    const ancestorGuard = new Set<number>();
    while (cursor && !ancestorGuard.has(Number(cursor.id))) {
        const id = Number(cursor.id);
        ancestorGuard.add(id);
        root = cursor;
        if (normalizedSatkerWords(cursor.tipe_satker) === 'POLDA') break;
        cursor = cursor.parent_id == null ? undefined : byId.get(Number(cursor.parent_id));
    }

    const rootId = Number(root.id);
    const functionGroup = kinerjaScopeFunctionGroup(scopeNode.deskripsi);
    const isInRoot = (satker: SatkerRow): boolean => {
        let current: SatkerRow | undefined = satker;
        const guard = new Set<number>();
        while (current && !guard.has(Number(current.id))) {
            const id = Number(current.id);
            if (id === rootId) return true;
            guard.add(id);
            current = current.parent_id == null ? undefined : byId.get(Number(current.parent_id));
        }
        return false;
    };
    const inheritedFunctionGroup = (satker: SatkerRow): KinerjaOfficialGroup | null => {
        let current: SatkerRow | undefined = satker;
        const guard = new Set<number>();
        while (current && !guard.has(Number(current.id))) {
            const id = Number(current.id);
            guard.add(id);
            const group = kinerjaScopeFunctionGroup(current.deskripsi);
            if (group) return group;
            if (id === rootId) break;
            current = current.parent_id == null ? undefined : byId.get(Number(current.parent_id));
        }
        return null;
    };

    const allowedIds = satkers
        .filter(isInRoot)
        .filter((satker) => {
            if (!functionGroup) return true;
            if (normalizedSatkerWords(satker.tipe_satker) !== 'FUNGSI') return true;
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

const roundRate4 = (value: number): number => Math.round((value + Number.EPSILON) * 10000) / 10000;

@Injectable()
export class KinerjaPerkaraService implements OnModuleInit {
    private readonly logger = new Logger(KinerjaPerkaraService.name);

    // bdb_satker punya ~18.7k baris (seluruh Puskarda nasional) tapi strukturnya nyaris tak pernah
    // berubah -- tanpa cache ini, buildTree() query+transfer ulang seluruh tabel di SETIAP panggilan
    // (root rekap, summary, tiap klik expand baris, dashboard Ringkasan), padahal isinya sama terus.
    private satkerCache: { rows: SatkerRow[]; at: number } | null = null;
    private static readonly SATKER_CACHE_TTL_MS = 10 * 60 * 1000;
    private readonly crimeGroupResolver: KinerjaCrimeGroupResolver;

    constructor(
        private readonly ds: DataSource,
        private readonly anev: AnevService
    ) {
        this.crimeGroupResolver = new KinerjaCrimeGroupResolver(ds);
    }

    /** Dipanggil SatkerService tiap ada perubahan satker (tambah/ubah/hapus/toggle kinerja_aktif) --
     *  tanpa ini, exclude/tree bisa nyangkut versi lama sampai 10 menit (SATKER_CACHE_TTL_MS),
     *  bikin superadmin nge-toggle "Ikut rekap Kinerja Perkara" tapi hasilnya belum berubah. */
    clearCache() {
        this.satkerCache = null;
        this.excludedSatkerCache = null;
        this.crimeGroupResolver.clearCache();
    }

    private async getSatkerTree(): Promise<SatkerRow[]> {
        if (this.satkerCache && Date.now() - this.satkerCache.at < KinerjaPerkaraService.SATKER_CACHE_TTL_MS) {
            return this.satkerCache.rows;
        }
        // R11 adalah taxonomy production yang authoritative. Tree tetap mengambil atribut struktur
        // dari bdb_satker, sementara domain selalu berasal dari view R11 dan dibatasi ke sumber
        // BDB_SATKER agar id dari katalog eksternal tidak pernah tertukar dengan id tree internal.
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
        const rows: SatkerRow[] = rawRows.map((row: any) => ({
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

    // Satker yg superadmin kecualikan manual dari rekap Kinerja Perkara (bdb_satker.kinerja_aktif=false,
    // dikelola di menu Struktur Satker) -- LP-nya dikeluarkan sepenuhnya dari CT/CP/CC/status (bukan
    // cuma disembunyikan barisnya), spy tak ikut merusak angka rollup satker leluhurnya jg.
    private excludedSatkerCache: { ids: number[]; at: number } | null = null;
    private async getExcludedSatkerIds(): Promise<number[]> {
        if (this.excludedSatkerCache && Date.now() - this.excludedSatkerCache.at < KinerjaPerkaraService.SATKER_CACHE_TTL_MS) {
            return this.excludedSatkerCache.ids;
        }
        const rows = await this.ds.query('select id from bdb_satker where kinerja_aktif = false');
        const ids = rows.map((r: any) => Number(r.id));
        this.excludedSatkerCache = { ids, at: Date.now() };
        return ids;
    }

    /**
     * Jumlah penduduk utk Crime Rate. Kunci: Polsek adalah satuan penduduk asli (1 kecamatan =
     * 1 Polsek), Polres = jumlah Polsek-nya, Polda = jumlah Polres-nya, Mabes/nasional = jumlah
     * semua Polda. bdb_satker.tipe_satker (POLDA/POLRES/POLSEK vs FUNGSI utk satuan organisasi
     * spt SAT RESKRIM/BAG OPS -- lihat sql/bdb/068) sudah membedakan mana yg wilayah geografis
     * sungguhan. Algoritma per node: PAKAI JUMLAH ANAK kalau ada breakdown di bawahnya (paling
     * akurat, dan otomatis MENGABAIKAN nilai sendiri kalau ternyata kebetulan JUGA terisi --
     * self-correcting thd dobel-isi Polda+Polres yg sama), fallback ke nilai sendiri HANYA kalau
     * node ini WILAYAH (POLDA/POLRES/POLSEK) dan tak py breakdown anak sama sekali (mis. Polres yg
     * blm dipecah per-Polsek di tree). Satker FUNGSI tak pernah jadi sumber angka penduduk sendiri
     * (nilainya, kalau kebetulan ada, selalu diabaikan) tapi tetap diteruskan breakdown anaknya
     * (kalau strukturnya tak lazim, unit fungsi punya anak wilayah).
     * startIds null = nasional (dari root), terisi = subtree satker tsb saja (sesuai scope operator).
     */
    /** Hitung jumlah_penduduk yg BENAR utk SEMUA id satker sekaligus (bottom-up, child-priority,
     *  self-correcting) -- dipakai baik utk total nasional/scope (sumLeafPopulation) maupun utk
     *  ngisi kolom Jumlah Penduduk per baris di grid (lihat pemanggil di rekap()/exportRows()).
     *  Satu sumber kebenaran spy tak ada 2 algoritma beda yg gampang divergen kaya sebelumnya. */
    private computePopulationById(satkers: SatkerRow[]): Map<number, number> {
        const childrenOf = new Map<number, number[]>();
        const byId = new Map<number, SatkerRow>();
        for (const s of satkers) {
            byId.set(s.id, s);
            if (s.parent_id != null) {
                const arr = childrenOf.get(s.parent_id) || [];
                arr.push(s.id);
                childrenOf.set(s.parent_id, arr);
            }
        }
        const memo = new Map<number, number>();
        const sumFrom = (id: number): number => {
            if (memo.has(id)) return memo.get(id)!;
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
        for (const s of satkers) sumFrom(s.id);
        return memo;
    }

    private sumLeafPopulation(satkers: SatkerRow[], startIds: number[] | null): number {
        const memo = this.computePopulationById(satkers);
        const roots = startIds && startIds.length ? startIds : satkers.filter((s) => s.parent_id == null).map((s) => s.id);
        return roots.reduce((a, id) => a + (memo.get(id) ?? 0), 0);
    }

    /** Bagian bernilai 0 boleh disembunyikan; detik dibulatkan di tahap akhir (bukan tiap konversi). */
    private formatCrimeClock(totalSeconds: number): { hari: number; jam: number; menit: number; detik: number; label: string } {
        const rounded = Math.max(0, Math.round(totalSeconds));
        const hari = Math.floor(rounded / 86400);
        const sisaJam = rounded % 86400;
        const jam = Math.floor(sisaJam / 3600);
        const sisaMenit = sisaJam % 3600;
        const menit = Math.floor(sisaMenit / 60);
        const detik = sisaMenit % 60;
        const parts: string[] = [];
        if (hari) parts.push(`${hari} Hari`);
        if (jam) parts.push(`${jam} Jam`);
        if (menit) parts.push(`${menit} Menit`);
        if (detik || !parts.length) parts.push(`${detik} Detik`);
        return { hari, jam, menit, detik, label: `Selang ${parts.join(' ')}` };
    }

    /** Cuma proses primer (lihat isPrimaryClusterInstance()) -- 32 proses PM2 cluster refresh
     *  snapshot bersamaan saat boot bikin "duplicate key" ke bdb_kinerja_perkara_snapshot
     *  (insiden 5 Agu 2026). ensureTable() tetap jalan di semua proses (CREATE TABLE IF NOT
     *  EXISTS, murah & aman diulang). */
    async onModuleInit() {
        try {
            await this.ensureTable();
            if (!isPrimaryClusterInstance()) return;
            await this.refreshSnapshot();
        } catch (e: any) {
            this.logger.warn('refresh snapshot awal gagal: ' + (e?.message || e));
        }
    }

    /** Refresh otomatis tiap 30 menit -- pisah dari tabel transaksional bdb_laporan_polisi. Cuma
     *  proses primer, sama alasan spt onModuleInit() di atas. */
    @Interval(30 * 60 * 1000)
    async scheduledRefresh() {
        if (!isPrimaryClusterInstance()) return;
        try {
            await this.refreshSnapshot();
            this.logger.log('Snapshot kinerja perkara diperbarui (jadwal 30 menit).');
        } catch (e: any) {
            this.logger.error('refresh snapshot terjadwal gagal: ' + (e?.message || e));
        }
    }

    private async ensureTable() {
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
        // is_rj: apakah dokumen penutup LP ini (SP2_LIDIK/SP3, sesuai status_code saat ini) diisi
        // "Alasan Dihentikan" mengandung Restorative/Restoratif Justice atau singkatan RJ -- lihat
        // ALASAN_RJ_LIKE/ALASAN_RJ_WORD_RE & CC_BREAKDOWN.
        await this.ds.query(`alter table bdb_kinerja_perkara_snapshot add column if not exists is_rj boolean not null default false;`);
    }

    /** Full rebuild snapshot dari bdb_laporan_polisi (dipanggil scheduler/init/tombol refresh manual). */
    async refreshSnapshot() {
        await this.ensureTable();
        await this.ds.query('delete from bdb_kinerja_perkara_snapshot');
        await this.ds.query(
            `
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
        `,
            [ALASAN_RJ_LIKE, ALASAN_RJ_WORD_RE]
        );
        this.crimeGroupResolver.clearCache();
        return this.lastRefreshedAt();
    }

    async lastRefreshedAt(): Promise<string | null> {
        await this.ensureTable();
        const r = await this.ds.query('select max(refreshed_at) as t from bdb_kinerja_perkara_snapshot');
        return r[0]?.t ? new Date(r[0].t).toISOString() : null;
    }

    private normPeriod(from?: string, to?: string) {
        const now = new Date();
        // Kontrak mockup: saat filter belum dipilih, tampilkan tahun berjalan (aktual), bukan
        // hanya bulan berjalan. Gunakan komponen lokal agar pergantian tahun tidak bergeser UTC.
        const defaultFrom = `${now.getFullYear()}-01-01`;
        const defaultTo = now.toISOString().slice(0, 10);
        return { from: from || defaultFrom, to: to || defaultTo };
    }

    /**
     * Ekspresi FILTER per mode acuan tanggal periode:
     * - 'both'   (default, sesuai ketentuan resmi): CT dan CP berasal dari kohort
     *            tanggal_mulai_penanganan di dalam periode, sedangkan CC berasal dari
     *            tanggal_selesai di dalam periode. Semua kartu dalam kelompok CT/CP/Belum Update
     *            memakai populasi periode yang sama sehingga subtotal tidak dapat melampaui CT.
     * - 'mulai'  (kohort tanggal LP/mulai penanganan): populasi = LP yg tanggal_mulai_penanganan jatuh di periode,
     *            lalu dipilah CP (masih terbuka) vs CC Aktual/Tunggakan (sudah selesai) dari kohort itu.
     * - 'selesai'(kohort tanggal selesai/CC): populasi = LP yg tanggal_selesai jatuh di periode (otomatis semua closed,
     *            CP selalu 0), CT = total kohort itu, dipilah CC Aktual/Tunggakan.
     */
    private countExprs(mode: 'mulai' | 'selesai' | 'both', bucketMode: KinerjaBucketMode = 'age') {
        // Default canonical: Tunggakan berarti usia penanganan LEWAT satu tahun. Batas hari
        // berbasis tingkat kesulitan tetap tersedia hanya saat Mode Kinerja=difficulty.
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
            cc_aktual: `(tanggal_selesai between $1 and $2 and ${closedActual})`,
            cc_tunggakan: `(tanggal_selesai between $1 and $2 and ${closedBacklog})`,
            belum_kesulitan: '(kesulitan_belum_dipilih and tanggal_mulai_penanganan between $1 and $2)'
        };
    }

    /** Golongan/ICCS adalah atribut cm_jenis_kejahatan, bukan kolom snapshot -- resolve dulu jadi
     *  daftar jenis_kejahatan_id, gabung (intersect) dgn filter jenis_kejahatan_id eksplisit kalau
     *  dua2nya diisi (mis. "Golongan Konvensional" AND "jenis kejahatan spesifik X"). Kalau golongan
     *  & ICCS dua2nya diisi, digabung AND (harus cocok golongan ITU DAN kategori ICCS itu). */
    private async resolveJenisKejahatanIds(explicit?: number[], golonganIds?: number[], iccsKategoriIds?: number[]): Promise<number[] | undefined> {
        if (!golonganIds?.length && !iccsKategoriIds?.length) return explicit;
        const conds: string[] = [];
        const params: any[] = [];
        if (golonganIds?.length) {
            const regularGolongan = golonganIds.filter((id) => id !== 5);
            const golonganConds: string[] = [];
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
        const resolved = rows.map((r: any) => Number(r.id));
        // -1 = sentinel "sengaja tak ada yg cocok" -- beda dari array kosong yg di WHERE clause
        // (`if (ids?.length)`) berarti "filter tak aktif, tampilkan semua". Kalau golongan/ICCS
        // dipilih tapi hasil resolusinya nihil, harus tampil KOSONG, bukan tampil SEMUA data.
        if (explicit?.length) {
            const set = new Set(resolved);
            const intersected = explicit.filter((id) => set.has(id));
            return intersected.length ? intersected : [-1];
        }
        return resolved.length ? resolved : [-1];
    }

    /** Bangun pohon satker berisi hitungan CT/CP/CC ter-rollup, di-scope per role. */
    private async buildTree(
        userId: number | undefined,
        fromIn?: string,
        toIn?: string,
        modeIn?: string,
        jenisKejahatanIdsIn?: number[],
        golonganIds?: number[],
        iccsKategoriIds?: number[],
        visibility: KinerjaReadVisibility = 'scoped',
        taxonomy: KinerjaTaxonomyFilter = DEFAULT_TAXONOMY_FILTER,
        modelFilter?: KinerjaModelFilter,
        closureReason?: KinerjaClosureReasonFilter,
        bucketMode: KinerjaBucketMode = 'age',
        kelompokHitung: KinerjaCountingGroup[] = []
    ) {
        const { from, to } = this.normPeriod(fromIn, toIn);
        const mode: 'mulai' | 'selesai' | 'both' = modeIn === 'mulai' || modeIn === 'selesai' ? modeIn : 'both';
        const crime = await this.crimeGroupResolver.resolve(
            jenisKejahatanIdsIn,
            golonganIds,
            iccsKategoriIds,
            kelompokHitung
        );
        const jenisKejahatanIds = crime.baseIds;
        const scope = await resolveScope(this.ds, userId);
        const satkers = await this.getSatkerTree();
        // Defense in depth: parameter `visibility=national` hanya berlaku bagi akun all-access.
        // Akun regional tidak boleh memperlebar scope hanya dengan mengubah query string.
        const nationalRead = visibility === 'national' && scope.all;
        let allowed: number[] | null = null;
        let scopeVisibleIds: Set<number> | null = null;
        let scopeRootId: number | null = null;
        if (!nationalRead && !scope.all) {
            if (!scope.satkerId) return {
                roots: [] as TreeNode[],
                byKode: new Map<string, TreeNode>(),
                totals: this.emptyTotals(),
                columns: [] as { code: string; nama: string; kategori: string }[],
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
            const regionalPlan = buildKinerjaRegionalScopePlan(satkers, scope.satkerId);
            if (!regionalPlan) return {
                roots: [] as TreeNode[],
                byKode: new Map<string, TreeNode>(),
                totals: this.emptyTotals(),
                columns: [] as { code: string; nama: string; kategori: string }[],
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

        const groupPlan = buildKinerjaGroupPlan(satkers, crime);
        const manuallyExcludedSatkerIds = await this.getExcludedSatkerIds();
        const taxonomyMatchedIds = new Set(
            satkers
                .filter(
                    (s) =>
                        s.function_domain_resolved === taxonomy.functionDomain &&
                        s.organization_domain_resolved === taxonomy.organizationDomain
                )
                .map((s) => Number(s.id))
        );
        // LP lama masih banyak dimiliki langsung oleh POLRES/POLSEK yang sekarang sah ber-domain
        // STRUCTURAL. Untuk filter default INTERNAL_RESERSE, owner structural internal adalah
        // fallback agregasi (bukan cabang tampilan): hitung CT/CP/CC/status-nya, lalu roll up lewat
        // parent asli. Filter EKSTERNAL_RESERSE dan filter eksplisit lain tetap exact-domain.
        const includeStructuralOwnerFallback =
            taxonomy.functionDomain === 'INTERNAL_RESERSE' &&
            taxonomy.organizationDomain === 'INTERNAL_POLRI';
        const taxonomyAggregateIds = new Set<number>(taxonomyMatchedIds);
        if (includeStructuralOwnerFallback) {
            for (const s of satkers) {
                if (
                    s.function_domain_resolved === 'STRUCTURAL' &&
                    s.organization_domain_resolved === 'INTERNAL_POLRI'
                ) {
                    taxonomyAggregateIds.add(Number(s.id));
                }
            }
        }
        // Agregasi memakai aggregate set di atas. Display set tetap exact match + ancestor, sehingga
        // cabang structural yang sama sekali tidak punya fungsi Reserse cocok tidak ikut terekspos.
        const taxonomyExcludedSatkerIds = satkers
            .map((s) => Number(s.id))
            .filter((id) => !taxonomyAggregateIds.has(id));
        const excludedSatkerIds = [
            ...new Set([...manuallyExcludedSatkerIds, ...taxonomyExcludedSatkerIds])
        ];
        const params: any[] = [from, to];
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
        where = appendKinerjaGroupWhere(where, params, groupPlan);
        const ex = this.countExprs(mode, bucketMode);
        // BELUM UPDATE adalah bucket mandiri, bukan selisih CP. Aktual hanya LP tanpa status
        // proses yang mulai pada periode terpilih. Tunggakan tetap membawa LP tanpa status
        // proses dari sebelum awal periode selama belum selesai; karena itu nilainya tidak boleh
        // ikut menjadi nol hanya karena tanggal LP berada di luar filter saat ini.
        const belumUpdateStatus = "coalesce(status_code,'LP') not in ('PENYELIDIKAN','PENYIDIKAN','SPDP','TAHAP_I','P19','P21')";
        const belumUpdateAktual = `(tanggal_mulai_penanganan between $1 and $2 and tanggal_selesai is null and ${belumUpdateStatus})`;
        const belumUpdateTunggakan = `(tanggal_mulai_penanganan < $1 and tanggal_selesai is null and ${belumUpdateStatus})`;
        // Rincian per status DI DALAM tiap bucket CP/CC (mis. dari LP yg cp_tunggakan, berapa yg
        // masih LIDIK vs SIDIK dst) -- beda dari statusCounts di bawah yg snapshot status TANPA
        // filter periode/bucket. "Format Tabel Kinerja" resmi butuh keduanya dipisah per bucket.
        const cpBreakdownSql = CP_BREAKDOWN.map((b) => `count(*) filter (where ${ex.cp_berjalan} and status_code = '${b.code}')::int as cp_berjalan_${b.key},\n                count(*) filter (where ${ex.cp_tunggakan} and status_code = '${b.code}')::int as cp_tunggakan_${b.key}`).join(',\n                ');
        // RJ adalah sub-rincian penyelesaian alternatif di dalam SP2LID/SP3, bukan filter
        // populasi perkara. Karena itu CT/Belum Update/CP/CC total/PR/CR/indeks tetap memakai
        // populasi yang sama; hanya angka rincian SP2LID dan SP3 yang disaring.
        const closureBreakdownCondition = closureReason
            ? ` and is_rj = ${closureReason === 'RJ' ? 'true' : 'false'}`
            : '';
        const ccBreakdownSql = CC_BREAKDOWN.map((b) => {
            const closureCondition = b.key === 'sp2lid' || b.key === 'sp3'
                ? closureBreakdownCondition
                : '';
            return `count(*) filter (where ${ex.cc_aktual} and ${b.cond}${closureCondition})::int as cc_aktual_${b.key},\n                count(*) filter (where ${ex.cc_tunggakan} and ${b.cond}${closureCondition})::int as cc_tunggakan_${b.key}`;
        }).join(',\n                ');
        const counts = await this.ds.query(
            `select
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
             group by satker_id`,
            params
        );

        // breakdown status SAAT INI (LIDIK s/d SP3/Tahap II dst) -- snapshot posisi caseload,
        // tidak difilter periode (beda konsep dari CT/CP/CC yg berbasis tanggal).
        const statusParams: any[] = [];
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
        statusWhere = appendKinerjaGroupWhere(statusWhere, statusParams, groupPlan);
        const statusCounts = await this.ds.query(
            `select satker_id as sid, coalesce(status_code,'TANPA_STATUS') as code, count(*)::int as jml
             from bdb_kinerja_perkara_snapshot ${statusWhere} group by satker_id, status_code`,
            statusParams
        );

        const node = new Map<number, Node>();
        const parentOf = new Map<number, number | null>();
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

        // Jumlah_penduduk per node -- PAKAI computePopulationById() (bottom-up child-priority,
        // sama persis dgn sumLeafPopulation() utk kartu ringkasan). Sebelumnya di sini jalan
        // algoritma beda ("tiap satker yg py nilai sendiri, tambahkan ke SEMUA leluhurnya") yg
        // dobel-hitung parah begitu POLDA+POLRES+POLSEK di satu cabang SAMA-SAMA terisi (kasus
        // normal setelah sinkron populasi dari DORS, lihat SatkerService.syncPopulasiWilayahDariDors) --
        // populasi Polsek ketambah ke Polres, LALU populasi Polres (yg overlap dgn Polsek-nya)
        // ketambah lagi ke Polda, dst -- MABES bisa tampil 600 juta+ (2-3x lipat penduduk RI asli).
        const popById = this.computePopulationById(satkers);
        for (const [id, n] of node) n.jumlah_penduduk = popById.get(id) ?? 0;

        for (const c of counts) {
            // PostgreSQL bigint dikembalikan driver sebagai string; tree memakai key number.
            // Normalisasi sebelum roll-up agar hitungan benar-benar menempel ke satker.
            let cur: number | null | undefined = Number(c.sid);
            const guard = new Set<number>();
            while (cur != null && node.has(cur) && !guard.has(cur)) {
                guard.add(cur);
                const n = node.get(cur)!;
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
            let cur: number | null | undefined = Number(c.sid);
            const guard = new Set<number>();
            while (cur != null && node.has(cur) && !guard.has(cur)) {
                guard.add(cur);
                const n = node.get(cur)!;
                n.status[c.code] = (n.status[c.code] || 0) + c.jml;
                cur = parentOf.get(cur) ?? null;
            }
        }

        // Sama dgn dipakai summary() -- periode dihitung inklusif kedua tanggal, dipakai bareng utk semua node.
        const diffDays = Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1;
        const totalDetikPeriode = Math.max(0, diffDays) * 86400;

        const withMetrics = (n: Node): Metrics => {
            // CR baru (resmi, dipakai jg utk Level/Indeks): (CC Aktual+CC Tunggakan) / (CT+CC Tunggakan).
            const denom = n.ct + n.cc_tunggakan;
            const cr = denom > 0 ? ((n.cc_aktual + n.cc_tunggakan) / denom) * 100 : 0;
            // Kontrak mockup CR lama: total CC / CT. Gunakan agregat snapshot yang sama agar
            // Model LP, alasan penghentian, taxonomy, scope, periode, tabel, summary dan export
            // tidak pernah menghitung populasi yang berbeda.
            const crLama = n.ct > 0 ? ((n.cc_aktual + n.cc_tunggakan) / n.ct) * 100 : 0;
            const crimeRate = n.jumlah_penduduk > 0 ? (n.ct / n.jumlah_penduduk) * 100000 : null;
            const crimeClockDetik = n.ct > 0 ? totalDetikPeriode / n.ct : null;
            const cpBerjalanRinci = CP_BREAKDOWN.reduce((total, b) => total + (n.cp_berjalan_rincian[b.key] || 0), 0);
            const cpTunggakanRinci = CP_BREAKDOWN.reduce((total, b) => total + (n.cp_tunggakan_rincian[b.key] || 0), 0);
            // BELUM UPDATE dihitung langsung dari kohortnya sendiri. Jangan turunkan lagi dari
            // selisih CP, sebab CP tunduk pada bucket usia/kesulitan sedangkan tunggakan Belum
            // Update wajib tetap mencakup LP lama sebelum awal periode yang belum selesai.
            const cpBerjalanBelumUpdate = n.belum_update_aktual;
            const cpTunggakanBelumUpdate = n.belum_update_tunggakan;
            const denomPr = n.ct + cpTunggakanRinci;
            const pr = denomPr > 0 ? ((cpBerjalanRinci + cpTunggakanRinci) / denomPr) * 100 : 0;
            const prLama = n.ct > 0 ? ((cpBerjalanRinci + cpTunggakanRinci) / n.ct) * 100 : 0;
            return {
                cr: roundRate4(cr),
                cr_lama: roundRate4(crLama),
                pr: roundRate4(pr),
                pr_lama: roundRate4(prLama),
                cp_berjalan: cpBerjalanRinci,
                cp_tunggakan: cpTunggakanRinci,
                cp_berjalan_belum_update: cpBerjalanBelumUpdate,
                cp_tunggakan_belum_update: cpTunggakanBelumUpdate,
                level: levelOf(Math.min(cr, 100)),
                indeks: round2(computeIndeks(cr)),
                crime_rate: crimeRate != null ? Math.round(crimeRate) : null,
                crime_clock: crimeClockDetik != null ? this.formatCrimeClock(crimeClockDetik) : null,
                crime_clock_detik: crimeClockDetik
            };
        };

        // Satker dikecualikan ("Ikut rekap Kinerja Perkara" nonaktif) HARUS hilang sepenuhnya sbg
        // baris laporan, bukan cuma nol angkanya -- sblm ini cuma counts LP-nya yg difilter (WHERE
        // satker_id <> all(excluded)), satkernya sendiri tetap muncul di tree dgn baris 0 semua,
        // bikin bingung ("sudah dikecualikan kok masih tampil"). Anak dari satker terkecuali
        // ikut disembunyikan: laporan ini tidak boleh memindahkan anak ke leluhur lain karena itu
        // akan memalsukan parent-child pada tree dan export.
        // PENTING: node.id (dari raw query pg) datang sbg STRING utk kolom bigint (perilaku default
        // node-postgres, hindari presisi hilang di atas Number.MAX_SAFE_INTEGER), sedangkan
        // excludedSatkerIds sudah di-Number()-kan di getExcludedSatkerIds() -- Set.has() pakai
        // strict equality jadi "2" !== 2, exclude-nya diam2 tak pernah kena kalau dibandingkan apa
        // adanya. Normalisasi ke string di kedua sisi supaya konsisten dgn tipe asli node/parentOf.
        const manuallyExcludedSet = new Set(manuallyExcludedSatkerIds.map((id) => String(id)));

        // Unit/fungsi di bawah Polsek tetap ditampilkan. UNIT RESKRIM berada lebih dahulu daripada
        // fungsi Reserse lain, tetapi parent_id aslinya tidak pernah diubah/di-flatten.
        const tipeById = new Map<number, string>();
        for (const s of satkers) tipeById.set(s.id, s.tipe_satker);
        const taxonomyVisibleSet = new Set<number>(taxonomyMatchedIds);
        for (const matchedId of taxonomyMatchedIds) {
            let cur = parentOf.get(matchedId) ?? null;
            const guard = new Set<number>();
            while (cur != null && !guard.has(cur)) {
                guard.add(cur);
                taxonomyVisibleSet.add(Number(cur));
                cur = parentOf.get(cur) ?? null;
            }
        }

        const underManualExclusionMemo = new Map<number, boolean>();
        const isUnderManualExclusion = (id: number): boolean => {
            if (underManualExclusionMemo.has(id)) return underManualExclusionMemo.get(id)!;
            underManualExclusionMemo.set(id, false);
            const parentId = parentOf.get(id);
            const result =
                parentId != null &&
                (manuallyExcludedSet.has(String(parentId)) || isUnderManualExclusion(parentId));
            underManualExclusionMemo.set(id, result);
            return result;
        };

        const byId = new Map<number, TreeNode>();
        for (const n of node.values()) {
            if (manuallyExcludedSet.has(String(n.id))) continue;
            if (isUnderManualExclusion(n.id)) continue;
            if (scopeVisibleIds && !scopeVisibleIds.has(Number(n.id))) continue;
            if (!taxonomyVisibleSet.has(Number(n.id))) continue;
            byId.set(n.id, { ...n, ...withMetrics(n), nomor: '', children: [] });
        }
        const roots: TreeNode[] = [];
        for (const n of byId.values()) {
            // Pada regional, Polda canonical sengaja menjadi root keluaran walaupun parent POLRI
            // tidak termasuk scope akun. Node lain tetap fail-closed dan tidak di-flatten.
            if (n.parent_id == null || (scopeRootId != null && n.id === scopeRootId)) {
                roots.push(n);
                continue;
            }
            const parent = byId.get(n.parent_id);
            // Fail closed: node tidak pernah dinaikkan menjadi root/anak leluhur lain. Jika
            // parent tidak lolos filter, node ikut tidak ditampilkan agar struktur tetap sah.
            if (parent) parent.children.push(n);
        }
        // Comparator hanya mengurutkan sibling yang sudah terpasang pada parent canonical.
        // Ia tidak memindahkan node atau mengubah parent_id, dan marker fungsi token-safe.
        const sortRec = (arr: TreeNode[], parent: TreeNode | null = null) => {
            arr.sort(
                (a, b) =>
                    satkerStructuralRank(parent, a, parent ? tipeById.get(parent.id) || '' : '', tipeById.get(a.id) || '') -
                        satkerStructuralRank(parent, b, parent ? tipeById.get(parent.id) || '' : '', tipeById.get(b.id) || '') ||
                    (a.urutan ?? Number.MAX_SAFE_INTEGER) - (b.urutan ?? Number.MAX_SAFE_INTEGER) ||
                    String(a.kode).localeCompare(String(b.kode)) ||
                    normalizedSatkerWords(a.nama).localeCompare(normalizedSatkerWords(b.nama)) ||
                    a.id - b.id
            );
            arr.forEach((x) => sortRec(x.children, x));
        };
        sortRec(roots);

        // Nomor manusiawi dihitung SETELAH filter + comparator final. Nomor tidak memakai indeks
        // synthetic lama dan tidak berubah hanya karena halaman pagination berganti.
        const numberRec = (arr: TreeNode[], prefix = '') => {
            arr.forEach((n, index) => {
                n.nomor = `${prefix}${index + 1}.`;
                numberRec(n.children, n.nomor);
            });
        };
        numberRec(roots);

        const byKode = new Map<string, TreeNode>();
        const indexRec = (arr: TreeNode[]) => arr.forEach((n) => { byKode.set(n.kode, n); indexRec(n.children); });
        indexRec(roots);

        const mergeRincian = (a: Record<string, number>, b: Record<string, number>): Record<string, number> => {
            const out = { ...a };
            for (const k of Object.keys(b)) out[k] = (out[k] || 0) + b[k];
            return out;
        };
        const totals = roots.reduce(
            (a, n) => ({
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
            }),
            this.emptyTotals()
        );

        // Tampilkan SELURUH status master sbg kolom (bukan cuma yg lg ada datanya), supaya
        // rekap status penanganan selalu lengkap spt daftar master (LP s/d Tahap II dst).
        const allStatuses = await this.ds.query("select code, nama, coalesce(kategori,'CT') as kategori, urutan from bdb_status_master order by urutan, id");
        const columns = allStatuses.map((s: any) => ({ code: s.code, nama: s.nama, kategori: s.kategori }));

        // Summary harus memakai populasi yang sama dengan node root yang terlihat di tabel.
        // Menjalankan agregator kedua di sini pernah menghasilkan 213,9 jt sementara baris
        // nasional 238,6 jt, sehingga Crime Rate kartu dan tabel saling bertentangan.
        const jumlahPenduduk = roots.reduce((total, root) => total + (root.jumlah_penduduk || 0), 0);

        return {
            roots,
            byKode,
            totals,
            columns,
            from,
            to,
            mode,
            scoped: !nationalRead && !scope.all,
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

    /** Ratakan pohon utuh (bukan lazy) utk export Excel/PDF -- nama satker diberi indent per level. */
    async exportRows(
        userId: number | undefined,
        from?: string,
        to?: string,
        mode?: string,
        jenisKejahatanIds?: number[],
        golonganIds?: number[],
        iccsKategoriIds?: number[],
        visibility: KinerjaReadVisibility = 'scoped',
        taxonomy: KinerjaTaxonomyFilter = DEFAULT_TAXONOMY_FILTER,
        modelFilter?: KinerjaModelFilter,
        closureReason?: KinerjaClosureReasonFilter,
        bucketMode: KinerjaBucketMode = 'age',
        kelompokHitung: KinerjaCountingGroup[] = []
    ) {
        const {
            roots,
            columns,
            from: f,
            to: t,
            mode: m,
            applied_filters,
            mapping_version,
            mapping_review_count
        } = await this.buildTree(
            userId,
            from,
            to,
            mode,
            jenisKejahatanIds,
            golonganIds,
            iccsKategoriIds,
            visibility,
            taxonomy,
            modelFilter,
            closureReason,
            bucketMode,
            kelompokHitung
        );
        const rows: any[] = [];
        const walk = (nodes: TreeNode[], level: number) => {
            for (const n of nodes) {
                const row: any = { no: n.nomor, kode: n.kode, satker: `${'   '.repeat(level)}${n.nama}` };
                for (const c of columns) row[c.code] = n.status[c.code] || 0;
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
                if (n.children.length) walk(n.children, level + 1);
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

    private emptyTotals() {
        return {
            ct: 0,
            cp_berjalan: 0,
            cp_tunggakan: 0,
            cp_berjalan_belum_update: 0,
            cp_tunggakan_belum_update: 0,
            cc_aktual: 0,
            cc_tunggakan: 0,
            belum_kesulitan: 0,
            cp_berjalan_rincian: {} as Record<string, number>,
            cp_tunggakan_rincian: {} as Record<string, number>,
            cc_aktual_rincian: {} as Record<string, number>,
            cc_tunggakan_rincian: {} as Record<string, number>
        };
    }

    private lite(n: TreeNode): LiteNode {
        const { children, ...rest } = n;
        return { ...rest, has_children: !!children.length };
    }

    private paginateNodes(nodes: TreeNode[], pageIn?: number, limitIn?: number) {
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

    /** Rekap lazy per level: tanpa parent -> root; dengan parent -> anak langsungnya. */
    async rekap(
        userId: number | undefined,
        from?: string,
        to?: string,
        parent?: string,
        mode?: string,
        jenisKejahatanIds?: number[],
        golonganIds?: number[],
        iccsKategoriIds?: number[],
        visibility: KinerjaReadVisibility = 'scoped',
        taxonomy: KinerjaTaxonomyFilter = DEFAULT_TAXONOMY_FILTER,
        page?: number,
        limit?: number,
        modelFilter?: KinerjaModelFilter,
        closureReason?: KinerjaClosureReasonFilter,
        bucketMode: KinerjaBucketMode = 'age',
        kelompokHitung: KinerjaCountingGroup[] = []
    ) {
        const {
            roots,
            byKode,
            totals,
            columns,
            scoped,
            applied_filters,
            mapping_version,
            mapping_review_count
        } = await this.buildTree(
            userId,
            from,
            to,
            mode,
            jenisKejahatanIds,
            golonganIds,
            iccsKategoriIds,
            visibility,
            taxonomy,
            modelFilter,
            closureReason,
            bucketMode,
            kelompokHitung
        );
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

    /** Kartu ringkasan atas: total + CR + level + indeks utk seluruh scope. */
    async summary(
        userId: number | undefined,
        from?: string,
        to?: string,
        mode?: string,
        jenisKejahatanIds?: number[],
        golonganIds?: number[],
        iccsKategoriIds?: number[],
        visibility: KinerjaReadVisibility = 'scoped',
        taxonomy: KinerjaTaxonomyFilter = DEFAULT_TAXONOMY_FILTER,
        modelFilter?: KinerjaModelFilter,
        closureReason?: KinerjaClosureReasonFilter,
        bucketMode: KinerjaBucketMode = 'age',
        kelompokHitung: KinerjaCountingGroup[] = []
    ) {
        const {
            totals,
            from: f,
            to: t,
            scoped,
            jumlahPenduduk,
            applied_filters,
            mapping_version,
            mapping_review_count
        } = await this.buildTree(
            userId,
            from,
            to,
            mode,
            jenisKejahatanIds,
            golonganIds,
            iccsKategoriIds,
            visibility,
            taxonomy,
            modelFilter,
            closureReason,
            bucketMode,
            kelompokHitung
        );
        const denom = totals.ct + totals.cc_tunggakan;
        const cr = denom > 0 ? ((totals.cc_aktual + totals.cc_tunggakan) / denom) * 100 : 0;
        // Kontrak mockup CR lama: total CC / CT, dari himpunan filter yang sama.
        const crLama = totals.ct > 0 ? ((totals.cc_aktual + totals.cc_tunggakan) / totals.ct) * 100 : 0;
        // PR (Processed Rate) -- pasangan CP thd CR: (CP Berjalan+CP Tunggakan)/(CT+CP Tunggakan).
        const denomPr = totals.ct + totals.cp_tunggakan;
        const pr = denomPr > 0 ? ((totals.cp_berjalan + totals.cp_tunggakan) / denomPr) * 100 : 0;
        // PR Lama -- pasangan CR Lama, pembagi sederhana (CT saja).
        const prLama = totals.ct > 0 ? ((totals.cp_berjalan + totals.cp_tunggakan) / totals.ct) * 100 : 0;
        const lastRefreshed = await this.lastRefreshedAt();

        // Crime Rate = (CT / Jumlah Penduduk) x 100.000 -- presisi penuh, dibulatkan cuma di tampilan.
        // Kosong/0 penduduk = jangan dibagi, biar frontend tampilkan "-" + keterangan blm tersedia.
        const crimeRate = jumlahPenduduk > 0 ? (totals.ct / jumlahPenduduk) * 100000 : null;

        // Crime Clock = Total Detik dlm Periode / CT (periode dihitung inklusif kedua tanggal).
        const diffDays = Math.round((new Date(t).getTime() - new Date(f).getTime()) / 86400000) + 1;
        const totalDetikPeriode = Math.max(0, diffDays) * 86400;
        const crimeClockDetik = totals.ct > 0 ? totalDetikPeriode / totals.ct : null;
        const crimeClock = crimeClockDetik != null ? this.formatCrimeClock(crimeClockDetik) : null;

        return {
            status: 1,
            data: {
                ...totals,
                cr: roundRate4(cr),
                cr_raw: cr,
                cr_lama: roundRate4(crLama),
                pr: roundRate4(pr),
                pr_lama: roundRate4(prLama),
                level: levelOf(Math.min(cr, 100)),
                indeks: round2(computeIndeks(cr)),
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

    /** Daftar jenis kejahatan yg benar2 dipakai LP (bukan seluruh 300+ master cm_jenis_kejahatan) -- utk filter dropdown. */
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
}
