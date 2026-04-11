import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student" as "student" | "tutor" | "alumni",
    major: "",
    academic_year: ""
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user = await register.mutateAsync(form);
    navigate(user ? "/dashboard" : "/login");
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr,1.1fr]">
      <div className="rounded-[36px] border border-[var(--line)] bg-gradient-to-br from-[#fff7f2] to-[#eef6f7] p-8 shadow-[0_24px_80px_rgba(20,33,61,0.08)]">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--brand-deep)]">Join the network</p>
        <h1 className="mt-4 font-['Space_Grotesk'] text-4xl font-bold text-[var(--text)]">
          Build your academic identity around real sessions.
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Create your account as a student, tutor, or alumni entrepreneur, then move into the
          platform.
        </p>
      </div>
      <div className="rounded-[36px] border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(20,33,61,0.08)]">
        <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-[var(--text)]">Create an account</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          If email confirmation is enabled in Supabase, you will be redirected to login after signup.
        </p>
        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <Input
            label="Full name"
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
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
          />
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--muted)]">
            <span>Role</span>
            <select
              className="rounded-[24px] border border-[var(--line)] bg-white/90 px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-orange-100"
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as "student" | "tutor" | "alumni"
                }))
              }
            >
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
              <option value="alumni">Alumni entrepreneur</option>
            </select>
          </label>
          <Input
            label="Major"
            value={form.major}
            onChange={(event) => setForm((current) => ({ ...current, major: event.target.value }))}
          />
          <Input
            label="Academic year"
            value={form.academic_year}
            onChange={(event) =>
              setForm((current) => ({ ...current, academic_year: event.target.value }))
            }
          />
          <Button className="bg-[var(--brand)] hover:bg-[var(--brand-deep)]" disabled={register.isPending} type="submit">
            {register.isPending ? "Creating account..." : "Register"}
          </Button>
        </form>
      </div>
    </section>
  );
}
