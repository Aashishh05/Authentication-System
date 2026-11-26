import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50).trim(),
    email: z.string().email("Invalid email format").toLowerCase().trim(),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").toLowerCase().trim(),
    password: z.string().min(1, "Password is required"),
  }),
});

export const refreshSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});

export const logoutSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().optional(),
  }),
});

export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Verification token is required"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").toLowerCase().trim(),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Reset token is required"),
  }),
  body: z.object({
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters").max(128),
  }),
});

export const googleAuthSchema = z.object({
  query: z.object({
    code: z.string().min(1, "Authorization code is required"),
    state: z.string().optional(),
  }),
});