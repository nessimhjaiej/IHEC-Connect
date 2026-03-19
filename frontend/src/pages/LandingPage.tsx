import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function LandingPage() {
  return (
    <section className="grid gap-10 md:grid-cols-[1.4fr,1fr] md:items-center">
      <div className="space-y-6">
        <span className="inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
          Collaborative academic sessions for students and tutors
        </span>
        <div className="space-y-4">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Organize group learning sessions with less friction.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            IHEC Connect helps tutors publish academic sessions and lets students discover, join,
            and track the sessions that matter to them.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button>
            <Link to="/register">Create your account</Link>
          </Button>
          <Link
            to="/sessions"
            className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Explore sessions
          </Link>
        </div>
      </div>
      <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
        <h2 className="text-xl font-semibold">MVP focus</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-200">
          <p>Students join open sessions by subject and schedule.</p>
          <p>Tutors create group sessions with capacity and timing.</p>
          <p>Teams can extend the scaffold into scheduling, messaging, and payments later.</p>
        </div>
      </div>
    </section>
  );
}
