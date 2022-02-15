import { Permission } from "src/permission/permission.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Permission, {cascade: true}) // cascade => pas apus records pada role, relasi many to many juga akan didelete
    @JoinTable({
        // generate kolom untuk mapping role_id dengan permission_id
        name: 'role_permissions',
        joinColumn: {name: 'role_id', referencedColumnName: 'id'}, // role_id sebagai pk
        inverseJoinColumn: {name: 'permission_id', referencedColumnName: 'id'} // permission_id sebagai pk
    })
    permissions: Permission[];
}