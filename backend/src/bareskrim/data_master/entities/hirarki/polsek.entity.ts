import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { Polres } from './polres.entity';
import { Polda } from './polda.entity';
import { Provinsi } from '../lokasi/provinsi.entity';
import { Kabupaten } from '../lokasi/kabupaten.entity';
import { Kecamatan } from '../lokasi/kecamatan.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Report } from '@bareskrim/report/entities/report.entity';

@Entity('cm_polsek')
export class Polsek {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    code: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    polsek_polisiku: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_polsek_new: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_kota: string;

    @Column({ type: 'text', nullable: true })
    alamat: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nama: string;

    @Column({ type: 'bigint', nullable: true })
    jml_penduduk: number;

    @Column({ type: 'boolean', nullable: true })
    is_penerima_lp: boolean;

    @Column({ type: 'boolean', nullable: true })
    is_sp2hp_online: boolean;

    @Column({ type: 'bigint', nullable: true })
    jml_pers_riil: number;

    @Column({ type: 'bigint', nullable: true })
    jml_pers_dsp: number;

    @Column({ type: 'bigint', nullable: true })
    jml_kel: number;

    @Column({ type: 'bigint', nullable: true })
    jml_desa: number;

    @Column({ type: 'boolean', nullable: true })
    status_aktif: boolean;

    @Column({ type: 'decimal', precision: 15, scale: 6, nullable: true })
    lat: number;

    @Column({ type: 'decimal', precision: 15, scale: 6, nullable: true })
    lon: number;

    @Column({ type: 'float', nullable: true })
    luas_wilayah: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    telpon: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    alamat_web: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nrp_kepala: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_polda_new: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_depkeu: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_pusiknas: string;

    // Relasi ManyToOne ke Polres
    @ManyToOne(() => Polres, Polres => Polres.Polsek, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Polres: Polres; // Properti yang menghubungkan Polsek dengan Polres

    // Relasi ManyToOne ke Polda
    @ManyToOne(() => Polda, Polda => Polda.Polsek, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Polda: Polda; // Properti yang menghubungkan Polsek dengan Polda

    @ManyToOne(() => Provinsi, Provinsi => Provinsi.Polsek, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Provinsi: Provinsi;

    @ManyToOne(() => Kabupaten, Kabupaten => Kabupaten.Polsek, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Kabupaten: Kabupaten;

    @ManyToOne(() => Kecamatan, Kecamatan => Kecamatan.Polsek, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Kecamatan: Kecamatan;

    @OneToMany(() => Report, Report => Report.Polsek, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Report: Report[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
