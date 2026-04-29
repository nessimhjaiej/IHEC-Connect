import { api } from "./api";
import type { Review, TutorRatingSummary } from "../types";

export async function createReview(payload: {
  session_id: number;
  reviewee_id: string;
  rating: number;
  comment?: string;
}) {
  const { data } = await api.post<Review>("/reviews", payload);
  return data;
}

export async function fetchReviewsForTutor(tutorId: string) {
  const { data } = await api.get<Review[]>(`/reviews/tutor/${tutorId}`);
  return data;
}

export async function fetchReviewsForSession(sessionId: number) {
  const { data } = await api.get<Review[]>(`/reviews/session/${sessionId}`);
  return data;
}

export async function fetchTutorRatingSummary(tutorId: string) {
  const { data } = await api.get<TutorRatingSummary>(`/reviews/tutor/${tutorId}/summary`);
  return data;
}
