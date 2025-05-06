// src/services/mailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendVerificationEmail(to, token) {
    console.log( `${process.env.FRONTEND_URL}/verify-email?token=${token}`);
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Please verify your email",
    html: `
      <p>Thanks for signing up!</p>
      <p>Please <a href="${url}">click here to verify your email</a>.</p>
      <p>This link expires in 24 hours.</p>
    `
  });
}
