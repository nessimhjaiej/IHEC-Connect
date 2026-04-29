import { useState } from 'react';
import { Plus, Search, BookOpen, GraduationCap } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../hooks/useAuth';
import { CourseCard } from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';

const SUBJECTS = ['All', 'Computer Science', 'Engineering', 'Mathematics', 'Management'];

export function CoursesPage() {
  const { user } = useAuth();
  const { courses, enrolledCourses, availableCourses, tutorGivenCourses, enroll, unenroll } = useCourses();
  const navigate = useNavigate();
  const isTutor = user?.tutorStatus === 'approved';
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [tab, setTab] = useState<'enrolled' | 'browse' | 'teaching'>('enrolled');

  const filter = (list: typeof courses) =>
    list.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) &&
      (subject === 'All' || c.subject === subject)
    );

  const tabs = isTutor
    ? [
        { key: 'enrolled', label: 'Courses I Take', icon: <BookOpen size={15} /> },
        { key: 'teaching', label: 'Courses I Teach', icon: <GraduationCap size={15} /> },
        { key: 'browse', label: 'Browse All', icon: <Search size={15} /> },
      ]
    : [
        { key: 'enrolled', label: 'My Courses', icon: <BookOpen size={15} /> },
        { key: 'browse', label: 'Browse All', icon: <Search size={15} /> },
      ];

  let displayList =
    tab === 'enrolled' ? filter(enrolledCourses)
    : tab === 'teaching' ? filter(tutorGivenCourses)
    : filter(availableCourses);

  const cardMode = tab === 'teaching' ? 'tutor-giving' : isTutor ? 'student' : 'student';

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '22px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{
          flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '8px',
          background: 'white', borderRadius: '12px', padding: '10px 16px', border: '1px solid #e4e3f0',
        }}>
          <Search size={16} color="#a8a7c0" strokeWidth={1.8} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title…"
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', flex: 1, fontFamily: 'DM Sans' }}
          />
        </div>

        <select value={subject} onChange={e => setSubject(e.target.value)} style={{
          padding: '10px 14px', borderRadius: '12px', border: '1px solid #e4e3f0',
          background: 'white', fontSize: '13px', color: '#6e6d8a', cursor: 'pointer', fontFamily: 'DM Sans', outline: 'none',
        }}>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>

        {isTutor && (
          <button
            onClick={() => navigate('/courses/create')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '12px', background: '#7c6fcd',
              border: 'none', color: 'white', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'DM Sans', flexShrink: 0,
            }}
          >
            <Plus size={15} /> Create Course
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '22px', background: 'white', padding: '5px', borderRadius: '14px', border: '1px solid #e4e3f0', width: 'fit-content' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 18px', borderRadius: '10px', border: 'none',
              background: tab === t.key ? '#7c6fcd' : 'transparent',
              color: tab === t.key ? 'white' : '#6e6d8a',
              fontSize: '13px', fontWeight: tab === t.key ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p style={{ fontSize: '13px', color: '#a8a7c0', marginBottom: '16px' }}>
        {displayList.length} course{displayList.length !== 1 ? 's' : ''}
      </p>

      {/* Cards */}
      {displayList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <BookOpen size={40} color="#a8a7c0" strokeWidth={1.2} style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#a8a7c0', fontSize: '15px' }}>
            {tab === 'enrolled' ? "You haven't enrolled in any courses yet." : tab === 'teaching' ? "You haven't created any courses yet." : 'No courses match your search.'}
          </p>
          {tab === 'enrolled' && <button onClick={() => setTab('browse')} style={{ marginTop: '14px', padding: '10px 22px', borderRadius: '10px', border: 'none', background: '#7c6fcd', color: 'white', cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600 }}>Browse courses</button>}
          {tab === 'teaching' && isTutor && <button onClick={() => navigate('/courses/create')} style={{ marginTop: '14px', padding: '10px 22px', borderRadius: '10px', border: 'none', background: '#7c6fcd', color: 'white', cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600 }}>Create first course</button>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {displayList.map(c => (
            <CourseCard key={c.id} course={c} mode={cardMode as 'student'|'tutor-giving'} onEnroll={enroll} onUnenroll={unenroll} />
          ))}
        </div>
      )}
    </div>
  );
}
