import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, GraduationCap } from 'lucide-react';

export function VerifyEmailPage() {
  const { login, verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (code.length !== 6) { setError('Le code doit contenir 6 chiffres.'); return; }
    setLoading(true); setError('');
    // First we need to "log in" the user to get state, then verify
    // Since user is not yet logged in, we do a special flow:
    // We'll store the verification directly in localStorage then navigate to login
    const stored = localStorage.getItem(`ihec_verify_${email}`);
    if (stored === code || code === '123456') {
      const allUsersStr = localStorage.getItem('ihec_all_users');
      const allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];
      const idx = allUsers.findIndex((u: any) => u.email === email);
      if (idx !== -1) {
        allUsers[idx].emailVerified = true;
        localStorage.setItem('ihec_all_users', JSON.stringify(allUsers));
        setLoading(false);
        navigate('/login?verified=1');
        return;
      }
    }
    setLoading(false);
    setError('Code incorrect. Veuillez réessayer.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0eff4', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c6fcd, #6b9bd2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '17px', color: '#2d2b55' }}>IHEC Connect</span>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #e4e3f0', boxShadow: '0 4px 16px rgba(45,43,85,0.08)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: '#e8d0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Mail size={28} color="#7c6fcd" strokeWidth={1.5} />
          </div>

          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '22px', color: '#2d2b55', marginBottom: '8px' }}>Vérifiez votre email</h2>
          <p style={{ fontSize: '13px', color: '#6e6d8a', marginBottom: '6px' }}>
            Un code de vérification a été envoyé à
          </p>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#7c6fcd', marginBottom: '28px' }}>{email || 'votre adresse IHEC'}</p>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#fff0f0', border: '1px solid #fdd', fontSize: '13px', color: '#c0392b', marginBottom: '18px', textAlign: 'left' }}>
              {error}
            </div>
          )}

          <input
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Entrez le code à 6 chiffres"
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e4e3f0', fontSize: '20px', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '8px', outline: 'none', background: 'white', color: '#2d2b55', boxSizing: 'border-box', marginBottom: '16px' }}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
          />

          <div style={{ background: '#fff8e8', border: '1px solid #f0d888', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', fontSize: '12px', color: '#7a5a10' }}>
            Mode démo : utilisez le code <strong>123456</strong>
          </div>

          <button onClick={handleVerify} disabled={loading || code.length < 6} style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: code.length === 6 ? '#7c6fcd' : '#e4e3f0', color: code.length === 6 ? 'white' : '#a8a7c0', fontSize: '15px', fontWeight: 700, cursor: loading || code.length < 6 ? 'not-allowed' : 'pointer', fontFamily: 'Nunito', opacity: loading ? 0.75 : 1 }}>
            {loading ? 'Vérification…' : 'Confirmer l\'identité'}
          </button>
        </div>
      </div>
    </div>
  );
}
