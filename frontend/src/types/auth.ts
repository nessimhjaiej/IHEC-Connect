import type { User } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role: "student" | "tutor";
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
