export const ERROR_MESSAGES = {
  // Auth
  INVALID_CREDENTIALS: "Invalid email or password",
  NO_TOKEN_PROVIDED: "No token provided",
  INVALID_TOKEN: "Invalid or expired token",
  REFRESH_TOKEN_REUSE: "Refresh token reuse detected",
  NO_REFRESH_TOKEN: "No refresh token",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  TOKEN_EXPIRED: "Token expired",

  // Validation
  VALIDATION_FAILED: "Validation failed",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
  EMAIL_REQUIRED: "Email is required",
  NAME_REQUIRED: "Name is required",
  INVALID_EMAIL: "Invalid email format",

  // User
  USER_NOT_FOUND: "User not found",
  EMAIL_ALREADY_EXISTS: "Email already in use",
  USER_ALREADY_VERIFIED: "Email already verified",
  INVALID_VERIFY_TOKEN: "Invalid or expired verification link",
  INVALID_RESET_TOKEN: "Invalid or expired reset link",

  // OAuth
  OAUTH_FAILED: "OAuth authentication failed",
  OAUTH_USER_EXISTS: "Account already exists with this email",

  // Rate limiting
  TOO_MANY_REQUESTS: "Too many requests, please try again later",
  TOO_MANY_LOGIN_ATTEMPTS: "Too many login attempts, please try again after 15 minutes",
  TOO_MANY_FORGOT_PASSWORD: "Too many forgot password requests, please try again after 15 minutes",

  // Server
  INTERNAL_ERROR: "Internal server error",
  ROUTE_NOT_FOUND: "Route not found",
  DB_CONNECTION_ERROR: "Database connection error",

  // Email
  EMAIL_SEND_FAILED: "Failed to send email",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // Will be overridden in production
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
} as const;

export const ROLES = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
} as const;

export const TOKEN_EXPIRY = {
  ACCESS: "15m",
  REFRESH: "7d",
  VERIFY: 24 * 60 * 60 * 1000, // 24 hours
  RESET: 15 * 60 * 1000, // 15 minutes
} as const;