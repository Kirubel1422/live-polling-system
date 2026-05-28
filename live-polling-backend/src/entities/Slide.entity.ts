import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { PresentationEntity, SlideThemeJson } from "./Presentation.entity";
import { ParticipantResponseEntity } from "./ParticipantResponse.entity";
import { SlideOptionEntity } from "./SlideOption.entity";

/**
 * All slide types — mirrors frontend SlideType union exactly.
 */
export type SlideType =
  | "multiple-choice"
  | "open-ended"
  | "quiz"
  | "content"
  | "word-cloud"
  | "rating"
  | "ranking"
  | "scales"
  | "pin-on-image"
  | "qa"
  | "image-choice"
  | "number"
  | "100-points"
  | "wheel-of-names";

/**
 * Slide settings stored as JSONB.
 * Mirrors frontend SlideSettings interface.
 */
export interface SlideSettingsJson {
  allowMultipleAnswers?: boolean;
  showResults?: boolean;
  timeLimit?: number;
  isAnonymous?: boolean;
  maxResponses?: number;
  showCorrectAnswer?: boolean;
  pointsPerCorrect?: number;
  moderated?: boolean;
  allowUpvotes?: boolean;
}

/**
 * Extra slide-type-specific data stored as JSONB.
 * Examples:
 *   - quiz: { timeLimit, points }
 *   - rating: { ratingType, minValue, maxValue, minLabel, maxLabel }
 *   - content: { content, imageUrl, layout }
 *   - scales: { statement, scaleLabels, steps }
 *   - open-ended: { placeholder, maxLength }
 *   - pin-on-image: { imageUrl, question }
 *   - number: { minValue, maxValue, unit }
 *   - 100-points: { totalPoints }
 *   - wheel-of-names: { names, selectedName }
 *   - word-cloud: { maxWords, profanityFilter }
 *   - qa: { allowSubmissions }
 */
export type SlideMetaJson = Record<string, unknown>;

@Entity("slides")
export class SlideEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  type!: SlideType;

  @Column()
  title!: string;

  @Column({ nullable: true, type: "text" })
  subtitle?: string;

  /** Position in the slide deck (0-based) */
  @Column({ type: "int", default: 0 })
  order!: number;

  /** Per-slide theme — overrides presentation-level theme */
  @Column({ type: "jsonb" })
  theme!: SlideThemeJson;

  /** Slide behaviour settings */
  @Column({ type: "jsonb", default: {} })
  settings!: SlideSettingsJson;

  /**
   * Type-specific extra fields stored as JSONB.
   * Avoids a wide table with many nullable columns.
   */
  @Column({ type: "jsonb", default: {} })
  meta!: SlideMetaJson;

  // ── Relations ────────────────────────────────────────────
  @ManyToOne(() => PresentationEntity, (p) => p.slides, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "presentation_id" })
  presentation!: PresentationEntity;

  @Column({ name: "presentation_id" })
  presentationId!: string;

  /**
   * Options for choice-based slides:
   * multiple-choice, quiz, ranking, image-choice, 100-points
   */
  @OneToMany(() => SlideOptionEntity, (opt) => opt.slide, {
    cascade: true,
    eager: false,
  })
  options!: SlideOptionEntity[];

  /** Participant responses submitted to this slide */
  @OneToMany(() => ParticipantResponseEntity, (r) => r.slide, {
    eager: false,
  })
  responses!: ParticipantResponseEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
