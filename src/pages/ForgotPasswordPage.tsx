import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, GraduationCap, CheckCircle } from 'lucide-react';
import { validateIhecEmail } from '../hooks/useAuth';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) { setError("Veuillez saisir votre email."); return; }
    if (!validateIhecEmail(email)) { setError("Format requis : prenom.nom.annee@ihec.ucar.tn"); return; }
    setLoading(true); setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Toujours afficher succès (anti-énumération)
      setSent(true);
    } catch {
      // En mode demo, on affiche quand même le succès
      setSent(true);
    } finally {
      setLoading(false);
    }
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

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #e4e3f0', boxShadow: '0 4px 16px rgba(45,43,85,0.08)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: '#efffef', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px solid #4a9e6e' }}>
                <CheckCircle size={28} color="#4a9e6e" />
              </div>
              <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '20px', color: '#2d2b55', marginBottom: '12px' }}>Email envoyé !</h2>
              <p style={{ fontSize: '14px', color: '#6e6d8a', lineHeight: 1.7, marginBottom: '8px' }}>
                Si un compte IHEC existe avec l'adresse <strong style={{ color: '#7c6fcd' }}>{email}</strong>, vous recevrez un lien de réinitialisation.
              </p>
              <p style={{ fontSize: '13px', color: '#a8a7c0', marginBottom: '28px' }}>
                Vérifiez aussi votre dossier spam. Le lien expire dans <strong>30 minutes</strong>.
              </p>
              <Link to="/login" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '12px', background: '#7c6fcd', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 700, fontFamily: 'Nunito' }}>
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#e8d0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Mail size={24} color="#7c6fcd" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '22px', color: '#2d2b55', marginBottom: '8px' }}>Mot de passe oublié ?</h2>
              <p style={{ fontSize: '14px', color: '#6e6d8a', lineHeight: 1.6, marginBottom: '28px' }}>
                Entrez votre adresse email IHEC. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              {error && <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#fff0f0', border: '1px solid #fdd', fontSize: '13px', color: '#c0392b', marginBottom: '18px' }}>{error}</div>}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6e6d8a', display: 'block', marginBottom: '7px' }}>Email IHEC</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', border: '1px solid #e4e3f0', background: 'white' }}>
                  <Mail size={16} color="#a8a7c0" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="prenom.nom.annee@ihec.ucar.tn" style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', flex: 1, fontFamily: 'DM Sans', color: '#2d2b55' }} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                </div>
              </div>

              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: '#7c6fcd', color: 'white', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Nunito', opacity: loading ? 0.75 : 1 }}>
                {loading ? 'Envoi en cours…' : 'Envoyer le lien de réinitialisation'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#6e6d8a', marginTop: '20px' }}>
                <Link to="/login" style={{ color: '#7c6fcd', fontWeight: 600, textDecoration: 'none' }}>← Retour à la connexion</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
