import Button from '@/components/shared/Button';
import SectionCard from '@/components/shared/SectionCard';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  role: 'admin' | 'secretary' | 'voiceLeader';
}

export default function QuickActions({ role }: QuickActionsProps) {
  const actions = {
    admin: [
      { label: '➕ Add Member', onClick: () => alert('Add member form (demo)') },
      { label: '📝 Add Song', onClick: () => alert('Add song form (demo)') },
      { label: '📊 View Attendance', onClick: () => alert('View attendance (demo)') },
      { label: '📄 Write Minutes', onClick: () => alert('Write minutes (demo)') },
      { label: '👥 Manage Users', onClick: () => alert('Manage users (demo)') },
    ],
    secretary: [
      { label: '📝 Add Song', onClick: () => alert('Add song form (demo)') },
      { label: '📄 Write Minutes', onClick: () => alert('Write minutes (demo)') },
      { label: '🎵 Manage Songs', onClick: () => alert('Manage songs (demo)') },
    ],
    voiceLeader: [
      { label: '👤 Add Member', onClick: () => alert('Add member form (demo)') },
      { label: '✅ Mark Attendance', onClick: () => alert('Mark attendance (demo)') },
      { label: '🎵 View Songs', onClick: () => alert('View songs (demo)') },
    ],
  };

  return (
    <SectionCard title="Quick Actions" subtitle={`As ${role}`}>
      <div className={styles.actionsGrid}>
        {actions[role].map((action, idx) => (
          <Button key={idx} variant="outline" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
      </div>
    </SectionCard>
  );
}