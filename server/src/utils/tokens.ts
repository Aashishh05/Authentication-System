import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Response } from "express";

export interface JwtPayload {
  id: string;
  role: string;
}

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;

// Store only a hash of refresh tokens in the database
export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const setRefreshCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie("refreshToken", { path: "/api/auth" });
};