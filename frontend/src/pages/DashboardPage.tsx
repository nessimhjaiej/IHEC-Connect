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
    <section className="space-y-8">
      <div className="grid gap-5 xl:grid-cols-[1.5fr,0.8fr]">
        <div className="rounded-[36px] bg-[var(--text)] p-8 text-white shadow-[0_24px_80px_rgba(20,33,61,0.16)]">
          <p className="text-sm uppercase tracking-[0.2em] text-white/55">Dashboard</p>
          <h1 className="mt-3 font-['Space_Grotesk'] text-4xl font-bold">
            Welcome back, {user?.full_name}
          </h1>
          <p className="mt-4 max-w-2xl text-white/72">
            Track upcoming learning sessions, keep your academic profile current, and manage your
            activity from one place.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] bg-white/10 p-4">
              <p className="text-3xl font-bold">{sessions.length}</p>
              <p className="mt-1 text-sm text-white/65">Available sessions</p>
            </div>
            <div className="rounded-[24px] bg-white/10 p-4">
              <p className="text-3xl font-bold">{relevantSessions.length}</p>
              <p className="mt-1 text-sm text-white/65">Pinned for you</p>
            </div>
            <div className="rounded-[24px] bg-white/10 p-4">
              <p className="text-3xl font-bold capitalize">{user?.role ?? "Member"}</p>
              <p className="mt-1 text-sm text-white/65">Current profile</p>
            </div>
          </div>
        </div>

        <div className="rounded-[36px] border border-[var(--line)] bg-white p-7 shadow-[0_18px_50px_rgba(20,33,61,0.06)]">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--brand-deep)]">
            Quick actions
          </p>
          <div className="mt-5 grid gap-3">
            <Link
              to="/sessions"
              className="rounded-[22px] bg-[#f5f7fa] px-4 py-4 font-semibold text-[var(--text)]"
            >
              Explore sessions and events
            </Link>
            <Link
              to="/profile"
              className="rounded-[22px] bg-[#f5f7fa] px-4 py-4 font-semibold text-[var(--text)]"
            >
              Update your profile
            </Link>
            {(user?.role === "tutor" || user?.role === "alumni") && (
              <Button className="mt-2 w-full bg-[var(--brand)] hover:bg-[var(--brand-deep)]">
                <Link to="/sessions/new">Create a new listing</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Curated for you
        </p>
        <p className="mt-2 text-[var(--muted)]">
          Track upcoming learning sessions, keep your academic profile current, and manage your
          activity from one place.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {relevantSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}
