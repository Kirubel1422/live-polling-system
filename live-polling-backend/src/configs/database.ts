import { DataSource } from "typeorm";
import { ENV } from "src/constants/dotenv";
import logger from "src/utils/logger/logger";

// Entity imports
import { PresentationEntity } from "src/entities/Presentation.entity";
import { SlideEntity } from "src/entities/Slide.entity";
import { SlideOptionEntity } from "src/entities/SlideOption.entity";
import { LiveSessionEntity } from "src/entities/LiveSession.entity";
import { ParticipantEntity } from "src/entities/Participant.entity";
import { ParticipantResponseEntity } from "src/entities/ParticipantResponse.entity";
import { TemplateEntity } from "src/entities/Template.entity";
import { AiGenerationJobEntity } from "src/entities/AiGenerationJob.entity";
import { UserEntity } from "src/entities/User.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USERNAME,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  synchronize: ENV.NODE_ENV === "dev", // auto-sync in dev only; use migrations in prod
  logging: ENV.NODE_ENV === "dev",
  entities: [
    UserEntity,
    PresentationEntity,
    SlideEntity,
    SlideOptionEntity,
    LiveSessionEntity,
    ParticipantEntity,
    ParticipantResponseEntity,
    TemplateEntity,
    AiGenerationJobEntity,
  ],
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("PostgreSQL connected successfully.");
  } catch (error: unknown) {
    logger.error("Database connection failed: " + error);
    process.exit(1);
  }
};
