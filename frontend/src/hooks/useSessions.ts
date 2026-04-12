import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSession, deleteSession, fetchMySessions, fetchSession,
  fetchSessions, fetchSubjects, joinSession, updateSession,
} from "../services/sessions";
import type { CreateSessionPayload } from "../types";

export function useSessions(subjectId?: number) {
  return useQuery({ queryKey: ["sessions", subjectId], queryFn: () => fetchSessions(subjectId) });
}

export function useMySessions() {
  return useQuery({ queryKey: ["sessions", "mine"], queryFn: fetchMySessions });
}

export function useSession(sessionId?: string) {
  return useQuery({
    queryKey: ["sessions", sessionId],
    queryFn: () => fetchSession(sessionId!),
    enabled: Boolean(sessionId),
  });
}

export function useSubjects() {
  return useQuery({ queryKey: ["subjects"], queryFn: fetchSubjects });
}

export function useJoinSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: number) => joinSession(sessionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSessionPayload) => createSession(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useUpdateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateSessionPayload & { is_cancelled: boolean }> }) =>
      updateSession(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSession(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}
