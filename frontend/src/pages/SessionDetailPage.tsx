import { useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useCurrentUser } from "../hooks/useAuth";
import { useJoinSession, useSession } from "../hooks/useSessions";
import { useDocuments } from "../hooks/useDocuments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReview, fetchReviewsForSession } from "../services/reviews";
import { getDocumentDownloadUrl } from "../services/documents";
import { Calendar, Clock, Download, Loader2, Star, Users, Video, X } from "lucide-react";

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
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationName, setRegistrationName] = useState("");
  const [registrationEmail, setRegistrationEmail] = useState("");

  const submitReview = useMutation({
    mutationFn: () => createReview({ session_id: session!.id, reviewee_id: session!.tutor_id, rating, comment }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["reviews"] }); setRating(0); setComment(""); },
  });

  const handleRegistrationSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (registrationName.trim() && registrationEmail.trim()) {
      joinSession.mutate(session!.id);
      setShowRegistrationModal(false);
      setRegistrationName("");
      setRegistrationEmail("");
    }
  };

  if (isLoading || !session) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-[#5f56d8]" />
    </div>
  );

  const isFull = session.participant_count >= session.capacity;

  return (
    <section className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="rounded-[30px] border border-[#ebe9ff] bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="rounded-full bg-[#ecebff] px-3 py-1 text-xs font-semibold text-[#6b63e8]">
                {session.subject.name}
              </span>
              {session.is_cancelled && <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-semibold">Annulée</span>}
              {session.meet_link && (
                <a href={session.meet_link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-[#5f56d8] bg-[#ecebff] px-3 py-1 rounded-full font-semibold hover:bg-[#e5e2ff] transition-colors">
                  <Video className="h-3.5 w-3.5" /> Rejoindre le Meet
                </a>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{session.title}</h1>
          </div>
          {user?.role === "student" && !session.is_cancelled && (
            <Button onClick={() => setShowRegistrationModal(true)} disabled={joinSession.isPending || isFull} className="gap-2">
              {isFull ? "Complet" : joinSession.isPending ? "Inscription..." : "S'inscrire à la séance"}
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
        <div className="rounded-[28px] border border-[#ebe9ff] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
          <h2 className="font-semibold text-slate-900 mb-3">Documents de la séance ({docs.length})</h2>
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                <span className="text-sm text-slate-700">{doc.title}</span>
                <a href={getDocumentDownloadUrl(doc.id)} download
                  className="flex items-center gap-1 text-xs text-[#5f56d8] hover:underline">
                  <Download className="h-3.5 w-3.5" /> Télécharger
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="rounded-[28px] border border-[#ebe9ff] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.08)] space-y-4">
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
              className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#5f56d8] focus:ring-4 focus:ring-[#e7e4ff]"
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

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-[30px] border border-[#ebe9ff] bg-white p-6 shadow-[0_30px_100px_rgba(30,41,59,0.2)]">
            <button
              onClick={() => setShowRegistrationModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold text-[#5b52cb]">S'inscrire à la séance</h2>
            <p className="mt-2 text-sm text-slate-600">Veuillez fournir vos informations pour confirmer votre inscription</p>

            <form onSubmit={handleRegistrationSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Nom complet</label>
                <input
                  type="text"
                  value={registrationName}
                  onChange={(e) => setRegistrationName(e.target.value)}
                  placeholder="Ex: Ahmed Ben Ali"
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#5f56d8] focus:ring-4 focus:ring-[#e7e4ff]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={registrationEmail}
                  onChange={(e) => setRegistrationEmail(e.target.value)}
                  placeholder="Ex: ahmed@yahoo.com"
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#5f56d8] focus:ring-4 focus:ring-[#e7e4ff]"
                  required
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <Button
                  type="submit"
                  disabled={!registrationName.trim() || !registrationEmail.trim() || joinSession.isPending}
                  className="flex-1"
                >
                  {joinSession.isPending ? "Inscription..." : "Confirmer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
