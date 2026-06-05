import { Worker } from "bullmq";
import { ENV } from "src/constants/dotenv";
import logger from "src/utils/logger/logger";
import { sendEmail } from "src/utils/mailer";
import { EmailJobData } from "src/queues/email.queue";
import {
  backgroundJobsCompletedTotal,
  backgroundJobsFailedTotal,
} from "src/observability/metrics";

let emailWorker: Worker | null = null;

export function startEmailWorker(): Worker | null {
  if (!ENV.BULLMQ_ENABLED) return null;

  emailWorker = new Worker<EmailJobData>(
    "email",
    async (job) => {
      logger.info(`[EmailWorker] Processing job ${job.id}: sending to ${job.data.to}`);
      await sendEmail(job.data.to, job.data.subject, job.data.html);
      logger.info(`[EmailWorker] Job ${job.id} completed.`);
    },
    {
      connection: { url: ENV.REDIS_URL },
      concurrency: 5,
    }
  );

  emailWorker.on("completed", (job) => {
    backgroundJobsCompletedTotal.inc({ queue: "email" });
    logger.debug(`[EmailWorker] Job ${job.id} completed.`);
  });

  emailWorker.on("failed", (job, err) => {
    backgroundJobsFailedTotal.inc({ queue: "email" });
    logger.error(`[EmailWorker] Job ${job?.id} failed: ${err.message}`);
  });

  logger.info("[EmailWorker] Started.");
  return emailWorker;
}

export async function stopEmailWorker(): Promise<void> {
  if (emailWorker) {
    await emailWorker.close();
    logger.info("[EmailWorker] Stopped.");
  }
}
