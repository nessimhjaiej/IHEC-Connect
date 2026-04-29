import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { useAuth } from './hooks/useAuth';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CreateCoursePage } from './pages/CreateCoursePage';
import { ProfilePage } from './pages/ProfilePage';
import { SchedulePage } from './pages/SchedulePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { TutorProfilePage } from './pages/TutorProfilePage';
import { MessagesPage, ParticipantsPage, SettingsPage } from './pages/PlaceholderPages';

/**
 * PublicOnlyRoute — redirects authenticated users away from login/register.
 * Prevents going "back" to login after being logged in.
 */
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();
  return (
    <Routes>
      {/* Public — accessible sans être connecté */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login"    element={<PublicOnlyRoute><LoginPage key={location.key} /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage key={location.key} /></PublicOnlyRoute>} />
      <Route path="/verify-email"     element={<VerifyEmailPage />} />
      <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
      <Route path="/reset-password"   element={<ResetPasswordPage />} />

      {/* Protected — nécessite d'être connecté */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"       element={<DashboardPage />} />
        <Route path="courses"         element={<CoursesPage />} />
        <Route path="courses/create"  element={<CreateCoursePage />} />
        <Route path="courses/:id"     element={<CourseDetailPage />} />
        <Route path="messages"        element={<MessagesPage />} />
        <Route path="participants"    element={<ParticipantsPage />} />
        <Route path="schedule"        element={<SchedulePage />} />
        <Route path="profile"         element={<ProfilePage />} />
        <Route path="settings"        element={<SettingsPage />} />
        <Route path="directory"       element={<DirectoryPage />} />
        <Route path="tutors/:id"      element={<TutorProfilePage />} />
      </Route>

      {/* Fallback — route inconnue → accueil */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
