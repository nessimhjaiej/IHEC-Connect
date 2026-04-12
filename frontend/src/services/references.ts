import { api } from "./api";
import type { AcademicYear, Major } from "../types";

const fallbackMajors: Major[] = [
  { id: 1, code: "LSG", name: "Licence en sciences de gestion" },
  { id: 2, code: "LIG", name: "Licence en informatique de gestion" },
];

const fallbackAcademicYears: AcademicYear[] = [
  { id: 1, label: "1ère année", sort_order: 1 },
  { id: 2, label: "2ème année", sort_order: 2 },
  { id: 3, label: "3ème année", sort_order: 3 },
];

export async function fetchMajors() {
  try {
    const { data } = await api.get<Major[]>("/majors");
    return data;
  } catch {
    return fallbackMajors;
  }
}

export async function fetchAcademicYears() {
  try {
    const { data } = await api.get<AcademicYear[]>("/academic-years");
    return data;
  } catch {
    return fallbackAcademicYears;
  }
}
