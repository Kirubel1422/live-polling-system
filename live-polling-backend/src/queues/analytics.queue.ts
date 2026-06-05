import { getAnalyticsQueue } from "./index";

export interface AnalyticsJobData {
  event: string;
  data: Record<string, unknown>;
  timestamp?: string;
}

/**
 * Enqueue an analytics event for background processing.
 */
export async function enqueueAnalyticsEvent(data: AnalyticsJobData): Promise<void> {
  const queue = getAnalyticsQueue();
  await queue.add("analytics-event", {
    ...data,
    timestamp: data.timestamp || new Date().toISOString(),
  }, {
    removeOnComplete: 500,
    removeOnFail: 200,
  });
}
