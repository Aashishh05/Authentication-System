import jwt from "jsonwebtoken";
import crypto from "crypto";
import express from "express";
import { config } from "../config";
import { JwtPayload, TokenPair } from "../types";

export const signAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, config.accessTokenSecret, { expiresIn: config.accessTokenExpiry });

export const signRefreshToken = (payload: JwtPayload): string =>
  jwt.sign(payload, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiry });

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, config.accessTokenSecret) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, config.refreshTokenSecret) as JwtPayload;

export const hashToken = (token: string): string =>
  crypto.createHash(config.tokenHashAlgorithm).update(token).digest("hex");

export const generateTokenPair = (payload: JwtPayload): TokenPair => ({
  accessToken: signAccessToken(payload),
  refreshToken: signRefreshToken(payload),
});

export const setRefreshCookie = (res: express.Response, token: string): void => {
  res.cookie(config.cookie.name, token, {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    path: config.cookie.path,
    maxAge: config.cookie.maxAge,
  });
};

export const clearRefreshCookie = (res: express.Response): void => {
  res.clearCookie(config.cookie.name, { path: config.cookie.path });
};

export const decodeTokenUnsafe = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};