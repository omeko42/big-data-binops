import fs from 'fs';

const filePath = 'pihak-sering-terlibat-fix-20260927/be/src/bdb/pihak-terlibat/pihak-terlibat.service.ts';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Update refreshAllTimeSnapshot - raw_dors
code = code.replace(
  `                        SELECT 
                            lp.id as lp_id,
                            lp.satker_id,
                            upper(trim(t.nama)) as nama,`,
  `                        SELECT 
                            lp.id as lp_id,
                            coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                            case 
                                when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                                when d.id_polda is not null then d.id_polda
                                else '060.01.00'
                            end as wilayah_kode,
                            upper(trim(t.nama)) as nama,`
);

code = code.replace(
  `                        FROM bdb_laporan_polisi lp
                        JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                        JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
                        WHERE lp.deleted_at IS NULL`,
  `                        FROM bdb_laporan_polisi lp
                        JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                        JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
                        LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                        WHERE lp.deleted_at IS NULL`
);

// 2. Update refreshAllTimeSnapshot - raw_tsk
code = code.replace(
  `                        SELECT 
                            d.lp_id,
                            lp.satker_id,
                            upper(trim(item->>'nama')) as nama,`,
  `                        SELECT 
                            d.lp_id,
                            coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                            case 
                                when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                                else '060.01.00'
                            end as wilayah_kode,
                            upper(trim(item->>'nama')) as nama,`
);

code = code.replace(
  `                        FROM bdb_dokumen d
                        JOIN bdb_document_type_master dt ON dt.id = d.document_type_id AND dt.code = 'PENETAPAN_TSK'
                        LEFT JOIN bdb_laporan_polisi lp ON lp.id = d.lp_id
                        CROSS JOIN LATERAL jsonb_array_elements`,
  `                        FROM bdb_dokumen d
                        JOIN bdb_document_type_master dt ON dt.id = d.document_type_id AND dt.code = 'PENETAPAN_TSK'
                        LEFT JOIN bdb_laporan_polisi lp ON lp.id = d.lp_id
                        LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                        CROSS JOIN LATERAL jsonb_array_elements`
);

// 3. Update refreshAllTimeSnapshot - person_agg
const oldPersonAgg = `                            count(distinct satker_id)::int as jumlah_satker_unik,
                            min(satker_tier)::int as satker_tier,
                            (count(distinct satker_id) > 1 OR min(satker_tier) != max(satker_tier)) as is_lintas_wilayah,
                            (array_agg(satker_nama order by satker_tier asc))[1] as satker_nama_tertinggi,
                            string_agg(distinct satker_nama, ', ') as daftar_satker,
                            max(seen_at) as last_seen,
                            (
                                (case when (count(distinct satker_id) > 1 OR min(satker_tier) != max(satker_tier)) then 10000 else 0 end)
                                + (case when min(satker_tier) = 1 then 5000 when min(satker_tier) = 2 then 2000 when min(satker_tier) = 3 then 1000 else 0 end)
                                + (count(distinct satker_id) * 100)
                                + (count(distinct lp_id) * 10)
                            )::int as nasional_score`;

