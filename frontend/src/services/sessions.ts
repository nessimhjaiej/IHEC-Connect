import { api } from "./api";
import type { CreateSessionPayload, Session, SessionDetail, Subject } from "../types/session";

export async function fetchSessions() {
  const { data } = await api.get<SessionDetail[]>("/sessions");
  return data;
}

export async function fetchSession(sessionId: string) {
  const { data } = await api.get<SessionDetail>(`/sessions/${sessionId}`);
  return data;
}

export async function createSession(payload: CreateSessionPayload) {
  const { data } = await api.post<Session>("/sessions", payload);
  return data;
}

export async function joinSession(sessionId: number) {
  const { data } = await api.post(`/participants/session/${sessionId}/join`);
  return data;
}

export async function fetchSubjects() {
  const { data } = await api.get<Subject[]>("/subjects");
  return data;
}
