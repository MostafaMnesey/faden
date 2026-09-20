import event from "node:events";
import { sendEmail } from "./SendEmail.js";
import type { SendEmailEventPayload } from "../../Types/mailer.js";

const sendEmailEvent = new event.EventEmitter();

sendEmailEvent.on(
  "sendEmail",
  async ({
    email,
    otp,
    subject = "Verify your account",
    text = "Verify your account",
    lang = "en",
  }: SendEmailEventPayload) => {
    await sendEmail({
      email,
      subject,
      text,
      otp,
      lang,
    });
  }
);

export default sendEmailEvent;
