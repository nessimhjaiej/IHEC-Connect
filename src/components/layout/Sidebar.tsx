import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, MessageSquare, Users,
  Calendar, Settings, GraduationCap, LogOut, Search
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', filled: true },
  { to: '/courses', icon: BookOpen, label: 'Cours' },
  { to: '/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/schedule', icon: Calendar, label: 'Calendrier' },
  { to: '/directory', icon: Search, label: 'Annuaire tuteurs' },
  { to: '/participants', icon: Users, label: 'Participants' },
];

const BOTTOM_ITEMS = [
  { to: '/settings', icon: Settings, label: 'Paramètres' },
];

export function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const isTutor = user?.tutorStatus === 'approved';
  const isPending = user?.tutorStatus === 'pending';

  return (
    <aside style={{
      width: '220px', minWidth: '220px',
      background: '#2d2b55',
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '26px 22px 22px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #7c6fcd, #6b9bd2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <GraduationCap size={18} color="white" />
        </div>
        <div>
          <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '14px', color: '#fff', lineHeight: 1.1 }}>IHEC</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>Connect</div>
        </div>
      </div>

      {/* Role badge */}
      <div style={{ padding: '12px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '8px', background: isTutor ? 'rgba(74,158,110,0.18)' : 'rgba(255,255,255,0.07)' }}>
          {isTutor ? <GraduationCap size={12} color="#4a9e6e" /> : <BookOpen size={12} color="rgba(255,255,255,0.5)" />}
          <span style={{ fontSize: '11px', color: isTutor ? '#7ae0a8' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            {isTutor ? 'Tuteur ✓' : isPending ? 'Demande en cours…' : 'Membre IHEC'}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label, filled }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '11px',
              padding: '10px 13px', borderRadius: '10px', textDecoration: 'none',
              fontSize: '13px', fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              background: isActive ? 'rgba(124,111,205,0.35)' : 'transparent',
              transition: 'all 0.18s',
            })}
            onMouseEnter={e => { if (!(e.currentTarget as HTMLElement).classList.contains('active')) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseLeave={e => { if (!(e.currentTarget as HTMLElement).classList.contains('active')) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={isActive && filled ? 0 : 1.8} fill={isActive && filled ? 'currentColor' : 'none'} color={isActive ? '#fff' : 'rgba(255,255,255,0.45)'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {BOTTOM_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '11px',
              padding: '10px 13px', borderRadius: '10px', textDecoration: 'none',
              fontSize: '13px', fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              background: isActive ? 'rgba(124,111,205,0.35)' : 'transparent',
              marginBottom: '2px', transition: 'all 0.18s',
            })}>
            {({ isActive }) => (
              <><Icon size={17} strokeWidth={1.8} color={isActive ? '#fff' : 'rgba(255,255,255,0.45)'} />{label}</>
            )}
          </NavLink>
        ))}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 13px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: 'rgba(255,255,255,0.5)', width: '100%', marginTop: '2px', transition: 'all 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,112,112,0.15)'; e.currentTarget.style.color = '#e87070'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <LogOut size={17} strokeWidth={1.8} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
