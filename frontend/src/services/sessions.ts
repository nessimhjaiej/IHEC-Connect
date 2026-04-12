import { api } from "./api";
import type { CreateSessionPayload, Session, SessionDetail, Subject } from "../types";
import { demoSessions } from "./demoData";

export async function fetchSessions(subjectId?: number) {
  const params = subjectId ? { subject_id: subjectId } : {};
  try {
    const { data } = await api.get<SessionDetail[]>("/sessions", { params });
    return data;
  } catch {
    return demoSessions;
  }
}

export async function fetchMySessions() {
  try {
    const { data } = await api.get<SessionDetail[]>("/sessions/mine");
    return data;
  } catch {
    return demoSessions.slice(0, 2);
  }
}

export async function fetchSession(sessionId: string) {
  try {
    const { data } = await api.get<SessionDetail>(`/sessions/${sessionId}`);
    return data;
  } catch {
    const fallback = demoSessions.find((session) => String(session.id) === sessionId);
    if (!fallback) {
      throw new Error("Session not found.");
    }
    return fallback;
  }
}

export async function createSession(payload: CreateSessionPayload) {
  const { data } = await api.post<Session>("/sessions", payload);
  return data;
}

export async function updateSession(sessionId: number, payload: Partial<CreateSessionPayload & { is_cancelled: boolean }>) {
  const { data } = await api.put<SessionDetail>(`/sessions/${sessionId}`, payload);
  return data;
}

export async function deleteSession(sessionId: number) {
  await api.delete(`/sessions/${sessionId}`);
}

export async function joinSession(sessionId: number) {
  const { data } = await api.post(`/participants/session/${sessionId}/join`);
  return data;
}

export async function fetchSubjects() {
  try {
    const { data } = await api.get<Subject[]>("/subjects");
    return data;
  } catch {
    return demoSessions.map((session) => session.subject);
  }
}
