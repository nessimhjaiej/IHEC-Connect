import { api } from "./api";
import { supabase } from "./supabase";
import type { LoginPayload, RegisterPayload } from "../types/auth";
import type { User } from "../types/user";
import { clearAuthStorage, setAccessToken } from "../utils/storage";

export async function login(payload: LoginPayload) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password
  });

  if (error) {
    throw error;
  }

  if (data.session?.access_token) {
    setAccessToken(data.session.access_token);
  }

  return getCurrentUser();
}

export async function register(payload: RegisterPayload) {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.full_name,
        role: payload.role
      }
    }
  });

  if (error) {
    throw error;
  }

  if (data.session?.access_token) {
    setAccessToken(data.session.access_token);
  }

  return data.session ? getCurrentUser() : null;
}

export async function getCurrentUser() {
  const { data } = await api.get<{ user: User }>("/auth/session");
  return data.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  clearAuthStorage();
  if (error) {
    throw error;
  }
}

export async function restoreSession() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    setAccessToken(session.access_token);
    return session;
  }

  clearAuthStorage();
  return null;
}