const newPersonAgg = `                            count(distinct satker_id)::int as jumlah_satker_unik,
                            count(distinct wilayah_kode)::int as jumlah_polda_unik,
                            min(satker_tier)::int as satker_tier,
                            (count(distinct wilayah_kode) > 1) as is_lintas_wilayah,
                            (array_agg(satker_nama order by satker_tier asc))[1] as satker_nama_tertinggi,
                            string_agg(distinct satker_nama, ', ') as daftar_satker,
                            max(seen_at) as last_seen,
                            (
                                (case 
                                    when count(distinct case when keterlibatan = 'DPO' then lp_id end) > 0 
                                        then 100000 + (count(distinct case when keterlibatan = 'DPO' then lp_id end) * 10000)
                                    when count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) > 0 
                                        then 50000 + (count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) * 5000)
                                    when count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) > 0 
                                        then 20000 + (count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) * 2000)
                                    when count(distinct case when keterlibatan = 'SAKSI' then lp_id end) > 0 
                                        then 500 + (count(distinct case when keterlibatan = 'SAKSI' then lp_id end) * 10)
                                    when count(distinct case when keterlibatan = 'KORBAN' then lp_id end) > 0 
                                        then 200 + (count(distinct case when keterlibatan = 'KORBAN' then lp_id end) * 5)
                                    when count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) > 0 
                                        then 100 + (count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) * 5)
                                    else 0 
                                end)
                                + (case when count(distinct wilayah_kode) > 1 then 25000 + (count(distinct wilayah_kode) * 5000) else 0 end)
                                + (count(distinct satker_id) * 300)
                                + (case when min(satker_tier) = 1 then 5000 when min(satker_tier) = 2 then 2000 when min(satker_tier) = 3 then 500 else 0 end)
                                + (count(distinct lp_id) * 50)
                            )::int as nasional_score`;

code = code.replace(oldPersonAgg, newPersonAgg);

// 4. Update refreshAllTimeSnapshot - raw_corp
code = code.replace(
  `WITH raw_corp AS (
                    SELECT 
                        lp.id as lp_id,
                        lp.satker_id,
                        regexp_replace(regexp_replace(upper(trim(t.nama)), '^(PT|CV|UD)[.]?\\s*', '\\1 '), '\\s+', ' ', 'g') as norm_nama,`,
  `WITH raw_corp AS (
                    SELECT 
                        lp.id as lp_id,
                        coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                        case 
                            when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                            when d.id_polda is not null then d.id_polda
                            else '060.01.00'
                        end as wilayah_kode,
                        regexp_replace(regexp_replace(upper(trim(t.nama)), '^(PT|CV|UD)[.]?\\s*', '\\1 '), '\\s+', ' ', 'g') as norm_nama,`
);

code = code.replace(
  `                    FROM bdb_laporan_polisi lp
                    JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                    JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
                    WHERE lp.deleted_at IS NULL
                      AND (
                        upper(trim(t.nama)) ~ '^(PT[ .]|CV[ .]|UD[ .]|YAYASAN |KOPERASI |BANK |PERUM |PERUSAHAAN |KOP[ .]|KONSORSIUM )'`,
  `                    FROM bdb_laporan_polisi lp
                    JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                    JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
                    LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                    WHERE lp.deleted_at IS NULL
                      AND (
                        upper(trim(t.nama)) ~ '^(PT[ .]|CV[ .]|UD[ .]|YAYASAN |KOPERASI |BANK |PERUM |PERUSAHAAN |KOP[ .]|KONSORSIUM )'`
);

// 5. Update corp_agg in refreshAllTimeSnapshot and 2026 partition (all 3 occurrences)
const oldCorpAgg = `                        count(distinct satker_id)::int as jumlah_satker_unik,
                        min(satker_tier)::int as satker_tier,
                        (count(distinct satker_id) > 1 OR min(satker_tier) != max(satker_tier)) as is_lintas_wilayah,
                        (array_agg(satker_nama order by satker_tier asc))[1] as satker_nama_tertinggi,
                        string_agg(distinct satker_nama, ', ') as daftar_satker,
                        max(seen_at) as last_seen,
                        (
                            (case when (count(distinct satker_id) > 1 OR min(satker_tier) != max(satker_tier)) then 10000 else 0 end)
                            + (case when min(satker_tier) = 1 then 5000 when min(satker_tier) = 2 then 2000 when min(satker_tier) = 3 then 1000 else 0 end)
                            + (count(distinct satker_id) * 100)
                            + (count(distinct lp_id) * 10)
                        )::int as nasional_score`;

