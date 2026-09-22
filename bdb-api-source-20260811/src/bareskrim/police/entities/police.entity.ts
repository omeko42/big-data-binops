import { User } from '@app_core/auth/user/entities/user.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('trb_police')
export class Police {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nrp: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nama: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    jenis_kelamin: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pangkat: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    jabatan: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    satuan: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    no_hp: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    foto: string;

    @OneToOne(() => User, User => User.Police) // note: we will create author property in the Photo class below
    User: User;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
