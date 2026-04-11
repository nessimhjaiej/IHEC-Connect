import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function LandingPage() {
  const subjects = ["Finance", "Law", "Accounting", "Management", "Economics", "English"];

  return (
    <section className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1.5fr,0.85fr]">
        <div className="overflow-hidden rounded-[36px] border border-[var(--line)] bg-[var(--panel)] p-7 shadow-[0_24px_80px_rgba(20,33,61,0.08)] md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-deep)]">
            <span className="rounded-full bg-[var(--brand-soft)] px-4 py-2">Academic discovery</span>
            <span className="rounded-full bg-white px-4 py-2 text-[var(--muted)]">Built for group sessions</span>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
            <div>
              <h1 className="max-w-3xl font-['Space_Grotesk'] text-5xl font-bold leading-[1.02] tracking-tight text-[var(--text)] md:text-6xl">
                Learn with the right people, not just the right content.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                IHEC Connect is a discovery-first academic platform where students join high-signal
                group sessions and tutors build visible learning communities around real subjects.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="bg-[var(--brand)] hover:bg-[var(--brand-deep)]">
                  <Link to="/register">Start learning</Link>
                </Button>
                <Link
                  to="/sessions"
                  className="inline-flex items-center rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-bold text-[var(--text)] shadow-[0_12px_25px_rgba(20,33,61,0.06)]"
                >
                  Explore sessions
                </Link>
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] bg-[var(--text)] p-5 text-white">
              <div className="rounded-[22px] bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Live pulse</p>
                <p className="mt-3 text-3xl font-bold">124 active study circles</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[22px] bg-white/10 p-4">
                  <p className="text-2xl font-bold">+230</p>
                  <p className="mt-1 text-sm text-white/70">Weekly participants</p>
                </div>
                <div className="rounded-[22px] bg-white/10 p-4">
                  <p className="text-2xl font-bold">38</p>
                  <p className="mt-1 text-sm text-white/70">Verified tutors</p>
                </div>
              </div>
              <div className="rounded-[22px] bg-gradient-to-r from-white/15 to-white/5 p-4">
                <p className="text-sm text-white/80">Top trend</p>
                <p className="mt-2 text-lg font-semibold">Weekend revision sprints for Finance 101</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[36px] border border-[var(--line)] bg-gradient-to-br from-[#fff7f2] to-[#f0f7f8] p-7 shadow-[0_24px_80px_rgba(20,33,61,0.06)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
            Subject catalog
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {subjects.map((subject) => (
              <span
                key={subject}
                className="rounded-full border border-white bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--text)]"
              >
                {subject}
              </span>
            ))}
          </div>
          <div className="mt-8 rounded-[28px] bg-white p-6 shadow-[0_18px_40px_rgba(20,33,61,0.06)]">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-deep)]">
              This week
            </p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[22px] bg-[var(--brand-soft)] p-4">
                <p className="text-sm text-[var(--muted)]">Most saved</p>
                <p className="mt-2 text-lg font-bold text-[var(--text)]">Accounting sprint groups</p>
              </div>
              <div className="rounded-[22px] bg-[#f5f7fa] p-4">
                <p className="text-sm text-[var(--muted)]">Fast growth</p>
                <p className="mt-2 text-lg font-bold text-[var(--text)]">Exam prep clusters</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.95fr,1.05fr,1fr]">
        <div className="rounded-[30px] border border-[var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(20,33,61,0.06)]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-deep)]">
            Why it works
          </p>
          <h2 className="mt-4 font-['Space_Grotesk'] text-3xl font-bold text-[var(--text)]">
            Discovery, trust, repetition.
          </h2>
          <p className="mt-4 leading-7 text-[var(--muted)]">
            Students need a place where they can quickly identify serious tutors, visible group
            momentum, and a clear academic outcome.
          </p>
        </div>
        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--text)] p-6 text-white shadow-[0_18px_50px_rgba(20,33,61,0.12)]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/55">For students</p>
          <ul className="mt-5 space-y-4 text-sm text-white/78">
            <li>Join open sessions without DM-style coordination overhead.</li>
            <li>Browse by subject, tutor credibility, and upcoming schedule.</li>
            <li>Return to a dashboard that feels alive and curated.</li>
          </ul>
        </div>
        <div className="rounded-[30px] border border-[var(--line)] bg-white p-6 shadow-[0_18px_50px_rgba(20,33,61,0.06)]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--muted)]">For tutors</p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[22px] bg-[#f6f6f3] p-4">
              <p className="font-semibold text-[var(--text)]">Publish scheduled cohorts</p>
            </div>
            <div className="rounded-[22px] bg-[#f6f6f3] p-4">
              <p className="font-semibold text-[var(--text)]">Show social proof through participation</p>
            </div>
            <div className="rounded-[22px] bg-[#f6f6f3] p-4">
              <p className="font-semibold text-[var(--text)]">Build repeatable academic communities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
