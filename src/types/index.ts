export type UserRole = 'student' | 'admin';
export type TutorStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tutorStatus: TutorStatus;
  avatar?: string;
  level?: string;
  subject?: string;
  bio?: string;
  emailVerified: boolean;
  acceptedTerms: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  tutorId: string;
  tutorName: string;
  duration: number;
  enrolledCount: number;
  maxEnrolled: number;
  date: string;
  time?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  color: string;
  icon: string;
  isEnrolled?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  sessions: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'course' | 'review' | 'system' | 'enrollment' | 'tutor_request';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Review {
  id: string;
  courseId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export type CalendarEventType = 'admin' | 'personal' | 'tutoring';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: CalendarEventType;
  description?: string;
  createdBy: string;
  color?: string;
}

export interface TutorProfile {
  userId: string;
  name: string;
  email: string;
  level: string;
  subject: string;
  bio: string;
  rating: number;
  reviewCount: number;
  courses: Course[];
  joinedAt: string;
}
