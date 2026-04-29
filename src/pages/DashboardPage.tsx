import { useState } from 'react';
import { BookOpen, Users, Clock, TrendingUp, ChevronLeft, ChevronRight, Plus, GraduationCap } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../hooks/useAuth';
import { CourseCard } from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const ONLINE_USERS = [
  { name: 'Maren Maureen', id: '1094882001', color: '#b8d4f0', dark: '#1a4a70' },
  { name: 'Jenniffer Jane', id: '1094872000', color: '#c8e8d4', dark: '#1a5a3a' },
  { name: 'Ryan Herwinds', id: '1094343003', color: '#f0d8c8', dark: '#703010' },
  { name: 'Kierra Culhane', id: '1094882002', color: '#e8d0f0', dark: '#4a1a70' },
];

function StatCard({ icon, label, value, delta, color }: { icon: React.ReactNode; label: string; value: string; delta?: string; color: string }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px 22px', border: '1px solid #e4e3f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '11px', color: '#a8a7c0', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '22px', color: '#2d2b55', lineHeight: 1 }}>{value}</div>
        {delta && <div style={{ fontSize: '11px', color: '#4a9e6e', marginTop: '2px' }}>{delta}</div>}
      </div>
    </div>
  );
}

function MiniCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const isToday = (d: number | null) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const hasEvent = (d: number | null) => d && [8, 10, 12, 15, 18, 22].includes(d);

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e4e3f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '14px' }}>{MONTHS[month]} {year}</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[{ icon: <ChevronLeft size={13} />, fn: () => setViewDate(new Date(year, month - 1, 1)) },
            { icon: <ChevronRight size={13} />, fn: () => setViewDate(new Date(year, month + 1, 1)) }].map((b, i) => (
            <button key={i} onClick={b.fn} style={{ width: '26px', height: '26px', borderRadius: '7px', border: '1px solid #e4e3f0', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6e6d8a' }}>{b.icon}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '4px' }}>
        {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 600, color: '#a8a7c0', padding: '2px 0' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
        {cells.map((day, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '5px 2px', borderRadius: '7px', fontSize: '12px', fontWeight: day ? 500 : 400, color: !day ? 'transparent' : isToday(day) ? 'white' : '#2d2b55', background: isToday(day) ? '#7c6fcd' : 'transparent', cursor: day ? 'pointer' : 'default', position: 'relative' }}>
            {day || ''}
            {hasEvent(day) && !isToday(day) && <span style={{ position: 'absolute', bottom: '1px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: '#7c6fcd' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { enrolledCourses, tutorGivenCourses, enroll, unenroll } = useCourses();
  const navigate = useNavigate();
  const isTutor = user?.tutorStatus === 'approved';

  const studentStats = [
    { icon: <BookOpen size={19} color="#1a4a70" strokeWidth={1.8} />, label: 'Enrolled', value: String(enrolledCourses.length), delta: '+1 this week', color: '#b8d4f0' },
    { icon: <Users size={19} color="#1a5a3a" strokeWidth={1.8} />, label: 'Classmates', value: '148', color: '#c8e8d4' },
    { icon: <Clock size={19} color="#703010" strokeWidth={1.8} />, label: 'Hours', value: '36h', color: '#f0d8c8' },
    { icon: <TrendingUp size={19} color="#4a1a70" strokeWidth={1.8} />, label: 'Progress', value: '87%', color: '#e8d0f0' },
  ];

  const tutorStats = [
    { icon: <GraduationCap size={19} color="#4a1a70" strokeWidth={1.8} />, label: 'Teaching', value: String(tutorGivenCourses.length), color: '#e8d0f0' },
    { icon: <BookOpen size={19} color="#1a4a70" strokeWidth={1.8} />, label: 'Taking', value: String(enrolledCourses.length), color: '#b8d4f0' },
    { icon: <Users size={19} color="#1a5a3a" strokeWidth={1.8} />, label: 'Students', value: String(tutorGivenCourses.reduce((a, c) => a + c.enrolledCount, 0)), color: '#c8e8d4' },
    { icon: <TrendingUp size={19} color="#703010" strokeWidth={1.8} />, label: 'Reviews', value: '4.8★', color: '#f0d8c8' },
  ];

  const stats = isTutor ? tutorStats : studentStats;
  const previewCourses = (isTutor ? [...tutorGivenCourses, ...enrolledCourses] : enrolledCourses).slice(0, 3);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>
      {/* Left */}
      <div>
        {/* Role badge */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '6px 14px', borderRadius: '20px',
            background: isTutor ? 'rgba(124,111,205,0.12)' : 'rgba(107,155,210,0.12)',
            border: `1px solid ${isTutor ? 'rgba(124,111,205,0.25)' : 'rgba(107,155,210,0.25)'}`,
          }}>
            {isTutor ? <GraduationCap size={14} color="#7c6fcd" /> : <BookOpen size={14} color="#6b9bd2" />}
            <span style={{ fontSize: '12px', fontWeight: 600, color: isTutor ? '#5a4fa0' : '#2a5a8a' }}>
              {isTutor ? 'Tutor account' : 'Student account'}
            </span>
          </div>
          <span style={{ fontSize: '13px', color: '#a8a7c0' }}>Welcome back, {user?.name?.split(' ')[0]}!</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '28px' }}>
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '17px' }}>
            {isTutor ? 'My Courses' : 'My Courses'}
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {isTutor && (
              <button onClick={() => navigate('/courses/create')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: '#7c6fcd', border: 'none', color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' }}>
                <Plus size={14} /> New Course
              </button>
            )}
            <button onClick={() => navigate('/courses')} style={{ padding: '8px 14px', borderRadius: '10px', background: 'white', border: '1px solid #e4e3f0', color: '#6e6d8a', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' }}>
              View all
            </button>
          </div>
        </div>

        {/* Course cards preview */}
        {previewCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', border: '1.5px dashed #e4e3f0' }}>
            <BookOpen size={32} color="#a8a7c0" strokeWidth={1.2} style={{ margin: '0 auto 10px' }} />
            <p style={{ color: '#a8a7c0', fontSize: '14px', marginBottom: '14px' }}>
              {isTutor ? 'No courses yet. Create your first one!' : "You haven't enrolled in any courses."}
            </p>
            <button onClick={() => navigate('/courses')} style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: '#7c6fcd', color: 'white', cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '13px' }}>
              {isTutor ? 'Create course' : 'Browse courses'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
            {previewCourses.map(c => (
              <CourseCard
                key={c.id}
                course={c}
                mode={isTutor && c.tutorId === 'me' ? 'tutor-giving' : 'student'}
                onEnroll={enroll}
                onUnenroll={unenroll}
              />
            ))}
          </div>
        )}

        <button onClick={() => navigate('/courses')} style={{ marginTop: '14px', width: '100%', padding: '11px', border: '1.5px dashed #e4e3f0', borderRadius: '14px', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: '#a8a7c0', fontFamily: 'DM Sans', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c6fcd'; e.currentTarget.style.color = '#7c6fcd'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e4e3f0'; e.currentTarget.style.color = '#a8a7c0'; }}
        >
          {isTutor ? 'Manage all courses →' : 'Browse all courses →'}
        </button>
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <MiniCalendar />

        {/* Online Users */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e4e3f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '14px' }}>Online Users</span>
            <button onClick={() => navigate('/participants')} style={{ border: 'none', background: 'transparent', fontSize: '12px', color: '#7c6fcd', cursor: 'pointer', fontWeight: 600 }}>See all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {ONLINE_USERS.map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: u.dark, fontFamily: 'Nunito' }}>
                    {u.name.split(' ').map((w: string) => w[0]).join('')}
                  </div>
                  <span style={{ position: 'absolute', bottom: '1px', right: '1px', width: '7px', height: '7px', borderRadius: '50%', background: '#4a9e6e', border: '1.5px solid white' }} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#2d2b55' }}>{u.name}</div>
                  <div style={{ fontSize: '11px', color: '#a8a7c0' }}>{u.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e4e3f0' }}>
          <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '14px', display: 'block', marginBottom: '13px' }}>Quick Access</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(isTutor ? [
              { label: 'Create a Course', to: '/courses/create', color: '#e8d0f0', dark: '#4a1a70' },
              { label: 'Browse Courses', to: '/courses', color: '#b8d4f0', dark: '#1a4a70' },
              { label: 'My Schedule', to: '/schedule', color: '#f0d8c8', dark: '#703010' },
            ] : [
              { label: 'Browse Courses', to: '/courses', color: '#b8d4f0', dark: '#1a4a70' },
              { label: 'My Schedule', to: '/schedule', color: '#c8e8d4', dark: '#1a5a3a' },
              { label: 'Directory', to: '/directory', color: '#f0d8c8', dark: '#703010' },
            ]).map(item => (
              <button key={item.label} onClick={() => navigate(item.to)} style={{ padding: '10px 13px', borderRadius: '10px', border: 'none', background: item.color, cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: item.dark, transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >{item.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
