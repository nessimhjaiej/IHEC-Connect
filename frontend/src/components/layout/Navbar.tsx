import { Link, NavLink } from "react-router-dom";
import { useCurrentUser, useLogout } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export function Navbar() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-bold text-slate-900">
          IHEC Connect
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-600">
          <NavLink to="/sessions">Sessions</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <Button className="bg-slate-900 hover:bg-slate-800" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Button>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
