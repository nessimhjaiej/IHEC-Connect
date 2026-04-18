import { api } from "./api";
import type { User } from "../types";

const demoUsers: User[] = [
  {
    id: "demo-admin-1",
    full_name: "Amina Ben Salah",
    email: "amina@ihec-connect.tn",
    bio: "Administratrice plateforme",
    major_id: null,
    academic_year_id: null,
    avatar_url: null,
    role: "admin",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-tutor-1",
    full_name: "Sarra Ben Ali",
    email: "sarra@ihec-connect.tn",
    bio: "Tuteur en finance",
    major_id: null,
    academic_year_id: null,
    avatar_url: null,
    role: "tutor",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-student-1",
    full_name: "Yassine Jallouli",
    email: "yassine@ihec-connect.tn",
    bio: "Étudiant en gestion",
    major_id: null,
    academic_year_id: null,
    avatar_url: null,
    role: "student",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-student-2",
    full_name: "Meriem Khelifi",
    email: "meriem@ihec-connect.tn",
    bio: "Étudiante en comptabilité",
    major_id: null,
    academic_year_id: null,
    avatar_url: null,
    role: "student",
    is_active: false,
    created_at: new Date().toISOString(),
  },
];

export async function fetchUsers(role?: string) {
  try {
    const params = role ? { role } : {};
    const { data } = await api.get<User[]>("/users", { params });
    return data;
  } catch {
    return role ? demoUsers.filter((user) => user.role === role) : demoUsers;
  }
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
