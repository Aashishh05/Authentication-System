import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { setAccessToken } from "../api/axios";
import { loginRequest, registerRequest, refreshRequest, logoutRequest } from "../api/auth.api";
import type { AuthContextType, LoginPayload, RegisterPayload, Role, User } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Runs on app start, after OAuth redirect, and after a page reload
  const restoreSession = useCallback(async () => {
    try {
      const data = await refreshRequest();
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch {
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Fired by the axios interceptor when refresh fails
  useEffect(() => {
    const onForcedLogout = () => setUser(null);
    window.addEventListener("auth:logout", onForcedLogout);
    return () => window.removeEventListener("auth:logout", onForcedLogout);
  }, []);

  const login = async (payload: LoginPayload) => {
    const data = await loginRequest(payload);
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (payload: RegisterPayload) => {
    const data = await registerRequest(payload);
    return data.message;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const hasRole = (...roles: Role[]) => !!user && roles.includes(user.role);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, restoreSession, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};