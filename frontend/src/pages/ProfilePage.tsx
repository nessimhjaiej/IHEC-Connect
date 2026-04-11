import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/useAuth";
import { useUpdateProfile } from "../hooks/useProfile";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function ProfilePage() {
  const { data: user } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [major, setMajor] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setBio(user.bio ?? "");
      setMajor(user.major ?? "");
      setAcademicYear(user.academic_year ?? "");
    }
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateProfile.mutateAsync({
      full_name: fullName,
      bio,
      major,
      academic_year: academicYear
    });
  }

  return (
    <div className="mx-auto max-w-3xl rounded-[36px] border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(20,33,61,0.08)]">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--brand-deep)]">Profile</p>
      <h1 className="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-[var(--text)]">Shape how students see you</h1>
      <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
        <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
        <Input label="Major" value={major} onChange={(event) => setMajor(event.target.value)} />
        <Input
          label="Academic year"
          value={academicYear}
          onChange={(event) => setAcademicYear(event.target.value)}
        />
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--muted)]">
          <span>Bio</span>
          <textarea
            className="min-h-36 rounded-[24px] border border-[var(--line)] bg-white/90 px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-orange-100"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
        </label>
        <Button className="bg-[var(--brand)] hover:bg-[var(--brand-deep)]" disabled={updateProfile.isPending} type="submit">
          {updateProfile.isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