const newCorpAgg = `                        count(distinct satker_id)::int as jumlah_satker_unik,
                        count(distinct wilayah_kode)::int as jumlah_polda_unik,
                        min(satker_tier)::int as satker_tier,
                        (count(distinct wilayah_kode) > 1) as is_lintas_wilayah,
                        (array_agg(satker_nama order by satker_tier asc))[1] as satker_nama_tertinggi,
                        string_agg(distinct satker_nama, ', ') as daftar_satker,
                        max(seen_at) as last_seen,
                        (
                            (case 
                                when count(distinct case when keterlibatan = 'DPO' then lp_id end) > 0 
                                    then 100000 + (count(distinct case when keterlibatan = 'DPO' then lp_id end) * 10000)
                                when count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) > 0 
                                    then 50000 + (count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) * 5000)
                                when count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) > 0 
                                    then 20000 + (count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) * 2000)
                                when count(distinct case when keterlibatan = 'SAKSI' then lp_id end) > 0 
                                    then 500 + (count(distinct case when keterlibatan = 'SAKSI' then lp_id end) * 10)
                                when count(distinct case when keterlibatan = 'KORBAN' then lp_id end) > 0 
                                    then 200 + (count(distinct case when keterlibatan = 'KORBAN' then lp_id end) * 5)
                                when count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) > 0 
                                    then 100 + (count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) * 5)
                                else 0 
                            end)
                            + (case when count(distinct wilayah_kode) > 1 then 25000 + (count(distinct wilayah_kode) * 5000) else 0 end)
                            + (count(distinct satker_id) * 300)
                            + (case when min(satker_tier) = 1 then 5000 when min(satker_tier) = 2 then 2000 when min(satker_tier) = 3 then 500 else 0 end)
                            + (count(distinct lp_id) * 50)
                        )::int as nasional_score`;

code = code.replaceAll(oldCorpAgg, newCorpAgg);

// 6. Update 2026 partition - raw_dors
code = code.replace(
  `raw_dors AS (
                    SELECT 
                        lp.id as lp_id,
                        lp.satker_id,
                        upper(trim(t.nama)) as nama,`,
  `raw_dors AS (
                    SELECT 
                        lp.id as lp_id,
                        coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                        case 
                            when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                            when d.id_polda is not null then d.id_polda
                            else '060.01.00'
                        end as wilayah_kode,
                        upper(trim(t.nama)) as nama,`
);

code = code.replace(
  `                    FROM bdb_laporan_polisi lp
                    JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                    JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
                    WHERE lp.deleted_at IS NULL
                      AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else coalesce(d.synced_at, lp.synced_at)::date end) >= '\${startDay}'::date`,
  `                    FROM bdb_laporan_polisi lp
                    JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                    JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
                    LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                    WHERE lp.deleted_at IS NULL
                      AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else coalesce(d.synced_at, lp.synced_at)::date end) >= '\${startDay}'::date`
);

// 7. Update 2026 partition - raw_tsk
code = code.replace(
  `raw_tsk AS (
                    SELECT 
                        d.lp_id,
                        lp.satker_id,
                        upper(trim(item->>'nama')) as nama,`,
  `raw_tsk AS (
                    SELECT 
                        d.lp_id,
                        coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                        case 
                            when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                            else '060.01.00'
                        end as wilayah_kode,
                        upper(trim(item->>'nama')) as nama,`
);

code = code.replace(
  `                    FROM bdb_dokumen d
                    JOIN bdb_document_type_master dt ON dt.id = d.document_type_id AND dt.code = 'PENETAPAN_TSK'
                    LEFT JOIN bdb_laporan_polisi lp ON lp.id = d.lp_id
                    CROSS JOIN LATERAL jsonb_array_elements(
                        CASE WHEN jsonb_typeof(d.data->'tersangka') = 'array' THEN d.data->'tersangka' ELSE '[]'::jsonb END
                    ) party(item)
                    WHERE d.created_at::date >= '\${startDay}'::date`,
  `                    FROM bdb_dokumen d
                    JOIN bdb_document_type_master dt ON dt.id = d.document_type_id AND dt.code = 'PENETAPAN_TSK'
                    LEFT JOIN bdb_laporan_polisi lp ON lp.id = d.lp_id
                    LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                    CROSS JOIN LATERAL jsonb_array_elements(
                        CASE WHEN jsonb_typeof(d.data->'tersangka') = 'array' THEN d.data->'tersangka' ELSE '[]'::jsonb END
                    ) party(item)
                    WHERE d.created_at::date >= '\${startDay}'::date`
);

