import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { LiveSessionEntity } from "./LiveSession.entity";

/**
 * A participant who has joined a live session.
 * Matches the frontend Participant interface.
 */
@Entity("participants")
export class ParticipantEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /** Display name chosen by the participant */
  @Column()
  name!: string;

  /** Accumulated quiz score for this session */
  @Column({ type: "int", default: 0 })
  score!: number;

  // ── Relations ────────────────────────────────────────────
  @ManyToOne(() => LiveSessionEntity, (s) => s.participants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "session_id" })
  session!: LiveSessionEntity;

  @Column({ name: "session_id" })
  sessionId!: string;

  @CreateDateColumn()
  joinedAt!: Date;
}
