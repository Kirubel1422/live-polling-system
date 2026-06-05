import { ENV } from "src/constants/dotenv";
import logger from "src/utils/logger/logger";
import { startEmailWorker, stopEmailWorker } from "./email.worker";
import { startAnalyticsWorker, stopAnalyticsWorker } from "./analytics.worker";

export function initWorkers(): void {
  if (!ENV.BULLMQ_ENABLED) {
    logger.info("[Workers] BullMQ disabled, skipping worker initialization.");
    return;
  }

  startEmailWorker();
  startAnalyticsWorker();
  logger.info("[Workers] All workers initialized.");
}

export async function stopWorkers(): Promise<void> {
  await stopEmailWorker();
  await stopAnalyticsWorker();
  logger.info("[Workers] All workers stopped.");
}
