import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { AuthResponse } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL as string;

let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send the refresh cookie
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const { data } = await axios.post<AuthResponse>(
    `${API_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
  setAccessToken(data.accessToken);
  return data.accessToken;
};

const SKIP_REFRESH = ["/auth/login", "/auth/register", "/auth/refresh"];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean } | undefined;
    const skip = SKIP_REFRESH.some((p) => original?.url?.includes(p));

    if (error.response?.status === 401 && original && !original._retry && !skip) {
      original._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const token = await refreshPromise;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (refreshError) {
        setAccessToken(null);
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);