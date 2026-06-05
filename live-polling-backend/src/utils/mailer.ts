import nodemailer from "nodemailer";
import { ENV } from "src/constants/dotenv";
import logger from "src/utils/logger/logger";

export const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: Number(ENV.SMTP_PORT),
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!ENV.SMTP_USER || !ENV.SMTP_PASS) {
    logger.info(`[Mailer] Mock Email to ${to}: ${subject}`);
    return;
  }
  await transporter.sendMail({
    from: `"Live Polling" <noreply@livepolling.com>`,
    to,
    subject,
    html,
  });
};
