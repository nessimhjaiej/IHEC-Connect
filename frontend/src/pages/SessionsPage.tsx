import { SessionCard } from "../components/SessionCard";
import { useSessions } from "../hooks/useSessions";

export function SessionsPage() {
  const { data: sessions = [], isLoading } = useSessions();

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading sessions...</p>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Browse sessions</h1>
        <p className="mt-2 text-slate-600">
          Find upcoming academic group sessions published by tutors on the platform.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}
