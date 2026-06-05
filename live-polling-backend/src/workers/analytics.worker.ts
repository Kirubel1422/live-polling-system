import { Worker } from "bullmq";
import { ENV } from "src/constants/dotenv";
import logger from "src/utils/logger/logger";
import { AnalyticsJobData } from "src/queues/analytics.queue";
import {
  backgroundJobsCompletedTotal,
  backgroundJobsFailedTotal,
} from "src/observability/metrics";

let analyticsWorker: Worker | null = null;

export function startAnalyticsWorker(): Worker | null {
  if (!ENV.BULLMQ_ENABLED) return null;

  analyticsWorker = new Worker<AnalyticsJobData>(
    "analytics",
    async (job) => {
      // Process analytics event — log it for now, extend with storage later
      logger.debug(
        `[AnalyticsWorker] Event: ${job.data.event} at ${job.data.timestamp}`
      );
    },
    {
      connection: { url: ENV.REDIS_URL },
      concurrency: 10,
    }
  );

  analyticsWorker.on("completed", (job) => {
    backgroundJobsCompletedTotal.inc({ queue: "analytics" });
    logger.debug(`[AnalyticsWorker] Job ${job.id} completed.`);
  });

  analyticsWorker.on("failed", (job, err) => {
    backgroundJobsFailedTotal.inc({ queue: "analytics" });
    logger.error(`[AnalyticsWorker] Job ${job?.id} failed: ${err.message}`);
  });

  logger.info("[AnalyticsWorker] Started.");
  return analyticsWorker;
}

export async function stopAnalyticsWorker(): Promise<void> {
  if (analyticsWorker) {
    await analyticsWorker.close();
    logger.info("[AnalyticsWorker] Stopped.");
  }
}
