import type { LoginPayload, RegisterPayload, User } from "../types";
import { clearAuthStorage, setStoredUser, getStoredUser } from "../utils/storage";
import { isSupabaseConfigured } from "./env";

const DEMO_USERS_KEY = "ihec_connect_demo_users";

type DemoUserRecord = User & { password: string };

function getDefaultUsers(): DemoUserRecord[] {
  const now = new Date().toISOString();

  return [
    {
      id: "demo-admin-1",
      full_name: "Admin IHEC",
      email: "admin@ihec-connect.tn",
      bio: "Compte administrateur de demonstration",
      avatar_url: null,
      role: "admin",
      is_active: true,
      created_at: now,
      password: "Admin123!",
    },
    {
      id: "demo-tutor-1",
      full_name: "Tutor Demo",
      email: "tutor@ihec-connect.tn",
      bio: "Compte tuteur de demonstration",
      avatar_url: null,
      role: "tutor",
      is_active: true,
      created_at: now,
      password: "Tutor123!",
    },
    {
      id: "demo-student-1",
      full_name: "Student Demo",
      email: "student@ihec-connect.tn",
      bio: "Compte etudiant de demonstration",
      avatar_url: null,
      role: "student",
      is_active: true,
      created_at: now,
      password: "Student123!",
    },
  ];
}

function loadUsers(): DemoUserRecord[] {
  const raw = localStorage.getItem(DEMO_USERS_KEY);
  if (!raw) {
    return getDefaultUsers();
  }

  try {
    const parsed = JSON.parse(raw) as DemoUserRecord[];
    if (parsed.length === 0) {
      return getDefaultUsers();
    }

    const defaults = getDefaultUsers();
    const existingEmails = new Set(parsed.map((user) => user.email.toLowerCase()));
    const missingDefaults = defaults.filter((user) => !existingEmails.has(user.email.toLowerCase()));
    return [...parsed, ...missingDefaults];
  } catch {
    return getDefaultUsers();
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
