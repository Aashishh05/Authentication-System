import "dotenv/config";

export const config = {
  // Server
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  // Database
  mongoUri: process.env.MONGO_URI!,

  // JWT
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",

  // Cookies
  cookie: {
    name: "refreshToken",
    path: "/api/auth",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    authMax: 100,
    loginMax: 5,
    forgotPasswordMax: 3,
  },

  // Email
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_PORT === "465",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },

  // Bcrypt
  bcryptRounds: 12,

  // Token hashing
  tokenHashAlgorithm: "sha256",
} as const;

export type Config = typeof config;