// 8. Update 2026 partition - raw_corp
code = code.replace(
  `raw_corp AS (
                    SELECT 
                        lp.id as lp_id,
                        lp.satker_id,
                        regexp_replace(regexp_replace(upper(trim(t.nama)), '^(PT|CV|UD)[.]?\\s*', '\\1 '), '\\s+', ' ', 'g') as norm_nama,`,
  `raw_corp AS (
                    SELECT 
                        lp.id as lp_id,
                        coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                        case 
                            when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                            when d.id_polda is not null then d.id_polda
                            else '060.01.00'
                        end as wilayah_kode,
                        regexp_replace(regexp_replace(upper(trim(t.nama)), '^(PT|CV|UD)[.]?\\s*', '\\1 '), '\\s+', ' ', 'g') as norm_nama,`
);

code = code.replace(
  `                    FROM bdb_laporan_polisi lp
                    JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                    JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
                    WHERE lp.deleted_at IS NULL
                      AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else coalesce(d.synced_at, lp.synced_at)::date end) >= '\${startDay}'::date
                      AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else coalesce(d.synced_at, lp.synced_at)::date end) <= '\${lastDay}'::date
                      AND (
                        upper(trim(t.nama)) ~ '^(PT[ .]|CV[ .]|UD[ .]|YAYASAN |KOPERASI |BANK |PERUM |PERUSAHAAN |KOP[ .]|KONSORSIUM )'`,
  `                    FROM bdb_laporan_polisi lp
                    JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                    JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
                    LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                    WHERE lp.deleted_at IS NULL
                      AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else coalesce(d.synced_at, lp.synced_at)::date end) >= '\${startDay}'::date
                      AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else coalesce(d.synced_at, lp.synced_at)::date end) <= '\${lastDay}'::date
                      AND (
                        upper(trim(t.nama)) ~ '^(PT[ .]|CV[ .]|UD[ .]|YAYASAN |KOPERASI |BANK |PERUM |PERUSAHAAN |KOP[ .]|KONSORSIUM )'`
);

// 9. Update INSERT column lists: add jumlah_polda_unik
code = code.replaceAll(
  `jumlah_satker_unik, is_lintas_wilayah, daftar_satker, nasional_score,`,
  `jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,`
);

// 10. In ranking() queries - update order clauses
code = code.replace(
  `                const orderClauseMaster = catFilter === 'ALL'
                    ? 'kasta_rank ASC, satker_tier ASC, jumlah_satker_unik DESC, total_lp DESC, last_seen DESC'
                    : (catFilter === 'TERSANGKA' ? 'count_tersangka DESC,' :
                       catFilter === 'TERLAPOR' ? 'count_terlapor DESC,' :
                       catFilter === 'PELAPOR' ? 'count_pelapor DESC,' :
                       catFilter === 'SAKSI' ? 'count_saksi DESC,' :
                       catFilter === 'KORBAN' ? 'count_korban DESC,' :
                       catFilter === 'DPO' ? 'count_dpo DESC,' : '') + ' satker_tier ASC, jumlah_satker_unik DESC, total_lp DESC, last_seen DESC';`,
  `                const orderClauseMaster = catFilter === 'ALL'
                    ? (keterlibatan === 'LINTAS_WILAYAH' 
                        ? 'jumlah_polda_unik DESC, nasional_score DESC, total_lp DESC, last_seen DESC' 
                        : 'nasional_score DESC, total_lp DESC, last_seen DESC')
                    : (catFilter === 'TERSANGKA' ? 'count_tersangka DESC, nasional_score DESC,' :
                       catFilter === 'TERLAPOR' ? 'count_terlapor DESC, nasional_score DESC,' :
                       catFilter === 'PELAPOR' ? 'count_pelapor DESC, nasional_score DESC,' :
                       catFilter === 'SAKSI' ? 'count_saksi DESC, nasional_score DESC,' :
                       catFilter === 'KORBAN' ? 'count_korban DESC, nasional_score DESC,' :
                       catFilter === 'DPO' ? 'count_dpo DESC, nasional_score DESC,' : '') + ' satker_tier ASC, total_lp DESC, last_seen DESC';`
);

