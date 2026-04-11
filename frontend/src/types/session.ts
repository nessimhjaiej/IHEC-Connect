import type { User } from "./user";

export interface Subject {
  id: number;
  name: string;
  description?: string | null;
  created_at: string;
}

export interface Session {
  id: number;
  title: string;
  description?: string | null;
  session_type: "tutoring" | "entrepreneurship";
  delivery_mode: "online" | "in_person";
  pricing_type: "free" | "paid";
  price_dt?: number | null;
  location_text?: string | null;
  meeting_url?: string | null;
  major?: string | null;
  academic_year?: string | null;
  scheduled_at: string;
  duration_minutes: number;
  capacity: number;
  subject_id?: number | null;
  tutor_id: string;
  created_at: string;
}

export interface SessionDetail extends Session {
  tutor: User;
  subject?: Subject | null;
  participant_count: number;
}

export interface CreateSessionPayload {
  title: string;
  description?: string;
  session_type: "tutoring" | "entrepreneurship";
  delivery_mode: "online" | "in_person";
  pricing_type: "free" | "paid";
  price_dt?: number;
  location_text?: string;
  meeting_url?: string;
  major?: string;
  academic_year?: string;
  scheduled_at: string;
  duration_minutes: number;
  capacity: number;
  subject_id?: number;
}
