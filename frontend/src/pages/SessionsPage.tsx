import { SessionCard } from "../components/SessionCard";
import { useSessions } from "../hooks/useSessions";
import { PlatformCalendar } from "../components/PlatformCalendar";

export function SessionsPage() {
  const { data: sessions = [], isLoading } = useSessions();

  const calendarItems = sessions.map((session) => ({
    id: `session-${session.id}`,
    title: session.title,
    start: session.scheduled_at,
    color: "#2563eb",
  }));

  if (isLoading) {
    return <p className="text-sm text-slate-500">Chargement des séances...</p>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Séances</h1>
        <p className="mt-2 text-slate-600">
          Trouvez les séances de tutorat à venir publiées sur la plateforme.
        </p>
      </div>

      <PlatformCalendar title="Calendrier des séances" items={calendarItems} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}
