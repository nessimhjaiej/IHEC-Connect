import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student" as "student" | "tutor"
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      const user = await register.mutateAsync(form);
      if (user) {
        navigate("/dashboard");
        return;
      }

      navigate("/login", {
        state: {
          message: "Compte créé. Vérifie ta boîte mail si la confirmation Supabase est activée."
        }
      });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Echec de l inscription.");
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-[32px] border border-white/70 bg-white p-7 shadow-[0_24px_60px_rgba(30,41,59,0.15)]">
      <p className="text-xs uppercase tracking-[0.25em] text-[#5b52cb]">IHEC Connect</p>
      <h1 className="mt-2 text-3xl font-semibold text-[#5b52cb]">Creer un compte</h1>
      <p className="mt-2 text-sm text-slate-600">
        Si la confirmation email est activee dans Supabase, vous serez redirige vers la page de connexion apres inscription.
      </p>
      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <Input
          label="Nom complet"
          value={form.full_name}
          onChange={(event) =>
            setForm((current) => ({ ...current, full_name: event.target.value }))
          }
        />
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
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Role</span>
          <select
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5"
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                role: event.target.value as "student" | "tutor"
              }))
            }
          >
            <option value="student">Etudiant</option>
            <option value="tutor">Tuteur</option>
          </select>
        </label>
        <Button disabled={register.isPending} type="submit">
          {register.isPending ? "Creation..." : "S inscrire"}
        </Button>
      </form>
    </div>
  );
}
