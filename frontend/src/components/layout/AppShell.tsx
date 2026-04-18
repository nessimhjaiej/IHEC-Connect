import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { clearAuthStorage, setAccessToken } from "../../utils/storage";
import { CourseShell } from "./CourseShell";

export function AppShell() {
  const { pathname } = useLocation();

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        setAccessToken(session.access_token);
      } else {
        clearAuthStorage();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAdminRoute) {
    return (
      <div className="min-h-screen">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_10%_5%,#d8c7ff_0%,#efe7ff_45%,#f7f3ff_100%)] px-4 py-10">
        <main className="mx-auto max-w-xl">
          <Outlet />
        </main>
      </div>
    );
  }

  return <CourseShell />;
}
