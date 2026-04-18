import type { FormEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const successMessage = location.state && typeof location.state === "object" ? (location.state as { message?: string }).message : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      await login.mutateAsync(form);
      navigate("/dashboard");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Echec de connexion.");
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[32px] border border-white/70 bg-white p-7 shadow-[0_24px_60px_rgba(30,41,59,0.15)]">
      <p className="text-xs uppercase tracking-[0.25em] text-[#5b52cb]">IHEC Connect</p>
      <h1 className="mt-2 text-3xl font-semibold text-[#5b52cb]">Connexion</h1>
      <p className="mt-2 text-sm text-slate-500">Accede a ton espace etudiant.</p>
      {successMessage && (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      )}
      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
        <Input
          label="Mot de passe"
          type="password"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
        />
        <Button className="w-full" disabled={login.isPending} type="submit">
          {login.isPending ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
