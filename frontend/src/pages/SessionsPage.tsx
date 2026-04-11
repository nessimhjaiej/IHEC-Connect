import { SessionCard } from "../components/SessionCard";
import { useSessions } from "../hooks/useSessions";

export function SessionsPage() {
  const { data: sessions = [], isLoading } = useSessions();

  const featuredSubjects = [
    ...new Set(sessions.map((session) => session.subject?.name ?? "Entrepreneurship"))
  ].slice(0, 6);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading sessions...</p>;
  }

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-[36px] border border-[var(--line)] bg-[var(--panel)] p-7 shadow-[0_24px_80px_rgba(20,33,61,0.08)] md:p-9">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-deep)]">
              Discover sessions
            </p>
            <h1 className="mt-3 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-[var(--text)] md:text-5xl">
              Browse active academic rooms
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--muted)]">
              Find upcoming tutoring sessions and entrepreneurship events published on the
              platform.
            </p>
          </div>
          <div className="rounded-[24px] bg-[var(--text)] px-6 py-5 text-white">
            <p className="text-sm text-white/60">Sessions available</p>
            <p className="mt-2 text-4xl font-bold">{sessions.length}</p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          {featuredSubjects.map((subject) => (
            <span
              key={subject}
              className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)]"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Recommended study sessions
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          Find upcoming tutoring sessions and entrepreneurship events published on the platform.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}
