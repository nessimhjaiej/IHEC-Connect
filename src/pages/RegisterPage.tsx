import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, validateIhecEmail, RegisterData } from '../hooks/useAuth';
import { User, Mail, Lock, GraduationCap, CheckCircle, Eye, EyeOff } from 'lucide-react';

const LEVELS = ['1ère année', '2ème année', '3ème année', '4ème année', '5ème année'];

const TERMS_TEXT = `TERMES ET CONDITIONS D'UTILISATION — IHEC Connect\n\n1. ACCÈS À LA PLATEFORME\nL'accès est réservé exclusivement aux étudiants régulièrement inscrits à l'IHEC, Université de Carthage. L'email doit être au format : prenom.nom.annee@ihec.ucar.tn.\n\n2. UTILISATION ACCEPTABLE\nVous vous engagez à utiliser la plateforme à des fins pédagogiques uniquement, à respecter les autres utilisateurs et à ne pas partager de contenu inapproprié ou illégal.\n\n3. RÔLE DE TUTEUR\nTout étudiant peut soumettre une demande pour devenir tuteur. L'approbation est conditionnée à la validation par l'administration. Le rôle peut être révoqué en cas de manquement.\n\n4. DONNÉES PERSONNELLES\nVos données sont utilisées uniquement dans le cadre de la plateforme IHEC Connect et ne seront pas partagées avec des tiers sans votre consentement.\n\n5. RESPONSABILITÉ\nL'administration décline toute responsabilité pour le contenu publié par les utilisateurs. Chaque utilisateur est responsable de ses publications.\n\n6. MODIFICATION DES CONDITIONS\nCes conditions peuvent être modifiées. Les utilisateurs seront notifiés par email en cas de changement majeur.\n\nEn acceptant, vous confirmez avoir lu et accepté l'intégralité des termes.`;

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

