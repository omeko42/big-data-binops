import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Polda } from '@bareskrim/data_master/entities/hirarki/polda.entity';
import { Pasal } from '@bareskrim/data_master/entities/laporan/pasal.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('ac_judol')
export class Judol {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @ManyToOne(() => Polda, Polda => Polda.Judol, { onDelete: 'SET NULL' })
    Polda: Polda;

    @Column({ type: 'date', nullable: true })
    tanggal: string;

    @ManyToOne(() => Pasal, Pasal => Pasal.Judol, { onDelete: 'SET NULL' })
    Pasal: Pasal;

    @Column({ type: 'bigint', nullable: true })
    jumlah_laporan: number;

    @Column({ type: 'bigint', nullable: true })
    jumlah_tersangka: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_u_15_30: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_u_31_60: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_laki_laki: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_perempuan: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_pns: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_swasta: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_tni: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_polri: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_publik_figur: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_peran_pemain: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_peran_penyelenggara: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_peran_endorse: number;

    @Column({ type: 'bigint', nullable: true })
    tersangka_peran_lainnya: number;

    @Column({ type: 'bigint', nullable: true })
    status_sp3: number;

    @Column({ type: 'bigint', nullable: true })
    status_p21: number;

    @Column({ type: 'bigint', nullable: true })
    status_limpah: number;

    @Column({ type: 'bigint', nullable: true })
    ajuan_blokir_situs: number;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
