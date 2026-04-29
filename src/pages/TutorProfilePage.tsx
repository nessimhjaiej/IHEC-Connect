import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCourses } from '../hooks/useCourses';
import { GraduationCap, BookOpen, Star, Mail, ChevronLeft, Award } from 'lucide-react';

// Mock tutor data for demo
const MOCK_TUTORS = [
  { userId: 'tutor1', name: 'Mark Lee', email: 'mark.lee.2021@ihec.ucar.tn', level: '4ème année', subject: 'Computer Science', bio: 'Passionné d\'algorithmique et de systèmes d\'exploitation. 2 ans d\'expérience en tutorat.', rating: 4.8, reviewCount: 24, joinedAt: '2023-09-01' },
  { userId: 'tutor2', name: 'Jung Jaehyun', email: 'jung.jaehyun.2022@ihec.ucar.tn', level: '3ème année', subject: 'Computer Science', bio: 'Spécialiste en intelligence artificielle et machine learning. Doctorant associé.', rating: 4.9, reviewCount: 31, joinedAt: '2023-10-15' },
  { userId: 'tutor3', name: 'Kim Taeyeong', email: 'kim.taeyeong.2021@ihec.ucar.tn', level: '4ème année', subject: 'Engineering', bio: 'Ingénieur logiciel chez une startup tunisienne. Expert en génie logiciel et DevOps.', rating: 4.7, reviewCount: 18, joinedAt: '2023-11-01' },
  { userId: 'tutor4', name: 'Sarah Chen', email: 'sarah.chen.2022@ihec.ucar.tn', level: '3ème année', subject: 'Computer Science', bio: 'Amoureuse des structures de données et des algorithmes. Compétitrice en programming contests.', rating: 4.6, reviewCount: 15, joinedAt: '2024-01-10' },
  { userId: 'tutor5', name: 'Ahmed Ben Ali', email: 'ahmed.benali.2020@ihec.ucar.tn', level: '5ème année', subject: 'Computer Science', bio: 'Expert en bases de données et systèmes distribués. Tuteur depuis 3 ans à l\'IHEC.', rating: 4.9, reviewCount: 42, joinedAt: '2022-09-01' },
  { userId: 'tutor6', name: 'Leila Mansour', email: 'leila.mansour.2021@ihec.ucar.tn', level: '4ème année', subject: 'Engineering', bio: 'Spécialiste réseaux et cybersécurité. Certifiée CISCO et CompTIA Security+.', rating: 4.8, reviewCount: 27, joinedAt: '2023-02-14' },
];

const MOCK_REVIEWS = [
  { id: 'r1', studentName: 'Nour Trabelsi', rating: 5, comment: 'Excellent tuteur ! Explications très claires et pédagogiques.', date: '2024-10-15' },
  { id: 'r2', studentName: 'Karim Belhadj', rating: 4, comment: 'Très compétent et patient. Les cours sont bien structurés.', date: '2024-10-20' },
  { id: 'r3', studentName: 'Amira Fourati', rating: 5, comment: 'Je recommande vivement. Grâce à ce tuteur j\'ai réussi mon examen !', date: '2024-11-01' },
];

