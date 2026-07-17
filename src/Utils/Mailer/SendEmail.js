import { transporter } from "./MailerClient.js";
import { mailTemp, orderConfirmationTemp } from "./MailTemp.js";
import nodemailer from "nodemailer";
import { ImapFlow } from "imapflow";

const shouldSaveToImapSent = () => process.env.IMAP_SAVE_SENT === "true";

export const sendEmail = async ({ email, subject, text, otp, lang = "en", template, order }) => {
  if (!email) {
    console.error("❌ Mailer Error: No recipient email provided.");
    return { success: false, error: "No recipient email provided" };
  }

  const emailSubject = subject || "RDS Pharmaco – Notification";
  const emailText = text || (otp ? `Your OTP code is: ${otp || 'N/A'}` : "Thank you for contacting us.");
  const html = template === "orderConfirmation" && order
    ? orderConfirmationTemp({ order, lang })
    : mailTemp({ otp, title: emailSubject, text: text, lang });

  const senderEmail = process.env.MAIL_FROM || process.env.MAIL_USER || "orders@rdspharma.cloud";
  
  const mailOptions = {
    from: `"RDS Pharmaco" <${senderEmail}>`,
    replyTo: senderEmail,
    to: email,
    subject: emailSubject,
    text: emailText,
    html: html,
    headers: {
      'X-Entity-Ref-ID': Date.now().toString(),
    }
  };

  try {
    // 1) Send real email via SMTP
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully:", info.messageId);

    // 2) Optionally save copy to IMAP Sent folder asynchronously.
    if (shouldSaveToImapSent()) {
      saveToImapSent(mailOptions).catch(err => {
        console.warn("⚠️ Could not save email copy to IMAP Sent folder:", err.message);
      });
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    if (error.code === 'ETIMEDOUT') {
      console.error("❌ Mailer Timeout: Could not connect to SMTP server.");
    } else {
      console.error("❌ Mailer Error:", error.message);
    }
    return { success: false, error: error.message, code: error.code };
  }
};

async function saveToImapSent(mailOptions) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    return;
  }

  // 1) Generate raw email copy
  const rawTransport = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
    newline: "unix",
  });

  const rawInfo = await rawTransport.sendMail(mailOptions);
  const rawMessage = rawInfo.message;

  // 2) Connect and save to IMAP
  const client = new ImapFlow({
    host: process.env.IMAP_HOST || process.env.MAIL_HOST || "mail.rdspharma.cloud",
    port: Number(process.env.IMAP_PORT) || 993,
    secure: Number(process.env.IMAP_PORT || 993) === 993,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: Number(process.env.IMAP_CONNECTION_TIMEOUT) || 10000,
    greetingTimeout: Number(process.env.IMAP_GREETING_TIMEOUT) || 10000,
    socketTimeout: Number(process.env.IMAP_SOCKET_TIMEOUT) || 10000,
    logger: false,
  });

  await client.connect();
  try {
    let opened = false;
    const commonSentFolders = ["Sent", "INBOX.Sent", "Sent Messages"];
    for (const folder of commonSentFolders) {
      try {
        await client.mailboxOpen(folder);
        await client.append(folder, rawMessage, ["\\Seen"], new Date());
        opened = true;
        break;
      } catch (e) {
        // try next folder name
      }
    }
    if (!opened) {
      console.warn("⚠️ Could not find or open a standard Sent mailbox folder on IMAP");
    } else {
      console.log("📧 Saved email copy to IMAP Sent folder successfully");
    }
  } finally {
    await client.logout();
  }
}
