import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { SlideEntity } from "./Slide.entity";

/**
 * Represents a single selectable option on a slide.
 * Used by: multiple-choice, quiz, ranking, image-choice, 100-points.
 */
@Entity("slide_options")
export class SlideOptionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  text!: string;

  /** For quiz slides — marks the correct answer */
  @Column({ type: "boolean", nullable: true })
  isCorrect?: boolean | null;

  /** Display color (hex string) */
  @Column({ type: "varchar", nullable: true })
  color?: string | null;

  /** For image-choice slides */
  @Column({ type: "varchar", nullable: true })
  imageUrl?: string | null;

  /** Accumulated vote/response count — updated live */
  @Column({ type: "int", default: 0 })
  votes!: number;

  /** Position order within the slide's options list */
  @Column({ type: "int", default: 0 })
  order!: number;

  // ── Relations ────────────────────────────────────────────
  @ManyToOne(() => SlideEntity, (slide) => slide.options, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "slide_id" })
  slide!: SlideEntity;

  @Column({ name: "slide_id" })
  slideId!: string;
}
