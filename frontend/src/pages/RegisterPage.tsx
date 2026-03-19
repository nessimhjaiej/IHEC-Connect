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
    role: "student" as "student" | "tutor"
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user = await register.mutateAsync(form);
    navigate(user ? "/dashboard" : "/login");
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Create an account</h1>
      <p className="mt-2 text-sm text-slate-600">
        If email confirmation is enabled in Supabase, you will be redirected to login after signup.
      </p>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
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
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Role</span>
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2"
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                role: event.target.value as "student" | "tutor"
              }))
            }
          >
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>
        </label>
        <Button disabled={register.isPending} type="submit">
          {register.isPending ? "Creating account..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
