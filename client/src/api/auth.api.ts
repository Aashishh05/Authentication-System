import { api } from "./axios";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "../types/auth";

export const loginRequest = (payload: LoginPayload) =>
  api.post<AuthResponse>("/auth/login", payload).then((r) => r.data);

export const registerRequest = (payload: RegisterPayload) =>
  api.post<{ message: string }>("/auth/register", payload).then((r) => r.data);

export const refreshRequest = () =>
  api.post<AuthResponse>("/auth/refresh").then((r) => r.data);

export const logoutRequest = () => api.post("/auth/logout");
export const logoutAllRequest = () => api.post("/auth/logout-all");

export const getMe = () => api.get<{ user: User }>("/auth/me").then((r) => r.data.user);

export const verifyEmailRequest = (token: string) =>
  api.get<{ message: string }>(`/auth/verify-email/${token}`).then((r) => r.data);

export const forgotPasswordRequest = (email: string) =>
  api.post<{ message: string }>("/auth/forgot-password", { email }).then((r) => r.data);

export const resetPasswordRequest = (token: string, password: string) =>
  api.post<{ message: string }>(`/auth/reset-password/${token}`, { password }).then((r) => r.data);

export const changePasswordRequest = (currentPassword: string, newPassword: string) =>
  api.post<{ message: string }>("/auth/change-password", { currentPassword, newPassword }).then((r) => r.data);