import { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, X, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../types';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New Course Available', message: 'Operating Systems starts in 1 hour', time: '1h ago', read: false, type: 'course' },
  { id: '2', title: 'Enrollment Confirmed', message: 'You joined Software Engineering', time: '3h ago', read: false, type: 'enrollment' },
  { id: '3', title: 'Course Updated', message: 'AI session rescheduled to Thursday', time: '1d ago', read: true, type: 'course' },
  { id: '4', title: 'Welcome to IHEC Connect', message: 'Your account is verified', time: '2d ago', read: true, type: 'system' },
];

export function TopBar({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })));
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const isTutor = user?.tutorStatus === 'approved';

  return (
    <div style={{ height: '68px', background: 'white', borderBottom: '1px solid #e4e3f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', flexShrink: 0 }}>
      <h1 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '20px', color: '#2d2b55' }}>{title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0eff4', borderRadius: '11px', padding: '8px 14px', border: '1px solid #e4e3f0' }}>
          <Search size={15} color="#a8a7c0" strokeWidth={1.8} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search courses…"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#2d2b55', width: '160px', fontFamily: 'DM Sans' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', padding: 0 }}>
              <X size={13} color="#a8a7c0" />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            style={{ width: '38px', height: '38px', borderRadius: '11px', border: '1px solid #e4e3f0', background: showNotifs ? '#f0eff4' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
          >
            <Bell size={17} strokeWidth={1.8} color="#6e6d8a" />
            {unread > 0 && (
              <span className="badge" style={{ position: 'absolute', top: '7px', right: '7px', width: '7px', height: '7px', borderRadius: '50%', background: '#e87070', border: '1.5px solid white' }} />
            )}
          </button>

          {showNotifs && (
            <div style={{ position: 'absolute', top: '46px', right: 0, width: '310px', background: 'white', borderRadius: '15px', border: '1px solid #e4e3f0', boxShadow: '0 8px 32px rgba(45,43,85,0.14)', zIndex: 100, overflow: 'hidden' }}>
              <div style={{ padding: '15px 18px', borderBottom: '1px solid #e4e3f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '14px' }}>Notifications</span>
                {unread > 0 && <button onClick={markAllRead} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '11px', color: '#7c6fcd', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}><Check size={11} /> All read</button>}
              </div>
              <div style={{ maxHeight: '270px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} onClick={() => setNotifications(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    style={{ padding: '13px 18px', cursor: 'pointer', background: n.read ? 'transparent' : 'rgba(124,111,205,0.04)', borderBottom: '1px solid #f5f4fb', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f5f4fb')}
                    onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(124,111,205,0.04)')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#2d2b55' }}>{n.title}</span>
                      {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7c6fcd', flexShrink: 0, marginTop: '3px' }} />}
                    </div>
                    <p style={{ fontSize: '11px', color: '#6e6d8a', marginTop: '2px', lineHeight: 1.4 }}>{n.message}</p>
                    <span style={{ fontSize: '10px', color: '#a8a7c0', marginTop: '3px', display: 'block' }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '9px', background: showProfile ? '#f0eff4' : 'white', border: '1px solid #e4e3f0', borderRadius: '11px', padding: '5px 11px 5px 5px', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: isTutor ? 'linear-gradient(135deg, #c8b0f0, #a890d8)' : 'linear-gradient(135deg, #7c6fcd, #6b9bd2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', fontFamily: 'Nunito' }}>
              {initials}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#2d2b55', lineHeight: 1.2 }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '10px', color: '#a8a7c0' }}>{isTutor ? 'Tutor' : user?.level || 'Student'}</div>
            </div>
            <ChevronDown size={13} color="#a8a7c0" style={{ transition: 'transform 0.2s', transform: showProfile ? 'rotate(180deg)' : 'none' }} />
          </button>

          {showProfile && (
            <div style={{ position: 'absolute', top: '50px', right: 0, width: '195px', background: 'white', borderRadius: '13px', border: '1px solid #e4e3f0', boxShadow: '0 8px 32px rgba(45,43,85,0.14)', zIndex: 100, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #e4e3f0' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#2d2b55' }}>{user?.name}</div>
                <div style={{ fontSize: '11px', color: '#a8a7c0', marginTop: '1px' }}>{user?.email}</div>
                <div style={{ marginTop: '6px', display: 'inline-block', padding: '2px 8px', borderRadius: '6px', background: isTutor ? 'rgba(124,111,205,0.12)' : 'rgba(107,155,210,0.12)', fontSize: '10px', fontWeight: 600, color: isTutor ? '#5a4fa0' : '#2a5a8a' }}>
                  {isTutor ? 'Tutor' : 'Student'}
                </div>
              </div>
              {[
                { label: 'View Profile', fn: () => { navigate('/profile'); setShowProfile(false); } },
                { label: 'Settings', fn: () => { navigate('/settings'); setShowProfile(false); } },
              ].map(item => (
                <button key={item.label} onClick={item.fn} style={{ display: 'block', width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: '13px', color: '#2d2b55', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f0eff4')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >{item.label}</button>
              ))}
              <div style={{ borderTop: '1px solid #e4e3f0' }}>
                <button onClick={() => { logout(); navigate('/login'); }} style={{ display: 'block', width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: '13px', color: '#e87070', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >Log out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
