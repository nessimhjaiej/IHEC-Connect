// ── User ──────────────────────────────────────────────────────
export interface User {
  id: string;
  full_name: string;
  email: string;
  bio?: string | null;
  major_id?: number | null;
  academic_year_id?: number | null;
  avatar_url?: string | null;
  role: "student" | "tutor" | "admin";
  is_active: boolean;
  created_at: string;
}

export interface Major {
  id: number;
  code: string;
  name: string;
}

export interface AcademicYear {
  id: number;
  label: string;
  sort_order: number;
}

// ── Auth ──────────────────────────────────────────────────────
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

// ── Subject ───────────────────────────────────────────────────
export interface Subject {
  id: number;
  name: string;
  description?: string | null;
  major_id?: number | null;
  academic_year_id?: number | null;
  created_at: string;
}

// ── Session ───────────────────────────────────────────────────
export interface Session {
  id: number;
  title: string;
  description?: string | null;
  scheduled_at: string;
  duration_minutes: number;
  capacity: number;
  meet_link?: string | null;
  is_cancelled: boolean;
  subject_id: number;
  tutor_id: string;
  created_at: string;
}

export interface SessionDetail extends Session {
  tutor: User;
  subject: Subject;
  participant_count: number;
  average_rating?: number | null;
}

export interface CreateSessionPayload {
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  capacity: number;
  subject_id: number;
  meet_link?: string;
}

// ── Document ──────────────────────────────────────────────────
export interface Document {
  id: number;
  title: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploader_id: string;
  session_id?: number | null;
  created_at: string;
}

// ── Review ────────────────────────────────────────────────────
export interface Review {
  id: number;
  event_id: number;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
}

export interface TutorRatingSummary {
  tutor_id: string;
  average_rating?: number | null;
  review_count: number;
}

// ── Event ─────────────────────────────────────────────────────
export interface Event {
  id: number;
  type: string;
  title: string;
  description?: string | null;
  host_user_id: string;
  subject_id?: number | null;
  major_id?: number | null;
  academic_year_id?: number | null;
  delivery_mode: "onsite" | "online" | "hybrid" | string;
  location_text?: string | null;
  meeting_url?: string | null;
  starts_at: string;
  ends_at?: string | null;
  capacity: number;
  created_at: string;
  participant_count: number;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  user_id: string;
  status: string;
  joined_at: string;
}

// ── Opportunity ───────────────────────────────────────────────
export interface Opportunity {
  id: number;
  title: string;
  company: string;
  description?: string | null;
  opportunity_type: string;
  location?: string | null;
  is_remote: boolean;
  apply_url?: string | null;
  deadline?: string | null;
  is_published: boolean;
  created_by: string;
  created_at: string;
}
