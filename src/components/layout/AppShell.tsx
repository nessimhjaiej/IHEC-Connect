import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/courses': 'Courses',
  '/courses/create': 'Create Course',
  '/messages': 'Messages',
  '/participants': 'Participants',
  '/schedule': 'Schedule',
  '/profile': 'My Profile',
  '/settings': 'Settings',
  '/directory': 'Directory',
};

export function AppShell() {
  const location = useLocation();
  const base = '/' + location.pathname.split('/')[1];
  const title = PAGE_TITLES[location.pathname] || PAGE_TITLES[base] || 'IHEC Connect';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar title={title} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '26px 30px' }} className="scrollbar-thin">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
