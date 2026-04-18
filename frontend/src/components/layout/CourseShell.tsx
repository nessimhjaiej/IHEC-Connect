import { useMemo } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Grid3X3,
  LayoutDashboard,
  Link2,
  MessageCircle,
  Settings,
  UserCircle2,
  Users,
} from "lucide-react";
import { useCurrentUser } from "../../hooks/useAuth";
import { useSessions } from "../../hooks/useSessions";
import { useUsers } from "../../hooks/useUsers";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getPageTitle(pathname: string) {
  if (pathname === "/" || pathname.startsWith("/dashboard")) return "Accueil";
  if (pathname.startsWith("/sessions")) return "Séances";
  if (pathname.startsWith("/documents")) return "Documents";
  if (pathname.startsWith("/events")) return "Événements";
  if (pathname.startsWith("/opportunities")) return "Opportunités";
  if (pathname.startsWith("/profile")) return "Profil";
  return "Espace étudiant";
}

function SidebarItem({
  label,
  icon: Icon,
  to,
}: {
  label: string;
  icon: typeof LayoutDashboard;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
          isActive
            ? "bg-white text-[#5f56d8] shadow-[0_8px_20px_rgba(15,23,42,0.12)]"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
}

export function CourseShell() {
  const location = useLocation();
  const { data: currentUser } = useCurrentUser();
  const { data: sessions = [] } = useSessions();
  const { data: users = [] } = useUsers();

  const onlineUsers = users.filter((user) => user.is_active).slice(0, 4);
  const upcomingSessions = useMemo(
    () =>
      [...sessions]
        .filter((session) => !session.is_cancelled && new Date(session.scheduled_at) > new Date())
        .sort((a, b) => +new Date(a.scheduled_at) - +new Date(b.scheduled_at))
        .slice(0, 3),
    [sessions]
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_5%,#d8c7ff_0%,#efe7ff_45%,#f7f3ff_100%)] p-4 md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1500px] gap-4 rounded-[38px] border border-white/70 bg-[#f8f7ff]/80 p-3 shadow-[0_30px_100px_rgba(30,41,59,0.14)] backdrop-blur lg:grid-cols-[220px_minmax(0,1fr)_290px] lg:p-4">
        <aside className="rounded-[30px] bg-gradient-to-b from-[#5f56d8] to-[#6d63e4] p-5 text-white shadow-[0_24px_60px_rgba(95,86,216,0.45)]">
          <div className="flex h-full flex-col gap-6">
            <div className="px-2 pt-1">
              <Link to="/" className="text-2xl font-semibold tracking-tight">IHEC Connect</Link>
            </div>

            <div className="space-y-2">
              <SidebarItem label="Accueil" icon={LayoutDashboard} to="/dashboard" />
              <SidebarItem label="Séances" icon={Grid3X3} to="/sessions" />
              <SidebarItem label="Documents" icon={MessageCircle} to="/documents" />
              <SidebarItem label="Événements" icon={Users} to="/events" />
              <SidebarItem label="Opportunités" icon={CalendarDays} to="/opportunities" />
            </div>

            <div className="mt-auto space-y-2">
              <SidebarItem label="Paramètres" icon={Settings} to="/profile" />
              <SidebarItem label="Gestion utilisateurs" icon={UserCircle2} to="/admin" />
            </div>
          </div>
        </aside>

        <main className="rounded-[30px] bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">IHEC Connect</p>
              <h1 className="mt-1 text-2xl font-semibold text-[#5b52cb]">{getPageTitle(location.pathname)}</h1>
            </div>
            <Link
              to={currentUser?.role === "admin" ? "/admin" : "/profile"}
              className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#5f56d8] text-xs font-semibold text-white">
                {getInitials(currentUser?.full_name ?? "Admin")}
              </div>
              <span className="text-xs font-semibold text-slate-700">{currentUser?.full_name ?? "Guest"}</span>
            </Link>
          </header>

          <Outlet />
        </main>

        <aside className="rounded-[30px] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
          <div>
            <h2 className="text-2xl font-semibold text-[#5b52cb]">Aperçu rapide</h2>
            <div className="mt-4 grid gap-2">
              <div className="flex items-center justify-between rounded-2xl bg-[#f4f3ff] px-3 py-2">
                <span className="text-xs font-semibold text-slate-600">Séances disponibles</span>
                <span className="text-sm font-bold text-[#5f56d8]">{sessions.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#f4f3ff] px-3 py-2">
                <span className="text-xs font-semibold text-slate-600">Utilisateurs actifs</span>
                <span className="text-sm font-bold text-[#5f56d8]">{onlineUsers.length}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#5b52cb]">Accès rapide</h3>
            </div>
            <div className="space-y-2">
              <Link to="/sessions" className="flex items-center gap-2 rounded-2xl border border-[#ebe9ff] px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#f8f7ff]">
                <Grid3X3 className="h-4 w-4 text-[#5f56d8]" /> Voir toutes les séances
              </Link>
              <Link to="/events" className="flex items-center gap-2 rounded-2xl border border-[#ebe9ff] px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#f8f7ff]">
                <CalendarDays className="h-4 w-4 text-[#5f56d8]" /> Voir les événements
              </Link>
              <Link to="/opportunities" className="flex items-center gap-2 rounded-2xl border border-[#ebe9ff] px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#f8f7ff]">
                <Link2 className="h-4 w-4 text-[#5f56d8]" /> Voir les opportunités
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#5b52cb]">Prochaines séances</h3>
            </div>

            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="rounded-2xl border border-[#ebe9ff] p-3">
                  <p className="truncate text-sm font-semibold text-slate-800">{session.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Clock3 className="h-3.5 w-3.5 text-[#5f56d8]" />
                    {new Date(session.scheduled_at).toLocaleString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}

              {upcomingSessions.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
                  Aucune séance planifiée.
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#5b52cb]">En ligne</h3>
            </div>

            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#d9e7ff] text-xs font-semibold text-[#4f46c4]">
                    {getInitials(user.full_name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-700">{user.full_name}</p>
                    <p className="truncate text-xs text-slate-400">{user.email}</p>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#5f56d8]" />
                </div>
              ))}

              {onlineUsers.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
                  Aucun utilisateur actif.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}