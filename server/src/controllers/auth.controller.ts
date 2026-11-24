import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";
import {
  signAccessToken, signRefreshToken, verifyRefreshToken,
  hashToken, setRefreshCookie, clearRefreshCookie,
} from "../utils/tokens";
import { sendEmail } from "../utils/email";

const publicUser = (u: any) => ({
  id: u._id, name: u.name, email: u.email,
  role: u.role, isVerified: u.isVerified, avatar: u.avatar,
});

// Issues
//  a new refresh token and stores its hash
const issueTokens = async (user: any, res: Response) => {
  const payload = { id: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await User.updateOne({ _id: user._id }, { $push: { refreshTokens: hashToken(refreshToken) } });
  setRefreshCookie(res, refreshToken);
  return accessToken;
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({ message: "Name, email and a password of 8+ characters are required" });
  }
  if (await User.findOne({ email })) {
    return res.status(409).json({ message: "Email already in use" });
  }
  const rawVerify = crypto.randomBytes(32).toString("hex");
  await User.create({
    name, email,
    password: await bcrypt.hash(password, 12),
    verifyToken: hashToken(rawVerify),
  });
  await sendEmail(email, "Verify your email", `${process.env.CLIENT_URL}/verify-email/${rawVerify}`);
  res.status(201).json({ message: "Registered. Check your email to verify your account." });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const accessToken = await issueTokens(user, res);
  res.json({ accessToken, user: publicUser(user) });
};

// Rotation: the old refresh token is removed, a new one is issued.
// If an unknown (already used) token shows up, all sessions are revoked.
export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });
  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select("+refreshTokens");
    if (!user) return res.status(401).json({ message: "User not found" });

    const hashed = hashToken(token);
    if (!user.refreshTokens.includes(hashed)) {
      await User.updateOne({ _id: user._id }, { $set: { refreshTokens: [] } }); // reuse detected
      clearRefreshCookie(res);
      return res.status(401).json({ message: "Refresh token reuse detected" });
    }
    await User.updateOne({ _id: user._id }, { $pull: { refreshTokens: hashed } });
    const accessToken = await issueTokens(user, res);
    res.json({ accessToken, user: publicUser(user) });
  } catch {
    clearRefreshCookie(res);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) {
    try {
      const { id } = verifyRefreshToken(token);
      await User.updateOne({ _id: id }, { $pull: { refreshTokens: hashToken(token) } });
    } catch { /* token already invalid, just clear the cookie */ }
  }
  clearRefreshCookie(res);
  res.json({ message: "Logged out" });
};

export const logoutAll = async (req: AuthRequest, res: Response) => {
  await User.updateOne({ _id: req.user!.id }, { $set: { refreshTokens: [] } });
  clearRefreshCookie(res);
  res.json({ message: "Logged out from all devices" });
};

export const me = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: publicUser(user) });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const token = (req.params.token as string) || undefined;
  const user = await User.findOne({ verifyToken: token ? hashToken(token) : undefined }).select("+verifyToken");
  if (!user) return res.status(400).json({ message: "Invalid or expired link" });
  user.isVerified = true;
  user.verifyToken = undefined;
  await user.save();
  res.json({ message: "Email verified" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email || undefined });
  if (user) {
    const raw = crypto.randomBytes(32).toString("hex");
    user.resetToken = hashToken(raw);
    user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    await sendEmail(user.email, "Reset your password", `${process.env.CLIENT_URL}/reset-password/${raw}`);
  }
  // Same response whether or not the email exists (prevents user enumeration)
  res.json({ message: "If that email exists, a reset link has been sent." });
};

export const resetPassword = async (req: Request, res: Response) => {
  const token = (req.params.token as string) || undefined;
  const { password } = req.body;
  if (!password || password.length < 8) return res.status(400).json({ message: "Password must be 8+ characters" });
  const user = await User.findOne({
    resetToken: token ? hashToken(token) : undefined,
    resetTokenExpires: { $gt: new Date() },
  }).select("+resetToken");
  if (!user) return res.status(400).json({ message: "Invalid or expired link" });
  user.password = await bcrypt.hash(password, 12);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  user.refreshTokens = []; // sign out everywhere
  await user.save();
  res.json({ message: "Password updated. Please log in." });
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user!.id).select("+password");
  if (!user?.password || !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }
  if (!newPassword || newPassword.length < 8) return res.status(400).json({ message: "Password must be 8+ characters" });
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.json({ message: "Password changed" });
};