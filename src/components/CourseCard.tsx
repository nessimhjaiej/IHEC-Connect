import { Monitor, Brain, Code2, Database, Server, Wifi, Book, Users, Clock, ChevronRight, Star } from 'lucide-react';
import { Course } from '../types';
import { useNavigate } from 'react-router-dom';

const ICONS: Record<string, React.ElementType> = {
  monitor: Monitor, brain: Brain, code: Code2,
  database: Database, server: Server, wifi: Wifi, book: Book,
};

const COLOR_DARK: Record<string, string> = {
  '#b8d4f0': '#1a4a70', '#c8e8d4': '#1a5a3a', '#f0d8c8': '#703010',
  '#e8d0f0': '#4a1a70', '#fce8c8': '#604000', '#d0eef8': '#0a4a6a',
};

interface CourseCardProps {
  course: Course;
  mode: 'student' | 'tutor-taking' | 'tutor-giving';
  onEnroll?: (id: string) => void;
  onUnenroll?: (id: string) => void;
}

export function CourseCard({ course, mode, onEnroll, onUnenroll }: CourseCardProps) {
  const navigate = useNavigate();
  const Icon = ICONS[course.icon] || Book;
  const fillPct = Math.round((course.enrolledCount / course.maxEnrolled) * 100);
  const isFull = course.enrolledCount >= course.maxEnrolled;
  const dark = COLOR_DARK[course.color] || '#2d2b55';

  return (
    <div
      className="course-card"
      onClick={() => navigate(`/courses/${course.id}`)}
      style={{
        background: 'white', borderRadius: '16px', padding: '20px',
        border: '1px solid #e4e3f0', display: 'flex', alignItems: 'center',
        gap: '18px', cursor: 'pointer',
      }}
    >
      {/* Icon */}
      <div style={{
        width: '72px', height: '72px', borderRadius: '14px',
        background: course.color, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={28} color={dark} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <h3 style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '15px', color: '#2d2b55' }}>
            {course.title}
          </h3>
          <div style={{ display: 'flex', gap: '6px', marginLeft: '8px', flexShrink: 0 }}>
            {course.status === 'ongoing' && (
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', background: 'rgba(74,158,110,0.15)', color: '#2e7d5a', borderRadius: '20px' }}>LIVE</span>
            )}
            {mode === 'tutor-giving' && (
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', background: 'rgba(124,111,205,0.15)', color: '#5a4fa0', borderRadius: '20px' }}>TEACHING</span>
            )}
            {mode === 'student' && course.isEnrolled && (
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', background: 'rgba(107,155,210,0.15)', color: '#2a5a8a', borderRadius: '20px' }}>ENROLLED</span>
            )}
          </div>
        </div>

        <p style={{ fontSize: '12px', color: '#6e6d8a', lineHeight: 1.5, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#a8a7c0', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={12} /> {course.enrolledCount}/{course.maxEnrolled}
          </span>
          <span style={{ fontSize: '11px', color: '#a8a7c0', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {course.duration}min
          </span>
          <span style={{ fontSize: '11px', color: '#a8a7c0' }}>
            {mode === 'tutor-giving' ? `${course.enrolledCount} students` : `By ${course.tutorName}`}
          </span>
        </div>

        <div style={{ height: '4px', background: '#f0eff4', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${fillPct}%`, background: isFull ? '#e87070' : '#7c6fcd', borderRadius: '2px', transition: 'width 0.4s' }} />
        </div>
      </div>

      {/* Action */}
      {mode !== 'tutor-giving' && (
        <button
          onClick={e => {
            e.stopPropagation();
            if (course.isEnrolled) onUnenroll?.(course.id);
            else if (!isFull) onEnroll?.(course.id);
          }}
          disabled={isFull && !course.isEnrolled}
          style={{
            width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
            border: 'none', cursor: (isFull && !course.isEnrolled) ? 'not-allowed' : 'pointer',
            background: course.isEnrolled ? '#f0d8c8' : isFull ? '#f0eff4' : '#7c6fcd',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.15s, background 0.2s',
          }}
          onMouseEnter={e => { if (!isFull || course.isEnrolled) e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <ChevronRight size={16} color={course.isEnrolled ? '#a05030' : isFull ? '#a8a7c0' : 'white'} />
        </button>
      )}
      {mode === 'tutor-giving' && (
        <button
          onClick={e => { e.stopPropagation(); navigate(`/courses/${course.id}`); }}
          style={{
            width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
            border: 'none', cursor: 'pointer', background: '#e8d0f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Star size={16} color="#6a3a90" />
        </button>
      )}
    </div>
  );
}
