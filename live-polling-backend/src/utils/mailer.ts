import nodemailer from "nodemailer";
import { ENV } from "src/constants/dotenv";

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
    console.log(`Mock Email to ${to}: ${subject}\n\n${html}`);
    return;
  }
  await transporter.sendMail({
    from: `"Live Polling" <noreply@livepolling.com>`,
    to,
    subject,
    html,
  });
};
