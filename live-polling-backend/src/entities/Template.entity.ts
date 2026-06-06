import "reflect-metadata";
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { SlideThemeJson } from "./Presentation.entity";

/**
 * A reusable presentation template.
 * Stores a complete set of pre-configured slides as JSONB.
 * Matches the frontend Template interface.
 */
@Entity("templates")
export class TemplateEntity {
  @PrimaryColumn("varchar")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  /** e.g. "Education", "Business", "Fun" */
  @Column({ nullable: true })
  category?: string;

  /**
   * The actual slide data — stored as a JSONB array.
   * Shape: Partial<Slide>[] (matches frontend Template.slides)
   */
  @Column({ type: "jsonb", default: [] })
  slides!: Record<string, unknown>[];

  /** Default theme for slides generated from this template */
  @Column({ type: "jsonb", nullable: true })
  theme?: SlideThemeJson;

  /** A mock join code for template previewing */
  @Column({ type: "varchar", nullable: true, unique: true })
  joinCode?: string;

  /** If false, template is system-level and not editable by users */
  @Column({ default: true })
  isPublic!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
