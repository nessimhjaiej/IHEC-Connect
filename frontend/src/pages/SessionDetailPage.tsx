import { useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useCurrentUser } from "../hooks/useAuth";
import { useJoinSession, useSession } from "../hooks/useSessions";
import { useDocuments } from "../hooks/useDocuments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReview, fetchReviewsForSession } from "../services/reviews";
import { getDocumentDownloadUrl } from "../services/documents";
import { Calendar, Clock, Download, Loader2, Star, Users, Video } from "lucide-react";

export function SessionDetailPage() {
  const { sessionId } = useParams();
  const { data: user } = useCurrentUser();
  const { data: session, isLoading } = useSession(sessionId);
  const joinSession = useJoinSession();
  const { data: docs = [] } = useDocuments(Number(sessionId));
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", "session", sessionId],
    queryFn: () => fetchReviewsForSession(Number(sessionId)),
    enabled: Boolean(sessionId),
  });

  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const submitReview = useMutation({
    mutationFn: () => createReview({ session_id: session!.id, reviewee_id: session!.tutor_id, rating, comment }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["reviews"] }); setRating(0); setComment(""); },
  });

  if (isLoading || !session) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );

  const isFull = session.participant_count >= session.capacity;

  return (
    <section className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {session.subject.name}
              </span>
              {session.is_cancelled && <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-semibold">Annulée</span>}
              {session.meet_link && (
                <a href={session.meet_link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-semibold hover:bg-green-100 transition-colors">
                  <Video className="h-3.5 w-3.5" /> Rejoindre le Meet
                </a>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{session.title}</h1>
          </div>
          {user?.role === "student" && !session.is_cancelled && (
            <Button onClick={() => joinSession.mutate(session.id)} disabled={joinSession.isPending || isFull}>
              {isFull ? "Complet" : joinSession.isPending ? "Inscription..." : "Rejoindre la séance"}
            </Button>
          )}
        </div>
        <p className="mt-4 text-slate-600">{session.description ?? "Aucune description fournie."}</p>
        <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-2 border-t border-slate-100 pt-4">
          <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" />{new Date(session.scheduled_at).toLocaleString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" />{session.duration_minutes} minutes</p>
          <p className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-400" />{session.participant_count}/{session.capacity} participants</p>
          <p className="flex items-center gap-2">
            <span className="text-slate-400">👨‍🏫</span> Tuteur : <strong>{session.tutor.full_name}</strong>
          </p>
          {session.average_rating && (
            <p className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              Évaluation moyenne : {session.average_rating.toFixed(1)}/5
            </p>
          )}
        </div>
      </div>

      {/* Documents */}
      {docs.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-3">Documents de la séance ({docs.length})</h2>
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                <span className="text-sm text-slate-700">{doc.title}</span>
                <a href={getDocumentDownloadUrl(doc.id)} download
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <Download className="h-3.5 w-3.5" /> Télécharger
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-slate-900">Évaluations ({reviews.length})</h2>
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-slate-100 pb-3 last:border-0">
            <div className="flex items-center gap-1 mb-1">
              {[1,2,3,4,5].map((s) => <Star key={s} className={`h-4 w-4 ${s <= r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />)}
            </div>
            {r.comment && <p className="text-sm text-slate-600">{r.comment}</p>}
            <p className="text-xs text-slate-400 mt-1">{new Date(r.created_at).toLocaleDateString("fr-FR")}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-slate-400">Aucune évaluation pour le moment.</p>}

        {/* Submit Review */}
        {user?.role === "student" && (
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); submitReview.mutate(); }} className="border-t border-slate-100 pt-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">Laisser une évaluation</h3>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <button key={s} type="button" onClick={() => setRating(s)}>
                  <Star className={`h-6 w-6 cursor-pointer transition-colors ${s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200 hover:text-amber-300"}`} />
                </button>
              ))}
            </div>
            <textarea
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Votre commentaire (optionnel)"
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button type="submit" disabled={rating === 0 || submitReview.isPending} className="text-sm">
              {submitReview.isPending ? "Envoi..." : "Soumettre"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
