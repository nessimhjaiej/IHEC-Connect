import { useState } from "react";
import { useCurrentUser } from "../hooks/useAuth";
import { useEvents, useRegisterToEvent } from "../hooks/useEvents";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { PlatformCalendar } from "../components/PlatformCalendar";




const EVENT_TYPES = ["Tous", "workshop", "formation", "conference", "networking", "autre"];

export function EventsPage() {
  const { data: user } = useCurrentUser();
  const { data: events = [], isLoading } = useEvents();
  const register = useRegisterToEvent();
  const [filter, setFilter] = useState("Tous");

  const calendarItems = events.map((event) => ({
    id: `event-${event.id}`,
    title: event.title,
    start: event.starts_at,
    color: "#16a34a",
  }));

  const filtered = filter === "Tous" ? events : events.filter((e) => e.type === filter);

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-[#5f56d8]" />
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Événements</h1>
          <p className="text-slate-500 text-sm mt-1">Workshops, formations et événements entrepreneuriaux de l'IHEC</p>
        </div>
        {user?.role === "admin" && (
          <Button>
            <a href="/admin/events">+ Créer un événement</a>
          </Button>
        )}
      </div>

      <PlatformCalendar title="Calendrier des événements" items={calendarItems} />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {EVENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors capitalize ${
              filter === type
                ? "bg-[#5f56d8] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event) => {
          const isFull = event.participant_count >= event.capacity;
          const isPast = new Date(event.starts_at) < new Date();
          return (
            <article key={event.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-full capitalize">
                  {event.type}
                </span>
                {isPast && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Passé</span>}
              </div>
              <h3 className="font-semibold text-slate-900">{event.title}</h3>
              {event.description && <p className="text-xs text-slate-500 line-clamp-2">{event.description}</p>}
              <div className="space-y-1.5 text-xs text-slate-500">
                <p className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {new Date(event.starts_at).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                </p>
                {event.location_text && (
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> {event.location_text}
                  </p>
                )}
                <p className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <span className={isFull ? "text-red-500 font-medium" : ""}>
                    {event.participant_count}/{event.capacity} inscrits {isFull ? "— Complet" : ""}
                  </span>
                </p>
              </div>
              {user && !isPast && (
                <Button
                  className="mt-auto text-xs"
                  disabled={isFull || register.isPending}
                  onClick={() => register.mutate(event.id)}
                >
                  {isFull ? "Complet" : register.isPending ? "Inscription..." : "S'inscrire"}
                </Button>
              )}
            </article>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-slate-400 text-sm col-span-3 py-12 text-center">Aucun événement disponible.</p>
        )}
      </div>
    </section>
  );
}
