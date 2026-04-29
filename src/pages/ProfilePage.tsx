import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCourses } from '../hooks/useCourses';
import { User, Mail, GraduationCap, Edit2, Save, X, BookOpen, Award, Clock } from 'lucide-react';

const SUBJECTS = ['Computer Science', 'Engineering', 'Mathematics', 'Management', 'Economics', 'Finance', 'Accounting', 'Marketing'];

export function ProfilePage() {
  const { user, requestTutorRole, updateProfile } = useAuth();
  const { enrolledCourses, tutorGivenCourses } = useCourses();
  const isTutor = user?.tutorStatus === 'approved';
  const isPending = user?.tutorStatus === 'pending';
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', level: user?.level || '', subject: user?.subject || '', bio: user?.bio || '' });
  const [reqLoading, setReqLoading] = useState(false);
  const [reqSent, setReqSent] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const initials = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleSave = async () => {
    setSaveLoading(true);
    updateProfile({ name: form.name, level: form.level, subject: form.subject, bio: form.bio });
    await new Promise(r => setTimeout(r, 400));
    setSaveLoading(false);
    setEditing(false);
  };

  const handleRequestTutor = async () => {
    setReqLoading(true);
    await requestTutorRole();
    setReqLoading(false);
    setReqSent(true);
  };

  const inputStyle = { width: '100%', padding: '10px 13px', borderRadius: '11px', border: '1px solid #7c6fcd', fontSize: '14px', fontFamily: 'DM Sans', outline: 'none', background: 'white', color: '#2d2b55', boxSizing: 'border-box' as const };
  const displayStyle = { padding: '10px 13px', borderRadius: '11px', background: '#f0eff4', fontSize: '14px', color: '#2d2b55' };

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e4e3f0', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ background: isTutor ? 'linear-gradient(135deg, #e8d0f0 0%, #c8e8d4 100%)' : 'linear-gradient(135deg, #b8d4f0 0%, #c8e8d4 100%)', height: '110px' }} />
        <div style={{ padding: '0 30px 30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', marginTop: '-42px' }}>
            <div style={{ width: '76px', height: '76px', borderRadius: '18px', background: isTutor ? 'linear-gradient(135deg, #c8b0f0, #a890d8)' : 'linear-gradient(135deg, #7c6fcd, #6b9bd2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, color: 'white', fontFamily: 'Nunito', border: '4px solid white' }}>
              {initials}
            </div>
            <button onClick={() => { if (editing) { setForm({ name: user?.name || '', email: user?.email || '', level: user?.level || '', subject: user?.subject || '', bio: user?.bio || '' }); } setEditing(!editing); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 15px', borderRadius: '10px', border: '1px solid #e4e3f0', background: editing ? '#f0eff4' : 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#6e6d8a' }}>
              {editing ? <><X size={13} /> Annuler</> : <><Edit2 size={13} /> Modifier</>}
            </button>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '20px', marginBottom: '6px' }}>{form.name}</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#6e6d8a' }}>{form.level}</span>
              <span style={{ fontSize: '12px', color: '#a8a7c0' }}>·</span>
              <span style={{ padding: '2px 8px', borderRadius: '6px', background: isTutor ? 'rgba(74,158,110,0.12)' : 'rgba(107,155,210,0.12)', fontSize: '11px', fontWeight: 700, color: isTutor ? '#1a6a3a' : '#2a5a8a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isTutor ? <><GraduationCap size={10} /> Tuteur approuvé</> : 'Étudiant'}
              </span>
              {isPending && (
                <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'rgba(240,160,48,0.12)', fontSize: '11px', fontWeight: 700, color: '#7a5a10', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={10} /> Demande tuteur en attente
                </span>
              )}
              {user?.emailVerified && (
                <span style={{ padding: '2px 8px', borderRadius: '6px', background: '#efffef', fontSize: '11px', fontWeight: 700, color: '#1a6a3a' }}>✓ Email vérifié</span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
            {(isTutor ? [
              { label: 'Cours dispensés', value: String(tutorGivenCourses.length), color: '#e8d0f0', dark: '#4a1a70' },
              { label: 'Cours suivis', value: String(enrolledCourses.length), color: '#b8d4f0', dark: '#1a4a70' },
              { label: 'Étudiants', value: String(tutorGivenCourses.reduce((a, c) => a + c.enrolledCount, 0)), color: '#c8e8d4', dark: '#1a5a3a' },
            ] : [
              { label: 'Inscrit à', value: String(enrolledCourses.length), color: '#b8d4f0', dark: '#1a4a70' },
              { label: 'Heures', value: '36h', color: '#c8e8d4', dark: '#1a5a3a' },
              { label: 'Progression', value: '87%', color: '#f0d8c8', dark: '#703010' },
            ]).map(s => (
              <div key={s.label} style={{ background: s.color, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '20px', color: s.dark }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: s.dark, opacity: 0.7 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Fields */}
          {[
            { icon: <User size={15} />, label: 'Nom complet', key: 'name' },
            { icon: <Mail size={15} />, label: 'Email IHEC', key: 'email', disabled: true },
            { icon: <GraduationCap size={15} />, label: 'Niveau académique', key: 'level' },
            ...(isTutor ? [{ icon: <BookOpen size={15} />, label: 'Matière principale', key: 'subject' }] : []),
          ].map(field => (
            <div key={field.key} style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#a8a7c0', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span style={{ color: '#7c6fcd' }}>{field.icon}</span> {field.label}
              </label>
              {editing && !field.disabled ? (
                <input value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} style={inputStyle} />
              ) : (
                <div style={displayStyle}>{(form as any)[field.key] || '—'}</div>
              )}
            </div>
          ))}

          {/* Bio */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#a8a7c0', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <span style={{ color: '#7c6fcd' }}><BookOpen size={15} /></span> Biographie
            </label>
            {editing ? (
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Parlez de vous…" style={{ ...inputStyle, resize: 'vertical' }} />
            ) : (
              <div style={{ ...displayStyle, minHeight: '60px' }}>{form.bio || '—'}</div>
            )}
          </div>

          {editing && (
            <button onClick={handleSave} disabled={saveLoading} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#7c6fcd', color: 'white', fontSize: '14px', fontWeight: 700, cursor: saveLoading ? 'not-allowed' : 'pointer', fontFamily: 'Nunito', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', marginTop: '8px', opacity: saveLoading ? 0.75 : 1 }}>
              <Save size={14} /> {saveLoading ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          )}
        </div>
      </div>

      {/* Tutor request section */}
      {!isTutor && !isPending && (
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e4e3f0', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#e8d0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={24} color="#7c6fcd" strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '16px', color: '#2d2b55', marginBottom: '6px' }}>Devenir tuteur</h3>
              <p style={{ fontSize: '13px', color: '#6e6d8a', lineHeight: 1.6, marginBottom: '16px' }}>
                Partagez vos connaissances avec vos camarades. Votre demande sera examinée et approuvée par l'administration de la plateforme.
              </p>
              {reqSent ? (
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#efffef', border: '1px solid #9de', fontSize: '13px', color: '#1a6a3a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ✓ Demande envoyée ! L'administration vous contactera par email.
                </div>
              ) : (
                <button onClick={handleRequestTutor} disabled={reqLoading} style={{ padding: '11px 22px', borderRadius: '11px', border: 'none', background: '#7c6fcd', color: 'white', fontSize: '13px', fontWeight: 700, cursor: reqLoading ? 'not-allowed' : 'pointer', fontFamily: 'Nunito', opacity: reqLoading ? 0.75 : 1 }}>
                  {reqLoading ? 'Envoi…' : 'Soumettre une demande'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isPending && (
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f0d888', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Clock size={20} color="#f0a030" />
            <div>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '14px', color: '#7a5a10', marginBottom: '4px' }}>Demande tuteur en attente</h3>
              <p style={{ fontSize: '12px', color: '#7a5a10', opacity: 0.8 }}>Votre demande est en cours d'examen par l'administration. Vous serez notifié par email.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
