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
export type AuthProvider = "local" | "google" | "github";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: "varchar", default: "local" })
  provider!: AuthProvider;

  @Column({ nullable: true })
  providerId?: string;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ type: "varchar", default: "presenter" })
  role!: UserRole;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ default: true })
  emailNotifications!: boolean;

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ nullable: true })
  resetPasswordExpires?: Date;

  @Column({ nullable: true })
  emailVerificationToken?: string;

  @OneToMany(() => PresentationEntity, (p) => p.owner, { lazy: true })
  presentations!: PresentationEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
