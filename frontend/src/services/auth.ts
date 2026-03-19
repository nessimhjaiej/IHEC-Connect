import { api } from "./api";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../types/auth";
import type { User } from "../types/user";

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get<User>("/users/me");
  return data;
}
