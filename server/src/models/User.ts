import { Schema, model, Document } from "mongoose";

export type Role = "user" | "moderator" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;          // missing for OAuth-only users
  role: Role;
  isVerified: boolean;
  googleId?: string;
  avatar?: string;
  refreshTokens: string[];    // hashes of active refresh tokens
  verifyToken?: string;       // hashed
  resetToken?: string;        // hashed
  resetTokenExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["user", "moderator", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    googleId: String,
    avatar: String,
    refreshTokens: { type: [String], default: [], select: false },
    verifyToken: { type: String, select: false },
    resetToken: { type: String, select: false },
    resetTokenExpires: Date,
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);