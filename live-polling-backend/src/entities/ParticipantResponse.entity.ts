import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { SlideEntity } from "./Slide.entity";
import { LiveSessionEntity } from "./LiveSession.entity";
import { ParticipantEntity } from "./Participant.entity";

/**
 * A single response submitted by a participant to one slide.
 * The `value` column stores the answer in JSONB to accommodate
 * all slide response types:
 *   - multiple-choice / quiz: string (optionId)
 *   - open-ended: string
 *   - rating / number: number
 *   - ranking / 100-points: string[] | Record<string, number>
 *   - scales: number
 *   - word-cloud: string
 *   - pin-on-image: { x: number, y: number }
 *   - qa: { text: string }
 */
@Entity("participant_responses")
export class ParticipantResponseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /** The answer value — flexible JSONB to support all slide types */
  @Column({ type: "jsonb" })
  value!: unknown;

  // ── Relations ────────────────────────────────────────────
  @ManyToOne(() => SlideEntity, (s) => s.responses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "slide_id" })
  slide!: SlideEntity;

  @Column({ name: "slide_id" })
  slideId!: string;

  @ManyToOne(() => LiveSessionEntity, (s) => s.responses, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "session_id" })
  session!: LiveSessionEntity;

  @Column({ name: "session_id" })
  sessionId!: string;

  @ManyToOne(() => ParticipantEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "participant_id" })
  participant?: ParticipantEntity;

  @Column({ name: "participant_id", nullable: true })
  participantId?: string;

  /** Optional name for anonymous submissions */
  @Column({ nullable: true })
  participantName?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
