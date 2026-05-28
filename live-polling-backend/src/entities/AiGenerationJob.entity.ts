import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { PresentationEntity } from "./Presentation.entity";

export type AiJobStatus = "pending" | "processing" | "completed" | "failed";

/**
 * Tracks an AI slide generation request.
 * When a user requests AI to generate slides, a job record is created.
 * The generated slide data is stored in `generatedSlides` on completion.
 */
@Entity("ai_generation_jobs")
export class AiGenerationJobEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /** The user's prompt / topic for generation */
  @Column({ type: "text" })
  prompt!: string;

  /** Number of slides requested */
  @Column({ type: "int", default: 5 })
  slideCount!: number;

  /** Current status of the AI job */
  @Column({ type: "varchar", default: "pending" })
  status!: AiJobStatus;

  /**
   * The raw generated slides JSON — populated when status = "completed".
   * Shape: Partial<Slide>[]
   */
  @Column({ type: "jsonb", nullable: true })
  generatedSlides?: Record<string, unknown>[];

  /** Error message if status = "failed" */
  @Column({ type: "text", nullable: true })
  errorMessage?: string;

  // ── Relations ────────────────────────────────────────────
  /**
   * The target presentation this job will populate.
   * Nullable — a job may exist before a presentation is created.
   */
  @ManyToOne(() => PresentationEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "presentation_id" })
  presentation?: PresentationEntity;

  @Column({ nullable: true })
  presentationId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
