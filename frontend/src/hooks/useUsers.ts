import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/users";

export function useUsers(role?: string) {
  return useQuery({
    queryKey: ["users", role ?? "all"],
    queryFn: () => fetchUsers(role),
  });
}