import { Link, NavLink } from "react-router-dom";
import { useCurrentUser, useLogout } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export function Navbar() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(246,246,243,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--text)] font-['Space_Grotesk'] text-sm font-bold text-white">
            IC
          </span>
          <div>
            <p className="font-['Space_Grotesk'] text-lg font-bold tracking-tight text-[var(--text)]">
              IHEC Connect
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--muted)]">
              Learning and entrepreneurship network
            </p>
          </div>
        </Link>

        <div className="min-w-[220px] flex-1 rounded-full border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-[var(--muted)] shadow-[0_10px_30px_rgba(20,33,61,0.06)]">
          Search sessions, hosts, subjects
        </div>

        <nav className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
          <NavLink
            to="/sessions"
            className="rounded-full px-4 py-2 transition hover:bg-white hover:text-[var(--text)]"
          >
            Discover
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className="rounded-full px-4 py-2 transition hover:bg-white hover:text-[var(--text)]"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                className="rounded-full px-4 py-2 transition hover:bg-white hover:text-[var(--text)]"
              >
                Profile
              </NavLink>
              <Button className="bg-[var(--text)] px-4 py-2.5" onClick={() => void logout()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-full px-4 py-2 transition hover:bg-white hover:text-[var(--text)]"
              >
                Login
              </NavLink>
              <Button className="bg-[var(--brand)] hover:bg-[var(--brand-deep)]">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
