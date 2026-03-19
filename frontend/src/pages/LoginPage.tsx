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
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
        <Button className="w-full" disabled={login.isPending} type="submit">
          {login.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
