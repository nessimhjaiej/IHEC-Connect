import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Clock, Calendar, BookOpen, UserCheck, Star } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../hooks/useAuth';

export function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, tutorGivenCourses, enroll, unenroll } = useCourses();
  const all = [...courses, ...tutorGivenCourses];
  const course = all.find(c => c.id === id);

  if (!course) return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <p style={{ color: '#a8a7c0' }}>Course not found.</p>
      <button onClick={() => navigate('/courses')} style={{ marginTop: '14px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#7c6fcd', color: 'white', cursor: 'pointer' }}>Back to Courses</button>
    </div>
  );

  const isOwner = course.tutorId === 'me' || course.tutorId === user?.id;
  const isFull = course.enrolledCount >= course.maxEnrolled;
  const fillPct = Math.round((course.enrolledCount / course.maxEnrolled) * 100);

  return (
    <div style={{ maxWidth: '700px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#6e6d8a', marginBottom: '22px', padding: 0 }}>
        <ArrowLeft size={15} /> Back
      </button>

      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e4e3f0', overflow: 'hidden' }}>
        <div style={{ background: course.color, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '22px', color: '#2d2b55' }}>{course.title}</h2>
            <span style={{ fontSize: '12px', color: '#2d2b55', opacity: 0.7 }}>{course.subject}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {course.status === 'ongoing' && <span style={{ padding: '4px 12px', background: 'rgba(74,158,110,0.2)', borderRadius: '20px', fontSize: '11px', fontWeight: 700, color: '#2e7d5a' }}>LIVE</span>}
            {isOwner && <span style={{ padding: '4px 12px', background: 'rgba(124,111,205,0.2)', borderRadius: '20px', fontSize: '11px', fontWeight: 700, color: '#5a4fa0' }}>YOUR COURSE</span>}
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>
          <p style={{ fontSize: '14px', color: '#6e6d8a', lineHeight: 1.75, marginBottom: '26px' }}>{course.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '26px' }}>
            {[
              { icon: <UserCheck size={15} />, label: 'Instructor', value: isOwner ? `${course.tutorName} (You)` : course.tutorName },
              { icon: <BookOpen size={15} />, label: 'Subject', value: course.subject },
              { icon: <Clock size={15} />, label: 'Duration', value: `${course.duration} min` },
              { icon: <Calendar size={15} />, label: 'Date', value: `${course.date}${course.time ? ' at ' + course.time : ''}` },
            ].map(item => (
              <div key={item.label} style={{ padding: '12px 14px', background: '#f0eff4', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#7c6fcd' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '10px', color: '#a8a7c0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#2d2b55' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}><Users size={13} /> Enrolled students</span>
              <span style={{ fontSize: '13px', color: '#a8a7c0' }}>{course.enrolledCount}/{course.maxEnrolled}</span>
            </div>
            <div style={{ height: '7px', background: '#f0eff4', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${fillPct}%`, background: isFull ? '#e87070' : '#7c6fcd', borderRadius: '4px' }} />
            </div>
          </div>

          {!isOwner && (
            <button
              onClick={() => { course.isEnrolled ? unenroll(course.id) : enroll(course.id); }}
              disabled={isFull && !course.isEnrolled}
              style={{
                width: '100%', padding: '13px', borderRadius: '13px', border: 'none',
                background: course.isEnrolled ? '#f0d8c8' : isFull ? '#f0eff4' : '#7c6fcd',
                color: course.isEnrolled ? '#703010' : isFull ? '#a8a7c0' : 'white',
                fontSize: '15px', fontWeight: 700, cursor: (isFull && !course.isEnrolled) ? 'not-allowed' : 'pointer',
                fontFamily: 'Nunito', transition: 'opacity 0.2s',
              }}
            >
              {course.isEnrolled ? 'Unenroll from course' : isFull ? 'Course is full' : 'Enroll in this course'}
            </button>
          )}

          {isOwner && (
            <div style={{ padding: '14px', borderRadius: '13px', background: 'rgba(124,111,205,0.08)', border: '1px solid rgba(124,111,205,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star size={16} color="#7c6fcd" />
              <span style={{ fontSize: '13px', color: '#5a4fa0', fontWeight: 500 }}>This is your course — {course.enrolledCount} students are enrolled.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
