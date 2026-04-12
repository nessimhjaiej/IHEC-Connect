import { Link } from "react-router-dom";
import type { SessionDetail } from "../types";
import { Calendar, Clock, Users, Star, Video } from "lucide-react";

interface SessionCardProps { session: SessionDetail; }

export function SessionCard({ session }: SessionCardProps) {
  const isFull = session.participant_count >= session.capacity;
  const spotsLeft = session.capacity - session.participant_count;

  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 ${session.is_cancelled ? "border-red-200 opacity-70" : "border-slate-200"}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {session.subject.name}
        </span>
        <div className="flex items-center gap-1">
          {session.average_rating && (
            <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {session.average_rating.toFixed(1)}
            </span>
          )}
          {session.meet_link && (
            <span className="flex items-center gap-0.5 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <Video className="h-3 w-3" /> Meet
            </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2">{session.title}</h3>
        {session.description && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{session.description}</p>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-slate-500">
        <p className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          {new Date(session.scheduled_at).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          {session.duration_minutes} min · {session.tutor.full_name}
        </p>
        <p className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          <span className={isFull ? "text-red-500 font-medium" : spotsLeft <= 3 ? "text-orange-500 font-medium" : ""}>
            {isFull ? "Complet" : `${spotsLeft} place${spotsLeft > 1 ? "s" : ""} disponible${spotsLeft > 1 ? "s" : ""}`}
          </span>
        </p>
      </div>

      {session.is_cancelled && (
        <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded">Annulée</span>
      )}

      <Link
        to={`/sessions/${session.id}`}
        className="mt-auto inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        Voir les détails
      </Link>
    </article>
  );
}
