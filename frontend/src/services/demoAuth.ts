import type { LoginPayload, RegisterPayload, User } from "../types";
import { clearAuthStorage, setStoredUser, getStoredUser } from "../utils/storage";
import { isSupabaseConfigured } from "./env";

const DEMO_USERS_KEY = "ihec_connect_demo_users";

type DemoUserRecord = User & { password: string };

function loadUsers(): DemoUserRecord[] {
  const raw = localStorage.getItem(DEMO_USERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as DemoUserRecord[];
  } catch {
    return [];
  }
}

function saveUsers(users: DemoUserRecord[]) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
}

function stripPassword(user: DemoUserRecord): User {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export function isDemoAuthMode() {
  return !isSupabaseConfigured();
}

export async function demoRegister(payload: RegisterPayload): Promise<User> {
  const users = loadUsers();
  const duplicate = users.find((user) => user.email.toLowerCase() === payload.email.toLowerCase());

  if (duplicate) {
    throw new Error("Cet email est déjà utilisé.");
  }

  const record: DemoUserRecord = {
    id: crypto.randomUUID(),
    full_name: payload.full_name,
    email: payload.email,
    bio: null,
    avatar_url: null,
    role: payload.role,
    is_active: true,
    created_at: new Date().toISOString(),
    password: payload.password,
  };

  const nextUsers = [...users, record];
  saveUsers(nextUsers);
  setStoredUser(stripPassword(record));
  return stripPassword(record);
}

export async function demoLogin(payload: LoginPayload): Promise<User> {
  const users = loadUsers();
  const user = users.find(
    (entry) =>
      entry.email.toLowerCase() === payload.email.toLowerCase() && entry.password === payload.password
  );

  if (!user) {
    throw new Error("Email ou mot de passe invalide.");
  }

  const publicUser = stripPassword(user);
  setStoredUser(publicUser);
  return publicUser;
}

export function demoLogout() {
  clearAuthStorage();
}

export function getDemoStoredUser() {
  return getStoredUser();
}