function useRecaptcha(containerId: string, onVerify: (token: string) => void) {
  const widgetIdRef = useRef<number | null>(null);
  useEffect(() => {
    const render = () => {
      if (!window.grecaptcha || !document.getElementById(containerId)) return;
      if (widgetIdRef.current !== null) return;
      widgetIdRef.current = window.grecaptcha.render(containerId, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (token: string) => onVerify(token),
        'expired-callback': () => onVerify(''),
        'error-callback': () => onVerify(''),
        theme: 'light', size: 'normal',
      });
    };

    if (window.grecaptcha?.render) {
      // grecaptcha already loaded — defer one frame so the DOM element is mounted
      requestAnimationFrame(render);
    } else {
      // Use a page-specific callback name to avoid collisions with LoginPage
      window.onRecaptchaLoadRegister = render;
      if (!document.getElementById('recaptcha-script')) {
        const script = document.createElement('script');
        script.id = 'recaptcha-script';
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadRegister&render=explicit';
        script.async = true; script.defer = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
        try { window.grecaptcha.reset(widgetIdRef.current); } catch {}
        widgetIdRef.current = null;
      }
      // Clean up the global callback to avoid stale references
      delete window.onRecaptchaLoadRegister;
    };
  }, [containerId]);
}

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)            score++;
  if (pw.length >= 12)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: '',            color: '#e4e3f0' },
    { label: 'Très faible', color: '#e85d4a' },
    { label: 'Faible',      color: '#f0a030' },
    { label: 'Moyen',       color: '#f0d000' },
    { label: 'Fort',        color: '#4a9e6e' },
    { label: 'Très fort',   color: '#1a6a3a' },
  ];
  return { score, ...map[score] };
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  // 2 steps only: 1 = Identité, 2 = Conditions (submit happens here)
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<RegisterData & { confirmPassword: string }>({
    name: '', email: '', password: '', confirmPassword: '',
    level: '1ère année', acceptedTerms: false,
  });
  const [showPw, setShowPw]           = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [showTerms, setShowTerms]     = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [emailHint, setEmailHint]     = useState('');

  useRecaptcha('recaptcha-container', setRecaptchaToken);

  const pwStrength     = getPasswordStrength(form.password);
  const passwordsMatch = form.confirmPassword.length === 0 || form.password === form.confirmPassword;

  const iStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', border: '1px solid #e4e3f0', background: 'white', marginBottom: '14px' } as const;
  const inp    = { border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', flex: 1, fontFamily: 'DM Sans', color: '#2d2b55' } as const;

  const handleEmailChange = (val: string) => {
    setForm({ ...form, email: val });
    if (val.includes('@') && !val.toLowerCase().endsWith('@ihec.ucar.tn'))
      setEmailHint('Format requis : prenom.nom.annee@ihec.ucar.tn');
    else setEmailHint('');
  };

  const handleStep1 = () => {
    setError('');
    if (!form.name.trim())                      { setError('Veuillez saisir votre nom complet.'); return; }
    if (!validateIhecEmail(form.email))          { setError('Email IHEC invalide. Format : prenom.nom.annee@ihec.ucar.tn'); return; }
    if (form.password.length < 8)               { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    if (!/[A-Z]/.test(form.password))           { setError('Le mot de passe doit contenir au moins une majuscule.'); return; }
    if (!/\d/.test(form.password))              { setError('Le mot de passe doit contenir au moins un chiffre.'); return; }
    if (form.password !== form.confirmPassword)  { setError('Les mots de passe ne correspondent pas.'); return; }
    if (!recaptchaToken)                         { setError('Veuillez compléter la vérification reCAPTCHA.'); return; }
    setStep(2);
  };

  // Step 2: accept terms → submit directly (no recap step)
  const handleSubmit = async () => {
    setError('');
    if (!form.acceptedTerms) { setError("Vous devez accepter les conditions d'utilisation."); return; }
    setLoading(true);
    const result = await register({ ...form, recaptchaToken });
    setLoading(false);
    if (result.ok) {
      navigate('/verify-email?email=' + encodeURIComponent(form.email));
    } else {
      setError(result.error || "Erreur lors de l'inscription.");
      setStep(1);
    }
  };

  const steps = [
    { label: 'Identité', num: 1 },
    { label: 'Conditions', num: 2 },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0eff4', padding: '24px' }}>

      {/* Terms modal */}
      {showTerms && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', maxWidth: '560px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '18px', color: '#2d2b55', marginBottom: '16px' }}>Termes et Conditions</h3>
            <div style={{ flex: 1, overflowY: 'auto', fontSize: '13px', color: '#4a4a6a', lineHeight: 1.8, whiteSpace: 'pre-wrap', border: '1px solid #e4e3f0', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>{TERMS_TEXT}</div>
            <button onClick={() => setShowTerms(false)} style={{ padding: '12px', borderRadius: '12px', border: 'none', background: '#7c6fcd', color: 'white', fontFamily: 'Nunito', fontWeight: 700, cursor: 'pointer' }}>Fermer</button>
          </div>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '490px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c6fcd, #6b9bd2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '17px', color: '#2d2b55' }}>IHEC Connect</span>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #e4e3f0', boxShadow: '0 4px 16px rgba(45,43,85,0.08)' }}>
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '22px', color: '#2d2b55', marginBottom: '4px' }}>Créer un compte</h2>
          <p style={{ fontSize: '13px', color: '#6e6d8a', marginBottom: '20px' }}>Réservé aux étudiants IHEC Carthage</p>

          {/* Stepper — 2 étapes */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '28px', alignItems: 'center' }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? '1' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: step > s.num ? '#4a9e6e' : step === s.num ? '#7c6fcd' : '#e4e3f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700,
                    color: step >= s.num ? 'white' : '#a8a7c0', flexShrink: 0,
                  }}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span style={{ fontSize: '11px', color: step === s.num ? '#7c6fcd' : '#a8a7c0', fontWeight: step === s.num ? 700 : 400, whiteSpace: 'nowrap' }}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: '1px', background: step > s.num ? '#4a9e6e' : '#e4e3f0', margin: '0 8px' }} />}
              </div>
            ))}
          </div>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#fff0f0', border: '1px solid #fdd', fontSize: '13px', color: '#c0392b', marginBottom: '18px' }}>
              {error}
            </div>
          )}

          {/* ── STEP 1 : Identité ── */}
          {step === 1 && (
            <div>
              <div style={iStyle}>
                <User size={16} color="#a8a7c0" />
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nom complet" style={inp} />
              </div>

              <div>
                <div style={{ ...iStyle, borderColor: emailHint ? '#f0a030' : '#e4e3f0', marginBottom: emailHint ? '4px' : '14px' }}>
                  <Mail size={16} color="#a8a7c0" />
                  <input type="email" value={form.email} onChange={e => handleEmailChange(e.target.value)} placeholder="prenom.nom.annee@ihec.ucar.tn" style={inp} />
                </div>
                {emailHint && <p style={{ fontSize: '12px', color: '#f0a030', marginBottom: '14px' }}>{emailHint}</p>}
              </div>

              <div style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', border: '1px solid #e4e3f0', background: 'white' }}>
                  <Lock size={16} color="#a8a7c0" />
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Mot de passe (min. 8 car., 1 maj., 1 chiffre)" style={inp} />
                  <button onClick={() => setShowPw(!showPw)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex' }}>
                    {showPw ? <EyeOff size={15} color="#a8a7c0" /> : <Eye size={15} color="#a8a7c0" />}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div style={{ marginTop: '6px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= pwStrength.score ? pwStrength.color : '#e4e3f0', transition: 'background 0.3s' }} />
                      ))}
                    </div>
                    {pwStrength.label && <span style={{ fontSize: '11px', color: pwStrength.color, fontWeight: 600 }}>{pwStrength.label}</span>}
                  </div>
                )}
              </div>

              <div style={{ ...iStyle, borderColor: !passwordsMatch && form.confirmPassword ? '#e85d4a' : '#e4e3f0', marginBottom: '18px' }}>
                <Lock size={16} color={!passwordsMatch && form.confirmPassword ? '#e85d4a' : '#a8a7c0'} />
                <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Confirmer le mot de passe" style={{ ...inp, color: !passwordsMatch && form.confirmPassword ? '#e85d4a' : '#2d2b55' }} />
                <button onClick={() => setShowConfirm(!showConfirm)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  {showConfirm ? <EyeOff size={15} color="#a8a7c0" /> : <Eye size={15} color="#a8a7c0" />}
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6e6d8a', display: 'block', marginBottom: '7px' }}>Niveau académique</label>
                <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #e4e3f0', background: 'white', fontSize: '14px', fontFamily: 'DM Sans', outline: 'none', color: '#2d2b55' }}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div id="recaptcha-container" style={{ transform: 'scale(0.97)', transformOrigin: '0 0' }} />
                {!recaptchaToken && (
                  <p style={{ fontSize: '11px', color: '#a8a7c0', marginTop: '6px' }}>
                    Veuillez compléter la vérification reCAPTCHA pour continuer.
                  </p>
                )}
              </div>

              <button onClick={handleStep1} style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: '#7c6fcd', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>
                Continuer →
              </button>
            </div>
          )}

          {/* ── STEP 2 : Conditions + soumission directe ── */}
          {step === 2 && (
            <div>
              <div style={{ background: '#f8f7ff', border: '1px solid #e4e3f0', borderRadius: '14px', padding: '16px', marginBottom: '20px', maxHeight: '260px', overflowY: 'auto' }}>
                <div style={{ fontSize: '13px', color: '#4a4a6a', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{TERMS_TEXT}</div>
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '20px' }}>
                <div
                  onClick={() => setForm(f => ({ ...f, acceptedTerms: !f.acceptedTerms }))}
                  style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${form.acceptedTerms ? '#7c6fcd' : '#e4e3f0'}`, background: form.acceptedTerms ? '#7c6fcd' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px', cursor: 'pointer' }}>
                  {form.acceptedTerms && <span style={{ color: 'white', fontSize: '13px', fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: '13px', color: '#4a4a6a', lineHeight: 1.6 }}>
                  J'ai lu et j'accepte les{' '}
                  <span onClick={() => setShowTerms(true)} style={{ color: '#7c6fcd', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>termes et conditions</span> d'IHEC Connect.
                </span>
              </label>

              <div style={{ background: '#fff8e8', border: '1px solid #f0d888', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px', fontSize: '13px', color: '#7a5a10', lineHeight: 1.6 }}>
                📧 Un code de vérification sera envoyé à <strong>{form.email}</strong>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { setError(''); setStep(1); }} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e4e3f0', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#6e6d8a' }}>← Retour</button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.acceptedTerms}
                  style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: form.acceptedTerms ? '#7c6fcd' : '#e4e3f0', color: form.acceptedTerms ? 'white' : '#a8a7c0', fontSize: '14px', fontWeight: 700, cursor: !form.acceptedTerms || loading ? 'not-allowed' : 'pointer', fontFamily: 'Nunito', opacity: loading ? 0.75 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? 'Création…' : <><CheckCircle size={16} /> Créer mon compte</>}
                </button>
              </div>
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6e6d8a', marginTop: '20px' }}>
            Déjà un compte ? <Link to="/login" style={{ color: '#7c6fcd', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}