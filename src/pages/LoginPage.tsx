import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, GraduationCap, Eye, EyeOff, CheckCircle } from 'lucide-react';

const RECAPTCHA_SITE_KEY =
  (import.meta as any).env?.VITE_RECAPTCHA_SITE_KEY ||
  '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoadLogin?: () => void;
    onRecaptchaLoadRegister?: () => void;
  }
}

function useLoginRecaptcha(onVerify: (t: string) => void) {
  const widgetIdRef = useRef<number | null>(null);
  useEffect(() => {
    const render = () => {
      const el = document.getElementById('login-recaptcha');
      if (!window.grecaptcha || !el || widgetIdRef.current !== null) return;
      widgetIdRef.current = window.grecaptcha.render('login-recaptcha', {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (t: string) => onVerify(t),
        'expired-callback': () => onVerify(''),
        theme: 'light', size: 'normal',
      });
    };

    if (window.grecaptcha?.render) {
      // grecaptcha already loaded — defer one frame so the DOM element is mounted
      requestAnimationFrame(render);
    } else {
      // Use a page-specific callback name to avoid collisions with RegisterPage
      window.onRecaptchaLoadLogin = render;
      if (!document.getElementById('recaptcha-script')) {
        const s = document.createElement('script');
        s.id = 'recaptcha-script';
        s.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadLogin&render=explicit';
        s.async = true; s.defer = true;
        document.head.appendChild(s);
      }
    }

    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
        try { window.grecaptcha.reset(widgetIdRef.current); } catch {}
        widgetIdRef.current = null;
      }
      // Clean up the global callback to avoid stale references
      delete window.onRecaptchaLoadLogin;
    };
  }, []);
}

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [pwReset, setPwReset] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');

  useLoginRecaptcha(setRecaptchaToken);

  // Already authenticated → go to dashboard (or original destination)
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (params.get('verified') === '1') setVerified(true);
    if (params.get('reset') === '1') setPwReset(true);
  }, [params]);

  const getSpecificError = (raw: string): string => {
    const r = raw.toLowerCase();
    if (r.includes('email') && r.includes('format'))       return "Format d'email invalide. Utilisez : prenom.nom.annee@ihec.ucar.tn";
    if (r.includes('@ihec') || r.includes('autorisé'))     return "Seuls les emails @ihec.ucar.tn sont acceptés.";
    if (r.includes('aucun compte') || r.includes('introuvable')) return "Aucun compte trouvé pour cet email. Vérifiez l'adresse ou créez un compte.";
    if (r.includes('vérifie') || r.includes('verif'))      return "Email non vérifié. Consultez votre boîte mail et entrez le code de confirmation.";
    if (r.includes('mot de passe') || r.includes('password') || r.includes('incorrect') || r.includes('invalide')) return "Mot de passe incorrect. Vérifiez votre saisie ou réinitialisez votre mot de passe.";
    if (r.includes('recaptcha') || r.includes('captcha'))  return "Vérification reCAPTCHA échouée. Veuillez réessayer.";
    if (r.includes('bloqué') || r.includes('désactivé'))   return "Ce compte a été désactivé. Contactez l'administration.";
    return raw || "Identifiants incorrects. Vérifiez votre email et votre mot de passe.";
  };

  const handleSubmit = async () => {
    setError('');
    if (!email)    { setError("Veuillez saisir votre email IHEC."); return; }
    if (!password) { setError("Veuillez saisir votre mot de passe."); return; }
    if (!email.toLowerCase().endsWith('@ihec.ucar.tn')) { setError("Seuls les emails @ihec.ucar.tn sont acceptés."); return; }
    if (!recaptchaToken) { setError("Veuillez compléter la vérification reCAPTCHA."); return; }
    setLoading(true);
    const result = await login(email, password, recaptchaToken);
    setLoading(false);
    if (result.ok) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      setError(getSpecificError(result.error || ''));
      if (window.grecaptcha) { try { window.grecaptcha.reset(); } catch {} }
      setRecaptchaToken('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f0eff4' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '44px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c6fcd, #6b9bd2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={22} color="white" />
            </div>
            <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '18px', color: '#2d2b55' }}>IHEC Connect</span>
          </div>

          <h1 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '28px', color: '#2d2b55', marginBottom: '8px' }}>Bienvenue</h1>
          <p style={{ fontSize: '14px', color: '#6e6d8a', marginBottom: '28px' }}>Connectez-vous avec votre email IHEC</p>

          {verified  && <div style={{ padding: '11px 14px', borderRadius: '10px', background: '#efffef', border: '1px solid #9de', fontSize: '13px', color: '#1a6a3a', marginBottom: '16px', display: 'flex', gap: '8px' }}><CheckCircle size={15} /> Email vérifié ! Vous pouvez maintenant vous connecter.</div>}
          {pwReset   && <div style={{ padding: '11px 14px', borderRadius: '10px', background: '#efffef', border: '1px solid #9de', fontSize: '13px', color: '#1a6a3a', marginBottom: '16px', display: 'flex', gap: '8px' }}><CheckCircle size={15} /> Mot de passe réinitialisé ! Connectez-vous avec votre nouveau mot de passe.</div>}
          {error     && <div style={{ padding: '11px 14px', borderRadius: '10px', background: '#fff0f0', border: '1px solid #fdd', fontSize: '13px', color: '#c0392b', marginBottom: '16px' }}>{error}</div>}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#6e6d8a', display: 'block', marginBottom: '7px' }}>Email IHEC</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', border: '1px solid #e4e3f0', background: 'white' }}>
              <Mail size={16} color="#a8a7c0" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="prenom.nom.annee@ihec.ucar.tn" style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', flex: 1, fontFamily: 'DM Sans', color: '#2d2b55' }} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#6e6d8a', display: 'block', marginBottom: '7px' }}>Mot de passe</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', border: '1px solid #e4e3f0', background: 'white' }}>
              <Lock size={16} color="#a8a7c0" />
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', flex: 1, fontFamily: 'DM Sans', color: '#2d2b55' }} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              <button onClick={() => setShowPw(!showPw)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', padding: 0 }}>
                {showPw ? <EyeOff size={16} color="#a8a7c0" /> : <Eye size={16} color="#a8a7c0" />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Link to="/forgot-password" style={{ fontSize: '12px', color: '#7c6fcd', fontWeight: 600, textDecoration: 'none' }}>
              Mot de passe oublié ?
            </Link>
          </div>

          {/* reCAPTCHA v2 */}
          <div style={{ marginBottom: '20px' }}>
            <div id="login-recaptcha" style={{ transform: 'scale(0.97)', transformOrigin: '0 0' }} />
          </div>

          <button onClick={handleSubmit} disabled={loading || !recaptchaToken} style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: recaptchaToken ? '#7c6fcd' : '#e4e3f0', color: recaptchaToken ? 'white' : '#a8a7c0', fontSize: '15px', fontWeight: 700, cursor: loading || !recaptchaToken ? 'not-allowed' : 'pointer', fontFamily: 'Nunito', transition: 'all 0.2s' }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6e6d8a', marginTop: '20px' }}>
            Pas encore de compte ? <Link to="/register" style={{ color: '#7c6fcd', fontWeight: 600, textDecoration: 'none' }}>S'inscrire</Link>
          </p>
        </div>
      </div>

      <div style={{ width: '400px', background: 'linear-gradient(150deg, #2d2b55 0%, #3d3a6e 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', gap: '28px' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <GraduationCap size={56} color="rgba(255,255,255,0.2)" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '22px', marginBottom: '12px' }}>Apprenez de vos pairs</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>IHEC Connect connecte étudiants et tuteurs.<br />Réservé aux étudiants de l'IHEC Carthage.</p>
        </div>
        {[{ label: '180+', sub: 'Tuteurs actifs' }, { label: '640+', sub: 'Cours disponibles' }, { label: '1 200+', sub: 'Étudiants inscrits' }].map(item => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '28px', color: 'white' }}>{item.label}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}