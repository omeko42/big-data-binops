import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { Polres } from './polres.entity';
import { Polsek } from './polsek.entity';
import { Provinsi } from '../lokasi/provinsi.entity';
import { Kecamatan } from '../lokasi/kecamatan.entity';
import { Kabupaten } from '../lokasi/kabupaten.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Report } from '@bareskrim/report/entities/report.entity';
import { Judol } from '@bareskrim/asta_cita/entities/judol.entity';

@Entity('cm_polda')
export class Polda {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    code: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nama: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    status: string;

    @Column({ type: 'text', nullable: true })
    alamat: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    telpon: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nrp_kepala: string;

    @Column({ type: 'decimal', precision: 15, scale: 6, nullable: true })
    lat: number;

    @Column({ type: 'decimal', precision: 15, scale: 6, nullable: true })
    lon: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    singkat: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    abbr: string;

    @Column({ type: 'bigint', nullable: true })
    jml_penduduk: number;

    @Column({ type: 'boolean', nullable: true })
    is_sp2hp_online: boolean;

    @Column({ type: 'int', nullable: true })
    kode_kota: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_depkeu: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_pusiknas: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_polda_new: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    polda_polisiku: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    siaga_a_nama: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    siaga_a_pangkat: string;

    @Column({ type: 'bigint', nullable: true })
    siaga_a_nrp: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    siaga_b_nama: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    siaga_b_pangkat: string;

    @Column({ type: 'bigint', nullable: true })
    siaga_b_nrp: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    siaga_c_nama: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    siaga_c_pangkat: string;

    @Column({ type: 'bigint', nullable: true })
    siaga_c_nrp: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    alamat_web: string;

    @Column({ type: 'bigint', nullable: true })
    luas_wilayah: number;

    @Column({ type: 'bigint', nullable: true })
    jml_pers_dsp: number;

    @Column({ type: 'bigint', nullable: true })
    jml_pers_riil: number;

    @Column({ type: 'bigint', nullable: true })
    jml_kel: number;

    @Column({ type: 'bigint', nullable: true })
    jml_desa: number;

    @Column({ type: 'boolean', nullable: true })
    status_aktif: boolean;

    @OneToMany(() => Polres, Polres => Polres.Polda, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Polres: Polres[];

    @OneToMany(() => Polsek, Polsek => Polsek.Polda, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Polsek: Polsek[];

    @ManyToOne(() => Provinsi, Provinsi => Provinsi.Polda, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Provinsi: Provinsi;

    @ManyToOne(() => Kabupaten, Kabupaten => Kabupaten.Polda, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Kabupaten: Kabupaten;

    @ManyToOne(() => Kecamatan, Kecamatan => Kecamatan.Polda, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Kecamatan: Kecamatan;

    @OneToMany(() => Report, Report => Report.Polda, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Report: Report[];

    @OneToMany(() => Judol, Judol => Judol.Polda, {
        onDelete: 'SET NULL',
        nullable: true
    })
    Judol: Judol[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
