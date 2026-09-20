import { connection, notificationQueue } from "../Radis/Connection.js";
import { Worker, Job } from "bullmq";
import type { AddNotificationJobArgs, NotificationJobData } from "../../Types/notification.js";

export const addNotificationJob = async ({
  scheduleId,
  studentId,
  type,
  sendAt,
}: AddNotificationJobArgs): Promise<void> => {
  const delay = Math.max(0, new Date(sendAt).getTime() - new Date().getTime());
  
  const job = await notificationQueue.add(
    "send-notification",
    { scheduleId, studentId, type },
    {
      jobId: scheduleId,
      delay,
    }
  );
  console.log(`Added job with ID: ${job.id}`);
};

export const removeNotificationJob = async (scheduleId: string): Promise<void> => {
  const job = await notificationQueue.getJob(scheduleId);
  if (job) {
    await job.remove();
    console.log(`Removed job associated with schedule ${scheduleId}`);
  }
};

const worker = new Worker<NotificationJobData>(
  "notifications",
  async (job: Job<NotificationJobData>) => {
    const { scheduleId, studentId, type } = job.data;

    // Send notification
    console.log(
      `Sending ${type} notification to student ${studentId} for schedule ${scheduleId}`
    );
  },
  { connection }
);
