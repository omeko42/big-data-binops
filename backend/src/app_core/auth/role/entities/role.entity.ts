import { Permission } from '@app_core/auth/permission/entities/permission.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auth_role')
export class Role {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @ManyToMany(() => Permission, Permission => Permission.Role)
    @JoinTable()
    Permission: Permission[];
}
