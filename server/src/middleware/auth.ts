import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/token.service";
import { UnauthorizedError, ForbiddenError } from "../errors";
import { JwtPayload } from "../types";

export type AuthRequest = Request & { user?: JwtPayload };

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }
  try {
    const token = header.split(" ")[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

export const authorize =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ForbiddenError("Forbidden");
    }
    next();
  };