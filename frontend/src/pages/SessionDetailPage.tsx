import { useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useCurrentUser } from "../hooks/useAuth";
import { useJoinSession, useSession } from "../hooks/useSessions";

export function SessionDetailPage() {
  const { sessionId } = useParams();
  const { data: user } = useCurrentUser();
  const { data: session, isLoading } = useSession(sessionId);
  const joinSession = useJoinSession();

  if (isLoading || !session) {
    return <p className="text-sm text-slate-500">Loading session...</p>;
  }

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-[36px] border border-[var(--line)] bg-[var(--panel)] p-7 shadow-[0_24px_80px_rgba(20,33,61,0.08)] md:p-9">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-deep)]">
              {session.subject?.name ?? "Entrepreneurship"}
            </span>
            <h1 className="mt-4 max-w-4xl font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-[var(--text)] md:text-5xl">
              {session.title}
            </h1>
          </div>
          {user?.role === "student" && (
            <Button
              className="bg-[var(--brand)] hover:bg-[var(--brand-deep)]"
              onClick={() => joinSession.mutate(session.id)}
              disabled={joinSession.isPending}
            >
              {joinSession.isPending ? "Joining..." : "Join session"}
            </Button>
          )}
        </div>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          {session.description ?? "No description provided."}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(20,33,61,0.05)]">
            <p className="text-sm text-[var(--muted)]">
              {session.session_type === "tutoring" ? "Tutor" : "Host"}
            </p>
            <p className="mt-2 font-bold text-[var(--text)]">{session.tutor.full_name}</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(20,33,61,0.05)]">
            <p className="text-sm text-[var(--muted)]">Schedule</p>
            <p className="mt-2 font-bold text-[var(--text)]">
              {new Date(session.scheduled_at).toLocaleString()}
            </p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(20,33,61,0.05)]">
            <p className="text-sm text-[var(--muted)]">Duration</p>
            <p className="mt-2 font-bold text-[var(--text)]">{session.duration_minutes} minutes</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(20,33,61,0.05)]">
            <p className="text-sm text-[var(--muted)]">Format</p>
            <p className="mt-2 font-bold capitalize text-[var(--text)]">
              {session.delivery_mode.replace("_", " ")}
            </p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(20,33,61,0.05)]">
            <p className="text-sm text-[var(--muted)]">Access</p>
            <p className="mt-2 font-bold text-[var(--text)]">
              {session.pricing_type === "paid" && session.price_dt != null
                ? `${session.price_dt} DT`
                : "Free"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
