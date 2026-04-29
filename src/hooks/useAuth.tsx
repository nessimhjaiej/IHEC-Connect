import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, TutorStatus } from '../types';

export const IHEC_EMAIL_REGEX = /^[a-zA-ZÀ-ÿ]+\.[a-zA-ZÀ-ÿ]+\.\d{4}@ihec\.ucar\.tn$/i;

export function validateIhecEmail(email: string): boolean {
  return IHEC_EMAIL_REGEX.test(email);
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, recaptchaToken: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  register: (data: RegisterData & { recaptchaToken: string }) => Promise<{ ok: boolean; error?: string }>;
  requestTutorRole: () => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => void;
  verifyEmail: (code: string) => Promise<boolean>;
  getAllUsers: () => User[];
  approveTutor: (userId: string) => void;
  rejectTutor: (userId: string) => void;
  getPendingTutors: () => User[];
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  level: string;
  acceptedTerms: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EVENTS_KEY = 'ihec_admin_events';
function seedAdminEvents() {
  if (localStorage.getItem(ADMIN_EVENTS_KEY)) return;
  const events = [
    { id: 'adm1', title: 'Rentrée universitaire 2024', date: '2024-09-15', type: 'admin', description: "Début de l'année universitaire", createdBy: 'admin', color: '#e85d4a' },
    { id: 'adm2', title: 'Journée portes ouvertes IHEC', date: '2024-11-10', type: 'admin', description: "Découvrez l'IHEC", createdBy: 'admin', color: '#e85d4a' },
    { id: 'adm3', title: 'Examens mi-semestre', date: '2024-11-20', type: 'admin', description: "Période d'examens", createdBy: 'admin', color: '#e85d4a' },
  ];
  localStorage.setItem(ADMIN_EVENTS_KEY, JSON.stringify(events));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null, isAuthenticated: false });

  useEffect(() => {
    seedAdminEvents();
    const token = localStorage.getItem('ihec_token');
    const userStr = localStorage.getItem('ihec_user');
    if (token && userStr) {
      try { setState({ user: JSON.parse(userStr), token, isAuthenticated: true }); } catch {}
    }
  }, []);

  const getAllUsers = (): User[] => {
    const str = localStorage.getItem('ihec_all_users');
    return str ? JSON.parse(str) : [];
  };

  const saveAllUsers = (users: User[]) => localStorage.setItem('ihec_all_users', JSON.stringify(users));

  const login = async (email: string, password: string, recaptchaToken: string): Promise<{ ok: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 700));
    if (!validateIhecEmail(email)) return { ok: false, error: 'Seuls les emails @ihec.ucar.tn sont autorisés. Format : prenom.nom.annee@ihec.ucar.tn' };
    if (!recaptchaToken) return { ok: false, error: 'Veuillez compléter la vérification reCAPTCHA.' };

    const allUsers = getAllUsers();
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { ok: false, error: 'Aucun compte trouvé avec cet email.' };
    if (!found.emailVerified) return { ok: false, error: 'Veuillez vérifier votre email avant de vous connecter.' };

    // NOTE: En production, le backend vérifie le mot de passe + reCAPTCHA token via /api/auth/login
    const token = 'mock-jwt-' + Date.now();
    localStorage.setItem('ihec_token', token);
    localStorage.setItem('ihec_user', JSON.stringify(found));
    setState({ user: found, token, isAuthenticated: true });
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem('ihec_token');
    localStorage.removeItem('ihec_user');
    setState({ user: null, token: null, isAuthenticated: false });
  };

  const register = async (data: RegisterData & { recaptchaToken: string }): Promise<{ ok: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 700));
    if (!validateIhecEmail(data.email)) return { ok: false, error: 'Email IHEC invalide. Format : prenom.nom.annee@ihec.ucar.tn' };
    if (!data.acceptedTerms) return { ok: false, error: "Vous devez accepter les conditions d'utilisation." };
    if (!data.recaptchaToken) return { ok: false, error: 'Vérification reCAPTCHA manquante.' };

    const allUsers = getAllUsers();
    if (allUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase())) return { ok: false, error: 'Un compte avec cet email existe déjà.' };

    const user: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: 'student',
      tutorStatus: 'none',
      level: data.level,
      bio: '',
      emailVerified: false,
      acceptedTerms: data.acceptedTerms,
      createdAt: new Date().toISOString(),
    };
    allUsers.push(user);
    saveAllUsers(allUsers);
    localStorage.setItem(`ihec_verify_${data.email}`, '123456');
    // NOTE: En production, le backend envoie le vrai email via aiosmtplib/PHPMailer
    return { ok: true };
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    if (!state.user) return false;
    const stored = localStorage.getItem(`ihec_verify_${state.user.email}`);
    if (stored !== code && code !== '123456') return false;
    const allUsers = getAllUsers();
    const idx = allUsers.findIndex(u => u.id === state.user!.id);
    if (idx === -1) return false;
    allUsers[idx].emailVerified = true;
    saveAllUsers(allUsers);
    const updated = { ...state.user, emailVerified: true };
    localStorage.setItem('ihec_user', JSON.stringify(updated));
    setState(s => ({ ...s, user: updated }));
    return true;
  };

  const requestTutorRole = async (): Promise<boolean> => {
    if (!state.user) return false;
    const allUsers = getAllUsers();
    const idx = allUsers.findIndex(u => u.id === state.user!.id);
    if (idx === -1) return false;
    allUsers[idx].tutorStatus = 'pending';
    saveAllUsers(allUsers);
    const updated = { ...state.user, tutorStatus: 'pending' as TutorStatus };
    localStorage.setItem('ihec_user', JSON.stringify(updated));
    setState(s => ({ ...s, user: updated }));
    return true;
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!state.user) return;
    const updated = { ...state.user, ...updates };
    const allUsers = getAllUsers();
    const idx = allUsers.findIndex(u => u.id === state.user!.id);
    if (idx !== -1) { allUsers[idx] = updated; saveAllUsers(allUsers); }
    localStorage.setItem('ihec_user', JSON.stringify(updated));
    setState(s => ({ ...s, user: updated }));
  };

  const getPendingTutors = () => getAllUsers().filter(u => u.tutorStatus === 'pending');

  const approveTutor = (userId: string) => {
    const allUsers = getAllUsers();
    const idx = allUsers.findIndex(u => u.id === userId);
    if (idx !== -1) { allUsers[idx].tutorStatus = 'approved'; saveAllUsers(allUsers); }
  };

  const rejectTutor = (userId: string) => {
    const allUsers = getAllUsers();
    const idx = allUsers.findIndex(u => u.id === userId);
    if (idx !== -1) { allUsers[idx].tutorStatus = 'rejected'; saveAllUsers(allUsers); }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register, requestTutorRole, updateProfile, verifyEmail, getAllUsers, approveTutor, rejectTutor, getPendingTutors }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
