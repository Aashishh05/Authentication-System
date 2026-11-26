import "express";
import { JwtPayload } from "./index";

declare global {
  namespace Express {
    // Extend Express User to be our JwtPayload (used by Passport)
    interface User extends JwtPayload {}

    // Extend Express Request to include our authenticated user type
    interface Request {
      user?: JwtPayload;
    }
  }
}

// This file exists to provide global type augmentation for Express
// Do not import from this file directly - use types/index.ts instead
export {};