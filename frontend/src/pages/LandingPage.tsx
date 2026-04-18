import { Link } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useSessions } from "../hooks/useSessions";
import { Button } from "../components/ui/Button";
import { GraduationCap, BookOpen, Calendar, Briefcase, FileText, Star } from "lucide-react";
import { PlatformCalendar } from "../components/PlatformCalendar";
import ihecCampusImage from "../../image/494027740_1349030946899691_6234677823881717959_n.jpg";

const features = [
  { icon: BookOpen, title: "Séances de tutorat", desc: "Trouvez et réservez des séances avec des tuteurs qualifiés de l'IHEC.", color: "bg-blue-50 text-blue-600" },
  { icon: Calendar, title: "Événements", desc: "Restez informé des workshops, formations et événements entrepreneuriaux.", color: "bg-green-50 text-green-600" },
  { icon: Briefcase, title: "Opportunités", desc: "Accédez aux offres de stages et emplois centralisées pour les étudiants.", color: "bg-purple-50 text-purple-600" },
  { icon: FileText, title: "Documents", desc: "Partagez et téléchargez des ressources pédagogiques par matière.", color: "bg-orange-50 text-orange-600" },
  { icon: Star, title: "Évaluations", desc: "Notez vos tuteurs et consultez les avis de la communauté.", color: "bg-yellow-50 text-yellow-600" },
];

export function LandingPage() {
  const { data: sessions = [] } = useSessions();
  const { data: events = [] } = useEvents();

  const calendarItems = [
    ...sessions.map((session) => ({
      id: `session-${session.id}`,
      title: `Séance: ${session.title}`,
      start: session.scheduled_at,
      color: "#2563eb",
    })),
    ...events.map((event) => ({
      id: `event-${event.id}`,
      title: `Événement: ${event.title}`,
      start: event.starts_at,
      color: "#16a34a",
    })),
  ];

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="grid gap-10 md:grid-cols-[1.4fr,1fr] md:items-center pt-8">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ecebff] px-4 py-2 text-sm font-semibold text-[#5f56d8]">
            <GraduationCap className="h-4 w-4" />
            Plateforme académique & entrepreneuriale — IHEC Carthage
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl leading-tight">
            Connectez-vous,<br />
            <span className="text-[#5f56d8]">Apprenez, Progressez.</span>
          </h1>
          <p className="max-w-xl text-lg text-slate-600 leading-relaxed">
            IHEC Connect relie les étudiants et tuteurs de l'IHEC Carthage sur une seule plateforme : tutorat, événements, opportunités professionnelles et ressources pédagogiques.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="px-6 py-2.5 text-sm">
              <Link to="/register">Créer un compte</Link>
            </Button>
            <Link
              to="/sessions"
              className="inline-flex items-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              Explorer les séances
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-2 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur">
          <img
            src={ihecCampusImage}
            alt="Campus IHEC Carthage"
            className="h-[320px] w-full rounded-[22px] object-cover md:h-[420px]"
            loading="lazy"
          />
        </div>

      </section>

      <section className="space-y-5">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Calendrier de la plateforme</h2>
          <p className="mt-2 text-slate-500">Séances de tutorat et événements regroupés dans une vue unique.</p>
        </div>
        <PlatformCalendar title="Activité à venir" items={calendarItems} />
      </section>

      {/* Features */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Tout ce dont vous avez besoin</h2>
          <p className="mt-2 text-slate-500">Une plateforme unique pour votre parcours académique et professionnel</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex rounded-xl p-3 ${feature.color} mb-4`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
