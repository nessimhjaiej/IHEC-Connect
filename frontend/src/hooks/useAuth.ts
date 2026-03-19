import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, login, logout, register, restoreSession } from "../services/auth";
import type { LoginPayload, RegisterPayload } from "../types/auth";
import {
  getAccessToken,
  getStoredUser,
  setStoredUser
} from "../utils/storage";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      await restoreSession();
      return getCurrentUser();
    },
    enabled: Boolean(getAccessToken()) || Boolean(getStoredUser()),
    initialData: getStoredUser(),
    staleTime: 60_000
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (user) => {
      setStoredUser(user);
      queryClient.setQueryData(["current-user"], user);
    }
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (user) => {
      if (user) {
        setStoredUser(user);
        queryClient.setQueryData(["current-user"], user);
      }
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return async () => {
    await logout();
    queryClient.clear();
  };
}
