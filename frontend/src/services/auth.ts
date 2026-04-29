import { api } from "./api";
import { demoLogin, demoLogout, demoRegister } from "./demoAuth";
import { isSupabaseConfigured } from "./env";
import { supabase } from "./supabase";
import type { LoginPayload, RegisterPayload, User } from "../types/index";
import { clearAuthStorage, setAccessToken } from "../utils/storage";

export async function login(payload: LoginPayload) {
  if (!isSupabaseConfigured()) {
    return demoLogin(payload);
  }

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
  if (!isSupabaseConfigured()) {
    const user = await demoRegister(payload);
    try {
      await api.post("/auth/register", {
        id: user.id,
        full_name: payload.full_name,
        email: payload.email,
        role: payload.role,
      });
    } catch {
      // Demo mode can keep working locally even if the backend DB is unavailable.
    }

    return user;
  }

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

  if (data.user?.id) {
    await api.post("/auth/register", {
      id: data.user.id,
      full_name: payload.full_name,
      email: payload.email,
      role: payload.role,
    });
  }

  if (data.session?.access_token) {
    setAccessToken(data.session.access_token);
  }

  if (data.session) {
    return getCurrentUser();
  }

  return null;
}

export async function getCurrentUser() {
  const { data } = await api.get<{ user: User }>("/auth/session");
  return data.user;
}

export async function logout() {
  if (!isSupabaseConfigured()) {
    demoLogout();
    return;
  }

  const { error } = await supabase.auth.signOut();
  clearAuthStorage();
  if (error) {
    throw error;
  }
}

export async function restoreSession() {
  if (!isSupabaseConfigured()) {
    return null;
  }

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
