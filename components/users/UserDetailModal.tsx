import { User } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import InfoRow from '@/components/shared/InfoRow';
import styles from './UserDetailModal.module.css';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
}

const roleVariant = {
  'Admin': 'danger',
  'Secretary': 'info',
  'Voice Leader': 'success',
} as const;

export default function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleString();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>User Details</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          <InfoRow label="Full Name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Role" value={<Badge variant={roleVariant[user.role] ?? 'default'}>{user.role}</Badge>} />
          <InfoRow label="Assigned Voice" value={user.voice || 'Not applicable'} />
          <InfoRow label="Status" value={<Badge variant={user.status === 'Active' ? 'success' : 'danger'}>{user.status}</Badge>} />
          <InfoRow label="Created" value={formatDate(user.created_at)} />
        </div>
        <div className={styles.footer}>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}