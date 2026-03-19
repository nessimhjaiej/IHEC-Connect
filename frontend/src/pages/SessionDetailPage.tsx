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
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {session.subject.name}
            </span>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{session.title}</h1>
          </div>
          {user?.role === "student" && (
            <Button onClick={() => joinSession.mutate(session.id)} disabled={joinSession.isPending}>
              {joinSession.isPending ? "Joining..." : "Join session"}
            </Button>
          )}
        </div>
        <p className="mt-4 text-slate-600">{session.description ?? "No description provided."}</p>
        <div className="mt-6 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          <p>Tutor: {session.tutor.full_name}</p>
          <p>Schedule: {new Date(session.scheduled_at).toLocaleString()}</p>
          <p>Duration: {session.duration_minutes} minutes</p>
          <p>Capacity: {session.capacity}</p>
          <p>Participants: {session.participant_count}</p>
        </div>
      </div>
    </section>
  );
}
