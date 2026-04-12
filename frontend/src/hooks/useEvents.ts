import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEvent, deleteEvent, fetchEvents, registerToEvent,
  unregisterFromEvent, updateEvent,
} from "../services/events";
import type { Event } from "../types";

export function useEvents() {
  return useQuery({ queryKey: ["events"], queryFn: fetchEvents });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Event>) => createEvent(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Event> }) => updateEvent(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useRegisterToEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: number) => registerToEvent(eventId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUnregisterFromEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: number) => unregisterFromEvent(eventId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}
