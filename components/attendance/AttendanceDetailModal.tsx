import { AttendanceRecord } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import InfoRow from '@/components/shared/InfoRow';
import styles from './AttendanceDetailModal.module.css';

interface AttendanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: AttendanceRecord;
}

const statusVariant = {
  present: 'success',
  absent: 'danger',
  excused: 'warning',
  late: 'info',
} as const;

export default function AttendanceDetailModal({ isOpen, onClose, record }: AttendanceDetailModalProps) {
  if (!isOpen || !record) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Attendance Details</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          <InfoRow label="Member" value={record.member_name} />
          <InfoRow label="Voice" value={record.member_voice} />
          <InfoRow label="Date" value={record.date} />
          <InfoRow label="Event Type" value={record.event_type} />
          <InfoRow label="Status" value={<Badge variant={statusVariant[record.status]}>{record.status}</Badge>} />
          <InfoRow label="Marked By" value={record.marked_by_name || '—'} />
        </div>
        <div className={styles.footer}>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}