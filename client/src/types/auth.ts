export type Role = "user" | "moderator" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<string>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  hasRole: (...roles: Role[]) => boolean;
}