export interface User {
  id: string;
  full_name: string;
  email: string;
  bio?: string | null;
  major?: string | null;
  academic_year?: string | null;
  avatar_url?: string | null;
  role: "student" | "tutor" | "alumni" | "admin" | "professor";
  created_at: string;
}
