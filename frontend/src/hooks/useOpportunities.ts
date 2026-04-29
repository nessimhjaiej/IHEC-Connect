import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOpportunity, deleteOpportunity, fetchOpportunities, updateOpportunity,
} from "../services/opportunities";
import type { Opportunity } from "../types";

export function useOpportunities() {
  return useQuery({ queryKey: ["opportunities"], queryFn: fetchOpportunities });
}

export function useCreateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Opportunity>) => createOpportunity(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["opportunities"] }),
  });
}

export function useUpdateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Opportunity> }) => updateOpportunity(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["opportunities"] }),
  });
}

export function useDeleteOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteOpportunity(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["opportunities"] }),
  });
}
