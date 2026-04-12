import { api } from "./api";
import type { Document } from "../types";

export async function fetchDocuments(sessionId?: number) {
  const params = sessionId ? { session_id: sessionId } : {};
  try {
    const { data } = await api.get<Document[]>("/documents", { params });
    return data;
  } catch {
    return [];
  }
}

export async function fetchMyDocuments() {
  try {
    const { data } = await api.get<Document[]>("/documents/mine");
    return data;
  } catch {
    return [];
  }
}

export async function uploadDocument(title: string, file: File, sessionId?: number) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("file", file);
  if (sessionId) formData.append("session_id", String(sessionId));
  const { data } = await api.post<Document>("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export function getDocumentDownloadUrl(docId: number) {
  return `${api.defaults.baseURL}/documents/${docId}/download`;
}

export async function deleteDocument(docId: number) {
  await api.delete(`/documents/${docId}`);
}
