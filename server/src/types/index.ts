import { Role } from "../models/User";
import { Request, Response, NextFunction } from "express";

export interface JwtPayload {
  id: string;
  role: Role;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  avatar?: string;
}

export interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export type { Request, Response, NextFunction };