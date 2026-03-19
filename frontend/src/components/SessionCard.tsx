import { Link } from "react-router-dom";
import type { SessionDetail } from "../types/session";

interface SessionCardProps {
  session: SessionDetail;
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          {session.subject.name}
        </span>
        <span className="text-sm text-slate-500">{session.participant_count} joined</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{session.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{session.description ?? "No description yet."}</p>
      <div className="mt-4 space-y-1 text-sm text-slate-500">
        <p>Tutor: {session.tutor.full_name}</p>
        <p>Starts: {new Date(session.scheduled_at).toLocaleString()}</p>
      </div>
      <Link
        to={`/sessions/${session.id}`}
        className="mt-4 inline-flex text-sm font-semibold text-brand-700"
      >
        View details
      </Link>
    </article>
  );
}
