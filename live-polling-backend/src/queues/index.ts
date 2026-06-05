import { Queue } from "bullmq";
import { ENV } from "src/constants/dotenv";
import logger from "src/utils/logger/logger";

let emailQueue: Queue | null = null;
let analyticsQueue: Queue | null = null;

const connection = { url: ENV.REDIS_URL };

export function getEmailQueue(): Queue {
  if (!emailQueue) {
    emailQueue = new Queue("email", { connection });
    logger.info("[BullMQ] Email queue initialized.");
  }
  return emailQueue;
}

export function getAnalyticsQueue(): Queue {
  if (!analyticsQueue) {
    analyticsQueue = new Queue("analytics", { connection });
    logger.info("[BullMQ] Analytics queue initialized.");
  }
  return analyticsQueue;
}

export async function initQueues(): Promise<void> {
  if (!ENV.BULLMQ_ENABLED) {
    logger.info("[BullMQ] Disabled by configuration.");
    return;
  }
  getEmailQueue();
  getAnalyticsQueue();
  logger.info("[BullMQ] All queues initialized.");
}

export async function closeQueues(): Promise<void> {
  const queues = [emailQueue, analyticsQueue];
  for (const q of queues) {
    if (q) await q.close();
  }
  logger.info("[BullMQ] All queues closed.");
}
