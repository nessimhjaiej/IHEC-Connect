export interface User {
  id: number;
  full_name: string;
  email: string;
  bio?: string | null;
  role: "student" | "tutor";
  created_at: string;
}
