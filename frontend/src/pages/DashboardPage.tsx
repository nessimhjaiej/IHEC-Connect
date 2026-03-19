import { Link } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth";
import { useSessions } from "../hooks/useSessions";
import { Button } from "../components/ui/Button";
import { SessionCard } from "../components/SessionCard";

export function DashboardPage() {
  const { data: user } = useCurrentUser();
  const { data: sessions = [] } = useSessions();

  const relevantSessions = sessions.slice(0, 3);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-slate-900 p-6 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">Welcome back, {user?.full_name}</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Track upcoming learning sessions, keep your academic profile current, and manage your
          activity from one place.
        </p>
        {user?.role === "tutor" && (
          <Button className="mt-4">
            <Link to="/sessions/new">Create a new session</Link>
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {relevantSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}
