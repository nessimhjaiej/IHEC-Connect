import { MessageSquare, Users, Settings, Construction } from 'lucide-react';

function PlaceholderPage({ title, icon, description }: { title: string; icon: React.ReactNode; description: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', textAlign: 'center' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
        {icon}
      </div>
      <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '22px', marginBottom: '10px' }}>{title}</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '340px', lineHeight: 1.6 }}>{description}</p>
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <Construction size={13} /> Coming soon — connectez votre backend pour activer cette fonctionnalité
      </div>
    </div>
  );
}

export function MessagesPage() {
  return <PlaceholderPage title="Messages" icon={<MessageSquare size={28} color="var(--accent-purple)" strokeWidth={1.5} />} description="Messagerie en temps réel avec vos pairs et tuteurs. Connectez votre backend API." />;
}

export function ParticipantsPage() {
  return <PlaceholderPage title="Participants" icon={<Users size={28} color="var(--accent-blue)" strokeWidth={1.5} />} description="Parcourez tous les participants, consultez leurs profils et connectez-vous avec vos camarades." />;
}

export function SettingsPage() {
  return <PlaceholderPage title="Paramètres" icon={<Settings size={28} color="var(--text-secondary)" strokeWidth={1.5} />} description="Gérez vos préférences, notifications et paramètres de confidentialité." />;
}