export function TutorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { getAllUsers } = useAuth();
  const { courses } = useCourses();

  // Find tutor from mock data or registered users
  const allUsers = getAllUsers();
  const registeredTutor = allUsers.find(u => u.id === id && u.tutorStatus === 'approved');
  const mockTutor = MOCK_TUTORS.find(t => t.userId === id);
  
  const tutor = registeredTutor ? {
    userId: registeredTutor.id,
    name: registeredTutor.name,
    email: registeredTutor.email,
    level: registeredTutor.level || '',
    subject: registeredTutor.subject || '',
    bio: registeredTutor.bio || 'Aucune biographie disponible.',
    rating: 4.5,
    reviewCount: 0,
    joinedAt: registeredTutor.createdAt,
  } : mockTutor;

  if (!tutor) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#6e6d8a' }}>Tuteur introuvable.</p>
        <Link to="/directory" style={{ color: '#7c6fcd', fontWeight: 600 }}>Retour à l'annuaire</Link>
      </div>
    );
  }

  const tutorCourses = courses.filter(c => c.tutorId === tutor.userId);
  const initials = tutor.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ maxWidth: '720px' }}>
      <Link to="/directory" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6e6d8a', textDecoration: 'none', marginBottom: '20px', fontWeight: 600 }}>
        <ChevronLeft size={15} /> Retour à l'annuaire
      </Link>

      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e4e3f0', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ background: 'linear-gradient(135deg, #e8d0f0 0%, #b8d4f0 100%)', height: '120px' }} />
        <div style={{ padding: '0 32px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-44px', marginBottom: '20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, #7c6fcd, #6b9bd2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: 'white', fontFamily: 'Nunito', border: '4px solid white', flexShrink: 0 }}>
              {initials}
            </div>
            <a href={`mailto:${tutor.email}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: '1px solid #e4e3f0', background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#7c6fcd', textDecoration: 'none' }}>
              <Mail size={14} /> Contacter
            </a>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '22px', color: '#2d2b55' }}>{tutor.name}</h1>
              <span style={{ padding: '3px 10px', borderRadius: '8px', background: 'rgba(124,111,205,0.12)', fontSize: '12px', fontWeight: 700, color: '#5a4fa0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <GraduationCap size={12} /> Tuteur approuvé
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#6e6d8a', flexWrap: 'wrap' }}>
              <span>📚 {tutor.subject}</span>
              <span>🎓 {tutor.level}</span>
              <span style={{ color: '#a8a7c0' }}>·</span>
              <span style={{ color: '#f0a030', fontWeight: 700 }}>★ {tutor.rating.toFixed(1)}</span>
              <span style={{ color: '#a8a7c0' }}>({tutor.reviewCount} avis)</span>
            </div>
          </div>

          {tutor.bio && (
            <div style={{ background: '#f8f7ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: '#4a4a6a', lineHeight: 1.7 }}>{tutor.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Cours dispensés', value: String(tutorCourses.length || 2), color: '#e8d0f0', dark: '#4a1a70', icon: <BookOpen size={16} color="#4a1a70" /> },
              { label: 'Étudiants formés', value: String(tutorCourses.reduce((a, c) => a + c.enrolledCount, 0) || 47), color: '#b8d4f0', dark: '#1a4a70', icon: <Award size={16} color="#1a4a70" /> },
              { label: 'Note moyenne', value: tutor.rating.toFixed(1) + '★', color: '#fce8c8', dark: '#703010', icon: <Star size={16} color="#703010" /> },
            ].map(s => (
              <div key={s.label} style={{ background: s.color, borderRadius: '12px', padding: '14px 12px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>{s.icon}</div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '18px', color: s.dark }}>{s.value}</div>
                <div style={{ fontSize: '10px', color: s.dark, opacity: 0.7 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses */}
      {(tutorCourses.length > 0) && (
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e4e3f0', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '16px', color: '#2d2b55', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={16} color="#7c6fcd" /> Cours dispensés
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tutorCourses.map(course => (
              <Link key={course.id} to={`/courses/${course.id}`} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '12px', border: '1px solid #e4e3f0', textDecoration: 'none', transition: 'border-color 0.2s' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: course.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#2d2b55' }}>{course.title}</div>
                  <div style={{ fontSize: '12px', color: '#a8a7c0' }}>{course.subject} · {course.enrolledCount}/{course.maxEnrolled} étudiants</div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, background: course.status === 'upcoming' ? '#eef8f0' : '#f0eff4', color: course.status === 'upcoming' ? '#1a6a3a' : '#6e6d8a' }}>
                  {course.status === 'upcoming' ? 'À venir' : course.status === 'ongoing' ? 'En cours' : 'Terminé'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e4e3f0', padding: '24px' }}>
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '16px', color: '#2d2b55', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Star size={16} color="#f0a030" /> Avis des étudiants
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MOCK_REVIEWS.map(r => (
            <div key={r.id} style={{ padding: '16px', borderRadius: '12px', background: '#fafafe', border: '1px solid #f0eff4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#2d2b55' }}>{r.studentName}</span>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < r.rating ? '#f0a030' : '#e4e3f0', fontSize: '13px' }}>★</span>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#4a4a6a', lineHeight: 1.6 }}>{r.comment}</p>
              <span style={{ fontSize: '11px', color: '#a8a7c0', marginTop: '6px', display: 'block' }}>{r.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
