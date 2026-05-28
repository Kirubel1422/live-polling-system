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
  @Column({ nullable: true })
  isCorrect?: boolean;

  /** Display color (hex string) */
  @Column({ nullable: true })
  color?: string;

  /** For image-choice slides */
  @Column({ nullable: true })
  imageUrl?: string;

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
