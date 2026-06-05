import { getEmailQueue } from "./index";

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
}

/**
 * Enqueue an email job.
 * Falls back to direct sending if BullMQ is not enabled.
 */
export async function enqueueEmail(data: EmailJobData): Promise<void> {
  const queue = getEmailQueue();
  await queue.add("send-email", data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 200,
  });
}
