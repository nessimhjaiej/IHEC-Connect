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
  scheduled_at: string;
  duration_minutes: number;
  capacity: number;
  subject_id: number;
  tutor_id: number;
  created_at: string;
}

export interface SessionDetail extends Session {
  tutor: User;
  subject: Subject;
  participant_count: number;
}

export interface CreateSessionPayload {
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  capacity: number;
  subject_id: number;
}
