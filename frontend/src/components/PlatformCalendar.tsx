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
    <section className="rounded-[28px] border border-[#ebe9ff] bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#5b52cb]">{title}</h2>
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
