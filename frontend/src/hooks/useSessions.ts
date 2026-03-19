import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSession,
  fetchSession,
  fetchSessions,
  fetchSubjects,
  joinSession
} from "../services/sessions";
import type { CreateSessionPayload } from "../types/session";

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions
  });
}

export function useSession(sessionId?: string) {
  return useQuery({
    queryKey: ["sessions", sessionId],
    queryFn: () => fetchSession(sessionId!),
    enabled: Boolean(sessionId)
  });
}

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects
  });
}

export function useJoinSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => joinSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    }
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSessionPayload) => createSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    }
  });
}
