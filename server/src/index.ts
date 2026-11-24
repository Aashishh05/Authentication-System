import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRoutes from "./routes/auth.routes";
import { authenticate, authorize } from "./middleware/auth";
import User from "./models/User";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

// Example role-protected route
app.get("/api/admin/users",
  authenticate,
  authorize("admin"),
  async (_req, res) => {
    res.json({ users: await User.find().select("name email role isVerified") });
  }
);

mongoose.connect(process.env.MONGO_URI!).then(() => {
  app.listen(parseInt(process.env.PORT || "5000"), () => console.log(`Server running on ${process.env.PORT || 5000}`));
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});