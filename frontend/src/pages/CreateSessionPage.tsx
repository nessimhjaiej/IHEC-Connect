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
    const pricingType = String(formData.get("pricing_type")) as "free" | "paid";
    const sessionType = String(formData.get("session_type")) as "tutoring" | "entrepreneurship";
    const deliveryMode = String(formData.get("delivery_mode")) as "online" | "in_person";

    await createSession.mutateAsync({
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      session_type: sessionType,
      delivery_mode: deliveryMode,
      pricing_type: pricingType,
      price_dt: pricingType === "paid" ? Number(formData.get("price_dt")) : undefined,
      location_text: String(formData.get("location_text") || "") || undefined,
      meeting_url: String(formData.get("meeting_url") || "") || undefined,
      major: String(formData.get("major") || "") || undefined,
      academic_year: String(formData.get("academic_year") || "") || undefined,
      scheduled_at: String(formData.get("scheduled_at")),
      duration_minutes: Number(formData.get("duration_minutes")),
      capacity: Number(formData.get("capacity")),
      subject_id:
        sessionType === "tutoring" ? Number(formData.get("subject_id")) || undefined : undefined
    });

    navigate("/sessions");
  }

  return (
    <div className="mx-auto max-w-3xl rounded-[36px] border border-[var(--line)] bg-[var(--panel)] p-7 shadow-[0_24px_80px_rgba(20,33,61,0.08)] md:p-9">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--brand-deep)]">
        Host workspace
      </p>
      <h1 className="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-[var(--text)]">
        Create a tutoring session or entrepreneurship event
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        Publish a clear listing with the right format, timing, and audience so students can commit
        quickly.
      </p>
      <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
        <Input label="Title" name="title" />
        <div className="grid gap-5 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--muted)]">
            <span>Listing type</span>
            <select
              className="rounded-[24px] border border-[var(--line)] bg-white/90 px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-orange-100"
              name="session_type"
              defaultValue="tutoring"
            >
              <option value="tutoring">Tutoring session</option>
              <option value="entrepreneurship">Entrepreneurship event</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--muted)]">
            <span>Delivery mode</span>
            <select
              className="rounded-[24px] border border-[var(--line)] bg-white/90 px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-orange-100"
              name="delivery_mode"
              defaultValue="online"
            >
              <option value="online">Online</option>
              <option value="in_person">In person</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--muted)]">
            <span>Pricing</span>
            <select
              className="rounded-[24px] border border-[var(--line)] bg-white/90 px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-orange-100"
              name="pricing_type"
              defaultValue="free"
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--muted)]">
          <span>Description</span>
          <textarea
            className="min-h-32 rounded-[24px] border border-[var(--line)] bg-white/90 px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-orange-100"
            name="description"
          />
        </label>
        <div className="grid gap-5 md:grid-cols-3">
          <Input label="Scheduled at" name="scheduled_at" type="datetime-local" />
          <Input label="Duration (minutes)" name="duration_minutes" type="number" defaultValue={60} />
          <Input label="Capacity" name="capacity" type="number" defaultValue={20} />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Meeting URL" name="meeting_url" />
          <Input label="Location" name="location_text" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Input label="Price (DT)" name="price_dt" type="number" min={5} max={10} step="0.5" />
          <Input label="Major" name="major" />
          <Input label="Academic year" name="academic_year" />
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--muted)]">
          <span>Subject (required for tutoring)</span>
          <select
            className="rounded-[24px] border border-[var(--line)] bg-white/90 px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-orange-100"
            name="subject_id"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </label>
        <Button className="bg-[var(--brand)] hover:bg-[var(--brand-deep)]" disabled={createSession.isPending} type="submit">
          {createSession.isPending ? "Creating..." : "Create session"}
        </Button>
      </form>
    </div>
  );
}
