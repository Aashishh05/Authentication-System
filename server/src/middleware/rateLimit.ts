import rateLimit from "express-rate-limit";
import { config } from "../config";
import { ERROR_MESSAGES } from "../constants";

export const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.authMax,
  message: { message: ERROR_MESSAGES.TOO_MANY_REQUESTS },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.loginMax,
  message: { message: ERROR_MESSAGES.TOO_MANY_LOGIN_ATTEMPTS },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.forgotPasswordMax,
  message: { message: ERROR_MESSAGES.TOO_MANY_FORGOT_PASSWORD },
  standardHeaders: true,
  legacyHeaders: false,
});