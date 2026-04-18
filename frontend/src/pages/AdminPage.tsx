import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Download,
  Grid3X3,
  LayoutDashboard,
  MessageCircle,
  Search,
  Settings,
  Trash2,
  UserCheck,
  UserCircle2,
  Users,
  X,
} from "lucide-react";
import { useCurrentUser } from "../hooks/useAuth";
import { useSessions } from "../hooks/useSessions";
import { useUsers } from "../hooks/useUsers";
import type { SessionDetail, User, TutorApplication, TutorVerificationRequest } from "../types";

const daysLabel = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const palette = [
  {
    card: "from-[#efefff] to-[#f8f9ff]",
    dot: "bg-[#7f78f6]",
    chip: "bg-[#ecebff] text-[#6b63e8]",
  },
  {
    card: "from-[#f8ecff] to-[#fff5ff]",
    dot: "bg-[#b775e6]",
    chip: "bg-[#f5e8ff] text-[#a057da]",
  },
  {
    card: "from-[#ffeef5] to-[#fff6fa]",
    dot: "bg-[#e678a8]",
    chip: "bg-[#ffe8f2] text-[#d45c92]",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function buildMonthGrid(date: Date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const startIndex = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - startIndex);

  return Array.from({ length: 35 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
}

function shortDate(dateString: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function monthTitle(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "short",
    year: "numeric",
  }).format(date);
}

// Demo tutor applications
const demoPendingApplications: TutorApplication[] = [
  {
    id: 1,
    tutor_id: "tutor-app-1",
    tutor: {
      id: "tutor-app-1",
      full_name: "Sarah Ben Ahmed",
      email: "sarah.ahmed@ihec.tn",
      role: "tutor",
      is_active: true,
      created_at: new Date().toISOString(),
      tutor_status: "unverified",
      tutor_verification_status: "pending",
    },
    status: "pending",
    submitted_grades_url: "/grades/sarah-ahmed-2024.pdf",
    grades_file_name: "Mathematics-Grades-2024.pdf",
    submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    tutor_id: "tutor-app-2",
    tutor: {
      id: "tutor-app-2",
      full_name: "Mohamed Krim",
      email: "krim.mohamed@ihec.tn",
      role: "tutor",
      is_active: true,
      created_at: new Date().toISOString(),
      tutor_status: "unverified",
      tutor_verification_status: "pending",
    },
    status: "pending",
    submitted_grades_url: "/grades/krim-2024.pdf",
    grades_file_name: "Physics-Grades-2024.pdf",
    submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

// Demo verification requests
const demoVerificationRequests: TutorVerificationRequest[] = [
  {
    id: 1,
    tutor_id: "demo-tutor-1",
    tutor: {
      id: "demo-tutor-1",
      full_name: "Amina Habib",
      email: "tutor@ihec-connect.tn",
      role: "tutor",
      is_active: true,
      created_at: new Date().toISOString(),
      tutor_status: "unverified",
      tutor_verification_status: "pending",
      professor_verified: false,
    },
    status: "pending",
    message: "Demande de verification par professeur en mathematiques",
    submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

function TutorApplicationCard({ app, onApprove, onReject }: { app: TutorApplication; onApprove: () => void; onReject: () => void }) {
  return (
    <div className="rounded-[24px] border border-[#ebe9ff] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#ecebff] text-xs font-semibold text-[#6b63e8]">
              {getInitials(app.tutor.full_name)}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">{app.tutor.full_name}</h4>
              <p className="text-xs text-slate-500">{app.tutor.email}</p>
            </div>
          </div>
          <div className="mt-3 rounded-[16px] bg-[#f4f3ff] p-3">
            <p className="text-xs font-medium text-slate-600">
              📄 {app.grades_file_name || "Notes soumises"}
            </p>
            <p className="mt-1 text-xs text-slate-500">Soumis le : {shortDate(app.submitted_at)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#ecebff] text-[#5f56d8] transition hover:bg-[#5f56d8] hover:text-white"
            title="Approuver"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={onReject}
            className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
            title="Rejeter"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function VerificationRequestCard({ req, onApprove, onReject }: { req: TutorVerificationRequest; onApprove: () => void; onReject: () => void }) {
  return (
    <div className="rounded-[24px] border border-[#ebe9ff] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#ecebff] text-xs font-semibold text-[#6b63e8]">
              {getInitials(req.tutor.full_name)}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">{req.tutor.full_name}</h4>
              <p className="text-xs text-slate-500">{req.tutor.email}</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="rounded-full bg-[#f4f3ff] px-3 py-1 text-xs font-semibold text-[#5f56d8]">
              <UserCheck className="mr-1 inline h-3 w-3" />
              Demande de verification professeur
            </span>
          </div>
          {req.message && <p className="mt-2 text-xs text-slate-600">{req.message}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#ecebff] text-[#5f56d8] transition hover:bg-[#5f56d8] hover:text-white"
            title="Verifier"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={onReject}
            className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
            title="Refuser"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof LayoutDashboard;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
        active
          ? "bg-white text-[#5f56d8] shadow-[0_8px_20px_rgba(15,23,42,0.12)]"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

export function AdminPage() {
  const { data: currentUser } = useCurrentUser();
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const [monthOffset, setMonthOffset] = useState(0);
  const [activeTab, setActiveTab] = useState("tutor-applications");
  const [pendingApplications, setPendingApplications] = useState(demoPendingApplications);
  const [verificationRequests, setVerificationRequests] = useState(demoVerificationRequests);

  const today = useMemo(() => new Date(), []);
  const monthDate = useMemo(() => {
    const base = new Date(today);
    base.setMonth(base.getMonth() + monthOffset);
    return base;
  }, [today, monthOffset]);

  const monthGrid = useMemo(() => buildMonthGrid(monthDate), [monthDate]);

  const allUsers = useMemo(() => users.length > 0 ? users : [], [users]);
  
  const tutorCount = useMemo(() => allUsers.filter((u) => u.role === "tutor").length, [allUsers]);
  const studentCount = useMemo(() => allUsers.filter((u) => u.role === "student").length, [allUsers]);

  const handleApproveApplication = (appId: number) => {
    setPendingApplications((prev) => prev.filter((a) => a.id !== appId));
  };

  const handleRejectApplication = (appId: number) => {
    setPendingApplications((prev) => prev.filter((a) => a.id !== appId));
  };

  const handleApproveVerification = (reqId: number) => {
    setVerificationRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  const handleRejectVerification = (reqId: number) => {
    setVerificationRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  if (sessionsLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_10%_5%,#d8c7ff_0%,#efe7ff_45%,#f7f3ff_100%)] p-4 md:p-6">
        <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1500px] place-items-center rounded-[36px] border border-white/70 bg-white/70 text-slate-500 backdrop-blur">
          Chargement de l espace admin...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_5%,#d8c7ff_0%,#efe7ff_45%,#f7f3ff_100%)] p-4 md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1500px] gap-4 rounded-[38px] border border-white/70 bg-[#f8f7ff]/80 p-3 shadow-[0_30px_100px_rgba(30,41,59,0.14)] backdrop-blur lg:grid-cols-[220px_minmax(0,1fr)_300px] lg:p-4">
        {/* Sidebar */}
        <aside className="rounded-[30px] bg-gradient-to-b from-[#5f56d8] to-[#6d63e4] p-5 text-white shadow-[0_24px_60px_rgba(95,86,216,0.45)]">
          <div className="flex h-full flex-col gap-6">
            <div className="px-2 pt-1">
              <p className="text-2xl font-semibold tracking-tight">IHEC Connect</p>
            </div>

            <div className="space-y-2">
              <SidebarItem
                label="Accueil"
                icon={LayoutDashboard}
                active={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
              />
              <SidebarItem
                label="Demandes tuteurs"
                icon={UserCheck}
                active={activeTab === "tutor-applications"}
                onClick={() => setActiveTab("tutor-applications")}
              />
              <SidebarItem
                label="Verifications"
                icon={Check}
                active={activeTab === "verifications"}
                onClick={() => setActiveTab("verifications")}
              />
              <SidebarItem
                label="Utilisateurs"
                icon={Users}
                active={activeTab === "users"}
                onClick={() => setActiveTab("users")}
              />
              <SidebarItem
                label="Seances"
                icon={Grid3X3}
                active={activeTab === "sessions"}
                onClick={() => setActiveTab("sessions")}
              />
            </div>

            <div className="mt-auto space-y-2">
              <SidebarItem label="Parametres" icon={Settings} />
              <SidebarItem label="Assistance" icon={MessageCircle} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="rounded-[30px] bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <>
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-[44px] font-semibold leading-none text-[#5b52cb] md:text-[48px]">Tableau de bord admin</h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Bienvenue {currentUser?.full_name ?? "Admin"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600">
                    <Search className="h-4 w-4" />
                  </button>
                  <button type="button" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600">
                    <Bell className="h-4 w-4" />
                  </button>
                </div>
              </header>

              {/* Stats Cards */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-[24px] border border-[#ebe9ff] bg-gradient-to-br from-[#f4f3ff] to-white p-6 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                  <div className="text-sm font-semibold text-slate-600">Total etudiants</div>
                  <div className="mt-2 text-3xl font-bold text-[#5f56d8]">{studentCount}</div>
                </div>
                <div className="rounded-[24px] border border-[#ebe9ff] bg-gradient-to-br from-[#f4f3ff] to-white p-6 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                  <div className="text-sm font-semibold text-slate-600">Tuteurs actifs</div>
                  <div className="mt-2 text-3xl font-bold text-[#5f56d8]">{tutorCount}</div>
                </div>
                <div className="rounded-[24px] border border-[#ebe9ff] bg-gradient-to-br from-[#f4f3ff] to-white p-6 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                  <div className="text-sm font-semibold text-slate-600">Demandes en attente</div>
                  <div className="mt-2 text-3xl font-bold text-orange-500">{pendingApplications.length}</div>
                </div>
                <div className="rounded-[24px] border border-[#ebe9ff] bg-gradient-to-br from-[#f4f3ff] to-white p-6 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                  <div className="text-sm font-semibold text-slate-600">Total seances</div>
                  <div className="mt-2 text-3xl font-bold text-[#5f56d8]">{sessions.length}</div>
                </div>
              </div>

              {/* Recent Application */}
              {pendingApplications.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-[#5b52cb]">Demandes tuteurs en attente</h2>
                  <div className="mt-4 space-y-3">
                    {pendingApplications.slice(0, 2).map((app) => (
                      <TutorApplicationCard
                        key={app.id}
                        app={app}
                        onApprove={() => handleApproveApplication(app.id)}
                        onReject={() => handleRejectApplication(app.id)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Tutor Applications Tab */}
          {activeTab === "tutor-applications" && (
            <>
              <h1 className="text-[44px] font-semibold leading-none text-[#5b52cb] md:text-[48px]">Demandes tuteurs</h1>
              <p className="mt-2 text-sm text-slate-500">Gerer et approuver les demandes de tutorat</p>

              <div className="mt-6 space-y-4">
                {pendingApplications.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-400">
                    Aucune demande en attente.
                  </div>
                ) : (
                  pendingApplications.map((app) => (
                    <TutorApplicationCard
                      key={app.id}
                      app={app}
                      onApprove={() => handleApproveApplication(app.id)}
                      onReject={() => handleRejectApplication(app.id)}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {/* Verifications Tab */}
          {activeTab === "verifications" && (
            <>
              <h1 className="text-[44px] font-semibold leading-none text-[#5b52cb] md:text-[48px]">Verifications tuteurs</h1>
              <p className="mt-2 text-sm text-slate-500">Demandes de verification par professeur pour les tuteurs</p>

              <div className="mt-6 space-y-4">
                {verificationRequests.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-400">
                    Aucune demande de vérification en attente.
                  </div>
                ) : (
                  verificationRequests.map((req) => (
                    <VerificationRequestCard
                      key={req.id}
                      req={req}
                      onApprove={() => handleApproveVerification(req.id)}
                      onReject={() => handleRejectVerification(req.id)}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <>
              <h1 className="text-[44px] font-semibold leading-none text-[#5b52cb] md:text-[48px]">Gestion des utilisateurs</h1>
              <p className="mt-2 text-sm text-slate-500">Suivi et gestion des utilisateurs de la plateforme</p>

              <div className="mt-6 space-y-3">
                {allUsers.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-400">
                    Aucun utilisateur.
                  </div>
                ) : (
                  allUsers.slice(0, 10).map((user) => (
                    <div key={user.id} className="flex items-center justify-between rounded-[24px] border border-[#ebe9ff] bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#ecebff] text-xs font-semibold text-[#6b63e8]">
                          {getInitials(user.full_name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.full_name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "tutor"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <>
              <h1 className="text-[44px] font-semibold leading-none text-[#5b52cb] md:text-[48px]">Toutes les seances</h1>
              <p className="mt-2 text-sm text-slate-500">Gestion et suivi des seances</p>

              <div className="mt-6 space-y-4">
                {sessions.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-400">
                    Aucune session disponible.
                  </div>
                ) : (
                  sessions.slice(0, 5).map((session: SessionDetail, index: number) => {
                    const tone = palette[index % palette.length];
                    return (
                      <article
                        key={session.id}
                        className={`rounded-[28px] bg-gradient-to-r ${tone.card} p-5 shadow-[0_14px_34px_rgba(17,24,39,0.06)]`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-[24px] font-semibold text-slate-800">{session.title}</h3>
                            <div className="mt-2 flex items-center gap-2">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone.chip}`}>
                                {session.subject?.name ?? "General"}
                              </span>
                              <span className="text-xs text-slate-500">{shortDate(session.scheduled_at)}</span>
                            </div>
                          </div>
                          <button type="button" className="text-slate-400 hover:text-slate-600">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </>
          )}
        </main>

        {/* Right Panel */}
        <aside id="calendar" className="rounded-[30px] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[32px] font-semibold leading-none text-[#5b52cb]">{monthTitle(monthDate)}</h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
                  onClick={() => setMonthOffset((v) => v - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
                  onClick={() => setMonthOffset((v) => v + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {daysLabel.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-1">
              {monthGrid.map((date) => {
                const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                const isCurrentMonth = date.getMonth() === monthDate.getMonth();
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <div
                    key={key}
                    className={`grid h-9 place-items-center rounded-full text-xs ${
                      isToday
                        ? "bg-[#5f56d8] font-semibold text-white"
                        : isCurrentMonth
                          ? "text-slate-700"
                          : "text-slate-300"
                    }`}
                  >
                    <span>{date.getDate()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-[#5b52cb]">Statistiques rapides</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-[12px] bg-[#f4f3ff] p-2.5">
                <span className="text-xs font-medium text-slate-600">En attente</span>
                <span className="text-sm font-bold text-[#5f56d8]">{pendingApplications.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-[12px] bg-[#f4f3ff] p-2.5">
                <span className="text-xs font-medium text-slate-600">Verifications</span>
                <span className="text-sm font-bold text-[#5f56d8]">{verificationRequests.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-[12px] bg-[#f4f3ff] p-2.5">
                <span className="text-xs font-medium text-slate-600">Utilisateurs actifs</span>
                <span className="text-sm font-bold text-[#5f56d8]">{allUsers.filter((u) => u.is_active).length}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
