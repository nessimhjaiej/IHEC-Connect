import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/useAuth";
import { useUpdateProfile } from "../hooks/useProfile";
import { useAcademicYears, useMajors } from "../hooks/useReferences";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function ProfilePage() {
  const { data: user } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const { data: majors = [] } = useMajors();
  const { data: academicYears = [] } = useAcademicYears();
  const [fullName, setFullName] = useState("");
  const [majorId, setMajorId] = useState<number | "">("");
  const [academicYearId, setAcademicYearId] = useState<number | "">("");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setMajorId(user.major_id ?? "");
      setAcademicYearId(user.academic_year_id ?? "");
    }
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateProfile.mutateAsync({
      full_name: fullName,
      major_id: majorId === "" ? undefined : majorId,
      academic_year_id: academicYearId === "" ? undefined : academicYearId,
    });
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Filiere (Major)</span>
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2"
            value={majorId}
            onChange={(event) => setMajorId(event.target.value ? Number(event.target.value) : "")}
          >
            <option value="">Selectionner une filiere</option>
            {majors.map((major) => (
              <option key={major.id} value={major.id}>
                {major.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Annee academique</span>
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2"
            value={academicYearId}
            onChange={(event) => setAcademicYearId(event.target.value ? Number(event.target.value) : "")}
          >
            <option value="">Selectionner une annee</option>
            {academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.label}
              </option>
            ))}
          </select>
        </label>
        <Button disabled={updateProfile.isPending} type="submit">
          {updateProfile.isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
