import { Link } from "react-router-dom";
import type { SessionDetail } from "../types/session";

interface SessionCardProps {
  session: SessionDetail;
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <article className="group overflow-hidden rounded-[30px] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_20px_60px_rgba(20,33,61,0.08)] backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-deep)]">
          {session.subject?.name ?? "Entrepreneurship"}
        </span>
        <span className="text-sm font-semibold text-[var(--muted)]">
          {session.participant_count} joined
        </span>
      </div>
      <div className="rounded-[24px] bg-gradient-to-br from-[var(--text)] to-[var(--accent)] p-5 text-white">
        <h3 className="text-xl font-bold leading-tight">{session.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm text-white/72">
          {session.description ?? "No description yet."}
        </p>
      </div>
      <div className="mt-5 grid gap-3 text-sm text-[var(--muted)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <span>{session.session_type === "tutoring" ? "Tutor" : "Host"}</span>
          <span className="font-semibold text-[var(--text)]">{session.tutor.full_name}</span>
        </div>
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <span>Starts</span>
          <span className="font-semibold text-[var(--text)]">
            {new Date(session.scheduled_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>{session.pricing_type === "paid" ? "Price" : "Capacity"}</span>
          <span className="font-semibold text-[var(--text)]">
            {session.pricing_type === "paid" && session.price_dt != null
              ? `${session.price_dt} DT`
              : `${session.capacity} seats`}
          </span>
        </div>
      </div>
      <Link
        to={`/sessions/${session.id}`}
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-deep)] transition group-hover:translate-x-1"
      >
        View academic session
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
