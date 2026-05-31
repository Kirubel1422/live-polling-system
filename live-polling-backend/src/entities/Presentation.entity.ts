import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./User.entity";
import { SlideEntity } from "./Slide.entity";
import { LiveSessionEntity } from "./LiveSession.entity";
import { TemplateEntity } from "./Template.entity";

export type PresentationStatus = "draft" | "published" | "archived";

/**
 * Embeddable theme object stored as JSONB.
 * Matches frontend SlideTheme interface exactly.
 */
export interface SlideThemeJson {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily?: string;
}

@Entity("presentations")
export class PresentationEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true, type: "text" })
  description?: string | null;

  @Column({ type: "varchar", nullable: true })
  thumbnail?: string | null;

  @Column({ type: "varchar", default: "draft" })
  status!: PresentationStatus;

  /**
   * Global theme for the presentation.
   * Each slide can override with its own theme.
   */
  @Column({ type: "jsonb", nullable: false })
  theme!: SlideThemeJson;

  /**
   * Short alphanumeric join code for participants.
   * Generated when the presentation is published/live.
   */
  @Column({ type: "varchar", nullable: true, unique: true })
  joinCode?: string | null;

  /** Whether this presentation was generated via AI */
  @Column({ default: false })
  isAIGenerated!: boolean;

  // ── Relations ────────────────────────────────────────────
  @ManyToOne(() => UserEntity, (user) => user.presentations, {
    onDelete: "CASCADE",
    nullable: true, // nullable until auth is wired
    eager: false,
  })
  @JoinColumn({ name: "owner_id" })
  owner?: UserEntity;

  @Column({ nullable: true })
  ownerId?: string;

  @OneToMany(() => SlideEntity, (slide) => slide.presentation, {
    cascade: true,
    eager: false,
  })
  slides!: SlideEntity[];

  @OneToMany(() => LiveSessionEntity, (session) => session.presentation, {
    eager: false,
  })
  sessions!: LiveSessionEntity[];

  /** The template this presentation was created from, if any */
  @ManyToOne(() => TemplateEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "template_id" })
  template?: TemplateEntity | null;

  @Column({ type: "uuid", nullable: true })
  templateId?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
