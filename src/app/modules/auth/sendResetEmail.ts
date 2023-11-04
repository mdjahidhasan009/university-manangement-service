import nodemailer from 'nodemailer';
import config from '../../../config';

export async function sendEmail(to: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
      user: config.email,
      pass: config.appPass,
    },
  });

  await transporter.sendMail({
    from: config.email,
    to,
    subject: 'Reset Password Link',
    html,
  });
}
