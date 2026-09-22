import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, Index } from 'typeorm';
import { LogImport } from './log-import.entity';
import { LogReport } from './log-report.entity';
import { Directorate } from '@bareskrim/directorate/entities/directorate.entity';
import { DirectorateReport } from './directorate-report.entity';
import { ReportStatus } from './report-status.entity';
import { ReportPelapor } from './report-pelapor.entity';
import { ReportTerlapor } from './report-terlapor.entity';
import { ReportKorban } from './report-korban.entity';
import { ReportSaksi } from './report-saksi.entity';
import { ReportPasal } from './report-pasal.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Provinsi } from '@bareskrim/data_master/entities/lokasi/provinsi.entity';
import { Kabupaten } from '@bareskrim/data_master/entities/lokasi/kabupaten.entity';
import { Kecamatan } from '@bareskrim/data_master/entities/lokasi/kecamatan.entity';
import { Desa } from '@bareskrim/data_master/entities/lokasi/desa.entity';
import { Polda } from '@bareskrim/data_master/entities/hirarki/polda.entity';
import { Polres } from '@bareskrim/data_master/entities/hirarki/polres.entity';
import { Polsek } from '@bareskrim/data_master/entities/hirarki/polsek.entity';
import { ReportBarangBukti } from './report-barang-bukti.entity';
import { GolonganKamtibmas } from '@bareskrim/data_master/entities/laporan/golongan-kamtibmas.entity';
import { JenisBarangBukti } from '@bareskrim/data_master/entities/laporan/jenis-barang-bukti.entity';
import { JenisKejahatan } from '@bareskrim/data_master/entities/laporan/jenis-kejahatan.entity';
import { KategoriLokasi } from '@bareskrim/data_master/entities/laporan/kategori-lokasi.entity';
import { ModusOperandi } from '@bareskrim/data_master/entities/laporan/modus-operandi.entity';
import { MotifKejahatan } from '@bareskrim/data_master/entities/laporan/motif-kejahatan.entity';
import { SubGolonganKamtibmas } from '@bareskrim/data_master/entities/laporan/sub-golongan-kamtibmas.entity';
import { UndangUndang } from '@bareskrim/data_master/entities/laporan/undang-undang.entity';
import { Organisasi } from 'src/orgaisasi/entity/organisasi.entity';
import { KategoriLp } from 'src/orgaisasi/entity/kategori-lp.entity';
import { KasusMenonjol } from 'src/dashboard/entity/kasus_menonjol.entity';

