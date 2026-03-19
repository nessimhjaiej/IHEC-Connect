import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../services/users";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(["current-user"], user);
    }
  });
}
