import { Member } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import InfoRow from '@/components/shared/InfoRow';
import styles from './MemberDetailModal.module.css';

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: Member;
}

export default function MemberDetailModal({ isOpen, onClose, member }: MemberDetailModalProps) {
  if (!isOpen || !member) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Member Details</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>{member.name.charAt(0)}</div>
            <div>
              <div className={styles.name}>{member.name}</div>
              <Badge variant={member.status === 'Active' ? 'success' : 'danger'}>{member.status}</Badge>
            </div>
          </div>
          <div className={styles.detailsGrid}>
            <InfoRow label="Voice" value={member.voice} />
            <InfoRow label="Phone" value={member.phone} />
            <InfoRow label="Join Date" value={member.join_date} />
            <InfoRow label="Status" value={member.status} />
          </div>
        </div>
        <div className={styles.footer}>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}