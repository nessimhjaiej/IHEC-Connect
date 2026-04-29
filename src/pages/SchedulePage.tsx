import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CalendarEvent, CalendarEventType } from '../types';
import { ChevronLeft, ChevronRight, Plus, Calendar, X, Mail } from 'lucide-react';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

const EVENT_COLORS: Record<CalendarEventType, { bg: string; text: string; border: string; label: string }> = {
  admin:    { bg: '#fff0ee', text: '#c0392b', border: '#e85d4a', label: 'Événement Admin' },
  tutoring: { bg: '#eef8f0', text: '#1a6a3a', border: '#4a9e6e', label: 'Cours / Tutorat' },
  personal: { bg: '#f0eeff', text: '#5a4fa0', border: '#7c6fcd', label: 'Personnel' },
};

const ADMIN_EVENTS_KEY = 'ihec_admin_events';
const USER_EVENTS_KEY = (uid: string) => `ihec_events_${uid}`;

function getAdminEvents(): CalendarEvent[] {
  const str = localStorage.getItem(ADMIN_EVENTS_KEY);
  return str ? JSON.parse(str) : [];
}

function getUserEvents(uid: string): CalendarEvent[] {
  const str = localStorage.getItem(USER_EVENTS_KEY(uid));
  return str ? JSON.parse(str) : [];
}

function saveUserEvents(uid: string, events: CalendarEvent[]) {
  localStorage.setItem(USER_EVENTS_KEY(uid), JSON.stringify(events));
}

