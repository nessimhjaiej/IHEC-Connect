import { useQuery } from "@tanstack/react-query";
import { fetchAcademicYears, fetchMajors } from "../services/references";

export function useMajors() {
  return useQuery({ queryKey: ["majors"], queryFn: fetchMajors });
}

export function useAcademicYears() {
  return useQuery({ queryKey: ["academic-years"], queryFn: fetchAcademicYears });
}
