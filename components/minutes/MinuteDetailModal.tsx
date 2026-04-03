import { Minute } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import InfoRow from '@/components/shared/InfoRow';
import styles from './MinuteDetailModal.module.css';

interface MinuteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  minute?: Minute;
}

export default function MinuteDetailModal({ isOpen, onClose, minute }: MinuteDetailModalProps) {
  if (!isOpen || !minute) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleString();
  };

  const handleDownload = () => {
    if (!minute.attachment_url) return;
    const a = document.createElement('a');
    a.href = minute.attachment_url;
    a.download = minute.attachment_name || `${minute.title}.pdf`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Minutes Details</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          <InfoRow label="Title" value={minute.title} />
          <InfoRow label="Meeting Date" value={minute.meeting_date} />
          <InfoRow label="Recorded By" value={minute.recorded_by_name || '—'} />
          <InfoRow label="Created" value={formatDate(minute.created_at)} />
          <InfoRow label="Last Updated" value={formatDate(minute.updated_at)} />
          <InfoRow label="Attachment" value={
            minute.attachment_present
              ? <Badge variant="success">📎 {minute.attachment_name || 'Attached'}</Badge>
              : <Badge variant="default">No attachment</Badge>
          } />
          {minute.content && (
            <div className={styles.contentSection}>
              <label>Meeting Content</label>
              <div className={styles.contentBody}>{minute.content}</div>
            </div>
          )}
        </div>
        <div className={styles.footer}>
          {minute.attachment_present && (
            <Button variant="primary" onClick={handleDownload}>
              ⬇ Download Attachment
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}