import bcrypt from "bcryptjs";
import crypto from "crypto";
import User, { IUser } from "../models/User";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  setRefreshCookie,
  clearRefreshCookie,
} from "./token.service";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "./email.service";
import { config } from "../config";
import {
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../errors";
import { JwtPayload, UserPublic } from "../types";

const publicUser = (user: IUser): UserPublic => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  avatar: user.avatar,
});

const issueTokens = async (user: IUser, res: Response): Promise<string> => {
  const payload: JwtPayload = { id: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await User.updateOne(
    { _id: user._id },
    { $push: { refreshTokens: hashToken(refreshToken) } }
  );
  setRefreshCookie(res, refreshToken);
  return accessToken;
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<{ message: string }> => {
  if (!name || !email || !password || password.length < 8) {
    throw new BadRequestError("Name, email and a password of 8+ characters are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError("Email already in use");
  }

  const rawVerify = crypto.randomBytes(32).toString("hex");
  const _user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, config.bcryptRounds),
    verifyToken: hashToken(rawVerify),
  });

  await sendVerificationEmail(email, rawVerify);
  await sendWelcomeEmail(email, name);

  return { message: "Registered. Check your email to verify your account." };
};

export const login = async (
  email: string,
  password: string,
  res: Response
): Promise<{ accessToken: string; user: UserPublic }> => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const accessToken = await issueTokens(user, res);
  return { accessToken, user: publicUser(user) };
};

export const refresh = async (
  token: string | undefined,
  res: Response
): Promise<{ accessToken: string; user: UserPublic }> => {
  if (!token) {
    throw new UnauthorizedError("No refresh token");
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select("+refreshTokens");
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const hashed = hashToken(token);
    if (!user.refreshTokens.includes(hashed)) {
      await User.updateOne({ _id: user._id }, { $set: { refreshTokens: [] } });
      clearRefreshCookie(res);
      throw new UnauthorizedError("Refresh token reuse detected");
    }

    await User.updateOne({ _id: user._id }, { $pull: { refreshTokens: hashed } });
    const accessToken = await issueTokens(user, res);
    return { accessToken, user: publicUser(user) };
  } catch (error) {
    clearRefreshCookie(res);
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError("Invalid refresh token");
  }
};

export const logout = async (token: string | undefined, res: Response): Promise<{ message: string }> => {
  if (token) {
    try {
      const { id } = verifyRefreshToken(token);
      await User.updateOne({ _id: id }, { $pull: { refreshTokens: hashToken(token) } });
    } catch {
      // Token already invalid, just clear the cookie
    }
  }
  clearRefreshCookie(res);
  return { message: "Logged out" };
};

export const logoutAll = async (userId: string, res: Response): Promise<{ message: string }> => {
  await User.updateOne({ _id: userId }, { $set: { refreshTokens: [] } });
  clearRefreshCookie(res);
  return { message: "Logged out from all devices" };
};

export const me = async (userId: string): Promise<{ user: UserPublic }> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return { user: publicUser(user) };
};

export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const user = await User.findOne({ verifyToken: hashToken(token) }).select("+verifyToken");
  if (!user) {
    throw new BadRequestError("Invalid or expired link");
  }
  user.isVerified = true;
  user.verifyToken = undefined;
  await user.save();
  return { message: "Email verified" };
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const user = await User.findOne({ email });
  if (user) {
    const raw = crypto.randomBytes(32).toString("hex");
    user.resetToken = hashToken(raw);
    user.resetTokenExpires = new Date(Date.now() + config.tokenHashAlgorithm === "sha256" ? 15 * 60 * 1000 : 15 * 60 * 1000);
    await user.save();
    await sendPasswordResetEmail(user.email, raw);
  }
  // Same response whether or not the email exists (prevents user enumeration)
  return { message: "If that email exists, a reset link has been sent." };
};

export const resetPassword = async (
  token: string,
  password: string
): Promise<{ message: string }> => {
  if (!password || password.length < 8) {
    throw new BadRequestError("Password must be at least 8 characters");
  }

  const user = await User.findOne({
    resetToken: hashToken(token),
    resetTokenExpires: { $gt: new Date() },
  }).select("+resetToken");

  if (!user) {
    throw new BadRequestError("Invalid or expired link");
  }

  user.password = await bcrypt.hash(password, config.bcryptRounds);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  user.refreshTokens = []; // Sign out everywhere
  await user.save();

  return { message: "Password updated. Please log in." };
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  const user = await User.findById(userId).select("+password");
  if (!user?.password || !(await bcrypt.compare(currentPassword, user.password))) {
    throw new BadRequestError("Current password is incorrect");
  }

  if (!newPassword || newPassword.length < 8) {
    throw new BadRequestError("Password must be at least 8 characters");
  }

  user.password = await bcrypt.hash(newPassword, config.bcryptRounds);
  await user.save();

  return { message: "Password changed" };
};

export const googleAuth = async (
  profile: any,
  res: Response
): Promise<{ accessToken: string; user: UserPublic }> => {
  let user = await User.findOne({ googleId: profile.id });

  if (!user) {
    // Check if email already exists
    user = await User.findOne({ email: profile.emails?.[0]?.value });
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.avatar = user.avatar || profile.photos?.[0]?.value;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name: profile.displayName || profile.name?.givenName + " " + profile.name?.familyName,
        email: profile.emails?.[0]?.value,
        googleId: profile.id,
        avatar: profile.photos?.[0]?.value,
        isVerified: true, // Google accounts are pre-verified
        password: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), config.bcryptRounds),
      });
    }
  }

  const accessToken = await issueTokens(user, res);
  return { accessToken, user: publicUser(user) };
};

import { Response } from "express";