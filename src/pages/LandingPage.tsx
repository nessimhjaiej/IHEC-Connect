import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Calendar, ArrowRight } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '560px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #7c6fcd, #6b9bd2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <GraduationCap size={36} color="white" />
        </div>
        <h1 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '40px', lineHeight: 1.2, marginBottom: '16px' }}>
          Welcome to<br /><span style={{ color: 'var(--accent-purple)' }}>IHEC Connect</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '36px' }}>
          Your academic companion — join study sessions, connect with peers, and accelerate your learning at IHEC.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '48px' }}>
          <button onClick={() => navigate('/login')} style={{
            padding: '13px 28px', borderRadius: '12px', border: 'none',
            background: 'var(--accent-purple)', color: 'white', fontSize: '15px',
            fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            Sign In <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/register')} style={{
            padding: '13px 28px', borderRadius: '12px',
            border: '1.5px solid var(--border-color)', background: 'white',
            fontSize: '15px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'DM Sans', color: 'var(--text-primary)',
          }}>
            Create Account
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { icon: <BookOpen size={22} color="#3a6fa0" />, bg: '#b8d4f0', label: 'Study Sessions', sub: 'Join or host sessions' },
            { icon: <Users size={22} color="#2e7d5a" />, bg: '#c8e8d4', label: 'Peer Network', sub: 'Connect with students' },
            { icon: <Calendar size={22} color="#703010" />, bg: '#f0d8c8', label: 'Smart Schedule', sub: 'Organize your time' },
          ].map(item => (
            <div key={item.label} style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                {item.icon}
              </div>
              <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '14px' }}>{item.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
