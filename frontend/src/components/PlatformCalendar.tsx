import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput } from "@fullcalendar/core";

interface PlatformCalendarProps {
  items: EventInput[];
  title?: string;
}

export function PlatformCalendar({ items, title = "Calendrier" }: PlatformCalendarProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">Vue mensuelle des séances et événements à venir.</p>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek"
        }}
        events={items}
        eventDisplay="block"
        dayMaxEvents={3}
        nowIndicator
        selectable={false}
      />
    </section>
  );
}
