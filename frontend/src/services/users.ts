import { api } from "./api";
import type { User } from "../types/user";

export async function updateProfile(
  payload: Partial<Pick<User, "full_name" | "bio" | "major" | "academic_year" | "avatar_url">>
) {
  const { data } = await api.put<User>("/users/me", payload);
  return data;
}
