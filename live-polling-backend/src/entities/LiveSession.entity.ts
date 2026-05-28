import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { PresentationEntity } from "./Presentation.entity";
import { ParticipantEntity } from "./Participant.entity";
import { ParticipantResponseEntity } from "./ParticipantResponse.entity";

/**
 * Represents one live polling session for a presentation.
 * Matches the frontend LiveSession interface.
 */
@Entity("live_sessions")
export class LiveSessionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /** The short join code participants use (e.g. "ABC123") */
  @Column({ unique: true })
  joinCode!: string;

  /** Which slide is currently being displayed to participants */
  @Column({ type: "int", default: 0 })
  currentSlideIndex!: number;

  /** Whether the session is actively live */
  @Column({ default: false })
  isLive!: boolean;

  @Column({ nullable: true, type: "timestamptz" })
  startedAt?: Date;

  @Column({ nullable: true, type: "timestamptz" })
  endedAt?: Date;

  // ── Relations ────────────────────────────────────────────
  @ManyToOne(() => PresentationEntity, (p) => p.sessions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "presentation_id" })
  presentation!: PresentationEntity;

  @Column({ name: "presentation_id" })
  presentationId!: string;

  @OneToMany(() => ParticipantEntity, (p) => p.session, {
    cascade: true,
    eager: false,
  })
  participants!: ParticipantEntity[];

  @OneToMany(() => ParticipantResponseEntity, (r) => r.session, {
    eager: false,
  })
  responses!: ParticipantResponseEntity[];

  @CreateDateColumn()
  createdAt!: Date;
}
