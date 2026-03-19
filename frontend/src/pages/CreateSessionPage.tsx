import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSession, useSubjects } from "../hooks/useSessions";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function CreateSessionPage() {
  const navigate = useNavigate();
  const createSession = useCreateSession();
  const { data: subjects = [] } = useSubjects();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await createSession.mutateAsync({
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      scheduled_at: String(formData.get("scheduled_at")),
      duration_minutes: Number(formData.get("duration_minutes")),
      capacity: Number(formData.get("capacity")),
      subject_id: Number(formData.get("subject_id"))
    });

    navigate("/sessions");
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Create session</h1>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <Input label="Title" name="title" />
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Description</span>
          <textarea
            className="min-h-28 rounded-lg border border-slate-200 bg-white px-3 py-2"
            name="description"
          />
        </label>
        <Input label="Scheduled at" name="scheduled_at" type="datetime-local" />
        <Input label="Duration (minutes)" name="duration_minutes" type="number" defaultValue={60} />
        <Input label="Capacity" name="capacity" type="number" defaultValue={20} />
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Subject</span>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2" name="subject_id">
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </label>
        <Button disabled={createSession.isPending} type="submit">
          {createSession.isPending ? "Creating..." : "Create session"}
        </Button>
      </form>
    </div>
  );
}
