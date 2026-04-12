import { api } from "./api";
import type { User } from "../types";

export async function fetchUsers(role?: string) {
  const params = role ? { role } : {};
  const { data } = await api.get<User[]>("/users", { params });
  return data;
}

export async function fetchTutors() {
  const { data } = await api.get<User[]>("/users/tutors");
  return data;
}

export async function fetchUser(userId: string) {
  const { data } = await api.get<User>(`/users/${userId}`);
  return data;
}

export async function adminUpdateUser(userId: string, payload: { is_active?: boolean; role?: string }) {
  const { data } = await api.patch<User>(`/users/${userId}/admin`, payload);
  return data;
}
