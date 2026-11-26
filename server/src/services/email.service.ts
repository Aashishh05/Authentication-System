import nodemailer from "nodemailer";
import { config } from "../config";

const createTransporter = () => {
  // Skip email in development if SMTP not configured
  if (config.nodeEnv !== "production" && (!config.smtp.host || config.smtp.host === "smtp.example.com")) {
    return null;
  }
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
};

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[DEV] Email skipped - would send to ${to}: ${subject}`);
    return;
  }
  await transporter.sendMail({
    from: config.smtp.user,
    to,
    subject,
    text,
    html,
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const verifyUrl = `${config.clientUrl}/verify-email/${token}`;
  await sendEmail(
    email,
    "Verify your email",
    `Please verify your email by clicking: ${verifyUrl}`,
    `<p>Please verify your email by clicking: <a href="${verifyUrl}">${verifyUrl}</a></p>`
  );
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const resetUrl = `${config.clientUrl}/reset-password/${token}`;
  await sendEmail(
    email,
    "Reset your password",
    `Reset your password by clicking: ${resetUrl} (valid for 15 minutes)`,
    `<p>Reset your password by clicking: <a href="${resetUrl}">${resetUrl}</a> (valid for 15 minutes)</p>`
  );
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  await sendEmail(
    email,
    "Welcome!",
    `Welcome ${name}! Your account has been created successfully.`,
    `<p>Welcome <strong>${name}</strong>! Your account has been created successfully.</p>`
  );
};