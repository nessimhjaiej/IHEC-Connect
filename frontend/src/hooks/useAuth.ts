import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, login, register } from "../services/auth";
import type { LoginPayload, RegisterPayload } from "../types/auth";
import {
  clearAccessToken,
  clearStoredUser,
  getAccessToken,
  getStoredUser,
  setAccessToken,
  setStoredUser
} from "../utils/storage";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled: Boolean(getAccessToken()),
    initialData: getStoredUser()
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (response) => {
      setAccessToken(response.access_token);
      setStoredUser(response.user);
      queryClient.setQueryData(["current-user"], response.user);
    }
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (response) => {
      setAccessToken(response.access_token);
      setStoredUser(response.user);
      queryClient.setQueryData(["current-user"], response.user);
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearAccessToken();
    clearStoredUser();
    queryClient.clear();
  };
}
