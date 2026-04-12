import { api } from "./api";
import type { Opportunity } from "../types";
import { demoOpportunities } from "./demoData";

export async function fetchOpportunities() {
  try {
    const { data } = await api.get<Opportunity[]>("/opportunities");
    return data;
  } catch {
    return demoOpportunities;
  }
}

export async function createOpportunity(payload: Partial<Opportunity>) {
  const { data } = await api.post<Opportunity>("/opportunities", payload);
  return data;
}

export async function updateOpportunity(oppId: number, payload: Partial<Opportunity>) {
  const { data } = await api.put<Opportunity>(`/opportunities/${oppId}`, payload);
  return data;
}

export async function deleteOpportunity(oppId: number) {
  await api.delete(`/opportunities/${oppId}`);
}
