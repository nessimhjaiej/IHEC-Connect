import { api } from "./api";
import type { Event, EventRegistration } from "../types";
import { demoEvents } from "./demoData";

export async function fetchEvents() {
  try {
    const { data } = await api.get<Event[]>("/events");
    return data;
  } catch {
    return demoEvents;
  }
}

export async function fetchEvent(eventId: number) {
  try {
    const { data } = await api.get<Event>(`/events/${eventId}`);
    return data;
  } catch {
    const fallback = demoEvents.find((event) => event.id === eventId);
    if (!fallback) {
      throw new Error("Event not found.");
    }
    return fallback;
  }
}

export async function createEvent(payload: Partial<Event>) {
  const { data } = await api.post<Event>("/events", payload);
  return data;
}

export async function updateEvent(eventId: number, payload: Partial<Event>) {
  const { data } = await api.put<Event>(`/events/${eventId}`, payload);
  return data;
}

export async function deleteEvent(eventId: number) {
  await api.delete(`/events/${eventId}`);
}

export async function registerToEvent(eventId: number) {
  const { data } = await api.post<EventRegistration>(`/events/${eventId}/register`);
  return data;
}

export async function unregisterFromEvent(eventId: number) {
  await api.delete(`/events/${eventId}/register`);
}
