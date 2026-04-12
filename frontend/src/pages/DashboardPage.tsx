import { Link } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth";
import { useSessions, useMySessions } from "../hooks/useSessions";
import { useEvents } from "../hooks/useEvents";
import { useMyDocuments } from "../hooks/useDocuments";
import { Button } from "../components/ui/Button";
import { SessionCard } from "../components/SessionCard";
import { BookOpen, Calendar, FileText, Loader2, Plus, Users } from "lucide-react";

export function DashboardPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: allSessions = [], isLoading: allSessionsLoading } = useSessions();
  const { data: mySessions = [], isLoading: mySessionsLoading } = useMySessions();
  const { data: events = [], isLoading: eventsLoading } = useEvents();
  const { data: myDocs = [], isLoading: docsLoading } = useMyDocuments();

  const isLoading = userLoading || allSessionsLoading || mySessionsLoading || eventsLoading || docsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          Chargement du tableau de bord...
        </div>
      </div>
    );
  }

  const isTutor = user?.role === "tutor";
  const isAdmin = user?.role === "admin";
  const displaySessions = isTutor ? mySessions.slice(0, 3) : allSessions.slice(0, 3);
  const upcomingEvents = events.filter((e) => new Date(e.starts_at) > new Date()).slice(0, 3);

  return (
    <section className="space-y-8">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-800 p-6 text-white">
        <p className="text-sm uppercase tracking-widest text-blue-200 mb-1">Tableau de bord</p>
        <h1 className="text-2xl font-bold">Bonjour, {user?.full_name} 👋</h1>
        <p className="mt-2 text-blue-100 text-sm max-w-xl">
          {isTutor
            ? "Gérez vos séances de tutorat et consultez les documents partagés."
            : isAdmin
            ? "Gérez la plateforme, les utilisateurs, événements et opportunités."
            : "Explorez les séances de tutorat, événements et opportunités professionnelles."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {isTutor && (
            <Button className="bg-white text-blue-700 hover:bg-blue-50 text-sm flex items-center gap-1.5">
              <Link to="/sessions/new" className="flex items-center gap-1.5"><Plus className="h-4 w-4" /> Créer une séance</Link>
            </Button>
          )}
          {isAdmin && (
            <>
              <Button className="bg-white text-blue-700 hover:bg-blue-50 text-sm">
                <Link to="/admin/events">Gérer les événements</Link>
              </Button>
              <Button className="bg-white text-blue-700 hover:bg-blue-50 text-sm">
                <Link to="/admin/users">Gérer les utilisateurs</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Séances disponibles", value: allSessions.length, icon: BookOpen, color: "text-blue-600 bg-blue-50" },
          { label: isTutor ? "Mes séances" : "Mes inscriptions", value: mySessions.length, icon: Users, color: "text-green-600 bg-green-50" },
          { label: "Événements à venir", value: upcomingEvents.length, icon: Calendar, color: "text-purple-600 bg-purple-50" },
          { label: "Mes documents", value: myDocs.length, icon: FileText, color: "text-orange-600 bg-orange-50" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-sm">
            <div className={`rounded-xl p-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isTutor ? "Mes séances récentes" : "Séances disponibles"}
          </h2>
          <Link to="/sessions" className="text-sm text-blue-600 hover:underline">Voir tout →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {displaySessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
          {displaySessions.length === 0 && (
            <p className="text-slate-400 text-sm col-span-3 py-8 text-center">Aucune séance pour le moment.</p>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Événements à venir</h2>
            <Link to="/events" className="text-sm text-blue-600 hover:underline">Voir tout →</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full capitalize">{event.type}</span>
                <h3 className="mt-2 font-semibold text-sm text-slate-900">{event.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{new Date(event.starts_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                <p className="text-xs text-slate-400 mt-0.5">{event.participant_count}/{event.capacity} inscrits</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