code = code.replace(
  `                const orderClauseDash = catFilter === 'ALL'
                    ? 'kasta_rank ASC, satker_tier ASC, jumlah_satker_unik DESC, total_lp DESC, last_seen DESC'
                    : (catFilter === 'TERSANGKA' ? 'count_tersangka DESC,' :
                       catFilter === 'TERLAPOR' ? 'count_terlapor DESC,' :
                       catFilter === 'PELAPOR' ? 'count_pelapor DESC,' :
                       catFilter === 'SAKSI' ? 'count_saksi DESC,' :
                       catFilter === 'KORBAN' ? 'count_korban DESC,' :
                       catFilter === 'DPO' ? 'count_dpo DESC,' : '') + ' satker_tier ASC, jumlah_satker_unik DESC, total_lp DESC, last_seen DESC';`,
  `                const orderClauseDash = catFilter === 'ALL'
                    ? 'nasional_score DESC, total_lp DESC, last_seen DESC'
                    : (catFilter === 'TERSANGKA' ? 'count_tersangka DESC, nasional_score DESC,' :
                       catFilter === 'TERLAPOR' ? 'count_terlapor DESC, nasional_score DESC,' :
                       catFilter === 'PELAPOR' ? 'count_pelapor DESC, nasional_score DESC,' :
                       catFilter === 'SAKSI' ? 'count_saksi DESC, nasional_score DESC,' :
                       catFilter === 'KORBAN' ? 'count_korban DESC, nasional_score DESC,' :
                       catFilter === 'DPO' ? 'count_dpo DESC, nasional_score DESC,' : '') + ' satker_tier ASC, total_lp DESC, last_seen DESC';`
);

// Add jumlah_polda_unik to SELECT in ranking()
code = code.replaceAll(
  `jumlah_satker_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                           tipe_subjek, tipe_identitas,`,
  `jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                           tipe_subjek, tipe_identitas,`
);

// Add jumlah_polda_unik in mapping of ranking()
code = code.replace(
  `jumlah_satker_unik: Number(r.jumlah_satker_unik || 1),
                        is_lintas_wilayah: Boolean(r.is_lintas_wilayah),`,
  `jumlah_satker_unik: Number(r.jumlah_satker_unik || 1),
                        jumlah_polda_unik: Number(r.jumlah_polda_unik || 1),
                        is_lintas_wilayah: Boolean(r.is_lintas_wilayah),
                        nasional_score: Number(r.nasional_score || 0),`
);

code = code.replace(
  `jumlah_satker_unik: Number(r.jumlah_satker_unik || 1),
                            is_lintas_wilayah: Boolean(r.is_lintas_wilayah),`,
  `jumlah_satker_unik: Number(r.jumlah_satker_unik || 1),
                            jumlah_polda_unik: Number(r.jumlah_polda_unik || 1),
                            is_lintas_wilayah: Boolean(r.is_lintas_wilayah),
                            nasional_score: Number(r.nasional_score || 0),`
);

// Fallback ranking
code = code.replace(
  `ORDER BY kasta_rank ASC, satker_tier ASC, jumlah_satker_unik DESC, total_lp DESC, last_seen DESC
            LIMIT \${limit}`,
  `ORDER BY nasional_score DESC, total_lp DESC, last_seen DESC
            LIMIT \${limit}`
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully patched pihak-terlibat.service.ts!');
