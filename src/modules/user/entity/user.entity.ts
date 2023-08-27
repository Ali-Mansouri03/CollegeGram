import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserId } from "../model/user.id";
import { UserEmail } from "../model/user.email";
import { userName } from "../model/user.username";


@Entity("users")
export class UserEntity {
    @PrimaryColumn()
    id!: UserId;

    @Column()
    email!: UserEmail;

    @Column()
    username!: userName;

    @Column()
    password!: string;

    @Column()
    firsrName?: string;

    @Column()
    lastName?: string;

    @Column()
    bio?: string;

    @Column()
    avatar?: string;

    @Column()
    isPrivate!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}