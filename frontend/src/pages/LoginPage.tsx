import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await login.mutateAsync(form);
    navigate("/dashboard");
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr,1.1fr]">
      <div className="rounded-[36px] bg-[var(--text)] p-8 text-white shadow-[0_24px_80px_rgba(20,33,61,0.16)]">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/55">Access your workspace</p>
        <h1 className="mt-4 font-['Space_Grotesk'] text-4xl font-bold">Pick up where your study flow left off.</h1>
        <p className="mt-4 text-white/72">
          Sign in to browse sessions, join active groups, and manage your academic profile.
        </p>
      </div>
      <div className="rounded-[36px] border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(20,33,61,0.08)]">
        <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-[var(--text)]">Login</h2>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
          />
          <Button className="w-full bg-[var(--brand)] hover:bg-[var(--brand-deep)]" disabled={login.isPending} type="submit">
            {login.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </section>
  );
}
