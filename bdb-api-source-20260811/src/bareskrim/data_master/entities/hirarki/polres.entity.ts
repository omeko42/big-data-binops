import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { Polda } from './polda.entity';
import { Polsek } from './polsek.entity';
import { Provinsi } from '../lokasi/provinsi.entity';
import { Kabupaten } from '../lokasi/kabupaten.entity';
import { Kecamatan } from '../lokasi/kecamatan.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Report } from '@bareskrim/report/entities/report.entity';
@Entity('cm_polres')
export class Polres {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    code: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    polres_polisiku: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nrp_kepala: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    telpon: string;

    @Column({ type: 'decimal', precision: 15, scale: 6, nullable: true })
    lat: number;

    @Column({ type: 'decimal', precision: 15, scale: 6, nullable: true })
    lon: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_kota: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_depkeu: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_pusiknas: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_polres_new: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_polda_new: string;

    @Column({ type: 'text', nullable: true })
    alamat: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nama: string;

    @Column({ type: 'bigint', nullable: true })
    jml_penduduk: number;

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

    // Relasi ManyToOne ke Polda
    @ManyToOne(() => Polda, Polda => Polda.Polres, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Polda: Polda; // Properti yang menghubungkan Polres dengan Polda

    @OneToMany(() => Polsek, Polsek => Polsek.Polres, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Polsek: Polsek;

    @ManyToOne(() => Provinsi, Provinsi => Provinsi.Polres, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Provinsi: Provinsi;

    @ManyToOne(() => Kabupaten, Kabupaten => Kabupaten.Polres, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Kabupaten: Kabupaten;

    @ManyToOne(() => Kecamatan, Kecamatan => Kecamatan.Polres, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Kecamatan: Kecamatan;

    @OneToMany(() => Report, Report => Report.Polres, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Report: Report[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
