'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/shared/Button';
import SectionCard from '@/components/shared/SectionCard';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  role: 'admin' | 'secretary' | 'voiceLeader';
}

export default function QuickActions({ role }: QuickActionsProps) {
  const router = useRouter();

  const actions = {
    admin: [
      { label: '➕ Add Member',      onClick: () => router.push('/members') },
      { label: '📝 Add Song',        onClick: () => router.push('/songs') },
      { label: '📊 View Attendance', onClick: () => router.push('/attendance') },
      { label: '📄 Write Minutes',   onClick: () => router.push('/minutes') },
      { label: '👥 Manage Users',    onClick: () => router.push('/users') },
    ],
    secretary: [
      { label: '📝 Add Song',      onClick: () => router.push('/songs') },
      { label: '📄 Write Minutes', onClick: () => router.push('/minutes') },
      { label: '🎵 Manage Songs',  onClick: () => router.push('/songs') },
    ],
    voiceLeader: [
      { label: '👤 Add Member',     onClick: () => router.push('/members') },
      { label: '✅ Mark Attendance', onClick: () => router.push('/attendance') },
      { label: '🎵 View Songs',     onClick: () => router.push('/songs') },
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