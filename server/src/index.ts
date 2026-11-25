import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import { authenticate, authorize } from "./middleware/auth";
import { loginLimiter, forgotPasswordLimiter } from "./middleware/rateLimit";
import User from "./models/User";

const app = express();

// Security headers
app.use(helmet());

// CORS with credentials
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Parse JSON bodies
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Passport initialization
app.use(passport.initialize());

// Rate limiting
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/forgot-password", forgotPasswordLimiter);
// General auth routes without specific limiter (register, refresh, etc. have their own logic)

// Mount auth routes
app.use("/api/auth", authRoutes);

// Example role-protected route
app.get("/api/admin/users",
  authenticate,
  authorize("admin"),
  async (_req, res) => {
    res.json({ users: await User.find().select("name email role isVerified") });
  }
);

// Unknown route handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error handler:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

mongoose.connect(process.env.MONGO_URI!).then(() => {
  app.listen(parseInt(process.env.PORT || "5000"), () => console.log(`Server running on ${process.env.PORT || 5000}`));
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});