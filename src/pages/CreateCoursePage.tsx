import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../hooks/useAuth';

export function CreateCoursePage() {
  const navigate = useNavigate();
  const { createCourse } = useCourses();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', subject: 'Computer Science', duration: 60, maxEnrolled: 20, date: '', time: '10:00' });
  const [loading, setLoading] = useState(false);

  // Only tutors can create courses
  if (user?.tutorStatus !== 'approved') {
    navigate('/courses');
    return null;
  }

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.date) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    createCourse({ ...form, tutorName: user?.name || 'You' });
    setLoading(false);
    navigate('/courses');
  };

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #e4e3f0', fontSize: '14px', fontFamily: 'DM Sans', outline: 'none', background: 'white', color: '#2d2b55', boxSizing: 'border-box' as const };

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: '18px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6e6d8a', marginBottom: '7px' }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: '620px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#6e6d8a', marginBottom: '22px', padding: 0 }}>
        <ArrowLeft size={15} /> Back
      </button>

      <div style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #e4e3f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '26px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e8d0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={20} color="#6a3a90" />
          </div>
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '19px' }}>Create New Course</h2>
        </div>

        <F label="Course Title *">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Introduction to React" style={inputStyle} />
        </F>
        <F label="Description *">
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What will students learn?" rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
        </F>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <F label="Subject">
            <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle}>
              {['Computer Science','Engineering','Mathematics','Management','Economics','Other'].map(s => <option key={s}>{s}</option>)}
            </select>
          </F>
          <F label="Duration (minutes)">
            <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })} min={15} max={300} style={inputStyle} />
          </F>
          <F label="Max Students">
            <input type="number" value={form.maxEnrolled} onChange={e => setForm({ ...form, maxEnrolled: +e.target.value })} min={1} max={100} style={inputStyle} />
          </F>
          <F label="Time">
            <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={inputStyle} />
          </F>
        </div>

        <F label="Date *">
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
        </F>

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button onClick={() => navigate(-1)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e4e3f0', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontFamily: 'DM Sans', fontWeight: 600, color: '#6e6d8a' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !form.title || !form.description || !form.date} style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: '#7c6fcd', color: 'white', cursor: !form.title || !form.description || !form.date ? 'not-allowed' : 'pointer', fontSize: '14px', fontFamily: 'Nunito', fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating…' : 'Create Course'}
          </button>
        </div>
      </div>
    </div>
  );
}