@Entity('trb_report')
export class Report {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'bigint', nullable: true })
    @Index()
    integration_id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @Index()
    nomor: string;

    @Column({ type: 'date', nullable: true })
    @Index()
    tanggal: string;

    @Column({ type: 'text', nullable: true })
    pasal: string;

    @Column({ type: 'text', nullable: true })
    uraian_kejadian: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pelapor: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    tersangka: string;

    @Column({ type: 'text', nullable: true })
    barang_bukti: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    tujuan_penyaluran: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    bukti_penyaluran: string;

    @Column({ type: 'date', nullable: true })
    tanggal_penyaluran: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    model_lp: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    sumber: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    ket_sumber: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    ceklist_croscek: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    status: string;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    sumber_data: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    tgl_update_penanganan: string;
    // -------------------------ews----------------------
    @Column({ type: 'text', nullable: true })
    no_sttlp: string;

    @Column({ type: 'timestamp', nullable: true })
    waktu_kejadian: string;

    @Column({ type: 'text', nullable: true })
    tempat_kejadian: string;

    @Column({ type: 'text', nullable: true })
    apa_terjadi: string;

    @Column({ type: 'text', nullable: true })
    bagaimana_terjadi: string;

    @Column({ type: 'text', nullable: true })
    uraian_singkat_kejadian: string;

    @Column({ type: 'int', nullable: true })
    id_satuan: number;

    @Column({ type: 'int', nullable: true })
    id_kantor: number;

    @Column({ type: 'text', nullable: true })
    lokasi: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nama_pembuat: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pangkat_pembuat: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nrp_pembuat: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nama_mengetahui: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pangkat_mengetahui: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nrp_mengetahui: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nama_penerima: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nrp_penerima: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pangkat_penerima: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    telpon_penerima: string;

    @Column({ type: 'varchar', nullable: true })
    email_penerima: string;

    @Column({ type: 'varchar', nullable: true })
    username_penerima: string;

    @Column({ type: 'text', nullable: true })
    keterangan: string;

    @Column({ type: 'text', nullable: true })
    catatan_kepolisian: string;

    @Column({ type: 'text', nullable: true })
    ck_barang_bukti: string;

    @Column({ type: 'text', nullable: true })
    ck_tindakan_diambil: string;

    @Column({ type: 'text', nullable: true })
    ck_tindak_pidana: string;

    @Column({ type: 'decimal', precision: 20, scale: 6, nullable: true })
    kerugian: number;

    @Column({ type: 'text', nullable: true })
    pasal_mapping_tindak_pidana: string;

    @Column({ type: 'text', nullable: true })
    ket_pasal_kamtibmas: string;

    @Column({ type: 'text', nullable: true })
    pasal_kamtibmas: string;

    @Column({ type: 'boolean', default: false })
    street_crime: boolean;

    @Column({ type: 'boolean', default: false })
    status_selesai: boolean;

    @Column({ type: 'boolean', default: false })
    kasus_menonjol: boolean;

    @Column({ type: 'boolean', default: true })
    status_aktif: boolean;

    @Column({ type: 'varchar', nullable: true })
    zona_waktu: string;

    @Column({ type: 'varchar', nullable: true })
    g_rev_formatted_address: string;

    @Column({ type: 'float', nullable: true })
    g_rev_lat: number;

    @Column({ type: 'float', nullable: true })
    g_rev_lon: number;

    @Column({ type: 'int', default: 0 })
    pelimpahan: number;

    @Column({ type: 'int', default: 0 })
    dilimpahkan: number;
    // -----------------------------------------------------------
    @OneToMany(() => LogReport, LogReport => LogReport.Report, {
        onDelete: 'SET NULL'
    })
    LogReport: LogReport[];

    @ManyToOne(() => LogImport, LogImport => LogImport.Report, {
        onDelete: 'SET NULL'
    })
    LogImport: LogImport;

    @OneToMany(() => DirectorateReport, DirectorateReport => DirectorateReport.Report, { onDelete: 'SET NULL' })
    DirectorateReport: DirectorateReport[];

    @ManyToOne(() => Directorate, Directorate => Directorate.Report, {
        onDelete: 'SET NULL'
    })
    Directorate: Directorate;

    @ManyToOne(() => Organisasi, Organisasi => Organisasi.Report, {
        onDelete: 'SET NULL'
    })
    Organisasi: Organisasi;

    @ManyToOne(() => ReportStatus, ReportStatus => ReportStatus.Report, {
        onDelete: 'SET NULL'
    })
    ReportStatus: ReportStatus;

    @ManyToOne(() => KategoriLp, KategoriLp => KategoriLp.Report, {
        onDelete: 'SET NULL'
    })
    KategoriLp: KategoriLp;

    @OneToMany(() => ReportPelapor, ReportPelapor => ReportPelapor.Report, {
        onDelete: 'SET NULL'
    })
    ReportPelapor: ReportPelapor[];

    @OneToMany(() => ReportTerlapor, ReportTerlapor => ReportTerlapor.Report, { onDelete: 'SET NULL' })
    ReportTerlapor: ReportTerlapor[];

    @OneToMany(() => ReportKorban, ReportKorban => ReportKorban.Report, {
        onDelete: 'SET NULL'
    })
    ReportKorban: ReportKorban[];

    @OneToMany(() => ReportSaksi, ReportSaksi => ReportSaksi.Report, {
        onDelete: 'SET NULL'
    })
    ReportSaksi: ReportSaksi[];

    @OneToMany(() => ReportPasal, ReportPasal => ReportPasal.Report, {
        onDelete: 'SET NULL'
    })
    ReportPasal: ReportPasal[];

    @OneToMany(() => ReportBarangBukti, ReportBarangBukti => ReportBarangBukti.Report, { onDelete: 'SET NULL' })
    ReportBarangBukti: ReportBarangBukti[];

    @ManyToOne(() => Provinsi, Provinsi => Provinsi.Report, { onDelete: 'SET NULL' })
    Provinsi: Provinsi;

    @ManyToOne(() => Kabupaten, Kabupaten => Kabupaten.Report, { onDelete: 'SET NULL' })
    Kabupaten: Kabupaten;

    @ManyToOne(() => Kecamatan, Kecamatan => Kecamatan.Report, { onDelete: 'SET NULL' })
    Kecamatan: Kecamatan;

    @ManyToOne(() => Desa, Desa => Desa.Report, { onDelete: 'SET NULL' })
    Desa: Desa;

    @ManyToOne(() => Polda, Polda => Polda.Report, { onDelete: 'SET NULL' })
    Polda: Polda;

    @ManyToOne(() => Polres, Polres => Polres.Report, { onDelete: 'SET NULL' })
    Polres: Polres;

    @ManyToOne(() => Polsek, Polsek => Polsek.Report, { onDelete: 'SET NULL' })
    Polsek: Polsek;

    @ManyToOne(() => GolonganKamtibmas, GolonganKamtibmas => GolonganKamtibmas.Report, { onDelete: 'SET NULL' })
    GolonganKamtibmas: GolonganKamtibmas;

    @ManyToOne(() => KategoriLokasi, KategoriLokasi => KategoriLokasi.Report, { onDelete: 'SET NULL' })
    KategoriLokasi: KategoriLokasi;

    @ManyToOne(() => ModusOperandi, ModusOperandi => ModusOperandi.Report, { onDelete: 'SET NULL' })
    ModusOperandi: ModusOperandi;

    @ManyToOne(() => MotifKejahatan, MotifKejahatan => MotifKejahatan.Report, { onDelete: 'SET NULL' })
    MotifKejahatan: MotifKejahatan;

    @ManyToOne(() => SubGolonganKamtibmas, SubGolonganKamtibmas => SubGolonganKamtibmas.Report, { onDelete: 'SET NULL' })
    SubGolonganKamtibmas: SubGolonganKamtibmas;

    @ManyToOne(() => JenisKejahatan, JenisKejahatan => JenisKejahatan.Report, { onDelete: 'SET NULL' })
    JenisKejahatan: JenisKejahatan;

    @OneToMany(() => KasusMenonjol, KasusMenonjol => KasusMenonjol.Report, { onDelete: 'SET NULL' })
    KasusMenonjol: KasusMenonjol[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
