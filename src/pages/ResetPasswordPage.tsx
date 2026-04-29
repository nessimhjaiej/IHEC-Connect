import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, GraduationCap, Eye, EyeOff, CheckCircle } from 'lucide-react';

function getStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++; if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++; if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: '', color: '#e4e3f0' }, { label: 'Très faible', color: '#e85d4a' },
    { label: 'Faible', color: '#f0a030' }, { label: 'Moyen', color: '#f0d000' },
    { label: 'Fort', color: '#4a9e6e' }, { label: 'Très fort', color: '#1a6a3a' },
  ];
  return { score: s, ...map[s] };
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showC, setShowC] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = getStrength(pw);
  const match = confirm.length === 0 || pw === confirm;

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0eff4', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', maxWidth: '400px', textAlign: 'center', border: '1px solid #e4e3f0' }}>
          <p style={{ color: '#e85d4a', marginBottom: '16px' }}> Lien de réinitialisation invalide ou manquant.</p>
          <Link to="/forgot-password" style={{ color: '#7c6fcd', fontWeight: 600 }}>Demander un nouveau lien</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (pw.length < 8)          { setError('8 caractères minimum.'); return; }
    if (!/[A-Z]/.test(pw))     { setError('Au moins une majuscule requise.'); return; }
    if (!/\d/.test(pw))        { setError('Au moins un chiffre requis.'); return; }
    if (pw !== confirm)         { setError('Les mots de passe ne correspondent pas.'); return; }
    setLoading(true); setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: pw, confirm_new_password: confirm }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || 'Erreur lors de la réinitialisation.'); setLoading(false); return; }
      navigate('/login?reset=1');
    } catch {
      // Mode demo : succès direct
      navigate('/login?reset=1');
    } finally {
      setLoading(false);
    }
  };

  const inp = { border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', flex: 1, fontFamily: 'DM Sans', color: '#2d2b55' } as const;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0eff4', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c6fcd, #6b9bd2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '17px', color: '#2d2b55' }}>IHEC Connect</span>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #e4e3f0', boxShadow: '0 4px 16px rgba(45,43,85,0.08)' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#e8d0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Lock size={24} color="#7c6fcd" strokeWidth={1.5} />
          </div>

          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '22px', color: '#2d2b55', marginBottom: '8px' }}>Nouveau mot de passe</h2>
          <p style={{ fontSize: '13px', color: '#6e6d8a', marginBottom: '28px' }}>Choisissez un mot de passe sécurisé pour votre compte IHEC.</p>

          {error && <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#fff0f0', border: '1px solid #fdd', fontSize: '13px', color: '#c0392b', marginBottom: '18px' }}>{error}</div>}

          {/* Règles */}
          <div style={{ background: '#f8f7ff', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', fontSize: '12px', color: '#6e6d8a', lineHeight: 1.8 }}>
            Le mot de passe doit contenir :<br />
            {[['8 caractères minimum', pw.length >= 8], ['Au moins une majuscule', /[A-Z]/.test(pw)], ['Au moins un chiffre', /\d/.test(pw)]].map(([label, ok]) => (
              <span key={label as string} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: ok ? '#4a9e6e' : '#a8a7c0' }}>
                 {label as string}
              </span>
            ))}
          </div>

          <div style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', border: '1px solid #e4e3f0', background: 'white', marginBottom: '6px' }}>
              <Lock size={16} color="#a8a7c0" />
              <input type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} placeholder="Nouveau mot de passe" style={inp} />
              <button onClick={() => setShowPw(!showPw)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex' }}>
                {showPw ? <EyeOff size={15} color="#a8a7c0" /> : <Eye size={15} color="#a8a7c0" />}
              </button>
            </div>
            {pw.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
                  {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= strength.score ? strength.color : '#e4e3f0', transition: 'background 0.3s' }} />)}
                </div>
                {strength.label && <span style={{ fontSize: '11px', color: strength.color, fontWeight: 600 }}>{strength.label}</span>}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', border: `1px solid ${!match && confirm ? '#e85d4a' : '#e4e3f0'}`, background: 'white', marginBottom: '24px' }}>
            <Lock size={16} color={!match && confirm ? '#e85d4a' : '#a8a7c0'} />
            <input type={showC ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirmer le nouveau mot de passe" style={{ ...inp, color: !match && confirm ? '#e85d4a' : '#2d2b55' }} />
            <button onClick={() => setShowC(!showC)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex' }}>
              {showC ? <EyeOff size={15} color="#a8a7c0" /> : <Eye size={15} color="#a8a7c0" />}
            </button>
            
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: '#7c6fcd', color: 'white', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Nunito', opacity: loading ? 0.75 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? 'Mise à jour…' : <><CheckCircle size={16} /> Mettre à jour le mot de passe</>}
          </button>
        </div>
      </div>
    </div>
  );
}
