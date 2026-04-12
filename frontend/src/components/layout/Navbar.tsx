import { Link, NavLink } from "react-router-dom";
import { useCurrentUser, useLogout } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { GraduationCap, LayoutDashboard, LogOut, Calendar, Briefcase, FileText, User } from "lucide-react";


export function Navbar() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-blue-700">
          <GraduationCap className="h-6 w-6" />
          <span>IHEC Connect</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <NavLink to="/sessions" className={({ isActive }) => isActive ? "text-blue-700 font-semibold" : "hover:text-blue-700 transition-colors"}>
            <span className="flex items-center gap-1"><LayoutDashboard className="h-4 w-4" /> Sessions</span>
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => isActive ? "text-blue-700 font-semibold" : "hover:text-blue-700 transition-colors"}>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Événements</span>
          </NavLink>
          <NavLink to="/opportunities" className={({ isActive }) => isActive ? "text-blue-700 font-semibold" : "hover:text-blue-700 transition-colors"}>
            <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> Opportunités</span>
          </NavLink>
          <NavLink to="/documents" className={({ isActive }) => isActive ? "text-blue-700 font-semibold" : "hover:text-blue-700 transition-colors"}>
            <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> Documents</span>
          </NavLink>
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `hidden md:flex items-center gap-1 ${isActive ? "text-blue-700 font-semibold" : "text-slate-600 hover:text-blue-700"}`}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-1 ${isActive ? "text-blue-700 font-semibold" : "text-slate-600 hover:text-blue-700"}`}>
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{user.full_name.split(" ")[0]}</span>
              </NavLink>
              <Button
                className="bg-slate-800 hover:bg-slate-700 flex items-center gap-1 text-xs px-3 py-1.5"
                onClick={() => void logout()}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Déconnexion</span>
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-slate-600 hover:text-blue-700 transition-colors">
                Connexion
              </NavLink>
              <Button className="text-xs px-4 py-2">
                <Link to="/register">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
