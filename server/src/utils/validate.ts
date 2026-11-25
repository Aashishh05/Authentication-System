import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Token is required"),
  }),
  body: z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Token is required"),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema.shape.body>;
export type LoginInput = z.infer<typeof loginSchema.shape.body>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema.shape.body>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema.shape.body>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema.shape.body>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema.shape.params>;