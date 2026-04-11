import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { clearAuthStorage, setAccessToken } from "../../utils/storage";
import { Navbar } from "./Navbar";

export function AppShell() {
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Outlet />
      </main>
    </div>
  );
}
