import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDocument, fetchDocuments, fetchMyDocuments, uploadDocument } from "../services/documents";

export function useDocuments(sessionId?: number) {
  return useQuery({ queryKey: ["documents", sessionId], queryFn: () => fetchDocuments(sessionId) });
}

export function useMyDocuments() {
  return useQuery({ queryKey: ["documents", "mine"], queryFn: fetchMyDocuments });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ title, file, sessionId }: { title: string; file: File; sessionId?: number }) =>
      uploadDocument(title, file, sessionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (docId: number) => deleteDocument(docId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}