export function SchedulePage() {
  const { user } = useAuth();
  const isTutor = user?.tutorStatus === 'approved';
  const today = new Date();

  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showPropose, setShowPropose] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'personal' as CalendarEventType, time: '', description: '' });
  const [proposeForm, setProposeForm] = useState({ title: '', date: '', description: '' });
  const [proposeSent, setProposeSent] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  useEffect(() => {
    if (!user) return;
    const adminEvts = getAdminEvents();
    const userEvts = getUserEvents(user.id);
    setEvents([...adminEvts, ...userEvts]);
  }, [user]);

  const eventsForDay = (day: number | null): CalendarEvent[] => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : '';

  const handleAddEvent = () => {
    if (!user || !newEvent.title || !selectedDay) return;
    const evt: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDateStr,
      time: newEvent.time,
      type: newEvent.type,
      description: newEvent.description,
      createdBy: user.id,
    };
    const userEvts = getUserEvents(user.id);
    userEvts.push(evt);
    saveUserEvents(user.id, userEvts);
    setEvents(prev => [...prev, evt]);
    setNewEvent({ title: '', type: 'personal', time: '', description: '' });
    setShowAdd(false);
  };

  const handlePropose = async () => {
    if (!user || !proposeForm.title || !proposeForm.date) return;
    // Simulate sending email to admin
    const subject = encodeURIComponent(`[IHEC Connect] Proposition d'événement - ${proposeForm.title}`);
    const body = encodeURIComponent(
      `Bonjour Administrateur,\n\n` +
      `L'étudiant ${user.name} (${user.email}) souhaite proposer un événement :\n\n` +
      `Titre : ${proposeForm.title}\n` +
      `Date : ${proposeForm.date}\n` +
      `Description : ${proposeForm.description || 'Aucune description'}\n\n` +
      `Cordialement,\nIHEC Connect`
    );
    window.open(`mailto:admin@ihec.ucar.tn?subject=${subject}&body=${body}`);
    setProposeSent(true);
    setTimeout(() => { setProposeSent(false); setShowPropose(false); setProposeForm({ title: '', date: '', description: '' }); }, 3000);
  };

  const isToday = (d: number | null) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const selectedEvts = selectedDay ? eventsForDay(selectedDay) : [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
      {/* Calendar */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #e4e3f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '20px', color: '#2d2b55' }}>Calendrier</h2>
            <p style={{ fontSize: '13px', color: '#6e6d8a' }}>{MONTHS[month]} {year}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setShowPropose(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid #e4e3f0', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#6e6d8a' }}>
              <Mail size={13} /> Proposer un événement
            </button>
            {[{ icon: <ChevronLeft size={15} />, fn: () => setViewDate(new Date(year, month - 1, 1)) },
              { icon: <ChevronRight size={15} />, fn: () => setViewDate(new Date(year, month + 1, 1)) }].map((b, i) => (
              <button key={i} onClick={b.fn} style={{ width: '32px', height: '32px', borderRadius: '9px', border: '1px solid #e4e3f0', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6e6d8a' }}>{b.icon}</button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {Object.entries(EVENT_COLORS).map(([type, style]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: style.border }} />
              <span style={{ fontSize: '11px', color: '#6e6d8a' }}>{style.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
          {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#a8a7c0', padding: '4px 0', textTransform: 'uppercase' }}>{d}</div>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {cells.map((day, i) => {
            const dayEvts = eventsForDay(day);
            const isSelected = day === selectedDay;
            return (
              <div key={i} onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                style={{ minHeight: '64px', padding: '6px', borderRadius: '10px', cursor: day ? 'pointer' : 'default', background: isSelected ? '#f0eeff' : isToday(day) ? '#7c6fcd' : 'transparent', border: isSelected ? '2px solid #7c6fcd' : '2px solid transparent', transition: 'all 0.15s' }}>
                {day && (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: isToday(day) ? 'white' : isSelected ? '#7c6fcd' : '#2d2b55', marginBottom: '4px', textAlign: 'right' }}>{day}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {dayEvts.slice(0, 3).map(evt => (
                        <div key={evt.id} style={{ fontSize: '9px', padding: '2px 4px', borderRadius: '4px', background: EVENT_COLORS[evt.type]?.bg || '#f0eff4', color: EVENT_COLORS[evt.type]?.text || '#6e6d8a', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderLeft: `2px solid ${EVENT_COLORS[evt.type]?.border || '#ccc'}` }}>
                          {evt.title}
                        </div>
                      ))}
                      {dayEvts.length > 3 && <div style={{ fontSize: '9px', color: '#a8a7c0' }}>+{dayEvts.length - 3}</div>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Side panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Selected day events */}
        {selectedDay && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e4e3f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '14px', color: '#2d2b55' }}>
                {selectedDay} {MONTHS[month]}
              </span>
              <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: 'none', background: '#7c6fcd', color: 'white', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                <Plus size={12} /> Ajouter
              </button>
            </div>

            {selectedEvts.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#a8a7c0', textAlign: 'center', padding: '16px 0' }}>Aucun événement ce jour</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedEvts.map(evt => (
                  <div key={evt.id} style={{ padding: '12px', borderRadius: '12px', background: EVENT_COLORS[evt.type]?.bg || '#f0eff4', borderLeft: `3px solid ${EVENT_COLORS[evt.type]?.border || '#ccc'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: EVENT_COLORS[evt.type]?.text || '#2d2b55' }}>{evt.title}</div>
                        {evt.time && <div style={{ fontSize: '11px', color: '#a8a7c0', marginTop: '2px' }}>🕐 {evt.time}</div>}
                        {evt.description && <div style={{ fontSize: '11px', color: '#6e6d8a', marginTop: '4px' }}>{evt.description}</div>}
                      </div>
                      <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '5px', background: 'rgba(255,255,255,0.6)', color: EVENT_COLORS[evt.type]?.text, fontWeight: 600 }}>
                        {EVENT_COLORS[evt.type]?.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming admin events */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e4e3f0' }}>
          <h3 style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '14px', color: '#2d2b55', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} color="#e85d4a" /> Événements officiels
          </h3>
          {getAdminEvents().slice(0, 4).map(evt => (
            <div key={evt.id} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: '1px solid #f0eff4' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fff0ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={14} color="#e85d4a" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#2d2b55' }}>{evt.title}</div>
                <div style={{ fontSize: '11px', color: '#a8a7c0' }}>{evt.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add event modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '18px', color: '#2d2b55' }}>Ajouter un événement</h3>
              <button onClick={() => setShowAdd(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={18} color="#a8a7c0" /></button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6e6d8a', display: 'block', marginBottom: '6px' }}>Titre *</label>
              <input value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Titre de l'événement" style={{ width: '100%', padding: '10px 13px', borderRadius: '10px', border: '1px solid #e4e3f0', fontSize: '14px', fontFamily: 'DM Sans', outline: 'none', background: 'white', color: '#2d2b55', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6e6d8a', display: 'block', marginBottom: '6px' }}>Type</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(isTutor ? ['personal', 'tutoring'] as CalendarEventType[] : ['personal'] as CalendarEventType[]).map(t => (
                  <button key={t} onClick={() => setNewEvent({ ...newEvent, type: t })} style={{ flex: 1, padding: '9px', borderRadius: '10px', border: `2px solid ${newEvent.type === t ? EVENT_COLORS[t].border : '#e4e3f0'}`, background: newEvent.type === t ? EVENT_COLORS[t].bg : 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: newEvent.type === t ? EVENT_COLORS[t].text : '#6e6d8a' }}>
                    {EVENT_COLORS[t].label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6e6d8a', display: 'block', marginBottom: '6px' }}>Heure (optionnel)</label>
              <input type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} style={{ width: '100%', padding: '10px 13px', borderRadius: '10px', border: '1px solid #e4e3f0', fontSize: '14px', fontFamily: 'DM Sans', outline: 'none', background: 'white', color: '#2d2b55', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6e6d8a', display: 'block', marginBottom: '6px' }}>Description (optionnel)</label>
              <textarea value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} rows={2} style={{ width: '100%', padding: '10px 13px', borderRadius: '10px', border: '1px solid #e4e3f0', fontSize: '14px', fontFamily: 'DM Sans', outline: 'none', background: 'white', color: '#2d2b55', boxSizing: 'border-box', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '11px', borderRadius: '11px', border: '1px solid #e4e3f0', background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#6e6d8a' }}>Annuler</button>
              <button onClick={handleAddEvent} disabled={!newEvent.title} style={{ flex: 2, padding: '11px', borderRadius: '11px', border: 'none', background: newEvent.title ? '#7c6fcd' : '#e4e3f0', color: newEvent.title ? 'white' : '#a8a7c0', fontSize: '13px', fontWeight: 700, cursor: newEvent.title ? 'pointer' : 'not-allowed', fontFamily: 'Nunito' }}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Propose event to admin modal */}
      {showPropose && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '18px', color: '#2d2b55' }}>Proposer un événement</h3>
              <button onClick={() => { setShowPropose(false); setProposeSent(false); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={18} color="#a8a7c0" /></button>
            </div>

            {proposeSent ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#efffef', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid #4a9e6e' }}>
                  <Mail size={24} color="#4a9e6e" />
                </div>
                <h4 style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '16px', color: '#2d2b55', marginBottom: '8px' }}>Email envoyé !</h4>
                <p style={{ fontSize: '13px', color: '#6e6d8a' }}>Votre proposition a été transmise à l'administration.</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '13px', color: '#6e6d8a', marginBottom: '20px', lineHeight: 1.6 }}>
                  Votre proposition sera envoyée par email à l'administration. Elle sera examinée et publiée si approuvée.
                </p>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6e6d8a', display: 'block', marginBottom: '6px' }}>Titre de l'événement *</label>
                  <input value={proposeForm.title} onChange={e => setProposeForm({ ...proposeForm, title: e.target.value })} placeholder="Ex: Journée d'intégration…" style={{ width: '100%', padding: '10px 13px', borderRadius: '10px', border: '1px solid #e4e3f0', fontSize: '14px', fontFamily: 'DM Sans', outline: 'none', background: 'white', color: '#2d2b55', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6e6d8a', display: 'block', marginBottom: '6px' }}>Date souhaitée *</label>
                  <input type="date" value={proposeForm.date} onChange={e => setProposeForm({ ...proposeForm, date: e.target.value })} style={{ width: '100%', padding: '10px 13px', borderRadius: '10px', border: '1px solid #e4e3f0', fontSize: '14px', fontFamily: 'DM Sans', outline: 'none', background: 'white', color: '#2d2b55', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6e6d8a', display: 'block', marginBottom: '6px' }}>Description</label>
                  <textarea value={proposeForm.description} onChange={e => setProposeForm({ ...proposeForm, description: e.target.value })} rows={3} placeholder="Décrivez votre proposition…" style={{ width: '100%', padding: '10px 13px', borderRadius: '10px', border: '1px solid #e4e3f0', fontSize: '14px', fontFamily: 'DM Sans', outline: 'none', background: 'white', color: '#2d2b55', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowPropose(false)} style={{ flex: 1, padding: '11px', borderRadius: '11px', border: '1px solid #e4e3f0', background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#6e6d8a' }}>Annuler</button>
                  <button onClick={handlePropose} disabled={!proposeForm.title || !proposeForm.date} style={{ flex: 2, padding: '11px', borderRadius: '11px', border: 'none', background: proposeForm.title && proposeForm.date ? '#7c6fcd' : '#e4e3f0', color: proposeForm.title && proposeForm.date ? 'white' : '#a8a7c0', fontSize: '13px', fontWeight: 700, cursor: proposeForm.title && proposeForm.date ? 'pointer' : 'not-allowed', fontFamily: 'Nunito', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Mail size={14} /> Envoyer par email
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
