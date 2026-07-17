import { Worker } from "bullmq";
import { connection, mailerQueue } from "../Radis/Connection.js";
import { sendEmail } from "../Mailer/SendEmail.js";

export const addEmailJob = async (data) => {
  await mailerQueue.add("send-email", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  });
};

const worker = new Worker(
  "mailer",
  async (job) => {
    const { email, otp, subject, text, lang, template, order } = job.data;
    console.log(`Processing email job for ${email}`);
    await sendEmail({ email, otp, subject, text, lang, template, order });
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Email job ${job.id} failed: ${err.message}`);
});
