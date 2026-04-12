import { useState } from "react";
import { useOpportunities } from "../hooks/useOpportunities";
import { Briefcase, MapPin, Globe, Clock, ExternalLink, Loader2 } from "lucide-react";

const OPP_TYPES = ["Tous", "internship", "job", "freelance", "competition"];
const TYPE_LABELS: Record<string, string> = {
  internship: "Stage", job: "Emploi", freelance: "Freelance", competition: "Concours",
};

export function OpportunitiesPage() {
  const { data: opportunities = [], isLoading } = useOpportunities();
  const [filter, setFilter] = useState("Tous");

  const filtered = filter === "Tous" ? opportunities : opportunities.filter((o) => o.opportunity_type === filter);

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Opportunités</h1>
        <p className="text-slate-500 text-sm mt-1">Stages, emplois et opportunités pour les étudiants de l'IHEC</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {OPP_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === type ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {TYPE_LABELS[type] ?? type}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((opp) => {
          const isExpired = opp.deadline && new Date(opp.deadline) < new Date();
          return (
            <article key={opp.id} className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 ${isExpired ? "opacity-60" : "border-slate-200"}`}>
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  {TYPE_LABELS[opp.opportunity_type] ?? opp.opportunity_type}
                </span>
                {opp.is_remote && (
                  <span className="text-xs flex items-center gap-0.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    <Globe className="h-3 w-3" /> Remote
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">{opp.title}</h3>
                <p className="text-sm text-slate-600 font-medium">{opp.company}</p>
              </div>

              {opp.description && <p className="text-xs text-slate-500 line-clamp-3">{opp.description}</p>}

              <div className="space-y-1 text-xs text-slate-500">
                {opp.location && (
                  <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" />{opp.location}</p>
                )}
                {opp.deadline && (
                  <p className={`flex items-center gap-1.5 ${isExpired ? "text-red-500" : ""}`}>
                    <Clock className="h-3.5 w-3.5" />
                    {isExpired ? "Expirée — " : "Deadline : "}
                    {new Date(opp.deadline).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>

              {opp.apply_url && (
                <a
                  href={opp.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Postuler <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </article>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-slate-400 text-sm col-span-3 py-12 text-center">Aucune opportunité disponible.</p>
        )}
      </div>
    </section>
  );
}
