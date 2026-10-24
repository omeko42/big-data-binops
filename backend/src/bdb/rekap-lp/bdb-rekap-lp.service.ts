import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type GroupKey = {
  domain: string;
  level: string;
  code: string;
};

type PeriodFilter = {
  year: number | null;
  dateFrom: string | null;
  dateTo: string | null;
};

@Injectable()
export class BdbRekapLpService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private statusSelesaiSql(alias = 'lp') {
    return `
      lower(coalesce(${alias}.status, '')) like '%selesai%'
      or lower(coalesce(${alias}.status, '')) like '%tahap ii%'
      or lower(coalesce(${alias}.status, '')) like '%sp2lid%'
      or lower(coalesce(${alias}.status, '')) like '%henti lidik%'
      or lower(coalesce(${alias}.status, '')) like '%sp3%'
      or lower(coalesce(${alias}.status, '')) like '%henti sidik%'
    `;
  }

  private statusBelumProsesSql(alias = 'lp') {
    return `
      coalesce(${alias}.is_distributed, false) = false
      or lower(trim(coalesce(${alias}.status, ''))) in ('', 'aktif', 'active')
    `;
  }

  private statusProsesSql(alias = 'lp') {
    return `
      coalesce(${alias}.is_distributed, false) = true
      and lower(trim(coalesce(${alias}.status, ''))) in (
        'penyelidikan',
        'penyidikan',
        'spdp',
        'p-19',
        'p19',
        'tahap i',
        'p-21',
        'p21'
      )
    `;
  }

  private operationalLpSql(alias = 'lp') {
    return `coalesce(${alias}.data_scope, 'TEST') = 'OPERASIONAL'`;
  }

  private normalizeYear(value?: string | number | null) {
    const year = Number(value || 0);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) return null;
    return year;
  }

  private lpYearSql(alias = 'lp', value?: string | number | null) {
    const year = this.normalizeYear(value);
    if (!year) return 'true';

    return `${alias}.tanggal_lp >= date '${year}-01-01' and ${alias}.tanggal_lp < date '${year + 1}-01-01'`;
  }

  private normalizeDate(value?: string | null) {
    const text = String(value || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;

    const parsed = new Date(`${text}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return null;

    return parsed.toISOString().slice(0, 10) === text ? text : null;
  }

  private normalizePeriod(
    year?: string | number | null,
    dateFrom?: string | null,
    dateTo?: string | null,
  ): PeriodFilter {
    let from = this.normalizeDate(dateFrom);
    let to = this.normalizeDate(dateTo);

    if (from && to && from > to) {
      [from, to] = [to, from];
    }

    return {
      year: from || to ? null : this.normalizeYear(year),
      dateFrom: from,
      dateTo: to,
    };
  }

  private lpPeriodSql(alias = 'lp', period?: PeriodFilter | null) {
    if (!period?.dateFrom && !period?.dateTo) {
      return this.lpYearSql(alias, period?.year || null);
    }

    const clauses: string[] = [];
    if (period.dateFrom) clauses.push(`${alias}.tanggal_lp >= date '${period.dateFrom}'`);
    if (period.dateTo) clauses.push(`${alias}.tanggal_lp < date '${period.dateTo}' + interval '1 day'`);

    return clauses.length ? clauses.join(' and ') : 'true';
  }

  private parseGroupKey(value: string): GroupKey | null {
    const parts = value.split(':');
    if (parts.length < 4 || parts[0] !== 'GROUP') return null;

    return {
      domain: parts[1],
      level: parts[2],
      code: parts.slice(3).join(':'),
    };
  }

  async getNodes(
    parentKey: string | null,
    year?: string | number | null,
    dateFrom?: string | null,
    dateTo?: string | null,
  ) {
    const period = this.normalizePeriod(year, dateFrom, dateTo);

    if (!parentKey) return this.getRootNodes(period);

    if (parentKey.startsWith('ROOT:')) {
      return this.getDomainChildren(parentKey.replace('ROOT:', '').trim(), period);
    }

    const group = this.parseGroupKey(parentKey);
    if (group) return this.getGroupedChildren(group, period);

    return this.getRawChildren(parentKey, period);
  }

  private async getRootNodes(period?: PeriodFilter | null) {
    const lpDateSql = this.lpPeriodSql('lp', period);
    const rows = await this.dataSource.query(`
      with domains(domain) as (
        values ('INTERNAL POLRI'), ('EKSTERNAL POLRI')
      )
      select
        'ROOT:' || d.domain as node_key,
        d.domain as nama,
        d.domain,
        null::text as sub_domain,
        'ROOT' as level,
        null::text as parent_key,
        count(distinct coalesce(s.level, '') || ':' || coalesce(s.dors_kode, s.satker_key, '')) filter (
          where s.id is not null and (s.parent_key is null or s.parent_key = '')
        )::int as jml_sub_satker,
        count(lp.id)::int as lp_total,
        count(lp.id) filter (
              where lp.id is not null
                and (${this.statusBelumProsesSql('lp')})
            )::int as lp_belum_proses,
            count(lp.id) filter (
              where lp.id is not null
                and (${this.statusProsesSql('lp')})
            )::int as lp_proses,
            count(lp.id) filter (
              where ${this.statusSelesaiSql('lp')}
            )::int as lp_selesai,
        true as can_open
      from domains d
      left join bdb_satker_master s on s.domain = d.domain
      left join bdb_lp_master lp on coalesce(lp.operational_satker_id, lp.satker_master_id) = s.id
        and (${this.operationalLpSql('lp')})
        and (${lpDateSql})
      group by d.domain
      order by d.domain desc
    `);

    return { data: rows, meta: { total: rows.length, period } };
  }

  private async getDomainChildren(domain: string, period?: PeriodFilter | null) {
    const lpDateSql = this.lpPeriodSql('lp', period);
    const rows = await this.dataSource.query(
      `
      with base as (
        select *
        from bdb_satker_master
        where domain = $1
          and (parent_key is null or parent_key = '')
      ),
      grouped as (
        select
          domain,
          case
            when bool_or(sub_domain = 'INTERNAL RESERSE') then 'INTERNAL RESERSE'
            when bool_or(sub_domain = 'EKSTERNAL RESERSE') then 'EKSTERNAL RESERSE'
            else max(sub_domain)
          end as sub_domain,
          level,
          dors_kode,
          min(nama_satker_canonical) as nama,
          array_agg(satker_key) as keys,
          min(satker_key) as any_key
        from base
        group by domain, level, dors_kode
      )
      select
        'GROUP:' || g.domain || ':' || g.level || ':' || coalesce(g.dors_kode, g.any_key) as node_key,
        g.nama,
        g.domain,
        g.sub_domain,
        g.level,
        null::text as parent_key,
        coalesce(child.jml_sub_satker, 0)::int as jml_sub_satker,
        coalesce(stat.lp_total, 0)::int as lp_total,
        coalesce(stat.lp_belum_proses, 0)::int as lp_belum_proses,
        coalesce(stat.lp_proses, 0)::int as lp_proses,
        coalesce(stat.lp_selesai, 0)::int as lp_selesai,
        coalesce(child.jml_sub_satker, 0) > 0 as can_open
      from grouped g
      left join lateral (
        select count(distinct coalesce(c.level, '') || ':' || coalesce(c.dors_kode, c.satker_key, ''))::int as jml_sub_satker
        from bdb_satker_master c
        where c.parent_key = any(g.keys)
      ) child on true
      left join lateral (
        with recursive tree as (
          select id, satker_key
          from bdb_satker_master
          where satker_key = any(g.keys)

          union all

          select c.id, c.satker_key
          from bdb_satker_master c
          join tree t on c.parent_key = t.satker_key
        )
        select
          count(lp.id)::int as lp_total,
          count(lp.id) filter (
              where lp.id is not null
                and (${this.statusBelumProsesSql('lp')})
            )::int as lp_belum_proses,
            count(lp.id) filter (
              where lp.id is not null
                and (${this.statusProsesSql('lp')})
            )::int as lp_proses,
            count(lp.id) filter (
              where ${this.statusSelesaiSql('lp')}
            )::int as lp_selesai
        from tree t
        left join bdb_lp_master lp on coalesce(lp.operational_satker_id, lp.satker_master_id) = t.id
          and (${this.operationalLpSql('lp')})
          and (${lpDateSql})
      ) stat on true
      order by
        case when upper(g.nama) = 'MABES POLRI' then 0 else 1 end,
        g.nama asc
      `,
      [domain],
    );
return { data: rows, meta: { total: rows.length, period } };
  }

  private async getGroupedChildren(group: GroupKey, period?: PeriodFilter | null) {
    const lpDateSql = this.lpPeriodSql('lp', period);
    const rows = await this.dataSource.query(
      `
      with parent_group as (
        select id, satker_key
        from bdb_satker_master
        where domain = $1
          and level = $2
          and coalesce(dors_kode, satker_key) = $3
      ),
      base as (
        select c.*
        from bdb_satker_master c
        join parent_group p on c.parent_key = p.satker_key
      ),
      grouped as (
        select
          domain,
          case
            when bool_or(sub_domain = 'INTERNAL RESERSE') then 'INTERNAL RESERSE'
            when bool_or(sub_domain = 'EKSTERNAL RESERSE') then 'EKSTERNAL RESERSE'
            else max(sub_domain)
          end as sub_domain,
          level,
          coalesce(dors_kode, satker_key) as group_code,
          min(nama_satker_canonical) as nama,
          array_agg(satker_key) as keys,
          min(satker_key) as any_key,
          bool_or(coalesce(is_holding_node, false)) as is_holding_group
        from base
        group by domain, level, coalesce(dors_kode, satker_key)
      )
      select
        case
          when g.group_code like 'BDB:%' then g.any_key
          else 'GROUP:' || g.domain || ':' || g.level || ':' || g.group_code
        end as node_key,
        g.nama,
        g.domain,
        g.sub_domain,
        g.level,
        null::text as parent_key,
        coalesce(child.jml_sub_satker, 0)::int as jml_sub_satker,
        coalesce(stat.lp_total, 0)::int as lp_total,
        coalesce(stat.lp_belum_proses, 0)::int as lp_belum_proses,
        coalesce(stat.lp_proses, 0)::int as lp_proses,
        coalesce(stat.lp_selesai, 0)::int as lp_selesai,
        (
          coalesce(child.jml_sub_satker, 0) > 0
          or coalesce(stat.lp_total, 0) > 0
        ) as can_open
      from grouped g
      left join lateral (
        select count(distinct coalesce(c.level, '') || ':' || coalesce(c.dors_kode, c.satker_key, ''))::int as jml_sub_satker
        from bdb_satker_master c
        where c.parent_key = any(g.keys)
      ) child on true
      left join lateral (
        with recursive tree as (
          select id, satker_key, is_holding_node
          from bdb_satker_master
          where satker_key = any(g.keys)

          union all

          select c.id, c.satker_key, c.is_holding_node
          from bdb_satker_master c
          join tree t on c.parent_key = t.satker_key
        )
        select
          count(lp.id)::int as lp_total,
          count(lp.id) filter (
              where lp.id is not null
                and (${this.statusBelumProsesSql('lp')})
            )::int as lp_belum_proses,
            count(lp.id) filter (
              where lp.id is not null
                and (${this.statusProsesSql('lp')})
            )::int as lp_proses,
            count(lp.id) filter (
              where ${this.statusSelesaiSql('lp')}
            )::int as lp_selesai
        from bdb_lp_master lp
        where (${this.operationalLpSql('lp')})
          and (${lpDateSql})
          and (
          coalesce(lp.operational_satker_id, lp.satker_master_id) in (select id from tree)
          or (
            exists (
              select 1
              from tree
              where coalesce(is_holding_node, false) = true
            )
            and lp.operational_satker_id is null
            and coalesce(lp.is_distributed, false) = false
            and lp.satker_master_id in (select id from parent_group)
          )
        )
      ) stat on true
      order by
        case when coalesce(g.is_holding_group, false) = true then 0 else 1 end,
        g.nama asc
      `,
      [group.domain, group.level, group.code],
    );

    return { data: rows, meta: { total: rows.length, period } };
  }

  private async getRawChildren(parentKey: string, period?: PeriodFilter | null) {
    const lpDateSql = this.lpPeriodSql('lp', period);
    const rows = await this.dataSource.query(
      `
      select
        n.satker_key as key,
        n.nama_satker_canonical as nama,
        n.domain,
        n.sub_domain,
        n.level,
        n.parent_key,
        coalesce(child.jml_sub_satker, 0)::int as jml_sub_satker,
        coalesce(stat.lp_total, 0)::int as lp_total,
        coalesce(stat.lp_belum_proses, 0)::int as lp_belum_proses,
        coalesce(stat.lp_proses, 0)::int as lp_proses,
        coalesce(stat.lp_selesai, 0)::int as lp_selesai,
        (
          coalesce(child.jml_sub_satker, 0) > 0
          or coalesce(stat.lp_total, 0) > 0
        ) as can_open
      from bdb_satker_master n
      left join lateral (
        select count(*)::int as jml_sub_satker
        from bdb_satker_master c
        where c.parent_key = n.satker_key
      ) child on true
      left join lateral (
        with recursive tree as (
          select n.id, n.satker_key
          union all
          select c.id, c.satker_key
          from bdb_satker_master c
          join tree t on c.parent_key = t.satker_key
        )
        select
          count(lp.id)::int as lp_total,
          count(lp.id) filter (
              where lp.id is not null
                and (${this.statusBelumProsesSql('lp')})
            )::int as lp_belum_proses,
            count(lp.id) filter (
              where lp.id is not null
                and (${this.statusProsesSql('lp')})
            )::int as lp_proses,
            count(lp.id) filter (
              where ${this.statusSelesaiSql('lp')}
            )::int as lp_selesai
        from bdb_lp_master lp
        where (${this.operationalLpSql('lp')})
          and (${lpDateSql})
          and (
          coalesce(lp.operational_satker_id, lp.satker_master_id) in (select id from tree)
          or (
            coalesce(n.is_holding_node, false) = true
            and lp.operational_satker_id is null
            and coalesce(lp.is_distributed, false) = false
            and lp.satker_master_id = (
              select p.id
              from bdb_satker_master p
              where p.satker_key = n.parent_key
              limit 1
            )
          )
        )
      ) stat on true
      where n.parent_key = $1
      order by n.nama_satker_canonical asc
      `,
      [parentKey],
    );

    return { data: rows, meta: { total: rows.length, period } };
  }

  async getLps(
    satkerKey: string | null,
    search: string,
    year?: string | number | null,
    dateFrom?: string | null,
    dateTo?: string | null,
  ) {
    if (!satkerKey) return { data: [], meta: { total: 0 } };

    const group = this.parseGroupKey(satkerKey);
    const period = this.normalizePeriod(year, dateFrom, dateTo);

    const rows = group
      ? await this.getGroupedLps(group, search, period)
      : await this.getRawLps(satkerKey, search, period);

    return { data: rows, meta: { total: rows.length, period } };
  }

  async getWorklist(options: {
    mode?: string;
    tab?: string;
    search?: string;
    year?: string | number | null;
    dateFrom?: string | null;
    dateTo?: string | null;
    includeTest?: boolean;
  }) {
    const mode = String(options.mode || '').trim().toLowerCase();
    const tab = String(options.tab || '').trim().toUpperCase();
    const search = String(options.search || '').trim();
    const period = this.normalizePeriod(options.year, options.dateFrom, options.dateTo);
    const lpDateSql = this.lpPeriodSql('lp', period);
    const lpScopeSql = options.includeTest
      ? "coalesce(lp.data_scope, 'TEST') in ('OPERASIONAL', 'TEST')"
      : this.operationalLpSql('lp');

    const modeWhere =
      mode === 'penanganan'
        ? 'coalesce(lp.is_distributed, false) = true'
        : 'true';

    let tabWhere = 'true';

    if (mode === 'distribusi') {
      if (tab === 'BELUM_DISTRIBUSI') tabWhere = 'coalesce(lp.is_distributed, false) = false';
      if (tab === 'SUDAH_DISTRIBUSI') tabWhere = 'coalesce(lp.is_distributed, false) = true';
    }

    if (mode === 'penanganan') {
      if (tab === 'BELUM_PROSES') {
        tabWhere = `
          coalesce(lp.is_distributed, false) = true
          and lower(trim(coalesce(lp.status, ''))) in ('', 'aktif', 'active')
        `;
      }

      if (tab === 'PROSES') tabWhere = `(${this.statusProsesSql('lp')})`;
      if (tab === 'SELESAI') tabWhere = `(${this.statusSelesaiSql('lp')})`;
    }

    const rows = await this.dataSource.query(
      `
      select
        lp.id,
        lp.nomor_lp,
        case
          when lower(coalesce(lp.model_lp, '')) like '%model_a%' then 'A'
          when lower(coalesce(lp.model_lp, '')) like '%model_b%' then 'B'
          else coalesce(lp.model_lp, '-')
        end as model_lp,
        lp.tanggal_lp,
        lp.nama_kejahatan_canonical as kejahatan,
        coalesce(lp.uraian_singkat_operasional, lp.uraian_singkat) as uraian_singkat,
        lp.uraian_singkat as uraian_singkat_dors,
        lp.uraian_singkat_operasional,
        coalesce(lp.tingkat_kesulitan, 'Belum dipilih') as tingkat_kesulitan,
        lp.status,
        lp.satker_master_id,
        lp.operational_satker_id,
        coalesce(lp.is_distributed, false) as is_distributed,
        coalesce(lp.is_distributed, false) = false as belum_distribusi,
        lp.distributed_at,
        sm.nama_satker_canonical as posisi_lp,
        osm.nama_satker_canonical as posisi_operasional,
        case
          when coalesce(lp.is_distributed, false) = false then 'Belum distribusi'
          when lower(coalesce(lp.status, '')) in ('', 'aktif', 'active') then 'Belum ada perkembangan'
          else lp.status
        end as status_tampil
      from bdb_lp_master lp
      left join bdb_satker_master sm on sm.id = lp.satker_master_id
      left join bdb_satker_master osm on osm.id = lp.operational_satker_id
      where (${lpScopeSql})
        and (${lpDateSql})
        and (${modeWhere})
        and (${tabWhere})
        and (
          $1 = ''
          or lower(coalesce(lp.nomor_lp, '')) like '%' || lower($1) || '%'
          or lower(coalesce(lp.nama_kejahatan_canonical, '')) like '%' || lower($1) || '%'
          or lower(coalesce(lp.uraian_singkat_operasional, lp.uraian_singkat, '')) like '%' || lower($1) || '%'
          or lower(coalesce(sm.nama_satker_canonical, '')) like '%' || lower($1) || '%'
          or lower(coalesce(osm.nama_satker_canonical, '')) like '%' || lower($1) || '%'
        )
      order by lp.tanggal_lp desc nulls last, lp.id desc
      limit 500
      `,
      [search],
    );

    return { data: rows, meta: { total: rows.length, mode, tab, period } };
  }

  private async getGroupedLps(group: GroupKey, search: string, period?: PeriodFilter | null) {
    const groupAny = group as any;
    const domain = groupAny.domain || '';
    const level = groupAny.level || '';
    const code = groupAny.code || groupAny.kode || groupAny.dors_kode || groupAny.dorsKode || '';
    const safeSearch = String(search || '').trim();
    const lpDateSql = this.lpPeriodSql('lp', period);

    return this.dataSource.query(
      `
      with recursive tree as (
        select id, satker_key
        from bdb_satker_master
        where domain = $1
          and level = $2
          and coalesce(dors_kode, satker_key) = $3

        union all

        select c.id, c.satker_key
        from bdb_satker_master c
        join tree t on c.parent_key = t.satker_key
      )
      select
        lp.id,
        lp.nomor_lp,
        case
          when lower(coalesce(lp.model_lp, '')) like '%model_a%' then 'A'
          when lower(coalesce(lp.model_lp, '')) like '%model_b%' then 'B'
          else coalesce(lp.model_lp, '-')
        end as model_lp,
        lp.tanggal_lp,
        lp.nama_kejahatan_canonical as kejahatan,
        coalesce(lp.uraian_singkat_operasional, lp.uraian_singkat) as uraian_singkat,
        lp.uraian_singkat as uraian_singkat_dors,
        lp.uraian_singkat_operasional,
        coalesce(lp.tingkat_kesulitan, 'Belum dipilih') as tingkat_kesulitan,
        lp.status,
        lp.operational_satker_id,
        coalesce(lp.is_distributed, false) as is_distributed,
        lp.distributed_at,
        sm.nama_satker_canonical as posisi_lp,
        osm.nama_satker_canonical as posisi_operasional,
        case
          when coalesce(lp.is_distributed, false) = false then 'Belum distribusi'
          when lower(coalesce(lp.status, '')) in ('', 'aktif', 'active') then 'Belum ada perkembangan'
          else lp.status
        end as status_tampil
      from bdb_lp_master lp
      left join bdb_satker_master sm on sm.id = lp.satker_master_id
      left join bdb_satker_master osm on osm.id = lp.operational_satker_id
      where (${this.operationalLpSql('lp')})
        and (${lpDateSql})
        and (
        lp.satker_master_id in (select id from tree)
        or lp.operational_satker_id in (select id from tree)
      )
        and (
          $4 = ''
          or lower(coalesce(lp.nomor_lp, '')) like '%' || lower($4) || '%'
          or lower(coalesce(lp.nama_kejahatan_canonical, '')) like '%' || lower($4) || '%'
          or lower(coalesce(lp.uraian_singkat_operasional, lp.uraian_singkat, '')) like '%' || lower($4) || '%'
        )
      order by lp.tanggal_lp desc nulls last, lp.id desc
      limit 200
      `,
      [domain, level, code, safeSearch],
    );
  }

  private async getRawLps(satkerKey: string, search: string, period?: PeriodFilter | null) {
    const safeSearch = String(search || '').trim();
    const lpDateSql = this.lpPeriodSql('lp', period);

    return this.dataSource.query(
      `
      with recursive tree as (
        select id, satker_key
        from bdb_satker_master
        where satker_key = $1

        union all

        select c.id, c.satker_key
        from bdb_satker_master c
        join tree t on c.parent_key = t.satker_key
      )
      select
        lp.id,
        lp.nomor_lp,
        case
          when lower(coalesce(lp.model_lp, '')) like '%model_a%' then 'A'
          when lower(coalesce(lp.model_lp, '')) like '%model_b%' then 'B'
          else coalesce(lp.model_lp, '-')
        end as model_lp,
        lp.tanggal_lp,
        lp.nama_kejahatan_canonical as kejahatan,
        coalesce(lp.uraian_singkat_operasional, lp.uraian_singkat) as uraian_singkat,
        lp.uraian_singkat as uraian_singkat_dors,
        lp.uraian_singkat_operasional,
        coalesce(lp.tingkat_kesulitan, 'Belum dipilih') as tingkat_kesulitan,
        lp.status,
        lp.operational_satker_id,
        coalesce(lp.is_distributed, false) as is_distributed,
        lp.distributed_at,
        sm.nama_satker_canonical as posisi_lp,
        osm.nama_satker_canonical as posisi_operasional,
        case
          when coalesce(lp.is_distributed, false) = false then 'Belum distribusi'
          when lower(coalesce(lp.status, '')) in ('', 'aktif', 'active') then 'Belum ada perkembangan'
          else lp.status
        end as status_tampil
      from bdb_lp_master lp
      left join bdb_satker_master sm on sm.id = lp.satker_master_id
      left join bdb_satker_master osm on osm.id = lp.operational_satker_id
      where (${this.operationalLpSql('lp')})
        and (${lpDateSql})
        and (
        lp.satker_master_id in (select id from tree)
        or lp.operational_satker_id in (select id from tree)
            or (
              exists (
                select 1
                from bdb_satker_master hn
                where hn.satker_key = $1
                  and coalesce(hn.is_holding_node, false) = true
              )
              and lp.operational_satker_id is null
              and coalesce(lp.is_distributed, false) = false
              and lp.satker_master_id = (
                select p.id
                from bdb_satker_master hn
                join bdb_satker_master p on p.satker_key = hn.parent_key
                where hn.satker_key = $1
                limit 1
              )
            )
      )
        and (
          $2 = ''
          or lower(coalesce(lp.nomor_lp, '')) like '%' || lower($2) || '%'
          or lower(coalesce(lp.nama_kejahatan_canonical, '')) like '%' || lower($2) || '%'
          or lower(coalesce(lp.uraian_singkat_operasional, lp.uraian_singkat, '')) like '%' || lower($2) || '%'
        )
      order by lp.tanggal_lp desc nulls last, lp.id desc
      limit 200
      `,
      [satkerKey, safeSearch],
    );
  }
  async getHistory(lpId: number) {
    if (!lpId) return { data: [], meta: { total: 0 } };

    const rows = await this.dataSource.query(
      `
      select
        id,
        lp_master_id,
        event_type,
        event_status,
        event_text,
        document_type,
        document_number,
        document_date,
        document_timezone,
        from_satker_name,
        to_satker_name,
        note,
        created_by_name,
        created_at,
        payload_json,
        coalesce(is_voided, false) as is_voided,
        voided_at,
        void_reason,
        voided_by_event_id
      from bdb_lp_history_logs
      where lp_master_id = $1
      order by coalesce(document_date, created_at) asc, id asc
      `,
      [lpId],
    );

    return { data: rows, meta: { total: rows.length } };
  }

  async createHistory(body: any) {
    const lpMasterId = Number(body?.lp_master_id || body?.lpMasterId || 0);
    const eventType = String(body?.event_type || body?.eventType || '').trim();
    const eventText = String(body?.event_text || body?.eventText || '').trim();

    if (!lpMasterId || !eventType || !eventText) {
      return {
        status: 0,
        message: 'lp_master_id, event_type, dan event_text wajib diisi',
        data: null,
      };
    }

    const rows = await this.dataSource.query(
      `
      insert into bdb_lp_history_logs (
        lp_master_id,
        event_type,
        event_status,
        event_text,
        document_type,
        document_number,
        document_date,
        document_timezone,
        from_satker_id,
        to_satker_id,
        from_satker_name,
        to_satker_name,
        note,
        payload_json,
        created_by_id,
        created_by_name
      )
      values (
        $1, $2, $3, $4, $5, $6, $7, coalesce($8, 'WIB'),
        $9, $10, $11, $12, $13, $14::jsonb, $15, $16
      )
      returning *
      `,
      [
        lpMasterId,
        eventType,
        body?.event_status || body?.eventStatus || null,
        eventText,
        body?.document_type || body?.documentType || null,
        body?.document_number || body?.documentNumber || null,
        body?.document_date || body?.documentDate || null,
        body?.document_timezone || body?.documentTimezone || 'WIB',
        body?.from_satker_id || body?.fromSatkerId || null,
        body?.to_satker_id || body?.toSatkerId || null,
        body?.from_satker_name || body?.fromSatkerName || null,
        body?.to_satker_name || body?.toSatkerName || null,
        body?.note || null,
        JSON.stringify(body?.payload_json || body?.payloadJson || {}),
        body?.created_by_id || body?.createdById || null,
        body?.created_by_name || body?.createdByName || null,
      ],
    );

    return {
      status: 1,
      message: 'Riwayat LP berhasil disimpan',
      data: rows[0],
    };
  }
  async reportStatus(body: any) {
    const lpMasterId = Number(body?.lp_master_id || body?.lpMasterId || 0);
    const status = String(body?.status || '').trim();
    const documentNumber = String(body?.document_number || body?.documentNumber || '').trim();
    const documentDate = body?.document_date || body?.documentDate || null;
    const documentTimezone = body?.document_timezone || body?.documentTimezone || 'WIB';
    const note = body?.note || null;
    const statusReason = String(body?.status_reason || body?.statusReason || '').trim();

    if (!lpMasterId || !status || !documentDate) {
      return {
        status: 0,
        message: 'LP, jenis perkembangan, dan tanggal dokumen wajib diisi',
        data: null,
      };
    }

    const normalizeStatus = (value: any) => String(value || '').trim().toUpperCase();

    const nextStatus = normalizeStatus(status);
    const allowedStatuses: Record<string, string> = {
      'PENYELIDIKAN': 'Penyelidikan',
      'PENYIDIKAN': 'Penyidikan',
      'SPDP': 'SPDP',
      'P-19': 'P-19',
      'TAHAP I': 'Tahap I',
      'P-21': 'P-21',
      'TAHAP II': 'Tahap II',
      'HENTI LIDIK / SP2LID': 'Henti Lidik / SP2Lid',
      'HENTI SIDIK / SP3': 'Henti Sidik / SP3',
    };

    if (!allowedStatuses[nextStatus]) {
      return {
        status: 0,
        message: `Status perkembangan tidak valid: ${status}`,
        data: null,
      };
    }

    const lpRows = await this.dataSource.query(
      `
      select id, status, coalesce(is_distributed, false) as is_distributed
      from bdb_lp_master
      where id = $1
      limit 1
      `,
      [lpMasterId],
    );

    if (!lpRows.length) {
      return { status: 0, message: 'LP tidak ditemukan', data: null };
    }

    if (lpRows[0].is_distributed !== true) {
      return {
        status: 0,
        message: 'LP belum didistribusikan ke unit penanganan perkara. Laporkan perkembangan setelah distribusi.',
        data: null,
      };
    }

    const currentStatus = normalizeStatus(lpRows[0].status);
    const finalStatuses = ['TAHAP II', 'HENTI LIDIK / SP2LID', 'HENTI SIDIK / SP3'];

    if (finalStatuses.includes(currentStatus)) {
      return {
        status: 0,
        message: `Status perkara sudah final: ${lpRows[0].status}`,
        data: null,
      };
    }

    if (currentStatus === nextStatus) {
      return {
        status: 0,
        message: `Status perkara sudah berada pada tahap ${allowedStatuses[nextStatus]}`,
        data: null,
      };
    }

    const allowedPrevious: Record<string, string[]> = {
      'PENYELIDIKAN': ['', 'AKTIF', 'ACTIVE'],
      'PENYIDIKAN': ['PENYELIDIKAN'],
      'SPDP': ['PENYIDIKAN'],
      'P-19': ['SPDP'],
      'TAHAP I': ['P-19'],
      'P-21': ['TAHAP I'],
      'TAHAP II': ['P-21'],
      'HENTI LIDIK / SP2LID': ['PENYELIDIKAN'],
      'HENTI SIDIK / SP3': ['PENYIDIKAN', 'SPDP', 'P-19', 'TAHAP I', 'P-21'],
    };

    if (!allowedPrevious[nextStatus].includes(currentStatus)) {
      const currentLabel = currentStatus ? lpRows[0].status : 'Belum ada perkembangan';
      return {
        status: 0,
        message: `Alur perkembangan tidak sesuai. Status sekarang: ${currentLabel}. Tidak bisa langsung ke ${allowedStatuses[nextStatus]}.`,
        data: null,
      };
    }

    if (
      ['HENTI LIDIK / SP2LID', 'HENTI SIDIK / SP3'].includes(nextStatus) &&
      !statusReason
    ) {
      return {
        status: 0,
        message: 'Alasan wajib diisi untuk SP2Lid/SP3',
        data: null,
      };
    }

    await this.dataSource.query(
      `
      update bdb_lp_master
      set status = $2,
          updated_at = now()
      where id = $1
      `,
      [lpMasterId, allowedStatuses[nextStatus]],
    );

    const reasonText = statusReason ? ` dengan alasan ${statusReason}` : '';

    const eventText = documentNumber
      ? `Pada tanggal ${documentDate} telah dibuat ${allowedStatuses[nextStatus]} nomor ${documentNumber}${reasonText}`
      : `Pada tanggal ${documentDate} status perkara menjadi ${allowedStatuses[nextStatus]}${reasonText}`;

    const rows = await this.dataSource.query(
      `
      insert into bdb_lp_history_logs (
        lp_master_id,
        event_type,
        event_status,
        event_text,
        document_type,
        document_number,
        document_date,
        document_timezone,
        note,
        payload_json
      )
      values (
        $1, 'STATUS', $2, $3, $4, $5, $6, coalesce($7, 'WIB'), $8, $9::jsonb
      )
      returning *
      `,
      [
        lpMasterId,
        allowedStatuses[nextStatus],
        eventText,
        allowedStatuses[nextStatus],
        documentNumber || null,
        documentDate,
        documentTimezone,
        note,
        JSON.stringify({
          ...body,
          previous_status: lpRows[0].status,
          status_reason: statusReason || null,
        }),
      ],
    );

    return {
      status: 1,
      message: 'Perkembangan LP berhasil disimpan',
      data: rows[0],
    };
  }
  async getDistributionTargets(filter: any) {
    const domain = String(filter?.domain || '').trim();
    const subDomain = String(filter?.subDomain || '').trim();
    const level = String(filter?.level || '').trim();
    const search = String(filter?.search || '').trim();

    const rows = await this.dataSource.query(
      `
      select
        id,
        nama_satker_canonical as nama,
        domain,
        sub_domain,
        level,
        dors_kode,
        satker_key,
        source_type,
        manual_code,
        operational_role,
        is_holding_node
      from bdb_satker_master
      where ($1 = '' or domain = $1)
        and ($2 = '' or sub_domain = $2)
        and ($3 = '' or level = $3)
        and coalesce(level, '') not in ('Polda', 'Polres', 'Polsek')
        and (
          coalesce(sub_domain, '') <> 'INTERNAL RESERSE'
          or upper(coalesce(nama_satker_canonical, '')) like 'DITRES%'
          or upper(coalesce(nama_satker_canonical, '')) like 'SATRES%'
          or upper(coalesce(nama_satker_canonical, '')) like 'UNITRES%'
          or upper(coalesce(nama_satker_canonical, '')) like 'DITTIPID%'
          or upper(coalesce(nama_satker_canonical, '')) like 'ROBINOPS%'
          or upper(coalesce(nama_satker_canonical, '')) like 'BAGBINOPS%'
          or upper(coalesce(nama_satker_canonical, '')) like 'URBINOPS%'
          or upper(coalesce(nama_satker_canonical, '')) like 'SUBBAGBINOPS%'
          or upper(coalesce(nama_satker_canonical, '')) like 'SPKT%'
          or upper(coalesce(nama_satker_canonical, '')) like 'BDB-%'
          or upper(coalesce(nama_satker_canonical, '')) like '%BDB-%'
          or upper(coalesce(satker_key, '')) like '%BDB-%'
        )
        and (
          $4 = ''
          or lower(coalesce(nama_satker_canonical, '')) like '%' || lower($4) || '%'
          or lower(coalesce(dors_kode, '')) like '%' || lower($4) || '%'
          or lower(coalesce(satker_key, '')) like '%' || lower($4) || '%'
        )
      order by nama_satker_canonical asc
      `,
      [domain, subDomain, level, search],
    );

    return { data: rows, meta: { total: rows.length } };
  }

  async distributeLp(body: any) {
    const lpMasterId = Number(body?.lp_master_id || body?.lpMasterId || 0);
    const targetSatkerId = Number(body?.target_satker_id || body?.targetSatkerId || 0);
    const documentType = String(body?.document_type || body?.documentType || '').trim();
    const documentNumber = String(body?.document_number || body?.documentNumber || '').trim();
    const documentDate = body?.document_date || body?.documentDate || null;
    const documentTimezone = body?.document_timezone || body?.documentTimezone || 'WIB';
    const note = body?.note || null;

    if (!lpMasterId || !targetSatkerId || !documentType || !documentNumber || !documentDate) {
      return {
        status: 0,
        message: 'LP, jenis dokumen, nomor dokumen, tanggal dokumen, dan tujuan distribusi wajib diisi',
        data: null,
      };
    }

    return this.dataSource.transaction(async (manager) => {
      const lpRows = await manager.query(
        `
        select
          lp.id,
          lp.satker_master_id,
          lp.operational_satker_id,
          coalesce(osm.id, sm.id) as from_satker_id,
          coalesce(osm.nama_satker_canonical, sm.nama_satker_canonical) as from_satker_name
        from bdb_lp_master lp
        left join bdb_satker_master sm on sm.id = lp.satker_master_id
        left join bdb_satker_master osm on osm.id = lp.operational_satker_id
        where lp.id = $1
        limit 1
        `,
        [lpMasterId],
      );

      const targetRows = await manager.query(
        `
        select id, nama_satker_canonical, level, sub_domain, satker_key, source_type, manual_code, operational_role, coalesce(is_holding_node, false) as is_holding_node
        from bdb_satker_master
        where id = $1
        limit 1
        `,
        [targetSatkerId],
      );

      if (!lpRows.length || !targetRows.length) {
        return { status: 0, message: 'LP atau satker tujuan tidak ditemukan', data: null };
      }

      const targetNameUpper = String(targetRows[0].nama_satker_canonical || '').toUpperCase();
      const targetLevel = String(targetRows[0].level || '');
      const targetSubDomain = String(targetRows[0].sub_domain || '');
      const targetIsHoldingNode = targetRows[0].is_holding_node === true;
      const targetSourceType = String(targetRows[0].source_type || '').toUpperCase();
      const targetSatkerKeyUpper = String(targetRows[0].satker_key || '').toUpperCase();
      const targetIsBdbNode = targetSourceType === 'BDB' || targetSatkerKeyUpper.includes('BDB:') || targetSatkerKeyUpper.includes('BDB-');

      if (['Polda', 'Polres', 'Polsek'].includes(targetLevel)) {
        return {
          status: 0,
          message: 'Tujuan distribusi tidak boleh hanya Polda/Polres/Polsek. Pilih DITRES/SATRES/UNITRES atau holding bucket yang tersedia.',
          data: null,
        };
      }

      if (
        targetSubDomain === 'INTERNAL RESERSE' &&
        !(
          targetNameUpper.startsWith('DITRES') ||
          targetNameUpper.startsWith('SATRES') ||
          targetNameUpper.startsWith('UNITRES') ||
          targetNameUpper.startsWith('DITTIPID') ||
          targetNameUpper.startsWith('ROBINOPS') ||
          targetNameUpper.startsWith('BAGBINOPS') ||
          targetNameUpper.startsWith('URBINOPS') ||
          targetNameUpper.startsWith('SUBBAGBINOPS') ||
          targetNameUpper.startsWith('SPKT') ||
          targetNameUpper.startsWith('BDB-') ||
          targetNameUpper.includes('BDB-') ||
          targetIsBdbNode
        )
      ) {
        return {
          status: 0,
          message: 'Tujuan INTERNAL RESERSE harus DITRES/SATRES/UNITRES atau holding bucket Binops/Robinops yang tersedia.',
          data: null,
        };
      }

      const fromSatkerId = lpRows[0].from_satker_id || null;
      const fromSatkerName = lpRows[0].from_satker_name || '-';
      const toSatkerName = targetRows[0].nama_satker_canonical || '-';

      await manager.query(
        `
        update bdb_lp_master
        set operational_satker_id = $2,
            is_distributed = $3,
            distributed_at = case when $3 = true then $4::timestamp else null end,
            updated_at = now()
        where id = $1
        `,
        [lpMasterId, targetSatkerId, !targetIsHoldingNode, documentDate],
      );

      const eventText = `Pada tanggal ${documentDate} telah didistribusikan dari ${fromSatkerName} ke ${toSatkerName}`;

      const historyRows = await manager.query(
        `
        insert into bdb_lp_history_logs (
          lp_master_id,
          event_type,
          event_status,
          event_text,
          document_type,
          document_number,
          document_date,
          document_timezone,
          from_satker_id,
          to_satker_id,
          from_satker_name,
          to_satker_name,
          note,
          payload_json
        )
        values (
          $1, 'DISTRIBUSI', 'DISTRIBUSI', $2, $3, $4, $5, coalesce($6, 'WIB'),
          $7, $8, $9, $10, $11, $12::jsonb
        )
        returning *
        `,
        [
          lpMasterId,
          eventText,
          documentType,
          documentNumber,
          documentDate,
          documentTimezone,
          fromSatkerId,
          targetSatkerId,
          fromSatkerName,
          toSatkerName,
          note,
          JSON.stringify(body || {}),
        ],
      );

      return {
        status: 1,
        message: 'Distribusi LP berhasil disimpan',
        data: historyRows[0],
      };
    });
  }
  async rollbackLastEvent(body: any) {
    const lpMasterId = Number(body?.lp_master_id || body?.lpMasterId || 0);
    const reason = String(body?.reason || body?.void_reason || '').trim();

    if (!lpMasterId || !reason) {
      return { status: 0, message: 'LP dan alasan rollback wajib diisi.', data: null };
    }

    return this.dataSource.transaction(async (manager) => {
      const targetRows = await manager.query(
        `
        select *
        from bdb_lp_history_logs
        where lp_master_id = $1
          and coalesce(is_voided, false) = false
          and event_type in ('DISTRIBUSI', 'STATUS')
        order by id desc
        limit 1
        `,
        [lpMasterId],
      );

      if (!targetRows.length) {
        return { status: 0, message: 'Tidak ada event yang bisa di-rollback.', data: null };
      }

      const target = targetRows[0];

      await manager.query(
        `
        update bdb_lp_history_logs
        set is_voided = true,
            voided_at = now(),
            void_reason = $2
        where id = $1
        `,
        [target.id, reason],
      );

      const rollbackRows = await manager.query(
        `
        insert into bdb_lp_history_logs (
          lp_master_id, event_type, event_status, event_text,
          document_type, document_number, document_date, document_timezone,
          note, payload_json, created_at
        )
        values (
          $1, 'ROLLBACK', 'ROLLBACK',
          'Rollback event #' || $2 || ' (' || $3 || ' - ' || coalesce($4, '-') || '): ' || $5,
          'Rollback', null, now(), 'WIB',
          $5,
          jsonb_build_object(
            'rollback_target_event_id', $2,
            'rollback_target_type', $3,
            'rollback_target_status', $4,
            'reason', $5
          ),
          now()
        )
        returning *
        `,
        [lpMasterId, target.id, target.event_type, target.event_status, reason],
      );

      await manager.query(
        `update bdb_lp_history_logs set voided_by_event_id = $2 where id = $1`,
        [target.id, rollbackRows[0].id],
      );

      const statusRows = await manager.query(
        `
        select event_status
        from bdb_lp_history_logs
        where lp_master_id = $1
          and coalesce(is_voided, false) = false
          and event_type = 'STATUS'
        order by id desc
        limit 1
        `,
        [lpMasterId],
      );

      const nextStatus = statusRows[0]?.event_status || 'AKTIF';

      const distRows = await manager.query(
        `
        select h.to_satker_id, h.document_date, coalesce(s.is_holding_node, false) as is_holding_node
        from bdb_lp_history_logs h
        left join bdb_satker_master s on s.id = h.to_satker_id
        where h.lp_master_id = $1
          and coalesce(h.is_voided, false) = false
          and h.event_type = 'DISTRIBUSI'
        order by h.id desc
        limit 1
        `,
        [lpMasterId],
      );

      if (!distRows.length) {
        await manager.query(
          `
          update bdb_lp_master
          set status = $2,
              operational_satker_id = null,
              is_distributed = false,
              distributed_at = null,
              updated_at = now()
          where id = $1
          `,
          [lpMasterId, nextStatus],
        );
      } else {
        const dist = distRows[0];
        const nextIsDistributed = dist.is_holding_node !== true;

        await manager.query(
          `
          update bdb_lp_master
          set status = $2,
              operational_satker_id = $3,
              is_distributed = $4,
              distributed_at = case when $4 = true then $5::timestamp else null end,
              updated_at = now()
          where id = $1
          `,
          [lpMasterId, nextStatus, dist.to_satker_id, nextIsDistributed, dist.document_date],
        );
      }

      return {
        status: 1,
        message: 'Rollback event terakhir berhasil disimpan',
        data: rollbackRows[0],
      };
    });
  }
  async updateLpDetail(body: any) {
    const lpMasterId = Number(body?.lp_master_id || body?.lpMasterId || 0);
    const uraianOperasionalRaw = body?.uraian_singkat ?? body?.uraianSingkat ?? null;
    const tingkatKesulitanRaw = String(body?.tingkat_kesulitan || body?.tingkatKesulitan || 'Belum dipilih').trim();

    const allowedDifficulty = ['Belum dipilih', 'Mudah', 'Sedang', 'Sulit', 'Sangat Sulit'];
    const tingkatKesulitan = allowedDifficulty.includes(tingkatKesulitanRaw)
      ? tingkatKesulitanRaw
      : 'Belum dipilih';

    if (!lpMasterId) {
      return { status: 0, message: 'LP tidak valid', data: null };
    }

    const uraianOperasional =
      typeof uraianOperasionalRaw === 'string' && uraianOperasionalRaw.trim()
        ? uraianOperasionalRaw.trim()
        : null;

    // UPDATE ... RETURNING via DataSource.query() balikin tuple [rows[], affectedCount], bukan array baris langsung.
    const [rows] = await this.dataSource.query(
      `
      update bdb_lp_master
      set uraian_singkat_operasional = $2,
          tingkat_kesulitan = nullif($3, 'Belum dipilih'),
          detail_updated_at = now(),
          updated_at = now()
      where id = $1
      returning
        id,
        nomor_lp,
        coalesce(uraian_singkat_operasional, uraian_singkat) as uraian_singkat,
        uraian_singkat as uraian_singkat_dors,
        uraian_singkat_operasional,
        coalesce(tingkat_kesulitan, 'Belum dipilih') as tingkat_kesulitan
      `,
      [lpMasterId, uraianOperasional, tingkatKesulitan],
    );

    if (!rows.length) {
      return { status: 0, message: 'LP tidak ditemukan', data: null };
    }

    return {
      status: 1,
      message: 'Detail LP berhasil disimpan',
      data: rows[0],
    };
  }
}





















