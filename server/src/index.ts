import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import helmet from "helmet";
import { config } from "./config";
import authRoutes from "./routes/auth.routes";
import { authenticate, authorize } from "./middleware/auth";
import { authLimiter, loginLimiter, forgotPasswordLimiter } from "./middleware/rateLimit";
import { AppError } from "./errors";
import { ERROR_MESSAGES, HTTP_STATUS } from "./constants";
import User from "./models/User";

const app = express();

// Security headers
app.use(helmet());

// CORS with credentials
app.use(cors({ origin: config.clientUrl, credentials: true }));

// Parse JSON bodies
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Passport initialization
app.use(passport.initialize());

// Rate limiting
app.use("/api/auth", authLimiter);
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/forgot-password", forgotPasswordLimiter);

// Mount auth routes
app.use("/api/auth", authRoutes);

// Example role-protected route
app.get("/api/admin/users",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    res.json({ users: await User.find().select("name email role isVerified") });
  }
);

// Unknown route handler
app.use((_req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ message: ERROR_MESSAGES.ROUTE_NOT_FOUND });
});

// Global error handler
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    });
  }
  console.error("Error handler:", err);
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: ERROR_MESSAGES.INTERNAL_ERROR,
  });
});

mongoose.connect(config.mongoUri).then(() => {
  app.listen(config.port, () => console.log(`Server running on ${config.port}`));
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});