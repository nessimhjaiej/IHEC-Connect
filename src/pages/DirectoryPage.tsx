import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Search, GraduationCap, Star, BookOpen, Filter } from 'lucide-react';

const MOCK_TUTORS = [
  { userId: 'tutor1', name: 'Mark Lee', level: '4ème année', subject: 'Computer Science', rating: 4.8, reviewCount: 24, courses: 3, bio: 'Passionné d\'algorithmique et de systèmes d\'exploitation.' },
  { userId: 'tutor2', name: 'Jung Jaehyun', level: '3ème année', subject: 'Computer Science', rating: 4.9, reviewCount: 31, courses: 4, bio: 'Spécialiste en intelligence artificielle et machine learning.' },
  { userId: 'tutor3', name: 'Kim Taeyeong', level: '4ème année', subject: 'Engineering', rating: 4.7, reviewCount: 18, courses: 2, bio: 'Ingénieur logiciel, expert en génie logiciel et DevOps.' },
  { userId: 'tutor4', name: 'Sarah Chen', level: '3ème année', subject: 'Computer Science', rating: 4.6, reviewCount: 15, courses: 2, bio: 'Amoureuse des structures de données et des algorithmes.' },
  { userId: 'tutor5', name: 'Ahmed Ben Ali', level: '5ème année', subject: 'Computer Science', rating: 4.9, reviewCount: 42, courses: 5, bio: 'Expert en bases de données et systèmes distribués.' },
  { userId: 'tutor6', name: 'Leila Mansour', level: '4ème année', subject: 'Engineering', rating: 4.8, reviewCount: 27, courses: 3, bio: 'Spécialiste réseaux et cybersécurité. Certifiée CISCO.' },
];

const SUBJECTS = ['Tous', 'Computer Science', 'Engineering', 'Mathematics', 'Management', 'Economics', 'Finance'];

export function DirectoryPage() {
  const { getAllUsers } = useAuth();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('Tous');

  // Merge registered approved tutors with mock tutors
  const regTutors = getAllUsers()
    .filter(u => u.tutorStatus === 'approved')
    .map(u => ({
      userId: u.id,
      name: u.name,
      level: u.level || '',
      subject: u.subject || 'Non spécifié',
      rating: 4.5,
      reviewCount: 0,
      courses: 0,
      bio: u.bio || 'Aucune biographie disponible.',
    }));

  const allTutors = [...MOCK_TUTORS, ...regTutors];

  const filtered = allTutors.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subject === 'Tous' || t.subject === subject;
    return matchSearch && matchSubject;
  });

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '22px', color: '#2d2b55', marginBottom: '6px' }}>Annuaire des tuteurs</h1>
        <p style={{ fontSize: '13px', color: '#6e6d8a' }}>Trouvez un tuteur approuvé par l'administration IHEC</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e4e3f0', background: 'white' }}>
          <Search size={16} color="#a8a7c0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un tuteur…" style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', flex: 1, fontFamily: 'DM Sans', color: '#2d2b55' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e4e3f0', background: 'white' }}>
          <Filter size={14} color="#a8a7c0" />
          <select value={subject} onChange={e => setSubject(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', fontFamily: 'DM Sans', color: '#2d2b55', cursor: 'pointer' }}>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filtered.map(tutor => {
          const initials = tutor.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
          return (
            <Link key={tutor.userId} to={`/tutors/${tutor.userId}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e4e3f0', padding: '20px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(45,43,85,0.04)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(45,43,85,0.10)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#c0b8f0'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(45,43,85,0.04)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#e4e3f0'; }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c6fcd, #6b9bd2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: 'white', fontFamily: 'Nunito', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '15px', color: '#2d2b55' }}>{tutor.name}</span>
                      <span style={{ padding: '2px 7px', borderRadius: '6px', background: 'rgba(124,111,205,0.12)', fontSize: '10px', fontWeight: 700, color: '#5a4fa0', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <GraduationCap size={10} /> Tuteur
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6e6d8a' }}>{tutor.level} · {tutor.subject}</div>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#6e6d8a', lineHeight: 1.6, marginBottom: '14px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                  {tutor.bio}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f0eff4' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6e6d8a' }}>
                      <BookOpen size={12} color="#7c6fcd" /> {tutor.courses} cours
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#f0a030', fontWeight: 700 }}>
                      <Star size={12} color="#f0a030" /> {tutor.rating} ({tutor.reviewCount})
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#7c6fcd', fontWeight: 600 }}>Voir profil →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#a8a7c0' }}>
          <GraduationCap size={40} color="#e4e3f0" style={{ marginBottom: '12px' }} />
          <p style={{ fontSize: '14px' }}>Aucun tuteur trouvé pour cette recherche.</p>
        </div>
      )}
    </div>
  );
}
