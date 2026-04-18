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
    <div className="mx-auto max-w-2xl rounded-[30px] border border-[#ebe9ff] bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
      <h1 className="text-2xl font-semibold text-[#5b52cb]">Create session</h1>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <Input label="Title" name="title" />
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Description</span>
          <textarea
            className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 outline-none transition focus:border-[#5f56d8] focus:ring-4 focus:ring-[#e7e4ff]"
            name="description"
          />
        </label>
        <Input label="Scheduled at" name="scheduled_at" type="datetime-local" />
        <Input label="Duration (minutes)" name="duration_minutes" type="number" defaultValue={60} />
        <Input label="Capacity" name="capacity" type="number" defaultValue={20} />
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Subject</span>
          <select className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5" name="subject_id">
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
