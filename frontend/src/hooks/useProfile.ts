import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { User } from "../types";
import { setStoredUser } from "../utils/storage";

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: {
        full_name?: string;
        bio?: string;
        avatar_url?: string;
        major_id?: number;
        academic_year_id?: number;
      }
    ) => {
      try {
        const { data } = await api.put<User>("/users/me", payload);
        return data;
      } catch {
        const current = qc.getQueryData<User>(["current-user"]);
        if (!current) {
          throw new Error("Unable to update profile.");
        }

        const upsertPayload = {
          id: current.id,
          email: current.email,
          role: current.role,
          full_name: payload.full_name ?? current.full_name,
          major_id: payload.major_id ?? current.major_id ?? null,
          academic_year_id: payload.academic_year_id ?? current.academic_year_id ?? null,
        };

        const { data } = await api.post<{ user: User }>("/auth/register", upsertPayload);
        return data.user;
      }
    },
    onSuccess: (user) => {
      setStoredUser(user);
      qc.setQueryData(["current-user"], user);
    },
  });
}
