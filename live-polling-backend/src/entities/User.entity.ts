import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { PresentationEntity } from "./Presentation.entity";

export type UserRole = "presenter" | "participant" | "admin";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ type: "varchar", default: "presenter" })
  role!: UserRole;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @OneToMany(() => PresentationEntity, (p) => p.owner, { lazy: true })
  presentations!: PresentationEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
